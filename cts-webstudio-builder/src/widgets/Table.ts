import {
    StyleProps,
    TableActionHook,
    TableActions,
    TableModel,
    TableOptions,
    TableRow,
    TableSchemaColumn,
    TableState,
} from "../core/types";
import { Window } from "../core/Window";
import { BaseWidget, BaseWidgetProps } from "./BaseWidget";

export interface TableProps extends BaseWidgetProps<TableActions> {
    data?: TableRow[];
    schema?: TableSchemaColumn[];
    options?: TableOptions;
    state?: TableState;
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

export class Table extends BaseWidget<TableModel, TableActions> {
    constructor(props?: TableProps) {
        super(props && props.window ? props.window : undefined);
        props = props || {};

        this.model = {
            type: "table",
            name: this.getName(props, "Table"),
            description: this.getDescription(props, "Table Widget"),
            id: this.createId(),
            captionBar: this.getCaptionBar(props, "Table Widget", "hidden"),
            data: props.data || [],
            dataSource: props.dataSource,
            schema: props.schema || [],
            options: this.mergeOptions(props.options),
            state: props.state,
            actions: this.getActions(props),
            toolbars: this.getToolbars(props),
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
        this.model.actions = this.addHook(this.model.actions, hook, handler);
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
