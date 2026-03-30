import { GenericFolder } from "../src/objects/GenericFolder";
import { TableHolder } from "../src/objects/TableHolder";


export function main(): void {
        const basePath = "/System/Core/TableHolderExample";

        console.log("  [0] Create parent folder");
        const parent = new GenericFolder(basePath, { cleanupExisting: true });
        console.log("      Parent:", parent.path.absolutePath());

        console.log("  [1] Create TableHolder");
        const th = new TableHolder(basePath + "/MyTableHolder");
        console.log("      Created:", th.path.absolutePath());
        console.log("      Type:", th.type);

        console.log("  [2] Set a table of data");
        const tableData = [
                { name: "Temperature", value: 25.4, unit: "C" },
                { name: "Pressure", value: 1.013, unit: "bar" },
                { name: "Flow", value: 12.5, unit: "m3/h" },
        ];
        th.setTable(tableData);
        console.log("      Table data set.");

        console.log("  [3] Get the table back");
        const result = th.getTable();
        console.log("      Rows retrieved:", result.nrow());
        result.print();

        console.log("  [4] Use GenericFolder.children.TableHolder shorthand");
        const gf = new GenericFolder(basePath + "/SubFolder");
        const th2 = gf.add.TableHolder("Config");
        th2.setTable([{ key: "value", count: 42 }]);
        console.log("      Config TableHolder:", th2.path.absolutePath());

        console.log("  TableHolderExample done.");
}
