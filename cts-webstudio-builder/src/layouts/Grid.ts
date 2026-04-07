export interface GridOptions {
    columns?: number[];
    rows?: number[];
    gap?: number;
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
        this.columns = options.columns || [1];
        this.rows = options.rows || [1];
        this.modelOptions = {
            numberOfColumns: 96,
            numberOfRows: { type: "count", value: 96 },
            padding: { x: 0, y: 0 },
            spacing: { x: 0, y: 0 },
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
            this.modelOptions.numberOfColumns *
            (this.columns[col - 1] / this.totalColumnsSize)
        );
    }

    // row is 1-based
    getRowSize(row: number): number {
        if (row < 1 || row > this.rows.length) {
            return 0;
        }
        return Math.floor(
            this.modelOptions.numberOfRows.value *
            (this.rows[row - 1] / this.totalRowsSize)
        );
    }

    getColumnStartingPosition(col: number): number {
        if (col < 1 || col > this.columns.length) {
            return 0;
        }
        let x = 0;
        for (let idx = 1; idx < col; idx++) {
            x += this.getColumnSize(idx);
        }
        return x;
    }

    getRowStartingPosition(row: number): number {
        if (row < 1 || row > this.rows.length) {
            return 0;
        }
        let y = 0;
        for (let idx = 1; idx < row; idx++) {
            y += this.getRowSize(idx);
        }
        return y;
    }
}
