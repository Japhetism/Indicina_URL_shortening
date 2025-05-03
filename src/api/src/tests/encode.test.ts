import request from "supertest";
import express, { Express } from "express";
import { encodeUrl } from "../controllers/urlController";
import { shortBaseUrl } from "../constants";

const app: Express = express();

app.use(express.json());

app.post("/api/v1/encode", encodeUrl);

describe("POST /api/v1/encode", () => {
  it("should encode a valid URL into a shortened URL", async () => {
    const longUrl = "https://www.indicina.com";

    const response = await request(app)
      .post("/api/v1/encode")
      .send({ longUrl });
    
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("successful");
    expect(response.body.data.shortUrl).toMatch(new RegExp(`^${shortBaseUrl.replace('.', '\\.')}/[A-Za-z0-9]+$`));

  });

  it("should return an error for an invalid URL", async () => {
    const longUrl = "s https://www.indicina.com";

    const response = await request(app)
      .post("/api/v1/encode")
      .send({ longUrl });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("failure");
    expect(response.body.error).toBe("Invalid URL. must be a valid HTTP/HTTPS URL.")
  });

  it("should return the existing short URL if URL already encoded", async () => {
    const longUrl = "https://www.indicina.com";

    const initialResponse = await request(app)
      .post("/api/v1/encode")
      .send({ longUrl });
    
    const initialShortUrl = initialResponse.body.data.shortUrl;

    const finalResponse = await request(app)
      .post("/api/v1/encode")
      .send({ longUrl });

    expect(finalResponse.body.data.shortUrl).toBe(initialShortUrl);
  });

  it("should return 400 if long URL is missing", async () => {
    const response = await request(app)
      .post("/api/v1/encode")
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("failure");
    expect(response.body.error).toBe("Long URL is required");
  });

  it("should encode an HTTP URL (not just HTTPS)", async () => {
    const longUrl = "http://wwww.indicina.co";

    const response = await request(app)
      .post("/api/v1/encode")
      .send({ longUrl });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("successful");
    expect(response.body.data.shortUrl).toMatch(new RegExp(`^${shortBaseUrl.replace('.', '\\.')}/[A-Za-z0-9]+$`));
  });

  it("should encode a valid URL with query parameters", async () => {
    const longUrl = "https://wwww.indicina.co/search?q=dev";

    const response = await request(app)
      .post("/api/v1/encode")
      .send({ longUrl });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("successful");
    expect(response.body.data.shortUrl).toMatch(new RegExp(`^${shortBaseUrl.replace('.', '\\.')}/[A-Za-z0-9]+$`));
  });

  it("should generate different short URLs for different long URLs", async () => {
    const longUrl1 = "https://www.indicina.co/about";
    const longUrl2 = "https://www.indicina.co/contact";

    const response1 = await request(app)
      .post("/api/v1/encode")
      .send({ longUrl: longUrl1 });
    
    const response2 = await request(app)
      .post("/api/v1/encode")
      .send({ longUrl: longUrl2 });

    expect(response1.body.data.shortUrl).not.toBe(response2.body.data.shortUrl);
  });

  it("should encode a very long URL (2048+ chars)", async () => {
    const baseUrl = "https://www.indicina.co/";
    const longUrl = `${baseUrl}${'a'.repeat(2050 - baseUrl.length)}`;

    const response = await request(app)
      .post("/api/v1/encode")
      .send({ longUrl });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("successful");
    expect(response.body.data.shortUrl).toMatch(new RegExp(`^${shortBaseUrl.replace('.', '\\.')}/[A-Za-z0-9]+$`));
  });

  it("shoul reject malformed URL with missing slashes", async () => {
    const longUrl = "http:/wwww.indicina.co";

    const response = await request(app)
      .post("/api/v1/encode")
      .send({ longUrl });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("failure")
    expect(response.body.error).toBe("Invalid URL. must be a valid HTTP/HTTPS URL.");
  });

  it("should return 400 if the long URL is an empty string", async () => {
    const longUrl = "";

    const response = await request(app)
      .post("/api/v1/encode")
      .send({ longUrl });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("failure")
    expect(response.body.error).toBe("Long URL is required");
  });
})