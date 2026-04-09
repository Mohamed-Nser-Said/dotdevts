import { Button, ButtonProps } from "../widgets/Button";

const primaryStyle = {
    background: "#3a56d4",
    border: "none",
    borderRadius: "4px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    color: "white",
    cursor: "pointer",
    fontSize: "14px",
    outline: "none",
    transition: "all 0.2s ease",
};

export class PrimaryButton extends Button {
    constructor(props?: ButtonProps) {
        super({
            name: "PrimaryButton",
            ...props,
            style: { ...primaryStyle, ...(props && props.style ? props.style : {}) },
        });
    }
}
