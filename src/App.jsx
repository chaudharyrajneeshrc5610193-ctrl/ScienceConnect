import { useState, useEffect } from 'react'
import './App.css'

import Login from './Login'
import StudentLogin from './StudentLogin'
import StudentDashboard from './StudentDashboard'
import AskQuestion from './AskQuestion'
import TeacherLogin from './TeacherLogin'
import TeacherDashboard from './TeacherDashboard'

function App() {

  // =========================
  // STATE
  // =========================

  const [page, setPage] = useState('home')
  const [student, setStudent] = useState(null)
  const [teacher, setTeacher] = useState(null)
  const [questions, setQuestions] = useState([])
  const [successMessage, setSuccessMessage] = useState('')

  // =========================
  // STUDY MATERIAL STATE
  // =========================

  const [materials, setMaterials] = useState([])
  const [selectedHomeSubject, setSelectedHomeSubject] = useState(null)

  // =========================
  // LOAD QUESTIONS
  // =========================

  useEffect(() => {

    const loadQuestions = () => {

      fetch(
        'http://10.44.165.193:5000/api/questions'
      )
        .then((response) => {

          if (!response.ok) {
            throw new Error(
              'Failed to load questions'
            )
          }

          return response.json()
        })

        .then((data) => {
          setQuestions(data)
        })

        .catch((error) => {

          console.error(
            'Failed to load questions:',
            error
          )

        })

    }

    loadQuestions()

    const interval = setInterval(
      loadQuestions,
      3000
    )

    return () =>
      clearInterval(interval)

  }, [])

  // =========================
  // LOAD STUDY MATERIALS
  // =========================

  useEffect(() => {

    const loadMaterials = () => {

      fetch(
        'http://10.44.165.193:5000/api/study-materials'
      )
        .then((response) => {

          if (!response.ok) {
            throw new Error(
              'Failed to load study materials'
            )
          }

          return response.json()
        })

        .then((data) => {

          setMaterials(data)

        })

        .catch((error) => {

          console.error(
            'Failed to load study materials:',
            error
          )

        })

    }

    loadMaterials()

    const interval = setInterval(
      loadMaterials,
      5000
    )

    return () =>
      clearInterval(interval)

  }, [])

  // =========================
  // BACKEND CONNECTION TEST
  // =========================

  useEffect(() => {

    fetch(
      'http://10.44.165.193:5000/api/test'
    )

      .then((response) => {

        if (!response.ok) {
          throw new Error(
            'Backend request failed'
          )
        }

        return response.json()

      })

      .then((data) => {

        console.log(data.message)

      })

      .catch((error) => {

        console.error(
          'Backend connection failed:',
          error
        )

      })

  }, [])

  // =========================
  // SUCCESS POPUP
  // =========================

  const showSuccessMessage = (message) => {

    setSuccessMessage(message)

    setTimeout(() => {

      setSuccessMessage('')

    }, 2000)

  }

  // =========================
  // HOME STUDY MATERIAL PAGE
  // =========================

  if (selectedHomeSubject) {

    const subjectMaterials =
      materials.filter(
        (material) =>
          material.subject?.toLowerCase() ===
          selectedHomeSubject.subject.toLowerCase()
      )

    const getMaterialUrl = (fileUrl) => {

      return `http://10.44.165.193:5000${fileUrl}`

    }

    return (

      <div className="app">

        {/* =========================
            NAVBAR
        ========================= */}

        <nav className="navbar">

          <div className="logo">

            <div className="logo-icon">
              ✦
            </div>

            Science

            <span className="logo-highlight">
              Connect
            </span>

          </div>

          <div className="nav-links">

            <a
              href="#"
              onClick={(e) => {

                e.preventDefault()

                setSelectedHomeSubject(null)

              }}
            >
              Home
            </a>

            <a
              href="#"
              onClick={(e) => {

                e.preventDefault()

                setSelectedHomeSubject(null)

                setTimeout(() => {

                  document
                    .getElementById('subjects')
                    ?.scrollIntoView({
                      behavior: 'smooth'
                    })

                }, 50)

              }}
            >
              Subjects
            </a>

            <a
              href="#"
              onClick={(e) => {

                e.preventDefault()

                setSelectedHomeSubject(null)

                setTimeout(() => {

                  document
                    .getElementById('teachers')
                    ?.scrollIntoView({
                      behavior: 'smooth'
                    })

                }, 50)

              }}
            >
              Teachers
            </a>

            <a
              href="#"
              onClick={(e) => {

                e.preventDefault()

                setSelectedHomeSubject(null)

                setTimeout(() => {

                  document
                    .getElementById('about')
                    ?.scrollIntoView({
                      behavior: 'smooth'
                    })

                }, 50)

              }}
            >
              About
            </a>

          </div>

          <button
            className="login-btn"
            onClick={() => setPage('login')}
          >
            Login →
          </button>

        </nav>

        {/* =========================
            STUDY MATERIAL CONTENT
        ========================= */}

        <main className="home-study-material-page">

          {/* BACK */}

          <button
            className="home-back-btn"
            onClick={() =>
              setSelectedHomeSubject(null)
            }
          >
            ← Back to Subjects
          </button>

          {/* SUBJECT HEADER */}

          <div className="home-study-header">

            <div className="home-study-icon">
              {selectedHomeSubject.icon}
            </div>

            <div>

              <span>
                STUDY MATERIAL
              </span>

              <h1>
                {selectedHomeSubject.subject}
              </h1>

              <p>
                {selectedHomeSubject.description}
              </p>

            </div>

          </div>

          {/* MATERIAL TITLE */}

          <div className="home-study-title">

            <div>

              <span>
                RESOURCES
              </span>

              <h2>
                {selectedHomeSubject.subject}{' '}
                Study Material
              </h2>

            </div>

            <div className="home-material-count">

              {subjectMaterials.length}{' '}

              {subjectMaterials.length === 1
                ? 'Material'
                : 'Materials'}

            </div>

          </div>

          {/* MATERIAL LIST */}

          {subjectMaterials.length > 0 ? (

            <div className="home-material-list">

              {subjectMaterials.map(
                (material) => (

                  <div
                    className="home-material-card"
                    key={material.id}
                  >

                    {/* FILE ICON */}

                    <div className="home-material-file-icon">
                      📄
                    </div>

                    {/* INFORMATION */}

                    <div className="home-material-info">

                      <h3>
                        {material.title}
                      </h3>

                      {material.description && (

                        <p>
                          {material.description}
                        </p>

                      )}

                      <div className="home-material-meta">

                        <span>
                          👨‍🏫{' '}
                          {material.teacherName ||
                            'Teacher'}
                        </span>

                        <span>
                          🕐{' '}
                          {material.uploadedAt}
                        </span>

                      </div>

                      <small>
                        📎 {material.fileName}
                      </small>

                    </div>

                    {/* ACTIONS */}

                    <div className="home-material-actions">

                      <a
                        href={getMaterialUrl(
                          material.fileUrl
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        👁 View
                      </a>

                      <a
                        href={getMaterialUrl(
                          material.fileUrl
                        )}
                        download={
                          material.fileName
                        }
                      >
                        ⬇ Download
                      </a>

                    </div>

                  </div>

                )
              )}

            </div>

          ) : (

            /* NO MATERIAL */

            <div className="home-no-material">

              <div>
                📚
              </div>

              <h3>
                No study material yet
              </h3>

              <p>
                No{' '}
                {selectedHomeSubject.subject}{' '}
                study material has been uploaded yet.
              </p>

            </div>

          )}

        </main>

      </div>

    )

  }

  // =========================
  // LOGIN PAGE
  // =========================

  if (page === 'login') {

    return (

      <Login

        onBack={() =>
          setPage('home')
        }

        onStudentLogin={() =>
          setPage('student')
        }

        onTeacherLogin={() =>
          setPage('teacher')
        }

      />

    )

  }

  // =========================
  // TEACHER LOGIN
  // =========================

  if (page === 'teacher') {

    return (

      <TeacherLogin

        onBack={() =>
          setPage('login')
        }

        onLogin={(teacherData) => {

          setTeacher(teacherData)

          setPage(
            'teacher-dashboard'
          )

        }}

      />

    )

  }

  // =========================
  // TEACHER DASHBOARD
  // =========================

  if (page === 'teacher-dashboard') {

    return (

      <div className="dashboard-page-wrapper">

        {/* SUCCESS POPUP */}

        {successMessage && (

          <div className="success-popup">

            ✓ {successMessage}

          </div>

        )}

        <TeacherDashboard

          teacher={teacher}

          questions={questions}

          onAnswerQuestion={
            (questionId, answer) => {

              setQuestions(
                (previousQuestions) =>
                  previousQuestions.map(
                    (question) =>
                      question.id ===
                      questionId
                        ? {
                            ...question,

                            answer:
                              answer,

                            answered:
                              true,

                            teacherName:
                              teacher?.name ||
                              'Teacher',

                            answeredAt:
                              new Date()
                                .toLocaleString()
                          }

                        : question
                  )
              )

              showSuccessMessage(
                'Answer submitted successfully! 🎉'
              )

            }
          }

          onLogout={() => {

            setTeacher(null)

            setPage('home')

          }}

        />

      </div>

    )

  }

  // =========================
  // STUDENT LOGIN
  // =========================

  if (page === 'student') {

    return (

      <StudentLogin

        onBack={() =>
          setPage('login')
        }

        onLogin={(studentData) => {

          setStudent(studentData)

          setPage('dashboard')

        }}

      />

    )

  }

  // =========================
  // STUDENT DASHBOARD
  // =========================

  if (page === 'dashboard') {

    return (

      <div className="dashboard-page-wrapper">

        {/* SUCCESS POPUP */}

        {successMessage && (

          <div className="success-popup">

            ✓ {successMessage}

          </div>

        )}

        <StudentDashboard

          student={student}

          questions={questions}

          onAskQuestion={() =>
            setPage('ask-question')
          }

          onLogout={() => {

            setStudent(null)

            setPage('home')

          }}

        />

      </div>

    )

  }

  // =========================
  // ASK QUESTION
  // =========================

  if (page === 'ask-question') {

    return (

      <div className="dashboard-page-wrapper">

        {/* SUCCESS POPUP */}

        {successMessage && (

          <div className="success-popup">

            ✓ {successMessage}

          </div>

        )}

        <AskQuestion

          onBack={() =>
            setPage('dashboard')
          }

          onSubmitQuestion={
            async (questionData) => {

              const newQuestion = {

                studentName:
                  student?.name ||
                  'Student',

                studentClass:
                  student?.studentClass ||
                  '',

                subject:
                  questionData.subject,

                question:
                  questionData.question,

                answer: '',

                answered: false,

                teacherName: '',

                askedAt:
                  new Date()
                    .toLocaleString(),

                answeredAt: ''

              }

              try {

                const response =
                  await fetch(
                    'http://10.44.165.193:5000/api/questions',
                    {
                      method: 'POST',

                      headers: {
                        'Content-Type':
                          'application/json'
                      },

                      body:
                        JSON.stringify(
                          newQuestion
                        )
                    }
                  )

                if (!response.ok) {

                  throw new Error(
                    'Failed to submit question'
                  )

                }

                const savedQuestion =
                  await response.json()

                setQuestions(
                  (previousQuestions) => [
                    ...previousQuestions,
                    savedQuestion
                  ]
                )

                showSuccessMessage(
                  'Question submitted successfully! 🎉'
                )

                setPage('dashboard')

              } catch (error) {

                console.error(
                  'Question submission failed:',
                  error
                )

                alert(
                  'Failed to submit question. Please try again.'
                )

              }

            }
          }

        />

      </div>

    )

  }

  // =========================
  // HOME PAGE
  // =========================

  return (

    <div className="app">

      {/* =========================
          NAVBAR
      ========================= */}

      <nav className="navbar">

        <div className="logo">

          <div className="logo-icon">
            ✦
          </div>

          Science

          <span className="logo-highlight">
            Connect
          </span>

        </div>

        <div className="nav-links">

          <a href="#subjects">
            Subjects
          </a>

          <a href="#teachers">
            Teachers
          </a>

          <a href="#about">
            About
          </a>

        </div>

        <button
          className="login-btn"
          onClick={() => setPage('login')}
        >
          Login →
        </button>

      </nav>

      {/* =========================
          HERO SECTION
      ========================= */}

      <main className="hero">

        <div className="hero-content">

          <span className="badge">
            SCIENCE • CONNECT • EXPLORE
          </span>

          <h1>

            Where Curiosity

            <br />

            Meets <span>Knowledge.</span>

          </h1>

          <p className="hero-description">

            Connect with subject teachers,
            ask questions, clear your doubts
            and explore the world of science.

          </p>

          <div className="hero-buttons">

            <button
              className="primary-btn"
              onClick={() =>
                setPage('login')
              }
            >
              Start Learning →
            </button>

            <button
              className="outline-btn"
              onClick={() =>
                document
                  .getElementById(
                    'subjects'
                  )
                  ?.scrollIntoView({
                    behavior: 'smooth'
                  })
              }
            >
              Explore Subjects
            </button>

          </div>

          <div className="stats">

            <div>

              <strong>
                4+
              </strong>

              <span>
                Subjects
              </span>

            </div>

            <div>

              <strong>
                10+
              </strong>

              <span>
                Teachers
              </span>

            </div>

            <div>

              <strong>
                24/7
              </strong>

              <span>
                Learning
              </span>

            </div>

          </div>

        </div>

        {/* =========================
            SCIENCE VISUAL
        ========================= */}

        <div className="science-visual">

          <div className="lab-glow"></div>

          <div className="science-orbit orbit-one"></div>

          <div className="science-orbit orbit-two"></div>

          <div className="atom">

            <div className="atom-nucleus">
              ⚛
            </div>

            <div className="electron electron-one"></div>

            <div className="electron electron-two"></div>

            <div className="electron electron-three"></div>

          </div>

          <div className="microscope">

            <div className="microscope-head"></div>

            <div className="microscope-neck"></div>

            <div className="microscope-base"></div>

            <div className="microscope-lens"></div>

          </div>

          <div className="flask">

            <div className="flask-neck"></div>

            <div className="flask-body">

              <div className="liquid"></div>

              <div className="bubble bubble-one"></div>

              <div className="bubble bubble-two"></div>

              <div className="bubble bubble-three"></div>

            </div>

          </div>

          <div className="test-tubes">

            <div className="test-tube tube-one">
              <span></span>
            </div>

            <div className="test-tube tube-two">
              <span></span>
            </div>

            <div className="test-tube tube-three">
              <span></span>
            </div>

          </div>

          <div className="dna">

            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>

          </div>

          <div className="science-label label-physics">
            ⚛ Physics
          </div>

          <div className="science-label label-chemistry">
            🧪 Chemistry
          </div>

          <div className="science-label label-biology">
            🧬 Biology
          </div>

          <div className="science-label label-mathematics">
            ∑ Mathematics
          </div>

        </div>

      </main>

      {/* =========================
          SUBJECTS
      ========================= */}

      <section
        className="section"
        id="subjects"
      >

        <div className="section-heading">

          <span>
            EXPLORE
          </span>

          <h2>
            Science Subjects
          </h2>

          <p>
            Learn from experienced teachers
            across your favourite science subjects.
          </p>

        </div>

        <div className="subject-grid">

          {/* PHYSICS */}

          <div className="subject-card physics">

            <div className="subject-number">
              01
            </div>

            <div className="subject-icon">
              ⚛
            </div>

            <h3>
              Physics
            </h3>

            <p>
              Understand motion, forces, energy
              and the laws governing our universe.
            </p>

            <button
              onClick={() =>
                setSelectedHomeSubject({
                  subject: 'Physics',
                  icon: '⚛',
                  description:
                    'Understand motion, forces, energy and the laws governing our universe.'
                })
              }
            >
              Explore →
            </button>

          </div>

          {/* CHEMISTRY */}

          <div className="subject-card chemistry">

            <div className="subject-number">
              02
            </div>

            <div className="subject-icon">
              🧪
            </div>

            <h3>
              Chemistry
            </h3>

            <p>
              Discover atoms, reactions, molecules
              and the chemistry around us.
            </p>

            <button
              onClick={() =>
                setSelectedHomeSubject({
                  subject: 'Chemistry',
                  icon: '🧪',
                  description:
                    'Discover atoms, reactions, molecules and the chemistry around us.'
                })
              }
            >
              Explore →
            </button>

          </div>

          {/* BIOLOGY */}

          <div className="subject-card biology">

            <div className="subject-number">
              03
            </div>

            <div className="subject-icon">
              🧬
            </div>

            <h3>
              Biology
            </h3>

            <p>
              Explore life, cells, organisms and
              the amazing world of living things.
            </p>

            <button
              onClick={() =>
                setSelectedHomeSubject({
                  subject: 'Biology',
                  icon: '🧬',
                  description:
                    'Explore life, cells, organisms and the amazing world of living things.'
                })
              }
            >
              Explore →
            </button>

          </div>

          {/* MATHEMATICS */}

          <div className="subject-card mathematics">

            <div className="subject-number">
              04
            </div>

            <div className="subject-icon">
              ∑
            </div>

            <h3>
              Mathematics
            </h3>

            <p>
              Master numbers, equations, calculus
              and mathematical problem solving.
            </p>

            <button
              onClick={() =>
                setSelectedHomeSubject({
                  subject: 'Mathematics',
                  icon: '∑',
                  description:
                    'Master numbers, equations, calculus and mathematical problem solving.'
                })
              }
            >
              Explore →
            </button>

          </div>

        </div>

      </section>

      {/* =========================
          TEACHERS
      ========================= */}

      <section
        className="section teachers-section"
        id="teachers"
      >

        <div className="section-heading">

          <span>
            MEET
          </span>

          <h2>
            Your Subject Teachers
          </h2>

          <p>
            Connect with teachers and get your
            doubts solved whenever you need help.
          </p>

        </div>

        <div className="teacher-grid">

          {/* PHYSICS */}

          <div className="teacher-card">

            <div className="teacher-top">

              <div className="teacher-avatar">
                P
              </div>

              <span className="online">
                ● Online
              </span>

            </div>

            <h3>
              Physics Teacher
            </h3>

            <p>
              Physics • Mechanics • Electricity
            </p>

            <button
              onClick={() =>
                setPage('login')
              }
            >
              Ask a Question →
            </button>

          </div>

          {/* CHEMISTRY */}

          <div className="teacher-card">

            <div className="teacher-top">

              <div className="teacher-avatar">
                C
              </div>

              <span className="online">
                ● Online
              </span>

            </div>

            <h3>
              Chemistry Teacher
            </h3>

            <p>
              Chemistry • Organic • Inorganic
            </p>

            <button
              onClick={() =>
                setPage('login')
              }
            >
              Ask a Question →
            </button>

          </div>

          {/* BIOLOGY */}

          <div className="teacher-card">

            <div className="teacher-top">

              <div className="teacher-avatar">
                B
              </div>

              <span className="online">
                ● Online
              </span>

            </div>

            <h3>
              Biology Teacher
            </h3>

            <p>
              Biology • Genetics • Human Biology
            </p>

            <button
              onClick={() =>
                setPage('login')
              }
            >
              Ask a Question →
            </button>

          </div>

          {/* MATHEMATICS */}

          <div className="teacher-card">

            <div className="teacher-top">

              <div className="teacher-avatar">
                M
              </div>

              <span className="online">
                ● Online
              </span>

            </div>

            <h3>
              Mathematics Teacher
            </h3>

            <p>
              Mathematics • Algebra • Calculus
            </p>

            <button
              onClick={() =>
                setPage('login')
              }
            >
              Ask a Question →
            </button>

          </div>

        </div>

      </section>

      {/* =========================
          ABOUT
      ========================= */}

      <section
        className="about-section"
        id="about"
      >

        <div className="about-content">

          <span className="about-label">
            WHY SCIENCECONNECT?
          </span>

          <h2>

            Learning becomes better

            <br />

            when curiosity is{' '}

            <span>
              connected.
            </span>

          </h2>

          <p>

            ScienceConnect brings students and
            subject teachers together in one place.
            Ask questions, clear doubts and learn
            beyond the classroom.

          </p>

          <div className="about-points">

            <div className="about-point">

              <span>
                ✓
              </span>

              <p>
                Ask subject-specific questions
              </p>

            </div>

            <div className="about-point">

              <span>
                ✓
              </span>

              <p>
                Connect with teachers
              </p>

            </div>

            <div className="about-point">

              <span>
                ✓
              </span>

              <p>
                Learn at your own pace
              </p>

            </div>

            <div className="about-point">

              <span>
                ✓
              </span>

              <p>
                Explore science beyond textbooks
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* =========================
          QUOTE
      ========================= */}

      <section className="section quote-section">

        <div className="quote-card">

          <div className="quote-mark">
            “
          </div>

          <p>
            The important thing is to never stop questioning.
          </p>

          <span>
            — Albert Einstein
          </span>

        </div>

      </section>

      {/* =========================
          FOOTER
      ========================= */}

      <footer className="site-footer">

        <div className="footer-logo">

          ✦ Science

          <span>
            Connect
          </span>

        </div>

        <p>
          Connecting curious minds with the world of science.
        </p>

        <div className="footer-line"></div>

        <small>
          SCIENCECONNECT • Built for curious minds • 2026
        </small>

      </footer>

    </div>
  )
}

export default App