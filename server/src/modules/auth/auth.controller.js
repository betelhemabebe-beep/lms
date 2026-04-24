import bcrypt from "bcryptjs"
import User from "../users/user.model.js"
import Course from "../courses/course.model.js"
import generateToken from "../../utils/generateToken.js"

export const register = async (req, res) => {
  const { name, email, password, role, selectedCourses = [] } = req.body

  const existingUser = await User.findOne({ email })

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" })
  }

  if (!["student", "instructor"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" })
  }

  if (role === "student") {
    const courseCount = await Course.countDocuments()

    if (courseCount === 0) {
      return res.status(400).json({
        message: "No courses are available yet. Please wait and contact support."
      })
    }

    if (!Array.isArray(selectedCourses) || selectedCourses.length < 1 || selectedCourses.length > 3) {
      return res.status(400).json({
        message: "Students must select between 1 and 3 courses."
      })
    }

    const validCourses = await Course.find({ _id: { $in: selectedCourses } })

    if (validCourses.length !== selectedCourses.length) {
      return res.status(400).json({ message: "One or more selected courses are invalid." })
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
    selectedCourses: role === "student" ? selectedCourses : []
  })

  const populatedUser = await User.findById(user._id).populate("selectedCourses")

  res.status(201).json({
    _id: populatedUser._id,
    name: populatedUser.name,
    email: populatedUser.email,
    role: populatedUser.role,
    selectedCourses: populatedUser.selectedCourses,
    token: generateToken(populatedUser._id)
  })
}

export const login = async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email }).populate("selectedCourses")

  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" })
  }

  const passwordMatches = await bcrypt.compare(password, user.password)

  if (!passwordMatches) {
    return res.status(400).json({ message: "Invalid credentials" })
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    selectedCourses: user.selectedCourses,
    token: generateToken(user._id)
  })
}