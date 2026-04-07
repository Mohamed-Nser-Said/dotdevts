import {
    PipelineStep,
    StyleProps,
    TableActionHook,
    TableActions,
    TableModel,
    TableOptions,
    TableRow,
    TableSchemaColumn,
    TableState,
    TextCaptionBar,
} from "../core/types";
import { Window } from "../core/Window";

export interface TableProps {
    name?: string;
    title?: string;
    description?: string;
    showCaption?: boolean;
    data?: TableRow[];
    dataSource?: Record<string, unknown>;
    schema?: TableSchemaColumn[];
    options?: TableOptions;
    state?: TableState;
    toolbars?: Record<string, unknown>;
    actions?: TableActions;
    window?: Window;
}

const defaultStyle: StyleProps = {
    backgroundColor: "#ffffff",
    color: "#0f172a",
    fontSize: "14px",
};

const defaultHeaderStyle: StyleProps = {
    backgroundColor: "#1d4ed8",
    color: "#ffffff",
    fontWeight: "bold",
};

const defaultOptions: TableOptions = {
    allowSorting: true,
    alternateRowColoring: true,
    editable: false,
    multi: false,
    pageSize: 8,
    pagination: true,
    showHoverHighLight: true,
    showRefreshButton: true,
    showSelectedRow: true,
    showToolbar: true,
    showRowNumbers: false,
    style: defaultStyle,
    header: {
        style: defaultHeaderStyle,
    },
};

export class Table {
    model: TableModel;
    window: Window;

    constructor(props?: TableProps) {
        props = props || {};
        this.window = props.window ? props.window : new Window();

        const showCaption = props.showCaption === true;
        const captionBar: TextCaptionBar | false = showCaption
            ? { hidden: false, title: props.title || props.name || "Table Widget" }
            : false;

        this.model = {
            type: "table",
            name: props.name || "Table",
            description: props.description || "Table Widget",
            id: syslib.uuid(),
            captionBar,
            data: props.data || [],
            dataSource: props.dataSource,
            schema: props.schema || [],
            options: this.mergeOptions(props.options),
            state: props.state,
            actions: props.actions || {},
            toolbars: props.toolbars || {},
        };
    }

    private mergeOptions(options?: TableOptions): TableOptions {
        const nextOptions = options || {};
        const merged: TableOptions = {
            ...defaultOptions,
            ...nextOptions,
        };

        merged.style = {
            ...(defaultOptions.style || {}),
            ...(nextOptions.style || {}),
        };

        merged.header = {
            ...(defaultOptions.header || {}),
            ...(nextOptions.header || {}),
            style: {
                ...((defaultOptions.header && defaultOptions.header.style) || {}),
                ...((nextOptions.header && nextOptions.header.style) || {}),
            },
        };

        return merged;
    }

    private registerHook(hook: TableActionHook, handler: (ctx: Window) => void): this {
        if (!this.model.actions) {
            this.model.actions = {};
        }
        if (!this.model.actions[hook]) {
            this.model.actions[hook] = [];
        }

        handler(this.window);

        const recorded: PipelineStep[] = this.window.getActions();
        for (const step of recorded) {
            this.model.actions[hook]!.push(step);
        }

        this.window.reset();
        return this;
    }

    setData(data: TableRow[]): this {
        this.model.data = data;
        return this;
    }

    setSchema(schema: TableSchemaColumn[]): this {
        this.model.schema = schema;
        return this;
    }

    setOptions(options: TableOptions): this {
        this.model.options = this.mergeOptions(options);
        return this;
    }

    setState(state: TableState): this {
        this.model.state = state;
        return this;
    }

    onSave(handler: (ctx: Window) => void): this {
        return this.registerHook("onSave", handler);
    }

    onSelect(handler: (ctx: Window) => void): this {
        return this.registerHook("onSelect", handler);
    }

    onSelectionChanged(handler: (ctx: Window) => void): this {
        return this.registerHook("onSelectionChanged", handler);
    }

    onSubmit(handler: (ctx: Window) => void): this {
        return this.registerHook("onSubmit", handler);
    }

    getModel(): TableModel {
        return this.model;
    }
}
