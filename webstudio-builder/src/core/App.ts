import { Compilation } from "../layouts/Compilation";

export class App {
    private readonly compilation: Compilation;

    constructor(public readonly appName?: string) {
        this.compilation = new Compilation(appName ?? "New App");
    }
}