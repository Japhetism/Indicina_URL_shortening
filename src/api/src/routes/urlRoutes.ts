import { Router } from "express";
import { decodeUrl, encodeUrl } from "../controllers/urlController";

const router = Router();

router.post("/encode", encodeUrl);
router.post("/decode", decodeUrl);

export default router;