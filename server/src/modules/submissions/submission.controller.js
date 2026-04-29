import Submission from "./submission.model.js"
import Assignment from "../assignments/assignment.model.js"
import User from "../users/user.model.js"
import Course from "../courses/course.model.js"

export const upsertSubmission = async (req, res) => {
  if (req.user.role !== "student") {
    return res.status(403).json({ message: "Only students can submit assignments" })
  }

  const { assignmentId, file } = req.body

  const assignment = await Assignment.findById(assignmentId)

  if (!assignment) {
    return res.status(404).json({ message: "Assignment not found" })
  }

  const student = await User.findById(req.user._id)

  const isEnrolled = student.selectedCourses.some(
    (courseId) => courseId.toString() === assignment.course.toString()
  )

  if (!isEnrolled) {
    return res.status(403).json({ message: "You are not enrolled in this course" })
  }

  if (new Date() > new Date(assignment.deadline)) {
    return res.status(400).json({ message: "Submission is closed" })
  }

  const submission = await Submission.findOneAndUpdate(
    {
      assignment: assignmentId,
      student: req.user._id
    },
    
    {
      assignment: assignmentId,
      student: req.user._id,
      file,
      submittedAt: new Date(),
      status: "Submitted",
      grade: "",
      feedback: "",
      aiGrade: "",
      aiFeedback: "",
      aiStatus: "Not Started"
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    }
  )

  res.json(submission)
}

export const getMyAssignmentSubmission = async (req, res) => {
  const submission = await Submission.findOne({
    assignment: req.params.assignmentId,
    student: req.user._id
  })

  res.json(submission)
}

export const getAssignmentSubmissions = async (req, res) => {
  if (req.user.role !== "instructor") {
    return res.status(403).json({ message: "Only instructors can view all submissions" })
  }

  const assignment = await Assignment.findById(req.params.assignmentId)

  if (!assignment) {
    return res.status(404).json({ message: "Assignment not found" })
  }

  const course = await Course.findById(assignment.course)

  if (!course || course.instructor.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" })
  }

  const students = await User.find({
    role: "student",
    selectedCourses: assignment.course
  }).select("name email")

  const submissions = await Submission.find({ assignment: assignment._id })

  const result = students.map((student) => {
    const submission = submissions.find(
      (item) => item.student.toString() === student._id.toString()
    )

    return {
      submissionId: submission ? submission._id : null,
      studentId: student._id,
      studentName: student.name,
      studentEmail: student.email,
      status: submission ? submission.status : "Not Submitted",
      file: submission ? submission.file : null,
      grade: submission ? submission.grade : "",
      feedback: submission ? submission.feedback : "",
      aiGrade: submission ? submission.aiGrade : "",
      aiFeedback: submission ? submission.aiFeedback : "",
      aiStatus: submission ? submission.aiStatus : "Not Started",
      submittedAt: submission ? submission.submittedAt : null
    }
  })

  res.json(result)
}

export const gradeSubmission = async (req, res) => {
  if (req.user.role !== "instructor") {
    return res.status(403).json({ message: "Only instructors can grade submissions" })
  }

  const { assignmentId, studentId, grade, feedback } = req.body

  const assignment = await Assignment.findById(assignmentId)

  if (!assignment) {
    return res.status(404).json({ message: "Assignment not found" })
  }

  const course = await Course.findById(assignment.course)

  if (!course || course.instructor.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" })
  }

  const submission = await Submission.findOneAndUpdate(
    {
      assignment: assignmentId,
      student: studentId
    },
    {
      grade,
      feedback,
      status: "Graded"
    },
    { new: true }
  )

  if (!submission) {
    return res.status(404).json({ message: "Submission not found" })
  }

  res.json(submission)
}