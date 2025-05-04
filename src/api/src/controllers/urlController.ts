import { Request, Response } from "express";
import {
  getByLongUrl,
  getByShortUrlCode,
  getUrls,
  getUrlStatistics,
  incrementUrlVisit,
  saveUrl,
} from "../repositories/urlRepository";
import {
  BAD_REQUEST_HTTP_STATUS_CODE,
  longUrlInvalidErrorMessage,
  longUrlRequiredErrorMessage,
  NOT_FOUND_HTTP_STATUS_CODE,
  OK_HTTP_STATUS_CODE,
  shortBaseUrl,
  shortUrlNotFoundErrorMessage,
  shortUrlRequiredErrorMessage
} from "../constants";
import { ResponseHelper } from "../utils/responseHelper";
import { generateShortUrlCode, isValidHttpUrl } from "../utils/helper";

export const encodeUrl = (req: Request, res: Response): void => {
  const { longUrl } = req.body;
  
  if (!longUrl) {
    res.status(BAD_REQUEST_HTTP_STATUS_CODE).json(ResponseHelper.error(longUrlRequiredErrorMessage));
    return;
  }

  if (!isValidHttpUrl(longUrl)) {
    res.status(BAD_REQUEST_HTTP_STATUS_CODE).json(ResponseHelper.error(longUrlInvalidErrorMessage));
    return;
  }
  
  const existing = getByLongUrl(longUrl);
  
  if (existing) {
    res.status(OK_HTTP_STATUS_CODE).json(ResponseHelper.success({ shortUrl: `${shortBaseUrl}/${existing.shortUrl}` }));
    return;
  }
  
  const shortUrl = generateShortUrlCode();
  const record = saveUrl(shortUrl, longUrl);
  res.status(OK_HTTP_STATUS_CODE).json(ResponseHelper.success({ shortUrl: `${shortBaseUrl}/${record.shortUrl}` }))
}

export const decodeUrl = (req: Request, res: Response): void => {
  const { shortUrl } = req.body;
  
  if (!shortUrl) {
    res.status(BAD_REQUEST_HTTP_STATUS_CODE).json(ResponseHelper.error(shortUrlRequiredErrorMessage));
    return;
  }
  
  const shortUrlCode = shortUrl.split("/").filter(Boolean).pop() || "";

  const record = getByShortUrlCode(shortUrlCode);
  
  if (!record) {
    res.status(NOT_FOUND_HTTP_STATUS_CODE).json(ResponseHelper.error(shortUrlNotFoundErrorMessage));
    return;
  }
  
  res.status(OK_HTTP_STATUS_CODE).json(ResponseHelper.success({ longUrl: record.longUrl }));
}

export const getUrlStats = (req: Request, res: Response): void => {
  const stat= getUrlStatistics(req.params.url_path);
  
  if (!stat) {
    res.status(NOT_FOUND_HTTP_STATUS_CODE).json(ResponseHelper.error("URL not found"));
    return;
  }
    
  res.status(OK_HTTP_STATUS_CODE).json(ResponseHelper.success(stat));
}

export const listUrls = (_req: Request, res: Response): void => {
  res.status(OK_HTTP_STATUS_CODE).json(ResponseHelper.success(getUrls()))
}

export const redirectToLongUrl = (req: Request, res: Response): void => {
  const code = req.params.url_path;
    
  const record = getByShortUrlCode(code);
  
  if (!record) {
    res.status(NOT_FOUND_HTTP_STATUS_CODE).send("Not found");
    return;
  }
    
  incrementUrlVisit(code, req);
  res.status(OK_HTTP_STATUS_CODE).redirect(record.longUrl);
}