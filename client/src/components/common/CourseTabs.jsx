import { Link } from "react-router-dom"

function CourseTabs({ role, courseId, active }) {
  if (role === "student") {
    return (
      <div className="course-tabbar">
        <Link
          to={`/student/course/${courseId}`}
          className={`course-tab ${active === "content" ? "active-tab" : ""}`}
        >
          Content
        </Link>

        <Link
          to={`/student/course/${courseId}/discussions`}
          className={`course-tab ${active === "discussions" ? "active-tab" : ""}`}
        >
          Discussions
        </Link>

        <Link
          to={`/student/course/${courseId}/grades`}
          className={`course-tab ${active === "grades" ? "active-tab" : ""}`}
        >
          Grades
        </Link>
      </div>
    )
  }

  return (
    <div className="course-tabbar">
      <Link
        to={`/instructor/course/${courseId}`}
        className={`course-tab ${active === "content" ? "active-tab" : ""}`}
      >
        Content
      </Link>

      <Link
        to={`/instructor/course/${courseId}/assignments`}
        className={`course-tab ${active === "assignments" ? "active-tab" : ""}`}
      >
        Assignments
      </Link>

      <Link
        to={`/instructor/course/${courseId}/discussions`}
        className={`course-tab ${active === "discussions" ? "active-tab" : ""}`}
      >
        Discussions
      </Link>
    </div>
  )
}

export default CourseTabs