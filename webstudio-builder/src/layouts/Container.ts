import { Compilation, WebStudioCompilation } from "./Compilation";
import { StyleProps } from "../core/types";
import { IWidget } from "../interfaces/IWidget";

export interface ContainerProps {
    compilation?: Compilation;
    style?: Partial<StyleProps>;
    spacing?: { x: number; y: number };
    name?: string;
    description?: string;
    actions?: object;
}


export class Container implements IWidget{
    public readonly type = "container";
    public readonly id: string;
    public compilation: Compilation = new Compilation("Container");

    constructor(
        public style: Partial<StyleProps> = {},
        public spacing: { x: number; y: number } = { x: 2, y: 2 },
        public name?: string,
        public description: string = "Container Widget",
        public actions?: object,
    ) {
        this.id = syslib.uuid();
        this.name = name ?? ("Container" + this.id);
    }

    setCompilation(compilation: Compilation): this {
        this.compilation = compilation;
        return this;
    }

    setStyle(style: Partial<StyleProps>): this {
        this.style = {
            ...this.style,
            ...style,
        };
        return this;
    }


    /** Returns the raw compilation — use as a top-level WebStudio page. */
    getModel(): WebStudioCompilation {
        return this.compilation.getModel();
    }
}
