import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import askRoutes from "./routes/ask.routes.js"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json({ limit: "20mb" }))

app.get("/", (req, res) => {
  res.json({ message: "Recommendation service is running" })
})

app.use("/api/ask", askRoutes)

const PORT = process.env.PORT || 6001

app.listen(PORT, () => {
  console.log(`Recommendation service running on port ${PORT}`)
})