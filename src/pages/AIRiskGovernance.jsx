import { useEffect, useMemo, useState } from 'react'
import NavBar from '../components/NavBar.jsx'
import {
  ShieldCheckIcon, ScalesIcon, BankIcon, GavelIcon, BrainIcon,
  WarningIcon, CheckCircleIcon, XCircleIcon, InfoIcon, EyeIcon,
  ArrowCounterClockwiseIcon, UserCircleIcon, BuildingsIcon, BookOpenIcon,
} from '@phosphor-icons/react'

/* ──────────────────────────────────────────────────────────────
 * AI Risk & Governance — Prism-native page.
 * Audience: business executives. Deterministic, no LLM.
 * All values come from Prism tokens (prism-tokens.css /
 * prism-components.css / prism-extensions.css). No raw hex / px.
 * ────────────────────────────────────────────────────────────── */

const css = `
.arg-root { min-height: 100vh; background: var(--surface-base); color: var(--text-primary); font-family: var(--font-primary); }

/* Hero — obsidian + refracted light B (visual-ai-themes §5.2) */
.arg-hero {
  position: relative;
  background: var(--text-primary);
  color: var(--surface-base);
  padding: var(--spacing-7) var(--spacing-4) var(--spacing-6);
  text-align: center;
  overflow: hidden;
}
:root[data-theme="dark"] .arg-hero { background: var(--surface-base); color: var(--text-primary); }
.arg-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--gradient-refracted-b);
  opacity: var(--refracted-opacity-standard);
  pointer-events: none;
}
.arg-hero > * { position: relative; }
.arg-hero-title {
  font: var(--text-weight-h1) var(--text-size-h1)/var(--text-lh-h1) var(--font-primary);
  letter-spacing: var(--text-ls-h1);
  margin: 0 0 var(--spacing-3);
}
.arg-hero-subtitle {
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  max-width: 640px;
  margin: 0 auto;
  opacity: 0.85;
}

/* Shell */
.arg-shell { max-width: 1100px; margin: 0 auto; padding: var(--spacing-6) var(--spacing-4) var(--spacing-7); }

/* Role selector */
.arg-role-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
  flex-wrap: wrap;
  margin-bottom: var(--spacing-6);
}
.arg-role-label {
  font: var(--text-weight-label) var(--text-size-label)/var(--text-lh-label) var(--font-primary);
  color: var(--text-secondary);
}
.arg-role-chips { display: inline-flex; gap: var(--spacing-2); flex-wrap: wrap; }
.arg-role-chip {
  height: 32px;
  padding: 0 var(--spacing-3);
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-1);
  background: var(--surface-1);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font: var(--text-weight-label) var(--text-size-caption)/1 var(--font-primary);
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--ease-standard),
              border-color var(--duration-fast) var(--ease-standard);
}
.arg-role-chip:hover { background: var(--surface-2); border-color: var(--border-strong); }
.arg-role-chip[aria-pressed="true"] {
  background: var(--text-primary);
  color: var(--surface-base);
  border-color: var(--text-primary);
}
.arg-role-chip:focus-visible { outline: 3px solid var(--color-focus-ring); outline-offset: 2px; }

/* Tabs row */
.arg-tabs-row {
  display: flex;
  justify-content: flex-start;
  margin-bottom: var(--spacing-6);
  overflow-x: auto;
}

/* Panel + framing */
.arg-panel { display: flex; flex-direction: column; gap: var(--spacing-5); }
.arg-framing {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-3);
  padding: var(--spacing-4);
  background: var(--surface-2);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
}
.arg-framing-icon { color: var(--text-primary); flex-shrink: 0; margin-top: 2px; }
.arg-framing-body {
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  color: var(--text-secondary);
}

/* Section heading helpers */
.arg-section-title {
  font: var(--text-weight-h3) var(--text-size-h3)/var(--text-lh-h3) var(--font-primary);
  letter-spacing: var(--text-ls-h3);
  margin: 0 0 var(--spacing-2);
}
.arg-section-sub {
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  color: var(--text-secondary);
  margin: 0 0 var(--spacing-5);
}

/* Grids */
.arg-grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: var(--spacing-4); }
.arg-grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: var(--spacing-4); }

/* Category card (Tab 1) */
.arg-cat-card { display: flex; flex-direction: column; gap: var(--spacing-2); }
.arg-cat-card-head { display: flex; align-items: center; gap: var(--spacing-2); }
.arg-cat-card-title {
  font: var(--text-weight-h3) var(--text-size-h3)/var(--text-lh-h3) var(--font-primary);
  letter-spacing: var(--text-ls-h3);
  margin: 0;
}
.arg-cat-card-body {
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  color: var(--text-secondary);
}

/* Decision tree (Tab 2) */
.arg-q {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
  padding: var(--spacing-4);
  background: var(--surface-1);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-e2);
}
.arg-q-text {
  font: var(--text-weight-label) var(--text-size-label)/var(--text-lh-label) var(--font-primary);
  color: var(--text-primary);
}
.arg-q-helper {
  font: var(--text-weight-caption) var(--text-size-caption)/var(--text-lh-caption) var(--font-primary);
  color: var(--text-tertiary);
}
.arg-q-options { display: inline-flex; gap: var(--spacing-2); flex-wrap: wrap; }
.arg-q-option {
  height: 32px;
  padding: 0 var(--spacing-3);
  display: inline-flex;
  align-items: center;
  background: var(--surface-1);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font: var(--text-weight-label) var(--text-size-caption)/1 var(--font-primary);
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--ease-standard),
              border-color var(--duration-fast) var(--ease-standard),
              color var(--duration-fast) var(--ease-standard);
}
.arg-q-option:hover { background: var(--surface-2); border-color: var(--border-strong); }
.arg-q-option:focus-visible { outline: 3px solid var(--color-focus-ring); outline-offset: 2px; }
.arg-q-option[aria-pressed="true"] { background: var(--text-primary); color: var(--surface-base); border-color: var(--text-primary); }

/* Example loader buttons row */
.arg-examples { display: flex; gap: var(--spacing-2); flex-wrap: wrap; }

/* Tier result card */
.arg-result {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
  padding: var(--spacing-5);
  background: var(--surface-1);
  border: 1px solid var(--border-default);
  border-left-width: var(--spacing-1);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-e2);
}
.arg-result--minimal    { border-left-color: var(--color-success); }
.arg-result--limited    { border-left-color: var(--color-warning); }
.arg-result--high       { border-left-color: var(--color-error); }
.arg-result--prohibited { border-left-color: var(--color-error); }
.arg-result-head { display: flex; align-items: center; gap: var(--spacing-2); }
.arg-result-tier {
  font: var(--text-weight-h2) var(--text-size-h2)/var(--text-lh-h2) var(--font-primary);
  letter-spacing: var(--text-ls-h2);
}
.arg-result--minimal    .arg-result-tier { color: var(--color-success); }
.arg-result--limited    .arg-result-tier { color: var(--color-warning); }
.arg-result--high       .arg-result-tier,
.arg-result--prohibited .arg-result-tier { color: var(--color-error); }
.arg-result-body {
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  color: var(--text-secondary);
}
.arg-result-takeaway {
  display: flex;
  gap: var(--spacing-2);
  padding: var(--spacing-3);
  background: var(--surface-2);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
}
.arg-result-controls { display: flex; flex-direction: column; gap: var(--spacing-2); }
.arg-result-control {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-3);
  border: 1px solid var(--color-warning);
  border-radius: var(--radius-sm);
  background: var(--surface-1);
  color: var(--text-primary);
  font: var(--text-weight-body) var(--text-size-caption)/var(--text-lh-caption) var(--font-primary);
}
.arg-result-control-icon { color: var(--color-warning); flex-shrink: 0; margin-top: 1px; }

/* Risk matrix (Tab 3) */
.arg-matrix-wrap { display: flex; flex-direction: column; gap: var(--spacing-5); }
.arg-matrix-controls {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-3);
}
.arg-matrix-row {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: var(--spacing-3);
  align-items: center;
  padding: var(--spacing-3) var(--spacing-4);
  background: var(--surface-1);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-sm);
}
.arg-matrix-row-label {
  font: var(--text-weight-label) var(--text-size-label)/1 var(--font-primary);
  color: var(--text-primary);
}
.arg-matrix-seg { display: inline-flex; gap: var(--spacing-1); }
.arg-matrix-seg-label {
  font: var(--text-weight-meta) var(--text-size-meta)/1 var(--font-primary);
  color: var(--text-tertiary);
  text-transform: lowercase;
  letter-spacing: 0.02em;
  margin-right: var(--spacing-2);
  align-self: center;
}
.arg-seg-btn {
  height: 28px;
  padding: 0 var(--spacing-3);
  display: inline-flex;
  align-items: center;
  background: var(--surface-1);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font: var(--text-weight-label) var(--text-size-caption)/1 var(--font-primary);
  cursor: pointer;
}
.arg-seg-btn:hover { background: var(--surface-2); }
.arg-seg-btn:focus-visible { outline: 3px solid var(--color-focus-ring); outline-offset: 2px; }
.arg-seg-btn[aria-pressed="true"] { background: var(--text-primary); color: var(--surface-base); border-color: var(--text-primary); }

.arg-matrix-grid {
  display: grid;
  grid-template-columns: var(--spacing-7) repeat(3, minmax(140px, 1fr));
  grid-template-rows: var(--spacing-6) repeat(3, minmax(96px, auto));
  gap: var(--spacing-2);
}
.arg-matrix-axis {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-tertiary);
  font: var(--text-weight-meta) var(--text-size-meta)/1 var(--font-primary);
}
.arg-matrix-axis--y { writing-mode: vertical-rl; transform: rotate(180deg); }
.arg-matrix-cell {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--spacing-1);
  padding: var(--spacing-2);
  background: var(--surface-1);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-sm);
  min-height: calc(var(--spacing-7) * 2);
}
.arg-matrix-cell--success { border-color: var(--color-success); background: var(--surface-1); }
.arg-matrix-cell--warning { border-color: var(--color-warning); background: var(--surface-1); }
.arg-matrix-cell--error   { border-color: var(--color-error);   background: var(--surface-1); }
.arg-matrix-cell-tag {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-1);
  font: var(--text-weight-label) var(--text-size-meta)/1 var(--font-primary);
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--radius-sm);
  background: var(--surface-2);
  border: 1px solid var(--border-default);
  color: var(--text-primary);
}

/* Prioritized list */
.arg-priority { display: flex; flex-direction: column; gap: var(--spacing-2); }
.arg-priority-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-3) var(--spacing-4);
  background: var(--surface-1);
  border: 1px solid var(--border-default);
  border-left-width: var(--spacing-1);
  border-radius: var(--radius-sm);
}
.arg-priority-row--success { border-left-color: var(--color-success); }
.arg-priority-row--warning { border-left-color: var(--color-warning); }
.arg-priority-row--error   { border-left-color: var(--color-error); }
.arg-priority-rank {
  font: var(--text-weight-label) var(--text-size-caption)/1 var(--font-primary);
  color: var(--text-tertiary);
  width: var(--spacing-5);
}
.arg-priority-name {
  flex: 1;
  font: var(--text-weight-label) var(--text-size-label)/1 var(--font-primary);
  color: var(--text-primary);
}
.arg-priority-score {
  font-family: 'IBM Plex Mono', ui-monospace, monospace;
  font-variant-numeric: tabular-nums;
  font-size: var(--text-size-caption);
  color: var(--text-secondary);
}

/* Controls (Tab 4) */
.arg-controls-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-5); align-items: start; }
@media (max-width: 880px) { .arg-controls-wrap { grid-template-columns: 1fr; } }
.arg-controls-list { display: flex; flex-direction: column; gap: var(--spacing-2); }
.arg-control-toggle {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-3);
  padding: var(--spacing-3) var(--spacing-4);
  background: var(--surface-1);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--ease-standard),
              border-color var(--duration-fast) var(--ease-standard);
}
.arg-control-toggle:hover { background: var(--surface-2); }
.arg-control-toggle:focus-within { border-color: var(--border-strong); }
.arg-control-toggle input[type="checkbox"] {
  margin-top: 2px;
  accent-color: var(--orange-500);
  width: 16px;
  height: 16px;
}
.arg-control-text { display: flex; flex-direction: column; gap: var(--spacing-1); }
.arg-control-name {
  font: var(--text-weight-label) var(--text-size-label)/1 var(--font-primary);
  color: var(--text-primary);
}
.arg-control-desc {
  font: var(--text-weight-caption) var(--text-size-caption)/var(--text-lh-caption) var(--font-primary);
  color: var(--text-tertiary);
}

.arg-residual-list { display: flex; flex-direction: column; gap: var(--spacing-3); }
.arg-residual-card {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  padding: var(--spacing-4);
  background: var(--surface-1);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
}
.arg-residual-name {
  font: var(--text-weight-label) var(--text-size-label)/1 var(--font-primary);
  color: var(--text-primary);
}
.arg-residual-bars { display: flex; flex-direction: column; gap: var(--spacing-2); }
.arg-residual-bar-row { display: flex; align-items: center; gap: var(--spacing-2); }
.arg-residual-bar-label {
  width: 80px;
  font: var(--text-weight-caption) var(--text-size-caption)/1 var(--font-primary);
  color: var(--text-tertiary);
}
.arg-residual-bar-track {
  flex: 1;
  height: var(--spacing-2);
  background: var(--surface-3);
  border-radius: var(--radius-sm);
  overflow: hidden;
  position: relative;
}
.arg-residual-bar-fill {
  height: 100%;
  background: var(--color-warning);
  transition: width var(--duration-standard) var(--ease-standard),
              background-color var(--duration-fast) var(--ease-standard);
}
.arg-residual-bar-fill--success { background: var(--color-success); }
.arg-residual-bar-fill--warning { background: var(--color-warning); }
.arg-residual-bar-fill--error   { background: var(--color-error); }
.arg-residual-bar-value {
  width: 56px;
  font-family: 'IBM Plex Mono', ui-monospace, monospace;
  font-variant-numeric: tabular-nums;
  font-size: var(--text-size-caption);
  color: var(--text-secondary);
  text-align: right;
}

/* Frameworks (Tab 5) */
.arg-framework-card { display: flex; flex-direction: column; gap: var(--spacing-3); }
.arg-framework-head { display: flex; align-items: center; gap: var(--spacing-2); }
.arg-framework-name {
  font: var(--text-weight-h3) var(--text-size-h3)/var(--text-lh-h3) var(--font-primary);
  letter-spacing: var(--text-ls-h3);
  margin: 0;
}
.arg-framework-body {
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  color: var(--text-secondary);
}
.arg-framework-pills { display: flex; flex-wrap: wrap; gap: var(--spacing-1); }
.arg-framework-pill {
  font: var(--text-weight-label) var(--text-size-meta)/1 var(--font-primary);
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--radius-sm);
  background: var(--surface-2);
  border: 1px solid var(--border-default);
  color: var(--text-primary);
}
.arg-framework-note {
  display: flex;
  gap: var(--spacing-2);
  padding: var(--spacing-3);
  background: var(--surface-2);
  border: 1px solid var(--color-warning);
  border-radius: var(--radius-sm);
  font: var(--text-weight-caption) var(--text-size-caption)/var(--text-lh-caption) var(--font-primary);
  color: var(--text-primary);
}
.arg-framework-takeaway {
  display: flex;
  gap: var(--spacing-3);
  padding: var(--spacing-4);
  background: var(--text-primary);
  color: var(--surface-base);
  border-radius: var(--radius-md);
  font: var(--text-weight-h3) var(--text-size-h3)/var(--text-lh-h3) var(--font-primary);
  letter-spacing: var(--text-ls-h3);
}
:root[data-theme="dark"] .arg-framework-takeaway {
  background: var(--surface-2);
  color: var(--text-primary);
  border: 1px solid var(--border-strong);
}

/* Quiz (Tab 6) */
.arg-quiz { display: flex; flex-direction: column; gap: var(--spacing-4); }
.arg-quiz-progress {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  font: var(--text-weight-caption) var(--text-size-caption)/1 var(--font-primary);
  color: var(--text-tertiary);
}
.arg-quiz-q {
  font: var(--text-weight-h3) var(--text-size-h3)/var(--text-lh-h3) var(--font-primary);
  letter-spacing: var(--text-ls-h3);
  color: var(--text-primary);
}
.arg-quiz-options { display: flex; flex-direction: column; gap: var(--spacing-2); }
.arg-quiz-opt {
  text-align: left;
  padding: var(--spacing-3) var(--spacing-4);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-sm);
  background: var(--surface-1);
  color: var(--text-primary);
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--ease-standard),
              border-color var(--duration-fast) var(--ease-standard);
}
.arg-quiz-opt:hover:not(:disabled) { background: var(--surface-2); border-color: var(--border-strong); }
.arg-quiz-opt:focus-visible { outline: 3px solid var(--color-focus-ring); outline-offset: 2px; }
.arg-quiz-opt:disabled { cursor: default; }
.arg-quiz-opt.correct {
  border-color: var(--color-success);
  color: var(--color-success);
}
.arg-quiz-opt.wrong {
  border-color: var(--color-error);
  color: var(--color-error);
}
.arg-quiz-explanation {
  display: flex;
  gap: var(--spacing-2);
  padding: var(--spacing-3);
  background: var(--surface-2);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
}
.arg-quiz-score {
  font: var(--text-weight-h1) var(--text-size-h1)/var(--text-lh-h1) var(--font-primary);
  letter-spacing: var(--text-ls-h1);
  color: var(--text-primary);
  text-align: center;
}
.arg-quiz-actions { display: flex; gap: var(--spacing-3); flex-wrap: wrap; }
`

/* ── Static data ───────────────────────────────────────────── */

const ROLES = [
  {
    id: 'executive',
    label: 'Executive',
    icon: UserCircleIcon,
    framing:
      "These are the questions you'll own when this use case ships. You're accountable for the decision and for resourcing the controls.",
    takeawayLabel: 'What you own',
    takeawayPrefix: 'You own the decision to ship and the resourcing of controls.',
  },
  {
    id: 'board',
    label: 'Board Member',
    icon: BuildingsIcon,
    framing:
      "These are the questions to put to management before this use case ships. Your job is oversight, not operation.",
    takeawayLabel: 'What to ask management',
    takeawayPrefix:
      "Ask management how they've classified this, who reviewed it, and what controls are in place before it ships.",
  },
  {
    id: 'risk',
    label: 'Risk & Compliance',
    icon: ScalesIcon,
    framing:
      "These are the obligations to translate into policy. You set the rules others operate within.",
    takeawayLabel: 'The control obligation to enforce',
    takeawayPrefix:
      'Set the policy that defines what controls are required at this tier, and verify they hold.',
  },
]

const RISK_CATEGORIES = [
  {
    id: 'privacy',
    name: 'Privacy & data',
    boardQuestion: 'Where does training and inference data come from, and what consent covers it?',
    defaultL: 2, defaultI: 3,
  },
  {
    id: 'bias',
    name: 'Bias & fairness',
    boardQuestion: 'How do we know the model treats protected classes fairly across the populations we serve?',
    defaultL: 2, defaultI: 3,
  },
  {
    id: 'accuracy',
    name: 'Accuracy & hallucination',
    boardQuestion: 'What does the model get wrong, how often, and who is exposed when it does?',
    defaultL: 3, defaultI: 2,
  },
  {
    id: 'security',
    name: 'Security & adversarial',
    boardQuestion: 'What does prompt injection, jailbreak, or data exfiltration cost us if it works?',
    defaultL: 2, defaultI: 3,
  },
  {
    id: 'ip',
    name: 'IP & copyright',
    boardQuestion: 'Whose IP is in the training set, and whose IP does the output infringe?',
    defaultL: 2, defaultI: 2,
  },
  {
    id: 'regulatory',
    name: 'Regulatory & compliance',
    boardQuestion: 'Which regulators have jurisdiction, and what do they require us to prove?',
    defaultL: 2, defaultI: 3,
  },
  {
    id: 'reputational',
    name: 'Reputational',
    boardQuestion: 'If this misfires in public, what story does the press write?',
    defaultL: 2, defaultI: 2,
  },
  {
    id: 'operational',
    name: 'Operational / over-reliance',
    boardQuestion: 'What stops the team from outsourcing judgment to the model when they shouldn’t?',
    defaultL: 3, defaultI: 2,
  },
]

const QUESTIONS = [
  {
    id: 'prohibited',
    text: 'Is this a prohibited use under the EU AI Act?',
    helper:
      'Government social scoring · real-time biometric ID in public spaces · emotion recognition in workplace or school · manipulation of vulnerable groups.',
  },
  {
    id: 'highDomain',
    text: 'Is this used in a high-risk domain?',
    helper:
      'Hiring or employment · credit or financial access · education access · law enforcement · medical or safety-critical · biometric categorization.',
  },
  {
    id: 'interaction',
    text: 'Does it interact with people directly or produce synthetic content that could deceive?',
    helper:
      'Chatbots, voice agents, generated avatars, deepfakes, or AI-written content presented as human.',
  },
  {
    id: 'decision',
    text: 'Does it make or influence a decision about a person?',
    helper: 'Approvals, scores, recommendations, or routing that affects someone’s outcome.',
  },
  {
    id: 'sensitive',
    text: 'Does it process sensitive personal data?',
    helper: 'Health, biometrics, finances, location, race, religion, sexuality, or children’s data.',
  },
  {
    id: 'noReview',
    text: 'Does the output take effect with no human review?',
    helper: 'Autonomous decisions, real-time actions, or outputs sent to a user without a reviewer.',
  },
]

const EXAMPLES = [
  {
    id: 'resume',
    label: 'Résumé screener',
    answers: { prohibited: 'no', highDomain: 'yes', interaction: 'no', decision: 'yes', sensitive: 'no', noReview: 'yes' },
  },
  {
    id: 'chatbot',
    label: 'Customer support chatbot',
    answers: { prohibited: 'no', highDomain: 'no', interaction: 'yes', decision: 'no', sensitive: 'no', noReview: 'yes' },
  },
  {
    id: 'credit',
    label: 'Credit-scoring model',
    answers: { prohibited: 'no', highDomain: 'yes', interaction: 'no', decision: 'yes', sensitive: 'yes', noReview: 'yes' },
  },
  {
    id: 'summarizer',
    label: 'Internal meeting summarizer',
    answers: { prohibited: 'no', highDomain: 'no', interaction: 'no', decision: 'no', sensitive: 'no', noReview: 'no' },
  },
  {
    id: 'facialrec',
    label: 'Real-time facial recognition in a public lobby',
    answers: { prohibited: 'yes', highDomain: 'yes', interaction: 'no', decision: 'yes', sensitive: 'yes', noReview: 'yes' },
  },
]

const TIER_INFO = {
  prohibited: {
    label: 'Prohibited',
    severity: 'error',
    body:
      "You can't ship this in markets that mirror the EU AI Act. The prohibited list is narrow and absolute — pick a different design or scope it out of the prohibited use.",
  },
  high: {
    label: 'High',
    severity: 'error',
    body:
      'You can ship this, but only with a documented conformity assessment, risk management system, human oversight, data governance, and logging. The board should see the control plan before launch.',
  },
  limited: {
    label: 'Limited',
    severity: 'warning',
    body:
      "Shipping is fine if you meet the transparency obligation: tell people they're interacting with an AI or seeing AI-generated content, and keep records of how the system was tested.",
  },
  minimal: {
    label: 'Minimal',
    severity: 'success',
    body:
      "Standard product diligence is enough — accuracy testing, security review, and the controls you'd apply to any internal tool. No tier-specific obligations.",
  },
}

const MODIFIER_NOTES = {
  decision:
    'Influences a decision about a person — document who can override the output, and how the appeal works.',
  sensitive:
    'Processes sensitive personal data — apply data minimization, purpose limitation, and a documented lawful basis.',
  noReview:
    'No human review before the output takes effect — define an accuracy threshold, an incident response plan, and a kill switch.',
}

const CONTROLS = [
  { id: 'hitl',       name: 'Human-in-the-loop review',         desc: 'A human approves the output before it takes effect.',     reducesL: ['accuracy', 'bias', 'operational'],                  reducesI: ['accuracy'] },
  { id: 'bias',       name: 'Bias & fairness testing',           desc: 'Pre-launch and ongoing tests across protected classes.',  reducesL: ['bias'],                                              reducesI: ['bias', 'reputational'] },
  { id: 'audit',      name: 'Audit logging & traceability',      desc: 'Inputs, outputs, and decisions are logged and queryable.', reducesL: ['security'],                                          reducesI: ['security', 'regulatory', 'reputational'] },
  { id: 'disclosure', name: 'User-facing disclosure',            desc: "Users are told it's AI or AI-generated content.",         reducesL: ['regulatory', 'reputational'],                        reducesI: [] },
  { id: 'minimize',   name: 'Data minimization',                 desc: 'Collect and retain only what the task needs.',            reducesL: ['privacy'],                                           reducesI: ['privacy', 'regulatory'] },
  { id: 'security',   name: 'Security testing',                  desc: 'Red-team prompts, jailbreak attempts, exfiltration probes.', reducesL: ['security'],                                       reducesI: ['security'] },
  { id: 'accuracy',   name: 'Accuracy thresholds',               desc: 'A measured floor below which the system is paused.',      reducesL: ['accuracy'],                                          reducesI: ['accuracy'] },
  { id: 'incident',   name: 'Incident response & kill switch',   desc: 'A documented playbook and a one-click off-ramp.',         reducesL: [],                                                    reducesI: ['security', 'operational', 'reputational'] },
  { id: 'vendor',     name: 'Vendor & model documentation',      desc: 'Model card, data sheet, change history from the vendor.', reducesL: ['ip', 'regulatory'],                                  reducesI: ['regulatory'] },
]

const FRAMEWORKS = [
  {
    id: 'nist',
    icon: ShieldCheckIcon,
    name: 'NIST AI RMF',
    body: 'A voluntary US framework that organizes AI risk work into four functions you can measure against. Useful as the spine of an internal program even if no regulator requires it.',
    pills: ['Govern', 'Map', 'Measure', 'Manage'],
  },
  {
    id: 'iso',
    icon: ScalesIcon,
    name: 'ISO/IEC 42001',
    body: 'The first international management-system standard for AI. Auditable, certifiable, and modeled on ISO 9001 / 27001 — treat it as the AI management system you build, not a one-time checklist.',
    pills: ['Management system', 'Auditable', 'Certifiable'],
  },
  {
    id: 'eu',
    icon: GavelIcon,
    name: 'EU AI Act',
    body: 'Risk-tiered law (Prohibited · High · Limited · Minimal) with extraterritorial reach. The tiers are stable; the obligations and deadlines are still moving.',
    pills: ['Prohibited', 'High', 'Limited', 'Minimal'],
    note: 'High-risk Annex III obligations were set for 2 August 2026. The Digital Omnibus (provisional agreement May 2026) defers stand-alone Annex III systems to 2 December 2027 — effective only on formal adoption, so 2 August 2026 stays active until then.',
  },
]

const QUIZ = [
  {
    q: 'Which use case is High-risk under the EU AI Act tiering?',
    options: [
      'Internal meeting summarizer',
      'Customer support chatbot',
      'Hiring or employment decision system',
      'Email autocomplete',
    ],
    correct: 2,
    explanation:
      "Hiring and employment decisions are an Annex III high-risk domain. The chatbot is Limited (transparency); the other two are Minimal.",
  },
  {
    q: 'A chatbot that interacts directly with users typically carries which obligation?',
    options: [
      'Prohibited — it can’t ship',
      'High-risk conformity assessment',
      'Transparency / disclosure',
      'No obligations at all',
    ],
    correct: 2,
    explanation:
      "Direct interaction triggers the Limited-tier transparency obligation: users have to be told they're talking to an AI.",
  },
  {
    q: 'Inherent risk vs residual risk — which statement is true?',
    options: [
      'Inherent risk is what’s left after controls',
      'Residual risk is what’s left after controls',
      'They mean the same thing',
      'Residual risk only applies to the High tier',
    ],
    correct: 1,
    explanation:
      "Inherent risk is the raw exposure before controls. Residual risk is what's left after the controls you've chosen actually take effect.",
  },
  {
    q: 'Real-time facial recognition in a public lobby is classified as…',
    options: [
      'Limited',
      'Minimal',
      'Prohibited',
      'High',
    ],
    correct: 2,
    explanation:
      "Real-time remote biometric identification in public spaces is on the EU AI Act's prohibited list. A few narrow law-enforcement exceptions exist; a lobby use case doesn't qualify.",
  },
  {
    q: 'For a high-risk use case, who in the org owns the control obligation?',
    options: [
      'The model vendor',
      'Risk & Compliance sets the policy; the business owner implements it',
      'The CEO, alone',
      'Whoever uses the model first',
    ],
    correct: 1,
    explanation:
      "Risk & Compliance defines the policy others operate within. The business owner runs the day-to-day control. Vendors document; they don't carry your accountability.",
  },
]

/* ── Helpers ───────────────────────────────────────────────── */

function classify(answers) {
  if (answers.prohibited === 'yes') return 'prohibited'
  if (answers.highDomain === 'yes') return 'high'
  if (answers.interaction === 'yes') return 'limited'
  // If user hasn't answered enough, we still report the most-permissive valid tier.
  const anyAnswered = Object.values(answers).some(v => v === 'yes' || v === 'no')
  if (!anyAnswered) return null
  return 'minimal'
}

function severityForProduct(product) {
  if (product <= 2) return 'success'
  if (product <= 4) return 'warning'
  if (product <= 6) return 'warning'
  return 'error'
}

function applyControls(category, selectedControlIds) {
  let l = category.defaultL
  let i = category.defaultI
  for (const cid of selectedControlIds) {
    const control = CONTROLS.find(c => c.id === cid)
    if (!control) continue
    if (control.reducesL.includes(category.id)) l = Math.max(1, l - 1)
    if (control.reducesI.includes(category.id)) i = Math.max(1, i - 1)
  }
  return { l, i }
}

const SCALE_LABEL = { 1: 'low', 2: 'med', 3: 'high' }

/* ── Component ─────────────────────────────────────────────── */

const TABS = [
  { id: 'land',      label: 'Where this lands on you' },
  { id: 'classify',  label: 'Classify the use case' },
  { id: 'score',     label: 'Score and place it' },
  { id: 'controls',  label: 'Pick your controls' },
  { id: 'landscape', label: 'The framework landscape' },
  { id: 'quiz',      label: 'Quiz' },
]

export default function AIRiskGovernance() {
  const [roleId, setRoleId] = useState('executive')
  const [activeTab, setActiveTab] = useState(TABS[0].id)

  // Tab 2 — classifier answers
  const [answers, setAnswers] = useState({
    prohibited: null, highDomain: null, interaction: null,
    decision: null, sensitive: null, noReview: null,
  })

  // Tab 3 — category placements (likelihood / impact 1-3, null until placed)
  const [matrix, setMatrix] = useState(() => {
    const out = {}
    for (const c of RISK_CATEGORIES) out[c.id] = { l: null, i: null }
    return out
  })

  // Tab 4 — selected mitigations
  const [selectedControls, setSelectedControls] = useState(() => new Set())

  // Tab 6 — quiz state
  const [quizIdx, setQuizIdx] = useState(0)
  const [quizChoice, setQuizChoice] = useState(null)
  const [quizScore, setQuizScore] = useState(0)
  const [quizDone, setQuizDone] = useState(false)

  const role = ROLES.find(r => r.id === roleId)

  useEffect(() => {
    document.title = 'AI risk & governance — AI Visual Lab'
  }, [])

  /* ── Tab 2 helpers ── */
  const tier = useMemo(() => classify(answers), [answers])
  const tierInfo = tier ? TIER_INFO[tier] : null
  function setAnswer(id, value) { setAnswers(a => ({ ...a, [id]: value })) }
  function loadExample(ex) { setAnswers(ex.answers) }
  function resetAnswers() {
    setAnswers({ prohibited: null, highDomain: null, interaction: null,
                 decision: null, sensitive: null, noReview: null })
  }

  /* ── Tab 3 helpers ── */
  function setCell(catId, key, value) {
    setMatrix(m => ({ ...m, [catId]: { ...m[catId], [key]: value } }))
  }
  const placedCategories = useMemo(
    () => RISK_CATEGORIES.filter(c => matrix[c.id].l && matrix[c.id].i),
    [matrix],
  )
  const prioritized = useMemo(() => {
    return [...placedCategories]
      .map(c => ({ category: c, product: matrix[c.id].l * matrix[c.id].i, l: matrix[c.id].l, i: matrix[c.id].i }))
      .sort((a, b) => b.product - a.product)
  }, [placedCategories, matrix])

  /* ── Tab 4 helpers ── */
  function toggleControl(id) {
    setSelectedControls(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }
  const top3Categories = useMemo(() => {
    if (prioritized.length >= 3) return prioritized.slice(0, 3).map(p => p.category)
    // Defaults: top 3 by inherent product
    return [...RISK_CATEGORIES]
      .sort((a, b) => (b.defaultL * b.defaultI) - (a.defaultL * a.defaultI))
      .slice(0, 3)
  }, [prioritized])

  /* ── Tab 6 helpers ── */
  function pickQuiz(idx) {
    if (quizChoice !== null) return
    setQuizChoice(idx)
    if (idx === QUIZ[quizIdx].correct) setQuizScore(s => s + 1)
  }
  function nextQuiz() {
    if (quizIdx + 1 >= QUIZ.length) { setQuizDone(true); return }
    setQuizIdx(i => i + 1); setQuizChoice(null)
  }
  function resetQuiz() {
    setQuizIdx(0); setQuizChoice(null); setQuizScore(0); setQuizDone(false)
  }

  return (
    <div className="arg-root">
      <style>{css}</style>
      <NavBar />

      <section className="arg-hero">
        <h1 className="arg-hero-title">AI risk &amp; governance</h1>
        <p className="arg-hero-subtitle">
          Classify a use case, score its risk, and decide whether to ship it — the work that happens before the board ever sees a brief.
        </p>
      </section>

      <div className="arg-shell">
        {/* Role selector */}
        <div className="arg-role-row" role="group" aria-label="Your role">
          <span className="arg-role-label">Your role</span>
          <div className="arg-role-chips">
            {ROLES.map(r => {
              const Icon = r.icon
              const pressed = r.id === roleId
              return (
                <button
                  key={r.id}
                  type="button"
                  className="arg-role-chip"
                  aria-pressed={pressed}
                  onClick={() => setRoleId(r.id)}
                >
                  <Icon size={14} weight="duotone" />
                  {r.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Tabs */}
        <div className="arg-tabs-row">
          <div className="prism-tabs" role="tablist" aria-label="AI risk and governance sections">
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

        {/* ── Tab 1 — Where this lands on you ── */}
        {activeTab === 'land' && (
          <div className="arg-panel">
            <div className="arg-framing">
              <span className="arg-framing-icon"><InfoIcon size={20} weight="duotone" /></span>
              <span className="arg-framing-body">{role.framing}</span>
            </div>

            <div>
              <h2 className="arg-section-title">The questions the board will ask you</h2>
              <p className="arg-section-sub">
                Eight categories cover the spectrum of AI risk. Each one becomes a question someone in the room will ask before this ships.
              </p>
              <div className="arg-grid-2">
                {RISK_CATEGORIES.map(c => (
                  <div key={c.id} className="card card--default">
                    <div className="arg-cat-card">
                      <div className="arg-cat-card-head">
                        <ShieldCheckIcon size={20} weight="duotone" />
                        <h3 className="arg-cat-card-title">{c.name}</h3>
                      </div>
                      <p className="arg-cat-card-body">{c.boardQuestion}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Tab 2 — Classify the use case ── */}
        {activeTab === 'classify' && (
          <div className="arg-panel">
            <div>
              <h2 className="arg-section-title">Load an example or answer the questions</h2>
              <p className="arg-section-sub">Five pre-loaded use cases land in different tiers — useful to feel the logic before scoring your own.</p>
              <div className="arg-examples">
                {EXAMPLES.map(ex => (
                  <button
                    key={ex.id}
                    type="button"
                    className="btn btn--sm btn--default"
                    onClick={() => loadExample(ex)}
                  >
                    {ex.label}
                  </button>
                ))}
                <button type="button" className="btn btn--sm btn--default" onClick={resetAnswers}>
                  <ArrowCounterClockwiseIcon size={14} weight="bold" /> Reset
                </button>
              </div>
            </div>

            <div className="arg-grid-2">
              {QUESTIONS.map(q => (
                <div key={q.id} className="arg-q">
                  <div className="arg-q-text">{q.text}</div>
                  <div className="arg-q-helper">{q.helper}</div>
                  <div className="arg-q-options" role="group" aria-label={q.text}>
                    {['yes', 'no'].map(v => (
                      <button
                        key={v}
                        type="button"
                        className="arg-q-option"
                        aria-pressed={answers[q.id] === v}
                        onClick={() => setAnswer(q.id, v)}
                      >
                        {v === 'yes' ? 'Yes' : 'No'}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {tier && (
              <div className={`arg-result arg-result--${tier}`}>
                <div className="arg-result-head">
                  {tier === 'minimal'    && <CheckCircleIcon size={24} weight="duotone" color="currentColor" style={{ color: 'var(--color-success)' }} />}
                  {tier === 'limited'    && <WarningIcon     size={24} weight="duotone" color="currentColor" style={{ color: 'var(--color-warning)' }} />}
                  {tier === 'high'       && <WarningIcon     size={24} weight="duotone" color="currentColor" style={{ color: 'var(--color-error)' }} />}
                  {tier === 'prohibited' && <XCircleIcon     size={24} weight="duotone" color="currentColor" style={{ color: 'var(--color-error)' }} />}
                  <span className="arg-result-tier">{tierInfo.label}</span>
                </div>
                <p className="arg-result-body">{tierInfo.body}</p>
                <div className="arg-result-takeaway">
                  <EyeIcon size={18} weight="duotone" />
                  <span>
                    <strong>{role.takeawayLabel}:</strong> {role.takeawayPrefix}
                  </span>
                </div>
                {(answers.decision === 'yes' || answers.sensitive === 'yes' || answers.noReview === 'yes') && (
                  <div className="arg-result-controls">
                    {answers.decision === 'yes' && (
                      <div className="arg-result-control">
                        <span className="arg-result-control-icon"><WarningIcon size={16} weight="duotone" /></span>
                        <span>{MODIFIER_NOTES.decision}</span>
                      </div>
                    )}
                    {answers.sensitive === 'yes' && (
                      <div className="arg-result-control">
                        <span className="arg-result-control-icon"><WarningIcon size={16} weight="duotone" /></span>
                        <span>{MODIFIER_NOTES.sensitive}</span>
                      </div>
                    )}
                    {answers.noReview === 'yes' && (
                      <div className="arg-result-control">
                        <span className="arg-result-control-icon"><WarningIcon size={16} weight="duotone" /></span>
                        <span>{MODIFIER_NOTES.noReview}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Tab 3 — Score and place it ── */}
        {activeTab === 'score' && (
          <div className="arg-panel arg-matrix-wrap">
            <div>
              <h2 className="arg-section-title">Score each category, then read the matrix</h2>
              <p className="arg-section-sub">
                Give each category a likelihood and an impact. The grid below colors each cell by severity, and the list at the bottom is your fix-first queue.
              </p>
            </div>

            <div className="arg-matrix-controls">
              {RISK_CATEGORIES.map(c => (
                <div key={c.id} className="arg-matrix-row">
                  <div className="arg-matrix-row-label">{c.name}</div>
                  <div className="arg-matrix-seg" role="group" aria-label={`${c.name} likelihood`}>
                    <span className="arg-matrix-seg-label">likelihood</span>
                    {[1, 2, 3].map(n => (
                      <button
                        key={n}
                        type="button"
                        className="arg-seg-btn"
                        aria-pressed={matrix[c.id].l === n}
                        onClick={() => setCell(c.id, 'l', n)}
                      >
                        {SCALE_LABEL[n]}
                      </button>
                    ))}
                  </div>
                  <div className="arg-matrix-seg" role="group" aria-label={`${c.name} impact`}>
                    <span className="arg-matrix-seg-label">impact</span>
                    {[1, 2, 3].map(n => (
                      <button
                        key={n}
                        type="button"
                        className="arg-seg-btn"
                        aria-pressed={matrix[c.id].i === n}
                        onClick={() => setCell(c.id, 'i', n)}
                      >
                        {SCALE_LABEL[n]}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* 3x3 grid */}
            <div>
              <h3 className="arg-section-title">Likelihood × impact</h3>
              <div className="arg-matrix-grid" aria-label="Risk matrix">
                <div /> {/* corner */}
                <div className="arg-matrix-axis">low impact</div>
                <div className="arg-matrix-axis">med impact</div>
                <div className="arg-matrix-axis">high impact</div>
                {[3, 2, 1].map(l => (
                  <Row key={l} likelihood={l} placedCategories={placedCategories} matrix={matrix} />
                ))}
              </div>
            </div>

            {/* Prioritized list */}
            {prioritized.length > 0 && (
              <div>
                <h3 className="arg-section-title">Fix a control here first</h3>
                <div className="arg-priority">
                  {prioritized.map((row, idx) => {
                    const sev = severityForProduct(row.product)
                    return (
                      <div key={row.category.id} className={`arg-priority-row arg-priority-row--${sev}`}>
                        <span className="arg-priority-rank">{idx + 1}</span>
                        <span className="arg-priority-name">{row.category.name}</span>
                        <span className="arg-priority-score">
                          L{row.l} · I{row.i} · score {row.product}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Tab 4 — Pick your controls ── */}
        {activeTab === 'controls' && (
          <div className="arg-panel">
            <div>
              <h2 className="arg-section-title">Pick controls. Watch residual risk move.</h2>
              <p className="arg-section-sub">
                Each control lowers likelihood or impact on specific risks. Governance is a set of choices, not a checklist — these are the choices.
              </p>
            </div>

            <div className="arg-controls-wrap">
              <div className="arg-controls-list">
                {CONTROLS.map(c => {
                  const checked = selectedControls.has(c.id)
                  return (
                    <label key={c.id} className="arg-control-toggle">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleControl(c.id)}
                      />
                      <div className="arg-control-text">
                        <span className="arg-control-name">{c.name}</span>
                        <span className="arg-control-desc">{c.desc}</span>
                      </div>
                    </label>
                  )
                })}
              </div>

              <div className="arg-residual-list">
                <h3 className="arg-section-title">Residual risk · top {top3Categories.length}</h3>
                {top3Categories.map(cat => {
                  const inherent = { l: cat.defaultL, i: cat.defaultI }
                  const residual = applyControls(cat, [...selectedControls])
                  const inhSev = severityForProduct(inherent.l * inherent.i)
                  const resSev = severityForProduct(residual.l * residual.i)
                  return (
                    <div key={cat.id} className="arg-residual-card">
                      <div className="arg-residual-name">{cat.name}</div>
                      <div className="arg-residual-bars">
                        <div className="arg-residual-bar-row">
                          <span className="arg-residual-bar-label">inherent</span>
                          <div className="arg-residual-bar-track">
                            <div
                              className={`arg-residual-bar-fill arg-residual-bar-fill--${inhSev}`}
                              style={{ width: `${(inherent.l * inherent.i) / 9 * 100}%` }}
                              aria-hidden="true"
                            />
                          </div>
                          <span className="arg-residual-bar-value">L{inherent.l} · I{inherent.i}</span>
                        </div>
                        <div className="arg-residual-bar-row">
                          <span className="arg-residual-bar-label">residual</span>
                          <div className="arg-residual-bar-track">
                            <div
                              className={`arg-residual-bar-fill arg-residual-bar-fill--${resSev}`}
                              style={{ width: `${(residual.l * residual.i) / 9 * 100}%` }}
                              aria-hidden="true"
                            />
                          </div>
                          <span className="arg-residual-bar-value">L{residual.l} · I{residual.i}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── Tab 5 — The framework landscape ── */}
        {activeTab === 'landscape' && (
          <div className="arg-panel">
            <div>
              <h2 className="arg-section-title">Three frameworks worth knowing</h2>
              <p className="arg-section-sub">
                Each one shapes a different conversation — NIST shapes how you build the program, ISO shapes how you certify it, EU shapes whether you can ship.
              </p>
            </div>

            <div className="arg-grid-3">
              {FRAMEWORKS.map(f => {
                const Icon = f.icon
                return (
                  <div key={f.id} className="card card--default">
                    <div className="arg-framework-card">
                      <div className="arg-framework-head">
                        <Icon size={20} weight="duotone" />
                        <h3 className="arg-framework-name">{f.name}</h3>
                      </div>
                      <p className="arg-framework-body">{f.body}</p>
                      <div className="arg-framework-pills">
                        {f.pills.map(p => <span key={p} className="arg-framework-pill">{p}</span>)}
                      </div>
                      {f.note && (
                        <div className="arg-framework-note">
                          <WarningIcon size={16} weight="duotone" style={{ color: 'var(--color-warning)', flexShrink: 0, marginTop: '2px' }} />
                          <span>{f.note}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="arg-framework-takeaway">
              <BookOpenIcon size={24} weight="duotone" />
              The framework is stable; the dates are not — govern to the framework, not the deadline.
            </div>
          </div>
        )}

        {/* ── Tab 6 — Quiz ── */}
        {activeTab === 'quiz' && (
          <div className="arg-panel">
            <div className="arg-quiz">
              {!quizDone && (
                <>
                  <div className="arg-quiz-progress">
                    Question {quizIdx + 1} of {QUIZ.length} · score {quizScore}
                  </div>
                  <h2 className="arg-quiz-q">{QUIZ[quizIdx].q}</h2>
                  <div className="arg-quiz-options">
                    {QUIZ[quizIdx].options.map((opt, idx) => {
                      let cls = 'arg-quiz-opt'
                      if (quizChoice !== null) {
                        if (idx === QUIZ[quizIdx].correct) cls += ' correct'
                        else if (idx === quizChoice) cls += ' wrong'
                      }
                      return (
                        <button
                          key={idx}
                          type="button"
                          className={cls}
                          disabled={quizChoice !== null}
                          onClick={() => pickQuiz(idx)}
                        >
                          {opt}
                        </button>
                      )
                    })}
                  </div>
                  {quizChoice !== null && (
                    <>
                      <div className="arg-quiz-explanation">
                        {quizChoice === QUIZ[quizIdx].correct
                          ? <CheckCircleIcon size={20} weight="duotone" style={{ color: 'var(--color-success)', flexShrink: 0, marginTop: '2px' }} />
                          : <XCircleIcon     size={20} weight="duotone" style={{ color: 'var(--color-error)',   flexShrink: 0, marginTop: '2px' }} />}
                        <span>{QUIZ[quizIdx].explanation}</span>
                      </div>
                      <div className="arg-quiz-actions">
                        <button type="button" className="btn btn--md btn--orange" onClick={nextQuiz}>
                          {quizIdx + 1 >= QUIZ.length ? 'See results' : 'Next question'}
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}
              {quizDone && (
                <>
                  <div className="arg-quiz-score">{quizScore} / {QUIZ.length}</div>
                  <p className="arg-section-sub" style={{ textAlign: 'center' }}>
                    {quizScore === QUIZ.length
                      ? "Solid grasp of the tiering and control logic."
                      : "Review the framework cards and the classifier; the explanations above point to the rule each question tests."}
                  </p>
                  <div className="arg-quiz-actions" style={{ justifyContent: 'center' }}>
                    <button type="button" className="btn btn--md btn--default" onClick={resetQuiz}>
                      <ArrowCounterClockwiseIcon size={16} weight="bold" /> Retake quiz
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

/* ── Matrix row helper ─────────────────────────────────────── */
function Row({ likelihood, placedCategories, matrix }) {
  return (
    <>
      <div className="arg-matrix-axis arg-matrix-axis--y">{SCALE_LABEL[likelihood]} likelihood</div>
      {[1, 2, 3].map(impact => {
        const product = likelihood * impact
        const sev = severityForProduct(product)
        const inCell = placedCategories.filter(c => matrix[c.id].l === likelihood && matrix[c.id].i === impact)
        return (
          <div key={impact} className={`arg-matrix-cell arg-matrix-cell--${sev}`}>
            {inCell.map(c => (
              <span key={c.id} className="arg-matrix-cell-tag">{c.name}</span>
            ))}
          </div>
        )
      })}
    </>
  )
}
