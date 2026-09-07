import { useState, useEffect } from 'react'
import './StudentDashboard.css'

function StudentDashboard({
  student,
  questions = [],
  onLogout,
  onAskQuestion
}) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showAnswerPopup, setShowAnswerPopup] = useState(false)
  const [previousAnsweredCount, setPreviousAnsweredCount] = useState(0)

  // =========================
  // STUDY MATERIAL
  // =========================

  const [materials, setMaterials] = useState([])

  // Which subject page is open?
  const [selectedSubject, setSelectedSubject] = useState(null)

  // Load study materials
  const loadMaterials = async () => {
    try {
      const response = await fetch(
        'http://10.44.165.193:5000/api/study-materials'
      )

      if (!response.ok) {
        throw new Error('Failed to load study materials')
      }

      const data = await response.json()

      setMaterials(data)
    } catch (error) {
      console.error(
        'Failed to load study materials:',
        error
      )
    }
  }

  useEffect(() => {
    loadMaterials()

    const interval = setInterval(() => {
      loadMaterials()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Get materials for selected subject
  const getSubjectMaterials = (subject) => {
    return materials.filter(
      (material) =>
        material.subject?.toLowerCase() ===
        subject.toLowerCase()
    )
  }

  // Complete file URL
  const getMaterialUrl = (fileUrl) => {
    return `http://10.44.165.193:5000${fileUrl}`
  }

  // =========================
  // STUDENT QUESTIONS
  // =========================

  const myQuestions = questions.filter(
    (question) =>
      question.studentName === student?.name &&
      question.studentClass === student?.studentClass
  )

  const answeredQuestions = myQuestions.filter(
    (question) => question.answered
  )

  const newAnswerCount = answeredQuestions.length

  const hasNewAnswer = newAnswerCount > 0

  // =========================
  // ANSWER POPUP
  // =========================

  useEffect(() => {
    const currentAnsweredCount = answeredQuestions.length

    if (
      previousAnsweredCount !== 0 &&
      currentAnsweredCount > previousAnsweredCount
    ) {
      setShowAnswerPopup(true)

      const timer = setTimeout(() => {
        setShowAnswerPopup(false)
      }, 3000)

      return () => clearTimeout(timer)
    }

    if (
      currentAnsweredCount !== previousAnsweredCount
    ) {
      setPreviousAnsweredCount(currentAnsweredCount)
    }
  }, [
    answeredQuestions.length,
    previousAnsweredCount
  ])

  // =========================
  // SUBJECT MATERIAL PAGE
  // =========================

  const SubjectMaterialPage = ({
    subject,
    icon,
    description
  }) => {
    const subjectMaterials =
      getSubjectMaterials(subject)

    return (
      <div className="subject-material-page">

        {/* BACK BUTTON */}

        <button
          className="back-to-subjects-btn"
          onClick={() => setSelectedSubject(null)}
        >
          ← Back to Subjects
        </button>

        {/* SUBJECT HEADER */}

        <div className="subject-material-page-header">

          <div className="subject-material-page-icon">
            {icon}
          </div>

          <div>
            <span className="subject-material-page-label">
              STUDY MATERIAL
            </span>

            <h1>
              {subject}
            </h1>

            <p>
              {description}
            </p>
          </div>

        </div>

        {/* MATERIALS */}

        <div className="subject-material-page-content">

          <div className="subject-material-page-title">

            <div>
              <span>
                RESOURCES
              </span>

              <h2>
                {subject} Study Material
              </h2>
            </div>

            <div className="material-count">
              {subjectMaterials.length}{' '}
              {subjectMaterials.length === 1
                ? 'Material'
                : 'Materials'}
            </div>

          </div>

          {subjectMaterials.length > 0 ? (

            <div className="study-material-page-list">

              {subjectMaterials.map((material) => (

                <div
                  className="study-material-page-card"
                  key={material.id}
                >

                  <div className="study-material-page-file-icon">
                    📄
                  </div>

                  <div className="study-material-page-info">

                    <h3>
                      {material.title}
                    </h3>

                    {material.description && (
                      <p>
                        {material.description}
                      </p>
                    )}

                    <div className="study-material-page-meta">

                      <span>
                        👨‍🏫{' '}
                        {material.teacherName ||
                          'Teacher'}
                      </span>

                      <span>
                        🕐 {material.uploadedAt}
                      </span>

                    </div>

                    <div className="study-material-page-filename">
                      📎 {material.fileName}
                    </div>

                  </div>

                  <div className="study-material-page-actions">

                    <a
                      href={getMaterialUrl(
                        material.fileUrl
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="student-view-material-btn"
                    >
                      👁 View
                    </a>

                    <a
                      href={getMaterialUrl(
                        material.fileUrl
                      )}
                      download={material.fileName}
                      className="student-download-material-btn"
                    >
                      ⬇ Download
                    </a>

                  </div>

                </div>

              ))}

            </div>

          ) : (

            <div className="no-study-material-page">

              <div className="no-study-material-icon">
                📚
              </div>

              <h3>
                No study material yet
              </h3>

              <p>
                Your teacher hasn't uploaded any{' '}
                {subject} study material yet.
              </p>

            </div>

          )}

        </div>

      </div>
    )
  }

  // =========================
  // SUBJECT CARD
  // =========================

  const SubjectCard = ({
    subject,
    icon,
    description
  }) => {

    return (
      <div className="dashboard-card">

        <div className="dashboard-card-icon">
          {icon}
        </div>

        <h2>
          {subject}
        </h2>

        <p>
          {description}
        </p>

        <button
          onClick={() => setSelectedSubject({
            subject,
            icon,
            description
          })}
        >
          Explore →
        </button>

      </div>
    )
  }

  // =========================
  // MAIN RETURN
  // =========================

  return (
    <div className="dashboard-page">

      {/* =========================
          ANSWER POPUP
      ========================= */}

      {showAnswerPopup && (
        <div className="answer-notification">

          🔔 New Answer!

          <span>
            Your question has been answered by a teacher.
          </span>

        </div>
      )}

      {/* =========================
          NAVBAR
      ========================= */}

      <nav className="dashboard-navbar">

        <div className="dashboard-logo">
          ✦ Science<span>Connect</span>
        </div>

        <div className="dashboard-nav-right">

          <span className="student-class">
            {student?.studentClass || 'Student'}
          </span>

          {/* NOTIFICATIONS */}

          <div className="student-notification-wrapper">

            <button
              className="student-notification-btn"
              onClick={() =>
                setShowNotifications(
                  !showNotifications
                )
              }
              aria-label="Notifications"
            >
              🔔

              {newAnswerCount > 0 && (
                <span className="student-notification-count">
                  {newAnswerCount}
                </span>
              )}

            </button>

            {showNotifications && (

              <div className="student-notification-panel">

                <div className="student-notification-header">

                  <strong>
                    Notifications
                  </strong>

                  <span>
                    {newAnswerCount} answered
                  </span>

                </div>

                {answeredQuestions.length > 0 ? (

                  <div className="student-notification-list">

                    {answeredQuestions.map((item) => (

                      <div
                        className="student-notification-item"
                        key={item.id}
                        onClick={() => {
                          setShowNotifications(false)
                        }}
                      >

                        <div className="student-notification-icon">
                          ✅
                        </div>

                        <div className="student-notification-content">

                          <strong>
                            Your question was answered!
                          </strong>

                          <p>
                            {item.question}
                          </p>

                          <small>
                            {item.subject}
                            {' • '}
                            {item.teacherName ||
                              'Teacher'}
                          </small>

                        </div>

                      </div>

                    ))}

                  </div>

                ) : (

                  <div className="student-notification-empty">

                    <div>
                      ✓
                    </div>

                    <p>
                      No new answers yet.
                    </p>

                  </div>

                )}

              </div>

            )}

          </div>

          {/* LOGOUT */}

          <button
            className="logout-btn"
            onClick={onLogout}
          >
            Logout
          </button>

        </div>

      </nav>

      {/* =========================
          CONTENT
      ========================= */}

      <main className="dashboard-content">

        {/* =====================================
            IF A SUBJECT IS SELECTED
        ===================================== */}

        {selectedSubject ? (

          <SubjectMaterialPage
            subject={selectedSubject.subject}
            icon={selectedSubject.icon}
            description={selectedSubject.description}
          />

        ) : (

          <>

            {/* =========================
                WELCOME
            ========================= */}

            <div className="welcome-section">

              <div className="student-dashboard-heading">

                <span className="dashboard-label">
                  STUDENT DASHBOARD
                </span>

                {hasNewAnswer && (

                  <span className="new-answer-badge">
                    🔔 Answer Available
                  </span>

                )}

              </div>

              <h1>
                Welcome,{' '}
                <span>
                  {student?.name || 'Student'}
                </span>{' '}
                👋
              </h1>

              <p>
                What would you like to learn today?
              </p>

            </div>

            {/* =========================
                SUBJECTS
            ========================= */}

            <section>

              <div className="dashboard-section-title">

                <span>
                  LEARNING
                </span>

                <h2>
                  Your Subjects
                </h2>

              </div>

              <div className="dashboard-grid">

                <SubjectCard
                  subject="Physics"
                  icon="⚡"
                  description="Mechanics, electricity, waves and the laws of the universe."
                />

                <SubjectCard
                  subject="Chemistry"
                  icon="🧪"
                  description="Atoms, reactions, molecules and the fascinating world of matter."
                />

                <SubjectCard
                  subject="Biology"
                  icon="🧬"
                  description="Cells, genetics, organisms and the science of life."
                />

                <SubjectCard
                  subject="Mathematics"
                  icon="📐"
                  description="Algebra, geometry, calculus and mathematical thinking."
                />

              </div>

            </section>

            {/* =========================
                MY QUESTIONS
            ========================= */}

            <section className="student-questions-section">

              <div className="dashboard-section-title">

                <span>
                  MY QUESTIONS
                </span>

                <h2>
                  Your Questions & Answers
                </h2>

              </div>

              {myQuestions.length > 0 ? (

                <div className="student-question-list">

                  {myQuestions.map((item) => (

                    <div
                      className="student-question-card"
                      key={item.id}
                    >

                      <div className="student-question-header">

                        <span className="student-question-subject">
                          {item.subject}
                        </span>

                        <span
                          className={
                            item.answered
                              ? 'student-question-status answered'
                              : 'student-question-status'
                          }
                        >
                          {item.answered
                            ? '✓ Answered'
                            : '⏳ Waiting'}
                        </span>

                      </div>

                      <h3>
                        {item.question}
                      </h3>

                      <div className="student-question-info">
                        Asked by you •{' '}
                        {item.studentClass}
                      </div>

                      {item.answered ? (

                        <div className="student-teacher-answer">

                          <div className="student-answer-title">
                            👨‍🏫 Teacher's Answer
                          </div>

                          <p>
                            {item.answer}
                          </p>

                          <div className="student-answer-teacher">

                            Answered by{' '}

                            <strong>
                              {item.teacherName ||
                                'Teacher'}
                            </strong>

                          </div>

                          {item.answeredAt && (

                            <div className="student-answer-time">
                              🕐 {item.answeredAt}
                            </div>

                          )}

                        </div>

                      ) : (

                        <div className="student-waiting">

                          ⏳ Your question has been sent
                          to your teacher. You'll see the
                          answer here once they reply.

                        </div>

                      )}

                    </div>

                  ))}

                </div>

              ) : (

                <div className="student-no-questions">

                  <div>
                    💡
                  </div>

                  <h3>
                    No questions yet
                  </h3>

                  <p>
                    Ask your first question and connect
                    with a teacher.
                  </p>

                </div>

              )}

            </section>

            {/* =========================
                ASK QUESTION
            ========================= */}

            <div className="question-card">

              <div>

                <span>
                  HAVE A QUESTION?
                </span>

                <h2>
                  Don't keep your curiosity waiting.
                </h2>

                <p>
                  Ask a subject teacher and get help
                  with your doubts.
                </p>

              </div>

              <button onClick={onAskQuestion}>
                Ask a Question →
              </button>

            </div>

          </>

        )}

      </main>

    </div>
  )
}

export default StudentDashboard