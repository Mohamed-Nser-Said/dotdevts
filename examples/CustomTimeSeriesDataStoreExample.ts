import { ScheduledActions } from "../src/components/ScheduledActions";
import { Core } from "../src/core/Core";





export function main() {

    const core = new Core();

    const myDataStore = core.add.CustomTimeSeriesDataStore("myDataStore2", { registerAsDataStore: true, connection: { port: 27017, host: "localhost" } });

    // myDataStore.getCollection().insert({ name: 'Jane Smith2', height: 185, test: { one: "@#$#", two: { test: "TESTVAL" } } })

    const scheduledActions = new ScheduledActions(core.path.join("Runner"), { cleanupExisting: true });

    const script = (txt: string) => `
    local v = syslib.now()
    syslib.setvalue(syslib.getselfpath(), "${txt}", 0, v)
    `;
    scheduledActions.addAction(script("Action 1"));
    scheduledActions.addAction(script("Action 2"));
    scheduledActions.addAction(script("Action 3"));
    scheduledActions.actions.forEach(a => { a.archive.setDataStore(myDataStore); a.archive.persistencyMode("persist dynamic values immediately"); a.archive.setRawHistory("enabled"); });


    // check barnching 
    // wen app is redy have a vresio of 1
    // then you have chagnes you darft you deploy
    // how some verioing, which tools, 
    //  like mif the background works, if not
    // version control.
    // keep git like
    //  automaion develppe what is possibel wha
    // deployemen
    // how we do i



}