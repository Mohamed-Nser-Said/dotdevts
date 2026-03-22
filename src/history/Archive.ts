import { IObject } from "../shared/IObject";

export class Archive {
	constructor(private linkedObject: IObject) {}

	_getDataStoreID(): number | undefined {
		const dataStore = syslib.getvalue(this.linkedObject.path.absolutePath() + ".ArchiveOptions.ArchiveSelector");
		if (!dataStore) return undefined;
		if (typeof dataStore === "object") return (dataStore as { id: number }).id;
		return dataStore as number;
	}

	setDataStore(dataStore: number | { getId(core?: unknown): number }, core?: unknown): void {
		let dataStoreId: number;
		if (typeof dataStore === "object") {
			dataStoreId = dataStore.getId(core);
		} else {
			dataStoreId = dataStore;
		}

		if (typeof dataStoreId !== "number") {
			throw new Error("Invalid data store id");
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
}
