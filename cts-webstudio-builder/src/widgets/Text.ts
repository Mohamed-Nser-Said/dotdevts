import { ModifyAction, StyleProps, TextCaptionBar, TextModel } from "../core/types";

export interface TextProps {
    name?: string;
    text?: string;
    title?: string;
    style?: Partial<StyleProps>;
    showCaption?: boolean;
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

    constructor(props?: TextProps) {
        props = props || {};
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

    getModel(): TextModel {
        return this.model;
    }
}
