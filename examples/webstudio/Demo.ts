import "../../prelude";
import { Compilation } from "../../webstudio-builder/src/layouts/Compilation";
import { Text } from "../../webstudio-builder/src/widgets/GenericWidgets/Text";



export function index() {

    const compilation = new Compilation("Demo Compilation");
    const text = new Text("myTExt");
    compilation.addWidget(text);
    compilation.addWidgetMany([
        new Text("Another text"),
        new Text("And another one"),
        new Text("And another one"),
        new Text("And another one"),
        new Text("And another one"),
        new Text("And another one"),
        new Text("And another one"),
    ]);
    return compilation.getModel();


}
