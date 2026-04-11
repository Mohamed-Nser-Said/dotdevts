import {
    Action,
    ActionAssignment,
    ActionMessage,
    ActionPipeline,
    CollectAction,
    ConsoleLogAction,
    ConvertAction,
    CopyAction,
    DelegateAction,
    DismissAction,
    EnvironmentAction,
    FetchAction,
    FunctionAction,
    GetTimeAction,
    InternationalizationAction,
    LoadCompilationAction,
    ModifyAction,
    NamedAction,
    NotifyAction,
    OpenFileAction,
    OpenLinkAction,
    ParallelGroup,
    PassthroughAction,
    PipelineStep,
    PromptAction,
    ReadAction,
    RefreshAction,
    SaveFileAction,
    ScreenCaptureAction,
    SendAction,
    SetActiveDiagramsPageAction,
    StyleProps,
    SubscribeAction,
    SwitchAction,
    TransformAction,
    WaitAction,
    WidgetTarget,
    WriteAction,
} from "./types";

export interface WindowProps {
    defaultTopic?: string;
}

/**
 * Action recorder — passed as `ctx` to widget event handlers (e.g. Button.onClicked).
 * Each method appends a typed action to the internal pipeline, then widgets
 * harvest the recorded steps via `getActions()` and clear them via `reset()`.
 */
export class Window {
    _actions: PipelineStep[];
    _defaultTopic: string;

    constructor(props?: WindowProps) {
        this._actions = [];
        this._defaultTopic = (props && props.defaultTopic) ? props.defaultTopic : "default";
    }

    private append(action: Action): this {
        this._actions.push(action);
        return this;
    }

    /** Push a prebuilt action or nested action group into the pipeline. */
    push(step: PipelineStep): this {
        this._actions.push(step);
        return this;
    }

    // ── Sequential action helpers ─────────────────────────────────────────────

    /** Show a notification popup */
    notify(payload?: unknown, topic?: string): this {
        const action: NotifyAction = { type: "notify" };

        if (typeof payload === "string" || typeof payload === "number" || typeof payload === "boolean") {
            action.text = String(payload);
        } else if (payload && typeof payload === "object" && !Array.isArray(payload)) {
            const record = payload as Record<string, unknown>;
            if (typeof record.title === "string") {
                action.title = record.title;
            }
            if (typeof record.text === "string") {
                action.text = record.text;
            }
            if (typeof record.duration === "number") {
                action.duration = record.duration;
            }
            if (typeof record.transition === "string") {
                action.transition = record.transition;
            }
            if (record.style && typeof record.style === "object") {
                action.style = record.style as Record<string, unknown>;
            }
            if (record.styleByTheme && typeof record.styleByTheme === "object") {
                action.styleByTheme = record.styleByTheme as Record<string, unknown>;
            }
        }

        if (payload !== undefined || topic !== undefined) {
            action.message = {};
            if (payload !== undefined) {
                action.message.payload = payload;
            }
            action.message.topic = topic ? topic : this._defaultTopic;
        }
        return this.append(action);
    }

    /** Invoke a named action declared on the widget or the root compilation */
    action(name: string): this {
        const action: NamedAction = { type: "action", name };
        return this.append(action);
    }

    /** Collect data from another widget */
    collect(from: WidgetTarget, key?: string): this {
        const action: CollectAction = { type: "collect", from };
        if (key !== undefined) {
            action.key = key;
        }
        return this.append(action);
    }

    /** Read data from a data source / item path */
    read(message?: ActionMessage, path?: string): this {
        const action: ReadAction = { type: "read" };
        if (message !== undefined) { action.message = message; }
        if (path !== undefined) { action.path = path; }
        return this.append(action);
    }

    /** Write data to a data source / item path */
    write(message?: ActionMessage, path?: string): this {
        const action: WriteAction = { type: "write" };
        if (message !== undefined) { action.message = message; }
        if (path !== undefined) { action.path = path; }
        return this.append(action);
    }

    /** Send a message to another widget or topic */
    send(message?: ActionMessage, to?: WidgetTarget): this {
        const action: SendAction = { type: "send" };
        if (message !== undefined) { action.message = message; }
        if (to !== undefined) { action.to = to; }
        return this.append(action);
    }

    /** Pass the incoming message through to the next step unchanged */
    passthrough(message?: ActionMessage): this {
        const action: PassthroughAction = { type: "passthrough" };
        if (message !== undefined) { action.message = message; }
        return this.append(action);
    }

    /** Convert the payload to or from JSON/Base64 */
    convert(options: { encode?: "json" | "base64"; decode?: "json" | "base64"; message?: ActionMessage }): this {
        const action: ConvertAction = { type: "convert" };
        if (options.message !== undefined) { action.message = options.message; }
        if (options.encode !== undefined) { action.encode = options.encode; }
        if (options.decode !== undefined) { action.decode = options.decode; }
        return this.append(action);
    }

    /** Copy the current payload to the clipboard */
    copy(message?: ActionMessage): this {
        const action: CopyAction = { type: "copy" };
        if (message !== undefined) { action.message = message; }
        return this.append(action);
    }

    /** Close the active prompt or floating tab */
    dismiss(): this {
        const action: DismissAction = { type: "dismiss" };
        return this.append(action);
    }

    /** Pause the pipeline for `duration` milliseconds */
    wait(duration: number): this {
        const action: WaitAction = { type: "wait", duration };
        return this.append(action);
    }

    /** Write a value to the browser console */
    consoleLog(message: unknown, tag?: string): this {
        const action: ConsoleLogAction = { type: "consoleLog", message };
        if (tag !== undefined) {
            action.tag = tag;
        }
        return this.append(action);
    }

    /** Navigate to a URL */
    openLink(url: string, target?: "_self" | "_blank" | "_parent" | "_top"): this {
        const action: OpenLinkAction = { type: "openLink", url };
        if (target !== undefined) { action.target = target; }
        return this.append(action);
    }

    /** Open a file picker and load the content into the payload */
    openFile(message?: ActionMessage): this {
        const action: OpenFileAction = { type: "open-file" };
        if (message !== undefined) { action.message = message; }
        return this.append(action);
    }

    /** Show a prompt dialog with a single widget payload */
    prompt(payload: Record<string, unknown>, width?: string, height?: string): this {
        const action: PromptAction = {
            type: "prompt",
            message: { payload },
        };
        if (width !== undefined) { action.width = width; }
        if (height !== undefined) { action.height = height; }
        return this.append(action);
    }

    /** Refresh a widget */
    refresh(id?: WidgetTarget): this {
        const action: RefreshAction = { type: "refresh" };
        if (id !== undefined) {
            action.id = id;
        }
        return this.append(action);
    }

    /** Save the payload to a browser download */
    saveFile(filename: string, options?: { type?: string }): this {
        const action: SaveFileAction = { type: "save-file", filename };
        if (options !== undefined) {
            action.options = options;
        }
        return this.append(action);
    }

    /** Export a widget or compilation as an image */
    screenCapture(fileName?: string, id?: WidgetTarget, mimeType?: string): this {
        const action: ScreenCaptureAction = { type: "screen-capture", subType: "image" };
        if (fileName !== undefined) { action.fileName = fileName; }
        if (id !== undefined) { action.id = id; }
        if (mimeType !== undefined) { action.mimeType = mimeType; }
        return this.append(action);
    }

    /** Subscribe to backend value changes */
    subscribe(path: string): this {
        const action: SubscribeAction = { type: "subscribe", path };
        return this.append(action);
    }

    /** Invoke an Advanced Endpoint */
    functionCall(lib: string, func?: string, farg?: unknown, ctx?: string): this {
        const action: FunctionAction = { type: "function", lib };
        if (func !== undefined) { action.func = func; }
        if (farg !== undefined) { action.farg = farg; }
        if (ctx !== undefined) { action.ctx = ctx; }
        return this.append(action);
    }

    /** Execute different actions based on rule matches */
    switch(caseList: Array<{ match: unknown; action: Action | ActionPipeline }>, options?: { checkAll?: boolean; completeMsgObject?: boolean }): this {
        const action: SwitchAction = {
            type: "switch",
            case: caseList,
        };
        if (options && options.checkAll !== undefined) {
            action.checkAll = options.checkAll;
        }
        if (options && options.completeMsgObject !== undefined) {
            action.completeMsgObject = options.completeMsgObject;
        }
        return this.append(action);
    }

    /** Execute a nested action sequence in the context where it was defined */
    delegate(actionToRun: Action | ActionPipeline): this {
        const action: DelegateAction = { type: "delegate", action: actionToRun };
        return this.append(action);
    }

    /** Run a WebStudio transform action */
    transform(scriptOrConfig: string | Omit<TransformAction, "type">): this {
        const action: TransformAction = { type: "transform" };
        if (typeof scriptOrConfig === "string") {
            action.script = scriptOrConfig;
        } else {
            for (const key in scriptOrConfig) {
                (action as Record<string, unknown>)[key] = (scriptOrConfig as Record<string, unknown>)[key];
            }
        }
        return this.append(action);
    }

    /** Modify a widget's model property by ID or route */
    modify(id: WidgetTarget, set: ActionAssignment[], options?: { refresh?: boolean }): this {
        const action: ModifyAction = { type: "modify", id, set };
        if (options && options.refresh !== undefined) {
            action.refresh = options.refresh;
        }
        return this.append(action);
    }

    /** Modify a single widget model field. */
    modifyValue(id: WidgetTarget, name: string, value: unknown, refresh?: boolean): this {
        return this.modify(id, [{ name, value }], { refresh });
    }

    /** Convenience helper for widgets exposing `model.text`. */
    setText(id: WidgetTarget, text: string, refresh?: boolean): this {
        return this.modifyValue(id, "model.text", text, refresh);
    }

    /** Convenience helper for widgets exposing `model.disabled`. */
    setDisabled(id: WidgetTarget, disabled = true, refresh?: boolean): this {
        return this.modifyValue(id, "model.disabled", disabled, refresh);
    }

    /** Patch one or more `model.options.style.*` fields on a widget. */
    setStyle(id: WidgetTarget, style: Partial<StyleProps>, refresh?: boolean): this {
        const styleRecord = style as Record<string, unknown>;
        const set: ActionAssignment[] = [];

        for (const key in styleRecord) {
            const value = styleRecord[key];
            if (value !== undefined) {
                set.push({ name: `model.options.style.${key}`, value });
            }
        }

        if (set.length === 0) {
            return this;
        }

        return this.modify(id, set, { refresh });
    }

    /**
     * Add a nested action group. In WebStudio these arrays receive the same
     * input message when they appear sequentially in a pipeline.
     */
    parallel(actions: PipelineStep[]): this {
        const group: ParallelGroup = actions;
        this._actions.push(group);
        return this;
    }

    // ── New action helpers (schema-derived) ──────────────────────────────────

    /** Fetch data by path */
    fetch(path?: string, message?: ActionMessage): this {
        const action: FetchAction = { type: "fetch" };
        if (path !== undefined) { action.path = path; }
        if (message !== undefined) { action.message = message; }
        return this.append(action);
    }

    /** Load a compilation from the backend */
    loadCompilation(options: {
        subType?: "function" | "object-name" | "compilation-field";
        lib?: string;
        func?: string;
        farg?: unknown;
        objspec?: string | number;
        name?: string;
        ctx?: string;
        history?: { type?: "replaceState" | "pushState" | "none" };
    }): this {
        const action: LoadCompilationAction = { type: "load-compilation" };
        for (const key in options) {
            (action as Record<string, unknown>)[key] = (options as Record<string, unknown>)[key];
        }
        return this.append(action);
    }

    /** Read browser environment values (locale, theme, timezone) */
    environment(set: Array<{ name: string; query: "getLocale" | "getTheme" | "getTimezone" }>): this {
        const action: EnvironmentAction = { type: "environment", set };
        return this.append(action);
    }

    /** Convert time values */
    getTime(set: Array<{ name: string; value: unknown; asEpoch?: boolean; timezone?: string; format?: string }>): this {
        const action: GetTimeAction = { type: "gettime", set };
        return this.append(action);
    }

    /** Read internationalization settings */
    internationalization(set: Array<{ name: string; query: "getLocale" | "getTimezone" }>): this {
        const action: InternationalizationAction = { type: "internationalization", set };
        return this.append(action);
    }

    /** Set the active page in a diagrams widget */
    setActiveDiagramsPage(id?: WidgetTarget, name?: string): this {
        const action: SetActiveDiagramsPageAction = { type: "setActiveDiagramsPage" };
        if (id !== undefined) { action.id = id; }
        if (name !== undefined) { action.name = name; }
        return this.append(action);
    }

    // ── Pipeline access ───────────────────────────────────────────────────────

    /** Return all recorded pipeline steps since the last reset */
    getActions(): PipelineStep[] {
        return this._actions;
    }

    /** Clear the recorded pipeline so the same recorder can be reused */
    reset(): this {
        this._actions = [];
        return this;
    }
}

