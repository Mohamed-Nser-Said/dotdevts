import { Compilation } from "../core/types";
import { Grid } from "./Grid";
import { Layout } from "./Layout";

export interface HLayoutOptions {
    columns: number[];
    gap?: number;
}

// Horizontal layout — single row, N columns.
// addWidget(widget, col) — col is 1-based.
export class HLayout {
    layout: Layout;

    constructor(options: HLayoutOptions) {
        const grid = new Grid({
            columns: options.columns,
            rows: [1],
        });
        this.layout = new Layout(grid);
    }

    addWidget(widget: object, col: number): void {
        this.layout.addWidget(widget, col, 1);
    }

    getModel(): Compilation {
        return this.layout.getModel();
    }
}
