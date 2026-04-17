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

import { GenericFolder } from "../../IntegrationProviders/Inmation/src/objects/GenericFolder";
import { GTSB } from "../../IntegrationProviders/Inmation/src/datastores/GTSB";
import { HistorianMapping, HistorianTag } from "../../IntegrationProviders/Inmation/src/history/HistorianMapping";
import { HistoryTransporter } from "../../IntegrationProviders/Inmation/src/history/HistoryTransporter";
import { Core } from "../../IntegrationProviders/Inmation/src/core/Core";
import { Connector } from "../../IntegrationProviders/Inmation/src/core/Connector";


export function main(): void {
	const core = new Core();
	const conn = new Connector("/System/Core/CORE-LOCAL-SITE/AMS_Windfarm-connector");

	const root =  core.children.GenericFolder("HistoryTransporter", {cleanupExisting: true});
	const corePath = core.path.absolutePath();

	// --- HistoryTransporter (requires valid parent type) ---
	try {
		const ht = new HistoryTransporter(`/System/Core/CORE-LOCAL-SITE/AMS_Windfarm-connector/HT1`);
		console.log(`Created HistoryTransporter: ${ht.path.absolutePath()}`);

		// const htWithTags =  conn.children.HistoryTransporter(`Transporter2`, {
		// 	TagConfiguration: [
		// 		{ Path: `${corePath}/examples/variables/Speed`, Name: "Speed", Historian: 1 },
		// 		{ Path: `${corePath}/examples/variables/Motor/RPM`, Name: "RPM", Historian: 1 },
		// 	],
		// });
		// console.log(`Created HistoryTransporter with tags: ${htWithTags.path.absolutePath()}`);

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
}

