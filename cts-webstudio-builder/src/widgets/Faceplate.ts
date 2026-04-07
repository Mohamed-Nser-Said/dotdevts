import { FaceplateModel } from "../core/types";

export interface FaceplateProps {
    name?: string;
    description?: string;
    path?: string;
    actions?: Record<string, unknown>;
    dataSource?: Record<string, unknown>;
    toolbars?: Record<string, unknown>;
}

export class Faceplate {
    model: FaceplateModel;

    constructor(props?: FaceplateProps) {
        props = props || {};
        this.model = {
            type: "faceplate",
            name: props.name || "Faceplate",
            description: props.description || "Faceplate Widget",
            actions: props.actions || {},
            dataSource: props.dataSource || {},
            path: props.path || "/System/Core/Examples/Demo Data/Process Data/DC4711",
            toolbars: props.toolbars || {},
            id: syslib.uuid(),
        };
    }

    getModel(): FaceplateModel {
        return this.model;
    }
}
