// import { TabModel } from "../../core/types";
// import { IWidget } from "../../interfaces/IWidget";
// import { GridContainer } from "../../layouts/Containers";
// import { LayoutOptions } from "../../layouts/WidgetLayout";

// export interface TabProps {
//     name?: string;
//     columns: number[];
//     rows: number[];
// }

// // A single tab within a TabContainer.
// // Embeds its own Grid layout; widgets are placed into it via addWidget().
// export class Tab {
//     model: TabModel;
//     layout: GridContainer;

//     constructor(props: TabProps) {
//         props = props || { columns: [1], rows: [1] };
//         const options: LayoutOptions = { columns: props.columns, rows: props.rows };
//         this.layout = new GridContainer(options);
//         this.model = {
//             id: syslib.uuid(),
//             name: props.name || "Tab",
//             compilation: {},
//         };
//     }

//     addWidget(widget: IWidget, col: number, row: number): void {
//         this.layout.addWidget(widget, col, row);
//     }

//     getModel(): TabModel {
//         this.model.compilation = this.layout.getModel();
//         return this.model;
//     }
// }
