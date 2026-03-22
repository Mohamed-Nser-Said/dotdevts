import { IObject } from "./IObject";
import { Archive } from "./Archive";
import { Path } from "./Path";
import { VariableAddFactory } from "./VariableAddFactory";

export type ActionItemOptions = {
	script?: string;
	scheduler?: string | { type: string; path: Path };
};

export class ActionItem extends IObject {
	type = "ActionItem";
	archive: Archive;
	add: VariableAddFactory;

	constructor(path: string | number | Path, opts?: ActionItemOptions) {
		super(path, syslib.model.classes.ActionItem);
		this.archive = new Archive(this);
		this.add = new VariableAddFactory(() => this.path.absolutePath());

		if (!syslib.getobject(this.path.absolutePath())) {
			syslib.mass([{
				class: syslib.model.classes.ActionItem,
				operation: syslib.model.codes.MassOp.UPSERT,
				path: this.path.absolutePath(),
				ObjectName: this.path.name(),
				AdvancedLuaScript: opts?.script,
				DedicatedThreadExecution: true,
				ActivationMode: 1,
				references: ActionItem.buildReferences(opts),
			}]);
		}
	}

	private static buildReferences(opts?: ActionItemOptions): unknown[] | undefined {
		if (!opts?.scheduler) return undefined;

		if (typeof opts.scheduler === "string") {
			return [{ path: opts.scheduler, name: "_trigger_", type: "OBJECT_LINK" }];
		}

		const sched = opts.scheduler as { type: string; path: Path };
		if (sched.type === "Scheduler") {
			return [{ path: sched.path.absolutePath(), name: "_trigger_", type: "OBJECT_LINK" }];
		}

		return undefined;
	}

	setScript(script: string): void {
		syslib.mass([{
			class: syslib.model.classes.ActionItem,
			operation: syslib.model.codes.MassOp.UPDATE,
			path: this.path.absolutePath(),
			AdvancedLuaScript: script,
		}]);
	}

	onTrigger(script: string): ActionItem {
		this.setScript(script);
		return this;
	}

	setValue(value: unknown): void {
		syslib.setvalue(this.path.absolutePath(), value);
	}

	getValue(): unknown {
		return syslib.getvalue(this.path.absolutePath());
	}

	static appendable(parent: IObject, name: string, opts?: ActionItemOptions): ActionItem {
		return new ActionItem(parent.path.absolutePath() + "/" + name, opts);
	}
}
