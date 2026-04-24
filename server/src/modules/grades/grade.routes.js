import express from "express"
import { getStudentGrades } from "./grade.controller.js"
import authMiddleware from "../../middleware/authMiddleware.js"

const router = express.Router()

router.get("/course/:courseId", authMiddleware, getStudentGrades)

export default router