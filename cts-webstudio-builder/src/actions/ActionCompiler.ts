import { Window } from "../core/Window";
import { PipelineStep } from "../core/types";

/**
 * ActionContext — fluent builder for assembling a WebStudio action pipeline
 * outside a widget callback.
 */
export class ActionContext extends Window {
    /** Return the assembled pipeline */
    build(): PipelineStep[] {
        return this.getActions();
    }
}

