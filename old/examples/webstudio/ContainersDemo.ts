import "../../prelude";
import { Text } from "../../webstudio-builder/src/widgets/GenericWidgets/Text";
import { App } from "../../webstudio-builder/src/core/App";
import { Container } from "../../webstudio-builder/src/layouts/Container";

// Top-level page: 3 columns, each demonstrating one container type.
export function containersDemo() {

    const app = new App("test", { columns: [1, 1, 1], rows: [1, 1, 1], gap: 1, showDevTools: true });

    const container1 = new Container({ columns: [1], rows: [1, 1, 3], gap: 1 });
    app.addWidget(container1, 1, 2);

    container1.addWidget(new Text("Example1 Text"), 1, 1);
    container1.addWidget(new Text("Example1 Text"), 1, 2);
    container1.addWidget(new Text("Example1 Text"), 1, 3);

    app.addWidget(new Text("Example1 Text"), 2, 2);
    app.addWidget(new Text("Example1 Text"), 3, 2);

    return app.build();


}

