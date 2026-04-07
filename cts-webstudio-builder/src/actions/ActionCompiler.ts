import {
    Action,
    ConsoleLogAction,
    ModifyAction,
    NotifyAction,
    OpenLinkAction,
    ParallelGroup,
    PassthroughAction,
    PipelineStep,
    ReadAction,
    SendAction,
    TransformAction,
    WaitAction,
    WriteAction,
    ActionMessage,
} from "../core/types";

/**
 * ActionContext — fluent builder for assembling a WebStudio action pipeline.
 *
 * Equivalent to the `ctx` passed into event handlers.  Compared to Window,
 * this class is intended for programmatic pipeline construction outside of
 * a widget handler callback (e.g. pre-built pipelines, component libraries).
 *
 * Pipeline structure:
 *   [step, step, [parallelA, parallelB], step, ...]
 *
 * Reference: https://docs.inmation.com/webapps/1.108/webstudio/ReferenceDocs/actions/index.html
 */
export class ActionContext {
    private _steps: PipelineStep[];

    constructor() {
        this._steps = [];
    }

    // ── Sequential steps ──────────────────────────────────────────────────────

    notify(payload?: unknown, topic?: string): this {
        const action: NotifyAction = {
            type: "notify",
            message: { payload, topic: topic ? topic : "default" },
        };
        this._steps.push(action);
        return this;
    }

    read(message?: ActionMessage, path?: string): this {
        const action: ReadAction = { type: "read" };
        if (message !== undefined) { action.message = message; }
        if (path !== undefined) { action.path = path; }
        this._steps.push(action);
        return this;
    }

    write(message?: ActionMessage, path?: string): this {
        const action: WriteAction = { type: "write" };
        if (message !== undefined) { action.message = message; }
        if (path !== undefined) { action.path = path; }
        this._steps.push(action);
        return this;
    }

    send(message?: ActionMessage, to?: string): this {
        const action: SendAction = { type: "send" };
        if (message !== undefined) { action.message = message; }
        if (to !== undefined) { action.to = to; }
        this._steps.push(action);
        return this;
    }

    passthrough(message?: ActionMessage): this {
        const action: PassthroughAction = { type: "passthrough" };
        if (message !== undefined) { action.message = message; }
        this._steps.push(action);
        return this;
    }

    wait(duration: number): this {
        const action: WaitAction = { type: "wait", duration };
        this._steps.push(action);
        return this;
    }

    consoleLog(message: unknown): this {
        const action: ConsoleLogAction = { type: "consoleLog", message };
        this._steps.push(action);
        return this;
    }

    openLink(url: string, target?: "_self" | "_blank" | "_parent" | "_top"): this {
        const action: OpenLinkAction = { type: "openLink", url };
        if (target !== undefined) { action.target = target; }
        this._steps.push(action);
        return this;
    }

    transform(script: string): this {
        const action: TransformAction = { type: "transform", script };
        this._steps.push(action);
        return this;
    }

    modify(id: string, set: Array<{ name: string; value: unknown }>): this {
        const action: ModifyAction = { type: "modify", id, set };
        this._steps.push(action);
        return this;
    }

    /**
     * Add a parallel execution group.  All actions in the group run
     * simultaneously; the pipeline continues after all finish.
     */
    parallel(actions: Action[]): this {
        const group: ParallelGroup = actions;
        this._steps.push(group);
        return this;
    }

    // ── Build ─────────────────────────────────────────────────────────────────

    /** Return the assembled pipeline (flat array of steps) */
    build(): PipelineStep[] {
        return this._steps;
    }

    /** Reset the pipeline so this instance can be reused */
    reset(): this {
        this._steps = [];
        return this;
    }
}

