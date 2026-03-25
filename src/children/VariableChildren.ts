/**
 * Re-export: implementation lives with {@link VariableGroup} to avoid a Lua circular
 * require (`VariableChildren` ↔ `VariableGroup`).
 */
export { VariableChildren, type VariableGroupOptions } from "../objects/VariableGroup";
