// Core type definitions for the WebStudio builder.
// Action model reference: https://docs.inmation.com/webapps/1.108/webstudio/ReferenceDocs/actions/index.html

// ─── Style ────────────────────────────────────────────────────────────────────

export interface StyleProps {
    fontSize?: string;
    borderRadius?: string;
    backgroundColor?: string;
    backgroundImage?: string;
    backgroundSize?: string;
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
    static?: boolean;
}

// ─── Action types (re-exported from action-types.ts) ──────────────────────────

import type { ActionPipeline, ActionSequence } from "./action-types";

export {
    ActionMessage,
    WidgetTarget,
    ActionAssignment,
    ActionPipeline,
    ActionSequence,
    ActionCatch,
    NamedAction,
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
    NotifyAction,
    OpenFileAction,
    OpenLinkAction,
    PassthroughAction,
    PromptAction,
    ReadAction,
    ReadHistoricalDataAction,
    ReadModelAction,
    ReadRawHistoricalDataAction,
    ReadWriteAction,
    RefreshAction,
    SaveFileAction,
    ScreenCaptureAction,
    SendAction,
    SetActiveDiagramsPageAction,
    SubscribeAction,
    SwitchAction,
    TransformAction,
    WaitAction,
    WriteAction,
    Action,
    ParallelGroup,
    PipelineStep,
} from "./action-types";

// ─── Compilation model ────────────────────────────────────────────────────────

export interface CompilationInfo {
    title?: string;
    favicon?: string;
}

export interface CompilationBackground {
    style?: Partial<StyleProps>;
}

export interface CompilationNumberOfRows {
    type: string;
    value: number;
}

export interface CompilationOptions {
    stacking: "none" | "vertical" | "horizontal" | string;
    numberOfColumns: number;
    numberOfRows: CompilationNumberOfRows;
    padding: { x: number; y: number };
    spacing: { x: number; y: number };
    showDevTools?: boolean;
    background?: CompilationBackground;
    theme?: "light" | "dark" | string;
    width?: number;
    style?: Partial<StyleProps>;
    styleByTheme?: Record<string, Partial<StyleProps>>;
}

export interface CompilationOptionsInput extends Partial<Omit<CompilationOptions, "numberOfRows">> {
    numberOfRows?: number | Partial<CompilationNumberOfRows>;
}

export interface AppBarDefaultConfig {
    hidden?: boolean;
}

export interface AppBarSectionConfig {
    default?: AppBarDefaultConfig;
    toolsOrder?: string[];
    [key: string]: unknown;
}

export interface AppBarToolGroup {
    disabled?: boolean;
    hidden?: boolean;
    toolsOrder?: string[];
    [key: string]: unknown;
}

export interface AppBarConfig {
    tools?: Record<string, Record<string, unknown>>;
    toolGroups?: Record<string, AppBarToolGroup>;
    left?: AppBarSectionConfig;
    center?: AppBarSectionConfig;
    right?: AppBarSectionConfig;
    default?: AppBarDefaultConfig;
    style?: Record<string, unknown>;
    styleByTheme?: Record<string, Record<string, unknown>>;
    [key: string]: unknown;
}

export interface CompilationRootOnly {
    appBar?: AppBarConfig;
    [key: string]: unknown;
}

export type WidgetActions = Partial<Record<string, ActionSequence>>;

export interface Compilation {
    version: string;
    name?: string;
    info?: CompilationInfo;
    rootOnly?: CompilationRootOnly;
    widgets: object[];
    options: CompilationOptions;
    actions?: WidgetActions;
}

// ─── Widget models ────────────────────────────────────────────────────────────

export type ButtonActionHook = "onClick";
export type ButtonActions = Partial<Record<ButtonActionHook, ActionPipeline>> & WidgetActions;

export interface ButtonModel {
    type: "button";
    name: string;
    captionBar: false;
    description: string;
    label: string;
    id: string;
    disabled: boolean;
    /** onClick is a flat pipeline of actions (or nested arrays for parallel steps) */
    actions: ButtonActions;
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
    actions?: WidgetActions;
    layout?: Position;
}

export interface ImageOptions {
    size?: "contain" | "cover" | "fill" | "none" | "scale-down" | string;
    style?: Partial<StyleProps>;
}

export interface ImageModel {
    type: "image";
    name: string;
    description: string;
    actions: Record<string, unknown>;
    base64: string;
    dataSource: Record<string, unknown>;
    mimeType: string;
    options: ImageOptions;
    toolbars: Record<string, unknown>;
    tooltip: Record<string, unknown>;
    url: string;
    id: string;
    layout?: Position;
}

export interface PlotlyWidgetOptions {
    refreshInterval?: string | number;
    style?: Partial<StyleProps>;
    styleByTheme?: Record<string, Partial<StyleProps>>;
    [key: string]: unknown;
}

export interface PlotlyModel {
    type: "plotly";
    name: string;
    description: string;
    id: string;
    actions?: WidgetActions;
    captionBar?: boolean | TextCaptionBar | Record<string, unknown>;
    dataSource?: Record<string, unknown> | Array<Record<string, unknown>>;
    data?: unknown[];
    options?: PlotlyWidgetOptions;
    plotlyOptions?: Record<string, unknown>;
    toolbars?: Record<string, unknown>;
    dragSource?: Record<string, unknown>;
    dropTarget?: Record<string, unknown>;
    layout?: Position;
}

export interface IFrameOptions {
    allowFullScreen?: boolean;
    style?: Partial<StyleProps>;
    styleByTheme?: Record<string, Partial<StyleProps>>;
    [key: string]: unknown;
}

export interface IFrameModel {
    type: "iframe";
    name: string;
    description: string;
    id: string;
    actions: WidgetActions;
    dataSource: Record<string, unknown>;
    iframeOptions: IFrameOptions;
    toolbars: Record<string, unknown>;
    url: string;
    layout?: Position;
}

export interface FaceplateModel {
    type: "faceplate";
    name: string;
    description: string;
    actions: Record<string, unknown>;
    captionBar?: boolean | TextCaptionBar | Record<string, unknown>;
    dataSource: Record<string, unknown>;
    path: string;
    toolbars: Record<string, unknown>;
    dragSource?: Record<string, unknown>;
    dropTarget?: Record<string, unknown>;
    id: string;
    layout?: Position;
}

export interface MarkdownViewerOptions {
    linkTarget?: "_blank" | "_parent" | "_self" | "_top";
    refreshInterval?: string | number;
    style?: Partial<StyleProps>;
    styleByTheme?: Record<string, Partial<StyleProps>>;
    [key: string]: unknown;
}

export interface MarkdownViewerModel {
    type: "markdownviewer";
    name: string;
    description: string;
    id: string;
    actions: WidgetActions;
    content: string;
    dataSource: Record<string, unknown>;
    markdownOptions: Record<string, unknown>;
    mermaidOptions: Record<string, unknown>;
    options: MarkdownViewerOptions;
    toolbars: Record<string, unknown>;
    layout?: Position;
}

export interface EditorOptions {
    showLanguageSelection?: boolean;
    showStatusBar?: boolean;
    showToolbar?: boolean;
    refreshInterval?: string | number;
    style?: Partial<StyleProps>;
    styleByTheme?: Record<string, Partial<StyleProps>>;
    [key: string]: unknown;
}

export type EditorActionHook = "onContentChange";
export type EditorActions = Partial<Record<EditorActionHook, ActionPipeline>> & WidgetActions;

export interface EditorModel {
    type: "editor";
    name: string;
    description: string;
    id: string;
    actions: EditorActions;
    content: unknown;
    contentToCompare?: unknown;
    dataSource: Record<string, unknown>;
    editorOptions: Record<string, unknown>;
    language: "json" | "lua" | "markdown" | "txt" | "xml" | string;
    schema: Record<string, unknown>;
    options: EditorOptions;
    toolbars: Record<string, unknown>;
    layout?: Position;
}

export type TableRow = Record<string, unknown>;
export type TableThemeStyles = Record<string, Partial<StyleProps>>;

export interface FormEntryItem {
    label?: string;
    value?: unknown;
    color?: string;
    disabled?: boolean;
    [key: string]: unknown;
}

export interface FormEntry {
    type: "buttons" | "date" | "input" | "select" | string;
    id?: string;
    description?: string;
    label?: string;
    value?: unknown;
    disabled?: boolean;
    readonly?: boolean;
    uom?: string;
    items?: Array<FormEntryItem | string | number | boolean>;
    multi?: boolean;
    free?: boolean;
    format?: string;
    convertRelativeDate?: boolean | { type?: string };
    timeIntervals?: number;
    style?: Partial<StyleProps>;
    styleByTheme?: TableThemeStyles;
    [key: string]: unknown;
}

export interface FormOptions {
    showRefreshButton?: boolean;
    showToolbar?: boolean;
    refreshInterval?: number;
    style?: Partial<StyleProps>;
    styleByTheme?: TableThemeStyles;
    submitButton?: { label?: string };
    [key: string]: unknown;
}

export type FormActionHook = "onSubmit";
export type FormActions = Partial<Record<FormActionHook, ActionPipeline>> & WidgetActions;

export interface FormModel {
    type: "form";
    name: string;
    description: string;
    id: string;
    captionBar: TextCaptionBar | false;
    actions?: FormActions;
    dataSource?: Record<string, unknown>;
    entries: FormEntry[];
    options?: FormOptions;
    toolbars?: Record<string, unknown>;
    layout?: Position;
}

export interface TableRule {
    name?: string;
    type?: "equal" | "match" | "isNull" | "isUndefined" | "range" | string;
    value?: unknown;
    range?: { from?: number; to?: number };
    match?: string;
    style?: Partial<StyleProps>;
    styleByTheme?: TableThemeStyles;
    [key: string]: unknown;
}

export interface TableSchemaColumn {
    id?: string;
    name?: string;
    title?: string;
    type?: "string" | "number" | "boolean" | "date" | string;
    editable?: boolean;
    hidden?: boolean;
    width?: string;
    value?: unknown;
    format?: string;
    sort?: "asc" | "desc" | "none";
    filter?: string | { type?: string; defaultMode?: string };
    numberOfDecimals?: number;
    enum?: Record<string, unknown>;
    enumMode?: "valueToName" | "nameToValue";
    items?: unknown[];
    tooltip?: string | Record<string, unknown>;
    style?: Partial<StyleProps>;
    styleByTheme?: TableThemeStyles;
    header?: {
        style?: Partial<StyleProps>;
        styleByTheme?: TableThemeStyles;
    };
    rules?: TableRule[];
    columns?: TableSchemaColumn[];
    actions?: {
        onClick?: ActionPipeline;
    };
    isExpander?: boolean;
    collapsedIcon?: string;
    expandedIcon?: string;
    [key: string]: unknown;
}

export interface TableOptions {
    allowSorting?: boolean;
    alternateColumnColoring?: boolean;
    alternateRowColoring?: boolean;
    editable?: boolean;
    header?: {
        style?: Partial<StyleProps>;
        styleByTheme?: TableThemeStyles;
    };
    multi?: boolean;
    multiMin?: number;
    multiMax?: number;
    pageSize?: number;
    pagination?: boolean;
    refreshInterval?: number;
    rules?: TableRule[];
    showHoverHighLight?: boolean;
    showRefreshButton?: boolean;
    showSelectedRow?: boolean;
    showToolbar?: boolean;
    showRowNumbers?: boolean;
    style?: Partial<StyleProps>;
    styleByTheme?: TableThemeStyles;
    submitButton?: { label?: string };
    [key: string]: unknown;
}

export interface TableState {
    selectedRowIndex?: number[];
    showColumnFilters?: boolean;
    showGlobalSearch?: boolean;
    filters?: Array<{
        name?: string;
        value?: unknown;
        mode?: string;
        type?: string;
    }>;
    search?: { value?: string };
    sorting?: Array<{ name: string; desc?: boolean }>;
    useSchemaFromDataSource?: boolean;
    [key: string]: unknown;
}

export type TableActionHook = "onSave" | "onSelect" | "onSelectionChanged" | "onSubmit";
export type TableActions = Partial<Record<TableActionHook, ActionPipeline>> & WidgetActions;

export interface TableModel {
    type: "table";
    name: string;
    description: string;
    id: string;
    captionBar: TextCaptionBar | false;
    data?: TableRow[] | Record<string, unknown>;
    dataSource?: Record<string, unknown>;
    options?: TableOptions;
    schema?: TableSchemaColumn[];
    state?: TableState;
    actions?: TableActions;
    toolbars?: Record<string, unknown>;
    layout?: Position;
}

export interface TreeRule {
    match?: unknown;
    actions?: {
        onClick?: ActionPipeline;
        [key: string]: unknown;
    };
    icons?: Array<string | Record<string, unknown>>;
    style?: Partial<StyleProps>;
    styleByTheme?: TableThemeStyles;
    tooltip?: string | Record<string, unknown>;
    dragSource?: Record<string, unknown>;
    dropTarget?: Record<string, unknown>;
    [key: string]: unknown;
}

export interface TreeNode {
    id?: string;
    name?: string;
    title?: string;
    text?: string;
    value?: unknown;
    path?: string;
    icon?: string | Record<string, unknown>;
    tooltip?: string | Record<string, unknown>;
    data?: Record<string, unknown>;
    children?: TreeNode[];
    actions?: {
        onClick?: ActionPipeline;
        [key: string]: unknown;
    };
    style?: Partial<StyleProps>;
    styleByTheme?: TableThemeStyles;
    [key: string]: unknown;
}

export interface TreeSchema {
    idField?: string;
    labelField?: string;
    childrenField?: string;
    iconField?: string;
    tooltipField?: string;
    actions?: Record<string, ActionSequence>;
    rules?: TreeRule[];
    style?: Partial<StyleProps>;
    styleByTheme?: TableThemeStyles;
    [key: string]: unknown;
}

export interface TreeOptions {
    allowSearch?: boolean;
    collapseOnSearchSelection?: boolean;
    showRefreshButton?: boolean;
    showToolbar?: boolean;
    refreshInterval?: string | number;
    style?: Partial<StyleProps>;
    styleByTheme?: TableThemeStyles;
    rules?: TreeRule[];
    [key: string]: unknown;
}

export interface TreeState {
    expandedNodes?: string[];
    selectedNodeId?: string;
    selectedNodeIds?: string[];
    search?: { value?: string };
    [key: string]: unknown;
}

export interface TreeSearchTable {
    actions?: WidgetActions;
    captionBar?: TextCaptionBar | false | Record<string, unknown>;
    data?: TableRow[] | Record<string, unknown> | string;
    options?: TableOptions;
    schema?: TableSchemaColumn[];
    state?: TreeState;
    toolbars?: Record<string, unknown>;
    [key: string]: unknown;
}

export type TreeActionHook = "onClick" | "onSelect" | "onSelectionChanged";
export type TreeActions = Partial<Record<TreeActionHook, ActionPipeline>> & WidgetActions;

export interface TreeModel {
    type: "tree";
    name: string;
    description: string;
    id: string;
    actions?: TreeActions;
    data?: TreeNode[];
    dataSource?: Record<string, unknown>;
    schema?: TreeSchema;
    schemaExtension?: TreeSchema;
    searchTable?: TreeSearchTable;
    options?: TreeOptions;
    state?: TreeState;
    toolbars?: Record<string, unknown>;
    dragSource?: Record<string, unknown>;
    dropTarget?: Record<string, unknown>;
    layout?: Position;
}

export interface ChartVisualStyle {
    color?: string;
    opacity?: number | string;
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    font?: string;
    [key: string]: unknown;
}

export interface ChartModelRootEntry {
    path: string;
    includeRoot?: boolean;
    depth?: number;
}

export type ChartModelRoot = ChartModelRootEntry | ChartModelRootEntry[];

export interface ChartAxisPosition {
    alignment?: "bottom" | "top" | "left" | "right" | string;
    orientation?: "bottom" | "top" | "left" | "right" | string;
    start?: number;
    end?: number;
    value?: number;
}

export interface ChartTicks {
    count?: number;
    format?: string;
    [key: string]: unknown;
}

export interface ChartCursor {
    timestamp: string | number;
    context?: unknown;
    id?: number;
    locked?: boolean;
}

export interface ChartXAxis {
    id?: number;
    name?: string;
    description?: string;
    start_time?: string | number;
    end_time?: string | number;
    intervals_no?: number;
    position?: ChartAxisPosition;
    themes?: Record<string, ChartVisualStyle>;
    locked?: boolean;
    grid?: boolean;
    ticks?: ChartTicks;
    [key: string]: unknown;
}

export interface ChartYAxisRangeBound {
    mode?: "auto" | "auto-grow" | "auto-shrink" | "fixed" | string;
    value?: number;
}

export interface ChartYAxisRange {
    max?: ChartYAxisRangeBound;
    min?: ChartYAxisRangeBound;
}

export interface ChartYAxis {
    id?: number;
    name?: string;
    description?: string;
    position?: ChartAxisPosition;
    intervals_no?: number;
    range?: ChartYAxisRange;
    themes?: Record<string, ChartVisualStyle>;
    locked?: boolean;
    grid?: boolean;
    ticks?: ChartTicks;
    [key: string]: unknown;
}

export interface ChartPenStyle {
    line?: "SOLID" | "DASH1" | "DASH2" | "DASH3" | string;
    marker?: string;
    thickness?: string;
    [key: string]: unknown;
}

export interface ChartPen {
    id?: number;
    name?: string;
    path: string;
    DecimalPlaces?: number;
    OpcEngUnit?: string;
    trend_type?: string;
    aggregate?: string;
    style?: ChartPenStyle;
    themes?: Record<string, ChartVisualStyle>;
    x_axis?: number[];
    y_axis?: number[];
    draw?: boolean;
    [key: string]: unknown;
}

export interface ChartTrendModel {
    class?: "Trend" | string;
    name?: string;
    description?: string;
    cursors?: ChartCursor[];
    x_axis?: ChartXAxis[];
    y_axis?: ChartYAxis[];
    pens?: ChartPen[];
    [key: string]: unknown;
}

export interface ChartLegend {
    timePeriodAggregates?: Array<string | [string, string]>;
    [key: string]: unknown;
}

export interface ChartCleanupOptions {
    xAxisOnPenDeletion?: boolean;
    yAxisOnPenDeletion?: boolean;
}

export interface ChartOptions {
    actualValues?: boolean;
    cleanup?: ChartCleanupOptions;
    collapseXAxis?: boolean;
    crosshairMode?: "noHoverLabels" | "rangeHoverLabels" | "traceHoverLabels" | "traceRangeHoverLabels" | string;
    groupXAxis?: boolean;
    leftPanel?: boolean;
    rightPanel?: boolean;
    bottomPanel?: boolean;
    play?: "none" | "live" | "refresh" | string;
    relativeXAxis?: boolean;
    showToolbar?: boolean;
    style?: Partial<StyleProps>;
    styleByTheme?: TableThemeStyles;
    [key: string]: unknown;
}

export interface ChartRangeFieldMap {
    starttime?: string;
    endtime?: string;
    label?: string;
    labelStart?: string;
    labelEnd?: string;
    [key: string]: unknown;
}

export interface ChartRangeLabel {
    text?: string;
    style?: ChartVisualStyle;
    styleByTheme?: Record<string, ChartVisualStyle>;
}

export interface ChartRangeRule {
    match?: unknown;
    borders?: {
        style?: ChartVisualStyle;
        styleByTheme?: Record<string, ChartVisualStyle>;
    };
    draw?: boolean;
    fields?: ChartRangeFieldMap;
    hoverLabelEnd?: ChartRangeLabel;
    hoverLabelStart?: ChartRangeLabel;
    label?: ChartRangeLabel;
    position?: { start?: number; end?: number };
    style?: ChartVisualStyle;
    styleByTheme?: Record<string, ChartVisualStyle>;
    x_axis?: number[];
    y_axis?: number[];
    [key: string]: unknown;
}

export interface ChartRangeSchema {
    borders?: {
        style?: ChartVisualStyle;
        styleByTheme?: Record<string, ChartVisualStyle>;
    };
    draw?: boolean;
    fields?: ChartRangeFieldMap;
    hoverLabelEnd?: ChartRangeLabel;
    hoverLabelStart?: ChartRangeLabel;
    label?: ChartRangeLabel;
    position?: { start?: number; end?: number };
    rules?: ChartRangeRule[];
    style?: ChartVisualStyle;
    styleByTheme?: Record<string, ChartVisualStyle>;
    x_axis?: number[];
    y_axis?: number[];
    [key: string]: unknown;
}

export interface ChartRangeGroup {
    dataSource?: Record<string, unknown> | ActionSequence;
    schema?: ChartRangeSchema;
}

export interface ChartRanges {
    groups?: ChartRangeGroup[];
}

export interface ChartInspectorPanel {
    toolbars?: Record<string, unknown>;
    [key: string]: unknown;
}

export interface ChartInspector {
    showCrosshairPanel?: boolean;
    showCursorsPanel?: boolean;
    showModifiedDataPanel?: boolean;
    showPropertiesPanel?: boolean;
    pens?: ChartInspectorPanel;
    x_axis?: ChartInspectorPanel;
    y_axis?: ChartInspectorPanel;
    [key: string]: unknown;
}

export interface ChartTagSearchTable {
    actions?: WidgetActions;
    captionBar?: TextCaptionBar | false | Record<string, unknown>;
    data?: TableRow[] | Record<string, unknown> | string;
    options?: TableOptions;
    schema?: TableSchemaColumn[];
    state?: TableState;
    toolbars?: Record<string, unknown>;
    [key: string]: unknown;
}

export type ChartActionHook = "onDataPointClick" | "onNewChart";
export type ChartActions = Partial<Record<ChartActionHook, ActionPipeline>> & WidgetActions;

export interface ChartModel {
    type: "chart";
    name: string;
    description: string;
    id: string;
    actions?: ChartActions;
    captionBar?: boolean | TextCaptionBar | Record<string, unknown>;
    chart?: ChartTrendModel;
    dataSource?: Record<string, unknown> | ActionSequence;
    inspector?: ChartInspector;
    legend?: ChartLegend;
    modelRoot?: ChartModelRoot;
    options?: ChartOptions;
    ranges?: ChartRanges;
    tagSearchTable?: ChartTagSearchTable;
    toolbars?: Record<string, unknown>;
    dragSource?: Record<string, unknown>;
    dropTarget?: Record<string, unknown>;
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
        style?: Partial<StyleProps>;
        styleByTheme?: Record<string, Partial<StyleProps>>;
    };
    actions?: WidgetActions;
    layout?: Position;
    captionBar: boolean;
}

// ─── Tab / Tabs widget models ─────────────────────────────────────────────────

export interface TabIndicatorStyle extends Partial<StyleProps> {
    justifyContent?: string;
}

export interface TabIndicatorModel {
    title?: {
        text?: string;
        style?: Partial<StyleProps>;
        styleByTheme?: Record<string, Partial<StyleProps>>;
    };
    tooltip?: string;
    icon?: Record<string, unknown>;
    style?: Partial<StyleProps>;
    selector?: {
        line?: {
            color?: string;
            alignment?: "top" | "bottom" | "left" | "right";
            hidden?: boolean;
        };
        style?: Partial<StyleProps>;
        styleByTheme?: Record<string, Partial<StyleProps>>;
    };
    closeButton?: {
        enable?: boolean;
    };
}

export interface TabModel {
    id: string;
    name: string;
    compilation: object;
    actions?: WidgetActions;
    dataSource?: Record<string, unknown>;
    indicator?: TabIndicatorModel;
}

export interface TabsModel {
    type: "tabs";
    name: string;
    description: string;
    id: string;
    captionBar: boolean;
    appearance?: {
        type?: "docked" | "floating" | string;
        onScroll?: "dismiss" | "prevent" | string;
    };
    options: {
        showTabBar?: boolean;
        indicator?: {
            style?: Partial<TabIndicatorStyle>;
            styleByTheme?: Record<string, Partial<StyleProps>>;
            selector?: {
                line?: {
                    color?: string;
                    alignment?: "top" | "bottom" | "left" | "right";
                    hidden?: boolean;
                };
                style?: Partial<StyleProps>;
                styleByTheme?: Record<string, Partial<StyleProps>>;
            };
            closeButton?: { enable?: boolean };
        };
        tabBar?: {
            style?: Partial<StyleProps>;
            styleByTheme?: Record<string, Partial<StyleProps>>;
        };
        tabAlignment: "top" | "bottom" | "left" | "right";
    };
    tabs: TabModel[];
    toolbars?: Record<string, unknown>;
    actions?: WidgetActions;
    layout?: Position;
}

// ─── Container widget model ───────────────────────────────────────────────────
// Note: ContainerModel is already defined above (~line 1130).

// ─── Diagrams widget models ───────────────────────────────────────────────────

export interface DiagramsAnimationProperty<T> {
    value?: T;
    path?: string;
}

export interface DiagramsAnimationRule {
    type: "equal" | "range" | "match" | "isNull" | "isUndefined";
    name?: string;
    value?: unknown;
    range?: { from?: number | string; to?: number | string };
    match?: Record<string, unknown>;
    [key: string]: unknown;
}

export interface DiagramsAnimation {
    type: "fill" | "stroke" | "blink" | "rotate" | "flow" | "level" | "displayText";
    color?: DiagramsAnimationProperty<string>;
    fill?: DiagramsAnimationProperty<string>;
    rules?: DiagramsAnimationRule[];
    [key: string]: unknown;
}

export interface DiagramsShapeModel {
    type: "shape" | "group";
    name?: string;
    dataSource?: Record<string, unknown>;
    animations?: DiagramsAnimation[];
    actions?: Record<string, unknown>;
}

export interface DiagramsPageModel {
    id: string;
    name?: string;
    pageData?: string;
    items?: Record<string, DiagramsShapeModel>;
}

export interface DiagramsOptions {
    enableCssDarkMode?: boolean;
    defaultFonts?: string[];
    customFonts?: string[];
    presetColors?: string[];
    customPresetColors?: string[];
    defaultColors?: string[];
    defaultLibraries?: string;
    enabledLibraries?: string[];
    showRemoteCursors?: boolean;
    restrictExport?: boolean;
    lockdown?: boolean;
    compressXml?: boolean;
    css?: string;
    fontCss?: string;
    globalVars?: Record<string, unknown>;
    [key: string]: unknown;
}

export interface DiagramsModel {
    type: "diagrams";
    name: string;
    description: string;
    id: string;
    actions?: WidgetActions;
    captionBar?: boolean | TextCaptionBar | Record<string, unknown>;
    dataSource?: Record<string, unknown>;
    dragSource?: Record<string, unknown>;
    dropTarget?: Record<string, unknown>;
    layout?: Position;
    toolbars?: Record<string, unknown>;
    options?: { style?: Partial<StyleProps>; styleByTheme?: Record<string, Partial<StyleProps>>; [key: string]: unknown };
    pages?: DiagramsPageModel[];
    diagramsData?: string;
    diagramsTheme?: "dark" | "kennedy" | string;
    diagramsOptions?: DiagramsOptions;
    state?: { activePageId?: string };
}

// ─── Advanced Form widget model ───────────────────────────────────────────────

export interface AdvancedFormSchemaProperty {
    type?: string | string[];
    title?: string;
    description?: string;
    default?: unknown;
    enum?: unknown[];
    enumNames?: string[];
    format?: string;
    minimum?: number;
    maximum?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    items?: Record<string, unknown>;
    properties?: Record<string, AdvancedFormSchemaProperty>;
    required?: string[];
    readOnly?: boolean;
    [key: string]: unknown;
}

export interface AdvancedFormSchema {
    type: "object";
    title?: string;
    description?: string;
    required?: string[];
    properties: Record<string, AdvancedFormSchemaProperty>;
    dependencies?: Record<string, Record<string, unknown>>;
    definitions?: Record<string, Record<string, unknown>>;
    readOnly?: boolean;
}

export interface AdvancedFormUISchema {
    "ui:order"?: string[];
    [key: string]: unknown;
}

export type AdvancedFormActionHook =
    | "onChange" | "onFocus" | "onBlur" | "onChanged"
    | "onValidationError" | "onSubmit" | "onValidate";

export type AdvancedFormActions = Partial<Record<AdvancedFormActionHook, ActionPipeline>> & WidgetActions;

export interface AdvancedFormOptions {
    style?: Partial<StyleProps>;
    styleByTheme?: Record<string, Partial<StyleProps>>;
    refreshInterval?: number;
    showToolbar?: boolean;
    showRefreshButton?: boolean;
    submitButton?: { label?: string };
    [key: string]: unknown;
}

export interface AdvancedFormModel {
    type: "advancedform";
    name: string;
    description: string;
    id: string;
    actions?: AdvancedFormActions;
    captionBar?: boolean | TextCaptionBar | Record<string, unknown>;
    dataSource?: Record<string, unknown>;
    dragSource?: Record<string, unknown>;
    dropTarget?: Record<string, unknown>;
    layout?: Position;
    toolbars?: Record<string, unknown>;
    options?: AdvancedFormOptions;
    schema: AdvancedFormSchema;
    uiSchema?: AdvancedFormUISchema;
    data?: Record<string, unknown>;
    formOptions?: {
        entryOptions?: Record<string, Record<string, unknown>>;
        styleByClassName?: Record<string, Partial<StyleProps>>;
        showValidationErrors?: boolean;
        liveOmit?: boolean;
        liveValidate?: boolean;
        readOnly?: boolean;
        [key: string]: unknown;
    };
}

// ─── Event Table widget model ─────────────────────────────────────────────────

export interface EventTableModel {
    type: "eventtable";
    name: string;
    description: string;
    id: string;
    actions?: WidgetActions;
    captionBar?: boolean | TextCaptionBar | Record<string, unknown>;
    dataSource?: Record<string, unknown>;
    dragSource?: Record<string, unknown>;
    dropTarget?: Record<string, unknown>;
    layout?: Position;
    toolbars?: Record<string, unknown>;
    options?: { style?: Partial<StyleProps>; styleByTheme?: Record<string, Partial<StyleProps>>; [key: string]: unknown };
    data?: unknown[];
    starttime?: string | number;
    endtime?: string | number;
    maxDuration?: string;
    table?: Record<string, unknown>;
}

// ─── Time Period Table widget model ───────────────────────────────────────────

export interface TimePeriodTableModel {
    type: "timeperiodtable";
    name: string;
    description: string;
    id: string;
    actions?: WidgetActions;
    captionBar?: boolean | TextCaptionBar | Record<string, unknown>;
    dataSource?: Record<string, unknown>;
    dragSource?: Record<string, unknown>;
    dropTarget?: Record<string, unknown>;
    layout?: Position;
    toolbars?: Record<string, unknown>;
    options?: { style?: Partial<StyleProps>; styleByTheme?: Record<string, Partial<StyleProps>>; [key: string]: unknown };
    data?: unknown[];
    starttime?: string | number;
    endtime?: string | number;
    maxDuration?: string;
    table?: Record<string, unknown>;
}

// ─── Video widget model ───────────────────────────────────────────────────────

export interface VideoOptions {
    autoplay?: boolean;
    controls?: boolean;
    loop?: boolean;
    muted?: boolean;
    style?: Partial<StyleProps>;
    styleByTheme?: Record<string, Partial<StyleProps>>;
    [key: string]: unknown;
}

export interface VideoModel {
    type: "video";
    name: string;
    description: string;
    id: string;
    actions?: WidgetActions;
    captionBar?: boolean | TextCaptionBar | Record<string, unknown>;
    dataSource?: Record<string, unknown>;
    dragSource?: Record<string, unknown>;
    dropTarget?: Record<string, unknown>;
    layout?: Position;
    toolbars?: Record<string, unknown>;
    options?: { style?: Partial<StyleProps>; styleByTheme?: Record<string, Partial<StyleProps>>; [key: string]: unknown };
    url: string;
    mimeType: string;
    videoOptions: VideoOptions;
}

// ─── Model Tree widget model ──────────────────────────────────────────────────

export interface ModelTreeModel {
    type: "modeltree";
    name: string;
    description: string;
    id: string;
    actions?: WidgetActions;
    captionBar?: boolean | TextCaptionBar | Record<string, unknown>;
    dataSource?: Record<string, unknown>;
    dragSource?: Record<string, unknown>;
    dropTarget?: Record<string, unknown>;
    layout?: Position;
    toolbars?: Record<string, unknown>;
    options?: { style?: Partial<StyleProps>; styleByTheme?: Record<string, Partial<StyleProps>>; [key: string]: unknown };
    modelRoot?: string | Record<string, unknown>;
    schemaExtension?: Record<string, unknown>;
    searchTable?: Record<string, unknown>;
}

// ─── Report Viewer widget model ───────────────────────────────────────────────

export interface ReportViewerModel {
    type: "reportviewer";
    name: string;
    description: string;
    id: string;
    actions?: WidgetActions;
    captionBar?: boolean | TextCaptionBar | Record<string, unknown>;
    dataSource?: Record<string, unknown>;
    dragSource?: Record<string, unknown>;
    dropTarget?: Record<string, unknown>;
    layout?: Position;
    toolbars?: Record<string, unknown>;
    options?: { style?: Partial<StyleProps>; styleByTheme?: Record<string, Partial<StyleProps>>; [key: string]: unknown };
    viewerOptions?: Record<string, unknown>;
    reportData?: unknown;
    designs?: unknown[];
}
