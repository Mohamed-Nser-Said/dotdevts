import { GenericFolder } from "../src/objects/GenericFolder";
import { Namespace } from "../src/objects/Namespace";

export function main(): void {
        const corePath = "/System/Core";

        console.log("  [0] Create parent folder for Namespace example");
        const parent = new GenericFolder(corePath + "/NamespaceExample", { cleanupExisting: true });
        console.log("      Parent:", parent.path.absolutePath());

        console.log("  [1] Create root Namespace");
        const ns = new Namespace(corePath + "/NamespaceExample");
        console.log("      Namespace:", ns.path.absolutePath());
        console.log("      Type:", ns.type);
        console.log("      toString:", ns.toString());

        console.log("  [2] Add a Variable via namespace");
        const v = ns.add.Variable("Setpoint", 100);
        console.log("      Variable created:", v.path.absolutePath());

        console.log("  [3] Push into sub-namespace");
        const sub = ns.push("SubNS");
        console.log("      Sub namespace:", sub.path.absolutePath());

        console.log("  [4] Add GenericFolder via sub namespace");
        const gf = sub.add.GenericFolder("Assets");
        console.log("      GenericFolder created:", gf.path.absolutePath());

        console.log("  [5] Add nested Namespace via add builder");
        const child = ns.add.Namespace("ChildNS");
        console.log("      Child namespace:", child.path.absolutePath());

        console.log("  [6] Add ScriptEvent via namespace");
        const se = ns.add.ScriptEvent("MyEvent");
        console.log("      ScriptEvent created:", se.path.absolutePath());

        console.log("  [7] Add TableHolder via namespace");
        const th = ns.add.TableHolder("Config");
        th.setTable([{ key: "value", count: 42 }]);
        console.log("      TableHolder created:", th.path.absolutePath());

        console.log("  [8] Add Scheduler via namespace");
        const sched = ns.add.SchedulerItem("MyScheduler");
        console.log("      Scheduler created:", sched.path.absolutePath());

        console.log("  [9] childPath helper");
        const cp = ns.childPath("TestChild");
        console.log("      childPath:", cp);

        console.log("  [10] resolve helper");
        const resolved = ns.resolve("AnotherChild");
        console.log("      resolved:", resolved.absolutePath());

        console.log("  [11] pop back to parent");
        const parentNs = ns.pop();
        console.log("      parent namespace:", parentNs.path.absolutePath());

        console.log("  NamespaceExample done.");
}
