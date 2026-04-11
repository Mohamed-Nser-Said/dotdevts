import {
    ActionPipeline,
    AdvancedFormActions,
    AdvancedFormModel,
    AdvancedFormOptions,
    AdvancedFormSchema,
    AdvancedFormUISchema,
    StyleProps,
} from "../../core/types";
import { Window } from "../../core/Window";
import { BaseWidget, BaseWidgetProps } from "../BaseWidget";

export interface AdvancedFormProps extends BaseWidgetProps<AdvancedFormActions> {
    schema: AdvancedFormSchema;
    uiSchema?: AdvancedFormUISchema;
    data?: Record<string, unknown>;
    options?: AdvancedFormOptions;
    formOptions?: AdvancedFormModel["formOptions"];
    style?: Partial<StyleProps>;
}

export class AdvancedForm extends BaseWidget<AdvancedFormModel, AdvancedFormActions> {
    constructor(props: AdvancedFormProps) {
        super(props.window);

        this.model = {
            type: "advancedform",
            name: this.getName(props, "AdvancedForm"),
            description: this.getDescription(props, "Advanced Form Widget"),
            id: this.createId(),
            actions: this.getActions(props),
            captionBar: this.getCaptionBar(props, "Advanced Form", "hidden"),
            dataSource: this.getDataSource(props),
            toolbars: this.getToolbars(props),
            options: props.options || (props.style ? { style: props.style } : undefined),
            schema: props.schema,
            uiSchema: props.uiSchema,
            data: props.data,
            formOptions: props.formOptions,
        };
    }

    setSchema(schema: AdvancedFormSchema): this {
        this.model.schema = schema;
        return this;
    }

    setUISchema(uiSchema: AdvancedFormUISchema): this {
        this.model.uiSchema = uiSchema;
        return this;
    }

    setData(data: Record<string, unknown>): this {
        this.model.data = data;
        return this;
    }

    setFormOptions(formOptions: AdvancedFormModel["formOptions"]): this {
        this.model.formOptions = {
            ...(this.model.formOptions || {}),
            ...formOptions,
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

    onSubmit(handler: (ctx: Window) => void): this {
        return this.registerHook("onSubmit", handler);
    }

    onChange(handler: (ctx: Window) => void): this {
        return this.registerHook("onChange", handler);
    }

    onValidate(handler: (ctx: Window) => void): this {
        return this.registerHook("onValidate", handler);
    }

    onValidationError(handler: (ctx: Window) => void): this {
        return this.registerHook("onValidationError", handler);
    }

    getModel(): AdvancedFormModel {
        return this.model;
    }
}
