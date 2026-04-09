import * as dkjson from "dkjson";

export type Row = Record<string, unknown>;

export class DataFrame<T> {
	public readonly type: string = "DataFrame";
	public data: T[];
	public columns: string[];

	constructor(data: T[] = [], columns?: string[]) {
		this.data = data;
		const cols = columns ?? [];
		if (data.length > 0 && cols.length === 0) {
			for (const k in data[0] as Row) cols.push(k);
		}
		this.columns = cols;
	}

	clear(): DataFrame<T> {
		this.data = [];
		return this;
	}

	nrow(): number {
		return this.data.length;
	}

	ncol(): number {
		return this.columns.length;
	}

	rowCount(): number {
		return this.data.length;
	}

	print(n?: number): void {
		if (this.columns.length === 0) { console.log("[Empty DataFrame: No columns]"); return; }
		if (this.data.length === 0) { console.log("[Empty DataFrame: No rows]"); return; }

		const maxRows = Math.min(n ?? 5, this.data.length);
		const widths: number[] = [];
		for (let ci = 0; ci < this.columns.length; ci += 1) {
			let w = this.columns[ci].length;
			for (let i = 0; i < maxRows; i += 1) {
				const v = String((this.data[i] as Row)[this.columns[ci]] ?? "");
				if (v.length > w) w = v.length;
			}
			widths.push(w);
		}

		const strRepeat = (ch: string, n: number): string => { let s = ""; for (let i = 0; i < n; i += 1) s += ch; return s; };

		const sep = (): string => {
			let s = "";
			for (let i = 0; i < widths.length; i += 1) s += "+" + strRepeat("-", widths[i] + 2);
			return s + "+";
		};
		const fmtRow = (vals: string[]): string => {
			let s = "";
			for (let i = 0; i < widths.length; i += 1) {
				const v = vals[i] ?? "";
				s += "| " + v + strRepeat(" ", widths[i] - v.length) + " ";
			}
			return s + "|";
		};

		console.log(sep());
		console.log(fmtRow(this.columns));
		console.log(sep());
		for (let i = 0; i < maxRows; i += 1) {
			const row = this.data[i] as Row;
			const vals: string[] = [];
			for (const col of this.columns) vals.push(String(row[col] ?? ""));
			console.log(fmtRow(vals));
		}
		console.log(sep());
	}

	summary(): void {
		console.log("DataFrame Summary:");
		console.log(`Columns: ${this.ncol()}`);
		console.log(`Rows: ${this.nrow()}`);
		console.log(`Column names: ${this.columns.join(", ")}`);
	}

	select(cols: string[]): DataFrame<T> {
		const newData = this.data.map((row) => {
			const newRow: Row = {};
			for (const col of cols) newRow[col] = (row as Row)[col];
			return newRow as unknown as T;
		});
		return new DataFrame<T>(newData, cols);
	}

	getCell(rowIndex: number, colName: string): unknown {
		return (this.data[rowIndex] as Row)[colName];
	}

	find(condition: Row, column?: string): T | unknown | undefined {
		for (const row of this.data) {
			const r = row as Row;
			for (const key in condition) {
				if (r[key] === condition[key]) return column ? r[column] : row;
			}
		}
		return undefined;
	}

	filter(fn: (row: T) => boolean): DataFrame<T> {
		const newData: T[] = [];
		for (const row of this.data) {
			if (fn(row)) newData.push(row);
		}
		return new DataFrame<T>(newData, this.columns);
	}

	max(colName: string): unknown {
		let maxVal: unknown = undefined;
		for (const row of this.data) {
			const val = (row as Row)[colName];
			if (val !== undefined && (maxVal === undefined || (val as number) > (maxVal as number))) maxVal = val;
		}
		return maxVal;
	}

	toCsv(separator = ","): string {
		let csv = this.columns.join(separator) + "\n";
		for (const row of this.data) {
			const r = row as Row;
			const vals: string[] = [];
			for (const col of this.columns) vals.push(String(r[col] ?? ""));
			csv += vals.join(separator) + "\n";
		}
		return csv;
	}

	getAllRows(): unknown[][] {
		const rows: unknown[][] = [];
		for (const row of this.data) {
			const r = row as Row;
			const vals: unknown[] = [];
			for (const col of this.columns) vals.push(r[col]);
			rows.push(vals);
		}
		return rows;
	}

	addRow(row: T): DataFrame<T> {
		this.data.push(row);
		return this;
	}

	getColumnData(colName: string): unknown[] {
		return this.data.map((row) => (row as Row)[colName]);
	}

	toObject(): Record<string, unknown[]> {
		const result: Record<string, unknown[]> = {};
		for (const row of this.data) {
			const r = row as Row;
			for (const col of this.columns) {
				if (!result[col]) result[col] = [];
				result[col].push(r[col]);
			}
		}
		return result;
	}

	slice(start: number, stop: number): DataFrame<T> {
		const newData: T[] = [];
		for (let i = start; i <= stop; i += 1) newData.push(this.data[i]);
		return new DataFrame<T>(newData, this.columns);
	}

	forEach(func: (row: T) => T): void {
		for (let i = 0; i < this.data.length; i += 1) this.data[i] = func(this.data[i]);
	}

	map<U>(func: (row: T) => U): DataFrame<U> {
		const newData: U[] = [];
		for (const row of this.data) newData.push(func(row));
		return new DataFrame<U>(newData);
	}

	append(other: DataFrame<T>): DataFrame<T> {
		for (const row of other.data) this.data.push(row);
		for (const col of other.columns) {
			if (this.columns.indexOf(col) === -1) this.columns.push(col);
		}
		return this;
	}

	merge<U>(other: DataFrame<U>, condition: (a: T, b: U) => boolean): DataFrame<Row> {
		const newData: Row[] = [];
		for (const r1 of this.data) {
			for (const r2 of other.data) {
				if (condition(r1, r2)) {
					const newRow: Row = {};
					for (const k in r1 as Row) newRow[k] = (r1 as Row)[k];
					for (const k in r2 as Row) newRow[k] = (r2 as Row)[k];
					newData.push(newRow);
				}
			}
		}
		const cols = [...this.columns];
		for (const col of other.columns) {
			if (cols.indexOf(col) === -1) cols.push(col);
		}
		return new DataFrame<Row>(newData, cols);
	}

	join<U>(other: DataFrame<U>, key: string, query?: (row: Row) => boolean): Record<string, unknown[]> {
		const merged = this.merge(other, (r1, r2) => (r1 as Row)[key] === (r2 as Row)[key]);
		const filtered = query ? merged.filter(query) : merged;
		return filtered.toObject();
	}

	toMassTable(metaId: string): Record<string, unknown> {
		return { data: this.toObject(), meta: { id: metaId } };
	}

	/** Encode to the inmation TableHolder JSON format: `{"data":{col:[values]...}}` */
	toJsonInmation(): string {
		if (this.data.length === 0) return "[]";
		return dkjson.encode({ data: this.toObject() });
	}

	static new<T>(data: T[] = [], columns?: string[]): DataFrame<T> {
		return new DataFrame<T>(data, columns);
	}

	static fromList<T>(data: T[], columns?: string[]): DataFrame<T> {
		return new DataFrame<T>(data, columns);
	}

	static fromRawInmation<T>(inmationTbl: Row[], columns?: string[]): DataFrame<T> {
		const data: Row[] = [];
		for (const row of inmationTbl) {
			const newRow: Row = {};
			for (const k in row) newRow[k] = row[k];
			data.push(newRow);
		}
		return new DataFrame<T>(data as unknown as T[], columns);
	}
}
