import express from "express"
import {
  createCourse,
  getInstructorCourses,
  getMyCourses,
  getAllCourses
} from "./course.controller.js"
import authMiddleware from "../../middleware/authMiddleware.js"

const router = express.Router()

router.post("/", authMiddleware, createCourse)
router.get("/instructor", authMiddleware, getInstructorCourses)
router.get("/my", authMiddleware, getMyCourses)
router.get("/", getAllCourses)

export default router