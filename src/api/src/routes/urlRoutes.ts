import { Router } from "express";
import {
  decodeUrl,
  encodeUrl,
  getUrlStats
} from "../controllers/urlController";

const router = Router();

router.post("/encode", encodeUrl);
router.post("/decode", decodeUrl);
router.get("/statistics/:url_path", getUrlStats);

export default router;