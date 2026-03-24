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

/** Options for reading documents from the underlying MongoDB collection. */
export type CustomTimeSeriesCollectionReadOptions = {
    /** MongoDB query/filter. */
    query?: Mongo.Query;
    /** Query options such as sort/skip/limit. */
    options?: Mongo.FindOptions;
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

    /**
     * Returns the underlying lua-mongo Collection handle for this data store.
     *
     * Note: the runtime object comes from `syslib.getmongoconnection()`. We cast
     * it to the richer `Mongo.Collection` interface so consumers can use typed
     * query/options (e.g. `find(query, { sort, limit })`).
     */
    getCollection(): Mongo.Collection {
        const [client, database, collection] = syslib.getmongoconnection(this.path.absolutePath());
        return client.getCollection(database, collection) as unknown as Mongo.Collection;
    }

    /**
     * Returns an iterator over matching documents.
     *
     * This is the most allocation-friendly option when you want to stream docs.
     */
    findIterator<T = Mongo.Document, U = T>(
        query?: Mongo.Query,
        options?: Mongo.FindOptions,
        map?: (doc: unknown) => U,
    ): Mongo.LuaIterator<U> {
        const cursor = this.getCollection().find<T>(query, options);
        return map ? cursor.iterator(map) : (cursor.iterator() as unknown as Mongo.LuaIterator<U>);
    }

    /**
     * Returns all matching documents as an array.
     *
     * If you want to transform documents as you read them, pass `map`.
     */
    findAll<T = Mongo.Document, U = T>(
        query?: Mongo.Query,
        options?: Mongo.FindOptions,
        map?: (doc: unknown) => U,
    ): U[] {
        const iter = this.findIterator<T, U>(query, options, map);
        const out: U[] = [];
        while (true) {
            const doc = iter();
            if (doc === undefined) break;
            out.push(doc);
        }
        return out;
    }

    /** Convenience alias for `findAll({ query, options })`. */
    read<T = Mongo.Document>(opts?: CustomTimeSeriesCollectionReadOptions): T[] {
        return this.findAll<T>(opts?.query, opts?.options);
    }

    /**
     * Finds a single document and unwraps the BSON wrapper to a plain JS/Lua table.
     *
     * Returns `undefined` when no document matches.
     */
    findOneValue<T = Mongo.Document, U = T>(
        query?: Mongo.Query,
        options?: Mongo.FindOptions,
        map?: (doc: unknown) => U,
    ): U | undefined {
        const bson = this.getCollection().findOne<T>(query, options);
        if (!bson) return undefined;
        return map ? bson.value(map) : (bson.value() as unknown as U);
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
