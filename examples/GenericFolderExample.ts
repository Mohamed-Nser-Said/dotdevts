/**
 * GenericFolderExample
 *
 * Demonstrates creating folder hierarchies using GenericFolder.
 */

import { GenericFolder } from "../src/base/GenericFolder";


export function main(): void {
	const corePath = syslib.getcorepath();
	const rootPath = `${corePath}/examples/folders`;

	// --- Basic folder creation ---
	// Creates the full path recursively (massRecursive ensures parents exist)
	const root = new GenericFolder(rootPath);
	console.log(`Created root folder: ${root.path.absolutePath()}`);

	// --- Nested folders using .add builder ---
	const sensors = root.add.GenericFolder("Sensors");
	console.log(`Created child folder: ${sensors.path.absolutePath()}`);

	const temperature = sensors.add.GenericFolder("Temperature");
	console.log(`Created nested folder: ${temperature.path.absolutePath()}`);

	// --- Add variables directly via the builder ---
	const tempVar = temperature.add.Variable("TempSensor1", 21.5);
	console.log(`Created variable: ${tempVar.path.absolutePath()}`);

	const pressure = sensors.add.VariableGroup("Pressure");
	console.log(`Created variable group: ${pressure.path.absolutePath()}`);

	// --- static appendable factory ---
	const alarms = GenericFolder.appendable(root, "Alarms");
	console.log(`Created via appendable: ${alarms.path.absolutePath()}`);

	// --- cleanupExisting: delete and recreate ---
	const temp2 = new GenericFolder(`${rootPath}/Temp2`, { cleanupExisting: true });
	console.log(`Recreated folder: ${temp2.path.absolutePath()}`);

	// --- recursive: false — skip mass call (object must already exist) ---
	const existing = new GenericFolder(rootPath, { recursive: false });
	console.log(`Wrapped existing folder: ${existing.path.absolutePath()}`);
}
