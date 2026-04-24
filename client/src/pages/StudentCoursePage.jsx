import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import API from "../services/api"
import PageHeader from "../components/common/PageHeader"
import CourseTabs from "../components/common/CourseTabs"

function StudentCoursePage() {
  const { courseId } = useParams()
  const [modules, setModules] = useState([])
  const [courseName, setCourseName] = useState("Course")

  useEffect(() => {
    const loadData = async () => {
      const coursesRes = await API.get("/courses")
      const foundCourse = coursesRes.data.find((course) => course._id === courseId)

      if (foundCourse) {
        setCourseName(foundCourse.name)
      }

      const modulesRes = await API.get(`/modules/course/${courseId}`)
      setModules(modulesRes.data)
    }

    loadData()
  }, [courseId])

  return (
    <div className="course-page-shell">
      <PageHeader label="Course" title={courseName} />
      <CourseTabs role="student" courseId={courseId} active="content" />

      <div className="course-page-content">
        <div className="section-header">
          <h2 className="section-title">Content</h2>
          <p className="section-subtitle">Open a module to view files and assignments</p>
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
    </div>
  )
}

export default StudentCoursePage