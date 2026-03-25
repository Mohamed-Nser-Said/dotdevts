import { IObject } from "../shared/IObject";
import { Path } from "../shared/Path";
import { DataStoreConfiguration } from "./DataStoreConfiguration";
import { VariableAddFactory } from "../core/VariableAddFactory";
import { IDataStore } from "../Interfaces/IDataStore";
import { inmationMongoConnectionString } from "./mongoConnectionString";

export type CustomEventDataStoreOptions = {
	connectionString?: string | { port: number; host: string };
    database?: string;
    collection?: string;
    registerAsDataStore?: boolean;
    /** Pass a Core/IObject instance or a core path string. Defaults to syslib.getcorepath(). */
    core?: IObject | string;
    skipMass?: boolean;
};

export class CustomEventDataStore extends IObject implements IDataStore {
    public readonly type = "CustomEventDataStore";
    public readonly dataStoreConfiguration: DataStoreConfiguration;
    public readonly add: VariableAddFactory;

    constructor(path: string | number | Path, opts?: CustomEventDataStoreOptions) {
        super(path, syslib.model.classes.CustomEventDataStore);
        this.add = new VariableAddFactory(() => this.path.absolutePath());
        const connectionString = inmationMongoConnectionString(opts?.connectionString, "mongodbGP1:27017");

        if (!opts?.skipMass && !syslib.getobject(this.path.absolutePath())) {
            syslib.mass([{
                class: syslib.model.classes.CustomEventDataStore,
                ProcessMode: syslib.model.codes.ProcessMode.PM_OPERATION,
                operation: syslib.model.codes.MassOp.UPSERT,
                path: this.path.absolutePath(),
                ObjectName: this.path.name(),
                "CustomEventStore.MongoDBConnection.MongoDbAllowInvalidCertificates": false,
                "CustomEventStore.MongoDBConnection.MongoDbAllowInvalidHostnames": false,
                "CustomEventStore.MongoDBConnection.MongoDbUseTLS": false,
                "CustomEventStore.MongoDBConnection.MongoDbUseCompression": false,
                "CustomEventStore.EventPurgeOptions": syslib.model.codes.EventPurgeOptions.DO_NOT_PURGE,
                "CustomEventStore.MongoDBConnection.ConnectionString": connectionString,
                "CustomEventStore.CustomEventCollection": opts?.collection ?? "custom_event_store",
                "CustomEventStore.CustomEventDatabase": opts?.database ?? "inmation_event_db",
            }]);
        }
        // Refresh after potential mass — super() may have cached undefined for an object mass just created
        this.object = syslib.getobject(this.path.absolutePath()) as SysLib.Model.Object | undefined;

        const corePath = typeof opts?.core === "string"
            ? opts.core
            : opts?.core?.path.absolutePath() ?? (syslib.getcorepath() as string);
        this.dataStoreConfiguration = new DataStoreConfiguration({ path: new Path(corePath) } as unknown as IObject);

        if (opts?.registerAsDataStore) {
            this.dataStoreConfiguration.addDataStore(this);
        }
    }

    _uniqueID(): number {
        return 3;
    }

    /** {@inheritDoc IDataStore.getId} */
    getId(core?: IObject): number {
        const dsc = core ? new DataStoreConfiguration(core) : this.dataStoreConfiguration;
        const sets = dsc.getDataStoreSets().data;
        for (const row of sets) {
            if (row.name === this.path.name()) return row.rowid;
        }
        throw new Error("DataStore with name '" + this.path.name() + "' not found");
    }

    static appendable(parent: IObject, name: string, opts?: CustomEventDataStoreOptions): CustomEventDataStore {
        return new CustomEventDataStore(parent.path.absolutePath() + "/" + name, opts);
    }
}
