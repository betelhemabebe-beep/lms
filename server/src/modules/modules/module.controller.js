import Module from "./module.model.js"
import Course from "../courses/course.model.js"
import ModuleContent from "../module-content/moduleContent.model.js"

export const createModule = async (req, res) => {
  if (req.user.role !== "instructor") {
    return res.status(403).json({ message: "Only instructors can create modules" })
  }

  const { title, image, courseId } = req.body

  const course = await Course.findById(courseId)

  if (!course) {
    return res.status(404).json({ message: "Course not found" })
  }

  if (course.instructor.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" })
  }

  const count = await Module.countDocuments({ course: courseId })

  const module = await Module.create({
    title,
    image,
    course: courseId,
    order: count + 1
  })

  res.status(201).json(module)
}

export const getCourseModules = async (req, res) => {
  const modules = await Module.find({ course: req.params.courseId }).sort({ order: 1 })
  res.json(modules)
}

export const deleteModule = async (req, res) => {
  if (req.user.role !== "instructor") {
    return res.status(403).json({ message: "Only instructors can delete modules" })
  }

  const module = await Module.findById(req.params.moduleId)

  if (!module) {
    return res.status(404).json({ message: "Module not found" })
  }

  const course = await Course.findById(module.course)

  if (!course || course.instructor.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" })
  }

  const contentCount = await ModuleContent.countDocuments({ module: module._id })

  if (contentCount > 0) {
    return res.status(400).json({
      message: "Module cannot be deleted until all files and assignments are removed."
    })
  }

  await Module.findByIdAndDelete(module._id)

  res.json({ message: "Module deleted" })
}