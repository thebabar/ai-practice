import { useState, useEffect, useCallback } from 'react'
import NavBar from '../components/NavBar.jsx'
import {
  PlantIcon, RocketLaunchIcon, CodeIcon, PaintBrushIcon,
  BookOpenIcon, PlayCircleIcon, SealCheckIcon, UsersThreeIcon,
  QuestionIcon, ArrowSquareOutIcon, CheckIcon, XIcon, ArticleIcon,
} from '@phosphor-icons/react'

// Resources is a guided curriculum → uses the structured-content signal (blue).
const ACCENT = 'var(--blue-500)'
const ACCENT_ICON = '#3B7DD8' // literal mirror of --signal-structured-500 for icon color props
const STORAGE_KEY = 'claude-resources-progress'

const css = `
.rs-root {
  min-height: 100vh;
  background: var(--surface-base);
  color: var(--text-primary);
  font-family: var(--font-body);
  overflow-x: hidden;
}

/* Obsidian + refracted-light hero */
.rs-hero {
  position: relative;
  text-align: center;
  padding: 64px 24px 44px;
  background: var(--text-primary);
  color: #fff;
  overflow: hidden;
}
.rs-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--gradient-refracted-b);
  opacity: 0.55;
  pointer-events: none;
}
[data-theme="dark"] .rs-hero { background: var(--surface-1); color: var(--text-primary); }
[data-theme="dark"] .rs-hero::before { opacity: 0.32; }
.rs-eyebrow { position: relative; font-size: 13px; letter-spacing: 0.18em; color: rgba(255,255,255,0.78); text-transform: uppercase; margin-bottom: 14px; font-weight: 600; }
[data-theme="dark"] .rs-eyebrow { color: var(--text-secondary); }
.rs-title { position: relative; font-family: var(--font-primary); font-size: clamp(28px, 5vw, 52px); font-weight: 800; letter-spacing: -0.02em; color: #fff; line-height: 1.05; margin-bottom: 12px; }
[data-theme="dark"] .rs-title { color: var(--text-primary); }
.rs-title span { color: ${ACCENT}; }
.rs-subtitle { position: relative; font-size: 16px; color: rgba(255,255,255,0.78); max-width: 560px; margin: 0 auto; line-height: 1.7; }
[data-theme="dark"] .rs-subtitle { color: var(--text-secondary); }

.rs-panel { max-width: 920px; margin: 0 auto; padding: 32px 20px 80px; }

.rs-section-title { font-family: var(--font-primary); font-size: 22px; font-weight: 700; color: var(--text-primary); margin-bottom: 8px; text-align: center; }
.rs-section-sub { font-size: 16px; color: var(--text-secondary); line-height: 1.7; margin-bottom: 28px; text-align: center; }

/* Level selector */
.rs-level-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
@media (max-width: 980px) { .rs-level-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 480px) { .rs-level-grid { grid-template-columns: 1fr; } }
.rs-level-card { background: var(--surface-1); border: 1px solid var(--border-default); border-radius: var(--radius-card); padding: 28px 22px; cursor: pointer; transition: all 0.2s; text-align: center; display: flex; flex-direction: column; align-items: center; }
.rs-level-card:hover { border-color: ${ACCENT}; background: var(--surface-2); transform: translateY(-3px); box-shadow: var(--shadow-elevated); }
.rs-level-icon { width: 60px; height: 60px; border-radius: var(--radius-card); display: flex; align-items: center; justify-content: center; background: var(--blue-50); border: 1px solid var(--blue-100); margin-bottom: 16px; }
.rs-level-name { font-family: var(--font-primary); font-size: 19px; font-weight: 700; color: var(--text-primary); margin-bottom: 8px; }
.rs-level-desc { font-size: 13px; color: var(--text-secondary); line-height: 1.6; margin-bottom: 14px; }
.rs-level-meta { font-size: 12px; color: ${ACCENT}; font-family: 'IBM Plex Mono', ui-monospace, monospace; letter-spacing: 0.06em; font-weight: 600; }

/* Track header */
.rs-change-btn { background: transparent; border: 1px solid var(--border-default); color: var(--text-secondary); font-family: 'IBM Plex Mono', ui-monospace, monospace; font-size: 13px; padding: 7px 14px; border-radius: var(--radius-sm); cursor: pointer; transition: all 0.18s; letter-spacing: 0.06em; margin-bottom: 22px; }
.rs-change-btn:hover { border-color: ${ACCENT}; color: ${ACCENT}; }
.rs-track-head { display: flex; align-items: center; gap: 14px; margin-bottom: 6px; }
.rs-track-icon { width: 46px; height: 46px; border-radius: var(--radius-card); display: flex; align-items: center; justify-content: center; background: var(--blue-50); border: 1px solid var(--blue-100); flex-shrink: 0; }
.rs-track-title { font-family: var(--font-primary); font-size: 24px; font-weight: 800; color: var(--text-primary); letter-spacing: -0.02em; }
.rs-track-sub { font-size: 14px; color: var(--text-secondary); line-height: 1.6; margin: 8px 0 22px; }
.rs-track-access { font-size: 14px; color: var(--text-secondary); line-height: 1.6; margin: -14px 0 22px; padding: 10px 14px; background: var(--blue-50); border: 1px solid var(--blue-100); border-radius: var(--radius-sm); }
.rs-track-access-link { color: ${ACCENT}; text-decoration: none; display: inline-flex; align-items: center; gap: 4px; font-family: 'IBM Plex Mono', ui-monospace, monospace; font-weight: 600; }
.rs-track-access-link:hover { text-decoration: underline; }

/* Progress */
.rs-progress-wrap { margin-bottom: 22px; }
.rs-progress-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.rs-progress-label { font-size: 13px; color: ${ACCENT}; font-family: 'IBM Plex Mono', ui-monospace, monospace; letter-spacing: 0.04em; font-weight: 600; }
.rs-progress-reset { background: none; border: none; color: var(--text-tertiary); font-family: 'IBM Plex Mono', ui-monospace, monospace; font-size: 12px; cursor: pointer; text-decoration: underline; text-underline-offset: 2px; padding: 0; transition: color 0.18s; }
.rs-progress-reset:hover { color: var(--text-primary); }
.rs-progress-bar-bg { height: 6px; background: var(--surface-2); border-radius: 3px; overflow: hidden; }
.rs-progress-bar { height: 100%; background: ${ACCENT}; border-radius: 3px; transition: width 0.45s cubic-bezier(.4,0,.2,1); }

/* Filter tabs (prism-tabs pattern) */
.rs-filters { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px; }
.rs-chip { background: transparent; border: 1px solid var(--border-default); color: var(--text-secondary); font-family: 'IBM Plex Mono', ui-monospace, monospace; font-size: 13px; padding: 6px 14px; border-radius: var(--radius-sm); cursor: pointer; transition: all 0.18s; }
.rs-chip:hover { border-color: ${ACCENT}; color: ${ACCENT}; }
.rs-chip.active { background: var(--blue-50); border-color: ${ACCENT}; color: ${ACCENT}; font-weight: 600; }

/* Stepper */
.rs-step { display: flex; align-items: stretch; gap: 16px; }
.rs-step-rail { flex-shrink: 0; width: 36px; display: flex; flex-direction: column; align-items: center; }
.rs-step-node { width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'IBM Plex Mono', ui-monospace, monospace; font-size: 14px; font-weight: 600; flex-shrink: 0; }
.rs-step-node.done { background: ${ACCENT}; border: 1px solid ${ACCENT}; color: #fff; }
.rs-step-node.current { background: var(--blue-50); border: 2px solid ${ACCENT}; color: ${ACCENT}; }
.rs-step-node.upcoming { background: var(--surface-1); border: 1px solid var(--border-default); color: var(--text-tertiary); }
.rs-step-line { flex: 1; width: 2px; min-height: 18px; margin: 4px 0; border-radius: 2px; background: var(--border-default); }
.rs-step-line.done { background: ${ACCENT}; }
.rs-step-body { flex: 1; padding-bottom: 14px; }

/* Resource card */
.rs-card { background: var(--surface-1); border: 1px solid var(--border-default); border-radius: var(--radius-card); overflow: hidden; transition: border-color 0.18s; }
.rs-card:hover { border-color: var(--blue-300); }
.rs-card.done { border-color: ${ACCENT}; background: var(--blue-50); }
.rs-start-tag { display: inline-block; font-size: 11px; font-family: 'IBM Plex Mono', ui-monospace, monospace; letter-spacing: 0.1em; text-transform: uppercase; color: ${ACCENT}; background: var(--blue-50); border: 1px solid var(--blue-100); border-radius: var(--radius-sm); padding: 2px 10px; margin-bottom: 8px; font-weight: 600; }

/* Preview headers */
.rs-thumb { position: relative; display: block; width: 100%; aspect-ratio: 16 / 9; background: var(--text-primary); cursor: pointer; border: none; padding: 0; overflow: hidden; }
.rs-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.3s, opacity 0.3s; opacity: 0.92; }
.rs-thumb:hover img { transform: scale(1.04); opacity: 1; }
.rs-thumb-play { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; pointer-events: none; }
.rs-thumb-play-bg { width: 56px; height: 56px; border-radius: 50%; background: rgba(0,0,0,0.55); display: flex; align-items: center; justify-content: center; backdrop-filter: blur(2px); }
.rs-thumb-duration { position: absolute; bottom: 8px; right: 8px; font-size: 12px; font-family: 'IBM Plex Mono', ui-monospace, monospace; color: #fff; background: rgba(0,0,0,0.8); border-radius: 4px; padding: 2px 7px; }

.rs-course-head { display: flex; align-items: center; gap: 14px; padding: 18px 20px; background: var(--blue-50); border-bottom: 1px solid var(--border-default); cursor: pointer; text-decoration: none; transition: background 0.18s; }
.rs-course-head:hover { background: var(--blue-100); }
.rs-course-head-icon { width: 46px; height: 46px; border-radius: var(--radius-sm); background: var(--surface-base); border: 1px solid var(--blue-100); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.rs-course-head-provider { display: block; font-family: var(--font-primary); font-size: 15px; font-weight: 700; color: var(--text-primary); }
.rs-course-head-instructor { display: block; font-size: 12px; color: var(--text-secondary); font-family: 'IBM Plex Mono', ui-monospace, monospace; margin-top: 2px; }

/* Card body */
.rs-card-body { padding: 16px 20px 18px; }
.rs-badges { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 10px; }
.rs-badge { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-family: 'IBM Plex Mono', ui-monospace, monospace; letter-spacing: 0.06em; padding: 3px 9px; border-radius: var(--radius-sm); border: 1px solid; font-weight: 600; }
.rs-badge-type { color: var(--text-secondary); border-color: var(--border-default); background: var(--surface-2); }
.rs-badge-official { color: ${ACCENT}; border-color: var(--blue-300); background: var(--blue-50); }
.rs-badge-community { color: var(--text-secondary); border-color: var(--border-default); background: var(--surface-2); }
.rs-res-title { font-family: var(--font-primary); font-size: 16px; font-weight: 700; color: var(--text-primary); margin-bottom: 5px; line-height: 1.4; }
.rs-res-desc { font-size: 13px; color: var(--text-secondary); line-height: 1.6; margin-bottom: 14px; }
.rs-card-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.rs-link { display: inline-flex; align-items: center; gap: 7px; background: ${ACCENT}; border: 1px solid ${ACCENT}; color: #fff; font-family: 'IBM Plex Mono', ui-monospace, monospace; font-size: 13px; padding: 8px 16px; border-radius: var(--radius-sm); text-decoration: none; transition: all 0.18s; letter-spacing: 0.04em; cursor: pointer; font-weight: 600; }
.rs-link:hover { filter: brightness(1.1); }
.rs-complete-btn { display: inline-flex; align-items: center; gap: 7px; background: transparent; border: 1px solid var(--border-default); color: var(--text-secondary); font-family: 'IBM Plex Mono', ui-monospace, monospace; font-size: 13px; padding: 8px 14px; border-radius: var(--radius-sm); cursor: pointer; transition: all 0.18s; }
.rs-complete-btn:hover { border-color: ${ACCENT}; color: ${ACCENT}; }
.rs-complete-btn.done { background: var(--blue-50); border-color: ${ACCENT}; color: ${ACCENT}; }

/* Lightbox */
.rs-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.86); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; padding: 24px; z-index: 1000; animation: rs-fade 0.18s ease; }
@keyframes rs-fade { from { opacity: 0; } to { opacity: 1; } }
.rs-modal { position: relative; width: 100%; max-width: 880px; }
.rs-modal-frame { position: relative; width: 100%; aspect-ratio: 16 / 9; background: #000; border-radius: var(--radius-card); overflow: hidden; border: 1px solid var(--border-default); }
.rs-modal-frame iframe { width: 100%; height: 100%; border: 0; }
.rs-modal-title { font-family: var(--font-primary); font-size: 15px; color: #fff; margin-top: 12px; text-align: center; }
.rs-modal-close { position: absolute; top: -14px; right: -14px; width: 36px; height: 36px; border-radius: 50%; background: var(--surface-1); border: 1px solid var(--border-default); color: ${ACCENT}; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.18s; }
.rs-modal-close:hover { background: var(--blue-50); border-color: ${ACCENT}; }

/* Quiz */
.rs-quiz { max-width: 680px; margin: 56px auto 0; border-top: 1px solid var(--border-default); padding-top: 44px; }
.rs-quiz-head { display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 6px; }
.rs-quiz-head-title { font-family: var(--font-primary); font-size: 20px; font-weight: 800; color: var(--text-primary); }
.rs-quiz-sub { font-size: 14px; color: var(--text-secondary); text-align: center; margin-bottom: 28px; }
.rs-quiz-progress { display: flex; align-items: center; gap: 12px; margin-bottom: 26px; }
.rs-quiz-progress-bar-bg { flex: 1; height: 4px; background: var(--surface-2); border-radius: 2px; overflow: hidden; }
.rs-quiz-progress-bar { height: 100%; background: ${ACCENT}; border-radius: 2px; transition: width 0.4s; }
.rs-quiz-progress-label { font-size: 13px; color: var(--text-secondary); font-family: 'IBM Plex Mono', ui-monospace, monospace; white-space: nowrap; }
.rs-quiz-q { font-family: var(--font-primary); font-size: 18px; font-weight: 700; color: var(--text-primary); line-height: 1.5; margin-bottom: 22px; }
.rs-quiz-opts { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
.rs-quiz-opt { background: var(--surface-1); border: 1px solid var(--border-default); border-radius: var(--radius-card); padding: 14px 18px; cursor: pointer; transition: all 0.18s; text-align: left; font-family: var(--font-body); font-size: 15px; color: var(--text-secondary); display: flex; align-items: flex-start; }
.rs-quiz-opt:hover:not(:disabled) { border-color: ${ACCENT}; color: var(--text-primary); }
.rs-quiz-opt.correct { border-color: var(--color-success); background: var(--color-success-bg); color: var(--color-success); }
.rs-quiz-opt.wrong { border-color: var(--color-error); background: var(--color-error-bg); color: var(--color-error); }
.rs-quiz-opt.neutral { opacity: 0.5; }
.rs-quiz-opt:disabled { cursor: default; }
.rs-quiz-explanation { background: var(--blue-50); border: 1px solid var(--blue-100); border-radius: var(--radius-card); padding: 16px 20px; font-size: 14px; color: var(--text-secondary); line-height: 1.7; margin-bottom: 20px; }
.rs-quiz-explanation strong { color: ${ACCENT}; }
.rs-btn { background: var(--orange-500); border: 1px solid var(--orange-500); color: #fff; font-family: 'IBM Plex Mono', ui-monospace, monospace; font-size: 14px; padding: 10px 20px; border-radius: var(--radius-sm); cursor: pointer; transition: all 0.18s; letter-spacing: 0.06em; font-weight: 600; }
.rs-btn:hover { filter: brightness(1.08); }
.rs-quiz-done { text-align: center; padding: 20px 0; }
.rs-quiz-done-score { font-family: var(--font-primary); font-size: 56px; font-weight: 800; color: ${ACCENT}; line-height: 1; margin-bottom: 8px; }
.rs-quiz-done-label { font-size: 16px; color: var(--text-secondary); margin-bottom: 28px; }

/* Footer */
.rs-footer { max-width: 920px; margin: 0 auto; padding: 0 20px 80px; }
.rs-footer-label { font-size: 12px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--text-tertiary); margin-bottom: 14px; text-align: center; font-weight: 600; }
.rs-footer-links { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
@media (max-width: 680px) { .rs-footer-links { grid-template-columns: 1fr; } }
.rs-footer-link { display: flex; align-items: center; gap: 10px; background: var(--surface-1); border: 1px solid var(--border-default); border-radius: var(--radius-card); padding: 14px 18px; text-decoration: none; transition: all 0.18s; }
.rs-footer-link:hover { border-color: ${ACCENT}; background: var(--surface-2); }
.rs-footer-link-title { font-family: var(--font-primary); font-size: 14px; font-weight: 600; color: var(--text-primary); }
.rs-footer-link-arrow { margin-left: auto; color: ${ACCENT}; flex-shrink: 0; transition: transform 0.18s; }
.rs-footer-link:hover .rs-footer-link-arrow { transform: translate(2px, -2px); }
`

// ─── Track data ────────────────────────────────────────────────────────────
// Resources render in array order. Only the fields present are displayed —
// no invented durations / module counts. type: 'Video' | 'Course' | 'Reference'.
const TRACKS = {
  beginner: {
    name: 'Beginner',
    Icon: PlantIcon,
    desc: 'New to Claude? Start here. Learn the essentials of prompting, everyday tasks, and what AI can and cannot do.',
    resources: [
      { id: 'b1', type: 'Video', source: 'Official', title: 'Prompting 101', desc: "Hands-on intro to writing effective prompts, from Anthropic's Code w/ Claude event.", youtubeId: 'ysPbXH0LpIE' },
      { id: 'b2', type: 'Video', source: 'Community', title: 'How to Use Claude AI (Beginner Tutorial)', desc: 'Step-by-step walkthrough: interface, emails, summarizing, artifacts, and projects.', youtubeId: 'r2vYObllqJU', duration: '8:36' },
      { id: 'b3', type: 'Course', source: 'Community', title: 'AI Prompting for Everyone', provider: 'DeepLearning.AI', instructor: 'Andrew Ng', desc: 'Go from AI novice to power user. Covers AI broadly, not just Claude.', url: 'https://learn.deeplearning.ai/courses/ai-prompting-for-everyone' },
      { id: 'b4', type: 'Course', source: 'Official', title: 'Claude 101', provider: 'Anthropic Academy', desc: 'Use Claude for everyday work tasks and core features.', url: 'https://anthropic.skilljar.com/claude-101' },
      { id: 'b5', type: 'Course', source: 'Official', title: 'AI Fluency: Framework & Foundations', provider: 'Anthropic Academy', desc: 'Collaborate with AI effectively, efficiently, ethically, and safely.', url: 'https://anthropic.skilljar.com/ai-fluency-framework-foundations' },
      { id: 'b6', type: 'Course', source: 'Official', title: 'AI Capabilities and Limitations', provider: 'Anthropic Academy', desc: 'An introductory course on how AI actually works.', url: 'https://anthropic.skilljar.com/ai-capabilities-and-limitations' },
      { id: 'b8', type: 'Video', source: 'Official', title: 'Introducing Cowork', desc: 'Hand off time-consuming tasks to Claude and come back to finished deliverables.', youtubeId: 'UAmKyyZ-b9E' },
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
      { id: 'i1', type: 'Video', source: 'Community', title: 'Learn 97% of Claude in Under 16 Minutes', desc: 'Power-user overview of using Claude across real work and automation.', youtubeId: 'wZeOwqmSw84', duration: '15:12' },
      { id: 'i2', type: 'Course', source: 'Official', title: 'Introduction to Claude Cowork', provider: 'Anthropic Academy', desc: 'Hands-on: the Cowork task loop, plugins, skills, and file/research workflows.', url: 'https://anthropic.skilljar.com/introduction-to-claude-cowork' },
      { id: 'i3', type: 'Video', source: 'Community', title: 'Learn 80% of Claude Cowork in Under 20 Minutes', desc: "Cowork's core capabilities: file access, memory, connectors, skills, scheduled tasks.", youtubeId: 'z9rdrNrkvDY' },
      { id: 'i4', type: 'Video', source: 'Official', title: 'What are skills?', desc: 'How Skills teach Claude to do a task once, then apply it automatically when relevant.', youtubeId: 'bjdBVZa66oU' },
      { id: 'i5', type: 'Course', source: 'Community', title: 'Build with Andrew', provider: 'DeepLearning.AI', instructor: 'Andrew Ng', desc: 'No coding needed — describe an app idea and let AI build it. Covers AI broadly.', url: 'https://learn.deeplearning.ai/courses/build-with-andrew' },
      { id: 'i6', type: 'Video', source: 'Community', title: 'Claude Skills Tutorial (2026): Build, Run, and Share', desc: 'Kevin Stratvert walks through building, running, and sharing your own Claude Skills.', youtubeId: 'O_z9vDLgvoY' },
      { id: 'i7', type: 'Reference', source: 'Official', title: 'Claude Code best practices', provider: 'Claude Code docs', desc: 'Working habits that transfer beyond coding: clear instructions, iteration, and letting Claude plan before it acts.', url: 'https://code.claude.com/docs/en/best-practices' },
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
      { id: 'd1', type: 'Course', source: 'Official', title: 'Claude Code 101', provider: 'Anthropic Academy', desc: 'Use Claude Code effectively in your daily development workflow.', url: 'https://anthropic.skilljar.com/claude-code-101' },
      { id: 'd2', type: 'Course', source: 'Official', title: 'Claude Code in Action', provider: 'Anthropic Academy', desc: 'Integrate Claude Code into your development workflow.', url: 'https://anthropic.skilljar.com/claude-code-in-action' },
      { id: 'd3', type: 'Video', source: 'Official', title: 'Build a proactive agent workflow with Claude Code', desc: "Anthropic walks through designing a proactive agent workflow using Claude Code's tools and subagents.", youtubeId: 'eSP7PLTXNy8' },
      { id: 'd4', type: 'Video', source: 'Official', title: 'AI prompt engineering: A deep dive', desc: 'Anthropic experts on advanced prompting techniques and how prompting evolves.', youtubeId: 'T9aRN5JkmL8' },
      { id: 'd5', type: 'Course', source: 'Official', title: 'Building with the Claude API', provider: 'Anthropic Academy', desc: 'The full spectrum of working with Anthropic models via the Claude API.', url: 'https://anthropic.skilljar.com/claude-with-the-anthropic-api' },
      { id: 'd6', type: 'Course', source: 'Official', title: 'Claude Code: A Highly Agentic Coding Assistant', provider: 'DeepLearning.AI × Anthropic', instructor: 'Elie Schoppik (Anthropic)', duration: '1h 50m', desc: 'Claude Code best practices: codebases, MCP, parallel sessions, GitHub integration.', url: 'https://learn.deeplearning.ai/courses/claude-code-a-highly-agentic-coding-assistant' },
      { id: 'd7', type: 'Course', source: 'Official', title: 'Introduction to Model Context Protocol', provider: 'Anthropic Academy', desc: 'Build MCP servers and clients from scratch in Python.', url: 'https://anthropic.skilljar.com/introduction-to-model-context-protocol' },
      { id: 'd8', type: 'Course', source: 'Official', title: 'Introduction to agent skills', provider: 'Anthropic Academy', desc: 'Build, configure, and share Skills in Claude Code.', url: 'https://anthropic.skilljar.com/introduction-to-agent-skills' },
      { id: 'd9', type: 'Course', source: 'Official', title: 'Introduction to subagents', provider: 'Anthropic Academy', desc: 'Use and create subagents to manage context and delegate tasks.', url: 'https://anthropic.skilljar.com/introduction-to-subagents' },
      { id: 'd10', type: 'Course', source: 'Official', title: 'Model Context Protocol: Advanced Topics', provider: 'Anthropic Academy', desc: 'Advanced MCP patterns: sampling, notifications, file system access, transports.', url: 'https://anthropic.skilljar.com/model-context-protocol-advanced-topics' },
      { id: 'd11', type: 'Course', source: 'Community', title: 'Agentic AI', provider: 'DeepLearning.AI', instructor: 'Andrew Ng', duration: '~8h', desc: 'Build agentic systems with evals and design patterns. Covers AI broadly, not just Claude.', url: 'https://learn.deeplearning.ai/courses/agentic-ai' },
      { id: 'd12', type: 'Reference', source: 'Official', title: 'Developer docs', provider: 'Claude Platform', desc: 'Official Claude API and platform documentation.', url: 'https://platform.claude.com/docs' },
      { id: 'd13', type: 'Reference', source: 'Official', title: 'Claude Code best practices', provider: 'Claude Code docs', desc: 'Patterns for getting the most out of Claude Code: setup, workflows, and agentic coding tips.', url: 'https://code.claude.com/docs/en/best-practices' },
    ],
    quiz: [
      { q: 'The Claude API lets developers…', opts: ["Integrate Claude's capabilities into their own applications", 'Only use a web chat', 'Train new base models', "Access other companies' private data"], correct: 0, explanation: 'The API is how you build Claude-powered applications programmatically.' },
      { q: 'What does the Model Context Protocol (MCP) do?', opts: ['Connects Claude to external services via tools, resources, and prompts', 'Compresses images', 'Replaces the API', 'Handles billing'], correct: 0, explanation: 'MCP standardizes how Claude connects to external tools and data.' },
      { q: 'Claude Code is…', opts: ['An agentic coding tool that works from your terminal/IDE', 'A spreadsheet app', 'A password manager', 'A model name'], correct: 0, explanation: 'Claude Code lets developers delegate coding tasks in their dev environment.' },
      { q: 'Subagents in Claude Code are useful for…', opts: ['Managing context and delegating specialized tasks', 'Increasing your bill arbitrarily', 'Disabling the main agent', 'Nothing practical'], correct: 0, explanation: 'Subagents keep the main conversation focused by delegating scoped work.' },
      { q: 'A Claude Skill is best described as…', opts: ['A reusable instruction package Claude applies automatically when a task is relevant', 'A new subscription tier', 'A keyboard shortcut', 'A frontend framework'], correct: 0, explanation: 'Skills bundle instructions, examples, and supporting files so Claude performs a task consistently across sessions.' },
      { q: 'A proactive agent workflow with Claude Code typically combines…', opts: ['Scoped tools, clear context, and a planning loop with human checkpoints', 'No instructions and high randomness', 'Disabling all subagents', 'Writing the workflow only in YAML'], correct: 0, explanation: 'Proactive workflows give Claude the tools, context, and guardrails to plan and act on a task without constant re-prompting.' },
      { q: 'Prompt engineering for production systems is mostly about…', opts: ['Iterative experimentation, clear context, evals, and version control', 'Memorizing magic keywords', 'Always raising temperature to 1', 'Picking the largest model regardless of cost'], correct: 0, explanation: "Treat prompts like code: iterate against evals, version them, and ground them in concrete context — Anthropic's experts emphasize this." },
    ],
  },
  claudeDesign: {
    name: 'Claude Design',
    Icon: PaintBrushIcon,
    desc: 'Design with Claude. Build prototypes, slides, one-pagers, websites, and design systems through conversation.',
    accessNote: { intro: 'Access Claude Design at', url: 'https://claude.ai/design', label: 'claude.ai/design' },
    resources: [
      { id: 'cd1', type: 'Article', source: 'Official', title: 'Introducing Claude Design by Anthropic Labs', provider: 'Anthropic News', desc: "Anthropic's launch post — collaborate with Claude on prototypes, slides, one-pagers, and more.", url: 'https://www.anthropic.com/news/claude-design-anthropic-labs' },
      { id: 'cd2', type: 'Video', source: 'Official', title: 'Introducing Claude Design', desc: "Anthropic's official intro to Claude Design and what it can create.", youtubeId: 't_LBECIQQqs' },
      { id: 'cd3', type: 'Video', source: 'Community', title: 'Claude Design: Everything You Can Build in 16 Minutes (5 Real Use Cases)', desc: 'Hands-on walkthrough of five use cases: videos, slides, websites, apps, and a design system.', youtubeId: 'WMnk1LFBMqA' },
      { id: 'cd4', type: 'Video', source: 'Community', title: 'Claude Design Basics: Master 95% in 10 Minutes', desc: 'A 6-step framework: interface, building, refining, exporting, and Claude Code handoff.', youtubeId: 'X7YMMyd2Qnk' },
    ],
    quiz: [
      { q: 'What is Claude Design?', opts: ['A tool to collaborate with Claude on visual work like prototypes, slides, and one-pagers', 'A code linter', 'A password manager', 'A video conferencing app'], correct: 0, explanation: 'Claude Design is an Anthropic Labs product for creating polished visual work.' },
      { q: 'How do you refine a design in Claude Design?', opts: ['Through conversation, inline comments, direct edits, or adjustment controls', 'Only by rewriting from scratch', 'By editing raw CSS only', "You can't refine it"], correct: 0, explanation: 'You iterate via chat, inline comments, direct edits, or live adjustment sliders.' },
      { q: 'Which is a supported export from Claude Design?', opts: ['Canva, PDF, PPTX, or standalone HTML', 'Only PNG', 'Only printed paper', 'No exports'], correct: 0, explanation: 'Designs export to Canva, PDF, PPTX, or HTML, or share via an org URL.' },
      { q: 'When a design is ready to build, Claude Design can…', opts: ['Package a handoff bundle to pass to Claude Code', 'Email it to a stranger', 'Delete your repo', 'Do nothing further'], correct: 0, explanation: 'It bundles the design for Claude Code to implement with a single instruction.' },
    ],
  },
}

const LEVEL_ORDER = ['beginner', 'intermediate', 'developer', 'claudeDesign']

const FILTERS = [
  { key: 'all', label: 'All', test: () => true },
  { key: 'videos', label: 'Videos', test: r => r.type === 'Video' },
  { key: 'courses', label: 'Courses', test: r => r.type === 'Course' },
  { key: 'official', label: 'Official', test: r => r.source === 'Official' },
]

const FOOTER_LINKS = [
  { title: 'All courses', url: 'https://anthropic.skilljar.com/' },
  { title: 'Anthropic Academy', url: 'https://www.anthropic.com/learn' },
  { title: 'Anthropic YouTube', url: 'https://www.youtube.com/@anthropic-ai' },
]

// ─── localStorage helpers (guarded) ──────────────────────────────────────────
function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const arr = raw ? JSON.parse(raw) : []
    return Array.isArray(arr) ? arr : []
  } catch { return [] }
}
function saveProgress(ids) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(ids)) } catch { /* ignore */ }
}

// ─── Badges ───────────────────────────────────────────────────────────────
function TypeBadge({ type }) {
  // Reference items render with the BookOpen icon, like courses. Article gets its own icon.
  const Icon = type === 'Video' ? PlayCircleIcon : type === 'Article' ? ArticleIcon : BookOpenIcon
  const label = type === 'Video' ? 'Video' : type === 'Article' ? 'Article' : type === 'Reference' ? 'Reference' : 'Course'
  return (
    <span className="rs-badge rs-badge-type">
      <Icon size={16} weight="duotone" color={ACCENT_ICON} />
      {label}
    </span>
  )
}

function SourceBadge({ source }) {
  if (source === 'Official') {
    return (
      <span className="rs-badge rs-badge-official">
        <SealCheckIcon size={16} weight="duotone" color={ACCENT_ICON} />
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

// ─── Resource card ───────────────────────────────────────────────────────────
function ResourceCard({ res, isFirst, completed, onToggle, onPlay }) {
  const isVideo = res.type === 'Video'
  return (
    <div className={`rs-card${completed ? ' done' : ''}`}>
      {isVideo ? (
        <button className="rs-thumb" onClick={() => onPlay(res)} aria-label={`Play ${res.title}`}>
          <img src={`https://img.youtube.com/vi/${res.youtubeId}/hqdefault.jpg`} alt="" loading="lazy" />
          <span className="rs-thumb-play">
            <span className="rs-thumb-play-bg">
              <PlayCircleIcon size={40} weight="fill" color={ACCENT_ICON} />
            </span>
          </span>
          {res.duration && <span className="rs-thumb-duration">{res.duration}</span>}
        </button>
      ) : (
        <a className="rs-course-head" href={res.url} target="_blank" rel="noopener noreferrer">
          <span className="rs-course-head-icon">
            {res.type === 'Article'
              ? <ArticleIcon size={30} weight="duotone" color={ACCENT_ICON} />
              : <BookOpenIcon size={30} weight="duotone" color={ACCENT_ICON} />}
          </span>
          <span>
            <span className="rs-course-head-provider">{res.provider}</span>
            {(res.instructor || res.duration) && (
              <span className="rs-course-head-instructor">
                {res.instructor}
                {res.instructor && res.duration && ' · '}
                {res.duration}
              </span>
            )}
          </span>
        </a>
      )}

      <div className="rs-card-body">
        {isFirst && <div className="rs-start-tag">Start here</div>}
        <div className="rs-badges">
          <TypeBadge type={res.type} />
          <SourceBadge source={res.source} />
        </div>
        <div className="rs-res-title">{res.title}</div>
        <div className="rs-res-desc">{res.desc}</div>
        <div className="rs-card-actions">
          {isVideo ? (
            <button className="rs-link" onClick={() => onPlay(res)}>
              Watch <PlayCircleIcon size={15} weight="bold" color={ACCENT_ICON} />
            </button>
          ) : (
            <a className="rs-link" href={res.url} target="_blank" rel="noopener noreferrer">
              {res.type === 'Reference' ? 'Read docs' : res.type === 'Article' ? 'Read article' : 'Open course'}
              <ArrowSquareOutIcon size={15} weight="bold" color={ACCENT_ICON} />
            </a>
          )}
          <button className={`rs-complete-btn${completed ? ' done' : ''}`} onClick={() => onToggle(res.id)}>
            <CheckIcon size={15} weight="bold" color={completed ? ACCENT_ICON : 'currentColor'} />
            {completed ? 'Completed' : 'Mark complete'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Video lightbox ──────────────────────────────────────────────────────────
function VideoModal({ video, onClose }) {
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="rs-modal-overlay" onClick={onClose}>
      <div className="rs-modal" onClick={e => e.stopPropagation()}>
        <button className="rs-modal-close" onClick={onClose} aria-label="Close">
          <XIcon size={18} weight="bold" />
        </button>
        <div className="rs-modal-frame">
          <iframe
            src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="rs-modal-title">{video.title}</div>
      </div>
    </div>
  )
}

// ─── Quiz ────────────────────────────────────────────────────────────────────
function TrackQuiz({ quiz, levelKey }) {
  const [qNum, setQNum] = useState(0)
  const [chosen, setChosen] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => { setQNum(0); setChosen(null); setScore(0); setDone(false) }, [levelKey])

  const total = quiz.length
  const currentQ = quiz[qNum]

  function handleAnswer(idx) {
    if (chosen !== null) return
    setChosen(idx)
    if (idx === currentQ.correct) setScore(s => s + 1)
  }
  function nextQ() {
    if (qNum + 1 >= total) { setDone(true); return }
    setQNum(n => n + 1); setChosen(null)
  }
  function retake() { setQNum(0); setChosen(null); setScore(0); setDone(false) }

  return (
    <div className="rs-quiz">
      <div className="rs-quiz-head">
        <QuestionIcon size={20} weight="duotone" color={ACCENT_ICON} />
        <span className="rs-quiz-head-title">Knowledge check</span>
      </div>
      <div className="rs-quiz-sub">{total} quick questions to test what you've learned.</div>

      {done ? (
        <div className="rs-quiz-done">
          <div className="rs-quiz-done-score">{score}/{total}</div>
          <div className="rs-quiz-done-label">Questions answered correctly</div>
          <button className="rs-btn" onClick={retake}>Retake quiz</button>
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
                  <span style={{ color: 'var(--text-tertiary)', marginRight: 10, fontFamily: "'IBM Plex Mono', ui-monospace, monospace", fontSize: 13 }}>{String.fromCharCode(65 + i)}.</span>
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
                {qNum + 1 >= total ? 'See results' : 'Next question →'}
              </button>
            </>
          )}
        </>
      )}
    </div>
  )
}

// ─── Track view ──────────────────────────────────────────────────────────────
function TrackView({ levelKey, track, completedIds, onToggle, onReset, onPlay }) {
  const [filter, setFilter] = useState('all')

  // Reset the filter when switching tracks.
  useEffect(() => { setFilter('all') }, [levelKey])

  const completedSet = new Set(completedIds)
  const doneCount = track.resources.filter(r => completedSet.has(r.id)).length
  const total = track.resources.length
  const pct = total ? (doneCount / total) * 100 : 0
  // First incomplete in full-track order = the "current" step.
  const currentIdx = track.resources.findIndex(r => !completedSet.has(r.id))

  const activeFilter = FILTERS.find(f => f.key === filter) || FILTERS[0]
  const visible = track.resources
    .map((r, idx) => ({ r, idx }))
    .filter(({ r }) => activeFilter.test(r))

  return (
    <div>
      <div className="rs-track-head">
        <div className="rs-track-icon">
          <track.Icon size={26} weight="duotone" color={ACCENT_ICON} />
        </div>
        <div className="rs-track-title">{track.name} Track</div>
      </div>
      <div className="rs-track-sub">{track.desc}</div>
      {track.accessNote && (
        <div className="rs-track-access">
          {track.accessNote.intro}{' '}
          <a className="rs-track-access-link" href={track.accessNote.url} target="_blank" rel="noopener noreferrer">
            {track.accessNote.label}
            <ArrowSquareOutIcon size={13} weight="bold" />
          </a>
        </div>
      )}

      {/* Progress */}
      <div className="rs-progress-wrap">
        <div className="rs-progress-top">
          <span className="rs-progress-label">{doneCount} of {total} complete</span>
          <button className="rs-progress-reset" onClick={onReset}>Reset progress</button>
        </div>
        <div className="rs-progress-bar-bg">
          <div className="rs-progress-bar" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Filters */}
      <div className="rs-filters">
        {FILTERS.map(f => (
          <button key={f.key} className={`rs-chip${filter === f.key ? ' active' : ''}`} onClick={() => setFilter(f.key)}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Stepper */}
      {visible.map(({ r, idx }, vi) => {
        const isDone = completedSet.has(r.id)
        const isCurrent = idx === currentIdx
        const nodeCls = isDone ? 'done' : isCurrent ? 'current' : 'upcoming'
        const isLastVisible = vi === visible.length - 1
        return (
          <div className="rs-step" key={r.id}>
            <div className="rs-step-rail">
              <div className={`rs-step-node ${nodeCls}`}>
                {isDone ? <CheckIcon size={18} weight="bold" color="#fff" /> : idx + 1}
              </div>
              {!isLastVisible && <div className={`rs-step-line${isDone ? ' done' : ''}`} />}
            </div>
            <div className="rs-step-body">
              <ResourceCard
                res={r}
                isFirst={idx === 0}
                completed={isDone}
                onToggle={onToggle}
                onPlay={onPlay}
              />
            </div>
          </div>
        )
      })}

      <TrackQuiz quiz={track.quiz} levelKey={levelKey} />
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function Resources() {
  const [level, setLevel] = useState(null)
  const [completedIds, setCompletedIds] = useState([])
  const [video, setVideo] = useState(null)

  useEffect(() => { setCompletedIds(loadProgress()) }, [])

  const toggleComplete = useCallback((id) => {
    setCompletedIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
      saveProgress(next)
      return next
    })
  }, [])

  const resetProgress = useCallback(() => {
    try { localStorage.removeItem(STORAGE_KEY) } catch { /* ignore */ }
    setCompletedIds([])
  }, [])

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
    <div className="rs-root">
      <style>{css}</style>
      <NavBar />

      <div className="rs-hero">
        <div className="rs-eyebrow">Learn Claude</div>
        <h1 className="rs-title">Claude <span>Learning Resources</span></h1>
        <p className="rs-subtitle">A curated directory of the best official and community resources for learning AI with Claude and beyond — organized into a guided path for your level.</p>
      </div>

      <div className="rs-panel">
        {!track ? (
          <div>
            <div className="rs-section-title">Choose your path</div>
            <div className="rs-section-sub">Pick a track and we'll lay out an ordered learning path — from your first prompt to building production apps.</div>

            <div className="rs-level-grid">
              {LEVEL_ORDER.map(key => {
                const t = TRACKS[key]
                const Icon = t.Icon
                const courses = t.resources.filter(r => r.type === 'Course' || r.type === 'Reference').length
                const articles = t.resources.filter(r => r.type === 'Article').length
                const videos = t.resources.filter(r => r.type === 'Video').length
                const parts = []
                if (courses) parts.push(`${courses} course${courses > 1 ? 's' : ''}`)
                if (articles) parts.push(`${articles} article${articles > 1 ? 's' : ''}`)
                if (videos) parts.push(`${videos} video${videos > 1 ? 's' : ''}`)
                return (
                  <div key={key} className="rs-level-card" onClick={() => pickLevel(key)}>
                    <div className="rs-level-icon">
                      <Icon size={32} weight="duotone" color={ACCENT_ICON} />
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
          <div>
            <button className="rs-change-btn" onClick={changeLevel}>← Change path</button>
            <TrackView
              levelKey={level}
              track={track}
              completedIds={completedIds}
              onToggle={toggleComplete}
              onReset={resetProgress}
              onPlay={setVideo}
            />
          </div>
        )}
      </div>

      {/* Persistent footer */}
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

      {video && <VideoModal video={video} onClose={() => setVideo(null)} />}
    </div>
  )
}
