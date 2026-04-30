import express from "express";
import {
  getCourseDiscussions,
  createDiscussion,
  getDiscussionThread,
  addReply,
} from "./discussion.controller.js";
import authMiddleware from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/course/:courseId", authMiddleware, getCourseDiscussions);
router.post("/course/:courseId", authMiddleware, createDiscussion);
router.get("/thread/:threadId", authMiddleware, getDiscussionThread);
router.post("/thread/:threadId/replies", authMiddleware, addReply);

export default router;