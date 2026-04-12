import { WebStudioCompilation, WebStudioWidget } from "./Compilation";
import { Grid, GridOptions } from "./Grid";
import { Container } from "./Container";
import { IWidget } from "../interfaces/IWidget";

function placeWidget(container: Container, grid: Grid, widget: IWidget, col: number, row: number, isStatic?: boolean): void {
    const src = widget.getModel();
    const copy = { ...src } as WebStudioWidget;
    const cell = grid.getCell(col, row);
    copy.layout = { x: cell.x, y: cell.y, w: cell.w, h: cell.h, static: isStatic != undefined ? isStatic : true };
    container.compilation.widgets.push(copy);
}

// ─── HContainer ──────────────────────────────────────────────────────────────
// Single-row, N-column layout. addWidget(widget, col) — col is 1-based.

export interface HContainerOptions {
    columns: number[];
    gap?: number;
    padding?: GridOptions["padding"];
    numberOfColumns?: number;
    showDevTools?: boolean;
}

export class HContainer {
    protected readonly grid: Grid;
    protected readonly container: Container;

    constructor(options: HContainerOptions) {
        this.grid = new Grid({ ...options, rows: [1] });
        this.container = new Container();
        this.container.compilation.setLayout(this.grid.modelOptions);
    }

    addWidget(widget: IWidget, col: number): this {
        placeWidget(this.container, this.grid, widget, col, 1);
        return this;
    }

    /** Widget model — use when nesting inside another layout. */
    getModel(): WebStudioCompilation {
        return this.container.getModel();
    }

}

// ─── VContainer ──────────────────────────────────────────────────────────────
// Single-column, N-row layout. addWidget(widget, row) — row is 1-based.

export interface VContainerOptions {
    rows: number[];
    gap?: number;
    padding?: GridOptions["padding"];
    numberOfColumns?: number;
    numberOfRows?: GridOptions["numberOfRows"];
    showDevTools?: boolean;
}

export class VContainer implements IWidget {
    protected readonly grid: Grid;
    protected readonly container: Container;

    constructor(options: VContainerOptions) {
        this.grid = new Grid({ ...options, columns: [1] });
        this.container = new Container();
        this.container.compilation.setLayout(this.grid.modelOptions);
    }

    addWidget(widget: IWidget, row: number): this {
        placeWidget(this.container, this.grid, widget, 1, row);
        return this;
    }

    /** Widget model — use when nesting inside another layout. */
    getModel():  WebStudioCompilation{
        return this.container.getModel();
    }

}

// ─── GridContainer ────────────────────────────────────────────────────────────
// Full col × row layout. addWidget(widget, col, row) — both 1-based.

export class GridContainer implements IWidget {
    protected readonly grid: Grid;
    protected readonly container: Container;

    constructor(options: GridOptions) {
        this.grid = new Grid(options);
        this.container = new Container();
        this.container.compilation.setLayout(this.grid.modelOptions);
    }

    addWidget(widget: IWidget, col: number, row: number): this {
        placeWidget(this.container, this.grid, widget, col, row);
        return this;
    }

    /** Widget model — use when nesting inside another layout. */
    getModel():  WebStudioCompilation{
        return this.container.getModel();
    }

 
}
