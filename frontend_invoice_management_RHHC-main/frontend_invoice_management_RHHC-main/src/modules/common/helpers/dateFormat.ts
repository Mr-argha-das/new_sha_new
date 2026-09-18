import dayjs from 'dayjs';

export function toYYYYMMDD(isoString: string): string {
  if (!isoString) return '';
  // Handle common "empty" / invalid DB dates that sometimes appear as 1899-11-30 in UI
  // (e.g., Excel-zero-date or zero-date conversions).
  if (isoString === '0000-00-00' || isoString === '0000-00-00 00:00:00') return '';
  const d = dayjs(isoString);
  if (!d.isValid()) return '';
  const formatted = d.format('YYYY-MM-DD');
  if (formatted === 'Invalid Date') return '';
  return formatted;
}

export function toDDMMYYYY(isoString: string): string {
  if (!isoString) return 'N/A';
  return dayjs(isoString).format('DD-MM-YYYY');
}

export function toDDMMYYYYhhmmss(isoString: string): string {
  return dayjs(isoString).format('DD-MM-YYYY hh:mm:ss');
}
