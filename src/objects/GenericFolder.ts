import { IObject } from "../shared/IObject";
import { Path } from "../shared/Path";
import { VariableOptions, Variable } from "./Variable";
import { VariableGroupOptions, VariableGroup } from "./VariableGroup";
import { ActionItem, ActionItemOptions } from "./ActionItem";
import { ScriptEvent } from "./ScriptEvent";
import { TableHolder } from "./TableHolder";
import { TableStore } from "./TableStore";
import { SchedulerItem, SchedulerItemOptions } from "./Scheduler";

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

export class GenericFolder extends IObject {
        public readonly type: string = "GenericFolder";
        public readonly add: {
                GenericFolder(name: string, opts?: GenericFolderOptions): GenericFolder;
                Variable(name: string, value?: unknown, opts?: VariableOptions): Variable;
                VariableGroup(name: string, opts?: VariableGroupOptions): VariableGroup;
                ActionItem(name: string, opts?: ActionItemOptions): ActionItem;
                ScriptEvent(name: string): ScriptEvent;
                SchedulerItem(name: string, options?: SchedulerItemOptions): SchedulerItem;
                TableHolder(name: string): TableHolder;
                TableStore(name: string): TableStore;
        };

        constructor(path: string | number | Path, opts?: GenericFolderOptions) {
                super(path, syslib.model.classes.GenFolder);
                if (opts?.cleanupExisting) this.delete(true);

                const self = this;
                this.add = {
                        GenericFolder(name: string, childOpts?: GenericFolderOptions): GenericFolder {
                                return new GenericFolder(self.path.absolutePath() + "/" + name, childOpts);
                        },
                        Variable(name: string, value?: unknown, childOpts?: VariableOptions): Variable {
                                return new Variable(self.path.absolutePath() + "/" + name, value, childOpts);
                        },
                        VariableGroup(name: string, childOpts?: VariableGroupOptions): VariableGroup {
                                return new VariableGroup(self.path.absolutePath() + "/" + name, childOpts);
                        },
                        ActionItem(name: string, childOpts?: ActionItemOptions): ActionItem {
                                return new ActionItem(self.path.absolutePath() + "/" + name, childOpts);
                        },
                        ScriptEvent(name: string): ScriptEvent {
                                return new ScriptEvent(self.path.absolutePath() + "/" + name);
                        },
                        SchedulerItem(name: string): SchedulerItem {
                                return new SchedulerItem(self.path.absolutePath() + "/" + name);
                        },
                        TableHolder(name: string): TableHolder {
                                return new TableHolder(self.path.absolutePath() + "/" + name);
                        },
                        TableStore(name: string): TableStore {
                                return new TableStore(self.path.absolutePath() + "/" + name);
                        },
                };

                if (opts?.recursive !== false) {
                        massRecursive(this.path);
                }
        }

        static appendable(parent: IObject, name: string, opts?: GenericFolderOptions): GenericFolder {
                return new GenericFolder(parent.path.absolutePath() + "/" + name, opts);
        }
}
