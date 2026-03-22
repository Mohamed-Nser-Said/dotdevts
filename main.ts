// import { main as genericFolderExample } from "./examples/GenericFolderExample";
// import { main as variableExample } from "./examples/VariableExample";
// import { main as customTableExample } from "./examples/CustomTableExample";
// import { main as dataFrameExample } from "./examples/DataFrameExample";
// import { main as actionItemExample } from "./examples/ActionItemExample";
// import { main as gtsbExample } from "./examples/GTSBExample";
// import { main as historyTransporterExample } from "./examples/HistoryTransporterExample";
// import { main as scriptEventExample } from "./examples/ScriptEventExample";
// import { main as tableHolderExample } from "./examples/TableHolderExample";
// import { main as namespaceExample } from "./examples/NamespaceExample";
// import { main as objectContainerExample } from "./examples/ObjectContainerExample";
// import { main as fileExample } from "./examples/FileExample";
// import { main as waterTreatmentPlantExample } from "./examples/WaterTreatmentPlantExample";
// import { main as systemDbExample } from "./examples/SystemDbExample";
// import { main as bufferExample } from "./examples/BufferExample";
// import { main as workspaceDocumentExample } from "./examples/WorkspaceDocumentExample";

import { Core } from "./src/core/Core";



const core = new Core();
const conn = core.add.Connector("OPC");



const myCustomStore = core.add.CustomTimeSeriesDataStore("MyCustomTimeSeriesDataStore2", {
    connectionString: "localhost:27017",
    database: "my_timeseries_db",
    collection: "my_custom_time_series",
    registerAsDataStore: true,
});


const myVariable = conn.add.Variable("testVariable2", 42);
myVariable.archive.setDataStore(myCustomStore);
myVariable.archive.persistencyMode("persist dynamic values immediately");
myVariable.archive.setRawHistory("enabled");

const updateValue = () => {
    const newValue = Math.random() * 100;
    console.log(`Updating variable to ${newValue}`);
    myVariable.setValue(newValue);
};

for (let i = 0; i < 5; i++) {
    updateValue();
    syslib.sleep(1000);
}



