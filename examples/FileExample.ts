/**
 * FileExample
 *
 * Demonstrates reading, writing, and navigating the file system via the File
 * utility — plain text, JSON, CSV, directory listing, and existence checks.
 */

import { File } from "../src/std/File";

export function main(): void {
    const baseDir = "./"

    // -------------------------------------------------------------------------
    // [0] Write a plain text file
    // -------------------------------------------------------------------------
    console.log("  [0] Write a plain text file");
    const textPath = baseDir + "/hello.txt";
    File.write(textPath, "Hello from inmation!\nLine 2\nLine 3");
    console.log("      Written:", textPath);

    // -------------------------------------------------------------------------
    // [1] Read it back
    // -------------------------------------------------------------------------
    console.log("  [1] Read file content");
    const content = File.read(textPath);
    console.log("      Content:", content);

    // -------------------------------------------------------------------------
    // [2] Read as lines
    // -------------------------------------------------------------------------
    console.log("  [2] Read as lines");
    const [lines] = File.readLines(textPath);
    console.log("      Line count:", lines.length);
    for (let i = 0; i < lines.length; i++) {
        console.log(`      [${i}] ${lines[i]}`);
    }

    // -------------------------------------------------------------------------
    // [3] Check file existence
    // -------------------------------------------------------------------------
    console.log("  [3] Check file/dir existence");
    console.log("      File exists:", File.exist(textPath));
    console.log("      Dir exists: ", File.dirExist(baseDir));
    console.log("      Missing:    ", File.exist(baseDir + "/no-such-file.txt"));

    // -------------------------------------------------------------------------
    // [4] Write and read back JSON
    // -------------------------------------------------------------------------
    console.log("  [4] Write and read JSON");
    const jsonPath = baseDir + "/config.json";
    const config = {
        version: "1.0",
        tags: ["T01", "T02", "P01"],
        interval: 60,
    };
    File.saveTableAsJson(jsonPath, config);
    const loaded = File.readJsonAsTable(jsonPath) as typeof config;
    console.log("      Version:", loaded.version);
    console.log("      Tags:   ", loaded.tags);

    // -------------------------------------------------------------------------
    // [5] Parse a CSV file
    // -------------------------------------------------------------------------
    console.log("  [5] Parse CSV");
    // Write a sample CSV first so the example is self-contained
    const csvPath = baseDir + "/sensors.csv";
    File.write(csvPath, [
        "name,value,unit",
        "Temperature,25.4,C",
        "Pressure,1.013,bar",
        "Flow,12.5,m3/h",
    ].join("\n"));

    const rows = File.parseCsv(csvPath);
    console.log("      Row count:", rows.length);
    for (const row of rows) {
        console.log(`      ${row["name"]}: ${row["value"]} ${row["unit"]}`);
    }

    // -------------------------------------------------------------------------
    // [6] Parse a CSV with a custom separator (semicolon)
    // -------------------------------------------------------------------------
    console.log("  [6] Parse CSV with custom separator");
    const csvSemiPath = baseDir + "/sensors-semi.csv";
    File.write(csvSemiPath, [
        "name;value;unit",
        "Temperature;25.4;C",
        "Pressure;1.013;bar",
    ].join("\n"));

    const semiRows = File.parseCsv(csvSemiPath, ";");
    console.log("      Row count:", semiRows.length);
    for (const row of semiRows) {
        console.log(`      ${row["name"]}: ${row["value"]} ${row["unit"]}`);
    }

    // -------------------------------------------------------------------------
    // [7] Create and remove directories
    // -------------------------------------------------------------------------
    console.log("  [7] Create and remove directories");
    const subDir = baseDir + "/temp/nested";
    File.mkDir(subDir, { recursive: true });
    console.log("      Created:", subDir, "| exists:", File.dirExist(subDir));

    File.rmDir(baseDir + "/temp", { recursive: true });
    console.log("      Removed:", baseDir + "/temp", "| exists:", File.dirExist(baseDir + "/temp"));

    // -------------------------------------------------------------------------
    // [8] List directory contents
    // -------------------------------------------------------------------------
    console.log("  [8] List directory");
    const files = File.readDir(baseDir, { fileOnly: true });
    console.log("      Files found:", files.length);
    for (const f of files) {
        console.log("      -", f);
    }

    console.log("  FileExample done.");
}
