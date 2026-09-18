import {
  Autocomplete,
  AutocompleteProps,
  Box,
  TextField,
  TextFieldProps,
} from '@mui/material';
import debounce from 'lodash-es/debounce';
import { FocusEvent, useEffect, useMemo, useState } from 'react';
import useCustomerSearch from '@/hooks/use-customer-search';
import { User } from './models/user';

type CustomerSearchAutocompleteProps = {
  label?: string;
  placeholder?: string;
  name?: string;
  value: string | number;
  onChange: (customerId: string) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  slotProps?: TextFieldProps['slotProps'];
  error?: boolean;
  helperText?: React.ReactNode;
} & Omit<
  AutocompleteProps<Pick<User, 'id' | 'name'>, false, false, false>,
  'options' | 'renderInput' | 'value' | 'onChange'
>;

export default function CustomerSearchAutocomplete({
  label = 'Customer',
  placeholder = 'Select Customer',
  name = 'customer_id',
  value,
  onChange,
  onBlur,
  slotProps,
  error,
  helperText,
  ...rest
}: CustomerSearchAutocompleteProps) {
  const { userValues, searchUsers } = useCustomerSearch();
  const inputId = `${name.replace(/\./g, '-')}-autocomplete`;

  const initialUsers = useMemo<Pick<User, 'id' | 'name'>[]>(
    () => userValues.map((user) => ({ id: user.id, name: user.name })),
    [userValues],
  );

  const [options, setOptions] = useState<Pick<User, 'id' | 'name'>[]>(
    initialUsers,
  );
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    setOptions(initialUsers);
  }, [initialUsers]);

  const debouncedSearch = useMemo(
    () =>
      debounce(async (input: string) => {
        const results = await searchUsers(input);

        setOptions(
          results.map((user: User) => ({
            id: user.id,
            name: user.name,
          })),
        );
      }, 300),
    [searchUsers],
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const selectedCustomer =
    options.find((c) => String(c.id) === String(value)) ?? null;

  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) => option.name || ''}
      inputValue={inputValue}
      value={selectedCustomer}
      isOptionEqualToValue={(option, selected) => option.id === selected.id}
      filterOptions={(x) => x}
      onInputChange={(_, newInputValue, reason) => {
        setInputValue(newInputValue);
        if (reason === 'input') {
          debouncedSearch(newInputValue);
        }
      }}
      onChange={(_, newValue) => {
        onChange(newValue ? String(newValue.id) : '');
      }}
      onBlur={(e) =>
        onBlur?.(e as FocusEvent<HTMLInputElement | HTMLTextAreaElement>)
      }
      renderOption={(props, option) => (
        <Box component="li" {...props} key={String(option.id)}>
          {option.name}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          id={inputId}
          name={name}
          label={label}
          placeholder={placeholder}
          inputProps={{
            ...params.inputProps,
            id: inputId,
            name,
          }}
          InputLabelProps={{
            ...params.InputLabelProps,
            htmlFor: inputId,
          }}
          slotProps={{ ...slotProps }}
          error={error}
          helperText={helperText}
        />
      )}
      {...rest}
    />
  );
}
