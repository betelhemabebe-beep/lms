import ModuleContent from "./moduleContent.model.js"
import Module from "../modules/module.model.js"
import Course from "../courses/course.model.js"

export const createModuleFile = async (req, res) => {
  if (req.user.role !== "instructor") {
    return res.status(403).json({ message: "Only instructors can add files" })
  }

  const { moduleId, title, fileName, fileUrl } = req.body

  const module = await Module.findById(moduleId)

  if (!module) {
    return res.status(404).json({ message: "Module not found" })
  }

  const course = await Course.findById(module.course)

  if (!course || course.instructor.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" })
  }

  const count = await ModuleContent.countDocuments({ module: moduleId })

  const content = await ModuleContent.create({
    module: moduleId,
    course: module.course,
    itemType: "file",
    title,
    fileName,
    fileUrl,
    order: count + 1
  })

  res.status(201).json(content)
}

export const getModuleContent = async (req, res) => {
  const content = await ModuleContent.find({ module: req.params.moduleId })
    .populate("assignment")
    .sort({ order: 1 })

  res.json(content)
}

export const deleteModuleContent = async (req, res) => {
  if (req.user.role !== "instructor") {
    return res.status(403).json({ message: "Only instructors can delete content" })
  }

  const content = await ModuleContent.findById(req.params.contentId)

  if (!content) {
    return res.status(404).json({ message: "Content not found" })
  }

  const course = await Course.findById(content.course)

  if (!course || course.instructor.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" })
  }

  if (content.itemType === "assignment") {
    return res.status(400).json({
      message: "Delete the assignment from the assignments endpoint."
    })
  }

  await ModuleContent.findByIdAndDelete(content._id)

  res.json({ message: "Content deleted" })
}