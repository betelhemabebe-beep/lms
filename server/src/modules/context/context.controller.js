import User from "../users/user.model.js"
import Course from "../courses/course.model.js"
import Module from "../modules/module.model.js"
import ModuleContent from "../module-content/moduleContent.model.js"
import Assignment from "../assignments/assignment.model.js"
import Submission from "../submissions/submission.model.js"

export const getContext = async (req, res) => {
  const { pageType, courseId, moduleId, assignmentId, contentId } = req.query

  if (!pageType) {
    return res.status(400).json({ message: "pageType is required" })
  }

  if (pageType === "dashboard") {
    const user = await User.findById(req.user._id).populate("selectedCourses")

    const assignments = await Assignment.find({
      course: { $in: user.selectedCourses.map((course) => course._id) },
      deadline: { $gte: new Date() }
    })
      .populate("course", "name")
      .sort({ deadline: 1 })

    return res.json({
      pageType: "dashboard",
      student: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      courses: user.selectedCourses.map((course) => ({
        id: course._id,
        name: course.name
      })),
      workToDo: assignments.map((assignment) => ({
        assignmentId: assignment._id,
        title: assignment.title,
        courseName: assignment.course?.name || "",
        deadline: assignment.deadline
      }))
    })
  }

  if (pageType === "course") {
    const course = await Course.findById(courseId)

    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    const modules = await Module.find({ course: courseId }).sort({ order: 1 })
    const assignments = await Assignment.find({ course: courseId }).sort({ deadline: 1 })

    return res.json({
      pageType: "course",
      course: {
        id: course._id,
        name: course.name
      },
      modules: modules.map((module) => ({
        id: module._id,
        title: module.title
      })),
      assignments: assignments.map((assignment) => ({
        id: assignment._id,
        title: assignment.title,
        deadline: assignment.deadline
      }))
    })
  }

  if (pageType === "module") {
    const module = await Module.findById(moduleId)

    if (!module) {
      return res.status(404).json({ message: "Module not found" })
    }

    const course = await Course.findById(module.course)

    const content = await ModuleContent.find({ module: moduleId })
      .populate("assignment")
      .sort({ order: 1 })

    return res.json({
      pageType: "module",
      course: {
        id: course._id,
        name: course.name
      },
      module: {
        id: module._id,
        title: module.title
      },
      files: content
        .filter((item) => item.itemType === "file")
        .map((item) => ({
          id: item._id,
          title: item.title,
          fileName: item.fileName,
          fileUrl: item.fileUrl
        })),
      assignments: content
        .filter((item) => item.itemType === "assignment" && item.assignment)
        .map((item) => ({
          id: item.assignment._id,
          title: item.assignment.title,
          deadline: item.assignment.deadline,
          instructionFile: item.assignment.instructionFile,
          rubricFile: item.assignment.rubricFile
        }))
    })
  }

  if (pageType === "assignment") {
    const assignment = await Assignment.findById(assignmentId)
      .populate("course")
      .populate("module")

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" })
    }

    const submission = await Submission.findOne({
      assignment: assignment._id,
      student: req.user._id
    })

    return res.json({
      pageType: "assignment",
      course: {
        id: assignment.course._id,
        name: assignment.course.name
      },
      module: {
        id: assignment.module._id,
        title: assignment.module.title
      },
      assignment: {
        id: assignment._id,
        title: assignment.title,
        deadline: assignment.deadline,
        instructionFile: assignment.instructionFile,
        rubricFile: assignment.rubricFile
      },
      submission: submission
        ? {
            id: submission._id,
            file: submission.file,
            status: submission.status,
            grade: submission.grade,
            feedback: submission.feedback,
            submittedAt: submission.submittedAt
          }
        : null
    })
  }

  if (pageType === "file") {
    const content = await ModuleContent.findById(contentId)

    if (!content || content.itemType !== "file") {
      return res.status(404).json({ message: "File content not found" })
    }

    const module = await Module.findById(content.module)
    const course = await Course.findById(content.course)

    return res.json({
      pageType: "file",
      course: {
        id: course._id,
        name: course.name
      },
      module: {
        id: module._id,
        title: module.title
      },
      file: {
        id: content._id,
        title: content.title,
        fileName: content.fileName,
        fileUrl: content.fileUrl
      }
    })
  }

  return res.status(400).json({ message: "Invalid pageType" })
}