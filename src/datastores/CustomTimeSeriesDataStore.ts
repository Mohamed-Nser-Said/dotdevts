import { IObject } from "../shared/IObject";
import { Path } from "../shared/Path";
import { DataStoreConfiguration } from "./DataStoreConfiguration";
import { VariableAddFactory } from "../core/VariableAddFactory";
import { mq, MongoQueryBuilder } from "../std/MongoQuery";
import { IDataStore } from "../Interfaces/IDataStore";
import { inmationMongoConnectionString } from "./mongoConnectionString";

export type CustomTimeSeriesDataStoreOptions = {
	/** `host:port` string or `{ host, port }`; omit for default lab host (see {@link inmationMongoConnectionString}). */
	connection?: string | { port: number; host: string };
    database?: string;
    collection?: string;
    registerAsDataStore?: boolean;
    /** Pass a Core/IObject instance or a core path string. Defaults to syslib.getcorepath(). */
    core?: IObject | string;
    skipMass?: boolean;
};

/** Options for reading documents from the underlying MongoDB collection. */
export type CustomTimeSeriesCollectionReadOptions<T extends Mongo.Document = Mongo.Document> = {
    /** MongoDB query/filter. */
    query?: Mongo.Query<T>;
    /** Query options such as sort/skip/limit. */
    options?: Mongo.FindOptions;
};

/**
 * Mongo-backed **custom time-series** store object plus typed read helpers (`query`, `findAll`, …).
 *
 * - **Registration**: `registerAsDataStore: true` adds a row on the Core’s {@link DataStoreConfiguration}.
 * - **Archive wiring**: pass this instance to `Variable.archive.setDataStore(store)` (see `Archive` in `history/Archive.ts`).
 *   {@link getId} yields the **row id** for `ArchiveSelector`, not the lua-mongo connection id.
 */
export class CustomTimeSeriesDataStore extends IObject implements IDataStore {
    public readonly type = "CustomTimeSeriesDataStore";
    public readonly dataStoreConfiguration: DataStoreConfiguration;
    public readonly add: VariableAddFactory;

    constructor(path: string | number | Path, opts?: CustomTimeSeriesDataStoreOptions) {
        super(path, syslib.model.classes.CustomTimeSeriesDataStore);
        this.add = new VariableAddFactory(() => this.path.absolutePath());
        const connectionString = inmationMongoConnectionString(opts?.connection, "mongodbGP1:27017");

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
                "CustomTimeSeriesStore.MongoDBConnection.ConnectionString": connectionString,
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
    findIterator<T extends Mongo.Document = Mongo.Document, U = T>(
        query?: Mongo.Query<T>,
        options?: Mongo.FindOptions,
        map?: (doc: unknown) => U,
    ): Mongo.LuaIterator<U> {
        // lua-mongo does not accept `nil` for the query argument; use an empty
        // filter when the caller does not provide one.
        const q = (query ?? ({} as unknown as Mongo.Query<T>));
        const cursor = this.getCollection().find<T>(q, options);

        // Important: the lua-mongo `cursor:iterator()` API is designed for Lua's
        // generic-for protocol and returns an iterator function that expects the
        // cursor userdata as argument #1.
        //
        // Our typings model that returned iterator as `Mongo.CursorIter<T>` with
        // `@noSelf`, so we can call it without TypeScriptToLua injecting a leading
        // `nil`.
        //
        // NOTE: In this environment, `cursor.iterator(handler)` appears to have
        // different/quirky semantics. To keep `.map(...)` reliable, we always use
        // `cursor.iterator()` and apply `map` in *this* wrapper.
        const it = cursor.iterator();

        // Generic-for iterators also receive the previous control variable.
        // Cursor iterators typically ignore it, but passing it makes this wrapper
        // compatible with the protocol.
        let control: unknown = undefined;

        // Return a TS function that ignores the implicit `self` arg from TSTL.
        return ((_: unknown) => {
            const raw = it(cursor, control);
            control = raw;
            if (raw === undefined || raw === null) return undefined;

            // If the iterator yields a BSONDocument wrapper, unwrap it.
            let doc: unknown = raw;
            const maybeValue = (raw as any).value;
            if (typeof maybeValue === "function") {
                doc = (raw as any).value();
            }

            return map ? (map(doc) as unknown as U) : (doc as unknown as U);
        }) as unknown as Mongo.LuaIterator<U>;
    }

    /**
     * Returns all matching documents as an array.
     *
     * If you want to transform documents as you read them, pass `map`.
     */
    findAll<T extends Mongo.Document = Mongo.Document, U = T>(
        query?: Mongo.Query<T>,
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
    read<T extends Mongo.Document = Mongo.Document>(opts?: CustomTimeSeriesCollectionReadOptions<T>): T[] {
        return this.findAll<T>(opts?.query, opts?.options);
    }

    /**
     * LINQ-ish query API that *executes* on `.build()`.
     *
     * Example:
     *   const values = ds
     *     .query<MyDoc>()
     *     .where(doc => doc.runId === runId)
     *     .map(doc => doc.value)
     *     .limit(10)
     *     .build();
     */
    query<TDoc extends Mongo.Document = Mongo.Document>(): MongoQueryable<TDoc, TDoc> {
        return new MongoQueryable<TDoc, TDoc>(this);
    }

    /**
     * Returns documents from the underlying MongoDB collection.
     *
     * This is a convenience helper for the common case where you want to read
     * everything (or use only `FindOptions` such as `limit`/`sort`) without
     * providing a query filter.
     */
    readAll<T extends Mongo.Document = Mongo.Document>(options?: Mongo.FindOptions): T[] {
        return this.findAll<T>({} as unknown as Mongo.Query<T>, options);
    }

    /**
     * Finds a single document and unwraps the BSON wrapper to a plain JS/Lua table.
     *
     * Returns `undefined` when no document matches.
     */
    findOneValue<T extends Mongo.Document = Mongo.Document, U = T>(
        query?: Mongo.Query<T>,
        options?: Mongo.FindOptions,
        map?: (doc: unknown) => U,
    ): U | undefined {
        // lua-mongo does not accept `nil` for the query argument.
        const q = (query ?? ({} as unknown as Mongo.Query<T>));
        const bson = this.getCollection().findOne<T>(q, options);
        if (!bson) return undefined;
        return map ? bson.value(map) : (bson.value() as unknown as U);
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

    delete(silent?: boolean): boolean {
        this.dataStoreConfiguration.removeDataStore(this);
        return super.delete(silent);
    }

    static appendable(parent: IObject, name: string, opts?: CustomTimeSeriesDataStoreOptions): CustomTimeSeriesDataStore {
        return new CustomTimeSeriesDataStore(parent.path.absolutePath() + "/" + name, opts);
    }
}

export class MongoQueryable<TDoc extends Mongo.Document, TOut> {
    private readonly store: CustomTimeSeriesDataStore;
    private readonly queryBuilder: MongoQueryBuilder<TDoc>;

    private options: Mongo.FindOptions | undefined;
    private mapper: ((doc: unknown) => unknown) | undefined;

    constructor(store: CustomTimeSeriesDataStore) {
        this.store = store;
        // Use the existing query builder implementation for consistent operator merging.
        this.queryBuilder = mq<TDoc>();
    }

    /** Start / continue adding conditions on a field (string form). */
    where<K extends Extract<keyof TDoc, string>>(field: K): MongoQueryableFieldBuilder<TDoc, TOut, K>;

    /**
     * Predicate form (compile-time macro):
     *   where(doc => doc.field OP value)
     *
     * The TSTL plugin rewrites this into the string+operator form.
     */
    where(predicate: (doc: TDoc) => boolean): MongoQueryable<TDoc, TOut>;

    where(arg: unknown): any {
        if (typeof arg === "function") {
            throw new Error(
                "MongoQueryable.where(predicate) is a compile-time macro. " +
                "Use a simple comparison like doc => doc.field === value, and ensure the TSTL plugin is enabled."
            );
        }
        return new MongoQueryableFieldBuilder<TDoc, TOut, any>(this, arg as any);
    }

    /** Limit number of results. */
    limit(n: number): this {
        this.options = { ...(this.options ?? {}), limit: n };
        return this;
    }

    /** Skip N results. */
    skip(n: number): this {
        this.options = { ...(this.options ?? {}), skip: n };
        return this;
    }

    /** Sort by a field. Direction: 1 (asc) or -1 (desc). */
    sort<K extends Extract<keyof TDoc, string>>(field: K, direction: 1 | -1 = 1): this {
        // Mongo sort object: { field: 1 | -1 }
        this.options = { ...(this.options ?? {}), sort: { [field]: direction } };
        return this;
    }

    /** Client-side mapping of each document (executed in Lua after reading). */
    map<U>(fn: (doc: TOut) => U): MongoQueryable<TDoc, U> {
        const prev = this.mapper;
        if (!prev) {
            this.mapper = (doc: unknown) => fn(doc as unknown as TOut);
        } else {
            this.mapper = (doc: unknown) => fn(prev(doc) as unknown as TOut);
        }
        return this as unknown as MongoQueryable<TDoc, U>;
    }

    /** Alias for map(). */
    select<U>(fn: (doc: TOut) => U): MongoQueryable<TDoc, U> {
        return this.map(fn);
    }

    /** Execute the query and return the resulting array. */
    build(): TOut[] {
        const q = this.queryBuilder.build();
        const map = this.mapper ? ((doc: unknown) => this.mapper!(doc) as unknown as TOut) : undefined;
        return this.store.findAll<TDoc, TOut>(q, this.options, map);
    }

    /**
     * Convenience property to execute the query without calling `.build()`.
     *
     * Example:
     *   const rows = ds.query<T>().where(...).map(...).value
     */
    get value(): TOut[] {
        return this.build();
    }

    /** Alias for `.value` (sometimes reads nicer). */
    get result(): TOut[] {
        return this.build();
    }

    // Internal: apply conditions to the underlying query.
    _setField(field: string, value: unknown): void {
        this.queryBuilder._setField(field, value);
    }

    _mergeFieldOps(field: string, ops: Record<string, unknown>): void {
        this.queryBuilder._mergeFieldOps(field, ops);
    }
}

export class MongoQueryableFieldBuilder<
    TDoc extends Mongo.Document,
    TOut,
    K extends Extract<keyof TDoc, string>,
> {
    constructor(private parent: MongoQueryable<TDoc, TOut>, private field: K) { }

    /** Direct match `{ field: value }` (no operator object). */
    is(value: TDoc[K]): MongoQueryable<TDoc, TOut> {
        this.parent._setField(this.field, value as unknown);
        return this.parent;
    }

    eq(value: TDoc[K]): MongoQueryable<TDoc, TOut> {
        this.parent._mergeFieldOps(this.field, { $eq: value as unknown });
        return this.parent;
    }

    ne(value: TDoc[K]): MongoQueryable<TDoc, TOut> {
        this.parent._mergeFieldOps(this.field, { $ne: value as unknown });
        return this.parent;
    }

    gt(value: TDoc[K]): MongoQueryable<TDoc, TOut> {
        this.parent._mergeFieldOps(this.field, { $gt: value as unknown });
        return this.parent;
    }

    gte(value: TDoc[K]): MongoQueryable<TDoc, TOut> {
        this.parent._mergeFieldOps(this.field, { $gte: value as unknown });
        return this.parent;
    }

    lt(value: TDoc[K]): MongoQueryable<TDoc, TOut> {
        this.parent._mergeFieldOps(this.field, { $lt: value as unknown });
        return this.parent;
    }

    lte(value: TDoc[K]): MongoQueryable<TDoc, TOut> {
        this.parent._mergeFieldOps(this.field, { $lte: value as unknown });
        return this.parent;
    }
}
