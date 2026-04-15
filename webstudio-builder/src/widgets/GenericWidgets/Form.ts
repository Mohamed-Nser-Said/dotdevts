import {
    FormModel,
    FormOptions,
    ModifyAction,
    StyleProps,
} from "../../core/types";

export interface FormProps {
    fields?: Record<string, unknown>;
    options?: FormOptions;
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

const defaultOptions: FormOptions = {
    showSubmitButton: true,
    style: defaultStyle,
};

export class Form {
    public readonly type = "form";
    public readonly id: string;
    public name: string;

    constructor(
        public fields: Record<string, unknown> = {},
        public options: FormOptions = defaultOptions,
        name?: string,
        public description: string = "Form Widget",
        public actions?: object,
    ) {
        this.id = syslib.uuid();
        this.name = name ?? ("Form" + this.id);
    }

    setFields(fields: Record<string, unknown>): ModifyAction {
        this.fields = fields;
        return { type: "modify", id: this.id, target: this.id, changes: { fields } };
    }

    getModel(): FormModel {
        return {
            type: this.type,
            id: this.id,
            name: this.name,
            description: this.description,
            captionBar: false,
            entries: [],
            options: this.options,
            actions: this.actions || {},
        };
    }
}
