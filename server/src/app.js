import express from "express"
import cors from "cors"
import googleCalendarRoutes from "./routes/googleCalendarRoutes.js";
import authRoutes from "./modules/auth/auth.routes.js"
import courseRoutes from "./modules/courses/course.routes.js"
import moduleRoutes from "./modules/modules/module.routes.js"
import moduleContentRoutes from "./modules/module-content/moduleContent.routes.js"
import assignmentRoutes from "./modules/assignments/assignment.routes.js"
import submissionRoutes from "./modules/submissions/submission.routes.js"
import gradeRoutes from "./modules/grades/grade.routes.js"
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js"
import uploadRoutes from "./modules/uploads/upload.routes.js"
import contextRoutes from "./modules/context/context.routes.js"

const app = express()

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/uploads", express.static("uploads"))

app.use("/api/auth", authRoutes)
app.use("/api/courses", courseRoutes)
app.use("/api/modules", moduleRoutes)
app.use("/api/module-content", moduleContentRoutes)
app.use("/api/assignments", assignmentRoutes)
app.use("/api/submissions", submissionRoutes)
app.use("/api/grades", gradeRoutes)
app.use("/api/dashboard", dashboardRoutes)
app.use("/api/uploads", uploadRoutes)
app.use("/api/context", contextRoutes)
app.use("/api/calendar/google", googleCalendarRoutes);

app.get("/", (req, res) => {
  res.send("API is running")
})

export default app