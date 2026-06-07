import { useState } from 'react'

export default function PromptSnippet({ tag, title, fields }) {
  const [copied, setCopied] = useState(false)
  const copyText = fields.map(f => `${f.label}\n${f.body}`).join('\n\n')

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(copyText)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch (e) { /* clipboard unavailable — no-op */ }
  }

  return (
    <figure className="ps-card">
      <header className="ps-head">
        <div>
          {tag && <span className="ps-tag">{tag}</span>}
          <h4 className="ps-title">{title}</h4>
        </div>
        <button
          type="button"
          className={`ps-copy${copied ? ' is-copied' : ''}`}
          onClick={copy}
          aria-label="Copy prompt to clipboard"
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </header>
      <dl className="ps-fields">
        {fields.map(f => (
          <div className="ps-row" key={f.label}>
            <dt className="ps-label">{f.label}</dt>
            <dd className="ps-body">{f.body}</dd>
          </div>
        ))}
      </dl>
    </figure>
  )
}
