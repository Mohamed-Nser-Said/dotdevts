import { ScriptEvent } from "../base/ScriptEvent";
import { Scheduler } from "../base/Scheduler";
import { ActionItem } from "../base/ActionItem";
import { GenericFolder } from "../base/GenericFolder";

export function main(): void {
        const basePath = "/System/Core/ScriptEventExample";

        console.log("  [0] Create parent folder");
        const parent = new GenericFolder(basePath, { cleanupExisting: true });
        console.log("      Parent:", parent.path.absolutePath());

        console.log("  [1] Create ScriptEvent");
        const se = new ScriptEvent(basePath + "/MyScriptEvent");
        console.log("      Created:", se.path.absolutePath());
        console.log("      Type:", se.type);

        console.log("  [2] Add a Variable child to ScriptEvent");
        const v = se.add.Variable("Status", "idle");
        console.log("      Variable created:", v.path.absolutePath());

        console.log("  [3] Add a VariableGroup child to ScriptEvent");
        const vg = se.add.VariableGroup("Config");
        console.log("      VariableGroup created:", vg.path.absolutePath());

        console.log("  [4] Create Scheduler");
        const scheduler = new Scheduler(basePath + "/MyScheduler");
        console.log("      Scheduler created:", scheduler.path.absolutePath());
        console.log("      Scheduler type:", scheduler.type);

        console.log("  [5] Create ActionItem linked to Scheduler");
        const ai = new ActionItem(basePath + "/ScheduledAction", {
                scheduler: { type: "Scheduler", path: scheduler.path },
        });
        console.log("      ActionItem created:", ai.path.absolutePath());

        console.log("  [6] GenericFolder add.ScriptEvent shorthand");
        const gf = new GenericFolder(basePath + "/SubFolder");
        const se2 = gf.add.ScriptEvent("InlineEvent");
        console.log("      Inline ScriptEvent:", se2.path.absolutePath());

        console.log("  [7] GenericFolder add.Scheduler shorthand");
        const sched2 = gf.add.Scheduler("InlineScheduler");
        console.log("      Inline Scheduler:", sched2.path.absolutePath());

        console.log("  ScriptEventExample done.");
}
