import { StyleProps } from "../core/types";
import { GridLayoutOptions } from "../layouts/GridLayout";
import { GridLayoutContainer } from "../layouts/GridLayoutContainer";

export interface BodyProps extends GridLayoutOptions {
    name?: string;
    description?: string;
    style?: Partial<StyleProps>;
    backgroundColor?: string;
    inheritedStyle?: Partial<StyleProps>;
}

const defaultBodyGrid: GridLayoutOptions = {
    columns: [1],
    rows: [8],
    gap: 2,
    padding: { x: 2, y: 2 },
    numberOfRows: { type: "height", value: 34 },
};

const defaultBodyStyle: StyleProps = {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    border: "1px solid #dbeafe",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.06)",
    padding: "10px",
};

/**
 * Visible content surface for a page.
 * Use it to group widgets inside a styled body panel that can inherit page defaults.
 */
export class Body extends GridLayoutContainer {
    readonly style: Partial<StyleProps>;

    constructor(props?: BodyProps) {
        props = props || {};
        const options: GridLayoutOptions = {
            ...defaultBodyGrid,
            ...props,
        };

        super({
            name: props.name || "Body",
            description: props.description || "Page body",
            columns: options.columns,
            rows: options.rows,
            gap: options.gap,
            padding: options.padding,
            spacing: options.spacing,
            numberOfColumns: options.numberOfColumns,
            numberOfRows: options.numberOfRows,
            stacking: options.stacking,
            showDevTools: options.showDevTools,
        });

        this.style = {
            ...defaultBodyStyle,
            ...(props.inheritedStyle || {}),
            ...(props.backgroundColor ? { backgroundColor: props.backgroundColor } : {}),
            ...(props.style || {}),
        };

        this.model.options.style = this.style;
        this.model.layout = { x: 0, y: 0, w: 1, h: 1, static: true };
    }

    add(widget: object, col: number, row: number): this {
        this.addWidget(widget, col, row);
        return this;
    }

    setStyle(style: Partial<StyleProps>): this {
        this.model.options.style = {
            ...(this.model.options.style || {}),
            ...style,
        };
        return this;
    }
}
