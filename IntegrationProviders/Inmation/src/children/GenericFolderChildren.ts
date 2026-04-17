/**
 * Re-export: implementation lives with {@link GenericFolder} to avoid a Lua circular
 * require (`GenericFolder` ↔ `GenericFolderChildren`).
 */
export { GenericFolderChildren, type GenericFolderOptions } from "../objects/GenericFolder";
