import {
    FormActionHook,
    FormActions,
    FormEntry,
    FormModel,
    FormOptions,
    PipelineStep,
    StyleProps,
    TextCaptionBar,
} from "../core/types";
import { Window } from "../core/Window";

export interface FormProps {
    name?: string;
    title?: string;
    description?: string;
    showCaption?: boolean;
    entries?: FormEntry[];
    dataSource?: Record<string, unknown>;
    options?: FormOptions;
    toolbars?: Record<string, unknown>;
    actions?: FormActions;
    window?: Window;
}

const defaultStyle: StyleProps = {
    backgroundColor: "#ffffff",
    color: "#0f172a",
    padding: "12px",
    borderRadius: "12px",
    fontSize: "14px",
};

const defaultOptions: FormOptions = {
    showRefreshButton: false,
    showToolbar: true,
    style: defaultStyle,
    submitButton: {
        label: "Submit",
    },
};

export class Form {
    model: FormModel;
    window: Window;

    constructor(props?: FormProps) {
        props = props || {};
        this.window = props.window ? props.window : new Window();

        const showCaption = props.showCaption === true;
        const captionBar: TextCaptionBar | false = showCaption
            ? { hidden: false, title: props.title || props.name || "Form Widget" }
            : false;

        this.model = {
            type: "form",
            name: props.name || "Form",
            description: props.description || "Form Widget",
            id: syslib.uuid(),
            captionBar,
            actions: props.actions || {},
            dataSource: props.dataSource || {},
            entries: props.entries || [],
            options: this.mergeOptions(props.options),
            toolbars: props.toolbars || {},
        };
    }

    private mergeOptions(options?: FormOptions): FormOptions {
        const nextOptions = options || {};
        const merged: FormOptions = {
            ...defaultOptions,
            ...nextOptions,
        };

        merged.style = {
            ...(defaultOptions.style || {}),
            ...(nextOptions.style || {}),
        };

        merged.styleByTheme = {
            ...(defaultOptions.styleByTheme || {}),
            ...(nextOptions.styleByTheme || {}),
        };

        merged.submitButton = {
            ...(defaultOptions.submitButton || {}),
            ...(nextOptions.submitButton || {}),
        };

        return merged;
    }

    private registerHook(hook: FormActionHook, handler: (ctx: Window) => void): this {
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

    setEntries(entries: FormEntry[]): this {
        this.model.entries = entries;
        return this;
    }

    setOptions(options: FormOptions): this {
        this.model.options = this.mergeOptions(options);
        return this;
    }

    onSubmit(handler: (ctx: Window) => void): this {
        return this.registerHook("onSubmit", handler);
    }

    getModel(): FormModel {
        return this.model;
    }
}
