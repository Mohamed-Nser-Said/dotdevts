import { IObject } from "../shared/IObject";
import { Path } from "../shared/Path";
import { DataFrame } from "../std/DataFrame";

export class TableHolder extends IObject {
        public readonly type: string = "TableHolder";

        constructor(path: string | number | Path) {
                super(path, syslib.model.classes.TableHolder);

                if (!syslib.getobject(this.path.absolutePath())) {
                        syslib.mass([{
                                class: syslib.model.classes.TableHolder,
                                operation: syslib.model.codes.MassOp.UPSERT,
                                path: this.path.absolutePath(),
                                ObjectName: this.path.name(),
                        }]);
                }
        }

        setTable<T>(data: T[] | DataFrame<T>): void {
                const df = data instanceof DataFrame ? data : new DataFrame<T>(data as T[]);
                syslib.mass([{
                        class: syslib.model.classes.TableHolder,
                        operation: syslib.model.codes.MassOp.UPSERT,
                        path: this.path.absolutePath(),
                        ObjectName: this.path.name(),
                        TableData: df.toJsonInmation(),
                }]);
        }

        getTable<T>(): DataFrame<T> {
                const rows = syslib.getvalue(this.path.absolutePath() + ".TableData") as T[] | undefined;
                if (!rows) return new DataFrame<T>([]);
                return new DataFrame<T>(rows);
        }

        static appendable(parent: IObject, name: string): TableHolder {
                return new TableHolder(parent.path.absolutePath() + "/" + name);
        }
}
