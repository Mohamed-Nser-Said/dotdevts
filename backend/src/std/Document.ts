/**
 * Document — an in-memory text document with line-level manipulation.
 *
 * Useful for building, editing, and serialising multi-line text (scripts,
 * config files, CSV output, report templates) before writing to disk with
 * File.write() or passing to syslib APIs.
 *
 * Mirrors: .dev/src/modules/util/document.lua
 */

export class Document {
    lines: string[];

    constructor(text?: string) {
        this.lines = text ? Document.splitLines(text) : [];
    }

    /** Number of lines currently in the document. */
    get count(): number {
        return this.lines.length;
    }

    /**
     * Append text to the end of the document.
     * Multi-line text is split on `\n` and each line is appended separately.
     */
    append(text: string): this {
        for (const line of Document.splitLines(text)) {
            this.lines.push(line);
        }
        return this;
    }

    /**
     * Insert text at a given 1-based line index.
     * All existing lines from that index onward shift down.
     * Multi-line text is inserted in order.
     */
    insert(index: number, text: string): this {
        const newLines = Document.splitLines(text);
        for (let i = 0; i < newLines.length; i++) {
            this.lines.splice(index - 1 + i, 0, newLines[i]);
        }
        return this;
    }

    /**
     * Remove `count` lines starting at 1-based `index`.
     */
    remove(index: number, count: number): this {
        this.lines.splice(index - 1, count);
        return this;
    }

    /**
     * Replace the line at 1-based `index` with new text.
     * If `text` spans multiple lines they replace the single target line.
     */
    replace(index: number, text: string): this {
        this.remove(index, 1);
        this.insert(index, text);
        return this;
    }

    /**
     * Return the line at 1-based `index` (undefined if out of range).
     */
    get(index: number): string | undefined {
        return this.lines[index - 1];
    }

    /**
     * Find the 1-based index of the first line matching `predicate`.
     * Returns -1 if not found.
     */
    findLine(predicate: (line: string) => boolean): number {
        for (let i = 0; i < this.lines.length; i++) {
            if (predicate(this.lines[i])) return i + 1;
        }
        return -1;
    }

    /**
     * Return all lines that match `predicate`.
     */
    filter(predicate: (line: string) => boolean): string[] {
        const result: string[] = [];
        for (const line of this.lines) {
            if (predicate(line)) result.push(line);
        }
        return result;
    }

    /** Remove all lines. */
    clear(): this {
        this.lines = [];
        return this;
    }

    /** Render the document back to a single string joined by `\n`. */
    toString(): string {
        let out = "";
        for (let i = 0; i < this.lines.length; i++) {
            if (i > 0) out = out + "\n";
            out = out + this.lines[i];
        }
        return out;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Static helpers
    // ─────────────────────────────────────────────────────────────────────────

    /** Create a Document from an array of lines (no splitting). */
    static fromLines(lines: string[]): Document {
        const doc = new Document();
        doc.lines = [...lines];
        return doc;
    }

    private static splitLines(text: string): string[] {
        const result: string[] = [];
        let start = 0;
        for (let i = 0; i <= text.length; i++) {
            if (i === text.length || text.substring(i, i + 1) === "\n") {
                const line = text.substring(start, i).replace("\r", "");
                result.push(line);
                start = i + 1;
            }
        }
        return result;
    }
}
