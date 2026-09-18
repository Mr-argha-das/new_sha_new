import {
    TextField as MuiTextField,
    StandardTextFieldProps,
} from "@mui/material";
import { ClipboardEvent } from "react";

interface NumberFieldProps
    extends Omit<StandardTextFieldProps, "onChange" | "value"> {
    value: string | number;
    onChange: (value: string) => void;
    decimalScale?: number;
    allowNegative?: boolean;
    allowDecimal?: boolean;
}

const NumberField = ({
    value,
    onChange,
    decimalScale = 2,
    allowNegative = false,
    allowDecimal = false,
    ...rest
}: NumberFieldProps) => {
    const sanitizeValue = (val: string) => {
        let regex: RegExp;

        if (allowDecimal) {
            regex = allowNegative ? /[^0-9.-]/g : /[^0-9.]/g;
        } else {
            regex = allowNegative ? /[^0-9-]/g : /[^0-9]/g;
        }

        val = val.replace(regex, "");

        // Minus handling
        if (allowNegative) {
            const minusCount = val.split("-").length - 1;
            if (minusCount > 1) val = val.replace(/-/g, "");
            if (val.includes("-") && !val.startsWith("-")) {
                val = val.replace(/-/g, "");
            }
        } else {
            val = val.replace(/-/g, "");
        }

        if (allowDecimal) {
            const parts = val.split(".");
            if (parts.length > 2) {
                val = `${parts[0]}.${parts.slice(1).join("")}`;
            }

            if (val.includes(".")) {
                const [int, dec] = val.split(".");
                val = `${int}.${dec.slice(0, decimalScale)}`;
            }
        } else {
            val = val.replace(/\./g, "");
        }

        return val;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const sanitized = sanitizeValue(e.target.value);
        onChange(sanitized);
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text");
        const sanitized = sanitizeValue(pasted);
        onChange(sanitized);
    };

    return (
        <MuiTextField
            {...rest}
            type="text"
            value={value ?? ""}
            onChange={handleChange}
            onPaste={handlePaste}
        />
    );
};

export default NumberField;