/**
 * SystemDbExample
 *
 * Demonstrates syslib.getsystemdb() — a read-only SQLite3 handle to the inmation
 * system database.  The built-in `properties` table holds the current value of
 * every static property in the system, indexed by objid, property path, code,
 * value, position and modelcode.
 *
 * Use cases covered:
 *  1. Find all objects whose ObjectName matches a given string.
 *  2. Find all Variable objects (by class code) under a specific path.
 *  3. Query a JSON-encoded property value using the SQLite3 JSON1 extension.
 *  4. Count objects grouped by class with a summary report.
 */

export function main(): void {
    const db = syslib.getsystemdb();
    const corePath = syslib.getcorepath();

    // -------------------------------------------------------------------------
    // 1. Find all objects named "SensorA" anywhere in the system
    // -------------------------------------------------------------------------
    console.log("--- 1. Find objects by ObjectName ---");

    const targetName = "SensorA";
    const nameCode = syslib.model.properties.ObjectName;
    const [nameCur, nameErr] = db.query(
        `SELECT objid, value FROM properties WHERE code IS ${nameCode} AND value IS '${targetName}'`
    );

    if (nameErr) {
        console.log(`Query error: ${nameErr}`);
    } else {
        let row = nameCur.fetch({}, "a");
        if (!row) {
            console.log(`No objects named '${targetName}' found.`);
        }
        while (row) {
            const obj = syslib.getobject(row.objid as number);
            if (obj) {
                console.log(`  Found '${targetName}' at: ${obj.path()}`);
            }
            row = nameCur.fetch(row, "a");
        }
    }

    // -------------------------------------------------------------------------
    // 2. Find all Variable objects under the core (filter by class model code)
    // -------------------------------------------------------------------------
    console.log("--- 2. Find all Variable objects ---");

    const variableClass = syslib.model.classes.Variable;
    const objTypeCode = syslib.model.properties.ObjType;
    const [varCur, varErr] = db.query(
        `SELECT DISTINCT objid FROM properties WHERE code IS ${objTypeCode} AND value IS ${variableClass}`
    );

    if (varErr) {
        console.log(`Query error: ${varErr}`);
    } else {
        let varCount = 0;
        let varRow = varCur.fetch({}, "a");
        while (varRow) {
            const obj = syslib.getobject(varRow.objid as number);
            if (obj) {
                const objPath = obj.path();
                // Limit output — only log those directly under the core
                if (objPath.indexOf(corePath) === 0) {
                    console.log(`  Variable: ${objPath}`);
                    varCount++;
                    if (varCount >= 10) {
                        console.log("  ... (showing first 10 only)");
                        break;
                    }
                }
            }
            varRow = varCur.fetch(varRow, "a");
        }
        console.log(`  Total shown: ${varCount}`);
    }

    // -------------------------------------------------------------------------
    // 3. Query a JSON-encoded property using the JSON1 extension
    //    Example: find objects where the custom table's first row has firstname = "John"
    //    (Assumes a TableHolder with a CustomTables.TableData property exists)
    // -------------------------------------------------------------------------
    console.log("--- 3. JSON1 extension — query inside JSON property values ---");

    const tableDataCode = syslib.model.properties.TableData;
    const [jsonCur, jsonErr] = db.query(
        `SELECT objid FROM properties WHERE code IS ${tableDataCode} ` +
        `AND json_extract(value, '$.data.firstname[0]') = 'John'`
    );

    if (jsonErr) {
        console.log(`Query error (likely no TableData properties): ${jsonErr}`);
    } else {
        let jsonRow = jsonCur.fetch({}, "a");
        if (!jsonRow) {
            console.log("  No TableHolder objects with firstname='John' found.");
        }
        while (jsonRow) {
            const obj = syslib.getobject(jsonRow.objid as number);
            if (obj) {
                console.log(`  TableHolder with firstname='John': ${obj.path()}`);
            }
            jsonRow = jsonCur.fetch(jsonRow, "a");
        }
    }

    // -------------------------------------------------------------------------
    // 4. Count objects by class — summary report
    //    Uses GROUP BY on the modelcode column (class model code of each object).
    //    modelcode maps to syslib.model.classes.* values.
    // -------------------------------------------------------------------------
    console.log("--- 4. Object count grouped by class ---");

    const [groupCur, groupErr] = db.query(
        `SELECT modelcode, COUNT(DISTINCT objid) AS cnt ` +
        `FROM properties ` +
        `GROUP BY modelcode ` +
        `ORDER BY cnt DESC ` +
        `LIMIT 10`
    );

    if (groupErr) {
        console.log(`Query error: ${groupErr}`);
    } else {
        const classes = syslib.model.classes as unknown as Record<string, number>;

        // Reverse-map: numeric code → class name
        const classNameMap: Record<number, string> = {};
        for (const name in classes) {
            const code = classes[name];
            if (typeof code === "number") {
                classNameMap[code] = name;
            }
        }

        let groupRow = groupCur.fetch({}, "a");
        while (groupRow) {
            const code = groupRow.modelcode as number;
            const count = groupRow.cnt as number;
            const className = classNameMap[code] ?? `class(${code})`;
            console.log(`  ${className}: ${count} object(s)`);
            groupRow = groupCur.fetch(groupRow, "a");
        }
    }

    // -------------------------------------------------------------------------
    // 5. Locate objects by property path (without knowing the code)
    //    Find any object that has its ArchiveOptions.StorageStrategy set to 1
    // -------------------------------------------------------------------------
    console.log("--- 5. Find objects by property path and value ---");

    const [archCur, archErr] = db.query(
        `SELECT objid FROM properties WHERE path IS '.ArchiveOptions.StorageStrategy' AND value IS 1`
    );

    if (archErr) {
        console.log(`Query error: ${archErr}`);
    } else {
        let archRow = archCur.fetch({}, "a");
        let archCount = 0;
        while (archRow) {
            const obj = syslib.getobject(archRow.objid as number);
            if (obj) {
                console.log(`  Historizing object: ${obj.path()}`);
                archCount++;
                if (archCount >= 5) {
                    console.log("  ... (showing first 5 only)");
                    break;
                }
            }
            archRow = archCur.fetch(archRow, "a");
        }
        if (archCount === 0) {
            console.log("  No historizing objects found.");
        }
    }
}
