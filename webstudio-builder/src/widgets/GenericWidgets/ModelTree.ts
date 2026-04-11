import { ModelTreeModel, StyleProps, WidgetActions } from "../../core/types";
import { Window } from "../../core/Window";
import { BaseWidget, BaseWidgetProps } from "../BaseWidget";

export interface ModelTreeProps extends BaseWidgetProps {
    modelRoot?: string | Record<string, unknown>;
    schemaExtension?: Record<string, unknown>;
    searchTable?: Record<string, unknown>;
    style?: Partial<StyleProps>;
}

export class ModelTree extends BaseWidget<ModelTreeModel> {
    constructor(props?: ModelTreeProps) {
        super(props && props.window ? props.window : undefined);
        props = props || {};

        this.model = {
            type: "modeltree",
            name: this.getName(props, "ModelTree"),
            description: this.getDescription(props, "Model Tree Widget"),
            id: this.createId(),
            actions: this.getActions(props),
            captionBar: this.getCaptionBar(props, "Model Tree", "hidden"),
            dataSource: this.getDataSource(props),
            toolbars: this.getToolbars(props),
            options: props.style ? { style: props.style } : undefined,
            modelRoot: props.modelRoot,
            schemaExtension: props.schemaExtension,
            searchTable: props.searchTable,
        };
    }

    setModelRoot(root: string | Record<string, unknown>): this {
        this.model.modelRoot = root;
        return this;
    }

    setSchemaExtension(ext: Record<string, unknown>): this {
        this.model.schemaExtension = ext;
        return this;
    }

    private registerHook(hook: string, handler: (ctx: Window) => void): this {
        this.model.actions = this.addHook(this.model.actions, hook, handler);
        return this;
    }

    on(hook: string, handler: (ctx: Window) => void): this {
        return this.registerHook(hook, handler);
    }

    getModel(): ModelTreeModel {
        return this.model;
    }
}
