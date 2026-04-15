import { Compilation, WebStudioCompilation, WebStudioWidget } from "./Compilation";
import { ContainerModel, StyleProps } from "../core/types";
import { IWidget } from "../interfaces/IWidget";

export interface ContainerProps {
    compilation?: Compilation;
    style?: Partial<StyleProps>;
    spacing?: { x: number; y: number };
    name?: string;
    description?: string;
    actions?: object;
}


export class Container implements IWidget {
    public readonly type = "container";
    public readonly id: string;
    public compilation: Compilation = new Compilation("Container");
    public model: ContainerModel;

    constructor(
        public style: Partial<StyleProps> = {},
        public spacing: { x: number; y: number } = { x: 2, y: 2 },
        public name?: string,
        public description: string = "Container Widget",
        public actions?: object,
    ) {
        this.id = syslib.uuid();
        this.name = name ?? ("Container" + this.id);
        this.model = {
            type: "container",
            name: this.name,
            description: this.description,
            id: this.id,
            compilation: this.compilation.getModel(),
            options: {
                spacing: this.spacing,
                style: this.style,
            },
        };
    }

    setStyle(style: Partial<StyleProps>): this {
        this.style = {
            ...this.style,
            ...style,
        };
        return this;
    }


    /** Returns the raw compilation — use as a top-level WebStudio page. */
    getModel():ContainerModel {

        this.model.compilation = this.compilation.getModel() ;
        return this.model;
        
       
    }
}
