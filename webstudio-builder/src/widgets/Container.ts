import { ContainerModel, StyleProps, WidgetActions } from "../core/types";
import { Window } from "../core/Window";
import { BaseWidget, BaseWidgetProps } from "./BaseWidget";

export interface ContainerProps extends BaseWidgetProps {
    compilation?: object;
    style?: Partial<StyleProps>;
    spacing?: { x: number; y: number };
}

export class Container extends BaseWidget<ContainerModel> {
    constructor(props?: ContainerProps) {
        super(props && props.window ? props.window : undefined);
        props = props || {};

        this.model = {
            type: "container",
            name: this.getName(props, "Container"),
            description: this.getDescription(props, "Container Widget"),
            id: this.createId(),
            compilation: props.compilation || { version: "1", widgets: [], options: {} },
            options: {
                spacing: (props.spacing) || { x: 2, y: 2 },
                style: props.style,
            },
            actions: this.getActions(props),
            captionBar: false,
        };
    }

    setCompilation(compilation: object): this {
        this.model.compilation = compilation;
        return this;
    }

    setStyle(style: Partial<StyleProps>): this {
        this.model.options.style = {
            ...(this.model.options.style || {}),
            ...style,
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

    getModel(): ContainerModel {
        return this.model;
    }
}
