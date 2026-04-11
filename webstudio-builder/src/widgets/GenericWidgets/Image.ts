import { ImageModel, StyleProps } from "../../core/types";
import { BaseWidget, BaseWidgetProps } from "../BaseWidget";

export interface ImageProps extends BaseWidgetProps {
    url?: string;
    base64?: string;
    mimeType?: string;
    size?: "contain" | "cover" | "fill" | "none" | "scale-down" | string;
    style?: Partial<StyleProps>;
}

const defaultStyle: StyleProps = {
    backgroundColor: "#ffffff",
    padding: "12px",
    borderRadius: "12px",
};

export class Image extends BaseWidget<ImageModel> {
    constructor(props?: ImageProps) {
        super(props && props.window ? props.window : undefined);
        props = props || {};

        this.model = {
            type: "image",
            name: this.getName(props, "Image"),
            description: this.getDescription(props, "Image Widget"),
            actions: this.getActions(props),
            base64: props.base64 || "",
            dataSource: this.getDataSource(props),
            mimeType: props.mimeType || "",
            options: {
                size: props.size || "contain",
                style: props.style || defaultStyle,
            },
            toolbars: this.getToolbars(props),
            tooltip: {},
            url: props.url || "",
            id: this.createId(),
        };
    }

    getModel(): ImageModel {
        return this.model;
    }
}
