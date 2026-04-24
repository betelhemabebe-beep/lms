import express from "express"
import {
  getStudentDashboard,
  getInstructorDashboard
} from "./dashboard.controller.js"
import authMiddleware from "../../middleware/authMiddleware.js"

const router = express.Router()

router.get("/student", authMiddleware, getStudentDashboard)
router.get("/instructor", authMiddleware, getInstructorDashboard)

export default router