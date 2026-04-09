import "../../prelude";

import { App } from "../../webstudio-builder/src/core/App";
import { Compilation } from "../../webstudio-builder/src/core/types";
import { Chart } from "../../webstudio-builder/src/widgets/Chart";
import { Faceplate } from "../../webstudio-builder/src/widgets/Faceplate";
import { Plotly } from "../../webstudio-builder/src/widgets/Plotly";
import { Text } from "../../webstudio-builder/src/widgets/Text";
import { Tree } from "../../webstudio-builder/src/widgets/Tree";

function setAbsoluteLayout<T extends { model: object }>(
    widget: T,
    id: string,
    layout: { x: number; y: number; w: number; h: number; static?: boolean },
): T {
    const model = widget.model as Record<string, unknown>;
    model.id = id;
    model.layout = layout;
    return widget;
}

function makeDropTarget(actionName: string, transparent = false): Record<string, unknown> {
    const canDropStyle: Record<string, unknown> = { border: "3px solid red" };
    const hoverStyle: Record<string, unknown> = { border: "3px solid green" };

    if (transparent) {
        canDropStyle.backgroundColor = "transparent";
        hoverStyle.backgroundColor = "transparent";
    }

    return {
        topic: "dragDrop1",
        enabled: true,
        canDrop: { style: canDropStyle },
        hover: { style: hoverStyle },
        onDrop: {
            action: [
                {
                    type: "action",
                    name: actionName,
                },
            ],
        },
    };
}

export function createDragDropWebStudioPage(): Compilation {
    const title = setAbsoluteLayout(new Text({
        name: "drag-drop-01",
        text: "drag-drop-01",
        showCaption: false,
        style: {
            color: "grey",
            textAlign: "center",
            fontSize: "30px",
            fontWeight: "bold",
            backgroundColor: "transparent",
        },
    }), "text_1", { x: 0, y: 0, w: 96, h: 5, static: true });

    const scatterPlot = setAbsoluteLayout(new Plotly({
        name: "Plotly: Scatter Plots",
        description: "Scatter Plots with dataSource",
        actions: {
            modifyPlotly: [
                {
                    type: "modify",
                    id: "self",
                    set: [
                        {
                            name: "model.dataSource.1.farg.items.0.p",
                            value: "$payload.path",
                        },
                        {
                            name: "model.name",
                            value: "$payload.n",
                        },
                    ],
                },
            ],
        },
        dropTarget: makeDropTarget("modifyPlotly"),
        dataSource: [
            {
                type: "gettime",
                set: [
                    { name: "start_time", value: "*-1h" },
                    { name: "end_time", value: "*" },
                ],
            },
            {
                type: "function",
                lib: "syslib.api",
                func: "readhistoricaldata",
                farg: {
                    processed_as_item_values: false,
                    intervals_no: 100,
                    items: [
                        {
                            p: "1",
                            aggregate: "AGG_TYPE_INTERPOLATIVE",
                        },
                    ],
                },
            },
            {
                type: "transform",
                aggregateOne: [
                    {
                        $project: {
                            data: {
                                $map: {
                                    input: "$data.items",
                                    in: {
                                        x: "$$this.intervals.T",
                                        y: "$$this.intervals.V",
                                    },
                                },
                            },
                        },
                    },
                ],
            },
        ],
        options: {
            refreshInterval: 30,
        },
        plotlyOptions: {
            layoutByTheme: {
                light: {
                    plot_bgcolor: "#f0f0f1",
                    xaxis: { linecolor: "black" },
                    yaxis: { linecolor: "black" },
                },
                dark: {
                    font: { color: "#d5d5d6" },
                    plot_bgcolor: "#252526",
                    paper_bgcolor: "#212123",
                    xaxis: {
                        gridcolor: "#383838",
                        linecolor: "#f9f9f9",
                    },
                    yaxis: {
                        gridcolor: "#383838",
                        linecolor: "#f9f9f9",
                    },
                },
            },
            layout: {
                font: { size: 12 },
                xaxis: {
                    showgrid: true,
                    type: "date",
                    autorange: true,
                },
                yaxis: {
                    showgrid: true,
                    type: "linear",
                    autorange: true,
                },
                margin: { l: 40, r: 40, t: 30, b: 30 },
                template: {
                    data: {
                        scatter: [
                            { mode: "lines", name: "DC4711" },
                            { mode: "lines", name: "DC666" },
                        ],
                    },
                },
            },
        },
    }), "LaP6-plotly", { x: 38, y: 14, w: 26, h: 30, static: false });

    const processTree = setAbsoluteLayout(new Tree({
        name: "Tree",
        description: "Tree",
        data: [
            {
                n: "Process Data",
                t: 123,
                c: [
                    { n: "DC4711", path: "/System/Core/Examples/Demo Data/Process Data/DC4711", t: 420, c: [] },
                    { n: "DC666", path: "/System/Core/Examples/Demo Data/Process Data/DC666", t: 420, c: [] },
                    { n: "FC4711", path: "/System/Core/Examples/Demo Data/Process Data/FC4711", t: 420, c: [] },
                    { n: "FC666", path: "/System/Core/Examples/Demo Data/Process Data/FC666", t: 420, c: [] },
                    { n: "PC4711", path: "/System/Core/Examples/Demo Data/Process Data/PC4711", t: 420, c: [] },
                    { n: "PC666", path: "/System/Core/Examples/Demo Data/Process Data/PC666", t: 420, c: [] },
                    { n: "QC4711", path: "/System/Core/Examples/Demo Data/Process Data/QC4711", t: 420, c: [] },
                    { n: "QC666", path: "/System/Core/Examples/Demo Data/Process Data/QC666", t: 420, c: [] },
                    { n: "TC4711", path: "/System/Core/Examples/Demo Data/Process Data/TC4711", t: 420, c: [] },
                    { n: "TC666", path: "/System/Core/Examples/Demo Data/Process Data/TC666", t: 420, c: [] },
                ],
            },
        ],
        schema: {
            rules: [
                {
                    match: { t: 420 },
                    dragSource: {
                        enabled: true,
                        topic: "dragDrop1",
                        dragPreview: {
                            type: "icon-label",
                            style: {
                                backgroundColor: "red",
                            },
                        },
                    },
                    icons: [{ icon: "-" }],
                },
            ],
        },
        options: {
            allowSearch: false,
            showRefreshButton: false,
            showToolbar: false,
        },
    }), "kFvK-tree", { x: 0, y: 5, w: 9, h: 39, static: false });

    const trendChart = setAbsoluteLayout(new Chart({
        name: "Chart with pen",
        description: "Chart with pen",
        captionBar: true,
        actions: {
            modifyChart: [
                {
                    type: "modify",
                    id: "self",
                    set: [
                        {
                            name: "model.chart.pens.0.path",
                            value: "$payload.path",
                        },
                        {
                            name: "model.name",
                            value: "$payload.n",
                        },
                    ],
                },
            ],
        },
        dropTarget: makeDropTarget("modifyChart"),
        options: {
            play: "live",
            rightPanel: false,
            bottomPanel: false,
            leftPanel: false,
        },
        chart: {
            class: "Trend",
            description: "Demo Data/Process Data",
            name: "Demo Process Data",
            pens: [
                {
                    DecimalPlaces: 2,
                    OpcEngUnit: "$",
                    draw: true,
                    id: 1,
                    name: "Simulated Density",
                    path: "",
                    style: {
                        line: "SOLID",
                        marker: "MARKER_STYLE_NONE",
                        thickness: "SEMISMALL",
                    },
                    aggregate: "AGG_TYPE_INTERPOLATIVE",
                    themes: {
                        dark: { color: "aqua" },
                        light: { color: "aqua" },
                    },
                    trend_type: "HT_LINE",
                    x_axis: [1],
                    y_axis: [1],
                },
            ],
            x_axis: [
                {
                    end_time: "*",
                    grid: false,
                    id: 1,
                    intervals_no: 100,
                    locked: false,
                    name: "X",
                    position: {
                        alignment: "bottom",
                        end: 100,
                        orientation: "bottom",
                        start: 0,
                        value: 1,
                    },
                    start_time: "*-1h",
                    themes: {
                        dark: { color: "white" },
                        light: { color: "black" },
                    },
                },
            ],
            y_axis: [
                {
                    grid: false,
                    id: 1,
                    locked: false,
                    name: "Y",
                    position: {
                        alignment: "left",
                        end: 100,
                        orientation: "left",
                        start: 0,
                        value: 1,
                    },
                    range: {
                        max: { mode: "auto", value: 0 },
                        min: { mode: "auto", value: 0 },
                    },
                    themes: {
                        dark: { color: "white" },
                        light: { color: "black" },
                    },
                },
            ],
        },
    }), "wJgx-chart", { x: 9, y: 14, w: 29, h: 30, static: false });

    const faceplate = setAbsoluteLayout(new Faceplate({
        name: "Faceplate",
        description: "Process Data",
        path: "",
        captionBar: true,
        actions: {
            modifyFaceplate: [
                {
                    type: "modify",
                    id: "self",
                    set: [
                        {
                            name: "model.name",
                            value: "$payload.n",
                        },
                        {
                            name: "model.path",
                            value: "$payload.path",
                        },
                    ],
                },
            ],
        },
        dropTarget: makeDropTarget("modifyFaceplate", true),
    }), "AeT6-faceplate", { x: 64, y: 14, w: 31, h: 9, static: false });

    const instructions = setAbsoluteLayout(new Text({
        name: "Simple Text",
        title: "Simple Text",
        text: "Drag an item in the tree onto another tile to see its data displayed",
        showCaption: true,
    }), "info-text", { x: 9, y: 5, w: 86, h: 9, static: false });

    const gaugePlot = setAbsoluteLayout(new Plotly({
        name: "Plotly: Gauge",
        description: "Gauge",
        dataSource: {
            path: "",
            type: "subscribe",
        },
        data: [
            {
                type: "indicator",
                value: 0,
            },
        ],
        plotlyOptions: {
            layoutByTheme: {
                dark: {
                    font: { color: "#d5d5d6" },
                    plot_bgcolor: "#252526",
                    paper_bgcolor: "#212123",
                    template: {
                        data: {
                            indicator: [
                                {
                                    gauge: {
                                        bordercolor: "grey",
                                        axis: {
                                            tickcolor: "grey",
                                        },
                                    },
                                },
                            ],
                        },
                    },
                },
            },
            layout: {
                paper_bgcolor: "#fff",
                margin: { l: 60, r: 60, t: 40, b: 20 },
                template: {
                    data: {
                        indicator: [
                            {
                                mode: "gauge+number",
                                title: { text: "" },
                                domain: {
                                    x: [0, 1],
                                    y: [0, 1],
                                },
                                gauge: {
                                    axis: {
                                        range: [0, 100],
                                    },
                                    steps: [
                                        { color: "#a1dc5b", range: [0, 70], name: "step1" },
                                        { color: "#ffa500", range: [70, 90], name: "step2" },
                                        { color: "#ff0000", range: [90, 100], name: "step3" },
                                    ],
                                },
                                number: {
                                    suffix: "",
                                    valueformat: "0.2f",
                                },
                            },
                        ],
                    },
                },
            },
        },
        dropTarget: makeDropTarget("modifyGauge"),
        actions: {
            willUpdate: {
                type: "transform",
                completeMsgObject: true,
                aggregateOne: [
                    {
                        $project: {
                            data: [
                                {
                                    type: "indicator",
                                    value: "$payload",
                                },
                            ],
                        },
                    },
                ],
            },
            modifyGauge: [
                [
                    {
                        type: "transform",
                        aggregateOne: [
                            {
                                $set: {
                                    item: {
                                        p: {
                                            $concat: [
                                                "$path",
                                                ".Limits.OpcRangeHigh",
                                            ],
                                        },
                                    },
                                },
                            },
                        ],
                    },
                    { type: "read" },
                    {
                        type: "transform",
                        aggregateOne: [
                            {
                                $set: {
                                    step1: { $multiply: ["$v", "0.7"] },
                                    step2: { $multiply: ["$v", "0.9"] },
                                },
                            },
                        ],
                    },
                    {
                        type: "modify",
                        id: "self",
                        set: [
                            {
                                name: "model.plotlyOptions.layout.template.data.indicator.0.gauge.axis.range.1",
                                value: "$payload.v",
                            },
                            {
                                name: "model.plotlyOptions.layout.template.data.indicator.0.gauge.steps.0.range.1",
                                value: "$payload.step1",
                            },
                            {
                                name: "model.plotlyOptions.layout.template.data.indicator.0.gauge.steps.1.range.0",
                                value: "$payload.step1",
                            },
                            {
                                name: "model.plotlyOptions.layout.template.data.indicator.0.gauge.steps.1.range.1",
                                value: "$payload.step2",
                            },
                            {
                                name: "model.plotlyOptions.layout.template.data.indicator.0.gauge.steps.2.range.0",
                                value: "$payload.step2",
                            },
                            {
                                name: "model.plotlyOptions.layout.template.data.indicator.0.gauge.steps.2.range.1",
                                value: "$payload.v",
                            },
                        ],
                    },
                ],
                [
                    {
                        type: "modify",
                        id: "self",
                        set: [
                            {
                                name: "model.name",
                                value: "$payload.n",
                            },
                            {
                                name: "model.plotlyOptions.layout.template.data.indicator.0.title.text",
                                value: "$payload.n",
                            },
                            {
                                name: "model.dataSource.path",
                                value: "$payload.path",
                            },
                        ],
                    },
                ],
            ],
        },
    }), "Qz5e-gauge", { x: 64, y: 23, w: 31, h: 21, static: false });

    const app = new App();
    app.add(title);
    app.add(scatterPlot);
    app.add(processTree);
    app.add(trendChart);
    app.add(faceplate);
    app.add(instructions);
    app.add(gaugePlot);

    const compilation = app.build();
    compilation.name = "drag-drop-01";
    compilation.options = {
        stacking: "vertical",
        numberOfColumns: 96,
        numberOfRows: {
            type: "count",
            value: 44,
        },
        padding: {
            x: 0,
            y: 2,
        },
        spacing: {
            x: 2,
            y: 2,
        },
    };

    return compilation;
}

export const page = createDragDropWebStudioPage();

export default page;
