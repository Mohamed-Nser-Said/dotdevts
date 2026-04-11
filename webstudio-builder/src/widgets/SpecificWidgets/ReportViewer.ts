import { ReportViewerModel, StyleProps, WidgetActions } from "../../core/types";
import { Window } from "../../core/Window";
import { BaseWidget, BaseWidgetProps } from "../BaseWidget";

export interface ReportViewerProps extends BaseWidgetProps {
    viewerOptions?: Record<string, unknown>;
    reportData?: unknown;
    designs?: unknown[];
    style?: Partial<StyleProps>;
}

export class ReportViewer extends BaseWidget<ReportViewerModel> {
    constructor(props?: ReportViewerProps) {
        super(props && props.window ? props.window : undefined);
        props = props || {};

        this.model = {
            type: "reportviewer",
            name: this.getName(props, "ReportViewer"),
            description: this.getDescription(props, "Report Viewer Widget"),
            id: this.createId(),
            actions: this.getActions(props),
            captionBar: this.getCaptionBar(props, "Report Viewer", "hidden"),
            dataSource: this.getDataSource(props),
            toolbars: this.getToolbars(props),
            options: props.style ? { style: props.style } : undefined,
            viewerOptions: props.viewerOptions,
            reportData: props.reportData,
            designs: props.designs,
        };
    }

    setViewerOptions(options: Record<string, unknown>): this {
        this.model.viewerOptions = {
            ...(this.model.viewerOptions || {}),
            ...options,
        };
        return this;
    }

    setReportData(data: unknown): this {
        this.model.reportData = data;
        return this;
    }

    setDesigns(designs: unknown[]): this {
        this.model.designs = designs;
        return this;
    }

    private registerHook(hook: string, handler: (ctx: Window) => void): this {
        this.model.actions = this.addHook(this.model.actions, hook, handler);
        return this;
    }

    on(hook: string, handler: (ctx: Window) => void): this {
        return this.registerHook(hook, handler);
    }

    getModel(): ReportViewerModel {
        return this.model;
    }
}
