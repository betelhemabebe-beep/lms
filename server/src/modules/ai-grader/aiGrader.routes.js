import express from "express";
import {
  runAIGrader,
  getAIGraderResult
} from "./aiGrader.controller.js";

const router = express.Router();

router.post("/submission/:submissionId", runAIGrader);
router.get("/submission/:submissionId", getAIGraderResult);

export default router;