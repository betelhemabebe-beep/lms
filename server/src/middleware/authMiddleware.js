import jwt from "jsonwebtoken"
import User from "../modules/users/user.model.js"
import { env } from "../config/env.js"

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
      return res.status(401).json({ message: "No token provided" })
    }

    const decoded = jwt.verify(token, env.jwtSecret)
    const user = await User.findById(decoded.id).select("-password")

    if (!user) {
      return res.status(401).json({ message: "User not found" })
    }

    req.user = user
    next()
  } catch {
    return res.status(401).json({ message: "Invalid token" })
  }
}

export default authMiddleware