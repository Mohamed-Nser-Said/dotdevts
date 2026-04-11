import {
    ModifyAction,
    SendAction,
    StyleProps,
    TreeActionHook,
    TreeActions,
    TreeModel,
    TreeNode,
    TreeOptions,
    TreeSchema,
    TreeSearchTable,
    TreeState,
} from "../../core/types";
import { Window } from "../../core/Window";
import { BaseWidget, BaseWidgetProps } from "../BaseWidget";

export interface TreeProps extends BaseWidgetProps<TreeActions> {
    data?: TreeNode[];
    schema?: TreeSchema;
    schemaExtension?: TreeSchema;
    searchTable?: TreeSearchTable;
    options?: TreeOptions;
    state?: TreeState;
    dragSource?: Record<string, unknown>;
    dropTarget?: Record<string, unknown>;
}

const defaultStyle: Partial<StyleProps> = {
    backgroundColor: "#ffffff",
    color: "#0f172a",
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid #dbeafe",
    boxShadow: "0 8px 20px rgba(37, 99, 235, 0.08)",
    height: "320px",
};

const defaultOptions: TreeOptions = {
    allowSearch: true,
    collapseOnSearchSelection: false,
    showRefreshButton: true,
    showToolbar: true,
    style: defaultStyle,
};

export class Tree extends BaseWidget<TreeModel, TreeActions> {
    constructor(props?: TreeProps) {
        super(props && props.window ? props.window : undefined);
        props = props || {};

        this.model = {
            type: "tree",
            name: this.getName(props, "Tree"),
            description: this.getDescription(props, "Tree Widget"),
            id: this.createId(),
            actions: this.getActions(props),
            data: props.data || [],
            dataSource: this.getDataSource(props),
            options: this.mergeOptions(props.options),
            schema: props.schema || {},
            schemaExtension: props.schemaExtension || {},
            searchTable: props.searchTable || {},
            state: props.state || { expandedNodes: [] },
            toolbars: this.getToolbars(props),
            dragSource: props.dragSource,
            dropTarget: props.dropTarget,
        };
    }

    private mergeOptions(options?: TreeOptions): TreeOptions {
        const nextOptions = options || {};
        const merged: TreeOptions = {
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

        if (nextOptions.rules) {
            merged.rules = nextOptions.rules;
        }

        return merged;
    }

    private registerHook(hook: TreeActionHook, handler: (ctx: Window) => void): this {
        this.model.actions = this.addHook(this.model.actions, hook, handler);
        return this;
    }

    setData(data: TreeNode[]): this {
        this.model.data = data;
        return this;
    }

    setSchema(schema: TreeSchema): this {
        this.model.schema = schema;
        return this;
    }

    setSchemaExtension(schemaExtension: TreeSchema): this {
        this.model.schemaExtension = schemaExtension;
        return this;
    }

    setOptions(options: TreeOptions): this {
        this.model.options = this.mergeOptions(options);
        return this;
    }

    setState(state: TreeState): this {
        this.model.state = state;
        return this;
    }

    setSearchTable(searchTable: TreeSearchTable): this {
        this.model.searchTable = searchTable;
        return this;
    }

    setExpandedNodes(expandedNodes: string[]): ModifyAction {
        return {
            type: "modify",
            id: this.model.id,
            set: [{ name: "model.state.expandedNodes", value: expandedNodes }],
        };
    }

    selectNode(nodeId: string): SendAction {
        return {
            type: "send",
            to: this.model.id,
            message: {
                topic: "selectTreeNode",
                payload: { id: nodeId },
            },
        };
    }

    selectPreviousNode(): SendAction {
        return {
            type: "send",
            to: this.model.id,
            message: {
                topic: "selectTreeNode",
                payload: { select: "previous" },
            },
        };
    }

    onClick(handler: (ctx: Window) => void): this {
        return this.registerHook("onClick", handler);
    }

    onSelect(handler: (ctx: Window) => void): this {
        return this.registerHook("onSelect", handler);
    }

    onSelectionChanged(handler: (ctx: Window) => void): this {
        return this.registerHook("onSelectionChanged", handler);
    }

    getModel(): TreeModel {
        return this.model;
    }
}
