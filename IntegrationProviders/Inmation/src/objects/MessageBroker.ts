import { IObject } from "../shared/IObject";
import { Path } from "../shared/Path";
import { VariableChildren } from "../children/VariableChildren";

export type MessageBrokerOptions = {
    systemId?: number;
    skipMass?: boolean;
};

export class MessageBroker extends IObject {
    public readonly type: string = "MessageBroker";
    public readonly children: VariableChildren;

    constructor(path: string | number | Path, opts?: MessageBrokerOptions) {
        super(path, syslib.model.classes.MessageBroker);
        this.children = new VariableChildren(() => this.path.absolutePath());

        if (!opts?.skipMass && !syslib.getobject(this.path.absolutePath())) {
            const systemId = opts?.systemId ?? 8002;
            syslib.mass([{
                class: syslib.model.classes.MessageBroker,
                operation: syslib.model.codes.MassOp.UPSERT,
                path: this.path.absolutePath(),
                ObjectName: this.path.name(),
                "MBMessageTypeOptions.MSIOptions.MSISystemID": systemId,
                "MBMessageTypeOptions.MSIOptions.Debug": false,
                "MBMessageTypeOptions.MSIOptions.MSIFileFolder": "",
                "MBMessageTypeOptions.MSIOptions.MSIPrefix": "",
            }]);
        }
    }

    static appendable(parent: IObject, name: string, opts?: MessageBrokerOptions): MessageBroker {
        return new MessageBroker(parent.path.absolutePath() + "/" + name, opts);
    }
}
