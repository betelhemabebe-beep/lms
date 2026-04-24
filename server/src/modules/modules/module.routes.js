import express from "express"
import {
  createModule,
  getCourseModules,
  deleteModule
} from "./module.controller.js"
import authMiddleware from "../../middleware/authMiddleware.js"

const router = express.Router()

router.post("/", authMiddleware, createModule)
router.get("/course/:courseId", getCourseModules)
router.delete("/:moduleId", authMiddleware, deleteModule)

export default router