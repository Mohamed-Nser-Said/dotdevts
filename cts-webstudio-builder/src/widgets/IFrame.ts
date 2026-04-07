import { IFrameModel, IFrameOptions, WidgetActions } from "../core/types";

export interface IFrameProps {
    name?: string;
    description?: string;
    url?: string;
    actions?: WidgetActions;
    dataSource?: Record<string, unknown>;
    iframeOptions?: IFrameOptions;
    toolbars?: Record<string, unknown>;
}

export class IFrame {
    model: IFrameModel;

    constructor(props?: IFrameProps) {
        props = props || {};
        this.model = {
            type: "iframe",
            name: props.name || "IFrame",
            description: props.description || "IFrame Widget",
            id: syslib.uuid(),
            actions: props.actions || {},
            dataSource: props.dataSource || {},
            iframeOptions: props.iframeOptions || {
                allowFullScreen: true,
            },
            toolbars: props.toolbars || {},
            url: props.url || "",
        };
    }

    getModel(): IFrameModel {
        return this.model;
    }
}
