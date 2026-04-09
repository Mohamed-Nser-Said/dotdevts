import { PipelineStep, TextCaptionBar, WidgetActions } from "../core/types";
import { Window } from "../core/Window";

export interface BaseWidgetProps<TActions extends WidgetActions = WidgetActions> {
    name?: string;
    title?: string;
    description?: string;
    showCaption?: boolean;
    actions?: TActions;
    dataSource?: Record<string, unknown>;
    toolbars?: Record<string, unknown>;
    window?: Window;
}

type CaptionDefault = "auto" | "visible" | "hidden";

export abstract class BaseWidget<TModel, TActions extends WidgetActions = WidgetActions> {
    model!: TModel;
    window: Window;

    protected constructor(window?: Window) {
        this.window = window ? window : new Window();
    }

    protected createId(): string {
        return syslib.uuid();
    }

    protected getName(props: BaseWidgetProps<TActions> | undefined, fallback: string): string {
        return props && props.name ? props.name : fallback;
    }

    protected getDescription(props: BaseWidgetProps<TActions> | undefined, fallback: string): string {
        return props && props.description ? props.description : fallback;
    }

    protected getActions(props: BaseWidgetProps<TActions> | undefined, fallback?: TActions): TActions {
        if (props && props.actions) {
            return props.actions;
        }
        return (fallback ? fallback : {}) as TActions;
    }

    protected getDataSource(props: BaseWidgetProps<TActions> | undefined): Record<string, unknown> {
        return props && props.dataSource ? props.dataSource : {};
    }

    protected getToolbars(props: BaseWidgetProps<TActions> | undefined): Record<string, unknown> {
        return props && props.toolbars ? props.toolbars : {};
    }

    protected getCaptionBar(
        props: BaseWidgetProps<TActions> | undefined,
        fallbackTitle: string,
        defaultMode: "visible" | "hidden",
    ): TextCaptionBar | false;
    protected getCaptionBar(
        props: BaseWidgetProps<TActions> | undefined,
        fallbackTitle: string,
        defaultMode?: CaptionDefault,
    ): TextCaptionBar | false | undefined;
    protected getCaptionBar(
        props: BaseWidgetProps<TActions> | undefined,
        fallbackTitle: string,
        defaultMode: CaptionDefault = "auto",
    ): TextCaptionBar | false | undefined {
        const title = props && (props.title || props.name) ? (props.title || props.name) as string : fallbackTitle;

        if (props && props.showCaption === true) {
            return { hidden: false, title };
        }
        if (props && props.showCaption === false) {
            return false;
        }
        if (defaultMode === "visible") {
            return { hidden: false, title };
        }
        if (defaultMode === "hidden") {
            return false;
        }
        return undefined;
    }

    protected addHook(actions: TActions | undefined, hook: string, handler: (ctx: Window) => void): TActions {
        const targetActions = (actions ? actions : ({} as TActions)) as WidgetActions;

        if (!targetActions[hook]) {
            targetActions[hook] = [];
        }

        handler(this.window);

        const recorded: PipelineStep[] = this.window.getActions();
        const pipeline = targetActions[hook] as PipelineStep[];
        for (const step of recorded) {
            pipeline.push(step);
        }

        this.window.reset();
        return targetActions as TActions;
    }
}
