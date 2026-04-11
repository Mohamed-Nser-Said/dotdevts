import { StyleProps } from "../core/types";
import { Window } from "../core/Window";
import { GridLayoutContainer } from "../layouts/GridLayoutContainer";
import { HLayoutContainer } from "../layouts/HLayoutContainer";
import { Button } from "../widgets/GenericWidgets/Button";
import { Text } from "../widgets/GenericWidgets/Text";

export interface NavBarMenuItem {
    label: string;
    name?: string;
    action?: string;
    signal?: string;
    actionName?: string; // backwards-compatible alias
    href?: string;
    url?: string; // backwards-compatible alias
    target?: "_self" | "_blank" | "_parent" | "_top";
    disabled?: boolean;
    style?: Partial<StyleProps>;
    closeOnClick?: boolean;
    onClick?: (ctx: Window) => void;
}

export interface NavBarItem extends NavBarMenuItem {
    active?: boolean;
    items?: NavBarMenuItem[];
    dropdownItems?: NavBarMenuItem[]; // backwards-compatible alias
    dropdownWidth?: string;
}

export interface NavBarProps {
    name?: string;
    description?: string;
    brand?: string;
    title?: string; // backwards-compatible alias
    leftSlot?: object;
    rightSlot?: object | object[];
    items?: NavBarItem[];
    gap?: number;
    titleStyle?: Partial<StyleProps>;
    itemStyle?: Partial<StyleProps>;
    containerStyle?: Partial<StyleProps>;
}

const defaultContainerStyle: StyleProps = {
    background: "linear-gradient(135deg, #0f172a 0%, #172554 55%, #1e3a8a 100%)",
    backgroundColor: "#0f172a",
    padding: "10px",
    borderRadius: "18px",
    border: "1px solid rgba(148, 163, 184, 0.18)",
    boxShadow: "0 14px 34px rgba(15, 23, 42, 0.24)",
};

const defaultTitleStyle: StyleProps = {
    color: "#ffffff",
    padding: "10px 14px",
    fontSize: "20px",
    fontWeight: "bold",
    textAlign: "left",
};

const defaultItemStyle: StyleProps = {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    color: "#e2e8f0",
    padding: "10px 16px",
    fontSize: "14px",
    borderRadius: "12px",
    border: "1px solid rgba(148, 163, 184, 0.10)",
    cursor: "pointer",
    transition: "all 0.18s ease",
};

const activeItemStyle: StyleProps = {
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    border: "1px solid rgba(191, 219, 254, 0.9)",
    boxShadow: "0 6px 14px rgba(37, 99, 235, 0.32)",
};

const dropdownItemStyle: StyleProps = {
    backgroundColor: "#ffffff",
    color: "#0f172a",
    padding: "10px 12px",
    fontSize: "13px",
    textAlign: "left",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    cursor: "pointer",
    boxShadow: "0 1px 0 rgba(255, 255, 255, 0.65) inset",
};

export class NavBar extends HLayoutContainer {
    constructor(props?: NavBarProps) {
        props = props || {};

        const items = props.items || [];
        const brand = props.brand || props.title;
        const hasTitle = !!brand;
        const leftSlots = props.leftSlot ? [props.leftSlot] : [];
        const rightSlots = Array.isArray(props.rightSlot)
            ? props.rightSlot
            : props.rightSlot ? [props.rightSlot] : [];

        super({
            name: props.name || "NavBar",
            description: props.description || "Reusable navigation bar",
            columns: NavBar.buildColumns(items.length + rightSlots.length + leftSlots.length, hasTitle),
            gap: props.gap === undefined ? 1 : props.gap,
        });

        this.model.options.style = {
            ...defaultContainerStyle,
            ...(props.containerStyle || {}),
        };
        this.model.layout = { x: 0, y: 0, w: 1, h: 1, static: true };

        let currentCol = 1;

        if (hasTitle) {
            const title = new Text({
                name: `${props.name || "NavBar"}Title`,
                text: brand,
                showCaption: false,
                style: {
                    ...defaultTitleStyle,
                    ...(props.titleStyle || {}),
                },
            });
            title.model.layout = { x: 0, y: 0, w: 1, h: 1, static: true };
            this.addWidget(title, currentCol);
            currentCol += 1;
        }

        for (const slot of leftSlots) {
            NavBar.markStatic(slot);
            this.addWidget(slot, currentCol);
            currentCol += 1;
        }

        for (const item of items) {
            const dropdownItems = item.items || item.dropdownItems;
            const button = new Button({
                name: item.name || item.label,
                label: dropdownItems && dropdownItems.length > 0 ? `${item.label} ▾` : item.label,
                disabled: item.disabled || false,
                style: {
                    ...defaultItemStyle,
                    ...(item.active ? activeItemStyle : {}),
                    ...(props.itemStyle || {}),
                    ...(item.style || {}),
                    opacity: item.disabled ? "0.55" : "1",
                },
            });
            button.model.layout = { x: 0, y: 0, w: 1, h: 1, static: true };

            if (dropdownItems && dropdownItems.length > 0) {
                button.onClicked((ctx) => {
                    ctx.prompt(
                        NavBar.buildDropdownMenu(item),
                        item.dropdownWidth || "220px",
                        `${Math.max(dropdownItems.length * 48, 70)}px`,
                    );
                });
            } else {
                NavBar.bindItemAction(button, item);
            }

            this.addWidget(button, currentCol);
            currentCol += 1;
        }

        for (const slot of rightSlots) {
            NavBar.markStatic(slot);
            this.addWidget(slot, currentCol);
            currentCol += 1;
        }
    }

    private static bindItemAction(button: Button, item: NavBarMenuItem, dismissAfterClick = false): void {
        if (item.onClick) {
            button.onClicked((ctx) => {
                item.onClick!(ctx);
                if (dismissAfterClick && item.closeOnClick !== false) {
                    ctx.dismiss();
                }
            });
            return;
        }

        const actionName = item.signal || item.action || item.actionName;
        if (actionName) {
            button.onClicked((ctx) => {
                ctx.action(actionName);
                if (dismissAfterClick && item.closeOnClick !== false) {
                    ctx.dismiss();
                }
            });
            return;
        }

        const url = item.href || item.url;
        if (url) {
            button.onClicked((ctx) => {
                ctx.openLink(url, item.target);
                if (dismissAfterClick && item.closeOnClick !== false) {
                    ctx.dismiss();
                }
            });
        }
    }

    private static buildDropdownMenu(item: NavBarItem): Record<string, unknown> {
        const dropdownItems = item.items || item.dropdownItems || [];
        const rows = dropdownItems.map(() => 1);
        const menu = new GridLayoutContainer({
            name: `${item.name || item.label}Menu`,
            description: `${item.label} dropdown menu`,
            columns: [1],
            rows: rows.length > 0 ? rows : [1],
            gap: 1,
            padding: { x: 1, y: 1 },
            numberOfRows: { type: "height", value: 34 },
        });

        menu.model.options.style = {
            backgroundColor: "#f8fafc",
            padding: "6px",
            borderRadius: "12px",
            border: "1px solid #cbd5e1",
            boxShadow: "0 12px 24px rgba(15, 23, 42, 0.18)",
        };
        menu.model.layout = { x: 0, y: 0, w: 1, h: 1, static: true };

        for (let i = 0; i < dropdownItems.length; i += 1) {
            const child = dropdownItems[i];
            const childButton = new Button({
                name: child.name || `${item.label}Item${i + 1}`,
                label: child.label,
                disabled: child.disabled || false,
                style: {
                    ...dropdownItemStyle,
                    ...(child.style || {}),
                    opacity: child.disabled ? "0.55" : "1",
                },
            });
            childButton.model.layout = { x: 0, y: 0, w: 1, h: 1, static: true };
            NavBar.bindItemAction(childButton, child, true);
            menu.addWidget(childButton, 1, i + 1);
        }

        return menu.getModel() as unknown as Record<string, unknown>;
    }

    private static markStatic(widget: object): void {
        const candidate = widget as { model?: { layout?: { x?: number; y?: number; w?: number; h?: number; static?: boolean } } };
        if (candidate.model) {
            candidate.model.layout = {
                x: 0,
                y: 0,
                w: 1,
                h: 1,
                static: true,
                ...(candidate.model.layout || {}),
            };
        }
    }

    private static buildColumns(itemCount: number, hasTitle: boolean): number[] {
        const columns: number[] = [];

        if (hasTitle) {
            columns.push(itemCount > 2 ? 2 : 1);
        }

        const safeCount = Math.max(itemCount, hasTitle ? 0 : 1);
        for (let i = 0; i < safeCount; i += 1) {
            columns.push(1);
        }

        return columns.length > 0 ? columns : [1];
    }
}
