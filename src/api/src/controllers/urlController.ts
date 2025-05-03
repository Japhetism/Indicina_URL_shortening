import { Request, Response } from "express";
import {
  getByLongUrl,
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