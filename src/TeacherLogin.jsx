import { useState } from 'react'
import './TeacherLogin.css'

function TeacherLogin({ onBack, onLogin }) {
  const [name, setName] = useState('')
  const [subject, setSubject] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!name || !subject || !email || !password) {
      alert('Please fill in all details.')
      return
    }

    onLogin({
      name,
      subject,
      email
    })
  }

  return (
    <div className="teacher-login-page">
      <div className="teacher-login-card">

        <button
          className="teacher-back-btn"
          onClick={onBack}
        >
          ← Back
        </button>

        <div className="teacher-icon">👨‍🏫</div>

        <h1>
          Welcome, <span>Teacher</span>
        </h1>

        <p className="teacher-subtitle">
          Login to help students and answer their questions.
        </p>

        <form onSubmit={handleSubmit}>

          <label>Teacher Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label>Subject</label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            <option value="">Select your subject</option>
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Biology">Biology</option>
            <option value="Mathematics">Mathematics</option>
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
            className="teacher-login-submit"
          >
            Continue to Teacher Dashboard →
          </button>

        </form>

        <p className="teacher-note">
          Teacher access is secure and private.
        </p>

      </div>
    </div>
  )
}

export default TeacherLogin