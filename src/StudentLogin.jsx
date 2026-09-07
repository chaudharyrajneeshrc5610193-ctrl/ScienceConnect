import { useState } from 'react'
import './StudentLogin.css'

function StudentLogin({ onBack, onLogin }) {
  const [name, setName] = useState('')
  const [studentClass, setStudentClass] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!name || !studentClass || !email || !password) {
      alert('Please fill in all details.')
      return
    }

    onLogin({
      name,
      studentClass,
      email
    })
  }

  return (
    <div className="student-login-page">
      <div className="student-login-card">

        <button
          className="student-back-btn"
          onClick={onBack}
        >
          ← Back
        </button>

        <div className="student-icon">
          🎓
        </div>

        <h1>
          Welcome, <span>Student</span>
        </h1>

        <p className="student-subtitle">
          Login to connect with your subject teachers.
        </p>

        <form onSubmit={handleSubmit}>

          <label>Student Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label>Class</label>
          <select
            value={studentClass}
            onChange={(e) => setStudentClass(e.target.value)}
          >
            <option value="">Select your class</option>
             <option value="Class 9">Class 9</option>
             <option value="Class 10">Class 10</option>
            <option value="Class 11">Class 11</option>
            <option value="Class 12">Class 12</option>
          </select>

          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="student-login-submit"
          >
            Continue to Dashboard →
          </button>

        </form>

        <p className="student-note">
          Your information is kept secure.
        </p>

      </div>
    </div>
  )
}

export default StudentLogin