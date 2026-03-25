import { GenericFolder, GenericFolderOptions } from "../objects/GenericFolder";
import { GenericItem, GenericItemOptions } from "../objects/GenericItem";
import { ActionItem, ActionItemOptions } from "../objects/ActionItem";
import { ScriptEvent } from "../objects/ScriptEvent";
import { TableHolder } from "../objects/TableHolder";
import { TableStore } from "../objects/TableStore";
import { GTSB, GTSBOptions } from "../datastores/GTSB";
import { CustomTimeSeriesDataStore, CustomTimeSeriesDataStoreOptions } from "../datastores/CustomTimeSeriesDataStore";
import { CustomEventDataStore, CustomEventDataStoreOptions } from "../datastores/CustomEventDataStore";
import { DataStoreGroup, DataStoreGroupOptions } from "../datastores/DataStoreGroup";
import { HistoryTransferController, HistoryTransferControllerOptions } from "../history/HistoryTransferController";
import { HistoryTransporter, HistoryTransporterOptions } from "../history/HistoryTransporter";
import { MessageBroker, MessageBrokerOptions } from "../objects/MessageBroker";
import { MessageProcessor, MessageProcessorOptions } from "../objects/MessageProcessor";
import { OpcUaDataSource, OpcUaDataSourceOptions } from "../DataSources/OpcUaDataSource";
import { SchedulerItem, SchedulerItemOptions } from "../objects/Scheduler";
import { VariableChildren } from "./VariableChildren";

/**
 * Full **Connector / folder-level** child factory: folders, items, data stores, historians, etc.
 * {@link CoreChildren} extends this with {@link CoreChildren.Connector}.
 */
export class ObjectChildren extends VariableChildren {
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

	SchedulerItem(name: string, options?: SchedulerItemOptions): SchedulerItem {
		return new SchedulerItem(this.childPath(name), options);
	}

	TableHolder(name: string): TableHolder {
		return new TableHolder(this.childPath(name));
	}

	TableStore(name: string): TableStore {
		return new TableStore(this.childPath(name));
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

	OpcUaDataSource(name: string, opts?: OpcUaDataSourceOptions): OpcUaDataSource {
		return new OpcUaDataSource(this.childPath(name), opts);
	}
}
