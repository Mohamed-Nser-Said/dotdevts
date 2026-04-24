import {
    StyleProps,
    TableModel,
    TableOptions,
    TableRow,
    TableSchemaColumn,
    TableState,
} from "../../core/types";
import { WidgetActions } from "../../core/types";

export interface TableProps {
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

export class Table {
    public readonly type = "table";
    public readonly id: string;
    public name: string;

    constructor(
        public data: TableRow[] = [],
        public schema: TableSchemaColumn[] = [],
        public options: TableOptions = defaultOptions,
        public state?: TableState,
        name?: string,
        public description: string = "Table Widget",
        public actions?: WidgetActions,
    ) {
        this.id = syslib.uuid();
        this.name = name ?? ("Table" + this.id);
    }

    getModel(): TableModel {
        return {
            type: this.type,
            id: this.id,
            name: this.name,
            description: this.description,
            captionBar: false,
            data: this.data,
            schema: this.schema,
            options: this.options,
            state: this.state,
            actions: this.actions,
        };
    }

    setData(data: TableRow[]): this {
        this.data = data;
        return this;
    }

    setSchema(schema: TableSchemaColumn[]): this {
        this.schema = schema;
        return this;
    }

    setOptions(options: TableOptions): this {
        this.options = {
            ...defaultOptions,
            ...options,
            style: {
                ...defaultOptions.style,
                ...options.style,
            },
            header: {
                ...defaultOptions.header,
                ...options.header,
                style: {
                    ...defaultHeaderStyle,
                    ...options.header?.style,
                },
            },
        };
        return this;
    }

    setState(state: TableState): this {
        this.state = state;
        return this;
    }
}
