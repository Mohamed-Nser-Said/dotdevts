import { TimePeriodTableModel, StyleProps, WidgetActions } from "../../core/types";
import { Window } from "../../core/Window";
import { BaseWidget, BaseWidgetProps } from "../BaseWidget";

export interface TimePeriodTableProps extends BaseWidgetProps {
    starttime?: string | number;
    endtime?: string | number;
    maxDuration?: string;
    data?: unknown[];
    table?: Record<string, unknown>;
    style?: Partial<StyleProps>;
}

export class TimePeriodTable extends BaseWidget<TimePeriodTableModel> {
    constructor(props?: TimePeriodTableProps) {
        super(props && props.window ? props.window : undefined);
        props = props || {};

        this.model = {
            type: "timeperiodtable",
            name: this.getName(props, "TimePeriodTable"),
            description: this.getDescription(props, "Time Period Table Widget"),
            id: this.createId(),
            actions: this.getActions(props),
            captionBar: this.getCaptionBar(props, "Time Period Table", "hidden"),
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

    setMaxDuration(duration: string): this {
        this.model.maxDuration = duration;
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

    getModel(): TimePeriodTableModel {
        return this.model;
    }
}
