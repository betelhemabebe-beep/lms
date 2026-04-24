import Course from "../courses/course.model.js"
import Assignment from "../assignments/assignment.model.js"
import Submission from "../submissions/submission.model.js"
import User from "../users/user.model.js"

export const getStudentDashboard = async (req, res) => {
  const user = await User.findById(req.user._id).populate("selectedCourses")

  const courses = user.selectedCourses || []

  const assignments = await Assignment.find({
    course: { $in: courses.map((c) => c._id) }
  })

  const submissions = await Submission.find({
    student: req.user._id
  })

  const workToDo = assignments
    .filter((a) => {
      const submitted = submissions.find(
        (s) => s.assignment.toString() === a._id.toString()
      )
      return !submitted && new Date() < new Date(a.deadline)
    })
    .map((a) => ({
      assignmentId: a._id,
      title: a.title,
      courseName: courses.find((c) => c._id.toString() === a.course.toString())?.name,
      deadline: a.deadline
    }))
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))

  res.json({
    courses,
    workToDo
  })
}

export const getInstructorDashboard = async (req, res) => {
  const courses = await Course.find({
    instructor: req.user._id
  }).sort({ createdAt: -1 })

  res.json({ courses })
}