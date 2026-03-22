import { Connector, ConnectorOptions } from "./Connector";
import { ObjectAddFactory } from "./ObjectAddFactory";

export class CoreAddFactory extends ObjectAddFactory {
    Connector(name: string, opts?: ConnectorOptions): Connector {
        return new Connector(this.childPath(name), opts);
    }
}
