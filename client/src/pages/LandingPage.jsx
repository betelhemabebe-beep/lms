import { Link } from "react-router-dom"

function LandingPage() {
  return (
    <div className="landing-page">
      <div className="landing-card">
        <h1 className="landing-title">Brightspace Lite</h1>
        <p className="landing-subtitle">
          A simple learning platform for students and instructors
        </p>

        <div className="landing-actions">
          <Link to="/login" className="primary-link">
            Login
          </Link>
          <Link to="/register/student" className="secondary-link">
            Student Sign Up
          </Link>
          <Link to="/register/instructor" className="secondary-link">
            Instructor Sign Up
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LandingPage