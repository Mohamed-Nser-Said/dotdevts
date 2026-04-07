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
export type RawHistoryIterator = SysLib.RawHistoryIterator;

/** A single VQT-style datum (e.g. external historians). */
export interface VQT {
  V: unknown;
  Q: number;
  T: number;
}

/** Aggregated gethistory interval — V, S (status), T per official API. */
export type HistoryInterval = SysLib.HistoryInterval;

/** Metadata table returned/accepted by file functions. */
export type FileMetadata = SysLib.FileMetadata;

/** Entry returned by syslib.control.list(). */
export type LuaInstanceInfo = SysLib.LuaInstanceInfo;

/** A message queue handle returned by syslib.msgqueue(). */
export type MsgQueue = SysLib.MsgQueue;

/** Stats table returned by syslib.msgstats(). */
export type MsgStats = SysLib.MsgStats;

/** Entry in an IP21 browse result. */
export type Ip21BrowseItem = SysLib.Ip21BrowseItem;

/** A single TCP connection entry returned by syslib.gettcpconnections(). */
export type TcpConnection = SysLib.TcpConnection;

/** Audit trail query options. */
export type AuditTrailOptions = SysLib.AuditTrailOptions;

/** Options for syslib.geteventhistory(). */
export type EventHistoryOptions = SysLib.EventHistoryOptions;

/** Result row from syslib.getrawhistory iterator. */
export type RawHistoryRow = LuaMultiReturn<[number, unknown, number]>;

// ── Top-level syslib interface ────────────────────────────────────────────────

/**
 * Dependency-injectable alias of the global inmation `syslib` API (`SysLib.SysLib` in syslib.d.ts).
 * Kept in sync with https://docs.inmation.com/api/1.110/lua/functions.html
 *
 * For unit tests, prefer `Partial<ISysLib>` or a narrow custom interface — the full surface is large.
 */
export type ISysLib = SysLib.SysLib;
