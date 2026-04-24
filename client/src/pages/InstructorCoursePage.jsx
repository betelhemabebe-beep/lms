import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import API from "../services/api"
import { useAuth } from "../context/AuthContext"
import PageHeader from "../components/common/PageHeader"
import CourseTabs from "../components/common/CourseTabs"
import Modal from "../components/common/Modal"

function InstructorCoursePage() {
  const { courseId } = useParams()
  const { user } = useAuth()
  const [modules, setModules] = useState([])
  const [courseName, setCourseName] = useState("Course")
  const [showModal, setShowModal] = useState(false)
  const [title, setTitle] = useState("")
  const [imageFile, setImageFile] = useState(null)
  const [error, setError] = useState("")

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

  const loadData = async () => {
    const coursesRes = await API.get("/courses")
    const foundCourse = coursesRes.data.find((course) => course._id === courseId)

    if (foundCourse) {
      setCourseName(foundCourse.name)
    }

    const modulesRes = await API.get(`/modules/course/${courseId}`)
    setModules(modulesRes.data)
  }

  useEffect(() => {
    loadData()
  }, [courseId])

  const handleCreateModule = async (e) => {
    e.preventDefault()
    setError("")

    try {
      let image = ""

      if (imageFile) {
        image = await uploadFile(imageFile, "module-image")
      }

      await API.post("/modules", {
        title,
        image,
        courseId
      })

      setTitle("")
      setImageFile(null)
      setShowModal(false)
      loadData()
    } catch (err) {
      setError(err.response?.data?.message || "Could not create module")
    }
  }

  return (
    <div className="course-page-shell">
      <PageHeader label="Course" title={courseName} />
      <CourseTabs role="instructor" courseId={courseId} active="content" />

      <div className="course-page-content">
        <div className="section-header section-header-row">
          <div>
            <h2 className="section-title">Content</h2>
            <p className="section-subtitle">Manage modules and course content</p>
          </div>

          <button className="create-button" onClick={() => setShowModal(true)}>
            Create Module
          </button>
        </div>

        <div className="module-grid">
          {modules.map((module) => (
            <Link
              key={module._id}
              to={`/module/${module._id}`}
              className="module-card"
            >
              <img
                src={module.image || "https://via.placeholder.com/400x180"}
                alt={module.title}
                className="module-image"
              />
              <div className="module-body">
                <h3 className="module-title">{module.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {showModal && (
        <Modal title="Create Module">
          {error && <div className="error-box">{error}</div>}

          <form className="modal-form" onSubmit={handleCreateModule}>
            <div className="auth-field">
              <label>Module Name</label>
              <input
                type="text"
                placeholder="Week 1 - Introduction"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="auth-field">
              <label>Module Image</label>
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

export default InstructorCoursePage