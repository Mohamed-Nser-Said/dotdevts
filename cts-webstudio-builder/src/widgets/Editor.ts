import {
    EditorActionHook,
    EditorActions,
    EditorModel,
    EditorOptions,
    ModifyAction,
    PipelineStep,
    StyleProps,
} from "../core/types";
import { Window } from "../core/Window";

export interface EditorProps {
    name?: string;
    description?: string;
    content?: unknown;
    contentToCompare?: unknown;
    dataSource?: Record<string, unknown>;
    editorOptions?: Record<string, unknown>;
    language?: "json" | "lua" | "markdown" | "txt" | "xml" | string;
    schema?: Record<string, unknown>;
    options?: EditorOptions;
    toolbars?: Record<string, unknown>;
    actions?: EditorActions;
    window?: Window;
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
    model: EditorModel;
    window: Window;

    constructor(props?: EditorProps) {
        props = props || {};
        this.window = props.window ? props.window : new Window();

        const providedOptions = props.options || {};
        const mergedOptions: EditorOptions = {
            ...defaultOptions,
            ...providedOptions,
            style: {
                ...(defaultOptions.style || {}),
                ...((providedOptions.style as Partial<StyleProps>) || {}),
            },
        };

        this.model = {
            type: "editor",
            name: props.name || "Editor",
            description: props.description || "Editor Widget",
            id: syslib.uuid(),
            actions: props.actions || {},
            content: props.content !== undefined ? props.content : {},
            contentToCompare: props.contentToCompare,
            dataSource: props.dataSource || {},
            editorOptions: {
                ...defaultEditorOptions,
                ...(props.editorOptions || {}),
            },
            language: props.language || "json",
            schema: props.schema || {},
            options: mergedOptions,
            toolbars: props.toolbars || {},
        };
    }

    private registerHook(hook: EditorActionHook, handler: (ctx: Window) => void): this {
        if (!this.model.actions) {
            this.model.actions = {};
        }
        if (!this.model.actions[hook]) {
            this.model.actions[hook] = [];
        }

        handler(this.window);

        const recorded: PipelineStep[] = this.window.getActions();
        for (const step of recorded) {
            this.model.actions[hook]!.push(step);
        }

        this.window.reset();
        return this;
    }

    setContent(content: unknown): ModifyAction {
        return {
            type: "modify",
            id: this.model.id,
            set: [{ name: "model.content", value: content }],
        };
    }

    setComparisonContent(contentToCompare: unknown): ModifyAction {
        return {
            type: "modify",
            id: this.model.id,
            set: [{ name: "model.contentToCompare", value: contentToCompare }],
        };
    }

    onContentChange(handler: (ctx: Window) => void): this {
        return this.registerHook("onContentChange", handler);
    }

    getModel(): EditorModel {
        return this.model;
    }
}
