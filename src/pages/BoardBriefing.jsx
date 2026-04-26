import { useState, useMemo } from 'react'
import NavBar from '../components/NavBar.jsx'
import { useApiKey } from '../hooks/useApiKey.js'
import { useChat } from '../hooks/useChat.js'

const css = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap');

.bb-root { min-height: 100vh; background: #050810; color: #e0e8f0; font-family: 'IBM Plex Mono', monospace; overflow-x: hidden; }

.bb-hero { text-align: center; padding: 48px 24px 28px; position: relative; }
.bb-hero::before { content: ''; position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 700px; height: 320px; background: radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.12) 0%, transparent 70%); pointer-events: none; }
.bb-eyebrow { font-size: 16px; letter-spacing: 0.22em; color: #c9a84c; text-transform: uppercase; margin-bottom: 14px; position: relative; }
.bb-title { font-family: 'IBM Plex Sans', sans-serif; font-size: clamp(28px, 5vw, 52px); font-weight: 800; letter-spacing: -0.02em; color: #fff; line-height: 1.05; margin-bottom: 12px; position: relative; }
.bb-title span { color: #c9a84c; }
.bb-subtitle { font-size: 16px; color: #8a7a5a; max-width: 580px; margin: 0 auto 32px; line-height: 1.8; position: relative; }

.bb-tabs { display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; padding: 0 16px 32px; }
.bb-tab { background: transparent; border: 1px solid #2a2418; color: #8a7a5a; font-family: 'IBM Plex Mono', monospace; font-size: 16px; letter-spacing: 0.1em; padding: 8px 16px; border-radius: 6px; cursor: pointer; transition: all 0.18s; text-transform: uppercase; }
.bb-tab:hover { border-color: #c9a84c; color: #c9a84c; }
.bb-tab.active { background: rgba(201,168,76,0.1); border-color: #c9a84c; color: #c9a84c; }

.bb-panel { max-width: 920px; margin: 0 auto; padding: 0 20px 80px; }
.bb-section-title { font-family: 'IBM Plex Sans', sans-serif; font-size: 22px; font-weight: 700; color: #fff; margin-bottom: 8px; }
.bb-section-sub { font-size: 16px; color: #8a7a5a; margin-bottom: 28px; line-height: 1.8; }

.bb-card { background: #0c0a06; border: 1px solid #1f1a12; border-radius: 14px; padding: 24px; margin-bottom: 20px; }
.bb-card h3 { font-family: 'IBM Plex Sans', sans-serif; font-size: 16px; font-weight: 700; color: #c9a84c; margin: 0 0 12px; }
.bb-card p { font-size: 16px; color: #b8a888; line-height: 1.7; margin: 0 0 10px; }
.bb-card ul { margin: 0; padding-left: 20px; color: #b8a888; line-height: 1.8; font-size: 16px; }
.bb-card li { margin-bottom: 6px; }

/* ── Form ── */
.bb-form { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.bb-field { display: flex; flex-direction: column; gap: 6px; }
.bb-field.full { grid-column: 1 / -1; }
.bb-label { font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #8a7a5a; }
.bb-input, .bb-select, .bb-textarea {
  font-family: 'IBM Plex Mono', monospace; font-size: 14px; color: #e0e8f0;
  background: #050810; border: 1px solid #2a2418; border-radius: 8px;
  padding: 10px 12px; outline: none; transition: border-color 0.18s; width: 100%; box-sizing: border-box;
}
.bb-input:focus, .bb-select:focus, .bb-textarea:focus { border-color: #c9a84c; }
.bb-textarea { min-height: 80px; resize: vertical; line-height: 1.6; }
.bb-select { appearance: none; background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='%238a7a5a' d='M0 0l5 6 5-6z'/></svg>"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 32px; }

.bb-actions { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; margin-top: 18px; }
.bb-btn { font-family: 'IBM Plex Mono', monospace; font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase; padding: 10px 18px; border-radius: 8px; border: 1px solid #c9a84c; background: rgba(201,168,76,0.12); color: #c9a84c; cursor: pointer; transition: all 0.18s; }
.bb-btn:hover:not(:disabled) { background: rgba(201,168,76,0.2); border-color: #e8c96e; color: #e8c96e; }
.bb-btn:disabled { opacity: 0.45; cursor: not-allowed; }
.bb-btn.secondary { background: transparent; border-color: #2a2418; color: #8a7a5a; }
.bb-btn.secondary:hover:not(:disabled) { border-color: #c9a84c; color: #c9a84c; }

.bb-warn { margin-top: 14px; font-size: 13px; padding: 12px 14px; border-radius: 8px; background: rgba(248,113,113,0.06); border: 1px solid rgba(248,113,113,0.25); color: #f87171; line-height: 1.6; }
.bb-warn a { color: #f87171; text-decoration: underline; }
.bb-err { margin-top: 14px; font-size: 13px; padding: 12px 14px; border-radius: 8px; background: rgba(248,113,113,0.06); border: 1px solid rgba(248,113,113,0.25); color: #f87171; }

/* ── Output cards ── */
.bb-output { margin-top: 28px; display: flex; flex-direction: column; gap: 14px; }
.bb-out-card {
  border-radius: 14px; padding: 22px 24px; border: 1px solid;
  opacity: 0; transform: translateY(8px);
  transition: opacity 0.5s ease, transform 0.5s ease;
  background: #0c0a06;
}
.bb-out-card.visible { opacity: 1; transform: translateY(0); }
.bb-out-card h3 { font-family: 'IBM Plex Sans', sans-serif; font-size: 18px; font-weight: 700; margin: 0 0 12px; letter-spacing: -0.01em; }
.bb-out-body { font-size: 16px; line-height: 1.75; color: #d8c8a8; white-space: pre-wrap; }
.bb-out-card.gold   { border-color: rgba(201,168,76,0.4); background: linear-gradient(180deg, rgba(201,168,76,0.05), rgba(12,10,6,1) 80%); }
.bb-out-card.gold h3   { color: #c9a84c; }
.bb-out-card.rose   { border-color: rgba(240,128,128,0.4); background: linear-gradient(180deg, rgba(240,128,128,0.05), rgba(12,10,6,1) 80%); }
.bb-out-card.rose h3   { color: #f08080; }
.bb-out-card.rose .bb-out-body { color: #e6c0c0; }
.bb-out-card.teal   { border-color: rgba(78,201,176,0.4); background: linear-gradient(180deg, rgba(78,201,176,0.05), rgba(12,10,6,1) 80%); }
.bb-out-card.teal h3   { color: #4ec9b0; }
.bb-out-card.teal .bb-out-body { color: #b8e0d4; }

.bb-cursor { display: inline-block; width: 7px; height: 14px; background: currentColor; opacity: 0.7; margin-left: 2px; vertical-align: -2px; animation: bb-blink 1s infinite; }
@keyframes bb-blink { 0%, 50% { opacity: 0.7; } 50.01%, 100% { opacity: 0; } }

.bb-after-actions { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 8px; }

@media print {
  .bb-tabs, .bb-form, .bb-actions, .bb-after-actions, .nav-bar, .bb-hero, .bb-warn, .bb-err { display: none !important; }
  .bb-root, .bb-panel { background: #fff !important; color: #111 !important; padding: 0 !important; max-width: none !important; }
  .bb-out-card { opacity: 1 !important; transform: none !important; background: #fff !important; border-color: #ccc !important; page-break-inside: avoid; margin-bottom: 18px; box-shadow: none; }
  .bb-out-body { color: #222 !important; }
  .bb-out-card h3 { color: #000 !important; }
  .bb-cursor { display: none !important; }
}

/* ── Quiz ── */
.bb-quiz-q { font-family: 'IBM Plex Sans', sans-serif; font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 16px; line-height: 1.4; }
.bb-quiz-opts { display: flex; flex-direction: column; gap: 8px; }
.bb-quiz-opt { background: #0c0a06; border: 1px solid #1f1a12; border-radius: 8px; padding: 12px 16px; font-size: 16px; color: #b8a888; cursor: pointer; text-align: left; font-family: 'IBM Plex Mono', monospace; transition: all 0.18s; }
.bb-quiz-opt:hover:not(:disabled) { border-color: #c9a84c; color: #e0e8f0; }
.bb-quiz-opt.correct { border-color: #c9a84c; background: rgba(201,168,76,0.1); color: #e8c96e; }
.bb-quiz-opt.wrong   { border-color: #ef4444; background: rgba(239,68,68,0.06); color: #f87171; }
.bb-quiz-exp { margin-top: 14px; padding: 12px; background: rgba(201,168,76,0.05); border: 1px solid rgba(201,168,76,0.18); border-radius: 8px; font-size: 16px; color: #b8a888; line-height: 1.7; }
.bb-quiz-next { margin-top: 12px; background: rgba(201,168,76,0.1); border: 1px solid #c9a84c; color: #c9a84c; font-family: 'IBM Plex Mono', monospace; font-size: 14px; padding: 9px 18px; border-radius: 6px; cursor: pointer; letter-spacing: 0.08em; text-transform: uppercase; transition: all 0.18s; }
.bb-quiz-next:hover { background: rgba(201,168,76,0.2); }
.bb-progress { background: #0c0a06; border-radius: 100px; height: 4px; margin-bottom: 20px; overflow: hidden; }
.bb-progress-fill { height: 100%; background: linear-gradient(90deg, #c9a84c, #e8c96e); border-radius: 100px; transition: width 0.4s; }
.bb-score-num { font-family: 'IBM Plex Sans', sans-serif; font-size: 64px; font-weight: 800; color: #c9a84c; text-align: center; }

@media (max-width: 640px) {
  .bb-form { grid-template-columns: 1fr; }
}
`

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'generate', label: 'Generate Brief' },
  { id: 'quality',  label: 'What Makes a Good Brief' },
  { id: 'quiz',     label: 'Quiz' },
]

const INDUSTRIES = ['Financial Services', 'Healthcare', 'Retail', 'Manufacturing', 'Professional Services', 'Other']
const SIZES = ['50–200', '200–1000', '1000–5000', '5000+']

const SYSTEM_PROMPT = `You are an AI transformation advisor writing a board-ready executive brief. Write in a precise, confident, executive tone. Use the company details provided. Format your response in exactly 4 sections with these exact headers: ## Q1 AI Transformation Summary, ## Key Risks Requiring Board Attention, ## Strategic Recommendations, ## Financial Outlook. Be specific — use the company name, reference their initiatives, give concrete numbers and timeframes. Keep each section to 3–5 sentences.`

const SECTION_DEFS = [
  { key: 'summary',         match: 'q1 ai transformation summary',          label: 'Q1 AI Transformation Summary',     tone: 'gold' },
  { key: 'risks',           match: 'key risks requiring board attention',   label: 'Key Risks Requiring Board Attention', tone: 'rose' },
  { key: 'recommendations', match: 'strategic recommendations',             label: 'Strategic Recommendations',        tone: 'teal' },
  { key: 'financial',       match: 'financial outlook',                     label: 'Financial Outlook',                tone: 'gold' },
]

function parseSections(text) {
  const out = { summary: '', risks: '', recommendations: '', financial: '' }
  if (!text) return out
  const headerRegex = /^##\s+(.+)$/gm
  const matches = []
  let m
  while ((m = headerRegex.exec(text)) !== null) {
    const headerText = m[1].trim().toLowerCase()
    const def = SECTION_DEFS.find((d) => headerText.startsWith(d.match))
    if (def) matches.push({ key: def.key, start: m.index + m[0].length })
  }
  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].start
    const next = text.indexOf('\n##', start)
    const sliceEnd = next === -1 ? text.length : next
    out[matches[i].key] = text.slice(start, sliceEnd).replace(/^\s*\n/, '').replace(/\s+$/, '')
  }
  return out
}

const QUIZ = [
  {
    q: 'When briefing a board on an AI initiative, what should the opening lead with?',
    opts: [
      'A technical architecture diagram',
      'The strategic outcome and the dollar impact',
      'A list of every model and tool being used',
      'A vendor comparison matrix',
    ],
    answer: 1,
    exp: 'Boards optimize for outcomes and capital allocation. Lead with the strategic result and the financial impact — technical detail goes in the appendix, not the lede.',
  },
  {
    q: 'Which is the most common failure mode in AI board briefings?',
    opts: [
      'Too few KPIs',
      'Excessive technical jargon and missing ROI framing',
      'Reports that are too short',
      'Including financial figures',
    ],
    answer: 1,
    exp: 'The classic mistake is treating the board like an engineering review. Boards need risk, ROI, and governance — not transformer architecture.',
  },
  {
    q: 'What governance structure is widely recommended for enterprise AI?',
    opts: [
      'A single AI executive with full authority',
      'Each business unit acting independently',
      'A cross-functional AI steering committee with risk, legal, and business leaders',
      'External vendor oversight only',
    ],
    answer: 2,
    exp: 'AI risk cuts across legal, security, ethics, and operations. A cross-functional steering committee is the standard governance pattern because no single function owns all the failure modes.',
  },
  {
    q: 'Which of these belongs in the "Key Risks" section of an AI board brief?',
    opts: [
      'The exact prompt template used in production',
      'Regulatory exposure, data leakage risk, and model failure modes with mitigations',
      'A list of vendors evaluated',
      'Engineering velocity metrics',
    ],
    answer: 1,
    exp: 'Boards need risk framed in business terms with mitigation plans — regulatory, data, and operational. Implementation specifics belong in working group materials.',
  },
  {
    q: 'How often should a board receive a substantive AI briefing in a fast-moving program?',
    opts: [
      'Annually, at the strategic offsite',
      'Only when something breaks',
      'At least quarterly, with interim updates on material risk events',
      'Monthly, with full technical detail',
    ],
    answer: 2,
    exp: 'Quarterly cadence is the practical floor for active AI programs, with out-of-cycle updates when material risks materialize. Annual is too slow; monthly tends to drown signal in noise.',
  },
]

function buildUserMessage(form) {
  const lines = [
    `Company Name: ${form.company || '—'}`,
    `Industry: ${form.industry || '—'}`,
    `Company Size: ${form.size || '—'}`,
    `Current AI Initiatives: ${form.initiatives || '—'}`,
    `Biggest AI Risk or Concern: ${form.risk || '—'}`,
    `AI Budget Invested to Date: ${form.budget || 'Not provided'}`,
    '',
    'Write the board brief now using the four required section headers.',
  ]
  return lines.join('\n')
}

export default function BoardBriefing() {
  const [tab, setTab] = useState('overview')
  return (
    <div className="bb-root">
      <style>{css}</style>
      <NavBar />
      <header className="bb-hero">
        <div className="bb-eyebrow">Executive AI</div>
        <h1 className="bb-title">Board Briefing <span>Generator</span></h1>
        <p className="bb-subtitle">Turn your AI initiative data into a board-ready executive brief in seconds.</p>
      </header>

      <div className="bb-tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`bb-tab${tab === t.id ? ' active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <main className="bb-panel">
        {tab === 'overview' && <OverviewPanel />}
        {tab === 'generate' && <GeneratePanel />}
        {tab === 'quality' && <QualityPanel />}
        {tab === 'quiz' && <QuizPanel />}
      </main>
    </div>
  )
}

function OverviewPanel() {
  return (
    <>
      <h2 className="bb-section-title">What is an AI Board Brief?</h2>
      <p className="bb-section-sub">A short, executive-grade document that translates your AI program into the language a board of directors uses: outcomes, risks, capital, and governance.</p>

      <div className="bb-card">
        <h3>Why boards need one</h3>
        <p>Most boards are now expected to oversee AI as a material strategic and risk topic. Without a structured briefing, AI shows up as either a bullet on the CEO update or an emergency on the audit agenda — neither is useful for steering the program.</p>
      </div>

      <div className="bb-card">
        <h3>What good ones include</h3>
        <ul>
          <li><strong>A bottom-line summary</strong> — what changed, what's working, what's at risk.</li>
          <li><strong>Material risks</strong> framed in business terms (regulatory, data, reputational), each with a mitigation owner.</li>
          <li><strong>Strategic recommendations</strong> the board can actually decide on — invest, pause, escalate, or stay the course.</li>
          <li><strong>Financial outlook</strong> — spend to date, expected return, and the next funding decision.</li>
          <li><strong>Governance hooks</strong> — who is accountable, what cadence the board sees next.</li>
        </ul>
      </div>

      <div className="bb-card">
        <h3>What to leave out</h3>
        <ul>
          <li>Model names, parameter counts, prompt templates.</li>
          <li>Vendor comparison spreadsheets.</li>
          <li>Engineering velocity charts.</li>
          <li>Anything that requires a glossary to read.</li>
        </ul>
      </div>
    </>
  )
}

function GeneratePanel() {
  const { hasKey } = useApiKey()
  const [form, setForm] = useState({ company: '', industry: '', size: '', initiatives: '', risk: '', budget: '' })
  const { messages, isStreaming, error, sendMessage, reset } = useChat({ tier: 'user', systemPrompt: SYSTEM_PROMPT })

  const lastAssistant = messages[messages.length - 1]?.role === 'assistant' ? messages[messages.length - 1].content : ''
  const sections = useMemo(() => parseSections(lastAssistant), [lastAssistant])

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const canSubmit =
    hasKey &&
    !isStreaming &&
    form.company.trim() &&
    form.industry &&
    form.size &&
    form.initiatives.trim() &&
    form.risk.trim()

  const onGenerate = () => {
    if (!canSubmit) return
    reset()
    sendMessage(buildUserMessage(form))
  }

  const onCopy = async () => {
    const md = SECTION_DEFS
      .map((d) => sections[d.key] ? `## ${d.label}\n\n${sections[d.key]}` : null)
      .filter(Boolean)
      .join('\n\n')
    try { await navigator.clipboard.writeText(md || lastAssistant) } catch {}
  }

  const showOutput = isStreaming || lastAssistant

  return (
    <>
      <h2 className="bb-section-title">Generate Brief</h2>
      <p className="bb-section-sub">Fill in your company details. The brief is generated by Claude and streamed live into the four board-ready sections below.</p>

      <div className="bb-card">
        <div className="bb-form">
          <div className="bb-field">
            <label className="bb-label" htmlFor="bb-company">Company Name</label>
            <input id="bb-company" className="bb-input" value={form.company} onChange={update('company')} placeholder="Acme Financial" />
          </div>
          <div className="bb-field">
            <label className="bb-label" htmlFor="bb-industry">Industry</label>
            <select id="bb-industry" className="bb-select" value={form.industry} onChange={update('industry')}>
              <option value="">Select…</option>
              {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div className="bb-field">
            <label className="bb-label" htmlFor="bb-size">Company Size</label>
            <select id="bb-size" className="bb-select" value={form.size} onChange={update('size')}>
              <option value="">Select…</option>
              {SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="bb-field">
            <label className="bb-label" htmlFor="bb-budget">AI Budget Invested to Date <span style={{ textTransform: 'none', color: '#5a4f38' }}>(optional)</span></label>
            <input id="bb-budget" className="bb-input" value={form.budget} onChange={update('budget')} placeholder="$2.4M" />
          </div>
          <div className="bb-field full">
            <label className="bb-label" htmlFor="bb-init">Current AI Initiatives</label>
            <textarea id="bb-init" className="bb-textarea" value={form.initiatives} onChange={update('initiatives')} placeholder="Customer-service copilot, document automation, internal RAG knowledge base…" />
          </div>
          <div className="bb-field full">
            <label className="bb-label" htmlFor="bb-risk">Biggest AI Risk or Concern</label>
            <textarea id="bb-risk" className="bb-textarea" value={form.risk} onChange={update('risk')} placeholder="Regulatory exposure, hallucinations in customer-facing channels, data leakage…" />
          </div>
        </div>

        <div className="bb-actions">
          <button className="bb-btn" onClick={onGenerate} disabled={!canSubmit}>
            {isStreaming ? 'Generating…' : 'Generate Board Brief'}
          </button>
          {showOutput && !isStreaming && (
            <button className="bb-btn secondary" onClick={reset}>Reset</button>
          )}
        </div>

        {!hasKey && (
          <div className="bb-warn">
            Add your API key to unlock this activity. Open the key icon in the top-right nav, paste your Anthropic key, and click Save.
          </div>
        )}
        {error && <div className="bb-err">Error: {error}</div>}
      </div>

      {showOutput && (
        <div className="bb-output">
          {SECTION_DEFS.map((def) => {
            const content = sections[def.key]
            const visible = !!content
            const isLastStreaming = isStreaming && visible && !sections[nextKeyAfter(def.key)]
            return (
              <div key={def.key} className={`bb-out-card ${def.tone}${visible ? ' visible' : ''}`}>
                <h3>{def.label}</h3>
                <div className="bb-out-body">
                  {content || (visible ? '' : '…')}
                  {isLastStreaming && <span className="bb-cursor" />}
                </div>
              </div>
            )
          })}

          {!isStreaming && lastAssistant && (
            <div className="bb-after-actions">
              <button className="bb-btn secondary" onClick={onCopy}>Copy</button>
              <button className="bb-btn secondary" onClick={() => window.print()}>Export to PDF</button>
            </div>
          )}
        </div>
      )}
    </>
  )
}

function nextKeyAfter(key) {
  const i = SECTION_DEFS.findIndex((d) => d.key === key)
  return SECTION_DEFS[i + 1]?.key
}

function QualityPanel() {
  return (
    <>
      <h2 className="bb-section-title">What Makes a Good Brief</h2>
      <p className="bb-section-sub">Executive communication is its own discipline. The same content can land as a clear strategic ask or a confusing technical update depending on framing.</p>

      <div className="bb-card">
        <h3>Lead with the answer</h3>
        <p>Open with the conclusion: what's working, what's at risk, what you need from the board. Boards read top-down — the first paragraph should be enough to act on if it's the only one they read.</p>
      </div>

      <div className="bb-card">
        <h3>Frame everything as a decision</h3>
        <p>Boards approve, fund, oversee, and challenge. Each recommendation should be phrased as something they can decide on — "approve $4M Phase 2 investment," "ratify new AI risk policy" — not as a status update.</p>
      </div>

      <div className="bb-card">
        <h3>Quantify or cut</h3>
        <p>"Significant improvement" is invisible at the board level. "31% reduction in handle time, $4.2M projected annual run-rate savings" lands. If you can't put a number on it, ask whether it belongs in the brief at all.</p>
      </div>

      <div className="bb-card">
        <h3>Common mistakes to avoid</h3>
        <ul>
          <li><strong>Technical drift.</strong> The moment "transformer," "RAG," or "embedding dimension" appears, half the room disengages.</li>
          <li><strong>Risk laundry lists.</strong> Five risks with no mitigation owners is worse than two risks with named owners and dates.</li>
          <li><strong>Vendor focus.</strong> Boards don't pick vendors; they approve outcomes and budgets. Vendor choice belongs in the appendix.</li>
          <li><strong>No ask.</strong> If the brief doesn't end with what you need from the board, it's a status email.</li>
        </ul>
      </div>
    </>
  )
}

function QuizPanel() {
  const [idx, setIdx] = useState(0)
  const [picked, setPicked] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  const total = QUIZ.length
  const q = QUIZ[idx]

  const onPick = (i) => {
    if (picked !== null) return
    setPicked(i)
    if (i === q.answer) setScore((s) => s + 1)
  }

  const onNext = () => {
    if (idx + 1 >= total) { setDone(true); return }
    setIdx(idx + 1)
    setPicked(null)
  }

  const reset = () => { setIdx(0); setPicked(null); setScore(0); setDone(false) }

  if (done) {
    return (
      <>
        <h2 className="bb-section-title">Quiz Result</h2>
        <div className="bb-card" style={{ textAlign: 'center' }}>
          <div className="bb-score-num">{score} / {total}</div>
          <p style={{ marginTop: 14, color: '#b8a888' }}>
            {score === total ? 'Board-ready.' : score >= total - 1 ? 'Strong understanding of executive AI communication.' : 'Worth a second pass — the framing principles compound.'}
          </p>
          <button className="bb-quiz-next" onClick={reset}>Restart</button>
        </div>
      </>
    )
  }

  return (
    <>
      <h2 className="bb-section-title">Test Your Understanding</h2>
      <p className="bb-section-sub">Five questions on AI governance and board communication.</p>

      <div className="bb-progress"><div className="bb-progress-fill" style={{ width: `${(idx / total) * 100}%` }} /></div>

      <div className="bb-card">
        <div className="bb-quiz-q">{idx + 1}. {q.q}</div>
        <div className="bb-quiz-opts">
          {q.opts.map((opt, i) => {
            const isCorrect = picked !== null && i === q.answer
            const isWrong = picked === i && i !== q.answer
            return (
              <button
                key={i}
                className={`bb-quiz-opt${isCorrect ? ' correct' : ''}${isWrong ? ' wrong' : ''}`}
                onClick={() => onPick(i)}
                disabled={picked !== null}
              >
                {opt}
              </button>
            )
          })}
        </div>
        {picked !== null && (
          <>
            <div className="bb-quiz-exp">{q.exp}</div>
            <button className="bb-quiz-next" onClick={onNext}>{idx + 1 >= total ? 'See Result' : 'Next'}</button>
          </>
        )}
      </div>
    </>
  )
}
