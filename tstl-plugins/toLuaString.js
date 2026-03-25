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

                const isToLuaCall = isToLuaIdentifier(node.expression);
                const isSetFuncCall = isMethodCallNamed(node, "setFunc");
                const isOnTriggerFuncCall = isMethodCallNamed(node, "onTriggerFunc");
                const isAddActionCall = isMethodCallNamed(node, "addAction");

                if (!isToLuaCall && !isSetFuncCall && !isOnTriggerFuncCall && !isAddActionCall) {
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
                // If not an inline function, fall back to default transformation for setFunc/onTriggerFunc.
                // This allows passing a raw string: setFunc("...") / onTriggerFunc("...")
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
