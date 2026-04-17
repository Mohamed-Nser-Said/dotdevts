import { IObject } from "../shared/IObject";
import { Path } from "../shared/Path";
import { VariableChildren } from "../children/VariableChildren";

export type DataStoreGroupOptions = Record<string, never>;

export class DataStoreGroup extends IObject {
    public readonly type: string = "DataStoreGroup";
    public readonly children: VariableChildren;

    constructor(path: string | number | Path, _opts?: DataStoreGroupOptions) {
        super(path, syslib.model.classes.DataStoreGroup);
        this.children = new VariableChildren(() => this.path.absolutePath());

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
