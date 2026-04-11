import { Button, ButtonProps } from "../widgets/GenericWidgets/Button";

const warningStyle = {
    background: "#ffab2d",
    border: "none",
    borderRadius: "4px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    color: "white",
    cursor: "pointer",
    fontSize: "14px",
    outline: "none",
    transition: "all 0.2s ease",
};

export class WarningButton extends Button {
    constructor(props?: ButtonProps) {
        super({
            name: "WarningButton",
            ...props,
            style: { ...warningStyle, ...(props && props.style ? props.style : {}) },
        });
    }
}
