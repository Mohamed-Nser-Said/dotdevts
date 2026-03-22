import { DataFrame } from "../std/DataFrame";

type TableRows<T> = T[];

type LinkedObject = {
	path: { absolutePath(): string } | string | (() => string);
	class?: number;
	name?: string;
};

export class CustomTable<T> {
	private linkedObject: LinkedObject;

	constructor(linkedObject: LinkedObject) {
		this.linkedObject = linkedObject;
	}

	private getPathString(): string {
		const { path } = this.linkedObject;
		if (typeof path === "function") return path();
		if (typeof path === "object") return path.absolutePath();
		return String(path);
	}

	private persist(names: string[], data: TableRows<T>[]): void {
		const base = `${this.getPathString()}.CustomOptions.CustomTables`;
		syslib.setvalue(`${base}.CustomTableName`, names);
		syslib.setvalue(`${base}.TableData`, data);
	}

	private toRows(data: DataFrame<T> | TableRows<T>): TableRows<T> {
		const df = data as DataFrame<T>;
		return df.data != null ? df.data : (data as TableRows<T>);
	}

	getTableNames(): string[] {
		return (syslib.getvalue(`${this.getPathString()}.CustomOptions.CustomTables.CustomTableName`) as string[]) ?? [];
	}

	getAllTables(): TableRows<T>[] {
		return (syslib.getvalue(`${this.getPathString()}.CustomOptions.CustomTables.TableData`) as TableRows<T>[]) ?? [];
	}

	indexOf(tblName: string): number {
		return this.getTableNames().indexOf(tblName);
	}

	getByIndex(index: number): DataFrame<T> {
		return DataFrame.fromList<T>(this.getAllTables()[index] ?? []);
	}

	get(name: string): DataFrame<T> {
		const idx = this.indexOf(name);
		return DataFrame.fromList<T>(idx >= 0 ? (this.getAllTables()[idx] ?? []) : []);
	}

	addOrUpdateTable(tblName: string, data: DataFrame<T> | TableRows<T>): void {
		const names = this.getTableNames();
		const tables = this.getAllTables();
		const idx = names.indexOf(tblName);
		if (idx === -1) {
			names.push(tblName);
			tables.push(this.toRows(data));
		} else {
			tables[idx] = this.toRows(data);
		}
		this.persist(names, tables);
	}

	addOrUpdateMany(tbls: Record<string, DataFrame<T> | TableRows<T>>): void {
		const names = this.getTableNames();
		const tables = this.getAllTables();
		for (const tblName in tbls) {
			const idx = names.indexOf(tblName);
			const rows = this.toRows(tbls[tblName]);
			if (idx === -1) {
				names.push(tblName);
				tables.push(rows);
			} else {
				tables[idx] = rows;
			}
		}
		this.persist(names, tables);
	}

	clearTable(tblName: string): void {
		this.addOrUpdateTable(tblName, []);
	}

	count(): number {
		return this.getTableNames().length;
	}

	remove(tblName: string): void {
		const names = this.getTableNames();
		const idx = names.indexOf(tblName);
		if (idx === -1) return;
		const tables = this.getAllTables();
		names.splice(idx, 1);
		tables.splice(idx, 1);
		this.persist(names, tables);
	}

	removeAll(): void {
		this.persist([], []);
	}

	clearAll(): void {
		const tables = this.getAllTables();
		this.persist(this.getTableNames(), tables.map(() => []));
	}

	updateTableName(oldName: string, newName: string): void {
		const names = this.getTableNames();
		const idx = names.indexOf(oldName);
		if (idx === -1) return;
		names[idx] = newName;
		syslib.setvalue(`${this.getPathString()}.CustomOptions.CustomTables.CustomTableName`, names);
	}
}
