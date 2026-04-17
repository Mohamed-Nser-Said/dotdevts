import { PipelineStep } from "../core/types";

/**
 * ActionContext — fluent builder for assembling a WebStudio action pipeline.
 * TODO: re-implement after action system rework.
 */
export class ActionContext {
    private actions: PipelineStep[] = [];

    build(): PipelineStep[] {
        return this.actions;
    }
}

