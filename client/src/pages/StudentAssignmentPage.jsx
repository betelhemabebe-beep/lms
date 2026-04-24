import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import API from "../services/api"
import { useAuth } from "../context/AuthContext"
import PageHeader from "../components/common/PageHeader"

function StudentAssignmentPage() {
  const { assignmentId } = useParams()
  const { user } = useAuth()
  const [assignment, setAssignment] = useState(null)
  const [submission, setSubmission] = useState(null)
  const [submissionFile, setSubmissionFile] = useState(null)
  const [error, setError] = useState("")

  const isPdf = (url) => {
    return url?.toLowerCase().includes(".pdf")
  }

  const getFileLink = (url, title) => {
    if (isPdf(url)) {
      return `/file-viewer?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`
    }

    return url
  }

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
    const assignmentRes = await API.get(`/assignments/${assignmentId}`)
    setAssignment(assignmentRes.data)

    const submissionRes = await API.get(`/submissions/mine/${assignmentId}`)
    setSubmission(submissionRes.data)
  }

  useEffect(() => {
    if (user?.token) {
      loadData()
    }
  }, [assignmentId, user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    try {
      if (!submissionFile) {
        setError("Please choose a file")
        return
      }

      const fileUrl = await uploadFile(submissionFile, "submission-file")

      const res = await API.post("/submissions", {
        assignmentId,
        file: fileUrl
      })

      setSubmission(res.data)
      setSubmissionFile(null)
    } catch (err) {
      setError(err.response?.data?.message || "Could not submit assignment")
    }
  }

  if (!assignment) {
    return (
      <div className="assignment-page-shell">
        <PageHeader label="Assignment" title="Loading..." />
      </div>
    )
  }

  const isClosed = new Date() > new Date(assignment.deadline)

  return (
    <div className="assignment-page-shell">
      <PageHeader label="Assignment" title={assignment.title} />

      <div className="assignment-page-content">
        <div className="assignment-layout">
          <div className="assignment-main">
            <div className="info-card">
              <h2 className="info-card-title">Assignment Details</h2>

              <div className="detail-list">
                <div className="detail-row">
                  <span className="detail-label">Title</span>
                  <span className="detail-value">{assignment.title}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Deadline</span>
                  <span className="detail-value">
                    {new Date(assignment.deadline).toLocaleString()}
                  </span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Status</span>
                  <span className="status-pill submitted-pill">
                    {submission?.status || (isClosed ? "Closed" : "Not Submitted")}
                  </span>
                </div>
              </div>
            </div>

            <div className="info-card">
              <h2 className="info-card-title">Assignment Files</h2>

              <div className="file-stack">
                <div className="file-row">
                  <div>
                    <h3 className="file-row-title">Instruction File</h3>
                    <p className="file-row-meta">View the assignment instructions</p>
                  </div>

                  {isPdf(assignment.instructionFile) ? (
                    <Link
                      className="row-action-button"
                      to={getFileLink(assignment.instructionFile, "Instruction File")}
                    >
                      Open
                    </Link>
                  ) : (
                    <a
                      className="row-action-button"
                      href={assignment.instructionFile}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open
                    </a>
                  )}
                </div>

                <div className="file-row">
                  <div>
                    <h3 className="file-row-title">Rubric File</h3>
                    <p className="file-row-meta">View the grading rubric</p>
                  </div>

                  {isPdf(assignment.rubricFile) ? (
                    <Link
                      className="row-action-button"
                      to={getFileLink(assignment.rubricFile, "Rubric File")}
                    >
                      Open
                    </Link>
                  ) : (
                    <a
                      className="row-action-button"
                      href={assignment.rubricFile}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="info-card">
              <h2 className="info-card-title">My Submission</h2>

              {error && <div className="error-box">{error}</div>}

              {submission?.file && (
                <div className="file-stack">
                  <div className="file-row">
                    <div>
                      <h3 className="file-row-title">Current Submission</h3>
                      <p className="file-row-meta">Your latest uploaded file</p>
                    </div>

                    {isPdf(submission.file) ? (
                      <Link
                        className="row-action-button"
                        to={getFileLink(submission.file, "Current Submission")}
                      >
                        Open
                      </Link>
                    ) : (
                      <a
                        className="row-action-button"
                        href={submission.file}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open
                      </a>
                    )}
                  </div>
                </div>
              )}

              {!isClosed && (
                <form className="submission-form" onSubmit={handleSubmit}>
                  <label className="upload-label">Upload Submission</label>
                  <input
                    type="file"
                    className="upload-input"
                    onChange={(e) => setSubmissionFile(e.target.files[0])}
                  />

                  <button type="submit" className="create-button">
                    Submit Assignment
                  </button>
                </form>
              )}

              {isClosed && (
                <p className="empty-message">
                  Submission is closed. You can still view the files.
                </p>
              )}
            </div>
          </div>

          <div className="assignment-side">
            <div className="info-card">
              <h2 className="info-card-title">Final Grade</h2>
              <div className="grade-box">{submission?.grade || "-"}</div>
            </div>

            <div className="info-card">
              <h2 className="info-card-title">Teacher Feedback</h2>
              <p className="feedback-text">{submission?.feedback || "No feedback yet."}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentAssignmentPage