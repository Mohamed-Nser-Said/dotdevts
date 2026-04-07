import {
    Action,
    ActionMessage,
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
} from "./types";

export interface WindowProps {
    defaultTopic?: string;
}

/**
 * Action recorder — passed as `ctx` to widget event handlers (e.g. Button.onClicked).
 * Each method appends a typed action to the internal pipeline, then Button
 * harvests the recorded steps via getActions() and resets via reset().
 *
 * Pipeline model reference:
 *   https://docs.inmation.com/webapps/1.108/webstudio/ReferenceDocs/actions/index.html
 */
export class Window {
    _actions: PipelineStep[];
    _defaultTopic: string;

    constructor(props?: WindowProps) {
        this._actions = [];
        this._defaultTopic = (props && props.defaultTopic) ? props.defaultTopic : "test";
    }

    // ── Sequential action helpers ─────────────────────────────────────────────

    /** Show a notification popup */
    notify(payload?: unknown, topic?: string): this {
        const action: NotifyAction = {
            type: "notify",
            message: {
                payload: payload,
                topic: topic ? topic : this._defaultTopic,
            },
        };
        this._actions.push(action);
        return this;
    }

    /** Read data from a data source / item path */
    read(message?: ActionMessage, path?: string): this {
        const action: ReadAction = { type: "read" };
        if (message !== undefined) { action.message = message; }
        if (path !== undefined) { action.path = path; }
        this._actions.push(action);
        return this;
    }

    /** Write data to a data source / item path */
    write(message?: ActionMessage, path?: string): this {
        const action: WriteAction = { type: "write" };
        if (message !== undefined) { action.message = message; }
        if (path !== undefined) { action.path = path; }
        this._actions.push(action);
        return this;
    }

    /** Send a message to another widget or topic */
    send(message?: ActionMessage, to?: string): this {
        const action: SendAction = { type: "send" };
        if (message !== undefined) { action.message = message; }
        if (to !== undefined) { action.to = to; }
        this._actions.push(action);
        return this;
    }

    /** Pass the incoming message through to the next step unchanged */
    passthrough(message?: ActionMessage): this {
        const action: PassthroughAction = { type: "passthrough" };
        if (message !== undefined) { action.message = message; }
        this._actions.push(action);
        return this;
    }

    /** Pause the pipeline for `duration` milliseconds */
    wait(duration: number): this {
        const action: WaitAction = { type: "wait", duration };
        this._actions.push(action);
        return this;
    }

    /** Write a value to the browser console */
    consoleLog(message: unknown): this {
        const action: ConsoleLogAction = { type: "consoleLog", message };
        this._actions.push(action);
        return this;
    }

    /** Navigate to a URL */
    openLink(url: string, target?: "_self" | "_blank" | "_parent" | "_top"): this {
        const action: OpenLinkAction = { type: "openLink", url };
        if (target !== undefined) { action.target = target; }
        this._actions.push(action);
        return this;
    }

    /** Run a custom script transform on the message */
    transform(script: string): this {
        const action: TransformAction = { type: "transform", script };
        this._actions.push(action);
        return this;
    }

    /** Modify a widget's model property by UUID */
    modify(id: string, set: Array<{ name: string; value: unknown }>): this {
        const action: ModifyAction = { type: "modify", id, set };
        this._actions.push(action);
        return this;
    }

    /**
     * Add a parallel execution group — the provided actions will run
     * simultaneously as a nested array in the pipeline.
     * Usage: ctx.parallel([ctx.buildNotify(...), ctx.buildModify(...)])
     */
    parallel(actions: Action[]): this {
        const group: ParallelGroup = actions;
        this._actions.push(group);
        return this;
    }

    // ── Pipeline access ───────────────────────────────────────────────────────

    /** Return all recorded pipeline steps since the last reset */
    getActions(): PipelineStep[] {
        return this._actions;
    }

    /** Clear the recorded pipeline (called by Button after harvesting) */
    reset(): void {
        this._actions = [];
    }
}

