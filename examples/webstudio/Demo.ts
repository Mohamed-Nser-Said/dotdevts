import { Compilation } from "../../webstudio-builder/src/core/Compilation";



export default function index() {

    const compilation = new Compilation("Demo Compilation");
    compilation.addWidget({
        "type": "text",
        "name": "Simple Text",
        "description": "Simple Text",
        "text": "Your text here",
        "captionBar": {
            "hidden": false,
            "title": "Simple Text Widget"
        },
        "options": {
            "style": {
                "color": "grey",
                "textAlign": "center",
                "fontSize": "26px",
                "fontWeight": "bold",
                "fontFamily": "\"Courier New\", Courier, sans-serif"
            }
        },
        "layout": {
            "x": 0,
            "y": 0,
            "w": 32,
            "h": 32
        }
    });
    return compilation.getModel();


}
