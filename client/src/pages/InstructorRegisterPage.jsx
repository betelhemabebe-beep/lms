import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import API from "../services/api"

function InstructorRegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    try {
      await API.post("/auth/register", {
        name,
        email,
        password,
        role: "instructor"
      })

      navigate("/login")
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed")
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Instructor Sign Up</h1>
        <p className="auth-subtitle">Create your instructor account</p>

        {error && <div className="error-box">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

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
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="auth-button">
            Create Instructor Account
          </button>
        </form>

        <div className="auth-links">
          <Link to="/login">Login</Link>
          <Link to="/register/student">Student Sign Up</Link>
          <Link to="/">Back to Home</Link>
        </div>
      </div>
    </div>
  )
}

export default InstructorRegisterPage