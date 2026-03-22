import { Variable, VariableOptions } from "../objects/Variable";
import { VariableGroup, VariableGroupOptions } from "../objects/VariableGroup";

export class VariableAddFactory {
    constructor(private basePath: () => string) {}

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
