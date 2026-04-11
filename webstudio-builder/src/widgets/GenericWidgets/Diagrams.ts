import {
    DiagramsModel,
    DiagramsOptions,
    DiagramsPageModel,
    StyleProps,
    WidgetActions,
} from "../../core/types";
import { Window } from "../../core/Window";
import { BaseWidget, BaseWidgetProps } from "../BaseWidget";

export interface DiagramsProps extends BaseWidgetProps {
    diagramsData?: string;
    diagramsTheme?: "dark" | "kennedy" | string;
    diagramsOptions?: DiagramsOptions;
    pages?: DiagramsPageModel[];
    style?: Partial<StyleProps>;
}

export class Diagrams extends BaseWidget<DiagramsModel> {
    constructor(props?: DiagramsProps) {
        super(props && props.window ? props.window : undefined);
        props = props || {};

        this.model = {
            type: "diagrams",
            name: this.getName(props, "Diagrams"),
            description: this.getDescription(props, "Diagrams Widget"),
            id: this.createId(),
            actions: this.getActions(props),
            captionBar: this.getCaptionBar(props, "Diagrams", "hidden"),
            dataSource: this.getDataSource(props),
            toolbars: this.getToolbars(props),
            options: props.style ? { style: props.style } : undefined,
            pages: props.pages || [],
            diagramsData: props.diagramsData,
            diagramsTheme: props.diagramsTheme,
            diagramsOptions: props.diagramsOptions,
        };
    }

    setDiagramsData(data: string): this {
        this.model.diagramsData = data;
        return this;
    }

    setTheme(theme: "dark" | "kennedy" | string): this {
        this.model.diagramsTheme = theme;
        return this;
    }

    addPage(page: DiagramsPageModel): this {
        if (!this.model.pages) {
            this.model.pages = [];
        }
        this.model.pages.push(page);
        return this;
    }

    setActivePageId(pageId: string): this {
        this.model.state = { activePageId: pageId };
        return this;
    }

    setOptions(options: DiagramsOptions): this {
        this.model.diagramsOptions = {
            ...(this.model.diagramsOptions || {}),
            ...options,
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

    getModel(): DiagramsModel {
        return this.model;
    }
}
