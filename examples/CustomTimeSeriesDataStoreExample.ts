import { Core } from "../src/core/Core";
import { CustomEventDataStore } from "../src/datastores/CustomEventDataStore";





export function main() {

    const core = new Core();

    const myDataStore = core.add.CustomTimeSeriesDataStore("myDataStore", { registerAsDataStore: true, connection: { port: 27017, host: "localhost" } });

    myDataStore.getCollection().insert({ name: 'Jane Smith2', height: 185, test: { one: "@#$#", two: { test: "TESTVAL" } } })



}