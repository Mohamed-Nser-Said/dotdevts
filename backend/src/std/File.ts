import * as dkjson from "dkjson";

// _ENV is a Lua global available at runtime
declare const _ENV: { _srcMeta?: { filePath?: string } } | undefined;

export type ReadDirOptions = {
    fileOnly?: boolean;
    directoryOnly?: boolean;
    recursive?: boolean;
};

export type RmDirOptions = {
    recursive?: boolean;
};

export type MkDirOptions = {
    recursive?: boolean;
};

function getCwd(): string {
    if (_ENV && _ENV._srcMeta && _ENV._srcMeta.filePath) {
        const fp = _ENV._srcMeta.filePath;
        // Find last separator by scanning backwards
        let lastSlash = -1;
        for (let i = fp.length - 1; i >= 0; i--) {
            const ch = fp.substring(i, i + 1);
            if (ch === "/" || ch === "\\") {
                lastSlash = i;
                break;
            }
        }
        return lastSlash >= 0 ? fp.substring(0, lastSlash + 1) : "";
    }
    return "";
}

function parseCsv(csvString: string, separator: string): string[][] {
    const result: string[][] = [];
    let row: string[] = [];
    let field = "";
    let inQuotes = false;

    let i = 1;
    while (i <= csvString.length) {
        const char = csvString.substring(i - 1, i);

        if (char === '"') {
            if (inQuotes && csvString.substring(i, i + 1) === '"') {
                field += '"';
                i += 2;
            } else {
                inQuotes = !inQuotes;
                i++;
            }
        } else if (char === separator && !inQuotes) {
            row.push(field);
            field = "";
            i++;
        } else if ((char === "\r" || char === "\n") && !inQuotes) {
            row.push(field);
            result.push(row);
            row = [];
            field = "";
            if (char === "\r" && csvString.substring(i, i + 1) === "\n") {
                i += 2;
            } else {
                i++;
            }
        } else {
            field += char;
            i++;
        }
    }

    if (field !== "" || row.length > 0) {
        row.push(field);
        result.push(row);
    }

    return result;
}

export class File {
    static cwd(): string {
        return getCwd();
    }

    static read(filePath: string): string {
        if (!Host || !Host.io) {
            throw new Error("Host.io is not available");
        }
        return Host.io.read(filePath);
    }

    static write(filePath: string, content: string): void {
        if (!Host || !Host.io) {
            throw new Error("Host.io is not available");
        }
        Host.io.write(filePath, content);
    }

    static dirExist(filePath: string): boolean {
        const cwd = getCwd();
        const cmd = `test -d "${filePath}" && echo True || echo False`;
        const res = Host.os.exec(cmd, cwd);
        if (res && res.indexOf("False") !== -1) return false;
        if (res && res.indexOf("True") !== -1) return true;
        return false;
    }

    static exist(filePath: string): boolean {
        const cwd = getCwd();
        const cmd = `test -e "${filePath}" && echo True || echo False`;
        const res = Host.os.exec(cmd, cwd);
        if (res && res.indexOf("False") !== -1) return false;
        if (res && res.indexOf("True") !== -1) return true;
        return false;
    }

    static parseCsv(filePath: string, separator?: string): Record<string, unknown>[] {
        let csv = File.read(filePath);
        const sepIndex = csv.indexOf("sep=");
        if (sepIndex >= 0 && sepIndex < 10) {
            separator = csv.substring(sepIndex + 4, sepIndex + 5);
            const newlinePos = csv.indexOf("\n");
            if (newlinePos >= 0) {
                csv = csv.substring(newlinePos + 1);
            }
        }
        separator = separator ?? ",";

        const csvAsTable = parseCsv(csv, separator);
        const columns = csvAsTable[0] ?? [];

        const out: Record<string, unknown>[] = [];
        for (let index = 1; index < csvAsTable.length; index++) {
            const row = csvAsTable[index];
            const rowData: Record<string, unknown> = {};
            for (let colIndex = 0; colIndex < row.length; colIndex++) {
                const key = columns[colIndex] ?? `col${colIndex + 1}`;
                rowData[key] = row[colIndex];
            }
            out.push(rowData);
        }
        return out;
    }

    static readLines(filePath: string): [string[], string] {
        const content = File.read(filePath);
        return [content.split("\n"), content];
    }

    static readJsonAsTable(filePath: string): unknown {
        return dkjson.decode(File.read(filePath));
    }

    static saveTableAsJson(filePath: string, content: unknown): void {
        File.write(filePath, dkjson.encode(content));
    }

    static rmDir(dirPath: string, options?: RmDirOptions): string | undefined {
        options = options ?? {};
        const recursive = options.recursive ? "-r" : "";
        const cwd = getCwd();
        const cmd = `rm -f ${recursive} "${dirPath}"`;
        return Host.os.exec(cmd, cwd);
    }

    static mkDir(dirPath: string, options?: MkDirOptions): string | undefined {
        options = options ?? {};
        const parents = options.recursive ? "-p" : "";
        const cwd = getCwd();
        const cmd = `mkdir ${parents} "${dirPath}"`;
        return Host.os.exec(cmd, cwd);
    }

    static readDir(dir: string, options?: ReadDirOptions): string[] {
        options = options ?? {};
        const typeFlag = options.directoryOnly ? "-type d"
            : options.fileOnly ? "-type f"
            : "";
        const maxdepth = options.recursive ? "" : "-maxdepth 1";
        const cwd = getCwd();
        const cmd = `find "${dir}" ${maxdepth} ${typeFlag} ! -path "${dir}"`;
        const outStr = Host.os.exec(cmd, cwd);
        const out: string[] = [];
        if (outStr) {
            for (const file of outStr.split("\n")) {
                if (file.length > 0) out.push(file);
            }
        }
        return out;
    }
}
