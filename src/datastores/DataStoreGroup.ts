import { IObject } from "../shared/IObject";
import { Path } from "../shared/Path";
import { VariableAddFactory } from "../core/VariableAddFactory";

export type DataStoreGroupOptions = Record<string, never>;

export class DataStoreGroup extends IObject {
    type = "DataStoreGroup";
    add: VariableAddFactory;

    constructor(path: string | number | Path, _opts?: DataStoreGroupOptions) {
        super(path, syslib.model.classes.DataStoreGroup);
        this.add = new VariableAddFactory(() => this.path.absolutePath());

        if (!syslib.getobject(this.path.absolutePath())) {
            syslib.mass([{
                class: syslib.model.classes.DataStoreGroup,
                operation: syslib.model.codes.MassOp.UPSERT,
                path: this.path.absolutePath(),
                ObjectName: this.path.name(),
            }]);
        }
    }

    static appendable(parent: IObject, name: string, opts?: DataStoreGroupOptions): DataStoreGroup {
        return new DataStoreGroup(parent.path.absolutePath() + "/" + name, opts);
    }
}
