import { ScheduledActions } from "../../backend/src/components/ScheduledActions";
import { Core } from "../../backend/src/core/Core";
import { SchedulerItem } from "../../backend/src/objects/Scheduler";


 export function main(){

    const core = new Core();
    
    const scheduledTasks = new ScheduledActions(core.path.join("myTest2"));
    scheduledTasks.addAction("return syslib.uuid()");
    scheduledTasks.addAction("return syslib.uuid()");

}