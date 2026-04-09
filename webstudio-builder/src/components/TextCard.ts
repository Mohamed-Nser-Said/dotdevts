import { Window } from "../core/Window";
import { StyleProps } from "../core/types";
import { VLayoutContainer } from "../layouts/VLayoutContainer";
import { InfoText } from "./InfoText";
import { Title } from "./Title";

export interface TextCardProps {
    name?: string;
    title?: string;
    content?: string;
    backgroundColor?: string;
    borderColor?: string;
    borderRadius?: string;
    titleFontSize?: string;
    titleColor?: string;
    contentFontSize?: string;
    contentColor?: string;
    gap?: number;
    padding?: string;
}

const defaultCardStyle: StyleProps = {
    backgroundColor: "#f8fbff",
    borderRadius: "14px",
    border: "1px solid #dbeafe",
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
    transition: "all 0.2s ease",
    cursor: "pointer",
};

export class TextCard extends VLayoutContainer {
    private readonly titleWidget: Title;
    private readonly contentWidget: InfoText;
    private readonly baseContainerStyle: Partial<StyleProps>;
    private readonly hoverContainerStyle: Partial<StyleProps>;
    private readonly baseTitleStyle: Partial<StyleProps>;
    private readonly hoverTitleStyle: Partial<StyleProps>;
    private readonly baseContentStyle: Partial<StyleProps>;
    private readonly hoverContentStyle: Partial<StyleProps>;

    constructor(props?: TextCardProps) {
        props = props || {};

        const cardTitle = props.title || "Card Title";
        const cardContent = props.content || "Card content goes here";
        const cardBackground = props.backgroundColor || defaultCardStyle.backgroundColor || "#f8fbff";
        const cardBorder = props.borderColor || "#dbeafe";
        const cardRadius = props.borderRadius || defaultCardStyle.borderRadius || "14px";
        const cardPadding = props.padding || "16px";
        const cardGap = props.gap === undefined ? 0 : props.gap;

        super({
            name: props.name || "TextCard",
            description: "Text Card",
            rows: [1, 3],
            gap: cardGap,
        });

        this.baseContainerStyle = {
            backgroundColor: cardBackground,
            border: `1px solid ${cardBorder}`,
            borderRadius: cardRadius,
            boxShadow: defaultCardStyle.boxShadow,
            transition: defaultCardStyle.transition,
            cursor: defaultCardStyle.cursor,
        };

        this.hoverContainerStyle = {
            ...this.baseContainerStyle,
            backgroundColor: "#eef6ff",
            boxShadow: "0 12px 28px rgba(37, 99, 235, 0.16)",
            border: `1px solid ${cardBorder}`,
        };

        this.baseTitleStyle = {
            backgroundColor: "transparent",
            color: props.titleColor || "#0f172a",
            fontSize: props.titleFontSize || "26px",
            fontWeight: "bold",
            textAlign: "left",
            padding: `${cardPadding} ${cardPadding} 6px ${cardPadding}`,
            border: "none",
        };

        this.hoverTitleStyle = {
            ...this.baseTitleStyle,
            color: "#1d4ed8",
        };

        this.baseContentStyle = {
            backgroundColor: "transparent",
            color: props.contentColor || "#475569",
            fontSize: props.contentFontSize || "15px",
            fontWeight: "normal",
            textAlign: "left",
            padding: `0px ${cardPadding} ${cardPadding} ${cardPadding}`,
            border: "none",
        };

        this.hoverContentStyle = {
            ...this.baseContentStyle,
            color: props.contentColor || "#334155",
        };

        this.titleWidget = new Title({
            name: `${props.name || "TextCard"}_title`,
            text: cardTitle,
            fontSize: props.titleFontSize,
            color: props.titleColor,
            style: this.baseTitleStyle,
        });

        this.contentWidget = new InfoText({
            name: `${props.name || "TextCard"}_content`,
            text: cardContent,
            fontSize: props.contentFontSize,
            color: props.contentColor,
            style: this.baseContentStyle,
        });

        this.addWidget(this.titleWidget.getModel(), 1);
        this.addWidget(this.contentWidget.getModel(), 2);

        this.model.options = {
            spacing: { x: 0, y: cardGap },
            style: this.baseContainerStyle,
        };

        this.attachHover(this.titleWidget);
        this.attachHover(this.contentWidget);
    }

    private attachHover(widget: Title | InfoText): void {
        const hoverIn = (ctx: Window) => {
            ctx.setStyle(this.model.id, this.hoverContainerStyle, true)
                .setStyle(this.titleWidget.model.id, this.hoverTitleStyle, true)
                .setStyle(this.contentWidget.model.id, this.hoverContentStyle, true);
        };

        const hoverOut = (ctx: Window) => {
            ctx.setStyle(this.model.id, this.baseContainerStyle, true)
                .setStyle(this.titleWidget.model.id, this.baseTitleStyle, true)
                .setStyle(this.contentWidget.model.id, this.baseContentStyle, true);
        };

        widget.on("onMouseEnter", hoverIn);
        widget.on("onMouseOver", hoverIn);
        widget.on("onMouseLeave", hoverOut);
        widget.on("onMouseOut", hoverOut);
    }

    onClicked(handler: (ctx: Window) => void): this {
        this.titleWidget.onClicked(handler);
        this.contentWidget.onClicked(handler);
        return this;
    }
}
