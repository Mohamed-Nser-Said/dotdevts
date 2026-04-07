import { ButtonModel, PipelineStep, StyleProps } from "../core/types";
import { Window } from "../core/Window";

export interface ButtonProps {
    name?: string;
    label?: string;
    style?: Partial<StyleProps>;
    disabled?: boolean;
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
            actions: { onClick: [] },
            options: { style: props.style || defaultStyle },
            toolbars: [],
        };
    }

    /**
     * Register an onClick handler.
     * The handler receives the Window (action recorder) as `ctx`, records
     * actions via its fluent API, then this method harvests the pipeline and
     * resets the recorder for the next use.
     */
    onClicked(handler: (ctx: Window) => void): this {
        if (!this.model.actions) {
            (this.model as any).actions = { onClick: [] };
        }
        if (!this.model.actions.onClick) {
            this.model.actions.onClick = [];
        }

        handler(this.window);

        const recorded: PipelineStep[] = this.window.getActions();
        for (const step of recorded) {
            this.model.actions.onClick.push(step);
        }

        // Reset so the same Window can be reused for other buttons
        this.window.reset();
        return this;
    }

    getModel(): ButtonModel {
        return this.model;
    }
}
