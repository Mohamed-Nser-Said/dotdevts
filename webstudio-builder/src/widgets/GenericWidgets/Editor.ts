import {
    EditorActionHook,
    EditorActions,
    EditorModel,
    EditorOptions,
    ModifyAction,
    StyleProps,
} from "../../core/types";
import { Window } from "../../core/Window";
import { BaseWidget, BaseWidgetProps } from "../BaseWidget";

export interface EditorProps extends BaseWidgetProps<EditorActions> {
    content?: unknown;
    contentToCompare?: unknown;
    editorOptions?: Record<string, unknown>;
    language?: "json" | "lua" | "markdown" | "txt" | "xml" | string;
    schema?: Record<string, unknown>;
    options?: EditorOptions;
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

export class Editor extends BaseWidget<EditorModel, EditorActions> {
    constructor(props?: EditorProps) {
        super(props && props.window ? props.window : undefined);
        props = props || {};

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
            name: this.getName(props, "Editor"),
            description: this.getDescription(props, "Editor Widget"),
            id: this.createId(),
            actions: this.getActions(props),
            content: props.content !== undefined ? props.content : {},
            contentToCompare: props.contentToCompare,
            dataSource: this.getDataSource(props),
            editorOptions: {
                ...defaultEditorOptions,
                ...(props.editorOptions || {}),
            },
            language: props.language || "json",
            schema: props.schema || {},
            options: mergedOptions,
            toolbars: this.getToolbars(props),
        };
    }

    private registerHook(hook: EditorActionHook, handler: (ctx: Window) => void): this {
        this.model.actions = this.addHook(this.model.actions, hook, handler);
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
