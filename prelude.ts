// prelude.ts
//
// Runs before other imports (see main.ts) to ensure TypeScriptToLua helper functions
// (e.g. __TS__Class, __TS__New) are available globally.
//
// This is important in environments/bundlers where some emitted modules rely on global
// __TS__* helpers rather than importing them locally.

declare function require(this: void, name: string): any;
declare const _G: any;

(function installLuaLibGlobals(): void {
    if (_G && _G.__TS__Class) return;
    const lualib = require("lualib_bundle") as Record<string, unknown>;
    for (const k in lualib) {
        _G[k] = (lualib as any)[k];
    }
})();
