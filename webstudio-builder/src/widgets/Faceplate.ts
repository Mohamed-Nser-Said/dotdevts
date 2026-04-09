import { FaceplateModel } from "../core/types";
import { BaseWidget, BaseWidgetProps } from "./BaseWidget";

export interface FaceplateProps extends BaseWidgetProps {
    path?: string;
    captionBar?: boolean | Record<string, unknown>;
    dragSource?: Record<string, unknown>;
    dropTarget?: Record<string, unknown>;
}

export class Faceplate extends BaseWidget<FaceplateModel> {
    constructor(props?: FaceplateProps) {
        super(props && props.window ? props.window : undefined);
        props = props || {};

        this.model = {
            type: "faceplate",
            name: this.getName(props, "Faceplate"),
            description: this.getDescription(props, "Faceplate Widget"),
            actions: this.getActions(props),
            captionBar: props.captionBar !== undefined ? props.captionBar : this.getCaptionBar(props, "Faceplate Widget"),
            dataSource: this.getDataSource(props),
            path: props.path || "/System/Core/Examples/Demo Data/Process Data/DC4711",
            toolbars: this.getToolbars(props),
            dragSource: props.dragSource,
            dropTarget: props.dropTarget,
            id: this.createId(),
        };
    }

    getModel(): FaceplateModel {
        return this.model;
    }
}
