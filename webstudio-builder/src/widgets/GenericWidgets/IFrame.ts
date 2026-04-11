import { IFrameModel, IFrameOptions, WidgetActions } from "../../core/types";
import { BaseWidget, BaseWidgetProps } from "../BaseWidget";

export interface IFrameProps extends BaseWidgetProps<WidgetActions> {
    url?: string;
    iframeOptions?: IFrameOptions;
}

export class IFrame extends BaseWidget<IFrameModel> {
    constructor(props?: IFrameProps) {
        super(props && props.window ? props.window : undefined);
        props = props || {};

        this.model = {
            type: "iframe",
            name: this.getName(props, "IFrame"),
            description: this.getDescription(props, "IFrame Widget"),
            id: this.createId(),
            actions: this.getActions(props),
            dataSource: this.getDataSource(props),
            iframeOptions: props.iframeOptions || {
                allowFullScreen: true,
            },
            toolbars: this.getToolbars(props),
            url: props.url || "",
        };
    }

    getModel(): IFrameModel {
        return this.model;
    }
}
