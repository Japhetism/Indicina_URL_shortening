export const generateShortUrlCode = (length = 6): string => {
  return [...Array(length)].map(() => Math.random().toString(36)[2]).join('');
}