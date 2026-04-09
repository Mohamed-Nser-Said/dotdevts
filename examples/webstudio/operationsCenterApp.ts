import "../../prelude";

import { App } from "../../webstudio-builder/src/core/App";
import { CriticalActionButton } from "../../webstudio-builder/src/components/CriticalActionButton";
import { KpiCard } from "../../webstudio-builder/src/components/KpiCard";
import { PrimaryButton } from "../../webstudio-builder/src/components/PrimaryButton";
import { SectionHeader } from "../../webstudio-builder/src/components/SectionHeader";
import { WarningButton } from "../../webstudio-builder/src/components/WarningButton";
import { Compilation } from "../../webstudio-builder/src/core/types";
import { GridLayout } from "../../webstudio-builder/src/layouts/GridLayout";
import { Chart } from "../../webstudio-builder/src/widgets/Chart";
import { Form } from "../../webstudio-builder/src/widgets/Form";
import { MarkdownViewer } from "../../webstudio-builder/src/widgets/MarkdownViewer";
import { Table } from "../../webstudio-builder/src/widgets/Table";
import { Text } from "../../webstudio-builder/src/widgets/Text";
import { CardHolder } from "../../webstudio-builder/src/components/CardHolder";
import { TextCard } from "../../webstudio-builder/src/components/TextCard";

function makeKpi(name: string, value: string, backgroundColor: string, borderColor: string): Text {
    return new KpiCard({
        name,
        label: name,
        value,
        backgroundColor,
        borderColor,
    });
}

function makePanel(name: string, text: string, backgroundColor = "#f8fafc", color = "#0f172a"): any {
    return new TextCard({
        name,
        title: name,
        content: text,
        backgroundColor,
    });
}

function makeHeader(name: string, text: string): Text {
    return new SectionHeader({
        name,
        text,
    });
}

/**
 * A more realistic WebStudio app focused on shift handover, line readiness,
 * and operator decision support for a production team.
 */
export function createOperationsCenterApp(): Compilation {
    const hero = new Text({
        name: "OpsHero",
        text: "Shift Operations Center",
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

    const summary = makePanel(
        "OpsSummary",
        "A practical app for shift supervisors: review line readiness, confirm the next batch, track live trends, and capture handover actions in one place.",
        "#e0f2fe",
        "#0f172a",
    );

    const currentBatch = makeKpi("Current Batch", "B-2026-041", "#1d4ed8", "#60a5fa");
    const readiness = makeKpi("Line Readiness", "96%", "#0f766e", "#2dd4bf");
    const criticals = makeKpi("Critical Alarms", "1 open", "#92400e", "#fbbf24");

    const kpiRow = new CardHolder({
        name: "OpsKpiRow",
        description: "Current shift KPIs",
        columns: [1, 1, 1],
        gap: 2,
    });
    kpiRow.addCard(currentBatch, 1);
    kpiRow.addCard(readiness, 2);
    kpiRow.addCard(criticals, 3);

    const statusBanner = new Text({
        name: "StatusBanner",
        text: "Status • Watch boiler feed pressure before releasing the next batch",
        showCaption: false,
        style: {
            backgroundColor: "#fff7ed",
            color: "#9a3412",
            padding: "16px",
            fontSize: "20px",
            fontWeight: "bold",
            textAlign: "center",
            borderRadius: "12px",
            border: "1px solid #fdba74",
        },
    });

    const nextStep = makePanel(
        "NextStep",
        "Next step • Review the trend, acknowledge the active alarm, and then approve the fill line dispatch.",
        "#f8fafc",
        "#0f172a",
    );

    const activityLog = makePanel(
        "ActivityLog",
        "Activity • Shift handover opened. No new command has been sent yet.",
        "#eef2ff",
        "#312e81",
    );

    const insightRow = new CardHolder({
        name: "InsightRow",
        description: "Operator guidance and activity",
        columns: [1, 1],
        gap: 2,
    });
    insightRow.addCard(nextStep, 1);
    insightRow.addCard(activityLog, 2);

    const beginButton = new PrimaryButton({
        label: "Release Batch",
        style: {
            backgroundColor: "#2563eb",
            color: "#ffffff",
            padding: "14px 18px",
            fontSize: "16px",
            fontWeight: "bold",
            borderRadius: "12px",
            border: "2px solid #1d4ed8",
        },
    }).onClicked((ctx) => {
        ctx.notify("Batch release approved")
            .consoleLog("Batch release approved")
            .setText(hero.model.id, "Shift Operations Center • RUNNING")
            .setText(statusBanner.model.id, "Status • Batch released and line is ramping up")
            .setStyle(statusBanner.model.id, {
                backgroundColor: "#dcfce7",
                color: "#166534",
                border: "1px solid #86efac",
            })
            .setText(nextStep.model.id, "Next step • Verify quality hold points and monitor flow stability for 15 minutes.")
            .setText(activityLog.model.id, "Activity • Batch B-2026-041 released to production.")
            .setText(readiness.model.id, "Line Readiness • 100%")
            .setText(criticals.model.id, "Critical Alarms • 0 open");
    });

    const ackButton = new WarningButton({
        label: "Acknowledge Alarm",
        style: {
            backgroundColor: "#d97706",
            color: "#ffffff",
            padding: "14px 18px",
            fontSize: "16px",
            fontWeight: "bold",
            borderRadius: "12px",
            border: "2px solid #b45309",
        },
    }).onClicked((ctx) => {
        ctx.notify("Alarm acknowledged")
            .consoleLog("Alarm acknowledged")
            .setText(statusBanner.model.id, "Status • Low-pressure alarm acknowledged by shift supervisor")
            .setStyle(statusBanner.model.id, {
                backgroundColor: "#fffbeb",
                color: "#92400e",
                border: "1px solid #fcd34d",
            })
            .setText(nextStep.model.id, "Next step • Confirm pressure recovery and continue with the dispatch review.")
            .setText(activityLog.model.id, "Activity • Boiler feed pressure alarm acknowledged and under observation.")
            .setText(criticals.model.id, "Critical Alarms • 0 acknowledged");
    });

    const holdButton = new WarningButton({
        label: "Place on Hold",
        style: {
            backgroundColor: "#7c3aed",
            color: "#ffffff",
            padding: "14px 18px",
            fontSize: "16px",
            fontWeight: "bold",
            borderRadius: "12px",
            border: "2px solid #6d28d9",
        },
    }).onClicked((ctx) => {
        ctx.notify("Line placed on hold")
            .consoleLog("Line placed on hold")
            .setText(hero.model.id, "Shift Operations Center • HOLD")
            .setText(statusBanner.model.id, "Status • Dispatch paused pending quality review")
            .setStyle(statusBanner.model.id, {
                backgroundColor: "#ede9fe",
                color: "#5b21b6",
                border: "1px solid #c4b5fd",
            })
            .setText(nextStep.model.id, "Next step • Review quality sample and release only after lab confirmation.")
            .setText(activityLog.model.id, "Activity • Fill line placed on hold for quality verification.")
            .setText(readiness.model.id, "Line Readiness • 82%");
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
        },
    }).onClicked((ctx) => {
        ctx.notify("Emergency stop triggered")
            .consoleLog("Emergency stop triggered")
            .setText(hero.model.id, "Shift Operations Center • STOPPED")
            .setText(statusBanner.model.id, "Status • Emergency stop active — line secured")
            .setStyle(statusBanner.model.id, {
                backgroundColor: "#fee2e2",
                color: "#991b1b",
                border: "1px solid #fca5a5",
            })
            .setText(nextStep.model.id, "Next step • Isolate the unit, investigate the cause, and reopen only after clearance.")
            .setText(activityLog.model.id, "Activity • Emergency stop sent from operations center.")
            .setText(readiness.model.id, "Line Readiness • 0%")
            .setText(criticals.model.id, "Critical Alarms • 3 open");
    });

    const actionRow = new CardHolder({
        name: "ActionRow",
        description: "Shift action shortcuts",
        columns: [1, 1, 1, 1],
        gap: 2,
    });
    actionRow.addCard(beginButton, 1);
    actionRow.addCard(ackButton, 2);
    actionRow.addCard(holdButton, 3);
    actionRow.addCard(stopButton, 4);

    const trendHeader = makeHeader("TrendHeader", "Live Trend — monitor flow and temperature before release");

    const trend = new Chart({
        name: "OperationsTrend",
        description: "Core process trend for dispatch decisions",
        chart: {
            class: "Trend",
            name: "Shift Readiness Trend",
            description: "Flow and temperature history",
            cursors: [
                {
                    id: 1,
                    timestamp: "*-2h",
                    context: "Readiness review window",
                },
            ],
            x_axis: [
                {
                    id: 1,
                    name: "Last 8 Hours",
                    description: "Current shift",
                    start_time: "*-8h",
                    end_time: "*",
                    intervals_no: 48,
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
                    description: "t/h",
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
            showToolbar: false,
        },
        inspector: {
            showCrosshairPanel: true,
            showCursorsPanel: true,
            showModifiedDataPanel: true,
            showPropertiesPanel: true,
        },
    }).onDataPointClick((ctx) => {
        ctx.notify("Trend data point selected")
            .setText(activityLog.model.id, "Activity • Trend point selected during shift readiness review.")
            .setText(nextStep.model.id, "Next step • Compare the selected point with the unit queue and release decision.");
    });

    const queueHeader = makeHeader("QueueHeader", "Unit Queue — review which equipment is ready for the next dispatch");

    const unitQueue = new Table({
        name: "UnitQueue",
        description: "Operations queue by unit",
        showCaption: false,
        data: [
            {
                unit: "Mixer-01",
                stage: "Blending",
                owner: "Nadia",
                status: "Ready",
                eta: "08 min",
                action: "Release batch",
            },
            {
                unit: "Reactor-02",
                stage: "Heat hold",
                owner: "Omar",
                status: "Watch",
                eta: "12 min",
                action: "Check pressure",
            },
            {
                unit: "Filler-03",
                stage: "Packaging",
                owner: "Lina",
                status: "Hold",
                eta: "18 min",
                action: "Quality review",
            },
            {
                unit: "Tank-04",
                stage: "CIP",
                owner: "Yousef",
                status: "Offline",
                eta: "35 min",
                action: "Wait for clean release",
            },
        ],
        schema: [
            { name: "unit", title: "Unit", filter: "text" },
            { name: "stage", title: "Stage", filter: "text" },
            { name: "owner", title: "Owner", filter: "select+text" },
            {
                name: "status",
                title: "Status",
                filter: "select",
                rules: [
                    {
                        type: "equal",
                        value: "Ready",
                        style: { backgroundColor: "#dcfce7", color: "#166534", fontWeight: "bold" },
                    },
                    {
                        type: "equal",
                        value: "Watch",
                        style: { backgroundColor: "#fef3c7", color: "#92400e", fontWeight: "bold" },
                    },
                    {
                        type: "equal",
                        value: "Hold",
                        style: { backgroundColor: "#ede9fe", color: "#5b21b6", fontWeight: "bold" },
                    },
                    {
                        type: "equal",
                        value: "Offline",
                        style: { backgroundColor: "#fee2e2", color: "#991b1b", fontWeight: "bold" },
                    },
                ],
            },
            { name: "eta", title: "ETA", filter: "text" },
            { name: "action", title: "Action", filter: "text" },
        ],
        options: {
            alternateRowColoring: true,
            allowSorting: true,
            pagination: false,
            showToolbar: false,
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
        ctx.notify("Unit selected")
            .setText(activityLog.model.id, "Activity • Unit selected from the dispatch queue for closer review.")
            .setText(nextStep.model.id, "Next step • Confirm the selected unit owner and action before release.");
    });

    const handoverHeader = makeHeader("HandoverHeader", "Shift Handover — capture decisions and assign the next action owner");

    const handoverForm = new Form({
        name: "HandoverForm",
        description: "Shift handover form",
        entries: [
            {
                id: "shiftLead",
                type: "input",
                label: "Shift Lead",
                description: "Person taking ownership of the next action.",
                value: "Nadia Hassan",
            },
            {
                id: "handoverType",
                type: "select",
                label: "Decision",
                description: "Choose the operational outcome for the current review.",
                value: "Release Batch",
                items: [
                    { label: "Release Batch", value: "Release Batch" },
                    { label: "Hold for Quality", value: "Hold for Quality" },
                    { label: "Maintenance Review", value: "Maintenance Review" },
                ],
            },
            {
                id: "targetTime",
                type: "date",
                label: "Target Time",
                description: "When the action should be completed.",
                value: "2026-04-07T09:30:00.000Z",
                format: "Do MMM YYYY, HH:mm",
                timeIntervals: 15,
            },
            {
                id: "priority",
                type: "buttons",
                label: "Priority",
                description: "Operational urgency for the handover item.",
                value: "Normal",
                items: [
                    { color: "green", label: "Normal", value: "Normal" },
                    { color: "yellow", label: "Urgent", value: "Urgent" },
                    { color: "blue", label: "Blocked", value: "Blocked" },
                ],
            },
        ],
        options: {
            showRefreshButton: false,
            showToolbar: false,
            submitButton: { label: "Save Handover Decision" },
            style: {
                backgroundColor: "#ffffff",
                color: "#0f172a",
                fontSize: "14px",
            },
        },
    }).onSubmit((ctx) => {
        ctx.notify("Handover saved")
            .consoleLog("Handover saved")
            .setText(statusBanner.model.id, "Status • Handover captured and waiting for execution owner")
            .setStyle(statusBanner.model.id, {
                backgroundColor: "#ecfeff",
                color: "#155e75",
                border: "1px solid #a5f3fc",
            })
            .setText(activityLog.model.id, "Activity • Shift handover saved and shared with the next action owner.")
            .setText(nextStep.model.id, "Next step • Follow the runbook on the right and confirm completion at the target time.");
    });

    const runbook = new MarkdownViewer({
        name: "Runbook",
        description: "Shift runbook and escalation steps",
        content: [
            "# Shift Runbook",
            "",
            "## Before releasing the next batch",
            "- Confirm the active alarm is acknowledged.",
            "- Check the trend for stable flow and temperature.",
            "- Verify the selected unit is marked **Ready** in the queue.",
            "",
            "## If the line is on hold",
            "1. Inform quality and maintenance.",
            "2. Capture the decision in the handover form.",
            "3. Recheck the queue ETA before restarting.",
            "",
            "## Escalation",
            "- **Supervisor:** Nadia Hassan",
            "- **Maintenance:** Omar Khaled",
            "- **Quality:** Lina Saleh",
        ].join("\n"),
        style: {
            backgroundColor: "#ffffff",
            color: "#0f172a",
            height: "320px",
        },
    });

    const handoverRow = new CardHolder({
        name: "HandoverRow",
        description: "Handover form and runbook",
        columns: [1, 1],
        gap: 2,
    });
    handoverRow.addCard(handoverForm, 1);
    handoverRow.addCard(runbook, 2);

    const layout = new GridLayout({
        columns: [1],
        rows: [4, 4, 6, 5, 6, 7, 3, 16, 3, 16, 3, 14],
        gap: 2,
        padding: { x: 2, y: 2 },
        spacing: { x: 2, y: 2 },
        numberOfColumns: 96,
        numberOfRows: { type: "height", value: 30 },
        stacking: "none",
    });

    const app = new App({ layout });
    app.add(hero, 1, 1);
    app.add(summary, 1, 2);
    app.add(kpiRow, 1, 3);
    app.add(statusBanner, 1, 4);
    app.add(insightRow, 1, 5);
    app.add(actionRow, 1, 6);
    app.add(trendHeader, 1, 7);
    app.add(trend, 1, 8);
    app.add(queueHeader, 1, 9);
    app.add(unitQueue, 1, 10);
    app.add(handoverHeader, 1, 11);
    app.add(handoverRow, 1, 12);

    return app.build();
}

export const page = createOperationsCenterApp();

export default page;
