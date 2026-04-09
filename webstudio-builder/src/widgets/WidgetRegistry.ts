export class WidgetRegistry {
    widgets: Record<string, unknown>;

    constructor() {
        this.widgets = {};
    }

    register(name: string, widget: unknown): void {
        if (name !== undefined) {
            this.widgets[name] = widget;
        }
    }

    get(name: string): unknown {
        return this.widgets[name];
    }

    clear(): void {
        this.widgets = {};
    }
}
