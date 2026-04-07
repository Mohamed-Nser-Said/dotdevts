import {
    ModifyAction,
    PipelineStep,
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
} from "../core/types";
import { Window } from "../core/Window";

export interface TreeProps {
    name?: string;
    description?: string;
    data?: TreeNode[];
    dataSource?: Record<string, unknown>;
    schema?: TreeSchema;
    schemaExtension?: TreeSchema;
    searchTable?: TreeSearchTable;
    options?: TreeOptions;
    state?: TreeState;
    toolbars?: Record<string, unknown>;
    actions?: TreeActions;
    dragSource?: Record<string, unknown>;
    dropTarget?: Record<string, unknown>;
    window?: Window;
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

export class Tree {
    model: TreeModel;
    window: Window;

    constructor(props?: TreeProps) {
        props = props || {};
        this.window = props.window ? props.window : new Window();

        this.model = {
            type: "tree",
            name: props.name || "Tree",
            description: props.description || "Tree Widget",
            id: syslib.uuid(),
            actions: props.actions || {},
            data: props.data || [],
            dataSource: props.dataSource || {},
            options: this.mergeOptions(props.options),
            schema: props.schema || {},
            schemaExtension: props.schemaExtension || {},
            searchTable: props.searchTable || {},
            state: props.state || { expandedNodes: [] },
            toolbars: props.toolbars || {},
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
        if (!this.model.actions) {
            this.model.actions = {};
        }
        if (!this.model.actions[hook]) {
            this.model.actions[hook] = [];
        }

        handler(this.window);

        const recorded: PipelineStep[] = this.window.getActions();
        for (const step of recorded) {
            this.model.actions[hook]!.push(step);
        }

        this.window.reset();
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
