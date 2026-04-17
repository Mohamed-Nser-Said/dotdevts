import {
    MarkdownViewerModel,
    MarkdownViewerOptions,
    ModifyAction,
    StyleProps,
} from "../../core/types";

export interface MarkdownViewerProps {
    content?: string;
    options?: MarkdownViewerOptions;
    name?: string;
    description?: string;
    actions?: object;
}

const defaultStyle: Partial<StyleProps> = {
    backgroundColor: "#ffffff",
    color: "#0f172a",
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid #dbeafe",
    boxShadow: "0 8px 20px rgba(37, 99, 235, 0.08)",
    height: "auto",
};

const defaultOptions: MarkdownViewerOptions = {
    style: defaultStyle,
};

export class MarkdownViewer {
    public readonly type = "markdownviewer";
    public readonly id: string;
    public name: string;

    constructor(
        public content: string = "",
        public options: MarkdownViewerOptions = defaultOptions,
        name?: string,
        public description: string = "Markdown Viewer Widget",
        public actions?: object,
    ) {
        this.id = syslib.uuid();
        this.name = name ?? ("MarkdownViewer" + this.id);
    }

    setContent(content: string): ModifyAction {
        this.content = content;
        return { type: "modify", id: this.id, target: this.id, changes: { content } };
    }

    getModel(): MarkdownViewerModel {
        return {
            type: this.type,
            id: this.id,
            name: this.name,
            description: this.description,
            content: this.content,
            options: this.options,
            actions: this.actions || {},
            dataSource: {}, // Placeholder for dataSource
            markdownOptions: {}, // Placeholder for markdownOptions
            mermaidOptions: {}, // Placeholder for mermaidOptions
            toolbars: {}, // Placeholder for toolbars
        };
    }
}
