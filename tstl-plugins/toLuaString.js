"use strict";

// TypeScriptToLua plugin: transforms toLua(() => { ... }) into a Lua string literal containing a script chunk.
//
// This is used to embed generated Lua into inmation properties like AdvancedLuaScript.
//
// Why a plugin?
// - At runtime you can't reliably obtain Lua source from a function.
// - We want a *string* at runtime, but authored as TypeScript for type checking.

const ts = require("typescript");
const tstl = require("typescript-to-lua");

function diagForNode(context, node, messageText) {
    context.diagnostics.push({
        file: context.sourceFile,
        start: node.getStart(context.sourceFile, false),
        length: node.getWidth(context.sourceFile),
        messageText,
        category: ts.DiagnosticCategory.Error,
        code: 8999,
    });
}

function isToLuaIdentifier(expr) {
    return ts.isIdentifier(expr) && expr.text === "toLua";
}

function isMethodCallNamed(callExpr, name) {
    return (
        ts.isCallExpression(callExpr) &&
        ts.isPropertyAccessExpression(callExpr.expression) &&
        callExpr.expression.name.text === name
    );
}

function stripParens(expr) {
    while (ts.isParenthesizedExpression(expr)) {
        expr = expr.expression;
    }
    return expr;
}

function getSingleReturnExpression(fn) {
    if (ts.isArrowFunction(fn) && !ts.isBlock(fn.body)) {
        return fn.body;
    }

    if (ts.isArrowFunction(fn) && ts.isBlock(fn.body)) {
        const st = fn.body.statements;
        if (st.length === 1 && ts.isReturnStatement(st[0]) && st[0].expression) {
            return st[0].expression;
        }
        return undefined;
    }

    if (ts.isFunctionExpression(fn)) {
        const st = fn.body.statements;
        if (st.length === 1 && ts.isReturnStatement(st[0]) && st[0].expression) {
            return st[0].expression;
        }
        return undefined;
    }

    return undefined;
}

function tryGetPropertyPath(expr, paramName) {
    expr = stripParens(expr);

    const parts = [];
    while (ts.isPropertyAccessExpression(expr)) {
        parts.unshift(expr.name.text);
        expr = stripParens(expr.expression);
    }

    if (ts.isIdentifier(expr) && expr.text === paramName) {
        return parts.length > 0 ? parts.join(".") : undefined;
    }

    return undefined;
}

function operatorToMethodName(opTokenKind) {
    switch (opTokenKind) {
        case ts.SyntaxKind.EqualsEqualsToken:
        case ts.SyntaxKind.EqualsEqualsEqualsToken:
            return "eq";
        case ts.SyntaxKind.ExclamationEqualsToken:
        case ts.SyntaxKind.ExclamationEqualsEqualsToken:
            return "ne";
        case ts.SyntaxKind.GreaterThanToken:
            return "gt";
        case ts.SyntaxKind.GreaterThanEqualsToken:
            return "gte";
        case ts.SyntaxKind.LessThanToken:
            return "lt";
        case ts.SyntaxKind.LessThanEqualsToken:
            return "lte";
        default:
            return undefined;
    }
}

function tryParseWherePredicate(fn) {
    if (!ts.isArrowFunction(fn) && !ts.isFunctionExpression(fn)) return undefined;
    if (fn.parameters.length !== 1) return undefined;
    const p = fn.parameters[0];
    if (!ts.isIdentifier(p.name)) return undefined;
    const paramName = p.name.text;

    const returned = getSingleReturnExpression(fn);
    if (!returned) return undefined;

    const expr = stripParens(returned);
    if (!ts.isBinaryExpression(expr)) return undefined;

    const opMethod = operatorToMethodName(expr.operatorToken.kind);
    if (!opMethod) return undefined;

    const leftPath = tryGetPropertyPath(expr.left, paramName);
    const rightPath = tryGetPropertyPath(expr.right, paramName);

    if (leftPath && !rightPath) {
        return { fieldPath: leftPath, opMethod, valueExpr: expr.right };
    }
    if (rightPath && !leftPath) {
        return { fieldPath: rightPath, opMethod, valueExpr: expr.left };
    }

    // Ambiguous or unsupported (both sides reference doc, or neither side does).
    return undefined;
}

function createMinimalEmitHost() {
    return {
        directoryExists: () => true,
        fileExists: () => true,
        getCurrentDirectory: () => process.cwd(),
        readFile: () => undefined,
        writeFile: () => { },
    };
}

module.exports = function toLuaStringPlugin() {
    return {
        visitors: {
            [ts.SyntaxKind.CallExpression]: (node, context) => {
                if (!ts.isCallExpression(node)) {
                    return context.superTransformExpression(node);
                }

                // LINQ-ish macro: obj.where(doc => doc.field OP value)
                // is compiled into obj.where("field").<op>(value)
                // Supported OP: ===, ==, !==, !=, >, >=, <, <=
                if (isMethodCallNamed(node, "where") && node.arguments.length === 1) {
                    const arg0 = node.arguments[0];
                    const parsed = tryParseWherePredicate(arg0);
                    if (parsed) {
                        const propAccess = node.expression; // PropertyAccessExpression
                        const prefix = context.transformExpression(propAccess.expression);
                        const whereId = tstl.createIdentifier("where", node);
                        const opId = tstl.createIdentifier(parsed.opMethod, node);
                        const whereCall = tstl.createMethodCallExpression(
                            prefix,
                            whereId,
                            [tstl.createStringLiteral(parsed.fieldPath, node)],
                            node
                        );
                        const valueLua = context.transformExpression(parsed.valueExpr);
                        return tstl.createMethodCallExpression(whereCall, opId, [valueLua], node);
                    }
                }

                const isToLuaCall = isToLuaIdentifier(node.expression);
                const isSetFuncCall = isMethodCallNamed(node, "setFunc");
                const isOnTriggerFuncCall = isMethodCallNamed(node, "onTriggerFunc");
                const isAddActionCall = isMethodCallNamed(node, "addAction");
                const isOnTriggerCall = isMethodCallNamed(node, "onTrigger");

                if (!isToLuaCall && !isSetFuncCall && !isOnTriggerFuncCall && !isAddActionCall && !isOnTriggerCall) {
                    return context.superTransformExpression(node);
                }

                // addAction() is allowed (creates an ActionItem with no script)
                if (isAddActionCall && node.arguments.length === 0) {
                    return context.superTransformExpression(node);
                }

                // For addAction, allow options as second argument: addAction(fn, options?)
                if (!isAddActionCall && node.arguments.length !== 1) {
                    diagForNode(
                        context,
                        node,
                        (isToLuaCall ? "toLua(fn)" : "setFunc(fn)/onTriggerFunc(fn)") + " expects exactly one argument"
                    );
                    return tstl.createStringLiteral("", node);
                }
                if (isAddActionCall && (node.arguments.length < 1 || node.arguments.length > 2)) {
                    diagForNode(context, node, "addAction(fn, options?) expects 0, 1, or 2 arguments");
                    return context.superTransformExpression(node);
                }

                const arg = node.arguments[0];
                // If not an inline function, fall back to default transformation.
                // This allows passing raw strings: setFunc("..."), onTrigger("..."), addAction("...")
                if (!ts.isArrowFunction(arg) && !ts.isFunctionExpression(arg)) {
                    if (isToLuaCall) {
                        diagForNode(context, arg, "toLua(fn) requires an inline function: () => { ... }");
                        return tstl.createStringLiteral("", node);
                    }
                    // For addAction, allow passing a string (or undefined) without transforming.
                    if (isAddActionCall) {
                        return context.superTransformExpression(node);
                    }
                    return context.superTransformExpression(node);
                }

                if (arg.parameters.length > 0) {
                    diagForNode(
                        context,
                        arg,
                        (isToLuaCall ? "toLua(fn)" : "setFunc(fn)/onTriggerFunc(fn)") +
                        " only supports zero-argument functions for script chunks"
                    );
                    return tstl.createStringLiteral("", node);
                }

                // Require a block body (script chunk). We avoid expression bodies to keep semantics obvious.
                if (ts.isArrowFunction(arg) && !ts.isBlock(arg.body)) {
                    diagForNode(
                        context,
                        arg,
                        (isToLuaCall ? "toLua" : "setFunc/onTriggerFunc") +
                        " does not support expression bodies; use a block body: () => { ... }"
                    );
                    return tstl.createStringLiteral("", node);
                }

                // Transform the function into Lua AST, then print ONLY its body statements as a chunk.
                const beforeFeatures = new Set(context.usedLuaLibFeatures);
                const luaFn = context.transformExpression(arg);

                // Best-effort: ensure we got a Lua function expression.
                if (!tstl.isFunctionExpression(luaFn)) {
                    diagForNode(context, arg, "toLua(fn) could not transform the function into a Lua function expression");
                    return tstl.createStringLiteral("", node);
                }

                // Detect (and undo) any new lualib feature usage introduced by transforming this chunk.
                const addedFeatures = [];
                for (const f of context.usedLuaLibFeatures) {
                    if (!beforeFeatures.has(f)) addedFeatures.push(f);
                }
                for (const f of addedFeatures) context.usedLuaLibFeatures.delete(f);

                if (addedFeatures.length > 0) {
                    diagForNode(
                        context,
                        arg,
                        "toLua(fn) generated code that requires TypeScriptToLua lualib helpers. " +
                        "Keep the chunk Lua-native (e.g., syslib calls, locals, simple control flow), " +
                        "and avoid arrays/classes/JS built-ins."
                    );
                    return tstl.createStringLiteral("", node);
                }

                const statements = luaFn.body.statements;
                const file = tstl.createFile(statements, new Set(), "", arg);

                const emitHost = createMinimalEmitHost();
                const printer = new tstl.LuaPrinter(emitHost, context.program, context.sourceFile.fileName);

                // Ensure we don't embed headers or lualib imports into the script chunk.
                printer.options.noHeader = true;
                printer.options.luaLibImport = "none";
                printer.options.sourceMapTraceback = false;

                const printed = printer.print(file).code;
                const chunk = printed.replace(/\s+$/, "");

                // toLua(fn) -> "<chunk>"
                if (isToLuaCall) {
                    return tstl.createStringLiteral(chunk, node);
                }

                // obj.addAction(fn, options?) -> obj.addAction("<chunk>", options?)
                if (isAddActionCall) {
                    const propAccess = node.expression; // PropertyAccessExpression
                    const prefix = context.transformExpression(propAccess.expression);
                    const methodId = tstl.createIdentifier("addAction", node);
                    const extraArgs = node.arguments.length === 2 ? [context.transformExpression(node.arguments[1])] : [];
                    return tstl.createMethodCallExpression(
                        prefix,
                        methodId,
                        [tstl.createStringLiteral(chunk, node), ...extraArgs],
                        node
                    );
                }

                // obj.onTrigger(fn) -> obj.onTrigger("<chunk>")
                if (isOnTriggerCall) {
                    const propAccess = node.expression; // PropertyAccessExpression
                    const prefix = context.transformExpression(propAccess.expression);
                    const methodId = tstl.createIdentifier("onTrigger", node);
                    return tstl.createMethodCallExpression(
                        prefix,
                        methodId,
                        [tstl.createStringLiteral(chunk, node)],
                        node
                    );
                }

                // obj.setFunc(fn) -> obj.setScript("<chunk>")
                // obj.onTriggerFunc(fn) -> obj.onTrigger("<chunk>")
                const propAccess = node.expression; // PropertyAccessExpression
                const prefix = context.transformExpression(propAccess.expression);
                const methodName = isOnTriggerFuncCall ? "onTrigger" : "setScript";
                const methodId = tstl.createIdentifier(methodName, node);
                return tstl.createMethodCallExpression(prefix, methodId, [tstl.createStringLiteral(chunk, node)], node);
            },
        },
    };
};
