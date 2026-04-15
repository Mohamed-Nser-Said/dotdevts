import { WebStudioAction, WebStudioWidget } from "../../layouts/Compilation";
import { ModifyAction, Layout, StyleProps, TextCaptionBar, WidgetActions } from "../../core/types";
import { IWidget } from "../../interfaces/IWidget";


export interface TextProps {
    text?: string;
    name?: string;
    description?: string;
    captionBar?: TextCaptionBar | false;
    options?: { style: Partial<StyleProps> };
    actions?: WidgetActions;
    layout?: Layout;
    style?: Partial<StyleProps>;
    showCaption?: boolean;
    title?: string;
}

export class Text implements IWidget {

    public readonly type = "text";
    public readonly name: string;

    constructor(
        public text: string = "",
        name?: string,
        public readonly id = syslib.uuid(),
        public options: { style: Partial<StyleProps> } = { style: {} },
        public description: string = "Text Widget",
        public captionBar: TextCaptionBar | false = false,
        public actions?: WidgetActions,
        public layout?: Layout,
    ) {
        this.name = name ?? ("Text" + this.id);
    }

    setStyle(style: Partial<StyleProps>): this {
        this.options.style = {
            ...this.options.style,
            ...style,
        };
        return this;
    }

    setText(text: string): this {
        this.text = text;
        return this;
    }

    getModel(): WebStudioWidget {

        return {
            type: this.type,
            id: this.id,
            text: this.text,
            name: this.name,
            description: this.description,
            captionBar: this.captionBar,
            options: this.options,
            actions: this.actions as Record<string, WebStudioAction> | undefined,
            layout: this.layout,
        };

    }
}
