import { useState, useMemo } from 'react'
import NavBar from '../components/NavBar.jsx'
import { useApiKey } from '../hooks/useApiKey.js'
import { useChat } from '../hooks/useChat.js'

const css = `
/* ── BoardBriefing rebound to Prism tokens.
 *  Page identity gold (#c9a84c) dropped. Output cards map to feedback
 *  palette: summary = blue, risks = error, recommendations = success,
 *  financial = orange (cost / spend). ─────────────────────── */

.bb-root { min-height: 100vh; background: var(--surface-base); color: var(--text-primary); overflow-x: hidden; }

.bb-hero {
  position: relative;
  text-align: center;
  padding: var(--spacing-7) var(--spacing-4) var(--spacing-6);
  background: var(--text-primary);
  color: var(--surface-base);
  overflow: hidden;
}
:root[data-theme="dark"] .bb-hero {
  background: var(--surface-base);
  color: var(--text-primary);
}
.bb-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--gradient-refracted-b);
  opacity: var(--refracted-opacity-standard);
  pointer-events: none;
}
.bb-hero > * { position: relative; }
.bb-eyebrow {
  font: var(--text-weight-label) var(--text-size-caption)/var(--text-lh-caption) var(--font-primary);
  letter-spacing: 0.08em;
  color: var(--blue-300);
  margin-bottom: var(--spacing-3);
}
.bb-title {
  font: var(--text-weight-h1) var(--text-size-h1)/var(--text-lh-h1) var(--font-primary);
  letter-spacing: var(--text-ls-h1);
  margin-bottom: var(--spacing-3);
}
.bb-subtitle {
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  max-width: 580px;
  margin: 0 auto;
  opacity: 0.85;
}

.bb-tabs-row {
  display: flex;
  justify-content: center;
  padding: var(--spacing-5) var(--spacing-4) var(--spacing-6);
  background: var(--surface-base);
}

.bb-panel { max-width: 920px; margin: 0 auto; padding: 0 var(--spacing-4) var(--spacing-7); }
.bb-section-title {
  font: var(--text-weight-h2) var(--text-size-h2)/var(--text-lh-h2) var(--font-primary);
  letter-spacing: var(--text-ls-h2);
  color: var(--text-primary);
  margin-bottom: var(--spacing-2);
}
.bb-section-sub {
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-6);
  max-width: 720px;
}

.bb-card {
  background: var(--surface-1);
  border: 1px solid var(--border-default);
  box-shadow: var(--shadow-e2);
  border-radius: var(--radius-md);
  padding: var(--spacing-5);
  margin-bottom: var(--spacing-4);
}
.bb-card h3 {
  font: var(--text-weight-label) var(--text-size-body)/1.2 var(--font-primary);
  color: var(--text-primary);
  margin: 0 0 var(--spacing-2);
}
.bb-card p {
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  color: var(--text-secondary);
  margin: 0 0 var(--spacing-2);
}
.bb-card ul {
  margin: 0;
  padding-left: var(--spacing-5);
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  color: var(--text-secondary);
}
.bb-card li { margin-bottom: var(--spacing-1); }

/* ── Form ── */
.bb-form { display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-3); }
.bb-field { display: flex; flex-direction: column; gap: 6px; }
.bb-field.full { grid-column: 1 / -1; }
.bb-label {
  font: var(--text-weight-label) var(--text-size-caption)/1 var(--font-primary);
  letter-spacing: 0.04em;
  color: var(--text-secondary);
}
.bb-input, .bb-select, .bb-textarea {
  font: var(--text-weight-body) var(--text-size-body)/1.4 var(--font-primary);
  color: var(--text-primary);
  background: var(--surface-1);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-sm);
  padding: var(--spacing-2) var(--spacing-3);
  outline: none;
  transition: border-color var(--duration-fast) var(--ease-standard), box-shadow var(--duration-fast) var(--ease-standard);
  width: 100%;
  box-sizing: border-box;
}
.bb-input:focus-visible, .bb-select:focus-visible, .bb-textarea:focus-visible {
  border-color: var(--purple-500);
  box-shadow: 0 0 0 3px var(--color-focus-ring);
}
.bb-textarea { min-height: 80px; resize: vertical; line-height: 1.6; }
.bb-select {
  appearance: none;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='%238A7E72' d='M0 0l5 6 5-6z'/></svg>");
  background-repeat: no-repeat;
  background-position: right 14px center;
  padding-right: 32px;
}

.bb-actions { display: flex; gap: var(--spacing-3); flex-wrap: wrap; align-items: center; margin-top: var(--spacing-4); }
.bb-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-1);
  font: 600 var(--text-size-body)/1 var(--font-primary);
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--radius-md);
  border: 1px solid var(--orange-500);
  background: var(--orange-500);
  color: #fff;
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard);
}
.bb-btn:hover:not(:disabled) { background: #D45C10; border-color: #D45C10; }
.bb-btn:focus-visible { outline: 3px solid var(--color-focus-ring); outline-offset: 2px; }
.bb-btn:disabled { opacity: 0.45; cursor: not-allowed; pointer-events: none; }
.bb-btn.secondary {
  background: transparent;
  border-color: var(--border-default);
  color: var(--text-primary);
}
.bb-btn.secondary:hover:not(:disabled) { background: var(--surface-2); border-color: var(--border-strong); }

.bb-warn, .bb-err {
  margin-top: var(--spacing-3);
  padding: var(--spacing-3) var(--spacing-4);
  border-radius: var(--radius-md);
  background: var(--surface-1);
  border: 1px solid var(--color-error);
  color: var(--color-error);
  font: var(--text-weight-body) var(--text-size-caption)/var(--text-lh-body) var(--font-primary);
}
.bb-warn a { color: var(--color-error); text-decoration: underline; }

/* ── Output cards ── */
.bb-output { margin-top: var(--spacing-7); display: flex; flex-direction: column; gap: var(--spacing-3); }
.bb-out-card {
  border-radius: var(--radius-md);
  padding: var(--spacing-5);
  border: 1px solid;
  background: var(--surface-1);
  box-shadow: var(--shadow-e2);
  opacity: 0;
  transform: translateY(8px);
  transition: opacity var(--duration-deliberate) var(--ease-standard), transform var(--duration-deliberate) var(--ease-standard);
}
.bb-out-card.visible { opacity: 1; transform: translateY(0); }
.bb-out-card h3 {
  font: var(--text-weight-h3) var(--text-size-h3)/var(--text-lh-h3) var(--font-primary);
  letter-spacing: var(--text-ls-h3);
  margin: 0 0 var(--spacing-3);
}
.bb-out-body {
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  color: var(--text-primary);
  white-space: pre-wrap;
}
.bb-out-card.gold   { border-color: var(--blue-500); }
.bb-out-card.gold h3   { color: var(--blue-500); }
.bb-out-card.rose   { border-color: var(--color-error); }
.bb-out-card.rose h3   { color: var(--color-error); }
.bb-out-card.teal   { border-color: var(--color-success); }
.bb-out-card.teal h3   { color: var(--color-success); }
.bb-out-card.financial { border-color: var(--orange-500); }
.bb-out-card.financial h3 { color: var(--orange-500); }

.bb-cursor { display: inline-block; width: 7px; height: 14px; background: currentColor; opacity: 0.7; margin-left: 2px; vertical-align: -2px; animation: bb-blink 1s infinite; }
@keyframes bb-blink { 0%, 50% { opacity: 0.7; } 50.01%, 100% { opacity: 0; } }

.bb-after-actions { display: flex; gap: var(--spacing-2); flex-wrap: wrap; margin-top: var(--spacing-2); }

@media print {
  .bb-tabs-row, .bb-form, .bb-actions, .bb-after-actions, .nav-bar, .bb-hero, .bb-warn, .bb-err { display: none !important; }
  .bb-root, .bb-panel { background: #fff !important; color: #111 !important; padding: 0 !important; max-width: none !important; }
  .bb-out-card { opacity: 1 !important; transform: none !important; background: #fff !important; border-color: #ccc !important; page-break-inside: avoid; margin-bottom: 18px; box-shadow: none; }
  .bb-out-body { color: #222 !important; }
  .bb-out-card h3 { color: #000 !important; }
  .bb-cursor { display: none !important; }
}

/* ── Quiz ── */
.bb-quiz-q {
  font: var(--text-weight-h3) var(--text-size-h3)/var(--text-lh-h3) var(--font-primary);
  letter-spacing: var(--text-ls-h3);
  color: var(--text-primary);
  margin-bottom: var(--spacing-4);
}
.bb-quiz-opts { display: flex; flex-direction: column; gap: var(--spacing-2); }
.bb-quiz-opt {
  background: var(--surface-1);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--spacing-3) var(--spacing-4);
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  color: var(--text-primary);
  cursor: pointer;
  text-align: left;
  transition: background-color var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard);
}
.bb-quiz-opt:hover:not(:disabled) { background: var(--surface-2); border-color: var(--border-strong); }
.bb-quiz-opt:focus-visible { outline: 3px solid var(--color-focus-ring); outline-offset: 2px; }
.bb-quiz-opt:disabled { cursor: default; }
.bb-quiz-opt.correct { border-color: var(--color-success); }
.bb-quiz-opt.wrong   { border-color: var(--color-error); }
.bb-quiz-exp {
  margin-top: var(--spacing-4);
  padding: var(--spacing-3) var(--spacing-4);
  background: var(--surface-2);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  color: var(--text-secondary);
}
.bb-quiz-next {
  margin-top: var(--spacing-3);
  background: var(--orange-500);
  border: 1px solid var(--orange-500);
  color: #fff;
  font: 600 var(--text-size-body)/1 var(--font-primary);
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard);
}
.bb-quiz-next:hover { background: #D45C10; border-color: #D45C10; }
.bb-quiz-next:focus-visible { outline: 3px solid var(--color-focus-ring); outline-offset: 2px; }
.bb-progress { background: var(--surface-3); border-radius: 100px; height: 4px; margin-bottom: var(--spacing-5); overflow: hidden; }
.bb-progress-fill {
  height: 100%;
  background: var(--text-primary);
  border-radius: 100px;
  transition: width var(--duration-standard) var(--ease-standard);
}
.bb-score-num {
  font: var(--text-weight-h1) var(--text-size-h1)/1 var(--font-primary);
  letter-spacing: var(--text-ls-h1);
  color: var(--text-primary);
  text-align: center;
}

@media (max-width: 640px) {
  .bb-form { grid-template-columns: 1fr; }
}
`

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'generate', label: 'Generate brief' },
  { id: 'quality',  label: 'What makes a good brief' },
  { id: 'quiz',     label: 'Quiz' },
]

const INDUSTRIES = ['Financial Services', 'Healthcare', 'Retail', 'Manufacturing', 'Professional Services', 'Other']
const SIZES = ['50–200', '200–1000', '1000–5000', '5000+']

const SYSTEM_PROMPT = `You are a senior AI transformation advisor writing a comprehensive board-ready executive brief. Write with authority and specificity. Use the company name and their exact initiatives throughout. Each section should be substantial — 2-3 paragraphs, not bullet points. Include specific metrics, realistic timeframes, and dollar figures calibrated to the company size and industry. Call out risks by name and explain their business impact. Make recommendations actionable with clear owners and timelines. This brief should be detailed enough that a board member with no AI background understands exactly where the company stands, what's at risk, and what decisions they need to make. Format your response in exactly 4 sections with these exact headers: ## Q1 AI Transformation Summary, ## Key Risks Requiring Board Attention, ## Strategic Recommendations, ## Financial Outlook.`

// Tone keys map to .bb-out-card variants:
//   gold       → --blue-500 (structured summary)
//   rose       → --color-error (risks)
//   teal       → --color-success (recommendations)
//   financial  → --orange-500 (cost / spend)
const SECTION_DEFS = [
  { key: 'summary',         match: 'q1 ai transformation summary',          label: 'Q1 AI transformation summary',     tone: 'gold' },
  { key: 'risks',           match: 'key risks requiring board attention',   label: 'Key risks requiring board attention', tone: 'rose' },
  { key: 'recommendations', match: 'strategic recommendations',             label: 'Strategic recommendations',        tone: 'teal' },
  { key: 'financial',       match: 'financial outlook',                     label: 'Financial outlook',                tone: 'financial' },
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

  // Lifted out of GeneratePanel so the brief, form, and streaming state
  // survive tab switches. Tabs unmount their panels — these hooks must
  // live in a component that stays mounted.
  const [form, setForm] = useState({ company: '', industry: '', size: '', initiatives: '', risk: '', budget: '' })
  const { hasKey } = useApiKey()
  const chat = useChat({ tier: 'user', systemPrompt: SYSTEM_PROMPT })

  return (
    <div className="bb-root">
      <style>{css}</style>
      <NavBar />
      <header className="bb-hero">
        <div className="bb-eyebrow">Executive AI</div>
        <h1 className="bb-title">Board briefing generator</h1>
        <p className="bb-subtitle">Turn your AI initiative data into a board-ready executive brief in seconds.</p>
      </header>

      <div className="bb-tabs-row">
        <div className="prism-tabs" role="tablist" aria-label="Sections">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              className="prism-tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <main className="bb-panel">
        {tab === 'overview' && <OverviewPanel />}
        {tab === 'generate' && (
          <GeneratePanel
            form={form}
            setForm={setForm}
            hasKey={hasKey}
            chat={chat}
          />
        )}
        {tab === 'quality' && <QualityPanel />}
        {tab === 'quiz' && <QuizPanel />}
      </main>
    </div>
  )
}

function OverviewPanel() {
  return (
    <>
      <h2 className="bb-section-title">What is an AI board brief?</h2>
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

function GeneratePanel({ form, setForm, hasKey, chat }) {
  const { messages, isStreaming, error, sendMessage, reset } = chat

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
      <h2 className="bb-section-title">Generate brief</h2>
      <p className="bb-section-sub">Fill in your company details. The brief is generated by Claude and streamed live into the four board-ready sections below.</p>

      <div className="bb-card">
        <div className="bb-form">
          <div className="bb-field">
            <label className="bb-label" htmlFor="bb-company">Company name</label>
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
            <label className="bb-label" htmlFor="bb-size">Company size</label>
            <select id="bb-size" className="bb-select" value={form.size} onChange={update('size')}>
              <option value="">Select…</option>
              {SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="bb-field">
            <label className="bb-label" htmlFor="bb-budget">AI budget invested to date <span style={{ textTransform: 'none', color: 'var(--text-tertiary)' }}>(optional)</span></label>
            <input id="bb-budget" className="bb-input" value={form.budget} onChange={update('budget')} placeholder="$2.4M" />
          </div>
          <div className="bb-field full">
            <label className="bb-label" htmlFor="bb-init">Current AI initiatives</label>
            <textarea id="bb-init" className="bb-textarea" value={form.initiatives} onChange={update('initiatives')} placeholder="Customer-service copilot, document automation, internal RAG knowledge base…" />
          </div>
          <div className="bb-field full">
            <label className="bb-label" htmlFor="bb-risk">Biggest AI risk or concern</label>
            <textarea id="bb-risk" className="bb-textarea" value={form.risk} onChange={update('risk')} placeholder="Regulatory exposure, hallucinations in customer-facing channels, data leakage…" />
          </div>
        </div>

        <div className="bb-actions">
          <button className="bb-btn" onClick={onGenerate} disabled={!canSubmit}>
            {isStreaming ? 'Generating…' : 'Generate board brief'}
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
      <h2 className="bb-section-title">What makes a good brief</h2>
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
        <h2 className="bb-section-title">Quiz result</h2>
        <div className="bb-card" style={{ textAlign: 'center' }}>
          <div className="bb-score-num">{score} / {total}</div>
          <p style={{ marginTop: 'var(--spacing-3)', color: 'var(--text-secondary)' }}>
            {score === total ? 'Board-ready.' : score >= total - 1 ? 'Strong understanding of executive AI communication.' : 'Worth a second pass — the framing principles compound.'}
          </p>
          <button className="bb-quiz-next" onClick={reset}>Restart</button>
        </div>
      </>
    )
  }

  return (
    <>
      <h2 className="bb-section-title">Test your understanding</h2>
      <p className="bb-section-sub">Five questions on AI governance and board communication.</p>

      <div className="bb-progress"><div className="bb-progress-fill" style={{ width: `${(idx / total) * 100}%` }} /></div>

      <div className="bb-card">
        <div className="bb-quiz-q">{idx + 1}. {q.q}</div>
        <div className="bb-quiz-opts" role="radiogroup">
          {q.opts.map((opt, i) => {
            const isCorrect = picked !== null && i === q.answer
            const isWrong = picked === i && i !== q.answer
            return (
              <button
                key={i}
                className={`bb-quiz-opt${isCorrect ? ' correct' : ''}${isWrong ? ' wrong' : ''}`}
                onClick={() => onPick(i)}
                disabled={picked !== null}
                role="radio"
                aria-checked={picked === i}
              >
                {opt}
              </button>
            )
          })}
        </div>
        {picked !== null && (
          <>
            <div className="bb-quiz-exp">{q.exp}</div>
            <button className="bb-quiz-next" onClick={onNext}>{idx + 1 >= total ? 'See result' : 'Next question'}</button>
          </>
        )}
      </div>
    </>
  )
}
