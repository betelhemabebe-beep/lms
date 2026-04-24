import { Link, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import API from "../services/api"
import PageHeader from "../components/common/PageHeader"
import CourseTabs from "../components/common/CourseTabs"

function InstructorAssignmentsPage() {
  const { courseId } = useParams()
  const [assignments, setAssignments] = useState([])
  const [courseName, setCourseName] = useState("Course")

  useEffect(() => {
    const loadAssignments = async () => {
      const courseRes = await API.get("/courses")
      const foundCourse = courseRes.data.find((course) => course._id === courseId)

      if (foundCourse) {
        setCourseName(foundCourse.name)
      }

      const assignmentRes = await API.get(`/assignments/course/${courseId}`)
      setAssignments(assignmentRes.data)
    }

    loadAssignments()
  }, [courseId])

  return (
    <div className="course-page-shell">
      <PageHeader label="Course" title={courseName} />
      <CourseTabs role="instructor" courseId={courseId} active="assignments" />

      <div className="course-page-content">
        <div className="section-header">
          <h2 className="section-title">Assignments</h2>
          <p className="section-subtitle">
            View and manage all assignments in this course
          </p>
        </div>

        <div className="grades-table">
          <div className="grades-header">
            <span>Title</span>
            <span>Module</span>
            <span>Deadline</span>
            <span>Submissions</span>
            <span>Action</span>
          </div>

          {assignments.length === 0 && (
            <div className="grades-row">
              <span>No assignments yet</span>
              <span>-</span>
              <span>-</span>
              <span>-</span>
              <span>-</span>
            </div>
          )}

          {assignments.map((assignment) => (
            <div key={assignment._id} className="grades-row">
              <span>{assignment.title}</span>
              <span>{assignment.module?.title || "-"}</span>
              <span>{new Date(assignment.deadline).toLocaleString()}</span>
              <span>Open to view</span>

              <span>
                <Link
                  to={`/instructor/assignment/${assignment._id}`}
                  className="create-button"
                >
                  Open
                </Link>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default InstructorAssignmentsPage