import { CompilationNumberOfRows, CompilationOptions, Layout } from "../core/types";
import { IWidget } from "../interfaces/IWidget";


export type LayoutOptions = {
    padding?: { x?: number; y?: number };
    spacing?: { x?: number; y?: number };
    numberOfColumns?: number;
    numberOfRows?: number | Partial<CompilationNumberOfRows>;
    stacking?: "none" | "vertical" | "horizontal";
    showDevTools?: boolean;
    staticWidgets?: boolean;
    gap?: number;
    columns?: number[];
    rows?: number[];

}


// Calculates pixel-grid cell positions from fractional column/row weights.
// All positions are expressed as fractions of virtual columns/rows.
export class WidgetLayout {
    public readonly columns: number[];
    public readonly rows: number[];
    public readonly staticWidgets: boolean;
    public readonly modelOptions: CompilationOptions;

    constructor(options: LayoutOptions = {}) {
        this.columns = options.columns ?? [1];
        this.rows = options.rows ?? [1];
        this.staticWidgets = options.staticWidgets ?? true;

        const spacingX = options.gap ?? options.spacing?.x ?? 0;
        const spacingY = options.gap ?? options.spacing?.y ?? 0;

        const numberOfRows: CompilationNumberOfRows = typeof options.numberOfRows === "number"
            ? { type: "count", value: options.numberOfRows }
            : { type: options.numberOfRows?.type ?? "count", value: options.numberOfRows?.value ?? 96 };

        this.modelOptions = {
            numberOfColumns: options.numberOfColumns ?? 96,
            numberOfRows,
            stacking: options.stacking ?? "none",
            padding: { x: options.padding?.x ?? 0, y: options.padding?.y ?? 0 },
            spacing: { x: spacingX, y: spacingY },
            showDevTools: options.showDevTools ?? false,
        };
    }


    private get colTotal(): number {
        return this.columns.reduce((s, w) => s + w, 0);
    }

    private get rowTotal(): number {
        return this.rows.reduce((s, w) => s + w, 0);
    }

    private get availableCols(): number {
        const { numberOfColumns, spacing, padding } = this.modelOptions;
        return Math.max(0, numberOfColumns - (this.columns.length - 1) * spacing.x - padding.x * 2);
    }

    // In "height" mode WebStudio applies spacing/padding itself; row coords are pure weight units.
    private get isHeightMode(): boolean {
        return this.modelOptions.numberOfRows.type === "height";
    }

    private get availableRows(): number {
        if (this.isHeightMode) return this.rowTotal;
        const { numberOfRows, spacing, padding } = this.modelOptions;
        return Math.max(0, numberOfRows.value - (this.rows.length - 1) * spacing.y - padding.y * 2);
    }

    getLayout(col: number, row: number): Layout {
        return {
            x: this.cellX(col),
            y: this.cellY(row),
            w: this.cellW(col),
            h: this.cellH(row),
            static: this.staticWidgets ?? true,
        };
    }

    setLayout(widget: IWidget, col: number, row: number): void {
        const layout = this.getLayout(col, row);
        widget.setLayout(layout);
    }

    getCompilationOptions(): CompilationOptions {
        return this.modelOptions;
    }

    // col/row are 1-based
    private cellW(col: number): number {
        if (col < 1 || col > this.columns.length) return 0;
        return Math.floor(this.availableCols * this.columns[col - 1] / this.colTotal);
    }

    private cellH(row: number): number {
        if (row < 1 || row > this.rows.length) return 0;
        return Math.floor(this.availableRows * this.rows[row - 1] / this.rowTotal);
    }

    private cellX(col: number): number {
        if (col < 1 || col > this.columns.length) return 0;
        let x = this.modelOptions.padding.x;
        for (let i = 1; i < col; i++) x += this.cellW(i) + this.modelOptions.spacing.x;
        return x;
    }

    private cellY(row: number): number {
        if (row < 1 || row > this.rows.length) return 0;
        const padY = this.isHeightMode ? 0 : this.modelOptions.padding.y;
        const spacY = this.isHeightMode ? 0 : this.modelOptions.spacing.y;
        let y = padY;
        for (let i = 1; i < row; i++) y += this.cellH(i) + spacY;
        return y;
    }
}

