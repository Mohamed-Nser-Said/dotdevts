import { ContainerModel } from "../core/types";
import { IWidget } from "../interfaces/IWidget";



export interface WebStudioCompilation {
  /** Must be "1" for current WebStudio model version */
  version: "1";

  /** Global actions that can be referenced by widgets */
  actions?: Record<string, WebStudioAction>;

  /** App-level metadata (title, favicon, etc.) */
  info?: WebStudioInfo;

  /** Configuration that only applies to the root app */
  rootOnly?: WebStudioRootOnly;

  /** List of all widgets in the dashboard */
  widgets: (WebStudioWidget | ContainerModel)[];

  /** Global layout and behavior options */
  options?: WebStudioCompilationOptions;

  /** Optional name for the compilation (for debugging) */
  name?: string;
}

export interface WebStudioInfo {
  /** Application title (shown in browser/tab) */
  title?: string;

  /** Favicon (usually base64 or URL) */
  favicon?: string;
}

export interface WebStudioRootOnly {
  /** Top application toolbar (app bar) */
  appBar?: WebStudioToolbarHost;
}

export interface WebStudioCompilationOptions {
  /** Background configuration (color/image) */
  background?: WebStudioBackground;

  /** Number of columns in grid layout */
  numberOfColumns?: number;

  /**
   * Number of rows:
   * - "auto" → auto height
   * - number → fixed rows (legacy)
   * - object → advanced config
   */
  numberOfRows?: "auto" | number | WebStudioNumberOfRows;

  /** Widget stacking behavior */
  stacking?: "none" | "vertical" | "horizontal";

  /** Show developer tools in UI */
  showDevTools?: boolean;

  /** Padding inside container */
  padding?: WebStudioAxisSpacing;

  /** Space between widgets */
  spacing?: WebStudioAxisSpacing;

  /** UI theme */
  theme?: "light" | "dark";
}

export interface WebStudioNumberOfRows {
  /**
   * Layout strategy:
   * - "height" → based on pixel height
   * - "count" → fixed number of rows
   * - "square" → square grid
   */
  type: "height" | "count" | "square";

  /** Value depending on type (e.g. height or row count) */
  value?: number;
}

export interface WebStudioAxisSpacing {
  /** Horizontal spacing */
  x?: number;

  /** Vertical spacing */
  y?: number;
}

export interface WebStudioBackground {
  /** Background image URL or base64 */
  image?: string;

  /** CSS background-size */
  size?: string;

  /** CSS background-position */
  position?: string;

  /** CSS background-repeat */
  repeat?: string;

  /** Background color */
  backgroundColor?: string;

  /** Allow extra CSS-like properties */
  [key: string]: unknown;
}

export interface WebStudioWidget {
  /** Widget type (e.g. "text", "table", "chart") */
  type: string;

  /** Unique widget ID */
  id?: string;

  /** Display name (optional) */
  name?: string;

  /** Actions scoped to this widget */
  actions?: Record<string, WebStudioAction>;

  /** Caption bar config or toggle */
  captionBar?: boolean | WebStudioCaptionBar;

  /** Data source definition */
  dataSource?: Record<string, unknown>;

  /** Drag behavior configuration */
  dragSource?: WebStudioDragSource;

  /** Drop behavior configuration */
  dropTarget?: WebStudioDropTarget;

  /** Grid layout position & size */
  layout?: WebStudioLayout;

  /** Widget-specific options */
  options?: WebStudioWidgetOptions;

  /** Toolbars attached to widget */
  toolbars?: WebStudioToolbars;

  /** Any widget-specific fields (text, columns, etc.) */
  [key: string]: unknown;
}

export interface WebStudioCaptionBar {
  /** Hide caption bar */
  hidden?: boolean;

  /** Title text */
  title?: string;

  /** Inline style */
  style?: WebStudioStyle;

  /** Theme-based style */
  styleByTheme?: WebStudioStyleByTheme;
}

export interface WebStudioLayout {
  /** X position in grid */
  x?: number;

  /** Y position in grid */
  y?: number;

  /** Width (columns) */
  w?: number;

  /** Height (rows) */
  h?: number;

  /** Minimum width */
  minW?: number;

  /** Maximum width */
  maxW?: number;

  /** Minimum height */
  minH?: number;

  /** Maximum height */
  maxH?: number;

  /** If true → widget cannot be moved/resized */
  static?: boolean;
}

export interface WebStudioWidgetOptions {
  /**
   * Auto-refresh interval in seconds
   * 0 = disabled
   */
  refreshInterval?: number;

  /** Inline style */
  style?: WebStudioStyle;

  /** Theme-based style */
  styleByTheme?: WebStudioStyleByTheme;

  /** Extra widget-specific options */
  [key: string]: unknown;
}

export interface WebStudioStyleByTheme {
  /** Light theme styles */
  light?: WebStudioStyle;

  /** Dark theme styles */
  dark?: WebStudioStyle;
}

export interface WebStudioStyle {
  /** CSS-like key-value pairs */
  [cssProperty: string]: string | number | undefined;
}

export interface WebStudioDragSource {
  /** Topic used for drag/drop communication */
  topic: string;

  /** Enable/disable drag */
  enabled?: boolean;

  /** Action triggered during drag */
  onDrag?: {
    action?: WebStudioAction;
  };

  /** Preview config while dragging */
  dragPreview?: Record<string, unknown>;
}

export interface WebStudioDropTarget {
  /** Topic to accept drops from */
  topic: string;

  /** Enable/disable drop */
  enabled?: boolean;

  /** Style when item can be dropped */
  canDrop?: {
    style?: WebStudioStyle;
    styleByTheme?: WebStudioStyleByTheme;
  };

  /** Style while hovering */
  hover?: {
    style?: WebStudioStyle;
    styleByTheme?: WebStudioStyleByTheme;
  };

  /** Action executed on drop */
  onDrop?: WebStudioAction;
}

export interface WebStudioToolbars {
  /** Left toolbar(s) */
  left?: WebStudioToolbar | WebStudioToolbar[];

  /** Top toolbar(s) */
  top?: WebStudioToolbar | WebStudioToolbar[];

  /** Right toolbar(s) */
  right?: WebStudioToolbar | WebStudioToolbar[];

  /** Bottom toolbar(s) */
  bottom?: WebStudioToolbar | WebStudioToolbar[];
}

export interface WebStudioToolbarHost extends WebStudioToolbar {
  /** Center tools (e.g. title area) */
  center?: string[];

  /** Default behavior */
  default?: {
    hidden?: boolean;
  };
}

export interface WebStudioToolbar {
  /** Hide toolbar */
  hidden?: boolean;

  /** Tools map (key → tool config) */
  tools?: Record<string, WebStudioTool>;

  /** Order of tools */
  toolsOrder?: string[];

  /** Left/top group ordering */
  leftOrTop?: {
    toolsOrder?: string[];
  };

  /** Center tools */
  center?: string[];

  /** Default tools visibility */
  defaultTools?: {
    hidden?: boolean;
  };

  /** Inline style */
  style?: WebStudioStyle;

  /** Theme-based style */
  styleByTheme?: WebStudioStyleByTheme;
}

export interface WebStudioTool {
  /** Tool type */
  type:
  | "button"
  | "chart-tool"
  | "checkbox"
  | "diagrams-tool"
  | "input"
  | "label"
  | "menu"
  | "selector"
  | "spacer"
  | "switch"
  | "table-tool";

  /** Sub-type for specialized tools */
  subType?: string;

  /** Title (string or styled object) */
  title?: string | {
    text?: string;
    style?: WebStudioStyle;
    styleByTheme?: WebStudioStyleByTheme;
  };

  /** Tooltip text */
  tooltip?: string;

  /** Icon configuration */
  icon?: WebStudioIcon;

  /** Hide tool */
  hidden?: boolean;

  /** Disable tool */
  disabled?: boolean;

  /** Tool actions (e.g. click) */
  actions?: {
    onClick?: WebStudioAction;
  };

  /** Drop support on tool */
  dropTarget?: Record<string, unknown>;

  /** Inline style */
  style?: WebStudioStyle;

  /** Theme-based style */
  styleByTheme?: WebStudioStyleByTheme;
}

export interface WebStudioIcon {
  /** Default icon */
  icon?: unknown;

  /** Dark theme icon */
  dark?: unknown;

  /** Light theme icon */
  light?: unknown;

  /** Icon alignment */
  alignment?: "leading" | "trailing";

  /** Inline style */
  style?: WebStudioStyle;

  /** Theme-based style */
  styleByTheme?: WebStudioStyleByTheme;
}

export interface WebStudioAction {
  /** Action type (e.g. navigation, script, etc.) */
  type?: string;

  /** More specific action subtype */
  subType?: string;

  /** Action-specific payload */
  [key: string]: unknown;
}




export class Compilation {
  public readonly version = "1";
  public widgets: (WebStudioWidget | ContainerModel)[] = [];
  public actions: Record<string, WebStudioAction> = {};
  public info?: WebStudioInfo;
  public rootOnly?: WebStudioRootOnly;
  public options: WebStudioCompilationOptions = {};

  constructor(
    public readonly name: string
  ) {

  }

  addWidget(widget: IWidget): this {
    this.widgets.push(widget.getModel());
    return this;
  }

  addWidgetMany(widgets: IWidget[]): this {
    widgets.forEach(widget => this.addWidget(widget));
    return this;
  }

  setLayout(options: WebStudioCompilationOptions): this {
    this.options = { ...(this.options || {}), ...options };
    return this;
  }

  public getModel(): WebStudioCompilation {
    return {
      version: this.version,
      widgets: this.widgets,
      actions: this.actions,
      info: this.info,
      rootOnly: this.rootOnly,
      options: this.options,
      name: this.name,
    };
  }

}