import { ButtonActions, ButtonModel, StyleProps } from "../core/types";
import { Window } from "../core/Window";
import { BaseWidget, BaseWidgetProps } from "./BaseWidget";

export interface ButtonProps extends BaseWidgetProps<ButtonActions> {
    label?: string;
    style?: Partial<StyleProps>;
    disabled?: boolean;
}

const defaultStyle: StyleProps = {
    fontSize: "16px",
    borderRadius: "4px",
    backgroundColor: "#007bff",
    color: "#ffffff",
    padding: "10px 20px",
    cursor: "pointer",
};

export class Button extends BaseWidget<ButtonModel, ButtonActions> {
    constructor(props?: ButtonProps) {
        super(props && props.window ? props.window : undefined);
        props = props || {};

        this.model = {
            type: "button",
            name: this.getName(props, "Button"),
            captionBar: false,
            description: this.getDescription(props, "Button"),
            label: props.label || props.name || "Button",
            id: this.createId(),
            disabled: props.disabled || false,
            actions: this.getActions(props, { onClick: [] }),
            options: { style: props.style || defaultStyle },
            toolbars: [],
        };
    }

    setLabel(label: string): this {
        this.model.label = label;
        return this;
    }

    setDisabled(disabled = true): this {
        this.model.disabled = disabled;
        return this;
    }

    setStyle(style: Partial<StyleProps>): this {
        this.model.options.style = {
            ...(this.model.options.style || {}),
            ...style,
        };
        return this;
    }

    private registerHook(hook: string, handler: (ctx: Window) => void): this {
        this.model.actions = this.addHook(this.model.actions, hook, handler);
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
