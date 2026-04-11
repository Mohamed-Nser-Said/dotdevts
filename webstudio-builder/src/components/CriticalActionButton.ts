import { Button, ButtonProps } from "../widgets/GenericWidgets/Button";

const criticalStyle = {
    background: "#e74c3c",
    border: "none",
    borderRadius: "4px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    color: "white",
    cursor: "pointer",
    fontSize: "14px",
    outline: "none",
    transition: "all 0.2s ease",
};

export class CriticalActionButton extends Button {
    constructor(props?: ButtonProps) {
        super({
            name: "CriticalActionButton",
            ...props,
            style: { ...criticalStyle, ...(props && props.style ? props.style : {}) },
        });
    }
}
