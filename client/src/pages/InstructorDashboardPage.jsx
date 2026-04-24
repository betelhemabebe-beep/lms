import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import API from "../services/api"
import { useAuth } from "../context/AuthContext"
import Modal from "../components/common/Modal"

function InstructorDashboardPage() {
  const [courses, setCourses] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [name, setName] = useState("")
  const [imageFile, setImageFile] = useState(null)
  const [error, setError] = useState("")
  const { user } = useAuth()

  const uploadFile = async (file, type) => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("type", type)

    const res = await API.post("/uploads", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })

    return res.data.fileUrl
  }

  const loadCourses = async () => {
    const res = await API.get("/dashboard/instructor")
    setCourses(res.data.courses || [])
  }

  useEffect(() => {
    if (user?.token) {
      loadCourses()
    }
  }, [user])

  const handleCreateCourse = async (e) => {
    e.preventDefault()
    setError("")

    try {
      let image = ""

      if (imageFile) {
        image = await uploadFile(imageFile, "course-image")
      }

      await API.post("/courses", { name, image })

      setName("")
      setImageFile(null)
      setShowModal(false)
      loadCourses()
    } catch (err) {
      setError(err.response?.data?.message || "Could not create course")
    }
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header dashboard-header-row">
        <div>
          <h1 className="dashboard-title">My Courses</h1>
          <p className="dashboard-subtitle">Welcome back, {user?.name}</p>
        </div>

        <button className="create-button" onClick={() => setShowModal(true)}>
          New Course
        </button>
      </div>

      <div className="course-grid">
        {courses.map((course) => (
          <Link
            key={course._id}
            to={`/instructor/course/${course._id}`}
            className="course-card"
          >
            <img
              src={course.image || "https://via.placeholder.com/400x180"}
              alt={course.name}
              className="course-image"
            />
            <div className="course-body">
              <h3 className="course-title">{course.name}</h3>
            </div>
          </Link>
        ))}
      </div>

      {showModal && (
        <Modal title="Create Course">
          {error && <div className="error-box">{error}</div>}

          <form className="modal-form" onSubmit={handleCreateCourse}>
            <div className="auth-field">
              <label>Course Name</label>
              <input
                type="text"
                placeholder="CS 101 - Intro to Computing"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="auth-field">
              <label>Course Image</label>
              <input
                type="file"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

              <button type="submit" className="create-button">
                Create
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

export default InstructorDashboardPage