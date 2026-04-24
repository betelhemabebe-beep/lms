import Course from "./course.model.js"
import User from "../users/user.model.js"

export const createCourse = async (req, res) => {
  if (req.user.role !== "instructor") {
    return res.status(403).json({ message: "Only instructors can create courses" })
  }

  const { name, image } = req.body

  const course = await Course.create({
    name,
    image,
    instructor: req.user._id
  })

  res.status(201).json(course)
}

export const getInstructorCourses = async (req, res) => {
  const courses = await Course.find({ instructor: req.user._id }).sort({ createdAt: -1 })
  res.json(courses)
}

export const getMyCourses = async (req, res) => {
  if (req.user.role === "instructor") {
    const courses = await Course.find({ instructor: req.user._id }).sort({ createdAt: -1 })
    return res.json(courses)
  }

  const user = await User.findById(req.user._id).populate("selectedCourses")
  res.json(user.selectedCourses || [])
}

export const getAllCourses = async (req, res) => {
  const courses = await Course.find()
    .populate("instructor", "name email")
    .sort({ createdAt: -1 })

  res.json(courses)
}