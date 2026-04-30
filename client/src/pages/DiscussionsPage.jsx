import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import API from "../services/api"
import PageHeader from "../components/common/PageHeader"
import CourseTabs from "../components/common/CourseTabs"
import { useAuth } from "../context/AuthContext"

function DiscussionsPage() {
  const { courseId } = useParams()
  const { user } = useAuth()

  const [discussions, setDiscussions] = useState([])
  const [courseName, setCourseName] = useState("Course")
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [error, setError] = useState("")

  const role = user?.role || "student"

  const loadDiscussions = async () => {
    try {
      setError("")

      const coursesRes = await API.get("/courses")
      const foundCourse = coursesRes.data.find((course) => course._id === courseId)

      if (foundCourse) {
        setCourseName(foundCourse.name)
      }

      const discussionsRes = await API.get(`/discussions/course/${courseId}`)
      setDiscussions(discussionsRes.data)
    } catch (err) {
      setError(err.response?.data?.message || "Could not load discussions")
    }
  }

  useEffect(() => {
    loadDiscussions()
  }, [courseId])

  const handleCreateDiscussion = async (e) => {
    e.preventDefault()

    try {
      setError("")

      await API.post(`/discussions/course/${courseId}`, {
        title,
        body,
      })

      setTitle("")
      setBody("")
      loadDiscussions()
    } catch (err) {
      setError(err.response?.data?.message || "Could not create discussion")
    }
  }

  return (
    <div className="course-page-shell">
      <PageHeader label="Course" title={courseName} />
      <CourseTabs role={role} courseId={courseId} active="discussions" />

      <div className="course-page-content">
        <div className="section-header">
          <h2 className="section-title">Discussions</h2>
          <p className="section-subtitle">
            Create and reply to course discussion threads.
          </p>
        </div>

        {error && <div className="error-box">{error}</div>}

        <form className="modal-form" onSubmit={handleCreateDiscussion}>
          <div className="auth-field">
            <label>Title</label>
            <input
              type="text"
              placeholder="Enter discussion title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label>Body</label>
            <textarea
              placeholder="Write your discussion"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
            />
          </div>

          <button className="primary-button" type="submit">
            Create Thread
          </button>
        </form>

        <div style={{ marginTop: "30px" }}>
          <h3>Course Threads</h3>

          {discussions.length === 0 ? (
            <p>No discussions yet.</p>
          ) : (
            discussions.map((discussion) => (
              <div key={discussion._id} className="module-card" style={{ padding: "20px", marginBottom: "15px" }}>
                <Link to={`/discussions/thread/${discussion._id}`}>
                  <h3>{discussion.title}</h3>
                </Link>
                <p>{discussion.body}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default DiscussionsPage