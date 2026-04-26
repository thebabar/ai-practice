import { useEffect, useState } from 'react'
import { useApiKey } from '../hooks/useApiKey.js'

const modalStyle = `
  .akm-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(4px);
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }
  .akm-card {
    width: 100%;
    max-width: 480px;
    background: #0a080e;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 14px;
    padding: 28px;
    font-family: 'IBM Plex Sans', sans-serif;
    color: #e2e8f0;
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  }
  .akm-title {
    font-weight: 700;
    font-size: 18px;
    margin: 0 0 4px;
    letter-spacing: -0.01em;
  }
  .akm-sub {
    font-size: 13px;
    color: #7a9bbf;
    margin: 0 0 20px;
    line-height: 1.5;
  }
  .akm-label {
    display: block;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    color: #7a9bbf;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 8px;
  }
  .akm-input {
    width: 100%;
    box-sizing: border-box;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 13px;
    color: #e2e8f0;
    background: #050810;
    border: 1px solid #1e3048;
    border-radius: 8px;
    padding: 10px 12px;
    outline: none;
    transition: border-color 0.18s;
  }
  .akm-input:focus { border-color: #38bdf8; }
  .akm-row {
    display: flex;
    gap: 8px;
    margin-top: 16px;
    flex-wrap: wrap;
  }
  .akm-btn {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 8px 14px;
    border-radius: 8px;
    border: 1px solid #1e3048;
    background: transparent;
    color: #94a3b8;
    cursor: pointer;
    transition: all 0.18s;
  }
  .akm-btn:hover:not(:disabled) { border-color: #94a3b8; color: #e2e8f0; }
  .akm-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .akm-btn-primary {
    border-color: rgba(56,189,248,0.4);
    color: #38bdf8;
    background: rgba(56,189,248,0.08);
  }
  .akm-btn-primary:hover:not(:disabled) {
    border-color: #38bdf8;
    background: rgba(56,189,248,0.16);
    color: #38bdf8;
  }
  .akm-btn-danger {
    border-color: rgba(244,114,182,0.3);
    color: #f472b6;
  }
  .akm-btn-danger:hover:not(:disabled) {
    border-color: #f472b6;
    color: #f472b6;
    background: rgba(244,114,182,0.08);
  }
  .akm-status {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    margin-top: 14px;
    padding: 10px 12px;
    border-radius: 8px;
    line-height: 1.4;
  }
  .akm-status-ok {
    color: #34d399;
    background: rgba(52,211,153,0.08);
    border: 1px solid rgba(52,211,153,0.25);
  }
  .akm-status-err {
    color: #f87171;
    background: rgba(248,113,113,0.08);
    border: 1px solid rgba(248,113,113,0.25);
  }
  .akm-status-info {
    color: #7a9bbf;
    background: rgba(122,155,191,0.06);
    border: 1px solid rgba(122,155,191,0.2);
  }
  .akm-close {
    background: transparent;
    border: none;
    color: #7a9bbf;
    font-size: 22px;
    line-height: 1;
    cursor: pointer;
    float: right;
    padding: 0 4px;
  }
  .akm-close:hover { color: #e2e8f0; }
`

export default function ApiKeyModal({ open, onClose }) {
  const { key, hasKey, saveKey, clearKey } = useApiKey()
  const [draft, setDraft] = useState('')
  const [status, setStatus] = useState(null)
  const [testing, setTesting] = useState(false)

  useEffect(() => {
    if (open) {
      setDraft(key || '')
      setStatus(null)
    }
  }, [open, key])

  useEffect(() => {
    if (!open) return
    const onEsc = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [open, onClose])

  if (!open) return null

  const handleTest = async () => {
    const candidate = draft.trim()
    if (!candidate) {
      setStatus({ type: 'err', text: 'Enter a key first.' })
      return
    }
    setTesting(true)
    setStatus({ type: 'info', text: 'Testing key against Anthropic…' })
    try {
      const r = await fetch('/api/verify-key', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ key: candidate }),
      })
      const data = await r.json().catch(() => ({}))
      if (data.valid) {
        setStatus({ type: 'ok', text: 'Key works.' })
      } else {
        const detail = data.error || `Status ${data.status || r.status}`
        setStatus({ type: 'err', text: `Key rejected — ${detail}` })
      }
    } catch (e) {
      setStatus({ type: 'err', text: 'Could not reach /api/verify-key. Run with `vercel dev` or deploy.' })
    } finally {
      setTesting(false)
    }
  }

  const handleSave = () => {
    const candidate = draft.trim()
    if (!candidate) {
      setStatus({ type: 'err', text: 'Enter a key first.' })
      return
    }
    saveKey(candidate)
    setStatus({ type: 'ok', text: 'Saved to localStorage.' })
  }

  const handleClear = () => {
    clearKey()
    setDraft('')
    setStatus({ type: 'info', text: 'Key cleared.' })
  }

  return (
    <>
      <style>{modalStyle}</style>
      <div className="akm-backdrop" onClick={onClose}>
        <div className="akm-card" onClick={(e) => e.stopPropagation()}>
          <button className="akm-close" onClick={onClose} aria-label="Close">×</button>
          <h2 className="akm-title">Anthropic API Key</h2>
          <p className="akm-sub">
            Optional. Required only for Tier 2 activities that make live LLM calls.
            Stored in your browser's localStorage — never sent anywhere except Anthropic
            (via the verify endpoint).
          </p>

          <label className="akm-label" htmlFor="akm-key">sk-ant-…</label>
          <input
            id="akm-key"
            className="akm-input"
            type="password"
            autoComplete="off"
            spellCheck="false"
            placeholder="Paste your Anthropic API key"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />

          <div className="akm-row">
            <button
              className="akm-btn"
              onClick={handleTest}
              disabled={testing || !draft.trim()}
            >
              {testing ? 'Testing…' : 'Test Key'}
            </button>
            <button
              className="akm-btn akm-btn-primary"
              onClick={handleSave}
              disabled={!draft.trim()}
            >
              Save
            </button>
            <button
              className="akm-btn akm-btn-danger"
              onClick={handleClear}
              disabled={!hasKey && !draft}
            >
              Clear
            </button>
          </div>

          {status && (
            <div className={`akm-status akm-status-${status.type}`}>
              {status.text}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
