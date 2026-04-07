import "../../prelude";

import { App } from "../../cts-webstudio-builder/src/core/App";
import { PrimaryButton } from "../../cts-webstudio-builder/src/components/PrimaryButton";
import { WarningButton } from "../../cts-webstudio-builder/src/components/WarningButton";
import { CriticalActionButton } from "../../cts-webstudio-builder/src/components/CriticalActionButton";
import { Compilation } from "../../cts-webstudio-builder/src/core/types";
import { GridLayout } from "../../cts-webstudio-builder/src/layouts/GridLayout";
import { HLayoutContainer } from "../../cts-webstudio-builder/src/layouts/HLayoutContainer";
import { Text } from "../../cts-webstudio-builder/src/widgets/Text";

function makeKpiCard(name: string, value: string, background: string): Text {
    return new Text({
        name,
        text: `${name}\n${value}`,
        showCaption: false,
        style: {
            background,
            color: "#ffffff",
            padding: "18px",
            fontSize: "20px",
            fontWeight: "bold",
            textAlign: "left",
            borderRadius: "14px",
            boxShadow: "0 10px 24px rgba(15, 23, 42, 0.18)",
            border: "1px solid rgba(255,255,255,0.10)",
        },
    });
}

function makePanelText(name: string, text: string): Text {
    return new Text({
        name,
        text,
        showCaption: false,
        style: {
            backgroundColor: "#f8fafc",
            color: "#0f172a",
            padding: "14px",
            fontSize: "16px",
            textAlign: "left",
            borderRadius: "12px",
            border: "1px solid #dbeafe",
            boxShadow: "0 4px 14px rgba(37, 99, 235, 0.08)",
        },
    });
}

/**
 * More complete WebStudio example page.
 *
 * Renders a small operations dashboard with:
 * - a styled hero header
 * - KPI cards
 * - a visible control center with clickable buttons
 * - interactive status panels that update on click
 */
export function createSimpleWebStudioPage(): Compilation {
    const hero = new Text({
        name: "Hero",
        text: "Smart Operations Dashboard",
        showCaption: false,
        style: {
            background: "linear-gradient(135deg, #0f172a, #2563eb)",
            color: "#ffffff",
            padding: "20px",
            fontSize: "30px",
            fontWeight: "bold",
            textAlign: "center",
            borderRadius: "16px",
            boxShadow: "0 14px 30px rgba(15, 23, 42, 0.22)",
        },
    });

    const subtitle = new Text({
        name: "Subtitle",
        text: "A polished starter page built with dotdevts WebStudio widgets and layouts.",
        showCaption: false,
        style: {
            backgroundColor: "#e0f2fe",
            color: "#0f172a",
            padding: "12px",
            fontSize: "16px",
            textAlign: "center",
            borderRadius: "12px",
            border: "1px solid #bae6fd",
        },
    });

    const lineState = makeKpiCard("Line State", "STABLE", "linear-gradient(135deg, #0891b2, #06b6d4)");
    const throughput = makeKpiCard("Throughput", "24.8 t/h", "linear-gradient(135deg, #2563eb, #3b82f6)");
    const alarms = makeKpiCard("Active Alarms", "0", "linear-gradient(135deg, #16a34a, #22c55e)");

    const kpiRow = new HLayoutContainer({
        name: "KpiRow",
        description: "Key metrics",
        columns: [1, 1, 1],
        gap: 2,
    });
    kpiRow.addWidget(lineState, 1);
    kpiRow.addWidget(throughput, 2);
    kpiRow.addWidget(alarms, 3);

    const controlHeader = new Text({
        name: "ControlHeader",
        text: "Control Center — the buttons below are clickable",
        showCaption: false,
        style: {
            background: "linear-gradient(135deg, #1e293b, #334155)",
            color: "#ffffff",
            padding: "14px",
            fontSize: "20px",
            fontWeight: "bold",
            textAlign: "center",
            borderRadius: "12px",
            boxShadow: "0 8px 18px rgba(15, 23, 42, 0.16)",
        },
    });

    const actionStatus = new Text({
        name: "ActionStatus",
        text: "System ready — choose an action",
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

    const activityLog = makePanelText("ActivityLog", "Last event: none yet.");

    const startButton = new PrimaryButton({
        label: "Start Batch",
        style: {
            padding: "12px 18px",
            fontSize: "16px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
        },
    }).onClicked((ctx) => {
        ctx.notify("Batch A start command sent");
        ctx.consoleLog("Batch A start command sent");
        ctx.modify(actionStatus.model.id, [
            { name: "model.text", value: "Batch A is starting" },
        ]);
        ctx.modify(activityLog.model.id, [
            { name: "model.text", value: "Last event: Start Batch pressed — ramping up production." },
        ]);
        ctx.modify(lineState.model.id, [
            { name: "model.text", value: "Line State\nRUNNING" },
        ]);
        ctx.modify(alarms.model.id, [
            { name: "model.text", value: "Active Alarms\n0" },
        ]);
    });

    const maintainButton = new WarningButton({
        label: "Maintenance",
        style: {
            padding: "12px 18px",
            fontSize: "16px",
            borderRadius: "10px",
        },
    }).onClicked((ctx) => {
        ctx.notify("Maintenance mode enabled");
        ctx.consoleLog("Maintenance mode enabled");
        ctx.modify(actionStatus.model.id, [
            { name: "model.text", value: "Maintenance mode scheduled" },
        ]);
        ctx.modify(activityLog.model.id, [
            { name: "model.text", value: "Last event: Maintenance selected — operators notified." },
        ]);
        ctx.modify(lineState.model.id, [
            { name: "model.text", value: "Line State\nSERVICE" },
        ]);
    });

    const stopButton = new CriticalActionButton({
        label: "Emergency Stop",
        style: {
            padding: "12px 18px",
            fontSize: "16px",
            borderRadius: "10px",
        },
    }).onClicked((ctx) => {
        ctx.notify("Emergency stop triggered");
        ctx.consoleLog("Emergency stop triggered");
        ctx.modify(actionStatus.model.id, [
            { name: "model.text", value: "Emergency stop active" },
        ]);
        ctx.modify(activityLog.model.id, [
            { name: "model.text", value: "Last event: Emergency stop pressed — line halted immediately." },
        ]);
        ctx.modify(lineState.model.id, [
            { name: "model.text", value: "Line State\nSTOPPED" },
        ]);
        ctx.modify(alarms.model.id, [
            { name: "model.text", value: "Active Alarms\n1 HIGH" },
        ]);
    });

    const actionButtons = new HLayoutContainer({
        name: "ActionButtons",
        description: "Operator actions",
        columns: [1, 1, 1],
        gap: 2,
    });
    actionButtons.addWidget(startButton, 1);
    actionButtons.addWidget(maintainButton, 2);
    actionButtons.addWidget(stopButton, 3);

    const overviewPanels = new HLayoutContainer({
        name: "OverviewPanels",
        description: "Overview panels",
        columns: [1, 1],
        gap: 2,
    });
    overviewPanels.addWidget(makePanelText("Overview1", "Plant summary: all units are online, product quality is within target, and no active trips are present."), 1);
    overviewPanels.addWidget(makePanelText("Overview2", "Recommended next step: use the visible buttons above and watch the status cards update immediately."), 2);

    const detailsPanel = makePanelText(
        "Overview3",
        "UI notes: this example uses gradients, rounded corners, shadows, KPI cards, and clearly visible action buttons to act as a richer dashboard starter template.",
    );

    const footer = new Text({
        name: "Footer",
        text: "Tip: the clickable buttons are now shown directly on the main page under Control Center.",
        showCaption: false,
        style: {
            backgroundColor: "#f8fafc",
            color: "#475569",
            padding: "12px",
            fontSize: "14px",
            textAlign: "center",
            borderRadius: "12px",
            border: "1px dashed #cbd5e1",
        },
    });

    const app = new App({
        layout: new GridLayout({ columns: [1], rows: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1] }),
    });

    app.add(hero, { col: 1, row: 1 });
    app.add(subtitle, { col: 1, row: 2 });
    app.add(kpiRow, { col: 1, row: 3 });
    app.add(controlHeader, { col: 1, row: 4 });
    app.add(actionStatus, { col: 1, row: 5 });
    app.add(actionButtons, { col: 1, row: 6 });
    app.add(activityLog, { col: 1, row: 7 });
    app.add(overviewPanels, { col: 1, row: 8 });
    app.add(detailsPanel, { col: 1, row: 9 });
    app.add(footer, { col: 1, row: 10 });

    return app.build();
}

export const page = createSimpleWebStudioPage();

export default page;
