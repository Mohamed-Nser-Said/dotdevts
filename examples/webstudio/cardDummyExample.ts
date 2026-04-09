import "../../prelude";

import { App } from "../../webstudio-builder/src/core/App";
import { Compilation } from "../../webstudio-builder/src/core/types";
import { GridLayout } from "../../webstudio-builder/src/layouts/GridLayout";
import { Text } from "../../webstudio-builder/src/widgets/Text";
import { CardHolder } from "../../webstudio-builder/src/components/CardHolder";
import { TextCard } from "../../webstudio-builder/src/components/TextCard";

export function createCardDummyExample(): Compilation {
    const title = new Text({
        name: "CardDummyTitle",
        text: "Dummy Card Example",
        showCaption: false,
        style: {
            backgroundColor: "#0f172a",
            color: "#ffffff",
            padding: "18px",
            fontSize: "26px",
            fontWeight: "bold",
            textAlign: "center",
            borderRadius: "14px",
        },
    });

    const cards = new CardHolder({
        name: "DummyCards",
        description: "Simple card holder demo",
        columns: [1, 1, 1, 1],
        gap: 2,
    });

    cards.addCard(new TextCard({
        name: "CardOne",
        title: "Card 1",
        content: "This is a simple dummy card for layout testing. Use it to preview how title and content spacing behave inside the layout. You can later replace this with KPI summaries, notes, or short operational guidance.",
        backgroundColor: "#f0f9ff",
        borderColor: "#60a5fa",
    }).onClicked((ctx) => {
        ctx.notify("Card 1 clicked").consoleLog("Card 1 clicked");
    }), 1);

    cards.addCard(new TextCard({
        name: "CardTwo",
        title: "Card 2",
        content: "Use this to preview spacing, colors, and text blocks. It is intentionally filled with more placeholder copy so you can better judge wrapping, padding, and visual balance across multiple cards in the same holder.",
        backgroundColor: "#f0fdf4",
        borderColor: "#34d399",
    }).onClicked((ctx) => {
        ctx.notify("Card 2 clicked").consoleLog("Card 2 clicked");
    }), 2);

    cards.addCard(new TextCard({
        name: "CardThree",
        title: "Card 3",
        content: "You can replace this content with real KPIs or actions later. For now, this longer dummy paragraph helps verify the card remains readable when the body text grows and spans several lines in the WebStudio page.",
        backgroundColor: "#fffbf0",
        borderColor: "#fb923c",
    }).onClicked((ctx) => {
        ctx.notify("Card 3 clicked").consoleLog("Card 3 clicked");
    }), 3);

    cards.addCard(new TextCard({
        name: "CardFour",
        title: "Card 4",
        content: "This extra dummy card gives you one more sample to review spacing, alignment, and card balance across a wider row in the layout.",
        backgroundColor: "#fdf4ff",
        borderColor: "#c084fc",
    }).onClicked((ctx) => {
        ctx.notify("Card 4 clicked").consoleLog("Card 4 clicked");
    }), 4);

    const layout = new GridLayout({
        columns: [1],
        rows: [4, 12],
        gap: 2,
        padding: { x: 2, y: 2 },
        spacing: { x: 2, y: 2 },
        numberOfColumns: 96,
        numberOfRows: { type: "height", value: 32 },
        stacking: "none",
    });

    const app = new App({ layout });
    app.add(title, 1, 1);
    app.add(cards, 1, 2);

    return app.build();
}

export const page = createCardDummyExample();

export default page;
