import { Core } from "../src/core/Core";
import { CustomEventDataStore } from "../src/datastores/CustomEventDataStore";





export function main() {

    const core = new Core();

    const myDataStore = core.add.CustomTimeSeriesDataStore("myDataStore", { registerAsDataStore: true, connection: { port: 27017, host: "localhost" } });

    const db = myDataStore.getMongoConnection()
    console.log(db);
    console.log("Created!");




}