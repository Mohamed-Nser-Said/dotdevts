// Global syslib declarations for TypeScript-to-Lua
// Aligned with inmation Lua API 1.110 — https://docs.inmation.com/api/1.110/lua/functions.html
// (plus model metadata from the system-model docs)

// Minimal LuaMultiReturn (mirrors @typescript-to-lua/language-extensions); declared before SysLib for nested aliases.
declare type LuaMultiReturn<T extends unknown[]> = T & {
  readonly __tstlMultiReturn: unknown;
};

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
    interface AttributeMap {
      [code: number]: boolean;
      [code: string]: boolean;
    }

    interface ModelNameMap {
      [code: number]: string;
      [code: string]: string;
    }

    interface ClassCollection {
      [code: number]: Class;
      [tag: string]: Class;
    }

    interface PropertyCollection {
      [code: number]: Property;
      [tag: string]: Property;
    }

    interface PerformanceCounterCollection {
      [code: number]: PerformanceCounter;
      [tag: string]: PerformanceCounter;
    }

    interface CapabilityCollection {
      [code: number]: Capability;
      [tag: string]: Capability;
    }

    interface Reference {
      name: string;
      path: string;
      type: number | ReferenceType;
    }

    type ReferenceType =
      | "SECURITY"
      | "OBJECT_LINK"
      | "PROPERTY_LINK"
      | "OBJECT_LINK_PASSIVE";

    type ReferenceList = Reference[];

    /**
     * Static-model class metadata userdata exposed through numeric indexing of `syslib.model.classes`.
     * See https://docs.inmation.com/api/1.110/lua/static_model.html
     */
    interface Class {
      code: number;
      tag: string;
      toplevel: boolean;
      version_major: number;
      version_minor: number;
      sortorder: number;
      subclasses: ClassCollection;
      properties: PropertyCollection;
      models: ModelNameMap;
      attributes: AttributeMap;
      performance: PerformanceCounterCollection;
      parents: ClassCollection;
      children: ClassCollection;
    }

    /**
     * Static-model property metadata userdata exposed through numeric indexing of `syslib.model.properties`.
     */
    interface Property {
      code: number;
      tag: string;
      type: number;
      iscompound: boolean;
      flaggroup?: number;
      codegroup?: number;
      table?: boolean;
      tableschema?: string;
      default?: unknown;
      datatype?: number;
      max?: unknown;
      min?: unknown;
      properties: PropertyCollection;
      attributes: AttributeMap;
      capabilities: CapabilityCollection;
    }

    /**
     * Static-model performance counter userdata exposed through numeric indexing of `syslib.model.counters`.
     */
    interface PerformanceCounter {
      code: number;
      tag: string;
      meaning: string;
      engunit_name: string;
      engunit_meaning: string;
      performancegroup_name: string;
      timebase_name: string;
      show_timebase: boolean;
    }

    /**
     * Static-model capability userdata exposed through `property.capabilities`.
     */
    interface Capability {
      code: number;
      tag: string;
      meaning: string;
      coding_code: number;
      property: Property;
    }

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
        | 1   // CREATED
        | 2   // UPDATED
        | 3   // REMOVED
        | 4   // SUPERSEDED
        | 5   // ENABLED
        | 6   // DISABLED
        | 7   // SUCCESS_SAME
        | 8   // ACCEPTED
        | 99  // SUCCESS
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
    INSERT: number;
    UPDATE: number;
    DELETE: number;
    UPSERT: number;
  }

  interface ReferenceType {
    SECURITY: number;
    OBJECT_LINK: number;
    PROPERTY_LINK: number;
    OBJECT_LINK_PASSIVE: number;
  }

  interface SysObjectType {
    OT_OBJECT: number;
    OT_PROPERTY: number;
    OT_REFERENCE: number;
  }

  interface RecurrenceType {
    SECOND: number;
    MINUTE: number;
    HOUR: number;
    DAY: number;
    WEEK: number;
    MONTH: number;
    YEAR: number;
  }

  interface DaysInMonth {
    WDIM_FIRST: number;
    WDIM_SECOND: number;
    WDIM_THIRD: number;
    WDIM_FOURTH: number;
    WDIM_LAST: number;
  }

  interface DaysOfWeek {
    SUNDAY: number;
    MONDAY: number;
    TUESDAY: number;
    WEDNESDAY: number;
    THURSDAY: number;
    FRIDAY: number;
    SATURDAY: number;
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
    PROP_CONFIGURABLE: number;
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
    SysObjectType: SysObjectType;
    RecurrenceType: RecurrenceType;
    DaysInMonth: DaysInMonth;
    DaysOfWeek: DaysOfWeek;
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
    [className: string]: number | Model.Class;
    [classCode: number]: Model.Class;
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
   * Numeric and symbolic performance counter lookup table.
   *
   * - `syslib.model.counters.CounterName` -> numeric code
   * - `syslib.model.counters[code]` -> static-model counter userdata
   */
  interface Counters {
    [counterName: string]: number | Model.PerformanceCounter;
    [counterCode: number]: Model.PerformanceCounter;
  }

  /**
   * Provides numeric property codes for use in queries (e.g. syslib.getsystemdb SQL)
   * and listproperties calls. Access via syslib.model.properties.PropertyName.
   * Values are loaded on demand (do not iterate the table).
   * Full list: https://docs.inmation.com/system-model/1.110/property/index.html
   */
  interface Properties {
    [propertyCode: number]: Model.Property;
    /** 1 — The display name of the object */
    ObjectName: number;
    /** The class code of the object (matches syslib.model.classes.*) */
    ObjType: number;
    /** Storage strategy for archive historization */
    StorageStrategy: number;
    /** Archive selector (production / test store) */
    ArchiveSelector: number;
    /** Data store selector (e.g. ArchiveOptions.ArchiveSelector) */
    DataStoreSelector: number;
    /** Table data property of TableHolder / CustomTable objects */
    TableData: number;
    /** Script body text of Action Items, Schedulers etc. */
    ScriptBody: number;
    /** Generic item selector (e.g. LuaScript, Python…) */
    SelectorGenItem: number;
    [propertyName: string]: number | Model.Property;
  }

  interface ModelInfo {
    codes: Codes;
    flags: Flags;
    classes: Classes;
    counters: Counters;
    /** Numeric property codes. Access via syslib.model.properties.PropertyName. */
    properties: Properties;
  }

  interface SysLibObject extends Model.Object { }

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
     * Next row from a `query()` cursor (SQLite-style).
     * @param row `{}` first call; then pass prior row to reuse table (Lua pattern).
     * @param mode `a` = associative by column name; `n` = numeric indices.
     * @returns Row or undefined when exhausted.
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
   */
  interface SystemDb {
    /**
     * Run read-only SQL on the `properties` table (static config snapshot). JSON1 enabled.
     * @param sql SELECT (or other supported read statements per docs).
     * @returns Cursor + optional error string on failure.
     */
    query(sql: string): LuaMultiReturn<[SystemDbCursor, string | undefined]>;
  }

  /**
   * Describes the result of syslib.listbuffer([objspec]).
   * Each field is a parallel array — all fields at index `i` describe the same buffer.
   */
  interface ListBufferResult {
    object: number[];
    name: string[];
    lower: string[];
    length: number[];
    duration: number[];
    counter: number[];
    size: number[];
    capacity: number[];
    peeks: number[];
    peeked: number[];
  }

  /**
   * Minimal representation of a lua-mongo client returned by syslib.getmongoconnection().
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
    getCollection(database: string, collection: string): MongoCollection;
  }

  /** gethistory interval: V=value, S=status (aggregation + quality), T=timestamp. */
  interface HistoryInterval {
    V: unknown;
    S: unknown;
    T: unknown;
  }

  /** getrawhistory iterator: `for T, v, q in rs() do` (server timestamp when modified_data_mode). */
  type RawHistoryIterator = () => LuaMultiReturn<[EpochTime, unknown, QualityCode] | []>;

  type FileMetadata = Record<string, unknown>;

  /** Opaque userdata from syslib.msgqueue(). */
  type MsgQueue = object;

  interface MsgStats {
    oid?: number;
    slot?: number;
    msgs_inmem?: number;
    inserts?: number;
    reads?: number;
    [key: string]: unknown;
  }

  /** Row from syslib.control.list(). */
  interface LuaInstanceInfo {
    id: number;
    state: "idle" | "running" | "terminated" | "disabled";
    mem_usage: number;
    cpuusage: number;
    source_type: string;
    source_sub_type: string;
    source_id?: number;
    source_is_non_persisting_channel?: boolean;
    totalruntime?: number;
    elapsed?: number;
    dedicated: boolean;
    self: SysLibObject | undefined;
  }

  interface AuditTrailOptions {
    time_start?: number;
    time_end?: number;
    skip?: number;
    limit?: number;
    type?: number;
    projection?: string[];
  }

  interface EventHistoryOptions {
    data_store?: ObjSpec;
    filter?: string;
    sort?: string;
    projection?: string;
    limit?: number;
    skip?: number;
    transformation?: "none" | "readable" | "readable_lc" | "kv" | "kv_lc";
  }

  interface TcpConnection {
    raddr: string;
    proto: number;
    laddr: string;
    state: number;
    v: 4 | 6;
    rport: number;
    lport: number;
  }

  interface Ip21BrowseItem {
    name: string;
    class_code: number;
    itemid: string;
    description?: string;
    eng_unit?: string;
    range_low?: number;
    range_high?: number;
    display_format?: string;
    stepped?: boolean;
    tag_category?: string;
    definition_record?: string;
    value_type?: number;
    value_type_str?: string;
    field_data?: Record<string, unknown>;
    children?: Ip21BrowseItem[];
  }

  interface UuidOptions {
    version?: number;
    format?: "text" | "binary" | number;
    secure_mac?: boolean;
  }

  /**
   * Global `syslib` / `inmation` Lua API (Core, Connector, etc.). See https://docs.inmation.com/api/1.110/lua/functions.html
   */
  interface SysLib {
    /** Model metadata: `classes`, `counters`, `codes`, `flags`, `properties` (numeric codes + static-model userdata). */
    model: ModelInfo;

    /**
     * Read dynamic/static property VQT. Short: `syslib.get`
     * @param pathspec Object path, property path, object id, or property id.
     * @returns In Lua use `local v,q,t = syslib.getvalue(...)`; TS typically uses value only.
     * @noSelf
     */
    getvalue(pathspec: PathSpec): unknown;

    /**
     * Load an existing object handle, or nil if missing. Short: `syslib.obj`
     * @param objspec Path, numeric id, or object reference.
     * @noSelf
     */
    getobject(objspec?: ObjSpec): SysLibObject | undefined;

    /**
     * The object running the current script. Short: `syslib.slf`
     * @noSelf
     */
    getself(): SysLibObject;

    /**
     * Write value (and optionally quality, source timestamp). Short: `syslib.set`
     * @param pathspec Target object/property path or id.
     * @param value New value (type depends on property).
     * @param quality OPC UA quality; default good (0).
     * @param timestamp POSIX ms; default now.
     * @noSelf
     */
    setvalue(pathspec: PathSpec, value: unknown, quality?: QualityCode, timestamp?: EpochTime): void;

    /**
     * Outgoing references on an object, or on self if omitted. Short: `syslib.refs`
     * @param objspec Optional; if omitted, returns reference *names* on self only.
     * @noSelf
     */
    getreferences(objspec?: ObjSpec): Model.ReferenceList | string[];

    /**
     * Objects that reference this object. Short: `syslib.brefs`
     * @param objspec Object path or id.
     * @noSelf
     */
    getbackreferences(objspec: ObjSpec): Model.ReferenceList;

    /**
     * Replace all references on an object.
     * @param objspec Target object.
     * @param refs Tables with `name`, `path`, optional `type` (see ReferenceType).
     * @noSelf
     */
    setreferences(objspec: ObjSpec, refs: Model.ReferenceList): void;

    /**
     * Set ProcessValueLink on KPI / ISA-95 style objects. Short: `syslib.linkpv`
     * @param objspec Object receiving the link.
     * @param refPath Path to the I/O item to link.
     * @noSelf
     */
    linkprocessvalue(objspec: ObjSpec, refPath: string): void;

    /**
     * Create an in-memory object; call `:commit()` to persist. Short: `syslib.new`
     * @param parent Parent path/object/id.
     * @param className Model class string, e.g. `syslib.model.classes.Variable` as string code name in Lua.
     * @param objectType Optional `OT_*` type; default regular object.
     * @noSelf
     */
    createobject(parent: ObjSpec, className: string, objectType?: string): SysLibObject;

    /**
     * Delete an object (Core). Short: `syslib.del`
     * @param objspec Object to delete.
     * @noSelf
     */
    deleteobject(objspec: ObjSpec): void;

    /**
     * Enable a disabled object. Short: `syslib.ena`
     * @param objspec Target object.
     * @noSelf
     */
    enableobject(objspec: ObjSpec): void;

    /**
     * Disable an object. Short: `syslib.dis`
     * @param objspec Target object.
     * @noSelf
     */
    disableobject(objspec: ObjSpec): void;

    /**
     * Move/rename within the same component service.
     * @param objspec Object to move.
     * @param parent New parent object/path.
     * @param rename Optional new object name.
     * @noSelf
     */
    moveobject(objspec: ObjSpec, parent: ObjSpec, rename?: string): void;

    /**
     * Search object names/paths tree-wide. Short: `syslib.findobjects`
     * @param str Case-insensitive substring.
     * @param model Class model code; 0 = all.
     * @param dynonly Only dynamic objects.
     * @param fullpath Match full path vs name only.
     * @noSelf
     */
    findobjects(str: string, model?: number, dynonly?: boolean, fullpath?: boolean): SysLibObject[];

    /**
     * Numeric property id for mass/history APIs. Short: `syslib.propid`
     * @param objspec Object path/id.
     * @param propertyName Static property name; omit for dynamic item property.
     * @noSelf
     */
    getpropertyid(objspec: ObjSpec, propertyName?: string): number | undefined;

    /**
     * Property name for a property id.
     * @param propid Numeric property id.
     * @noSelf
     */
    getpropertyname(propid: number): string;

    /**
     * List property paths/values in one call. Short: `syslib.listproperties`
     * @param objspec Object to inspect.
     * @param resultspec Format like `"FVC|ad"` (fields | options); default `"FV"`.
     * @param args Extra args for `|wb` style option flags.
     * @returns Flat array plus length (Lua can contain nil holes).
     * @noSelf
     */
    listproperties(objspec: ObjSpec, resultspec?: string, ...args: unknown[]): LuaMultiReturn<[unknown[], number]>;

    /**
     * Entries for InstanceSelector / TableRowSelector properties.
     * @param pathspecOrPropcode Property path or property code.
     * @param options `resolve_path`, `parent` for instance resolution.
     * @noSelf
     */
    getselectorentries(
      pathspecOrPropcode: PathSpec | number,
      options?: { resolve_path?: boolean; parent?: ObjSpec },
    ): { items?: Array<Record<string, unknown>> };

    /**
     * Batch create/update/delete (DataStudio Mass). Short: `syslib.mass`
     * @param entries Array of mass tables (`path`, `class`, properties, `operation`, …).
     * @param batchFlags e.g. `SUPPRESS_RESULTS` to skip return values.
     * @returns Result status codes + per-entry error strings unless suppressed.
     * @noSelf
     */
    mass(entries: unknown[], batchFlags?: number): void | LuaMultiReturn<[number[], string[]]>;

    /**
     * Split absolute path into parent path and child name. Short: `syslib.splitp`
     * @param path Full object path (with `^` escapes per path rules).
     * @noSelf
     */
    splitpath(path: string): LuaMultiReturn<[string, string]>;

    /**
     * Nearest Core path above an I/O object. Short: `syslib.corep`
     * @param objspec Start object; default = current script context.
     * @noSelf
     */
    getcorepath(objspec?: ObjSpec): string;

    /**
     * Path of the object executing the script. Short: `syslib.selfp`
     * @noSelf
     */
    getselfpath(): string;

    /**
     * Nearest Connector above objspec. Short: `syslib.connp`
     * @param objspec Start object; default = self.
     * @noSelf
     */
    getconnectorpath(objspec?: ObjSpec): string | undefined;

    /**
     * Parent path of an object. Short: `syslib.parent`
     * @param objspec Child object path/id.
     * @noSelf
     */
    getparentpath(objspec: ObjSpec): string;

    /**
     * System object path for an I/O-model object. Short: `syslib.systemp`
     * @param objspec Start object; default = context.
     * @noSelf
     */
    getsystempath(objspec?: ObjSpec): string | undefined;

    /**
     * Relay paths above objspec. Short: `syslib.relayp`
     * @param objspec Object under relay hierarchy.
     * @noSelf
     */
    getrelaypaths(objspec: ObjSpec): string[] | undefined;

    /**
     * Run Lua source in objspec’s component; blocks unless timeout is 0.
     * @param objspec Execution context (`getself` during chunk); drives Core vs Connector routing.
     * @param chunk Lua source string.
     * @param timeout Ms; nil/default sync ~30s; 0 = fire-and-forget.
     * @noSelf
     */
    execute(objspec: ObjSpec, chunk: string, timeout?: number): unknown;

    /**
     * Protected call; errors yield `false`, message, optional `{ transient }`.
     * @param fn Function to run.
     * @param args Arguments passed to fn.
     * @noSelf
     */
    pcall<T extends unknown[]>(fn: (...args: T) => unknown, ...args: T): LuaMultiReturn<[boolean, unknown, Record<string, unknown>?]>;

    /**
     * Temporarily override scope settings (e.g. audit comment) for one call.
     * @param settings e.g. `{ comment: "…" }`.
     * @param fn Function to invoke.
     * @param args Arguments for fn.
     * @noSelf
     */
    scopedcall<T extends unknown[]>(
      settings: { comment?: string },
      fn: (...args: T) => unknown,
      ...args: T
    ): unknown;

    /**
     * Set audit/scope defaults for the rest of this Lua instance.
     * @param settings e.g. `{ comment: "…" }`.
     * @noSelf
     */
    setscopeparameters(settings: { comment?: string }): void;

    /**
     * Current scope parameters for this instance.
     * @noSelf
     */
    getscopeparameters(): { comment?: string;[key: string]: unknown };

    /**
     * Merge into script-local SCI defaults; empty table returns current. Short: `syslib.def`
     * @param defaultParams Keys like `write_delay`, `write_group`, …
     * @noSelf
     */
    defaults(defaultParams?: Record<string, unknown>): Record<string, unknown>;

    /**
     * Same as defaults (alias in docs).
     * @param defaultParams Partial defaults to set.
     * @noSelf
     */
    setdefaults(defaultParams?: Record<string, unknown>): Record<string, unknown>;

    /**
     * Read current SCI default table.
     * @noSelf
     */
    getdefaults(): Record<string, unknown>;

    /**
     * UTC milliseconds since epoch. Short: `syslib.now`
     * @noSelf
     */
    now(): number;

    /**
     * Current time ms; pass true for local wall clock. Short: `syslib.currenttime`
     * @param isLocal If true, return local-time-based ms.
     * @noSelf
     */
    currenttime(isLocal?: boolean): number;

    /**
     * Time zone: offset ms from UTC, name, DST flag.
     * @noSelf
     */
    currenttimezone(): LuaMultiReturn<[number, string, boolean]>;

    /**
     * Parse timestamp string → ms, or ms → ISO string, or custom format. Short: `syslib.time`
     * @param time String to parse or ms to format; omit for “current as string” usage in Lua.
     * @param format `strftime`-style when parsing a string.
     * @noSelf
     */
    gettime(time?: string | number, format?: string): number | string;

    /**
     * Split date/time into year, month, day, hour, min, sec, ms. Short: `syslib.tparts`
     * @param datetime POSIX ms or ISO-8601 string.
     * @noSelf
     */
    gettimeparts(datetime: number | string): LuaMultiReturn<[number, number, number, number, number, number, number]>;

    /**
     * Same parts as a 1-based array table in Lua. Short: `syslib.tpartst`
     * @param datetime POSIX ms or ISO-8601 string.
     * @noSelf
     */
    gettimepartstable(datetime: number | string): [number, number, number, number, number, number, number];

    /**
     * Monotonic counter in microseconds (steady clock).
     * @noSelf
     */
    getmicrosecondcounter(): number;

    /**
     * Excel serial date (days) → POSIX ms.
     * @param exlTime Excel double time.
     * @noSelf
     */
    excel2posix(exlTime: number): number;

    /**
     * POSIX ms → Excel serial date.
     * @param psxTime Ms since epoch.
     * @noSelf
     */
    posix2excel(psxTime: number): number;

    /**
     * Generate UUID v1 (default) or v4; Lua also returns version, variant, status. Short: `syslib.uuid`
     * @noSelf
     */
    uuid(): string;

    /**
     * Generate `count` UUIDs; options = version number or `{ version, format, secure_mac }`.
     * @param count Number of UUIDs (>0).
     * @param options Version (e.g. 4) or options table.
     * @noSelf
     */
    uuid(count: number, options?: number | UuidOptions): LuaMultiReturn<[string | string[], number, number, number]>;

    /**
     * Write one line to the executing object’s log.
     * @param logCode 1=ERR, 2=WRN, 3=INF, 4=DBG
     * @param message Primary text.
     * @param logDetails Optional detail string.
     * @noSelf
     */
    log(logCode: number, message: string, logDetails?: string): void;

    /**
     * Block the thread for approximately `milliseconds` (best effort).
     * @param milliseconds Sleep duration in ms.
     * @noSelf
     */
    sleep(milliseconds: number): void;

    /**
     * Read-only SQLite handle over static `properties` (object model query). Short: system DB access
     * @noSelf
     */
    getsystemdb(): SystemDb;

    /**
     * True if OPC UA/classic quality is Bad.
     * @param quality Quality code.
     * @noSelf
     */
    isbadstatus(quality: QualityCode): boolean;

    /**
     * True if quality is Good.
     * @param quality Quality code.
     * @noSelf
     */
    isgoodstatus(quality: QualityCode): boolean;

    /**
     * True if quality is Uncertain.
     * @param quality Quality code.
     * @noSelf
     */
    isuncertainstatus(quality: QualityCode): boolean;

    /**
     * Map low 16 bits OPC Classic quality → UA quality.
     * @param opcClassicQuality Classic quality word.
     * @noSelf
     */
    getopcuaquality(opcClassicQuality: number): number;

    /**
     * True if UA status indicates Extra Data (modified raw, etc.).
     * @param quality UA status/quality code.
     * @param ignoreInfoType If true, skip InfoType gate in check.
     * @noSelf
     */
    uaextradata(quality: QualityCode, ignoreInfoType?: boolean): boolean;

    /**
     * Read process environment string by key (MODULE_*, SERVICE_*, …).
     * @param key Environment variable name.
     * @noSelf
     */
    queryenvironment(key: string): string;

    /**
     * Current product key string (Core, admin).
     * @noSelf
     */
    getproductkey(): string;

    /**
     * Apply product key on Master Core (admin).
     * @param productKey Full key string.
     * @noSelf
     */
    setproductkey(productKey: string): void;

    /**
     * License status table (product key, expiry, grace, …).
     * @noSelf
     */
    getlicenseinfo(): Record<string, unknown>;

    /**
     * TCP connection table for this component (64-bit).
     * @param version 4 = IPv4 only, 6 = IPv6 only, omit = both.
     * @noSelf
     */
    gettcpconnections(version?: 4 | 6): TcpConnection[];

    /**
     * SHA-256 hex of string or finalized digest userdata.
     * @param text Plain string or digest handle from digestupdate.
     * @noSelf
     */
    digest(text: string | object): string;

    /**
     * Incremental SHA-256; pass nil/undefined to start, then pass returned handle again.
     * @param digest Previous handle or undefined for first chunk.
     * @param text Next byte chunk as Lua string.
     * @noSelf
     */
    digestupdate(digest: object | undefined, text: string): object;

    /**
     * SHA-256 of a built-in embedded library by name.
     * @param libName Library identifier string.
     * @noSelf
     */
    digestlib(libName: string): string;

    /**
     * Build a signed JWT (header/payload JSON strings; algo in header).
     * @param header JSON JWT header (`alg` required).
     * @param payload JSON claims.
     * @param algoParams `secret` for HS256-style algs; `private_key` PEM for RSA or ECDSA; `eddsa_curve` for EdDSA.
     * @noSelf
     */
    createjwt(header: string, payload: string, algoParams?: { secret?: string; private_key?: string; eddsa_curve?: string }): string;

    /**
     * Convert narrow/ASCII bytes to UTF-8.
     * @param str Source string.
     * @param codePage Optional code page id string.
     * @param bestEffort Replace invalid sequences when true (default in Lua).
     * @noSelf
     */
    asciitoutf8(str: string, codePage?: string, bestEffort?: boolean): string;

    /**
     * UTF-8 → system/ANSI bytes.
     * @param str UTF-8 text.
     * @param codePage Code page; 0 = current.
     * @param bestEffort Replace unmapped chars when true.
     * @noSelf
     */
    utf8toascii(str: string, codePage?: number, bestEffort?: boolean): string;

    /**
     * UTF-8 → UTF-16 byte string.
     * @param str UTF-8 input.
     * @param bigEndian Output endianness.
     * @noSelf
     */
    utf8to16(str: string, bigEndian?: boolean): string;

    /**
     * UTF-16 bytes → UTF-8.
     * @param str UTF-16 bytes (Lua string).
     * @param bigEndian Input is big-endian if true.
     * @noSelf
     */
    utf16to8(str: string, bigEndian?: boolean): string;

    /**
     * Unicode case-fold to lowercase (locale-aware).
     * @param str Input UTF-8.
     * @noSelf
     */
    foldcase(str: string): string;

    /**
     * ECMAScript regex full-string match.
     * @param str Haystack.
     * @param expression Pattern (escape backslashes).
     * @noSelf
     */
    regex(str: string, expression: string): boolean;

    /**
     * Binary Lua string → Base64 ASCII.
     * @param bytes Raw bytes as string.
     * @noSelf
     */
    enbase64(bytes: string): string;

    /**
     * Base64 → binary Lua string.
     * @param str Base64 text.
     * @noSelf
     */
    debase64(str: string): string;

    /**
     * Aggregated history from Core time-series store (OPC UA aggregates). Short: `syslib.hist`
     * @param paths Items to read (parallel to aggregates).
     * @param start Start POSIX ms (UTC).
     * @param end End POSIX ms; **exclusive** (no sample at `end`).
     * @param intervalsNo Number of buckets in [start, end).
     * @param aggregates Aggregate codes per path (e.g. `AGG_TYPE_INTERPOLATIVE`).
     * @param percentageGood Minimum good % per interval (default 100).
     * @param percentageBad Bad % cap (default 100).
     * @param treatUncertainAsBad Count Uncertain as Bad in aggregates.
     * @param slopedExtrapolation Sloped interpolation when no right bound.
     * @param partialIntervalTreatment e.g. `"UASTANDARD"`.
     * @param datastore Store path/id/code; omit for default archive target.
     * @returns `result[itemIndex][intervalIndex]` with `{ V, S, T }`.
     * @noSelf
     */
    gethistory(
      paths: ObjSpec[],
      start: EpochTime,
      end: EpochTime,
      intervalsNo?: number,
      aggregates?: string[],
      percentageGood?: number,
      percentageBad?: number,
      treatUncertainAsBad?: boolean,
      slopedExtrapolation?: boolean,
      partialIntervalTreatment?: string,
      datastore?: StoreSpec,
    ): HistoryInterval[][];

    /**
     * Oldest and/or newest raw timestamp in store for a historized property. Short: `syslib.histf`
     * @param pathspec Item or property path.
     * @param datastore Optional non-default store.
     * @noSelf
     */
    gethistoryframe(pathspec: PathSpec, datastore?: StoreSpec): LuaMultiReturn<[EpochTime, EpochTime] | [EpochTime] | []>;

    /**
     * Raw samples iterator + `more` flag (Core only; no remote stores).
     * @param pathspec Historized property/object.
     * @param bounds Include bounding values (false if using modified_data_mode).
     * @param timeStart Start ms, or undefined in Lua for open start.
     * @param timeEnd End ms, exclusive; undefined in Lua for open end (not both nil).
     * @param maxLimit Max points; 0 = all.
     * @param datastore Optional store specifier.
     * @param modifiedDataMode True = modified-value versions (4-tuple iterator in Lua).
     * @noSelf
     */
    getrawhistory(
      pathspec: PathSpec,
      bounds: boolean,
      timeStart: EpochTime | undefined,
      timeEnd: EpochTime | undefined,
      maxLimit?: number,
      datastore?: StoreSpec,
      modifiedDataMode?: boolean,
    ): LuaMultiReturn<[RawHistoryIterator, boolean]>;

    /**
     * Queue one raw history point (dynamic property id). Short: `syslib.sethist`
     * @param propertyId `syslib.getpropertyid(...)` for the item.
     * @param value / quality / timestamp VQT for the sample.
     * @noSelf
     */
    sethistory(propertyId: number, value: unknown, quality: QualityCode, timestamp: EpochTime): boolean;

    /**
     * Delete raw history in `[timeStart, timeEnd)` (hour-aligned boundaries may apply).
     * @param pathspec Target property/object.
     * @param timeStart / timeEnd POSIX ms range.
     * @param datastore Optional store.
     * @noSelf
     */
    deleterawhistory(pathspec: PathSpec, timeStart: EpochTime, timeEnd: EpochTime, datastore?: StoreSpec): void;

    /**
     * Default time-series store id for a historized property (for `gethistory` datastore arg).
     * @param pathspec Historized property path.
     * @param allowRemote Allow resolving a remote store on Local Core.
     * @noSelf
     */
    getdefaultstore(pathspec: PathSpec, allowRemote?: boolean): number;

    /**
     * Numeric store id for a custom store object or `RepoStoreName` code.
     * @param store Objspec or system store code.
     * @noSelf
     */
    getstoreid(store: ObjSpec | number): number;

    /**
     * Map archived source timestamps → server timestamp (or false if none).
     * @param pathspec Historized property.
     * @param time Reference POSIX ms.
     * @param datastore Optional store.
     * @noSelf
     */
    queryservertimestamp(pathspec: PathSpec, time: EpochTime, datastore?: StoreSpec): Record<number, number | false>;

    /**
     * Read history from external OPC HDA/UA datasource (Connector).
     * @param datasource Datasource object/path.
     * @param ids One or more item ids.
     * @param start / end Ms, nil, or HDA time strings per spec.
     * @param maxValues Cap per item (0 = unlimited).
     * @param boundRequired HDA bounding values.
     * @param modificationInfo UA: include modification info arrays.
     * @noSelf
     */
    gethistoryex(
      datasource: ObjSpec,
      ids: string | string[],
      start?: EpochTime | string,
      end?: EpochTime | string,
      maxValues?: number,
      boundRequired?: boolean,
      modificationInfo?: boolean,
    ): HistoryInterval[] | HistoryInterval[][];

    /**
     * Write history to external historian (HDA / IP.21).
     * @param datasource Target datasource.
     * @param tags Item ids (repeat tag for multiple times).
     * @param values Parallel values.
     * @param qualities UA qualities; empty = all good.
     * @param timestamps Parallel ms; missing = now.
     * @param mode `upsert` | `insert` | `update`.
     * @noSelf
     */
    sethistoryex(
      datasource: ObjSpec,
      tags: string[],
      values: unknown[],
      qualities: number[],
      timestamps: EpochTime[],
      mode?: "upsert" | "insert" | "update",
    ): number[];

    /**
     * Build event userdata for `setevent` (preserves custom attribute order).
     * @param standardAttrs Built-in keys: Severity, Message, Timestamp, Type, …
     * @param customAttrs Pairs `{ { "key", value }, … }`.
     * @noSelf
     */
    createevent(standardAttrs: Record<string, unknown>, customAttrs?: [string, unknown][]): object;

    /**
     * Fire a script / OPC-style event. Short: `syslib.setev`
     * @param data Table or userdata from `createevent`.
     * @noSelf
     */
    setevent(data: Record<string, unknown> | object): boolean;

    /**
     * Query stored events (JSON string default; table if defaults say so).
     * @param paths Event source objects.
     * @param start / end UTC ms window.
     * @param options `data_store`, Mongo `filter`/`sort`/`projection` strings, `limit`, `skip`, `transformation`.
     * @noSelf
     */
    geteventhistory(paths: ObjSpec[], start: EpochTime, end: EpochTime, options?: EventHistoryOptions): string | unknown[];

    /**
     * Audit trail documents (Master Core; reviewer role).
     * @param objspecs Objects to scope; omit for all (admin).
     * @param options Time range, skip, limit, type flags, projection.
     * @noSelf
     */
    getaudittrail(objspecs?: ObjSpec | ObjSpec[], options?: AuditTrailOptions): unknown[];

    /**
     * Configuration log entries (Core).
     * @param objspecs Objects to include; omit requires admin for all.
     * @param options Time range, limit, projection, optional `component` remote core.
     * @noSelf
     */
    getconfiglog(objspecs?: ObjSpec | ObjSpec[], options?: Record<string, unknown>): unknown[];

    /**
     * Log display messages in a time window (Master Core).
     * @param startTime / endTime Ms range.
     * @param objects Filter by objects; omit = all objects.
     * @param maxlogs Max rows; 0 = all matches.
     * @noSelf
     */
    getlogs(startTime: EpochTime, endTime: EpochTime, objects?: ObjSpec[], maxlogs?: number): unknown[];

    /**
     * True if profiles have all requested model access flags (Core).
     * @param modelFlags Bitmask of ProfileModelAccess.
     * @param profiles Profile object(s); omit = current user.
     * @noSelf
     */
    checkmodelaccess(modelFlags: number, profiles?: ObjSpec | ObjSpec[]): boolean;

    /**
     * True if profiles have all listed security attributes on pathspec (Core).
     * @param pathspec Object or property path.
     * @param secAttr Bitmask of SecurityAttributes (READ, WRITE, …).
     * @param profiles Optional profile objspec(s); omit = current user.
     * @noSelf
     */
    checkpermission(pathspec: PathSpec, secAttr: number, profiles?: ObjSpec | ObjSpec[]): boolean;

    /**
     * Read file bytes from File / FileList property (GridFS). Master Core.
     * @param pathspec Property path.
     * @param filter File name or advanced filter; omit if single File property.
     * @noSelf
     */
    getfile(pathspec: PathSpec, filter?: string): LuaMultiReturn<[string, FileMetadata]>;

    /**
     * Metadata only for a stored file.
     * @param pathspec File or FileList property.
     * @param filter Name or filter per `getfilemetadata` grammar in docs.
     * @noSelf
     */
    getfilemetadata(pathspec: PathSpec, filter?: string): FileMetadata;

    /**
     * Store or replace file content on File / FileList property.
     * @param pathspec Target property.
     * @param data Raw file bytes as string.
     * @param nameOrMeta File name or `{ name, … }` metadata.
     * @param mode `replace` (default) or `merge` metadata.
     * @noSelf
     */
    setfile(pathspec: PathSpec, data: string, nameOrMeta?: string | FileMetadata, mode?: "replace" | "merge"): FileMetadata;

    /**
     * Update metadata of an existing stored file.
     * @param pathspec File / FileList property.
     * @param nameOrMeta File name or metadata with `name`.
     * @param metadata New fields; `mode` `merge` (default) or `replace`.
     * @param mode Metadata replace vs merge.
     * @noSelf
     */
    setfilemetadata(
      pathspec: PathSpec,
      nameOrMeta: string | FileMetadata,
      metadata?: FileMetadata,
      mode?: "replace" | "merge",
    ): FileMetadata;

    /**
     * Remove one file from FileList (or File) property.
     * @param pathspec Property path.
     * @param name File name when FileList; omit when File-type property.
     * @noSelf
     */
    deletefile(pathspec: PathSpec, name?: string): FileMetadata;

    /**
     * lua-mongo client + default db/collection names for a data store.
     * @param store Custom store objspec or `RepoStoreName` code; omit = system custom on Master.
     * @param testarchive System time-series: true = test archive connection.
     * @noSelf
     */
    getmongoconnection(store?: ObjSpec | number, testarchive?: boolean): LuaMultiReturn<[MongoClient, string, string]>;

    /**
     * Mongo connection string + db + collection for lua-mongo `Client(...)`.
     * @param store Objspec or repo code (Local Core rules apply).
     * @param storeType When store is code: test-archive flag; when objspec: optional repo type override.
     * @noSelf
     */
    getmongoconnectionstring(store?: ObjSpec | number, storeType?: boolean | number): LuaMultiReturn<[string, string, string]>;

    /**
     * Current SaF sequence number(s) for a data category (or all if category = NONE).
     * @param category `syslib.model.codes.SafDataCategory.*`
     * @noSelf
     */
    getsafseqnr(category: number): number | Record<number, number>;

    /**
     * Highest sequence forwarded to target for category (or table for NONE).
     * @param category SaF category code.
     * @noSelf
     */
    getsafforwardedseqnr(category: number): number | Record<number, number>;

    /**
     * Highest sequence acknowledged/stored remotely (or table for NONE).
     * @param category SaF category code.
     * @noSelf
     */
    getsafconfirmedseqnr(category: number): number | Record<number, number>;

    /**
     * Dump component object image + sidecar files to `path` (full file path, not directory).
     * @param path Filesystem path including filename prefix.
     * @noSelf
     */
    dumpimage(path: string): string;

    /** Lua VM / instance administration (Core). */
    control: {
      /**
       * Id of the calling Lua instance.
       * @noSelf
       */
      getself(): number;
      /**
       * Promote instance to dedicated thread (system admin).
       * @param id Instance id from `list`.
       * @noSelf
       */
      dedicate(id: number): boolean;
      /**
       * Running Lua instances: state, CPU, memory, source, etc.
       * @param options If `{ self: objspec }`, scope listing.
       * @noSelf
       */
      list(options?: { self?: ObjSpec }): LuaInstanceInfo[];
      /**
       * Force-terminate a Lua VM by id (admin).
       * @param id Target instance id.
       * @noSelf
       */
      terminate(id: number): void;
    };

    /**
     * Script memory usage for one object, top-N table, or all script objects.
     * @param objspec Object path/id; with `limit`, pass null and use second arg.
     * @param limit When objspec null, return top `limit` consumers as oid→bytes map.
     * @noSelf
     */
    luamemory(objspec?: ObjSpec | null, limit?: number): number | Record<number, number>;

    /**
     * CPU% and normalization factor, or top-N map + factor.
     * @param objspec Same semantics as `luamemory`.
     * @param limit Top-N when objspec null.
     * @noSelf
     */
    luacpuusage(objspec?: ObjSpec | null, limit?: number): LuaMultiReturn<[number | Record<number, number>, number]>;

    /**
     * Opaque queue handle for an object slot (1–63).
     * @param objspec Owner object.
     * @param slot Slot index 1..63.
     * @noSelf
     */
    msgqueue(objspec: ObjSpec, slot: number): MsgQueue;

    /**
     * Push persistent string message; returns false + error on failure.
     * @param queue From `msgqueue`.
     * @param msg Opaque payload string.
     * @noSelf
     */
    msgpush(queue: MsgQueue, msg: string): LuaMultiReturn<[boolean, string?]>;

    /**
     * Drop all messages with id ≤ msgid.
     * @param queue Target queue.
     * @param msgid Monotonic message id.
     * @noSelf
     */
    msgpop(queue: MsgQueue, msgid: number): void;

    /**
     * Next message after msgid, or first if msgid omitted; empty if none.
     * @param queue Target queue.
     * @param msgid Previous id from last `msgnext`.
     * @noSelf
     */
    msgnext(queue: MsgQueue, msgid?: number): LuaMultiReturn<[number, string] | []>;

    /**
     * Remove every message from the queue.
     * @param queue Target queue.
     * @noSelf
     */
    msgclear(queue: MsgQueue): void;

    /**
     * Queue statistics for one queue or all queues.
     * @param queue Optional specific queue; omit = aggregate stats list.
     * @noSelf
     */
    msgstats(queue?: MsgQueue): MsgStats | MsgStats[];

    /**
     * OPC UA Browse (references from nodes). Connector.
     * @param datasource UA datasource objspec.
     * @param nodesToBrowse Node id string, table of ids, or browse-description tables.
     * @param defaults Optional browse direction, referenceTypeId, masks, requestedMax, …
     * @noSelf
     */
    uabrowse(datasource: ObjSpec, nodesToBrowse: unknown, defaults?: Record<string, unknown>): unknown[];

    /**
     * UA BrowseNext with continuation points.
     * @param datasource UA datasource.
     * @param checkpoints Continuation strings from prior browse.
     * @noSelf
     */
    uabrowsenext(datasource: ObjSpec, checkpoints: string[]): unknown[];

    /**
     * UA Read service for attributes.
     * @param datasource UA datasource.
     * @param nodesToRead `{ nodeId, attributeId, indexRange?, … }[]`.
     * @param maxAge Cache max age ms (0 = from device).
     * @param returnTs 0 source, 1 server, 2 both, 3 neither.
     * @noSelf
     */
    uaread(datasource: ObjSpec, nodesToRead: unknown[], maxAge?: number, returnTs?: 0 | 1 | 2 | 3): unknown[];

    /**
     * UA Call — invoke one or more methods.
     * @param datasource UA datasource.
     * @param methodsToCall `{ objectId, methodId, inputArguments?, datatypes? }[]`.
     * @noSelf
     */
    uamethodcall(datasource: ObjSpec, methodsToCall: unknown[]): unknown[];

    /**
     * Open OPC DA browsing session; returns userdata with Browse/Query methods. Connector.
     * @param datasource Classic OPC DA datasource path.
     * @noSelf
     */
    opcdabrowse(datasource: ObjSpec): object | undefined;

    /**
     * OPC HDA/UA item attributes for tags. Connector.
     * @param datasource HDA or UA historian datasource.
     * @param itemIds One or more item ids.
     * @param attributeIds Subset of attributes; omit = defaults.
     * @param skipValues If true, metadata only.
     * @noSelf
     */
    getattributesex(
      datasource: ObjSpec,
      itemIds: string | string[],
      attributeIds?: number[],
      skipValues?: boolean,
    ): unknown[][];

    /**
     * HDA server-supported attribute list + HRESULT.
     * @param datasource HDA datasource.
     * @noSelf
     */
    hdagetitemattributes(datasource: ObjSpec): LuaMultiReturn<[unknown, number]>;

    /**
     * HDA SyncReadAttribute for one item.
     * @param datasource HDA datasource.
     * @param itemTag HDA item id.
     * @param attributeTags Integer attribute ids.
     * @param startTime HDA or POSIX start.
     * @param endTime HDA or POSIX end.
     * @noSelf
     */
    hdareadattributes(
      datasource: ObjSpec,
      itemTag: string,
      attributeTags: number[],
      startTime?: EpochTime | string,
      endTime?: EpochTime | string,
    ): unknown[];

    /**
     * Browse IP.21 records via gRPC datasource. Connector.
     * @param datasource IP.21 datasource object.
     * @param tags Wildcard string, record id number, or continuation userdata.
     * @param options `limit`, `numeric_itemid`, …
     * @noSelf
     */
    ip21browse(
      datasource: ObjSpec,
      tags?: string | number | object,
      options?: Record<string, unknown>,
    ): Ip21BrowseItem[] | LuaMultiReturn<[undefined, string, number]>;

    /**
     * Parse IP.21 item id string into `{ rn?, rid?, fn? }`.
     * @param itemid Item id from IoItem configuration.
     * @noSelf
     */
    ip21parseitemid(itemid: string): Record<string, string> | undefined;

    /**
     * Build IP.21 item id string from record name/id and optional field.
     * @param tag Record name string or numeric record id.
     * @param field Optional field name.
     * @noSelf
     */
    ip21getitemid(tag: string | number, field?: string): string;

    /**
     * Remove named rolling buffer from object.
     * @param objspec Buffer owner.
     * @param name Buffer name.
     * @noSelf
     */
    buffer(objspec: ObjSpec, name: string): void;

    /**
     * Create rolling buffer: cap by `duration` ms and `size` points on `input` (property `.X` or buffer name).
     * @param objspec Owner object.
     * @param name New buffer name.
     * @param input Source property path or buffer name.
     * @param duration Max span of samples in ms.
     * @param size Max number of samples.
     * @noSelf
     */
    buffer(objspec: ObjSpec, name: string, input: string, duration: number, size: number): void;

    /**
     * Buffer fed from another buffer, transformed by Lua chunk string `transformFn(input, peek, tear)`.
     * @param transformFn Lua source string executed in restricted env.
     * @noSelf
     */
    buffer(objspec: ObjSpec, name: string, input: string, duration: number, size: number, transformFn: string): void;

    /**
     * Buffer with periodic/built-in aggregation from input buffer (e.g. `AGG_TYPE_AVERAGE`).
     * @param aggPeriod Aggregation period ms (0 = on each sample).
     * @param aggType Aggregate code string.
     * @noSelf
     */
    buffer(objspec: ObjSpec, name: string, input: string, duration: number, size: number, aggPeriod: number, aggType: string): void;

    /**
     * Detach repeater from buffer (or remove repeater attachment only).
     * @param objspec Buffer owner.
     * @param name Buffer name.
     * @noSelf
     */
    attach(objspec: ObjSpec, name: string): void;

    /**
     * Attach object with dynamic property as repeater target for buffer output.
     * @param repeater Target objspec receiving each new buffered value.
     * @noSelf
     */
    attach(objspec: ObjSpec, name: string, repeater: ObjSpec): void;

    /**
     * Read buffer without clearing: values[], qualities[], timestamps[], counter.
     * @param objspec Buffer owner.
     * @param name Buffer name.
     * @noSelf
     */
    peek(objspec: ObjSpec, name: string): LuaMultiReturn<[unknown[], number[], number[], number]>;

    /**
     * Read and clear buffer atomically (same tuple shape as `peek`).
     * @param objspec Buffer owner.
     * @param name Buffer name.
     * @noSelf
     */
    tear(objspec: ObjSpec, name: string): LuaMultiReturn<[unknown[], number[], number[], number]>;

    /**
     * Most recent value in named buffer.
     * @param objspec Buffer owner.
     * @param name Buffer name.
     * @noSelf
     */
    last(objspec: ObjSpec, name: string): unknown;

    /**
     * Parallel arrays describing all buffers on object or entire component.
     * @param objspec Optional; omit = list buffers in this service.
     * @noSelf
     */
    listbuffer(objspec?: ObjSpec): ListBufferResult;
  }
}

declare const syslib: SysLib.SysLib;
declare const inmation: SysLib.SysLib;

declare namespace Host {
  namespace io {
    /**
     * Read entire file from host filesystem (inmation host agent).
     * @param filePath Absolute or workspace-relative path.
     * @noSelf
     */
    function read(filePath: string): string;

    /**
     * Write string content to file (create/overwrite).
     * @param filePath Destination path.
     * @param content Full file body.
     * @noSelf
     */
    function write(filePath: string, content: string): void;
  }

  namespace os {
    /**
     * Run shell command on host; returns stdout or undefined.
     * @param cmd Command line.
     * @param cwd Optional working directory.
     * @noSelf
     */
    function exec(cmd: string, cwd?: string): string | undefined;
  }

  namespace workspace {
    /** Active workspace identity from host. */
    interface WorkspaceInfo {
      path: string;
      name: string;
    }

    /**
     * Current workspace path and display name (DataStudio / tooling).
     * @noSelf
     */
    function info(): WorkspaceInfo;
  }
}