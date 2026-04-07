import { ButtonActions, ButtonModel, PipelineStep, StyleProps } from "../core/types";
import { Window } from "../core/Window";

export interface ButtonProps {
    name?: string;
    label?: string;
    style?: Partial<StyleProps>;
    disabled?: boolean;
    actions?: ButtonActions;
    window?: Window;
}

const defaultStyle: StyleProps = {
    fontSize: "16px",
    borderRadius: "4px",
    backgroundColor: "#007bff",
    color: "#ffffff",
    padding: "10px 20px",
    cursor: "pointer",
};

export class Button {
    model: ButtonModel;
    window: Window;

    constructor(props?: ButtonProps) {
        props = props || {};
        // Use the provided Window or create a private one — a Window is always
        // available so onClicked handlers never need a null check.
        this.window = props.window ? props.window : new Window();
        this.model = {
            type: "button",
            name: props.name || "Button",
            captionBar: false,
            description: "Button",
            label: props.label || props.name || "Button",
            id: syslib.uuid(),
            disabled: props.disabled || false,
            actions: props.actions || { onClick: [] },
            options: { style: props.style || defaultStyle },
            toolbars: [],
        };
    }

    private registerHook(hook: string, handler: (ctx: Window) => void): this {
        if (!this.model.actions) {
            this.model.actions = {};
        }
        if (!this.model.actions[hook]) {
            this.model.actions[hook] = [];
        }

        handler(this.window);

        const recorded: PipelineStep[] = this.window.getActions();
        const pipeline = this.model.actions[hook] as PipelineStep[];
        for (const step of recorded) {
            pipeline.push(step);
        }

        // Reset so the same Window can be reused for other buttons
        this.window.reset();
        return this;
    }

    /** Register any button action hook supported by WebStudio. */
    on(hook: string, handler: (ctx: Window) => void): this {
        return this.registerHook(hook, handler);
    }

    /**
     * Register an onClick handler.
     * The handler receives the Window (action recorder) as `ctx`, records
     * actions via its fluent API, then this method harvests the pipeline and
     * resets the recorder for the next use.
     */
    onClicked(handler: (ctx: Window) => void): this {
        return this.registerHook("onClick", handler);
    }

    getModel(): ButtonModel {
        return this.model;
    }
}
