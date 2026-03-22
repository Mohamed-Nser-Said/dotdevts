import { IObject } from "./IObject";
import { Path } from "./Path";
import { VariableAddFactory } from "./VariableAddFactory";

export type MessageBrokerOptions = {
    systemId?: number;
    skipMass?: boolean;
};

export class MessageBroker extends IObject {
    type = "MessageBroker";
    add: VariableAddFactory;

    constructor(path: string | number | Path, opts?: MessageBrokerOptions) {
        super(path, syslib.model.classes.MessageBroker);
        this.add = new VariableAddFactory(() => this.path.absolutePath());

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
