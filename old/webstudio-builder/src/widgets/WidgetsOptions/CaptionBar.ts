import { TextCaptionBar } from "../../core/types";

/**
 * The caption bar is the title strip shown at the top of a widget.
 * It displays a label and can be shown or hidden independently of the widget.
 *
 * Usage:
 *   new CaptionBar("My Title")          → visible, title = "My Title"
 *   new CaptionBar("My Title", true)    → hidden (bar exists but is collapsed)
 *   CaptionBar.hidden("My Title")       → shorthand for hidden
 *   CaptionBar.none()                   → no caption bar at all (false)
 */
export class CaptionBar implements TextCaptionBar {
    readonly hidden: boolean;
    readonly title: string;

    constructor(title: string, hidden: boolean = false) {
        this.title = title;
        this.hidden = hidden;
    }

    /** Caption bar exists but is collapsed/hidden. */
    static hidden(title: string): CaptionBar {
        return new CaptionBar(title, true);
    }

    /**
     * Disable the caption bar entirely.
     * Use this when you don't want any title strip on the widget.
     */
    static none(): false {
        return false;
    }
}
