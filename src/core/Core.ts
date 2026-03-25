import { IObject } from "../shared/IObject";
import { Path } from "../shared/Path";
import { ScriptLibrary } from "../objects/ScriptLibrary";
import { DataStoreConfiguration } from "../datastores/DataStoreConfiguration";
import { CoreChildren } from "../children/CoreChildren";

export type CoreOptions = Record<string, never>;

export class Core extends IObject {
    public readonly type: string = "Core";
    public readonly scriptLibrary: ScriptLibrary;
    public readonly dataStoreConfiguration: DataStoreConfiguration;
    public readonly children: CoreChildren;

    constructor(path?: string | number | Path, _opts?: CoreOptions) {
        const resolvedPath = path ?? (syslib.getcorepath() as string);
        super(resolvedPath, syslib.model.classes.Core);
        this.scriptLibrary = new ScriptLibrary(this);
        this.dataStoreConfiguration = new DataStoreConfiguration(this);
        this.children = new CoreChildren(() => this.path.absolutePath());
    }

    isMaster(): boolean {
        return syslib.getvalue(this.path.absolutePath() + ".inmationComponent.inmationComponentRole") === 3;
    }

    isLocal(): boolean {
        return syslib.getvalue(this.path.absolutePath() + ".inmationComponent.inmationComponentRole") === 1;
    }

    static appendable(parent: IObject, name: string, opts?: CoreOptions): Core {
        return new Core(parent.path.absolutePath() + "/" + name, opts);
    }
}
