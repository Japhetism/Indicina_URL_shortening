import { Request, Response } from "express";
import {
  getByLongUrl,
  getByShortUrlCode,
  getUrls,
  getUrlStatistics,
  incrementUrlVisit,
  saveUrl,
} from "../repositories/urlRepository";
import { longUrlInvalidErrorMessage, longUrlRequiredErrorMessage, shortBaseUrl, shortUrlNotFoundErrorMessage, shortUrlRequiredErrorMessage } from "../constants";
import { ResponseHelper } from "../utils/responseHelper";
import { generateShortUrlCode, isValidHttpUrl } from "../utils/helper";

export const encodeUrl = (req: Request, res: Response): void => {
  const { longUrl } = req.body;
  
  if (!longUrl) {
    res.status(400).json(ResponseHelper.error(longUrlRequiredErrorMessage));
    return;
  }

  if (!isValidHttpUrl(longUrl)) {
    res.status(400).json(ResponseHelper.error(longUrlInvalidErrorMessage));
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
    res.status(400).json(ResponseHelper.error(shortUrlRequiredErrorMessage));
    return;
  }
  
  const shortUrlCode = shortUrl.split("/").pop() || "";
  
  const record = getByShortUrlCode(shortUrlCode);
  
  if (!record) {
    res.status(400).json(ResponseHelper.error(shortUrlNotFoundErrorMessage));
    return;
  }
  
  res.status(200).json(ResponseHelper.success({ longUrl: record.longUrl }));
}

export const getUrlStats = (req: Request, res: Response): void => {
  const stat= getUrlStatistics(req.params.url_path);
  
  if (!stat) {
    res.status(400).json(ResponseHelper.error("URL not found"));
    return;
  }
    
  res.status(200).json(ResponseHelper.success(stat));
}

export const listUrls = (_req: Request, res: Response): void => {
  res.status(200).json(ResponseHelper.success(getUrls()))
}

export const redirectToLongUrl = (req: Request, res: Response): void => {
  const code = req.params.url_path;
    
  const record = getByShortUrlCode(code);
  
  if (!record) {
    res.status(400).send("Not found");
    return;
  }
    
  incrementUrlVisit(code, req);
  res.redirect(record.longUrl);
}