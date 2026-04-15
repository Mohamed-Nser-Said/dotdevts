import {
    ModelTreeModel,
    ModifyAction,
    StyleProps,
} from "../../core/types";

export interface ModelTreeProps {
    modelRoot?: string | Record<string, unknown>;
    options?: Record<string, unknown>;
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

const defaultOptions: Record<string, unknown> = {
    showRoot: true,
    style: defaultStyle,
};

export class ModelTree {
    public readonly type = "modeltree";
    public readonly id: string;
    public name: string;

    constructor(
        public modelRoot: string | Record<string, unknown> = "",
        public options: Record<string, unknown> = defaultOptions,
        name?: string,
        public description: string = "Model Tree Widget",
        public actions?: object,
    ) {
        this.id = syslib.uuid();
        this.name = name ?? ("ModelTree" + this.id);
    }

    setModelRoot(modelRoot: string | Record<string, unknown>): ModifyAction {
        this.modelRoot = modelRoot;
        return { type: "modify", id: this.id, target: this.id, changes: { modelRoot } };
    }

    getModel(): ModelTreeModel {
        return {
            type: "modeltree",
            id: this.id,
            name: this.name,
            description: this.description,
            modelRoot: this.modelRoot,
            options: this.options,
            actions: this.actions,
        };
    }
}
