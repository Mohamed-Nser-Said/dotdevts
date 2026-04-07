import "../../prelude";

import { App } from "../../cts-webstudio-builder/src/core/App";
import { PrimaryButton } from "../../cts-webstudio-builder/src/components/PrimaryButton";
import { WarningButton } from "../../cts-webstudio-builder/src/components/WarningButton";
import { CriticalActionButton } from "../../cts-webstudio-builder/src/components/CriticalActionButton";
import { Compilation } from "../../cts-webstudio-builder/src/core/types";
import { GridLayout } from "../../cts-webstudio-builder/src/layouts/GridLayout";
import { Chart } from "../../cts-webstudio-builder/src/widgets/Chart";
import { Editor } from "../../cts-webstudio-builder/src/widgets/Editor";
import { GridLayoutContainer } from "../../cts-webstudio-builder/src/layouts/GridLayoutContainer";
import { HLayoutContainer } from "../../cts-webstudio-builder/src/layouts/HLayoutContainer";
import { Faceplate } from "../../cts-webstudio-builder/src/widgets/Faceplate";
import { Form } from "../../cts-webstudio-builder/src/widgets/Form";
import { IFrame } from "../../cts-webstudio-builder/src/widgets/IFrame";
import { Image } from "../../cts-webstudio-builder/src/widgets/Image";
import { MarkdownViewer } from "../../cts-webstudio-builder/src/widgets/MarkdownViewer";
import { Table } from "../../cts-webstudio-builder/src/widgets/Table";
import { Tree } from "../../cts-webstudio-builder/src/widgets/Tree";
import { Tab } from "../../cts-webstudio-builder/src/widgets/Tab";
import { TabContainer } from "../../cts-webstudio-builder/src/widgets/TabContainer";
import { Text } from "../../cts-webstudio-builder/src/widgets/Text";

function makeKpiCard(name: string, value: string, backgroundColor: string, borderColor: string): Text {
    return new Text({
        name,
        text: `${name} • ${value}`,
        showCaption: false,
        style: {
            backgroundColor,
            color: "#ffffff",
            padding: "16px",
            fontSize: "18px",
            fontWeight: "bold",
            textAlign: "center",
            borderRadius: "14px",
            border: `2px solid ${borderColor}`,
            boxShadow: "0 10px 24px rgba(15, 23, 42, 0.18)",
        },
    });
}

function makePanelText(name: string, text: string, backgroundColor = "#f8fafc", color = "#0f172a"): Text {
    return new Text({
        name,
        text,
        showCaption: false,
        style: {
            backgroundColor,
            color,
            padding: "14px",
            fontSize: "16px",
            textAlign: "left",
            borderRadius: "12px",
            border: "1px solid #dbeafe",
            boxShadow: "0 4px 14px rgba(37, 99, 235, 0.08)",
        },
    });
}

function makeSectionHeader(name: string, text: string): Text {
    return new Text({
        name,
        text,
        showCaption: false,
        style: {
            backgroundColor: "#0f172a",
            color: "#ffffff",
            padding: "14px",
            fontSize: "20px",
            fontWeight: "bold",
            textAlign: "center",
            borderRadius: "12px",
            border: "1px solid #1d4ed8",
        },
    });
}

/**
 * More polished and reactive WebStudio example page.
 *
 * Buttons update the page state, KPI cards, banner text, and operator guidance
 * so the UI feels interactive instead of only showing notifications.
 */
export function createSimpleWebStudioPage(): Compilation {
    const hero = new Text({
        name: "Hero",
        text: "Plant Operations Dashboard",
        showCaption: false,
        style: {
            backgroundColor: "#0f172a",
            color: "#ffffff",
            padding: "20px",
            fontSize: "30px",
            fontWeight: "bold",
            textAlign: "center",
            borderRadius: "16px",
            border: "1px solid #1d4ed8",
            boxShadow: "0 14px 30px rgba(15, 23, 42, 0.22)",
        },
    });

    const subtitle = makePanelText(
        "Subtitle",
        "Interactive starter page: buttons update cards, status, guidance, and now includes Image, Faceplate, Form, Chart, Tree, IFrame, nested Container, and Tabs widgets.",
        "#e0f2fe",
        "#0f172a",
    );

    const processVisual = new Image({
        name: "ProcessVisual",
        mimeType: "image/svg+xml",
        base64: "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA5NjAgMjgwIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAiIHgyPSIxIiB5MT0iMCIgeTI9IjEiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMGYxNzJhIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzI1NjNlYiIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9Ijk2MCIgaGVpZ2h0PSIyODAiIHJ4PSIyOCIgZmlsbD0idXJsKCNnKSIvPgogIDxjaXJjbGUgY3g9IjE1MCIgY3k9IjE0MCIgcj0iNjQiIGZpbGw9IiMyMmM1NWUiIG9wYWNpdHk9IjAuOTUiLz4KICA8cmVjdCB4PSIxMTgiIHk9IjEwOCIgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMTQiIGZpbGw9IiNlY2ZlZmYiIG9wYWNpdHk9IjAuOTUiLz4KICA8dGV4dCB4PSIyNTAiIHk9IjExOCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjM4IiBmb250LXdlaWdodD0iNzAwIiBmaWxsPSIjZmZmZmZmIj5XZWJTdHVkaW8gSW1hZ2UgV2lkZ2V0PC90ZXh0PgogIDx0ZXh0IHg9IjI1MCIgeT0iMTY0IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjIiIGZpbGw9IiNkYmVhZmUiPkVtYmVkZGVkIFNWRyB2aWEgYmFzZTY0IGZvciBhIHNlbGYtY29udGFpbmVkIGRlbW8uPC90ZXh0PgogIDx0ZXh0IHg9IjI1MCIgeT0iMjA0IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiNiZmRiZmUiPmRvdGRldnRzIGRhc2hib2FyZCBleGFtcGxlPC90ZXh0Pgo8L3N2Zz4K",
        size: "contain",
        style: {
            backgroundColor: "#ffffff",
            padding: "10px",
            height: "220px",
            borderRadius: "16px",
            border: "1px solid #dbeafe",
            boxShadow: "0 8px 20px rgba(37, 99, 235, 0.08)",
        },
    });

    const faceplateHeader = makeSectionHeader(
        "FaceplateHeader",
        "Live Faceplate — demo process value",
    );

    const liveFaceplate = new Faceplate({
        name: "DemoDataFaceplate",
        description: "Live VQT view for a demo process item",
        path: "/System/Core/Examples/Demo Data/Process Data/DC4711",
    });

    const lineState = makeKpiCard("Line State", "READY", "#0f766e", "#2dd4bf");
    const throughput = makeKpiCard("Throughput", "24.8 t/h", "#1d4ed8", "#60a5fa");
    const alarms = makeKpiCard("Alarms", "0 active", "#15803d", "#4ade80");

    const kpiRow = new HLayoutContainer({
        name: "KpiRow",
        description: "Key metrics",
        columns: [1, 1, 1],
        gap: 2,
    });
    kpiRow.addWidget(lineState, 1);
    kpiRow.addWidget(throughput, 2);
    kpiRow.addWidget(alarms, 3);

    const controlHeader = makeSectionHeader(
        "ControlHeader",
        "Control Center — use the buttons below",
    );

    const actionStatus = new Text({
        name: "ActionStatus",
        text: "Status • Waiting for operator input",
        showCaption: false,
        style: {
            backgroundColor: "#eff6ff",
            color: "#1d4ed8",
            padding: "16px",
            fontSize: "20px",
            fontWeight: "bold",
            textAlign: "center",
            borderRadius: "12px",
            border: "1px solid #bfdbfe",
        },
    });

    const modePanel = makePanelText(
        "ModePanel",
        "Mode • READY",
        "#f8fafc",
        "#0f172a",
    );

    const operatorGuide = makePanelText(
        "OperatorGuide",
        "Next step • Press Start Batch to simulate production start.",
        "#f8fafc",
        "#0f172a",
    );

    const activityLog = makePanelText(
        "ActivityLog",
        "Activity • No command has been sent yet.",
        "#fff7ed",
        "#9a3412",
    );

    const trendHeader = makeSectionHeader(
        "TrendHeader",
        "Trend Chart — live process history",
    );

    const processTrend = new Chart({
        name: "ProcessTrend",
        description: "Chart widget demo with multiple axes and pens",
        chart: {
            class: "Trend",
            name: "Demo Process Trend",
            description: "Flow and temperature history",
            cursors: [
                {
                    id: 1,
                    timestamp: "*-2h",
                    context: "Recent operating window",
                },
            ],
            x_axis: [
                {
                    id: 1,
                    name: "Last 12 Hours",
                    description: "Shared plant timeline",
                    start_time: "*-12h",
                    end_time: "*",
                    intervals_no: 72,
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
                        count: 6,
                        format: "HH:mm",
                    },
                },
            ],
            y_axis: [
                {
                    id: 1,
                    name: "Flow",
                    description: "m³/h",
                    position: {
                        alignment: "left",
                        orientation: "left",
                        start: 0,
                        end: 100,
                        value: 1,
                    },
                    intervals_no: 5,
                    range: {
                        min: { mode: "fixed", value: 0 },
                        max: { mode: "fixed", value: 100 },
                    },
                    themes: {
                        dark: { color: "white" },
                        light: { color: "black" },
                    },
                    locked: false,
                    grid: true,
                    ticks: { count: 5 },
                },
                {
                    id: 2,
                    name: "Temperature",
                    description: "°C",
                    position: {
                        alignment: "right",
                        orientation: "right",
                        start: 0,
                        end: 100,
                        value: 1,
                    },
                    intervals_no: 6,
                    range: {
                        min: { mode: "fixed", value: 0 },
                        max: { mode: "fixed", value: 120 },
                    },
                    themes: {
                        dark: { color: "#fbbf24" },
                        light: { color: "#d97706" },
                    },
                    locked: false,
                    grid: false,
                    ticks: { count: 6 },
                },
            ],
            pens: [
                {
                    id: 1,
                    name: "Flow FC4711",
                    path: "/System/Core/Examples/Demo Data/Process Data/FC4711",
                    DecimalPlaces: 1,
                    aggregate: "AGG_TYPE_INTERPOLATIVE",
                    style: {
                        line: "SOLID",
                        marker: "MARKER_STYLE_NONE",
                        thickness: "SEMISMALL",
                    },
                    themes: {
                        dark: { color: "aqua" },
                        light: { color: "#0891b2" },
                    },
                    trend_type: "HT_LINE",
                    x_axis: [1],
                    y_axis: [1],
                    draw: true,
                },
                {
                    id: 2,
                    name: "Temperature TC4711",
                    path: "/System/Core/Examples/Demo Data/Process Data/TC4711",
                    DecimalPlaces: 1,
                    aggregate: "AGG_TYPE_INTERPOLATIVE",
                    style: {
                        line: "DASH2",
                        marker: "MARKER_STYLE_NONE",
                        thickness: "SEMISMALL",
                    },
                    themes: {
                        dark: { color: "#fbbf24" },
                        light: { color: "#d97706" },
                    },
                    trend_type: "HT_LINE",
                    x_axis: [1],
                    y_axis: [2],
                    draw: true,
                },
            ],
        },
        legend: {
            timePeriodAggregates: [
                ["AGG_TYPE_MINIMUM", "Min"],
                ["AGG_TYPE_MAXIMUM", "Max"],
                ["AGG_TYPE_AVERAGE", "Avg"],
            ],
        },
        modelRoot: {
            path: "/System/Core/Examples/Demo Data/Process Data",
            includeRoot: false,
            depth: 2,
        },
        options: {
            actualValues: true,
            cleanup: {
                xAxisOnPenDeletion: true,
                yAxisOnPenDeletion: true,
            },
            crosshairMode: "traceHoverLabels",
            groupXAxis: true,
            leftPanel: true,
            rightPanel: true,
            bottomPanel: false,
            play: "none",
            relativeXAxis: false,
            showToolbar: true,
        },
        inspector: {
            showCrosshairPanel: true,
            showCursorsPanel: true,
            showModifiedDataPanel: true,
            showPropertiesPanel: true,
        },
    }).onDataPointClick((ctx) => {
        ctx.notify("Trend data point clicked");
        ctx.modify(actionStatus.model.id, [
            { name: "model.text", value: "Status • Trend point selected on the chart" },
            { name: "model.options.style.backgroundColor", value: "#ecfeff" },
            { name: "model.options.style.color", value: "#155e75" },
            { name: "model.options.style.border", value: "1px solid #a5f3fc" },
        ]);
        ctx.modify(activityLog.model.id, [
            { name: "model.text", value: "Activity • Trend point clicked — inspect the chart legend and cursor values." },
        ]);
        ctx.modify(operatorGuide.model.id, [
            { name: "model.text", value: "Next step • Use the trend toolbar to zoom, pan, or inspect another pen." },
        ]);
    }).onNewChart((ctx) => {
        ctx.notify("New chart initialized");
        ctx.modify(activityLog.model.id, [
            { name: "model.text", value: "Activity • Chart reset from the toolbar — add new pens or time spans as needed." },
        ]);
    });

    const tableHeader = makeSectionHeader(
        "TableHeader",
        "Batch Table — live unit snapshot",
    );

    const batchTable = new Table({
        name: "BatchTable",
        description: "Live batch overview table",
        showCaption: false,
        data: [
            {
                unit: "Mixer-01",
                recipe: "Base Blend A",
                status: "Running",
                temperature: 72.4,
                flow: 31.2,
                operator: "Nadia",
            },
            {
                unit: "Reactor-02",
                recipe: "Cleaning Cycle",
                status: "Maintenance",
                temperature: 48.0,
                flow: 12.0,
                operator: "Omar",
            },
            {
                unit: "Filler-03",
                recipe: "Packaging Run",
                status: "Ready",
                temperature: 21.5,
                flow: 24.8,
                operator: "Lina",
            },
            {
                unit: "Buffer-04",
                recipe: "Hold Tank",
                status: "Stopped",
                temperature: 19.2,
                flow: 0.0,
                operator: "Yousef",
            },
        ],
        schema: [
            { name: "unit", title: "Unit", filter: "text" },
            { name: "recipe", title: "Recipe", filter: "text" },
            {
                name: "status",
                title: "Status",
                filter: "select",
                rules: [
                    {
                        type: "equal",
                        value: "Running",
                        style: { backgroundColor: "#dcfce7", color: "#166534", fontWeight: "bold" },
                    },
                    {
                        type: "equal",
                        value: "Maintenance",
                        style: { backgroundColor: "#fef3c7", color: "#92400e", fontWeight: "bold" },
                    },
                    {
                        type: "equal",
                        value: "Stopped",
                        style: { backgroundColor: "#fee2e2", color: "#991b1b", fontWeight: "bold" },
                    },
                ],
            },
            {
                name: "temperature",
                title: "Temp (°C)",
                type: "number",
                numberOfDecimals: 1,
                filter: "slider",
            },
            {
                name: "flow",
                title: "Flow (t/h)",
                type: "number",
                numberOfDecimals: 1,
                filter: "slider",
                sort: "desc",
            },
            { name: "operator", title: "Operator", filter: "select+text" },
        ],
        options: {
            alternateRowColoring: true,
            allowSorting: true,
            pagination: false,
            showToolbar: true,
            showRefreshButton: false,
            showRowNumbers: true,
            style: {
                backgroundColor: "#ffffff",
                color: "#0f172a",
                fontSize: "14px",
            },
            header: {
                style: {
                    backgroundColor: "#1e3a8a",
                    color: "#ffffff",
                    fontWeight: "bold",
                },
            },
        },
        state: {
            showGlobalSearch: true,
            showColumnFilters: true,
        },
    }).onSelect((ctx) => {
        ctx.notify("Batch table row selected");
        ctx.modify(activityLog.model.id, [
            { name: "model.text", value: "Activity • Batch table row selected for review." },
        ]);
        ctx.modify(operatorGuide.model.id, [
            { name: "model.text", value: "Next step • Compare the selected batch row with the KPI cards above." },
        ]);
    });

    const startButton = new PrimaryButton({
        label: "Start Batch",
        style: {
            backgroundColor: "#2563eb",
            color: "#ffffff",
            padding: "14px 18px",
            fontSize: "16px",
            fontWeight: "bold",
            borderRadius: "12px",
            border: "2px solid #1d4ed8",
            boxShadow: "0 6px 16px rgba(37, 99, 235, 0.25)",
        },
    }).onClicked((ctx) => {
        ctx.notify("Production start requested");
        ctx.consoleLog("Production start requested");
        ctx.modify(hero.model.id, [
            { name: "model.text", value: "Plant Operations Dashboard • RUNNING" },
        ]);
        ctx.modify(actionStatus.model.id, [
            { name: "model.text", value: "Status • Production is ramping up" },
            { name: "model.options.style.backgroundColor", value: "#dcfce7" },
            { name: "model.options.style.color", value: "#166534" },
            { name: "model.options.style.border", value: "1px solid #86efac" },
        ]);
        ctx.modify(modePanel.model.id, [
            { name: "model.text", value: "Mode • RUNNING" },
        ]);
        ctx.modify(operatorGuide.model.id, [
            { name: "model.text", value: "Next step • Monitor throughput and quality indicators." },
        ]);
        ctx.modify(activityLog.model.id, [
            { name: "model.text", value: "Activity • Start Batch pressed — line is now running." },
        ]);
        ctx.modify(lineState.model.id, [
            { name: "model.text", value: "Line State • RUNNING" },
        ]);
        ctx.modify(throughput.model.id, [
            { name: "model.text", value: "Throughput • 31.2 t/h" },
        ]);
        ctx.modify(alarms.model.id, [
            { name: "model.text", value: "Alarms • 0 active" },
        ]);
    });

    const maintainButton = new WarningButton({
        label: "Maintenance",
        style: {
            backgroundColor: "#f59e0b",
            color: "#ffffff",
            padding: "14px 18px",
            fontSize: "16px",
            fontWeight: "bold",
            borderRadius: "12px",
            border: "2px solid #d97706",
            boxShadow: "0 6px 16px rgba(245, 158, 11, 0.25)",
        },
    }).onClicked((ctx) => {
        ctx.notify("Maintenance mode enabled");
        ctx.consoleLog("Maintenance mode enabled");
        ctx.modify(hero.model.id, [
            { name: "model.text", value: "Plant Operations Dashboard • MAINTENANCE" },
        ]);
        ctx.modify(actionStatus.model.id, [
            { name: "model.text", value: "Status • Maintenance mode scheduled" },
            { name: "model.options.style.backgroundColor", value: "#fef3c7" },
            { name: "model.options.style.color", value: "#92400e" },
            { name: "model.options.style.border", value: "1px solid #fcd34d" },
        ]);
        ctx.modify(modePanel.model.id, [
            { name: "model.text", value: "Mode • SERVICE" },
        ]);
        ctx.modify(operatorGuide.model.id, [
            { name: "model.text", value: "Next step • Finish inspection and then reset the dashboard." },
        ]);
        ctx.modify(activityLog.model.id, [
            { name: "model.text", value: "Activity • Maintenance selected — operators have been notified." },
        ]);
        ctx.modify(lineState.model.id, [
            { name: "model.text", value: "Line State • SERVICE" },
        ]);
        ctx.modify(throughput.model.id, [
            { name: "model.text", value: "Throughput • 12.0 t/h" },
        ]);
        ctx.modify(alarms.model.id, [
            { name: "model.text", value: "Alarms • 1 low" },
        ]);
    });

    const stopButton = new CriticalActionButton({
        label: "Emergency Stop",
        style: {
            backgroundColor: "#dc2626",
            color: "#ffffff",
            padding: "14px 18px",
            fontSize: "16px",
            fontWeight: "bold",
            borderRadius: "12px",
            border: "2px solid #b91c1c",
            boxShadow: "0 6px 16px rgba(220, 38, 38, 0.25)",
        },
    }).onClicked((ctx) => {
        ctx.notify("Emergency stop triggered");
        ctx.consoleLog("Emergency stop triggered");
        ctx.modify(hero.model.id, [
            { name: "model.text", value: "Plant Operations Dashboard • STOPPED" },
        ]);
        ctx.modify(actionStatus.model.id, [
            { name: "model.text", value: "Status • Emergency stop active" },
            { name: "model.options.style.backgroundColor", value: "#fee2e2" },
            { name: "model.options.style.color", value: "#991b1b" },
            { name: "model.options.style.border", value: "1px solid #fca5a5" },
        ]);
        ctx.modify(modePanel.model.id, [
            { name: "model.text", value: "Mode • STOPPED" },
        ]);
        ctx.modify(operatorGuide.model.id, [
            { name: "model.text", value: "Next step • Investigate alarms and reset only when safe." },
        ]);
        ctx.modify(activityLog.model.id, [
            { name: "model.text", value: "Activity • Emergency stop pressed — line halted immediately." },
        ]);
        ctx.modify(lineState.model.id, [
            { name: "model.text", value: "Line State • STOPPED" },
        ]);
        ctx.modify(throughput.model.id, [
            { name: "model.text", value: "Throughput • 0.0 t/h" },
        ]);
        ctx.modify(alarms.model.id, [
            { name: "model.text", value: "Alarms • 3 high" },
        ]);
    });

    const resetButton = new PrimaryButton({
        label: "Reset View",
        style: {
            backgroundColor: "#475569",
            color: "#ffffff",
            padding: "14px 18px",
            fontSize: "16px",
            fontWeight: "bold",
            borderRadius: "12px",
            border: "2px solid #334155",
            boxShadow: "0 6px 16px rgba(71, 85, 105, 0.25)",
        },
    }).onClicked((ctx) => {
        ctx.notify("Dashboard reset to default state");
        ctx.consoleLog("Dashboard reset to default state");
        ctx.modify(hero.model.id, [
            { name: "model.text", value: "Plant Operations Dashboard" },
        ]);
        ctx.modify(actionStatus.model.id, [
            { name: "model.text", value: "Status • Waiting for operator input" },
            { name: "model.options.style.backgroundColor", value: "#eff6ff" },
            { name: "model.options.style.color", value: "#1d4ed8" },
            { name: "model.options.style.border", value: "1px solid #bfdbfe" },
        ]);
        ctx.modify(modePanel.model.id, [
            { name: "model.text", value: "Mode • READY" },
        ]);
        ctx.modify(operatorGuide.model.id, [
            { name: "model.text", value: "Next step • Press Start Batch to simulate production start." },
        ]);
        ctx.modify(activityLog.model.id, [
            { name: "model.text", value: "Activity • Dashboard reset to default state." },
        ]);
        ctx.modify(lineState.model.id, [
            { name: "model.text", value: "Line State • READY" },
        ]);
        ctx.modify(throughput.model.id, [
            { name: "model.text", value: "Throughput • 24.8 t/h" },
        ]);
        ctx.modify(alarms.model.id, [
            { name: "model.text", value: "Alarms • 0 active" },
        ]);
    });

    const actionButtons = new HLayoutContainer({
        name: "ActionButtons",
        description: "Operator actions",
        columns: [1, 1, 1, 1],
        gap: 2,
    });
    actionButtons.addWidget(startButton, 1);
    actionButtons.addWidget(maintainButton, 2);
    actionButtons.addWidget(stopButton, 3);
    actionButtons.addWidget(resetButton, 4);

    const infoRow = new HLayoutContainer({
        name: "InfoRow",
        description: "Live status panels",
        columns: [1, 1],
        gap: 2,
    });
    infoRow.addWidget(modePanel, 1);
    infoRow.addWidget(operatorGuide, 2);

    const formHeader = makeSectionHeader(
        "FormHeader",
        "Batch Dispatch Form — submit an operator request",
    );

    const dispatchForm = new Form({
        name: "DispatchForm",
        description: "Dispatch request form",
        entries: [
            {
                id: "batchId",
                type: "input",
                label: "Batch ID",
                description: "Enter the production batch identifier.",
                value: "B-2026-041",
            },
            {
                id: "recipe",
                type: "select",
                label: "Recipe",
                description: "Choose the recipe to run next.",
                value: "Blend A",
                items: [
                    { label: "Blend A", value: "Blend A" },
                    { label: "Blend B", value: "Blend B" },
                    { label: "Cleaning Cycle", value: "Cleaning Cycle" },
                ],
            },
            {
                id: "startTime",
                type: "date",
                label: "Requested Start",
                description: "Select the requested production start time.",
                value: "2026-04-07T08:00:00.000Z",
                format: "Do MMM YYYY, HH:mm",
                timeIntervals: 15,
            },
            {
                id: "priority",
                type: "buttons",
                label: "Priority",
                description: "Set the execution priority for this request.",
                value: "Normal",
                items: [
                    { color: "green", label: "Normal", value: "Normal" },
                    { color: "yellow", label: "Rush", value: "Rush" },
                    { color: "blue", label: "Hold", value: "Hold" },
                ],
            },
        ],
        options: {
            showRefreshButton: false,
            showToolbar: true,
            submitButton: { label: "Submit Dispatch Request" },
            style: {
                backgroundColor: "#ffffff",
                color: "#0f172a",
                fontSize: "14px",
            },
        },
    }).onSubmit((ctx) => {
        ctx.notify("Dispatch form submitted");
        ctx.consoleLog("Dispatch form submitted");
        ctx.modify(actionStatus.model.id, [
            { name: "model.text", value: "Status • Dispatch request submitted for review" },
            { name: "model.options.style.backgroundColor", value: "#ede9fe" },
            { name: "model.options.style.color", value: "#5b21b6" },
            { name: "model.options.style.border", value: "1px solid #c4b5fd" },
        ]);
        ctx.modify(activityLog.model.id, [
            { name: "model.text", value: "Activity • Form submitted — review the request and confirm the next batch." },
        ]);
        ctx.modify(operatorGuide.model.id, [
            { name: "model.text", value: "Next step • Review the submitted form and then press Start Batch when approved." },
        ]);
    });

    const overviewPanels = new GridLayoutContainer({
        name: "OverviewPanels",
        description: "Overview panels container",
        columns: [1, 1],
        rows: [1, 1],
        gap: 2,
    });
    overviewPanels.addWidget(
        makePanelText(
            "Overview1",
            "Plant summary • all units online, product quality within target, and no trips present.",
        ),
        1,
        1,
    );
    overviewPanels.addWidget(
        makePanelText(
            "Overview2",
            "Reactive UI • the cards, banner, and guidance panels all update when a button is pressed.",
        ),
        2,
        1,
    );
    overviewPanels.addWidget(
        makePanelText(
            "Overview3",
            "Container widget • this extra panel is rendered inside a nested WebStudio container compilation.",
            "#ecfeff",
            "#155e75",
        ),
        1,
        2,
    );
    overviewPanels.addWidget(
        makePanelText(
            "Overview4",
            "Tip • use the container dev tools in WebStudio to add or edit more nested widgets directly.",
            "#f5f3ff",
            "#5b21b6",
        ),
        2,
        2,
    );

    const detailsPanel = new MarkdownViewer({
        name: "RunbookMarkdown",
        description: "Operator runbook and quick process map",
        content: `# Operator Runbook

- **Start Batch** sets the line to \`RUNNING\`.
- **Maintenance** slows the process for inspection.
- **Emergency Stop** halts the line immediately.

## Current Flow

\`\`\`mermaid
graph LR
    A[Start Batch] --> B[Mixer-01]
    B --> C[Reactor-02]
    C --> D[Filler-03]
    D --> E[Dispatch]
\`\`\`

> This panel is rendered with the WebStudio \`markdownviewer\` widget inside a tab.`,
        markdownOptions: {
            linkify: true,
            breaks: false,
            xhtmlOut: true,
        },
        mermaidOptions: {
            theme: "default",
        },
        style: {
            backgroundColor: "#ffffff",
            color: "#0f172a",
            padding: "16px",
            height: "340px",
            borderRadius: "12px",
            border: "1px solid #dbeafe",
            boxShadow: "0 8px 20px rgba(37, 99, 235, 0.08)",
        },
    });

    const shiftNotesPanel = new MarkdownViewer({
        name: "ShiftNotesMarkdown",
        description: "Shift notes and handover items",
        content: `# Shift Notes

- **06:00** Line started cleanly with stable feed.
- **08:15** Reactor temperature returned to target band.
- **Handover** Check packaging material stock before the next dispatch.`,
        markdownOptions: {
            linkify: true,
            breaks: false,
            xhtmlOut: true,
        },
        style: {
            backgroundColor: "#ffffff",
            color: "#0f172a",
            padding: "16px",
            height: "340px",
            borderRadius: "12px",
            border: "1px solid #dbeafe",
            boxShadow: "0 8px 20px rgba(37, 99, 235, 0.08)",
        },
    });

    const recoveryPanel = new MarkdownViewer({
        name: "RecoveryChecklistMarkdown",
        description: "Quick recovery and escalation checklist",
        content: `# Recovery Checklist

1. Confirm the line is in a safe state.
2. Review active alarms and acknowledge standing trips.
3. Reset only after maintenance approval.
4. Use **Reset View** once the line is cleared to return the dashboard to normal.`,
        markdownOptions: {
            linkify: true,
            breaks: false,
            xhtmlOut: true,
        },
        style: {
            backgroundColor: "#ffffff",
            color: "#0f172a",
            padding: "16px",
            height: "340px",
            borderRadius: "12px",
            border: "1px solid #dbeafe",
            boxShadow: "0 8px 20px rgba(37, 99, 235, 0.08)",
        },
    });

    const assetTree = new Tree({
        name: "AssetTree",
        description: "Hierarchy view of the demo production assets",
        data: [
            {
                i: "site-1",
                n: "North Plant",
                kind: "site",
                text: "Main production site",
                c: [
                    {
                        i: "site-1-area-a",
                        n: "Area A",
                        kind: "area",
                        text: "Batch preparation area",
                        c: [
                            {
                                i: "site-1-area-a-line-1",
                                n: "Line 1",
                                kind: "line",
                                text: "Active packaging line",
                                c: [
                                    {
                                        i: "mixer-01",
                                        n: "Mixer-01",
                                        kind: "machine",
                                        text: "Running • 31.2 t/h",
                                        c: [],
                                    },
                                    {
                                        i: "reactor-02",
                                        n: "Reactor-02",
                                        kind: "machine",
                                        text: "Service due in 6 h",
                                        c: [],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        i: "site-1-area-b",
                        n: "Area B",
                        kind: "area",
                        text: "Utility and buffer systems",
                        c: [
                            {
                                i: "buffer-04",
                                n: "Buffer-04",
                                kind: "machine",
                                text: "Standby • ready for dispatch",
                                c: [],
                            },
                        ],
                    },
                ],
            },
        ],
        schema: {
            id: "i",
            name: "n",
            children: "c",
            tooltip: {
                type: "dynamic",
                field: "text",
                text: "Asset node",
            },
            rules: [
                {
                    match: { kind: "site" },
                    icons: [{ icon: "🏭", position: 1, alignment: "leading" }],
                    style: { color: "#1e3a8a", fontWeight: "bold" },
                },
                {
                    match: { kind: "area" },
                    icons: [{ icon: "🗂️", position: 1, alignment: "leading" }],
                    style: { color: "#0f766e", fontWeight: "bold" },
                },
                {
                    match: { kind: "line" },
                    icons: [{ icon: "🧪", position: 1, alignment: "leading" }],
                    style: { color: "#7c3aed", fontWeight: "bold" },
                },
                {
                    match: { kind: "machine" },
                    icons: [{ icon: "⚙️", position: 1, alignment: "leading" }],
                },
            ],
        },
        searchTable: {
            captionBar: {
                hidden: false,
                title: "Asset Search",
            },
            schema: [
                { name: "n", title: "Node", sort: "asc" },
                { name: "text", title: "Description" },
                { name: "_hierarchy", title: "Hierarchy" },
            ],
            options: {
                pagination: false,
                showToolbar: true,
            },
            state: {
                search: { value: "" },
                filters: [],
            },
        },
        options: {
            allowSearch: true,
            collapseOnSearchSelection: false,
            showRefreshButton: false,
            showToolbar: true,
            style: {
                backgroundColor: "#ffffff",
                color: "#0f172a",
                padding: "12px",
                height: "340px",
                borderRadius: "12px",
                border: "1px solid #dbeafe",
                boxShadow: "0 8px 20px rgba(37, 99, 235, 0.08)",
            },
        },
        state: {
            expandedNodes: ["site-1", "site-1-area-a", "site-1-area-a-line-1"],
        },
    }).onSelect((ctx) => {
        ctx.notify("Asset tree selection changed");
        ctx.modify(activityLog.model.id, [
            { name: "model.text", value: "Activity • Asset tree selection changed — browse or search for a unit in the hierarchy." },
        ]);
        ctx.modify(operatorGuide.model.id, [
            { name: "model.text", value: "Next step • Use the Asset Tree tab to inspect the plant hierarchy and jump to a unit quickly." },
        ]);
    });

    const operationsTabs = new TabContainer({
        name: "OperationsTabs",
        description: "Tabbed operator workspace",
        tabAlignment: "top",
        captionBar: true,
    });

    const runbookTab = new Tab({ name: "Runbook", columns: [1], rows: [1] });
    runbookTab.addWidget(detailsPanel, 1, 1);

    const shiftNotesTab = new Tab({ name: "Shift Notes", columns: [1], rows: [1] });
    shiftNotesTab.addWidget(shiftNotesPanel, 1, 1);

    const recoveryTab = new Tab({ name: "Recovery", columns: [1], rows: [1] });
    recoveryTab.addWidget(recoveryPanel, 1, 1);

    const assetTreeTab = new Tab({ name: "Asset Tree", columns: [1], rows: [1] });
    assetTreeTab.addWidget(assetTree, 1, 1);

    operationsTabs.addTab(runbookTab);
    operationsTabs.addTab(shiftNotesTab);
    operationsTabs.addTab(recoveryTab);
    operationsTabs.addTab(assetTreeTab);

    const iframeHeader = makeSectionHeader(
        "IFrameHeader",
        "IFrame Widget — embedded operator reference",
    );

    const operatorReferenceFrame = new IFrame({
        name: "OperatorReferenceFrame",
        description: "IFrame demo modeled from the inmation WebStudio reference widget",
        url: "data:text/html;charset=utf-8,%3Chtml%3E%3Cbody%20style%3D%27margin%3A0%3Bpadding%3A24px%3Bfont-family%3AArial%2Csans-serif%3Bbackground%3Alinear-gradient(135deg%2C%20%23eff6ff%200%25%2C%20%23dbeafe%20100%25)%3Bcolor%3A%230f172a%3B%27%3E%3Ch2%20style%3D%27margin-top%3A0%3Bcolor%3A%231d4ed8%3B%27%3EIFrame%20Widget%20Demo%3C%2Fh2%3E%3Cp%3EThis%20panel%20is%20served%20through%20an%20embedded%20iframe%20using%20the%20documented%20WebStudio%20model%20fields%20%60type%60%2C%20%60url%60%20and%20%60iframeOptions%60.%3C%2Fp%3E%3Cul%3E%3Cli%3Etype%3A%20iframe%3C%2Fli%3E%3Cli%3Eurl%3A%20data%20URL%20for%20a%20self-contained%20demo%3C%2Fli%3E%3Cli%3EiframeOptions.allowFullScreen%3A%20true%3C%2Fli%3E%3C%2Ful%3E%3Cp%3EReference%20docs%3A%3Cbr%20%2F%3Ehttps%3A%2F%2Fdocs.inmation.com%2Fwebapps%2F1.110%2Fwebstudio%2FReferenceDocs%2Fwidgets%2Fiframe%2Findex.html%3C%2Fp%3E%3C%2Fbody%3E%3C%2Fhtml%3E",
        iframeOptions: {
            allowFullScreen: true,
            loading: "lazy",
            referrerPolicy: "no-referrer",
            title: "Operator reference",
        },
    });

    const editorHeader = makeSectionHeader(
        "EditorHeader",
        "Recipe Editor — compare and edit the next batch request",
    );

    const recipeEditor = new Editor({
        name: "RecipeEditor",
        description: "Editable JSON editor with compare mode",
        language: "json",
        content: {
            batchId: "B-2026-041",
            recipe: "Blend A",
            mode: "READY",
            targetThroughput: 24.8,
            approved: false,
            notes: "Initial draft prepared by operations.",
        },
        contentToCompare: {
            batchId: "B-2026-041",
            recipe: "Blend A",
            mode: "RUNNING",
            targetThroughput: 31.2,
            approved: true,
            notes: "Reference profile from the last successful run.",
        },
        schema: {
            type: "object",
            required: ["batchId", "recipe", "mode"],
            properties: {
                batchId: { type: "string", title: "Batch ID" },
                recipe: {
                    type: "string",
                    enum: ["Blend A", "Blend B", "Cleaning Cycle"],
                },
                mode: {
                    type: "string",
                    enum: ["READY", "RUNNING", "SERVICE", "STOPPED"],
                },
                targetThroughput: { type: "number", minimum: 0 },
                approved: { type: "boolean" },
                notes: { type: "string" },
            },
        },
        editorOptions: {
            readOnly: false,
            originalEditable: false,
            wordWrap: "on",
            minimap: {
                enabled: false,
            },
        },
        options: {
            showToolbar: true,
            showLanguageSelection: true,
            showStatusBar: true,
            style: {
                backgroundColor: "#ffffff",
                color: "#0f172a",
                padding: "12px",
                height: "360px",
                borderRadius: "12px",
                border: "1px solid #dbeafe",
                boxShadow: "0 8px 20px rgba(37, 99, 235, 0.08)",
            },
        },
    }).onContentChange((ctx) => {
        ctx.modify(actionStatus.model.id, [
            { name: "model.text", value: "Status • Recipe draft updated in the editor" },
            { name: "model.options.style.backgroundColor", value: "#ecfeff" },
            { name: "model.options.style.color", value: "#155e75" },
            { name: "model.options.style.border", value: "1px solid #a5f3fc" },
        ]);
        ctx.modify(activityLog.model.id, [
            { name: "model.text", value: "Activity • Editor content changed — review the updated dispatch JSON." },
        ]);
        ctx.modify(operatorGuide.model.id, [
            { name: "model.text", value: "Next step • Validate the JSON draft and submit the dispatch request when ready." },
        ]);
    });

    const footer = new Text({
        name: "Footer",
        text: "Tip • Use Start, Maintenance, Stop, Reset, and the trend chart to explore the UI. Click here for action-model help.",
        showCaption: false,
        style: {
            backgroundColor: "#eef2ff",
            color: "#4338ca",
            padding: "12px",
            fontSize: "14px",
            textAlign: "center",
            borderRadius: "12px",
            border: "1px dashed #a5b4fc",
            cursor: "pointer",
        },
    });

    footer.onClicked((ctx) => {
        ctx.action("showActionHelp");
    });

    const app = new App({
        layout: new GridLayout({ columns: [1], rows: [1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1] }),
    });

    app.addAction("showActionHelp", (ctx) => {
        ctx.prompt({
            type: "text",
            text: "This demo uses typed WebStudio actions in TypeScript. Buttons build onClick pipelines, the footer calls a named root action, and this dialog closes with a dismiss action. See the WebStudio actions reference for the full action catalog.",
            captionBar: {
                hidden: false,
                title: "WebStudio Actions",
            },
            options: {
                style: {
                    backgroundColor: "#eff6ff",
                    color: "#1e3a8a",
                    padding: "18px",
                    fontSize: "16px",
                    textAlign: "left",
                    borderRadius: "12px",
                    border: "1px solid #bfdbfe",
                    cursor: "pointer",
                },
            },
            actions: {
                onClick: [
                    {
                        type: "dismiss",
                    },
                ],
            },
        }, "520px", "220px");
    });

    app.add(hero, { col: 1, row: 1 });
    app.add(subtitle, { col: 1, row: 2 });
    app.add(processVisual, { col: 1, row: 3 });
    app.add(faceplateHeader, { col: 1, row: 4 });
    app.add(liveFaceplate, { col: 1, row: 5 });
    app.add(kpiRow, { col: 1, row: 6 });
    app.add(controlHeader, { col: 1, row: 7 });
    app.add(actionButtons, { col: 1, row: 8 });
    app.add(actionStatus, { col: 1, row: 9 });
    app.add(infoRow, { col: 1, row: 10 });
    app.add(formHeader, { col: 1, row: 11 });
    app.add(dispatchForm, { col: 1, row: 12 });
    app.add(activityLog, { col: 1, row: 13 });
    app.add(trendHeader, { col: 1, row: 14 });
    app.add(processTrend, { col: 1, row: 15 });
    app.add(tableHeader, { col: 1, row: 16 });
    app.add(batchTable, { col: 1, row: 17 });
    app.add(overviewPanels, { col: 1, row: 18 });
    app.add(operationsTabs, { col: 1, row: 19 });
    app.add(iframeHeader, { col: 1, row: 20 });
    app.add(operatorReferenceFrame, { col: 1, row: 21 });
    app.add(editorHeader, { col: 1, row: 22 });
    app.add(recipeEditor, { col: 1, row: 23 });
    app.add(footer, { col: 1, row: 24 });

    return app.build();
}

export const page = createSimpleWebStudioPage();

export default page;
