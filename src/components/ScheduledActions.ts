import { ActionItem } from "../objects/ActionItem";
import { GenericFolder } from "../objects/GenericFolder";
import { SchedulerItem, SchedulerItemOptions } from "../objects/Scheduler";
import { ScriptChunk } from "../shared/toLua";

export type ScheduledActionOptions = {
    name?: string;
    absolutePath?: string;
    cleanupExisting?: boolean; // If true, deletes existing scheduled actions folder with the same name before creating new one

} & SchedulerItemOptions;

export class ScheduledActions {

    private readonly folder: GenericFolder | undefined;
    private readonly scheduler: SchedulerItem;
    private readonly _actions = new Map<string, ActionItem>();

    constructor(path: string, options?: ScheduledActionOptions) {
        this.folder = new GenericFolder(path, { cleanupExisting: options?.cleanupExisting });
        const defaultOptions = options ?? { "recurrence": { "every": 30, "kind": "second" } }
        this.scheduler = this.folder.add.SchedulerItem("__ScheduledActions", defaultOptions);

    }

    /**
     * Add a scheduled ActionItem.
     *
     * You can pass:
     * - no arguments (creates an ActionItem with no initial script),
     * - a raw Lua script chunk string,
     * - or a TypeScript function (ScriptChunk) that is compiled to a Lua chunk at build time.
     *
     * Function form relies on the TypeScriptToLua plugin `tstl-plugins/toLuaString.js`.
     */
    addAction(): ActionItem | undefined;
    addAction(script: string, options?: { name?: string; absolutePath?: string }): ActionItem | undefined;
    addAction(fn: ScriptChunk, options?: { name?: string; absolutePath?: string }): ActionItem | undefined;
    addAction(scriptOrFn?: string | ScriptChunk, options?: { name?: string; absolutePath?: string }): ActionItem | undefined {
        if (!this.folder) return;
        const unqName = `${options?.name ?? ""}__action${syslib.uuid()}`;

        // Strings (and undefined) are handled directly.
        if (scriptOrFn === undefined || typeof scriptOrFn === "string") {
            const action = this.folder.add.ActionItem(unqName, {
                script: scriptOrFn,
                scheduler: this.scheduler.path.absolutePath(),
            });
            this._actions.set(unqName, action);
            return action;
        }

        // Functions should be compiled away by the plugin into a string argument.
        throw new Error(
            "ScheduledActions.addAction(fn) is a compile-time feature. Ensure the TypeScriptToLua luaPlugin `./tstl-plugins/toLuaString` is configured in tsconfig.json (tstl.luaPlugins)."
        );
    }

    get schedulerPath() {
        return this.scheduler.path.absolutePath();
    }

    get rootPath() {
        return this.folder?.path.absolutePath();
    }

    get actions(): ActionItem[] {
        const actions = new Set<ActionItem>(Array.from(this._actions.values()).map(a => a));
        syslib.getbackreferences(this.scheduler?.path.absolutePath()).forEach(ref => actions.add(new ActionItem(ref.path)));
        return Array.from(actions);
    }

    removeActions() {
        this.actions.forEach(a => a.delete(true));

    }

    delete() {
        this.removeActions();
        this.scheduler.delete(true);
        this.folder?.delete(true);
    }

    updateScheduler(options: SchedulerItemOptions) {
        this.scheduler.update(options);
    }


}