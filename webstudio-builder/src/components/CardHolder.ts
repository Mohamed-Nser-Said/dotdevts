import { HLayoutContainer } from "../layouts/HLayoutContainer";

export interface CardHolderProps {
    name?: string;
    description?: string;
    columns?: number[];
    gap?: number;
}

export class CardHolder extends HLayoutContainer {
    constructor(props?: CardHolderProps) {
        props = props || {};

        super({
            name: props.name || "CardHolder",
            description: props.description || "Card holder",
            columns: props.columns || [1],
            gap: props.gap === undefined ? 2 : props.gap,
        });
    }

    addCard(widget: object, col: number): this {
        this.addWidget(widget, col);
        return this;
    }
}
