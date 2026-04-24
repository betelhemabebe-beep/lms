import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import API from "../services/api"

function StudentRegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [courses, setCourses] = useState([])
  const [selectedCourses, setSelectedCourses] = useState([])
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const res = await API.get("/courses")
        setCourses(res.data)
      } catch {
        setError("Could not load courses")
      }
    }

    loadCourses()
  }, [])

  const toggleCourse = (courseId) => {
    if (selectedCourses.includes(courseId)) {
      setSelectedCourses(selectedCourses.filter((id) => id !== courseId))
      return
    }

    if (selectedCourses.length < 3) {
      setSelectedCourses([...selectedCourses, courseId])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (courses.length === 0) {
      setError("No courses are available yet. Please wait and contact support.")
      return
    }

    if (selectedCourses.length < 1 || selectedCourses.length > 3) {
      setError("Please select between 1 and 3 courses.")
      return
    }

    try {
      await API.post("/auth/register", {
        name,
        email,
        password,
        role: "student",
        selectedCourses
      })

      navigate("/login")
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed")
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Student Sign Up</h1>
        <p className="auth-subtitle">Create your student account</p>

        {error && <div className="error-box">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="auth-field">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="auth-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="course-selection-box">
            <label className="course-selection-label">Select 1 to 3 Courses</label>

            {courses.length === 0 && (
              <p className="empty-message">
                No courses are available yet. Please wait and contact support.
              </p>
            )}

            {courses.map((course) => (
              <label key={course._id} className="course-checkbox-row">
                <input
                  type="checkbox"
                  checked={selectedCourses.includes(course._id)}
                  onChange={() => toggleCourse(course._id)}
                />
                <span>{course.name}</span>
              </label>
            ))}
          </div>

          <button type="submit" className="auth-button">
            Create Student Account
          </button>
        </form>

        <div className="auth-links">
          <Link to="/login">Login</Link>
          <Link to="/register/instructor">Instructor Sign Up</Link>
          <Link to="/">Back to Home</Link>
        </div>
      </div>
    </div>
  )
}

export default StudentRegisterPage