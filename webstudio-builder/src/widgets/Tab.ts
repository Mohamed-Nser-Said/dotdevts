import { TabModel } from "../core/types";
import { Grid } from "../layouts/Grid";
import { Layout } from "../layouts/Layout";

export interface TabProps {
    name?: string;
    columns: number[];
    rows: number[];
}

// A single tab within a TabContainer.
// Embeds its own Grid layout; widgets are placed into it via addWidget().
export class Tab {
    model: TabModel;
    layout: Layout;

    constructor(props: TabProps) {
        props = props || { columns: [1], rows: [1] };
        const grid = new Grid({ columns: props.columns, rows: props.rows });
        this.layout = new Layout(grid);
        this.model = {
            id: syslib.uuid(),
            name: props.name || "Tab",
            compilation: {},
        };
    }

    addWidget(widget: object, col: number, row: number): void {
        this.layout.addWidget(widget, col, row);
    }

    getModel(): TabModel {
        this.model.compilation = this.layout.getModel();
        return this.model;
    }
}
