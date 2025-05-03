import { Request } from "express";
import { UAParser } from 'ua-parser-js';
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

export const getUrls = () => {
  return Array.from(urlMap.values()).map((record) => ({
    longUrl: record.longUrl,
    shortUrl: `${shortBaseUrl}/${record.shortUrl}`,
    stats: record.stats
  }))
}

export const incrementUrlVisit = (shortUrl: string, req: Request): void => {
  const record = urlMap.get(shortUrl);
  
  if (!record) return;
  
  const ua = UAParser(req.headers["user-agent"]);
  const browser = ua.browser.name || "Unknown";
  const cpu = ua.cpu.architecture || "Unknown";
  const device = ua.device.model || "Unknown";
  const type = ua.device.type || "Unknown";
  
  record.stats.deviceStats = record.stats.deviceStats || {};
  record.stats.cpuStats = record.stats.cpuStats || {};
  record.stats.typeStats = record.stats.typeStats || {};
  record.stats.browserStats = record.stats.browserStats || {};
  
  record.stats.visits++;
  record.stats.lastAccessedAt = new Date();
  record.stats.deviceStats[device] = (record.stats.deviceStats[device] || 0) + 1;
  record.stats.cpuStats[cpu] = (record.stats.cpuStats[cpu] || 0) + 1;
  record.stats.typeStats[type] = (record.stats.typeStats[type] || 0) + 1;
  record.stats.browserStats[browser] = (record.stats.browserStats[browser] || 0) + 1;
}