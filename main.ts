// Ensure TypeScriptToLua runtime helpers are installed into _G before any other imports run.
import "./prelude";

import { main as genericFolderExample } from "./examples/GenericFolderExample";
import { main as variableExample } from "./examples/VariableExample";
import { main as customTableExample } from "./examples/CustomTableExample";
import { main as dataFrameExample } from "./examples/DataFrameExample";
import { main as actionItemExample } from "./examples/ActionItemExample";
import { main as gtsbExample } from "./examples/GTSBExample";
import { main as historyTransporterExample } from "./examples/HistoryTransporterExample";
import { main as scriptEventExample } from "./examples/ScriptEventExample";
import { main as tableHolderExample } from "./examples/TableHolderExample";
import { main as namespaceExample } from "./examples/NamespaceExample";
import { main as objectContainerExample } from "./examples/ObjectContainerExample";
import { main as fileExample } from "./examples/FileExample";
import { main as waterTreatmentPlantExample } from "./examples/WaterTreatmentPlantExample";
import { main as systemDbExample } from "./examples/SystemDbExample";
import { main as bufferExample } from "./examples/BufferExample";
import { main as workspaceDocumentExample } from "./examples/WorkspaceDocumentExample";
import { main as TableStoreExample } from "./examples/TableStoreExample";
import { main as CustomTimeSeriesDataStore } from "./examples/CustomTimeSeriesDataStoreExample";
import { main as ScheduledActions } from "./examples/ScheduledActionsExample";
import * as mongo from "mongo";
import { SetExample } from "./examples/SetExample";


// import { GenericFolder } from "./src/objects/GenericFolder";
// import { TableHolder } from "./src/objects/TableHolder";

// SetExample();

// ScheduledActions();
CustomTimeSeriesDataStore();
// customTableExample();
// genericFolderExample();
// TableStoreExample();
// variableExample();
// dataFrameExample();
// actionItemExample();
// historyTransporterExample();
// scriptEventExample();
// tableHolderExample();
// namespaceExample();
// gtsbExample();
// // fileExample();
// objectContainerExample();
// waterTreatmentPlantExample();
// systemDbExample();
// bufferExample();
// workspaceDocumentExample();
