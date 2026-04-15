import { IObject } from "../shared/IObject";
import { Archive } from "../history/Archive";
import { Path } from "../shared/Path";
import { Variable, VariableOptions } from "./Variable";

export type VariableGroupOptions = {
	recursive?: boolean;
};

/**
 * Factory for **Variable** and **VariableGroup** children under a parent path.
 *
 * Defined in this module (before {@link VariableGroup}) so Lua/TSTL never hits a
 * `VariableChildren` ↔ `VariableGroup` circular require.
 */
export class VariableChildren {
	constructor(private readonly basePath: () => string) {}

	protected childPath(name: string): string {
		return this.basePath() + "/" + name;
	}

	Variable(name: string, value?: unknown, opts?: VariableOptions): Variable {
		return new Variable(this.childPath(name), value, opts);
	}

	VariableGroup(name: string, opts?: VariableGroupOptions): VariableGroup {
		return new VariableGroup(this.childPath(name), opts);
	}
}

export class VariableGroup extends IObject {
	public readonly type: string = "VariableGroup";
	public readonly archive: Archive;
	public readonly children: VariableChildren;

	constructor(path: string | number | Path, _opts?: VariableGroupOptions) {
		super(path, syslib.model.classes.VariableGroup);
		this.archive = new Archive(this);
		this.children = new VariableChildren(() => this.path.absolutePath());
		syslib.mass([
			{
				class: syslib.model.classes.VariableGroup,
				operation: syslib.model.codes.MassOp.UPSERT,
				path: this.path.absolutePath(),
				ObjectName: this.path.name(),
			},
		]);
	}

	static appendable(parent: IObject, name: string, opts?: VariableGroupOptions): VariableGroup {
		return new VariableGroup(parent.path.absolutePath() + "/" + name, opts);
	}
}
