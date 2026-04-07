import {
    MarkdownViewerModel,
    MarkdownViewerOptions,
    ModifyAction,
    StyleProps,
    WidgetActions,
} from "../core/types";

export interface MarkdownViewerProps {
    name?: string;
    description?: string;
    content?: string;
    dataSource?: Record<string, unknown>;
    markdownOptions?: Record<string, unknown>;
    mermaidOptions?: Record<string, unknown>;
    options?: MarkdownViewerOptions;
    style?: Partial<StyleProps>;
    toolbars?: Record<string, unknown>;
    actions?: WidgetActions;
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

export class MarkdownViewer {
    model: MarkdownViewerModel;

    constructor(props?: MarkdownViewerProps) {
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
            name: props.name || "MarkdownViewer",
            description: props.description || "Markdown Viewer Widget",
            id: syslib.uuid(),
            actions: props.actions || {},
            content: props.content || "# Markdown Viewer\n\nAdd your markdown content here.",
            dataSource: props.dataSource || {},
            markdownOptions: props.markdownOptions || {
                breaks: false,
                linkify: true,
                xhtmlOut: true,
            },
            mermaidOptions: props.mermaidOptions || {
                theme: "default",
            },
            options: mergedOptions,
            toolbars: props.toolbars || {},
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
