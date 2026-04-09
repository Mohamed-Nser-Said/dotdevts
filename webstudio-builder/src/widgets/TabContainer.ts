import { TabsModel, WidgetActions } from "../core/types";
import { Tab } from "./Tab";

export interface TabContainerProps {
    name?: string;
    description?: string;
    tabAlignment?: "top" | "bottom" | "left" | "right";
    showTabBar?: boolean;
    captionBar?: boolean;
    actions?: WidgetActions;
    appearance?: TabsModel["appearance"];
}

// A tabs widget — renders as type "tabs" in WebStudio.
// Add Tab instances via addTab(); each tab carries its own embedded layout.
export class TabContainer {
    model: TabsModel;

    constructor(props?: TabContainerProps) {
        props = props || {};
        this.model = {
            type: "tabs",
            name: props.name || "Tabs",
            description: props.description || "Tab Container",
            id: syslib.uuid(),
            captionBar: props.captionBar !== false,
            appearance: props.appearance || { type: "docked" },
            options: {
                showTabBar: props.showTabBar !== false,
                indicator: {
                    style: {
                        fontSize: "16px",
                        justifyContent: "center",
                        padding: "6px 10px",
                    },
                },
                tabAlignment: props.tabAlignment || "top",
            },
            tabs: [],
            toolbars: {},
            actions: props.actions || {},
        };
    }

    addTab(tab: Tab): this {
        this.model.tabs.push(tab.getModel());
        return this;
    }

    getModel(): TabsModel {
        return this.model;
    }
}
