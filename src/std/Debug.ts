/**
 * Runtime-safe debug helpers for inmation / Lua.
 *
 * Why this exists:
 * - `console.log(a, b)` effectively prints only the first argument in some runtimes.
 * - MongoDB documents often include `_id` as `userdata`, which JSON encoders can't handle.
 * - Deep / cyclic tables can explode logs.
 *
 * These helpers produce a single string and gracefully handle `userdata`.
 */

export type DumpOptions = {
    /** Maximum recursion depth for tables. Default: 3 */
    depth?: number;
    /** Maximum number of keys rendered per table. Default: 50 */
    maxKeys?: number;
    /** Maximum string length before truncation. Default: 300 */
    maxString?: number;
};

// Lua global (available at runtime). Declared for TypeScript typechecking.
declare function tostring(value: any): string;

const defaultOptions: Required<DumpOptions> = {
    depth: 3,
    maxKeys: 50,
    maxString: 300,
};

function trunc(s: string, n: number): string {
    return s.length > n ? s.slice(0, n) + "…" : s;
}

/**
 * Convert any value into a readable, log-friendly single-line string.
 *
 * Note: implemented to compile cleanly to Lua via TypeScriptToLua.
 */
export function dump(value: unknown, opts?: DumpOptions): string {
    const o = { ...defaultOptions, ...(opts ?? {}) };

    // Track visited tables to avoid cycles.
    // Map/Set are provided by TSTL lualib.
    const seen = new Set<unknown>();

    const go = (v: unknown, depth: number): string => {
        if (v === null) return "null";
        if (v === undefined) return "undefined";

        // Note: TypeScript's `typeof` union does not include Lua types like "userdata",
        // but TSTL compiles `typeof` to Lua's `type(...)` at runtime.
        const t = typeof v as any;
        if (t === "string") return `"${trunc(v as string, o.maxString)}"`;
        if (t === "number" || t === "boolean") return String(v);
        if (t === "function") return "<function>";

        // Lua-specific
        if (t === "userdata") return `<userdata ${tostring(v as any)}>`;

        if (t !== "object") return tostring(v as any);

        // Tables / objects
        if (depth <= 0) return "<table>";
        if (seen.has(v)) return "<cycle>";
        seen.add(v);

        // Best effort: format as { k = v, ... }
        let out = "{";
        let nKeys = 0;
        for (const k in v as any) {
            nKeys++;
            if (nKeys > o.maxKeys) {
                out += " …";
                break;
            }
            const key = String(k);
            const vv = (v as any)[k];
            out += ` ${key}=${go(vv, depth - 1)},`;
        }
        out += " }";
        return out;
    };

    return go(value, o.depth);
}

/** Convenience: log a label and a dumped value as a single string. */
export function log(label: string, value: unknown, opts?: DumpOptions): void {
    console.log(`${label}: ${dump(value, opts)}`);
}
