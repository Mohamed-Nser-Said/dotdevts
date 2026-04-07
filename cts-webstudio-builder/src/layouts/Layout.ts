import { Compilation } from "../core/types";
import { Grid } from "./Grid";

function makeCompilation(): Compilation {
    return {
        version: "1",
        widgets: [],
        options: {
            stacking: "none",
            numberOfColumns: 96,
            numberOfRows: { type: "count", value: 96 },
            padding: { x: 0, y: 0 },
            spacing: { x: 0, y: 0 },
        },
    };
}

export class Layout {
    model: Compilation;
    grid: Grid;

    constructor(grid: Grid) {
        this.model = makeCompilation();
        this.grid = grid;
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
        widgetCopy.layout = { x: cell.x, y: cell.y, w: cell.w, h: cell.h };
        this.model.widgets.push(widgetCopy as object);
    }

    getModel(): Compilation {
        return this.model;
    }
}
