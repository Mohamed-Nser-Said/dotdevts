import { VideoModel, VideoOptions, StyleProps, WidgetActions } from "../../core/types";
import { Window } from "../../core/Window";
import { BaseWidget, BaseWidgetProps } from "../BaseWidget";

export interface VideoProps extends BaseWidgetProps {
    url: string;
    mimeType: string;
    videoOptions?: VideoOptions;
    style?: Partial<StyleProps>;
}

export class Video extends BaseWidget<VideoModel> {
    constructor(props: VideoProps) {
        super(props.window);

        this.model = {
            type: "video",
            name: this.getName(props, "Video"),
            description: this.getDescription(props, "Video Widget"),
            id: this.createId(),
            actions: this.getActions(props),
            captionBar: this.getCaptionBar(props, "Video", "hidden"),
            dataSource: this.getDataSource(props),
            toolbars: this.getToolbars(props),
            options: props.style ? { style: props.style } : undefined,
            url: props.url,
            mimeType: props.mimeType,
            videoOptions: props.videoOptions || {},
        };
    }

    setUrl(url: string): this {
        this.model.url = url;
        return this;
    }

    setVideoOptions(options: Partial<VideoOptions>): this {
        this.model.videoOptions = {
            ...(this.model.videoOptions || {}),
            ...options,
        };
        return this;
    }

    private registerHook(hook: string, handler: (ctx: Window) => void): this {
        this.model.actions = this.addHook(this.model.actions, hook, handler);
        return this;
    }

    on(hook: string, handler: (ctx: Window) => void): this {
        return this.registerHook(hook, handler);
    }

    getModel(): VideoModel {
        return this.model;
    }
}
