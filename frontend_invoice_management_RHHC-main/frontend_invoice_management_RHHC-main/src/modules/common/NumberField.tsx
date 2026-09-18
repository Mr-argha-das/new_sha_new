import {
  TextField as MuiTextField,
  StandardTextFieldProps,
} from '@mui/material';
import { useField } from 'formik';
import { ClipboardEvent, ComponentProps } from 'react';

type MuiTextFieldProps = ComponentProps<typeof MuiTextField>;

interface NumberFieldProps extends StandardTextFieldProps {
  name: string;
  decimalScale?: number;
  allowNegative?: boolean;
  allowDecimal?: boolean;
  customError?: boolean;
  slotProps?: MuiTextFieldProps['slotProps'];
}

const NumberField = ({
  name,
  decimalScale = 2,
  allowNegative = false,
  allowDecimal = false,
  customError = false,
  error,
  helperText,
  slotProps,
  onChange: onChangeProp,
  ...rest
}: NumberFieldProps) => {
  const [field, meta, helpers] = useField(name);

  const sanitizeValue = (value: string) => {
    // Remove invalid characters
    let regex: RegExp;
    if (allowDecimal) {
      regex = allowNegative ? /[^0-9.-]/g : /[^0-9.]/g;
    } else {
      regex = allowNegative ? /[^0-9-]/g : /[^0-9]/g;
    }
    value = value.replace(regex, '');

    // Handle minus (only at start)
    if (allowNegative) {
      const minusCount = value.split('-').length - 1;
      if (minusCount > 1) {
        value = value.replace(/-/g, '');
      }
      if (value.includes('-') && !value.startsWith('-')) {
        value = value.replace(/-/g, '');
      }
    } else {
      value = value.replace(/-/g, '');
    }

    if (allowDecimal) {
      // Keep only one decimal point
      const parts = value.split('.');
      if (parts.length > 2) {
        value = `${parts[0]}.${parts.slice(1).join('')}`;
      }

      // Apply decimal scale if provided
      if (decimalScale !== undefined && value.includes('.')) {
        const [int, dec] = value.split('.');
        value = `${int}.${dec.slice(0, decimalScale)}`;
      }
    } else {
      // Remove any accidental dots
      value = value.replace(/\./g, '');
    }

    return value;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeValue(e.target.value);
    helpers.setValue(sanitized);
    // Call parent onChange with event that has the sanitized value
    onChangeProp?.({
      ...e,
      target: { ...e.target, value: sanitized },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const pasted = e.clipboardData.getData('text');
    const sanitized = sanitizeValue(pasted);
    helpers.setValue(sanitized);
  };

  return (
    <MuiTextField
      {...field}
      {...rest}
      type="text"
      value={field.value ?? ''}
      onChange={handleChange}
      onPaste={handlePaste}
      slotProps={{
        ...slotProps,
      }}
      error={customError ? error : Boolean(meta.touched && meta.error)}
      helperText={
        helperText === null || customError
          ? helperText
          : meta.touched && meta.error
      }
    />
  );
};

export default NumberField;
