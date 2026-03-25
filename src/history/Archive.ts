import { Core } from "../core/Core";
import { IDataStore } from "../Interfaces/IDataStore";
import { IObject } from "../shared/IObject";

export type ArchiveHistoryOptions = {
	intervalsNo?: number;
	aggregates?: string[];
	percentageGood?: number;
	percentageBad?: number;
	treatUncertainAsBad?: boolean;
	slopedExtrapolation?: boolean;
	partialIntervalTreatment?: unknown;
	datastore?: number | IDataStore;
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

export class Archive {
	constructor(private linkedObject: IObject) { }

	_getDataStoreID(): number | undefined {
		const dataStore = syslib.getvalue(this.linkedObject.path.absolutePath() + ".ArchiveOptions.ArchiveSelector");
		if (!dataStore) return undefined;
		if (typeof dataStore === "object") return (dataStore as { id: number }).id;
		return dataStore as number;
	}

	setDataStore(dataStore: number | IDataStore, core?: Core): void {
		let dataStoreId: number;
		if (typeof dataStore === "object" && "getId" in dataStore && typeof dataStore.getId === "function") {
			dataStoreId = dataStore.getId(core);
		} else if (typeof dataStore === "number") {
			dataStoreId = dataStore;
		} else {
			throw new Error("Invalid dataStore argument. Must be a number or an object implementing IDataStore.");
		}

		try {
			syslib.setvalue(this.linkedObject.path.absolutePath() + ".ArchiveOptions.ArchiveSelector", dataStoreId);
		} catch (_) {
			syslib.setvalue(this.linkedObject.path.absolutePath() + ".ArchiveSelector", dataStoreId);
		}
	}

	setRawHistory(mode: "enabled" | "disabled"): void {
		const value = mode === "enabled" ? 1 : 0;
		syslib.setvalue(this.linkedObject.path.absolutePath() + ".ArchiveOptions.StorageStrategy", value);
	}

	/**
	 * Persistency mode
	 * ---|1 do not persist dynamic values
	 * ---|2 persist dynamic values periodically
	 * ---|3 persist dynamic values immediately
	 * ---|4 persist dynamic values when service is stopped
	 */
	persistencyMode(mode: "do not persist dynamic values" | "persist dynamic values periodically" | "persist dynamic values immediately" | "persist dynamic values when service is stopped"): void {
		const selectedMode = {
			"do not persist dynamic values": 1,
			"persist dynamic values periodically": 2,
			"persist dynamic values immediately": 3,
			"persist dynamic values when service is stopped": 4,
		}[mode];

		syslib.setvalue(this.linkedObject.path.absolutePath() + ".ArchiveOptions.PersistencyMode", selectedMode);
	}

	/**
	 * Read historized data for the linked object using `syslib.gethistory()`.
	 *
	 * By default this lets inmation resolve the object's configured archive.
	 * You can override it explicitly by passing `options.datastore`.
	 *
	 * Returns the first result set because this helper queries exactly one path.
	 */
	getHistory(start: number, end: number, options?: ArchiveHistoryOptions): ArchiveHistoryInterval[] {
		const datastore = options?.datastore !== undefined
			? this._resolveDataStoreId(options.datastore, options.core)
			: undefined;

		const intervalsNo = options?.intervalsNo ?? 100;
		const aggregates = options?.aggregates ?? ["AGG_TYPE_INTERPOLATIVE"];
		const percentageGood = options?.percentageGood ?? 100;
		const percentageBad = options?.percentageBad ?? 100;
		const treatUncertainAsBad = options?.treatUncertainAsBad ?? false;
		const slopedExtrapolation = options?.slopedExtrapolation ?? false;
		const partialIntervalTreatment = (options?.partialIntervalTreatment ?? "UASTANDARD") as string;

		const result = datastore === undefined
			? syslib.gethistory(
				[this.linkedObject.path.absolutePath()],
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
				[this.linkedObject.path.absolutePath()],
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
			return dataStore.getId(core);
		}
		throw new Error("Invalid dataStore argument. Must be a number or an object implementing IDataStore.");
	}

}
