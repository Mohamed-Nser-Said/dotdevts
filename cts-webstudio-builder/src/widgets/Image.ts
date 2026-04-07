import { ImageModel, StyleProps } from "../core/types";

export interface ImageProps {
    name?: string;
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

export class Image {
    model: ImageModel;

    constructor(props?: ImageProps) {
        props = props || {};
        this.model = {
            type: "image",
            name: props.name || "Image",
            description: "Image Widget",
            actions: {},
            base64: props.base64 || "",
            dataSource: {},
            mimeType: props.mimeType || "",
            options: {
                size: props.size || "contain",
                style: props.style || defaultStyle,
            },
            toolbars: {},
            tooltip: {},
            url: props.url || "",
            id: syslib.uuid(),
        };
    }

    getModel(): ImageModel {
        return this.model;
    }
}
