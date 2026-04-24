// import { Compilation, WebStudioCompilation, WebStudioWidget } from "./Compilation";
// import { IWidget } from "../interfaces/IWidget";
// import { ContainerModel, StyleProps } from "../core/types";

// export interface ContainerProps {
//     compilation?: Compilation;
//     style?: Partial<StyleProps>;
//     spacing?: { x: number; y: number };
//     name?: string;
//     description?: string;
//     actions?: object;
// }


// export class Container implements IWidget {
//     public readonly type = "container";
//     public readonly id: string;
//     public compilation: Compilation = new Compilation("Container");
//     public model: ContainerModel;

//     constructor(
//         public style: Partial<StyleProps> = {},
//         public spacing: { x: number; y: number } = { x: 2, y: 2 },
//         public name?: string,
//         public description: string = "Container Widget",
//         public actions?: object,
//     ) {
//         this.id = syslib.uuid();
//         this.name = name ?? ("Container" + this.id);
//         this.model = {
//             type: "container",
//             name: this.name,
//             description: this.description,
//             id: this.id,
//             compilation: this.compilation.getModel(),
//             options: {
//                 spacing: this.spacing,
//                 style: this.style,
//             },
//         };
//     }

//     setStyle(style: Partial<StyleProps>): this {
//         this.style = {
//             ...this.style,
//             ...style,
//         };
//         return this;
//     }


//     /** Returns the raw compilation — use as a top-level WebStudio page. */
//     getModel():ContainerModel {

//         this.model.compilation = this.compilation.getModel() ;
//         return this.model;
        
       
//     }
// }





// // ─── HContainer ──────────────────────────────────────────────────────────────
// // Single-row, N-column layout. addWidget(widget, col) — col is 1-based.

// export interface HContainerOptions {
//     columns: number[];
//     gap?: number;
//     padding?: GridOptions["padding"];
//     numberOfColumns?: number;
//     showDevTools?: boolean;
// }


// export class HContainer {
//     protected readonly grid: Grid;
//     protected readonly container: Container;

//     constructor(options: HContainerOptions) {
//         this.grid = new Grid({ ...options, rows: [1] });
//         this.container = new Container();
//         this.container.compilation.setLayout(this.grid.modelOptions);
//     }

//     addWidget(widget: IWidget, col: number): this {
//         placeWidget(this.container, this.grid, widget, col, 1);
//         return this;
//     }

//     /** Container widget model — use when nesting inside another layout. */
//     getModel(): ContainerModel {
//         return this.container.getModel();
//     }

// }

// // ─── VContainer ──────────────────────────────────────────────────────────────
// // Single-column, N-row layout. addWidget(widget, row) — row is 1-based.

// export interface VContainerOptions {
//     rows: number[];
//     gap?: number;
//     padding?: GridOptions["padding"];
//     numberOfColumns?: number;
//     numberOfRows?: GridOptions["numberOfRows"];
//     showDevTools?: boolean;
// }

// export class VContainer implements IWidget {
//     protected readonly grid: Grid;
//     protected readonly container: Container;

//     constructor(options: VContainerOptions) {
//         this.grid = new Grid({ ...options, columns: [1] });
//         this.container = new Container();
//         this.container.compilation.setLayout(this.grid.modelOptions);
//     }

//     addWidget(widget: IWidget, row: number): this {
//         placeWidget(this.container, this.grid, widget, 1, row);
//         return this;
//     }

//     /** Container widget model — use when nesting inside another layout. */
//     getModel(): ContainerModel {
//         return this.container.getModel();
//     }

// }

// // ─── GridContainer ────────────────────────────────────────────────────────────
// // Full col × row layout. addWidget(widget, col, row) — both 1-based.

// export class GridContainer implements IWidget {
//     protected readonly grid: Grid;
//     protected readonly container: Container;

//     constructor(options: GridOptions) {
//         this.grid = new Grid(options);
//         this.container = new Container();
//         this.container.compilation.setLayout(this.grid.modelOptions);
//     }

//     addWidget(widget: IWidget, col: number, row: number): this {
//         placeWidget(this.container, this.grid, widget, col, row);
//         return this;
//     }

//     /** Container widget model — use when nesting inside another layout. */
//     getModel(): ContainerModel {
//         return this.container.getModel();
//     }



 
// }
