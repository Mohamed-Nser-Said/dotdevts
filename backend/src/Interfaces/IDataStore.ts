import type { IObject } from "../shared/IObject";

/**
 * A time-series or buffer object **registered** on a Core’s `DataStoreConfiguration.DataStoreSets`.
 *
 * {@link getId} returns the **row id** used in:
 * - Variable / item `ArchiveOptions.ArchiveSelector`
 * - `syslib.gethistory(..., datastore)` when targeting that store
 *
 * It is **not** the Mongo `numid` and not the composite id in `row.datastores[]` from registration.
 */
export interface IDataStore extends IObject {
	/**
	 * Resolve the archive-selector row id for this store’s name.
	 * @param core When the store’s registration lives on another Core’s DataStoreSets, pass that Core
	 *   (or another object that **shares** the same `dataStoreConfiguration` instance, e.g. a sibling GTSB).
	 */
	getId(core?: IObject): number;
}
