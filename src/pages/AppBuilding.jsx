import { useEffect, useMemo, useState } from 'react'
import NavBar from '../components/NavBar.jsx'
import {
  SunIcon, MoonIcon, CheckIcon, XIcon, ArrowRightIcon,
  SparkleIcon, CompassIcon, BrainIcon, WrenchIcon,
  ArrowsClockwiseIcon, CloudArrowUpIcon, FlagIcon,
  TimerIcon, ListChecksIcon, BooksIcon,
  PlayCircleIcon, BookOpenIcon, ArticleIcon, SealCheckIcon,
  LinkBreakIcon, LinkSimpleIcon, QuestionIcon, RocketLaunchIcon,
} from '@phosphor-icons/react'

/* ─────────────────────────────────────────────────────────────
 * AI App & Web Building — Prism-scoped learning page.
 * Page-scoped theme via .ab-page[data-theme="dark"] so NavBar's
 * global theme stays independent. All values come from existing
 * Prism tokens (prism-tokens.css) plus a few neutrals overridden
 * inside the dark-scoped wrapper per the deck.
 * ───────────────────────────────────────────────────────────── */

const THEME_KEY = 'app-building-theme'
const PROGRESS_KEY = 'app-building-progress'

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&family=IBM+Plex+Sans:wght@400;600&family=Lora:ital@1&display=swap');

/* All page styles live under .ab-page so nothing leaks into other pages. */
.ab-page {
  background: var(--surface-base);
  color: var(--text-primary);
  font-family: 'Inter', system-ui, sans-serif;
  min-height: 100vh;
}

/* Dark mode — scoped to this page only (does not touch :root[data-theme="dark"]) */
.ab-page[data-theme="dark"] {
  --surface-base:   #14110E;
  --surface-1:      #1F1B17;
  --surface-2:      #262019;
  --surface-3:      #2E2720;
  --text-primary:   #F7F4F1;
  --text-secondary: #C9BFB4;
  --text-tertiary:  #8A7E72;
  --border-default: rgba(247,244,241,0.12);
  --border-strong:  rgba(247,244,241,0.22);
  /* tinted card fills go translucent in dark */
  --orange-50:  rgba(232,100,26,0.12);
  --orange-100: rgba(232,100,26,0.22);
  --blue-50:    rgba(59,125,216,0.12);
  --blue-100:   rgba(59,125,216,0.22);
  --purple-50:  rgba(124,58,237,0.12);
  --purple-100: rgba(124,58,237,0.22);
}

/* ── Type utilities (page-scoped Inter) ─────────────────────── */
.ab-h1 { font: 800 var(--text-size-h1)/var(--text-lh-h1) 'Inter', sans-serif; letter-spacing: var(--text-ls-h1); margin: 0; }
.ab-h2 { font: 800 var(--text-size-h2)/var(--text-lh-h2) 'Inter', sans-serif; letter-spacing: var(--text-ls-h2); margin: 0; }
.ab-h3 { font: 600 var(--text-size-h3)/var(--text-lh-h3) 'Inter', sans-serif; letter-spacing: var(--text-ls-h3); margin: 0; }
.ab-body { font: 400 var(--text-size-body)/var(--text-lh-body) 'Inter', sans-serif; }
.ab-label { font: 600 var(--text-size-label)/var(--text-lh-label) 'Inter', sans-serif; }
.ab-caption { font: 400 var(--text-size-caption)/var(--text-lh-caption) 'Inter', sans-serif; color: var(--text-tertiary); }
.ab-meta { font: 400 var(--text-size-meta)/var(--text-lh-meta) 'Inter', sans-serif; color: var(--text-tertiary); }
.ab-editorial { font-family: 'Lora', serif; font-style: italic; }
.ab-mono { font-family: 'IBM Plex Sans', 'Inter', sans-serif; font-feature-settings: 'tnum'; }

/* ── Hero — dark obsidian + refracted-light glow ────────────── */
.ab-hero {
  position: relative;
  padding: var(--spacing-7) var(--spacing-5) var(--spacing-6);
  color: #F7F4F1;
  background: #14110E;
  overflow: hidden;
}
.ab-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 50% 60% at 18% 80%, rgba(232,100,26,0.55) 0%, transparent 60%),
    radial-gradient(ellipse 60% 60% at 78% 18%, rgba(59,125,216,0.50) 0%, transparent 55%),
    radial-gradient(ellipse 40% 50% at 50% 50%, rgba(124,58,237,0.30) 0%, transparent 60%);
  opacity: 0.65;
  pointer-events: none;
}
.ab-hero-inner { position: relative; max-width: 1100px; margin: 0 auto; }
.ab-hero-topbar {
  display: flex; justify-content: space-between; align-items: center;
  gap: var(--spacing-3);
  margin-bottom: var(--spacing-6);
}
.ab-hero-eyebrow {
  font: 600 var(--text-size-meta)/1 'Inter', sans-serif;
  letter-spacing: 0.16em;
  color: rgba(247,244,241,0.78);
  text-transform: uppercase;
}
.ab-theme-toggle {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-1);
  height: 32px;
  padding: 0 var(--spacing-3);
  background: rgba(247,244,241,0.06);
  border: 1px solid rgba(247,244,241,0.18);
  border-radius: var(--radius-sm);
  color: #F7F4F1;
  font: 600 var(--text-size-caption)/1 'Inter', sans-serif;
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--ease-standard),
              border-color var(--duration-fast) var(--ease-standard);
}
.ab-theme-toggle:hover { background: rgba(247,244,241,0.10); border-color: rgba(247,244,241,0.30); }
.ab-theme-toggle:focus-visible { outline: 3px solid var(--color-focus-ring); outline-offset: 2px; }
.ab-hero-title {
  font: 800 clamp(36px, 6vw, 56px)/1.05 'Inter', sans-serif;
  letter-spacing: -0.025em;
  margin: 0 0 var(--spacing-3);
}
.ab-hero-subtitle {
  font: 400 var(--text-size-h3)/1.5 'Inter', sans-serif;
  color: rgba(247,244,241,0.85);
  max-width: 720px;
  margin: 0 0 var(--spacing-6);
}
.ab-stats {
  display: flex; flex-wrap: wrap; gap: var(--spacing-5);
  padding-top: var(--spacing-5);
  border-top: 1px solid rgba(247,244,241,0.16);
}
.ab-stat {
  display: inline-flex; align-items: center; gap: var(--spacing-2);
  color: rgba(247,244,241,0.85);
}
.ab-stat-num {
  font: 800 var(--text-size-h3)/1 'Inter', sans-serif;
  color: #F7F4F1;
}
.ab-stat-lbl {
  font: 400 var(--text-size-caption)/1 'Inter', sans-serif;
  color: rgba(247,244,241,0.70);
}

/* ── Shell + section header ─────────────────────────────────── */
.ab-shell { max-width: 1100px; margin: 0 auto; padding: var(--spacing-6) var(--spacing-5) var(--spacing-7); }
.ab-section-title { margin: 0 0 var(--spacing-2); }
.ab-section-sub {
  font: 400 var(--text-size-body)/var(--text-lh-body) 'Inter', sans-serif;
  color: var(--text-secondary);
  margin: 0 0 var(--spacing-5);
  max-width: 720px;
}

/* ── Module stepper ─────────────────────────────────────────── */
.ab-stepper { display: flex; flex-direction: column; gap: var(--spacing-3); }
.ab-step {
  display: grid;
  grid-template-columns: 56px 1fr auto;
  gap: var(--spacing-4);
  align-items: stretch;
  background: var(--surface-1);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--spacing-4);
  text-align: left;
  color: inherit;
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--ease-standard),
              border-color var(--duration-fast) var(--ease-standard),
              transform var(--duration-fast) var(--ease-standard);
}
.ab-step:hover { border-color: var(--border-strong); background: var(--surface-2); transform: translateY(-1px); }
.ab-step:focus-visible { outline: 3px solid var(--color-focus-ring); outline-offset: 2px; }
.ab-step--done { border-color: var(--orange-500); }
.ab-step-node {
  display: inline-flex; align-items: center; justify-content: center;
  width: 56px; height: 56px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-default);
  background: var(--surface-2);
  font: 800 var(--text-size-h3)/1 'Inter', sans-serif;
  color: var(--text-primary);
}
.ab-step--done .ab-step-node {
  background: var(--orange-500);
  color: #fff;
  border-color: var(--orange-500);
}
.ab-step-body { display: flex; flex-direction: column; gap: var(--spacing-1); justify-content: center; }
.ab-step-head { display: flex; align-items: center; gap: var(--spacing-2); flex-wrap: wrap; }
.ab-step-title { font: 700 var(--text-size-h3)/1.2 'Inter', sans-serif; margin: 0; color: var(--text-primary); }
.ab-step-desc { font: 400 var(--text-size-body)/var(--text-lh-body) 'Inter', sans-serif; color: var(--text-secondary); }
.ab-step-cta { display: inline-flex; align-items: center; gap: var(--spacing-1); align-self: center; color: var(--text-secondary); }
.ab-step-start {
  font: 600 var(--text-size-meta)/1 'Inter', sans-serif;
  text-transform: uppercase; letter-spacing: 0.08em;
  padding: 2px var(--spacing-2);
  border-radius: var(--radius-sm);
  background: var(--orange-50);
  border: 1px solid var(--orange-500);
  color: var(--orange-500);
}
.ab-step-done-tag {
  font: 600 var(--text-size-meta)/1 'Inter', sans-serif;
  text-transform: uppercase; letter-spacing: 0.08em;
  padding: 2px var(--spacing-2);
  border-radius: var(--radius-sm);
  background: var(--surface-2);
  border: 1px solid var(--color-success);
  color: var(--color-success);
}

/* ── Module panel ───────────────────────────────────────────── */
.ab-panel { display: flex; flex-direction: column; gap: var(--spacing-6); }
.ab-back {
  display: inline-flex; align-items: center; gap: var(--spacing-1);
  background: none; border: 0;
  color: var(--text-secondary);
  font: 600 var(--text-size-caption)/1 'Inter', sans-serif;
  cursor: pointer;
  align-self: flex-start;
  padding: var(--spacing-2);
}
.ab-back:hover { color: var(--text-primary); }
.ab-back:focus-visible { outline: 3px solid var(--color-focus-ring); outline-offset: 2px; border-radius: var(--radius-sm); }

.ab-mod-head { display: flex; align-items: flex-start; gap: var(--spacing-3); flex-wrap: wrap; }
.ab-mod-num {
  display: inline-flex; align-items: center; justify-content: center;
  width: 44px; height: 44px; border-radius: var(--radius-md);
  background: var(--orange-50); border: 1px solid var(--orange-500);
  color: var(--orange-500);
  font: 800 var(--text-size-label)/1 'Inter', sans-serif;
}
.ab-mod-text { display: flex; flex-direction: column; gap: var(--spacing-1); }
.ab-mod-title { margin: 0; }
.ab-mod-sub { color: var(--text-secondary); }

.ab-block { display: flex; flex-direction: column; gap: var(--spacing-3); }
.ab-block-title {
  font: 700 var(--text-size-h3)/var(--text-lh-h3) 'Inter', sans-serif;
  letter-spacing: var(--text-ls-h3);
  margin: 0;
}
.ab-block-lead {
  font: 600 var(--text-size-label)/var(--text-lh-label) 'Inter', sans-serif;
  color: var(--orange-500);
}
.ab-card {
  background: var(--surface-1);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--spacing-5);
  box-shadow: var(--shadow-e2);
}
.ab-card-stack { display: flex; flex-direction: column; gap: var(--spacing-3); }
.ab-grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: var(--spacing-4); }
.ab-grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: var(--spacing-4); }
.ab-grid-5 { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: var(--spacing-3); }
@media (max-width: 880px) { .ab-grid-5 { grid-template-columns: 1fr 1fr; } }

.ab-bullets { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: var(--spacing-2); }
.ab-bullets li {
  display: grid; grid-template-columns: 20px 1fr; gap: var(--spacing-2);
  font: 400 var(--text-size-body)/var(--text-lh-body) 'Inter', sans-serif;
  color: var(--text-secondary);
}
.ab-bullets li::before {
  content: ''; width: 6px; height: 6px; margin-top: 9px;
  border-radius: 50%; background: var(--orange-500);
}

/* Step chips (five-stop translator) */
.ab-pipeline {
  display: flex; align-items: center; flex-wrap: wrap; gap: var(--spacing-2);
}
.ab-pipe-step {
  display: inline-flex; flex-direction: column; gap: var(--spacing-1);
  padding: var(--spacing-3) var(--spacing-4);
  background: var(--surface-1);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-sm);
  min-width: 140px;
}
.ab-pipe-step--active { border-color: var(--orange-500); background: var(--orange-50); }
.ab-pipe-num {
  font: 600 var(--text-size-meta)/1 'Inter', sans-serif;
  color: var(--text-tertiary); letter-spacing: 0.06em;
}
.ab-pipe-name { font: 700 var(--text-size-label)/1 'Inter', sans-serif; color: var(--text-primary); }
.ab-pipe-arrow { color: var(--text-tertiary); }

/* Demo wrapper */
.ab-demo {
  background: var(--surface-2);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--spacing-5);
  display: flex; flex-direction: column; gap: var(--spacing-4);
}
.ab-demo-label {
  font: 600 var(--text-size-meta)/1 'Inter', sans-serif;
  letter-spacing: 0.10em; text-transform: uppercase;
  color: var(--text-tertiary);
}

/* Field controls used across demos */
.ab-field { display: flex; flex-direction: column; gap: var(--spacing-1); }
.ab-field-label { font: 600 var(--text-size-label)/1 'Inter', sans-serif; color: var(--text-primary); }
.ab-field-helper { font: 400 var(--text-size-caption)/var(--text-lh-caption) 'Inter', sans-serif; color: var(--text-tertiary); }
.ab-input, .ab-textarea {
  width: 100%; box-sizing: border-box;
  background: var(--surface-1);
  color: var(--text-primary);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-sm);
  padding: var(--spacing-2) var(--spacing-3);
  font: 400 var(--text-size-body)/var(--text-lh-body) 'Inter', sans-serif;
  outline: none;
  transition: border-color var(--duration-fast) var(--ease-standard),
              box-shadow var(--duration-fast) var(--ease-standard);
}
.ab-textarea { min-height: 84px; resize: vertical; line-height: 1.5; }
.ab-input::placeholder, .ab-textarea::placeholder { color: var(--text-tertiary); }
.ab-input:focus, .ab-textarea:focus { border-color: var(--purple-500); box-shadow: 0 0 0 3px var(--color-focus-ring); }

.ab-chips { display: inline-flex; flex-wrap: wrap; gap: var(--spacing-2); }
.ab-chip {
  height: 32px; padding: 0 var(--spacing-3);
  display: inline-flex; align-items: center; gap: var(--spacing-1);
  background: var(--surface-1);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font: 600 var(--text-size-caption)/1 'Inter', sans-serif;
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--ease-standard),
              border-color var(--duration-fast) var(--ease-standard),
              color var(--duration-fast) var(--ease-standard);
}
.ab-chip:hover { background: var(--surface-2); border-color: var(--border-strong); }
.ab-chip:focus-visible { outline: 3px solid var(--color-focus-ring); outline-offset: 2px; }
.ab-chip[aria-pressed="true"] {
  background: var(--orange-500); color: #fff; border-color: var(--orange-500);
}

/* Recommendation block */
.ab-rec {
  display: flex; align-items: flex-start; gap: var(--spacing-3);
  background: var(--orange-50);
  border: 1px solid var(--orange-500);
  border-radius: var(--radius-sm);
  padding: var(--spacing-3) var(--spacing-4);
  color: var(--text-primary);
}
.ab-rec-icon { color: var(--orange-500); flex-shrink: 0; margin-top: 2px; }
.ab-rec-name { font: 700 var(--text-size-label)/1 'Inter', sans-serif; color: var(--orange-500); margin: 0 0 var(--spacing-1); }
.ab-rec-body { font: 400 var(--text-size-body)/var(--text-lh-body) 'Inter', sans-serif; color: var(--text-primary); }

/* Compiled spec output */
.ab-spec {
  background: var(--surface-1);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-sm);
  padding: var(--spacing-4);
  font-family: 'IBM Plex Sans', 'Inter', sans-serif;
  font-size: var(--text-size-body);
  line-height: 1.6;
  color: var(--text-primary);
  white-space: pre-wrap;
}
.ab-clarity {
  display: flex; align-items: flex-start; gap: var(--spacing-2);
  padding: var(--spacing-3);
  border-radius: var(--radius-sm);
  border: 1px solid;
}
.ab-clarity--ok { background: var(--surface-2); border-color: var(--color-success); color: var(--color-success); }
.ab-clarity--warn { background: var(--surface-2); border-color: var(--color-warning); color: var(--color-warning); }

/* State-vs-storage demo */
.ab-statebox {
  display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-4);
}
@media (max-width: 720px) { .ab-statebox { grid-template-columns: 1fr; } }
.ab-statecard {
  background: var(--surface-1);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-sm);
  padding: var(--spacing-4);
  display: flex; flex-direction: column; gap: var(--spacing-2);
}
.ab-statecard h4 { margin: 0; font: 700 var(--text-size-label)/1 'Inter', sans-serif; }
.ab-statecard-tag {
  font: 600 var(--text-size-meta)/1 'Inter', sans-serif;
  color: var(--text-tertiary);
  letter-spacing: 0.08em; text-transform: uppercase;
}
.ab-statecard ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: var(--spacing-1); }
.ab-statecard ul li { font: 400 var(--text-size-caption)/var(--text-lh-caption) 'Inter', sans-serif; color: var(--text-secondary); }

/* Failure-mode matcher */
.ab-match {
  display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-4);
}
@media (max-width: 760px) { .ab-match { grid-template-columns: 1fr; } }
.ab-match-col h4 { margin: 0 0 var(--spacing-2); font: 700 var(--text-size-label)/1 'Inter', sans-serif; }
.ab-match-list { display: flex; flex-direction: column; gap: var(--spacing-2); }
.ab-match-item {
  text-align: left;
  background: var(--surface-1);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-sm);
  padding: var(--spacing-3);
  color: var(--text-primary);
  font: 400 var(--text-size-body)/var(--text-lh-body) 'Inter', sans-serif;
  cursor: pointer;
  transition: border-color var(--duration-fast) var(--ease-standard),
              background-color var(--duration-fast) var(--ease-standard);
}
.ab-match-item:hover { background: var(--surface-2); border-color: var(--border-strong); }
.ab-match-item:focus-visible { outline: 3px solid var(--color-focus-ring); outline-offset: 2px; }
.ab-match-item[aria-pressed="true"] { border-color: var(--orange-500); background: var(--orange-50); }
.ab-match-item.correct { border-color: var(--color-success); }
.ab-match-item.wrong   { border-color: var(--color-error); }
.ab-match-explanation {
  margin-top: var(--spacing-3);
  background: var(--surface-1);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-sm);
  padding: var(--spacing-3);
  font: 400 var(--text-size-body)/var(--text-lh-body) 'Inter', sans-serif;
  color: var(--text-secondary);
}

/* Burn estimator */
.ab-estimator { display: flex; flex-direction: column; gap: var(--spacing-3); }
.ab-estimator-result {
  background: var(--orange-50);
  border: 1px solid var(--orange-500);
  border-radius: var(--radius-sm);
  padding: var(--spacing-4);
  display: flex; align-items: center; gap: var(--spacing-3);
}
.ab-estimator-num {
  font: 800 var(--text-size-h2)/1 'Inter', sans-serif;
  color: var(--orange-500);
}
.ab-estimator-cap {
  margin-top: var(--spacing-2);
  font: 400 var(--text-size-caption)/var(--text-lh-caption) 'Inter', sans-serif;
  color: var(--text-secondary);
}

/* Builder map table */
.ab-table-wrap { overflow-x: auto; }
.ab-table {
  width: 100%; border-collapse: collapse;
  background: var(--surface-1);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  overflow: hidden;
}
.ab-table th, .ab-table td {
  padding: var(--spacing-3) var(--spacing-4);
  text-align: left;
  border-bottom: 1px solid var(--border-default);
  font: 400 var(--text-size-body)/1.4 'Inter', sans-serif;
  color: var(--text-primary);
  vertical-align: top;
}
.ab-table th {
  font: 600 var(--text-size-meta)/1 'Inter', sans-serif;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-tertiary);
  background: var(--surface-2);
  cursor: pointer;
  user-select: none;
}
.ab-table th:hover { color: var(--text-primary); }
.ab-table th.sorted { color: var(--orange-500); }
.ab-table tr:last-child td { border-bottom: 0; }

/* Curated link cards (placeholders) */
.ab-links-grid {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--spacing-3);
}
.ab-link-card {
  background: var(--surface-1);
  border: 1px dashed var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--spacing-4);
  display: flex; flex-direction: column; gap: var(--spacing-2);
  opacity: 0.92;
}
.ab-link-card-head { display: flex; align-items: center; gap: var(--spacing-2); flex-wrap: wrap; }
.ab-link-badges { display: inline-flex; gap: var(--spacing-1); flex-wrap: wrap; }
.ab-link-badge {
  display: inline-flex; align-items: center; gap: var(--spacing-1);
  font: 600 var(--text-size-meta)/1 'Inter', sans-serif;
  padding: 3px var(--spacing-2);
  border-radius: var(--radius-sm);
  background: var(--surface-2);
  border: 1px solid var(--border-default);
  color: var(--text-primary);
}
.ab-link-badge--official { background: var(--orange-50); border-color: var(--orange-500); color: var(--orange-500); }
.ab-link-badge--community { background: var(--surface-2); border-color: var(--border-default); color: var(--text-secondary); }
.ab-link-topic { font: 700 var(--text-size-label)/1.3 'Inter', sans-serif; margin: 0; }
.ab-link-verify {
  align-self: flex-start;
  display: inline-flex; align-items: center; gap: var(--spacing-1);
  font: 600 var(--text-size-meta)/1 'Inter', sans-serif;
  letter-spacing: 0.06em; text-transform: uppercase;
  padding: 3px var(--spacing-2);
  border-radius: var(--radius-sm);
  background: var(--surface-2);
  border: 1px solid var(--color-warning);
  color: var(--color-warning);
}
.ab-link-note {
  font: 400 var(--text-size-caption)/var(--text-lh-caption) 'Inter', sans-serif;
  color: var(--text-tertiary);
}

/* Quiz */
.ab-quiz { display: flex; flex-direction: column; gap: var(--spacing-4); }
.ab-quiz-progress { display: flex; align-items: center; gap: var(--spacing-2); color: var(--text-tertiary); font: 400 var(--text-size-caption)/1 'Inter', sans-serif; }
.ab-quiz-q { font: 700 var(--text-size-h3)/var(--text-lh-h3) 'Inter', sans-serif; color: var(--text-primary); }
.ab-quiz-opts { display: flex; flex-direction: column; gap: var(--spacing-2); }
.ab-quiz-opt {
  text-align: left;
  background: var(--surface-1);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-sm);
  padding: var(--spacing-3) var(--spacing-4);
  color: var(--text-primary);
  font: 400 var(--text-size-body)/var(--text-lh-body) 'Inter', sans-serif;
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--ease-standard),
              border-color var(--duration-fast) var(--ease-standard);
}
.ab-quiz-opt:hover:not(:disabled) { background: var(--surface-2); border-color: var(--border-strong); }
.ab-quiz-opt:focus-visible { outline: 3px solid var(--color-focus-ring); outline-offset: 2px; }
.ab-quiz-opt:disabled { cursor: default; }
.ab-quiz-opt.correct { border-color: var(--color-success); color: var(--color-success); }
.ab-quiz-opt.wrong { border-color: var(--color-error); color: var(--color-error); }
.ab-quiz-explanation {
  display: flex; align-items: flex-start; gap: var(--spacing-2);
  padding: var(--spacing-3);
  background: var(--surface-2);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-sm);
  font: 400 var(--text-size-body)/var(--text-lh-body) 'Inter', sans-serif;
  color: var(--text-secondary);
}
.ab-quiz-actions { display: flex; gap: var(--spacing-3); flex-wrap: wrap; }
.ab-quiz-score { text-align: center; font: 800 var(--text-size-h1)/1 'Inter', sans-serif; }

/* Buttons (page-scoped) */
.ab-btn {
  display: inline-flex; align-items: center; gap: var(--spacing-1);
  height: 40px;
  padding: 0 var(--spacing-4);
  border-radius: var(--radius-md);
  font: 600 var(--text-size-body)/1 'Inter', sans-serif;
  cursor: pointer;
  border: 1px solid;
  transition: background-color var(--duration-fast) var(--ease-standard),
              border-color var(--duration-fast) var(--ease-standard),
              color var(--duration-fast) var(--ease-standard);
}
.ab-btn:focus-visible { outline: 3px solid var(--color-focus-ring); outline-offset: 2px; }
.ab-btn--ghost { background: transparent; border-color: var(--border-default); color: var(--text-primary); }
.ab-btn--ghost:hover { background: var(--surface-2); border-color: var(--border-strong); }
.ab-btn--orange { background: var(--orange-500); color: #fff; border-color: var(--orange-500); }
.ab-btn--orange:hover { filter: brightness(1.06); }
.ab-btn--sm { height: 32px; padding: 0 var(--spacing-3); font-size: var(--text-size-caption); }

/* Complete-toggle + next-module CTA row */
.ab-complete {
  display: flex; align-items: center; justify-content: space-between;
  gap: var(--spacing-4); flex-wrap: wrap;
  padding: var(--spacing-3) var(--spacing-4);
  background: var(--surface-2);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
}
.ab-complete-toggle { display: flex; align-items: center; gap: var(--spacing-3); }
.ab-complete-label { font: 600 var(--text-size-label)/1 'Inter', sans-serif; color: var(--text-primary); }
.ab-next-cta {
  display: inline-flex; flex-direction: column; align-items: flex-end;
  gap: var(--spacing-1);
}
.ab-next-cta-meta {
  font: 600 var(--text-size-meta)/1 'Inter', sans-serif;
  letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--text-tertiary);
}

/* Footer */
.ab-footer {
  border-top: 1px solid var(--border-default);
  padding: var(--spacing-6) var(--spacing-5);
  text-align: center;
}
.ab-footer-line {
  font-family: 'Lora', serif; font-style: italic;
  font-size: var(--text-size-h3);
  color: var(--text-secondary);
  margin: 0 0 var(--spacing-3);
}
.ab-footer-meta { color: var(--text-tertiary); font: 400 var(--text-size-caption)/1.4 'Inter', sans-serif; }

/* Motion guardrail */
@media (prefers-reduced-motion: reduce) {
  .ab-page *, .ab-page *::before, .ab-page *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
`

/* ── Content data ──────────────────────────────────────────── */

const MODULES = [
  {
    id: 'm1',
    num: '01',
    icon: SparkleIcon,
    title: 'The prompt-to-app revolution',
    sub: 'Understand how AI-generated software works and the human’s role as product manager.',
    sections: [
      {
        title: '1.1 Websites vs. apps',
        lead: 'Websites display. Apps respond.',
        body:
          'Static website = read-only, same content for everyone, no state, no logic, no per-user data — a landing page, marketing site, or blog. Functional app = interactive, accepts input, applies rules, returns a different output per user — a dashboard, calculator, internal tool, booking flow.',
      },
      {
        title: '1.2 How AI app builders work',
        lead: 'A builder is a translator: five stops, one direction.',
        body:
          'Your prompt moves left to right through five stops. A clear prompt yields a coherent surface, working logic, persistent data. When it breaks, misinterpretation almost always traces to vague language at one of the five stops.',
      },
      {
        title: '1.3 Choosing your builder',
        lead: 'Five ways to build; pick by what you’re shipping.',
        body:
          'v0 (UI-focused — React/Next components, high visual fidelity — landing pages, UI kits). Lovable (full-stack — native Supabase/auth/DB — internal tools, dashboards). Bolt.new (full-stack in the browser — quick prototypes). Replit Agent (closer to code, real dev environment — bespoke logic, scripts). Claude Code (code-first, full ownership — production). Problem first, tool later.',
      },
      {
        title: 'Builder spotlight — Lovable.dev',
        lead: 'Prompt on the left, preview on the right.',
        body:
          'Prompt bar on the left, live preview on the right, native Supabase wiring, one-click publish to a live URL.',
      },
    ],
    quiz: [
      { q: 'Which best describes a static website vs. a functional app?', opts: [
        'Sites are bigger; apps are smaller',
        'Sites display the same content to everyone; apps accept input and respond per user',
        'Sites use HTML; apps use JavaScript',
        'Apps always need machine learning'],
        correct: 1, explanation: '"Websites display. Apps respond." A website is read-only; an app takes input, applies rules, and returns a per-user output.' },
      { q: 'In the five-stop translator, which stop describes “what the app remembers and reads back”?', opts: [
        '01 Prompt',
        '02 Components',
        '03 Logic',
        '04 Data'],
        correct: 3, explanation: 'Stop 04 is Data — persistent records the app stores and reads back later.' },
      { q: 'You need an internal tool with login, a database, and a dashboard. Which builder maps most cleanly?', opts: [
        'v0 — UI-focused',
        'Lovable — full-stack with native Supabase',
        'Claude Code — code-first',
        'Bolt.new — fast prototypes only'],
        correct: 1, explanation: 'Lovable is full-stack with native Supabase/auth/DB — the best fit for internal tools and dashboards.' },
      { q: 'A builder produces a generic-looking app that misses your edge cases. The most likely cause?', opts: [
        'The model is too small',
        'Vague language at one of the five stops — the builder filled blanks',
        'The platform was offline',
        'You picked the wrong colors'],
        correct: 1, explanation: 'Misinterpretation almost always traces to vague language at one of the five stops — name them clearly and the builder stops guessing.' },
    ],
    links: [
      { topic: 'Lovable.dev — official product page', type: 'Reference', source: 'Official' },
      { topic: 'v0 by Vercel — official intro', type: 'Reference', source: 'Official' },
      { topic: 'Bolt.new — official overview', type: 'Reference', source: 'Official' },
      { topic: 'Replit Agent — official docs', type: 'Doc', source: 'Official' },
      { topic: 'Builder comparison walkthrough', type: 'Video', source: 'Community' },
    ],
  },
  {
    id: 'm2',
    num: '02',
    icon: CompassIcon,
    title: 'Designing the vision',
    sub: 'Translate ideas into structured specs an AI builder can interpret.',
    marquee: true,
    sections: [
      {
        title: '2.1 Visual prompting',
        lead: 'From “make it look nice” to a UI the builder can render.',
        body:
          'Vague — "build me a dashboard, make it modern and clean" — and the builder fills the blanks with a generic template, not your tool. Structured = specify layout + components + interactions. Two-column: 240px sidebar + main; top nav: logo, search, profile; sidebar: Projects / Clients / Reports; main: KPI row of 4 cards + table; interactions: click row → side drawer, filter pills above the table.',
      },
      {
        title: '2.2 The Product Prompt framework',
        lead: 'Five fields, in order.',
        body:
          '01 WHO (users, role, context) · 02 IN (what they enter, upload, select) · 03 OUT (what the app produces) · 04 RULES (how inputs become outputs) · 05 EDGE (empty? invalid? over the limit? offline?). Each field answers a question the builder would otherwise guess. Removing guesses removes regenerations. Clarity test: could a stranger read your prompt and build the same app you would?',
      },
      {
        title: '2.3 Prompting in Claude, building in Lovable',
        lead: 'The two-stage workflow.',
        body:
          'Stage 1 · Think — draft and pressure-test the Product Prompt in a reasoning model. Ask "What’s ambiguous?", "What edge cases am I missing?", "What would a developer ask me?". Stage 2 · Build — paste the final spec into Lovable, v0, or Bolt. Sharper specs, fewer wasted generations, lower credit burn.',
      },
      {
        title: 'Worked example — trip expense splitter',
        lead: 'A five-field prompt that compiles into a real app.',
        body:
          'WHO = friends on a shared trip, anyone adds an expense, one person settles up. IN = expense entries (payer, amount, currency, what it was for, who it covers). OUT = live "who owes whom", per-person totals, end-of-trip settlement. RULES = split evenly across the covered subset, balances update on every entry, settlement minimizes transfers. EDGE = mixed currencies → convert to a base; someone leaves mid-trip → freeze their balance; duplicate → warn but allow; zero-amount → block.',
      },
    ],
    quiz: [
      { q: 'In the Product Prompt framework, which order is correct?', opts: [
        'WHO · IN · OUT · RULES · EDGE',
        'WHO · OUT · IN · RULES · EDGE',
        'IN · OUT · RULES · WHO · EDGE',
        'RULES · WHO · IN · OUT · EDGE'],
        correct: 0, explanation: 'WHO → IN → OUT → RULES → EDGE. Users first, then inputs, then outputs, then how inputs become outputs, then the boundary cases.' },
      { q: 'Why does structuring a prompt cut regenerations?', opts: [
        'The model runs faster',
        'It removes guesses — each field answers a question the builder would otherwise invent',
        'Builders charge less for structured prompts',
        'Structure prevents the builder from using your data'],
        correct: 1, explanation: 'Every field you fill is a guess the builder no longer has to make — fewer regenerations and lower credit burn.' },
      { q: 'The two-stage workflow is…', opts: [
        'Generate twice and compare',
        'Think (draft + pressure-test the spec in a reasoning model) → Build (paste into Lovable)',
        'Build first, then write the spec',
        'Use two different builders at once'],
        correct: 1, explanation: 'Stage 1 hardens the spec in a reasoning model; Stage 2 hands the final spec to the builder.' },
      { q: 'What does the “clarity test” ask of your prompt?', opts: [
        'Does it use shorter sentences?',
        'Could a stranger read it and build the same app you would?',
        'Does it fit in 280 characters?',
        'Are the keywords highlighted?'],
        correct: 1, explanation: 'If a stranger can read it and build what you’d build, the spec is clear enough to hand to a builder.' },
    ],
    links: [
      { topic: 'Lovable — prompting best practices', type: 'Doc', source: 'Official' },
      { topic: 'Anthropic — prompting deep dive', type: 'Video', source: 'Official' },
      { topic: 'Product Prompt worked examples', type: 'Article', source: 'Community' },
      { topic: 'v0 — design-system spec patterns', type: 'Doc', source: 'Official' },
      { topic: 'Edge-case checklist for AI builds', type: 'Article', source: 'Community' },
    ],
  },
  {
    id: 'm3',
    num: '03',
    icon: BrainIcon,
    title: 'Builder mental models',
    sub: 'Just enough technical intuition to describe apps clearly and troubleshoot.',
    sections: [
      {
        title: '3.1 Components, pages, layouts',
        lead: 'Three nouns.',
        body:
          'Page = a whole screen at one URL (/dashboard). Section / layout = a region within a page (sidebar, header, content column). Component = a reusable building block (button, card, form, table row). Name the right noun in your prompt and the builder targets the right thing.',
      },
      {
        title: '3.2 Data flow & logic',
        lead: 'Every app is the same three boxes.',
        body:
          'Input (form, upload, click, filter) → Logic (calculate, validate, branch, look up) → Output (a number, chart, confirmation, redirect). Calculations (tip = subtotal × rate). Conditions (if subscriber, hide the upgrade banner). Workflows (submit → save → email → success page).',
      },
      {
        title: '3.3 State, storage, styling',
        lead: 'Three lightweight models.',
        body:
          'State = right now — what the app holds in memory this session (open tab, form draft, open modal). Gone on refresh. Storage = for later — written to a database (accounts, records, history). Survives refresh. Styling = how it looks (color, spacing, type, density) — a separate layer. Most "the app forgot my data" bugs are state-vs-storage confusions; naming the right one in your prompt is half the fix.',
      },
    ],
    quiz: [
      { q: 'Which noun describes “a region within a page,” like a sidebar?', opts: [
        'Page',
        'Section / layout',
        'Component',
        'Database'],
        correct: 1, explanation: 'A section or layout is a region within a page. A component is a reusable building block; a page is the whole screen.' },
      { q: 'In the input → logic → output loop, “if subscriber, hide the upgrade banner” lives in which box?', opts: [
        'Input',
        'Logic',
        'Output',
        'Styling'],
        correct: 1, explanation: 'Conditions are logic — they branch behavior based on inputs.' },
      { q: 'A user complains the app “forgot” their data after refresh. Most likely cause?', opts: [
        'Bad styling',
        'A logic loop',
        'State vs. storage — the data lived in state, not storage',
        'Slow internet'],
        correct: 2, explanation: 'State is in-session only and dies on refresh. Persistent data needs storage — name it explicitly in your prompt.' },
      { q: 'Why does naming the right model matter when you prompt?', opts: [
        'It’s required by the API',
        'It tells the builder which surface to change and avoids wrong guesses',
        'It makes the prompt shorter',
        'It saves credits automatically'],
        correct: 1, explanation: 'Naming state, storage, or styling correctly targets the right layer of the app — the builder stops guessing which to change.' },
    ],
    links: [
      { topic: 'React — components & pages overview', type: 'Doc', source: 'Official' },
      { topic: 'Supabase — storage vs. session state', type: 'Doc', source: 'Official' },
      { topic: 'A short visual primer on data flow', type: 'Video', source: 'Community' },
      { topic: 'Tailwind — styling layer essentials', type: 'Doc', source: 'Official' },
    ],
  },
  {
    id: 'm4',
    num: '04',
    icon: WrenchIcon,
    title: 'Hands-on with Lovable',
    sub: 'Build a working app, then connect it to real services.',
    sections: [
      {
        title: '4.1 Your first full-stack build',
        lead: 'Prompt to multi-page app in one paste.',
        body:
          'Client Intake Tool — users = agency PMs onboarding clients; inputs = company, contact, budget tier, scope (multi-select); outputs = client record + dashboard summary card; logic = auto-assign tier by budget, required fields, slug from company name; edge = duplicate company → warn but allow, no scope → block submit; pages = /clients, /clients/new, /clients/[id].',
      },
      {
        title: '4.2 Making the app think',
        lead: 'Add the rules, then the rules about the rules.',
        body:
          'Calculations — "total = items × price × (1 + tax_rate); show a running total". Conditions — "if role is Admin show the Settings tab, else hide it". Storage — "save submitted forms to a requests table with timestamp + submitter id". Validation — "email must be valid; budget must be positive; block submit otherwise".',
      },
      {
        title: '4.3 Connecting to the real world',
        lead: 'Three integrations cover most “make this real” moments.',
        body:
          'Supabase — database + auth — persistent records, accounts, multi-user state; native to Lovable. Stripe — payments — checkout, subscriptions, one-time charges. Sheets — lightweight backend — when a spreadsheet is already the source of truth, or for ops / internal workflows.',
      },
      {
        title: 'Shared memory architecture (sidebar)',
        lead: 'One shared brain, many small focused apps.',
        body:
          'Three layers: people + Claude on top; focused apps (Lovable / Replit) in the middle; structured data + narrative docs underneath. Claude joins via MCP connectors. The apps stay small and opinionated; the brain stays shared.',
      },
    ],
    quiz: [
      { q: 'A full Product Prompt produces, on first build…', opts: [
        'Only a single page',
        'Pages, components, logic, storage hookup — a working multi-page app',
        'A spec document',
        'A repository of TODO comments'],
        correct: 1, explanation: 'One well-formed Product Prompt builds pages, components, logic, and storage hookup in a single paste.' },
      { q: '"If role is Admin, show the Settings tab" — what kind of rule?', opts: [
        'Calculation',
        'Validation',
        'Condition',
        'Storage'],
        correct: 2, explanation: 'Conditions branch behavior. Calculations produce a value; validations block bad input; storage persists records.' },
      { q: 'You need accounts, login, and persistent user data. Which integration?', opts: [
        'Stripe',
        'Sheets',
        'Supabase',
        'None — keep it in state'],
        correct: 2, explanation: 'Supabase covers auth + database — accounts and persistent user data are its job.' },
      { q: '“Making the app think” means…', opts: [
        'Plugging in a larger model',
        'Adding calculations, conditions, validations, and storage so the app responds to input correctly',
        'Adding more pages',
        'Removing the design system'],
        correct: 1, explanation: '"Thinking" is the rules and the rules about the rules — calculations, conditions, validation, and storage working together.' },
    ],
    links: [
      { topic: 'Lovable + Supabase — connect guide', type: 'Doc', source: 'Official' },
      { topic: 'Stripe + Lovable — payments quickstart', type: 'Doc', source: 'Official' },
      { topic: 'Sheets-as-backend pattern', type: 'Article', source: 'Community' },
      { topic: 'Full app build — recorded walkthrough', type: 'Video', source: 'Community' },
      { topic: 'MCP connectors — overview', type: 'Doc', source: 'Official' },
    ],
  },
  {
    id: 'm5',
    num: '05',
    icon: ArrowsClockwiseIcon,
    title: 'Iterating & fixing errors',
    sub: 'Diagnose and fix with structured iteration.',
    sections: [
      {
        title: '5.1 The refinement loop',
        lead: 'Don’t re-prompt the whole app; aim the patch.',
        body:
          'A focused patch names the page, the component, the change, and the invariants to keep. "On the /clients/new page only, change the Scope field from a single-select dropdown to multi-select checkboxes; keep the validation rule (≥1 required)." Far cheaper and more reliable than "regenerate the form."',
      },
      {
        title: '5.2 Common failure modes',
        lead: 'Most “the AI is broken” moments are spec moments.',
        body:
          'Six recurring symptoms map to six fixes — see the matcher below. The pattern is constant: name what’s broken, name what stays, and patch the one thing.',
      },
    ],
    quiz: [
      { q: 'A targeted patch names…', opts: [
        'The model and the temperature',
        'The page, the component, the change, and the invariants to keep',
        'The colors and the spacing',
        'The integration and the deployment URL'],
        correct: 1, explanation: 'A patch is page + component + change + invariants. Naming what stays is what keeps the patch from rewriting everything.' },
      { q: 'Two of your rules conflict and the app “decides” for itself. The fix?', opts: [
        'Add more rules',
        'State precedence — "X always wins over Y"',
        'Switch builders',
        'Lower the temperature'],
        correct: 1, explanation: 'When rules conflict, the builder picks one and ignores the other. Declare which one wins.' },
      { q: 'A “phantom integration” is…', opts: [
        'A page that loads slowly',
        'A claim like "connected to Stripe" with no working checkout',
        'A duplicate user',
        'An offline mode bug'],
        correct: 1, explanation: 'Phantom integrations look connected but don’t fire a real transaction. Ask for a working test transaction.' },
      { q: 'Why does a patch beat a full regenerate?', opts: [
        'It’s slower but cheaper',
        'It targets one thing, freezes the rest, and doesn’t reintroduce earlier bugs',
        'Patches don’t use credits',
        'Regenerates are unsafe in production'],
        correct: 1, explanation: 'Regenerates churn the whole app and bring old bugs back. Patches name one change and protect what works.' },
    ],
    links: [
      { topic: 'Lovable — debugging & iteration', type: 'Doc', source: 'Official' },
      { topic: 'Prompt patching patterns', type: 'Article', source: 'Community' },
      { topic: 'Avoiding logic loops in regenerations', type: 'Video', source: 'Community' },
      { topic: 'Diagnosing phantom integrations', type: 'Article', source: 'Community' },
    ],
  },
  {
    id: 'm6',
    num: '06',
    icon: CloudArrowUpIcon,
    title: 'Deployment & sharing',
    sub: 'Deploy, share, and understand what it costs.',
    sections: [
      {
        title: '6.1 Going live',
        lead: 'Shipping is one click; living with it is the other 99%.',
        body:
          'Draft URL → app URL → custom domain (intake.acme.com). Deployment — one click → public URL. Versions — snapshot before risky edits; roll back when iteration goes sideways. Limits — performance under load, access control, data privacy — generated apps need real review before real users. Custom domain — often the moment the free tier ends.',
      },
      {
        title: 'Three quiet things that keep a live app alive',
        lead: 'Secrets · versioning · cost caps.',
        body:
          '01 Secrets & keys — keys never live in the prompt; use the platform’s Secrets/Env tab; rotate when a teammate leaves. Do: STRIPE_KEY = env.STRIPE_KEY. Don’t: hardcode sk_live_…. 02 Versioning — every regeneration is a save point; name versions ("Pre-payment-flow" beats "v17"). 03 Cost caps — set the ceiling before you need it; a runaway loop or a viral post can drain credits in an afternoon; set a hard cap + an email alert at 70%.',
      },
      {
        title: '6.2 Credits, limits, and the free-to-paid cliff',
        lead: 'Every regeneration is a coin.',
        body:
          'Tactics: draft prompts off-platform (refine in Claude first); patch, don’t regenerate; estimate before you start (pages × features × revisions); know your trigger — a custom domain is the most common moment to switch plans.',
      },
    ],
    quiz: [
      { q: 'Where should an API key live in a deployed Lovable app?', opts: [
        'In the prompt, so the AI can use it',
        'Hardcoded in a component',
        'In the platform’s Secrets / Env tab, referenced as a variable',
        'In a public comment for documentation'],
        correct: 2, explanation: 'Keys belong in Secrets / Env. Reference them as variables; rotate when access changes.' },
      { q: 'Which version name is more useful three weeks from now?', opts: [
        'v17',
        'final-v3',
        'Pre-payment-flow',
        'backup-2'],
        correct: 2, explanation: 'Name versions by the moment they capture — "Pre-payment-flow" tells you what’s inside three weeks later.' },
      { q: 'Which moment most commonly triggers the free-to-paid switch?', opts: [
        'Building the first page',
        'Adding the second user',
        'Setting up a custom domain',
        'Writing the first prompt'],
        correct: 2, explanation: 'Custom domains usually exceed the free tier — most teams upgrade at that moment.' },
      { q: 'Which is the cleanest credit-burn tactic?', opts: [
        'Regenerate the whole app whenever something’s off',
        'Patch the specific thing; freeze the rest by name',
        'Use higher temperatures',
        'Skip the prompt and edit code directly'],
        correct: 1, explanation: 'Patches change one named thing. Regenerates churn the app and burn credits without proportional improvement.' },
    ],
    links: [
      { topic: 'Lovable — deployment & custom domains', type: 'Doc', source: 'Official' },
      { topic: 'Secrets & env vars — platform guide', type: 'Doc', source: 'Official' },
      { topic: 'Versioning patterns for AI builders', type: 'Article', source: 'Community' },
      { topic: 'Cost-control checklist before launch', type: 'Article', source: 'Community' },
    ],
  },
  {
    id: 'm7',
    num: '07',
    icon: FlagIcon,
    title: 'Your first AI app roadmap',
    sub: 'Turn the course into a real plan and evaluate it.',
    sections: [
      {
        title: '7.1 Defining your custom tool',
        lead: 'The capstone PRD — write the document, not the app.',
        body:
          'Worksheet fields: Problem · User · Inputs · Outputs · Logic · Edge cases · Success metric. The biggest predictor of a usable AI-generated app isn’t the builder you picked — it’s whether your spec answered questions before the model had to invent them. A clear problem and user beat a clever feature list; inputs and outputs you can name are ones the builder can ship; a success metric tells you when to stop iterating.',
      },
      {
        title: '7.2 Evaluating & planning the next iteration',
        lead: 'Three questions you owe the next version.',
        body:
          'Did it solve the problem? Test against the original user and moment. Where did the spec drift? Mark the vague fields and skipped edge cases on the PRD. What’s the smallest next ship? One improvement that moves the success metric most. The loop: Spec → Build → Use → Evaluate → Re-spec. That’s the entire job.',
      },
    ],
    quiz: [
      { q: 'What does the capstone PRD capture?', opts: [
        'Wireframes for every screen',
        'Problem, user, inputs, outputs, logic, edge cases, and a success metric',
        'A list of integrations',
        'A pricing table'],
        correct: 1, explanation: 'The PRD names the problem, the user, the inputs / outputs / logic / edges, and the success metric. The builder fills the rest.' },
      { q: 'Why does the spec matter more than the builder you pick?', opts: [
        'Builders are all the same',
        'A clearer spec means fewer guesses for the model and a more usable app, regardless of builder',
        'Specs are graded',
        'Specs reduce the model size'],
        correct: 1, explanation: 'Whatever builder you use, fewer guesses = fewer regenerations and a more usable result. The spec is the lever.' },
      { q: 'Which is one of the three evaluation questions?', opts: [
        'How fast did it build?',
        'Did it solve the original problem?',
        'Did it use the prettiest fonts?',
        'How many credits did it cost?'],
        correct: 1, explanation: 'The three questions are: did it solve the problem, where did the spec drift, and what’s the smallest next ship.' },
      { q: 'Reading the builder map — when is Claude Code the right choice?', opts: [
        'For a one-day prototype',
        'For polished UI components only',
        'When you want full ownership and production-grade work',
        'When you need a no-code visual editor'],
        correct: 2, explanation: 'Claude Code is code-first with full ownership — suited to production work where you want the whole codebase.' },
    ],
    links: [
      { topic: 'PRD template — AI-app capstone', type: 'Doc', source: 'Official' },
      { topic: 'Evaluating AI-built apps', type: 'Article', source: 'Community' },
      { topic: 'Builder comparison — full deep-dive', type: 'Article', source: 'Community' },
    ],
  },
]

const FIVE_STOPS = [
  { num: '01', name: 'Prompt' },
  { num: '02', name: 'Components' },
  { num: '03', name: 'Logic' },
  { num: '04', name: 'Data' },
  { num: '05', name: 'Interface' },
]

const SHIPPING_TARGETS = [
  { id: 'ui',     label: 'Polished UI / landing page',  builder: 'v0',           rationale: 'UI-focused — React/Next components and high visual fidelity.' },
  { id: 'full',   label: 'Full-stack internal tool',    builder: 'Lovable',      rationale: 'Native Supabase, auth, and database — best for dashboards and internal tools.' },
  { id: 'proto',  label: 'Quick full-stack prototype',  builder: 'Bolt.new',     rationale: 'Full-stack in the browser — fast to spin up, easy to share.' },
  { id: 'logic',  label: 'Bespoke logic or a script',   builder: 'Replit Agent', rationale: 'Closer to code, real dev environment — fits custom logic and services.' },
  { id: 'prod',   label: 'Production-grade work',       builder: 'Claude Code',  rationale: 'Code-first, full ownership — the route to production.' },
]

const INTEGRATIONS = [
  { id: 'supabase', label: 'Accounts, login, persistent data', name: 'Supabase', rationale: 'Database + auth — accounts, records, multi-user state. Native to Lovable.' },
  { id: 'stripe',   label: 'Payments — checkout or subscriptions', name: 'Stripe',  rationale: 'Checkout, subscriptions, one-time charges — the standard for payments.' },
  { id: 'sheets',   label: 'A spreadsheet as the source of truth', name: 'Sheets',  rationale: 'Lightweight backend — when ops already lives in a sheet.' },
]

const FAILURE_PAIRS = [
  { symptom: 'Vague prompt',         fix: 'Add users, inputs, outputs, and edge cases.' },
  { symptom: 'Conflicting instructions', fix: 'State precedence — "X always wins over Y".' },
  { symptom: 'Incomplete features',  fix: 'Name the data flow end-to-end.' },
  { symptom: 'Logic loops',          fix: 'Patch one thing; freeze the rest by name.' },
  { symptom: 'Hallucinated UI',      fix: 'List the exact pages and fields.' },
  { symptom: 'Phantom integration',  fix: 'Ask for a working test transaction.' },
]

const BUILDER_ROWS = [
  { builder: 'v0',           ui: 3, fullStack: 1, integrations: 'Bring your own',   code: 'Export',          best: 'Polished UI components' },
  { builder: 'Lovable',      ui: 3, fullStack: 3, integrations: 'Supabase native',  code: 'Editable',        best: 'Internal tools & dashboards' },
  { builder: 'Bolt.new',     ui: 2, fullStack: 3, integrations: 'Configurable',     code: 'In-browser IDE',  best: 'Fast full-stack prototypes' },
  { builder: 'Replit Agent', ui: 2, fullStack: 3, integrations: 'Wide',             code: 'Full repo',       best: 'Custom logic, scripts, services' },
  { builder: 'Claude Code',  ui: 3, fullStack: 3, integrations: 'Anything',         code: 'Full ownership',  best: 'Production-grade work' },
]
const SCALE_LABEL = { 1: 'Limited', 2: 'Medium', 3: 'High' }

/* ── Helpers ───────────────────────────────────────────────── */

function resolveInitialTheme() {
  if (typeof window === 'undefined') return 'light'
  try {
    const stored = localStorage.getItem(THEME_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch { /* ignore */ }
  return 'light'
}

function loadProgress() {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(PROGRESS_KEY)
    const arr = raw ? JSON.parse(raw) : []
    return Array.isArray(arr) ? arr : []
  } catch { return [] }
}
function saveProgress(ids) {
  try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(ids)) } catch { /* ignore */ }
}

/* ── Components ────────────────────────────────────────────── */

function TypeBadge({ type }) {
  const Icon = type === 'Video' ? PlayCircleIcon
    : type === 'Article' ? ArticleIcon
    : BookOpenIcon
  return (
    <span className="ab-link-badge">
      <Icon size={14} weight="duotone" />
      {type}
    </span>
  )
}

function SourceBadge({ source }) {
  if (source === 'Official') {
    return (
      <span className="ab-link-badge ab-link-badge--official">
        <SealCheckIcon size={14} weight="duotone" />
        Official
      </span>
    )
  }
  return (
    <span className="ab-link-badge ab-link-badge--community">
      <LinkSimpleIcon size={14} weight="duotone" />
      Community
    </span>
  )
}

function LinkPlaceholder({ topic, type, source }) {
  return (
    <div className="ab-link-card" aria-disabled="true">
      <div className="ab-link-card-head">
        <span className="ab-link-verify">
          <LinkBreakIcon size={12} weight="bold" />
          To verify
        </span>
      </div>
      <h4 className="ab-link-topic">{topic}</h4>
      <div className="ab-link-badges">
        <TypeBadge type={type} />
        <SourceBadge source={source} />
      </div>
      <p className="ab-link-note">URL and metadata pending verification — placeholder slot for the curated-link pass.</p>
    </div>
  )
}

function Quiz({ quiz, onAllAnswered }) {
  const [qIdx, setQIdx] = useState(0)
  const [chosen, setChosen] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    setQIdx(0); setChosen(null); setScore(0); setDone(false)
  }, [quiz])

  const current = quiz[qIdx]

  function pick(idx) {
    if (chosen !== null) return
    setChosen(idx)
    if (idx === current.correct) setScore(s => s + 1)
  }
  function next() {
    if (qIdx + 1 >= quiz.length) {
      setDone(true)
      if (onAllAnswered) onAllAnswered()
      return
    }
    setQIdx(i => i + 1); setChosen(null)
  }
  function retake() {
    setQIdx(0); setChosen(null); setScore(0); setDone(false)
  }

  return (
    <div className="ab-quiz">
      {!done && (
        <>
          <div className="ab-quiz-progress">
            <QuestionIcon size={14} weight="duotone" />
            Question {qIdx + 1} of {quiz.length} · score {score}
          </div>
          <h4 className="ab-quiz-q">{current.q}</h4>
          <div className="ab-quiz-opts">
            {current.opts.map((opt, idx) => {
              let cls = 'ab-quiz-opt'
              if (chosen !== null) {
                if (idx === current.correct) cls += ' correct'
                else if (idx === chosen) cls += ' wrong'
              }
              return (
                <button
                  key={idx}
                  type="button"
                  className={cls}
                  disabled={chosen !== null}
                  onClick={() => pick(idx)}
                >
                  {opt}
                </button>
              )
            })}
          </div>
          {chosen !== null && (
            <>
              <div className="ab-quiz-explanation">
                {chosen === current.correct
                  ? <CheckIcon size={18} weight="bold" style={{ color: 'var(--color-success)', flexShrink: 0, marginTop: '2px' }} />
                  : <XIcon size={18} weight="bold" style={{ color: 'var(--color-error)', flexShrink: 0, marginTop: '2px' }} />}
                <span>{current.explanation}</span>
              </div>
              <div className="ab-quiz-actions">
                <button type="button" className="ab-btn ab-btn--orange" onClick={next}>
                  {qIdx + 1 >= quiz.length ? 'See results' : 'Next question'}
                </button>
              </div>
            </>
          )}
        </>
      )}
      {done && (
        <>
          <div className="ab-quiz-score">{score} / {quiz.length}</div>
          <p className="ab-section-sub" style={{ textAlign: 'center' }}>
            {score === quiz.length
              ? 'Strong grasp. Ready for the next module.'
              : 'Worth a quick re-read of the failure-mode bullets above before moving on.'}
          </p>
          <div className="ab-quiz-actions" style={{ justifyContent: 'center' }}>
            <button type="button" className="ab-btn ab-btn--ghost" onClick={retake}>Retake quiz</button>
          </div>
        </>
      )}
    </div>
  )
}

/* Demos */

function Demo01() {
  const [target, setTarget] = useState(null)
  const [activeStop, setActiveStop] = useState(null)
  const rec = SHIPPING_TARGETS.find(t => t.id === target)
  return (
    <div className="ab-demo">
      <span className="ab-demo-label">Demo · five-stop translator + builder picker</span>
      <div className="ab-pipeline" role="group" aria-label="Five-stop translator">
        {FIVE_STOPS.map((s, idx) => (
          <span key={s.num} style={{ display: 'inline-flex', alignItems: 'center' }}>
            <button
              type="button"
              className={`ab-pipe-step${activeStop === s.num ? ' ab-pipe-step--active' : ''}`}
              onClick={() => setActiveStop(prev => prev === s.num ? null : s.num)}
              aria-pressed={activeStop === s.num}
            >
              <span className="ab-pipe-num">{s.num}</span>
              <span className="ab-pipe-name">{s.name}</span>
            </button>
            {idx < FIVE_STOPS.length - 1 && (
              <span className="ab-pipe-arrow" aria-hidden="true">
                <ArrowRightIcon size={16} weight="bold" />
              </span>
            )}
          </span>
        ))}
      </div>
      <div className="ab-field">
        <label className="ab-field-label" htmlFor="ab-d1-target">What are you shipping?</label>
        <span className="ab-field-helper">Pick the closest match. The recommendation updates instantly.</span>
        <div className="ab-chips" id="ab-d1-target" role="group" aria-label="Shipping target">
          {SHIPPING_TARGETS.map(t => (
            <button
              key={t.id}
              type="button"
              className="ab-chip"
              aria-pressed={target === t.id}
              onClick={() => setTarget(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      {rec && (
        <div className="ab-rec">
          <span className="ab-rec-icon"><SparkleIcon size={18} weight="duotone" /></span>
          <div>
            <p className="ab-rec-name">{rec.builder}</p>
            <p className="ab-rec-body">{rec.rationale}</p>
          </div>
        </div>
      )}
    </div>
  )
}

const TRIP_SPLITTER_EXAMPLE = {
  who: 'Friends on a shared trip. Anyone adds an expense; one person settles up.',
  in:  'Expense entries: payer, amount, currency, what it was for, who it covers.',
  out: 'Live "who owes whom", per-person totals, end-of-trip settlement.',
  rules: 'Split evenly across the covered subset. Balances update on every entry. Settlement minimizes transfers.',
  edge: 'Mixed currencies → convert to a base. Someone leaves mid-trip → freeze their balance. Duplicate → warn but allow. Zero-amount → block.',
}
function Demo02() {
  const [fields, setFields] = useState({ who: '', in: '', out: '', rules: '', edge: '' })
  function set(key, val) { setFields(f => ({ ...f, [key]: val })) }
  function loadExample() { setFields(TRIP_SPLITTER_EXAMPLE) }
  function clearAll() { setFields({ who: '', in: '', out: '', rules: '', edge: '' }) }
  const emptyCount = Object.values(fields).filter(v => v.trim() === '').length
  const compiled = useMemo(() => {
    const lines = []
    lines.push('Product Prompt')
    lines.push('---')
    lines.push(`01 WHO   — ${fields.who.trim() || '(not yet specified)'}`)
    lines.push(`02 IN    — ${fields.in.trim()  || '(not yet specified)'}`)
    lines.push(`03 OUT   — ${fields.out.trim() || '(not yet specified)'}`)
    lines.push(`04 RULES — ${fields.rules.trim() || '(not yet specified)'}`)
    lines.push(`05 EDGE  — ${fields.edge.trim() || '(not yet specified)'}`)
    return lines.join('\n')
  }, [fields])
  return (
    <div className="ab-demo">
      <span className="ab-demo-label">Demo · Product Prompt builder</span>
      <div className="ab-grid-2">
        <Field label="01 WHO — users, role, context" value={fields.who}    onChange={v => set('who', v)}    helper="Who uses this, in what role, in what moment?" />
        <Field label="02 IN — what they enter, upload, select" value={fields.in}     onChange={v => set('in', v)}     helper="Inputs the app should expect." />
        <Field label="03 OUT — what the app produces and shows back" value={fields.out}    onChange={v => set('out', v)}    helper="Outputs, screens, and feedback the user gets." />
        <Field label="04 RULES — how inputs become outputs" value={fields.rules}  onChange={v => set('rules', v)}  helper="Calculations, conditions, workflows." />
        <Field label="05 EDGE — empty? invalid? over the limit? offline?" value={fields.edge}   onChange={v => set('edge', v)}   helper="The boundary cases that catch a real user." />
      </div>
      <div className="ab-quiz-actions">
        <button type="button" className="ab-btn ab-btn--ghost ab-btn--sm" onClick={loadExample}>Load the trip-splitter example</button>
        <button type="button" className="ab-btn ab-btn--ghost ab-btn--sm" onClick={clearAll}>Clear</button>
      </div>
      <div className="ab-field">
        <span className="ab-field-label">Compiled spec</span>
        <span className="ab-field-helper">Copy this into Claude to pressure-test, then into Lovable to build.</span>
        <pre className="ab-spec">{compiled}</pre>
      </div>
      <div className={`ab-clarity ${emptyCount === 0 ? 'ab-clarity--ok' : 'ab-clarity--warn'}`}>
        {emptyCount === 0
          ? <><CheckIcon size={16} weight="bold" /><span>Clarity check passed — all five fields are filled.</span></>
          : <><LinkBreakIcon size={16} weight="bold" /><span>Clarity check: {emptyCount} field{emptyCount === 1 ? '' : 's'} still empty. Could a stranger build the same app from this?</span></>}
      </div>
    </div>
  )
}
function Field({ label, value, onChange, helper }) {
  return (
    <div className="ab-field">
      <span className="ab-field-label">{label}</span>
      {helper && <span className="ab-field-helper">{helper}</span>}
      <textarea
        className="ab-textarea"
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={3}
      />
    </div>
  )
}

function Demo03() {
  const [stateNote, setStateNote] = useState('')
  const [storageNote, setStorageNote] = useState('')
  const [savedNote, setSavedNote] = useState('')
  const [refreshCount, setRefreshCount] = useState(0)
  function saveToStorage() {
    setSavedNote(stateNote)
    setStorageNote(stateNote)
  }
  function fakeRefresh() {
    setStateNote('')
    setRefreshCount(c => c + 1)
  }
  return (
    <div className="ab-demo">
      <span className="ab-demo-label">Demo · state vs. storage</span>
      <p className="ab-body" style={{ color: 'var(--text-secondary)' }}>
        Type a note. <strong>Save</strong> writes it to storage. <strong>Refresh</strong> wipes state but keeps storage — the #1 bug, live.
      </p>
      <div className="ab-statebox">
        <div className="ab-statecard">
          <span className="ab-statecard-tag">State · this session</span>
          <h4>Open note</h4>
          <textarea
            className="ab-textarea"
            value={stateNote}
            onChange={e => setStateNote(e.target.value)}
            placeholder="Type a draft note…"
            rows={4}
          />
          <ul>
            <li>Cleared by Refresh</li>
            <li>Lives in memory only</li>
          </ul>
        </div>
        <div className="ab-statecard">
          <span className="ab-statecard-tag">Storage · for later</span>
          <h4>Saved note</h4>
          <p className="ab-body" style={{ color: 'var(--text-primary)', minHeight: '60px' }}>
            {savedNote || <span style={{ color: 'var(--text-tertiary)' }}>Nothing saved yet.</span>}
          </p>
          <ul>
            <li>Survives Refresh</li>
            <li>Persists across sessions in a real app</li>
          </ul>
        </div>
      </div>
      <div className="ab-quiz-actions">
        <button type="button" className="ab-btn ab-btn--orange" onClick={saveToStorage} disabled={!stateNote.trim()}>Save to storage</button>
        <button type="button" className="ab-btn ab-btn--ghost" onClick={fakeRefresh}>Refresh (clears state)</button>
      </div>
      <span className="ab-caption">Refreshes simulated: {refreshCount}{storageNote ? ' · storage still holds the note' : ''}</span>
    </div>
  )
}

function Demo04() {
  const [choice, setChoice] = useState(null)
  const rec = INTEGRATIONS.find(i => i.id === choice)
  return (
    <div className="ab-demo">
      <span className="ab-demo-label">Demo · integration picker</span>
      <div className="ab-field">
        <span className="ab-field-label">What does the app need next?</span>
        <span className="ab-field-helper">Three integrations cover most "make this real" moments.</span>
        <div className="ab-chips">
          {INTEGRATIONS.map(i => (
            <button
              key={i.id}
              type="button"
              className="ab-chip"
              aria-pressed={choice === i.id}
              onClick={() => setChoice(i.id)}
            >
              {i.label}
            </button>
          ))}
        </div>
      </div>
      {rec && (
        <div className="ab-rec">
          <span className="ab-rec-icon"><WrenchIcon size={18} weight="duotone" /></span>
          <div>
            <p className="ab-rec-name">{rec.name}</p>
            <p className="ab-rec-body">{rec.rationale}</p>
          </div>
        </div>
      )}
    </div>
  )
}

function Demo05() {
  const [picked, setPicked] = useState(null) // index of chosen symptom
  const [matchIdx, setMatchIdx] = useState(null) // index of chosen fix
  const [revealed, setRevealed] = useState(false)
  const shuffledFixes = useMemo(() => {
    // deterministic reordering — just rotate by 3 so it's not the same as the left column
    return FAILURE_PAIRS.map((p, i) => ({ ...p, originalIdx: i }))
      .slice(3).concat(FAILURE_PAIRS.slice(0, 3).map((p, i) => ({ ...p, originalIdx: i })))
  }, [])
  function tryMatch(symptomIdx, fixOriginalIdx) {
    if (revealed) return
    setPicked(symptomIdx)
    setMatchIdx(fixOriginalIdx)
    setRevealed(true)
  }
  function reset() { setPicked(null); setMatchIdx(null); setRevealed(false) }
  const correct = revealed && picked === matchIdx
  return (
    <div className="ab-demo">
      <span className="ab-demo-label">Demo · failure-mode → fix matcher</span>
      <p className="ab-body" style={{ color: 'var(--text-secondary)' }}>
        Pick a symptom on the left, then its fix on the right. Most "the AI is broken" moments are spec moments.
      </p>
      <div className="ab-match">
        <div className="ab-match-col">
          <h4>Symptom</h4>
          <div className="ab-match-list">
            {FAILURE_PAIRS.map((p, i) => (
              <button
                key={i}
                type="button"
                className={`ab-match-item${picked === i ? ' ' + (revealed ? (correct ? 'correct' : 'wrong') : '') : ''}`}
                aria-pressed={picked === i}
                disabled={revealed && picked !== i}
                onClick={() => setPicked(i)}
              >
                {p.symptom}
              </button>
            ))}
          </div>
        </div>
        <div className="ab-match-col">
          <h4>Fix</h4>
          <div className="ab-match-list">
            {shuffledFixes.map((p, displayIdx) => (
              <button
                key={displayIdx}
                type="button"
                className={`ab-match-item${matchIdx === p.originalIdx ? ' ' + (revealed ? (correct ? 'correct' : 'wrong') : '') : ''}`}
                aria-pressed={matchIdx === p.originalIdx}
                disabled={picked === null || (revealed && matchIdx !== p.originalIdx)}
                onClick={() => picked !== null && tryMatch(picked, p.originalIdx)}
              >
                {p.fix}
              </button>
            ))}
          </div>
        </div>
      </div>
      {revealed && (
        <>
          <div className="ab-match-explanation">
            {correct
              ? <>Right pair. The symptom usually shows up exactly like that — and the fix names the page, the component, the change, or the precedence that resolves it.</>
              : <>Not the right fix. The correct match is: <strong>{FAILURE_PAIRS[picked].symptom}</strong> → <em>{FAILURE_PAIRS[picked].fix}</em></>}
          </div>
          <div className="ab-quiz-actions">
            <button type="button" className="ab-btn ab-btn--ghost" onClick={reset}>Try another</button>
          </div>
        </>
      )}
    </div>
  )
}

function Demo06() {
  const [pages, setPages] = useState(4)
  const [features, setFeatures] = useState(3)
  const [revisions, setRevisions] = useState(2)
  const generations = Math.max(1, pages * features * revisions)
  return (
    <div className="ab-demo">
      <span className="ab-demo-label">Demo · credit-burn estimator</span>
      <div className="ab-estimator">
        <div className="ab-grid-3">
          <NumberField label="Pages" value={pages} setValue={setPages} min={1} max={30} />
          <NumberField label="Features per page" value={features} setValue={setFeatures} min={1} max={20} />
          <NumberField label="Revisions per feature" value={revisions} setValue={setRevisions} min={1} max={10} />
        </div>
        <div className="ab-estimator-result">
          <span className="ab-estimator-num">{generations}</span>
          <div>
            <div className="ab-label">rough generation count</div>
            <div className="ab-caption">A generation is anything that re-runs the builder — first build, patch, or regenerate.</div>
            <div className="ab-estimator-cap">
              Tactic: refine the spec in Claude first, then patch instead of regenerate. Set a hard cap and an alert at 70 percent before you start.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
function NumberField({ label, value, setValue, min, max }) {
  return (
    <div className="ab-field">
      <span className="ab-field-label">{label}</span>
      <input
        className="ab-input ab-mono"
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={e => {
          const next = Number(e.target.value) || min
          setValue(Math.min(max, Math.max(min, next)))
        }}
      />
    </div>
  )
}

function Demo07() {
  const [prd, setPrd] = useState({
    problem: '', user: '', inputs: '', outputs: '', logic: '', edge: '', metric: '',
  })
  const [sortBy, setSortBy] = useState(null)
  const [sortDir, setSortDir] = useState('asc')
  function set(key, v) { setPrd(p => ({ ...p, [key]: v })) }
  const rows = useMemo(() => {
    if (!sortBy) return BUILDER_ROWS
    const sorted = [...BUILDER_ROWS].sort((a, b) => {
      const av = a[sortBy]
      const bv = b[sortBy]
      if (typeof av === 'number') return sortDir === 'asc' ? av - bv : bv - av
      return sortDir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av))
    })
    return sorted
  }, [sortBy, sortDir])
  function toggleSort(key) {
    if (sortBy === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortBy(key); setSortDir('asc') }
  }
  const compiled = useMemo(() => {
    return [
      'PRD — first AI app',
      '---',
      `Problem        — ${prd.problem.trim() || '(name the problem)'}`,
      `User           — ${prd.user.trim()    || '(name the user and the moment)'}`,
      `Inputs         — ${prd.inputs.trim()  || '(what they enter / upload / select)'}`,
      `Outputs        — ${prd.outputs.trim() || '(what the app produces and shows back)'}`,
      `Logic          — ${prd.logic.trim()   || '(rules that turn inputs into outputs)'}`,
      `Edge cases     — ${prd.edge.trim()    || '(empty / invalid / over-limit / offline)'}`,
      `Success metric — ${prd.metric.trim()  || '(how you know it works — one number)'}`,
    ].join('\n')
  }, [prd])
  return (
    <div className="ab-demo" style={{ gap: 'var(--spacing-5)' }}>
      <span className="ab-demo-label">Demo · capstone PRD + builder map</span>
      <div className="ab-grid-2">
        <Field label="Problem"        value={prd.problem} onChange={v => set('problem', v)} helper="What hurts today? Be specific about the moment." />
        <Field label="User"           value={prd.user}    onChange={v => set('user', v)}    helper="Who is the user, in what role, when?" />
        <Field label="Inputs"         value={prd.inputs}  onChange={v => set('inputs', v)}  helper="What they enter, upload, or select." />
        <Field label="Outputs"        value={prd.outputs} onChange={v => set('outputs', v)} helper="What the app produces and shows back." />
        <Field label="Logic"          value={prd.logic}   onChange={v => set('logic', v)}   helper="How inputs become outputs." />
        <Field label="Edge cases"     value={prd.edge}    onChange={v => set('edge', v)}    helper="Empty, invalid, over-limit, offline." />
        <Field label="Success metric" value={prd.metric}  onChange={v => set('metric', v)}  helper="One number that tells you when to stop iterating." />
      </div>
      <div className="ab-field">
        <span className="ab-field-label">Compiled PRD</span>
        <pre className="ab-spec">{compiled}</pre>
      </div>
      <div className="ab-field">
        <span className="ab-field-label">Builder map</span>
        <span className="ab-field-helper">Tap a column header to sort. Pick by what you’re shipping.</span>
        <div className="ab-table-wrap">
          <table className="ab-table">
            <thead>
              <tr>
                <th className={sortBy === 'builder' ? 'sorted' : ''} onClick={() => toggleSort('builder')}>Builder</th>
                <th className={sortBy === 'ui' ? 'sorted' : ''} onClick={() => toggleSort('ui')}>UI fidelity</th>
                <th className={sortBy === 'fullStack' ? 'sorted' : ''} onClick={() => toggleSort('fullStack')}>Full-stack</th>
                <th className={sortBy === 'integrations' ? 'sorted' : ''} onClick={() => toggleSort('integrations')}>Integrations</th>
                <th className={sortBy === 'code' ? 'sorted' : ''} onClick={() => toggleSort('code')}>Code access</th>
                <th className={sortBy === 'best' ? 'sorted' : ''} onClick={() => toggleSort('best')}>Best for</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.builder}>
                  <td>{r.builder}</td>
                  <td>{SCALE_LABEL[r.ui]}</td>
                  <td>{SCALE_LABEL[r.fullStack]}</td>
                  <td>{r.integrations}</td>
                  <td>{r.code}</td>
                  <td>{r.best}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const DEMO_BY_ID = {
  m1: Demo01,
  m2: Demo02,
  m3: Demo03,
  m4: Demo04,
  m5: Demo05,
  m6: Demo06,
  m7: Demo07,
}

function ModulePanel({ module: mod, onBack, completed, onToggleComplete, nextModule, onGoToModule }) {
  const DemoComponent = DEMO_BY_ID[mod.id]
  return (
    <div className="ab-panel">
      <button type="button" className="ab-back" onClick={onBack}>
        <ArrowRightIcon size={14} weight="bold" style={{ transform: 'rotate(180deg)' }} />
        All modules
      </button>

      <div className="ab-mod-head">
        <span className="ab-mod-num">{mod.num}</span>
        <div className="ab-mod-text">
          <h2 className="ab-h2 ab-mod-title">{mod.title}</h2>
          <p className="ab-body ab-mod-sub">{mod.sub}</p>
        </div>
      </div>

      {/* Teaching content */}
      <div className="ab-block">
        <h3 className="ab-block-title">What this module teaches</h3>
        <div className="ab-card-stack">
          {mod.sections.map((s, idx) => (
            <div key={idx} className="ab-card">
              <h4 className="ab-h3" style={{ marginBottom: 'var(--spacing-1)' }}>{s.title}</h4>
              <p className="ab-block-lead" style={{ margin: '0 0 var(--spacing-2)' }}>{s.lead}</p>
              <p className="ab-body" style={{ color: 'var(--text-secondary)', margin: 0 }}>{s.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Demo */}
      <div className="ab-block">
        <h3 className="ab-block-title">Try it</h3>
        {DemoComponent && <DemoComponent />}
      </div>

      {/* Curated links */}
      <div className="ab-block">
        <h3 className="ab-block-title">Curated resources</h3>
        <p className="ab-body" style={{ color: 'var(--text-secondary)', margin: 0 }}>
          Verified links land in the next pass. The slots below mark the topics they’ll hold — official-first, no fabricated URLs.
        </p>
        <div className="ab-links-grid">
          {mod.links.map((l, idx) => (
            <LinkPlaceholder key={idx} topic={l.topic} type={l.type} source={l.source} />
          ))}
        </div>
      </div>

      {/* Quiz */}
      <div className="ab-block">
        <h3 className="ab-block-title">Knowledge check</h3>
        <Quiz quiz={mod.quiz} />
      </div>

      {/* Complete toggle + next-module CTA */}
      <div className="ab-complete">
        <div className="ab-complete-toggle">
          <input
            id={`complete-${mod.id}`}
            type="checkbox"
            checked={completed}
            onChange={() => onToggleComplete(mod.id)}
            style={{ width: 18, height: 18, accentColor: 'var(--orange-500)' }}
          />
          <label htmlFor={`complete-${mod.id}`} className="ab-complete-label">
            {completed ? 'Module marked complete' : 'Mark module complete'}
          </label>
        </div>
        {nextModule ? (
          <div className="ab-next-cta">
            <span className="ab-next-cta-meta">Up next · Module {nextModule.num}</span>
            <button
              type="button"
              className="ab-btn ab-btn--orange"
              onClick={() => onGoToModule(nextModule.id)}
            >
              {nextModule.title} <ArrowRightIcon size={16} weight="bold" />
            </button>
          </div>
        ) : (
          <div className="ab-next-cta">
            <span className="ab-next-cta-meta">You finished the last module</span>
            <button type="button" className="ab-btn ab-btn--ghost" onClick={onBack}>
              Back to all modules <ArrowRightIcon size={16} weight="bold" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Top-level page ────────────────────────────────────────── */

export default function AppBuilding() {
  const [theme, setTheme] = useState(resolveInitialTheme)
  const [activeModuleId, setActiveModuleId] = useState(null)
  const [completed, setCompleted] = useState(() => loadProgress())

  useEffect(() => {
    document.title = 'AI app & web building — AI Visual Lab'
  }, [])

  useEffect(() => {
    try { localStorage.setItem(THEME_KEY, theme) } catch { /* ignore */ }
  }, [theme])

  function toggleComplete(id) {
    setCompleted(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
      saveProgress(next)
      return next
    })
  }

  const activeModule = MODULES.find(m => m.id === activeModuleId)

  return (
    <div className="ab-page" data-theme={theme}>
      <style>{css}</style>
      <NavBar />

      <section className="ab-hero">
        <div className="ab-hero-inner">
          <div className="ab-hero-topbar">
            <span className="ab-hero-eyebrow">Learn · App building</span>
            <button
              type="button"
              className="ab-theme-toggle"
              onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {theme === 'dark'
                ? <><SunIcon size={14} weight="duotone" /> Light</>
                : <><MoonIcon size={14} weight="duotone" /> Dark</>}
            </button>
          </div>
          <h1 className="ab-hero-title">AI app &amp; web building</h1>
          <p className="ab-hero-subtitle">
            From idea to live URL — learn to specify software, then build, connect, and ship it without writing the code yourself.
          </p>
          <div className="ab-stats">
            <span className="ab-stat"><TimerIcon size={16} weight="duotone" /><span className="ab-stat-num">4.5</span><span className="ab-stat-lbl">hrs</span></span>
            <span className="ab-stat"><BooksIcon size={16} weight="duotone" /><span className="ab-stat-num">7</span><span className="ab-stat-lbl">modules</span></span>
            <span className="ab-stat"><ListChecksIcon size={16} weight="duotone" /><span className="ab-stat-num">18</span><span className="ab-stat-lbl">lessons</span></span>
            <span className="ab-stat"><SparkleIcon size={16} weight="duotone" /><span className="ab-stat-lbl" style={{ color: 'rgba(247,244,241,0.85)' }}>no coding required</span></span>
          </div>
        </div>
      </section>

      <div className="ab-shell">
        {!activeModule && (
          <>
            <h2 className="ab-h2 ab-section-title">The seven modules</h2>
            <p className="ab-section-sub">Each module teaches the framework, runs an interactive demo, lists curated resources, and ends with a knowledge check. Progress is saved in your browser.</p>
            <div className="ab-stepper">
              {MODULES.map((m, idx) => {
                const isDone = completed.includes(m.id)
                const Icon = m.icon
                return (
                  <button
                    key={m.id}
                    type="button"
                    className={`ab-step${isDone ? ' ab-step--done' : ''}`}
                    onClick={() => setActiveModuleId(m.id)}
                  >
                    <span className="ab-step-node" aria-hidden="true">{isDone ? <CheckIcon size={20} weight="bold" /> : m.num}</span>
                    <span className="ab-step-body">
                      <span className="ab-step-head">
                        <Icon size={18} weight="duotone" />
                        <h3 className="ab-step-title">{m.title}</h3>
                        {idx === 0 && !isDone && <span className="ab-step-start">Start here</span>}
                        {isDone && <span className="ab-step-done-tag">Complete</span>}
                      </span>
                      <span className="ab-step-desc">{m.sub}</span>
                    </span>
                    <span className="ab-step-cta" aria-hidden="true">
                      <ArrowRightIcon size={16} weight="bold" />
                    </span>
                  </button>
                )
              })}
            </div>
          </>
        )}

        {activeModule && (
          <ModulePanel
            module={activeModule}
            onBack={() => setActiveModuleId(null)}
            completed={completed.includes(activeModule.id)}
            onToggleComplete={toggleComplete}
            nextModule={MODULES[MODULES.findIndex(m => m.id === activeModule.id) + 1] || null}
            onGoToModule={(id) => {
              setActiveModuleId(id)
              if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          />
        )}
      </div>

      <footer className="ab-footer">
        <p className="ab-footer-line">You don’t write the code — you write the spec the code is built from.</p>
        <p className="ab-footer-meta">Course content adapted from the Prism · AI App &amp; Web Building deck.</p>
      </footer>
    </div>
  )
}
