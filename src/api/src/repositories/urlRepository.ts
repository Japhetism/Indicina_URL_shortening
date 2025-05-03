import { shortBaseUrl } from "../constants";
import { IShortUrlRecord } from "../models/urlModel";

const urlMap: Map<string, IShortUrlRecord> = new Map();
const reverseMap: Map<string, string> = new Map();

export const saveUrl = (shortUrl: string, longUrl: string): IShortUrlRecord => {
  const record: IShortUrlRecord = {
    shortUrl: shortUrl,
    longUrl: longUrl,
    stats: {
      createdAt: new Date(),
      visits: 0,
    }
  }

  urlMap.set(shortUrl, record);
  reverseMap.set(longUrl, shortUrl);

  return record;
}

export const getByLongUrl = (longUrl: string): IShortUrlRecord | undefined => {
  const shortUrl = reverseMap.get(longUrl);
  return shortUrl ? urlMap.get(shortUrl) : undefined;
}

export const getByShortUrlCode = (shortUrlCode: string): IShortUrlRecord | undefined => urlMap.get(shortUrlCode);

export const getUrlStatistics = (shortUrl: string) => {
  const record = urlMap.get(shortUrl);
  
  if (!record) return null;
  
  return {
    longUrl: record.longUrl,
    shortUrl: `${shortBaseUrl}/${shortUrl}`,
    stats: record.stats
  }
}