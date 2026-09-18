import { City, Country, State } from 'country-state-city';
import { useMemo } from 'react';

const formatedCountries = () => {
  const countries = Country.getAllCountries();
  return countries
    .map((country) => ({
      label: country.name,
      value: country.isoCode,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
};

const getAllCountries = () => {
  const formattedCountries = formatedCountries();
  return formattedCountries;
};

const getStateByCountry = (country: string) => {
  return State.getStatesOfCountry(country).map((state) => ({
    label: state.name,
    value: state.isoCode,
  }));
};

const getCityByState = (country: string, state: string) => {
  return City.getCitiesOfState(country, state).map((city) => ({
    label: city.name,
    value: city.name,
  }));
};

const getCountryByValue = (value: string) => {
  const formattedCountries = formatedCountries();
  return formattedCountries.find((item) => item.value === value);
};

export default function useCountries() {
  const formattedCountries = useMemo(() => formatedCountries(), []);

  return {
    getAll: () => formattedCountries,
    getByValue: (value: string) => getCountryByValue(value),
  };
}

export {
  getAllCountries,
  getCityByState,
  getCountryByValue,
  getStateByCountry,
};
