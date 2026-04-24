import { IWidget } from "../interfaces/IWidget";
import { Compilation, WebStudioCompilation } from "../layouts/Compilation";
import { LayoutOptions, WidgetLayout } from "../layouts/WidgetLayout";
import { ITheme } from "../theme/Theme";


export type AppOptions = LayoutOptions & {
    appName?: string;
    targetVersion?: "1.92.1";
    theme?: ITheme;
}

export class App {
    private readonly compilation: Compilation;
    public readonly widgetLayout: WidgetLayout;

    constructor(public readonly appName?: string, public readonly options?: AppOptions) {
        this.compilation = new Compilation(appName ?? "New App");
        this.widgetLayout = new WidgetLayout(options);

        this.compilation.setLayout(this.widgetLayout.modelOptions);

    }


    addWidget(widget: IWidget, col: number, row: number): this {
        this.widgetLayout.setLayout(widget, col, row);
        this.compilation.addWidget(widget);
        return this;
    }

    build(): WebStudioCompilation {

        return this.compilation.getModel();
    }


}