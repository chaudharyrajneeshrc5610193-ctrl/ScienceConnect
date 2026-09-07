
import './Login.css'

function Login({ onBack, onStudentLogin, onTeacherLogin }) {
  return (
    <div className="login-page">

      <div className="login-card">

        <button
          className="back-btn"
          onClick={onBack}
        >
          ← Back
        </button>

        <div className="login-logo">
          ✦
        </div>

        <h1>
          Welcome to <span>ScienceConnect</span>
        </h1>

        <p className="login-subtitle">
          Connect, learn and explore science together.
        </p>

        <div className="login-options">

          <button
            className="login-option"
            onClick={onStudentLogin}
          >
            <div className="option-icon">
              🎓
            </div>

            <div className="option-text">
              <strong>Student Login</strong>
              <small>
                Ask questions and learn from teachers
              </small>
            </div>

            <span>→</span>
          </button>

          <button
            className="login-option"
            onClick={onTeacherLogin}
          >
            <div className="option-icon">
              👨‍🏫
            </div>

            <div className="option-text">
              <strong>Teacher Login</strong>
              <small>
                Help students and share your knowledge
              </small>
            </div>

            <span>→</span>
          </button>

        </div>

        <div className="login-divider">
          <span>SCIENCECONNECT</span>
        </div>

        <p className="login-footer">
          Built for curious minds • 2026
        </p>

      </div>

    </div>
  )
}

export default Login

