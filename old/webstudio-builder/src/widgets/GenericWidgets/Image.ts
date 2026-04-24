import {
    ImageModel,
    ImageOptions,
    ModifyAction,
    StyleProps,
} from "../../core/types";

export interface ImageProps {
    src?: string;
    alt?: string;
    options?: ImageOptions;
    name?: string;
    description?: string;
    actions?: object;
}

const defaultStyle: Partial<StyleProps> = {
    borderRadius: "12px",
    boxShadow: "0 8px 20px rgba(37, 99, 235, 0.08)",
    height: "auto",
    width: "100%",
};

const defaultOptions: ImageOptions = {
    style: defaultStyle,
};

export class Image {
    public readonly type = "image";
    public readonly id: string;
    public name: string;

    constructor(
        public src: string = "",
        public alt: string = "",
        public options: ImageOptions = defaultOptions,
        name?: string,
        public description: string = "Image Widget",
        public actions?: object,
    ) {
        this.id = syslib.uuid();
        this.name = name ?? ("Image" + this.id);
    }

    setSrc(src: string): ModifyAction {
        this.src = src;
        return { type: "modify", id: this.id, target: this.id, changes: { src } };
    }

    setAlt(alt: string): ModifyAction {
        this.alt = alt;
        return { type: "modify", id: this.id, target: this.id, changes: { alt } };
    }

    getModel(): ImageModel {
        return {
            type: this.type,
            id: this.id,
            name: this.name,
            description: this.description,
            base64: "",
            dataSource: {},
            mimeType: "",
            tooltip: {},
            url: this.src,
            options: this.options,
            actions: this.actions as Record<string, unknown> || {},
            toolbars: {},
        };
    }
}
