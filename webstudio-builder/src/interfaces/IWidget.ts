import { ContainerModel } from "../core/types";
import { WebStudioCompilation, WebStudioWidget } from "../layouts/Compilation";


export interface IWidget {
    getModel(): WebStudioWidget | ContainerModel;
}