
import { useState } from 'react'
import './AskQuestion.css'

function AskQuestion({ onBack, onSubmitQuestion }) {
  const [subject, setSubject] = useState('')
  const [question, setQuestion] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!subject || !question.trim()) {
      alert('Please select a subject and write your question.')
      return
    }

    onSubmitQuestion({
      subject,
      question: question.trim()
    })

    setSubject('')
    setQuestion('')
  }

  return (
    <div className="ask-question-page">

      <div className="ask-question-card">

        <button
          className="question-back"
          onClick={onBack}
        >
          ← Back to Dashboard
        </button>

        <span className="dashboard-label">
          ASK A TEACHER
        </span>

        <h1>
          What are you curious about?
        </h1>

        <p>
          Choose a subject and ask your question.
        </p>

        <form onSubmit={handleSubmit}>

          <label>
            Subject
          </label>

          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            <option value="">
              Select a subject
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

          <label>
            Your Question
          </label>

          <textarea
            rows="7"
            placeholder="Type your question here..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          ></textarea>

          <button
            type="submit"
            className="submit-question"
          >
            Submit Question →
          </button>

        </form>

      </div>

    </div>
  )
}

export default AskQuestion

