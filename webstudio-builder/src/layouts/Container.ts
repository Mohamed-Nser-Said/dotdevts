import { Compilation, WebStudioCompilation, WebStudioWidget } from "./Compilation";
import { ContainerModel, Layout, StyleProps, TextCaptionBar, WidgetActions } from "../core/types";
import { IWidget } from "../interfaces/IWidget";

export interface ContainerProps {
    layout?: Layout;
    style?: Partial<StyleProps>;
    spacing?: { x: number; y: number };
    name?: string;
    description?: string;
    actions?: object;
}


export class Container implements IWidget {
    public readonly type = "container";
    public readonly id: string;
    public readonly name: string;
    public description?: string;
    public style?: Partial<StyleProps>;
    public compilation: Compilation = new Compilation("Container");
    public captionBar?: boolean | TextCaptionBar | Record<string, unknown>;
    public actions?: WidgetActions;
    public dragSource?: Record<string, unknown>;
    public dropTarget?: Record<string, unknown>;
    public layout: Layout;
    public toolbars?: Record<string, unknown>;
    public options: {
        spacing?: { x?: number; y?: number };
        style?: Partial<StyleProps>;
        styleByTheme?: Record<string, Partial<StyleProps>>;
        [key: string]: unknown;
    };

    constructor(options: ContainerProps = {}
    ) {
        this.id = syslib.uuid();
        this.name = options.name ?? ("Container" + this.id);
        this.description = options.description?? "";
        this.layout = { x: 0, y: 0, w: 1, h: 1 };
        this.options = { spacing: options.spacing, style: options.style };
    }

    setStyle(style: Partial<StyleProps>): this {
        this.style = {
            ...this.style,
            ...style,
        };
        return this;
    }

    setLayout(layout: Layout): void {
        this.layout = layout;
    }

    /** Returns the raw compilation — use as a top-level WebStudio page. */
    getModel(): ContainerModel {

        const compilation = this.compilation.getModel();
        return {
            type: "container",
            name: this.name ?? compilation.name ?? "Container",
            description: this.description?? compilation.info?.title ?? "",
            id: this.id,
            compilation,
            captionBar: this.captionBar,
            actions: this.actions,
            dragSource: this.dragSource,
            dropTarget: this.dropTarget,
            layout: this.layout,
            toolbars: this.toolbars,
            options: this.options,
        };


    }
}
