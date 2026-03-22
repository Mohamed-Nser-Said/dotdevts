/**
 * Exportable TypeScript interfaces for the inmation syslib API.
 *
 * Re-exports every type from the global `SysLib` ambient namespace
 * (declared in syslib.d.ts) as named module exports, so they can be
 * imported explicitly instead of referenced through the global namespace.
 *
 * Usage:
 *   import type { SysLibObject, ModelInfo, SystemDbRow } from "../extern/syslib-types";
 */

// ── Primitive aliases ───────────────────────────────────────────────────────

export type NumID        = SysLib.NumID;
export type ObjID        = SysLib.ObjID;
export type ObjPath      = SysLib.ObjPath;
export type ObjSpec      = SysLib.ObjSpec;
export type PathSpec     = SysLib.PathSpec;
export type StoreSpec    = SysLib.StoreSpec;
export type EpochTime    = SysLib.EpochTime;
export type ISO8601      = SysLib.ISO8601;
export type QualityCode  = SysLib.QualityCode;

// ── Model sub-types ─────────────────────────────────────────────────────────

export type ModelReference     = SysLib.Model.Reference;
export type ModelReferenceType = SysLib.Model.ReferenceType;
export type ModelReferenceList = SysLib.Model.ReferenceList;
export type ModelObject        = SysLib.Model.Object;
export type MassStatus         = SysLib.Model.Codes.MassStatus;

// ── Code / flag tables ──────────────────────────────────────────────────────

export type MassOp                  = SysLib.MassOp;
export type ReferenceType           = SysLib.ReferenceType;
export type SecurityAttributes      = SysLib.SecurityAttributes;
export type SysPropAttributes       = SysLib.SysPropAttributes;
export type Flags                   = SysLib.Flags;
export type HistoryTransporterMode  = SysLib.HistoryTransporterMode;
export type SimpleRecurrence        = SysLib.SimpleRecurrence;
export type AuxStateChangeStrategy  = SysLib.AuxStateChangeStrategy;
export type ProcessMode             = SysLib.ProcessMode;
export type EventPurgeOptions       = SysLib.EventPurgeOptions;
export type Codes                   = SysLib.Codes;
export type Classes                 = SysLib.Classes;
export type Properties              = SysLib.Properties;

// ── Model info ───────────────────────────────────────────────────────────────

export type ModelInfo   = SysLib.ModelInfo;

// ── Object handle ────────────────────────────────────────────────────────────

/** Alias for the syslib object handle returned by getobject / mass. */
export type SysLibObject = SysLib.SysLibObject;

// ── SystemDb ─────────────────────────────────────────────────────────────────

export type SystemDbRow    = SysLib.SystemDbRow;
export type SystemDbCursor = SysLib.SystemDbCursor;
export type SystemDb       = SysLib.SystemDb;

// ── Buffer API ───────────────────────────────────────────────────────────────

export type ListBufferResult = SysLib.ListBufferResult;

// ── New structural types ──────────────────────────────────────────────────────

/** A single back/forward reference entry as returned by getreferences / getbackreferences. */
export interface ReferenceEntry {
  name: string;
  path: string;
  type: string | number;
}

/** Raw-history iterator returned by syslib.getrawhistory(). */
export type RawHistoryIterator = () => LuaMultiReturn<[number, unknown, number] | []>;

/** A single VQT datum returned from gethistory / gethistoryex intervals. */
export interface VQT {
  V: unknown;
  Q: number;
  T: number;
}

/** An interval entry returned by gethistory (raw intervals may have V as array). */
export interface HistoryInterval {
  V: unknown;
  Q: number;
  T: number;
  S?: number;  // server timestamp (UA sources)
}

/** Metadata table returned/accepted by file functions. */
export type FileMetadata = Record<string, unknown>;

/** Entry returned by syslib.control.list(). */
export interface LuaInstanceInfo {
  id: number;
  state: "idle" | "running" | "terminated" | "disabled";
  mem_usage: number;
  cpu_usage: number;
  source_type: "default" | "thread" | "lua_obj" | "lua_channel" | "channel";
  source_sub_type: string;
  dedicated: boolean;
  self: SysLibObject | undefined;
}

/** A message queue handle returned by syslib.msgqueue(). */
export type MsgQueue = object;

/** Stats table returned by syslib.msgstats(). */
export interface MsgStats {
  pending: number;
  delivered: number;
  [key: string]: unknown;
}

/** Entry in an IP21 browse result. */
export interface Ip21BrowseItem {
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

/** A single TCP connection entry returned by syslib.gettcpconnections(). */
export interface TcpConnection {
  v: 4 | 6;
  state: number;
  laddr: string;
  raddr: string;
  lport: number;
  rport: number;
}

/** Audit trail query options. */
export interface AuditTrailOptions {
  time_start?: number;
  time_end?: number;
  skip?: number;
  limit?: number;
  type?: number;
  projection?: string[];
}

/** Options for syslib.geteventhistory(). */
export interface EventHistoryOptions {
  data_store?: ObjSpec;
  filter?: string;
  projection?: string;
}

/** Result row from syslib.getrawhistory iterator. */
export type RawHistoryRow = LuaMultiReturn<[number, unknown, number]>;

// ── Top-level syslib interface ────────────────────────────────────────────────

/**
 * Dependency-injectable interface for the inmation syslib / inmation API.
 *
 * Use this to type constructor parameters or service dependencies so that the
 * real `syslib` global and test doubles both satisfy the same contract:
 *
 * ```ts
 * class MyService {
 *   constructor(private readonly syslib: ISysLib) {}
 * }
 *
 * // production
 * const svc = new MyService(syslib);
 *
 * // test
 * const mock: ISysLib = { getobject: () => undefined, ... };
 * const svc = new MyService(mock);
 * ```
 */
export interface ISysLib {
  // ── Model metadata ────────────────────────────────────────────────────────
  readonly model: ModelInfo;

  // ── Object access ─────────────────────────────────────────────────────────
  getvalue(path: string): unknown;
  getobject(objspec?: ObjSpec): SysLibObject | undefined;
  /** Short: syslib.set — sets value, optionally quality and timestamp. */
  setvalue(path: string, value: unknown, quality?: number, timestamp?: number): void;
  enableobject(objspec: ObjSpec): void;
  disableobject(objspec: ObjSpec): void;
  deleteobject(objspec: ObjSpec): void;
  /** Short: syslib.refs — returns references of objspec, or self-reference names if omitted. */
  getreferences(objspec?: ObjSpec): ReferenceEntry[] | string[];
  /** Short: syslib.brefs — returns back-references of objspec. */
  getbackreferences(objspec: ObjSpec): ReferenceEntry[];
  /** Short: syslib.obj — returns existing object or nil. */
  getobject(objspec?: ObjSpec): SysLibObject | undefined;
  /** Short: syslib.slf — returns the current (self) object. */
  getself(): SysLibObject;
  /** Short: syslib.parent — returns the parent path of objspec. */
  getparentpath(objspec: ObjSpec): string;
  /** Short: syslib.new — creates a new object (not yet committed). */
  createobject(parent: ObjSpec, cls: string, type?: string): SysLibObject;
  /** Short: syslib.del — deletes an object. */
  deleteobject(objspec: ObjSpec): void;
  /** Short: syslib.ena — enables an object. */
  enableobject(objspec: ObjSpec): void;
  /** Short: syslib.dis — disables an object. */
  disableobject(objspec: ObjSpec): void;
  /** Moves and/or renames an object within the same component. */
  moveobject(objspec: ObjSpec, parent: ObjSpec, rename?: string): void;
  /** Creates or replaces the references on an object. */
  setreferences(objspec: ObjSpec, refs: ReferenceEntry[]): void;
  /** Links a process value reference onto objspec. */
  linkprocessvalue(objspec: ObjSpec, ref: string): void;
  /** Short: syslib.findobjects — full-tree object search. */
  findobjects(str: string, model?: number, dynonly?: boolean, fullpath?: boolean): SysLibObject[];

  // ── Property helpers ──────────────────────────────────────────────────────
  /** Short: syslib.propid — returns the numeric property ID. */
  getpropertyid(objspec: ObjSpec, propertyName?: string): number | undefined;
  /** Returns the property name for a given property ID. */
  getpropertyname(propid: number): string;
  /** Short: syslib.listproperties — live property listing with optional format/filter. */
  listproperties(objspec: ObjSpec, resultspec?: string, ...args: unknown[]): [unknown[], number];
  /** Returns selector entries for an InstanceSelector or TableRowSelector property. */
  getselectorentries(pathspecOrPropcode: ObjSpec | number, options?: { resolve_path?: boolean; parent?: ObjSpec }): { items?: Array<Record<string, unknown>> };

  // ── Mass operations ───────────────────────────────────────────────────────
  /** Short: syslib.mass — batch create/update/delete. Returns result codes when batch_flags omit SUPPRESS_RESULTS. */
  mass(entries: unknown[], batchFlags?: number): [number[], string[]] | void;

  // ── Path utilities ────────────────────────────────────────────────────────
  /** Short: syslib.splitp — splits a path into (parent, name). */
  splitpath(path: string): [string, string];
  getcorepath(objspec?: ObjSpec): string;
  /** Short: syslib.selfp — returns the path of the current object. */
  getselfpath(): string;
  getconnectorpath(objspec?: ObjSpec): string | undefined;
  /** Short: syslib.systemp — returns the System path for an IO-model object. */
  getsystempath(objspec?: ObjSpec): string | undefined;
  /** Short: syslib.relayp — returns relay paths above objspec. */
  getrelaypaths(objspec?: ObjSpec): string[] | undefined;

  // ── Execution / scripting ─────────────────────────────────────────────────
  execute(objspec: ObjSpec, chunk: string, timeout?: number): unknown;
  /** Runs func in protected mode — like Lua pcall but returns an extra error-info table. */
  pcall<T extends unknown[]>(func: (...args: T) => unknown, ...args: T): [true, unknown] | [false, string, Record<string, unknown>];
  /** Executes callback with a temporary scope override (e.g. audit comment). */
  scopedcall<T extends unknown[]>(settings: { comment?: string }, func: (...args: T) => unknown, ...args: T): unknown;
  /** Sets scope parameters (e.g. audit comment) for all subsequent calls in this instance. */
  setscopeparameters(settings: { comment?: string }): void;
  /** Returns the current scope parameters. */
  getscopeparameters(): { comment?: string; [key: string]: unknown };

  // ── Defaults ─────────────────────────────────────────────────────────────
  /** Short: syslib.def — sets and/or returns the current SCI defaults. */
  defaults(params?: Record<string, unknown>): Record<string, unknown>;
  setdefaults(params?: Record<string, unknown>): Record<string, unknown>;
  getdefaults(): Record<string, unknown>;

  // ── Time & identity ───────────────────────────────────────────────────────
  /** Short: syslib.now — returns ms since epoch (UTC). */
  now(): number;
  /** Short: syslib.currenttime — same as now(); pass true for local time. */
  currenttime(local?: boolean): number;
  /** Returns [utcOffsetMs, timezoneName, isDst]. */
  currenttimezone(): LuaMultiReturn<[number, string, boolean]>;
  /** Short: syslib.time — converts ISO-8601 string → ms, or ms → ISO-8601 string. */
  gettime(time: string | number, format?: string): number | string;
  /** Returns time parts as 7 separate values: year, month, day, hour, min, sec, ms. */
  gettimeparts(datetime: number | string): LuaMultiReturn<[number, number, number, number, number, number, number]>;
  /** Returns time parts as a table [year, month, day, hour, min, sec, ms]. */
  gettimepartstable(datetime: number | string): [number, number, number, number, number, number, number];
  /** Returns a microsecond-precision monotonic counter. */
  getmicrosecondcounter(): number;
  /** Converts Excel serial time to POSIX ms. */
  excel2posix(exlTime: number): number;
  /** Converts POSIX ms to Excel serial time. */
  posix2excel(psxTime: number): number;
  /** Short: syslib.uuid — generates one or more UUIDs. */
  uuid(count?: number, options?: number | { version?: number; format?: "text" | "binary"; secure_mac?: boolean }): LuaMultiReturn<[string | string[], number, number, number]>;

  // ── Logging ───────────────────────────────────────────────────────────────
  /** log_code: 1=ERR, 2=WRN, 3=INF, 4=DBG */
  log(level: number, message: string, details?: string): void;

  // ── Sleep ─────────────────────────────────────────────────────────────────
  sleep(ms: number): void;

  // ── System database ───────────────────────────────────────────────────────
  getsystemdb(): SystemDb;

  // ── Quality helpers ───────────────────────────────────────────────────────
  isbadstatus(quality: number): boolean;
  isgoodstatus(quality: number): boolean;
  isuncertainstatus(quality: number): boolean;
  getopcuaquality(opcClassicQuality: number): number;

  // ── Environment / product key ─────────────────────────────────────────────
  queryenvironment(key: string): string;
  getproductkey(): string;
  setproductkey(key: string): void;

  // ── TCP connections ───────────────────────────────────────────────────────
  gettcpconnections(version?: 4 | 6): TcpConnection[];

  // ── Cryptography / JWT ────────────────────────────────────────────────────
  /** Returns SHA-256 digest of text (or a digestupdate handle). */
  digest(text: string | object): string;
  /** Incrementally accumulates data for digest(). Returns an opaque handle. */
  digestupdate(handle: object | undefined, text: string): object;
  /** Returns the SHA-256 digest of a named built-in library. */
  digestlib(libName: string): string;
  /** Creates a signed JWT token. */
  createjwt(header: string, payload: string, algoParams?: { secret?: string; private_key?: string }): string;

  // ── String helpers ────────────────────────────────────────────────────────
  asciitoutf8(str: string, codePage?: string): string;
  utf8toascii(str: string, codePage?: number): string;
  utf8to16(str: string, bigEndian?: boolean): string;
  utf16to8(str: string): string;
  /** Case-fold (lowercase) including non-ASCII characters. */
  foldcase(str: string): string;
  /** Returns true if str matches the ECMAScript regex expression. */
  regex(str: string, expression: string): boolean;

  // ── Base64 ────────────────────────────────────────────────────────────────
  enbase64(bytes: string): string;
  debase64(str: string): string;

  // ── History (internal time-series) ───────────────────────────────────────
  /**
   * Short: syslib.hist — returns aggregated historical data.
   * Result: `result[itemIdx][intervalIdx]` → `{ V, Q, T }`
   */
  gethistory(
    paths: ObjSpec[],
    start: number,
    end: number,
    intervalsNo?: number,
    aggregates?: string[],
    percentageGood?: number,
    percentageBad?: number,
    treatUncertainAsBad?: boolean,
    slopedExtrapolation?: boolean,
    partialIntervalTreatment?: unknown,
    datastore?: StoreSpec,
  ): HistoryInterval[][][];
  /** Short: syslib.histf — returns [oldest, newest] timestamps in history. */
  gethistoryframe(pathspec: ObjSpec, datastore?: StoreSpec): LuaMultiReturn<[number, number] | [number] | []>;
  /**
   * Returns a raw-history iterator `(rs, more)`.
   * Iterate: `for T, v, q in rs() do … end`
   */
  getrawhistory(
    pathspec: ObjSpec,
    bounds: boolean,
    timeStart: number | undefined,
    timeEnd: number | undefined,
    maxLimit?: number,
    datastore?: StoreSpec,
    modifiedDataMode?: boolean,
  ): LuaMultiReturn<[RawHistoryIterator, boolean]>;
  /** Short: syslib.sethist — inserts a single VQT data point. */
  sethistory(id: number, value: unknown, quality: number, timestamp: number): boolean;
  /** Deletes raw history within [timeStart, timeEnd) for a property/object. */
  deleterawhistory(pathspec: ObjSpec, timeStart: number, timeEnd: number, datastore?: StoreSpec): void;
  /** Returns the object ID of the default Time Series Store for a property. */
  getdefaultstore(pathspec: ObjSpec, allowRemote?: boolean): number;
  /** Returns the numeric store ID for a system or custom store. */
  getstoreid(store: ObjSpec | number): number;
  /** Queries the server-side timestamp for a stored value. */
  queryservertimestamp(pathspec: ObjSpec, time: number, datastore?: StoreSpec): number;

  // ── History (external / connector) ───────────────────────────────────────
  gethistoryex(
    datasource: ObjSpec,
    ids: string | string[],
    start?: number | string,
    end?: number | string,
    maxValues?: number,
    boundRequired?: boolean,
    modificationInfo?: boolean,
  ): HistoryInterval[][];
  sethistoryex(
    datasource: ObjSpec,
    tags: string[],
    values: unknown[],
    qualities: number[],
    timestamps: number[],
    mode?: "upsert" | "insert" | "update",
  ): number[];

  // ── Events ────────────────────────────────────────────────────────────────
  /** Creates an event userdata to pass to setevent(). */
  createevent(standardAttrs: Record<string, unknown>, customAttrs?: [string, unknown][]): object;
  /** Short: syslib.setev — fires a script event. */
  setevent(data: Record<string, unknown> | object): boolean;
  /** Returns historical events as a JSON string (or table if event_history_table default is set). */
  geteventhistory(paths: ObjSpec[], start: number, end: number, options?: EventHistoryOptions): string | unknown[];

  // ── Audit trail & logs ────────────────────────────────────────────────────
  getaudittrail(objspecs?: ObjSpec | ObjSpec[], options?: AuditTrailOptions): unknown[];
  getlogs(startTime: number, endTime: number, objects?: ObjSpec[], maxlogs?: number): unknown[];

  // ── Security ─────────────────────────────────────────────────────────────
  checkmodelaccess(modelFlags: number, profiles?: ObjSpec | ObjSpec[]): boolean;
  checkpermission(pathspec: ObjSpec, secAttr: number, profiles?: ObjSpec | ObjSpec[]): boolean;

  // ── Files ─────────────────────────────────────────────────────────────────
  getfile(pathspec: ObjSpec, filter?: string): LuaMultiReturn<[string, FileMetadata]>;
  getfilemetadata(pathspec: ObjSpec, filter?: string): FileMetadata;
  setfile(pathspec: ObjSpec, data: string, nameOrMeta?: string | FileMetadata, mode?: "replace" | "merge"): FileMetadata;
  setfilemetadata(pathspec: ObjSpec, nameOrMeta: string | FileMetadata, metadata?: FileMetadata, mode?: "replace" | "merge"): FileMetadata;
  deletefile(pathspec: ObjSpec, filter?: string): FileMetadata;

  // ── MongoDB / data store ──────────────────────────────────────────────────
  getmongoconnection(store?: ObjSpec | number, testarchive?: boolean): LuaMultiReturn<[object, string, string]>;
  getmongoconnectionstring(store?: ObjSpec | number, storeType?: boolean | number): LuaMultiReturn<[string, string, string]>;

  // ── SAF (Store-and-Forward) ───────────────────────────────────────────────
  getsafseqnr(category: number): number | Record<number, number>;
  getsafforwardedseqnr(category: number): number | Record<number, number>;
  getsafconfirmedseqnr(category: number): number | Record<number, number>;

  // ── Dump / backup ─────────────────────────────────────────────────────────
  dumpimage(path: string): string;

  // ── Lua instance control ──────────────────────────────────────────────────
  control: {
    getself(): number;
    dedicate(id: number): boolean;
    list(options?: { self?: ObjSpec }): LuaInstanceInfo[];
    terminate(id: number): void;
  };
  luamemory(objspec?: ObjSpec | null, limit?: number): number | Record<number, number>;
  luacpuusage(objspec?: ObjSpec | null, limit?: number): number | Record<number, number>;

  // ── Message queue ─────────────────────────────────────────────────────────
  msgqueue(objspec: ObjSpec, slot: number): MsgQueue;
  msgpush(queue: MsgQueue, ...values: unknown[]): void;
  msgpop(queue: MsgQueue, ...args: unknown[]): unknown;
  msgnext(queue: MsgQueue, ...args: unknown[]): unknown;
  msgclear(queue: MsgQueue): void;
  msgstats(queue?: MsgQueue): MsgStats | MsgStats[];

  // ── OPC UA ────────────────────────────────────────────────────────────────
  uabrowse(datasource: ObjSpec, nodesToBrowse: unknown, defaults?: unknown): unknown[];
  uabrowsenext(datasource: ObjSpec, checkpoints: unknown[]): unknown[];
  uaread(datasource: ObjSpec, nodesToRead: unknown[], maxAge?: number, returnTs?: 0 | 1 | 2 | 3): unknown[];
  uamethodcall(datasource: ObjSpec, methodsToCall: unknown[]): unknown[];
  uaextradata(...args: unknown[]): unknown;

  // ── OPC DA browse ─────────────────────────────────────────────────────────
  opcdabrowse(datasource: ObjSpec, ...args: unknown[]): object | undefined;

  // ── OPC HDA (external) ────────────────────────────────────────────────────
  getattributesex(datasource: ObjSpec, itemIds: string[], attributeIds?: number[], skipValues?: boolean): unknown[][];
  hdagetitemattributes(datasource: ObjSpec): LuaMultiReturn<[unknown, number]>;
  hdareadattributes(datasource: ObjSpec, itemTag: string, attributeTags: number[], startTime?: number | string, endTime?: number | string): unknown[];

  // ── IP.21 / InfoPlus.21 ───────────────────────────────────────────────────
  ip21browse(datasource: ObjSpec, tags?: string | number | object, options?: Record<string, unknown>): Ip21BrowseItem[] | [undefined, string, number];
  ip21parseitemid(itemid: string): Record<string, string> | undefined;
  ip21getitemid(...args: unknown[]): unknown;

  // ── System database ───────────────────────────────────────────────────────
  getsystemdb(): SystemDb;

  // ── Buffer API ────────────────────────────────────────────────────────────
  /** Removes the named buffer from `objspec`. */
  buffer(objspec: string | number, name: string): void;
  /** Creates a raw rolling buffer bounded by `duration` (ms) and `size` (elements). */
  buffer(objspec: string | number, name: string, input: string, duration: number, size: number): void;
  /** Creates a buffer with a Lua transformation function. */
  buffer(objspec: string | number, name: string, input: string, duration: number, size: number, transformFn: string): void;
  /** Creates a buffer with built-in aggregation (`aggType` e.g. `"AGG_TYPE_AVERAGE"`). */
  buffer(objspec: string | number, name: string, input: string, duration: number, size: number, aggPeriod: number, aggType: string): void;

  /** Detaches the repeater from the named buffer at `objspec`. */
  attach(objspec: string | number, name: string): void;
  /** Attaches `repeater` to the named buffer so it receives each new buffered value. */
  attach(objspec: string | number, name: string, repeater: string | number): void;

  /** Returns buffer contents without clearing (values, timestamps, qualities, counter). */
  peek(objspec: string | number, name: string): [unknown[], number[], number[], number];
  /** Atomically retrieves and clears the buffer (values, timestamps, qualities, counter). */
  tear(objspec: string | number, name: string): [unknown[], number[], number[], number];
  /** Returns only the most recent buffered value. */
  last(objspec: string | number, name: string): unknown;
  /** Lists all buffers at `objspec` (or the whole component if omitted). */
  listbuffer(objspec?: string | number): ListBufferResult;
}
