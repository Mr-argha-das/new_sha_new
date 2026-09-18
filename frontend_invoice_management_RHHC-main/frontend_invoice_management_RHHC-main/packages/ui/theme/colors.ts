import type { ThemeOptions } from '@mui/material';

export const neutral = {
  0: '#FFFFFF',
  50: '#F1F0F3',
  100: '#E5E4E7',
  200: '#C7C6CF',
  300: '#938F9C',
  400: '#706A7B',
  500: '#5B5267',
  600: '#464152',
  700: '#322B3A',
  800: '#221F26',
  900: '#121115',
};

export const background = {
  default: '#F9FAFC',
  paper: '#FFFFFF',
  yellow: '#F8C368',
  lightYellow: '#FAD595',
  lightPurple: '#EFE6F8',
};

export const yellow = {
  main: '#F8C368',
};

export const divider = '#E7E6F0';

export const primary = {
  main: '#0F71FF',
  light: '#4394FA',
  dark: '#1E5AA5',
  input: '#5581F7',
  extraLight: '#63A6FA',
  border: '#A0C7FF',
  disabled: '#D7E3F8',
  contrastText: '#FFFFFF',
  blue: '#5581F7',
  lightMain: '#6020b625',
  shades: {
    background: {
      1: '#F5F6FA',
    },
  },
};

export const secondary = {
  main: '#1e21b6',
  light: '#4275ec',
  dark: '#0047ab',
  extraLight: '#A9C8FF',
  contrastText: '#FFFFFF',
  lightGreen: '#F4F9F4',
  green: '#E4F0E6',
  purple: '#CEB3EB',
  lightPurple: '#EFE6F8',
  lavenderPurple: '#8E4ED0',
  mintGreen: '#98E1A4',
  creamYellow: '#F8C368',
  punchPink: '#FF9F9F',
  balletPink: '#F3A3CC',
  shades: {
    light: {
      1: '#F7F7FF',
      2: '#F2F2FF',
    },
  },
};

export const dark = {
  main: '#1F1D21',
  light: '#2C2B30',
  dark: '#141314',
  contrastText: neutral[100],
};

export const white = {
  main: '#ffffff',
  light: '#ffffff',
  dark: '#F1F0F3',
  contrastText: neutral[700],
};

export const success = {
  main: '#49CD86',
  dark: '#35B16E',
  contrastText: '#FFFFFF',
};

export const info = {
  main: '#2196F3',
  dark: '#1F81CF',
  contrastText: '#FFFFFF',
};

export const warning = {
  main: '#FFC106',
  dark: '#F1B912',
  contrastText: '#000000',
};

export const error = {
  main: '#FD4D4D',
  dark: '#D44242',
  light: '#FF8381',
  outline: '#FFBEBE',
  contrastText: '#FFFFFF',
};

export const text = {
  dark: '#000000',
  primary: '#3F4051',
  secondary: '#988AAB',
  disabled: '#C4B9D1',
  deepGray: '#808080',
};

export const shadows: ThemeOptions['shadows'] = [
  'none',
  '0px 1px 1px rgba(100, 116, 139, 0.06), 0px 1px 2px rgba(100, 116, 139, 0.1)',
  '0px 1px 2px rgba(100, 116, 139, 0.12)',
  '0px 1px 4px rgba(100, 116, 139, 0.12)',
  '0px 1px 5px rgba(100, 116, 139, 0.12)',
  '0px 1px 6px rgba(100, 116, 139, 0.12)',
  '0px 2px 6px rgba(100, 116, 139, 0.12)',
  '0px 3px 6px #6D6D6D29',
  '0px 2px 4px rgba(31, 41, 55, 0.06), 0px 4px 6px rgba(100, 116, 139, 0.12)',
  '0px 5px 12px rgba(100, 116, 139, 0.12)',
  '0px 5px 14px rgba(100, 116, 139, 0.12)',
  '0px 5px 15px rgba(100, 116, 139, 0.12)',
  '0px 6px 15px rgba(100, 116, 139, 0.12)',
  '0px 7px 15px rgba(100, 116, 139, 0.12)',
  '0px 8px 15px rgba(100, 116, 139, 0.12)',
  '0px 9px 15px rgba(100, 116, 139, 0.12)',
  '0px 10px 15px rgba(100, 116, 139, 0.12)',
  '0px 12px 22px -8px rgba(100, 116, 139, 0.25)',
  '0px 13px 22px -8px rgba(100, 116, 139, 0.25)',
  '0px 14px 24px -8px rgba(100, 116, 139, 0.25)',
  '0px 10px 10px rgba(31, 41, 55, 0.04), 0px 20px 25px rgba(31, 41, 55, 0.1)',
  '0px 25px 50px rgba(100, 116, 139, 0.25)',
  '0px 25px 50px rgba(100, 116, 139, 0.25)',
  '0px 25px 50px rgba(100, 116, 139, 0.25)',
  '0px 25px 50px rgba(100, 116, 139, 0.25)',
];
