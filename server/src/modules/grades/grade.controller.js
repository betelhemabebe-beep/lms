import Assignment from "../assignments/assignment.model.js"
import Submission from "../submissions/submission.model.js"
import User from "../users/user.model.js"

export const getStudentGrades = async (req, res) => {
  if (req.user.role !== "student") {
    return res.status(403).json({ message: "Only students can view their grades" })
  }

  const { courseId } = req.params

  const user = await User.findById(req.user._id)

  const isEnrolled = user.selectedCourses.some(
    (selectedCourseId) => selectedCourseId.toString() === courseId.toString()
  )

  if (!isEnrolled) {
    return res.status(403).json({ message: "You are not enrolled in this course" })
  }

  const assignments = await Assignment.find({ course: courseId }).sort({ deadline: 1 })

  const submissions = await Submission.find({
    student: req.user._id,
    assignment: { $in: assignments.map((assignment) => assignment._id) }
  })

  const result = assignments.map((assignment) => {
    const submission = submissions.find(
      (item) => item.assignment.toString() === assignment._id.toString()
    )

    let status = "Not Submitted"

    if (!submission && new Date() > new Date(assignment.deadline)) {
      status = "Closed"
    }

    if (submission) {
      status = submission.status
    }

    return {
      assignmentId: assignment._id,
      title: assignment.title,
      deadline: assignment.deadline,
      status,
      grade: submission?.grade || "",
      feedback: submission?.feedback || ""
    }
  })

  res.json(result)
}