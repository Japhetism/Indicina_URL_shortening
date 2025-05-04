import request from "supertest";
import express, { Express } from "express";
import { encodeUrl } from "../controllers/urlController";
import {
  BAD_REQUEST_HTTP_STATUS_CODE,
  encodeBaseUrl,
  errorResponseMessage,
  longUrlForEdgeCase,
  longUrlInvalidErrorMessage,
  longUrlRequiredErrorMessage,
  OK_HTTP_STATUS_CODE,
  shortUrlRegex,
  successResponseMessage,
  validHttpUrl,
  validLongUrl,
  validUrlWithQuery
} from "../constants";

const app: Express = express();

app.use(express.json());

app.post(encodeBaseUrl, encodeUrl);

const sendEncodeRequest = (longUrl: string) => {
  return request(app)
    .post(encodeBaseUrl)
    .send({ longUrl });
};

const assertShortUrlFormat = (response: any) => {
  expect(response.body.data.shortUrl).toMatch(shortUrlRegex);
};

describe(`POST ${encodeBaseUrl}`, () => {
  it("should encode a valid URL into a shortened URL", async () => {
    const response = await sendEncodeRequest(validLongUrl)
    
    expect(response.status).toBe(OK_HTTP_STATUS_CODE);
    expect(response.body.message).toBe(successResponseMessage);
    assertShortUrlFormat(response);
  });

  it("should return an error for an invalid URL", async () => {
    const longUrl = "s https://www.indicina.com";

    const response = await sendEncodeRequest(longUrl);

    expect(response.status).toBe(BAD_REQUEST_HTTP_STATUS_CODE);
    expect(response.body.message).toBe(errorResponseMessage);
    expect(response.body.error).toBe(longUrlInvalidErrorMessage)
  });

  it("should return the existing short URL if URL already encoded", async () => {
    const initialResponse = await sendEncodeRequest(validLongUrl)
    const initialShortUrl = initialResponse.body.data.shortUrl;

    const finalResponse = await sendEncodeRequest(validLongUrl);

    expect(finalResponse.body.data.shortUrl).toBe(initialShortUrl);
  });

  it("should return 400 if long URL is missing", async () => {
    const response = await request(app)
      .post("/api/v1/encode")
      .send({});

    expect(response.status).toBe(BAD_REQUEST_HTTP_STATUS_CODE);
    expect(response.body.message).toBe(errorResponseMessage);
    expect(response.body.error).toBe(longUrlRequiredErrorMessage);
  });

  it("should encode an HTTP URL (not just HTTPS)", async () => {
    const response = await sendEncodeRequest(validHttpUrl);

    expect(response.status).toBe(OK_HTTP_STATUS_CODE);
    expect(response.body.message).toBe(successResponseMessage);
    assertShortUrlFormat(response);
  });

  it("should encode a valid URL with query parameters", async () => {
    const response = await sendEncodeRequest(validUrlWithQuery);

    expect(response.status).toBe(OK_HTTP_STATUS_CODE);
    expect(response.body.message).toBe(successResponseMessage);
    assertShortUrlFormat(response);
  });

  it("should generate different short URLs for different long URLs", async () => {
    const response1 = await sendEncodeRequest(longUrlForEdgeCase);

    const response2 = await sendEncodeRequest("https://www.indicina.co/contact");

    expect(response1.body.data.shortUrl).not.toBe(response2.body.data.shortUrl);
  });

  it("should encode a very long URL (2048+ chars)", async () => {
    const baseUrl = "https://www.indicina.co/";
    const longUrl = `${baseUrl}${'a'.repeat(2050 - baseUrl.length)}`;

    const response = await sendEncodeRequest(longUrl);

    expect(response.status).toBe(OK_HTTP_STATUS_CODE);
    expect(response.body.message).toBe(successResponseMessage);
    assertShortUrlFormat(response);
  });

  it("shoul reject malformed URL with missing slashes", async () => {
    const longUrl = "http:/wwww.indicina.co";

    const response = await sendEncodeRequest(longUrl);

    expect(response.status).toBe(BAD_REQUEST_HTTP_STATUS_CODE);
    expect(response.body.message).toBe(errorResponseMessage)
    expect(response.body.error).toBe(longUrlInvalidErrorMessage);
  });

  it("should return 400 if the long URL is an empty string", async () => {
    const response = await sendEncodeRequest("")

    expect(response.status).toBe(BAD_REQUEST_HTTP_STATUS_CODE);
    expect(response.body.message).toBe(errorResponseMessage)
    expect(response.body.error).toBe(longUrlRequiredErrorMessage);
  });
})