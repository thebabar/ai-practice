import { useState, useEffect, useRef, useMemo } from 'react'
import NavBar from '../components/NavBar.jsx'

const css = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap');

.rg-root { min-height: 100vh; background: #050810; color: #e0e8f0; font-family: 'IBM Plex Mono', monospace; overflow-x: hidden; }

.rg-hero { text-align: center; padding: 48px 24px 28px; position: relative; }
.rg-hero::before { content: ''; position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 700px; height: 320px; background: radial-gradient(ellipse at 50% 0%, rgba(6,182,212,0.09) 0%, transparent 70%); pointer-events: none; }
.rg-eyebrow { font-size: 16px; letter-spacing: 0.22em; color: #06b6d4; text-transform: uppercase; margin-bottom: 14px; }
.rg-title { font-family: 'IBM Plex Sans', sans-serif; font-size: clamp(28px, 5vw, 52px); font-weight: 800; letter-spacing: -0.02em; color: #fff; line-height: 1.05; margin-bottom: 12px; }
.rg-title span { color: #06b6d4; }
.rg-subtitle { font-size: 16px; color: #3a6a7a; max-width: 540px; margin: 0 auto 32px; line-height: 1.8; }

.rg-tabs { display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; padding: 0 16px 32px; }
.rg-tab { background: transparent; border: 1px solid #0a2030; color: #3a6a7a; font-family: 'IBM Plex Mono', monospace; font-size: 16px; letter-spacing: 0.1em; padding: 8px 16px; border-radius: 6px; cursor: pointer; transition: all 0.18s; text-transform: uppercase; }
.rg-tab:hover { border-color: #06b6d4; color: #06b6d4; }
.rg-tab.active { background: rgba(6,182,212,0.1); border-color: #06b6d4; color: #06b6d4; }

.rg-panel { max-width: 920px; margin: 0 auto; padding: 0 20px 80px; }

.rg-section-title { font-family: 'IBM Plex Sans', sans-serif; font-size: 22px; font-weight: 700; color: #fff; margin-bottom: 8px; }
.rg-section-sub { font-size: 16px; color: #3a6a7a; line-height: 1.7; margin-bottom: 24px; }

.rg-card { background: rgba(6,182,212,0.04); border: 1px solid rgba(6,182,212,0.15); border-radius: 14px; padding: 20px 24px; margin-bottom: 16px; }
.rg-card-plain { background: rgba(255,255,255,0.02); border: 1px solid #0d1e28; border-radius: 14px; padding: 20px 24px; margin-bottom: 16px; }

/* Pipeline tab */
.rg-pipeline-step { display: flex; align-items: flex-start; gap: 16px; padding: 16px 20px; border-radius: 12px; border: 1px solid #0d1e28; background: rgba(255,255,255,0.02); margin-bottom: 10px; cursor: pointer; transition: all 0.2s; }
.rg-pipeline-step.active { border-color: #06b6d4; background: rgba(6,182,212,0.06); }
.rg-pipeline-step.done { border-color: rgba(6,182,212,0.3); background: rgba(6,182,212,0.03); }
.rg-step-icon { font-size: 24px; min-width: 36px; text-align: center; margin-top: 2px; }
.rg-step-label { font-family: 'IBM Plex Sans', sans-serif; font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 4px; }
.rg-step-label.active { color: #06b6d4; }
.rg-step-content { font-size: 14px; color: #4a8a9a; line-height: 1.6; }
.rg-step-content.active { color: #a0d4dc; }
.rg-step-num { font-size: 12px; color: #1a4a5a; font-family: 'IBM Plex Mono', monospace; margin-bottom: 4px; }
.rg-step-num.active { color: #06b6d4; }

.rg-streaming { font-family: 'IBM Plex Mono', monospace; font-size: 14px; color: #34d399; line-height: 1.7; white-space: pre-wrap; }
.rg-cursor { display: inline-block; width: 2px; height: 14px; background: #34d399; margin-left: 1px; vertical-align: middle; animation: rg-blink 0.8s steps(1) infinite; }
@keyframes rg-blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }

.rg-btn { background: rgba(6,182,212,0.1); border: 1px solid #06b6d4; color: #06b6d4; font-family: 'IBM Plex Mono', monospace; font-size: 14px; padding: 10px 20px; border-radius: 8px; cursor: pointer; transition: all 0.18s; letter-spacing: 0.08em; }
.rg-btn:hover { background: rgba(6,182,212,0.18); }
.rg-btn-ghost { background: transparent; border: 1px solid #1a3a4a; color: #3a6a7a; font-family: 'IBM Plex Mono', monospace; font-size: 14px; padding: 10px 20px; border-radius: 8px; cursor: pointer; transition: all 0.18s; letter-spacing: 0.08em; margin-left: 10px; }
.rg-btn-ghost:hover { border-color: #3a6a7a; color: #6a9aaa; }

.rg-benefits-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; margin-top: 20px; }
.rg-benefit-card { background: rgba(6,182,212,0.04); border: 1px solid rgba(6,182,212,0.12); border-radius: 10px; padding: 16px; text-align: center; }
.rg-benefit-icon { font-size: 22px; margin-bottom: 8px; }
.rg-benefit-title { font-family: 'IBM Plex Sans', sans-serif; font-size: 14px; font-weight: 700; color: #c0e8f0; margin-bottom: 4px; }
.rg-benefit-desc { font-size: 12px; color: #3a6a7a; line-height: 1.5; }

/* Chunking tab */
.rg-controls { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; margin-bottom: 24px; }
.rg-slider-wrap { display: flex; align-items: center; gap: 12px; }
.rg-slider-label { font-size: 14px; color: #3a6a7a; white-space: nowrap; }
.rg-slider { -webkit-appearance: none; width: 180px; height: 4px; border-radius: 2px; background: #0d1e28; outline: none; }
.rg-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; background: #06b6d4; cursor: pointer; }
.rg-slider-val { font-size: 13px; color: #06b6d4; font-family: 'IBM Plex Mono', monospace; min-width: 90px; }

.rg-strategy-btns { display: flex; gap: 8px; flex-wrap: wrap; }
.rg-strategy-btn { background: transparent; border: 1px solid #0d1e28; color: #3a6a7a; font-family: 'IBM Plex Mono', monospace; font-size: 13px; padding: 6px 14px; border-radius: 6px; cursor: pointer; transition: all 0.18s; }
.rg-strategy-btn.active { background: rgba(6,182,212,0.1); border-color: #06b6d4; color: #06b6d4; }

.rg-chunk-count { font-size: 13px; color: #06b6d4; font-family: 'IBM Plex Mono', monospace; margin-bottom: 14px; }

.rg-doc-display { background: rgba(255,255,255,0.02); border: 1px solid #0d1e28; border-radius: 12px; padding: 20px; font-size: 14px; line-height: 1.8; color: #a0b8c8; }
.rg-chunk-seg { display: inline; border-radius: 4px; padding: 1px 0; }

.rg-overlap-info { background: rgba(6,182,212,0.04); border: 1px solid rgba(6,182,212,0.12); border-radius: 10px; padding: 16px 20px; margin-top: 20px; }
.rg-overlap-title { font-family: 'IBM Plex Sans', sans-serif; font-size: 15px; font-weight: 700; color: #06b6d4; margin-bottom: 6px; }
.rg-overlap-text { font-size: 14px; color: #3a6a7a; line-height: 1.7; }

/* Retrieval tab */
.rg-query-chips { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px; }
.rg-chip { background: transparent; border: 1px solid #0d1e28; color: #3a6a7a; font-family: 'IBM Plex Mono', monospace; font-size: 13px; padding: 7px 14px; border-radius: 100px; cursor: pointer; transition: all 0.18s; }
.rg-chip:hover { border-color: #06b6d4; color: #06b6d4; }
.rg-chip.active { background: rgba(6,182,212,0.1); border-color: #06b6d4; color: #06b6d4; }

.rg-chunk-card { background: rgba(255,255,255,0.02); border: 1px solid #0d1e28; border-radius: 10px; padding: 14px 18px; margin-bottom: 10px; transition: border-color 0.2s; }
.rg-chunk-card.top-result { border-color: rgba(6,182,212,0.4); background: rgba(6,182,212,0.04); }
.rg-chunk-title { font-family: 'IBM Plex Sans', sans-serif; font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 4px; }
.rg-chunk-text { font-size: 13px; color: #4a7a8a; line-height: 1.6; margin-bottom: 10px; }
.rg-score-row { display: flex; align-items: center; gap: 10px; }
.rg-score-bar-bg { flex: 1; height: 6px; background: #0d1e28; border-radius: 3px; overflow: hidden; }
.rg-score-bar { height: 100%; border-radius: 3px; background: #06b6d4; transition: width 0.4s ease; }
.rg-score-val { font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: #06b6d4; min-width: 36px; text-align: right; }
.rg-top-badge { font-size: 11px; color: #06b6d4; font-family: 'IBM Plex Mono', monospace; background: rgba(6,182,212,0.1); border: 1px solid rgba(6,182,212,0.25); border-radius: 4px; padding: 1px 6px; }

.rg-quality-section { margin-top: 32px; }
.rg-quality-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 14px; }
.rg-quality-col { border-radius: 10px; padding: 16px; }
.rg-quality-col.vague { background: rgba(248,113,113,0.04); border: 1px solid rgba(248,113,113,0.15); }
.rg-quality-col.specific { background: rgba(52,211,153,0.04); border: 1px solid rgba(52,211,153,0.15); }
.rg-quality-label { font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 8px; font-weight: 600; }
.rg-quality-label.vague { color: #f87171; }
.rg-quality-label.specific { color: #34d399; }
.rg-quality-query { font-size: 14px; color: #c0d0d8; margin-bottom: 12px; font-style: italic; }
.rg-quality-scores { display: flex; flex-direction: column; gap: 4px; }
.rg-quality-score-row { display: flex; align-items: center; gap: 8px; font-size: 12px; }
.rg-quality-score-row .bar-bg { flex: 1; height: 5px; background: #0d1e28; border-radius: 2px; overflow: hidden; }
.rg-quality-score-row .bar { height: 100%; border-radius: 2px; }
.rg-quality-score-row .lbl { color: #3a6a7a; min-width: 80px; font-family: 'IBM Plex Mono', monospace; font-size: 11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.rg-quality-score-row .val { color: #6a9aaa; min-width: 30px; text-align: right; font-family: 'IBM Plex Mono', monospace; }

/* Prompt Assembly tab */
.rg-assembly-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 24px; }
@media (max-width: 700px) { .rg-assembly-grid { grid-template-columns: 1fr; } }
.rg-assembly-col-label { font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: #3a6a7a; margin-bottom: 10px; font-weight: 600; }
.rg-query-box { background: rgba(6,182,212,0.05); border: 1px solid rgba(6,182,212,0.2); border-radius: 10px; padding: 14px; font-size: 14px; color: #c0e8f0; line-height: 1.6; }
.rg-chunk-toggle { border-radius: 10px; border: 1px solid #0d1e28; padding: 12px 14px; margin-bottom: 8px; cursor: pointer; transition: all 0.18s; }
.rg-chunk-toggle.included { border-color: rgba(6,182,212,0.4); background: rgba(6,182,212,0.06); }
.rg-chunk-toggle.excluded { background: rgba(255,255,255,0.01); opacity: 0.6; }
.rg-chunk-toggle-title { font-size: 13px; font-weight: 700; color: #fff; margin-bottom: 4px; font-family: 'IBM Plex Sans', sans-serif; }
.rg-chunk-toggle-text { font-size: 12px; color: #3a6a7a; line-height: 1.5; }
.rg-chunk-toggle-status { font-size: 11px; font-family: 'IBM Plex Mono', monospace; margin-top: 6px; }
.rg-chunk-toggle-status.on { color: #06b6d4; }
.rg-chunk-toggle-status.off { color: #2a4a5a; }

.rg-prompt-preview { background: #020508; border: 1px solid #0d1e28; border-radius: 10px; padding: 16px; font-family: 'IBM Plex Mono', monospace; font-size: 12px; line-height: 1.7; color: #6a9aaa; white-space: pre-wrap; min-height: 220px; }
.rg-prompt-system { color: #3a6a7a; }
.rg-prompt-context { color: #06b6d4; }
.rg-prompt-query { color: #c0e8f0; }

.rg-token-count { font-size: 13px; color: #3a6a7a; margin-top: 8px; }
.rg-token-count span { color: #06b6d4; font-family: 'IBM Plex Mono', monospace; }

.rg-template-btns { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
.rg-template-btn { background: transparent; border: 1px solid #0d1e28; color: #3a6a7a; font-family: 'IBM Plex Mono', monospace; font-size: 13px; padding: 6px 14px; border-radius: 6px; cursor: pointer; transition: all 0.18s; }
.rg-template-btn.active { background: rgba(6,182,212,0.1); border-color: #06b6d4; color: #06b6d4; }

.rg-answer-box { background: rgba(52,211,153,0.04); border: 1px solid rgba(52,211,153,0.2); border-radius: 10px; padding: 16px 20px; margin-top: 16px; font-size: 14px; color: #a0d4c0; line-height: 1.7; }
.rg-answer-label { font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: #34d399; margin-bottom: 8px; font-weight: 600; }

/* Comparison tab */
.rg-compare-table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
.rg-compare-table th { text-align: left; font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase; color: #3a6a7a; padding: 10px 16px; border-bottom: 1px solid #0d1e28; }
.rg-compare-table th.rag-col { color: #06b6d4; }
.rg-compare-table th.ft-col { color: #818cf8; }
.rg-compare-row td { padding: 14px 16px; border-bottom: 1px solid #080f18; font-size: 14px; vertical-align: top; }
.rg-compare-row:hover td { background: rgba(255,255,255,0.015); }
.rg-compare-row.expanded td { background: rgba(6,182,212,0.03); }
.rg-row-label { color: #c0d0d8; font-family: 'IBM Plex Sans', sans-serif; font-weight: 600; font-size: 14px; cursor: pointer; white-space: nowrap; }
.rg-row-expand { display: flex; align-items: center; gap: 8px; }
.rg-row-expand-arrow { font-size: 10px; color: #3a6a7a; transition: transform 0.18s; }
.rg-row-expand-arrow.open { transform: rotate(90deg); }
.rg-rating-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 8px; }
.rg-rating-dot.good { background: #34d399; }
.rg-rating-dot.warn { background: #fbbf24; }
.rg-rating-dot.bad { background: #f87171; }
.rg-cell-short { color: #4a7a8a; font-size: 13px; }
.rg-cell-detail { font-size: 13px; color: #3a6a7a; line-height: 1.6; margin-top: 6px; padding-top: 6px; border-top: 1px solid #0d1e28; }

.rg-scenario-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 12px; margin-top: 14px; }
.rg-scenario-card { background: rgba(255,255,255,0.02); border: 1px solid #0d1e28; border-radius: 10px; padding: 16px; cursor: pointer; transition: border-color 0.18s; }
.rg-scenario-card:hover { border-color: #1a3a4a; }
.rg-scenario-card.selected { border-color: rgba(6,182,212,0.35); }
.rg-scenario-title { font-family: 'IBM Plex Sans', sans-serif; font-size: 14px; font-weight: 700; color: #c0d0d8; margin-bottom: 8px; }
.rg-scenario-rec { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-family: 'IBM Plex Mono', monospace; padding: 3px 10px; border-radius: 100px; margin-bottom: 8px; }
.rg-scenario-rec.rag { background: rgba(6,182,212,0.1); border: 1px solid rgba(6,182,212,0.3); color: #06b6d4; }
.rg-scenario-rec.finetune { background: rgba(129,140,248,0.1); border: 1px solid rgba(129,140,248,0.3); color: #818cf8; }
.rg-scenario-rec.hybrid { background: rgba(251,191,36,0.1); border: 1px solid rgba(251,191,36,0.3); color: #fbbf24; }
.rg-scenario-rationale { font-size: 13px; color: #3a6a7a; line-height: 1.6; }

.rg-hybrid-box { background: rgba(251,191,36,0.04); border: 1px solid rgba(251,191,36,0.15); border-radius: 12px; padding: 20px 24px; margin-top: 32px; }
.rg-hybrid-title { font-family: 'IBM Plex Sans', sans-serif; font-size: 16px; font-weight: 700; color: #fbbf24; margin-bottom: 8px; }
.rg-hybrid-text { font-size: 14px; color: #5a5030; line-height: 1.7; }

/* Intro simulator */
.rg-sim-input { flex:1; background:rgba(255,255,255,0.03); border:1px solid #0d1e28; border-radius:8px; padding:10px 14px; color:#c0e8f0; font-family:'IBM Plex Mono',monospace; font-size:13px; outline:none; transition: border-color 0.18s; }
.rg-sim-input:focus { border-color: rgba(6,182,212,0.5); }
.rg-sim-input::placeholder { color: #1a3a4a; }
.rg-eq-chip { background:transparent; border:1px solid #0d1e28; color:#3a6a7a; font-family:'IBM Plex Mono',monospace; font-size:12px; padding:5px 12px; border-radius:100px; cursor:pointer; transition:all 0.18s; }
.rg-eq-chip:hover { border-color:#06b6d4; color:#06b6d4; }

/* Quiz tab */
.rg-quiz-wrap { max-width: 680px; margin: 0 auto; }
.rg-quiz-progress { display: flex; align-items: center; gap: 12px; margin-bottom: 28px; }
.rg-quiz-progress-bar-bg { flex: 1; height: 4px; background: #0d1e28; border-radius: 2px; overflow: hidden; }
.rg-quiz-progress-bar { height: 100%; background: #06b6d4; border-radius: 2px; transition: width 0.4s; }
.rg-quiz-progress-label { font-size: 13px; color: #3a6a7a; font-family: 'IBM Plex Mono', monospace; white-space: nowrap; }

.rg-diff-badge { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.1em; text-transform: uppercase; padding: 3px 10px; border-radius: 100px; border: 1px solid; margin-bottom: 14px; font-weight: 500; }
.rg-diff-badge.easy   { color: #34d399; border-color: rgba(52,211,153,0.35);  background: rgba(52,211,153,0.08); }
.rg-diff-badge.medium { color: #fbbf24; border-color: rgba(251,191,36,0.35);  background: rgba(251,191,36,0.08); }
.rg-diff-badge.hard   { color: #f87171; border-color: rgba(248,113,113,0.35); background: rgba(239,68,68,0.08); }

.rg-quiz-q { font-family: 'IBM Plex Sans', sans-serif; font-size: 18px; font-weight: 700; color: #fff; line-height: 1.5; margin-bottom: 24px; }
.rg-quiz-opts { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
.rg-quiz-opt { background: rgba(255,255,255,0.02); border: 1px solid #0d1e28; border-radius: 10px; padding: 14px 18px; cursor: pointer; transition: all 0.18s; text-align: left; font-family: 'IBM Plex Sans', sans-serif; font-size: 15px; color: #a0b8c8; }
.rg-quiz-opt:hover:not(:disabled) { border-color: #06b6d4; color: #c0e8f0; }
.rg-quiz-opt.correct { border-color: #34d399; background: rgba(52,211,153,0.08); color: #34d399; }
.rg-quiz-opt.wrong { border-color: #f87171; background: rgba(248,113,113,0.08); color: #f87171; }
.rg-quiz-opt.neutral { opacity: 0.5; }
.rg-quiz-opt:disabled { cursor: default; }

.rg-quiz-explanation { background: rgba(6,182,212,0.05); border: 1px solid rgba(6,182,212,0.15); border-radius: 10px; padding: 16px 20px; font-size: 14px; color: #4a8a9a; line-height: 1.7; margin-bottom: 20px; }
.rg-quiz-explanation strong { color: #06b6d4; }

.rg-quiz-done { text-align: center; padding: 40px 0; }
.rg-quiz-done-score { font-family: 'IBM Plex Sans', sans-serif; font-size: 56px; font-weight: 900; color: #06b6d4; line-height: 1; margin-bottom: 8px; }
.rg-quiz-done-label { font-size: 16px; color: #3a6a7a; margin-bottom: 32px; }
`

// ─── Pipeline data ───────────────────────────────────────────────────────────
const PIPELINE_STEPS = [
  { id: 0, icon: '💬', label: 'User Query', type: 'query', content: 'What are the main causes of inflation?' },
  { id: 1, icon: '🔢', label: 'Embed Query', type: 'embed', content: 'Query converted to vector: [0.82, 0.14, 0.67, 0.31, 0.55, 0.22, 0.78, 0.09, ...]' },
  { id: 2, icon: '🔍', label: 'Vector Search', type: 'search', content: 'Scanning 10,000 document chunks for semantic similarity...' },
  { id: 3, icon: '📄', label: 'Retrieved Chunks', type: 'retrieve', content: 'Top 3 chunks retrieved from knowledge base' },
  { id: 4, icon: '🧩', label: 'Prompt Assembly', type: 'assemble', content: 'Query + retrieved context combined into structured prompt' },
  { id: 5, icon: '✨', label: 'LLM Generation', type: 'generate', content: 'Inflation is primarily caused by demand-pull factors (excess consumer spending), cost-push factors (rising production costs), and built-in inflation (wage-price spiral). Central banks typically respond by raising interest rates to reduce money supply.' }
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
const INTRO_DOCS = [
  {
    id: 0, label: 'Company FAQ', icon: '🏢',
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
    id: 1, label: 'Study Notes', icon: '📚',
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
    id: 2, label: 'Product Manual', icon: '🔧',
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

// ─── Chunk color palette ──────────────────────────────────────────────────────
const CHUNK_COLORS = [
  { bg: 'rgba(6,182,212,0.12)', border: 'rgba(6,182,212,0.3)' },
  { bg: 'rgba(129,140,248,0.12)', border: 'rgba(129,140,248,0.3)' },
  { bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.3)' },
  { bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.3)' },
]

const TEMPLATE_CONFIGS = {
  grounded: "You are a helpful assistant. Answer ONLY using the provided context. Do not use prior knowledge.",
  reasoning: "You are an analytical assistant. Use the context to reason step-by-step before giving your final answer.",
  citations: "You are a precise assistant. Cite the specific chunk (e.g. [Chunk A]) for each claim in your response."
}

export default function RAG() {
  const [tab, setTab] = useState(0)
  const TABS = ['What is RAG?', 'Pipeline', 'Chunking', 'Retrieval', 'Prompt Assembly', 'RAG vs Fine-Tuning', 'Quiz']

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

      <div className="rg-hero">
        <div className="rg-eyebrow">LLM Architecture</div>
        <h1 className="rg-title">Retrieval-<span>Augmented</span> Generation</h1>
        <p className="rg-subtitle">See how RAG pipelines retrieve, chunk, and inject knowledge into LLM prompts — making AI systems accurate, updatable, and grounded in truth.</p>
      </div>

      <div className="rg-tabs">
        {TABS.map((t, i) => (
          <button key={t} className={`rg-tab${tab === i ? ' active' : ''}`} onClick={() => setTab(i)}>{t}</button>
        ))}
      </div>

      <div className="rg-panel">

        {/* ── Tab 0: What is RAG? ───────────────────────────────────────────── */}
        {tab === 0 && (
          <div>
            <div className="rg-section-title">What is RAG?</div>
            <p className="rg-section-sub">
              RAG stands for <strong style={{color:'#c0e8f0'}}>Retrieval-Augmented Generation</strong>. It gives an AI model access to your own documents — so it can answer questions accurately based on information it was never trained on.
            </p>

            {/* Flow diagram */}
            <div style={{display:'flex',alignItems:'center',gap:6,flexWrap:'wrap',margin:'24px 0',padding:'20px',background:'rgba(6,182,212,0.04)',borderRadius:12,border:'1px solid rgba(6,182,212,0.12)'}}>
              {[{label:'Your Documents',icon:'📄'}, null, {label:'Knowledge Base',icon:'🗄️'}, null, {label:'Retrieve',icon:'🔍'}, null, {label:'LLM',icon:'✨'}, null, {label:'Grounded Answer',icon:'💬',highlight:true}].map((item, i) =>
                item === null
                  ? <div key={i} style={{color:'#06b6d4',fontSize:18,padding:'0 2px'}}>→</div>
                  : <div key={item.label} style={{background:item.highlight?'rgba(6,182,212,0.15)':'rgba(255,255,255,0.03)',border:`1px solid ${item.highlight?'rgba(6,182,212,0.4)':'#0d1e28'}`,borderRadius:8,padding:'10px 14px',textAlign:'center',minWidth:88}}>
                      <div style={{fontSize:20,marginBottom:4}}>{item.icon}</div>
                      <div style={{fontSize:12,color:item.highlight?'#06b6d4':'#6a9aaa',fontFamily:'IBM Plex Mono',lineHeight:1.3}}>{item.label}</div>
                    </div>
              )}
            </div>

            {/* What is a knowledge base */}
            <div className="rg-card" style={{marginBottom:28}}>
              <div style={{fontFamily:'IBM Plex Sans',fontSize:17,fontWeight:700,color:'#fff',marginBottom:8}}>What is a Knowledge Base?</div>
              <p style={{fontSize:14,color:'#4a8a9a',lineHeight:1.7,marginBottom:14}}>
                A knowledge base is a collection of your own text that the RAG system indexes and searches. Think of it as giving the AI a reference library to consult before answering. It can hold any text-based content:
              </p>
              <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                {[['📄','PDFs & docs'],['📧','Emails'],['📝','Notes'],['🌐','Web pages'],['💬','Chat logs'],['📊','Spreadsheets'],['📖','Books'],['🎧','Transcripts']].map(([icon,lbl]) => (
                  <div key={lbl} style={{background:'rgba(6,182,212,0.06)',border:'1px solid rgba(6,182,212,0.15)',borderRadius:8,padding:'8px 12px',fontSize:13,color:'#6ab8cc',display:'flex',alignItems:'center',gap:6}}>
                    <span>{icon}</span><span>{lbl}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Try it yourself */}
            <div style={{fontFamily:'IBM Plex Sans',fontSize:18,fontWeight:700,color:'#fff',marginBottom:6}}>Try It Yourself</div>
            <p style={{fontSize:14,color:'#3a6a7a',marginBottom:16,lineHeight:1.7}}>
              Pick a sample knowledge base and ask any question about it. The system retrieves the most relevant sentences and assembles a prompt — just like a real RAG pipeline.
            </p>

            {/* Doc picker */}
            <div style={{display:'flex',gap:10,marginBottom:20,flexWrap:'wrap'}}>
              {INTRO_DOCS.map(doc => (
                <button key={doc.id} onClick={() => changeIntroDoc(doc.id)} style={{background:introDocId===doc.id?'rgba(6,182,212,0.12)':'transparent',border:`1px solid ${introDocId===doc.id?'#06b6d4':'#0d1e28'}`,color:introDocId===doc.id?'#06b6d4':'#3a6a7a',fontFamily:'IBM Plex Mono',fontSize:13,padding:'8px 16px',borderRadius:8,cursor:'pointer',display:'flex',alignItems:'center',gap:8,transition:'all 0.18s'}}>
                  <span>{doc.icon}</span><span>{doc.label}</span>
                </button>
              ))}
            </div>

            {/* Document with highlighted retrieved sentences */}
            {(() => {
              const doc = INTRO_DOCS.find(d => d.id === introDocId)
              const retrievedIndices = new Set((introRetrieved?.docId === introDocId ? introRetrieved.results : []).map(r => r.i))
              return (
                <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid #0d1e28',borderRadius:12,padding:20,marginBottom:16}}>
                  <div style={{fontSize:12,color:'#3a6a7a',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:12}}>{doc.icon} {doc.label} · {doc.sentences.length} sentences</div>
                  <div style={{display:'flex',flexDirection:'column',gap:6}}>
                    {doc.sentences.map((s, i) => {
                      const isRetrieved = retrievedIndices.has(i)
                      const rank = (introRetrieved?.results || []).findIndex(r => r.i === i)
                      return (
                        <div key={i} style={{padding:'8px 12px',borderRadius:6,background:isRetrieved?'rgba(6,182,212,0.1)':'transparent',border:isRetrieved?'1px solid rgba(6,182,212,0.3)':'1px solid transparent',fontSize:13,color:isRetrieved?'#c0e8f0':'#4a7a8a',lineHeight:1.6,transition:'all 0.2s',display:'flex',alignItems:'flex-start',gap:8}}>
                          {isRetrieved && <span style={{fontSize:11,color:'#06b6d4',fontFamily:'IBM Plex Mono',background:'rgba(6,182,212,0.15)',padding:'1px 6px',borderRadius:4,whiteSpace:'nowrap',marginTop:1}}>#{rank+1}</span>}
                          <span>{s}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })()}

            {/* Question input */}
            <div style={{marginBottom:10}}>
              <div style={{fontSize:12,color:'#3a6a7a',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:8}}>Ask a question</div>
              <div style={{display:'flex',gap:8}}>
                <input type="text" className="rg-sim-input" value={introQuestion} onChange={e => setIntroQuestion(e.target.value)} onKeyDown={e => e.key === 'Enter' && runIntroAsk()} placeholder="Type a question about the document..." />
                <button className="rg-btn" onClick={() => runIntroAsk()}>Ask →</button>
              </div>
            </div>

            {/* Example question chips */}
            <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:24,alignItems:'center'}}>
              <span style={{fontSize:12,color:'#2a4a5a'}}>Try:</span>
              {INTRO_DOCS.find(d => d.id === introDocId).exampleQs.map(q => (
                <button key={q} className="rg-eq-chip" onClick={() => runIntroAsk(q)}>{q}</button>
              ))}
            </div>

            {/* Results */}
            {introRetrieved && introRetrieved.docId === introDocId && (
              <div>
                {introRetrieved.results.length === 0 ? (
                  <div className="rg-card-plain" style={{color:'#f87171',textAlign:'center',padding:'20px'}}>No relevant chunks found. Try a more specific question.</div>
                ) : (
                  <>
                    <div style={{fontFamily:'IBM Plex Sans',fontSize:15,fontWeight:700,color:'#fff',marginBottom:10}}>Retrieved chunks → Assembled prompt</div>
                    <div style={{background:'#020508',border:'1px solid #0d1e28',borderRadius:10,padding:16,fontFamily:'IBM Plex Mono',fontSize:12,lineHeight:1.7,marginBottom:12,whiteSpace:'pre-wrap'}}>
                      <span style={{color:'#3a6a7a'}}>{'[SYSTEM]\nYou are a helpful assistant. Answer using ONLY the provided context.\n\n'}</span>
                      <span style={{color:'#06b6d4'}}>{'[CONTEXT]\n'}{introRetrieved.results.map((r,i) => `Chunk ${i+1}: ${r.s}`).join('\n')}{'\n\n'}</span>
                      <span style={{color:'#c0e8f0'}}>{'[QUESTION]\n'}{introRetrieved.question}</span>
                    </div>
                    <div className="rg-answer-label">LLM Answer</div>
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
            <div className="rg-section-title">The RAG Pipeline</div>
            <p className="rg-section-sub">Step through each stage of a Retrieval-Augmented Generation pipeline. Click "Next Step" to advance.</p>

            {PIPELINE_STEPS.map((step, i) => {
              const isActive = i === pipelineStep
              const isDone = i < pipelineStep
              return (
                <div
                  key={step.id}
                  className={`rg-pipeline-step${isActive ? ' active' : isDone ? ' done' : ''}`}
                >
                  <div className="rg-step-icon">{step.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div className={`rg-step-num${isActive ? ' active' : ''}`}>STEP {i + 1} OF 6</div>
                    <div className={`rg-step-label${isActive ? ' active' : ''}`}>{step.label}</div>
                    {(isActive || isDone) && (
                      <div className={`rg-step-content${isActive ? ' active' : ''}`}>
                        {isActive && i === 5 ? (
                          <span className="rg-streaming">
                            {streaming}
                            {isStreaming && <span className="rg-cursor" />}
                          </span>
                        ) : step.content}
                      </div>
                    )}
                  </div>
                  {isDone && <div style={{ color: '#06b6d4', fontSize: 18, marginTop: 2 }}>✓</div>}
                </div>
              )
            })}

            <div style={{ marginTop: 24, display: 'flex', gap: 0 }}>
              {pipelineStep < 5 && (
                <button className="rg-btn" onClick={advancePipeline}>Next Step →</button>
              )}
              <button className="rg-btn-ghost" onClick={resetPipeline}>Reset</button>
            </div>

            <div style={{ marginTop: 40 }}>
              <div className="rg-section-title" style={{ fontSize: 18, marginBottom: 16 }}>Why RAG?</div>
              <div className="rg-benefits-grid">
                {[
                  { icon: '📅', title: 'Overcomes Knowledge Cutoff', desc: 'Inject current information without retraining the model.' },
                  { icon: '🎯', title: 'Reduces Hallucinations', desc: 'Grounding answers in real retrieved text cuts fabrication dramatically.' },
                  { icon: '🔒', title: 'Enables Private Data Q&A', desc: "Query your company's internal documents with full privacy control." },
                  { icon: '⚡', title: 'No Retraining Required', desc: 'Update the knowledge base in minutes, not weeks.' },
                ].map(b => (
                  <div key={b.title} className="rg-benefit-card">
                    <div className="rg-benefit-icon">{b.icon}</div>
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
            <div className="rg-section-title">Document Chunking</div>
            <p className="rg-section-sub">Documents must be split into chunks before they can be embedded and indexed. The chunking strategy directly affects retrieval quality.</p>

            <div className="rg-controls">
              <div className="rg-slider-wrap">
                <span className="rg-slider-label">Chunk size:</span>
                <input
                  type="range" min={2} max={6} step={1}
                  value={chunkSize}
                  onChange={e => setChunkSize(Number(e.target.value))}
                  className="rg-slider"
                  disabled={chunkStrategy === 'paragraph'}
                />
                <span className="rg-slider-val">~{chunkSize * 25} tokens/chunk</span>
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
                    style={{ background: col.bg, borderLeft: `3px solid ${col.border.replace('0.3', '0.5')}`, paddingLeft: 6, marginRight: 2, display: 'inline' }}
                    title={`Chunk ${ci + 1}`}
                  >
                    {chunk.join(' ')}
                    {ci < chunks.length - 1 && <span style={{ color: col.border, fontFamily: 'IBM Plex Mono', fontSize: 11, margin: '0 4px' }}> ‖ </span>}
                  </span>
                )
              })}
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
              {chunks.map((_, ci) => {
                const col = CHUNK_COLORS[ci % CHUNK_COLORS.length]
                return (
                  <span key={ci} style={{ fontSize: 12, fontFamily: 'IBM Plex Mono', padding: '2px 8px', borderRadius: 4, background: col.bg, color: col.border, border: `1px solid ${col.border}` }}>
                    {`Chunk ${ci + 1} · ${chunks[ci].join(' ').split(/\s+/).length} words`}
                  </span>
                )
              })}
            </div>

            <div className="rg-overlap-info">
              <div className="rg-overlap-title">What is chunk overlap?</div>
              <div className="rg-overlap-text">
                When documents are split at fixed boundaries, sentences that span two chunks get severed — losing context. Chunk overlap (typically 10–20%) copies the tail of each chunk into the head of the next, ensuring boundary-spanning content is fully captured in at least one retrievable unit. For a 100-token chunk with 20% overlap, each chunk shares 20 tokens with its neighbor.
              </div>
            </div>
          </div>
        )}

        {/* ── Tab 3: Retrieval ──────────────────────────────────────────── */}
        {tab === 3 && (
          <div>
            <div className="rg-section-title">Semantic Retrieval</div>
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
              <div className="rg-card-plain" style={{ textAlign: 'center', color: '#3a6a7a', padding: '40px 24px' }}>
                Select a query above to see retrieval results
              </div>
            )}

            {selectedQuery !== null && sortedChunks.map((chunk, i) => (
              <div key={chunk.id} className={`rg-chunk-card${i < 3 ? ' top-result' : ''}`}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <div className="rg-chunk-title">{chunk.title}</div>
                  {i < 3 && <span className="rg-top-badge">Top {i+1}</span>}
                </div>
                <div className="rg-chunk-text">{chunk.text}</div>
                <div className="rg-score-row">
                  <div className="rg-score-bar-bg">
                    <div className="rg-score-bar" style={{ width: `${chunk.score * 100}%`, background: i < 3 ? '#06b6d4' : '#1a3a4a' }} />
                  </div>
                  <div className="rg-score-val" style={{ color: i < 3 ? '#06b6d4' : '#2a4a5a' }}>{chunk.score.toFixed(2)}</div>
                </div>
              </div>
            ))}

            <div className="rg-quality-section">
              <div className="rg-section-title" style={{ fontSize: 17, marginBottom: 6 }}>Query Quality Matters</div>
              <p style={{ fontSize: 14, color: '#3a6a7a', marginBottom: 14 }}>Vague queries return scattered scores. Specific queries surface a clear winner.</p>
              <div className="rg-quality-grid">
                <div className="rg-quality-col vague">
                  <div className="rg-quality-label vague">Vague query</div>
                  <div className="rg-quality-query">"Tell me about security"</div>
                  <div className="rg-quality-scores">
                    {[['Data Security', 0.42], ['Cybersecurity', 0.39], ['Networks', 0.35], ['Economics', 0.33]].map(([lbl, val]) => (
                      <div key={lbl} className="rg-quality-score-row">
                        <span className="lbl">{lbl}</span>
                        <div className="bar-bg"><div className="bar" style={{ width: `${val * 100}%`, background: '#f87171' }} /></div>
                        <span className="val">{val.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rg-quality-col specific">
                  <div className="rg-quality-label specific">Specific query</div>
                  <div className="rg-quality-query">"How to prevent SQL injection attacks"</div>
                  <div className="rg-quality-scores">
                    {[['Data Security', 0.94], ['Cybersecurity', 0.61], ['Networks', 0.22], ['Economics', 0.08]].map(([lbl, val]) => (
                      <div key={lbl} className="rg-quality-score-row">
                        <span className="lbl">{lbl}</span>
                        <div className="bar-bg"><div className="bar" style={{ width: `${val * 100}%`, background: '#34d399' }} /></div>
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
            <div className="rg-section-title">Prompt Assembly</div>
            <p className="rg-section-sub">Toggle context chunks on and off to see how the assembled prompt — and the LLM's answer — change in real time.</p>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: '#3a6a7a', marginBottom: 8, letterSpacing: '0.1em', textTransform: 'uppercase' }}>System prompt template</div>
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
                    <div key={c.id} className={`rg-chunk-toggle${on ? ' included' : ' excluded'}`} onClick={() => toggleChunk(c.id)}>
                      <div className="rg-chunk-toggle-title">{c.title}</div>
                      <div className="rg-chunk-toggle-text">{c.text}</div>
                      <div className={`rg-chunk-toggle-status${on ? ' on' : ' off'}`}>{on ? '✓ included' : '✗ excluded'}</div>
                    </div>
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
                <div className="rg-token-count">Estimated tokens: <span>{tokenCount}</span></div>
              </div>
            </div>

            <div className="rg-answer-label">LLM Answer</div>
            <div className="rg-answer-box">{answer}</div>
          </div>
        )}

        {/* ── Tab 5: RAG vs Fine-Tuning ─────────────────────────────────── */}
        {tab === 5 && (
          <div>
            <div className="rg-section-title">RAG vs Fine-Tuning</div>
            <p className="rg-section-sub">Both techniques adapt LLMs to specific domains — but in fundamentally different ways. Click any row to expand.</p>

            <table className="rg-compare-table">
              <thead>
                <tr>
                  <th style={{ width: '22%' }}>Dimension</th>
                  <th className="rag-col">RAG</th>
                  <th className="ft-col">Fine-Tuning</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row, i) => (
                  <>
                    <tr
                      key={`row-${i}`}
                      className={`rg-compare-row${expandedRow === i ? ' expanded' : ''}`}
                      onClick={() => toggleRow(i)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>
                        <div className="rg-row-expand">
                          <span className={`rg-row-expand-arrow${expandedRow === i ? ' open' : ''}`}>▶</span>
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
                  </>
                ))}
              </tbody>
            </table>

            <div className="rg-section-title" style={{ fontSize: 17, marginBottom: 6 }}>When to use which?</div>
            <p style={{ fontSize: 14, color: '#3a6a7a', marginBottom: 14 }}>Click a scenario to see the recommended approach.</p>
            <div className="rg-scenario-grid">
              {SCENARIOS.map(sc => (
                <div
                  key={sc.id}
                  className={`rg-scenario-card${selectedScenario === sc.id ? ' selected' : ''}`}
                  onClick={() => setSelectedScenario(prev => prev === sc.id ? null : sc.id)}
                >
                  <div className="rg-scenario-title">{sc.title}</div>
                  {selectedScenario === sc.id && (
                    <>
                      <div className={`rg-scenario-rec ${sc.recommendation}`}>
                        {sc.recommendation === 'rag' ? 'Use RAG' : sc.recommendation === 'finetune' ? 'Fine-Tune' : 'Hybrid'}
                      </div>
                      <div className="rg-scenario-rationale">{sc.rationale}</div>
                    </>
                  )}
                </div>
              ))}
            </div>

            <div className="rg-hybrid-box">
              <div className="rg-hybrid-title">Hybrid RAG + Fine-Tuning</div>
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
                <button className="rg-btn" onClick={retake}>Retake Quiz</button>
              </div>
            ) : currentQ ? (
              <>
                <div className="rg-quiz-progress">
                  <div className="rg-quiz-progress-bar-bg">
                    <div className="rg-quiz-progress-bar" style={{ width: `${(qNum / SESSION_SIZE) * 100}%` }} />
                  </div>
                  <span className="rg-quiz-progress-label">{qNum + 1} / {SESSION_SIZE}</span>
                </div>

                <div className={`rg-diff-badge ${currentQ.difficulty}`}>
                  {currentQ.difficulty === 'easy' ? '◎ Easy' : currentQ.difficulty === 'medium' ? '◈ Medium' : '◆ Hard'}
                </div>

                <div className="rg-quiz-q">{currentQ.q}</div>

                <div className="rg-quiz-opts">
                  {currentQ.opts.map((opt, i) => {
                    let cls = 'rg-quiz-opt'
                    if (chosen !== null) {
                      if (i === currentQ.correct) cls += ' correct'
                      else if (i === chosen) cls += ' wrong'
                      else cls += ' neutral'
                    }
                    return (
                      <button key={i} className={cls} onClick={() => handleQuiz(i)} disabled={chosen !== null}>
                        <span style={{ color: '#3a6a7a', marginRight: 10, fontFamily: 'IBM Plex Mono', fontSize: 13 }}>{String.fromCharCode(65 + i)}.</span>
                        {opt}
                      </button>
                    )
                  })}
                </div>

                {chosen !== null && (
                  <>
                    <div className="rg-quiz-explanation">
                      <strong>{chosen === currentQ.correct ? 'Correct!' : 'Not quite.'}</strong>{' '}
                      {currentQ.explanation}
                    </div>
                    <button className="rg-btn" onClick={nextQ}>
                      {qNum + 1 >= SESSION_SIZE ? 'See Results' : 'Next Question →'}
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
