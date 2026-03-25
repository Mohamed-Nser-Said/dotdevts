import { IObject } from "../shared/IObject";
import { Archive } from "../history/Archive";
import { Path } from "../shared/Path";
import { Variable } from "./Variable";

export type VariableGroupOptions = {
	recursive?: boolean;
};

export class VariableGroup extends IObject {
	public readonly type: string = "VariableGroup";
	public readonly archive: Archive;
	public readonly add: {
		Variable(name: string, value?: unknown, opts?: { recursive?: boolean }): Variable;
		VariableGroup(name: string, opts?: VariableGroupOptions): VariableGroup;
	};

	constructor(path: string | number | Path, _opts?: VariableGroupOptions) {
		super(path, syslib.model.classes.VariableGroup);
		this.archive = new Archive(this);
		syslib.mass([
			{
				class: syslib.model.classes.VariableGroup,
				operation: syslib.model.codes.MassOp.UPSERT,
				path: this.path.absolutePath(),
				ObjectName: this.path.name(),
			},
		]);

		const self = this;
		this.add = {
			Variable(name: string, value?: unknown, childOpts?: { recursive?: boolean }): Variable {
				return new Variable(self.path.absolutePath() + "/" + name, value, childOpts);
			},
			VariableGroup(name: string, childOpts?: VariableGroupOptions): VariableGroup {
				return new VariableGroup(self.path.absolutePath() + "/" + name, childOpts);
			},
		};
	}

	static appendable(parent: IObject, name: string, opts?: VariableGroupOptions): VariableGroup {
		return new VariableGroup(parent.path.absolutePath() + "/" + name, opts);
	}
}
