import Assignment from "./assignment.model.js"
import Module from "../modules/module.model.js"
import Course from "../courses/course.model.js"
import ModuleContent from "../module-content/moduleContent.model.js"
import Submission from "../submissions/submission.model.js"

export const createAssignment = async (req, res) => {
  if (req.user.role !== "instructor") {
    return res.status(403).json({ message: "Only instructors can create assignments" })
  }

  const { title, deadline, instructionFile, rubricFile, moduleId } = req.body

  const module = await Module.findById(moduleId)

  if (!module) {
    return res.status(404).json({ message: "Module not found" })
  }

  const course = await Course.findById(module.course)

  if (!course || course.instructor.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" })
  }

  const existing = await Assignment.findOne({ module: moduleId, title })

  if (existing) {
    return res.status(400).json({
      message: "Assignment title must be unique within the same module."
    })
  }

  const assignment = await Assignment.create({
    title,
    deadline,
    instructionFile,
    rubricFile,
    module: moduleId,
    course: module.course,
    createdBy: req.user._id
  })

  const count = await ModuleContent.countDocuments({ module: moduleId })

  await ModuleContent.create({
    module: moduleId,
    course: module.course,
    itemType: "assignment",
    title,
    assignment: assignment._id,
    order: count + 1
  })

  res.status(201).json(assignment)
}

export const getCourseAssignments = async (req, res) => {
  const assignments = await Assignment.find({ course: req.params.courseId })
    .populate("module", "title")
    .sort({ deadline: 1 })

  res.json(assignments)
}

export const getAssignmentById = async (req, res) => {
  const assignment = await Assignment.findById(req.params.assignmentId)
    .populate("module", "title")
    .populate("course", "name")

  if (!assignment) {
    return res.status(404).json({ message: "Assignment not found" })
  }

  res.json(assignment)
}

export const deleteAssignment = async (req, res) => {
  if (req.user.role !== "instructor") {
    return res.status(403).json({ message: "Only instructors can delete assignments" })
  }

  const assignment = await Assignment.findById(req.params.assignmentId)

  if (!assignment) {
    return res.status(404).json({ message: "Assignment not found" })
  }

  const course = await Course.findById(assignment.course)

  if (!course || course.instructor.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" })
  }

  await Submission.deleteMany({ assignment: assignment._id })
  await ModuleContent.deleteOne({ assignment: assignment._id })
  await Assignment.findByIdAndDelete(assignment._id)

  res.json({ message: "Assignment deleted" })
}