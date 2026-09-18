import {
  InputLabelProps,
  TextField as MuiTextField,
  StandardTextFieldProps,
} from '@mui/material';
import { useField } from 'formik';
import { ComponentProps } from 'react';

type MuiTextFieldProps = ComponentProps<typeof MuiTextField>;

interface TextFieldProps extends StandardTextFieldProps {
  name: string;
  customError?: boolean;
  slotProps?: MuiTextFieldProps['slotProps'];
}

/** A wrapper over MuiTextField integrated with Formik (Needs outer formik context to work) */
const TextField = ({
  name,
  customError = false,
  error,
  helperText,
  type,
  slotProps,
  ...rest
}: TextFieldProps) => {
  const [field, meta] = useField(name);
  const fieldProps =
    type === 'file' ? { name: field.name, onBlur: field.onBlur } : field;
  const resolvedId = (rest.id ?? name.replace(/\./g, '-')) as string;
  return (
    <MuiTextField
      {...fieldProps}
      {...rest}
      id={resolvedId}
      type={type}
      slotProps={{
        ...slotProps,
        inputLabel: {
          ...(slotProps?.inputLabel as InputLabelProps),
          htmlFor:
            (slotProps?.inputLabel as InputLabelProps)?.htmlFor ?? resolvedId,
          shrink:
            type === 'file'
              ? true
              : (slotProps?.inputLabel as InputLabelProps)?.shrink,
        },
        input: {
          ...(slotProps?.input as MuiTextFieldProps['slotProps']['input']),
          id:
            (slotProps?.input as MuiTextFieldProps['slotProps']['input'])?.id ??
            resolvedId,
          name:
            (slotProps?.input as MuiTextFieldProps['slotProps']['input'])
              ?.name ?? name,
        },
        select: {
          ...(slotProps?.select as MuiTextFieldProps['slotProps']['select']),
          id:
            (slotProps?.select as MuiTextFieldProps['slotProps']['select'])
              ?.id ?? resolvedId,
          inputProps: {
            ...((slotProps?.select as MuiTextFieldProps['slotProps']['select'])
              ?.inputProps as Record<string, unknown> | undefined),
            id: resolvedId,
            name,
          },
        },
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

export default TextField;
