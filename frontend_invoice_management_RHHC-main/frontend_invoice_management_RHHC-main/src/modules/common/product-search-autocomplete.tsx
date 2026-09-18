import { Autocomplete } from '@mui/material';
import {
  FocusEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import TextField from './text-field';
import { Product } from './models/product';
import { useAuth } from '@/context/AuthContext';
import { getProduct } from '@/app/(admin)/(others-pages)/product/api';

type ProductSearchAutocompleteProps = {
  label?: string;
  placeholder?: string;
  name?: string;
  value: string | number;
  onChange: (productId: string) => void;
  onBlur?: (e: FocusEvent<any>) => void;
};

export default function ProductSearchAutocomplete({
  label = 'Product',
  placeholder = 'Select Product',
  name = 'product_id',
  value,
  onChange,
  onBlur,
}: ProductSearchAutocompleteProps) {
  const { user } = useAuth();

  const [options, setOptions] = useState<Pick<Product, 'id' | 'name'>[]>([]);
  const [inputValue, setInputValue] = useState('');

  const selectedProduct =
    options.find((p) => String(p.id) === String(value)) ?? null;

  const fetchProducts = useCallback(
    async (search: string) => {
      if (!user) return;
      const res = await getProduct({
        page: 1,
        limit: 20,
        q: search,
        account_id: user.account_id,
        branch_id: user.branch_id,
      } as Record<string, unknown>);

      const data: Product[] = (res.data?.data as unknown as Product[]) ?? [];
      setOptions(data.map((p) => ({ id: p.id, name: p.name })));
    },
    [user],
  );

  useEffect(() => {
    void fetchProducts('');
  }, [fetchProducts]);

  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) => option.name || ''}
      inputValue={inputValue}
      value={selectedProduct}
      isOptionEqualToValue={(option, selected) => option.id === selected.id}
      onInputChange={(_, newInputValue, reason) => {
        setInputValue(newInputValue);
        if (reason === 'input') {
          void fetchProducts(newInputValue);
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
