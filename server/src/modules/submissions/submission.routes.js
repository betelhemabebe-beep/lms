import express from "express"
import {
  upsertSubmission,
  getMyAssignmentSubmission,
  getAssignmentSubmissions,
  gradeSubmission
} from "./submission.controller.js"
import authMiddleware from "../../middleware/authMiddleware.js"

const router = express.Router()

router.post("/", authMiddleware, upsertSubmission)
router.get("/mine/:assignmentId", authMiddleware, getMyAssignmentSubmission)
router.get("/assignment/:assignmentId", authMiddleware, getAssignmentSubmissions)
router.put("/grade", authMiddleware, gradeSubmission)

export default router