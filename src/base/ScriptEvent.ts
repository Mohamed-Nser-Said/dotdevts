import { IObject } from "./IObject";
import { Archive } from "./Archive";
import { Path } from "./Path";
import { VariableAddFactory } from "./VariableAddFactory";

export class ScriptEvent extends IObject {
        type = "ScriptEvent";
        archive: Archive;
        add: VariableAddFactory;

        constructor(path: string | number | Path) {
                super(path, syslib.model.classes.ScriptEvents);
                this.archive = new Archive(this);
                this.add = new VariableAddFactory(() => this.path.absolutePath());

                if (!syslib.getobject(this.path.absolutePath())) {
                        syslib.mass([{
                                class: syslib.model.classes.ScriptEvents,
                                operation: syslib.model.codes.MassOp.UPSERT,
                                path: this.path.absolutePath(),
                                ObjectName: this.path.name(),
                        }]);
                }
        }

        static appendable(parent: IObject, name: string): ScriptEvent {
                return new ScriptEvent(parent.path.absolutePath() + "/" + name);
        }
}
