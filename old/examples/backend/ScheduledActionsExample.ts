import { ScheduledActions } from "../../IntegrationProviders/Inmation/src/components/ScheduledActions";
import { Core } from "../../IntegrationProviders/Inmation/src/core/Core";
import { SchedulerItem } from "../../IntegrationProviders/Inmation/src/objects/Scheduler";


 export function main(){

    const core = new Core();
    
    const scheduledTasks = new ScheduledActions(core.path.join("myTest2"));
    scheduledTasks.addAction("return syslib.uuid()");
    scheduledTasks.addAction("return syslib.uuid()");

}