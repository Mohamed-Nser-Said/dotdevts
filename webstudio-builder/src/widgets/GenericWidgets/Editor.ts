import {
    EditorModel,
    EditorOptions,
    ModifyAction,
    StyleProps,
} from "../../core/types";

export interface EditorProps {
    content?: unknown;
    contentToCompare?: unknown;
    editorOptions?: Record<string, unknown>;
    language?: "json" | "lua" | "markdown" | "txt" | "xml" | string;
    schema?: Record<string, unknown>;
    options?: EditorOptions;
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
    height: "360px",
};

const defaultOptions: EditorOptions = {
    showToolbar: true,
    showLanguageSelection: true,
    showStatusBar: true,
    style: defaultStyle,
};

const defaultEditorOptions: Record<string, unknown> = {
    readOnly: false,
    originalEditable: false,
    wordWrap: "on",
    minimap: {
        enabled: false,
    },
};

export class Editor {
    public readonly type = "editor";
    public readonly id: string;
    public name: string;

    constructor(
        public content: unknown = {},
        public contentToCompare?: unknown,
        public editorOptions: Record<string, unknown> = defaultEditorOptions,
        public language: string = "json",
        public schema: Record<string, unknown> = {},
        public options: EditorOptions = defaultOptions,
        name?: string,
        public description: string = "Editor Widget",
        public actions?: object,
    ) {
        this.id = syslib.uuid();
        this.name = name ?? ("Editor" + this.id);
    }

    setContent(content: unknown): ModifyAction {
        this.content = content;
        return { type: "modify", id: this.id, target: this.id, changes: { content } };
    }

    getModel(): EditorModel {
        return {
            type: this.type,
            id: this.id,
            name: this.name,
            description: this.description,
            content: this.content,
            contentToCompare: this.contentToCompare,
            editorOptions: this.editorOptions,
            language: this.language,
            schema: this.schema,
            options: this.options,
            actions: this.actions || {},
            dataSource: {}, // Placeholder for dataSource
            toolbars: {}, // Placeholder for toolbars
        };
    }
}
