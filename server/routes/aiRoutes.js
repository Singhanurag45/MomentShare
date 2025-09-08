import express from "express";
import { generateCaptions } from "../controllers/aiController.js";

const router = express.Router();

router.post("/generate-captions", generateCaptions);

export default router;

