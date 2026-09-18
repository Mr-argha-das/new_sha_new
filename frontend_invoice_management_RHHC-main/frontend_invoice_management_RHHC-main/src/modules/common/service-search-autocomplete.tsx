import { Autocomplete } from '@mui/material';
import {
  FocusEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import TextField from './text-field';
import { Service } from './models/service';
import { useAuth } from '@/context/AuthContext';
import { getService } from '@/app/(admin)/(others-pages)/service/api';

type ServiceSearchAutocompleteProps = {
  label?: string;
  placeholder?: string;
  name?: string;
  value: string | number;
  onChange: (serviceId: string) => void;
  onBlur?: (e: FocusEvent<any>) => void;
};

export default function ServiceSearchAutocomplete({
  label = 'Service',
  placeholder = 'Select Service',
  name = 'service_id',
  value,
  onChange,
  onBlur,
}: ServiceSearchAutocompleteProps) {
  const { user } = useAuth();

  const [options, setOptions] = useState<Pick<Service, 'id' | 'name'>[]>([]);
  const [inputValue, setInputValue] = useState('');

  const selectedService =
    options.find((s) => String(s.id) === String(value)) ?? null;

  const fetchServices = useCallback(
    async (search: string) => {
      if (!user) return;
      const res = await getService({
        page: 1,
        limit: 20,
        q: search,
        account_id: user.account_id,
        branch_id: user.branch_id,
      } as Record<string, unknown>);

      const data: Service[] = (res.data?.data as unknown as Service[]) ?? [];
      setOptions(data.map((s) => ({ id: s.id as string, name: s.name })));
    },
    [user],
  );

  useEffect(() => {
    void fetchServices('');
  }, [fetchServices]);

  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) => option.name || ''}
      inputValue={inputValue}
      value={selectedService}
      isOptionEqualToValue={(option, selected) => option.id === selected.id}
      onInputChange={(_, newInputValue, reason) => {
        setInputValue(newInputValue);
        if (reason === 'input') {
          void fetchServices(newInputValue);
        }
      }}
      onChange={(_, newValue) => {
        onChange(newValue ? String(newValue.id) : '');
      }}
      onBlur={onBlur}
      renderInput={(params) => (
        <TextField
          {...params}
          name={name}
          label={label}
          placeholder={placeholder}
        />
      )}
    />
  );
}
