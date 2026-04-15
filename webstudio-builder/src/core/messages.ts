// Typed message helpers for WebStudio widget-to-widget communication.
// Each factory builds a SendAction with a typed topic and payload.
//
// Usage:
//   ctx.push(messages.refresh("widgetId"))
//   ctx.push(messages.addPens("chartId", ["/Path/To/Pen"]))
//   ctx.push(messages.setTimeSpan("chartId", starttime, endtime))

import {
    ActionMessage,
    SendAction,
    WidgetTarget,
} from "./types";

// ─── Core send builder ────────────────────────────────────────────────────────

function buildSend(to: WidgetTarget, topic: string, payload?: unknown): SendAction {
    const msg: ActionMessage = { topic };
    if (payload !== undefined) {
        msg.payload = payload;
    }
    return { type: "send", to, message: msg };
}

// ─── Topic helpers ────────────────────────────────────────────────────────────

/** Send a refresh message (re-run data source + lifecycle) */
export function refresh(to: WidgetTarget, payload?: unknown): SendAction {
    return buildSend(to, "refresh", payload);
}

/** Send an update message (update without re-fetching) */
export function update(to: WidgetTarget, payload?: unknown): SendAction {
    return buildSend(to, "update", payload);
}

/** Add a tab to a tabs widget */
export function addTab(
    to: WidgetTarget,
    tab: Record<string, unknown>,
    activateTab = true,
): SendAction {
    return buildSend(to, "addTab", { tab, activateTab });
}

/** Switch the active tab in a tabs widget */
export function setActiveTab(
    to: WidgetTarget,
    options: { id?: string; activate?: "first" | "last" | "next" | "nextWithRotate" | "previous" | "previousWithRotate" | "none" },
): SendAction {
    return buildSend(to, "setActiveTab", options);
}

/** Add pen(s) to a chart widget */
export function addPens(
    to: WidgetTarget,
    pens: Array<string | Record<string, unknown>>,
): SendAction {
    return buildSend(to, "addPens", { pens });
}

/** Set the tag search table on a chart widget */
export function setTagTable(
    to: WidgetTarget,
    tagTable: string,
    prompt = false,
): SendAction {
    return buildSend(to, "setTagTable", { tagTable, prompt });
}

/** Set the time span on a chart widget */
export function setTimeSpan(
    to: WidgetTarget,
    starttime: string | number,
    endtime: string | number,
): SendAction {
    return buildSend(to, "setTimeSpan", { starttime, endtime });
}

/** Replace all cursors on a chart widget */
export function setCursors(
    to: WidgetTarget,
    cursors: Array<{ id?: number; timestamp: string | number; context?: unknown; locked?: boolean }>,
): SendAction {
    return buildSend(to, "setCursors", cursors);
}

/** Add cursors to a chart widget */
export function addCursors(
    to: WidgetTarget,
    cursors: Array<{ id?: number; timestamp: string | number; context?: unknown; locked?: boolean }>,
): SendAction {
    return buildSend(to, "addCursors", cursors);
}

/** Load a compilation in a container or tabs widget */
export function loadCompilation(
    to: WidgetTarget,
    compilation: {
        subType?: "function" | "object-name" | "compilation-field";
        lib?: string;
        func?: string;
        farg?: unknown;
        objspec?: string | number;
        name?: string;
        ctx?: string;
    },
): SendAction {
    return buildSend(to, "loadCompilation", compilation);
}

/** Clear a chart and start fresh */
export function newChart(to: WidgetTarget): SendAction {
    return buildSend(to, "newChart");
}

/** Remove all unreferenced pens and axes from a chart */
export function cleanUpChart(to: WidgetTarget): SendAction {
    return buildSend(to, "cleanUpChart");
}

/** Select specific rows in a table widget */
export function selectRows(
    to: WidgetTarget,
    rowIndex: number[],
): SendAction {
    return buildSend(to, "selectRows", { rowIndex });
}

/** Set the active page in a diagrams widget */
export function setActiveDiagramsPage(
    to: WidgetTarget,
    pageId: string,
): SendAction {
    return buildSend(to, "setActiveDiagramsPage", { id: pageId });
}

/** Select a node in a tree widget */
export function selectTreeNode(
    to: WidgetTarget,
    id: string | number,
): SendAction {
    return buildSend(to, "selectTreeNode", { id });
}
