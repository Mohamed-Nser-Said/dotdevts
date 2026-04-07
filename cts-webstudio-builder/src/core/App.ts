import { Compilation, CompilationOptions } from "./types";
import { GridLayout, GridLayoutOptions } from "../layouts/GridLayout";
import { WidgetRegistry } from "../widgets/WidgetRegistry";

export interface AppConfig {
    layout?: GridLayout;
}

export interface WidgetPosition {
    col?: number;
    row?: number;
}

export interface WidgetConfig {
    widget: any;
    col?: number;
    row?: number;
    position?: WidgetPosition;
}

const DEFAULT_OPTIONS: CompilationOptions = {
    stacking: "none",
    numberOfColumns: 96,
    numberOfRows: { type: "count", value: 96 },
    padding: { x: 0, y: 0 },
    spacing: { x: 0, y: 0 },
};

export class App {
    widgets: any[];
    layout: GridLayout | undefined;
    registry: WidgetRegistry;
    compilation: Compilation;

    constructor(config?: AppConfig) {
        config = config || {};
        this.widgets = [];
        this.layout = config.layout;
        this.registry = new WidgetRegistry();
        this.compilation = {
            version: "1",
            widgets: [],
            options: {
                stacking: DEFAULT_OPTIONS.stacking,
                numberOfColumns: DEFAULT_OPTIONS.numberOfColumns,
                numberOfRows: {
                    type: DEFAULT_OPTIONS.numberOfRows.type,
                    value: DEFAULT_OPTIONS.numberOfRows.value,
                },
                padding: { x: 0, y: 0 },
                spacing: { x: 0, y: 0 },
            },
        };
    }

    // React.createElement-style factory: accepts a constructor function and props.
    create(widgetType: (props: object) => object, props?: object): object {
        return widgetType(props || {});
    }

    setLayout(layout: GridLayout): this {
        this.layout = layout;
        return this;
    }

    add(widget: any, position?: WidgetPosition | number, row?: number): this {
        let col: number | undefined;
        let rowPos: number | undefined;

        if (typeof position === "object") {
            col = position.col;
            rowPos = position.row;
        } else if (typeof position === "number") {
            col = position;
            rowPos = row;
        }

        // Register by name for cross-widget action references
        let widgetName: string | undefined;
        if (widget.model && widget.model.name) {
            widgetName = widget.model.name as string;
        } else if (widget.name) {
            widgetName = widget.name as string;
        }
        if (widgetName) {
            this.registry.register(widgetName, widget);
        }

        if (this.layout && col !== undefined && rowPos !== undefined) {
            this.layout.addWidget(widget, col, rowPos);
        } else {
            this.widgets.push(widget);
        }
        return this;
    }

    addWidget(widget: any, col?: number, row?: number): this {
        return this.add(widget, col, row);
    }

    compile(config: { layout?: GridLayout; widgets?: WidgetConfig[] }): Compilation {
        config = config || {};
        if (config.layout) {
            this.setLayout(config.layout);
        }
        if (config.widgets) {
            for (const wc of config.widgets) {
                const pos: WidgetPosition = wc.position || { col: wc.col, row: wc.row };
                this.add(wc.widget, pos);
            }
        }
        return this.build();
    }

    private _copySerializable(source: unknown): unknown {
        if (typeof source !== "object" || source === null) {
            return source;
        }
        const copy: Record<string, unknown> = {};
        for (const k in source as Record<string, unknown>) {
            const v = (source as Record<string, unknown>)[k];
            if (typeof v === "function") {
                // skip — not serializable to JSON
            } else if (typeof v === "object" && v !== null) {
                copy[k] = this._copySerializable(v);
            } else {
                copy[k] = v;
            }
        }
        return copy;
    }

    build(): Compilation {
        if (this.layout) {
            return this.layout.getModel();
        }

        const compilation: Compilation = {
            version: "1",
            widgets: [],
            options: {
                stacking: "none",
                numberOfColumns: 96,
                numberOfRows: { type: "count", value: 96 },
                padding: { x: 0, y: 0 },
                spacing: { x: 0, y: 0 },
            },
        };

        for (const widget of this.widgets) {
            let widgetModel: Record<string, unknown>;
            if (typeof widget.getModel === "function") {
                widgetModel = widget.getModel();
            } else {
                widgetModel = widget as Record<string, unknown>;
            }

            const widgetCopy = this._copySerializable(widgetModel) as Record<string, unknown>;
            if (!widgetCopy.layout) {
                widgetCopy.layout = { x: 0, y: 0, w: 48, h: 48 };
            }
            compilation.widgets.push(widgetCopy as object);
        }

        return compilation;
    }
}
