import express from "express"
import upload from "../../middleware/uploadMiddleware.js"
import { uploadFile } from "./upload.controller.js"
import authMiddleware from "../../middleware/authMiddleware.js"

const router = express.Router()

router.post("/", authMiddleware, upload.single("file"), uploadFile)

export default router