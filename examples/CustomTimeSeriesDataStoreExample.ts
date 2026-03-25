import { ScheduledActions } from "../src/components/ScheduledActions";
import { Core } from "../src/core/Core";
import { dump } from "../src/std/Debug";
import { mq } from "../src/std/MongoQuery";





export function main() {

    const core = new Core();

    const myDataStore = core.add.CustomTimeSeriesDataStore("myDataStore2", { registerAsDataStore: true, connection: { port: 27017, host: "localhost" } });

    const scheduledActions = new ScheduledActions(core.path.join("Runner-v2"), { cleanupExisting: false, dataStore: myDataStore, });


    // 1) TS function → compiled to Lua chunk string at build time
    const action = scheduledActions.addAction(() => {
        const txt = "Action 1";
        const v = syslib.now();
        syslib.setvalue(syslib.getselfpath(), txt, 0, v);

        return "TEST2.1";
    });


    const hist = action?.archive.getHistory(0, syslib.now());
    console.log(`------------------------------------------------`);
    const histT = hist?.map(interval => interval.T);
    console.log(hist);
    console.log(`History values for Action 1: ${dump(histT)} `);
    console.log(`History for Action 1: ${dump(hist)} `);
    console.log(`------------------------------------------------`);
    scheduledActions.addAction(() => {
        const txt = "Action 2";
        const v = syslib.now();
        syslib.setvalue(syslib.getselfpath(), txt, 0, v);

        return "TEST2.2";
    });


    scheduledActions.addAction(() => {
        let count = 0;
        for (let i = 0; i < 5; i++) {
            const txt = `Action 3 - ${i} `;
            const v = syslib.now();
            syslib.setvalue(syslib.getselfpath(), txt, 0, v);
        }
        return count;
    });

    // Insert a unique document (runId helps us query back exactly what we inserted).
    type MyDoc = {
        runId: number;
        /** inmation syslib timestamp (number). */
        timestamp: number;
        value: number;
    };

    const runId = syslib.now();
    const inserted: MyDoc = { runId, timestamp: syslib.now(), value: 42 };
    myDataStore.getCollection().insert(inserted);

    // Query it back. While typing inside the filter object, you should get
    // IntelliSense for Mongo operators like $eq/$gt/$gte/$in/$and/... etc.
    // Plain-object style:
    const foundPlain = myDataStore.findOneValue<MyDoc>({
        runId: { $eq: runId },
        value: { $gte: 42 },
    });

    // LINQ-ish fluent style:
    // This lambda form is a *compile-time macro* implemented by the TSTL plugin.
    // It compiles into: .where("runId").eq(runId).where("value").gte(42)
    const query = mq<MyDoc>()
        .where(doc => doc.runId === runId)
        .where(doc => doc.value >= 42)
        .build();

    const foundFluent = myDataStore.findOneValue<MyDoc>(query);

    // Execution-style fluent API (where/map/... then build *executes*):
    const values = myDataStore
        .query<MyDoc>()
        .where(doc => doc.runId === runId)
        .map(doc => ({ test: doc.value }))
        .value;


    console.log(`------------------------------------------------`);

    console.log(values);

    console.log(`------------------------------------------------`);

    // Pick one for the rest of the example.
    const found = foundFluent ?? foundPlain;


    // Note: in some inmation environments, `print` only logs the first argument.
    // TSTL compiles console.log(...) to print(...), so we stringify to ensure the
    // interesting value is visible in logs.
    console.log(`Inserted: runId = ${inserted.runId} timestamp = ${inserted.timestamp} value = ${inserted.value} `);
    if (found) {
        console.log(`Found: runId = ${found.runId} timestamp = ${found.timestamp} value = ${found.value} `);
    } else {
        console.log("Found   : null");
    }

    console.log(`Queryable values count(limit 5): ${values.length} `);

    if (!found) {
        const fallback = myDataStore.findAll<MyDoc>({ runId: { $eq: runId } }, { limit: 5 });
        console.log(`Fallback findAll count: ${fallback.length} `);
    }

    // Read all documents (no query filter).
    const all = myDataStore.readAll<MyDoc>({ limit: 10 });
    console.log(`ReadAll count(limit 10): ${all.length} `);
    if (all.length > 0) {
        // Safe preview (handles `_id` userdata, depth limits, etc.)
        console.log(`ReadAll[0] preview: ${dump(all[0], { depth: 2, maxKeys: 20 })} `);
    }

    console.log(`Scheduled actions created under scheduler: ${scheduledActions.schedulerPath} `);




}