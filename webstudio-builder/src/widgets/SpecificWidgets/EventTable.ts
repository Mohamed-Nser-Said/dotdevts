import { EventTableModel, StyleProps, WidgetActions } from "../../core/types";
import { Window } from "../../core/Window";
import { BaseWidget, BaseWidgetProps } from "../BaseWidget";

export interface EventTableProps extends BaseWidgetProps {
    starttime?: string | number;
    endtime?: string | number;
    maxDuration?: string;
    data?: unknown[];
    table?: Record<string, unknown>;
    style?: Partial<StyleProps>;
}

export class EventTable extends BaseWidget<EventTableModel> {
    constructor(props?: EventTableProps) {
        super(props && props.window ? props.window : undefined);
        props = props || {};

        this.model = {
            type: "eventtable",
            name: this.getName(props, "EventTable"),
            description: this.getDescription(props, "Event Table Widget"),
            id: this.createId(),
            actions: this.getActions(props),
            captionBar: this.getCaptionBar(props, "Event Table", "hidden"),
            dataSource: this.getDataSource(props),
            toolbars: this.getToolbars(props),
            options: props.style ? { style: props.style } : undefined,
            data: props.data,
            starttime: props.starttime,
            endtime: props.endtime,
            maxDuration: props.maxDuration,
            table: props.table,
        };
    }

    setTimeRange(starttime: string | number, endtime: string | number): this {
        this.model.starttime = starttime;
        this.model.endtime = endtime;
        return this;
    }

    setTable(table: Record<string, unknown>): this {
        this.model.table = table;
        return this;
    }

    private registerHook(hook: string, handler: (ctx: Window) => void): this {
        this.model.actions = this.addHook(this.model.actions, hook, handler);
        return this;
    }

    on(hook: string, handler: (ctx: Window) => void): this {
        return this.registerHook(hook, handler);
    }

    getModel(): EventTableModel {
        return this.model;
    }
}
