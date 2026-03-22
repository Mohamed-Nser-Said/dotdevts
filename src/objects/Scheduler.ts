import { IObject } from "../shared/IObject";
import { Path } from "../shared/Path";

export class Scheduler extends IObject {
        type = "Scheduler";

        constructor(path: string | number | Path) {
                super(path, syslib.model.classes.SchedulerItem);

                if (!syslib.getobject(this.path.absolutePath())) {
                        syslib.mass([{
                                class: syslib.model.classes.SchedulerItem,
                                operation: syslib.model.codes.MassOp.UPSERT,
                                path: this.path.absolutePath(),
                                ObjectName: this.path.name(),
                        }]);
                }
        }

        static appendable(parent: IObject, name: string): Scheduler {
                return new Scheduler(parent.path.absolutePath() + "/" + name);
        }
}
