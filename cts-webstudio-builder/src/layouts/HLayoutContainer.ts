import { ContainerModel } from "../core/types";
import { HLayout, HLayoutOptions } from "./HLayout";

// A container widget that embeds a horizontal layout compilation.
// Renders as type "container" in WebStudio with a single-row grid of widgets.
export class HLayoutContainer {
    model: ContainerModel;
    layout: HLayout;

    constructor(options: HLayoutOptions & { name?: string; description?: string }) {
        options = options || { columns: [1] };
        this.layout = new HLayout(options);
        this.model = {
            type: "container",
            name: options.name || "HLayoutContainer",
            description: options.description || "Horizontal Layout Container",
            id: syslib.uuid(),
            compilation: {},
            options: {
                spacing: { x: options.gap || 0, y: 0 },
            },
        };
    }

    addWidget(widget: object, col: number): void {
        this.layout.addWidget(widget, col);
    }

    getModel(): ContainerModel {
        this.model.compilation = this.layout.getModel();
        return this.model;
    }
}
