import { useState } from 'react'
import './InputForm.css'

interface InputFormProps {
  onSummarize: (content: string, audience: string, purpose: string) => void
  disabled: boolean
}

export default function InputForm({ onSummarize, disabled }: InputFormProps) {
  const [inputValue, setInputValue] = useState('')
  const [inputType, setInputType] = useState<'url' | 'text'>('text')
  const [audience, setAudience] = useState('general')
  const [purpose, setPurpose] = useState('informative')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!inputValue.trim()) {
      alert('Please enter a URL or text')
      return
    }

    onSummarize(inputValue, audience, purpose)
  }

  return (
    <form onSubmit={handleSubmit} className="input-form">
      <div className="form-section">
        <div className="textarea-container">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              inputType === 'url'
                ? 'https://example.com/article'
                : 'Paste your article or text here...'
            }
            className="content-input"
            disabled={disabled}
            rows={inputType === 'url' ? 2 : 4}
          />
          <button
            type="submit"
            className="submit-button-inline"
            disabled={disabled || !inputValue.trim()}
            title="Summarize"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 2L11 13" />
              <path d="M22 2L15 22L11 13L2 9L22 2Z" />
            </svg>
          </button>
        </div>

        <div className="controls-row">
          <select
            value={inputType}
            onChange={(e) => setInputType(e.target.value as 'url' | 'text')}
            disabled={disabled}
            className="input-type-dropdown"
          >
            <option value="text">Paste Text</option>
            <option value="url">Enter URL</option>
          </select>

          <select
            id="audience"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            disabled={disabled}
            className="parameter-select"
          >
            <option value="general">General Public</option>
            <option value="executive">Executive/Decision Makers</option>
            <option value="technical">Technical Professionals</option>
            <option value="student">Students</option>
            <option value="researcher">Researchers</option>
          </select>

          <select
            id="purpose"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            disabled={disabled}
            className="parameter-select"
          >
            <option value="informative">Informative</option>
            <option value="actionable">Actionable/Decision-focused</option>
            <option value="learning">Learning/Educational</option>
            <option value="quick">Quick Overview</option>
            <option value="research">Research Reference</option>
          </select>
        </div>
      </div>
    </form>
  )
}
