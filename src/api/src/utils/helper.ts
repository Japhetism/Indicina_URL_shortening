export const generateShortUrlCode = (length = 6): string => {
  return [...Array(length)].map(() => Math.random().toString(36)[2]).join('');
}

export const isValidHttpUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch (_) {
    return false;
  }
}