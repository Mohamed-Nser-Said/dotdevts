/**
 * GTSBExample — Comprehensive
 *
 * Covers the full GTSB API:
 *   1.  Create a GTSB and register it as a DataStore
 *   2.  Set a processing script via onTrigger
 *   3.  Set a module script via ScriptLibrary + give it a module name
 *   4.  Archive external Variables to the GTSB
 *   5.  Create a second GTSB that shares the same DataStoreConfiguration
 *   6.  Inspect DataStoreConfiguration (list registered stores, get ID)
 *   7.  Create a GTSB with all processing options
 *   8.  Wrap an existing GTSB without touching inmation (skipMass)
 *   9.  Use the static appendable factory
 *   10. Unregister a GTSB from the DataStore registry (delete)
 *
 * GTSB objects must be direct children of the Core object.
 */

import { GenericFolder } from "../src/objects/GenericFolder";
import { GTSB } from "../src/datastores/GTSB";
import { IObject } from "../src/shared/IObject";
import { Variable } from "../src/objects/Variable";


export function main(): void {
	const corePath = syslib.getcorepath();

	// ─────────────────────────────────────────────────────────────────────────
	// 1. Create primary GTSB and register it as a DataStore
	//    registerAsDataStore: true → writes an entry into
	//    Core.DataStoreConfiguration.DataStoreSets so variables can target it.
	// ─────────────────────────────────────────────────────────────────────────
	const primaryBuffer = new GTSB(`${corePath}/PrimaryBuffer`, {
		retryLatency: 1,
		suppressAcks: false,
		parallel: false,
		registerAsDataStore: true,
	});
	console.log(`[1] Created + registered GTSB: ${primaryBuffer.path.absolutePath()}`);

	// ─────────────────────────────────────────────────────────────────────────
	// 2. Set a processing script via onTrigger
	//    The script receives (iter, sink) — iter yields buffered items,
	//    sink forwards them to the archive.
	// ─────────────────────────────────────────────────────────────────────────
	primaryBuffer.onTrigger(`
		return function(iter, sink)
			syslib.log(2, "PrimaryBuffer triggered at " .. syslib.gettime(syslib.now()))
			for item in iter do
				sink(item)           -- pass every item through to the archive
			end
		end
	`);
	console.log(`[2] Processing script set via onTrigger`);

	// ─────────────────────────────────────────────────────────────────────────
	// 3. ScriptLibrary — set a reusable Lua module script on the GTSB.
	//    This writes to AdvancedLuaScript and can be read back later.
	//    (LuaModuleName is not supported on GTSB objects.)
	// ─────────────────────────────────────────────────────────────────────────
	primaryBuffer.scriptLibrary.setScript(`
		local M = {}
		function M.process(item)
			return item
		end
		return M
	`);
	const storedScript = primaryBuffer.scriptLibrary.getScript();
	console.log(`[3] Module script set, stored length: ${String(storedScript).length > 0}`);

	// ─────────────────────────────────────────────────────────────────────────
	// 4. Archive external Variables to the GTSB
	//    Variables under a GenericFolder target the GTSB via archive.setDataStore.
	//    getId() looks up the rowid from DataStoreConfiguration.
	// ─────────────────────────────────────────────────────────────────────────
	const folder = new GenericFolder(`${corePath}/examples/gtsb-sensors`);
	const pressure = new Variable(`${folder.path.absolutePath()}/Pressure`, 4.2);
	const temperature = new Variable(`${folder.path.absolutePath()}/Temperature`, 21.5);
	const flowRate = new Variable(`${folder.path.absolutePath()}/FlowRate`, 12.0);

	pressure.archive.setDataStore(primaryBuffer);
	temperature.archive.setDataStore(primaryBuffer);
	flowRate.archive.setDataStore(primaryBuffer);
	console.log(`[4] Archived 3 variables to PrimaryBuffer (DataStore ID: ${primaryBuffer.getId()})`);

	// ─────────────────────────────────────────────────────────────────────────
	// 5. Second GTSB that shares the same DataStoreConfiguration instance
	//    Pass the first GTSB as core: it has a .dataStoreConfiguration that
	//    the new GTSB reuses — no duplicate Core lookups.
	// ─────────────────────────────────────────────────────────────────────────
	const parallelBuffer = new GTSB(`${corePath}/ParallelBuffer`, {
		retryLatency: 2,
		parallel: true,
		registerAsDataStore: true,
		core: primaryBuffer,           // reuse primaryBuffer's DataStoreConfiguration
	});
	console.log(`[5] Second GTSB (shared DSC): ${parallelBuffer.path.absolutePath()}`);

	// Also archive temperature to the parallel buffer
	temperature.archive.setDataStore(parallelBuffer);
	console.log(`    Temperature also archived to ParallelBuffer (ID: ${parallelBuffer.getId()})`);

	// ─────────────────────────────────────────────────────────────────────────
	// 6. Inspect DataStoreConfiguration — list all registered stores
	// ─────────────────────────────────────────────────────────────────────────
	const dsc = primaryBuffer.dataStoreConfiguration;
	const sets = dsc.getDataStoreSets();
	console.log(`[6] Total registered DataStores: ${sets.data.length}`);
	for (const row of sets.data) {
		console.log(`    • ${row.name}  rowid=${row.rowid}  ids=${row.datastores}`);
	}

	// Look up IDs by name
	const primaryId = dsc.getIdByName("PrimaryBuffer");
	const parallelId = dsc.getIdByName("ParallelBuffer");
	console.log(`    PrimaryBuffer ID: ${primaryId}, ParallelBuffer ID: ${parallelId}`);

	// ─────────────────────────────────────────────────────────────────────────
	// 7. GTSB with all processing options (no registration needed here)
	// ─────────────────────────────────────────────────────────────────────────
	const highFreqBuffer = new GTSB(`${corePath}/HighFreqBuffer`, {
		retryLatency: 10,
		suppressAcks: true,
		parallel: true,
		advancedLuaScript: `
			return function(iter, sink)
				-- suppress every 2nd item for high-freq noise reduction
				local n = 0
				for item in iter do
					n = n + 1
					if n % 2 == 0 then sink(item) end
				end
			end
		`,
	});
	console.log(`[7] High-freq GTSB: ${highFreqBuffer.path.absolutePath()}`);

	// ─────────────────────────────────────────────────────────────────────────
	// 8. Wrap an existing GTSB without touching inmation (skipMass)
	//    Useful when you only need to read/inspect a GTSB created elsewhere.
	// ─────────────────────────────────────────────────────────────────────────
	const existing = new GTSB(`${corePath}/PrimaryBuffer`, { skipMass: true });
	const existingScript = existing.scriptLibrary.getScript();
	console.log(`[8] Wrapped existing (skipMass), script present: ${existingScript !== undefined}`);

	// ─────────────────────────────────────────────────────────────────────────
	// 9. Static appendable factory — build a GTSB relative to a Core IObject.
	//    GTSB objects must be direct children of Core (not children of other
	//    GTSBs), so the parent must wrap the Core path.
	// ─────────────────────────────────────────────────────────────────────────
	const coreObject = new IObject(corePath, syslib.model.classes.Core);
	const sideBuffer = GTSB.appendable(coreObject, "SideBuffer", {
		retryLatency: 3,
		registerAsDataStore: true,
		core: corePath,
	});
	console.log(`[9] Created via appendable: ${sideBuffer.path.absolutePath()}`);
	console.log(`    SideBuffer ID: ${dsc.getIdByName("SideBuffer")}`);

	// ─────────────────────────────────────────────────────────────────────────
	// 10. Cleanup — delete SideBuffer: GTSB.delete() unregisters from the DSC
	//     first, then deletes the inmation object. If the object is currently
	//     in use by the engine, the physical delete is silently skipped via
	//     silent=true, but the DataStore registration is always removed.
	// ─────────────────────────────────────────────────────────────────────────
	const beforeDelete = dsc.getDataStoreSets().data.length;
	sideBuffer.delete(true);   // silent=true: swallows engine "in use" errors
	const afterDelete = dsc.getDataStoreSets().data.length;
	console.log(`[10] DSC entries: ${beforeDelete} → ${afterDelete} (SideBuffer unregistered)`);
}



