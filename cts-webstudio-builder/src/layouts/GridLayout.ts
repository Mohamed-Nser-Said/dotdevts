import { Compilation } from "../core/types";
import { Grid } from "./Grid";
import { Layout } from "./Layout";

export interface GridLayoutOptions {
    columns?: number[];
    rows?: number[];
    gap?: number;
}

export class GridLayout {
    layout: Layout;

    constructor(options?: GridLayoutOptions) {
        options = options || {};
        const grid = new Grid({
            columns: options.columns || [1],
            rows: options.rows || [1],
        });
        this.layout = new Layout(grid);
    }

    addWidget(widget: object, col: number, row: number): void {
        this.layout.addWidget(widget, col, row);
    }

    getModel(): Compilation {
        return this.layout.getModel();
    }
}
