import { useMemo } from 'react';
import countries from 'world-countries';

const formatCountries = () => {
  return countries
    .map((country) => ({
      value: country.name.common,
      label: country.name.common,
      flag: country.flag,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
};

const getAllCountries = () => {
  const formattedCountries = formatCountries();
  return formattedCountries;
};

const getCountryByValue = (value: string) => {
  const formattedCountries = formatCountries();
  return formattedCountries.find((item) => item.value === value);
};

export default function useCountries() {
  const formattedCountries = useMemo(() => formatCountries(), []);

  return {
    getAll: () => formattedCountries,
    getByValue: (value: string) => getCountryByValue(value),
  };
}

export { getAllCountries, getCountryByValue };
