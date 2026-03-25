import { IObject } from "../shared/IObject";
import { Path } from "../shared/Path";
import { Archive } from "../history/Archive";
import { VariableAddFactory } from "../core/VariableAddFactory";

export type GenericItemOptions = {
    period?: number;
    decimalPlaces?: number;
    dedicatedThreadExecution?: boolean;
    skipMass?: boolean;
};

export class GenericItem extends IObject {
    public readonly type: string = "GenericItem";
    public readonly archive: Archive;
    public readonly add: VariableAddFactory;

    constructor(path: string | number | Path, opts?: GenericItemOptions) {
        super(path, syslib.model.classes.GenItem);

        this.archive = new Archive(this);
        this.add = new VariableAddFactory(() => this.path.absolutePath());

        if (!opts?.skipMass && !syslib.getobject(this.path.absolutePath())) {
            syslib.mass([{
                class: syslib.model.classes.GenItem,
                operation: syslib.model.codes.MassOp.UPSERT,
                path: this.path.absolutePath(),
                ObjectName: this.path.name(),
                DecimalPlaces: opts?.decimalPlaces ?? 0,
                DedicatedThreadExecution: opts?.dedicatedThreadExecution !== false,
                GenerationPeriod: opts?.period ?? 0,
            }]);
        }
    }

    static appendable(parent: IObject, name: string, opts?: GenericItemOptions): GenericItem {
        return new GenericItem(parent.path.absolutePath() + "/" + name, opts);
    }
}
