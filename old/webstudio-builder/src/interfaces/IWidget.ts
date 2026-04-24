import { ContainerModel, Layout } from "../core/types";
import { WebStudioCompilation, WebStudioWidget } from "../layouts/Compilation";


export interface IWidget {
    layout: Layout;
    getModel(): WebStudioWidget | ContainerModel;
    setLayout(layout: Layout): void;
}