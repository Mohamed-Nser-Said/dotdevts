// Action type definitions for the WebStudio builder.
// Action model reference: https://docs.inmation.com/webapps/1.108/webstudio/ReferenceDocs/actions/index.html

// ─── Action message (passed between pipeline steps) ───────────────────────────

export interface ActionMessage {
    topic?: string | null;
    payload?: unknown;
    [key: string]: unknown;
}

export type WidgetTarget = "self" | string | { route: string[] };

export interface ActionAssignment {
    name: string;
    value?: unknown;
    query?: string;
    idx?: number;
    item?: unknown;
    condition?: unknown;
    [key: string]: unknown;
}

export type ActionPipeline = Array<Action | ActionPipeline>;
export type ActionSequence = Action | ActionPipeline;

// ─── Catch block (error handler for any action) ───────────────────────────────

export interface ActionCatch {
    type?: "continue" | "break" | "throw";
    action?: ActionSequence;
}

interface ActionBase<TType extends string> {
    type: TType;
    catch?: ActionCatch;
    key?: string;
    skip?: boolean;
    [key: string]: unknown;
}

// ─── Individual action types ──────────────────────────────────────────────────

/** Invoke a named action declared on the widget or the root compilation */
export interface NamedAction extends ActionBase<"action"> {
    name: string;
}

/** Collect data from another widget */
export interface CollectAction extends ActionBase<"collect"> {
    from: WidgetTarget;
    message?: ActionMessage;
}

/** Write the current payload to the browser console */
export interface ConsoleLogAction extends ActionBase<"consoleLog"> {
    message?: unknown;
    tag?: string;
}

/** Convert the payload to or from JSON/Base64 */
export interface ConvertAction extends ActionBase<"convert"> {
    message?: ActionMessage;
    encode?: "json" | "base64";
    decode?: "json" | "base64";
}

/** Copy the current payload to the clipboard */
export interface CopyAction extends ActionBase<"copy"> {
    message?: ActionMessage;
}

/** Delegate a nested pipeline to the definition context */
export interface DelegateAction extends ActionBase<"delegate"> {
    action: ActionSequence;
    message?: ActionMessage;
}

/** Dismiss the active prompt or floating tab */
export interface DismissAction extends ActionBase<"dismiss"> {}

/** Read browser theme/locale/timezone values */
export interface EnvironmentAction extends ActionBase<"environment"> {
    message?: ActionMessage;
    set?: ActionAssignment[];
}

/** Fetch data by path */
export interface FetchAction extends ActionBase<"fetch"> {
    message?: ActionMessage;
    path?: string;
}

/** Invoke an Advanced Endpoint */
export interface FunctionAction extends ActionBase<"function"> {
    message?: ActionMessage;
    lib: string;
    func?: string;
    farg?: unknown;
    ctx?: string;
}

/** Convert one or more time values */
export interface GetTimeAction extends ActionBase<"gettime"> {
    message?: ActionMessage;
    set?: Array<{
        name?: string;
        value?: unknown;
        asEpoch?: boolean;
        timezone?: string;
        format?: string;
        [key: string]: unknown;
    }>;
}

/** Read the browser locale/timezone */
export interface InternationalizationAction extends ActionBase<"internationalization"> {
    message?: ActionMessage;
    set?: ActionAssignment[];
}

/** Load a compilation from the backend, a function, or the message payload */
export interface LoadCompilationAction extends ActionBase<"load-compilation"> {
    message?: ActionMessage;
    subType?: "object-name" | "function" | "compilation-field" | string;
    history?: { type?: "replaceState" | "pushState" | "none" | string };
    objspec?: string;
    name?: string;
    ctx?: string;
    lib?: string;
    func?: string;
    farg?: unknown;
}

/** Modify a widget model at runtime */
export interface ModifyAction extends ActionBase<"modify"> {
    id: WidgetTarget;
    message?: ActionMessage;
    set?: ActionAssignment[];
    unset?: string[];
    addToArray?: ActionAssignment[];
    removeFromArray?: ActionAssignment[];
    filter?: ActionAssignment[];
    refresh?: boolean;
    debug?: boolean;
}

/** Show a notification popup */
export interface NotifyAction extends ActionBase<"notify"> {
    message?: ActionMessage;
    title?: string;
    text?: string;
    duration?: number;
    transition?: "slide" | "bounce" | "zoom" | "flip" | string;
    style?: Record<string, unknown>;
    styleByTheme?: Record<string, unknown>;
}

/** Load a file from disk into the message payload */
export interface OpenFileAction extends ActionBase<"open-file"> {
    message?: ActionMessage;
}

/** Open a URL */
export interface OpenLinkAction extends ActionBase<"openLink"> {
    url: string;
    target?: "_self" | "_blank" | "_parent" | "_top";
}

/** Merge an optional message into the incoming message and pass it through */
export interface PassthroughAction extends ActionBase<"passthrough"> {
    message?: ActionMessage;
}

/** Show a prompt dialog */
export interface PromptAction extends ActionBase<"prompt"> {
    message?: ActionMessage;
    width?: string;
    height?: string;
}

/** Read data from the backend */
export interface ReadAction extends ActionBase<"read"> {
    message?: ActionMessage;
    path?: string;
    opt?: Record<string, unknown>;
    item?: Record<string, unknown>;
    items?: Array<Record<string, unknown>>;
}

/** Read aggregated historical data */
export interface ReadHistoricalDataAction extends ActionBase<"read-historical-data"> {
    message?: ActionMessage;
    query: Record<string, unknown>;
}

/** Read model information from the backend */
export interface ReadModelAction extends ActionBase<"read-model"> {
    message?: ActionMessage;
    objspec?: string;
    items?: Array<Record<string, unknown>>;
    depth?: number;
    properties?: unknown[];
}

/** Read raw historical data */
export interface ReadRawHistoricalDataAction extends ActionBase<"read-raw-historical-data"> {
    message?: ActionMessage;
    query: Record<string, unknown>;
}

/** Widget read/write binding */
export interface ReadWriteAction extends ActionBase<"read-write"> {
    message?: ActionMessage;
    path: string;
}

/** Refresh a widget */
export interface RefreshAction extends ActionBase<"refresh"> {
    id?: WidgetTarget;
}

/** Save the payload to a file */
export interface SaveFileAction extends ActionBase<"save-file"> {
    filename: string;
    options?: { type?: string };
}

/** Export a widget or compilation as an image */
export interface ScreenCaptureAction extends ActionBase<"screen-capture"> {
    subType?: "image" | string;
    fileName?: string;
    id?: WidgetTarget;
    mimeType?: string;
}

/** Send a message to another widget */
export interface SendAction extends ActionBase<"send"> {
    message?: ActionMessage;
    to?: WidgetTarget;
}

/** Set the active page in a diagrams widget */
export interface SetActiveDiagramsPageAction extends ActionBase<"setActiveDiagramsPage"> {
    id?: WidgetTarget;
    name?: string;
}

/** Subscribe to backend data changes */
export interface SubscribeAction extends ActionBase<"subscribe"> {
    message?: ActionMessage;
    path: string;
}

/** Execute different actions based on rule matches */
export interface SwitchAction extends ActionBase<"switch"> {
    message?: ActionMessage;
    checkAll?: boolean;
    completeMsgObject?: boolean;
    case?: Array<{
        match: unknown;
        action: ActionSequence;
    }>;
}

/** Transform the payload using WebStudio's aggregation/query syntax */
export interface TransformAction extends ActionBase<"transform"> {
    message?: ActionMessage;
    aggregate?: unknown[];
    aggregateOne?: unknown[];
    query?: Record<string, unknown>;
    queryOne?: Record<string, unknown>;
    completeMsgObject?: boolean;
    // Kept for backwards compatibility with the current builder API.
    script?: string;
}

/** Pause pipeline execution */
export interface WaitAction extends ActionBase<"wait"> {
    duration: number;
}

/** Write data to the backend */
export interface WriteAction extends ActionBase<"write"> {
    message?: ActionMessage;
    path?: string;
    item?: Record<string, unknown>;
    items?: Array<Record<string, unknown>>;
}

// ─── Union of all action types ────────────────────────────────────────────────

export type Action =
    | NamedAction
    | CollectAction
    | ConsoleLogAction
    | ConvertAction
    | CopyAction
    | DelegateAction
    | DismissAction
    | EnvironmentAction
    | FetchAction
    | FunctionAction
    | GetTimeAction
    | InternationalizationAction
    | LoadCompilationAction
    | ModifyAction
    | NotifyAction
    | OpenFileAction
    | OpenLinkAction
    | PassthroughAction
    | PromptAction
    | ReadAction
    | ReadHistoricalDataAction
    | ReadModelAction
    | ReadRawHistoricalDataAction
    | ReadWriteAction
    | RefreshAction
    | SaveFileAction
    | ScreenCaptureAction
    | SendAction
    | SetActiveDiagramsPageAction
    | SubscribeAction
    | SwitchAction
    | TransformAction
    | WaitAction
    | WriteAction;

/**
 * Nested action arrays behave like WebStudio pipeline groups.
 * Example pipeline: [actionA, [actionB, actionC], actionD]
 */
export type ParallelGroup = ActionPipeline;

/** A single step inside an action pipeline — either one action or a nested action array */
export type PipelineStep = Action | ActionPipeline;
