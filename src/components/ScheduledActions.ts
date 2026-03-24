import { ActionItem } from "../objects/ActionItem";
import { GenericFolder } from "../objects/GenericFolder";
import { SchedulerItem, SchedulerItemOptions } from "../objects/Scheduler";

export class ScheduledActions {

    private readonly folder: GenericFolder | undefined;
    private readonly scheduler: SchedulerItem;
    private readonly actions = new Map<string, ActionItem>();

    constructor(path: string, options?: SchedulerItemOptions) {
        this.folder = new GenericFolder(path);
        const defaultOptions = options ?? { "recurrence": { "every": 30, "kind": "second" } }
        this.scheduler = this.folder.add.SchedulerItem("__ScheduledActions", defaultOptions);

    }

    addAction(script: string, options?: { name?: string, absolutePath?: string }) {

        if (!this.folder) return;
        const unqName = `${options?.name ?? ""}__action${syslib.uuid()}`;
        const action = this.folder?.add.ActionItem(unqName, { script: script, scheduler: this.scheduler?.path.absolutePath() });
        this.actions?.set(unqName, action);
    }

    get schedulerPath() {
        return this.scheduler.path.absolutePath();
    }

    getActions(): ActionItem[] {
        const actions = new Set<ActionItem>(Array.from(this.actions.values()).map(a => a));
        syslib.getbackreferences(this.scheduler?.path.absolutePath()).forEach(ref => actions.add(new ActionItem(ref.path)));
        return Array.from(actions);
    }

    removeActions() {

        this.getActions().forEach(a => a.delete(true));

    }








}