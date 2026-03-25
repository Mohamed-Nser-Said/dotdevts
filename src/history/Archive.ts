import { Core } from "../core/Core";
import { IDataStore } from "../Interfaces/IDataStore";
import { IObject } from "../shared/IObject";
import { type ArchivePersistencyCode, type ArchivePersistencyLabel, resolveArchivePersistencyCode } from "./archivePersistency";
export { ArchivePersistency, type ArchivePersistencyCode, type ArchivePersistencyLabel } from "./archivePersistency";

export type ArchiveHistoryOptions = {
	/** Number of time buckets between start and end (alias of `intervalsNo`). */
	bucketCount?: number;
	intervalsNo?: number;
	aggregates?: string[];
	percentageGood?: number;
	percentageBad?: number;
	treatUncertainAsBad?: boolean;
	slopedExtrapolation?: boolean;
	/** e.g. `"UASTANDARD"` — partial-interval handling for OPC UA aggregates. */
	partialIntervalTreatment?: string;
	/** Override store: numeric row id from {@link IDataStore.getId} or raw id. */
	datastore?: number | IDataStore;
	/** When `datastore` is an {@link IDataStore}, optional core used to resolve its row id. */
	core?: Core;
};

export type ArchiveHistoryInterval = {
	V: unknown;
	/** OPC UA aggregate status / historization status. */
	S?: unknown;
	/** Backward-compatible alias if some code expects quality-like naming. */
	Q?: unknown;
	T: unknown;
};

/**
 * Historization settings and aggregated reads for a single model object (Variable, ActionItem, …).
 *
 * - **Archive target**: where raw/aggregated series are stored — configured on
 *   `ArchiveOptions.ArchiveSelector` / `ArchiveSelector` and resolved by inmation when you omit
 *   `options.datastore` on {@link getHistory}.
 * - **Data store registration**: custom stores and GTSBs register a **row** on the Core’s
 *   `DataStoreConfiguration.DataStoreSets`. {@link IDataStore.getId} returns that **row id**
 *   for use with {@link setDataStore} / `gethistory(..., datastore)`.
 */
export class Archive {
	constructor(private linkedObject: IObject) { }

	private itemPath(): string {
		return this.linkedObject.path.absolutePath();
	}

	/**
	 * Numeric archive-selector value currently configured on the item, if any.
	 * This is the datastore **row id** (or system code), not the Mongo `numid`.
	 */
	configuredArchiveRowId(): number | undefined {
		const dataStore = syslib.getvalue(this.itemPath() + ".ArchiveOptions.ArchiveSelector");
		if (!dataStore) return undefined;
		if (typeof dataStore === "object") return (dataStore as { id: number }).id;
		return dataStore as number;
	}

	/**
	 * Point historization at a registered data store row or a raw numeric selector.
	 * @param dataStore Row id, or any {@link IDataStore} (uses {@link IDataStore.getId}).
	 * @param core Optional core when resolving `getId` for stores tied to a specific Core’s DataStoreSets.
	 */
	setDataStore(dataStore: number | IDataStore, core?: Core): void {
		let dataStoreId: number;
		if (typeof dataStore === "object" && "getId" in dataStore && typeof dataStore.getId === "function") {
			dataStoreId = dataStore.getId(core as IObject | undefined);
		} else if (typeof dataStore === "number") {
			dataStoreId = dataStore;
		} else {
			throw new Error("Invalid dataStore argument. Must be a number or an object implementing IDataStore.");
		}

		try {
			syslib.setvalue(this.itemPath() + ".ArchiveOptions.ArchiveSelector", dataStoreId);
		} catch (_) {
			syslib.setvalue(this.itemPath() + ".ArchiveSelector", dataStoreId);
		}
	}

	/**
	 * Enable or disable raw history capture (`ArchiveOptions.StorageStrategy`).
	 * @param mode `enabled` stores raw samples when archive mode allows; `disabled` turns raw off.
	 */
	setRawHistory(mode: "enabled" | "disabled"): void {
		const value = mode === "enabled" ? 1 : 0;
		syslib.setvalue(this.itemPath() + ".ArchiveOptions.StorageStrategy", value);
	}

	/**
	 * How dynamic values are written through to persistence layers.
	 * @param mode Short label (`"immediate"`, …), long DataStudio phrase, or numeric code 1–4 ({@link ArchivePersistency}).
	 */
	persistencyMode(mode: ArchivePersistencyLabel | ArchivePersistencyCode): void {
		const code = resolveArchivePersistencyCode(mode);
		syslib.setvalue(this.itemPath() + ".ArchiveOptions.PersistencyMode", code);
	}

	/**
	 * Read aggregated history for this item via `syslib.gethistory` (single path).
	 *
	 * @param start Start time UTC (POSIX ms).
	 * @param end End time UTC (POSIX ms) — **exclusive** (samples at `end` are not included).
	 * @param options Bucket count, aggregate types, optional `datastore` override, etc.
	 * @returns One series: `result[interval]` with `{ V, S, T }` (status + timestamp per docs).
	 */
	getHistory(start: number, end: number, options?: ArchiveHistoryOptions): ArchiveHistoryInterval[] {
		const datastore = options?.datastore !== undefined
			? this._resolveDataStoreId(options.datastore, options.core)
			: undefined;

		const intervalsNo = options?.bucketCount ?? options?.intervalsNo ?? 100;
		const aggregates = options?.aggregates ?? ["AGG_TYPE_INTERPOLATIVE"];
		const percentageGood = options?.percentageGood ?? 100;
		const percentageBad = options?.percentageBad ?? 100;
		const treatUncertainAsBad = options?.treatUncertainAsBad ?? false;
		const slopedExtrapolation = options?.slopedExtrapolation ?? false;
		const partialIntervalTreatment = (options?.partialIntervalTreatment ?? "UASTANDARD") as string;

		const result = datastore === undefined
			? syslib.gethistory(
				[this.itemPath()],
				start,
				end,
				intervalsNo,
				aggregates,
				percentageGood,
				percentageBad,
				treatUncertainAsBad,
				slopedExtrapolation,
				partialIntervalTreatment,
			)
			: syslib.gethistory(
				[this.itemPath()],
				start,
				end,
				intervalsNo,
				aggregates,
				percentageGood,
				percentageBad,
				treatUncertainAsBad,
				slopedExtrapolation,
				partialIntervalTreatment,
				datastore,
			);

		return (result[0] ?? []) as ArchiveHistoryInterval[];
	}

	private _resolveDataStoreId(dataStore: number | IDataStore, core?: Core): number {
		if (typeof dataStore === "number") return dataStore;
		if (typeof dataStore === "object" && "getId" in dataStore && typeof dataStore.getId === "function") {
			return dataStore.getId(core as IObject | undefined);
		}
		throw new Error("Invalid dataStore argument. Must be a number or an object implementing IDataStore.");
	}

}
