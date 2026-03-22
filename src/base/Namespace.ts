import { IObject } from "./IObject";
import { Path } from "./Path";
import { GenericFolder, GenericFolderOptions } from "./GenericFolder";
import { ActionItem, ActionItemOptions } from "./ActionItem";
import { HistoryTransporter, HistoryTransporterOptions } from "./HistoryTransporter";
import { Variable, VariableOptions } from "./Variable";
import { VariableGroup, VariableGroupOptions } from "./VariableGroup";
import { GTSB, GTSBOptions } from "./GTSB";
import { ScriptEvent } from "./ScriptEvent";
import { Scheduler } from "./Scheduler";
import { TableHolder } from "./TableHolder";

export class Namespace {
        type = "Namespace";
        path: Path;
        add: {
                Namespace(name: string): Namespace;
                GenericFolder(name: string, opts?: GenericFolderOptions): GenericFolder;
                ActionItem(name: string, opts?: ActionItemOptions): ActionItem;
                HistoryTransporter(name: string, opts?: HistoryTransporterOptions): HistoryTransporter;
                Variable(name: string, value?: unknown, opts?: VariableOptions): Variable;
                VariableGroup(name: string, opts?: VariableGroupOptions): VariableGroup;
                GTSB(name: string, opts?: GTSBOptions): GTSB;
                ScriptEvent(name: string): ScriptEvent;
                Scheduler(name: string): Scheduler;
                TableHolder(name: string): TableHolder;
        };

        constructor(path: string | Path) {
                this.path = path instanceof Path ? path : new Path(path);

                // eslint-disable-next-line @typescript-eslint/no-this-alias
                const self = this;
                this.add = {
                        Namespace(name: string): Namespace {
                                return new Namespace(self.childPath(name));
                        },
                        GenericFolder(name: string, opts?: GenericFolderOptions): GenericFolder {
                                return new GenericFolder(self.childPath(name), opts);
                        },
                        ActionItem(name: string, opts?: ActionItemOptions): ActionItem {
                                return new ActionItem(self.childPath(name), opts);
                        },
                        HistoryTransporter(name: string, opts?: HistoryTransporterOptions): HistoryTransporter {
                                return new HistoryTransporter(self.childPath(name), opts);
                        },
                        Variable(name: string, value?: unknown, opts?: VariableOptions): Variable {
                                return new Variable(self.childPath(name), value, opts);
                        },
                        VariableGroup(name: string, opts?: VariableGroupOptions): VariableGroup {
                                return new VariableGroup(self.childPath(name), opts);
                        },
                        GTSB(name: string, opts?: GTSBOptions): GTSB {
                                return new GTSB(self.childPath(name), opts);
                        },
                        ScriptEvent(name: string): ScriptEvent {
                                return new ScriptEvent(self.childPath(name));
                        },
                        Scheduler(name: string): Scheduler {
                                return new Scheduler(self.childPath(name));
                        },
                        TableHolder(name: string): TableHolder {
                                return new TableHolder(self.childPath(name));
                        },
                };
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
