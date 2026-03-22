import { GenericFolder, GenericFolderOptions } from "./GenericFolder";
import { GenericItem, GenericItemOptions } from "./GenericItem";
import { ActionItem, ActionItemOptions } from "./ActionItem";
import { ScriptEvent } from "./ScriptEvent";
import { Scheduler } from "./Scheduler";
import { TableHolder } from "./TableHolder";
import { GTSB, GTSBOptions } from "./GTSB";
import { CustomTimeSeriesDataStore, CustomTimeSeriesDataStoreOptions } from "./CustomTimeSeriesDataStore";
import { CustomEventDataStore, CustomEventDataStoreOptions } from "./CustomEventDataStore";
import { DataStoreGroup, DataStoreGroupOptions } from "./DataStoreGroup";
import { HistoryTransferController, HistoryTransferControllerOptions } from "./HistoryTransferController";
import { HistoryTransporter, HistoryTransporterOptions } from "./HistoryTransporter";
import { MessageBroker, MessageBrokerOptions } from "./MessageBroker";
import { MessageProcessor, MessageProcessorOptions } from "./MessageProcessor";
import { VariableAddFactory } from "./VariableAddFactory";

export class ObjectAddFactory extends VariableAddFactory {
    GenericFolder(name: string, opts?: GenericFolderOptions): GenericFolder {
        return new GenericFolder(this.childPath(name), opts);
    }

    GenericItem(name: string, opts?: GenericItemOptions): GenericItem {
        return new GenericItem(this.childPath(name), opts);
    }

    ActionItem(name: string, opts?: ActionItemOptions): ActionItem {
        return new ActionItem(this.childPath(name), opts);
    }

    ScriptEvent(name: string): ScriptEvent {
        return new ScriptEvent(this.childPath(name));
    }

    Scheduler(name: string): Scheduler {
        return new Scheduler(this.childPath(name));
    }

    TableHolder(name: string): TableHolder {
        return new TableHolder(this.childPath(name));
    }

    GTSB(name: string, opts?: GTSBOptions): GTSB {
        return new GTSB(this.childPath(name), opts);
    }

    CustomTimeSeriesDataStore(name: string, opts?: CustomTimeSeriesDataStoreOptions): CustomTimeSeriesDataStore {
        return new CustomTimeSeriesDataStore(this.childPath(name), opts);
    }

    CustomEventDataStore(name: string, opts?: CustomEventDataStoreOptions): CustomEventDataStore {
        return new CustomEventDataStore(this.childPath(name), opts);
    }

    DataStoreGroup(name: string, opts?: DataStoreGroupOptions): DataStoreGroup {
        return new DataStoreGroup(this.childPath(name), opts);
    }

    HistoryTransferController(name: string, opts?: HistoryTransferControllerOptions): HistoryTransferController {
        return new HistoryTransferController(this.childPath(name), opts);
    }

    HistoryTransporter(name: string, opts?: HistoryTransporterOptions): HistoryTransporter {
        return new HistoryTransporter(this.childPath(name), opts);
    }

    MessageBroker(name: string, opts?: MessageBrokerOptions): MessageBroker {
        return new MessageBroker(this.childPath(name), opts);
    }

    MessageProcessor(name: string, opts?: MessageProcessorOptions): MessageProcessor {
        return new MessageProcessor(this.childPath(name), opts);
    }
}
