import { ActionSequence, ContainerModel, WidgetActions } from "../core/types";
import { Window } from "../core/Window";
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
            captionBar: false,
        };
    }

    addWidget(widget: object, col: number): void {
        this.layout.addWidget(widget, col);
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
