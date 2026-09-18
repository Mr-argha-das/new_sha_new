import useStaffSearch from '@/hooks/use-staff-search';
import {
  Autocomplete,
  AutocompleteProps,
  TextField,
  TextFieldProps,
} from '@mui/material';
import debounce from 'lodash-es/debounce';
import { FocusEvent, useEffect, useMemo, useState } from 'react';
import { User } from './models/user';

type StaffSearchAutocompleteProps = {
  label?: string;
  placeholder?: string;
  name?: string;
  value: string;
  onChange: (userId: string) => void;
  onUserChange?: (user: Partial<User> | null) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: boolean;
  helperText?: React.ReactNode;
  slotProps?: TextFieldProps['slotProps'];
} & Omit<
  AutocompleteProps<Pick<User, 'id' | 'name'>, false, false, false>,
  'options' | 'renderInput' | 'value' | 'onChange'
>;

export default function StaffSearchAutocomplete({
  label = 'Staff',
  placeholder = 'Select Staff',
  name = 'user_id',
  value,
  onChange,
  onUserChange,
  onBlur,
  error,
  helperText,
  slotProps,
  ...rest
}: StaffSearchAutocompleteProps) {
  const { userValues, searchUsers } = useStaffSearch();

  const initialUsers = useMemo<Partial<User>[]>(
    () =>
      userValues.map((user) => ({
        id: user.id,
        name: `${user.name} (${user.designation || ''})`,
        designation: user.designation,
        working_hours: user.working_hours,
      })),
    [userValues],
  );

  const [userOptions, setUserOptions] = useState<Partial<User>[]>(initialUsers);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    setUserOptions(initialUsers);
  }, [initialUsers]);

  const debouncedSearch = useMemo(
    () =>
      debounce(async (input: string) => {
        const results = await searchUsers(input);

        setUserOptions(
          results.map((user) => ({
            id: user.id,
            name: `${user.name} (${user.designation || ''})`,
            designation: user.designation,
            working_hours: user.working_hours,
          })),
        );
      }, 300),
    [searchUsers],
  );

  // cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const selectedUser =
    userOptions.find((u) => String(u.id) === String(value)) ?? null;

  return (
    <Autocomplete
      options={userOptions as unknown as Pick<User, 'id' | 'name'>[]}
      getOptionLabel={(option) => option?.name || ''}
      inputValue={inputValue}
      value={selectedUser as unknown as Pick<User, 'id' | 'name'> | null}
      isOptionEqualToValue={(option, selected) => option.id === selected.id}
      filterOptions={(x) => x} // disable local filtering (since API handles it)
      onInputChange={(_, newInputValue, reason) => {
        setInputValue(newInputValue);

        if (reason === 'input') {
          debouncedSearch(newInputValue);
        }
      }}
      onChange={(_, newValue) => {
        onChange(newValue ? String(newValue.id) : '');
        onUserChange?.(newValue as unknown as User | null);
      }}
      onBlur={(e) =>
        onBlur?.(e as FocusEvent<HTMLInputElement | HTMLTextAreaElement>)
      }
      renderInput={(params) => (
        <TextField
          {...params}
          name={name}
          label={label}
          placeholder={placeholder}
          error={error}
          helperText={helperText}
          slotProps={slotProps}
        />
      )}
      {...rest}
    />
  );
}
