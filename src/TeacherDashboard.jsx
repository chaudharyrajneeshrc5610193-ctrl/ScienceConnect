import { useState, useEffect } from 'react'
import './TeacherDashboard.css'

function TeacherDashboard({
  teacher,
  questions = [],
  onAnswerQuestion,
  onLogout
}) {
  const [answerText, setAnswerText] = useState({})
  const [openAnswer, setOpenAnswer] = useState(null)
  const [showNotifications, setShowNotifications] = useState(false)

  // =========================
  // NEW QUESTION POPUP
  // =========================

  const [showNewQuestionPopup, setShowNewQuestionPopup] = useState(false)
  const [previousQuestionCount, setPreviousQuestionCount] = useState(0)

  // =========================
  // STUDY MATERIAL
  // =========================

  const [showMaterialForm, setShowMaterialForm] = useState(false)
  const [materials, setMaterials] = useState([])
  const [materialTitle, setMaterialTitle] = useState('')
  const [materialDescription, setMaterialDescription] = useState('')
  const [materialSubject, setMaterialSubject] = useState(
    teacher?.subject || ''
  )
  const [materialFile, setMaterialFile] = useState(null)
  const [uploadingMaterial, setUploadingMaterial] = useState(false)

  // =========================
  // QUESTIONS
  // =========================

  const teacherQuestions = questions.filter((item) => {
    if (!teacher?.subject) return true
    return item.subject === teacher.subject
  })

  const newQuestions = teacherQuestions.filter(
    (item) => !item.answered
  )

  const newQuestionCount = newQuestions.length

  useEffect(() => {
    if (
      newQuestionCount > previousQuestionCount &&
      previousQuestionCount !== 0
    ) {
      setShowNewQuestionPopup(true)

      const timer = setTimeout(() => {
        setShowNewQuestionPopup(false)
      }, 3000)

      return () => clearTimeout(timer)
    }

    setPreviousQuestionCount(newQuestionCount)
  }, [newQuestionCount, previousQuestionCount])

  const answeredQuestions = teacherQuestions.filter(
    (item) => item.answered
  ).length

  // =========================
  // LOAD STUDY MATERIALS
  // =========================

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
  }, [])

  // =========================
  // ANSWER QUESTION
  // =========================

  const handleAnswer = async (questionId) => {
    const answer = answerText[questionId]?.trim()

    if (!answer) {
      alert('Please write an answer first.')
      return
    }

    try {
      const response = await fetch(
        `http://10.44.165.193:5000/api/questions/${questionId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            answer: answer,
            teacherName: teacher?.name || 'Teacher'
          })
        }
      )

      if (!response.ok) {
        throw new Error('Failed to submit answer')
      }

      const updatedQuestion = await response.json()

      onAnswerQuestion(
        updatedQuestion.id,
        updatedQuestion.answer
      )

      setAnswerText((previous) => ({
        ...previous,
        [questionId]: ''
      }))

      setOpenAnswer(null)

    } catch (error) {
      console.error(
        'Answer submission failed:',
        error
      )

      alert(
        'Failed to submit answer. Please try again.'
      )
    }
  }

  // =========================
  // UPLOAD STUDY MATERIAL
  // =========================

  const handleMaterialUpload = async (e) => {
    e.preventDefault()

    if (!materialTitle.trim()) {
      alert('Please enter a material title.')
      return
    }

    if (!materialSubject) {
      alert('Please select a subject.')
      return
    }

    if (!materialFile) {
      alert('Please select a file.')
      return
    }

    setUploadingMaterial(true)

    try {
      const formData = new FormData()

      formData.append(
        'title',
        materialTitle.trim()
      )

      formData.append(
        'description',
        materialDescription.trim()
      )

      formData.append(
        'subject',
        materialSubject
      )

      formData.append(
        'teacherName',
        teacher?.name || 'Teacher'
      )

      formData.append(
        'file',
        materialFile
      )

      const response = await fetch(
        'http://10.44.165.193:5000/api/study-materials',
        {
          method: 'POST',
          body: formData
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to upload material'
        )
      }

      alert('Study material uploaded successfully! 📚')

      setMaterialTitle('')
      setMaterialDescription('')
      setMaterialSubject(teacher?.subject || '')
      setMaterialFile(null)

      const fileInput =
        document.getElementById('study-material-file')

      if (fileInput) {
        fileInput.value = ''
      }

      setShowMaterialForm(false)

      loadMaterials()

    } catch (error) {
      console.error(
        'Study material upload failed:',
        error
      )

      alert(
        error.message ||
        'Failed to upload study material. Please try again.'
      )

    } finally {
      setUploadingMaterial(false)
    }
  }

  // =========================
  // DELETE STUDY MATERIAL
  // =========================

  const handleDeleteMaterial = async (materialId) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this study material?'
    )

    if (!confirmDelete) {
      return
    }

    try {
      const response = await fetch(
        `http://10.44.165.193:5000/api/study-materials/${materialId}`,
        {
          method: 'DELETE'
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to delete material'
        )
      }

      setMaterials((previous) =>
        previous.filter(
          (material) => material.id !== materialId
        )
      )

    } catch (error) {
      console.error(
        'Delete material failed:',
        error
      )

      alert(
        error.message ||
        'Failed to delete study material.'
      )
    }
  }

  // =========================
  // FILE SELECTION
  // =========================

  const handleFileChange = (e) => {
    const file = e.target.files[0]

    if (!file) {
      setMaterialFile(null)
      return
    }

    const allowedExtensions = [
      '.pdf',
      '.jpg',
      '.jpeg',
      '.png',
      '.doc',
      '.docx',
      '.ppt',
      '.pptx'
    ]

    const fileName = file.name.toLowerCase()

    const isAllowed = allowedExtensions.some(
      (extension) =>
        fileName.endsWith(extension)
    )

    if (!isAllowed) {
      alert(
        'Only PDF, JPG, PNG, DOC, DOCX, PPT and PPTX files are allowed.'
      )

      e.target.value = ''
      setMaterialFile(null)
      return
    }

    // 20 MB limit
    if (file.size > 20 * 1024 * 1024) {
      alert(
        'File size must be less than 20 MB.'
      )

      e.target.value = ''
      setMaterialFile(null)
      return
    }

    setMaterialFile(file)
  }

  // =========================
  // FILE URL
  // =========================

  const getMaterialUrl = (fileUrl) => {
    return `http://10.44.165.193:5000${fileUrl}`
  }

  return (
    <div className="teacher-dashboard">

      {/* =========================
          NEW QUESTION POPUP
      ========================= */}

      {showNewQuestionPopup && (
        <div className="new-question-notification">
          🔔 New Question!

          <span>
            A student has asked a new question.
          </span>
        </div>
      )}

      {/* =========================
          HEADER
      ========================= */}

      <header className="teacher-dashboard-header">

        <div className="teacher-dashboard-logo">
          ✦ Science<span>Connect</span>
        </div>

        <div className="teacher-header-actions">

          {/* NOTIFICATION */}

          <div className="notification-wrapper">

            <button
              className="notification-btn"
              onClick={() =>
                setShowNotifications(!showNotifications)
              }
            >
              🔔

              {newQuestionCount > 0 && (
                <span className="notification-count">
                  {newQuestionCount}
                </span>
              )}
            </button>

            {showNotifications && (

              <div className="notification-panel">

                <div className="notification-panel-header">

                  <strong>
                    Notifications
                  </strong>

                  <span>
                    {newQuestionCount} new
                  </span>

                </div>

                {newQuestions.length > 0 ? (

                  <div className="notification-list">

                    {newQuestions.map((item) => (

                      <div
                        className="notification-item"
                        key={item.id}
                        onClick={() => {
                          setShowNotifications(false)
                          setOpenAnswer(item.id)
                        }}
                      >

                        <div className="notification-icon">
                          ❓
                        </div>

                        <div className="notification-content">

                          <strong>
                            New question from {item.studentName}
                          </strong>

                          <p>
                            {item.question}
                          </p>

                          <small>
                            {item.subject}

                            {item.studentClass
                              ? ` • ${item.studentClass}`
                              : ''}
                          </small>

                        </div>

                      </div>

                    ))}

                  </div>

                ) : (

                  <div className="notification-empty">

                    <div>
                      ✓
                    </div>

                    <p>
                      You're all caught up!
                    </p>

                  </div>

                )}

              </div>

            )}

          </div>

          {/* LOGOUT */}

          <button
            className="teacher-logout-btn"
            onClick={onLogout}
          >
            Logout
          </button>

        </div>

      </header>

      <main className="teacher-dashboard-main">

        {/* =========================
            WELCOME
        ========================= */}

        <section className="teacher-welcome">

          <div>

            <span className="teacher-dashboard-label">
              TEACHER DASHBOARD
            </span>

            <h1>
              Welcome, <span>{teacher?.name || 'Teacher'}</span> 👋
            </h1>

            <p>
              Help students, answer questions and make learning better.
            </p>

          </div>

          <div className="teacher-profile">

            <div className="teacher-profile-icon">
              👨‍🏫
            </div>

            <div>

              <strong>
                {teacher?.name || 'Teacher'}
              </strong>

              <span>
                {teacher?.subject || 'Science Teacher'}
              </span>

              <small>
                ● Online
              </small>

            </div>

          </div>

        </section>

        {/* =========================
            STATS
        ========================= */}

        <section className="teacher-stats">

          <div className="teacher-stat-card">

            <div className="stat-icon">
              ❓
            </div>

            <div>
              <strong>
                {newQuestionCount}
              </strong>

              <span>
                New Questions
              </span>
            </div>

          </div>

          <div className="teacher-stat-card">

            <div className="stat-icon">
              💬
            </div>

            <div>
              <strong>
                {answeredQuestions}
              </strong>

              <span>
                Answered
              </span>
            </div>

          </div>

          <div className="teacher-stat-card">

            <div className="stat-icon">
              👨‍🎓
            </div>

            <div>
              <strong>
                {answeredQuestions}
              </strong>

              <span>
                Students Helped
              </span>
            </div>

          </div>

        </section>

        {/* ==================================================
            STUDY MATERIAL SECTION
        ================================================== */}

        <section className="teacher-material-section">

          <div className="teacher-section-heading">

            <div>

              <span>
                STUDY MATERIAL
              </span>

              <h2>
                Share Learning Material
              </h2>

            </div>

            <button
              className="upload-material-btn"
              onClick={() =>
                setShowMaterialForm(!showMaterialForm)
              }
            >
              {showMaterialForm
                ? '✕ Close'
                : '📚 Upload Material'}
            </button>

          </div>

          {/* UPLOAD FORM */}

          {showMaterialForm && (

            <form
              className="study-material-form"
              onSubmit={handleMaterialUpload}
            >

              <div className="material-form-row">

                <div className="material-form-group">

                  <label>
                    Material Title
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. Laws of Motion Notes"
                    value={materialTitle}
                    onChange={(e) =>
                      setMaterialTitle(e.target.value)
                    }
                  />

                </div>

                <div className="material-form-group">

                  <label>
                    Subject
                  </label>

                  <select
                    value={materialSubject}
                    onChange={(e) =>
                      setMaterialSubject(e.target.value)
                    }
                  >

                    <option value="">
                      Select Subject
                    </option>

                    <option value="Physics">
                      Physics
                    </option>

                    <option value="Chemistry">
                      Chemistry
                    </option>

                    <option value="Biology">
                      Biology
                    </option>

                    <option value="Mathematics">
                      Mathematics
                    </option>

                  </select>

                </div>

              </div>

              <div className="material-form-group">

                <label>
                  Description
                </label>

                <textarea
                  rows="3"
                  placeholder="Write a short description..."
                  value={materialDescription}
                  onChange={(e) =>
                    setMaterialDescription(e.target.value)
                  }
                />

              </div>

              <div className="material-form-group">

                <label>
                  Select File
                </label>

                <input
                  id="study-material-file"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.ppt,.pptx"
                  onChange={handleFileChange}
                />

                <small className="material-file-help">
                  PDF, JPG, PNG, DOC, DOCX, PPT or PPTX • Maximum 20 MB
                </small>

              </div>

              {materialFile && (

                <div className="selected-material-file">

                  📎 <strong>
                    {materialFile.name}
                  </strong>

                  <span>
                    {(materialFile.size / 1024 / 1024).toFixed(2)} MB
                  </span>

                </div>

              )}

              <button
                type="submit"
                className="submit-material-btn"
                disabled={uploadingMaterial}
              >
                {uploadingMaterial
                  ? '⏳ Uploading...'
                  : '📤 Upload Study Material'}
              </button>

            </form>

          )}

          {/* MATERIAL LIST */}

          <div className="teacher-material-list">

            {materials.length > 0 ? (

              materials.map((material) => (

                <div
                  className="teacher-material-card"
                  key={material.id}
                >

                  <div className="material-icon">
                    📚
                  </div>

                  <div className="material-details">

                    <div className="material-card-top">

                      <span className="material-subject">
                        {material.subject}
                      </span>

                      <span className="material-date">
                        {material.uploadedAt}
                      </span>

                    </div>

                    <h3>
                      {material.title}
                    </h3>

                    {material.description && (

                      <p>
                        {material.description}
                      </p>

                    )}

                    <div className="material-file-name">
                      📎 {material.fileName}
                    </div>

                    <div className="material-card-actions">

                      <a
                        href={getMaterialUrl(material.fileUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="view-material-btn"
                      >
                        👁️ View
                      </a>

                      <a
                        href={getMaterialUrl(material.fileUrl)}
                        download
                        className="download-material-btn"
                      >
                        ⬇️ Download
                      </a>

                      <button
                        className="delete-material-btn"
                        onClick={() =>
                          handleDeleteMaterial(material.id)
                        }
                      >
                        🗑️ Delete
                      </button>

                    </div>

                  </div>

                </div>

              ))

            ) : (

              <div className="teacher-material-empty">

                <div>
                  📚
                </div>

                <h3>
                  No study material uploaded yet
                </h3>

                <p>
                  Upload notes, presentations, worksheets
                  and other learning resources for students.
                </p>

              </div>

            )}

          </div>

        </section>

        {/* ==================================================
            QUESTIONS
        ================================================== */}

        <section className="teacher-questions-section">

          <div className="teacher-section-heading">

            <div>

              <span>
                STUDENT QUESTIONS
              </span>

              <h2>
                Questions Waiting for You
              </h2>

            </div>

            <div className="question-count">
              {teacherQuestions.length} Questions
            </div>

          </div>

          {teacherQuestions.length > 0 ? (

            <div className="teacher-question-list">

              {teacherQuestions.map((item) => (

                <div
                  className="teacher-question-card"
                  key={item.id}
                >

                  <div className="question-card-top">

                    <div>

                      <span className="question-subject">
                        {item.subject}
                      </span>

                      <h3>
                        {item.question}
                      </h3>

                    </div>

                    <span className="question-status">
                      {item.answered
                        ? 'Answered'
                        : 'New'}
                    </span>

                  </div>

                  <div className="question-student">

                    👨‍🎓 {item.studentName}

                    {item.studentClass && (
                      <span>
                        • {item.studentClass}
                      </span>
                    )}

                  </div>

                  {/* ANSWER */}

                  {item.answered ? (

                    <div className="teacher-answer-box">

                      <div className="answer-title">
                        ✅ Your Answer
                      </div>

                      <p>
                        {item.answer}
                      </p>

                    </div>

                  ) : (

                    <div className="teacher-answer-area">

                      {openAnswer === item.id ? (

                        <>

                          <textarea
                            className="teacher-answer-input"
                            placeholder="Write your answer to the student..."
                            value={answerText[item.id] || ''}
                            onChange={(e) =>
                              setAnswerText((previous) => ({
                                ...previous,
                                [item.id]: e.target.value
                              }))
                            }
                          />

                          <div className="answer-actions">

                            <button
                              className="cancel-answer-btn"
                              onClick={() =>
                                setOpenAnswer(null)
                              }
                            >
                              Cancel
                            </button>

                            <button
                              className="submit-answer-btn"
                              onClick={() =>
                                handleAnswer(item.id)
                              }
                            >
                              Submit Answer →
                            </button>

                          </div>

                        </>

                      ) : (

                        <button
                          className="answer-question-btn"
                          onClick={() =>
                            setOpenAnswer(item.id)
                          }
                        >
                          ✍️ Answer Question
                        </button>

                      )}

                    </div>

                  )}

                </div>

              ))}

            </div>

          ) : (

            <div className="teacher-empty-state">

              <div className="empty-question-icon">
                💡
              </div>

              <h3>
                No questions yet
              </h3>

              <p>
                When students ask questions about your subject,
                they will appear here.
              </p>

            </div>

          )}

        </section>

        {/* =========================
            SUBJECT INFO
        ========================= */}

        <section className="teacher-info-section">

          <div className="teacher-info-card">

            <span className="teacher-info-label">
              YOUR SUBJECT
            </span>

            <h2>
              {teacher?.subject || 'Science'}
            </h2>

            <p>
              Students can send you questions related to your
              subject. Help them understand concepts, solve
              problems and explore science.
            </p>

            <div className="teacher-info-status">
              <span>●</span>
              You are currently online
            </div>

          </div>

        </section>

      </main>

      <footer className="teacher-dashboard-footer">
        SCIENCECONNECT • Built for curious minds • 2026
      </footer>

    </div>
  )
}

export default TeacherDashboard