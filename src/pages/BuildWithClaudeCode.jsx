import { useEffect, useState } from 'react'
import NavBar from '../components/NavBar.jsx'
import {
  TerminalWindowIcon, SparkleIcon, BookOpenIcon, FileTextIcon,
  GitBranchIcon, RocketLaunchIcon, CheckCircleIcon, XCircleIcon,
  ArrowRightIcon, ArrowDownIcon, QuestionIcon, WarningIcon,
  PackageIcon, KeyIcon, FolderOpenIcon, EyeIcon,
} from '@phosphor-icons/react'

/* ─────────────────────────────────────────────────────────────
 * Build with Claude Code — a six-tab guide.
 * Prism-native; rides the global NavBar theme (System 1).
 * Color discipline:
 *   blue   = Claude.ai actions (plan, draft prompt)
 *   orange = Claude Code actions (run, edit, ship)
 *   purple = the one agent-emphasis callout
 *   feedback palette = status (Live, success/error)
 * ───────────────────────────────────────────────────────────── */

const css = `
.bwcc-root { min-height: 100vh; background: var(--surface-base); color: var(--text-primary); font-family: var(--font-primary); }

/* Hero — obsidian + refracted light B */
.bwcc-hero {
  position: relative;
  background: var(--text-primary);
  color: var(--surface-base);
  padding: var(--spacing-7) var(--spacing-4) var(--spacing-6);
  text-align: center;
  overflow: hidden;
}
:root[data-theme="dark"] .bwcc-hero { background: var(--surface-base); color: var(--text-primary); }
.bwcc-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--gradient-refracted-b);
  opacity: var(--refracted-opacity-standard);
  pointer-events: none;
}
.bwcc-hero > * { position: relative; }
.bwcc-hero-title {
  font: var(--text-weight-h1) var(--text-size-h1)/var(--text-lh-h1) var(--font-primary);
  letter-spacing: var(--text-ls-h1);
  margin: 0 0 var(--spacing-3);
}
.bwcc-hero-subtitle {
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  max-width: 700px;
  margin: 0 auto;
  opacity: 0.88;
}

/* Shell + tabs row */
.bwcc-shell { max-width: 1100px; margin: 0 auto; padding: var(--spacing-6) var(--spacing-4) var(--spacing-7); }
.bwcc-tabs-row {
  display: flex;
  justify-content: flex-start;
  margin-bottom: var(--spacing-6);
  overflow-x: auto;
}

/* Panel + helpers */
.bwcc-panel { display: flex; flex-direction: column; gap: var(--spacing-6); }
.bwcc-section-title { margin: 0 0 var(--spacing-2); }
.bwcc-section-sub {
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  color: var(--text-secondary);
  margin: 0 0 var(--spacing-5);
  max-width: 720px;
}

/* Grids */
.bwcc-grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--spacing-4); }
.bwcc-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--spacing-3); align-items: stretch; }
@media (max-width: 880px) { .bwcc-grid-3 { grid-template-columns: 1fr; } }

/* Two-mode card body */
.bwcc-mode-card {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
  padding: var(--spacing-5);
  border-radius: var(--radius-md);
  border: 1px solid;
  border-left-width: var(--spacing-1);
  background: var(--surface-1);
}
.bwcc-mode-card--ai   { border-color: var(--blue-500);   background: var(--blue-50); }
.bwcc-mode-card--code { border-color: var(--orange-500); background: var(--orange-50); }
.bwcc-mode-tag {
  display: inline-flex; align-items: center; gap: var(--spacing-1);
  font: var(--text-weight-label) var(--text-size-meta)/1 var(--font-primary);
  letter-spacing: 0.06em; text-transform: uppercase;
  padding: 3px var(--spacing-2);
  border-radius: var(--radius-sm);
  width: fit-content;
}
.bwcc-mode-tag--ai   { background: var(--surface-1); color: var(--blue-500);   border: 1px solid var(--blue-500); }
.bwcc-mode-tag--code { background: var(--surface-1); color: var(--orange-500); border: 1px solid var(--orange-500); }
.bwcc-mode-title {
  font: var(--text-weight-h3) var(--text-size-h3)/var(--text-lh-h3) var(--font-primary);
  letter-spacing: var(--text-ls-h3);
  margin: 0;
}
.bwcc-mode-body {
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  color: var(--text-primary);
  margin: 0;
}

/* Connector card sits between the two modes in the prompt flow */
.bwcc-connector {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  padding: var(--spacing-5);
  border-radius: var(--radius-md);
  border: 1px dashed var(--border-default);
  background: var(--surface-2);
  text-align: center;
}
.bwcc-connector-icon { color: var(--text-tertiary); }
.bwcc-connector-text {
  font: var(--text-weight-caption) var(--text-size-caption)/var(--text-lh-caption) var(--font-primary);
  color: var(--text-secondary);
  margin: 0;
}

/* Definition pair (Claude Code / CLAUDE.md two-line cards) */
.bwcc-def-card {
  display: flex; flex-direction: column; gap: var(--spacing-2);
  padding: var(--spacing-5);
  background: var(--surface-1);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-e2);
}
.bwcc-def-head { display: flex; align-items: center; gap: var(--spacing-2); }
.bwcc-def-title { margin: 0; }
.bwcc-def-body {
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  color: var(--text-secondary);
  margin: 0;
}

/* Prereq list */
.bwcc-prereq-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: var(--spacing-2); }
.bwcc-prereq-list li {
  display: grid; grid-template-columns: 18px 1fr; gap: var(--spacing-2);
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  color: var(--text-primary);
}
.bwcc-prereq-list li::before {
  content: ''; width: 6px; height: 6px; margin-top: 9px;
  border-radius: 50%; background: var(--orange-500);
}

/* Numbered steps */
.bwcc-steps { display: flex; flex-direction: column; gap: var(--spacing-4); }
.bwcc-step {
  display: grid;
  grid-template-columns: var(--spacing-7) 1fr;
  gap: var(--spacing-4);
  padding: var(--spacing-5);
  background: var(--surface-1);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-e2);
}
.bwcc-step-num {
  display: inline-flex; align-items: center; justify-content: center;
  width: var(--spacing-7); height: var(--spacing-7);
  border-radius: var(--radius-md);
  background: var(--text-primary);
  color: var(--surface-base);
  font: var(--text-weight-h3) var(--text-size-h3)/1 var(--font-primary);
}
.bwcc-step-body { display: flex; flex-direction: column; gap: var(--spacing-2); }
.bwcc-step-title {
  font: var(--text-weight-h3) var(--text-size-h3)/var(--text-lh-h3) var(--font-primary);
  letter-spacing: var(--text-ls-h3);
  margin: 0;
}
.bwcc-step-text {
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  color: var(--text-secondary);
  margin: 0;
}

/* Code / command block — uses .prism-mono utility */
.bwcc-code {
  background: var(--text-primary);
  color: var(--surface-base);
  padding: var(--spacing-3) var(--spacing-4);
  border-radius: var(--radius-sm);
  overflow-x: auto;
  font-size: var(--text-size-body);
  line-height: 1.6;
}
.bwcc-code-meta {
  font: var(--text-weight-meta) var(--text-size-meta)/1 var(--font-primary);
  letter-spacing: 0.06em; text-transform: uppercase;
  color: var(--text-tertiary);
  margin-bottom: var(--spacing-1);
}

/* Before / after pair */
.bwcc-ba { display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-4); }
@media (max-width: 720px) { .bwcc-ba { grid-template-columns: 1fr; } }
.bwcc-ba-card {
  display: flex; flex-direction: column; gap: var(--spacing-2);
  padding: var(--spacing-4);
  border-radius: var(--radius-md);
  border: 1px solid;
}
.bwcc-ba--before { background: var(--surface-1); border-color: var(--color-error); }
.bwcc-ba--after  { background: var(--surface-1); border-color: var(--color-success); }
.bwcc-ba-tag {
  font: var(--text-weight-label) var(--text-size-meta)/1 var(--font-primary);
  letter-spacing: 0.06em; text-transform: uppercase;
  padding: 3px var(--spacing-2);
  border-radius: var(--radius-sm);
  width: fit-content;
}
.bwcc-ba--before .bwcc-ba-tag { background: var(--surface-1); color: var(--color-error);   border: 1px solid var(--color-error); }
.bwcc-ba--after  .bwcc-ba-tag { background: var(--surface-1); color: var(--color-success); border: 1px solid var(--color-success); }

/* Anatomy bullets */
.bwcc-anatomy { display: flex; flex-direction: column; gap: var(--spacing-3); }
.bwcc-anatomy-item {
  display: grid; grid-template-columns: 24px 1fr; gap: var(--spacing-3);
  padding: var(--spacing-3);
  border-radius: var(--radius-sm);
  background: var(--surface-2);
}
.bwcc-anatomy-num {
  display: inline-flex; align-items: center; justify-content: center;
  width: 24px; height: 24px;
  border-radius: 50%;
  background: var(--orange-500);
  color: #fff;
  font: var(--text-weight-label) var(--text-size-meta)/1 var(--font-primary);
}
.bwcc-anatomy-text {
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  color: var(--text-primary);
  margin: 0;
}
.bwcc-anatomy-text strong { color: var(--text-primary); }

/* Loop card + Live badge */
.bwcc-loop {
  display: flex; gap: var(--spacing-3); align-items: center;
  padding: var(--spacing-4);
  border-radius: var(--radius-md);
  background: var(--text-primary);
  color: var(--surface-base);
  margin-top: var(--spacing-2);
}
:root[data-theme="dark"] .bwcc-loop { background: var(--surface-2); color: var(--text-primary); border: 1px solid var(--border-strong); }
.bwcc-live {
  display: inline-flex; align-items: center; gap: var(--spacing-1);
  font: var(--text-weight-label) var(--text-size-caption)/1 var(--font-primary);
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--radius-sm);
  background: var(--surface-1);
  color: var(--color-success);
  border: 1px solid var(--color-success);
}
.bwcc-live-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--color-success);
}

/* Agent-emphasis callout — purple, used once */
.bwcc-ask {
  display: flex; gap: var(--spacing-3); align-items: flex-start;
  padding: var(--spacing-4);
  background: var(--purple-50);
  border: 1px solid var(--purple-500);
  border-left-width: var(--spacing-1);
  border-radius: var(--radius-md);
}
.bwcc-ask-icon { color: var(--purple-500); flex-shrink: 0; margin-top: 2px; }
.bwcc-ask-title {
  font: var(--text-weight-label) var(--text-size-label)/1 var(--font-primary);
  color: var(--purple-500);
  margin: 0 0 var(--spacing-1);
}
.bwcc-ask-body {
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  color: var(--text-primary);
  margin: 0;
}

/* Quiz */
.bwcc-quiz { display: flex; flex-direction: column; gap: var(--spacing-4); }
.bwcc-quiz-progress {
  display: flex; align-items: center; gap: var(--spacing-2);
  font: var(--text-weight-caption) var(--text-size-caption)/1 var(--font-primary);
  color: var(--text-tertiary);
}
.bwcc-quiz-q {
  font: var(--text-weight-h3) var(--text-size-h3)/var(--text-lh-h3) var(--font-primary);
  letter-spacing: var(--text-ls-h3);
  margin: 0;
}
.bwcc-quiz-opts { display: flex; flex-direction: column; gap: var(--spacing-2); }
.bwcc-quiz-opt {
  text-align: left;
  padding: var(--spacing-3) var(--spacing-4);
  background: var(--surface-1);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--ease-standard),
              border-color var(--duration-fast) var(--ease-standard);
}
.bwcc-quiz-opt:hover:not(:disabled) { background: var(--surface-2); border-color: var(--border-strong); }
.bwcc-quiz-opt:focus-visible { outline: 3px solid var(--color-focus-ring); outline-offset: 2px; }
.bwcc-quiz-opt:disabled { cursor: default; }
.bwcc-quiz-opt.correct { border-color: var(--color-success); color: var(--color-success); }
.bwcc-quiz-opt.wrong   { border-color: var(--color-error);   color: var(--color-error); }
.bwcc-quiz-explanation {
  display: flex; gap: var(--spacing-2); align-items: flex-start;
  padding: var(--spacing-3);
  background: var(--surface-2);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
}
.bwcc-quiz-actions { display: flex; gap: var(--spacing-3); flex-wrap: wrap; }
.bwcc-quiz-score {
  font: var(--text-weight-h1) var(--text-size-h1)/var(--text-lh-h1) var(--font-primary);
  letter-spacing: var(--text-ls-h1);
  text-align: center;
}

/* Small inline callout boxes for context lines */
.bwcc-context {
  display: flex; gap: var(--spacing-2); align-items: flex-start;
  padding: var(--spacing-3);
  background: var(--surface-2);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-sm);
}
.bwcc-context-icon { color: var(--text-tertiary); flex-shrink: 0; margin-top: 2px; }
.bwcc-context-text {
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  color: var(--text-primary);
  margin: 0;
}

/* Block subtitle for "what / where" pairs */
.bwcc-block { display: flex; flex-direction: column; gap: var(--spacing-3); }
.bwcc-block-title {
  font: var(--text-weight-h3) var(--text-size-h3)/var(--text-lh-h3) var(--font-primary);
  letter-spacing: var(--text-ls-h3);
  margin: 0;
}
`

/* ── Static data ───────────────────────────────────────────── */

const TABS = [
  { id: 'before',  label: 'Before you start' },
  { id: 'start',   label: 'Get going' },
  { id: 'claude',  label: 'CLAUDE.md' },
  { id: 'prompt',  label: 'Write the prompt' },
  { id: 'after',   label: 'After it runs' },
  { id: 'quiz',    label: 'Quiz' },
]

const PREREQ_MACHINE = [
  'A supported OS (macOS, Linux, or Windows) with a stable internet connection.',
  'A GitHub account — you’ll push code to it.',
  'git installed locally (verify with git --version).',
  'Node 18 or newer if you want the npm install route; the native installer skips Node.',
  'A terminal and a code editor you’re comfortable in (VS Code is the path of least resistance).',
  'A Claude plan or API access — Claude Code bills against your Anthropic account, per token.',
]

const PREREQ_HEAD = [
  'Version control is your undo button. Commit before you let the agent change anything you care about.',
  'Review every change before you accept it. The agent waits when you say wait — your job is to read the diff.',
  'Pick a sandbox project. Don’t start with the codebase that pays your rent.',
]

const GET_GOING_STEPS = [
  {
    title: 'Install Claude Code',
    text: 'Prefer the native installer — it sets up the binary directly.',
    codeMeta: 'macOS / Linux',
    code: 'curl -fsSL https://claude.ai/install.sh | bash',
    extraMeta: 'Windows PowerShell',
    extra: 'irm https://claude.ai/install.ps1 | iex',
    altMeta: 'Or, on Node 18+',
    alt: 'npm install -g @anthropic-ai/claude-code',
  },
  {
    title: 'Verify it landed',
    text: 'Two commands. The second one walks you through anything that’s off.',
    codeMeta: 'Terminal',
    code: 'claude --version\nclaude doctor',
  },
  {
    title: 'Sign in',
    text: 'A browser flow handles auth. If you’d rather use an API key, set ANTHROPIC_API_KEY in your environment.',
    codeMeta: 'Terminal',
    code: 'claude login\n# or, in your shell profile:\nexport ANTHROPIC_API_KEY="sk-ant-..."',
  },
  {
    title: 'Open a project',
    text: 'Clone an existing repo or start a new one with git already initialized. The agent expects a git working tree.',
    codeMeta: 'Existing repo',
    code: 'git clone https://github.com/you/your-repo.git\ncd your-repo',
    extraMeta: 'Fresh project',
    extra: 'mkdir my-sandbox && cd my-sandbox\ngit init',
  },
  {
    title: 'Run Claude Code',
    text: 'One command. You’re in.',
    codeMeta: 'Terminal',
    code: 'claude',
  },
]

const PROMPT_ANATOMY = [
  {
    title: 'Separate what’s new from what CLAUDE.md already knows',
    text: 'Don’t restate stack, layout, or commands the agent already reads from CLAUDE.md every session. Spend the prompt on what only this task needs.',
  },
  {
    title: 'Make the wiring explicit',
    text: 'Name the new file path, the route to add, the Home card to register. Wiring is the part the agent guesses badly when you skip it.',
  },
  {
    title: 'State constraints before content',
    text: 'Token-only colors, no hardcoded hex, six tabs ending in a quiz, Tier 1 (no LLM call). Lead with the rules so the rest reads against them.',
  },
  {
    title: 'Be concrete about structure',
    text: 'Tab names, section order, the shape of each card. Vague structure produces a generic layout.',
  },
  {
    title: 'Pin the voice',
    text: 'Sentence case, second person, no exclamation marks. The agent will pick up the page’s tone from the prompt, not from the surrounding pages.',
  },
  {
    title: 'Add invariants and a verify step',
    text: 'List what must stay true (no edits to other pages, no NavBar change). End with: run npm run build to confirm no errors.',
  },
]

const AFTER_STEPS = [
  {
    title: 'Read the diff before you trust it',
    text: 'The agent pauses for approval on each edit. Don’t accept on autopilot — open git status and git diff and read.',
    codeMeta: 'Terminal',
    code: 'git status\ngit diff',
  },
  {
    title: 'Verify it actually works',
    text: 'A clean diff still has to build. Run the build, then start the dev server and click through the flow you asked for.',
    codeMeta: 'Terminal',
    code: 'npm run build\nnpm run dev',
  },
  {
    title: 'Commit as your save point',
    text: 'Small, named commits give you somewhere to roll back to. If the next iteration goes sideways, git reset --hard HEAD is cheap.',
    codeMeta: 'Terminal',
    code: 'git add .\ngit commit -m "add build-with-claude-code guide"',
  },
  {
    title: 'Push to ship',
    text: 'A push to main triggers the deploy. Watch the build log; visit the live URL once it’s green.',
    codeMeta: 'Terminal',
    code: 'git push origin main',
  },
]

const QUIZ = [
  {
    q: 'Why use two tools — Claude.ai for the prompt, Claude Code to run it?',
    options: [
      'They’re the same product behind different UIs.',
      'Claude.ai plans and drafts the prompt; Claude Code runs it on real files — each tool to its strength.',
      'You pick one; the other is optional.',
      'Claude.ai is the chat; Claude Code is the chat with a sidebar.',
    ],
    correct: 1,
    explanation:
      'Claude.ai is good at thinking through what to do; Claude Code is good at doing it on your actual files. The split keeps the planning honest and the editing grounded.',
  },
  {
    q: 'What belongs near the top of CLAUDE.md?',
    options: [
      'A complete list of every npm dependency.',
      'The folder structure printed verbatim.',
      'Architecture gotchas and never-do tripwires — the things the agent can’t infer from reading the code.',
      'Your personal style preferences for code comments.',
    ],
    correct: 2,
    explanation:
      'CLAUDE.md is reloaded every session, so every line earns its place. The agent will read the code; it can’t read your past incidents. Put those first.',
  },
  {
    q: 'You’ve just opened Claude Code on a new project. What should you do before letting it edit?',
    options: [
      'Trust the first plan and review later.',
      'Ask a question first — confirm understanding before any change.',
      'Run npm run build immediately.',
      'Disable git so it can’t commit by mistake.',
    ],
    correct: 1,
    explanation:
      'Read-only questions cost almost nothing and confirm the agent has the right mental model. Edits go better when the model already understands the project.',
  },
  {
    q: 'What does "shipping" actually mean in this workflow?',
    options: [
      'Pressing Enter on the prompt.',
      'Reading the diff, verifying with build + dev, committing, then pushing — and rolling back if something fails.',
      'Just committing locally.',
      'Posting the prompt on social.',
    ],
    correct: 1,
    explanation:
      'Shipping is the closing of the loop: review → verify → commit → push. The rollback path is what makes the rest safe to do quickly.',
  },
]

/* ── Page ──────────────────────────────────────────────────── */

export default function BuildWithClaudeCode() {
  const [activeTab, setActiveTab] = useState(TABS[0].id)

  // Quiz state
  const [qIdx, setQIdx] = useState(0)
  const [chosen, setChosen] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    document.title = 'Build with Claude Code — AI Visual Lab'
  }, [])

  function pickQuiz(idx) {
    if (chosen !== null) return
    setChosen(idx)
    if (idx === QUIZ[qIdx].correct) setScore(s => s + 1)
  }
  function nextQuiz() {
    if (qIdx + 1 >= QUIZ.length) { setDone(true); return }
    setQIdx(i => i + 1); setChosen(null)
  }
  function resetQuiz() { setQIdx(0); setChosen(null); setScore(0); setDone(false) }

  return (
    <div className="bwcc-root">
      <style>{css}</style>
      <NavBar />

      <section className="bwcc-hero">
        <h1 className="bwcc-hero-title">Build with Claude Code</h1>
        <p className="bwcc-hero-subtitle">
          You write a plain-language ask in Claude.ai. It plans and drafts a detailed prompt. You run that prompt in Claude Code, then review and ship — two tools, each to its strength.
        </p>
      </section>

      <div className="bwcc-shell">
        <div className="bwcc-tabs-row">
          <div className="prism-tabs" role="tablist" aria-label="Build with Claude Code sections">
            {TABS.map(t => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={t.id === activeTab}
                className="prism-tab"
                onClick={() => setActiveTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Tab 1 — Before you start ── */}
        {activeTab === 'before' && (
          <div className="bwcc-panel">
            <div>
              <h2 className="prism-h2 bwcc-section-title">What you’re working with</h2>
              <p className="bwcc-section-sub">Two things before you install anything.</p>
              <div className="bwcc-grid-2">
                <div className="bwcc-def-card">
                  <div className="bwcc-def-head">
                    <TerminalWindowIcon size={22} weight="duotone" />
                    <h3 className="prism-h3 bwcc-def-title">Claude Code</h3>
                  </div>
                  <p className="bwcc-def-body">
                    An agent that runs in your terminal. It reads files, edits files, runs commands, and pauses before anything risky.
                  </p>
                </div>
                <div className="bwcc-def-card">
                  <div className="bwcc-def-head">
                    <BookOpenIcon size={22} weight="duotone" />
                    <h3 className="prism-h3 bwcc-def-title">CLAUDE.md</h3>
                  </div>
                  <p className="bwcc-def-body">
                    A short file the agent reads at the start of every session. Treat it as the rules of the house — what to do, what never to do.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="prism-h2 bwcc-section-title">Prerequisites</h2>
              <p className="bwcc-section-sub">Half of these are tools; half are habits.</p>
              <div className="bwcc-grid-2">
                <div className="bwcc-block">
                  <h3 className="bwcc-block-title">On your machine</h3>
                  <ul className="bwcc-prereq-list">
                    {PREREQ_MACHINE.map((line, i) => <li key={i}>{line}</li>)}
                  </ul>
                </div>
                <div className="bwcc-block">
                  <h3 className="bwcc-block-title">In your head</h3>
                  <ul className="bwcc-prereq-list">
                    {PREREQ_HEAD.map((line, i) => <li key={i}>{line}</li>)}
                  </ul>
                </div>
              </div>
            </div>

            <div className="bwcc-grid-2">
              <div className="bwcc-context">
                <span className="bwcc-context-icon"><FolderOpenIcon size={18} weight="duotone" /></span>
                <p className="bwcc-context-text">
                  <strong>Where the app runs:</strong> on your machine at localhost during dev; on a hosted URL once deployed (Vercel auto-deploys this repo from main).
                </p>
              </div>
              <div className="bwcc-context">
                <span className="bwcc-context-icon"><PackageIcon size={18} weight="duotone" /></span>
                <p className="bwcc-context-text">
                  <strong>Where data lives:</strong> in memory for the current page view, in browser localStorage for things that should survive refresh, in a database when more than one user has to see it.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab 2 — Get going ── */}
        {activeTab === 'start' && (
          <div className="bwcc-panel">
            <div>
              <h2 className="prism-h2 bwcc-section-title">From empty terminal to running agent</h2>
              <p className="bwcc-section-sub">Five steps. Each one verifies before the next.</p>
              <div className="bwcc-steps">
                {GET_GOING_STEPS.map((s, idx) => (
                  <div key={idx} className="bwcc-step">
                    <span className="bwcc-step-num">{idx + 1}</span>
                    <div className="bwcc-step-body">
                      <h3 className="bwcc-step-title">{s.title}</h3>
                      <p className="bwcc-step-text">{s.text}</p>
                      <div>
                        {s.codeMeta && <div className="bwcc-code-meta">{s.codeMeta}</div>}
                        <pre className="bwcc-code prism-mono">{s.code}</pre>
                      </div>
                      {s.extra && (
                        <div>
                          <div className="bwcc-code-meta">{s.extraMeta}</div>
                          <pre className="bwcc-code prism-mono">{s.extra}</pre>
                        </div>
                      )}
                      {s.alt && (
                        <div>
                          <div className="bwcc-code-meta">{s.altMeta}</div>
                          <pre className="bwcc-code prism-mono">{s.alt}</pre>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bwcc-ask">
              <span className="bwcc-ask-icon"><SparkleIcon size={22} weight="duotone" /></span>
              <div>
                <p className="bwcc-ask-title">Ask a question before you ask for an edit</p>
                <p className="bwcc-ask-body">
                  The first thing you do in a new session shouldn’t be "change this file." Ask the agent to summarize the layout, or to explain how a specific page is wired. Read-only questions cost almost nothing and confirm it has the right mental model — every edit after that goes better.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab 3 — CLAUDE.md ── */}
        {activeTab === 'claude' && (
          <div className="bwcc-panel">
            <div>
              <h2 className="prism-h2 bwcc-section-title">CLAUDE.md is a contract, not documentation</h2>
              <p className="bwcc-section-sub">
                Every line is reloaded at the start of every session. That means every line earns its place — and that lean beats complete.
              </p>
            </div>

            <div className="bwcc-grid-2">
              <div className="bwcc-def-card">
                <div className="bwcc-def-head">
                  <WarningIcon size={22} weight="duotone" />
                  <h3 className="prism-h3 bwcc-def-title">Fill order — what goes first</h3>
                </div>
                <p className="bwcc-def-body">
                  Architecture gotchas and never-do tripwires. The things the agent can’t infer from reading the code: prior incidents, edge cases, the workaround that’s load-bearing in one spot. If reading the file from cold tells someone "here’s how to not blow it up," it’s pulling weight.
                </p>
              </div>
              <div className="bwcc-def-card">
                <div className="bwcc-def-head">
                  <FileTextIcon size={22} weight="duotone" />
                  <h3 className="prism-h3 bwcc-def-title">Then the discoverables</h3>
                </div>
                <p className="bwcc-def-body">
                  Commands, layout, and conventions come second. The agent could find these by reading the repo, but every line you save here saves a tool call later. Keep them concise: "scripts: dev/build/preview" beats a paste of package.json.
                </p>
              </div>
            </div>

            <div>
              <h3 className="prism-h3 bwcc-section-title">Before / after</h3>
              <p className="bwcc-section-sub">Same project, two CLAUDE.md sections — one vague, one specific.</p>
              <div className="bwcc-ba">
                <div className="bwcc-ba-card bwcc-ba--before">
                  <span className="bwcc-ba-tag">Before · vague</span>
                  <pre className="bwcc-code prism-mono">{`State

We use React. Be careful with state.
Don’t put server data in the wrong place.`}</pre>
                </div>
                <div className="bwcc-ba-card bwcc-ba--after">
                  <span className="bwcc-ba-tag">After · specific</span>
                  <pre className="bwcc-code prism-mono">{`State

Server state → React Query.
UI state → Zustand. Never put server state in Zustand.
Forms with async defaults: render inside a child that
only mounts after the data resolves. See
src/app/(app)/settings/learning/page.tsx for the
canonical pattern (and why).`}</pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab 4 — Write the prompt ── */}
        {activeTab === 'prompt' && (
          <div className="bwcc-panel">
            <div>
              <h2 className="prism-h2 bwcc-section-title">The two-mode flow, visible</h2>
              <p className="bwcc-section-sub">
                Plain-language ask in Claude.ai → it plans + drafts → paste the detailed prompt into Claude Code.
              </p>
            </div>

            <div className="bwcc-grid-3">
              <div className="bwcc-mode-card bwcc-mode-card--ai">
                <span className="bwcc-mode-tag bwcc-mode-tag--ai">
                  <SparkleIcon size={12} weight="duotone" /> In Claude.ai
                </span>
                <h3 className="bwcc-mode-title">What you type</h3>
                <p className="bwcc-mode-body">
                  Give me a Claude Code prompt to create a page for teaching how neural networks work.
                </p>
              </div>

              <div className="bwcc-connector">
                <span className="bwcc-connector-icon"><ArrowDownIcon size={28} weight="bold" /></span>
                <p className="bwcc-connector-text">
                  Claude.ai plans the page, decides what the prompt needs to cover, and writes it.
                </p>
              </div>

              <div className="bwcc-mode-card bwcc-mode-card--code">
                <span className="bwcc-mode-tag bwcc-mode-tag--code">
                  <TerminalWindowIcon size={12} weight="duotone" /> In Claude Code
                </span>
                <h3 className="bwcc-mode-title">What you paste</h3>
                <p className="bwcc-mode-body">
                  A detailed, constraint-led brief: file path, route, Home card shape, six tabs ending in a quiz, voice, invariants, and a verify step.
                </p>
              </div>
            </div>

            <div>
              <h3 className="prism-h3 bwcc-section-title">Anatomy of a good prompt</h3>
              <p className="bwcc-section-sub">It’s mostly constraints and wiring. The description is the small part.</p>
              <div className="bwcc-anatomy">
                {PROMPT_ANATOMY.map((item, idx) => (
                  <div key={idx} className="bwcc-anatomy-item">
                    <span className="bwcc-anatomy-num">{idx + 1}</span>
                    <div>
                      <p className="bwcc-anatomy-text"><strong>{item.title}</strong> — {item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Tab 5 — After it runs ── */}
        {activeTab === 'after' && (
          <div className="bwcc-panel">
            <div>
              <h2 className="prism-h2 bwcc-section-title">Close the loop</h2>
              <p className="bwcc-section-sub">Four moves between "the agent paused" and "it’s live."</p>
              <div className="bwcc-steps">
                {AFTER_STEPS.map((s, idx) => {
                  const Icon = idx === 0 ? EyeIcon
                    : idx === 1 ? CheckCircleIcon
                    : idx === 2 ? GitBranchIcon
                    : RocketLaunchIcon
                  return (
                    <div key={idx} className="bwcc-step">
                      <span className="bwcc-step-num" aria-hidden="true">
                        <Icon size={20} weight="duotone" color="currentColor" />
                      </span>
                      <div className="bwcc-step-body">
                        <h3 className="bwcc-step-title">{s.title}</h3>
                        <p className="bwcc-step-text">{s.text}</p>
                        <div>
                          {s.codeMeta && <div className="bwcc-code-meta">{s.codeMeta}</div>}
                          <pre className="bwcc-code prism-mono">{s.code}</pre>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="bwcc-loop">
              <ArrowRightIcon size={22} weight="bold" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
                <strong>It’s a loop, not a line.</strong>
                <span>
                  If the review reads wrong or the build fails, roll back the commit and refine the prompt. The loop is the workflow — not the first run through it.
                </span>
              </div>
              <span className="bwcc-live" aria-label="Live status">
                <span className="bwcc-live-dot" aria-hidden="true" />
                Live
              </span>
            </div>
          </div>
        )}

        {/* ── Tab 6 — Quiz ── */}
        {activeTab === 'quiz' && (
          <div className="bwcc-panel">
            <div className="bwcc-quiz">
              {!done && (
                <>
                  <div className="bwcc-quiz-progress">
                    <QuestionIcon size={14} weight="duotone" />
                    Question {qIdx + 1} of {QUIZ.length} · score {score}
                  </div>
                  <h2 className="bwcc-quiz-q">{QUIZ[qIdx].q}</h2>
                  <div className="bwcc-quiz-opts">
                    {QUIZ[qIdx].options.map((opt, idx) => {
                      let cls = 'bwcc-quiz-opt'
                      if (chosen !== null) {
                        if (idx === QUIZ[qIdx].correct) cls += ' correct'
                        else if (idx === chosen) cls += ' wrong'
                      }
                      return (
                        <button
                          key={idx}
                          type="button"
                          className={cls}
                          disabled={chosen !== null}
                          onClick={() => pickQuiz(idx)}
                        >
                          {opt}
                        </button>
                      )
                    })}
                  </div>
                  {chosen !== null && (
                    <>
                      <div className="bwcc-quiz-explanation">
                        {chosen === QUIZ[qIdx].correct
                          ? <CheckCircleIcon size={20} weight="duotone" style={{ color: 'var(--color-success)', flexShrink: 0, marginTop: '2px' }} />
                          : <XCircleIcon     size={20} weight="duotone" style={{ color: 'var(--color-error)',   flexShrink: 0, marginTop: '2px' }} />}
                        <span>{QUIZ[qIdx].explanation}</span>
                      </div>
                      <div className="bwcc-quiz-actions">
                        <button type="button" className="btn btn--md btn--orange" onClick={nextQuiz}>
                          {qIdx + 1 >= QUIZ.length ? 'See results' : 'Next question'}
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}
              {done && (
                <>
                  <div className="bwcc-quiz-score">{score} / {QUIZ.length}</div>
                  <p className="bwcc-section-sub" style={{ textAlign: 'center' }}>
                    {score === QUIZ.length
                      ? 'Solid grasp of the loop.'
                      : 'A re-read of the prompt-anatomy and after-it-runs tabs covers what each question tested.'}
                  </p>
                  <div className="bwcc-quiz-actions" style={{ justifyContent: 'center' }}>
                    <button type="button" className="btn btn--md btn--default" onClick={resetQuiz}>
                      Retake quiz
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
