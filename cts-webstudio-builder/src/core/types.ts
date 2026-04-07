// Core type definitions for the WebStudio builder.
// Action model reference: https://docs.inmation.com/webapps/1.108/webstudio/ReferenceDocs/actions/index.html

// ─── Style ────────────────────────────────────────────────────────────────────

export interface StyleProps {
    fontSize?: string;
    borderRadius?: string;
    backgroundColor?: string;
    color?: string;
    padding?: string;
    cursor?: string;
    textAlign?: string;
    fontWeight?: string;
    fontFamily?: string;
    width?: string;
    height?: string;
    border?: string;
    opacity?: string;
    // Additional CSS properties used by component presets
    background?: string;
    boxShadow?: string;
    outline?: string;
    transition?: string;
    justifyContent?: string;
}

// ─── Layout position ──────────────────────────────────────────────────────────

export interface Position {
    x: number;
    y: number;
    w: number;
    h: number;
}

// ─── Action message (passed between pipeline steps) ───────────────────────────

export interface ActionMessage {
    topic?: string;
    payload?: unknown;
}

// ─── Catch block (error handler for any action) ───────────────────────────────

export type ActionCatch = Record<string, unknown>;

// ─── Individual action types ──────────────────────────────────────────────────

/** Modify a widget property at runtime, e.g. update model.text */
export interface ModifyAction {
    type: "modify";
    id: string;
    set: Array<{ name: string; value: unknown }>;
    catch?: ActionCatch;
}

/** Show a notification popup */
export interface NotifyAction {
    type: "notify";
    message: ActionMessage;
    catch?: ActionCatch;
}

/** Read data from a data source / item path */
export interface ReadAction {
    type: "read";
    message?: ActionMessage;
    path?: string;
    catch?: ActionCatch;
}

/** Write data to a data source / item path */
export interface WriteAction {
    type: "write";
    message?: ActionMessage;
    path?: string;
    catch?: ActionCatch;
}

/** Send a message to another widget or topic */
export interface SendAction {
    type: "send";
    message?: ActionMessage;
    to?: string;
    catch?: ActionCatch;
}

/** Pass the incoming message through to the next pipeline step unchanged */
export interface PassthroughAction {
    type: "passthrough";
    message?: ActionMessage;
    catch?: ActionCatch;
}

/** Pause pipeline execution for a fixed duration (milliseconds) */
export interface WaitAction {
    type: "wait";
    duration: number;
    catch?: ActionCatch;
}

/** Write a value to the browser console */
export interface ConsoleLogAction {
    type: "consoleLog";
    message: unknown;
    catch?: ActionCatch;
}

/** Navigate to a URL (optionally in a new tab) */
export interface OpenLinkAction {
    type: "openLink";
    url: string;
    target?: "_self" | "_blank" | "_parent" | "_top";
    catch?: ActionCatch;
}

/** Run a custom JavaScript/expression transform on the message */
export interface TransformAction {
    type: "transform";
    script: string;
    catch?: ActionCatch;
}

// ─── Union of all action types ────────────────────────────────────────────────

export type Action =
    | ModifyAction
    | NotifyAction
    | ReadAction
    | WriteAction
    | SendAction
    | PassthroughAction
    | WaitAction
    | ConsoleLogAction
    | OpenLinkAction
    | TransformAction;

/**
 * A parallel group: an array of actions that execute simultaneously.
 * Represented as a nested array inside a pipeline.
 * Example pipeline: [actionA, [parallelB, parallelC], actionD]
 */
export type ParallelGroup = Action[];

/** A single step inside an action pipeline — either one action or a parallel group */
export type PipelineStep = Action | ParallelGroup;

// ─── Compilation model ────────────────────────────────────────────────────────

export interface CompilationOptions {
    stacking: string;
    numberOfColumns: number;
    numberOfRows: { type: string; value: number };
    padding: { x: number; y: number };
    spacing: { x: number; y: number };
}

export interface Compilation {
    version: string;
    widgets: object[];
    options: CompilationOptions;
}

// ─── Widget models ────────────────────────────────────────────────────────────

export interface ButtonModel {
    type: "button";
    name: string;
    captionBar: false;
    description: string;
    label: string;
    id: string;
    disabled: boolean;
    /** onClick is a flat pipeline of actions (or nested arrays for parallel steps) */
    actions: { onClick: PipelineStep[] };
    options: { style: Partial<StyleProps> };
    toolbars: never[];
    layout?: Position;
}

export interface TextCaptionBar {
    hidden: boolean;
    title: string;
}

export interface TextModel {
    type: "text";
    name: string;
    description: string;
    text: string;
    captionBar: TextCaptionBar | false;
    options: { style: Partial<StyleProps> };
    id: string;
    layout?: Position;
}

// ─── Container widget model ───────────────────────────────────────────────────
// A container embeds another compilation (the result of a nested layout).

export interface ContainerModel {
    type: "container";
    name: string;
    description: string;
    id: string;
    compilation: object;
    options: {
        spacing: { x: number; y: number };
    };
    layout?: Position;
}

// ─── Tab / Tabs widget models ─────────────────────────────────────────────────

export interface TabIndicatorStyle {
    fontSize?: string;
    justifyContent?: string;
    padding?: string;
}

export interface TabModel {
    id: string;
    name: string;
    compilation: object;
    indicator?: {
        icon?: object;
    };
}

export interface TabsModel {
    type: "tabs";
    name: string;
    description: string;
    id: string;
    captionBar: boolean;
    options: {
        indicator: {
            style: Partial<TabIndicatorStyle>;
        };
        tabAlignment: "left" | "center" | "right";
    };
    tabs: TabModel[];
    layout?: Position;
}
