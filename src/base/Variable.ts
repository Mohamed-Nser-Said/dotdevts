import { IObject } from "./IObject";
import { Archive } from "./Archive";
import { Path } from "./Path";

export type VariableOptions = {
	recursive?: boolean;
};

export class Variable extends IObject {
	type = "Variable";
	archive: Archive;

	constructor(path: string | number | Path, value?: unknown, _opts?: VariableOptions) {
		super(path, syslib.model.classes.Variable);
		this.archive = new Archive(this);
		syslib.mass([
			{
				class: syslib.model.classes.Variable,
				operation: syslib.model.codes.MassOp.UPSERT,
				path: this.path.absolutePath(),
				ObjectName: this.path.name(),
			},
		]);
		if (value !== undefined) {
			syslib.setvalue(this.path.absolutePath(), value);
		}
	}

	setValue(value: unknown): void {
		syslib.setvalue(this.path.absolutePath(), value);
	}

	getValue(): unknown {
		return syslib.getvalue(this.path.absolutePath());
	}

	static appendable(parent: IObject, name: string, value?: unknown, opts?: VariableOptions): Variable {
		return new Variable(parent.path.absolutePath() + "/" + name, value, opts);
	}
}
