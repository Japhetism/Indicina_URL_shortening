import request from "supertest";
import express, { Express } from "express";
import { encodeUrl, decodeUrl } from "../controllers/urlController";
import {
  decodeBaseUrl,
  encodeBaseUrl,
  errorResponseMessage,
  shortBaseUrl,
  shortUrlNotFoundErrorMessage,
  shortUrlRequiredErrorMessage,
  successResponseMessage,
  validLongUrl
} from "../constants";

const app: Express = express();

app.use(express.json());
app.post(encodeBaseUrl, encodeUrl);
app.post(decodeBaseUrl, decodeUrl);

const sendEncodeRequest = (longUrl: string) =>
  request(app).post(encodeBaseUrl).send({ longUrl });

const sendDecodeRequest = (shortUrl: string) =>
  request(app).post(decodeBaseUrl).send({ shortUrl });

describe(`POST ${decodeBaseUrl}`, () => {
  let shortUrl: string;

  beforeAll(async () => {
    const res = await sendEncodeRequest(validLongUrl);
    shortUrl = res.body.data.shortUrl;
  });

  it("should decode a valid short URL", async () => {
    const response = await sendDecodeRequest(shortUrl);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe(successResponseMessage);
    expect(response.body.data.longUrl).toBe(validLongUrl);
  });

  it("should return 400 if shortUrl is missing", async () => {
    const response = await request(app).post(decodeBaseUrl).send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(errorResponseMessage);
    expect(response.body.error).toBe(shortUrlRequiredErrorMessage);
  });

  it("should return 400 if shortUrl is empty", async () => {
    const response = await sendDecodeRequest("");

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(errorResponseMessage);
    expect(response.body.error).toBe(shortUrlRequiredErrorMessage);
  });

  it("should return 400 for a completely invalid short URL", async () => {
    const response = await sendDecodeRequest("invalid");

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(errorResponseMessage);
    expect(response.body.error).toBe(shortUrlNotFoundErrorMessage);
  });

  it("should return 400 if short URL is a random valid-looking URL not in system", async () => {
    const fakeUrl = `${shortBaseUrl}/abcdef`;
    const response = await sendDecodeRequest(fakeUrl);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(errorResponseMessage);
    expect(response.body.error).toBe(shortUrlNotFoundErrorMessage);
  });

  it("should decode another valid URL (encoded in same session)", async () => {
    const newUrl = "https://www.indicina.co/about";
    const encodeResponse = await sendEncodeRequest(newUrl);
    const newShort = encodeResponse.body.data.shortUrl;

    const decodeResponse = await sendDecodeRequest(newShort);

    expect(decodeResponse.status).toBe(200);
    expect(decodeResponse.body.message).toBe(successResponseMessage);
    expect(decodeResponse.body.data.longUrl).toBe(newUrl);
  });

  it("should decode a short URL containing query parameters in the original", async () => {
    const urlWithQuery = "https://indicina.co/page?utm_source=test&utm_medium=email";
    const encodeRes = await sendEncodeRequest(urlWithQuery);
    const short = encodeRes.body.data.shortUrl;

    const decodeRes = await sendDecodeRequest(short);

    expect(decodeRes.status).toBe(200);
    expect(decodeRes.body.data.longUrl).toBe(urlWithQuery);
  });

  it("should not fail if the short URL contains trailing slash", async () => {
    const url = "https://www.indicina.com/slash-test";
    const encodeRes = await sendEncodeRequest(url);
    const short = encodeRes.body.data.shortUrl + "/";

    const decodeRes = await sendDecodeRequest(short);

    expect(decodeRes.status).toBe(200);
    expect(decodeRes.body.data.longUrl).toBe(url);
  });

  it("should decode long URL with subdomain", async () => {
    const url = "https://blog.indicina.com/article/ai-in-finance";
    const encodeRes = await sendEncodeRequest(url);
    const short = encodeRes.body.data.shortUrl;

    const decodeRes = await sendDecodeRequest(short);

    expect(decodeRes.status).toBe(200);
    expect(decodeRes.body.data.longUrl).toBe(url);
  });

  it("should decode very long URLs (edge case)", async () => {
    const base = "https://indicina.co/";
    const veryLongUrl = `${base}${"x".repeat(2048 - base.length)}`;

    const encodeRes = await sendEncodeRequest(veryLongUrl);
    const short = encodeRes.body.data.shortUrl;

    const decodeRes = await sendDecodeRequest(short);

    expect(decodeRes.status).toBe(200);
    expect(decodeRes.body.data.longUrl).toBe(veryLongUrl);
  });
});
