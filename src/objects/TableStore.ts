import { IObject } from "../shared/IObject";
import { Path } from "../shared/Path";
import { TableHolder } from "./TableHolder";
import { DataFrame } from "../std/DataFrame";
import { Query } from "../std/Query";

/**
 * TableStore — a named collection of TableHolders under a single GenericFolder.
 *
 * Treats a folder in the inmation model as a lightweight relational store:
 * each table is a child TableHolder identified by name.
 *
 * Usage:
 *   const store = new TableStore("/System/Core/MyStore");
 *   store.set("Products", [{ id: 1, name: "Pump" }]);
 *   store.set("Orders",   [{ id: 1, productId: 1, qty: 3 }]);
 *
 *   const products = store.get<Product>("Products");
 */
export class TableStore extends IObject {
    type = "TableStore";

    constructor(path: string | number | Path) {
        super(path, syslib.model.classes.GenFolder);

        if (!syslib.getobject(this.path.absolutePath())) {
            syslib.mass([{
                class: syslib.model.classes.GenFolder,
                operation: syslib.model.codes.MassOp.UPSERT,
                path: this.path.absolutePath(),
                ObjectName: this.path.name(),
            }]);
        }
    }

    /** Write (or overwrite) a named table. */
    set<T>(name: string, data: T[] | DataFrame<T>): void {
        const th = new TableHolder(this.path.absolutePath() + "/" + name);
        th.setTable(data);
        this.addToIndex(name);
    }

    /** Read a named table back as a DataFrame. */
    get<T>(name: string): DataFrame<T> {
        const th = new TableHolder(this.path.absolutePath() + "/" + name);
        return th.getTable<T>();
    }

    /** Read a named table back as a chainable Query. */
    query<T>(name: string): Query<T> {
        return Query.from<T>(this.get<T>(name).data);
    }

    /** List the names of all tables in this store. */
    tables(): string[] {
        const index = new TableHolder(this.path.absolutePath() + "/_index");
        const rows = index.getTable<{ name: string }>().data;
        const names: string[] = [];
        for (const row of rows) names.push(row.name);
        return names;
    }

    private addToIndex(name: string): void {
        const index = new TableHolder(this.path.absolutePath() + "/_index");
        const rows = index.getTable<{ name: string }>().data;
        for (const row of rows) {
            if (row.name === name) return;
        }
        rows.push({ name });
        index.setTable(rows);
    }

    static appendable(parent: IObject, name: string): TableStore {
        return new TableStore(parent.path.absolutePath() + "/" + name);
    }
}
