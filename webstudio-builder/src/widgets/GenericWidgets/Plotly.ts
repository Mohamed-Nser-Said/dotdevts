import { PlotlyModel, PlotlyWidgetOptions, WidgetActions } from "../../core/types";

export interface PlotlyProps {
    name?: string;
    description?: string;
    captionBar?: boolean | Record<string, unknown>;
    dataSource?: Record<string, unknown> | Array<Record<string, unknown>>;
    data?: unknown[];
    options?: PlotlyWidgetOptions;
    plotlyOptions?: Record<string, unknown>;
    actions?: WidgetActions;
    toolbars?: Record<string, unknown>;
    dragSource?: Record<string, unknown>;
    dropTarget?: Record<string, unknown>;
}

export class Plotly {
    model: PlotlyModel;

    constructor(props?: PlotlyProps) {
        props = props || {};
        this.model = {
            type: "plotly",
            name: props.name || "Plotly",
            description: props.description || "Plotly Widget",
            id: syslib.uuid(),
            actions: props.actions || {},
            captionBar: props.captionBar,
            dataSource: props.dataSource,
            data: props.data,
            options: props.options || {},
            plotlyOptions: props.plotlyOptions || {},
            toolbars: props.toolbars || {},
            dragSource: props.dragSource,
            dropTarget: props.dropTarget,
        };
    }

    getModel(): PlotlyModel {
        return this.model;
    }
}
