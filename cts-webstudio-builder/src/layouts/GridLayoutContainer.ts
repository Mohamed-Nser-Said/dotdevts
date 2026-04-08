import { ContainerModel } from "../core/types";
import { GridLayout, GridLayoutOptions } from "./GridLayout";

// A container widget that embeds a full GridLayout compilation.
// Renders as type "container" in WebStudio with nested widgets.
export class GridLayoutContainer {
    model: ContainerModel;
    layout: GridLayout;

    constructor(options: GridLayoutOptions & { name?: string; description?: string }) {
        options = options || {};
        this.layout = new GridLayout(options);
        this.model = {
            type: "container",
            name: options.name || "Container",
            description: options.description || "Grid Container",
            id: syslib.uuid(),
            compilation: {},
            options: {
                spacing: { x: options.gap || 0, y: options.gap || 0 },
            },
            captionBar: false,
        };
    }

    addWidget(widget: object, col: number, row: number): void {
        this.layout.addWidget(widget, col, row);
    }

    getModel(): ContainerModel {
        this.model.compilation = this.layout.getModel();
        return this.model;
    }
}
