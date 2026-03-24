import { ScheduledActions } from "../src/components/ScheduledActions";
import { Core } from "../src/core/Core";
import { SchedulerItem } from "../src/objects/Scheduler";


 export function main(){

    const core = new Core();
    
    const scheduledTasks = new ScheduledActions(core.path.join("myTest2"))
    scheduledTasks.addAction("return syslib.uuid()");
    scheduledTasks.addAction("return syslib.uuid()");

}