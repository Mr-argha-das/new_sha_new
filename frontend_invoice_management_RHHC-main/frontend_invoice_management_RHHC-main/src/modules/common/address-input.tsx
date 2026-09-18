import {
  getAllCountries,
  getCityByState,
  getStateByCountry,
} from '@/hooks/useCountries';
import {
  Autocomplete,
  FormGroup,
  Grid,
  TextField as MuiTextField,
} from '@mui/material';
import { useFormikContext } from 'formik';
import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import TextField from './text-field';

interface Option {
  value: string;
  label: string;
}

export interface AddressInputValues {
  country: Nullable<Option>;
  state: Nullable<Option>;
  city: Nullable<Option>;
  title?: Nullable<string>;
  line1?: Nullable<string>;
  line2?: Nullable<string>;
  pinCode?: Nullable<string>;
  default_shipping?: boolean;
  default_billing?: boolean;
}

interface AddressInputProps {
  values: AddressInputValues;
  namePrefix?: string;
  /** Any extra input field which needs to be added */
  children?: ReactNode;
}

const getOptionLabel = (option: Option) => option?.label ?? '';
const isOptionEqualToValue = (option: Option, value: Option) =>
  option.value === value.value;

const AddressInput = ({
  values,
  namePrefix = '',
  children,
}: AddressInputProps) => {
  const { setFieldValue } = useFormikContext();

  const countries = useMemo(() => getAllCountries(), []);

  const [states, setStates] = useState<Option[]>([]);
  const [cities, setCities] = useState<Option[]>([]);

  const handleCountryChange = async (
    _: React.SyntheticEvent,
    selected: Option | null,
  ) => {
    await setFieldValue(`${namePrefix}country`, selected ?? null);
    await setFieldValue(`${namePrefix}state`, null);
    await setFieldValue(`${namePrefix}city`, null);

    if (selected) {
      setStates(getStateByCountry(selected.value));
      setCities([]);
    } else {
      setStates([]);
      setCities([]);
    }
  };

  const handleStateChange = async (
    _: React.SyntheticEvent,
    selected: Option | null,
  ) => {
    await setFieldValue(`${namePrefix}state`, selected ?? null);
    await setFieldValue(`${namePrefix}city`, null);

    if (selected && values.country?.value) {
      setCities(getCityByState(values.country.value, selected.value));
    } else {
      setCities([]);
    }
  };

  const handleCityChange = async (
    _: React.SyntheticEvent,
    selected: Option | null,
  ) => {
    await setFieldValue(`${namePrefix}city`, selected ?? null);
  };

  useEffect(() => {
    if (values.country?.value) {
      setStates(getStateByCountry(values.country.value));

      if (values.state?.value) {
        setCities(getCityByState(values.country.value, values.state.value));
      } else {
        setCities([]);
      }
    } else {
      setStates([]);
      setCities([]);
    }
  }, [values.country?.value, values.state?.value]);

  return (
    <Grid container spacing={4}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          label="Address Line 1"
          name={`${namePrefix}line1`}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          label="Address Line 2"
          name={`${namePrefix}line2`}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField fullWidth label="Postcode" name={`${namePrefix}pinCode`} />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <FormGroup>
          <Autocomplete
            disablePortal
            getOptionLabel={getOptionLabel}
            isOptionEqualToValue={isOptionEqualToValue}
            onChange={handleCountryChange}
            options={countries}
            renderInput={(params) => (
              <MuiTextField {...params} label="Country" />
            )}
            value={values.country}
          />
        </FormGroup>
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <FormGroup>
          <Autocomplete
            disablePortal
            disabled={!values.country}
            getOptionLabel={getOptionLabel}
            isOptionEqualToValue={isOptionEqualToValue}
            onChange={handleStateChange}
            options={states}
            renderInput={(params) => <MuiTextField {...params} label="State" />}
            value={values.state}
          />
        </FormGroup>
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <FormGroup>
          <Autocomplete
            disablePortal
            disabled={!values.state}
            getOptionLabel={getOptionLabel}
            isOptionEqualToValue={isOptionEqualToValue}
            onChange={handleCityChange}
            options={cities}
            renderInput={(params) => <MuiTextField {...params} label="City" />}
            value={values.city}
          />
        </FormGroup>
      </Grid>

      {children && <Grid size={{ xs: 12, sm: 6 }}>{children}</Grid>}
    </Grid>
  );
};

export default AddressInput;
