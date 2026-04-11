import { ActionSequence, ContainerModel, WidgetActions } from "../core/types";
import { Window } from "../core/Window";
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

    setActions(actions: WidgetActions): this {
        const compilation = this.layout.getModel();
        compilation.actions = actions;
        return this;
    }

    addAction(name: string, action: ActionSequence | ((ctx: Window) => void)): this {
        const compilation = this.layout.getModel();
        if (!compilation.actions) {
            compilation.actions = {};
        }

        if (typeof action === "function") {
            const ctx = new Window();
            action(ctx);
            compilation.actions[name] = ctx.getActions();
        } else {
            compilation.actions[name] = action;
        }

        return this;
    }

    addDelegatedAction(name: string, action: ActionSequence | ((ctx: Window) => void)): this {
        if (typeof action === "function") {
            const ctx = new Window();
            action(ctx);
            return this.addAction(name, { type: "delegate", action: ctx.getActions() });
        }

        return this.addAction(name, { type: "delegate", action });
    }

    getModel(): ContainerModel {
        this.model.compilation = this.layout.getModel();
        return this.model;
    }
}
