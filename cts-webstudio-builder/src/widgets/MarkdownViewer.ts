import {
    MarkdownViewerModel,
    MarkdownViewerOptions,
    ModifyAction,
    StyleProps,
    WidgetActions,
} from "../core/types";
import { BaseWidget, BaseWidgetProps } from "./BaseWidget";

export interface MarkdownViewerProps extends BaseWidgetProps<WidgetActions> {
    content?: string;
    markdownOptions?: Record<string, unknown>;
    mermaidOptions?: Record<string, unknown>;
    options?: MarkdownViewerOptions;
    style?: Partial<StyleProps>;
}

const defaultStyle: Partial<StyleProps> = {
    backgroundColor: "#ffffff",
    color: "#0f172a",
    padding: "16px",
    borderRadius: "12px",
    border: "1px solid #dbeafe",
    boxShadow: "0 8px 20px rgba(37, 99, 235, 0.08)",
    height: "320px",
};

const defaultOptions: MarkdownViewerOptions = {
    linkTarget: "_blank",
    style: defaultStyle,
};

export class MarkdownViewer extends BaseWidget<MarkdownViewerModel> {
    constructor(props?: MarkdownViewerProps) {
        super(props && props.window ? props.window : undefined);
        props = props || {};

        const providedOptions = props.options || {};
        const mergedOptions: MarkdownViewerOptions = {
            ...defaultOptions,
            ...providedOptions,
            style: {
                ...(defaultOptions.style || {}),
                ...((providedOptions.style as Partial<StyleProps>) || {}),
                ...(props.style || {}),
            },
        };

        this.model = {
            type: "markdownviewer",
            name: this.getName(props, "MarkdownViewer"),
            description: this.getDescription(props, "Markdown Viewer Widget"),
            id: this.createId(),
            actions: this.getActions(props),
            content: props.content || "# Markdown Viewer\n\nAdd your markdown content here.",
            dataSource: this.getDataSource(props),
            markdownOptions: props.markdownOptions || {
                breaks: false,
                linkify: true,
                xhtmlOut: true,
            },
            mermaidOptions: props.mermaidOptions || {
                theme: "default",
            },
            options: mergedOptions,
            toolbars: this.getToolbars(props),
        };
    }

    setContent(content: string): ModifyAction {
        return {
            type: "modify",
            id: this.model.id,
            set: [{ name: "model.content", value: content }],
        };
    }

    getModel(): MarkdownViewerModel {
        return this.model;
    }
}
