/**
 * VariableExample
 *
 * Demonstrates creating Variables and VariableGroups, reading/writing values,
 * and configuring archiving via the Archive property.
 */

import { GenericFolder } from "../../IntegrationProviders/Inmation/src/objects/GenericFolder";
import { Variable } from "../../IntegrationProviders/Inmation/src/objects/Variable";
import { VariableGroup } from "../../IntegrationProviders/Inmation/src/objects/VariableGroup";


export function main(): void {
	const corePath = syslib.getcorepath();
	const rootPath = `${corePath}/examples/variables`;

	// Ensure parent folder exists
	const root = new GenericFolder(rootPath);

	// --- Standalone Variable with an initial value ---
	const speed = new Variable(`${rootPath}/Speed`, 0.0);
	console.log(`Created variable: ${speed.path.absolutePath()}`);

	// Write a value
	speed.setValue(42.5);
	console.log("Set speed to 42.5");

	// Read the value back
	const value = speed.getValue();
	console.log(`Speed value: ${value}`);

	// --- Configure archiving on the variable ---
	speed.archive.setRawHistory("enabled");
	speed.archive.persistencyMode("persist dynamic values immediately"); // persist periodically
	console.log("Configured archiving on speed variable");

	// --- VariableGroup groups related variables ---
	const motorGroup = new VariableGroup(`${rootPath}/Motor`);
	console.log(`Created variable group: ${motorGroup.path.absolutePath()}`);

	// Add children via the builder
	const rpm = motorGroup.children.Variable("RPM", 1500);
	const torque = motorGroup.children.Variable("Torque", 50.0);
	const nested = motorGroup.children.VariableGroup("Diagnostics");
	const temp = nested.children.Variable("Temperature", 65.0);

	console.log(`RPM: ${rpm.path.absolutePath()}`);
	console.log(`Torque: ${torque.path.absolutePath()}`);
	console.log(`Diagnostics group: ${nested.path.absolutePath()}`);
	console.log(`Temperature: ${temp.path.absolutePath()}`);

	// --- Static factory methods ---
	const flow = Variable.appendable(root, "Flow", 12.3);
	console.log(`Created via appendable: ${flow.path.absolutePath()}`);

	const sensors = VariableGroup.appendable(root, "Sensors");
	console.log(`Created group via appendable: ${sensors.path.absolutePath()}`);
}
