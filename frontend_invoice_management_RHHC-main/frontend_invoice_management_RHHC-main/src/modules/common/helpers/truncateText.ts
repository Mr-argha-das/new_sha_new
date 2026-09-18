import { capitalizeFirstLetter } from './capitalizeWords';

export function truncateText(
  description: string | null | undefined,
  maxLength: number = 100,
): string {
  if (!description) {
    return 'N/A';
  }

  const shortDescription =
    description.length > maxLength
      ? description.slice(0, maxLength) + '...'
      : description;

  return capitalizeFirstLetter(shortDescription);
}
