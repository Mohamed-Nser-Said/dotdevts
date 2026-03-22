// Global syslib declarations for TypeScript-to-Lua
// Ported from dev-teal/src/extern/syslib.d.tl and .dev/.meta/inmation/library

declare namespace SysLib {
  type NumID = number;
  type ObjID = NumID;
  type ObjPath = string;

  interface ModelObject {
    ObjectName: string;
    path(): string;
  }

  type ObjSpec = ObjID | ObjPath | ModelObject;
  type PathSpec = ObjSpec;
  type StoreSpec = ObjSpec;
  type EpochTime = number;
  type ISO8601 = string;
  type QualityCode = number;

  namespace Model {
    interface Reference {
      name: string;
      path: string;
      type: number | ReferenceType;
    }

    type ReferenceType = "SECURITY" | "OBJECT_LINK" | "PROPERTY_LINK" | "OBJECT_LINK_PASSIVE";

    type ReferenceList = Reference[];

    interface Object extends ModelObject {
      brefs: ReferenceList;
      refs: ReferenceList;
      numid(): number;
      parent(): Object | undefined;
      children(): Object[];
      child(name: string): Object | undefined;
      type(): [string, number];
      model(): [string, number];
      sysname(): string;
      textid(): string;
      created(): [number, string, string];
      modified(): [number, string, string];
      enabled(): boolean;
      deleted(): boolean;
    }

    namespace Codes {
      type MassStatus =
        | 1  // CREATED
        | 2  // UPDATED
        | 3  // REMOVED
        | 4  // SUPERSEDED
        | 5  // ENABLED
        | 6  // DISABLED
        | 7  // SUCCESS_SAME
        | 8  // ACCEPTED
        | 99 // SUCCESS
        | 100 // WARNING_ABSENT
        | 101 // WARNING_SAME
        | 102 // WARNING_PROPERTY_CHANGES_IGNORED
        | 199 // WARNING_UNSPECIFIED
        | 201 // FAILED_ABSENT
        | 202 // FAILED_PRESENT
        | 203 // FAILED_MODIFIED
        | 204 // FAILED_MISMATCHED
        | 205 // FAILED_ORPHAN
        | 206 // FAILED_UNMODIFIABLE
        | 207 // FAILED_DENIED
        | 208 // FAILED_MALFORMED
        | 209 // FAILED_UNNAMED
        | 210 // FAILED_VALIDATION
        | 211 // FAILED_IN_USE
        | 212 // FAILED_COMMENT_MISSING
        | 297 // FAILED_WRONG_CLASS
        | 298 // FAILED_PARENT_CHILD_MISMATCH
        | 299; // FAILED_UNSPECIFIED
    }
  }

  interface MassOp {
    UPSERT: number;
    UPDATE: number;
  }

  interface ReferenceType {
    SECURITY: number;
  }

  interface SecurityAttributes {
    LIST: number;
    READ: number;
    WRITE: number;
    MODIFY: number;
    EXECUTE: number;
    INHERITABLE: number;
  }

  interface SysPropAttributes {
    PROP_VISIBLE: number;
    PROP_VOLATILE: number;
    PROP_DYNAMIC: number;
  }

  interface Flags {
    SecurityAttributes: SecurityAttributes;
    SysPropAttributes: SysPropAttributes;
  }

  interface HistoryTransporterMode {
    HTM_CONTINUOUS: number;
    HTM_ONE_SHOT: number;
    HTM_ON_DEMAND: number;
    HTM_ON_CHANGE: number;
    HTM_ON_CHANGE_AND_PERIOD: number;
    HTM_ON_CHANGE_AND_PERIOD_AND_SIZE: number;
    HTM_ON_CHANGE_AND_PERIOD_AND_SIZE_AND_QUALITY: number;
  }

  interface SimpleRecurrence {
    SR_SEC_1: number;
    SR_SEC_5: number;
    SR_SEC_10: number;
    SR_SEC_30: number;
    SR_MIN_1: number;
    SR_MIN_5: number;
  }

  interface AuxStateChangeStrategy {
    INHIBIT: number;
    INHERIT: number;
    ENABLE: number;
    DISABLE: number;
  }

  interface ComponentVersionPolicy {
    AUTOMATIC_RESTRICTIVE: number;
    AUTOMATIC_PERMISSIVE: number;
    MANUAL: number;
  }

  interface ComponentUpdateVerification {
    SIGNATURE: number;
    NONE: number;
  }

  interface ComponentSecurityMode {
    TLS_SRP: number;
    TLS_X509: number;
    TLS_ANONYMOUS: number;
    NONE: number;
  }

  interface ComponentConnectionMode {
    ACTIVE: number;
    PASSIVE: number;
  }

  interface OpcUaCertificateDigestAlgorithm {
    CERTIFICATE_DIGEST_SHA256: number;
    CERTIFICATE_DIGEST_SHA1: number;
  }

  interface LocationStrategy {
    LOC_STRAT_NONE: number;
    LOC_STRAT_GPS: number;
    LOC_STRAT_FIXED: number;
  }

  interface SelectorSafRetentionPolicyMain {
    SAF_POLICY_DISKSIZE: number;
    SAF_POLICY_TIME: number;
  }

  interface SafPurgeActionMode {
    NONE: number;
    DELETE: number;
    MOVE: number;
  }

  interface SafFallbackMode {
    MAIN_MEMORY: number;
    DISK: number;
    DISABLED: number;
  }

  interface SafDiskRepairMode {
    REPAIR: number;
    DELETE: number;
    IGNORE: number;
  }

  interface SafRetainMode {
    SAF_RETAIN_NEW: number;
    SAF_RETAIN_OLD: number;
  }

  interface SQLCatalog {
    CREATE_INDEXED_CATALOG: number;
    CREATE_CATALOG: number;
    NO_CATALOG: number;
  }

  interface ProcessMode {
    PM_OPERATION: number;
    PM_PASSIVE: number;
  }

  interface EventPurgeOptions {
    DO_NOT_PURGE: number;
    PURGE_ON_ACKNOWLEDGE: number;
    PURGE_ON_CLEAR: number;
  }

  interface SelectorEndpointType {
    EP_OPC_UA: number;
    EP_OPC_DA: number;
    EP_OPC_AE: number;
    EP_OPC_HDA: number;
    EP_GENERIC: number;
  }

  interface UaSecurityMode {
    SECURITY_MODE_NONE: number;
    SECURITY_MODE_SIGN: number;
    SECURITY_MODE_SIGN_AND_ENCRYPT: number;
  }

  interface UaSecurityPolicy {
    SECURITY_POLICY_NONE: number;
    SECURITY_POLICY_BASIC128RSA15: number;
    SECURITY_POLICY_BASIC256: number;
    SECURITY_POLICY_BASIC256SHA256: number;
  }

  interface UaUserTokenType {
    ANONYMOUS_TOKEN: number;
    USERNAME_TOKEN: number;
    CERTIFICATE_TOKEN: number;
  }

  interface LanguageCodes {
    EN: number;
    DE: number;
    FR: number;
    ES: number;
    ZH: number;
  }

  interface ArchiveMode {
    LAST_VALUE: number;
    AVERAGE: number;
    MIN: number;
    MAX: number;
    SUM: number;
  }

  interface BrowseOptionCodes {
    BROWSE_PERIODICALLY: number;
    BROWSE_ON_CONNECT: number;
    BROWSE_DISABLED: number;
  }

  interface Codes {
    MassOp: MassOp;
    ReferenceType: ReferenceType;
    HistoryTransporterMode: HistoryTransporterMode;
    SimpleRecurrence: SimpleRecurrence;
    AuxStateChangeStrategy: AuxStateChangeStrategy;
    ProcessMode: ProcessMode;
    EventPurgeOptions: EventPurgeOptions;
    ComponentVersionPolicy: ComponentVersionPolicy;
    ComponentUpdateVerification: ComponentUpdateVerification;
    ComponentSecurityMode: ComponentSecurityMode;
    ComponentConnectionMode: ComponentConnectionMode;
    OpcUaCertificateDigestAlgorithm: OpcUaCertificateDigestAlgorithm;
    LocationStrategy: LocationStrategy;
    SelectorSafRetentionPolicyMain: SelectorSafRetentionPolicyMain;
    SafPurgeActionMode: SafPurgeActionMode;
    SafFallbackMode: SafFallbackMode;
    SafDiskRepairMode: SafDiskRepairMode;
    SafRetainMode: SafRetainMode;
    SQLCatalog: SQLCatalog;
    SelectorEndpointType: SelectorEndpointType;
    UaSecurityMode: UaSecurityMode;
    UaSecurityPolicy: UaSecurityPolicy;
    UaUserTokenType: UaUserTokenType;
    LanguageCodes: LanguageCodes;
    ArchiveMode: ArchiveMode;
    BrowseOptionCodes: BrowseOptionCodes;
  }

  interface Classes {
    Core: number;
    GenFolder: number;
    HistoryTransporter: number;
    ActionItem: number;
    GenericTimeSeriesBuffer: number;
    VariableGroup: number;
    Variable: number;
    SchedulerItem: number;
    ScriptEvents: number;
    TableHolder: number;
    GenItem: number;
    DataStoreGroup: number;
    MessageBroker: number;
    MessageProcessor: number;
    HistoryController: number;
    CustomEventDataStore: number;
    CustomTimeSeriesDataStore: number;
    Connector: number;
    Datasource: number;
  }

  /**
   * Provides numeric property codes for use in queries (e.g. syslib.getsystemdb SQL)
   * and listproperties calls. Access via syslib.model.properties.PropertyName.
   * Values are loaded on demand (do not iterate the table).
   * Full list: https://docs.inmation.com/system-model/1.110/property/index.html
   */
  interface Properties {
    /** 1 — The display name of the object */
    ObjectName: number;
    /** The class code of the object (matches syslib.model.classes.*) */
    ObjType: number;
    /** Storage strategy for archive historization */
    StorageStrategy: number;
    /** Archive selector (production / test store) */
    ArchiveSelector: number;
    /** Table data property of TableHolder / CustomTable objects */
    TableData: number;
    /** Script body text of Action Items, Schedulers etc. */
    ScriptBody: number;
    /** Generic item selector (e.g. LuaScript, Python…) */
    SelectorGenItem: number;
    [propertyName: string]: number;
  }

  interface ModelInfo {
    codes: Codes;
    flags: Flags;
    classes: Classes;
    /** Numeric property codes. Access via syslib.model.properties.PropertyName. */
    properties: Properties;
  }

  interface SysLibObject extends Model.Object {}

  /**
   * A row from a SystemDb cursor query, keyed by field name (when fetched with mode "a").
   * Matches the schema of the built-in `properties` table.
   */
  interface SystemDbRow {
    /** Object ID of the property's owner object */
    objid?: number;
    /** Relative path of the property within the object (e.g. '.ObjectName') */
    path?: string;
    /** Numeric property code (see syslib.model.properties.*) */
    code?: number;
    /** Current value of the property */
    value?: unknown;
    /** Position in an array property; 0 for scalar properties */
    position?: number;
    /** Model code of the owning object (see Browse Models) */
    modelcode?: number;
    [key: string]: unknown;
  }

  /**
   * Cursor returned by SystemDb.query().
   * Iterate rows using fetch() in a while loop until it returns undefined.
   */
  interface SystemDbCursor {
    /**
     * Fetches the next row from the cursor.
     * @param row Pass `{}` for the first call, then pass the previous row to reuse the table.
     * @param mode "a" = index by field name (recommended), "n" = index by column number.
     * @returns The next row, or undefined (nil) when there are no more rows.
     */
    fetch(row: object, mode?: "a" | "n"): SystemDbRow | undefined;
  }

  /**
   * Read-only handle to the inmation system database, returned by syslib.getsystemdb().
   * Exposes a SQLite3 interface over the system `properties` table (plus JSON1 extension).
   *
   * The `properties` table schema:
   *  - objid     INTEGER  — Object ID of the owning object
   *  - path      TEXT     — Property path relative to the object (e.g. '.ObjectName')
   *  - code      INTEGER  — Property code (syslib.model.properties.*)
   *  - value     VARIANT  — Current property value
   *  - position  INTEGER  — Array index; 0 for scalar properties
   *  - modelcode INTEGER  — Class model code of the owning object
   *
   * Example:
   * ```ts
   * const db = syslib.getsystemdb();
   * const [cur, err] = db.query(`SELECT objid FROM properties WHERE code IS ${syslib.model.properties.ObjectName} AND value IS 'MyItem'`);
   * let row = cur.fetch({}, "a");
   * while (row) {
   *   const obj = syslib.getobject(row.objid as number);
   *   row = cur.fetch(row, "a");
   * }
   * ```
   */
  interface SystemDb {
    /**
     * Executes a SQL query against the system database.
     * @param sql A valid SQLite3 SQL statement. The JSON1 extension is available.
     * @returns A Lua multi-return of (cursor, errorMessage?). `errorMessage` is non-nil only on failure.
     */
    query(sql: string): LuaMultiReturn<[SystemDbCursor, string | undefined]>;
  }

  /**
   * Describes the result of syslib.listbuffer([objspec]).
   * Each field is a parallel array — all fields at index `i` describe the same buffer.
   *
   * @see https://docs.inmation.com/api/1.100/lua/functions.html#listbuffer
   */
  interface ListBufferResult {
    /** Numeric IDs of the objects where the buffers are defined. */
    object: number[];
    /** Buffer names. */
    name: string[];
    /** Input source: a relative property path (e.g. ".ItemValue") or another buffer name. */
    lower: string[];
    /** Maximum buffer size in elements. */
    length: number[];
    /** Maximum time span in milliseconds. */
    duration: number[];
    /** Monotonically increasing write counter (aids overflow detection). */
    counter: number[];
    /** Current number of elements in the buffer. */
    size: number[];
    /** Currently reserved capacity in elements. */
    capacity: number[];
    /** Total number of peek operations performed on the buffer. */
    peeks: number[];
    /** Total number of elements returned by peek operations. */
    peeked: number[];
  }

  /**
   * Minimal representation of a lua-mongo client returned by syslib.getmongoconnection().
   * @see https://docs.inmation.com/api/1.100/lua/functions.html#getmongoconnection
   */
  interface MongoCollection {
    drop(): void;
    insert(doc: Record<string, unknown>): void;
    findOne(query?: unknown): { value(): Record<string, unknown> } | undefined;
    find(query?: unknown): { iterator(): () => Record<string, unknown> | undefined };
    updateOne(filter: unknown, update: unknown): void;
    deleteOne(filter: unknown): void;
  }

  interface MongoClient {
    /** Returns a collection handle for the given database and collection names. */
    getCollection(database: string, collection: string): MongoCollection;
  }

  interface SysLib {
    model: ModelInfo;
    /** @noSelf */
    getvalue(path: string): unknown;
    /** @noSelf */
    getobject(objspec?: string | number | SysLibObject): SysLibObject | undefined;
    /** @noSelf */
    mass(ops: unknown[]): void;
    /** @noSelf */
    enableobject(path: string): void;
    /** @noSelf */
    disableobject(path: string): void;
    /** @noSelf */
    sleep(ms: number): void;
    /** @noSelf */
    deleteobject(path: string): void;
    /** @noSelf */
    getreferences(path: string): unknown;
    /** @noSelf */
    splitpath(path: string): [string, string];
    /** @noSelf */
    execute(service: unknown, code: string): unknown;
    /** @noSelf */
    getconnectorpath(path: string): unknown;
    /** @noSelf */
    getcorepath(path?: string): string;
    /** @noSelf */
    listproperties(path: string, format: string, ...rest: unknown[]): [unknown, number];
    /** @noSelf */
    setvalue(path: string, value: unknown): void;
    /** @noSelf */
    uuid(): string;
    /** @noSelf */
    now(): number;
    /** @noSelf */
    gettime(timestamp?: number): string;
    /** @noSelf */
    log(level: number, message: string): void;
    /** @noSelf */
    getselfpath(): string;
    /**
     * Returns a read-only handle to the inmation system database.
     * Use it to query static property values across all objects using SQL (SQLite3 + JSON1).
     *
     * Component Execution: All Components
     *
     * @see SystemDb for query usage and the `properties` table schema.
     */
    /** @noSelf */
    getsystemdb(): SystemDb;

    // -------------------------------------------------------------------------
    // In-memory aggregation / buffering API
    // -------------------------------------------------------------------------

    /**
     * Removes the named buffer from the specified object.
     *
     * Component Execution: All Components
     * @see https://docs.inmation.com/api/1.100/lua/functions.html#buffer
     */
    /** @noSelf */
    buffer(objspec: string | number, name: string): void;
    /**
     * Creates a buffer on `objspec` with the given `name`, reading from `input`
     * (a relative property path starting with "." or another buffer name),
     * bounded by `duration` (ms) and `size` (element count).
     */
    /** @noSelf */
    buffer(objspec: string | number, name: string, input: string, duration: number, size: number): void;
    /**
     * Creates a buffer with a Lua transformation function.  The `input` must be
     * another buffer name.  `transformFn` is a well-formed Lua chunk that returns
     * a function `(input, peek, tear)`.
     */
    /** @noSelf */
    buffer(objspec: string | number, name: string, input: string, duration: number, size: number, transformFn: string): void;
    /**
     * Creates a buffer with built-in aggregation.  `input` must be another buffer.
     * `aggPeriod` is the aggregation interval in ms (0 = run on every new value).
     * `aggType` is an Aggregates code group value string, e.g. `"AGG_TYPE_AVERAGE"`.
     */
    /** @noSelf */
    buffer(objspec: string | number, name: string, input: string, duration: number, size: number, aggPeriod: number, aggType: string): void;

    /**
     * Removes the repeater from the named buffer at `objspec`.
     *
     * Component Execution: All Components
     * @see https://docs.inmation.com/api/1.100/lua/functions.html#attach
     */
    /** @noSelf */
    attach(objspec: string | number, name: string): void;
    /**
     * Attaches `repeater` (an object/path with a dynamic property) to the named
     * buffer at `objspec`.  The repeater's dynamic property receives each new
     * value stored into the buffer.
     */
    /** @noSelf */
    attach(objspec: string | number, name: string, repeater: string | number): void;

    /**
     * Returns the contents of the named buffer without clearing it.
     * Returns four parallel arrays: values, timestamps (ms), qualities, counter.
     *
     * Component Execution: All Components
     * @see https://docs.inmation.com/api/1.100/lua/functions.html#peek
     */
    /** @noSelf */
    peek(objspec: string | number, name: string): LuaMultiReturn<[unknown[], number[], number[], number]>;

    /**
     * Atomically retrieves and clears the named buffer.
     * Returns four parallel arrays: values, timestamps (ms), qualities, counter.
     *
     * Component Execution: All Components
     * @see https://docs.inmation.com/api/1.100/lua/functions.html#tear
     */
    /** @noSelf */
    tear(objspec: string | number, name: string): LuaMultiReturn<[unknown[], number[], number[], number]>;

    /**
     * Returns the last value stored in the named buffer at `objspec`.
     *
     * Component Execution: All Components
     * @see https://docs.inmation.com/api/1.100/lua/functions.html#last
     */
    /** @noSelf */
    last(objspec: string | number, name: string): unknown;

    /**
     * Lists buffers at `objspec` (or all buffers in the component if omitted).
     * Each field of the result is a parallel array indexed by buffer number.
     *
     * Component Execution: All Components
     * @see https://docs.inmation.com/api/1.100/lua/functions.html#listbuffer
     */
    /** @noSelf */
    listbuffer(objspec?: string | number): ListBufferResult;

    /**
     * Returns a lua-mongo client, database name, and collection name for the
     * given MongoDB data store object.
     *
     * - Pass an objspec (path/id) for a custom data store.
     * - Pass a `syslib.model.codes.RepoStoreName` numeric code for a system store.
     * - Omit the argument to default to the System Custom Data Store (Master Core only).
     *
     * Component Execution: All 64-bit components
     * @see https://docs.inmation.com/api/1.100/lua/functions.html#getmongoconnection
     */
    /** @noSelf */
    getmongoconnection(store?: string | number, testarchive?: boolean): LuaMultiReturn<[MongoClient, string, string]>;

    /**
     * Returns logs created between `startTime` and `endTime` for the given objects.
     * If `objects` is omitted, logs for all objects in the system are returned.
     * `maxlogs` defaults to 100; pass 0 to return all matching logs.
     *
     * Component Execution: Master Core only
     * @see https://docs.inmation.com/api/1.100/lua/functions.html#getlogs
     */
    /** @noSelf */
    getlogs(startTime: number, endTime: number, objects?: (string | number)[], maxlogs?: number): unknown[];
  }
}

declare const syslib: SysLib.SysLib;

declare const inmation: SysLib.SysLib;

// Minimal LuaMultiReturn declaration (mirrors @typescript-to-lua/language-extensions)
// Used to declare functions that return multiple Lua values without table.unpack wrapping.
declare type LuaMultiReturn<T extends unknown[]> = T & {
    readonly __tstlMultiReturn: unknown;
};

declare namespace Host {
  namespace io {
    /** @noSelf */
    function read(filePath: string): string;
    /** @noSelf */
    function write(filePath: string, content: string): void;
  }
  namespace os {
    /** @noSelf */
    function exec(cmd: string, cwd?: string): string | undefined;
  }
  namespace workspace {
    interface WorkspaceInfo {
      path: string;
      name: string;
    }
    /** @noSelf */
    function info(): WorkspaceInfo;
  }
}
