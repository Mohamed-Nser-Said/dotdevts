import { IObject } from "../shared/IObject";
import { Archive } from "../history/Archive";
import { Path } from "../shared/Path";
import { VariableAddFactory } from "../core/VariableAddFactory";
import { ScriptChunk } from "../shared/toLua";

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


	/** Fluent version of setFunc(). */
	onTrigger(fn: ScriptChunk): ActionItem;
	onTrigger(script: string): ActionItem;
	onTrigger(scriptOrFn: string | ScriptChunk): ActionItem {
		if (typeof scriptOrFn === "string") return this.onTrigger(scriptOrFn);
		throw new Error(
			"ActionItem.onTrigger(fn) is a compile-time feature. Ensure the TypeScriptToLua luaPlugin `./tstl-plugins/toLuaString` is configured in tsconfig.json (tstl.luaPlugins)."
		);
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
