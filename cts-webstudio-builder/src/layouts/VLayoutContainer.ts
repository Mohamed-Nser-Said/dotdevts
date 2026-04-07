import { ContainerModel } from "../core/types";
import { VLayout, VLayoutOptions } from "./VLayout";

// A container widget that embeds a vertical layout compilation.
// Renders as type "container" in WebStudio with a single-column stack of widgets.
export class VLayoutContainer {
    model: ContainerModel;
    layout: VLayout;

    constructor(options: VLayoutOptions & { name?: string; description?: string }) {
        options = options || { rows: [1] };
        this.layout = new VLayout(options);
        this.model = {
            type: "container",
            name: options.name || "VLayoutContainer",
            description: options.description || "Vertical Layout Container",
            id: syslib.uuid(),
            compilation: {},
            options: {
                spacing: { x: 0, y: options.gap || 0 },
            },
        };
    }

    addWidget(widget: object, row: number): void {
        this.layout.addWidget(widget, row);
    }

    getModel(): ContainerModel {
        this.model.compilation = this.layout.getModel();
        return this.model;
    }
}
