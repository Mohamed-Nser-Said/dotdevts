import { StyleProps } from "../core/types";
import { Text, TextProps } from "../widgets/GenericWidgets/Text";

export interface KpiCardProps extends Omit<TextProps, "text"> {
    label?: string;
    value?: string;
    backgroundColor?: string;
    borderColor?: string;
}

const kpiCardStyle: StyleProps = {
    color: "#ffffff",
    padding: "16px",
    fontSize: "18px",
    fontWeight: "bold",
    textAlign: "center",
    borderRadius: "14px",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.18)",
};

export class KpiCard extends Text {
    metricLabel: string;

    constructor(props?: KpiCardProps) {
        props = props || {};
        const label = props.label || props.name || "Metric";
        const value = props.value || "--";
        const backgroundColor = props.backgroundColor || "#1d4ed8";
        const borderColor = props.borderColor || "#60a5fa";

        super({
            name: props.name || label,
            text: `${label} • ${value}`,
            title: props.title,
            showCaption: props.showCaption === true,
            actions: props.actions,
            window: props.window,
            style: {
                ...kpiCardStyle,
                backgroundColor,
                border: `2px solid ${borderColor}`,
                ...(props.style || {}),
            },
        });

        this.metricLabel = label;
    }

    setValue(value: string): this {
        this.model.text = `${this.metricLabel} • ${value}`;
        return this;
    }
}
