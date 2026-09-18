import { AddressInputValues } from '../address-input';
import { config } from '../config';

export const addrToString = (addr?: AddressInputValues) => {
  if (!addr) return '—';
  const city = addr.city?.label || addr.city;
  const state = addr.state?.label || addr.state;
  const country = addr.country?.label || addr.country;
  const parts = [
    addr.title,
    addr.line1,
    addr.line2,
    city,
    state,
    country,
    addr.pinCode,
  ].filter(Boolean);
  return parts.join(', ');
};

export const toNumber = (v: unknown): number => {
  if (v === null || v === undefined || v === '') return 0;
  const n = typeof v === 'string' ? parseFloat(v) : Number(v);
  return Number.isFinite(n) ? n : 0;
};

export const formatINR = (v?: string | number, showSymbol: boolean = false) =>
  v !== undefined && v !== null && v !== ''
    ? `${showSymbol ? '₹' : ''}${Number(v).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    })}`
    : '-';

export const getFullFileUrl = (str: string) => {
  if (!str) return str;
  return `${config.api.baseUrl}${str}`;
};

export const formatHoursToHrMin = (hours: number): string => {
  if (isNaN(hours) || hours < 0) return '-';

  const h = Math.floor(hours); // whole hours
  const m = Math.round((hours - h) * 60); // remaining minutes

  const hourLabel = h > 0 ? `${h} hr${h > 1 ? 's' : ''}` : '';
  const minuteLabel = m > 0 ? `${m} min` : '';

  if (!hourLabel && !minuteLabel) return '0 min';
  return `${hourLabel} ${minuteLabel}`.trim();
};