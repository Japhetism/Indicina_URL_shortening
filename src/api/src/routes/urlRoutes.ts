import { Router } from "express";
import { encodeUrl } from "../controllers/urlController";

const router = Router();

router.post("/encode", encodeUrl);

export default router;