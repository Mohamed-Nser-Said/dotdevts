import { IObject } from "../shared/IObject";
import { Path } from "../shared/Path";

export type OPCUATag = {
        id: string;
        name: string;
};

export class OPCUA {
        path: Path;

        constructor(path: string | Path) {
                this.path = path instanceof Path ? path : new Path(path);
        }

        getAvailableTags(): OPCUATag[] {
                return [];
        }

        static appendable(parent: IObject, name: string): OPCUA {
                return new OPCUA(parent.path.absolutePath() + "/" + name);
        }
}
