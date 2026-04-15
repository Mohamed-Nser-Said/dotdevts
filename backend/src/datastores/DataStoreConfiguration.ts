import * as dkjson from "dkjson";
import { IObject } from "../shared/IObject";
import { DataFrame } from "../std/DataFrame";

export type DataStoreRow = {
	name: string;
	datastores: number[];
	primary: unknown;
	description: string;
	rowid: number;
};

/**
 * Read/write the Core property `DataStoreConfiguration.DataStoreSets` (JSON table + DataFrame).
 *
 * Each **row** is one logical store registration: `rowid` is what items use as archive selector;
 * `datastores` holds internal composite ids assigned when registering.
 */
export class DataStoreConfiguration {
	constructor(private readonly linkedObject: IObject) { }

	private get propPath(): string {
		return this.linkedObject.path.absolutePath() + ".DataStoreConfiguration.DataStoreSets";
	}

	private encode(sets: DataStoreRow[]): void {
		const df = DataFrame.fromList<DataStoreRow>(sets);
		const model = { meta: { id: "urn:id:42:17" }, data: df.toObject() };
		syslib.setvalue(this.propPath, dkjson.encode(model));
	}

	getDataStoreSets(): DataFrame<DataStoreRow> {
		const raw = syslib.getvalue(this.propPath);
		if (!raw || typeof raw !== "object") return DataFrame.fromList<DataStoreRow>([]);
		// Use fromRawInmation: syslib returns a native Lua table (1-indexed) that
		// needs pairs/ipairs-style iteration, not JS-array iteration.
		return DataFrame.fromRawInmation<DataStoreRow>(raw as Record<string, unknown>[]);
	}

	/**
	 * Append a registration row for `dataStore` and return its internal composite id
	 * (stored in `row.datastores[0]` — not the same as {@link rowIdForStoreName}).
	 */
	addDataStore(dataStore: IObject & { _uniqueID(): number }): number {
		// Use the cached object on the IObject (set by IObject constructor + refreshed after mass)
		// to get the numid — avoids a redundant getobject call and mirrors the Teal implementation.
		const rawObj = dataStore.object as unknown as { numid?: (() => number) | number };
		if (!rawObj) throw new Error(`DataStore object not found: ${dataStore.path.absolutePath()}`);

		let numid: number;
		if (typeof rawObj.numid === "function") {
			numid = rawObj.numid();
		} else if (typeof rawObj.numid === "number") {
			numid = rawObj.numid;
		} else {
			throw new Error(`numid not available on DataStore object: ${dataStore.path.absolutePath()}`);
		}

		const uniqueId = dataStore._uniqueID();
		const newId = numid + uniqueId;

		const sets = this.getDataStoreSets().data;

		// Check if already registered
		for (const row of sets) {
			for (const id of row.datastores) {
				if (id === newId) return newId;
			}
		}

		// Find max rowid
		let maxRowId = 32;
		for (const row of sets) {
			if (row.rowid > maxRowId) maxRowId = row.rowid;
		}

		sets.push({
			name: dataStore.path.name(),
			datastores: [newId],
			primary: undefined,
			description: "Created by script",
			rowid: maxRowId + 1,
		});

		this.encode(sets);
		return newId;
	}

	/** Same as {@link addDataStore} — registers the store on this Core’s DataStoreSets. */
	register(dataStore: IObject & { _uniqueID(): number }): number {
		return this.addDataStore(dataStore);
	}

	removeDataStore(dataStore: IObject): void {
		const name = dataStore.path.name();
		const sets = this.getDataStoreSets().data.filter((r) => r.name !== name);
		this.encode(sets);
	}

	/** Same as {@link removeDataStore}. */
	unregister(dataStore: IObject): void {
		this.removeDataStore(dataStore);
	}

	removeAllDataStores(): void {
		this.encode([]);
	}

	/** Clear every registration row (empty DataStoreSets). */
	clear(): void {
		this.removeAllDataStores();
	}

	/**
	 * **Row id** (`rowid`) for a store whose `ObjectName` matches `name` — this is what
	 * {@link IDataStore.getId} / {@link Archive.setDataStore} use for archive targeting.
	 */
	getIdByName(name: string): number | undefined {
		for (const row of this.getDataStoreSets().data) {
			if (row.name === name) return row.rowid;
		}
		return undefined;
	}

	/** Same as {@link getIdByName}. */
	rowIdForStoreName(name: string): number | undefined {
		return this.getIdByName(name);
	}
}
