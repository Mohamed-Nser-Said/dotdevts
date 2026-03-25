// Compile-time helper for converting TypeScript function bodies to Lua script chunks.
//
// IMPORTANT:
// - This function is intended to be eliminated by the TypeScriptToLua luaPlugin in `tstl-plugins/toLuaString.js`.
// - It should never execute at runtime. If it does, it will throw.
//
// Restrictions (enforced by the plugin as best as possible):
// - Use a zero-arg function with a block body: `() => { ... }`
// - Avoid capturing variables from the outer scope (no closures).
// - Avoid JS/TS features that require TSTL's lualib helpers (arrays, classes, etc.).

export type ScriptChunk = () => void;

/**
 * Compile-time-only macro that becomes a Lua string literal containing the transpiled body of `fn`.
 */
export function toLua(fn: ScriptChunk): string {
    // If you ever see this error, it means the TSTL plugin didn't run or wasn't configured.
    throw new Error(
        "toLua(fn) is a compile-time macro and must be transformed by the TypeScriptToLua plugin (tstl-plugins/toLuaString.js)"
    );
}
