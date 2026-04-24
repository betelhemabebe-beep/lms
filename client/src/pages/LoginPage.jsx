import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import API from "../services/api"
import { useAuth } from "../context/AuthContext"

function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    try {
      const res = await API.post("/auth/login", { email, password })
      login(res.data)

      if (res.data.role === "student") {
        navigate("/student/dashboard")
      } else {
        navigate("/instructor/dashboard")
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed")
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Login</h1>
        <p className="auth-subtitle">Sign in to your account</p>

        {error && <div className="error-box">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="auth-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="auth-button">
            Login
          </button>
        </form>

        <div className="auth-links">
          <Link to="/register/student">Student Sign Up</Link>
          <Link to="/register/instructor">Instructor Sign Up</Link>
          <Link to="/">Back to Home</Link>
        </div>
      </div>
    </div>
  )
}

export default LoginPage