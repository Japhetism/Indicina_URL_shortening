import { Router } from "express";
import {
  decodeUrl,
  encodeUrl,
  getUrlStats,
  listUrls,
} from "../controllers/urlController";

const router = Router();

/**
 * @swagger
 * /encode:
 *   post:
 *     summary: Encode a URL
 *     description: Takes a long URL and encodes it into a shortened URL.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               longUrl:
 *                 type: string
 *                 description: The long URL to encode.
 *     responses:
 *       200:
 *         description: The shortened URL
 *       400:
 *         description: Invalid URL format
 */
router.post("/encode", encodeUrl);

/**
 * @swagger
 * /decode:
 *   post:
 *     summary: Decode a short URL
 *     description: Takes a short URL and decodes it back to the original long URL.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shortUrl:
 *                 type: string
 *                 description: The short URL to decode.
 *     responses:
 *       200:
 *         description: The long URL
 *       404:
 *         description: Short URL not found
 */
router.post("/decode", decodeUrl);

/**
 * @swagger
 * /statistics/{url_path}:
 *   get:
 *     summary: Get URL statistics
 *     description: Fetches the statistics (e.g., click count) for the given URL path.
 *     parameters:
 *       - in: path
 *         name: url_path
 *         required: true
 *         description: The URL path (shortened part)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The URL statistics
 *       404:
 *         description: URL path not found
 */
router.get("/statistics/:url_path", getUrlStats);

/**
 * @swagger
 * /list:
 *   get:
 *     summary: List all URLs
 *     description: Retrieves a list of all shortened URLs.
 *     responses:
 *       200:
 *         description: List of shortened URLs
 */
router.get("/list", listUrls);

export default router;
