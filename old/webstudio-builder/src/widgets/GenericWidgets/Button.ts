import { ButtonModel, ButtonOptions, Layout, StyleProps } from "../../core/types";

export interface ButtonProps {
    label?: string;
    onClick?: () => void;
    options?: ButtonOptions;
    name?: string;
    description?: string;
    style?: Partial<StyleProps>;
}

const defaultStyle: Partial<StyleProps> = {
    backgroundColor: "#3b82f6",
    color: "#ffffff",
    padding: "8px 16px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
};

const defaultOptions: ButtonOptions = {
    style: defaultStyle,
};

export class Button {
    public readonly type = "button";
    public readonly id: string;
    public name: string;

    constructor(
        public label: string = "Click Me",
        public onClick: () => void = () => {},
        public options: ButtonOptions = defaultOptions,
        name?: string,
        public description: string = "Button Widget",
        public layout?: Layout,
    ) {
        this.id = syslib.uuid();
        this.name = name ?? ("Button" + this.id);
    }

    getModel(): ButtonModel {
        return {
            type: this.type,
            id: this.id,
            name: this.name,
            description: this.description,
            label: this.label,
            options: { style: this.options.style || {} },
            actions: {},
            captionBar: false,
            disabled: false,
            toolbars: [],
            layout: this.layout,
        };
    }
}