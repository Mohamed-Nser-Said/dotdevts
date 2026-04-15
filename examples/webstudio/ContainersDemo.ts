import "../../prelude";
import { HContainer, VContainer, GridContainer } from "../../webstudio-builder/src/layouts/Containers";
import { Text } from "../../webstudio-builder/src/widgets/GenericWidgets/Text";
import { Button } from "../../webstudio-builder/src/widgets/GenericWidgets/Button";
import { WebStudioCompilation } from "../../webstudio-builder/src/layouts/Compilation";

// Top-level page: 3 columns, each demonstrating one container type.


const createText = (txt: string) => {
    const style = { fontSize: "14px", fontWeight: "bold", marginBottom: "4px", backgroundColor: "#f0f0f0", padding: "4px", textAlign: "center" };
    return new Text(txt).setStyle(style);
};
export function containersDemo(): WebStudioCompilation {
    const page = new GridContainer({
        columns: [1, 1, 1],
        rows: [1, 3, 3],
        gap: 4,
        padding: { x: 4, y: 4 },
        numberOfRows: { type: "height", value: 30 },
        showDevTools: true,
    });

    // ── Header row ────────────────────────────────────────────
    page.addWidget(createText("HContainer"), 1, 1);
    page.addWidget(createText("VContainer"), 2, 1);
    page.addWidget(createText("GridContainer"), 3, 1);

    // ── HContainer demo: 3 equal columns in one row ───────────
    const h = new HContainer({ columns: [1, 1, 1], gap: 4 });
    h.addWidget(new Text("Left", "h-l"), 1);
    h.addWidget(new Text("Center", "h-c"), 2);
    h.addWidget(new Text("Right", "h-r"), 3);
    page.addWidget(h, 1, 2);

    // ── VContainer demo: 3 rows with 1:2:1 weight ────────────
    const v = new VContainer({ rows: [1, 2, 1], gap: 4, numberOfRows: { type: "height", value: 30 } });
    v.addWidget(new Text("Top", "v-t"), 1);
    v.addWidget(new Text("Middle", "v-m"), 2);
    v.addWidget(new Text("Bottom", "v-b"), 3);
    page.addWidget(v, 2, 2);

    // ── GridContainer demo: 2×2 ───────────────────────────────
    const g = new GridContainer({ columns: [1, 1], rows: [1, 2], gap: 4, numberOfRows: { type: "height", value: 30 } });
    g.addWidget(new Text("A", "g-a"), 1, 1);
    g.addWidget(new Text("B", "g-b"), 2, 1);
    g.addWidget(new Button("Action", () => { }, undefined, "g-btn"), 1, 2);
    g.addWidget(new Text("D", "g-d"), 2, 2);
    page.addWidget(g, 3, 2);

    // ── Row 3: descriptions ───────────────────────────────────
    page.addWidget(new Text("Single row, N cols", "h-desc"), 1, 3);
    page.addWidget(new Text("Single col, N rows", "v-desc"), 2, 3);
    page.addWidget(new Text("Full col × row grid", "g-desc"), 3, 3);

    return page.getCompilation();
}

