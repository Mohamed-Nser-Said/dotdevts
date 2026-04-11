import { StyleProps } from "../core/types";
import { Text, TextProps } from "../widgets/GenericWidgets/Text";

export interface InfoTextProps extends TextProps {
    fontSize?: string;
    color?: string;
}

const defaultInfoTextStyle: StyleProps = {
    fontSize: "15px",
    fontWeight: "normal",
    color: "#475569",
    textAlign: "left",
    fontFamily: "Arial, sans-serif",
};

export class InfoText extends Text {
    constructor(props?: InfoTextProps) {
        props = props || {};

        super({
            name: props.name || "InfoText",
            text: props.text || "Information text",
            showCaption: false,
            style: {
                ...defaultInfoTextStyle,
                fontSize: props.fontSize || defaultInfoTextStyle.fontSize,
                color: props.color || defaultInfoTextStyle.color,
                ...(props.style || {}),
            },
        });
    }
}
