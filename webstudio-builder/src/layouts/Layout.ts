import { Compilation } from "../core/types";
import { Grid } from "./Grid";

function makeCompilation(grid: Grid): Compilation {
    return {
        version: "1",
        info: {},
        rootOnly: {},
        actions: {},
        widgets: [],
        options: {
            stacking: grid.modelOptions.stacking,
            numberOfColumns: grid.modelOptions.numberOfColumns,
            numberOfRows: {
                type: grid.modelOptions.numberOfRows.type,
                value: grid.modelOptions.numberOfRows.value,
            },
            padding: {
                x: grid.modelOptions.padding.x,
                y: grid.modelOptions.padding.y,
            },
            spacing: {
                x: grid.modelOptions.spacing.x,
                y: grid.modelOptions.spacing.y,
            },
            showDevTools: grid.modelOptions.showDevTools,
        },
    };
}

export class Layout {
    model: Compilation;
    grid: Grid;

    constructor(grid: Grid) {
        this.grid = grid;
        this.model = makeCompilation(grid);
    }

    addWidget(widget: any, col: number, row: number): void {
        let widgetModel: Record<string, unknown>;
        if (typeof widget.getModel === "function") {
            widgetModel = widget.getModel() as Record<string, unknown>;
        } else {
            widgetModel = widget as Record<string, unknown>;
        }

        // Shallow copy so we don't mutate the source model
        const widgetCopy: Record<string, unknown> = {};
        for (const k in widgetModel) {
            widgetCopy[k] = widgetModel[k];
        }

        const cell = this.grid.getCell(col, row);
        const existingLayout = widgetModel.layout as { static?: boolean } | undefined;

        widgetCopy.layout = { x: cell.x, y: cell.y, w: cell.w, h: cell.h };
        if (existingLayout && existingLayout.static === true) {
            (widgetCopy.layout as Record<string, unknown>).static = true;
        }

        this.model.widgets.push(widgetCopy as object);
    }

    getModel(): Compilation {
        return this.model;
    }
}
