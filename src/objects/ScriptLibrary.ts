import { IObject } from "../shared/IObject";

export class ScriptLibrary {
	constructor(private linkedObject: IObject) {}

	setScript(script: string): void {
		syslib.setvalue(this.linkedObject.path.absolutePath() + ".AdvancedLuaScript", script);
	}

	getScript(): unknown {
		return syslib.getvalue(this.linkedObject.path.absolutePath() + ".AdvancedLuaScript");
	}

	setModuleName(name: string): void {
		syslib.setvalue(this.linkedObject.path.absolutePath() + ".LuaModuleName", name);
	}

	getModuleName(): unknown {
		return syslib.getvalue(this.linkedObject.path.absolutePath() + ".LuaModuleName");
	}
}
