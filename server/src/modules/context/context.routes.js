import express from "express"
import { getContext } from "./context.controller.js"
import authMiddleware from "../../middleware/authMiddleware.js"

const router = express.Router()

router.get("/", authMiddleware, getContext)

export default router