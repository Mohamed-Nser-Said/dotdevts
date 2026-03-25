import { IObject } from "../shared/IObject";
import { Archive } from "../history/Archive";
import { Path } from "../shared/Path";
import { VariableChildren } from "../children/VariableChildren";

export class ScriptEvent extends IObject {
        public readonly type: string = "ScriptEvent";
        public readonly archive: Archive;
        public readonly children: VariableChildren;

        constructor(path: string | number | Path) {
                super(path, syslib.model.classes.ScriptEvents);
                this.archive = new Archive(this);
                this.children = new VariableChildren(() => this.path.absolutePath());

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
