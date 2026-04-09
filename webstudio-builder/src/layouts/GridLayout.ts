import { Compilation } from "../core/types";
import { Grid } from "./Grid";
import { Layout } from "./Layout";

export interface GridLayoutOptions {
    columns?: number[];
    rows?: number[];
    gap?: number;
    padding?: { x?: number; y?: number };
    spacing?: { x?: number; y?: number };
    numberOfColumns?: number;
    numberOfRows?: number | { type?: string; value?: number };
    stacking?: string;
    showDevTools?: boolean;
}

export class GridLayout {
    layout: Layout;

    constructor(options?: GridLayoutOptions) {
        options = options || {};
        const grid = new Grid({
            columns: options.columns || [1],
            rows: options.rows || [1],
            gap: options.gap,
            padding: options.padding,
            spacing: options.spacing,
            numberOfColumns: options.numberOfColumns,
            numberOfRows: options.numberOfRows,
            stacking: options.stacking,
            showDevTools: options.showDevTools,
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
