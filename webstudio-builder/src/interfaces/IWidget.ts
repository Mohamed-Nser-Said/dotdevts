import { WebStudioCompilation, WebStudioLayout, WebStudioWidget } from "../layouts/Compilation";


export interface IWidget {
    getModel(): WebStudioWidget| WebStudioCompilation;
}