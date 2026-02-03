import { useState } from 'react'
import './App.css'
import InputForm from './components/InputForm'
import SummaryDisplay from './components/SummaryDisplay'
import LoadingSpinner from './components/LoadingSpinner.tsx'
import { summarizeContent } from './services/summarizationService.ts'

export interface Summary {
  title: string
  keyInsights: string[]
  nextSteps: string[]
}

function App() {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSummarize = async (
    content: string,
    audience: string,
    purpose: string
  ) => {
    setLoading(true)
    setError(null)
    setSummary(null)

    try {
      const result = await summarizeContent(content, audience, purpose)
      setSummary(result)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An error occurred during summarization'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Content Summarizer</h1>
        <p>Summarize articles and texts for your specific audience and purpose</p>
      </header>

      <main className="main-content">
        <div className="input-column">
          <InputForm onSummarize={handleSummarize} disabled={loading} />
        </div>

        <div className="output-column">
          {loading && <LoadingSpinner />}
          {error && <div className="error-message">{error}</div>}
          {summary && <SummaryDisplay summary={summary} />}
        </div>
      </main>

      <footer className="footer">
        <p>Powered by AI Summarization</p>
      </footer>
    </div>
  )
}

export default App
