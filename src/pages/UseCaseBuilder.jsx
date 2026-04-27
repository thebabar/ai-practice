import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import NavBar from '../components/NavBar.jsx'
import { useApiKey } from '../hooks/useApiKey.js'
import { useChat } from '../hooks/useChat.js'

const ACCENT = '#38bdf8'

const css = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap');

.ucb-root { min-height: 100vh; background: #050810; color: #e0e8f0; font-family: 'IBM Plex Sans', sans-serif; }

.ucb-keybar {
  display: flex; align-items: center; justify-content: center; gap: 10px;
  padding: 10px 20px; background: rgba(248,113,113,0.08);
  border-bottom: 1px solid rgba(248,113,113,0.25); color: #f87171;
  font-family: 'IBM Plex Mono', monospace; font-size: 13px; letter-spacing: 0.04em;
}
.ucb-keybar strong { color: #f87171; font-weight: 600; }

.ucb-shell { display: grid; grid-template-columns: 220px 1fr; min-height: calc(100vh - 60px); }

/* ── Sidebar ── */
.ucb-side {
  border-right: 1px solid rgba(255,255,255,0.06);
  background: #07090f;
  padding: 32px 0;
  position: sticky; top: 0; align-self: start;
  height: calc(100vh - 60px);
  overflow-y: auto;
}
.ucb-side-title {
  font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase;
  color: #4a6a8a; padding: 0 24px 18px; font-family: 'IBM Plex Mono', monospace;
}
.ucb-step-list { list-style: none; margin: 0; padding: 0; }
.ucb-step-item {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 24px; cursor: pointer;
  font-size: 14px; color: #6a7e98;
  border-left: 2px solid transparent;
  transition: all 0.18s;
  font-family: 'IBM Plex Sans', sans-serif;
  user-select: none;
}
.ucb-step-item:hover:not(.locked) { color: #e0e8f0; background: rgba(56,189,248,0.04); }
.ucb-step-item.active { color: #fff; border-left-color: ${ACCENT}; background: rgba(56,189,248,0.06); font-weight: 600; }
.ucb-step-item.complete { color: #94a3b8; }
.ucb-step-item.locked { color: #3a4a5e; cursor: not-allowed; }
.ucb-step-num {
  width: 22px; height: 22px; border-radius: 50%;
  display: inline-flex; align-items: center; justify-content: center;
  font-size: 11px; font-family: 'IBM Plex Mono', monospace;
  border: 1px solid currentColor; flex-shrink: 0;
}
.ucb-step-item.active .ucb-step-num { background: ${ACCENT}; border-color: ${ACCENT}; color: #050810; font-weight: 700; }
.ucb-step-item.complete .ucb-step-num { background: rgba(56,189,248,0.15); border-color: ${ACCENT}; color: ${ACCENT}; }
.ucb-step-label { flex: 1; }

/* ── Main content ── */
.ucb-main { padding: 56px 64px 80px; max-width: 880px; }
.ucb-step-eyebrow {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase;
  color: ${ACCENT}; margin-bottom: 12px;
}
.ucb-step-title {
  font-size: 32px; font-weight: 800; letter-spacing: -0.02em;
  color: #fff; margin: 0 0 12px;
}
.ucb-step-sub {
  font-size: 15px; color: #7a8da8; line-height: 1.7;
  margin: 0 0 36px; max-width: 640px;
}

/* ── Button-group selector ── */
.ucb-fieldset { margin-bottom: 32px; }
.ucb-fieldset-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase;
  color: #5a7088; margin-bottom: 12px; display: block;
}
.ucb-btngroup { display: flex; flex-wrap: wrap; gap: 8px; }
.ucb-chip {
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 14px;
  background: transparent; color: #94a3b8;
  border: 1px solid #1e2a3e; border-radius: 8px;
  padding: 9px 16px; cursor: pointer;
  transition: all 0.16s;
}
.ucb-chip:hover { border-color: #3a5a7a; color: #e0e8f0; }
.ucb-chip.selected {
  background: rgba(56,189,248,0.1);
  border-color: ${ACCENT};
  color: ${ACCENT};
  font-weight: 500;
}

/* ── Text inputs ── */
.ucb-input, .ucb-textarea {
  width: 100%; box-sizing: border-box;
  font-family: 'IBM Plex Sans', sans-serif; font-size: 14px;
  color: #e0e8f0; background: #050810;
  border: 1px solid #1e2a3e; border-radius: 8px;
  padding: 10px 14px; outline: none;
  transition: border-color 0.16s;
}
.ucb-input::placeholder, .ucb-textarea::placeholder { color: #3a4a5e; }
.ucb-input:focus, .ucb-textarea:focus { border-color: ${ACCENT}; }
.ucb-input.invalid, .ucb-textarea.invalid { border-color: #f87171; }
.ucb-textarea { min-height: 84px; resize: vertical; line-height: 1.6; font-family: 'IBM Plex Sans', sans-serif; }
.ucb-input-row { margin-top: 8px; }
.ucb-hint {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px; color: #5a7088; margin-top: 6px; letter-spacing: 0.04em;
}
.ucb-hint.error { color: #f87171; }
.ucb-optional {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase;
  color: #3a4a5e; margin-left: 8px; font-weight: 400;
}

/* ── Footer nav ── */
.ucb-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 40px; gap: 12px; flex-wrap: wrap; }
.ucb-btn {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase;
  padding: 11px 22px; border-radius: 8px;
  border: 1px solid ${ACCENT};
  background: rgba(56,189,248,0.12); color: ${ACCENT};
  cursor: pointer; transition: all 0.16s;
}
.ucb-btn:hover:not(:disabled) { background: rgba(56,189,248,0.22); }
.ucb-btn:disabled { opacity: 0.35; cursor: not-allowed; }
.ucb-btn.ghost { background: transparent; border-color: #2a3a52; color: #7a8da8; }
.ucb-btn.ghost:hover:not(:disabled) { border-color: #94a3b8; color: #e0e8f0; }

/* ── CSS show/hide for steps (keeps state alive) ── */
.ucb-pane { display: none; }
.ucb-pane.active { display: block; }

/* ── Skill cards ── */
.ucb-skill-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
  margin-bottom: 28px;
}
.ucb-skill-card {
  text-align: left;
  background: #0a1020;
  border: 1px solid #182338;
  border-radius: 12px;
  padding: 18px 18px 16px;
  cursor: pointer;
  transition: all 0.18s;
  font-family: 'IBM Plex Sans', sans-serif;
  color: #e0e8f0;
}
.ucb-skill-card:hover { border-color: #3a5a7a; transform: translateY(-1px); }
.ucb-skill-card.selected {
  border-color: ${ACCENT};
  background: rgba(56,189,248,0.06);
  box-shadow: 0 0 30px rgba(56,189,248,0.08);
}
.ucb-skill-emoji { font-size: 26px; line-height: 1; margin-bottom: 10px; }
.ucb-skill-name { font-weight: 700; font-size: 15px; margin-bottom: 6px; letter-spacing: -0.01em; }
.ucb-skill-desc { font-size: 13px; color: #7a8da8; line-height: 1.5; }
.ucb-skill-card.selected .ucb-skill-name { color: ${ACCENT}; }

/* ── Assessment ── */
.ucb-section-divider {
  height: 1px; background: linear-gradient(90deg, rgba(56,189,248,0.2), transparent);
  margin: 32px 0 28px;
}
.ucb-assess-intro {
  font-size: 14px; color: #8a9db8; line-height: 1.7; margin-bottom: 22px;
  max-width: 640px;
}
.ucb-q {
  background: #0a1020; border: 1px solid #182338; border-radius: 12px;
  padding: 18px 20px; margin-bottom: 14px;
}
.ucb-q-num {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase;
  color: ${ACCENT}; margin-bottom: 8px;
}
.ucb-q-text {
  font-size: 15px; color: #e0e8f0; line-height: 1.6; margin-bottom: 12px;
  font-weight: 500;
}
.ucb-q-textarea {
  width: 100%; box-sizing: border-box;
  font-family: 'IBM Plex Sans', sans-serif; font-size: 14px;
  color: #e0e8f0; background: #050810;
  border: 1px solid #1e2a3e; border-radius: 8px;
  padding: 10px 12px; outline: none;
  min-height: 80px; resize: vertical; line-height: 1.6;
  transition: border-color 0.16s;
}
.ucb-q-textarea:focus { border-color: ${ACCENT}; }
.ucb-q-textarea::placeholder { color: #3a4a5e; }

.ucb-banner {
  background: rgba(248,113,113,0.06);
  border: 1px solid rgba(248,113,113,0.25);
  border-radius: 8px;
  padding: 12px 14px; color: #f87171;
  font-family: 'IBM Plex Mono', monospace; font-size: 13px;
  margin-top: 14px;
}

/* ── Calibration result card ── */
.ucb-cal-card {
  background: linear-gradient(180deg, rgba(56,189,248,0.06), #0a1020 80%);
  border: 1px solid rgba(56,189,248,0.4);
  border-radius: 14px; padding: 24px 26px; margin-top: 8px;
}
.ucb-cal-row { display: flex; align-items: center; gap: 14px; margin-bottom: 16px; flex-wrap: wrap; }
.ucb-cal-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase;
  color: #7a8da8;
}
.ucb-cal-pill {
  display: inline-block;
  font-family: 'IBM Plex Sans', sans-serif; font-weight: 700;
  background: rgba(56,189,248,0.15);
  border: 1px solid ${ACCENT};
  color: ${ACCENT};
  padding: 5px 14px; border-radius: 100px;
  font-size: 14px; letter-spacing: -0.01em;
}
.ucb-cal-mismatch {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px; color: #fbbf24;
  letter-spacing: 0.06em;
}
.ucb-cal-obs {
  font-size: 14px; color: #c8d4e2; line-height: 1.7;
  white-space: pre-wrap;
}
.ucb-cal-stream {
  font-size: 13px; color: #7a8da8; line-height: 1.7;
  white-space: pre-wrap; font-family: 'IBM Plex Mono', monospace;
}
.ucb-cursor { display: inline-block; width: 6px; height: 12px; background: ${ACCENT}; opacity: 0.7; margin-left: 2px; vertical-align: -1px; animation: ucb-blink 1s infinite; }
@keyframes ucb-blink { 0%, 50% { opacity: 0.7; } 50.01%, 100% { opacity: 0; } }

/* ── Chat (Steps 3, 4) ── */
.ucb-chat { display: flex; flex-direction: column; gap: 14px; }
.ucb-chat-scroll {
  background: #07090f;
  border: 1px solid #182338;
  border-radius: 14px;
  padding: 18px 20px;
  max-height: 480px;
  overflow-y: auto;
  display: flex; flex-direction: column; gap: 12px;
}
.ucb-bubble {
  max-width: 85%;
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 14px; line-height: 1.65;
  white-space: pre-wrap;
}
.ucb-bubble.claude {
  align-self: flex-start;
  background: #0c1426;
  border: 1px solid #1a2842;
  color: #d8e0ec;
}
.ucb-bubble.user {
  align-self: flex-end;
  background: rgba(56,189,248,0.08);
  border: 1px solid rgba(56,189,248,0.3);
  color: #e0e8f0;
}
.ucb-bubble-meta {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase;
  color: #5a7088; margin-bottom: 4px;
}
.ucb-bubble.user .ucb-bubble-meta { color: ${ACCENT}; opacity: 0.7; }

.ucb-input-row2 { display: flex; gap: 10px; align-items: flex-end; }
.ucb-chat-input {
  flex: 1;
  font-family: 'IBM Plex Sans', sans-serif; font-size: 14px;
  color: #e0e8f0; background: #050810;
  border: 1px solid #1e2a3e; border-radius: 10px;
  padding: 12px 14px; outline: none;
  min-height: 56px; max-height: 200px; resize: vertical; line-height: 1.6;
  transition: border-color 0.16s;
}
.ucb-chat-input:focus { border-color: ${ACCENT}; }
.ucb-chat-input::placeholder { color: #3a4a5e; }

/* ── Summary card (Steps 3, 4) ── */
.ucb-sum-card {
  background: linear-gradient(180deg, rgba(56,189,248,0.05), #0a1020 90%);
  border: 1px solid rgba(56,189,248,0.4);
  border-radius: 14px; padding: 22px 24px;
}
.ucb-sum-card.confirmed { border-color: rgba(52,211,153,0.5); background: linear-gradient(180deg, rgba(52,211,153,0.05), #0a1020 90%); }
.ucb-sum-eyebrow {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
  color: ${ACCENT}; margin-bottom: 6px;
}
.ucb-sum-card.confirmed .ucb-sum-eyebrow { color: #34d399; }
.ucb-sum-title { font-family: 'IBM Plex Sans', sans-serif; font-size: 18px; font-weight: 700; color: #fff; margin: 0 0 16px; letter-spacing: -0.01em; }
.ucb-sum-section { margin-bottom: 14px; }
.ucb-sum-section:last-child { margin-bottom: 0; }
.ucb-sum-h { font-family: 'IBM Plex Sans', sans-serif; font-size: 13px; font-weight: 700; color: ${ACCENT}; letter-spacing: 0.04em; margin: 0 0 4px; }
.ucb-sum-card.confirmed .ucb-sum-h { color: #34d399; }
.ucb-sum-body { font-size: 14px; color: #c8d4e2; line-height: 1.7; white-space: pre-wrap; }
.ucb-sum-section.verdict .ucb-sum-body { font-size: 15px; color: #e8eef6; font-weight: 500; }

/* ── Path cards (Step 5) ── */
.ucb-path-grid { display: grid; gap: 16px; grid-template-columns: 1fr; }
@media (min-width: 880px) {
  .ucb-path-grid.two { grid-template-columns: 1fr 1fr; }
}
.ucb-path-card {
  border-radius: 14px; padding: 22px 24px;
  border: 1px solid;
  display: flex; flex-direction: column;
  background: #0a1020;
}
.ucb-path-card.learn   { border-color: rgba(251,191,36,0.4); background: linear-gradient(180deg, rgba(251,191,36,0.05), #0a1020 80%); }
.ucb-path-card.build   { border-color: rgba(52,211,153,0.4); background: linear-gradient(180deg, rgba(52,211,153,0.05), #0a1020 80%); }
.ucb-path-eyebrow { font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 6px; }
.ucb-path-card.learn .ucb-path-eyebrow { color: #fbbf24; }
.ucb-path-card.build .ucb-path-eyebrow { color: #34d399; }
.ucb-path-title { font-family: 'IBM Plex Sans', sans-serif; font-size: 20px; font-weight: 700; color: #fff; margin: 0 0 12px; letter-spacing: -0.01em; }
.ucb-path-body { font-size: 14px; color: #c8d4e2; line-height: 1.7; white-space: pre-wrap; flex: 1; margin-bottom: 16px; }
.ucb-path-cta {
  align-self: flex-start;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase;
  padding: 10px 18px; border-radius: 8px;
  border: 1px solid; cursor: pointer;
  text-decoration: none; display: inline-block;
  transition: all 0.16s;
}
.ucb-path-card.learn .ucb-path-cta { border-color: #fbbf24; background: rgba(251,191,36,0.12); color: #fbbf24; }
.ucb-path-card.learn .ucb-path-cta:hover { background: rgba(251,191,36,0.22); }
.ucb-path-card.build .ucb-path-cta { border-color: #34d399; background: rgba(52,211,153,0.12); color: #34d399; }
.ucb-path-card.build .ucb-path-cta:hover { background: rgba(52,211,153,0.22); }

.ucb-path-why {
  font-size: 14px; color: #d8e0ec; line-height: 1.7;
  background: rgba(56,189,248,0.05);
  border-left: 2px solid ${ACCENT};
  padding: 12px 16px; border-radius: 0 8px 8px 0;
  margin-bottom: 18px;
}

/* ── Build guidance cards (Step 6) ── */
.ucb-build-card {
  background: #0a1020;
  border: 1px solid #182338;
  border-radius: 14px;
  padding: 22px 24px;
  margin-bottom: 14px;
  position: relative;
}
.ucb-build-card-head {
  display: flex; align-items: center; justify-content: space-between;
  gap: 12px; margin-bottom: 14px;
}
.ucb-build-card-title {
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 16px; font-weight: 700; color: ${ACCENT};
  letter-spacing: -0.01em; margin: 0;
}
.ucb-copy-btn {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;
  background: transparent; border: 1px solid #2a3a52;
  color: #7a8da8; padding: 5px 10px; border-radius: 6px;
  cursor: pointer; transition: all 0.16s;
}
.ucb-copy-btn:hover { border-color: ${ACCENT}; color: ${ACCENT}; }
.ucb-copy-btn.copied { border-color: #34d399; color: #34d399; }
.ucb-build-card-body {
  font-size: 14px; color: #c8d4e2; line-height: 1.75;
  white-space: pre-wrap;
}

/* ── Mockup iframe ── */
.ucb-mockup-card {
  background: #0a1020;
  border: 1px solid #182338;
  border-radius: 14px;
  padding: 18px 18px 14px;
  margin-top: 8px;
}
.ucb-mockup-head {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 12px; gap: 12px;
}
.ucb-mockup-title {
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 16px; font-weight: 700; color: ${ACCENT};
  margin: 0;
}
.ucb-mockup-link {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;
  color: ${ACCENT}; text-decoration: none;
  border: 1px solid ${ACCENT}; padding: 5px 10px; border-radius: 6px;
  background: transparent; cursor: pointer; transition: all 0.16s;
}
.ucb-mockup-link:hover { background: rgba(56,189,248,0.12); }
.ucb-mockup-frame {
  width: 100%; height: 400px; border: 1px solid #1e2a3e;
  border-radius: 10px; background: #050810;
  display: block;
}
.ucb-mockup-fallback {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12px; color: #7a8da8;
  padding: 18px; background: rgba(122,141,168,0.04);
  border: 1px dashed #2a3a52; border-radius: 8px;
}

/* ── Stub panel for not-yet-built steps ── */
.ucb-stub {
  border: 1px dashed #2a3a52; border-radius: 12px;
  padding: 32px; color: #6a7e98;
  font-family: 'IBM Plex Mono', monospace; font-size: 13px;
  background: rgba(56,189,248,0.02);
}
`

const STEPS = [
  { id: 'profile',  num: 1, label: 'Your Profile' },
  { id: 'skill',    num: 2, label: 'Skill Level' },
  { id: 'data',     num: 3, label: 'Data Discovery' },
  { id: 'usecase',  num: 4, label: 'Use Case' },
  { id: 'path',     num: 5, label: 'Your Path' },
  { id: 'build',    num: 6, label: 'Build Guidance' },
]

const ROLES      = ['Individual Contributor', 'Manager', 'Executive', 'Founder', 'Consultant']
const INDUSTRIES = ['Financial Services', 'Healthcare', 'Retail', 'Manufacturing', 'Education', 'Professional Services', 'Other']
const SIZES      = ['1–50', '50–500', '500–5000', '5000+']

function friendlyError(err) {
  if (!err) return ''
  const s = String(err)
  if (/\b404\b/.test(s) || /not\s*found/i.test(s) || /could not reach/i.test(s)) {
    return "Can't reach /api/chat-user — Vite's dev server doesn't serve serverless functions. Run `vercel dev` locally or test on the deployed URL."
  }
  return `Error: ${s}`
}

const initialSession = () => ({
  profile: { role: '', industry: '', size: '', business: '' },
  skillLevel: { selfReported: '', calibrated: null, observation: '' },
  assessment: { answers: [], complete: false },
  dataDiscovery: { summary: null, confirmed: false },
  useCase: { assessment: null, confirmed: false },
  path: { recommendation: null },
  buildGuidance: { sections: null, mockupHtml: null },
})

export default function UseCaseBuilder() {
  const { hasKey } = useApiKey()
  const [currentStep, setCurrentStep] = useState('profile')
  const [completed, setCompleted] = useState(new Set())
  const [sessionData, setSessionData] = useState(initialSession)

  const updateSession = (patch) => setSessionData((s) => ({ ...s, ...patch }))

  const markComplete = (id) => setCompleted((c) => {
    if (c.has(id)) return c
    const next = new Set(c)
    next.add(id)
    return next
  })

  const goTo = (id) => {
    if (canNavigateTo(id, completed)) setCurrentStep(id)
  }

  const advance = (fromId, toId) => {
    markComplete(fromId)
    setCurrentStep(toId)
  }

  return (
    <div className="ucb-root">
      <style>{css}</style>
      <NavBar />

      {!hasKey && (
        <div className="ucb-keybar">
          <strong>API key required.</strong>
          <span>This tool uses AI at every step — open the key icon in the nav and paste your Anthropic key to continue past Step 2.</span>
        </div>
      )}

      <div className="ucb-shell">
        <aside className="ucb-side">
          <div className="ucb-side-title">Use Case Builder</div>
          <ul className="ucb-step-list">
            {STEPS.map((s) => {
              const isActive = currentStep === s.id
              const isDone = completed.has(s.id)
              const reachable = canNavigateTo(s.id, completed)
              return (
                <li
                  key={s.id}
                  className={`ucb-step-item${isActive ? ' active' : ''}${isDone ? ' complete' : ''}${!reachable ? ' locked' : ''}`}
                  onClick={() => goTo(s.id)}
                >
                  <span className="ucb-step-num">{isDone ? '✓' : s.num}</span>
                  <span className="ucb-step-label">{s.label}</span>
                </li>
              )
            })}
          </ul>
        </aside>

        <main className="ucb-main">
          <ProfilePane
            active={currentStep === 'profile'}
            data={sessionData.profile}
            onChange={(profile) => updateSession({ profile })}
            onNext={() => advance('profile', 'skill')}
          />
          <SkillPane
            active={currentStep === 'skill'}
            data={sessionData.skillLevel}
            onChange={(skillLevel) => updateSession({ skillLevel })}
            onAdvance={() => advance('skill', 'data')}
            hasKey={hasKey}
          />
          <DataPane
            active={currentStep === 'data'}
            data={sessionData.dataDiscovery}
            onChange={(dataDiscovery) => updateSession({ dataDiscovery })}
            onAdvance={() => advance('data', 'usecase')}
            hasKey={hasKey}
          />
          <UseCasePane
            active={currentStep === 'usecase'}
            data={sessionData.useCase}
            onChange={(useCase) => updateSession({ useCase })}
            onAdvance={() => advance('usecase', 'path')}
            hasKey={hasKey}
          />
          <PathPane
            active={currentStep === 'path'}
            data={sessionData.path}
            onChange={(path) => updateSession({ path })}
            session={sessionData}
            onAdvance={() => advance('path', 'build')}
            markComplete={() => markComplete('path')}
            hasKey={hasKey}
          />
          <BuildPane
            active={currentStep === 'build'}
            data={sessionData.buildGuidance}
            onChange={(buildGuidance) => updateSession({ buildGuidance })}
            session={sessionData}
            markComplete={() => markComplete('build')}
            hasKey={hasKey}
          />
        </main>
      </div>
    </div>
  )
}

function canNavigateTo(id, completed) {
  const idx = STEPS.findIndex((s) => s.id === id)
  if (idx === 0) return true
  // allowed to revisit a completed step or the immediate next step after the highest completed
  if (completed.has(id)) return true
  const prevId = STEPS[idx - 1].id
  return completed.has(prevId)
}

/* ── Step 1: Your Profile ───────────────────────────────────────────────── */
const ROLE_MAX = 80
const BUSINESS_MAX = 400

function validateProfile(data) {
  const errors = {}
  const role = (data.role || '').trim()
  if (role.length < 2) errors.role = 'Enter your role (at least 2 characters).'
  else if (role.length > ROLE_MAX) errors.role = `Keep it under ${ROLE_MAX} characters.`
  if (!data.industry) errors.industry = 'Pick an industry.'
  if (!data.size) errors.size = 'Pick a company size.'
  if ((data.business || '').length > BUSINESS_MAX) errors.business = `Keep it under ${BUSINESS_MAX} characters.`
  return errors
}

function ProfilePane({ active, data, onChange, onNext }) {
  const [touched, setTouched] = useState({})
  const set = (k) => (v) => onChange({ ...data, [k]: v })
  const errors = validateProfile(data)
  const ready = Object.keys(errors).length === 0
  const showErr = (k) => touched[k] && errors[k]

  const onTryNext = () => {
    if (!ready) {
      setTouched({ role: true, industry: true, size: true, business: true })
      return
    }
    onChange({ ...data, role: data.role.trim(), business: data.business.trim() })
    onNext()
  }

  return (
    <div className={`ucb-pane${active ? ' active' : ''}`}>
      <div className="ucb-step-eyebrow">Step 1 of 6</div>
      <h1 className="ucb-step-title">Your Profile</h1>
      <p className="ucb-step-sub">A few quick questions so the rest of this tool can calibrate to you. None of this is sent anywhere except your own AI calls.</p>

      <div className="ucb-fieldset">
        <span className="ucb-fieldset-label">Role</span>
        <div className="ucb-btngroup">
          {ROLES.map((opt) => (
            <button
              key={opt}
              type="button"
              className={`ucb-chip${data.role === opt ? ' selected' : ''}`}
              onClick={() => set('role')(opt)}
            >
              {opt}
            </button>
          ))}
        </div>
        <div className="ucb-input-row">
          <input
            type="text"
            className={`ucb-input${showErr('role') ? ' invalid' : ''}`}
            value={data.role}
            onChange={(e) => set('role')(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, role: true }))}
            placeholder="Or type your own — e.g. Director of Operations, Solo founder, Data analyst"
            maxLength={ROLE_MAX + 20}
            aria-invalid={!!showErr('role')}
          />
          <div className={`ucb-hint${showErr('role') ? ' error' : ''}`}>
            {showErr('role') ? errors.role : 'Picking a chip fills the field. Free-form text wins.'}
          </div>
        </div>
      </div>

      <ChipField
        label="Industry"
        value={data.industry}
        options={INDUSTRIES}
        onPick={set('industry')}
        onBlur={() => setTouched((t) => ({ ...t, industry: true }))}
        error={showErr('industry') ? errors.industry : null}
      />
      <ChipField
        label="Company Size"
        value={data.size}
        options={SIZES}
        onPick={set('size')}
        onBlur={() => setTouched((t) => ({ ...t, size: true }))}
        error={showErr('size') ? errors.size : null}
      />

      <div className="ucb-fieldset">
        <span className="ucb-fieldset-label">
          Business Description
          <span className="ucb-optional">Optional</span>
        </span>
        <textarea
          className={`ucb-textarea${showErr('business') ? ' invalid' : ''}`}
          value={data.business}
          onChange={(e) => set('business')(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, business: true }))}
          placeholder="One or two sentences on what your business actually does. The more specific, the more tailored the rest of this tool gets."
          maxLength={BUSINESS_MAX + 20}
        />
        <div className={`ucb-hint${showErr('business') ? ' error' : ''}`}>
          {showErr('business')
            ? errors.business
            : `${(data.business || '').length} / ${BUSINESS_MAX}`}
        </div>
      </div>

      <div className="ucb-footer">
        <span />
        <button className="ucb-btn" disabled={!ready} onClick={onTryNext}>
          Next →
        </button>
      </div>
    </div>
  )
}

function ChipField({ label, value, options, onPick, onBlur, error }) {
  return (
    <div className="ucb-fieldset">
      <span className="ucb-fieldset-label">{label}</span>
      <div className="ucb-btngroup" onBlur={onBlur} tabIndex={-1}>
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            className={`ucb-chip${value === opt ? ' selected' : ''}`}
            onClick={() => { onPick(opt); onBlur && onBlur() }}
          >
            {opt}
          </button>
        ))}
      </div>
      {error && <div className="ucb-hint error">{error}</div>}
    </div>
  )
}

/* ── Step 2: Skill Level + assessment ───────────────────────────────────── */
const SKILL_LEVELS = [
  { id: 'Beginner',     emoji: '🌱', desc: "I know AI exists but haven't used it much professionally." },
  { id: 'Intermediate', emoji: '⚡', desc: 'I use AI tools regularly and understand the basics.' },
  { id: 'Advanced',     emoji: '🔧', desc: "I can prompt well, understand models, and have built things." },
  { id: 'Expert',       emoji: '🚀', desc: 'I build AI systems and lead AI initiatives.' },
]

const ASSESSMENT_QUESTIONS = [
  'What is a "token" in the context of an LLM, and why does it matter for cost and context limits?',
  'When would you choose a smaller, cheaper model over a frontier model? Give a concrete example.',
  'What is the practical difference between prompt engineering and fine-tuning? When would you choose each?',
  'Why might an LLM "hallucinate," and what is one technique you would use to reduce it in production?',
  'A team\'s LLM-powered chatbot is responding too slowly. What are the first three things you would investigate?',
]

const ASSESSMENT_SYSTEM_PROMPT = `You are evaluating a working professional's practical AI knowledge. They self-reported a skill level and answered 5 free-form questions. Calibrate their actual level based on the substance of their answers, not their confidence.

Be honest:
- If they self-reported Advanced/Expert but their answers show shallow or surface-level understanding, calibrate down and say so kindly but directly.
- If they self-reported low but show real depth, calibrate up.
- If their answers match their self-report, confirm it.

Respond in EXACTLY this format and nothing else — no preamble, no closing remarks:

## Calibrated Level
<exactly one of: Beginner, Intermediate, Advanced, Expert>

## Observation
<1–2 sentences. Specific. Reference what they got right or what was missing. No fluff, no encouragement filler.>`

function buildAssessmentMessage(selfReported, answers) {
  const qa = ASSESSMENT_QUESTIONS.map((q, i) => `Q${i + 1}: ${q}\nA${i + 1}: ${(answers[i] || '').trim() || '(no answer)'}`).join('\n\n')
  return `Self-reported skill level: ${selfReported}\n\n${qa}`
}

function parseAssessment(text) {
  if (!text) return { calibrated: null, observation: '' }
  const levelMatch = text.match(/##\s*Calibrated Level\s*\n+\s*(Beginner|Intermediate|Advanced|Expert)\b/i)
  const obsMatch = text.match(/##\s*Observation\s*\n([\s\S]*?)(?=\n##|$)/i)
  const norm = (s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
  return {
    calibrated: levelMatch ? norm(levelMatch[1]) : null,
    observation: obsMatch ? obsMatch[1].trim() : '',
  }
}

function SkillPane({ active, data, onChange, onAdvance, hasKey }) {
  const [answers, setAnswers] = useState(['', '', '', '', ''])
  const chat = useChat({ tier: 'user', systemPrompt: ASSESSMENT_SYSTEM_PROMPT })
  const wasStreamingRef = useRef(false)

  const lastMsg = chat.messages[chat.messages.length - 1]
  const lastAssistantText = lastMsg?.role === 'assistant' ? lastMsg.content : ''

  // When a stream finishes, parse and persist the calibration.
  useEffect(() => {
    if (wasStreamingRef.current && !chat.isStreaming) {
      if (lastAssistantText) {
        const parsed = parseAssessment(lastAssistantText)
        if (parsed.calibrated) {
          onChange({ ...data, calibrated: parsed.calibrated, observation: parsed.observation })
        }
      }
    }
    wasStreamingRef.current = chat.isStreaming
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat.isStreaming])

  const pickLevel = (id) => {
    if (id === data.selfReported) return
    onChange({ ...data, selfReported: id, calibrated: null, observation: '' })
    setAnswers(['', '', '', '', ''])
    chat.reset()
    if (id === 'Beginner') {
      // Skip assessment entirely.
      onAdvance()
    }
  }

  const setAns = (i) => (e) => {
    const v = e.target.value
    setAnswers((arr) => {
      const next = arr.slice()
      next[i] = v
      return next
    })
  }

  const allAnswered = answers.every((a) => a.trim().length >= 2)
  const needsAssessment = data.selfReported && data.selfReported !== 'Beginner'
  const showResult = data.calibrated && !chat.isStreaming
  const evaluating = chat.isStreaming

  const submit = () => {
    if (!allAnswered || !hasKey || evaluating) return
    chat.reset()
    chat.sendMessage(buildAssessmentMessage(data.selfReported, answers))
  }

  const retake = () => {
    onChange({ ...data, calibrated: null, observation: '' })
    setAnswers(['', '', '', '', ''])
    chat.reset()
  }

  return (
    <div className={`ucb-pane${active ? ' active' : ''}`}>
      <div className="ucb-step-eyebrow">Step 2 of 6</div>
      <h1 className="ucb-step-title">How would you describe your current AI skill level?</h1>
      <p className="ucb-step-sub">Pick the one closest to where you actually are. The rest of this tool calibrates to your honest answer.</p>

      <div className="ucb-skill-grid">
        {SKILL_LEVELS.map((lvl) => (
          <button
            key={lvl.id}
            type="button"
            className={`ucb-skill-card${data.selfReported === lvl.id ? ' selected' : ''}`}
            onClick={() => pickLevel(lvl.id)}
          >
            <div className="ucb-skill-emoji">{lvl.emoji}</div>
            <div className="ucb-skill-name">{lvl.id}</div>
            <div className="ucb-skill-desc">{lvl.desc}</div>
          </button>
        ))}
      </div>

      {needsAssessment && !showResult && !evaluating && (
        <>
          <div className="ucb-section-divider" />
          <p className="ucb-assess-intro">
            Five practical questions. Free-form answers — write what you actually know. Claude will calibrate your level from the substance of your answers.
          </p>
          {ASSESSMENT_QUESTIONS.map((q, i) => (
            <div className="ucb-q" key={i}>
              <div className="ucb-q-num">Q{i + 1}</div>
              <div className="ucb-q-text">{q}</div>
              <textarea
                className="ucb-q-textarea"
                value={answers[i]}
                onChange={setAns(i)}
                placeholder="Your answer…"
              />
            </div>
          ))}

          {!hasKey && (
            <div className="ucb-banner">Add your API key in the nav to run the calibration.</div>
          )}
          {chat.error && <div className="ucb-banner">{friendlyError(chat.error)}</div>}

          <div className="ucb-footer">
            <span />
            <button
              className="ucb-btn"
              disabled={!allAnswered || !hasKey}
              onClick={submit}
            >
              Submit for Calibration
            </button>
          </div>
        </>
      )}

      {evaluating && (
        <>
          <div className="ucb-section-divider" />
          <div className="ucb-cal-card">
            <div className="ucb-cal-row">
              <span className="ucb-cal-label">Evaluating</span>
            </div>
            <div className="ucb-cal-stream">
              {lastAssistantText || 'Thinking…'}
              <span className="ucb-cursor" />
            </div>
          </div>
        </>
      )}

      {showResult && (
        <>
          <div className="ucb-section-divider" />
          <div className="ucb-cal-card">
            <div className="ucb-cal-row">
              <span className="ucb-cal-label">Calibrated Level</span>
              <span className="ucb-cal-pill">{data.calibrated}</span>
              {data.calibrated !== data.selfReported && (
                <span className="ucb-cal-mismatch">
                  ↳ self-reported {data.selfReported}
                </span>
              )}
            </div>
            {data.observation && <div className="ucb-cal-obs">{data.observation}</div>}
          </div>
          <div className="ucb-footer">
            <button className="ucb-btn ghost" onClick={retake}>Retake Assessment</button>
            <button className="ucb-btn" onClick={onAdvance}>Continue →</button>
          </div>
        </>
      )}
    </div>
  )
}

/* ── Step 3: Data Discovery chat ────────────────────────────────────────── */
const DATA_OPENER = "Let's understand what you're working with. What kinds of data does your organization have access to — and what's actually usable?"

const DATA_SYSTEM_PROMPT = `You are a practical AI advisor interviewing a professional about their organization's data. Ask one focused question at a time. Be conversational but efficient.

Cover these areas across the conversation: data types (structured vs unstructured), volume, quality, accessibility, whether data is siloed, and any compliance constraints (HIPAA, GDPR, SOC2, etc).

Your opening greeting "${DATA_OPENER}" has already been delivered to the user. Do NOT greet them again. The first user message you see is their answer to that opener — respond by acknowledging briefly and asking the next focused question.

After 4–6 exchanges with the user, when you have enough material, produce a structured summary. Format the summary in EXACTLY this form (no preamble, no closing remarks):

## Data Types
<2–4 sentences>

## Quality Assessment
<2–4 sentences>

## Key Constraints
<2–4 sentences>

## Opportunity Signals
<2–4 sentences>

Be direct and honest. If they have very little usable data, say so plainly. Until you produce the summary, keep asking questions.`

const DATA_HEADERS = [
  { key: 'dataTypes',     label: 'Data Types' },
  { key: 'quality',       label: 'Quality Assessment' },
  { key: 'constraints',   label: 'Key Constraints' },
  { key: 'opportunities', label: 'Opportunity Signals' },
]

function parseStructuredSummary(text, headerDefs) {
  const out = {}
  if (!text) return out
  const headerRe = /^##\s+(.+)$/gm
  const matches = []
  let m
  while ((m = headerRe.exec(text)) !== null) {
    matches.push({ headerLower: m[1].trim().toLowerCase(), end: m.index + m[0].length, start: m.index })
  }
  for (let i = 0; i < matches.length; i++) {
    const def = headerDefs.find((h) => matches[i].headerLower.startsWith(h.label.toLowerCase()))
    if (!def) continue
    const next = i + 1 < matches.length ? matches[i + 1].start : text.length
    out[def.key] = text.slice(matches[i].end, next).replace(/^\s*\n/, '').replace(/\s+$/, '')
  }
  return out
}

function hasAllSections(parsed, headerDefs) {
  return headerDefs.every((h) => parsed[h.key] && parsed[h.key].trim().length > 0)
}

function DataPane({ active, data, onChange, onAdvance, hasKey }) {
  const chat = useChat({ tier: 'user', systemPrompt: DATA_SYSTEM_PROMPT })
  const [draft, setDraft] = useState('')
  const scrollRef = useRef(null)

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [chat.messages, chat.isStreaming])

  const send = () => {
    const text = draft.trim()
    if (!text || chat.isStreaming || !hasKey) return
    chat.sendMessage(text)
    setDraft('')
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  // Detect a finalized summary in the latest assistant message.
  const lastMsg = chat.messages[chat.messages.length - 1]
  const lastIsCompleteAssistant = lastMsg?.role === 'assistant' && !chat.isStreaming
  const parsedLatest = lastIsCompleteAssistant ? parseStructuredSummary(lastMsg.content, DATA_HEADERS) : null
  const summaryReady = parsedLatest && hasAllSections(parsedLatest, DATA_HEADERS)

  const onConfirm = () => {
    if (!summaryReady) return
    onChange({ ...data, summary: parsedLatest, confirmed: true })
  }

  const renderMessage = (m, i) => {
    if (m.role === 'user') {
      return (
        <div key={i} className="ucb-bubble user">
          <div className="ucb-bubble-meta">You</div>
          {m.content}
        </div>
      )
    }
    // assistant
    const isLast = i === chat.messages.length - 1
    const stillStreaming = isLast && chat.isStreaming
    const parsed = !stillStreaming ? parseStructuredSummary(m.content, DATA_HEADERS) : null
    const renderAsCard = parsed && hasAllSections(parsed, DATA_HEADERS)
    if (renderAsCard) {
      return (
        <div key={i} className="ucb-sum-card">
          <div className="ucb-sum-eyebrow">Data Summary</div>
          <h3 className="ucb-sum-title">What I heard about your data</h3>
          {DATA_HEADERS.map((h) => (
            <div className="ucb-sum-section" key={h.key}>
              <div className="ucb-sum-h">{h.label}</div>
              <div className="ucb-sum-body">{parsed[h.key]}</div>
            </div>
          ))}
        </div>
      )
    }
    return (
      <div key={i} className="ucb-bubble claude">
        <div className="ucb-bubble-meta">Claude</div>
        {m.content}
        {stillStreaming && <span className="ucb-cursor" />}
      </div>
    )
  }

  return (
    <div className={`ucb-pane${active ? ' active' : ''}`}>
      <div className="ucb-step-eyebrow">Step 3 of 6</div>
      <h1 className="ucb-step-title">Data Discovery</h1>
      <p className="ucb-step-sub">A short conversation about what data your organization actually has — and what's usable. Claude will ask one question at a time and produce a summary when it has enough.</p>

      <div className="ucb-chat">
        <div className="ucb-chat-scroll" ref={scrollRef}>
          <div className="ucb-bubble claude">
            <div className="ucb-bubble-meta">Claude</div>
            {DATA_OPENER}
          </div>
          {chat.messages.map(renderMessage)}
        </div>

        {!hasKey && <div className="ucb-banner">Add your API key in the nav to start the conversation.</div>}
        {chat.error && <div className="ucb-banner">{friendlyError(chat.error)}</div>}

        {data.confirmed ? (
          <div className="ucb-cal-card">
            <div className="ucb-cal-row">
              <span className="ucb-cal-label" style={{ color: '#34d399' }}>✓ Summary saved</span>
            </div>
            <div className="ucb-cal-obs">You can keep typing to revise, or continue to Use Case.</div>
            <div className="ucb-footer">
              <button
                className="ucb-btn ghost"
                onClick={() => onChange({ ...data, confirmed: false })}
              >
                Revise
              </button>
              <button className="ucb-btn" onClick={onAdvance}>Continue →</button>
            </div>
          </div>
        ) : null}

        {!data.confirmed && (
          <div className="ucb-input-row2">
            <textarea
              className="ucb-chat-input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={hasKey ? 'Type your answer…  (Enter to send, Shift+Enter for newline)' : 'API key required'}
              disabled={!hasKey || chat.isStreaming}
            />
            <button
              className="ucb-btn"
              onClick={send}
              disabled={!hasKey || chat.isStreaming || !draft.trim()}
              style={{ alignSelf: 'stretch' }}
            >
              {chat.isStreaming ? '…' : 'Send'}
            </button>
          </div>
        )}

        {summaryReady && !data.confirmed && (
          <div className="ucb-footer">
            <span />
            <button className="ucb-btn" onClick={onConfirm}>Looks right — save summary</button>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Step 4: Use Case chat ──────────────────────────────────────────────── */
const USECASE_OPENER = "Now let's talk about what you want to build or improve. Describe the problem you're trying to solve — don't worry about whether it's an AI problem yet."

const USECASE_SYSTEM_PROMPT = `You are a candid, experienced AI advisor. You do not sugarcoat. If an idea is bad, say so directly and explain why. If it needs work, say exactly what's missing. If it's good, say so. Ask one question at a time. Be honest, direct, and constructive.

Probe these areas across the conversation: the actual pain point, the current process today, what they've already tried, and what success would look like. Do not suggest solutions until you understand the problem.

Your opening line "${USECASE_OPENER}" has already been delivered to the user. Do NOT greet them again. The first user message is their answer to that opener — respond by acknowledging briefly and asking the next focused question.

After sufficient back-and-forth (minimum 4 exchanges with the user), produce the Use Case Assessment. Format it in EXACTLY this form, no preamble, no closing remarks:

## Problem Statement
<2–3 sentences capturing the actual problem>

## Proposed Solution
<2–3 sentences describing what they want to build/do>

## Feasibility Verdict
<Start with exactly one of these tokens: "✅ Viable" / "⚠️ Needs Refinement" / "❌ Not a Good AI Use Case". Then give a direct 2–3 sentence explanation. Do not soften the verdict.>

## What's Missing
<2–4 sentences naming exactly what's missing if the verdict is not Viable. If Viable with no gaps, say so plainly in one sentence.>

## Refined Recommendation
<2–4 sentences. Concrete and actionable — what should they actually do next, given everything you know.>

Until you produce the assessment, keep asking one question at a time.`

const USECASE_HEADERS = [
  { key: 'problem',        label: 'Problem Statement' },
  { key: 'solution',       label: 'Proposed Solution' },
  { key: 'verdict',        label: 'Feasibility Verdict' },
  { key: 'missing',        label: "What's Missing" },
  { key: 'recommendation', label: 'Refined Recommendation' },
]

function UseCasePane({ active, data, onChange, onAdvance, hasKey }) {
  const chat = useChat({ tier: 'user', systemPrompt: USECASE_SYSTEM_PROMPT })
  const [draft, setDraft] = useState('')
  const scrollRef = useRef(null)

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [chat.messages, chat.isStreaming])

  const send = () => {
    const text = draft.trim()
    if (!text || chat.isStreaming || !hasKey) return
    chat.sendMessage(text)
    setDraft('')
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const lastMsg = chat.messages[chat.messages.length - 1]
  const lastIsCompleteAssistant = lastMsg?.role === 'assistant' && !chat.isStreaming
  const parsedLatest = lastIsCompleteAssistant ? parseStructuredSummary(lastMsg.content, USECASE_HEADERS) : null
  const summaryReady = parsedLatest && hasAllSections(parsedLatest, USECASE_HEADERS)

  const onConfirm = () => {
    if (!summaryReady) return
    onChange({ ...data, assessment: parsedLatest, confirmed: true })
  }

  const renderMessage = (m, i) => {
    if (m.role === 'user') {
      return (
        <div key={i} className="ucb-bubble user">
          <div className="ucb-bubble-meta">You</div>
          {m.content}
        </div>
      )
    }
    const isLast = i === chat.messages.length - 1
    const stillStreaming = isLast && chat.isStreaming
    const parsed = !stillStreaming ? parseStructuredSummary(m.content, USECASE_HEADERS) : null
    const renderAsCard = parsed && hasAllSections(parsed, USECASE_HEADERS)
    if (renderAsCard) {
      return (
        <div key={i} className="ucb-sum-card">
          <div className="ucb-sum-eyebrow">Use Case Assessment</div>
          <h3 className="ucb-sum-title">Honest read on your idea</h3>
          {USECASE_HEADERS.map((h) => (
            <div className={`ucb-sum-section${h.key === 'verdict' ? ' verdict' : ''}`} key={h.key}>
              <div className="ucb-sum-h">{h.label}</div>
              <div className="ucb-sum-body">{parsed[h.key]}</div>
            </div>
          ))}
        </div>
      )
    }
    return (
      <div key={i} className="ucb-bubble claude">
        <div className="ucb-bubble-meta">Claude</div>
        {m.content}
        {stillStreaming && <span className="ucb-cursor" />}
      </div>
    )
  }

  return (
    <div className={`ucb-pane${active ? ' active' : ''}`}>
      <div className="ucb-step-eyebrow">Step 4 of 6</div>
      <h1 className="ucb-step-title">Use Case</h1>
      <p className="ucb-step-sub">Describe what you want to build. Claude will probe, then give you an honest read — including telling you when an idea isn't a good AI use case.</p>

      <div className="ucb-chat">
        <div className="ucb-chat-scroll" ref={scrollRef}>
          <div className="ucb-bubble claude">
            <div className="ucb-bubble-meta">Claude</div>
            {USECASE_OPENER}
          </div>
          {chat.messages.map(renderMessage)}
        </div>

        {!hasKey && <div className="ucb-banner">Add your API key in the nav to start the conversation.</div>}
        {chat.error && <div className="ucb-banner">{friendlyError(chat.error)}</div>}

        {data.confirmed ? (
          <div className="ucb-cal-card">
            <div className="ucb-cal-row">
              <span className="ucb-cal-label" style={{ color: '#34d399' }}>✓ Assessment saved</span>
            </div>
            <div className="ucb-cal-obs">You can keep typing to revise, or continue to Your Path.</div>
            <div className="ucb-footer">
              <button
                className="ucb-btn ghost"
                onClick={() => onChange({ ...data, confirmed: false })}
              >
                Revise
              </button>
              <button className="ucb-btn" onClick={onAdvance}>Continue →</button>
            </div>
          </div>
        ) : null}

        {!data.confirmed && (
          <div className="ucb-input-row2">
            <textarea
              className="ucb-chat-input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={hasKey ? 'Type your answer…  (Enter to send, Shift+Enter for newline)' : 'API key required'}
              disabled={!hasKey || chat.isStreaming}
            />
            <button
              className="ucb-btn"
              onClick={send}
              disabled={!hasKey || chat.isStreaming || !draft.trim()}
              style={{ alignSelf: 'stretch' }}
            >
              {chat.isStreaming ? '…' : 'Send'}
            </button>
          </div>
        )}

        {summaryReady && !data.confirmed && (
          <div className="ucb-footer">
            <span />
            <button className="ucb-btn" onClick={onConfirm}>Save assessment</button>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Step 5: Your Path ──────────────────────────────────────────────────── */
const PATH_SYSTEM_PROMPT = `You are a senior AI advisor making a binary recommendation: should this person learn more before building, or are they ready to build now?

You will be given their profile, calibrated skill level, data situation, and use case assessment. Use ALL of it. Reference their actual situation in your reasoning, not generic advice.

Decision guidance (apply judgment, not blind rules):
- "Learn First" — skill is Beginner, OR the use case verdict is Not Viable / Needs Refinement, OR the data summary surfaced gaps that would block building.
- "Go Build" — skill is Intermediate or higher AND the use case is Viable AND the data is workable.
- "Both" — they can start building but should learn a specific topic in parallel because it will materially affect quality or risk.

Respond in EXACTLY this format. Omit sections that don't apply. No preamble, no closing remarks.

## Recommendation
<exactly one of: Learn First, Go Build, Both>

## Why
<1–2 sentences. Reference their actual role, use case, data, and assessment. Concrete, not generic.>

## Learn First Topics
<Only include if recommendation is "Learn First" or "Both". 3–4 topics, each on its own line as:
- **Topic name**: 1 sentence on why it matters for THEIR specific use case.>

## Build Readiness Note
<Only include if recommendation is "Go Build" or "Both". 2–3 sentences on why they're ready and what the main challenge will be.>`

const PATH_HEADERS = [
  { key: 'recommendation', label: 'Recommendation' },
  { key: 'why',            label: 'Why' },
  { key: 'topics',         label: 'Learn First Topics' },
  { key: 'buildNote',      label: 'Build Readiness Note' },
]

function buildSessionContext(session, { includePath = false } = {}) {
  const { profile, skillLevel, dataDiscovery, useCase, path } = session
  const effectiveLevel = skillLevel.calibrated || skillLevel.selfReported || 'Unknown'

  const dataSummary = dataDiscovery.summary
    ? [
        `## Data Types\n${dataDiscovery.summary.dataTypes || ''}`,
        `## Quality Assessment\n${dataDiscovery.summary.quality || ''}`,
        `## Key Constraints\n${dataDiscovery.summary.constraints || ''}`,
        `## Opportunity Signals\n${dataDiscovery.summary.opportunities || ''}`,
      ].join('\n\n')
    : '(no data summary captured)'

  const useCaseAssessment = useCase.assessment
    ? [
        `## Problem Statement\n${useCase.assessment.problem || ''}`,
        `## Proposed Solution\n${useCase.assessment.solution || ''}`,
        `## Feasibility Verdict\n${useCase.assessment.verdict || ''}`,
        `## What's Missing\n${useCase.assessment.missing || ''}`,
        `## Refined Recommendation\n${useCase.assessment.recommendation || ''}`,
      ].join('\n\n')
    : '(no use case assessment captured)'

  const pathBlock = includePath && path?.recommendation
    ? [
        '',
        '# PATH RECOMMENDATION',
        `Kind: ${path.recommendation.kind || 'unknown'}`,
        path.recommendation.why ? `Why: ${path.recommendation.why}` : null,
      ].filter(Boolean).join('\n')
    : ''

  return [
    '# PROFILE',
    `Role: ${profile.role || '—'}`,
    `Industry: ${profile.industry || '—'}`,
    `Company size: ${profile.size || '—'}`,
    profile.business ? `Business description: ${profile.business}` : null,
    '',
    '# SKILL LEVEL',
    `Self-reported: ${skillLevel.selfReported || '—'}`,
    `Calibrated: ${skillLevel.calibrated || '(not assessed — Beginner skip path)'}`,
    skillLevel.observation ? `Calibration observation: ${skillLevel.observation}` : null,
    `Effective level: ${effectiveLevel}`,
    '',
    '# DATA SITUATION',
    dataSummary,
    '',
    '# USE CASE ASSESSMENT',
    useCaseAssessment,
    pathBlock,
  ].filter(Boolean).join('\n')
}

function buildPathContext(session) {
  return buildSessionContext(session) + '\n\nNow produce the path recommendation in the required format.'
}

function buildBuildContext(session) {
  return buildSessionContext(session, { includePath: true }) + '\n\nNow produce the build guidance in the required format.'
}

function detectPathKind(recommendationText) {
  if (!recommendationText) return null
  const lower = recommendationText.toLowerCase()
  if (lower.includes('both')) return 'both'
  if (lower.includes('learn')) return 'learn'
  if (lower.includes('build')) return 'build'
  return null
}

function PathPane({ active, data, onChange, session, onAdvance, markComplete, hasKey }) {
  const chat = useChat({ tier: 'user', systemPrompt: PATH_SYSTEM_PROMPT })
  const wasStreamingRef = useRef(false)

  const lastMsg = chat.messages[chat.messages.length - 1]
  const lastAssistant = lastMsg?.role === 'assistant' ? lastMsg.content : ''

  // When streaming finishes, parse and persist.
  useEffect(() => {
    if (wasStreamingRef.current && !chat.isStreaming) {
      if (lastAssistant) {
        const parsed = parseStructuredSummary(lastAssistant, PATH_HEADERS)
        const kind = detectPathKind(parsed.recommendation)
        if (parsed.recommendation && kind) {
          onChange({ ...data, recommendation: { ...parsed, kind } })
        }
      }
    }
    wasStreamingRef.current = chat.isStreaming
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat.isStreaming])

  const generate = () => {
    if (!hasKey || chat.isStreaming) return
    chat.reset()
    chat.sendMessage(buildPathContext(session))
  }

  const regenerate = () => {
    onChange({ ...data, recommendation: null })
    generate()
  }

  const onLearnClick = () => { markComplete() }
  const onBuildClick = () => { onAdvance() }

  const hasResult = data.recommendation
  const evaluating = chat.isStreaming

  // Pre-flight check — make sure prior steps populated their data.
  const ready = session.profile.role && session.useCase.assessment

  return (
    <div className={`ucb-pane${active ? ' active' : ''}`}>
      <div className="ucb-step-eyebrow">Step 5 of 6</div>
      <h1 className="ucb-step-title">Your Path</h1>
      <p className="ucb-step-sub">Based on everything you've shared so far — your profile, skill level, data, and use case — Claude will recommend whether to learn more first or to start building.</p>

      {!hasResult && !evaluating && (
        <>
          {!ready && (
            <div className="ucb-banner">Complete the prior steps first so the recommendation has something to work with.</div>
          )}
          {!hasKey && (
            <div className="ucb-banner">Add your API key in the nav to generate the recommendation.</div>
          )}
          {chat.error && <div className="ucb-banner">{friendlyError(chat.error)}</div>}
          <div className="ucb-footer">
            <span />
            <button
              className="ucb-btn"
              disabled={!ready || !hasKey}
              onClick={generate}
            >
              Generate Path Recommendation
            </button>
          </div>
        </>
      )}

      {evaluating && (
        <div className="ucb-cal-card">
          <div className="ucb-cal-row">
            <span className="ucb-cal-label">Working on it</span>
          </div>
          <div className="ucb-cal-stream">
            {lastAssistant || "Reading everything you've shared…"}
            <span className="ucb-cursor" />
          </div>
        </div>
      )}

      {hasResult && !evaluating && <PathResult rec={data.recommendation} onLearn={onLearnClick} onBuild={onBuildClick} onRegenerate={regenerate} />}
    </div>
  )
}

function PathResult({ rec, onLearn, onBuild, onRegenerate }) {
  const showLearn = rec.kind === 'learn' || rec.kind === 'both'
  const showBuild = rec.kind === 'build' || rec.kind === 'both'
  const twoUp = showLearn && showBuild

  return (
    <>
      {rec.why && <div className="ucb-path-why">{rec.why}</div>}

      <div className={`ucb-path-grid${twoUp ? ' two' : ''}`}>
        {showLearn && (
          <div className="ucb-path-card learn">
            <div className="ucb-path-eyebrow">Path A · Learn First</div>
            <h3 className="ucb-path-title">Build the foundation</h3>
            <div className="ucb-path-body">{rec.topics || 'Topics will appear here.'}</div>
            <Link to="/" className="ucb-path-cta" onClick={onLearn}>Build Your Course →</Link>
          </div>
        )}
        {showBuild && (
          <div className="ucb-path-card build">
            <div className="ucb-path-eyebrow">Path B · Go Build</div>
            <h3 className="ucb-path-title">You're ready to start</h3>
            <div className="ucb-path-body">{rec.buildNote || 'Readiness note will appear here.'}</div>
            <button type="button" className="ucb-path-cta" onClick={onBuild}>Get Build Guidance →</button>
          </div>
        )}
      </div>

      <div className="ucb-footer">
        <button className="ucb-btn ghost" onClick={onRegenerate}>Regenerate</button>
        <span />
      </div>
    </>
  )
}

/* ── Step 6: Build Guidance ─────────────────────────────────────────────── */
const BUILD_SYSTEM_PROMPT = `You are a senior AI product advisor. Based on everything you know about this person — their role, industry, business, calibrated skill level, data, use case, and path recommendation — generate practical build guidance. Be specific to their use case. No generic advice.

Respond in EXACTLY this format. Every section is required. No preamble, no closing remarks.

## Problem Statement
<1 tight paragraph (3–5 sentences) they can paste into any AI tool to explain what they're building. Self-contained — must make sense without other context.>

## Recommended Tool Stack
<3–4 tools, each on its own line as a markdown bullet:
- **Tool name**: 1-line reason WHY this tool fits THEIR use case (specific, not generic).>

## Starter Prompts
<3–5 numbered prompts they can paste into Claude or ChatGPT and get useful work done on their use case. Reference their actual data, their domain, their goal. Each prompt should be substantive (not one-liners).>

## Key Decisions Before You Start
<3–5 bullets. Decisions they need to make BEFORE writing code — e.g. data privacy posture, hosted vs self-host, eval criteria, success metric, who owns the output. Specific to them.>

## Definition of Done (v1)
<2–4 sentences in plain language. What does a successful first version look like? What can they show a stakeholder? Concrete and demoable, not aspirational.>

## Mockup
\`\`\`html
<Complete self-contained HTML page that shows what their solution UI could look like. Dark theme, professional, realistic. Use only inline <style> CSS — no external dependencies, no CDN imports. Include realistic placeholder content drawn from their use case. Aim for about 80–150 lines of HTML/CSS. Make it look like a real product, not a wireframe.>
\`\`\``

const BUILD_HEADERS = [
  { key: 'problem',   label: 'Problem Statement' },
  { key: 'stack',     label: 'Recommended Tool Stack' },
  { key: 'prompts',   label: 'Starter Prompts' },
  { key: 'decisions', label: 'Key Decisions Before You Start' },
  { key: 'dod',       label: 'Definition of Done' },
]

function extractMockupHtml(text) {
  if (!text) return ''
  const m = text.match(/```html\s*([\s\S]+?)```/i)
  return m ? m[1].trim() : ''
}

function BuildPane({ active, data, onChange, session, markComplete, hasKey }) {
  const chat = useChat({ tier: 'user', systemPrompt: BUILD_SYSTEM_PROMPT })
  const wasStreamingRef = useRef(false)

  const lastMsg = chat.messages[chat.messages.length - 1]
  const lastAssistant = lastMsg?.role === 'assistant' ? lastMsg.content : ''

  useEffect(() => {
    if (wasStreamingRef.current && !chat.isStreaming) {
      if (lastAssistant) {
        const sections = parseStructuredSummary(lastAssistant, BUILD_HEADERS)
        const mockupHtml = extractMockupHtml(lastAssistant)
        // require at least the prose sections to be present
        if (hasAllSections(sections, BUILD_HEADERS)) {
          onChange({ ...data, sections, mockupHtml })
          markComplete()
        }
      }
    }
    wasStreamingRef.current = chat.isStreaming
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat.isStreaming])

  const generate = () => {
    if (!hasKey || chat.isStreaming) return
    chat.reset()
    chat.sendMessage(buildBuildContext(session))
  }

  const regenerate = () => {
    onChange({ ...data, sections: null, mockupHtml: null })
    generate()
  }

  const evaluating = chat.isStreaming
  const ready = session.useCase.assessment // sufficient prior context

  return (
    <div className={`ucb-pane${active ? ' active' : ''}`}>
      <div className="ucb-step-eyebrow">Step 6 of 6</div>
      <h1 className="ucb-step-title">Build Guidance</h1>
      <p className="ucb-step-sub">A concrete starter kit for your use case — problem statement, tool stack, prompts, decisions, and a mockup of what your solution UI could look like.</p>

      {!data.sections && !evaluating && (
        <>
          {!ready && <div className="ucb-banner">Complete the prior steps first.</div>}
          {!hasKey && <div className="ucb-banner">Add your API key in the nav to generate the guidance.</div>}
          {chat.error && <div className="ucb-banner">{friendlyError(chat.error)}</div>}
          <div className="ucb-footer">
            <span />
            <button
              className="ucb-btn"
              disabled={!ready || !hasKey}
              onClick={generate}
            >
              Generate Build Guidance
            </button>
          </div>
        </>
      )}

      {evaluating && (
        <div className="ucb-cal-card">
          <div className="ucb-cal-row">
            <span className="ucb-cal-label">Generating</span>
          </div>
          <div className="ucb-cal-stream">
            {lastAssistant
              ? `${lastAssistant.length.toLocaleString()} chars streamed…`
              : 'Assembling your starter kit…'}
            <span className="ucb-cursor" />
          </div>
        </div>
      )}

      {data.sections && !evaluating && (
        <>
          {BUILD_HEADERS.map((h) => (
            <BuildCard key={h.key} title={h.label} body={data.sections[h.key]} />
          ))}
          <BuildMockup html={data.mockupHtml} />
          <div className="ucb-footer">
            <button className="ucb-btn ghost" onClick={regenerate}>Regenerate</button>
            <span />
          </div>
        </>
      )}
    </div>
  )
}

function BuildCard({ title, body }) {
  const [copied, setCopied] = useState(false)
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(body || '')
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch {
      // ignore
    }
  }
  return (
    <div className="ucb-build-card">
      <div className="ucb-build-card-head">
        <h3 className="ucb-build-card-title">{title}</h3>
        <button className={`ucb-copy-btn${copied ? ' copied' : ''}`} onClick={onCopy}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="ucb-build-card-body">{body}</div>
    </div>
  )
}

function BuildMockup({ html }) {
  if (!html) {
    return (
      <div className="ucb-mockup-card">
        <div className="ucb-mockup-head">
          <h3 className="ucb-mockup-title">Mockup</h3>
        </div>
        <div className="ucb-mockup-fallback">Claude didn't return a mockup this time. Try Regenerate.</div>
      </div>
    )
  }

  const openFullScreen = () => {
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank', 'noopener,noreferrer')
    setTimeout(() => URL.revokeObjectURL(url), 60_000)
  }

  return (
    <div className="ucb-mockup-card">
      <div className="ucb-mockup-head">
        <h3 className="ucb-mockup-title">Mockup</h3>
        <button className="ucb-mockup-link" onClick={openFullScreen}>Open in full screen ↗</button>
      </div>
      <iframe
        className="ucb-mockup-frame"
        title="Solution UI mockup"
        srcDoc={html}
        sandbox="allow-scripts"
      />
    </div>
  )
}

/* ── Stub for unbuilt steps ─────────────────────────────────────────────── */
function StubPane({ active, num, title }) {
  return (
    <div className={`ucb-pane${active ? ' active' : ''}`}>
      <div className="ucb-step-eyebrow">Step {num} of 6</div>
      <h1 className="ucb-step-title">{title}</h1>
      <div className="ucb-stub">Coming next — this step is being built in a later phase.</div>
    </div>
  )
}
