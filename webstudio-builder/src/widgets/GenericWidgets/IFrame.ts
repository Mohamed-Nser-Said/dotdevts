import {
    IFrameModel,
    IFrameOptions,
    ModifyAction,
    StyleProps,
} from "../../core/types";

export interface IFrameProps {
    src?: string;
    options?: IFrameOptions;
    name?: string;
    description?: string;
    actions?: object;
}

const defaultStyle: Partial<StyleProps> = {
    backgroundColor: "#ffffff",
    border: "1px solid #dbeafe",
    borderRadius: "12px",
    boxShadow: "0 8px 20px rgba(37, 99, 235, 0.08)",
    height: "360px",
    width: "100%",
};

const defaultOptions: IFrameOptions = {
    allowFullScreen: true,
    style: defaultStyle,
};

export class IFrame {
    public readonly type = "iframe";
    public readonly id: string;
    public name: string;

    constructor(
        public src: string = "",
        public options: IFrameOptions = defaultOptions,
        name?: string,
        public description: string = "IFrame Widget",
        public actions?: object,
    ) {
        this.id = syslib.uuid();
        this.name = name ?? ("IFrame" + this.id);
    }

    setSrc(src: string): ModifyAction {
        this.src = src;
        return { type: "modify", id: this.id, target: this.id, changes: { src } };
    }

    getModel(): IFrameModel {
        return {
            type: this.type,
            id: this.id,
            name: this.name,
            description: this.description,
            iframeOptions: this.options,
            url: this.src,
            dataSource: {},
            toolbars: {},
            actions: this.actions || {},
        };
    }
}
