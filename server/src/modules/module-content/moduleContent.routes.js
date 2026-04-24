import express from "express"
import {
  createModuleFile,
  getModuleContent,
  deleteModuleContent
} from "./moduleContent.controller.js"
import authMiddleware from "../../middleware/authMiddleware.js"

const router = express.Router()

router.post("/file", authMiddleware, createModuleFile)
router.get("/module/:moduleId", getModuleContent)
router.delete("/:contentId", authMiddleware, deleteModuleContent)

export default router