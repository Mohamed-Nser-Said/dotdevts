import { IObject } from "../shared/IObject";
import { Path } from "../shared/Path";
import { GenericFolder, GenericFolderOptions } from "./GenericFolder";
import { ActionItem, ActionItemOptions } from "./ActionItem";
import { HistoryTransporter, HistoryTransporterOptions } from "../history/HistoryTransporter";
import { GTSB, GTSBOptions } from "../datastores/GTSB";
import { ScriptEvent } from "./ScriptEvent";
import { TableHolder } from "./TableHolder";
import { SchedulerItem, SchedulerItemOptions } from "./Scheduler";
import { VariableChildren } from "../children/VariableChildren";

/**
 * Child factory for a logical {@link Namespace} path (not a model object).
 * Lives in this file to avoid a circular import with {@link Namespace}.
 */
export class NamespaceChildren extends VariableChildren {
	constructor(private readonly owner: Namespace) {
		super(() => owner.path.absolutePath());
	}

	Namespace(name: string): Namespace {
		return new Namespace(this.childPath(name));
	}

	GenericFolder(name: string, opts?: GenericFolderOptions): GenericFolder {
		return new GenericFolder(this.childPath(name), opts);
	}

	ActionItem(name: string, opts?: ActionItemOptions): ActionItem {
		return new ActionItem(this.childPath(name), opts);
	}

	HistoryTransporter(name: string, opts?: HistoryTransporterOptions): HistoryTransporter {
		return new HistoryTransporter(this.childPath(name), opts);
	}

	GTSB(name: string, opts?: GTSBOptions): GTSB {
		return new GTSB(this.childPath(name), opts);
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
}

export class Namespace {
	public readonly type: string = "Namespace";
	public readonly path: Path;
	public readonly children: NamespaceChildren;

	constructor(path: string | Path) {
		this.path = path instanceof Path ? path : new Path(path);
		this.children = new NamespaceChildren(this);
	}

	childPath(name: string): string {
		return this.path.absolutePath() + "/" + name;
	}

	resolve(spec: string | Path): Path {
		if (typeof spec === "string") {
			return new Path(this.path.absolutePath() + "/" + spec);
		}
		return spec;
	}

	pop(): Namespace {
		return new Namespace(this.path.parentPath());
	}

	push(name: string): Namespace {
		return new Namespace(this.path.absolutePath() + "/" + name);
	}

	toString(): string {
		return `{type: ${this.type}, path: ${this.path.absolutePath()}}`;
	}

	static appendable(parent: IObject | Namespace, name: string): Namespace {
		return new Namespace(parent.path.absolutePath() + "/" + name);
	}
}
