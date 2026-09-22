import { useState, useEffect, useRef, useMemo } from 'react'
import NavBar from '../components/NavBar.jsx'
import {
  BooksIcon, ArrowRightIcon, ChartLineDownIcon, ArrowsClockwiseIcon,
  WarningIcon, CalendarBlankIcon, BrainIcon, RulerIcon, ScalesIcon,
  PlayIcon, PauseIcon, ArrowCounterClockwiseIcon, StarIcon,
} from '@phosphor-icons/react'

const ICON_BY_KEY = {
  books: BooksIcon, arrow: ArrowRightIcon, chartdown: ChartLineDownIcon, refresh: ArrowsClockwiseIcon,
  warning: WarningIcon, calendar: CalendarBlankIcon, brain: BrainIcon, ruler: RulerIcon, scales: ScalesIcon,
}
const IconFor = ({ name, ...rest }) => {
  const C = ICON_BY_KEY[name]
  return C ? <C {...rest} /> : null
}

const css = `
/* ── Phase 6 followup: IntroLLMs rebound to Prism tokens.
 *  Blue = loop core / structured progression; orange = on-demand
 *  emphasis (top predictions, user input); success = assistant output;
 *  feedback palette = limitation severities. ─────────────────── */

.il-root { min-height: 100vh; background: var(--surface-base); color: var(--text-primary); overflow-x: hidden; }

/* Hero — obsidian + refracted-light (§5.2) */
.il-hero {
  position: relative;
  text-align: center;
  padding: var(--spacing-7) var(--spacing-4) var(--spacing-6);
  background: var(--text-primary);
  color: var(--surface-base);
  overflow: hidden;
}
:root[data-theme="dark"] .il-hero {
  background: var(--surface-base);
  color: var(--text-primary);
}
.il-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--gradient-refracted-b);
  opacity: var(--refracted-opacity-standard);
  pointer-events: none;
}
.il-hero > * { position: relative; }
.il-eyebrow {
  font: var(--text-weight-label) var(--text-size-caption)/var(--text-lh-caption) var(--font-primary);
  letter-spacing: 0.08em;
  color: var(--blue-300);
  margin-bottom: var(--spacing-3);
}
.il-title {
  font: var(--text-weight-h1) var(--text-size-h1)/var(--text-lh-h1) var(--font-primary);
  letter-spacing: var(--text-ls-h1);
  margin-bottom: var(--spacing-3);
}
.il-subtitle {
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  max-width: 540px;
  margin: 0 auto;
  opacity: 0.85;
}

.il-tabs-row {
  display: flex;
  justify-content: center;
  padding: var(--spacing-5) var(--spacing-4) var(--spacing-6);
  background: var(--surface-base);
}

.il-panel { max-width: 920px; margin: 0 auto; padding: 0 var(--spacing-4) var(--spacing-7); }

.il-section-title {
  font: var(--text-weight-h2) var(--text-size-h2)/var(--text-lh-h2) var(--font-primary);
  letter-spacing: var(--text-ls-h2);
  color: var(--text-primary);
  margin-bottom: var(--spacing-2);
}
.il-section-sub {
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-6);
  max-width: 720px;
}

/* Cards */
.il-card {
  background: var(--surface-1);
  border: 1px solid var(--border-default);
  box-shadow: var(--shadow-e2);
  border-radius: var(--radius-md);
  padding: var(--spacing-5);
  margin-bottom: var(--spacing-4);
}
.il-card-plain {
  background: var(--surface-2);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--spacing-5);
  margin-bottom: var(--spacing-4);
}
.il-card-emphasis-title {
  font: var(--text-weight-label) var(--text-size-body)/1.2 var(--font-primary);
  color: var(--text-primary);
  margin-bottom: var(--spacing-2);
}
.il-card-body {
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  color: var(--text-secondary);
  margin: 0;
}

/* Buttons */
.il-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-1);
  background: var(--orange-500);
  border: 1px solid var(--orange-500);
  color: #fff;
  font: 600 var(--text-size-body)/1 var(--font-primary);
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard);
}
.il-btn:hover { background: #D45C10; border-color: #D45C10; }
.il-btn:focus-visible { outline: 3px solid var(--color-focus-ring); outline-offset: 2px; }
.il-btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-1);
  background: transparent;
  border: 1px solid var(--border-default);
  color: var(--text-primary);
  font: 600 var(--text-size-body)/1 var(--font-primary);
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard);
  margin-left: var(--spacing-2);
}
.il-btn-ghost:hover { background: var(--surface-2); border-color: var(--border-strong); }
.il-btn-ghost:focus-visible { outline: 3px solid var(--color-focus-ring); outline-offset: 2px; }

/* Stats grid */
.il-stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: var(--spacing-3); margin-bottom: var(--spacing-7); }
.il-stat-card {
  background: var(--surface-1);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--spacing-4);
}
.il-stat-label {
  font: var(--text-weight-label) var(--text-size-caption)/1 var(--font-primary);
  letter-spacing: 0.06em;
  color: var(--text-tertiary);
  margin-bottom: var(--spacing-2);
}
.il-stat-value {
  font: var(--text-weight-label) var(--text-size-body)/1.4 var(--font-primary);
  color: var(--text-primary);
}

/* Prompt chips */
.il-prompt-chips { display: flex; gap: var(--spacing-2); flex-wrap: wrap; margin-bottom: var(--spacing-5); }
.il-chip {
  background: transparent;
  border: 1px solid var(--border-default);
  color: var(--text-secondary);
  font: var(--text-weight-label) var(--text-size-caption)/1 var(--font-primary);
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: 100px;
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard), color var(--duration-fast) var(--ease-standard);
}
.il-chip:hover { background: var(--surface-2); border-color: var(--border-strong); color: var(--text-primary); }
.il-chip.active { background: var(--text-primary); border-color: var(--text-primary); color: var(--surface-base); }
.il-chip:focus-visible { outline: 3px solid var(--color-focus-ring); outline-offset: 2px; }

/* Prediction rows */
.il-pred-row { display: flex; align-items: center; gap: var(--spacing-3); margin-bottom: var(--spacing-2); }
.il-pred-token {
  font-family: 'IBM Plex Mono', ui-monospace, monospace;
  font-size: var(--text-size-caption);
  min-width: 130px;
  color: var(--text-secondary);
}
.il-pred-bar-bg { flex: 1; height: 8px; background: var(--surface-3); border-radius: 4px; overflow: hidden; }
.il-pred-bar { height: 100%; border-radius: 4px; transition: width var(--duration-deliberate) var(--ease-standard); }
.il-pred-pct {
  font-family: 'IBM Plex Mono', ui-monospace, monospace;
  font-size: var(--text-size-caption);
  min-width: 42px;
  text-align: right;
  color: var(--text-secondary);
}

/* Token display */
.il-token-display {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: var(--spacing-4);
  background: var(--surface-2);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  min-height: 60px;
}
.il-token {
  padding: 3px 8px;
  border-radius: var(--radius-sm);
  font-family: 'IBM Plex Mono', ui-monospace, monospace;
  font-size: var(--text-size-caption);
  border: 1px solid transparent;
}

/* Training loop nodes */
.il-loop-nodes { display: flex; justify-content: center; align-items: center; gap: 0; flex-wrap: wrap; margin: var(--spacing-5) 0; }
.il-loop-node {
  background: var(--surface-1);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--spacing-4);
  text-align: center;
  width: 150px;
  transition: background-color var(--duration-deliberate) var(--ease-standard), border-color var(--duration-deliberate) var(--ease-standard), box-shadow var(--duration-deliberate) var(--ease-standard);
}
.il-loop-node.active {
  background: var(--blue-50);
  border-color: var(--blue-500);
  box-shadow: var(--shadow-e1);
}
.il-loop-arrow {
  color: var(--text-tertiary);
  padding: 0 var(--spacing-1);
  display: inline-flex;
}
.il-loop-icon {
  display: inline-flex;
  justify-content: center;
  margin-bottom: var(--spacing-1);
  color: var(--text-primary);
}
.il-loop-node.active .il-loop-icon { color: var(--blue-500); }
.il-loop-label {
  font: var(--text-weight-label) var(--text-size-caption)/1.2 var(--font-primary);
  color: var(--text-primary);
  margin-bottom: 4px;
}
.il-loop-desc {
  font: var(--text-weight-body) var(--text-size-meta)/1.4 var(--font-primary);
  color: var(--text-secondary);
}
.il-loop-node.active .il-loop-label { color: var(--blue-500); }

/* Limitation cards (feedback palette per severity) */
.il-limit-card {
  border-radius: var(--radius-md);
  border: 1px solid var(--border-default);
  background: var(--surface-1);
  margin-bottom: var(--spacing-2);
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard);
  overflow: hidden;
  text-align: left;
  width: 100%;
  padding: 0;
}
.il-limit-card:hover { background: var(--surface-2); border-color: var(--border-strong); }
.il-limit-card:focus-visible { outline: 3px solid var(--color-focus-ring); outline-offset: 2px; }
.il-limit-card.expanded { border-color: var(--lim-tint, var(--border-strong)); background: var(--surface-1); }
.il-limit-header { display: flex; align-items: center; gap: var(--spacing-3); padding: var(--spacing-4); }
.il-limit-icon { color: var(--lim-tint, var(--text-secondary)); display: inline-flex; }
.il-limit-title {
  font: var(--text-weight-label) var(--text-size-body)/1.4 var(--font-primary);
  color: var(--text-primary);
  margin-bottom: var(--spacing-1);
}
.il-limit-short {
  font: var(--text-weight-body) var(--text-size-caption)/1.5 var(--font-primary);
  color: var(--text-secondary);
}
.il-limit-detail {
  padding: 0 var(--spacing-4) var(--spacing-4) calc(var(--spacing-4) + 32px);
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  color: var(--text-secondary);
}
.il-limit-sev-label {
  font: var(--text-weight-label) var(--text-size-meta)/1 var(--font-primary);
  letter-spacing: 0.06em;
  color: var(--lim-tint, var(--text-secondary));
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-1);
}
.il-severity {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--lim-tint, var(--text-secondary));
}

/* Role boxes */
.il-role-box { border-radius: var(--radius-md); padding: var(--spacing-3) var(--spacing-4); margin-bottom: var(--spacing-2); border: 1px solid; }
.il-role-label {
  font: var(--text-weight-label) var(--text-size-meta)/1 var(--font-primary);
  letter-spacing: 0.08em;
  margin-bottom: var(--spacing-1);
}
.il-role-text {
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  color: var(--text-primary);
}
.il-role-box--system { background: var(--blue-50);   border-color: var(--blue-500); }
.il-role-box--system .il-role-label { color: var(--blue-500); }
.il-role-box--user   { background: var(--orange-50); border-color: var(--orange-500); }
.il-role-box--user .il-role-label   { color: var(--orange-500); }
.il-role-box--assistant {
  background: var(--surface-1);
  border-color: var(--color-success);
}
.il-role-box--assistant .il-role-label { color: var(--color-success); }

.il-response-box {
  background: var(--surface-1);
  border: 1px solid var(--color-success);
  border-radius: var(--radius-md);
  padding: var(--spacing-4);
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  color: var(--text-primary);
  transition: opacity var(--duration-standard) var(--ease-standard);
}
.il-response-box.hidden { opacity: 0; }

/* Context window bar */
.il-context-bar-bg {
  width: 100%;
  height: 24px;
  background: var(--surface-3);
  border-radius: var(--radius-sm);
  overflow: hidden;
  margin: var(--spacing-3) 0;
  position: relative;
}
.il-context-bar-fill {
  height: 100%;
  border-radius: var(--radius-sm);
  background: var(--blue-500);
  transition: width var(--duration-deliberate) var(--ease-standard);
  display: flex;
  align-items: center;
  padding-left: var(--spacing-2);
  color: #fff;
  font-family: 'IBM Plex Mono', ui-monospace, monospace;
  font-size: var(--text-size-meta);
}

.il-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-3); margin-bottom: var(--spacing-6); }
@media (max-width: 640px) { .il-two-col { grid-template-columns: 1fr; } }

/* Preset / context selectors share .il-chip styling but rectangular */
.il-preset-btns { display: flex; gap: var(--spacing-2); flex-wrap: wrap; margin-bottom: var(--spacing-5); }
.il-preset-btn,
.il-context-btn {
  background: transparent;
  border: 1px solid var(--border-default);
  color: var(--text-secondary);
  font: var(--text-weight-label) var(--text-size-caption)/1 var(--font-primary);
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard), color var(--duration-fast) var(--ease-standard);
}
.il-preset-btn:hover:not(.active),
.il-context-btn:hover:not(.active) {
  background: var(--surface-2);
  border-color: var(--border-strong);
  color: var(--text-primary);
}
.il-preset-btn.active,
.il-context-btn.active {
  background: var(--text-primary);
  border-color: var(--text-primary);
  color: var(--surface-base);
}
.il-preset-btn:focus-visible,
.il-context-btn:focus-visible {
  outline: 3px solid var(--color-focus-ring);
  outline-offset: 2px;
}

/* Quiz */
.il-quiz-wrap { max-width: 720px; margin: 0 auto; }
.il-quiz-progress { display: flex; align-items: center; gap: var(--spacing-3); margin-bottom: var(--spacing-6); }
.il-quiz-progress-bar-bg { flex: 1; height: 4px; background: var(--surface-3); border-radius: 2px; overflow: hidden; }
.il-quiz-progress-bar {
  height: 100%;
  background: var(--text-primary);
  border-radius: 2px;
  transition: width var(--duration-standard) var(--ease-standard);
}
.il-quiz-progress-label {
  font: var(--text-weight-body) var(--text-size-caption)/1 var(--font-primary);
  color: var(--text-secondary);
  white-space: nowrap;
}

.il-diff-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-1);
  font: var(--text-weight-label) var(--text-size-caption)/1 var(--font-primary);
  padding: 3px 10px;
  border-radius: 100px;
  border: 1px solid;
  background: var(--surface-1);
  margin-bottom: var(--spacing-3);
}
.il-diff-badge::before {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}
.il-diff-badge.easy   { color: var(--color-success); border-color: var(--color-success); }
.il-diff-badge.medium { color: var(--color-warning); border-color: var(--color-warning); }
.il-diff-badge.hard   { color: var(--color-info);    border-color: var(--color-info); }

.il-quiz-q {
  font: var(--text-weight-h3) var(--text-size-h3)/var(--text-lh-h3) var(--font-primary);
  letter-spacing: var(--text-ls-h3);
  color: var(--text-primary);
  margin-bottom: var(--spacing-5);
}
.il-quiz-opts { display: flex; flex-direction: column; gap: var(--spacing-2); margin-bottom: var(--spacing-5); }
.il-quiz-opt {
  background: var(--surface-1);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--spacing-3) var(--spacing-4);
  cursor: pointer;
  text-align: left;
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  color: var(--text-primary);
  transition: background-color var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard);
}
.il-quiz-opt:hover:not(:disabled) { background: var(--surface-2); border-color: var(--border-strong); }
.il-quiz-opt:focus-visible { outline: 3px solid var(--color-focus-ring); outline-offset: 2px; }
.il-quiz-opt:disabled { cursor: default; }
.il-quiz-opt.correct { border-color: var(--color-success); }
.il-quiz-opt.wrong   { border-color: var(--color-error); }
.il-quiz-opt.neutral { opacity: 0.55; }

.il-quiz-explanation {
  background: var(--surface-2);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--spacing-3) var(--spacing-4);
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-5);
}
.il-quiz-explanation strong { color: var(--text-primary); }

.il-quiz-done { text-align: center; padding: var(--spacing-7) 0; }
.il-quiz-done-score {
  font: var(--text-weight-h1) var(--text-size-h1)/1 var(--font-primary);
  letter-spacing: var(--text-ls-h1);
  color: var(--text-primary);
  margin-bottom: var(--spacing-2);
}
.il-quiz-done-label {
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-6);
}

.il-textarea {
  width: 100%;
  background: var(--surface-2);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-sm);
  padding: var(--spacing-3);
  color: var(--text-primary);
  font-family: 'IBM Plex Mono', ui-monospace, monospace;
  font-size: var(--text-size-caption);
  outline: none;
  resize: vertical;
  min-height: 72px;
  transition: border-color var(--duration-fast) var(--ease-standard), box-shadow var(--duration-fast) var(--ease-standard);
  box-sizing: border-box;
}
.il-textarea:focus-visible {
  border-color: var(--purple-500);
  box-shadow: 0 0 0 3px var(--color-focus-ring);
}
`

// ─── Next token data ────────────────────────────────────────────────────────
const NEXT_TOKEN_DATA = [
  {
    prompt: 'The capital of France is',
    predictions: [
      { token: ' Paris', prob: 0.94 },
      { token: ' located', prob: 0.02 },
      { token: ' a', prob: 0.01 },
      { token: ' the', prob: 0.01 },
      { token: ' known', prob: 0.01 },
    ]
  },
  {
    prompt: 'The best way to learn programming is to',
    predictions: [
      { token: ' practice', prob: 0.41 },
      { token: ' build', prob: 0.28 },
      { token: ' start', prob: 0.14 },
      { token: ' read', prob: 0.09 },
      { token: ' write', prob: 0.05 },
    ]
  },
  {
    prompt: 'Water boils at 100 degrees',
    predictions: [
      { token: ' Celsius', prob: 0.71 },
      { token: ' at', prob: 0.10 },
      { token: ' Fahrenheit', prob: 0.08 },
      { token: ' under', prob: 0.06 },
      { token: ' when', prob: 0.03 },
    ]
  },
  {
    prompt: 'To make a cup of tea, first',
    predictions: [
      { token: ' boil', prob: 0.52 },
      { token: ' heat', prob: 0.21 },
      { token: ' add', prob: 0.12 },
      { token: ' fill', prob: 0.08 },
      { token: ' place', prob: 0.05 },
    ]
  },
  {
    prompt: 'The stock market',
    predictions: [
      { token: ' crashed', prob: 0.22 },
      { token: ' rose', prob: 0.19 },
      { token: ' is', prob: 0.17 },
      { token: ' fell', prob: 0.14 },
      { token: ' rallied', prob: 0.11 },
    ]
  }
]

// ─── Token colors — 4-step semantic ramp (blue → neutral → orange) ────────
const TOKEN_COLORS = [
  { bg: 'var(--blue-50)',   border: 'var(--blue-100)',   color: 'var(--blue-500)' },
  { bg: 'var(--surface-2)', border: 'var(--border-default)', color: 'var(--text-primary)' },
  { bg: 'var(--surface-2)', border: 'var(--border-default)', color: 'var(--text-secondary)' },
  { bg: 'var(--orange-50)', border: 'var(--orange-100)', color: 'var(--orange-500)' },
]

// ─── Training loop nodes — all four are deterministic loop steps → blue (§5.3) ──
const LOOP_NODES = [
  { iconKey: 'books',     label: 'Training data',  desc: 'Batch of text examples loaded.' },
  { iconKey: 'arrow',     label: 'Forward pass',   desc: 'Input flows through transformer layers.' },
  { iconKey: 'chartdown', label: 'Compute loss',   desc: 'Compare prediction to the actual next token.' },
  { iconKey: 'refresh',   label: 'Update weights', desc: 'Gradient descent adjusts millions of parameters.' },
]

const LOSS_CURVE = [2.4, 2.1, 1.8, 1.55, 1.35, 1.18, 1.04, 0.92, 0.82, 0.74, 0.67, 0.57, 0.46, 0.38, 0.30]

// ─── Context window scenarios ─────────────────────────────────────────────
const CONTEXT_SCENARIOS = [
  { label: 'Small (512)', tokens: 512, max: 128000, use: '~half a page' },
  { label: 'Medium (4K)', tokens: 4096, max: 128000, use: '~3 short articles' },
  { label: 'Large (128K)', tokens: 128000, max: 128000, use: '~book chapter' },
]

// ─── System prompt presets ────────────────────────────────────────────────
const SYSTEM_PRESETS = [
  {
    label: 'Formal expert',
    system: 'You are a technical expert. Be precise and use proper terminology.',
    response: 'Machine learning is a subset of artificial intelligence that employs statistical methods to enable computational systems to learn from data, iteratively improving task performance without being explicitly programmed for each scenario.'
  },
  {
    label: 'Casual friend',
    system: 'You are a friendly assistant. Keep things simple and conversational.',
    response: "Basically, machine learning is when you teach a computer by showing it lots of examples instead of writing out every rule. Instead of coding 'a cat has pointy ears', you just show it 10,000 cat photos and it figures out the pattern itself."
  },
  {
    label: 'Socratic teacher',
    system: 'You are a Socratic teacher. Guide with questions, do not give direct answers.',
    response: "Let's explore this together. Have you ever noticed how spam filters seem to 'know' what's junk mail? How do you think they learned that? What if you could teach a computer the same way a child learns — through examples rather than strict rules?"
  }
]

// ─── Limitations ─────────────────────────────────────────────────────────
// Severity maps to Prism feedback palette: high=error, medium=warning,
// low=info. Tints flow through --lim-tint on .il-limit-card.
const LIMITATIONS = [
  { iconKey: 'warning',  title: 'Hallucination',          short: 'LLMs can confidently state false information.',                              severity: 'high',
    detail: 'Because LLMs predict likely text rather than retrieve facts, they can generate plausible-sounding but completely fabricated details — wrong dates, fake citations, invented statistics. The model has no internal "truth checker." Mitigation: use RAG to ground answers in real sources, always verify critical facts.' },
  { iconKey: 'calendar', title: 'Knowledge cutoff',       short: 'LLMs only know what was in their training data.',                            severity: 'medium',
    detail: "Training data has a fixed end date. The model has no awareness of events, papers, or changes after that date. Ask about yesterday's news and it will either say it doesn't know or — worse — hallucinate an answer. Mitigation: RAG with live data sources, or models with web-search tools." },
  { iconKey: 'brain',    title: 'No persistent memory',   short: 'Each conversation starts fresh with no memory of past sessions.',            severity: 'medium',
    detail: 'Unlike humans, LLMs have no memory between separate conversations. Every new chat starts from zero. Within a conversation, they only remember what fits in the current context window. Mitigation: external memory stores, conversation summarisation, RAG over past interactions.' },
  { iconKey: 'ruler',    title: 'Context window limit',   short: 'LLMs can only process a fixed amount of text at once.',                       severity: 'medium',
    detail: "Even large-context models have limits. Feeding in too much text leads to the 'lost in the middle' problem — the model underweights information in the centre of a long context. Mitigation: smart chunking, retrieval, summarisation of long documents before sending." },
  { iconKey: 'scales',   title: 'Bias and consistency',   short: 'Outputs can reflect training data biases and vary between runs.',            severity: 'low',
    detail: 'LLMs absorb biases present in their training data. They can also give different answers to the same question asked differently or on different days. They are not deterministic (unless temperature = 0). Mitigation: careful prompt design, output validation, human review for high-stakes decisions.' },
]
const SEVERITY_TINT = {
  high:   'var(--color-error)',
  medium: 'var(--color-warning)',
  low:    'var(--color-info)',
}

// ─── Quiz ─────────────────────────────────────────────────────────────────
const DIFFICULTY_ORDER = ['easy', 'medium', 'hard']
const SESSION_SIZE = 6

function bumpDifficulty(current, correct) {
  const idx = DIFFICULTY_ORDER.indexOf(current)
  return correct ? DIFFICULTY_ORDER[Math.min(idx + 1, 2)]
                 : DIFFICULTY_ORDER[Math.max(idx - 1, 0)]
}

function pickQuestion(targetDiff, usedIds, pool) {
  let candidates = pool.filter(q => q.difficulty === targetDiff && !usedIds.has(q.id))
  if (!candidates.length) {
    const idx = DIFFICULTY_ORDER.indexOf(targetDiff)
    for (const alt of [DIFFICULTY_ORDER[idx+1], DIFFICULTY_ORDER[idx-1]].filter(Boolean)) {
      candidates = pool.filter(q => q.difficulty === alt && !usedIds.has(q.id))
      if (candidates.length) break
    }
  }
  if (!candidates.length) candidates = pool.filter(q => q.difficulty === targetDiff)
  return candidates[Math.floor(Math.random() * candidates.length)]
}

const QUIZ = [
  { id: 0, difficulty: 'easy', q: 'What is the core training objective of a Large Language Model?', opts: ['Classify images into categories', 'Predict the next token in a sequence', 'Search a database for relevant documents', 'Solve mathematical equations'], correct: 1, explanation: 'LLMs are trained to predict the next token given all previous tokens. This simple objective, applied across trillions of examples, causes the model to internalize grammar, facts, reasoning patterns, and much more.' },
  { id: 1, difficulty: 'easy', q: 'What does "fine-tuning" do to a pre-trained LLM?', opts: ['Replaces the model with a smaller, faster version', 'Continues training on curated examples to adjust behavior for a specific task', 'Increases the context window size', 'Compresses the model weights for faster inference'], correct: 1, explanation: "Fine-tuning starts from the pre-trained weights and continues training on a smaller, curated dataset. It shapes the model's behavior (e.g., to follow instructions or adopt a specific tone) without requiring full retraining from scratch." },
  { id: 2, difficulty: 'easy', q: 'What is a "token" in the context of LLMs?', opts: ['A single word in the input text', 'A unit of text the model processes — often a word or word fragment', "A number representing the model's confidence", 'A parameter in the neural network'], correct: 1, explanation: 'Tokens are the basic units LLMs work with. They are often whole words but can be subwords, punctuation, or spaces. The word "unhappiness" might be split into "un", "happi", "ness" — three tokens. This allows models to handle rare and compound words.' },
  { id: 3, difficulty: 'easy', q: 'Which of these is a real limitation of current LLMs?', opts: ['They can only speak English', 'They require an internet connection to answer questions', 'They can confidently state false information (hallucination)', 'They can only answer questions, not generate text'], correct: 2, explanation: 'Hallucination is one of the most significant LLM limitations. Because they predict likely text rather than retrieve verified facts, they can generate plausible-sounding but completely wrong information with apparent confidence.' },
  { id: 4, difficulty: 'medium', q: 'A model trained up to January 2024 is asked about an event that happened in July 2024. What is the most likely outcome?', opts: ['The model will refuse to answer', 'The model will accurately describe the event using reasoning', 'The model may hallucinate a plausible-sounding but incorrect answer', 'The model will automatically search the internet for the answer'], correct: 2, explanation: "Knowledge cutoff means the model has no information about events after its training data ends. When asked, it may say it doesn't know — but it can also hallucinate a confident-sounding response, since it has learned patterns for discussing similar events. RAG with live data sources is the standard mitigation." },
  { id: 5, difficulty: 'medium', q: 'What happens to the training loss during a successful training run?', opts: ['It increases steadily, showing the model is learning more', 'It stays constant, indicating the model has converged', "It decreases over time as the model's predictions improve", 'It oscillates unpredictably'], correct: 2, explanation: "Loss measures how wrong the model's predictions are. As training progresses and the model's weights are updated via gradient descent, its next-token predictions improve and the loss decreases. A healthy training curve shows rapid early improvement followed by a flattening as the model approaches convergence." },
  { id: 6, difficulty: 'medium', q: 'You send the same question to an LLM twice and get different answers. What most likely explains this?', opts: ['The model updated its weights between the two calls', 'Temperature > 0 introduces randomness into token sampling', 'The context window was exceeded on the second call', 'The model detected your question was a duplicate'], correct: 1, explanation: 'LLMs sample from a probability distribution over tokens at each step. When temperature > 0, this sampling is non-deterministic — the model picks from multiple plausible tokens with weighted randomness. Set temperature = 0 for fully deterministic (greedy) outputs.' },
  { id: 7, difficulty: 'medium', q: 'What is the "context window" of an LLM?', opts: ['The total number of parameters in the model', 'The maximum amount of text (tokens) the model can process in one call', 'The number of training examples used', 'The physical memory of the GPU used for inference'], correct: 1, explanation: "The context window defines how much text the model can \"see\" at once — both input and output together. Everything outside the window is invisible to the model. Larger context windows allow longer conversations and document processing, but increase compute cost and can suffer from the \"lost in the middle\" problem." },
  { id: 8, difficulty: 'hard', q: 'Why do "emergent abilities" — like multi-step reasoning — appear suddenly at certain model scales rather than improving gradually?', opts: ['Larger models have more memory and can store more facts', 'Some capabilities require multiple learned sub-skills to all be present simultaneously, so they only manifest when the model is large enough to have acquired all of them', 'Emergent abilities are artificially added during fine-tuning at certain sizes', 'Larger models are trained on more data, which directly teaches reasoning'], correct: 1, explanation: 'Emergent abilities appear to be threshold effects. A capability like chain-of-thought reasoning requires the model to have internalized multiple sub-skills (e.g., tracking intermediate state, following logical connectives). None of these sub-skills alone enables the full behavior — all must be present. This is why capability appears to jump suddenly at scale rather than smoothly improving.' },
  { id: 9, difficulty: 'hard', q: 'A system prompt says "always answer in French." The user asks in English. The model responds in French. What mechanism makes this possible?', opts: ['A separate translation module post-processes the output', 'Instruction following is a behavior learned during fine-tuning on instruction-response pairs', 'The model detects the language of the system prompt and switches automatically', 'This is hardcoded behavior, not learned'], correct: 1, explanation: "Raw pre-trained models follow instructions poorly — they're trained to continue text, not obey commands. Instruction following is instilled through fine-tuning (specifically RLHF or supervised fine-tuning on instruction datasets). The model learns to treat text in the system prompt as high-priority behavioral directives." },
  { id: 10, difficulty: 'hard', q: 'Two prompts ask the same factual question but in different formats. Prompt A gets the right answer; Prompt B gets a wrong one. The only difference is phrasing. What does this reveal?', opts: ['Prompt B contained a typo that confused the model', 'LLMs are brittle to phrasing — their outputs reflect statistical patterns in training data, not robust factual retrieval', 'The model updated between the two calls', 'Prompt A was cached and returned from memory'], correct: 1, explanation: 'This sensitivity to phrasing reveals that LLMs are not reliable fact databases — they pattern-match. If a certain phrasing closely resembles training text that contained correct answers, the model performs well. If the phrasing is unusual or activates different patterns, it can fail even on facts it "knows" under other phrasings. This is why prompt engineering matters.' },
  { id: 11, difficulty: 'hard', q: 'What is the fundamental difference between pre-training and RLHF (Reinforcement Learning from Human Feedback)?', opts: ['Pre-training uses more data; RLHF uses less', 'Pre-training optimizes next-token prediction loss; RLHF optimizes a reward model that scores outputs for human preference', 'RLHF replaces pre-training entirely in modern models', 'Pre-training is supervised; RLHF is unsupervised'], correct: 1, explanation: "Pre-training's objective is purely predictive: minimize prediction error on the next token. RLHF introduces a fundamentally different signal: a reward model (trained on human preference rankings) scores the LLM's outputs, and the LLM's weights are updated to produce outputs that score higher. This shifts the model from \"predicts likely text\" to \"produces outputs humans prefer\" — which is what makes models feel helpful, honest, and harmless." }
]

// ─── Token splitter ───────────────────────────────────────────────────────
function splitTokens(text) {
  const parts = text.split(/(\s+|[.,!?;:'"()\[\]{}<>])/)
  return parts.filter(p => p.length > 0 && !/^\s+$/.test(p))
}

export default function IntroLLMs() {
  const [tab, setTab] = useState(0)
  const TABS = ['What is an LLM?', 'How LLMs learn', 'Tokens and context', 'Prompts and responses', 'Limitations', 'Quiz']

  // ── Tab 0: What is an LLM? ───────────────────────────────────────────────
  const [selectedPrompt, setSelectedPrompt] = useState(0)

  // ── Tab 1: How LLMs Learn ────────────────────────────────────────────────
  const [loopStep, setLoopStep] = useState(0)
  const [isLooping, setIsLooping] = useState(false)
  const [epoch, setEpoch] = useState(0)
  const [loss, setLoss] = useState(2.4)
  const loopRef = useRef(null)
  const epochRef = useRef(0)
  const lossRef = useRef(2.4)

  function startLoop() {
    if (isLooping) return
    setIsLooping(true)
    loopRef.current = setInterval(() => {
      setLoopStep(prev => {
        const next = (prev + 1) % 4
        if (next === 0) {
          const newEpoch = Math.min(epochRef.current + 1, 14)
          epochRef.current = newEpoch
          const newLoss = Math.max(lossRef.current - 0.15, 0.3)
          lossRef.current = newLoss
          setEpoch(newEpoch)
          setLoss(newLoss)
        }
        return next
      })
    }, 800)
  }

  function stopLoop() {
    clearInterval(loopRef.current)
    setIsLooping(false)
  }

  function resetLoop() {
    stopLoop()
    setLoopStep(0)
    setEpoch(0)
    setLoss(2.4)
    epochRef.current = 0
    lossRef.current = 2.4
  }

  useEffect(() => () => { if (loopRef.current) clearInterval(loopRef.current) }, [])

  // ── Tab 2: Tokens & Context ──────────────────────────────────────────────
  const [tokenText, setTokenText] = useState('The quick brown fox jumps over the lazy dog.')
  const [contextScenario, setContextScenario] = useState(0)

  const tokens = useMemo(() => splitTokens(tokenText), [tokenText])

  // ── Tab 3: Prompts & Responses ───────────────────────────────────────────
  const [selectedPreset, setSelectedPreset] = useState(0)
  const [responseVisible, setResponseVisible] = useState(true)

  function changePreset(idx) {
    setResponseVisible(false)
    setSelectedPreset(idx)
    setTimeout(() => setResponseVisible(true), 50)
  }

  // ── Tab 4: Limitations ───────────────────────────────────────────────────
  const [expandedLimitation, setExpandedLimitation] = useState(null)

  function toggleLimitation(idx) {
    setExpandedLimitation(prev => prev === idx ? null : idx)
  }

  // ── Tab 5: Quiz ──────────────────────────────────────────────────────────
  const nextDiffRef = useRef('easy')
  const [currentQ, setCurrentQ] = useState(null)
  const [qNum, setQNum] = useState(0)
  const [chosen, setChosen] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const [difficulty, setDifficulty] = useState('easy')
  const [usedIds, setUsedIds] = useState(new Set())

  useEffect(() => {
    const q = pickQuestion('easy', new Set(), QUIZ)
    setCurrentQ(q)
    setUsedIds(new Set([q.id]))
  }, [])

  function handleQuiz(idx) {
    if (chosen !== null) return
    setChosen(idx)
    const correct = idx === currentQ.correct
    if (correct) setScore(s => s + 1)
    const newDiff = bumpDifficulty(currentQ.difficulty, correct)
    nextDiffRef.current = newDiff
    setDifficulty(newDiff)
  }

  function nextQ() {
    if (qNum + 1 >= SESSION_SIZE) { setDone(true); return }
    const next = pickQuestion(nextDiffRef.current, usedIds, QUIZ)
    setUsedIds(prev => new Set([...prev, next.id]))
    setCurrentQ(next)
    setQNum(n => n + 1)
    setChosen(null)
  }

  function retake() {
    nextDiffRef.current = 'easy'
    const q = pickQuestion('easy', new Set(), QUIZ)
    setCurrentQ(q); setUsedIds(new Set([q.id]))
    setQNum(0); setChosen(null); setScore(0); setDone(false); setDifficulty('easy')
  }

  // ─── Loss chart helpers ──────────────────────────────────────────────────
  const chartW = 500
  const chartH = 100
  const chartPad = 10
  const lossMin = 0.3
  const lossMax = 2.4
  const lossRange = lossMax - lossMin

  function lossToY(l) {
    return chartPad + ((lossMax - l) / lossRange) * (chartH - chartPad * 2)
  }

  const lossCurvePoints = LOSS_CURVE.map((l, i) => {
    const x = (i / (LOSS_CURVE.length - 1)) * chartW
    const y = lossToY(l)
    return `${x},${y}`
  }).join(' ')

  const currentEpochX = (epoch / (LOSS_CURVE.length - 1)) * chartW
  const currentEpochY = lossToY(LOSS_CURVE[Math.min(epoch, LOSS_CURVE.length - 1)])

  // Severity colour now resolves through SEVERITY_TINT (Prism feedback palette).
  function severityColor(s) { return SEVERITY_TINT[s] || 'var(--text-secondary)' }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="il-root">
      <style>{css}</style>
      <NavBar />

      <header className="il-hero">
        <div className="il-eyebrow">Foundations</div>
        <h1 className="il-title">Introduction to LLMs</h1>
        <p className="il-subtitle">Understand how large language models work — from next-token prediction to emergent abilities, tokens, prompts, and limitations.</p>
      </header>

      <div className="il-tabs-row">
        <div className="prism-tabs" role="tablist" aria-label="Sections">
          {TABS.map((t, i) => (
            <button
              key={t}
              role="tab"
              className="prism-tab"
              aria-selected={tab === i}
              onClick={() => setTab(i)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="il-panel">

        {/* ── Tab 0: What is an LLM? ──────────────────────────────────────────── */}
        {tab === 0 && (
          <div>
            <div className="il-section-title">What is a large language model?</div>
            <p className="il-section-sub">
              A large language model is a neural network trained on vast amounts of text to predict the most likely next token. Through this simple objective, it learns grammar, facts, reasoning, and much more.
            </p>

            <div className="il-stats-grid">
              {[
                { label: 'Parameters',         value: 'GPT-4: ~1.8 trillion' },
                { label: 'Training data',      value: '~13 trillion tokens' },
                { label: 'Training time',      value: 'Months on thousands of GPUs' },
                { label: 'Emergent abilities', value: 'Appear beyond ~10B params' },
              ].map(s => (
                <div key={s.label} className="il-stat-card">
                  <div className="il-stat-label">{s.label}</div>
                  <div className="il-stat-value">{s.value}</div>
                </div>
              ))}
            </div>

            <div className="il-card-emphasis-title" style={{ fontSize: 'var(--text-size-h3)' }}>Next-token prediction</div>
            <p style={{ font: 'var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-4)' }}>
              Select a sentence starter to see the top predicted next tokens and their probabilities — the core mechanism powering every LLM.
            </p>

            <div className="il-prompt-chips">
              {NEXT_TOKEN_DATA.map((d, i) => (
                <button key={i} className={`il-chip${selectedPrompt === i ? ' active' : ''}`} onClick={() => setSelectedPrompt(i)}>
                  {d.prompt.length > 32 ? d.prompt.slice(0, 32) + '…' : d.prompt}
                </button>
              ))}
            </div>

            <div className="il-card-plain" style={{ marginBottom: 'var(--spacing-5)' }}>
              <div className="il-stat-label">Prompt</div>
              <div style={{ fontFamily: 'IBM Plex Mono, ui-monospace, monospace', font: 'var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) "IBM Plex Mono"', color: 'var(--text-primary)', marginBottom: 'var(--spacing-5)', padding: 'var(--spacing-3) var(--spacing-4)', background: 'var(--surface-1)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)' }}>
                {NEXT_TOKEN_DATA[selectedPrompt].prompt} <span style={{ color: 'var(--orange-500)' }}>▌</span>
              </div>

              <div className="il-stat-label">Top-5 predicted next tokens</div>
              {NEXT_TOKEN_DATA[selectedPrompt].predictions.map((p, i) => (
                <div key={p.token} className="il-pred-row">
                  <div className="il-pred-token" style={i === 0 ? { color: 'var(--orange-500)', display: 'inline-flex', alignItems: 'center', gap: 4 } : undefined}>
                    {i === 0 && <StarIcon size={12} weight="fill" />}
                    <span style={{ fontFamily: 'IBM Plex Mono, ui-monospace, monospace' }}>{p.token}</span>
                  </div>
                  <div className="il-pred-bar-bg">
                    <div className="il-pred-bar" style={{ width: `${p.prob * 100}%`, background: i === 0 ? 'var(--orange-500)' : 'var(--text-tertiary)' }} />
                  </div>
                  <div className="il-pred-pct" style={i === 0 ? { color: 'var(--orange-500)' } : undefined}>
                    {Math.round(p.prob * 100)}%
                  </div>
                </div>
              ))}
            </div>

            <div className="il-card">
              <div className="il-card-emphasis-title">Key insight</div>
              <p className="il-card-body">
                By predicting the next token billions of times across trillions of examples, the model develops an internal world model — understanding context, meaning, relationships, and even simple reasoning.
              </p>
            </div>
          </div>
        )}

        {/* ── Tab 1: How LLMs Learn ───────────────────────────────────────────── */}
        {tab === 1 && (
          <div>
            <div className="il-section-title">How LLMs learn</div>
            <p className="il-section-sub">Training happens in two phases: pre-training on massive unlabelled text, then fine-tuning on curated examples to shape behaviour.</p>

            <div className="il-two-col">
              <div className="il-card-plain" style={{ borderColor: 'var(--blue-500)' }}>
                <div className="il-card-emphasis-title" style={{ color: 'var(--blue-500)' }}>Pre-training</div>
                <p className="il-card-body">
                  Train on massive unlabelled text from the internet, books, and code. Objective: predict the next token. Result: broad general knowledge.
                </p>
              </div>
              <div className="il-card-plain" style={{ borderColor: 'var(--orange-500)' }}>
                <div className="il-card-emphasis-title" style={{ color: 'var(--orange-500)' }}>Fine-tuning</div>
                <p className="il-card-body">
                  Continue training on curated, labelled examples. Objective: follow instructions, be helpful, avoid harm. Result: assistant behaviour.
                </p>
              </div>
            </div>

            <div className="il-card-emphasis-title" style={{ fontSize: 'var(--text-size-h3)' }}>Training loop</div>
            <p style={{ font: 'var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-4)' }}>
              Each cycle the model sees data, makes predictions, measures error, and updates its weights.
            </p>

            <div className="il-loop-nodes">
              {LOOP_NODES.map((node, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                  <div className={`il-loop-node${loopStep === i ? ' active' : ''}`}>
                    <div className="il-loop-icon"><IconFor name={node.iconKey} size={22} weight="duotone" /></div>
                    <div className="il-loop-label">{node.label}</div>
                    <div className="il-loop-desc">{node.desc}</div>
                  </div>
                  {i < LOOP_NODES.length - 1 && (
                    <div className="il-loop-arrow"><ArrowRightIcon size={18} weight="bold" /></div>
                  )}
                  {i === LOOP_NODES.length - 1 && (
                    <div className="il-loop-arrow"><ArrowCounterClockwiseIcon size={16} weight="bold" /></div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-5)', flexWrap: 'wrap' }}>
              <button className="il-btn" onClick={isLooping ? stopLoop : startLoop}>
                {isLooping
                  ? (<><PauseIcon size={14} weight="fill" /> Stop</>)
                  : (<><PlayIcon size={14} weight="fill" /> Start training</>)}
              </button>
              <button className="il-btn-ghost" onClick={resetLoop}>
                <ArrowCounterClockwiseIcon size={14} weight="bold" /> Reset
              </button>
              <div style={{ font: 'var(--text-weight-body) var(--text-size-caption)/1 var(--font-primary)', color: 'var(--text-secondary)', marginLeft: 'var(--spacing-2)' }}>
                Epoch <strong style={{ color: 'var(--text-primary)', fontFamily: 'IBM Plex Mono, ui-monospace, monospace' }}>{epoch}</strong>
                {' · '}Loss <strong style={{ color: 'var(--text-primary)', fontFamily: 'IBM Plex Mono, ui-monospace, monospace' }}>{loss.toFixed(2)}</strong>
              </div>
            </div>

            <div className="il-card-plain" style={{ marginBottom: 'var(--spacing-3)' }}>
              <div className="il-stat-label">Training loss curve</div>
              <svg viewBox={`0 0 ${chartW} ${chartH}`} style={{ width: '100%', height: 120, display: 'block', marginTop: 'var(--spacing-2)' }}>
                <polyline
                  points={lossCurvePoints}
                  fill="none"
                  stroke="var(--border-default)"
                  strokeWidth="2"
                />
                <polyline
                  points={LOSS_CURVE.slice(0, epoch + 1).map((l, i) => `${(i / (LOSS_CURVE.length - 1)) * chartW},${lossToY(l)}`).join(' ')}
                  fill="none"
                  stroke="var(--blue-500)"
                  strokeWidth="2.5"
                />
                <circle
                  cx={currentEpochX}
                  cy={currentEpochY}
                  r="5"
                  fill="var(--blue-500)"
                />
                <text x="4" y={lossToY(2.4) + 4} fill="var(--text-tertiary)" fontSize="10" fontFamily="IBM Plex Mono">2.4</text>
                <text x="4" y={lossToY(0.3) - 4} fill="var(--text-tertiary)" fontSize="10" fontFamily="IBM Plex Mono">0.3</text>
              </svg>
            </div>
            <div style={{ font: 'var(--text-weight-body) var(--text-size-caption)/1.4 var(--font-primary)', color: 'var(--text-tertiary)', textAlign: 'center', marginBottom: 'var(--spacing-6)' }}>
              Loss decreases as the model's predictions improve over training epochs.
            </div>
          </div>
        )}

        {/* ── Tab 2: Tokens & Context ─────────────────────────────────────────── */}
        {tab === 2 && (
          <div>
            <div className="il-section-title">Tokens and context</div>
            <p className="il-section-sub">LLMs don't see words — they see tokens. Understanding tokenisation and context windows is fundamental to working with LLMs effectively.</p>

            <div className="il-card-emphasis-title" style={{ fontSize: 'var(--text-size-h3)' }}>Live tokeniser</div>
            <p style={{ font: 'var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-3)' }}>
              Edit the text below to see how it splits into tokens. Each colour represents a distinct token unit on the structured→exploratory ramp.
            </p>

            <textarea
              className="il-textarea"
              value={tokenText}
              onChange={e => setTokenText(e.target.value)}
              style={{ marginBottom: 'var(--spacing-3)' }}
            />

            <div className="il-token-display" style={{ marginBottom: 'var(--spacing-2)' }}>
              {tokens.map((tok, i) => {
                const c = TOKEN_COLORS[i % 4]
                return (
                  <span key={i} className="il-token" style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.color }}>
                    {tok}
                  </span>
                )
              })}
              {tokens.length === 0 && <span style={{ color: 'var(--text-tertiary)', fontFamily: 'IBM Plex Mono, ui-monospace, monospace', fontSize: 'var(--text-size-caption)' }}>Start typing above…</span>}
            </div>
            <div style={{ fontFamily: 'IBM Plex Mono, ui-monospace, monospace', fontSize: 'var(--text-size-caption)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-7)' }}>
              <strong style={{ color: 'var(--text-primary)' }}>{tokens.length}</strong> tokens
            </div>

            <div className="il-card-emphasis-title" style={{ fontSize: 'var(--text-size-h3)' }}>Context window</div>
            <p style={{ font: 'var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-4)' }}>
              The context window is the total amount of text (input + output) the model can process at once. Select a scenario to see how different sizes compare.
            </p>

            <div style={{ display: 'flex', gap: 'var(--spacing-2)', flexWrap: 'wrap', marginBottom: 'var(--spacing-4)' }}>
              {CONTEXT_SCENARIOS.map((s, i) => (
                <button key={i} className={`il-context-btn${contextScenario === i ? ' active' : ''}`} onClick={() => setContextScenario(i)}>
                  {s.label}
                </button>
              ))}
            </div>

            <div className="il-card-plain" style={{ marginBottom: 'var(--spacing-6)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-1)' }}>
                <div style={{ font: 'var(--text-weight-label) var(--text-size-body)/1.2 var(--font-primary)', color: 'var(--text-primary)' }}>
                  {CONTEXT_SCENARIOS[contextScenario].tokens.toLocaleString()} tokens
                </div>
                <div style={{ fontFamily: 'IBM Plex Mono, ui-monospace, monospace', fontSize: 'var(--text-size-caption)', color: 'var(--blue-500)' }}>
                  {CONTEXT_SCENARIOS[contextScenario].use}
                </div>
              </div>
              <div className="il-context-bar-bg">
                <div
                  className="il-context-bar-fill"
                  style={{ width: `${(CONTEXT_SCENARIOS[contextScenario].tokens / CONTEXT_SCENARIOS[contextScenario].max) * 100}%` }}
                >
                  {CONTEXT_SCENARIOS[contextScenario].tokens >= 4096 && (
                    <span>{CONTEXT_SCENARIOS[contextScenario].tokens.toLocaleString()}</span>
                  )}
                </div>
              </div>
              <div style={{ fontSize: 'var(--text-size-meta)', color: 'var(--text-tertiary)', marginTop: 'var(--spacing-1)', fontFamily: 'IBM Plex Mono, ui-monospace, monospace' }}>
                relative to a 128K max
              </div>
            </div>

            <div className="il-card">
              <div className="il-card-emphasis-title">Why context length matters</div>
              <p className="il-card-body">
                The context window is the model's working memory. Everything before the current token in the window is what the model sees. Older tokens fall off the left edge as the conversation grows. A larger window means longer conversations and bigger documents — but also more compute cost and the risk of the model losing focus on early content.
              </p>
            </div>
          </div>
        )}

        {/* ── Tab 3: Prompts & Responses ──────────────────────────────────────── */}
        {tab === 3 && (
          <div>
            <div className="il-section-title">Prompts and responses</div>
            <p className="il-section-sub">Every LLM interaction is structured around three message roles. How you construct those messages determines everything about what you get back.</p>

            <div className="il-card-emphasis-title" style={{ fontSize: 'var(--text-size-h3)', marginBottom: 'var(--spacing-3)' }}>Anatomy of a prompt</div>

            <div style={{ marginBottom: 'var(--spacing-2)' }}>
              {[
                { role: 'System',    mod: 'system',    text: 'You are a helpful assistant specialising in science.' },
                { role: 'User',      mod: 'user',      text: 'Explain how black holes form.' },
                { role: 'Assistant', mod: 'assistant', text: 'A black hole forms when a massive star collapses under its own gravity…' },
              ].map(r => (
                <div key={r.role} className={`il-role-box il-role-box--${r.mod}`}>
                  <div className="il-role-label">{r.role}</div>
                  <div className="il-role-text">{r.text}</div>
                </div>
              ))}
            </div>
            <div style={{ font: 'var(--text-weight-body) var(--text-size-caption)/var(--text-lh-body) var(--font-primary)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-7)' }}>
              System sets behaviour, User sends the question, Assistant generates the reply.
            </div>

            <div className="il-card-emphasis-title" style={{ fontSize: 'var(--text-size-h3)' }}>System prompt effect</div>
            <p style={{ font: 'var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-4)' }}>
              The same user question gets a very different answer depending on the system prompt. Pick a persona to see how tone and style shift.
            </p>

            <div className="il-preset-btns">
              {SYSTEM_PRESETS.map((p, i) => (
                <button key={i} className={`il-preset-btn${selectedPreset === i ? ' active' : ''}`} onClick={() => changePreset(i)}>
                  {p.label}
                </button>
              ))}
            </div>

            <div className="il-role-box il-role-box--system">
              <div className="il-role-label">System prompt</div>
              <div className="il-role-text">{SYSTEM_PRESETS[selectedPreset].system}</div>
            </div>

            <div className="il-role-box il-role-box--user">
              <div className="il-role-label">User</div>
              <div className="il-role-text">What is machine learning?</div>
            </div>

            <div className="il-role-label" style={{ color: 'var(--color-success)', marginTop: 'var(--spacing-3)', marginBottom: 'var(--spacing-1)' }}>Assistant</div>
            <div className={`il-response-box${responseVisible ? '' : ' hidden'}`}>
              {SYSTEM_PRESETS[selectedPreset].response}
            </div>
          </div>
        )}

        {/* ── Tab 4: Limitations ──────────────────────────────────────────────── */}
        {tab === 4 && (
          <div>
            <div className="il-section-title">LLM limitations</div>
            <p className="il-section-sub">LLMs are remarkable but imperfect. Understanding their limitations helps you build reliable, trustworthy AI systems. Click any card to expand details.</p>

            {LIMITATIONS.map((lim, i) => (
              <button
                key={i}
                type="button"
                className={`il-limit-card${expandedLimitation === i ? ' expanded' : ''}`}
                style={{ '--lim-tint': severityColor(lim.severity) }}
                onClick={() => toggleLimitation(i)}
                aria-expanded={expandedLimitation === i}
              >
                <div className="il-limit-header">
                  <span className="il-limit-icon"><IconFor name={lim.iconKey} size={24} weight="duotone" /></span>
                  <div style={{ flex: 1 }}>
                    <div className="il-limit-title">{lim.title}</div>
                    <div className="il-limit-short">{lim.short}</div>
                  </div>
                  <span className="il-limit-sev-label">
                    {lim.severity}
                    <span className="il-severity" />
                  </span>
                </div>
                {expandedLimitation === i && (
                  <div className="il-limit-detail">{lim.detail}</div>
                )}
              </button>
            ))}

            <div className="il-card" style={{ marginTop: 'var(--spacing-6)' }}>
              <div className="il-card-emphasis-title">The bottom line</div>
              <p className="il-card-body">
                None of these limitations are fatal. Each has well-understood mitigations. The key is knowing when to trust an LLM's output, when to verify it, and when to supplement it with tools like RAG, structured outputs, or human review.
              </p>
            </div>
          </div>
        )}

        {/* ── Tab 5: Quiz ─────────────────────────────────────────────────────── */}
        {tab === 5 && (
          <div className="il-quiz-wrap">
            {done ? (
              <div className="il-quiz-done">
                <div className="il-quiz-done-score">{score}/{SESSION_SIZE}</div>
                <div className="il-quiz-done-label">
                  {score === SESSION_SIZE ? 'You know your LLMs.' :
                   score >= SESSION_SIZE * 0.7 ? 'Solid understanding.' :
                   score >= SESSION_SIZE * 0.5 ? 'Good run. Worth a quick re-read of the tabs you skipped.' :
                   'These take a couple of passes to click. Revisit a tab, then retake.'}
                </div>
                <button className="il-btn" onClick={retake}>Retake quiz</button>
              </div>
            ) : currentQ ? (
              <div>
                <div className="il-quiz-progress">
                  <div className="il-quiz-progress-bar-bg">
                    <div className="il-quiz-progress-bar" style={{ width: `${(qNum / SESSION_SIZE) * 100}%` }} />
                  </div>
                  <div className="il-quiz-progress-label">Question {qNum + 1} of {SESSION_SIZE}</div>
                </div>

                <div className={`il-diff-badge ${difficulty}`}>{difficulty}</div>

                <div className="il-quiz-q">{currentQ.q}</div>

                <div className="il-quiz-opts" role="radiogroup">
                  {currentQ.opts.map((opt, i) => {
                    let cls = 'il-quiz-opt'
                    if (chosen !== null) {
                      if (i === currentQ.correct) cls += ' correct'
                      else if (i === chosen && chosen !== currentQ.correct) cls += ' wrong'
                      else cls += ' neutral'
                    }
                    return (
                      <button
                        key={i}
                        className={cls}
                        disabled={chosen !== null}
                        role="radio"
                        aria-checked={chosen === i}
                        onClick={() => handleQuiz(i)}
                      >
                        {opt}
                      </button>
                    )
                  })}
                </div>

                {chosen !== null && (
                  <div className="il-quiz-explanation">
                    <strong>{chosen === currentQ.correct ? 'Correct.' : 'Not quite.'}</strong> {currentQ.explanation}
                  </div>
                )}

                {chosen !== null && (
                  <button className="il-btn" onClick={nextQ}>
                    {qNum + 1 >= SESSION_SIZE ? 'See results' : 'Next question'}
                  </button>
                )}
              </div>
            ) : null}
          </div>
        )}

      </div>
    </div>
  )
}
