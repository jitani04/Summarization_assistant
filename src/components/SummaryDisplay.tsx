import type { Summary } from '../App'
import './SummaryDisplay.css'

interface SummaryDisplayProps {
  summary: Summary
}

export default function SummaryDisplay({ summary }: SummaryDisplayProps) {
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  const handleDownload = () => {
    const content = `
${summary.title}

KEY INSIGHTS:
${summary.keyInsights.map((insight, i) => `${i + 1}. ${insight}`).join('\n')}

NEXT STEPS:
${summary.nextSteps.map((step, i) => `${i + 1}. ${step}`).join('\n')}
    `.trim()

    const element = document.createElement('a')
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(content)
    )
    element.setAttribute('download', 'summary.txt')
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="summary-display">
      <div className="summary-header">
        <h2>Summary</h2>
        <div className="summary-actions">
          <button
            onClick={() =>
              handleCopy(
                `${summary.title}\n\n${summary.keyInsights.join('\n')}\n\n${summary.nextSteps.join('\n')}`
              )
            }
            className="action-button"
          >
            📋 Copy
          </button>
          <button onClick={handleDownload} className="action-button">
            📥 Download
          </button>
        </div>
      </div>

      <div className="summary-content">
        <section className="summary-section">
          <h3 className="section-title">📌 Title</h3>
          <p className="summary-title">{summary.title}</p>
        </section>

        <section className="summary-section">
          <h3 className="section-title">💡 Key Insights</h3>
          <ul className="insights-list">
            {summary.keyInsights.map((insight, index) => (
              <li key={index}>{insight}</li>
            ))}
          </ul>
        </section>

        <section className="summary-section">
          <h3 className="section-title">→ Next Steps</h3>
          <ol className="steps-list">
            {summary.nextSteps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  )
}
