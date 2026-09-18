import { TextField as MuiTextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  DateTimePicker as MuiDateTimePicker,
  DateTimePickerProps as MuiDateTimePickerProps,
} from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import { useField, useFormikContext } from 'formik';
import * as React from 'react';

interface DateTimePickerProps extends Omit<
  MuiDateTimePickerProps<Dayjs>,
  'value' | 'onChange' | 'renderInput'
> {
  name: string;
  label: string;
  customError?: boolean;
  onChange?: (value: Dayjs | null) => void;
  slotProps?: MuiDateTimePickerProps<Dayjs>['slotProps'];
}

const DateTimePicker = ({
  name,
  label,
  customError = false,
  onChange,
  slotProps,
  ...rest
}: DateTimePickerProps) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField<string>(name);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MuiDateTimePicker<Dayjs>
        {...rest}
        label={label}
        value={field.value ? dayjs(field.value) : null}
        format="DD/MM/YYYY hh:mm (A)"
        onChange={(newValue) => {
          setFieldValue(name, newValue ? newValue.toISOString() : ''); // or custom format
          if (onChange) onChange(newValue);
        }}
        minutesStep={1}
        slotProps={{
          textField: {
            ...slotProps?.textField,
            fullWidth: true,
            error: Boolean(meta.touched && meta.error),
            helperText: customError
              ? meta.error
              : meta.touched && meta.error
                ? meta.error
                : undefined,
          } as Partial<React.ComponentProps<typeof MuiTextField>>,
          popper: {
            ...slotProps?.popper,
            placement: 'auto',
          },
          ...slotProps,
        }}
      />
    </LocalizationProvider>
  );
};

export default DateTimePicker;
