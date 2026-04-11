/**
 * DataFrameExample
 *
 * Demonstrates building and transforming tabular data with DataFrame —
 * filtering, mapping, merging, joining, and CSV export.
 */

import { DataFrame } from "../../backend/src/std/DataFrame";


type Reading = {
	id: string;
	tag: string;
	value: number;
	unit: string;
	quality: number;
};

type Tag = {
	id: string;
	description: string;
	area: string;
};

type ReadingWithMeta = Reading & Tag;

export function main(): void {
	// --- Create from raw list ---
	const readings = DataFrame.fromList<Reading>([
		{ id: "R1", tag: "T01", value: 21.3, unit: "°C", quality: 192 },
		{ id: "R2", tag: "T02", value: 15.8, unit: "°C", quality: 192 },
		{ id: "R3", tag: "P01", value: 4.2,  unit: "bar", quality: 192 },
		{ id: "R4", tag: "T01", value: 23.1, unit: "°C", quality: 0   },
		{ id: "R5", tag: "F01", value: 12.0, unit: "m³/h", quality: 192 },
	]);

	console.log(`Total readings: ${readings.data.length}`);

	// --- filter: only good-quality readings ---
	const goodReadings = readings.filter((r) => r.quality === 192);
	console.log(`Good quality: ${goodReadings.data.length}`);

	// --- find: first matching row ---
	const firstTemp = readings.find({ unit: "°C" }) as Reading | undefined;
	console.log(`First temperature tag: ${firstTemp?.tag}`);

	// --- map: convert Celsius to Fahrenheit ---
	const fahrenheit = readings
		.filter((r) => r.unit === "°C")
		.map((r) => ({ ...r, value: r.value * 9 / 5 + 32, unit: "°F" }));
	console.log(`Converted to °F: ${fahrenheit.data.length} rows`);
	console.log(`T01 in °F: ${(fahrenheit.find({ tag: "T01" }) as Reading | undefined)?.value}`);

	// --- max: highest reading value ---
	const maxVal = readings.max("value");
	console.log(`Max reading value: ${maxVal}`);

	// --- getColumnData: extract a single column ---
	const tags = readings.getColumnData("tag");
	console.log(`All tags: ${tags.join(", ")}`);

	// --- forEach: iterate rows (mutates in place, return the row unchanged to inspect) ---
	readings.forEach((r) => {
		if (r.quality !== 192) {
			console.log(`Bad quality reading: ${r.tag} = ${r.value}`);
		}
		return r;
	});

	// --- slice: first 3 rows ---
	const firstThree = readings.slice(0, 3);
	console.log(`Sliced rows: ${firstThree.data.length}`);

	// --- append: combine two DataFrames ---
	const moreReadings = DataFrame.fromList<Reading>([
		{ id: "R6", tag: "T03", value: 18.5, unit: "°C", quality: 192 },
		{ id: "R7", tag: "P02", value: 6.1,  unit: "bar", quality: 192 },
	]);
	const allReadings = readings.append(moreReadings);
	console.log(`After append: ${allReadings.data.length} rows`);

	// --- merge: combine columns from two frames using a condition callback ---
	const tags2 = DataFrame.fromList<Tag>([
		{ id: "R1", description: "Inlet temperature", area: "Zone A" },
		{ id: "R2", description: "Outlet temperature", area: "Zone A" },
		{ id: "R3", description: "Inlet pressure",    area: "Zone B" },
	]);

	const enriched = readings.merge<Tag>(tags2, (r, t) => r.id === t.id);
	console.log(`Merged rows: ${enriched.data.length}`);
	console.log(`R1 description: ${(enriched.find({ id: "R1" }) as ReadingWithMeta | undefined)?.description}`);

	// --- join: merges matching rows and returns column-oriented object ---
	const joined = readings.join<Tag>(tags2, "id");
	console.log(`Joined keys: ${Object.keys(joined).join(", ")}`);

	// --- summary: prints column stats to console ---
	readings.summary();

	// --- toCsv ---
	const csv = goodReadings.toCsv();
	console.log("CSV output:");
	console.log(csv);
}
