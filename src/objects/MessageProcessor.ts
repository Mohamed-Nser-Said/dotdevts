import { IObject } from "../shared/IObject";
import { Path } from "../shared/Path";
import { HistorianMapping } from "../history/HistorianMapping";
import { VariableChildren } from "../children/VariableChildren";

export type MessageProcessorOptions = {
    skipMass?: boolean;
};

export class MessageProcessor extends IObject {
    public readonly type: string = "MessageProcessor";
    public readonly historianMapping: HistorianMapping;
    public readonly children: VariableChildren;

    constructor(path: string | number | Path, opts?: MessageProcessorOptions) {
        super(path, syslib.model.classes.MessageProcessor);

        this.historianMapping = new HistorianMapping(this);
        this.children = new VariableChildren(() => this.path.absolutePath());

        if (!opts?.skipMass && !syslib.getobject(this.path.absolutePath())) {
            syslib.mass([{
                class: syslib.model.classes.MessageProcessor,
                operation: syslib.model.codes.MassOp.UPSERT,
                path: this.path.absolutePath(),
                ObjectName: this.path.name(),
                MSIMsgProcAutoGenerateMapping: false,
            }]);
        }
    }

    static appendable(parent: IObject, name: string, opts?: MessageProcessorOptions): MessageProcessor {
        return new MessageProcessor(parent.path.absolutePath() + "/" + name, opts);
    }
}
