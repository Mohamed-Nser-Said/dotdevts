import { StyleProps } from "../core/types";
import { Text, TextProps } from "../widgets/Text";

export interface TitleProps extends TextProps {
    fontSize?: string;
    color?: string;
}

const defaultTitleStyle: StyleProps = {
    fontSize: "26px",
    fontWeight: "bold",
    color: "#0f172a",
    textAlign: "left",
    fontFamily: "Arial, sans-serif",
};

export class Title extends Text {
    constructor(props?: TitleProps) {
        props = props || {};

        super({
            name: props.name || "Title",
            text: props.text || "Title",
            showCaption: false,
            style: {
                ...defaultTitleStyle,
                fontSize: props.fontSize || defaultTitleStyle.fontSize,
                color: props.color || defaultTitleStyle.color,
                ...(props.style || {}),
            },
        });
    }
}
