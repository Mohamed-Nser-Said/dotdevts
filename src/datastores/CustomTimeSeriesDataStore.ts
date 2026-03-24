import { IObject } from "../shared/IObject";
import { Path } from "../shared/Path";
import { DataStoreConfiguration } from "./DataStoreConfiguration";
import { VariableAddFactory } from "../core/VariableAddFactory";

export type CustomTimeSeriesDataStoreOptions = {
    connection: string | { port: number, host: string }
    database?: string;
    collection?: string;
    registerAsDataStore?: boolean;
    /** Pass a Core/IObject instance or a core path string. Defaults to syslib.getcorepath(). */
    core?: IObject | string;
    skipMass?: boolean;
};

export class CustomTimeSeriesDataStore extends IObject {
    public readonly type = "CustomTimeSeriesDataStore";
    public readonly dataStoreConfiguration: DataStoreConfiguration;
    public readonly add: VariableAddFactory;

    constructor(path: string | number | Path, opts?: CustomTimeSeriesDataStoreOptions) {
        super(path, syslib.model.classes.CustomTimeSeriesDataStore);
        this.add = new VariableAddFactory(() => this.path.absolutePath());
        const connectionString = typeof (opts?.connection) == "string" ? opts?.connection : `${opts?.connection?.host}:${opts?.connection?.port}`
        if (!opts?.skipMass && !syslib.getobject(this.path.absolutePath())) {
            syslib.mass([{
                class: syslib.model.classes.CustomTimeSeriesDataStore,
                operation: syslib.model.codes.MassOp.UPSERT,
                path: this.path.absolutePath(),
                ObjectName: this.path.name(),
                "CustomTimeSeriesStore.MongoDBConnection.MongoDbAllowInvalidCertificates": false,
                "CustomTimeSeriesStore.MongoDBConnection.MongoDbAllowInvalidHostnames": false,
                "CustomTimeSeriesStore.MongoDBConnection.MongoDbUseTLS": false,
                "CustomTimeSeriesStore.MongoDBConnection.MongoDbUseCompression": false,
                "CustomTimeSeriesStore.MongoDBConnection.ConnectionString": connectionString ?? "mongodbGP1:27017",
                "CustomTimeSeriesStore.TimeSeriesCollection": opts?.collection ?? "custom_time_series",
                "CustomTimeSeriesStore.TimeSeriesDatabase": opts?.database ?? "inmation_timeseries_db",
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
        return 1;
    }

    /**
     * Returns a live connection to this store's MongoDB backend.
     *
     * Wraps `syslib.getmongoconnection(objspec)` and exposes the three return
     * values as named fields for convenience.
     *
     * @see https://docs.inmation.com/api/1.100/lua/functions.html#getmongoconnection
     */
    getMongoConnection(): { client: SysLib.MongoClient; database: string; collection: string } {
        const [client, database, collection] = syslib.getmongoconnection(this.path.absolutePath());
        return { client, database, collection };
    }

    getCollection() {
        const [client, database, collection] = syslib.getmongoconnection(this.path.absolutePath());
        return client.getCollection(database, collection);
    }

    getId(core?: IObject): number {
        const dsc = core ? new DataStoreConfiguration(core) : this.dataStoreConfiguration;
        const sets = dsc.getDataStoreSets().data;
        for (const row of sets) {
            if (row.name === this.path.name()) return row.rowid;
        }
        throw new Error("DataStore with name '" + this.path.name() + "' not found");
    }

    delete(silent?: boolean): boolean {
        this.dataStoreConfiguration.removeDataStore(this);
        return super.delete(silent);
    }

    static appendable(parent: IObject, name: string, opts?: CustomTimeSeriesDataStoreOptions): CustomTimeSeriesDataStore {
        return new CustomTimeSeriesDataStore(parent.path.absolutePath() + "/" + name, opts);
    }
}
