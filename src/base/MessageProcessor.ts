import { IObject } from "./IObject";
import { Path } from "./Path";
import { HistorianMapping } from "./HistorianMapping";
import { VariableAddFactory } from "./VariableAddFactory";

export type MessageProcessorOptions = {
    skipMass?: boolean;
};

export class MessageProcessor extends IObject {
    type = "MessageProcessor";
    historianMapping: HistorianMapping;
    add: VariableAddFactory;

    constructor(path: string | number | Path, opts?: MessageProcessorOptions) {
        super(path, syslib.model.classes.MessageProcessor);

        this.historianMapping = new HistorianMapping(this);
    this.add = new VariableAddFactory(() => this.path.absolutePath());

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
