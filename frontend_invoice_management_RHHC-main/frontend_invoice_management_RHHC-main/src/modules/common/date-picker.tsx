import { TextField as MuiTextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  DatePicker as MuiDatePicker,
  DatePickerProps as MuiDatePickerProps,
} from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import { useField, useFormikContext } from 'formik';
import * as React from 'react';
import { toYYYYMMDD } from './helpers/dateFormat';

interface DatePickerProps extends Omit<
  MuiDatePickerProps<Dayjs>,
  'value' | 'onChange' | 'renderInput'
> {
  name: string;
  label: string;
  customError?: boolean;
  onChange?: (value: Dayjs | null) => void;
}

/** A wrapper over MUI DatePicker integrated with Formik */
const DatePicker = ({
  name,
  label,
  customError = false,
  onChange,
  ...rest
}: DatePickerProps) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField<string>(name);
  const inputId = `${name.replace(/\./g, '-')}-date`;
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MuiDatePicker<Dayjs>
        {...rest}
        label={label}
        value={field.value ? dayjs(field.value) : null}
        format="DD/MM/YYYY"
        onChange={(newValue) => {
          setFieldValue(name, newValue ? toYYYYMMDD(newValue) : '');
          if (onChange) {
            onChange(newValue);
          }
        }}
        slotProps={{
          textField: {
            id: inputId,
            name,
            fullWidth: true,
            error: Boolean(meta.touched && meta.error), // must be boolean ✅
            helperText: customError
              ? meta.error
              : meta.touched && meta.error
                ? meta.error
                : undefined, // must be string | undefined ✅
          } as Partial<React.ComponentProps<typeof MuiTextField>>, // fix TS
        }}
        {...rest}
      />
    </LocalizationProvider>
  );
};

export default DatePicker;
