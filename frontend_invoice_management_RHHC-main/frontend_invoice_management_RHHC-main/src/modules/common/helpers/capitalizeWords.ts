export const capitalizeWords = (text: string | null | undefined) => {
  if (!text) {
    return '';
  }
  if (typeof text !== 'string') {
    return text; // Return the value as-is if it's not a string
  }

  return text
    .split(/[_\s-]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const capitalizeFirstLetter = (paragraph: string) => {
  if (typeof paragraph !== 'string') return '';
  return paragraph && paragraph.charAt(0).toUpperCase() + paragraph.slice(1);
};
