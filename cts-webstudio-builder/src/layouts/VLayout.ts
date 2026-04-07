import { Compilation } from "../core/types";
import { Grid } from "./Grid";
import { Layout } from "./Layout";

export interface VLayoutOptions {
    rows: number[];
    gap?: number;
}

// Vertical layout — single column, N rows.
// addWidget(widget, row) — row is 1-based.
export class VLayout {
    layout: Layout;

    constructor(options: VLayoutOptions) {
        const grid = new Grid({
            columns: [1],
            rows: options.rows,
        });
        this.layout = new Layout(grid);
    }

    addWidget(widget: object, row: number): void {
        this.layout.addWidget(widget, 1, row);
    }

    getModel(): Compilation {
        return this.layout.getModel();
    }
}
