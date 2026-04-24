import {
    AdvancedFormModel,
    AdvancedFormOptions,
    AdvancedFormSchema,
    AdvancedFormUISchema,
    StyleProps,
} from "../../core/types";

export interface AdvancedFormProps {
    schema: AdvancedFormSchema;
    uiSchema?: AdvancedFormUISchema;
    data?: Record<string, unknown>;
    options?: AdvancedFormOptions;
    formOptions?: AdvancedFormModel["formOptions"];
    style?: Partial<StyleProps>;
    name?: string;
    description?: string;
    actions?: object;
}

export class AdvancedForm {
    public readonly type = "advancedform";
    public readonly id: string;
    public name: string;

    constructor(
        public schema: AdvancedFormSchema,
        public uiSchema?: AdvancedFormUISchema,
        public data?: Record<string, unknown>,
        public options?: AdvancedFormOptions,
        public formOptions?: AdvancedFormModel["formOptions"],
        public style: Partial<StyleProps> = {},
        name?: string,
        public description: string = "Advanced Form Widget",
        public actions?: object,
    ) {
        this.id = syslib.uuid();
        this.name = name ?? ("AdvancedForm" + this.id);
    }

    setSchema(schema: AdvancedFormSchema): this {
        this.schema = schema;
        return this;
    }

    setUISchema(uiSchema: AdvancedFormUISchema): this {
        this.uiSchema = uiSchema;
        return this;
    }

    setData(data: Record<string, unknown>): this {
        this.data = data;
        return this;
    }

    setFormOptions(formOptions: AdvancedFormModel["formOptions"]): this {
        this.formOptions = {
            ...(this.formOptions || {}),
            ...formOptions,
        };
        return this;
    }

    getModel(): AdvancedFormModel {
        return {
            type: this.type,
            id: this.id,
            name: this.name,
            description: this.description,
            schema: this.schema,
            uiSchema: this.uiSchema,
            data: this.data,
            options: this.options,
            formOptions: this.formOptions,
            actions: this.actions,
        };
    }
}
