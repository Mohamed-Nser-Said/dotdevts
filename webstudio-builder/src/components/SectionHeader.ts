import { StyleProps } from "../core/types";
import { Text, TextProps } from "../widgets/Text";

const sectionHeaderStyle: StyleProps = {
    backgroundColor: "#0f172a",
    color: "#ffffff",
    padding: "14px",
    fontSize: "20px",
    fontWeight: "bold",
    textAlign: "center",
    borderRadius: "12px",
    border: "1px solid #1d4ed8",
    boxShadow: "0 6px 16px rgba(15, 23, 42, 0.14)",
};

export class SectionHeader extends Text {
    constructor(props?: TextProps) {
        props = props || {};
        super({
            name: props.name || "SectionHeader",
            text: props.text || props.name || "Section Header",
            title: props.title,
            showCaption: props.showCaption === true,
            actions: props.actions,
            window: props.window,
            style: {
                ...sectionHeaderStyle,
                ...(props.style || {}),
            },
        });
    }
}
