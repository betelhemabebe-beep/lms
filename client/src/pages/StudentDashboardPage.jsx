import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import API from "../services/api"
import { useAuth } from "../context/AuthContext"

function StudentDashboardPage() {
  const [courses, setCourses] = useState([])
  const [workItems, setWorkItems] = useState([])
  const { user } = useAuth()

  useEffect(() => {
    const loadDashboard = async () => {
      const res = await API.get("/dashboard/student")
      setCourses(res.data.courses || [])
      setWorkItems(res.data.workToDo || [])
    }

    if (user?.token) {
      loadDashboard()
    }
  }, [user])

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1 className="dashboard-title">My Courses</h1>
        <p className="dashboard-subtitle">Welcome back, {user?.name}</p>
      </div>

      <div className="student-dashboard-grid">
        <div className="dashboard-main">
          <div className="course-grid">
            {courses.map((course) => (
              <Link
                key={course._id}
                to={`/student/course/${course._id}`}
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
        </div>

        <div className="dashboard-side">
          <div className="todo-panel">
            <h2 className="todo-title">Work To Do</h2>

            <div className="todo-list">
              {workItems.length === 0 && (
                <div className="todo-item">
                  <h3>No upcoming work</h3>
                  <p>You are caught up for now.</p>
                </div>
              )}

              {workItems.map((item) => (
                <Link
                  key={item.assignmentId}
                  to={`/assignment/${item.assignmentId}`}
                  className="todo-item"
                >
                  <h3>{item.title}</h3>
                  <p>{item.courseName}</p>
                  <span>
                    Due: {new Date(item.deadline).toLocaleDateString()}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboardPage