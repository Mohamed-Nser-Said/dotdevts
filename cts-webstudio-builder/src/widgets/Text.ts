import { ModifyAction, PipelineStep, StyleProps, TextCaptionBar, TextModel, WidgetActions } from "../core/types";
import { Window } from "../core/Window";

export interface TextProps {
    name?: string;
    text?: string;
    title?: string;
    style?: Partial<StyleProps>;
    showCaption?: boolean;
    actions?: WidgetActions;
    window?: Window;
}

const defaultStyle: StyleProps = {
    color: "grey",
    textAlign: "center",
    fontSize: "26px",
    fontWeight: "bold",
    fontFamily: '"Courier New", Courier, sans-serif',
};

export class Text {
    model: TextModel;
    window: Window;

    constructor(props?: TextProps) {
        props = props || {};
        this.window = props.window ? props.window : new Window();
        const showCaption = props.showCaption !== false;
        const captionBar: TextCaptionBar | false = showCaption
            ? { hidden: false, title: props.title || props.name || "Text Widget" }
            : false;
        this.model = {
            type: "text",
            name: props.name || "Text",
            description: "Text Widget",
            text: props.text || "Your text here",
            captionBar,
            options: { style: props.style || defaultStyle },
            id: syslib.uuid(),
            actions: props.actions,
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

        this.window.reset();
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
