import { useState, useEffect, useRef, useMemo } from 'react'
import NavBar from '../components/NavBar.jsx'
import {
  ChatCircleIcon, HashIcon, MagnifyingGlassIcon, FileTextIcon,
  PuzzlePieceIcon, SparkleIcon, RobotIcon, DatabaseIcon,
  BuildingsIcon, BooksIcon, WrenchIcon,
  EnvelopeSimpleIcon, NoteIcon, GlobeIcon, ChartBarIcon, BookOpenIcon, HeadphonesIcon,
  CalendarBlankIcon, TargetIcon, LockKeyIcon, LightningIcon,
  CheckIcon, ArrowRightIcon, ArrowCounterClockwiseIcon,
} from '@phosphor-icons/react'

const ICON_BY_KEY = {
  chat: ChatCircleIcon, hash: HashIcon, search: MagnifyingGlassIcon, file: FileTextIcon,
  puzzle: PuzzlePieceIcon, sparkle: SparkleIcon, robot: RobotIcon, database: DatabaseIcon,
  buildings: BuildingsIcon, books: BooksIcon, wrench: WrenchIcon,
  envelope: EnvelopeSimpleIcon, note: NoteIcon, globe: GlobeIcon, chartbar: ChartBarIcon,
  bookopen: BookOpenIcon, headphones: HeadphonesIcon,
  calendar: CalendarBlankIcon, target: TargetIcon, lock: LockKeyIcon, lightning: LightningIcon,
}
const IconFor = ({ name, ...rest }) => {
  const C = ICON_BY_KEY[name]
  return C ? <C {...rest} /> : null
}

const css = `
/* ── RAG migrated to Prism tokens.
 *  Per §5.3 — user input + retrieved context = orange; embed / search /
 *  LLM steps = blue; grounded answer = success; comparison ratings
 *  flow through the feedback palette. ───────────────────────── */

.rg-root { min-height: 100vh; background: var(--surface-base); color: var(--text-primary); overflow-x: hidden; }

/* Hero — obsidian + refracted light (§5.2) */
.rg-hero {
  position: relative;
  text-align: center;
  padding: var(--spacing-7) var(--spacing-4) var(--spacing-6);
  background: var(--text-primary);
  color: var(--surface-base);
  overflow: hidden;
}
:root[data-theme="dark"] .rg-hero {
  background: var(--surface-base);
  color: var(--text-primary);
}
.rg-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--gradient-refracted-b);
  opacity: var(--refracted-opacity-standard);
  pointer-events: none;
}
.rg-hero > * { position: relative; }
.rg-eyebrow {
  font: var(--text-weight-label) var(--text-size-caption)/var(--text-lh-caption) var(--font-primary);
  letter-spacing: 0.08em;
  color: var(--blue-300);
  margin-bottom: var(--spacing-3);
}
.rg-title {
  font: var(--text-weight-h1) var(--text-size-h1)/var(--text-lh-h1) var(--font-primary);
  letter-spacing: var(--text-ls-h1);
  margin-bottom: var(--spacing-3);
}
.rg-subtitle {
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  max-width: 540px;
  margin: 0 auto;
  opacity: 0.85;
}

.rg-tabs-row {
  display: flex;
  justify-content: center;
  padding: var(--spacing-5) var(--spacing-4) var(--spacing-6);
  background: var(--surface-base);
}

.rg-panel { max-width: 920px; margin: 0 auto; padding: 0 var(--spacing-4) var(--spacing-7); }

.rg-section-title {
  font: var(--text-weight-h2) var(--text-size-h2)/var(--text-lh-h2) var(--font-primary);
  letter-spacing: var(--text-ls-h2);
  color: var(--text-primary);
  margin-bottom: var(--spacing-2);
}
.rg-section-sub {
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-6);
  max-width: 720px;
}

.rg-card {
  background: var(--surface-1);
  border: 1px solid var(--border-default);
  box-shadow: var(--shadow-e2);
  border-radius: var(--radius-md);
  padding: var(--spacing-5);
  margin-bottom: var(--spacing-4);
}
.rg-card-plain {
  background: var(--surface-2);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--spacing-5);
  margin-bottom: var(--spacing-4);
}

/* Pipeline steps */
.rg-pipeline-step {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-3);
  padding: var(--spacing-4);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-default);
  background: var(--surface-1);
  margin-bottom: var(--spacing-2);
  transition: background-color var(--duration-deliberate) var(--ease-standard), border-color var(--duration-deliberate) var(--ease-standard);
}
.rg-pipeline-step.active { background: var(--step-soft, var(--blue-50)); border-color: var(--step-tint, var(--blue-500)); }
.rg-pipeline-step.done   { opacity: 0.7; }
.rg-step-icon {
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--step-tint, var(--text-secondary));
}
.rg-step-label {
  font: var(--text-weight-label) var(--text-size-body)/1.2 var(--font-primary);
  color: var(--text-primary);
  margin-bottom: var(--spacing-1);
}
.rg-pipeline-step.active .rg-step-label { color: var(--step-tint); }
.rg-step-content {
  font: var(--text-weight-body) var(--text-size-caption)/var(--text-lh-body) var(--font-primary);
  color: var(--text-secondary);
}
.rg-step-num {
  font: var(--text-weight-label) var(--text-size-meta)/1 var(--font-primary);
  letter-spacing: 0.06em;
  color: var(--text-tertiary);
  margin-bottom: var(--spacing-1);
}

.rg-streaming {
  font-family: 'IBM Plex Mono', ui-monospace, monospace;
  font-size: var(--text-size-caption);
  color: var(--color-success);
  line-height: 1.7;
  white-space: pre-wrap;
}
.rg-cursor {
  display: inline-block;
  width: 2px;
  height: 14px;
  background: var(--color-success);
  margin-left: 1px;
  vertical-align: middle;
  animation: rg-blink 0.8s steps(1) infinite;
}
@keyframes rg-blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }

/* Buttons */
.rg-btn {
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
.rg-btn:hover { background: #D45C10; border-color: #D45C10; }
.rg-btn:focus-visible { outline: 3px solid var(--color-focus-ring); outline-offset: 2px; }
.rg-btn:disabled { opacity: 0.45; cursor: not-allowed; pointer-events: none; }
.rg-btn-ghost {
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
  margin-left: var(--spacing-2);
  transition: background-color var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard);
}
.rg-btn-ghost:hover { background: var(--surface-2); border-color: var(--border-strong); }
.rg-btn-ghost:focus-visible { outline: 3px solid var(--color-focus-ring); outline-offset: 2px; }

/* Benefits */
.rg-benefits-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: var(--spacing-3); margin-top: var(--spacing-5); }
.rg-benefit-card {
  background: var(--surface-1);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--spacing-4);
  text-align: center;
}
.rg-benefit-icon {
  display: inline-flex;
  margin-bottom: var(--spacing-2);
  color: var(--blue-500);
}
.rg-benefit-title {
  font: var(--text-weight-label) var(--text-size-body)/1.2 var(--font-primary);
  color: var(--text-primary);
  margin-bottom: var(--spacing-1);
}
.rg-benefit-desc {
  font: var(--text-weight-body) var(--text-size-caption)/var(--text-lh-body) var(--font-primary);
  color: var(--text-secondary);
}

/* Chunking */
.rg-controls { display: flex; align-items: center; gap: var(--spacing-4); flex-wrap: wrap; margin-bottom: var(--spacing-6); }
.rg-slider-wrap { display: flex; align-items: center; gap: var(--spacing-3); }
.rg-slider-label {
  font: var(--text-weight-body) var(--text-size-caption)/1 var(--font-primary);
  color: var(--text-secondary);
  white-space: nowrap;
}
.rg-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 180px;
  height: 24px;
  background: transparent;
  outline: none;
  cursor: pointer;
}
.rg-slider::-webkit-slider-runnable-track { height: 4px; background: var(--border-default); border-radius: 2px; }
.rg-slider::-moz-range-track { height: 4px; background: var(--border-default); border-radius: 2px; }
.rg-slider::-moz-range-progress { height: 4px; background: var(--blue-500); border-radius: 2px; }
.rg-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px; height: 16px;
  border-radius: 50%;
  background: var(--surface-1);
  border: 2px solid var(--blue-500);
  box-shadow: var(--shadow-e1);
  margin-top: -6px;
  cursor: pointer;
}
.rg-slider::-moz-range-thumb {
  width: 16px; height: 16px;
  border-radius: 50%;
  background: var(--surface-1);
  border: 2px solid var(--blue-500);
  box-shadow: var(--shadow-e1);
  cursor: pointer;
}
.rg-slider:focus-visible { outline: 3px solid var(--color-focus-ring); outline-offset: 2px; border-radius: var(--radius-sm); }
.rg-slider:disabled { opacity: 0.55; cursor: not-allowed; }
.rg-slider-val {
  font: var(--text-weight-body) var(--text-size-caption)/1 var(--font-primary);
  font-family: 'IBM Plex Mono', ui-monospace, monospace;
  color: var(--text-primary);
  min-width: 110px;
}

.rg-strategy-btns { display: flex; gap: var(--spacing-2); flex-wrap: wrap; }
.rg-strategy-btn,
.rg-template-btn,
.rg-eq-chip {
  background: transparent;
  border: 1px solid var(--border-default);
  color: var(--text-secondary);
  font: var(--text-weight-label) var(--text-size-caption)/1 var(--font-primary);
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard), color var(--duration-fast) var(--ease-standard);
}
.rg-strategy-btn:hover:not(.active),
.rg-template-btn:hover:not(.active),
.rg-eq-chip:hover {
  background: var(--surface-2);
  border-color: var(--border-strong);
  color: var(--text-primary);
}
.rg-strategy-btn.active,
.rg-template-btn.active {
  background: var(--text-primary);
  border-color: var(--text-primary);
  color: var(--surface-base);
}
.rg-strategy-btn:focus-visible,
.rg-template-btn:focus-visible,
.rg-eq-chip:focus-visible {
  outline: 3px solid var(--color-focus-ring);
  outline-offset: 2px;
}
.rg-eq-chip { border-radius: 100px; }

.rg-chunk-count {
  font-family: 'IBM Plex Mono', ui-monospace, monospace;
  font-size: var(--text-size-caption);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-3);
}

.rg-doc-display {
  background: var(--surface-2);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--spacing-5);
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  color: var(--text-primary);
}
.rg-chunk-seg { display: inline; border-radius: var(--radius-sm); padding: 1px 0; }

.rg-overlap-info {
  background: var(--surface-2);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--spacing-4);
  margin-top: var(--spacing-5);
}
.rg-overlap-title {
  font: var(--text-weight-label) var(--text-size-body)/1.2 var(--font-primary);
  color: var(--text-primary);
  margin-bottom: var(--spacing-1);
}
.rg-overlap-text {
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  color: var(--text-secondary);
}

/* Retrieval */
.rg-query-chips { display: flex; gap: var(--spacing-2); flex-wrap: wrap; margin-bottom: var(--spacing-5); }
.rg-chip {
  background: transparent;
  border: 1px solid var(--border-default);
  color: var(--text-secondary);
  font: var(--text-weight-label) var(--text-size-caption)/1 var(--font-primary);
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: 100px;
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard), color var(--duration-fast) var(--ease-standard);
}
.rg-chip:hover { background: var(--surface-2); border-color: var(--border-strong); color: var(--text-primary); }
.rg-chip.active { background: var(--text-primary); border-color: var(--text-primary); color: var(--surface-base); }
.rg-chip:focus-visible { outline: 3px solid var(--color-focus-ring); outline-offset: 2px; }

.rg-chunk-card {
  background: var(--surface-1);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--spacing-3) var(--spacing-4);
  margin-bottom: var(--spacing-2);
  transition: background-color var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard);
}
.rg-chunk-card.top-result { background: var(--orange-50); border-color: var(--orange-500); }
.rg-chunk-title {
  font: var(--text-weight-label) var(--text-size-body)/1.2 var(--font-primary);
  color: var(--text-primary);
  margin-bottom: var(--spacing-1);
}
.rg-chunk-text {
  font: var(--text-weight-body) var(--text-size-caption)/var(--text-lh-body) var(--font-primary);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-2);
}
.rg-score-row { display: flex; align-items: center; gap: var(--spacing-2); }
.rg-score-bar-bg { flex: 1; height: 6px; background: var(--surface-3); border-radius: 3px; overflow: hidden; }
.rg-score-bar { height: 100%; border-radius: 3px; background: var(--text-tertiary); transition: width var(--duration-deliberate) var(--ease-standard); }
.rg-chunk-card.top-result .rg-score-bar { background: var(--orange-500); }
.rg-score-val {
  font-family: 'IBM Plex Mono', ui-monospace, monospace;
  font-size: var(--text-size-caption);
  color: var(--text-secondary);
  min-width: 36px;
  text-align: right;
}
.rg-chunk-card.top-result .rg-score-val { color: var(--orange-500); }
.rg-top-badge {
  font: var(--text-weight-label) var(--text-size-meta)/1 var(--font-primary);
  color: var(--orange-500);
  background: var(--surface-1);
  border: 1px solid var(--orange-500);
  border-radius: var(--radius-sm);
  padding: 2px 8px;
}

.rg-quality-section { margin-top: var(--spacing-7); }
.rg-quality-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-3); margin-top: var(--spacing-3); }
@media (max-width: 600px) { .rg-quality-grid { grid-template-columns: 1fr; } }
.rg-quality-col {
  border-radius: var(--radius-md);
  padding: var(--spacing-4);
  background: var(--surface-1);
  border: 1px solid;
}
.rg-quality-col.vague    { border-color: var(--color-error); }
.rg-quality-col.specific { border-color: var(--color-success); }
.rg-quality-label {
  font: var(--text-weight-label) var(--text-size-caption)/1 var(--font-primary);
  letter-spacing: 0.06em;
  margin-bottom: var(--spacing-2);
}
.rg-quality-label.vague    { color: var(--color-error); }
.rg-quality-label.specific { color: var(--color-success); }
.rg-quality-query {
  font: italic var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  color: var(--text-primary);
  margin-bottom: var(--spacing-3);
}
.rg-quality-scores { display: flex; flex-direction: column; gap: var(--spacing-1); }
.rg-quality-score-row { display: flex; align-items: center; gap: var(--spacing-2); }
.rg-quality-score-row .bar-bg { flex: 1; height: 5px; background: var(--surface-3); border-radius: 2px; overflow: hidden; }
.rg-quality-score-row .bar { height: 100%; border-radius: 2px; }
.rg-quality-score-row .lbl {
  color: var(--text-secondary);
  min-width: 100px;
  font-family: 'IBM Plex Mono', ui-monospace, monospace;
  font-size: var(--text-size-meta);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.rg-quality-score-row .val {
  color: var(--text-secondary);
  min-width: 30px;
  text-align: right;
  font-family: 'IBM Plex Mono', ui-monospace, monospace;
  font-size: var(--text-size-meta);
}

/* Prompt assembly */
.rg-assembly-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: var(--spacing-4); margin-bottom: var(--spacing-6); }
@media (max-width: 700px) { .rg-assembly-grid { grid-template-columns: 1fr; } }
.rg-assembly-col-label {
  font: var(--text-weight-label) var(--text-size-caption)/1 var(--font-primary);
  letter-spacing: 0.06em;
  color: var(--text-tertiary);
  margin-bottom: var(--spacing-3);
}
.rg-query-box {
  background: var(--orange-50);
  border: 1px solid var(--orange-500);
  border-radius: var(--radius-md);
  padding: var(--spacing-3) var(--spacing-4);
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  color: var(--text-primary);
}
.rg-chunk-toggle {
  border-radius: var(--radius-md);
  border: 1px solid var(--border-default);
  background: var(--surface-1);
  padding: var(--spacing-3);
  margin-bottom: var(--spacing-2);
  cursor: pointer;
  text-align: left;
  width: 100%;
  transition: background-color var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard);
}
.rg-chunk-toggle:focus-visible { outline: 3px solid var(--color-focus-ring); outline-offset: 2px; }
.rg-chunk-toggle.included { background: var(--blue-50); border-color: var(--blue-500); }
.rg-chunk-toggle.excluded { opacity: 0.55; }
.rg-chunk-toggle-title {
  font: var(--text-weight-label) var(--text-size-caption)/1.2 var(--font-primary);
  color: var(--text-primary);
  margin-bottom: var(--spacing-1);
}
.rg-chunk-toggle-text {
  font: var(--text-weight-body) var(--text-size-caption)/var(--text-lh-body) var(--font-primary);
  color: var(--text-secondary);
}
.rg-chunk-toggle-status {
  font: var(--text-weight-label) var(--text-size-meta)/1 var(--font-primary);
  font-family: 'IBM Plex Mono', ui-monospace, monospace;
  margin-top: var(--spacing-1);
}
.rg-chunk-toggle-status.on  { color: var(--blue-500); }
.rg-chunk-toggle-status.off { color: var(--text-tertiary); }

.rg-prompt-preview {
  background: var(--surface-2);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--spacing-4);
  font-family: 'IBM Plex Mono', ui-monospace, monospace;
  font-size: var(--text-size-meta);
  line-height: 1.7;
  color: var(--text-primary);
  white-space: pre-wrap;
  min-height: 220px;
}
.rg-prompt-system  { color: var(--text-tertiary); }
.rg-prompt-context { color: var(--blue-500); }
.rg-prompt-query   { color: var(--orange-500); }

.rg-token-count {
  font: var(--text-weight-body) var(--text-size-caption)/1 var(--font-primary);
  color: var(--text-secondary);
  margin-top: var(--spacing-2);
}
.rg-token-count strong { color: var(--text-primary); font-weight: 600; }

.rg-template-btns { display: flex; gap: var(--spacing-2); flex-wrap: wrap; margin-bottom: var(--spacing-5); }

.rg-answer-box {
  background: var(--surface-1);
  border: 1px solid var(--color-success);
  border-radius: var(--radius-md);
  padding: var(--spacing-4);
  margin-top: var(--spacing-4);
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  color: var(--text-primary);
}
.rg-answer-label {
  font: var(--text-weight-label) var(--text-size-caption)/1 var(--font-primary);
  letter-spacing: 0.06em;
  color: var(--color-success);
  margin-bottom: var(--spacing-2);
}

/* Comparison table */
.rg-compare-table { width: 100%; border-collapse: collapse; margin-bottom: var(--spacing-7); }
.rg-compare-table th {
  text-align: left;
  font: var(--text-weight-label) var(--text-size-caption)/1 var(--font-primary);
  letter-spacing: 0.06em;
  color: var(--text-secondary);
  padding: var(--spacing-3) var(--spacing-4);
  border-bottom: 1px solid var(--border-default);
}
.rg-compare-table th.rag-col { color: var(--blue-500); }
.rg-compare-table th.ft-col  { color: var(--orange-500); }
.rg-compare-row td {
  padding: var(--spacing-3) var(--spacing-4);
  border-bottom: 1px solid var(--border-default);
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  color: var(--text-primary);
  vertical-align: top;
}
.rg-compare-row.expanded td { background: var(--surface-2); }
.rg-row-label {
  font: var(--text-weight-label) var(--text-size-body)/1.2 var(--font-primary);
  color: var(--text-primary);
  cursor: pointer;
  white-space: nowrap;
}
.rg-row-expand { display: flex; align-items: center; gap: var(--spacing-2); }
.rg-row-expand-arrow {
  color: var(--text-tertiary);
  display: inline-flex;
  transition: transform var(--duration-fast) var(--ease-standard);
}
.rg-row-expand-arrow.open { transform: rotate(90deg); }
.rg-rating-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: var(--spacing-2); }
.rg-rating-dot.good { background: var(--color-success); }
.rg-rating-dot.warn { background: var(--color-warning); }
.rg-rating-dot.bad  { background: var(--color-error); }
.rg-cell-short { color: var(--text-secondary); font-size: var(--text-size-caption); }
.rg-cell-detail {
  font: var(--text-weight-body) var(--text-size-caption)/var(--text-lh-body) var(--font-primary);
  color: var(--text-secondary);
  margin-top: var(--spacing-2);
  padding-top: var(--spacing-2);
  border-top: 1px solid var(--border-default);
}

.rg-scenario-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: var(--spacing-3); margin-top: var(--spacing-3); }
.rg-scenario-card {
  background: var(--surface-1);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--spacing-4);
  cursor: pointer;
  text-align: left;
  transition: background-color var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard);
}
.rg-scenario-card:hover { background: var(--surface-2); border-color: var(--border-strong); }
.rg-scenario-card:focus-visible { outline: 3px solid var(--color-focus-ring); outline-offset: 2px; }
.rg-scenario-card.selected { border-color: var(--text-primary); }
.rg-scenario-title {
  font: var(--text-weight-label) var(--text-size-body)/1.2 var(--font-primary);
  color: var(--text-primary);
  margin-bottom: var(--spacing-2);
}
.rg-scenario-rec {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font: var(--text-weight-label) var(--text-size-meta)/1 var(--font-primary);
  padding: 3px 10px;
  border-radius: 100px;
  margin-bottom: var(--spacing-2);
  border: 1px solid;
}
.rg-scenario-rec.rag      { background: var(--blue-50);   border-color: var(--blue-500);   color: var(--blue-500); }
.rg-scenario-rec.finetune { background: var(--orange-50); border-color: var(--orange-500); color: var(--orange-500); }
.rg-scenario-rec.hybrid   { background: var(--surface-1); border-color: var(--text-primary); color: var(--text-primary); }
.rg-scenario-rationale {
  font: var(--text-weight-body) var(--text-size-caption)/var(--text-lh-body) var(--font-primary);
  color: var(--text-secondary);
}

.rg-hybrid-box {
  background: var(--surface-2);
  border: 1px solid var(--text-primary);
  border-radius: var(--radius-md);
  padding: var(--spacing-5);
  margin-top: var(--spacing-7);
}
.rg-hybrid-title {
  font: var(--text-weight-label) var(--text-size-body)/1.2 var(--font-primary);
  color: var(--text-primary);
  margin-bottom: var(--spacing-2);
}
.rg-hybrid-text {
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  color: var(--text-secondary);
}

/* Intro simulator */
.rg-sim-input {
  flex: 1;
  background: var(--surface-2);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-sm);
  padding: var(--spacing-3) var(--spacing-4);
  color: var(--text-primary);
  font-family: 'IBM Plex Mono', ui-monospace, monospace;
  font-size: var(--text-size-caption);
  outline: none;
  transition: border-color var(--duration-fast) var(--ease-standard), box-shadow var(--duration-fast) var(--ease-standard);
}
.rg-sim-input:focus-visible {
  border-color: var(--purple-500);
  box-shadow: 0 0 0 3px var(--color-focus-ring);
}
.rg-sim-input::placeholder { color: var(--text-tertiary); }

/* Quiz */
.rg-quiz-wrap { max-width: 720px; margin: 0 auto; }
.rg-quiz-progress { display: flex; align-items: center; gap: var(--spacing-3); margin-bottom: var(--spacing-6); }
.rg-quiz-progress-bar-bg { flex: 1; height: 4px; background: var(--surface-3); border-radius: 2px; overflow: hidden; }
.rg-quiz-progress-bar {
  height: 100%;
  background: var(--text-primary);
  border-radius: 2px;
  transition: width var(--duration-standard) var(--ease-standard);
}
.rg-quiz-progress-label {
  font: var(--text-weight-body) var(--text-size-caption)/1 var(--font-primary);
  color: var(--text-secondary);
  white-space: nowrap;
}

.rg-diff-badge {
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
.rg-diff-badge::before {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}
.rg-diff-badge.easy   { color: var(--color-success); border-color: var(--color-success); }
.rg-diff-badge.medium { color: var(--color-warning); border-color: var(--color-warning); }
.rg-diff-badge.hard   { color: var(--color-info);    border-color: var(--color-info); }

.rg-quiz-q {
  font: var(--text-weight-h3) var(--text-size-h3)/var(--text-lh-h3) var(--font-primary);
  letter-spacing: var(--text-ls-h3);
  color: var(--text-primary);
  margin-bottom: var(--spacing-5);
}
.rg-quiz-opts { display: flex; flex-direction: column; gap: var(--spacing-2); margin-bottom: var(--spacing-5); }
.rg-quiz-opt {
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
.rg-quiz-opt:hover:not(:disabled) { background: var(--surface-2); border-color: var(--border-strong); }
.rg-quiz-opt:focus-visible { outline: 3px solid var(--color-focus-ring); outline-offset: 2px; }
.rg-quiz-opt:disabled { cursor: default; }
.rg-quiz-opt.correct { border-color: var(--color-success); }
.rg-quiz-opt.wrong   { border-color: var(--color-error); }
.rg-quiz-opt.neutral { opacity: 0.55; }
.rg-quiz-opt-letter {
  font-family: 'IBM Plex Mono', ui-monospace, monospace;
  color: var(--text-tertiary);
  margin-right: var(--spacing-2);
}

.rg-quiz-explanation {
  background: var(--surface-2);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--spacing-3) var(--spacing-4);
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-5);
}
.rg-quiz-explanation strong { color: var(--text-primary); }

.rg-quiz-done { text-align: center; padding: var(--spacing-7) 0; }
.rg-quiz-done-score {
  font: var(--text-weight-h1) var(--text-size-h1)/1 var(--font-primary);
  letter-spacing: var(--text-ls-h1);
  color: var(--text-primary);
  margin-bottom: var(--spacing-2);
}
.rg-quiz-done-label {
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-6);
}
`

// ─── Pipeline data ───────────────────────────────────────────────────────────
// Per §5.3 — user query + retrieved chunks = orange (external input);
// embed / vector search / prompt assembly / generation = blue (structured
// transformation); the final streamed answer reads in success-green via
// .rg-streaming.
const PIPELINE_STEPS = [
  { id: 0, iconKey: 'chat',    label: 'User query',        tint: 'var(--orange-500)', soft: 'var(--orange-50)', content: 'What are the main causes of inflation?' },
  { id: 1, iconKey: 'hash',    label: 'Embed query',       tint: 'var(--blue-500)',   soft: 'var(--blue-50)',   content: 'Query converted to vector: [0.82, 0.14, 0.67, 0.31, 0.55, 0.22, 0.78, 0.09, …]' },
  { id: 2, iconKey: 'search',  label: 'Vector search',     tint: 'var(--blue-500)',   soft: 'var(--blue-50)',   content: 'Scanning 10,000 document chunks for semantic similarity…' },
  { id: 3, iconKey: 'file',    label: 'Retrieved chunks',  tint: 'var(--orange-500)', soft: 'var(--orange-50)', content: 'Top 3 chunks retrieved from the knowledge base.' },
  { id: 4, iconKey: 'puzzle',  label: 'Prompt assembly',   tint: 'var(--blue-500)',   soft: 'var(--blue-50)',   content: 'Query and retrieved context combined into a structured prompt.' },
  { id: 5, iconKey: 'sparkle', label: 'LLM generation',    tint: 'var(--color-success)', soft: 'var(--surface-1)', content: 'Inflation is primarily caused by demand-pull factors (excess consumer spending), cost-push factors (rising production costs), and built-in inflation (wage-price spiral). Central banks typically respond by raising interest rates to reduce money supply.' },
]

// ─── Chunking data ────────────────────────────────────────────────────────────
const SAMPLE_DOC_SENTENCES = [
  "Climate change refers to long-term shifts in global temperatures and weather patterns.",
  "Since the mid-20th century, human activities have been the main driver of climate change.",
  "Burning fossil fuels like coal, oil, and gas releases greenhouse gases into the atmosphere.",
  "Carbon dioxide and methane trap heat from the sun, causing the greenhouse effect.",
  "Global average temperatures have risen by approximately 1.1°C since pre-industrial times.",
  "Rising temperatures are causing glaciers and ice sheets to melt at accelerating rates.",
  "Sea levels have risen by about 20 centimeters over the past century.",
  "More frequent and intense weather events like hurricanes and droughts are being observed.",
  "Biodiversity is under threat as habitats shift faster than many species can adapt.",
  "Coral reefs are particularly vulnerable, with mass bleaching events increasing in frequency.",
  "Agricultural systems face disruption as rainfall patterns and growing seasons change.",
  "Food security is at risk in regions already experiencing water scarcity.",
  "Arctic sea ice extent has declined by about 13% per decade since 1979.",
  "Permafrost thaw releases stored methane, creating a dangerous feedback loop.",
  "International agreements like the Paris Accord aim to limit warming to 1.5°C.",
  "Renewable energy adoption is accelerating, with solar and wind costs falling dramatically.",
  "Carbon capture technologies are being developed to remove CO2 from the atmosphere.",
  "Individual actions, policy changes, and corporate commitments all play a role in mitigation."
]

// ─── Retrieval data ───────────────────────────────────────────────────────────
const KNOWLEDGE_BASE = [
  { id: 0, title: 'Data Security Fundamentals', text: 'SQL injection attacks exploit vulnerabilities in database queries. Parameterized queries and input validation are essential prevention techniques.' },
  { id: 1, title: 'Programming Languages', text: 'Python excels at data science and scripting while JavaScript dominates web development. Both are versatile but serve different primary use cases.' },
  { id: 2, title: 'Exercise Science', text: 'Resistance training 2-3 times per week improves muscle mass, bone density, and metabolic rate. Progressive overload is the key principle.' },
  { id: 3, title: 'Computer Networks', text: 'The internet routes data packets through TCP/IP protocols. DNS resolves domain names to IP addresses, enabling human-readable web addresses.' },
  { id: 4, title: 'Economics', text: 'Inflation occurs when demand exceeds supply or production costs rise. Central banks use interest rate policy to control inflation targets.' },
  { id: 5, title: 'Cybersecurity', text: 'Multi-factor authentication significantly reduces unauthorized access. Common attack vectors include phishing, malware, and social engineering.' },
  { id: 6, title: 'Web Development', text: 'React uses a virtual DOM to efficiently update the UI. Component-based architecture promotes reusability and maintainability.' },
  { id: 7, title: 'Nutrition Science', text: 'Protein intake of 1.6-2.2g per kg of bodyweight supports muscle synthesis. Timing protein around workouts can enhance recovery.' },
  { id: 8, title: 'Network Protocols', text: 'HTTP/2 introduced multiplexing to reduce latency. HTTPS encrypts data in transit using TLS certificates.' },
  { id: 9, title: 'Monetary Policy', text: 'Quantitative easing expands money supply by purchasing government bonds. This lowers long-term interest rates to stimulate economic activity.' }
]

const QUERIES = [
  { id: 0, text: 'How to prevent data breaches', scores: [0.28, 0.18, 0.15, 0.22, 0.12, 0.91, 0.14, 0.11, 0.19, 0.24] },
  { id: 1, text: 'Python vs JavaScript', scores: [0.15, 0.94, 0.12, 0.18, 0.11, 0.16, 0.72, 0.13, 0.21, 0.14] },
  { id: 2, text: 'Benefits of exercise', scores: [0.12, 0.16, 0.88, 0.14, 0.11, 0.19, 0.13, 0.76, 0.12, 0.15] },
  { id: 3, text: 'How does the internet work', scores: [0.14, 0.22, 0.13, 0.91, 0.16, 0.18, 0.21, 0.14, 0.83, 0.17] },
  { id: 4, text: 'What causes inflation', scores: [0.11, 0.14, 0.16, 0.19, 0.89, 0.13, 0.12, 0.17, 0.15, 0.78] }
]

// ─── Prompt Assembly data ─────────────────────────────────────────────────────
const PROMPT_CHUNKS = [
  { id: 0, title: 'Chunk A', text: 'Inflation occurs when too much money chases too few goods. Demand-pull inflation results from strong consumer spending.' },
  { id: 1, title: 'Chunk B', text: 'Cost-push inflation arises when production costs increase, forcing businesses to raise prices to maintain margins.' },
  { id: 2, title: 'Chunk C', text: 'Central banks combat inflation by raising interest rates, which reduces borrowing and spending in the economy.' }
]

const ANSWER_VARIANTS = {
  '': "I don't have enough context to answer this question accurately.",
  '0': 'Inflation occurs when too much money chases too few goods, driven by strong consumer demand.',
  '1': 'Inflation can be caused by rising production costs that force businesses to increase prices.',
  '2': 'Central banks address inflation by raising interest rates to reduce spending.',
  '0,1': 'Inflation stems from two main sources: excess consumer demand (demand-pull) and rising production costs (cost-push).',
  '0,2': 'Inflation occurs when consumer demand exceeds supply. Central banks respond by raising interest rates to reduce spending.',
  '1,2': 'When production costs rise, businesses raise prices. Central banks counter this by increasing interest rates.',
  '0,1,2': 'Inflation is caused by demand-pull factors (excess consumer spending), cost-push factors (rising production costs). Central banks typically respond by raising interest rates to reduce money supply and cool the economy.'
}

// ─── Comparison data ──────────────────────────────────────────────────────────
const COMPARISON_ROWS = [
  { label: 'Update frequency', rag: { rating: 'good', text: 'Real-time — update the knowledge base without any model changes' }, ft: { rating: 'bad', text: 'Requires full retraining cycle, which can take days and significant compute' } },
  { label: 'Cost', rag: { rating: 'good', text: 'Low — only inference cost plus vector database storage' }, ft: { rating: 'warn', text: 'High upfront training cost; cheaper per-query if volume is very high' } },
  { label: 'Data privacy', rag: { rating: 'good', text: 'Documents stay in your vector database; only relevant excerpts sent to LLM' }, ft: { rating: 'warn', text: 'Training data may be memorized; harder to selectively remove information' } },
  { label: 'Domain accuracy', rag: { rating: 'warn', text: "Depends on retrieval quality; can fail if the right chunk isn't retrieved" }, ft: { rating: 'good', text: 'Model deeply internalizes domain knowledge and style' } },
  { label: 'Hallucination risk', rag: { rating: 'good', text: 'Lower — answer is grounded in retrieved text; easy to add citations' }, ft: { rating: 'warn', text: 'Model may confidently generate plausible but incorrect domain facts' } }
]

const SCENARIOS = [
  { id: 0, title: 'Customer support for a SaaS product', recommendation: 'rag', rationale: 'Product docs change frequently. RAG lets you update the knowledge base instantly without retraining. The LLM answers from current documentation.' },
  { id: 1, title: 'Medical literature Q&A', recommendation: 'hybrid', rationale: 'Fine-tuning teaches medical reasoning and terminology; RAG supplies the latest research papers. Production medical AI typically uses both.' },
  { id: 2, title: 'Domain-specific writing style', recommendation: 'finetune', rationale: 'Style and tone are baked into model weights, not document retrieval. Fine-tuning on examples of the target style is the right tool here.' },
  { id: 3, title: 'Real-time news summarization', recommendation: 'rag', rationale: "News changes by the hour — no fine-tuning can keep up. RAG with a live news index retrieves today's articles at query time." },
  { id: 4, title: 'Legal contract analysis', recommendation: 'hybrid', rationale: 'Fine-tuning teaches legal reasoning patterns; RAG retrieves the specific clauses from the contracts under review. Both layers are needed.' }
]

// ─── Quiz data ────────────────────────────────────────────────────────────────
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
  { id: 0, difficulty: 'easy', q: 'What is the primary purpose of Retrieval-Augmented Generation (RAG)?', opts: ["To fine-tune a language model on proprietary data", "To supplement an LLM's knowledge at inference time by retrieving relevant documents", "To increase the temperature of an LLM for more creative outputs", "To replace the LLM with a document search engine"], correct: 1, explanation: "RAG does not change the model weights. It retrieves relevant text chunks from a knowledge base at query time and injects them into the prompt as context, allowing the LLM to generate answers grounded in up-to-date or private information." },
  { id: 1, difficulty: 'easy', q: "In a RAG pipeline, which step comes immediately AFTER embedding the user's query?", opts: ["Generating the answer with the LLM", "Chunking the documents", "Searching the vector database for similar chunks", "Reranking the LLM's output"], correct: 2, explanation: "The query vector is compared against all pre-indexed document vectors to find the most semantically similar chunks. This vector search step happens before the LLM is ever involved." },
  { id: 2, difficulty: 'easy', q: 'What is document "chunking" in the context of RAG?', opts: ["Compressing documents to reduce storage costs", "Splitting documents into smaller pieces so each piece can be independently embedded and retrieved", "Translating documents into a format the LLM can read", "Removing duplicate sentences from documents"], correct: 1, explanation: "Embedding an entire book as one vector loses granularity. Chunking splits documents into semantically meaningful pieces so retrieval can surface the specific passage that answers the query." },
  { id: 3, difficulty: 'easy', q: 'What is a key advantage of RAG over a pure LLM with no retrieval?', opts: ["RAG makes the LLM generate text faster", "RAG allows the system to answer questions about information not in the LLM's training data", "RAG eliminates the need for a system prompt", "RAG removes the context window limit entirely"], correct: 1, explanation: "LLMs have a knowledge cutoff and no awareness of proprietary or recent information. RAG solves this by retrieving relevant documents at query time, enabling answers about private data, recent events, or any custom knowledge base." },
  { id: 4, difficulty: 'medium', q: "Your RAG system retrieves 5 chunks but the LLM's answer ignores 2 of them. What is the most likely explanation?", opts: ["The vector database returned incorrect results", "The LLM was context-length limited and truncated the chunks", 'The chunks placed in the middle of the prompt received less attention — the "lost in the middle" phenomenon', "The embedding model produced identical vectors for all 5 chunks"], correct: 2, explanation: 'Research shows that LLMs perform best on information at the very start or very end of a long context window. Chunks placed in the middle are often underweighted. Solutions include reranking and placing the most relevant chunk first.' },
  { id: 5, difficulty: 'medium', q: 'What is "reranking" in a RAG pipeline and why is it used after the initial vector search?', opts: ["Reranking re-orders the LLM's output sentences for clarity", "A second, more accurate model scores retrieved chunks for relevance to the query, overriding the initial similarity order", "Reranking re-embeds the chunks using a different embedding model", "It removes duplicate chunks from the retrieved set"], correct: 1, explanation: "Vector similarity search is fast but approximate. A cross-encoder reranker reads both the query and each chunk together to produce a more accurate relevance score. This two-stage approach (recall then precision) significantly improves answer quality." },
  { id: 6, difficulty: 'medium', q: "A user asks a question and the system retrieves chunks with similarity scores of 0.61, 0.59, 0.57. The LLM's answer is still vague. What is the most likely problem?", opts: ["The LLM temperature is too high", "The retrieved chunks are marginally relevant — the answer may not exist in the knowledge base", "The embedding model has too many dimensions", "The context window is too large"], correct: 1, explanation: "Scores in the 0.55-0.65 range indicate weak relevance — the system is returning the \"least wrong\" documents, not truly relevant ones. If the knowledge base doesn't contain the answer, no retrieval tuning can fix it. Expand the knowledge base." },
  { id: 7, difficulty: 'medium', q: 'What is "chunk overlap" and what does it prevent?', opts: ["Filtering out semantically identical chunks to reduce index size", "Adding a portion of each chunk's text to the beginning of the next chunk, preventing context from being cut at boundaries", "Using multiple embedding models on the same chunk for better coverage", "Caching frequently retrieved chunks to reduce latency"], correct: 1, explanation: "When a document is split at a fixed boundary, a sentence spanning chunks N and N+1 gets severed. Chunk overlap (typically 10-20%) copies the tail of each chunk into the head of the next, ensuring boundary-spanning content is fully represented in at least one retrievable unit." },
  { id: 8, difficulty: 'hard', q: 'Queries about recent events return old chunks with high similarity scores, overriding newer documents. What architectural addition would most directly fix this?', opts: ["Increasing the number of retrieved chunks from 3 to 10", "Metadata filtering — attaching a date field to each chunk and pre-filtering the vector search to a recency window", "Lowering the LLM temperature", "Re-embedding all documents daily with a newer embedding model"], correct: 1, explanation: "Vector similarity is purely semantic — it cannot reason about time. Metadata filtering restricts vector search to a pre-filtered subset (e.g., last 90 days) before similarity ranking. Most vector databases support this as a native pre-filter operation." },
  { id: 9, difficulty: 'hard', q: 'Chunk A scores 0.94 and is retrieved. Chunks B and C (0.89, 0.87) contain redundant info. Chunk D (0.76) has a key piece of missing information. What technique addresses this?', opts: ["Increasing the retrieval K to top-10", "Maximal Marginal Relevance (MMR) — balancing relevance to the query against diversity among retrieved chunks", "Applying a higher cosine similarity threshold of 0.90", "Using a smaller chunk size"], correct: 1, explanation: "Pure top-K retrieval can return highly similar (redundant) chunks that all answer the same sub-question. MMR iteratively selects chunks to maximize a trade-off between query similarity and dissimilarity to already-selected chunks, producing a more diverse retrieved set." },
  { id: 10, difficulty: 'hard', q: 'You upgrade from embedding model v1 to v2 but keep the existing index. What will happen?', opts: ["The system will perform better immediately — newer embeddings are always compatible", "Retrieval will silently degrade — v2 query vectors live in a different vector space than v1-indexed document vectors", "The LLM will detect the mismatch and compensate", "Only documents indexed after the upgrade will be affected"], correct: 1, explanation: 'Embedding models are not interchangeable. Each model defines its own vector space — comparing a v2 query vector against v1 document vectors is geometrically meaningless. All documents must be re-embedded with v2 before deploying the new query embedder. This is called "embedding drift."' },
  { id: 11, difficulty: 'hard', q: 'A RAG system answers questions about multi-step processes (e.g., "how does the loan approval workflow work?") incompletely. What is the most sophisticated fix?', opts: ["Increase chunk size to 2048 tokens", "Implement hierarchical indexing — index small chunks for precision and their parent summaries for context, fetching the full parent when a child matches", "Use higher LLM temperature", "Add more documents to the knowledge base"], correct: 1, explanation: "Multi-step processes span many paragraphs and don't fit in one chunk. Hierarchical retrieval indexes small chunks for precision while storing references to parent sections. When a small chunk matches, the retriever fetches the full parent document — giving the LLM both specificity and surrounding narrative." }
]

// ─── Intro simulator data ─────────────────────────────────────────────────────
// iconKey resolves via IconFor; each doc icon stays neutral.
const INTRO_DOCS = [
  {
    id: 0, label: 'Company FAQ', iconKey: 'buildings',
    sentences: [
      "NovaTech was founded in 2018 and is headquartered in Austin, Texas.",
      "Our flagship product is CloudSync, a real-time data synchronization platform.",
      "CloudSync supports integration with Salesforce, HubSpot, and over 200 other tools.",
      "NovaTech offers three pricing plans: Starter ($29/mo), Pro ($99/mo), and Enterprise (custom).",
      "The Starter plan includes up to 5 users and 10GB of storage.",
      "Enterprise customers receive dedicated support, SLA guarantees, and custom security audits.",
      "All data is encrypted at rest and in transit using AES-256 and TLS 1.3.",
      "NovaTech's uptime SLA is 99.9%, with an average response time under 200ms.",
      "To cancel your subscription, visit Account Settings > Billing > Cancel Plan.",
      "Refunds are available within 30 days of purchase for annual plans."
    ],
    exampleQs: ['What is CloudSync?', 'How much does the Pro plan cost?', 'Is my data secure?']
  },
  {
    id: 1, label: 'Study notes', iconKey: 'books',
    sentences: [
      "Photosynthesis is the process by which plants convert sunlight into glucose using carbon dioxide and water.",
      "Chlorophyll, the green pigment in plants, absorbs light energy primarily in the red and blue wavelengths.",
      "The light-dependent reactions occur in the thylakoids and produce ATP and NADPH.",
      "The Calvin cycle takes place in the stroma and uses ATP to build sugar molecules.",
      "Plants release oxygen as a byproduct of splitting water molecules during photosynthesis.",
      "Cellular respiration is essentially the reverse of photosynthesis, breaking down glucose to release energy.",
      "Mitochondria are the organelles responsible for cellular respiration in eukaryotic cells.",
      "The overall equation for photosynthesis is: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂.",
      "C4 plants like corn have evolved mechanisms to reduce photorespiration in hot climates.",
      "Cyanobacteria were the first organisms to perform oxygenic photosynthesis, transforming Earth's atmosphere."
    ],
    exampleQs: ['What is photosynthesis?', 'Where does the Calvin cycle happen?', 'What do plants release?']
  },
  {
    id: 2, label: 'Product manual', iconKey: 'wrench',
    sentences: [
      "The ProCam X1 camera shoots 4K video at up to 120 frames per second.",
      "Battery life is approximately 90 minutes when recording in 4K mode.",
      "To charge the camera, connect the included USB-C cable to any 18W or higher charger.",
      "The camera is waterproof to a depth of 10 meters for up to 30 minutes.",
      "Stabilization is handled by a 6-axis gyroscopic sensor for smooth footage.",
      "The ProCam X1 connects to the companion mobile app via Bluetooth 5.2.",
      "Voice commands include Start recording, Stop recording, and Take photo.",
      "The camera supports SD cards up to 1TB with a Class 10 or UHS-I rating.",
      "To reset the camera to factory defaults, hold the power and mode buttons for 10 seconds.",
      "Firmware updates can be applied through the mobile app or by USB connection to a computer."
    ],
    exampleQs: ['How long does the battery last?', 'Is it waterproof?', 'How do I reset the camera?']
  }
]

const STOPWORDS = new Set(['a','an','the','is','are','was','were','be','been','being','have','has','had','do','does','did','will','would','could','should','may','might','shall','can','to','of','in','on','at','by','for','with','about','into','from','up','down','out','but','and','or','if','as','i','me','my','we','our','you','your','he','his','she','her','it','its','they','their','what','which','who','that','this','these','those','how','when','where','why'])

function simpleRetrieve(question, sentences) {
  const qWords = question.toLowerCase().split(/\W+/).filter(w => w.length > 2 && !STOPWORDS.has(w))
  if (!qWords.length) return []
  return sentences
    .map((s, i) => {
      const sWords = s.toLowerCase().split(/\W+/)
      const matches = qWords.filter(w => sWords.some(sw => sw.startsWith(w) || w.startsWith(sw)))
      return { i, s, score: matches.length }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .filter(x => x.score > 0)
}

// ─── Chunk colour ramp — 4-step semantic palette (§5.3) ──────────────────────
const CHUNK_COLORS = [
  { bg: 'var(--blue-50)',   border: 'var(--blue-500)' },
  { bg: 'var(--blue-50)',   border: 'var(--blue-300)' },
  { bg: 'var(--orange-50)', border: 'var(--orange-300)' },
  { bg: 'var(--orange-50)', border: 'var(--orange-500)' },
]

const TEMPLATE_CONFIGS = {
  grounded: "You are a helpful assistant. Answer ONLY using the provided context. Do not use prior knowledge.",
  reasoning: "You are an analytical assistant. Use the context to reason step-by-step before giving your final answer.",
  citations: "You are a precise assistant. Cite the specific chunk (e.g. [Chunk A]) for each claim in your response."
}

export default function RAG() {
  const [tab, setTab] = useState(0)
  const TABS = ['What is RAG?', 'Pipeline', 'Chunking', 'Retrieval', 'Prompt assembly', 'RAG vs fine-tuning', 'Quiz']

  // ── Tab 0: What is RAG? ──────────────────────────────────────────────────
  const [introDocId, setIntroDocId] = useState(0)
  const [introQuestion, setIntroQuestion] = useState('')
  const [introRetrieved, setIntroRetrieved] = useState(null)

  function runIntroAsk(q) {
    const question = q !== undefined ? q : introQuestion
    if (!question.trim()) return
    const doc = INTRO_DOCS.find(d => d.id === introDocId)
    const results = simpleRetrieve(question, doc.sentences)
    setIntroRetrieved({ question, results, docId: introDocId })
    if (q !== undefined) setIntroQuestion(q)
  }

  function changeIntroDoc(id) {
    setIntroDocId(id)
    setIntroRetrieved(null)
    setIntroQuestion('')
  }

  // ── Tab 1: Pipeline ──────────────────────────────────────────────────────
  const [pipelineStep, setPipelineStep] = useState(0)
  const [streaming, setStreaming] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const streamRef = useRef(null)

  function advancePipeline() {
    const next = pipelineStep + 1
    if (next > 5) return
    setPipelineStep(next)
    if (next === 5) {
      setIsStreaming(true)
      setStreaming('')
      const full = PIPELINE_STEPS[5].content
      let i = 0
      streamRef.current = setInterval(() => {
        i++
        setStreaming(full.slice(0, i))
        if (i >= full.length) {
          clearInterval(streamRef.current)
          setIsStreaming(false)
        }
      }, 18)
    }
  }

  function resetPipeline() {
    if (streamRef.current) clearInterval(streamRef.current)
    setPipelineStep(0)
    setStreaming('')
    setIsStreaming(false)
  }

  useEffect(() => () => { if (streamRef.current) clearInterval(streamRef.current) }, [])

  // ── Tab 1: Chunking ──────────────────────────────────────────────────────
  const [chunkSize, setChunkSize] = useState(3)
  const [chunkStrategy, setChunkStrategy] = useState('fixed')

  const chunks = useMemo(() => {
    const sents = SAMPLE_DOC_SENTENCES
    if (chunkStrategy === 'paragraph') {
      return [sents.slice(0, 6), sents.slice(6, 12), sents.slice(12)]
    }
    const result = []
    for (let i = 0; i < sents.length; i += chunkSize) {
      result.push(sents.slice(i, i + chunkSize))
    }
    return result
  }, [chunkSize, chunkStrategy])

  // ── Tab 2: Retrieval ─────────────────────────────────────────────────────
  const [selectedQuery, setSelectedQuery] = useState(null)
  const [sortedChunks, setSortedChunks] = useState([])

  function selectQuery(qid) {
    setSelectedQuery(qid)
    const q = QUERIES.find(q => q.id === qid)
    const scored = KNOWLEDGE_BASE.map((chunk, i) => ({ ...chunk, score: q.scores[i] }))
    scored.sort((a, b) => b.score - a.score)
    setSortedChunks(scored)
  }

  // ── Tab 3: Prompt Assembly ───────────────────────────────────────────────
  const [includedChunks, setIncludedChunks] = useState(new Set([0, 1, 2]))
  const [promptTemplate, setPromptTemplate] = useState('grounded')

  function toggleChunk(id) {
    setIncludedChunks(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const assembledPrompt = useMemo(() => {
    const sysText = TEMPLATE_CONFIGS[promptTemplate]
    const contextParts = PROMPT_CHUNKS.filter(c => includedChunks.has(c.id))
      .map(c => `[${c.title}]: ${c.text}`)
    const contextBlock = contextParts.length
      ? contextParts.join('\n')
      : '(no context provided)'
    return { sysText, contextBlock }
  }, [includedChunks, promptTemplate])

  const promptString = `System: ${assembledPrompt.sysText}\n\nContext:\n${assembledPrompt.contextBlock}\n\nQuestion: What are the main causes of inflation?`
  const tokenCount = Math.round(promptString.split(/\s+/).length * 1.3)

  const answerKey = [...includedChunks].sort((a,b) => a-b).join(',')
  const answer = ANSWER_VARIANTS[answerKey] || ANSWER_VARIANTS['']

  // ── Tab 4: Comparison ────────────────────────────────────────────────────
  const [expandedRow, setExpandedRow] = useState(null)
  const [selectedScenario, setSelectedScenario] = useState(null)

  function toggleRow(idx) { setExpandedRow(prev => prev === idx ? null : idx) }

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

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="rg-root">
      <style>{css}</style>
      <NavBar />

      <header className="rg-hero">
        <div className="rg-eyebrow">LLM architecture</div>
        <h1 className="rg-title">Retrieval-augmented generation</h1>
        <p className="rg-subtitle">See how RAG pipelines retrieve, chunk, and inject knowledge into LLM prompts — making AI systems accurate, updatable, and grounded in truth.</p>
      </header>

      <div className="rg-tabs-row">
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

      <div className="rg-panel">

        {/* ── Tab 0: What is RAG? ───────────────────────────────────────────── */}
        {tab === 0 && (
          <div>
            <div className="rg-section-title">What is RAG?</div>
            <p className="rg-section-sub">
              RAG stands for <strong style={{ color: 'var(--text-primary)' }}>retrieval-augmented generation</strong>. It gives an AI model access to your own documents — so it can answer questions accurately based on information it was never trained on.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)', flexWrap: 'wrap', margin: 'var(--spacing-6) 0', padding: 'var(--spacing-4)', background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
              {[
                { label: 'Your documents',   iconKey: 'file',     tint: 'var(--orange-500)' },
                null,
                { label: 'Knowledge base',   iconKey: 'database', tint: 'var(--text-primary)' },
                null,
                { label: 'Retrieve',         iconKey: 'search',   tint: 'var(--blue-500)' },
                null,
                { label: 'LLM',              iconKey: 'sparkle',  tint: 'var(--blue-500)' },
                null,
                { label: 'Grounded answer',  iconKey: 'chat',     tint: 'var(--color-success)', highlight: true },
              ].map((item, i) =>
                item === null
                  ? <ArrowRightIcon key={`arrow-${i}`} size={16} weight="bold" style={{ color: 'var(--text-tertiary)' }} />
                  : <div key={item.label} style={{ background: item.highlight ? 'var(--surface-1)' : 'var(--surface-1)', border: `1px solid ${item.highlight ? 'var(--color-success)' : 'var(--border-default)'}`, borderRadius: 'var(--radius-sm)', padding: 'var(--spacing-2) var(--spacing-3)', textAlign: 'center', minWidth: 96 }}>
                      <div style={{ marginBottom: 4, color: item.tint, display: 'flex', justifyContent: 'center' }}><IconFor name={item.iconKey} size={20} weight="duotone" /></div>
                      <div style={{ font: 'var(--text-weight-label) var(--text-size-meta)/1.2 var(--font-primary)', color: item.highlight ? 'var(--color-success)' : 'var(--text-secondary)' }}>{item.label}</div>
                    </div>
              )}
            </div>

            <div className="rg-card" style={{ marginBottom: 'var(--spacing-7)' }}>
              <div style={{ font: 'var(--text-weight-h3) var(--text-size-h3)/var(--text-lh-h3) var(--font-primary)', letterSpacing: 'var(--text-ls-h3)', color: 'var(--text-primary)', marginBottom: 'var(--spacing-2)' }}>What is a knowledge base?</div>
              <p style={{ font: 'var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-4)' }}>
                A knowledge base is a collection of your own text that the RAG system indexes and searches. Think of it as giving the AI a reference library to consult before answering. It can hold any text-based content:
              </p>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)', flexWrap: 'wrap' }}>
                {[
                  { iconKey: 'file',       lbl: 'PDFs and docs' },
                  { iconKey: 'envelope',   lbl: 'Emails' },
                  { iconKey: 'note',       lbl: 'Notes' },
                  { iconKey: 'globe',      lbl: 'Web pages' },
                  { iconKey: 'chat',       lbl: 'Chat logs' },
                  { iconKey: 'chartbar',   lbl: 'Spreadsheets' },
                  { iconKey: 'bookopen',   lbl: 'Books' },
                  { iconKey: 'headphones', lbl: 'Transcripts' },
                ].map(({ iconKey, lbl }) => (
                  <div key={lbl} style={{ background: 'var(--surface-2)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', padding: 'var(--spacing-2) var(--spacing-3)', font: 'var(--text-weight-body) var(--text-size-caption)/1 var(--font-primary)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)' }}>
                    <IconFor name={iconKey} size={16} weight="duotone" /><span>{lbl}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ font: 'var(--text-weight-h3) var(--text-size-h3)/var(--text-lh-h3) var(--font-primary)', letterSpacing: 'var(--text-ls-h3)', color: 'var(--text-primary)', marginBottom: 'var(--spacing-1)' }}>Try it yourself</div>
            <p style={{ font: 'var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-4)' }}>
              Pick a sample knowledge base and ask any question about it. The system retrieves the most relevant sentences and assembles a prompt — just like a real RAG pipeline.
            </p>

            <div style={{ display: 'flex', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-5)', flexWrap: 'wrap' }}>
              {INTRO_DOCS.map(doc => (
                <button
                  key={doc.id}
                  onClick={() => changeIntroDoc(doc.id)}
                  className={`rg-strategy-btn${introDocId === doc.id ? ' active' : ''}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--spacing-2)' }}
                >
                  <IconFor name={doc.iconKey} size={16} weight="duotone" />
                  <span>{doc.label}</span>
                </button>
              ))}
            </div>

            {(() => {
              const doc = INTRO_DOCS.find(d => d.id === introDocId)
              const retrievedIndices = new Set((introRetrieved?.docId === introDocId ? introRetrieved.results : []).map(r => r.i))
              return (
                <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-5)', marginBottom: 'var(--spacing-4)' }}>
                  <div style={{ font: 'var(--text-weight-label) var(--text-size-caption)/1 var(--font-primary)', color: 'var(--text-tertiary)', marginBottom: 'var(--spacing-3)', display: 'inline-flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                    <IconFor name={doc.iconKey} size={16} weight="duotone" />
                    {doc.label} · {doc.sentences.length} sentences
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
                    {doc.sentences.map((s, i) => {
                      const isRetrieved = retrievedIndices.has(i)
                      const rank = (introRetrieved?.results || []).findIndex(r => r.i === i)
                      return (
                        <div key={i} style={{
                          padding: 'var(--spacing-2) var(--spacing-3)',
                          borderRadius: 'var(--radius-sm)',
                          background: isRetrieved ? 'var(--orange-50)' : 'transparent',
                          border: isRetrieved ? '1px solid var(--orange-500)' : '1px solid transparent',
                          font: 'var(--text-weight-body) var(--text-size-caption)/var(--text-lh-body) var(--font-primary)',
                          color: isRetrieved ? 'var(--text-primary)' : 'var(--text-secondary)',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 'var(--spacing-2)',
                          transition: 'background-color var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard)',
                        }}>
                          {isRetrieved && (
                            <span style={{ font: 'var(--text-weight-label) var(--text-size-meta)/1 var(--font-primary)', color: 'var(--orange-500)', background: 'var(--surface-1)', border: '1px solid var(--orange-500)', padding: '1px 6px', borderRadius: 'var(--radius-sm)', whiteSpace: 'nowrap', marginTop: 1 }}>
                              #{rank + 1}
                            </span>
                          )}
                          <span>{s}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })()}

            <div style={{ marginBottom: 'var(--spacing-3)' }}>
              <div style={{ font: 'var(--text-weight-label) var(--text-size-caption)/1 var(--font-primary)', letterSpacing: 0.06, color: 'var(--text-tertiary)', marginBottom: 'var(--spacing-2)' }}>Ask a question</div>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                <input
                  type="text"
                  className="rg-sim-input"
                  value={introQuestion}
                  onChange={e => setIntroQuestion(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && runIntroAsk()}
                  placeholder="Type a question about the document…"
                />
                <button className="rg-btn" onClick={() => runIntroAsk()}>
                  Ask <ArrowRightIcon size={14} weight="bold" />
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--spacing-2)', flexWrap: 'wrap', marginBottom: 'var(--spacing-6)', alignItems: 'center' }}>
              <span style={{ font: 'var(--text-weight-body) var(--text-size-caption)/1 var(--font-primary)', color: 'var(--text-tertiary)' }}>Try:</span>
              {INTRO_DOCS.find(d => d.id === introDocId).exampleQs.map(q => (
                <button key={q} className="rg-eq-chip" onClick={() => runIntroAsk(q)}>{q}</button>
              ))}
            </div>

            {introRetrieved && introRetrieved.docId === introDocId && (
              <div>
                {introRetrieved.results.length === 0 ? (
                  <div className="rg-card-plain" style={{ color: 'var(--color-error)', textAlign: 'center' }}>No relevant chunks found. Try a more specific question.</div>
                ) : (
                  <>
                    <div style={{ font: 'var(--text-weight-label) var(--text-size-body)/1.2 var(--font-primary)', color: 'var(--text-primary)', marginBottom: 'var(--spacing-2)' }}>Retrieved chunks → assembled prompt</div>
                    <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-4)', fontFamily: 'IBM Plex Mono, ui-monospace, monospace', fontSize: 'var(--text-size-meta)', lineHeight: 1.7, marginBottom: 'var(--spacing-3)', whiteSpace: 'pre-wrap' }}>
                      <span style={{ color: 'var(--text-tertiary)' }}>{'[SYSTEM]\nYou are a helpful assistant. Answer using ONLY the provided context.\n\n'}</span>
                      <span style={{ color: 'var(--blue-500)' }}>{'[CONTEXT]\n'}{introRetrieved.results.map((r, i) => `Chunk ${i+1}: ${r.s}`).join('\n')}{'\n\n'}</span>
                      <span style={{ color: 'var(--orange-500)' }}>{'[QUESTION]\n'}{introRetrieved.question}</span>
                    </div>
                    <div className="rg-answer-label">LLM answer</div>
                    <div className="rg-answer-box">Based on the retrieved context: {introRetrieved.results.map(r => r.s).join(' ')}</div>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Tab 1: Pipeline ───────────────────────────────────────────── */}
        {tab === 1 && (
          <div>
            <div className="rg-section-title">The RAG pipeline</div>
            <p className="rg-section-sub">Step through each stage of a retrieval-augmented generation pipeline. Click "Next step" to advance.</p>

            {PIPELINE_STEPS.map((step, i) => {
              const isActive = i === pipelineStep
              const isDone = i < pipelineStep
              return (
                <div
                  key={step.id}
                  className={`rg-pipeline-step${isActive ? ' active' : isDone ? ' done' : ''}`}
                  style={{ '--step-tint': step.tint, '--step-soft': step.soft }}
                >
                  <div className="rg-step-icon"><IconFor name={step.iconKey} size={22} weight="duotone" /></div>
                  <div style={{ flex: 1 }}>
                    <div className="rg-step-num">Step {i + 1} of 6</div>
                    <div className="rg-step-label">{step.label}</div>
                    {(isActive || isDone) && (
                      <div className="rg-step-content">
                        {isActive && i === 5 ? (
                          <span className="rg-streaming">
                            {streaming}
                            {isStreaming && <span className="rg-cursor" />}
                          </span>
                        ) : step.content}
                      </div>
                    )}
                  </div>
                  {isDone && <CheckIcon size={18} weight="bold" style={{ color: 'var(--color-success)', marginTop: 2 }} />}
                </div>
              )
            })}

            <div style={{ marginTop: 'var(--spacing-6)', display: 'flex', gap: 0 }}>
              {pipelineStep < 5 && (
                <button className="rg-btn" onClick={advancePipeline}>
                  Next step <ArrowRightIcon size={14} weight="bold" />
                </button>
              )}
              <button className="rg-btn-ghost" onClick={resetPipeline}>
                <ArrowCounterClockwiseIcon size={14} weight="bold" /> Reset
              </button>
            </div>

            <div style={{ marginTop: 'var(--spacing-7)' }}>
              <div className="rg-section-title" style={{ fontSize: 'var(--text-size-h3)', marginBottom: 'var(--spacing-4)' }}>Why RAG?</div>
              <div className="rg-benefits-grid">
                {[
                  { iconKey: 'calendar',  title: 'Overcomes knowledge cutoff', desc: 'Inject current information without retraining the model.' },
                  { iconKey: 'target',    title: 'Reduces hallucinations',     desc: 'Grounding answers in real retrieved text cuts fabrication dramatically.' },
                  { iconKey: 'lock',      title: 'Enables private Q&A',        desc: "Query your company's internal documents with full privacy control." },
                  { iconKey: 'lightning', title: 'No retraining required',     desc: 'Update the knowledge base in minutes, not weeks.' },
                ].map(b => (
                  <div key={b.title} className="rg-benefit-card">
                    <div className="rg-benefit-icon"><IconFor name={b.iconKey} size={24} weight="duotone" /></div>
                    <div className="rg-benefit-title">{b.title}</div>
                    <div className="rg-benefit-desc">{b.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Tab 2: Chunking ───────────────────────────────────────────── */}
        {tab === 2 && (
          <div>
            <div className="rg-section-title">Document chunking</div>
            <p className="rg-section-sub">Documents must be split into chunks before they can be embedded and indexed. The chunking strategy directly affects retrieval quality.</p>

            <div className="rg-controls">
              <div className="rg-slider-wrap">
                <span className="rg-slider-label">Chunk size</span>
                <input
                  type="range" min={2} max={6} step={1}
                  value={chunkSize}
                  onChange={e => setChunkSize(Number(e.target.value))}
                  className="rg-slider"
                  disabled={chunkStrategy === 'paragraph'}
                />
                <span className="rg-slider-val">~{chunkSize * 25} tokens / chunk</span>
              </div>
              <div className="rg-strategy-btns">
                {['fixed', 'sentence', 'paragraph'].map(s => (
                  <button
                    key={s}
                    className={`rg-strategy-btn${chunkStrategy === s ? ' active' : ''}`}
                    onClick={() => setChunkStrategy(s)}
                  >
                    {s === 'fixed' ? 'Fixed-size' : s === 'sentence' ? 'Sentence-boundary' : 'Paragraph'}
                  </button>
                ))}
              </div>
            </div>

            <div className="rg-chunk-count">{chunks.length} chunks</div>

            <div className="rg-doc-display">
              {chunks.map((chunk, ci) => {
                const col = CHUNK_COLORS[ci % CHUNK_COLORS.length]
                return (
                  <span
                    key={ci}
                    className="rg-chunk-seg"
                    style={{ background: col.bg, borderLeft: `3px solid ${col.border}`, paddingLeft: 6, marginRight: 2, display: 'inline' }}
                    title={`Chunk ${ci + 1}`}
                  >
                    {chunk.join(' ')}
                    {ci < chunks.length - 1 && <span style={{ color: col.border, fontFamily: 'IBM Plex Mono, ui-monospace, monospace', fontSize: 'var(--text-size-meta)', margin: '0 4px' }}> ‖ </span>}
                  </span>
                )
              })}
            </div>

            <div style={{ display: 'flex', gap: 'var(--spacing-2)', flexWrap: 'wrap', marginTop: 'var(--spacing-3)' }}>
              {chunks.map((_, ci) => {
                const col = CHUNK_COLORS[ci % CHUNK_COLORS.length]
                return (
                  <span key={ci} style={{ font: 'var(--text-weight-body) var(--text-size-meta)/1 var(--font-primary)', fontFamily: 'IBM Plex Mono, ui-monospace, monospace', padding: '2px 8px', borderRadius: 'var(--radius-sm)', background: col.bg, color: col.border, border: `1px solid ${col.border}` }}>
                    {`Chunk ${ci + 1} · ${chunks[ci].join(' ').split(/\s+/).length} words`}
                  </span>
                )
              })}
            </div>

            <div className="rg-overlap-info">
              <div className="rg-overlap-title">What is chunk overlap?</div>
              <div className="rg-overlap-text">
                When documents are split at fixed boundaries, sentences that span two chunks get severed — losing context. Chunk overlap (typically 10–20%) copies the tail of each chunk into the head of the next, ensuring boundary-spanning content is fully captured in at least one retrievable unit. For a 100-token chunk with 20% overlap, each chunk shares 20 tokens with its neighbour.
              </div>
            </div>
          </div>
        )}

        {/* ── Tab 3: Retrieval ──────────────────────────────────────────── */}
        {tab === 3 && (
          <div>
            <div className="rg-section-title">Semantic retrieval</div>
            <p className="rg-section-sub">Select a query to see how similarity scores determine which chunks are retrieved. The top 3 results are passed to the LLM.</p>

            <div className="rg-query-chips">
              {QUERIES.map(q => (
                <button
                  key={q.id}
                  className={`rg-chip${selectedQuery === q.id ? ' active' : ''}`}
                  onClick={() => selectQuery(q.id)}
                >
                  {q.text}
                </button>
              ))}
            </div>

            {selectedQuery === null && (
              <div className="rg-card-plain" style={{ textAlign: 'center', color: 'var(--text-tertiary)' }}>
                Select a query above to see retrieval results.
              </div>
            )}

            {selectedQuery !== null && sortedChunks.map((chunk, i) => (
              <div key={chunk.id} className={`rg-chunk-card${i < 3 ? ' top-result' : ''}`}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-1)' }}>
                  <div className="rg-chunk-title">{chunk.title}</div>
                  {i < 3 && <span className="rg-top-badge">Top {i+1}</span>}
                </div>
                <div className="rg-chunk-text">{chunk.text}</div>
                <div className="rg-score-row">
                  <div className="rg-score-bar-bg">
                    <div className="rg-score-bar" style={{ width: `${chunk.score * 100}%` }} />
                  </div>
                  <div className="rg-score-val">{chunk.score.toFixed(2)}</div>
                </div>
              </div>
            ))}

            <div className="rg-quality-section">
              <div className="rg-section-title" style={{ fontSize: 'var(--text-size-h3)', marginBottom: 'var(--spacing-1)' }}>Query quality matters</div>
              <p style={{ font: 'var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-3)' }}>Vague queries return scattered scores. Specific queries surface a clear winner.</p>
              <div className="rg-quality-grid">
                <div className="rg-quality-col vague">
                  <div className="rg-quality-label vague">Vague query</div>
                  <div className="rg-quality-query">"Tell me about security"</div>
                  <div className="rg-quality-scores">
                    {[['Data security', 0.42], ['Cybersecurity', 0.39], ['Networks', 0.35], ['Economics', 0.33]].map(([lbl, val]) => (
                      <div key={lbl} className="rg-quality-score-row">
                        <span className="lbl">{lbl}</span>
                        <div className="bar-bg"><div className="bar" style={{ width: `${val * 100}%`, background: 'var(--color-error)' }} /></div>
                        <span className="val">{val.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rg-quality-col specific">
                  <div className="rg-quality-label specific">Specific query</div>
                  <div className="rg-quality-query">"How to prevent SQL injection attacks"</div>
                  <div className="rg-quality-scores">
                    {[['Data security', 0.94], ['Cybersecurity', 0.61], ['Networks', 0.22], ['Economics', 0.08]].map(([lbl, val]) => (
                      <div key={lbl} className="rg-quality-score-row">
                        <span className="lbl">{lbl}</span>
                        <div className="bar-bg"><div className="bar" style={{ width: `${val * 100}%`, background: 'var(--color-success)' }} /></div>
                        <span className="val">{val.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab 4: Prompt Assembly ────────────────────────────────────── */}
        {tab === 4 && (
          <div>
            <div className="rg-section-title">Prompt assembly</div>
            <p className="rg-section-sub">Toggle context chunks on and off to see how the assembled prompt — and the LLM's answer — change in real time.</p>

            <div style={{ marginBottom: 'var(--spacing-4)' }}>
              <div className="rg-assembly-col-label">System prompt template</div>
              <div className="rg-template-btns">
                {Object.keys(TEMPLATE_CONFIGS).map(t => (
                  <button key={t} className={`rg-template-btn${promptTemplate === t ? ' active' : ''}`} onClick={() => setPromptTemplate(t)}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="rg-assembly-grid">
              <div>
                <div className="rg-assembly-col-label">User query</div>
                <div className="rg-query-box">What are the main causes of inflation?</div>
              </div>
              <div>
                <div className="rg-assembly-col-label">Context chunks (toggle)</div>
                {PROMPT_CHUNKS.map(c => {
                  const on = includedChunks.has(c.id)
                  return (
                    <button
                      key={c.id}
                      type="button"
                      className={`rg-chunk-toggle${on ? ' included' : ' excluded'}`}
                      onClick={() => toggleChunk(c.id)}
                      aria-pressed={on}
                    >
                      <div className="rg-chunk-toggle-title">{c.title}</div>
                      <div className="rg-chunk-toggle-text">{c.text}</div>
                      <div className={`rg-chunk-toggle-status${on ? ' on' : ' off'}`}>{on ? 'Included' : 'Excluded'}</div>
                    </button>
                  )
                })}
              </div>
              <div>
                <div className="rg-assembly-col-label">Assembled prompt</div>
                <div className="rg-prompt-preview">
                  <span className="rg-prompt-system">System: {assembledPrompt.sysText}{'\n\n'}</span>
                  <span className="rg-prompt-context">Context:{'\n'}{assembledPrompt.contextBlock}{'\n\n'}</span>
                  <span className="rg-prompt-query">Question: What are the main causes of inflation?</span>
                </div>
                <div className="rg-token-count">Estimated tokens: <strong>{tokenCount}</strong></div>
              </div>
            </div>

            <div className="rg-answer-label">LLM answer</div>
            <div className="rg-answer-box">{answer}</div>
          </div>
        )}

        {/* ── Tab 5: RAG vs Fine-Tuning ─────────────────────────────────── */}
        {tab === 5 && (
          <div>
            <div className="rg-section-title">RAG vs fine-tuning</div>
            <p className="rg-section-sub">Both techniques adapt LLMs to specific domains — but in fundamentally different ways. Click any row to expand.</p>

            <table className="rg-compare-table">
              <thead>
                <tr>
                  <th style={{ width: '22%' }}>Dimension</th>
                  <th className="rag-col">RAG</th>
                  <th className="ft-col">Fine-tuning</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row, i) => (
                  <tr
                    key={`row-${i}`}
                    className={`rg-compare-row${expandedRow === i ? ' expanded' : ''}`}
                    onClick={() => toggleRow(i)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>
                      <div className="rg-row-expand">
                        <span className={`rg-row-expand-arrow${expandedRow === i ? ' open' : ''}`}>
                          <ArrowRightIcon size={12} weight="bold" />
                        </span>
                        <span className="rg-row-label">{row.label}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`rg-rating-dot ${row.rag.rating}`} />
                      <span className="rg-cell-short">{expandedRow === i ? '' : row.rag.text.slice(0, 38) + '…'}</span>
                      {expandedRow === i && <div className="rg-cell-detail">{row.rag.text}</div>}
                    </td>
                    <td>
                      <span className={`rg-rating-dot ${row.ft.rating}`} />
                      <span className="rg-cell-short">{expandedRow === i ? '' : row.ft.text.slice(0, 38) + '…'}</span>
                      {expandedRow === i && <div className="rg-cell-detail">{row.ft.text}</div>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="rg-section-title" style={{ fontSize: 'var(--text-size-h3)', marginBottom: 'var(--spacing-1)' }}>When to use which?</div>
            <p style={{ font: 'var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-4)' }}>Click a scenario to see the recommended approach.</p>
            <div className="rg-scenario-grid">
              {SCENARIOS.map(sc => (
                <button
                  key={sc.id}
                  type="button"
                  className={`rg-scenario-card${selectedScenario === sc.id ? ' selected' : ''}`}
                  onClick={() => setSelectedScenario(prev => prev === sc.id ? null : sc.id)}
                  aria-pressed={selectedScenario === sc.id}
                >
                  <div className="rg-scenario-title">{sc.title}</div>
                  {selectedScenario === sc.id && (
                    <>
                      <div className={`rg-scenario-rec ${sc.recommendation}`}>
                        {sc.recommendation === 'rag' ? 'Use RAG' : sc.recommendation === 'finetune' ? 'Fine-tune' : 'Hybrid'}
                      </div>
                      <div className="rg-scenario-rationale">{sc.rationale}</div>
                    </>
                  )}
                </button>
              ))}
            </div>

            <div className="rg-hybrid-box">
              <div className="rg-hybrid-title">Hybrid RAG + fine-tuning</div>
              <div className="rg-hybrid-text">
                Production AI systems often combine both. Fine-tuning teaches the model domain language, reasoning patterns, and output format — while RAG supplies the specific facts and current information the model needs to answer accurately. The two techniques are complementary, not mutually exclusive.
              </div>
            </div>
          </div>
        )}

        {/* ── Tab 6: Quiz ───────────────────────────────────────────────── */}
        {tab === 6 && (
          <div className="rg-quiz-wrap">
            {done ? (
              <div className="rg-quiz-done">
                <div className="rg-quiz-done-score">{score}/{SESSION_SIZE}</div>
                <div className="rg-quiz-done-label">Questions answered correctly</div>
                <button className="rg-btn" onClick={retake}>Retake quiz</button>
              </div>
            ) : currentQ ? (
              <>
                <div className="rg-quiz-progress">
                  <div className="rg-quiz-progress-bar-bg">
                    <div className="rg-quiz-progress-bar" style={{ width: `${(qNum / SESSION_SIZE) * 100}%` }} />
                  </div>
                  <span className="rg-quiz-progress-label">Question {qNum + 1} of {SESSION_SIZE}</span>
                </div>

                <div className={`rg-diff-badge ${currentQ.difficulty}`}>{currentQ.difficulty}</div>

                <div className="rg-quiz-q">{currentQ.q}</div>

                <div className="rg-quiz-opts" role="radiogroup">
                  {currentQ.opts.map((opt, i) => {
                    let cls = 'rg-quiz-opt'
                    if (chosen !== null) {
                      if (i === currentQ.correct) cls += ' correct'
                      else if (i === chosen) cls += ' wrong'
                      else cls += ' neutral'
                    }
                    return (
                      <button
                        key={i}
                        className={cls}
                        onClick={() => handleQuiz(i)}
                        disabled={chosen !== null}
                        role="radio"
                        aria-checked={chosen === i}
                      >
                        <span className="rg-quiz-opt-letter">{String.fromCharCode(65 + i)}.</span>
                        {opt}
                      </button>
                    )
                  })}
                </div>

                {chosen !== null && (
                  <>
                    <div className="rg-quiz-explanation">
                      <strong>{chosen === currentQ.correct ? 'Correct.' : 'Not quite.'}</strong>{' '}
                      {currentQ.explanation}
                    </div>
                    <button className="rg-btn" onClick={nextQ}>
                      {qNum + 1 >= SESSION_SIZE ? 'See results' : 'Next question'}
                    </button>
                  </>
                )}
              </>
            ) : null}
          </div>
        )}

      </div>
    </div>
  )
}
