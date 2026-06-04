import { useState, useEffect, useRef } from 'react'
import NavBar from '../components/NavBar.jsx'
import {
  PlantIcon, RocketLaunchIcon, CodeIcon,
  BookOpenIcon, PlayCircleIcon, SealCheckIcon, UsersThreeIcon,
  QuestionIcon, ArrowSquareOutIcon, FileTextIcon,
} from '@phosphor-icons/react'

const ACCENT = '#2dd4bf'

const css = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap');

.rs-root { min-height: 100vh; background: #050810; color: #e0e8f0; font-family: 'IBM Plex Mono', monospace; overflow-x: hidden; }

.rs-hero { text-align: center; padding: 48px 24px 28px; position: relative; }
.rs-hero::before { content: ''; position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 700px; height: 320px; background: radial-gradient(ellipse at 50% 0%, rgba(45,212,191,0.09) 0%, transparent 70%); pointer-events: none; }
.rs-eyebrow { font-size: 16px; letter-spacing: 0.22em; color: ${ACCENT}; text-transform: uppercase; margin-bottom: 14px; position: relative; }
.rs-title { font-family: 'IBM Plex Sans', sans-serif; font-size: clamp(28px, 5vw, 52px); font-weight: 800; letter-spacing: -0.02em; color: #fff; line-height: 1.05; margin-bottom: 12px; position: relative; }
.rs-title span { color: ${ACCENT}; }
.rs-subtitle { font-size: 16px; color: #3a7a72; max-width: 560px; margin: 0 auto 0; line-height: 1.8; position: relative; }

.rs-panel { max-width: 920px; margin: 0 auto; padding: 32px 20px 80px; }

.rs-section-title { font-family: 'IBM Plex Sans', sans-serif; font-size: 22px; font-weight: 700; color: #fff; margin-bottom: 8px; text-align: center; }
.rs-section-sub { font-size: 16px; color: #3a7a72; line-height: 1.7; margin-bottom: 28px; text-align: center; }

/* Level selector */
.rs-level-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
@media (max-width: 680px) { .rs-level-grid { grid-template-columns: 1fr; } }
.rs-level-card { background: rgba(45,212,191,0.03); border: 1px solid #11302c; border-radius: 14px; padding: 28px 22px; cursor: pointer; transition: all 0.2s; text-align: center; display: flex; flex-direction: column; align-items: center; }
.rs-level-card:hover { border-color: ${ACCENT}; background: rgba(45,212,191,0.07); transform: translateY(-3px); box-shadow: 0 16px 44px rgba(0,0,0,0.4), 0 0 32px rgba(45,212,191,0.1); }
.rs-level-icon { width: 60px; height: 60px; border-radius: 14px; display: flex; align-items: center; justify-content: center; background: rgba(45,212,191,0.1); border: 1px solid rgba(45,212,191,0.2); margin-bottom: 16px; }
.rs-level-name { font-family: 'IBM Plex Sans', sans-serif; font-size: 19px; font-weight: 700; color: #fff; margin-bottom: 8px; }
.rs-level-desc { font-size: 13px; color: #4a8a82; line-height: 1.6; margin-bottom: 14px; }
.rs-level-meta { font-size: 12px; color: ${ACCENT}; font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.06em; }

/* Track header */
.rs-track-head { display: flex; align-items: center; gap: 14px; margin-bottom: 6px; }
.rs-track-icon { width: 46px; height: 46px; border-radius: 12px; display: flex; align-items: center; justify-content: center; background: rgba(45,212,191,0.1); border: 1px solid rgba(45,212,191,0.2); flex-shrink: 0; }
.rs-track-title { font-family: 'IBM Plex Sans', sans-serif; font-size: 24px; font-weight: 800; color: #fff; letter-spacing: -0.02em; }
.rs-track-sub { font-size: 14px; color: #3a7a72; line-height: 1.6; margin: 8px 0 24px; }

.rs-change-btn { background: transparent; border: 1px solid #1a3a36; color: #4a8a82; font-family: 'IBM Plex Mono', monospace; font-size: 13px; padding: 7px 14px; border-radius: 8px; cursor: pointer; transition: all 0.18s; letter-spacing: 0.06em; margin-bottom: 26px; }
.rs-change-btn:hover { border-color: ${ACCENT}; color: ${ACCENT}; }

/* Resource step cards */
.rs-step { display: flex; align-items: stretch; gap: 16px; margin-bottom: 12px; }
.rs-step-num { flex-shrink: 0; width: 40px; display: flex; flex-direction: column; align-items: center; }
.rs-step-num-circle { width: 34px; height: 34px; border-radius: 50%; background: rgba(45,212,191,0.08); border: 1px solid rgba(45,212,191,0.28); color: ${ACCENT}; font-family: 'IBM Plex Mono', monospace; font-size: 14px; font-weight: 600; display: flex; align-items: center; justify-content: center; }
.rs-step-line { flex: 1; width: 1px; background: linear-gradient(180deg, rgba(45,212,191,0.25), transparent); margin-top: 6px; }
.rs-step-card { flex: 1; background: rgba(255,255,255,0.02); border: 1px solid #11302c; border-radius: 12px; padding: 18px 20px; transition: border-color 0.18s; }
.rs-step-card:hover { border-color: rgba(45,212,191,0.4); }
.rs-badges { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 10px; }
.rs-badge { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.06em; padding: 3px 9px; border-radius: 100px; border: 1px solid; }
.rs-badge-type { color: #9fd8d0; border-color: #1f4a44; background: rgba(45,212,191,0.04); }
.rs-badge-official { color: ${ACCENT}; border-color: rgba(45,212,191,0.4); background: rgba(45,212,191,0.08); }
.rs-badge-community { color: #94a3b8; border-color: rgba(148,163,184,0.3); background: rgba(148,163,184,0.06); }
.rs-res-title { font-family: 'IBM Plex Sans', sans-serif; font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 5px; line-height: 1.4; }
.rs-res-desc { font-size: 13px; color: #5a9a92; line-height: 1.6; margin-bottom: 14px; }
.rs-res-link { display: inline-flex; align-items: center; gap: 7px; background: rgba(45,212,191,0.1); border: 1px solid ${ACCENT}; color: ${ACCENT}; font-family: 'IBM Plex Mono', monospace; font-size: 13px; padding: 8px 16px; border-radius: 8px; text-decoration: none; transition: all 0.18s; letter-spacing: 0.04em; }
.rs-res-link:hover { background: rgba(45,212,191,0.2); }

/* Quiz */
.rs-quiz { max-width: 680px; margin: 56px auto 0; border-top: 1px solid #11302c; padding-top: 44px; }
.rs-quiz-head { display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 6px; }
.rs-quiz-head-title { font-family: 'IBM Plex Sans', sans-serif; font-size: 20px; font-weight: 800; color: #fff; }
.rs-quiz-sub { font-size: 14px; color: #3a7a72; text-align: center; margin-bottom: 28px; }
.rs-quiz-progress { display: flex; align-items: center; gap: 12px; margin-bottom: 26px; }
.rs-quiz-progress-bar-bg { flex: 1; height: 4px; background: #11302c; border-radius: 2px; overflow: hidden; }
.rs-quiz-progress-bar { height: 100%; background: ${ACCENT}; border-radius: 2px; transition: width 0.4s; }
.rs-quiz-progress-label { font-size: 13px; color: #3a7a72; font-family: 'IBM Plex Mono', monospace; white-space: nowrap; }
.rs-quiz-q { font-family: 'IBM Plex Sans', sans-serif; font-size: 18px; font-weight: 700; color: #fff; line-height: 1.5; margin-bottom: 22px; }
.rs-quiz-opts { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
.rs-quiz-opt { background: rgba(255,255,255,0.02); border: 1px solid #11302c; border-radius: 10px; padding: 14px 18px; cursor: pointer; transition: all 0.18s; text-align: left; font-family: 'IBM Plex Sans', sans-serif; font-size: 15px; color: #a0b8b4; display: flex; align-items: flex-start; }
.rs-quiz-opt:hover:not(:disabled) { border-color: ${ACCENT}; color: #c0e8e2; }
.rs-quiz-opt.correct { border-color: #34d399; background: rgba(52,211,153,0.08); color: #34d399; }
.rs-quiz-opt.wrong { border-color: #f87171; background: rgba(248,113,113,0.08); color: #f87171; }
.rs-quiz-opt.neutral { opacity: 0.5; }
.rs-quiz-opt:disabled { cursor: default; }
.rs-quiz-explanation { background: rgba(45,212,191,0.05); border: 1px solid rgba(45,212,191,0.15); border-radius: 10px; padding: 16px 20px; font-size: 14px; color: #4a9a92; line-height: 1.7; margin-bottom: 20px; }
.rs-quiz-explanation strong { color: ${ACCENT}; }
.rs-btn { background: rgba(45,212,191,0.1); border: 1px solid ${ACCENT}; color: ${ACCENT}; font-family: 'IBM Plex Mono', monospace; font-size: 14px; padding: 10px 20px; border-radius: 8px; cursor: pointer; transition: all 0.18s; letter-spacing: 0.06em; }
.rs-btn:hover { background: rgba(45,212,191,0.18); }
.rs-quiz-done { text-align: center; padding: 20px 0; }
.rs-quiz-done-score { font-family: 'IBM Plex Sans', sans-serif; font-size: 56px; font-weight: 900; color: ${ACCENT}; line-height: 1; margin-bottom: 8px; }
.rs-quiz-done-label { font-size: 16px; color: #3a7a72; margin-bottom: 28px; }

/* Footer links */
.rs-footer { max-width: 920px; margin: 0 auto; padding: 0 20px 80px; }
.rs-footer-label { font-size: 12px; letter-spacing: 0.16em; text-transform: uppercase; color: #3a7a72; margin-bottom: 14px; text-align: center; }
.rs-footer-links { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
@media (max-width: 680px) { .rs-footer-links { grid-template-columns: 1fr; } }
.rs-footer-link { display: flex; align-items: center; gap: 10px; background: rgba(45,212,191,0.03); border: 1px solid #11302c; border-radius: 10px; padding: 14px 18px; text-decoration: none; transition: all 0.18s; }
.rs-footer-link:hover { border-color: rgba(45,212,191,0.4); background: rgba(45,212,191,0.06); }
.rs-footer-link-title { font-family: 'IBM Plex Sans', sans-serif; font-size: 14px; font-weight: 700; color: #c0e8e2; }
.rs-footer-link-arrow { margin-left: auto; color: ${ACCENT}; flex-shrink: 0; transition: transform 0.18s; }
.rs-footer-link:hover .rs-footer-link-arrow { transform: translate(2px, -2px); }
`

// ─── Track data ────────────────────────────────────────────────────────────
// `order` = the curriculum step. Official resources sort ahead of Community
// at the same step level (see sortTrack below). type: 'Course' | 'Video' | 'Reference'.
const TRACKS = {
  beginner: {
    name: 'Beginner',
    Icon: PlantIcon,
    desc: 'New to Claude? Start here. Learn the essentials of prompting, everyday tasks, and what AI can and cannot do.',
    resources: [
      { order: 1, type: 'Video', source: 'Official', title: 'Prompting 101', desc: "Hands-on intro to writing effective prompts, from Anthropic's Code w/ Claude event.", url: 'https://www.youtube.com/watch?v=ysPbXH0LpIE' },
      { order: 2, type: 'Video', source: 'Community', title: 'How to Use Claude AI (Beginner Tutorial)', desc: 'Step-by-step walkthrough: interface, emails, summarizing, artifacts, and projects.', url: 'https://www.youtube.com/watch?v=r2vYObllqJU' },
      { order: 3, type: 'Course', source: 'Official', title: 'Claude 101', desc: 'Use Claude for everyday work tasks and core features.', url: 'https://anthropic.skilljar.com/claude-101' },
      { order: 4, type: 'Course', source: 'Official', title: 'AI Fluency: Framework & Foundations', desc: 'Collaborate with AI effectively, efficiently, ethically, and safely.', url: 'https://anthropic.skilljar.com/ai-fluency-framework-foundations' },
      { order: 5, type: 'Course', source: 'Official', title: 'AI Capabilities and Limitations', desc: 'An introductory course on how AI actually works.', url: 'https://anthropic.skilljar.com/ai-capabilities-and-limitations' },
      { order: 6, type: 'Video', source: 'Official', title: 'Introducing Cowork', desc: 'Hand off time-consuming tasks to Claude and come back to finished deliverables.', url: 'https://www.youtube.com/watch?v=UAmKyyZ-b9E' },
    ],
    quiz: [
      { q: 'Best way to phrase a prompt to Claude?', opts: ['Rigid, code-like syntax', 'Naturally, like talking to a coworker or friend', 'Only single keywords', 'Always in all caps'], correct: 1, explanation: 'Clear, conversational prompts with good context get the best results.' },
      { q: 'What are Artifacts for?', opts: ['Creating standalone content (docs, code, apps) you can view and edit', 'Storing passwords', 'Deleting chat history', 'Translation only'], correct: 0, explanation: 'Artifacts are a workspace for substantial content you can iterate on.' },
      { q: 'What does Claude Cowork let you do?', opts: ['Hand off multi-step tasks and come back to finished deliverables', 'Play games', 'Only chat', 'Replace your OS'], correct: 0, explanation: 'Cowork pulls from your files, tools, and the web to produce polished outputs.' },
      { q: 'To get better results you should…', opts: ['Give clear context and iterate on your prompt', 'Give no detail', 'Repeat the same prompt unchanged', 'Avoid examples'], correct: 0, explanation: 'Context, examples, and iteration are core to effective prompting.' },
    ],
  },
  intermediate: {
    name: 'Intermediate',
    Icon: RocketLaunchIcon,
    desc: 'Comfortable with the basics? Go deeper on advanced prompting, Skills, and getting the most out of Claude Cowork.',
    resources: [
      { order: 1, type: 'Video', source: 'Official', title: 'AI prompt engineering: A deep dive', desc: 'Anthropic experts on advanced prompting techniques and how prompting evolves.', url: 'https://www.youtube.com/watch?v=T9aRN5JkmL8' },
      { order: 2, type: 'Video', source: 'Community', title: 'Learn 97% of Claude in Under 16 Minutes', desc: 'Power-user overview of using Claude across real work and automation.', url: 'https://www.youtube.com/watch?v=wZeOwqmSw84' },
      { order: 3, type: 'Video', source: 'Community', title: 'Learn 80% of Claude Cowork in Under 20 Minutes', desc: "Cowork's core capabilities: file access, memory, connectors, skills, scheduled tasks.", url: 'https://www.youtube.com/watch?v=z9rdrNrkvDY' },
      { order: 4, type: 'Video', source: 'Official', title: 'What are skills?', desc: 'How Skills teach Claude to do a task once, then apply it automatically when relevant.', url: 'https://www.youtube.com/watch?v=bjdBVZa66oU' },
      { order: 5, type: 'Course', source: 'Official', title: 'Introduction to Claude Cowork', desc: 'Hands-on: the Cowork task loop, plugins, skills, and file/research workflows.', url: 'https://anthropic.skilljar.com/introduction-to-claude-cowork' },
    ],
    quiz: [
      { q: "Per Anthropic's experts, prompt engineering is mostly about…", opts: ['Iterative experimentation and clear communication', 'One perfect prompt on the first try', 'Memorizing secret keywords', 'Writing in a programming language'], correct: 0, explanation: 'The deep-dive roundtable stresses iteration and clear communication.' },
      { q: 'What is a Claude Skill?', opts: ['A one-time instruction that teaches Claude a task, applied automatically when relevant', 'A subscription tier', 'A type of GPU', 'A keyboard shortcut'], correct: 0, explanation: "Teach Claude a task once; it applies the Skill whenever it's relevant." },
      { q: 'Which is a core Cowork capability?', opts: ['Local file access', 'Mining cryptocurrency', 'Editing the Linux kernel', 'None of the above'], correct: 0, explanation: 'Cowork accesses local files, uses connectors, remembers context, and runs scheduled tasks.' },
      { q: 'When Claude makes a mistake, a good habit is to…', opts: ['Ask why it was wrong and how to instruct it better next time', 'Start over with no feedback', 'Lower expectations permanently', 'Switch tools immediately'], correct: 0, explanation: 'Anthropic engineers suggest asking the model to explain and prevent its error.' },
    ],
  },
  developer: {
    name: 'Developer',
    Icon: CodeIcon,
    desc: 'Build with Claude. Master the API, Claude Code, MCP, Skills, and subagents from the ground up.',
    resources: [
      { order: 1, type: 'Course', source: 'Official', title: 'Building with the Claude API', desc: 'The full spectrum of working with Anthropic models via the Claude API.', url: 'https://anthropic.skilljar.com/claude-with-the-anthropic-api' },
      { order: 2, type: 'Course', source: 'Official', title: 'Claude Code 101', desc: 'Use Claude Code effectively in your daily development workflow.', url: 'https://anthropic.skilljar.com/claude-code-101' },
      { order: 3, type: 'Course', source: 'Official', title: 'Claude Code in Action', desc: 'Integrate Claude Code into your development workflow.', url: 'https://anthropic.skilljar.com/claude-code-in-action' },
      { order: 4, type: 'Course', source: 'Official', title: 'Introduction to Model Context Protocol', desc: 'Build MCP servers and clients from scratch in Python.', url: 'https://anthropic.skilljar.com/introduction-to-model-context-protocol' },
      { order: 5, type: 'Course', source: 'Official', title: 'Introduction to agent skills', desc: 'Build, configure, and share Skills in Claude Code.', url: 'https://anthropic.skilljar.com/introduction-to-agent-skills' },
      { order: 6, type: 'Course', source: 'Official', title: 'Introduction to subagents', desc: 'Use and create subagents to manage context and delegate tasks.', url: 'https://anthropic.skilljar.com/introduction-to-subagents' },
      { order: 7, type: 'Course', source: 'Official', title: 'Model Context Protocol: Advanced Topics', desc: 'Advanced MCP patterns: sampling, notifications, file system access, transports.', url: 'https://anthropic.skilljar.com/model-context-protocol-advanced-topics' },
      { order: 8, type: 'Reference', source: 'Official', title: 'Developer docs', desc: 'Official Claude API and platform documentation.', url: 'https://platform.claude.com/docs' },
    ],
    quiz: [
      { q: 'The Claude API lets developers…', opts: ["Integrate Claude's capabilities into their own applications", 'Only use a web chat', 'Train new base models', "Access other companies' private data"], correct: 0, explanation: 'The API is how you build Claude-powered applications programmatically.' },
      { q: 'What does the Model Context Protocol (MCP) do?', opts: ['Connects Claude to external services via tools, resources, and prompts', 'Compresses images', 'Replaces the API', 'Handles billing'], correct: 0, explanation: 'MCP standardizes how Claude connects to external tools and data.' },
      { q: 'Claude Code is…', opts: ['An agentic coding tool that works from your terminal/IDE', 'A spreadsheet app', 'A password manager', 'A model name'], correct: 0, explanation: 'Claude Code lets developers delegate coding tasks in their dev environment.' },
      { q: 'Subagents in Claude Code are useful for…', opts: ['Managing context and delegating specialized tasks', 'Increasing your bill arbitrarily', 'Disabling the main agent', 'Nothing practical'], correct: 0, explanation: 'Subagents keep the main conversation focused by delegating scoped work.' },
    ],
  },
}

const LEVEL_ORDER = ['beginner', 'intermediate', 'developer']

const FOOTER_LINKS = [
  { title: 'All courses', url: 'https://anthropic.skilljar.com/' },
  { title: 'Anthropic Academy', url: 'https://www.anthropic.com/learn' },
  { title: 'Anthropic YouTube', url: 'https://www.youtube.com/@anthropic-ai' },
]

// Official before Community at the same step; otherwise by curriculum order.
function sortTrack(resources) {
  const srcRank = { Official: 0, Community: 1 }
  return [...resources].sort((a, b) =>
    a.order - b.order || srcRank[a.source] - srcRank[b.source]
  )
}

function TypeBadge({ type }) {
  const Icon = type === 'Video' ? PlayCircleIcon : type === 'Reference' ? FileTextIcon : BookOpenIcon
  return (
    <span className="rs-badge rs-badge-type">
      <Icon size={16} weight="duotone" color={ACCENT} />
      {type}
    </span>
  )
}

function SourceBadge({ source }) {
  if (source === 'Official') {
    return (
      <span className="rs-badge rs-badge-official">
        <SealCheckIcon size={16} weight="duotone" color={ACCENT} />
        Official
      </span>
    )
  }
  return (
    <span className="rs-badge rs-badge-community">
      <UsersThreeIcon size={16} weight="duotone" color="#94a3b8" />
      Community
    </span>
  )
}

function TrackQuiz({ quiz, levelKey }) {
  const [qNum, setQNum] = useState(0)
  const [chosen, setChosen] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  // Reset whenever the active track changes.
  useEffect(() => {
    setQNum(0); setChosen(null); setScore(0); setDone(false)
  }, [levelKey])

  const total = quiz.length
  const currentQ = quiz[qNum]

  function handleAnswer(idx) {
    if (chosen !== null) return
    setChosen(idx)
    if (idx === currentQ.correct) setScore(s => s + 1)
  }

  function nextQ() {
    if (qNum + 1 >= total) { setDone(true); return }
    setQNum(n => n + 1)
    setChosen(null)
  }

  function retake() {
    setQNum(0); setChosen(null); setScore(0); setDone(false)
  }

  return (
    <div className="rs-quiz">
      <div className="rs-quiz-head">
        <QuestionIcon size={20} weight="duotone" color={ACCENT} />
        <span className="rs-quiz-head-title">Knowledge Check</span>
      </div>
      <div className="rs-quiz-sub">4 quick questions to test what you've learned.</div>

      {done ? (
        <div className="rs-quiz-done">
          <div className="rs-quiz-done-score">{score}/{total}</div>
          <div className="rs-quiz-done-label">Questions answered correctly</div>
          <button className="rs-btn" onClick={retake}>Retake Quiz</button>
        </div>
      ) : (
        <>
          <div className="rs-quiz-progress">
            <div className="rs-quiz-progress-bar-bg">
              <div className="rs-quiz-progress-bar" style={{ width: `${(qNum / total) * 100}%` }} />
            </div>
            <span className="rs-quiz-progress-label">{qNum + 1} / {total}</span>
          </div>

          <div className="rs-quiz-q">{currentQ.q}</div>

          <div className="rs-quiz-opts">
            {currentQ.opts.map((opt, i) => {
              let cls = 'rs-quiz-opt'
              if (chosen !== null) {
                if (i === currentQ.correct) cls += ' correct'
                else if (i === chosen) cls += ' wrong'
                else cls += ' neutral'
              }
              return (
                <button key={i} className={cls} onClick={() => handleAnswer(i)} disabled={chosen !== null}>
                  <span style={{ color: '#3a7a72', marginRight: 10, fontFamily: 'IBM Plex Mono', fontSize: 13 }}>{String.fromCharCode(65 + i)}.</span>
                  {opt}
                </button>
              )
            })}
          </div>

          {chosen !== null && (
            <>
              <div className="rs-quiz-explanation">
                <strong>{chosen === currentQ.correct ? 'Correct!' : 'Not quite.'}</strong>{' '}
                {currentQ.explanation}
              </div>
              <button className="rs-btn" onClick={nextQ}>
                {qNum + 1 >= total ? 'See Results' : 'Next Question →'}
              </button>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default function Resources() {
  const [level, setLevel] = useState(null)
  const topRef = useRef(null)

  function pickLevel(key) {
    setLevel(key)
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function changeLevel() {
    setLevel(null)
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const track = level ? TRACKS[level] : null

  return (
    <div className="rs-root" ref={topRef}>
      <style>{css}</style>
      <NavBar />

      <div className="rs-hero">
        <div className="rs-eyebrow">Learn Claude</div>
        <h1 className="rs-title">Claude <span>Learning Resources</span></h1>
        <p className="rs-subtitle">A curated directory of the best official and community resources for learning Claude — organized into a guided path for your level.</p>
      </div>

      <div className="rs-panel">
        {!track ? (
          /* ── Level selector ──────────────────────────────────────────── */
          <div>
            <div className="rs-section-title">What's your level?</div>
            <div className="rs-section-sub">Pick a track and we'll lay out an ordered learning path — from your first prompt to building production apps.</div>

            <div className="rs-level-grid">
              {LEVEL_ORDER.map(key => {
                const t = TRACKS[key]
                const Icon = t.Icon
                const courses = t.resources.filter(r => r.type === 'Course' || r.type === 'Reference').length
                const videos = t.resources.filter(r => r.type === 'Video').length
                const parts = []
                if (courses) parts.push(`${courses} course${courses > 1 ? 's' : ''}`)
                if (videos) parts.push(`${videos} video${videos > 1 ? 's' : ''}`)
                return (
                  <div key={key} className="rs-level-card" onClick={() => pickLevel(key)}>
                    <div className="rs-level-icon">
                      <Icon size={32} weight="duotone" color={ACCENT} />
                    </div>
                    <div className="rs-level-name">{t.name}</div>
                    <div className="rs-level-desc">{t.desc}</div>
                    <div className="rs-level-meta">{parts.join(' · ')}</div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          /* ── Selected track ──────────────────────────────────────────── */
          <div>
            <button className="rs-change-btn" onClick={changeLevel}>← Change level</button>

            <div className="rs-track-head">
              <div className="rs-track-icon">
                <track.Icon size={26} weight="duotone" color={ACCENT} />
              </div>
              <div className="rs-track-title">{track.name} Track</div>
            </div>
            <div className="rs-track-sub">{track.desc}</div>

            {sortTrack(track.resources).map((r, i, arr) => (
              <div key={`${r.title}-${i}`} className="rs-step">
                <div className="rs-step-num">
                  <div className="rs-step-num-circle">{i + 1}</div>
                  {i < arr.length - 1 && <div className="rs-step-line" />}
                </div>
                <div className="rs-step-card">
                  <div className="rs-badges">
                    <TypeBadge type={r.type} />
                    <SourceBadge source={r.source} />
                  </div>
                  <div className="rs-res-title">{r.title}</div>
                  <div className="rs-res-desc">{r.desc}</div>
                  <a className="rs-res-link" href={r.url} target="_blank" rel="noopener noreferrer">
                    {r.type === 'Video' ? 'Watch' : r.type === 'Reference' ? 'Read docs' : 'Open course'}
                    <ArrowSquareOutIcon size={15} weight="bold" color={ACCENT} />
                  </a>
                </div>
              </div>
            ))}

            <TrackQuiz quiz={track.quiz} levelKey={level} />
          </div>
        )}
      </div>

      {/* ── Persistent footer (always shown) ───────────────────────────── */}
      <div className="rs-footer">
        <div className="rs-footer-label">More from Anthropic</div>
        <div className="rs-footer-links">
          {FOOTER_LINKS.map(link => (
            <a key={link.title} className="rs-footer-link" href={link.url} target="_blank" rel="noopener noreferrer">
              <span className="rs-footer-link-title">{link.title}</span>
              <ArrowSquareOutIcon className="rs-footer-link-arrow" size={16} weight="bold" />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
