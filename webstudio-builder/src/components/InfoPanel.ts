import { StyleProps } from "../core/types";
import { Text, TextProps } from "../widgets/Text";

export interface InfoPanelProps extends TextProps {
    backgroundColor?: string;
    color?: string;
}

const infoPanelStyle: StyleProps = {
    backgroundColor: "#f8fafc",
    color: "#0f172a",
    padding: "14px",
    fontSize: "16px",
    textAlign: "left",
    borderRadius: "12px",
    border: "1px solid #dbeafe",
    boxShadow: "0 4px 14px rgba(37, 99, 235, 0.08)",
};

export class InfoPanel extends Text {
    constructor(props?: InfoPanelProps) {
        props = props || {};
        super({
            name: props.name || "InfoPanel",
            text: props.text || "Panel text",
            title: props.title,
            showCaption: props.showCaption === true,
            actions: props.actions,
            window: props.window,
            style: {
                ...infoPanelStyle,
                backgroundColor: props.backgroundColor || infoPanelStyle.backgroundColor,
                color: props.color || infoPanelStyle.color,
                ...(props.style || {}),
            },
        });
    }
}
