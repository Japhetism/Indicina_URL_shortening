import { Request, Response } from "express";
import {
  getByLongUrl,
  getByShortUrlCode,
  saveUrl,
} from "../repositories/urlRepository";
import { shortBaseUrl } from "../constants";
import { ResponseHelper } from "../utils/responseHelper";
import { generateShortUrlCode, isValidHttpUrl } from "../utils/helper";

export const encodeUrl = (req: Request, res: Response): void => {
  const { longUrl } = req.body;
  
  if (!longUrl) {
    res.status(400).json(ResponseHelper.error("Long URL is required"));
    return;
  }

  if (!isValidHttpUrl(longUrl)) {
    res.status(400).json(ResponseHelper.error("Invalid URL. must be a valid HTTP/HTTPS URL."));
    return;
  }
  
  const existing = getByLongUrl(longUrl);
  
  if (existing) {
    res.json(ResponseHelper.success({ shortUrl: `${shortBaseUrl}/${existing.shortUrl}` }));
    return;
  }
  
  const shortUrl = generateShortUrlCode();
  const record = saveUrl(shortUrl, longUrl);
  res.json(ResponseHelper.success({ shortUrl: `${shortBaseUrl}/${record.shortUrl}` }))
}

export const decodeUrl = (req: Request, res: Response): void => {
  const { shortUrl } = req.body;
  
  if (!shortUrl) {
    res.status(400).json(ResponseHelper.error("Short URL is required"));
    return;
  }
  
  const shortUrlCode = shortUrl.split("/").pop() || "";
  
  const record = getByShortUrlCode(shortUrlCode);
  
  if (!record) {
    res.status(400).json(ResponseHelper.error("Short URL not found"));
    return;
  }
  
  res.status(200).json(ResponseHelper.success({ longUrl: record.longUrl }));
}