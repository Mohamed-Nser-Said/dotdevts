/**
 * HistoryTransporterExample
 *
 * Demonstrates creating HistoryTransporter objects to move historical
 * data from external sources into inmation, and using HistorianMapping
 * to manage historian tag mappings on GTSB objects.
 *
 * NOTE: HistoryTransporter and GTSB objects require a valid parent in the
 * inmation model (e.g., an OPC Server Connection). When the parent GenericFolder
 * does not support these child types the mass call will fail. The examples below
 * are wrapped in try/catch so the rest of the suite keeps running.
 */

import { GenericFolder } from "../src/objects/GenericFolder";
import { GTSB } from "../src/datastores/GTSB";
import { HistorianMapping, HistorianTag } from "../src/history/HistorianMapping";
import { HistoryTransporter } from "../src/history/HistoryTransporter";


export function main(): void {
	const corePath = syslib.getcorepath();
	const rootPath = `${corePath}/examples/history`;

	const root = new GenericFolder(rootPath);

	// --- HistoryTransporter (requires valid parent type) ---
	try {
		const ht = new HistoryTransporter(`${rootPath}/Transporter1`);
		console.log(`Created HistoryTransporter: ${ht.path.absolutePath()}`);

		const htWithTags = new HistoryTransporter(`${rootPath}/Transporter2`, {
			TagConfiguration: [
				{ Path: `${corePath}/examples/variables/Speed`, Name: "Speed", Historian: 1 },
				{ Path: `${corePath}/examples/variables/Motor/RPM`, Name: "RPM", Historian: 1 },
			],
		});
		console.log(`Created HistoryTransporter with tags: ${htWithTags.path.absolutePath()}`);

		ht.setTagConfiguration([
			{ Path: `${corePath}/examples/variables/Flow`, Name: "Flow", Historian: 1 },
		]);
		console.log("Updated tag configuration on Transporter1");

		ht.setArchive(33);
		console.log("Set archive DataStore ID to 33");

		ht.setMode(syslib.model.codes.HistoryTransporterMode.HTM_CONTINUOUS);
		console.log("Set mode to HTM_CONTINUOUS");

		ht.reload();
		console.log("Triggered reload");

		const ht2 = HistoryTransporter.appendable(root, "Transporter3");
		console.log(`Created via appendable: ${ht2.path.absolutePath()}`);
	} catch (e) {
		console.log(`HistoryTransporter creation skipped: parent type does not support HistoryTransporter children.`);
	}

	// --- HistorianMapping on a GTSB (GTSB also requires valid parent type) ---
	try {
		const gtsb = new GTSB(`${rootPath}/HistBuffer`);
		const mapping = new HistorianMapping(gtsb);
		console.log(`Created HistorianMapping on: ${gtsb.path.absolutePath()}`);

		mapping.clear();
		mapping.appendMany([
			{ EquipmentId: "EQ-001", Tag: "TI-101", Path: `${corePath}/examples/variables/Speed`, Historian: 1 },
			{ EquipmentId: "EQ-001", Tag: "TI-102", Path: `${corePath}/examples/variables/Motor/RPM`, Historian: 1 },
			{ EquipmentId: "EQ-002", Tag: "PI-201", Path: `${corePath}/examples/variables/Flow`, Historian: 1 },
		]);
		console.log(`Mapping count: ${mapping.count()}`);

		const eq1Tags = mapping.list((t) => t.EquipmentId === "EQ-001");
		console.log(`EQ-001 tags: ${eq1Tags.length}`);

		mapping.update({
			EquipmentId: "EQ-001",
			Tag: "TI-101",
			Path: `${corePath}/examples/variables/Motor/Temperature`,
			Historian: 1,
		});
		console.log("Updated TI-101 path");

		const tagNames = mapping.map((t) => t.Tag);
		console.log(`All tags: ${tagNames.join(", ")}`);

		mapping.forEach((t: HistorianTag) => {
			console.log(`  ${t.EquipmentId} / ${t.Tag} -> ${t.Path}`);
		});

		const df = mapping.get();
		console.log(`Mapping DataFrame rows: ${df.data.length}`);

		mapping.updateMany((t) => ({ ...t, Historian: 2 }));
		console.log(`After updateMany, count: ${mapping.count()}`);
	} catch (e) {
		console.log(`GTSB/HistorianMapping creation skipped: parent type does not support GTSB children.`);
	}

	// --- API surface demo (skipMass — path-only, no mass call) ---
	const readonlyGtsb = new GTSB(`${rootPath}/HistBuffer`, { skipMass: true });
	const mapping = new HistorianMapping(readonlyGtsb);
	console.log(`HistorianMapping path: ${readonlyGtsb.path.absolutePath()}`);
	console.log(`Configured prop path ends with: MSIMsgDHistorianConfigList`);
}

