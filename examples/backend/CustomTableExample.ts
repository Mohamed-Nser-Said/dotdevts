/**
 * CustomTableExample
 *
 * Demonstrates storing and retrieving structured data using CustomTable,
 * which persists rows attached to any inmation object's custom options.
 */

import { CustomTable } from "../../backend/src/shared/CustomTable";
import { GenericFolder } from "../../backend/src/objects/GenericFolder";
import { DataFrame } from "../../backend/src/std/DataFrame";


type Product = {
	id: string;
	name: string;
	price: number;
	category: string;
};

export function main(): void {
	const corePath = syslib.getcorepath();
	const folderPath = `${corePath}/examples/custom-table`;

	// Host object — CustomTable persists on this object's CustomOptions
	const folder = new GenericFolder(folderPath);
	const table = folder.customTable as CustomTable<Product>;

	// --- Add or update a named table with raw row data ---
	table.addOrUpdateTable("Electronics", [
		{ id: "E1", name: "Sensor A", price: 120.0, category: "Electronics" },
		{ id: "E2", name: "Controller B", price: 340.0, category: "Electronics" },
		{ id: "E3", name: "Gateway C", price: 890.0, category: "Electronics" },
	]);
	console.log(`Tables count: ${table.count()}`);

	// --- Add a second table using a DataFrame ---
	const mechanicalDf = DataFrame.fromList<Product>([
		{ id: "M1", name: "Valve X", price: 55.0, category: "Mechanical" },
		{ id: "M2", name: "Pump Y", price: 210.0, category: "Mechanical" },
	]);
	table.addOrUpdateTable("Mechanical", mechanicalDf);
	console.log(`Tables after second add: ${table.count()}`);

	// --- Add multiple tables at once ---
	table.addOrUpdateMany({
		Sensors: [
			{ id: "S1", name: "PH Sensor", price: 75.0, category: "Sensors" },
			{ id: "S2", name: "Flow Meter", price: 300.0, category: "Sensors" },
		],
		Actuators: [
			{ id: "A1", name: "Motor Drive", price: 480.0, category: "Actuators" },
		],
	});
	console.log(`Tables after bulk add: ${table.count()}`);
	console.log(`Table names: ${table.getTableNames().join(", ")}`);

	// --- Retrieve a table as a DataFrame for querying ---
	const electronics = table.get("Electronics");
	console.log(`Electronics rows: ${electronics.data.length}`);

	const expensive = electronics.filter((row) => row.price > 200);
	console.log(`Expensive electronics: ${expensive.data.length}`);

	const byId = electronics.find({ id: "E1" }) as Product | undefined;
	console.log(`Found: ${byId?.name}`);

	// --- Retrieve by index ---
	const firstTable = table.getByIndex(0);
	console.log(`First table row count: ${firstTable.data.length}`);

	// --- Update existing table ---
	table.addOrUpdateTable("Electronics", [
		{ id: "E1", name: "Sensor A v2", price: 135.0, category: "Electronics" },
	]);
	const updated = table.get("Electronics");
	console.log(`Updated Electronics: ${updated.data[0]?.name}`);

	// --- Rename a table ---
	table.updateTableName("Mechanical", "Mechanical_v2");
	console.log(`Renamed table names: ${table.getTableNames().join(", ")}`);

	// --- Clear a table (keep the entry, empty the rows) ---
	table.clearTable("Actuators");
	const cleared = table.get("Actuators");
	console.log(`Actuators after clear: ${cleared.data.length} rows`);

	// --- Remove a table entirely ---
	table.remove("Sensors");
	console.log(`Tables after remove: ${table.count()}`);

	// --- Remove all tables ---
	// table.removeAll();
	console.log(`Tables after removeAll: ${table.count()}`);
}
