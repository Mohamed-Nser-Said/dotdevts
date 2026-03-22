import { IObject } from "../shared/IObject";
import { Path } from "../shared/Path";

export type HistoryTransferControllerOptions = {
    skipMass?: boolean;
};

export class HistoryTransferController extends IObject {
    type = "HistoryTransferController";

    constructor(path: string | number | Path, opts?: HistoryTransferControllerOptions) {
        super(path, syslib.model.classes.HistoryController);

        if (!opts?.skipMass && !syslib.getobject(this.path.absolutePath())) {
            syslib.mass([{
                class: syslib.model.classes.HistoryController,
                operation: syslib.model.codes.MassOp.UPSERT,
                path: this.path.absolutePath(),
                ObjectName: this.path.name(),
                "AuxStateManagement.AuxStateChangeStrategy": syslib.model.codes.AuxStateChangeStrategy.INHIBIT,
                DedicatedThreadExecution: true,
                ActivationMode: 1,
            }]);
        }
    }

    static appendable(parent: IObject, name: string, opts?: HistoryTransferControllerOptions): HistoryTransferController {
        return new HistoryTransferController(parent.path.absolutePath() + "/" + name, opts);
    }
}
