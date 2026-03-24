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

    type ReferenceType =
      | "SECURITY"
      | "OBJECT_LINK"
      | "PROPERTY_LINK"
      | "OBJECT_LINK_PASSIVE";

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
    getbackreferences(objspec: string | number | SysLibObject): Model.ReferenceList;

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

    /**
     * Common inmation usage is:
     * - syslib.gettime() -> current time string
     * - syslib.gettime("2026-03-24T07:00:00.000Z") -> converted runtime value
     */
    /** @noSelf */
    gettime(timestamp?: number | string): string | number;

    /** @noSelf */
    log(level: number, message: string): void;

    /** @noSelf */
    getselfpath(): string;

    /** @noSelf */
    getsystemdb(): SystemDb;

    /** @noSelf */
    buffer(objspec: string | number, name: string): void;

    /** @noSelf */
    buffer(objspec: string | number, name: string, input: string, duration: number, size: number): void;

    /** @noSelf */
    buffer(
      objspec: string | number,
      name: string,
      input: string,
      duration: number,
      size: number,
      transformFn: string
    ): void;

    /** @noSelf */
    buffer(
      objspec: string | number,
      name: string,
      input: string,
      duration: number,
      size: number,
      aggPeriod: number,
      aggType: string
    ): void;

    /** @noSelf */
    attach(objspec: string | number, name: string): void;

    /** @noSelf */
    attach(objspec: string | number, name: string, repeater: string | number): void;

    /** @noSelf */
    peek(objspec: string | number, name: string): LuaMultiReturn<[unknown[], number[], number[], number]>;

    /** @noSelf */
    tear(objspec: string | number, name: string): LuaMultiReturn<[unknown[], number[], number[], number]>;

    /** @noSelf */
    last(objspec: string | number, name: string): unknown;

    /** @noSelf */
    listbuffer(objspec?: string | number): ListBufferResult;

    /** @noSelf */
    getmongoconnection(store?: string | number, testarchive?: boolean): LuaMultiReturn<[MongoClient, string, string]>;

    /** @noSelf */
    getlogs(startTime: number, endTime: number, objects?: (string | number)[], maxlogs?: number): unknown[];
  }
}

declare const syslib: SysLib.SysLib;
declare const inmation: SysLib.SysLib;

// Minimal LuaMultiReturn declaration (mirrors @typescript-to-lua/language-extensions)
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