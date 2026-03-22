import { GenericFolder } from "../src/base/GenericFolder";
import { ObjectContainer } from "../src/base/ObjectContainer";
import { Variable } from "../src/base/Variable";


export function main(): void {
        const basePath = "/System/Core/ObjectContainerExample";

        console.log("  [0] Create parent folder");
        const parent = new GenericFolder(basePath, { cleanupExisting: true });
        console.log("      Parent:", parent.path.absolutePath());

        console.log("  [1] Create some objects to work with");
        const v1 = new Variable(basePath + "/Var1", 10);
        const v2 = new Variable(basePath + "/Var2", 20);
        const v3 = new Variable(basePath + "/Var3", 30);
        console.log("      Created 3 variables.");

        console.log("  [2] Create ObjectContainer with initial objects");
        const container = new ObjectContainer([v1, v2]);
        console.log("      Container size:", container.objects.length);

        console.log("  [3] Add another object");
        container.add(v3);
        console.log("      Container size after add:", container.objects.length);

        console.log("  [4] addMany");
        const v4 = new Variable(basePath + "/Var4", 40);
        const v5 = new Variable(basePath + "/Var5", 50);
        container.addMany([v4, v5]);
        console.log("      Container size after addMany:", container.objects.length);

        console.log("  [5] forEach - log all paths");
        container.forEach((obj) => {
                console.log("      -", obj.path.absolutePath());
        });

        console.log("  [6] map - collect names");
        const names = container.map((obj) => obj.path.name());
        console.log("      Names:", String(names));

        console.log("  [7] removeByName");
        container.removeByName("Var3");
        console.log("      Container size after remove:", container.objects.length);

        console.log("  [8] Create container from string paths");
        const pathContainer = new ObjectContainer([
                basePath + "/Var1",
                basePath + "/Var2",
        ]);
        console.log("      Path container size:", pathContainer.objects.length);

        console.log("  ObjectContainerExample done.");
}
