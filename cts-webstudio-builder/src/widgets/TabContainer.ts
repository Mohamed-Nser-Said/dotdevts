import { TabsModel } from "../core/types";
import { Tab } from "./Tab";

export interface TabContainerProps {
    name?: string;
    description?: string;
    tabAlignment?: "left" | "center" | "right";
    captionBar?: boolean;
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
            options: {
                indicator: {
                    style: {
                        fontSize: "24px",
                        justifyContent: "center",
                        padding: "3px",
                    },
                },
                tabAlignment: props.tabAlignment || "left",
            },
            tabs: [],
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
