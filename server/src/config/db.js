import mongoose from "mongoose"
import { env } from "./env.js"

export const connectDB = async () => {
  try {
    await mongoose.connect(env.mongoUri)
    console.log("DB connected")
  } catch (error) {
    console.log("DB failed")
    console.log(error.message)
    process.exit(1)
  }
}