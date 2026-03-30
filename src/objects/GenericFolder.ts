import { IObject } from "../shared/IObject";
import { Path } from "../shared/Path";
import { VariableChildren } from "../children/VariableChildren";
import { ActionItem, ActionItemOptions } from "./ActionItem";
import { ScriptEvent } from "./ScriptEvent";
import { TableHolder } from "./TableHolder";
import { SchedulerItem, SchedulerItemOptions } from "./Scheduler";
import { TableStore } from "../components/TableStore";

export type GenericFolderOptions = {
	cleanupExisting?: boolean;
	recursive?: boolean;
};

function mass(path: Path): void {
	syslib.mass([
		{
			class: syslib.model.classes.GenFolder,
			operation: syslib.model.codes.MassOp.UPSERT,
			path: path.absolutePath(),
			ObjectName: path.name(),
		},
	]);
}

function massRecursive(path: Path): void {
	if (!syslib.getobject(path.parentPathAsString())) {
		massRecursive(path.parentPath());
	}
	mass(path);
}

/**
 * Child factory scoped to **GenericFolder**. Co-located with {@link GenericFolder} to avoid a Lua
 * circular require (`GenericFolder` ↔ `GenericFolderChildren`).
 */
export class GenericFolderChildren extends VariableChildren {
	GenericFolder(name: string, opts?: GenericFolderOptions): GenericFolder {
		return new GenericFolder(this.childPath(name), opts);
	}

	ActionItem(name: string, opts?: ActionItemOptions): ActionItem {
		return new ActionItem(this.childPath(name), opts);
	}

	ScriptEvent(name: string): ScriptEvent {
		return new ScriptEvent(this.childPath(name));
	}

	SchedulerItem(name: string, options?: SchedulerItemOptions): SchedulerItem {
		return new SchedulerItem(this.childPath(name), options);
	}

	TableHolder(name: string): TableHolder {
		return new TableHolder(this.childPath(name));
	}

	TableStore(name: string): TableStore {
		return new TableStore(this.childPath(name));
	}
}

export class GenericFolder extends IObject {
	public readonly type: string = "GenericFolder";
	public readonly add: GenericFolderChildren;

	constructor(path: string | number | Path, opts?: GenericFolderOptions) {
		super(path, syslib.model.classes.GenFolder);
		if (opts?.cleanupExisting) this.delete(true);

		this.add = new GenericFolderChildren(() => this.path.absolutePath());

		if (opts?.recursive !== false) {
			massRecursive(this.path);
		}
	}

	static appendable(parent: IObject, name: string, opts?: GenericFolderOptions): GenericFolder {
		return new GenericFolder(parent.path.absolutePath() + "/" + name, opts);
	}
}
