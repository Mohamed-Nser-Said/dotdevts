import {
    FormActionHook,
    FormActions,
    FormEntry,
    FormModel,
    FormOptions,
    StyleProps,
} from "../../core/types";
import { Window } from "../../core/Window";
import { BaseWidget, BaseWidgetProps } from "../BaseWidget";

export interface FormProps extends BaseWidgetProps<FormActions> {
    entries?: FormEntry[];
    options?: FormOptions;
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

export class Form extends BaseWidget<FormModel, FormActions> {
    constructor(props?: FormProps) {
        super(props && props.window ? props.window : undefined);
        props = props || {};

        this.model = {
            type: "form",
            name: this.getName(props, "Form"),
            description: this.getDescription(props, "Form Widget"),
            id: this.createId(),
            captionBar: this.getCaptionBar(props, "Form Widget", "hidden"),
            actions: this.getActions(props),
            dataSource: this.getDataSource(props),
            entries: props.entries || [],
            options: this.mergeOptions(props.options),
            toolbars: this.getToolbars(props),
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
        this.model.actions = this.addHook(this.model.actions, hook, handler);
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

    setSubmitLabel(label: string): this {
        const currentOptions = this.model.options || {};
        const currentSubmitButton = currentOptions.submitButton || {};

        this.model.options = this.mergeOptions({
            ...currentOptions,
            submitButton: {
                ...currentSubmitButton,
                label,
            },
        });
        return this;
    }

    setStyle(style: Partial<StyleProps>): this {
        const currentOptions = this.model.options || {};
        const currentStyle = currentOptions.style || {};

        this.model.options = this.mergeOptions({
            ...currentOptions,
            style: {
                ...currentStyle,
                ...style,
            },
        });
        return this;
    }

    onSubmit(handler: (ctx: Window) => void): this {
        return this.registerHook("onSubmit", handler);
    }

    getModel(): FormModel {
        return this.model;
    }
}
