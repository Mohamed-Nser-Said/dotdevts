import { Connector, ConnectorOptions } from "../core/Connector";
import { ObjectChildren } from "./ObjectChildren";

/** **Core**-level child factory: everything under {@link ObjectChildren} plus {@link Connector}. */
export class CoreChildren extends ObjectChildren {
	Connector(name: string, opts?: ConnectorOptions): Connector {
		return new Connector(this.childPath(name), opts);
	}
}
