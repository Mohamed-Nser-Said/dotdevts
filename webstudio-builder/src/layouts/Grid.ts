export interface GridSpacing {
    x?: number;
    y?: number;
}

export interface GridOptions {
    columns?: number[];
    rows?: number[];
    gap?: number;
    padding?: GridSpacing;
    spacing?: GridSpacing;
    numberOfColumns?: number;
    numberOfRows?: number | { type?: string; value?: number };
    stacking?: string;
    showDevTools?: boolean;
}

export interface CellLayout {
    x: number;
    y: number;
    w: number;
    h: number;
}

interface GridModelOptions {
    numberOfColumns: number;
    numberOfRows: { type: string; value: number };
    padding: { x: number; y: number };
    spacing: { x: number; y: number };
    stacking: string;
    showDevTools?: boolean;
}

// Calculates pixel-grid cell positions from fractional column/row weights.
// All positions are expressed as fractions of 96 virtual columns/rows.
export class Grid {
    columns: number[];
    rows: number[];
    totalColumnsSize: number;
    totalRowsSize: number;
    modelOptions: GridModelOptions;

    constructor(options?: GridOptions) {
        options = options || {};
        const gap = options.gap !== undefined ? options.gap : 0;
        const padding = options.padding || {};
        const spacing = options.spacing || {};
        const numberOfRows = options.numberOfRows;
        const resolvedNumberOfRows = typeof numberOfRows === "number"
            ? { type: "height", value: numberOfRows }
            : {
                type: (numberOfRows && numberOfRows.type) ? numberOfRows.type : "square",
                value: (numberOfRows && numberOfRows.value !== undefined) ? numberOfRows.value : 0,
            };

        this.columns = options.columns || [1];
        this.rows = options.rows || [1];
        this.modelOptions = {
            numberOfColumns: options.numberOfColumns !== undefined ? options.numberOfColumns : 96,
            numberOfRows: resolvedNumberOfRows,
            padding: {
                x: padding.x !== undefined ? padding.x : 0,
                y: padding.y !== undefined ? padding.y : 0,
            },
            spacing: {
                x: spacing.x !== undefined ? spacing.x : gap,
                y: spacing.y !== undefined ? spacing.y : gap,
            },
            stacking: options.stacking || "none",
            showDevTools: options.showDevTools,
        };
        this.totalColumnsSize = 0;
        this.totalRowsSize = 0;

        for (const col of this.columns) {
            this.totalColumnsSize += col;
        }
        for (const row of this.rows) {
            this.totalRowsSize += row;
        }
    }

    private getAvailableColumnSpace(): number {
        const totalSpacing = (this.columns.length - 1) * this.modelOptions.spacing.x;
        const totalPadding = this.modelOptions.padding.x * 2;
        const available = this.modelOptions.numberOfColumns - totalSpacing - totalPadding;
        return available > 0 ? available : 0;
    }

    private usesFixedRowHeight(): boolean {
        const rowType = this.modelOptions.numberOfRows.type;
        return rowType === "height" || rowType === "square";
    }

    private getAvailableRowSpace(): number {
        if (this.usesFixedRowHeight()) {
            return this.totalRowsSize;
        }

        const totalSpacing = (this.rows.length - 1) * this.modelOptions.spacing.y;
        const totalPadding = this.modelOptions.padding.y * 2;
        const available = this.modelOptions.numberOfRows.value - totalSpacing - totalPadding;
        return available > 0 ? available : 0;
    }

    getCell(col: number, row: number): CellLayout {
        return {
            x: this.getColumnStartingPosition(col),
            y: this.getRowStartingPosition(row),
            w: this.getColumnSize(col),
            h: this.getRowSize(row),
        };
    }

    // col is 1-based (matches the Lua convention used by callers)
    getColumnSize(col: number): number {
        if (col < 1 || col > this.columns.length) {
            return 0;
        }
        return Math.floor(
            this.getAvailableColumnSpace() *
            (this.columns[col - 1] / this.totalColumnsSize)
        );
    }

    // row is 1-based
    getRowSize(row: number): number {
        if (row < 1 || row > this.rows.length) {
            return 0;
        }
        return Math.floor(
            this.getAvailableRowSpace() *
            (this.rows[row - 1] / this.totalRowsSize)
        );
    }

    getColumnStartingPosition(col: number): number {
        if (col < 1 || col > this.columns.length) {
            return 0;
        }
        let x = this.modelOptions.padding.x;
        for (let idx = 1; idx < col; idx++) {
            x += this.getColumnSize(idx) + this.modelOptions.spacing.x;
        }
        return x;
    }

    getRowStartingPosition(row: number): number {
        if (row < 1 || row > this.rows.length) {
            return 0;
        }

        // In fixed-height modes, padding/spacing are already applied by WebStudio
        // as pixel values, so we keep the layout coordinates in pure row units.
        let y = this.usesFixedRowHeight() ? 0 : this.modelOptions.padding.y;
        for (let idx = 1; idx < row; idx++) {
            y += this.getRowSize(idx);
            if (!this.usesFixedRowHeight()) {
                y += this.modelOptions.spacing.y;
            }
        }
        return y;
    }
}
