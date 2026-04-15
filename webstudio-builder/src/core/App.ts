import { IWidget } from "../interfaces/IWidget";
import { Compilation } from "../layouts/Compilation";
import { BaseLayout } from "../layouts/WidgetLayout";
import { ITheme } from "../theme/Theme";


export type AppOptions = {
    appName?: string;
    targetVersion?: "1.92.1";
    layout: "grid" | "horizontal" | "vertical";
    showDevTools?: boolean;
    numberOfColumns?: number;
    numberOfRows?: number;
    theme?: ITheme;
}

export class App {
    private readonly compilation: Compilation;
    private readonly widgetLayout = new BaseLayout();

    constructor(public readonly appName?: string, public readonly options?: AppOptions) {
        this.compilation = new Compilation(appName ?? "New App");
    }


    addWidget(widget: IWidget, col: number, row: number): this {
        this.widgetLayout.setLayout(widget, col, row);
        this.compilation.addWidget(widget);
        return this;
    }


}