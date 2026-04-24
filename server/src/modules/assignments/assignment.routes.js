import express from "express"
import {
  createAssignment,
  getCourseAssignments,
  getAssignmentById,
  deleteAssignment
} from "./assignment.controller.js"
import authMiddleware from "../../middleware/authMiddleware.js"

const router = express.Router()

router.post("/", authMiddleware, createAssignment)
router.get("/course/:courseId", getCourseAssignments)
router.get("/:assignmentId", getAssignmentById)
router.delete("/:assignmentId", authMiddleware, deleteAssignment)

export default router