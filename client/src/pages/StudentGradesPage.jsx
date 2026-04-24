import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import API from "../services/api"
import PageHeader from "../components/common/PageHeader"
import CourseTabs from "../components/common/CourseTabs"

function StudentGradesPage() {
  const { courseId } = useParams()
  const [grades, setGrades] = useState([])
  const [courseName, setCourseName] = useState("Course")

  useEffect(() => {
    const loadData = async () => {
      const courseRes = await API.get("/courses")
      const foundCourse = courseRes.data.find((course) => course._id === courseId)

      if (foundCourse) {
        setCourseName(foundCourse.name)
      }

      const gradeRes = await API.get(`/grades/course/${courseId}`)
      setGrades(gradeRes.data)
    }

    loadData()
  }, [courseId])

  return (
    <div className="course-page-shell">
      <PageHeader label="Course" title={courseName} />
      <CourseTabs role="student" courseId={courseId} active="grades" />

      <div className="course-page-content">
        <div className="section-header">
          <h2 className="section-title">Grades</h2>
          <p className="section-subtitle">
            View your assignment results and teacher feedback
          </p>
        </div>

        <div className="grades-table">
          <div className="grades-header">
            <span>Assignment</span>
            <span>Deadline</span>
            <span>Status</span>
            <span>Grade</span>
            <span>Feedback</span>
          </div>

          {grades.length === 0 && (
            <div className="grades-row">
              <span>No grades yet</span>
              <span>-</span>
              <span>-</span>
              <span>-</span>
              <span>-</span>
            </div>
          )}

          {grades.map((item) => (
            <div key={item.assignmentId} className="grades-row">
              <span>{item.title}</span>
              <span>{new Date(item.deadline).toLocaleString()}</span>
              <span>{item.status}</span>
              <span>{item.grade || "-"}</span>
              <span>{item.feedback || "-"}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StudentGradesPage