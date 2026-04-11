import {
    ChartActionHook,
    ChartActions,
    ChartCursor,
    ChartInspector,
    ChartLegend,
    ChartModel,
    ChartModelRoot,
    ChartOptions,
    ChartPen,
    ChartRanges,
    ChartTrendModel,
    ChartXAxis,
    ChartYAxis,
    PipelineStep,
} from "../../core/types";
import { Window } from "../../core/Window";
import { BaseWidget, BaseWidgetProps } from "../BaseWidget";

export interface ChartProps extends BaseWidgetProps<ChartActions> {
    captionBar?: boolean | Record<string, unknown>;
    chart?: ChartTrendModel;
    inspector?: ChartInspector;
    legend?: ChartLegend;
    modelRoot?: ChartModelRoot;
    options?: ChartOptions;
    ranges?: ChartRanges;
    tagSearchTable?: Record<string, unknown>;
    dragSource?: Record<string, unknown>;
    dropTarget?: Record<string, unknown>;
}

const defaultXAxis: ChartXAxis = {
    id: 1,
    name: "Last 8 Hours",
    description: "Relative production timeline",
    start_time: "*-8h",
    end_time: "*",
    intervals_no: 64,
    position: {
        alignment: "bottom",
        orientation: "bottom",
        start: 0,
        end: 100,
        value: 1,
    },
    themes: {
        dark: { color: "white" },
        light: { color: "black" },
    },
    locked: false,
    grid: true,
    ticks: {
        count: 8,
        format: "HH:mm",
    },
};

const defaultYAxis: ChartYAxis = {
    id: 1,
    name: "Value",
    description: "Demo engineering units",
    position: {
        alignment: "left",
        orientation: "left",
        start: 0,
        end: 100,
        value: 1,
    },
    intervals_no: 5,
    range: {
        min: {
            mode: "fixed",
            value: 0,
        },
        max: {
            mode: "fixed",
            value: 100,
        },
    },
    themes: {
        dark: { color: "white" },
        light: { color: "black" },
    },
    locked: false,
    grid: true,
    ticks: {
        count: 5,
    },
};

const defaultPen: ChartPen = {
    id: 1,
    name: "FC4711",
    path: "/System/Core/Examples/Demo Data/Process Data/FC4711",
    DecimalPlaces: 2,
    aggregate: "AGG_TYPE_INTERPOLATIVE",
    trend_type: "HT_LINE",
    style: {
        line: "SOLID",
        marker: "MARKER_STYLE_NONE",
        thickness: "SEMISMALL",
    },
    themes: {
        dark: { color: "aqua" },
        light: { color: "aqua" },
    },
    x_axis: [1],
    y_axis: [1],
    draw: true,
};

const defaultChart: ChartTrendModel = {
    class: "Trend",
    name: "Process Trend",
    description: "Demo Data/Process Data",
    cursors: [],
    x_axis: [defaultXAxis],
    y_axis: [defaultYAxis],
    pens: [defaultPen],
};

const defaultOptions: ChartOptions = {
    actualValues: true,
    showToolbar: true,
    leftPanel: true,
    rightPanel: true,
    bottomPanel: false,
    groupXAxis: true,
    relativeXAxis: false,
    play: "none",
    crosshairMode: "traceHoverLabels",
    cleanup: {
        xAxisOnPenDeletion: true,
        yAxisOnPenDeletion: true,
    },
};

export class Chart extends BaseWidget<ChartModel, ChartActions> {
    constructor(props?: ChartProps) {
        super(props && props.window ? props.window : undefined);
        props = props || {};

        this.model = {
            type: "chart",
            name: this.getName(props, "Chart"),
            description: this.getDescription(props, "Chart Widget"),
            id: this.createId(),
            actions: this.getActions(props),
            captionBar: props.captionBar !== undefined ? props.captionBar : this.getCaptionBar(props, "Chart Widget"),
            chart: this.mergeChart(props.chart),
            dataSource: this.getDataSource(props),
            inspector: props.inspector || {},
            legend: props.legend,
            modelRoot: props.modelRoot,
            options: {
                ...defaultOptions,
                ...(props.options || {}),
            },
            ranges: props.ranges,
            tagSearchTable: props.tagSearchTable,
            toolbars: this.getToolbars(props),
            dragSource: props.dragSource,
            dropTarget: props.dropTarget,
        };
    }

    private mergeChart(chart?: ChartTrendModel): ChartTrendModel {
        const nextChart = chart || {};
        return {
            ...defaultChart,
            ...nextChart,
            cursors: nextChart.cursors || defaultChart.cursors,
            x_axis: nextChart.x_axis || defaultChart.x_axis,
            y_axis: nextChart.y_axis || defaultChart.y_axis,
            pens: nextChart.pens || defaultChart.pens,
        };
    }

    private ensureChart(): ChartTrendModel {
        if (!this.model.chart) {
            this.model.chart = this.mergeChart();
        }
        return this.model.chart;
    }

    private registerHook(hook: ChartActionHook | string, handler: (ctx: Window) => void): this {
        this.model.actions = this.addHook(this.model.actions, hook, handler);
        return this;
    }

    setChart(chart: ChartTrendModel): this {
        this.model.chart = this.mergeChart(chart);
        return this;
    }

    setOptions(options: ChartOptions): this {
        this.model.options = {
            ...(this.model.options || {}),
            ...options,
        };
        return this;
    }

    setLegend(legend: ChartLegend): this {
        this.model.legend = legend;
        return this;
    }

    setModelRoot(modelRoot: ChartModelRoot): this {
        this.model.modelRoot = modelRoot;
        return this;
    }

    setRanges(ranges: ChartRanges): this {
        this.model.ranges = ranges;
        return this;
    }

    addPen(pen: ChartPen): this {
        const chart = this.ensureChart();
        if (!chart.pens) {
            chart.pens = [];
        }
        chart.pens.push(pen);
        return this;
    }

    addXAxis(axis: ChartXAxis): this {
        const chart = this.ensureChart();
        if (!chart.x_axis) {
            chart.x_axis = [];
        }
        chart.x_axis.push(axis);
        return this;
    }

    addYAxis(axis: ChartYAxis): this {
        const chart = this.ensureChart();
        if (!chart.y_axis) {
            chart.y_axis = [];
        }
        chart.y_axis.push(axis);
        return this;
    }

    addCursor(cursor: ChartCursor): this {
        const chart = this.ensureChart();
        if (!chart.cursors) {
            chart.cursors = [];
        }
        chart.cursors.push(cursor);
        return this;
    }

    onDataPointClick(handler: (ctx: Window) => void): this {
        return this.registerHook("onDataPointClick", handler);
    }

    onNewChart(handler: (ctx: Window) => void): this {
        return this.registerHook("onNewChart", handler);
    }

    on(hook: string, handler: (ctx: Window) => void): this {
        return this.registerHook(hook, handler);
    }

    getModel(): ChartModel {
        return this.model;
    }
}
