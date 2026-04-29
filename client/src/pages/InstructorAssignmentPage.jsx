import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import API from "../services/api"
import PageHeader from "../components/common/PageHeader"

function InstructorAssignmentPage() {
  const { assignmentId } = useParams()
  const [assignment, setAssignment] = useState(null)
  const [students, setStudents] = useState([])
  const [grades, setGrades] = useState({})
  const [feedbacks, setFeedbacks] = useState({})

  const loadData = async () => {
    const assignmentRes = await API.get(`/assignments/${assignmentId}`)
    setAssignment(assignmentRes.data)

    const submissionsRes = await API.get(`/submissions/assignment/${assignmentId}`)
    setStudents(submissionsRes.data)

    const gradeMap = {}
    const feedbackMap = {}

    submissionsRes.data.forEach((item) => {
      gradeMap[item.studentId] = item.grade || ""
      feedbackMap[item.studentId] = item.feedback || ""
    })

    setGrades(gradeMap)
    setFeedbacks(feedbackMap)
  }

  useEffect(() => {
    loadData()
  }, [assignmentId])

  const handleSave = async (studentId) => {
    await API.put("/submissions/grade", {
      assignmentId,
      studentId,
      grade: grades[studentId],
      feedback: feedbacks[studentId]
    })

    loadData()
  }

  const handleAIGrade = async (submissionId) => {
    if (!submissionId) return
  
    await API.post(`/ai-grader/submission/${submissionId}`)
  
    loadData()
  }

  return (
    <div className="assignment-page-shell">
      <PageHeader label="Assignment" title={assignment?.title || "Assignment"} />

      <div className="assignment-page-content">
        <div className="section-header">
          <h2 className="section-title">Submissions</h2>
          <p className="section-subtitle">
            View student submissions and assign final grades
          </p>
        </div>

        <div className="instructor-submission-list">
          {students.map((student) => (
            <div key={student.studentId} className="instructor-submission-card">
              <div className="submission-student-header">
                <div>
                  <h3>{student.studentName}</h3>
                  <p>{student.studentEmail}</p>
                </div>

                <span className="status-pill submitted-pill">{student.status}</span>
              </div>

              <div className="submission-detail-grid">
                <div>
                  <span className="detail-label">Submitted File</span>
                  {student.file ? (
                    <a
                      href={student.file}
                      target="_blank"
                      rel="noreferrer"
                      className="content-link"
                    >
                      Open Submission
                    </a>
                  ) : (
                    <p className="content-meta">No submission</p>
                  )}
                </div>

                <div>
                  <span className="detail-label">Grade</span>
                  <input
                    className="grade-input"
                    placeholder="0-100%"
                    value={grades[student.studentId] || ""}
                    onChange={(e) =>
                      setGrades({
                        ...grades,
                        [student.studentId]: e.target.value
                      })
                    }
                    disabled={!student.file}
                  />
                </div>
              </div>

              <div className="auth-field">
                <label>Feedback</label>
                <textarea
                  rows="3"
                  placeholder="Write feedback"
                  value={feedbacks[student.studentId] || ""}
                  onChange={(e) =>
                    setFeedbacks({
                      ...feedbacks,
                      [student.studentId]: e.target.value
                    })
                  }
                  disabled={!student.file}
                />
              </div>

              <div className="auth-field">
  <label>AI Grader Suggestion</label>

  <p className="content-meta">
    <strong>Status:</strong> {student.aiStatus || "Not Started"}
  </p>

  <p className="content-meta">
    <strong>Suggested Grade:</strong>{" "}
    {student.aiGrade ? student.aiGrade : "Not available yet"}
  </p>

  <p className="content-meta">
    <strong>AI Feedback:</strong>{" "}
    {student.aiFeedback ? student.aiFeedback : "No AI feedback yet"}
  </p>

  <button
    className="create-button"
    onClick={() => handleAIGrade(student.submissionId)}
    disabled={!student.file}
  >
    Run AI Grader
  </button>
</div>

              <div className="submission-actions">
                <button
                  className="create-button"
                  onClick={() => handleSave(student.studentId)}
                  disabled={!student.file}
                >
                  Save Grade
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default InstructorAssignmentPage