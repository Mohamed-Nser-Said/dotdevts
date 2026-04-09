import { ModifyAction, StyleProps, TextModel, WidgetActions } from "../core/types";
import { Window } from "../core/Window";
import { BaseWidget, BaseWidgetProps } from "./BaseWidget";

export interface TextProps extends BaseWidgetProps<WidgetActions> {
    text?: string;
    style?: Partial<StyleProps>;
}

const defaultStyle: StyleProps = {
    color: "grey",
    textAlign: "center",
    fontSize: "26px",
    fontWeight: "bold",
    fontFamily: '"Courier New", Courier, sans-serif',
};

export class Text extends BaseWidget<TextModel> {
    constructor(props?: TextProps) {
        super(props && props.window ? props.window : undefined);
        props = props || {};

        this.model = {
            type: "text",
            name: this.getName(props, "Text"),
            description: this.getDescription(props, "Text Widget"),
            text: props.text || "Your text here",
            captionBar: this.getCaptionBar(props, "Text Widget", "visible"),
            options: { style: props.style || defaultStyle },
            id: this.createId(),
            actions: this.getActions(props),
        };
    }

    // Returns a modify action object — pass this to Button.onClicked or an
    // action pipeline to update this widget's text at runtime.
    setText(text: string): ModifyAction {
        return {
            type: "modify",
            id: this.model.id,
            set: [{ name: "model.text", value: text }],
        };
    }

    private registerHook(hook: string, handler: (ctx: Window) => void): this {
        this.model.actions = this.addHook(this.model.actions, hook, handler);
        return this;
    }

    /** Register any widget action hook supported by WebStudio. */
    on(hook: string, handler: (ctx: Window) => void): this {
        return this.registerHook(hook, handler);
    }

    /** Convenience alias for the common text `onClick` hook. */
    onClicked(handler: (ctx: Window) => void): this {
        return this.registerHook("onClick", handler);
    }

    getModel(): TextModel {
        return this.model;
    }
}
