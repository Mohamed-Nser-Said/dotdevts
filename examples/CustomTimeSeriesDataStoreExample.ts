import { ScheduledActions } from "../src/components/ScheduledActions";
import { Core } from "../src/core/Core";





export function main() {

    const core = new Core();

    const myDataStore = core.add.CustomTimeSeriesDataStore("myDataStore2", { registerAsDataStore: true, connection: { port: 27017, host: "localhost" } });

    const scheduledActions = new ScheduledActions(core.path.join("Runner-v2"), { cleanupExisting: true });


    // 1) TS function → compiled to Lua chunk string at build time
    scheduledActions.addAction(() => {
        const txt = "Action 1";
        const v = syslib.now();
        syslib.setvalue(syslib.getselfpath(), txt, 0, v);

        return "TEST2.1"
    });

    scheduledActions.addAction(() => {
        const txt = "Action 2";
        const v = syslib.now();
        syslib.setvalue(syslib.getselfpath(), txt, 0, v);

        return "TEST2.2"
    });


    scheduledActions.addAction(() => {
        let count = 0;
        for (let i = 0; i < 5; i++) {
            const txt = `Action 3 - ${i}`;
            const v = syslib.now();
            syslib.setvalue(syslib.getselfpath(), txt, 0, v);
        }
        return count;
    });


    console.log(`Scheduled actions created under scheduler: ${scheduledActions.schedulerPath}`);


}