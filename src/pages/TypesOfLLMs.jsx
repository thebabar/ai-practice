import { useState, useEffect, useRef } from 'react'
import NavBar from '../components/NavBar.jsx'

const css = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap');

.tl-root { min-height: 100vh; background: #050810; color: #e0e8f0; font-family: 'IBM Plex Mono', monospace; overflow-x: hidden; }

.tl-hero { text-align: center; padding: 48px 24px 28px; position: relative; }
.tl-hero::before { content: ''; position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 700px; height: 320px; background: radial-gradient(ellipse at 50% 0%, rgba(251,146,60,0.09) 0%, transparent 70%); pointer-events: none; }
.tl-eyebrow { font-size: 16px; letter-spacing: 0.22em; color: #fb923c; text-transform: uppercase; margin-bottom: 14px; }
.tl-title { font-family: 'IBM Plex Sans', sans-serif; font-size: clamp(28px, 5vw, 52px); font-weight: 800; letter-spacing: -0.02em; color: #fff; line-height: 1.05; margin-bottom: 12px; }
.tl-title span { color: #fb923c; }
.tl-subtitle { font-size: 16px; color: #7a6050; max-width: 540px; margin: 0 auto 32px; line-height: 1.8; }

.tl-tabs { display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; padding: 0 16px 32px; }
.tl-tab { background: transparent; border: 1px solid #2a1a0a; color: #7a6050; font-family: 'IBM Plex Mono', monospace; font-size: 16px; letter-spacing: 0.1em; padding: 8px 16px; border-radius: 6px; cursor: pointer; transition: all 0.18s; text-transform: uppercase; }
.tl-tab:hover { border-color: #fb923c; color: #fb923c; }
.tl-tab.active { background: rgba(251,146,60,0.1); border-color: #fb923c; color: #fb923c; }
.tl-tab-selector { background: rgba(251,146,60,0.07) !important; border-left: 2px solid rgba(251,146,60,0.4) !important; }
.tl-tab-pulse { display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #fb923c; margin-left: 7px; vertical-align: middle; animation: tl-ping 1.8s ease-in-out infinite; }
@keyframes tl-ping { 0%,100% { opacity:0.9; transform:scale(1); } 50% { opacity:0.3; transform:scale(1.6); } }

.tl-panel { max-width: 920px; margin: 0 auto; padding: 0 20px 80px; }
.tl-section-title { font-family: 'IBM Plex Sans', sans-serif; font-size: 22px; font-weight: 700; color: #fff; margin-bottom: 8px; }
.tl-section-sub { font-size: 16px; color: #7a6050; margin-bottom: 28px; line-height: 1.8; }

.tl-card { background: #0a0806; border: 1px solid #1e1008; border-radius: 14px; padding: 24px; margin-bottom: 20px; }
.tl-card-title { font-family: 'IBM Plex Sans', sans-serif; font-size: 16px; font-weight: 700; color: #fb923c; margin-bottom: 16px; }

/* ── Overview 2x2 grid ── */
.tl-overview-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 20px; }
@media (max-width: 600px) { .tl-overview-grid { grid-template-columns: 1fr; } }
.tl-overview-cell { background: #0d0b08; border: 1px solid #1e1008; border-radius: 12px; padding: 18px; }
.tl-overview-cell-title { font-family: 'IBM Plex Sans', sans-serif; font-size: 16px; font-weight: 700; color: #fb923c; margin-bottom: 6px; }
.tl-overview-cell-desc { font-size: 16px; color: #7a6050; line-height: 1.7; }

/* ── Bar chart ── */
.tl-bar-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.tl-bar-label { width: 160px; flex-shrink: 0; font-size: 16px; color: #c0a080; }
.tl-bar-bg { flex: 1; background: #0d0b08; border-radius: 4px; height: 28px; overflow: hidden; border: 1px solid #1e1008; position: relative; }
.tl-bar-fill { height: 100%; border-radius: 4px; display: flex; align-items: center; padding: 0 10px; gap: 8px; transition: width 0.6s cubic-bezier(.4,0,.2,1); }
.tl-bar-params { font-size: 12px; color: rgba(255,255,255,0.7); font-family: 'IBM Plex Mono', monospace; white-space: nowrap; }
.tl-bar-cost { font-size: 12px; color: rgba(255,255,255,0.5); margin-left: auto; white-space: nowrap; }

/* ── Insight callout ── */
.tl-insight { background: rgba(251,146,60,0.05); border: 1px solid rgba(251,146,60,0.18); border-radius: 8px; padding: 12px 16px; font-size: 16px; color: #c09060; line-height: 1.7; margin: 16px 0; }
.tl-insight strong { color: #fb923c; }

/* ── Taxonomy tree ── */
.tl-tree { display: flex; gap: 0; margin: 0 auto; }
.tl-tree-root { display: flex; flex-direction: column; align-items: center; gap: 0; flex-shrink: 0; }
.tl-tree-root-box { background: rgba(251,146,60,0.08); border: 1px solid rgba(251,146,60,0.35); border-radius: 10px; padding: 10px 20px; font-family: 'IBM Plex Sans', sans-serif; font-size: 16px; font-weight: 700; color: #fb923c; white-space: nowrap; }
.tl-tree-stem { width: 2px; height: 40px; background: rgba(251,146,60,0.3); }
.tl-tree-hbar { width: 100%; height: 2px; background: rgba(251,146,60,0.2); }
.tl-tree-branches { display: flex; justify-content: space-between; width: 100%; }
.tl-tree-branch { display: flex; flex-direction: column; align-items: center; flex: 1; }
.tl-tree-branch-stem { width: 2px; height: 30px; background: rgba(251,146,60,0.2); }
.tl-tree-node { border-radius: 10px; padding: 12px 14px; text-align: center; max-width: 200px; }
.tl-tree-node-title { font-family: 'IBM Plex Sans', sans-serif; font-size: 14px; font-weight: 700; margin-bottom: 6px; }
.tl-tree-node-desc { font-size: 12px; line-height: 1.5; opacity: 0.8; }
.tl-tree-note { font-size: 11px; margin-top: 6px; opacity: 0.6; font-style: italic; }
.tl-taxonomy-wrap { overflow-x: auto; padding-bottom: 8px; }

/* ── Decoder tab ── */
.tl-token-row { display: flex; flex-wrap: wrap; gap: 8px; align-items: flex-end; margin: 16px 0; min-height: 64px; }
.tl-token-chip { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.tl-token-prob { font-size: 12px; font-family: 'IBM Plex Mono', monospace; }
.tl-token-text { padding: 6px 12px; border-radius: 6px; font-family: 'IBM Plex Mono', monospace; font-size: 16px; font-weight: 500; border: 1px solid; transition: all 0.3s; }
.tl-token-cursor { display: inline-block; width: 2px; height: 20px; background: #fb923c; animation: tl-blink 0.8s step-end infinite; vertical-align: middle; }
@keyframes tl-blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }

.tl-decoder-controls { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 16px; }
.tl-btn { background: rgba(251,146,60,0.1); border: 1px solid #fb923c; color: #fb923c; font-family: 'IBM Plex Mono', monospace; font-size: 16px; padding: 8px 18px; border-radius: 6px; cursor: pointer; letter-spacing: 0.08em; text-transform: uppercase; transition: all 0.18s; }
.tl-btn:hover { background: rgba(251,146,60,0.2); }
.tl-btn.secondary { background: transparent; border-color: #2a1a0a; color: #7a6050; }
.tl-btn.secondary:hover { border-color: #fb923c; color: #fb923c; }

/* ── Causal mask ── */
.tl-mask-grid { display: grid; gap: 5px; width: fit-content; margin: 14px auto; }
.tl-mask-dot { width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.tl-mask-dot.visible { background: rgba(251,146,60,0.25); border: 1.5px solid #fb923c; }
.tl-mask-dot.hidden { background: #0a0806; border: 1.5px solid #2a1a0a; }

/* ── Model cards grid ── */
.tl-model-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
@media (max-width: 640px) { .tl-model-grid { grid-template-columns: 1fr; } }
.tl-model-card { background: #0d0b08; border: 1px solid; border-radius: 10px; padding: 14px; }
.tl-model-name { font-family: 'IBM Plex Sans', sans-serif; font-size: 16px; font-weight: 700; margin-bottom: 3px; }
.tl-model-maker { font-size: 12px; color: #5a4030; margin-bottom: 6px; font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.06em; }
.tl-model-use { font-size: 16px; color: #9a8060; line-height: 1.5; }

/* ── Encoder attention heatmap ── */
.tl-token-chips { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px; }
.tl-chip { padding: 5px 12px; border-radius: 6px; font-family: 'IBM Plex Mono', monospace; font-size: 16px; cursor: pointer; border: 1px solid; transition: all 0.18s; }
.tl-chip.active { background: rgba(251,146,60,0.15); border-color: #fb923c; color: #fb923c; }
.tl-chip.masked { background: rgba(251,146,60,0.08); border-color: rgba(251,146,60,0.4); color: #fb923c; font-style: italic; }
.tl-chip.inactive { background: transparent; border-color: #2a1a0a; color: #6a5040; }
.tl-attn-rows { display: flex; flex-direction: column; gap: 6px; margin: 8px 0; }
.tl-attn-row { display: flex; align-items: center; gap: 10px; }
.tl-attn-token { font-size: 16px; color: #c0a080; width: 70px; flex-shrink: 0; font-family: 'IBM Plex Mono', monospace; }
.tl-attn-bar-bg { flex: 1; background: #0d0b08; border-radius: 4px; height: 20px; overflow: hidden; border: 1px solid #1e1008; }
.tl-attn-bar-fill { height: 100%; background: #fb923c; border-radius: 4px; transition: width 0.4s cubic-bezier(.4,0,.2,1); }
.tl-attn-val { font-size: 12px; color: #5a4030; width: 36px; text-align: right; flex-shrink: 0; }

/* ── Mask prediction ── */
.tl-mask-preds { display: flex; flex-direction: column; gap: 6px; margin-top: 10px; }
.tl-mask-pred-row { display: flex; align-items: center; gap: 10px; }
.tl-mask-pred-token { font-size: 16px; color: #c0a080; width: 80px; flex-shrink: 0; font-family: 'IBM Plex Mono', monospace; }
.tl-mask-pred-bar-bg { flex: 1; background: #0d0b08; border-radius: 4px; height: 18px; overflow: hidden; border: 1px solid #1e1008; }
.tl-mask-pred-bar-fill { height: 100%; border-radius: 4px; transition: width 0.4s cubic-bezier(.4,0,.2,1); }
.tl-mask-pred-pct { font-size: 12px; color: #5a4030; width: 36px; text-align: right; flex-shrink: 0; }

/* ── Use case grid 2x2 ── */
.tl-usecase-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 4px; }
@media (max-width: 600px) { .tl-usecase-grid { grid-template-columns: 1fr; } }
.tl-usecase-cell { background: #0d0b08; border: 1px solid #1e1008; border-radius: 10px; padding: 14px; }
.tl-usecase-title { font-family: 'IBM Plex Sans', sans-serif; font-size: 16px; font-weight: 700; color: #fb923c; margin-bottom: 4px; }
.tl-usecase-desc { font-size: 16px; color: #7a6050; line-height: 1.6; }

/* ── Enc-Dec two column ── */
.tl-encdec-layout { display: grid; grid-template-columns: 1fr 48px 1fr; gap: 0; align-items: stretch; margin: 20px 0; }
@media (max-width: 640px) { .tl-encdec-layout { grid-template-columns: 1fr; } }
.tl-encdec-box { border-radius: 10px; padding: 16px; border: 1px solid; }
.tl-encdec-bridge { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; }
.tl-encdec-bridge-line { flex: 1; width: 2px; background: rgba(251,146,60,0.2); }
.tl-encdec-bridge-label { font-size: 9px; color: #fb923c; letter-spacing: 0.12em; text-transform: uppercase; white-space: nowrap; writing-mode: vertical-rl; padding: 6px 0; }
.tl-encdec-bridge-arrow { font-size: 14px; color: #fb923c; }
.tl-encdec-title { font-family: 'IBM Plex Sans', sans-serif; font-size: 14px; font-weight: 700; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.1em; }
.tl-encdec-prefix { font-size: 12px; font-family: 'IBM Plex Mono', monospace; padding: 4px 8px; border-radius: 4px; background: rgba(251,146,60,0.08); color: #fb923c; border: 1px solid rgba(251,146,60,0.2); display: inline-block; margin-bottom: 8px; }
.tl-encdec-text { font-size: 16px; color: #c0a080; line-height: 1.6; }
.tl-encdec-output { font-family: 'IBM Plex Mono', monospace; font-size: 16px; color: #fb923c; font-style: italic; }
.tl-task-btns { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
.tl-task-btn { padding: 7px 16px; border-radius: 6px; font-family: 'IBM Plex Mono', monospace; font-size: 16px; cursor: pointer; border: 1px solid; transition: all 0.18s; text-transform: uppercase; letter-spacing: 0.06em; background: transparent; }
.tl-task-btn.active { background: rgba(251,146,60,0.12); }
.tl-task-btn:hover { opacity: 0.85; }

/* ── Multimodal ── */
.tl-modality-btns { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }
.tl-mod-btn { padding: 8px 16px; border-radius: 8px; font-family: 'IBM Plex Mono', monospace; font-size: 16px; cursor: pointer; border: 1px solid; transition: all 0.18s; background: transparent; color: #7a6050; border-color: #2a1a0a; display: flex; align-items: center; gap: 8px; }
.tl-mod-btn.active { background: rgba(251,146,60,0.1); border-color: #fb923c; color: #fb923c; }
.tl-mod-btn:hover { border-color: #fb923c; color: #fb923c; }

.tl-pipeline { display: flex; align-items: center; gap: 0; flex-wrap: wrap; margin: 16px 0; }
.tl-pipeline-step { padding: 8px 12px; border-radius: 8px; font-size: 16px; font-family: 'IBM Plex Mono', monospace; background: rgba(251,146,60,0.06); border: 1px solid var(--mod-color, rgba(251,146,60,0.3)); color: #c0a080; white-space: nowrap; }
.tl-pipeline-arrow { color: #5a4030; padding: 0 6px; font-size: 16px; flex-shrink: 0; }
.tl-pipeline-meta { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin: 14px 0; }
@media (max-width: 600px) { .tl-pipeline-meta { grid-template-columns: 1fr; } }
.tl-pipeline-meta-item { background: #0d0b08; border: 1px solid #1e1008; border-radius: 8px; padding: 10px 12px; }
.tl-pipeline-meta-label { font-size: 12px; color: #5a4030; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 4px; }
.tl-pipeline-meta-val { font-size: 16px; color: #c0a080; }

/* ── Capability matrix ── */
.tl-matrix { width: 100%; border-collapse: collapse; font-size: 16px; }
.tl-matrix th { font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: #7a6050; padding: 6px 10px; text-align: center; border-bottom: 1px solid #1e1008; letter-spacing: 0.08em; }
.tl-matrix th:first-child { text-align: left; }
.tl-matrix td { padding: 7px 10px; text-align: center; border-bottom: 1px solid #0d0b08; font-size: 16px; }
.tl-matrix td:first-child { text-align: left; color: #c0a080; font-size: 16px; font-family: 'IBM Plex Mono', monospace; }
.tl-matrix-yes { color: #34d399; }
.tl-matrix-no { color: rgba(239,68,68,0.45); }

/* ── Criteria toggles ── */
.tl-criteria-form { display: flex; flex-direction: column; gap: 18px; }
.tl-criteria-row { display: flex; flex-direction: column; gap: 8px; }
.tl-criteria-label { font-size: 16px; color: #c0a080; line-height: 1.5; }
.tl-toggle-pair { display: flex; gap: 8px; }
.tl-toggle { padding: 6px 18px; border-radius: 6px; font-family: 'IBM Plex Mono', monospace; font-size: 16px; cursor: pointer; border: 1px solid; transition: all 0.18s; background: transparent; }
.tl-toggle.on { background: rgba(251,146,60,0.12); border-color: #fb923c; color: #fb923c; }
.tl-toggle.off { border-color: #2a1a0a; color: #5a4030; }
.tl-toggle:hover { border-color: #fb923c; color: #fb923c; }
.tl-pill-group { display: flex; gap: 8px; flex-wrap: wrap; }
.tl-pill-btn { padding: 6px 14px; border-radius: 20px; font-family: 'IBM Plex Mono', monospace; font-size: 16px; cursor: pointer; border: 1px solid; transition: all 0.18s; background: transparent; }
.tl-pill-btn.active { background: rgba(251,146,60,0.12); border-color: #fb923c; color: #fb923c; }
.tl-pill-btn.inactive { border-color: #2a1a0a; color: #5a4030; }
.tl-pill-btn:hover { border-color: #fb923c; color: #fb923c; }

/* ── Selector two-col ── */
.tl-selector-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
@media (max-width: 640px) { .tl-selector-grid { grid-template-columns: 1fr; } }

/* ── Result card ── */
.tl-result-card { background: #0d0b08; border: 1px solid; border-radius: 14px; padding: 24px; border-color: var(--rec-accent, #fb923c); transition: all 0.3s; }
.tl-result-type { font-family: 'IBM Plex Sans', sans-serif; font-size: 24px; font-weight: 800; color: var(--rec-accent, #fb923c); margin-bottom: 4px; }
.tl-result-family { font-family: 'IBM Plex Mono', monospace; font-size: 16px; color: #7a6050; margin-bottom: 14px; }
.tl-result-reason { background: rgba(251,146,60,0.04); border: 1px solid rgba(251,146,60,0.12); border-radius: 8px; padding: 12px 14px; font-size: 16px; color: #b08060; line-height: 1.7; margin-bottom: 14px; }
.tl-result-models { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
.tl-result-model-chip { padding: 4px 12px; background: rgba(52,211,153,0.08); border: 1px solid rgba(52,211,153,0.25); border-radius: 100px; font-size: 16px; color: #34d399; font-family: 'IBM Plex Mono', monospace; }
.tl-result-avoid { background: rgba(239,68,68,0.04); border: 1px solid rgba(239,68,68,0.18); border-radius: 8px; padding: 10px 14px; font-size: 16px; color: #9a5050; line-height: 1.6; }
.tl-result-avoid-label { font-size: 12px; color: rgba(239,68,68,0.5); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 4px; font-family: 'IBM Plex Mono', monospace; }

/* ── Quiz ── */
.tl-quiz-q { font-family: 'IBM Plex Sans', sans-serif; font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 16px; line-height: 1.4; }
.tl-quiz-opts { display: flex; flex-direction: column; gap: 8px; }
.tl-quiz-opt { background: #06040a; border: 1px solid #1e1008; border-radius: 8px; padding: 12px 16px; font-size: 16px; color: #9a8060; cursor: pointer; text-align: left; font-family: 'IBM Plex Mono', monospace; transition: all 0.18s; }
.tl-quiz-opt:hover:not(:disabled) { border-color: #fb923c; color: #e0e8f0; }
.tl-quiz-opt.correct { border-color: #34d399; background: rgba(52,211,153,0.08); color: #34d399; }
.tl-quiz-opt.wrong   { border-color: #ef4444; background: rgba(239,68,68,0.06); color: #f87171; }
.tl-quiz-exp { margin-top: 14px; padding: 12px; background: rgba(251,146,60,0.05); border: 1px solid rgba(251,146,60,0.18); border-radius: 8px; font-size: 16px; color: #b08060; line-height: 1.7; }
.tl-quiz-next { margin-top: 12px; background: rgba(251,146,60,0.1); border: 1px solid #fb923c; color: #fb923c; font-family: 'IBM Plex Mono', monospace; font-size: 16px; padding: 9px 18px; border-radius: 6px; cursor: pointer; letter-spacing: 0.08em; text-transform: uppercase; transition: all 0.18s; }
.tl-quiz-next:hover { background: rgba(251,146,60,0.2); }
.tl-progress { background: #0d0b08; border-radius: 100px; height: 4px; margin-bottom: 20px; overflow: hidden; }
.tl-progress-fill { height: 100%; background: linear-gradient(90deg, #fb923c, #fbbf24); border-radius: 100px; transition: width 0.4s; }
.tl-score-num { font-family: 'IBM Plex Sans', sans-serif; font-size: 64px; font-weight: 800; color: #fb923c; text-align: center; }
`

// ── Module-level data ─────────────────────────────────────────────────────────

const DECODER_DEMO = [
  { token: 'The',      color: '#fb923c', prob: 0.42 },
  { token: ' capital', color: '#fbbf24', prob: 0.61 },
  { token: ' of',      color: '#34d399', prob: 0.89 },
  { token: ' France',  color: '#38bdf8', prob: 0.74 },
  { token: ' is',      color: '#818cf8', prob: 0.91 },
  { token: ' Paris',   color: '#fb923c', prob: 0.86 },
  { token: '.',        color: '#f97316', prob: 0.95 },
]

const DECODER_MODELS = [
  { name: 'GPT-4o',            maker: 'OpenAI',     use: 'Chat, coding, reasoning',     color: '#10b981' },
  { name: 'Claude 3.5 Sonnet', maker: 'Anthropic',  use: 'Long context, analysis',      color: '#fb923c' },
  { name: 'Llama 3.1',         maker: 'Meta',        use: 'Open-weight, fine-tuning',    color: '#818cf8' },
  { name: 'Mistral 7B',        maker: 'Mistral AI',  use: 'Efficient, local deployment', color: '#38bdf8' },
  { name: 'Gemini 1.5 Pro',    maker: 'Google',      use: 'Multimodal, 1M context',      color: '#fbbf24' },
  { name: 'DeepSeek-R1',       maker: 'DeepSeek',    use: 'Math, reasoning chains',      color: '#f87171' },
]

const ENCODER_SENTENCE = ['The', 'bank', 'on', 'the', 'river', 'bank', 'closed']
const ENCODER_ATTN = [
  [0.9, 0.1, 0.05, 0.4,  0.05, 0.08, 0.1 ],
  [0.1, 0.9, 0.3,  0.1,  0.6,  0.8,  0.2 ],
  [0.05,0.3, 0.9,  0.2,  0.3,  0.2,  0.1 ],
  [0.4, 0.1, 0.2,  0.9,  0.1,  0.05, 0.15],
  [0.05,0.6, 0.3,  0.1,  0.9,  0.7,  0.1 ],
  [0.08,0.8, 0.2,  0.05, 0.7,  0.9,  0.15],
  [0.1, 0.2, 0.1,  0.15, 0.1,  0.15, 0.9 ],
]

const MASK_SENTENCE = ['The', 'cat', 'sat', 'on', 'the', 'mat']
const MASK_PREDS = [
  [['dog',0.31],['cat',0.28],['bird',0.18]],
  [['cat',0.45],['dog',0.28],['kitten',0.12]],
  [['sat',0.52],['lay',0.22],['slept',0.14]],
  [['on',0.71],['under',0.14],['near',0.09]],
  [['the',0.68],['a',0.19],['his',0.08]],
  [['mat',0.41],['floor',0.27],['rug',0.2]],
]

const ENCODER_MODELS = [
  { name: 'BERT',     maker: 'Google',    use: 'Bidirectional pre-training baseline', color: '#fbbf24' },
  { name: 'RoBERTa',  maker: 'Meta',      use: 'Optimized BERT training',            color: '#fb923c' },
  { name: 'DeBERTa',  maker: 'Microsoft', use: 'Disentangled attention, SOTA NLU',   color: '#38bdf8' },
  { name: 'E5 / BGE', maker: 'Various',   use: 'Embedding models for RAG',           color: '#34d399' },
]

const ENCDEC_TASKS = [
  { label: 'Translate',  prefix: 'translate English to French:', input: 'The weather is beautiful today.', output: "Le temps est magnifique aujourd'hui.", color: '#fb923c', insight: "T5 uses text prefixes to specify the task — the same model handles many tasks." },
  { label: 'Summarize',  prefix: 'summarize:', input: 'Researchers at MIT developed a technique reducing LLM training compute by 40% while maintaining benchmark performance.', output: 'MIT researchers cut LLM training costs 40% without losing performance.', color: '#38bdf8', insight: 'The encoder compresses the full article; the decoder generates a concise summary.' },
  { label: 'Q&A',        prefix: 'answer question:', input: 'What is the capital of France? Context: France is a country in Western Europe. Its capital is Paris.', output: 'Paris', color: '#34d399', insight: 'The encoder attends to the full context; the decoder produces the answer span.' },
  { label: 'Classify',   prefix: 'classify sentiment:', input: 'This product completely exceeded my expectations!', output: 'positive', color: '#818cf8', insight: 'Encoder-decoder models can do classification by decoding a label token.' },
]

const ENCDEC_MODELS = [
  { name: 'T5',      maker: 'Google', use: 'Text-to-text, all NLP tasks via prefix', color: '#fb923c' },
  { name: 'BART',    maker: 'Meta',   use: 'Denoising pre-training, summarization',  color: '#38bdf8' },
  { name: 'Flan-T5', maker: 'Google', use: 'Instruction-tuned T5, strong zero-shot', color: '#34d399' },
  { name: 'mT5',     maker: 'Google', use: 'Multilingual T5, 101 languages',         color: '#818cf8' },
]

const MODALITIES = [
  { id: 'image', icon: '🖼️', label: 'Image',    encoder: 'Vision Transformer (ViT)', tokens: '256–1024 image tokens', color: '#fb923c', pipeline: ['Raw image','Patch embedding','Vision encoder','Image tokens','LLM token space','Combined with text'], example: 'GPT-4o, Claude 3, Gemini, LLaVA', insight: 'An image is split into patches (like tokens for pixels), encoded by a ViT, then projected into the same vector space as text tokens.' },
  { id: 'audio', icon: '🎵', label: 'Audio',    encoder: 'Whisper / Audio Encoder',  tokens: '~1500 tokens / 30sec',   color: '#818cf8', pipeline: ['Raw audio','Mel spectrogram','Conv encoder','Audio tokens','LLM token space','Combined with text'], example: 'Gemini 1.5, GPT-4o voice', insight: 'Audio is converted to a spectrogram then encoded like an image via convolutional layers.' },
  { id: 'pdf',   icon: '📄', label: 'PDF / Doc', encoder: 'OCR + Layout Encoder',    tokens: '~800 tokens/page',       color: '#34d399', pipeline: ['PDF document','Page rendering','OCR + layout','Text + position tokens','Document tokens','Combined with query'], example: 'Claude 3.5 Sonnet, GPT-4o', insight: 'PDFs are processed as images preserving layout, with position-aware encoders capturing tables and headers.' },
  { id: 'video', icon: '🎬', label: 'Video',    encoder: 'Frame Sampler + ViT',      tokens: '~256 tokens / frame',    color: '#38bdf8', pipeline: ['Video clip','Frame sampling (1–4fps)','ViT per frame','Frame tokens','Temporal encoding','Combined with text'], example: 'Gemini 1.5 Pro, GPT-4o', insight: 'Video is sampled at low frame rates, each frame encoded by a ViT, then a temporal encoder captures relationships over time.' },
]

const CAPABILITY_MATRIX = {
  models: ['GPT-4o', 'Claude 3.5', 'Gemini 1.5', 'LLaVA 1.6', 'Whisper'],
  capabilities: [
    { label: 'Text In/Out',  values: [true,  true,  true,  true,  false] },
    { label: 'Image Input',  values: [true,  true,  true,  true,  false] },
    { label: 'Audio Input',  values: [true,  false, true,  false, true]  },
    { label: 'Video Input',  values: [true,  false, true,  false, false] },
    { label: 'Image Output', values: [true,  false, true,  false, false] },
    { label: 'Open Weights', values: [false, false, false, true,  true]  },
  ]
}

const QUIZ = [
  { id: 0, q: 'You need to build a sentiment classifier that will process 10 million customer reviews per day at lowest cost. Which architecture is most appropriate?', opts: ['Decoder-only (GPT-4) — best general-purpose model', 'Encoder-only (fine-tuned BERT or RoBERTa) — smaller, faster, purpose-built for classification', 'Encoder-Decoder (T5) — best for all text tasks', 'Multimodal — handles text and other inputs'], correct: 1, explanation: 'For high-volume text classification, fine-tuning a small encoder model (BERT, RoBERTa) is the right call. Encoders are 10–100x smaller than GPT-4-class models, optimized for understanding (not generation), and far cheaper at scale.' },
  { id: 1, q: 'What is the key architectural difference between a decoder-only model (like GPT-4) and an encoder-only model (like BERT)?', opts: ['Decoder-only models are larger; encoder-only models are smaller', 'Decoder-only models use causal (left-to-right) attention; encoder-only models use bidirectional attention over the full sequence', 'Encoder-only models can generate text; decoder-only models cannot', 'They use completely different neural network architectures with no shared components'], correct: 1, explanation: 'The critical difference is the attention mask. Decoder-only models mask future tokens — each token can only attend to tokens to its left. Encoder-only models have no mask — every token attends to every other token in both directions.' },
  { id: 2, q: 'A team wants to build a document translation pipeline (English → French, 1000 docs/day). Which architecture is most efficient?', opts: ['Decoder-only (Claude or GPT-4) — handles all text tasks well', 'Encoder-only (BERT) — best at understanding source text', 'Encoder-Decoder (T5 or BART) — purpose-built for seq2seq tasks like translation', 'Multimodal (Gemini) — handles documents and multiple languages'], correct: 2, explanation: 'Translation is a seq2seq task: a fixed input produces output of different length. Encoder-decoder models were specifically designed for this — the encoder reads the source, the decoder cross-attends while generating the target. T5 and mT5 are purpose-built for exactly this.' },
  { id: 3, q: 'How do multimodal models like GPT-4o process an image alongside text?', opts: ['They describe the image in text first, then process the text description', 'The image is encoded into "image tokens" by a vision encoder (ViT), projected into the same vector space as text tokens — the LLM processes both together', 'They run a separate classification model and append the class label to the prompt', 'Images are stored in model weights during training and retrieved by hash lookup'], correct: 1, explanation: 'Multimodal models use a Vision Transformer (ViT) to convert the image into patch embeddings, then project them into the same latent space as text token embeddings. The LLM processes a combined sequence of image tokens and text tokens using standard attention.' },
]

const TABS = ['Overview', 'Decoder-only', 'Encoder-only', 'Enc-Dec', 'Multimodal', 'Model Selector', 'Quiz']

const SIZE_MODELS = [
  { name: 'DistilBERT 66M', params: '66M', cost: '~$0.002/1M', use: 'classification', pct: 3 },
  { name: 'BERT-base 110M', params: '110M', cost: '~$0.005/1M', use: 'understanding', pct: 5 },
  { name: 'Llama 3 8B', params: '8B', cost: '~$0.06/1M', use: 'local generation', pct: 18 },
  { name: 'GPT-4o 200B+', params: '200B+', cost: '~$2.50/1M', use: 'reasoning/chat', pct: 62 },
  { name: 'Gemini Ultra 1T+', params: '1T+', cost: '~$3.50/1M', use: 'multimodal reasoning', pct: 100 },
]

function getRecommendation(c) {
  if (!c.needsGeneration && c.taskType === 'embed')
    return { type: 'Encoder-only', family: 'BERT / E5 / BGE', accent: '#fbbf24', reason: 'You only need embeddings — no generation. Encoder models are 10–100x smaller and faster than decoder models for this task.', models: ['E5-large-v2', 'BGE-M3', 'DeBERTa-v3'], avoid: 'Do not use GPT-4 just to get embeddings — it wastes compute and money.' }
  if (!c.needsGeneration && c.taskType === 'classify')
    return { type: 'Encoder-only', family: 'BERT / RoBERTa', accent: '#fbbf24', reason: 'Classification without generation. Fine-tune a small encoder model — better accuracy at 1/100th the cost of a large decoder.', models: ['RoBERTa-base', 'DeBERTa-v3-base', 'DistilBERT'], avoid: 'Avoid large LLMs for high-volume classification — costs escalate quickly.' }
  if (c.taskType === 'summarize')
    return { type: 'Encoder-Decoder', family: 'T5 / BART / Flan-T5', accent: '#38bdf8', reason: 'Summarization and translation are seq2seq tasks — encoder-decoder models are purpose-built for them and often outperform decoder-only on structured transformation tasks.', models: ['Flan-T5-XL', 'BART-large-cnn', 'mT5-large'], avoid: 'Decoder-only models work here too, but encoder-decoder models are more efficient for fixed-format output.' }
  if (c.hasImageInput)
    return { type: 'Multimodal', family: 'GPT-4o / Claude 3 / Gemini', accent: '#fb923c', reason: 'Your task requires processing images or other modalities. Only multimodal models can do this.', models: ['GPT-4o', 'Claude 3.5 Sonnet', 'Gemini 1.5 Pro'], avoid: 'Text-only models will fail entirely on image inputs.' }
  if (c.deployment === 'local')
    return { type: 'Decoder-only (Local)', family: 'Llama / Mistral / Phi', accent: '#34d399', reason: 'Local deployment needs open-weight models. Llama 3 and Mistral are excellent for self-hosted inference.', models: ['Llama 3.1 8B', 'Mistral 7B Instruct', 'Phi-3.5 Mini'], avoid: 'Do not try to run GPT-4-scale models locally without significant hardware.' }
  return { type: 'Decoder-only', family: 'GPT-4o / Claude / Gemini', accent: '#fb923c', reason: 'General text generation and chat tasks are where decoder-only models excel. They lead benchmarks for reasoning, coding, and conversation.', models: ['Claude 3.5 Sonnet', 'GPT-4o', 'Gemini 1.5 Pro'], avoid: 'For simple classification at scale, consider fine-tuning a smaller encoder model.' }
}

export default function TypesOfLLMs() {
  const [activeTab, setActiveTab] = useState(0)

  // Tab 1 — Decoder
  const [decoderStep, setDecoderStep] = useState(0)
  const [decoderRunning, setDecoderRunning] = useState(false)
  const decoderRef = useRef(null)

  useEffect(() => {
    if (decoderRunning) {
      decoderRef.current = setInterval(() => {
        setDecoderStep(s => {
          if (s >= DECODER_DEMO.length) {
            setDecoderRunning(false)
            return s
          }
          return s + 1
        })
      }, 700)
    } else {
      clearInterval(decoderRef.current)
    }
    return () => clearInterval(decoderRef.current)
  }, [decoderRunning])

  useEffect(() => {
    if (decoderStep >= DECODER_DEMO.length) {
      setDecoderRunning(false)
    }
  }, [decoderStep])

  // Tab 2 — Encoder
  const [selectedEncoderToken, setSelectedEncoderToken] = useState(1)
  const [maskedIdx, setMaskedIdx] = useState(1)
  const [showMaskPrediction, setShowMaskPrediction] = useState(false)

  // Tab 3 — Enc-Dec
  const [encdecTask, setEncdecTask] = useState(0)

  // Tab 4 — Multimodal
  const [selectedModality, setSelectedModality] = useState('image')

  // Tab 5 — Model Selector
  const [criteria, setCriteria] = useState({ needsGeneration: true, hasImageInput: false, taskType: 'chat', deployment: 'api' })

  // Tab 6 — Quiz
  const [qIdx, setQIdx] = useState(0)
  const [chosen, setChosen] = useState(null)
  const [score, setScore] = useState(0)
  const [quizDone, setQuizDone] = useState(false)

  function handleQuiz(idx) {
    if (chosen !== null) return
    setChosen(idx)
    if (idx === QUIZ[qIdx].correct) setScore(s => s + 1)
  }

  function nextQ() {
    if (qIdx + 1 >= QUIZ.length) {
      setQuizDone(true)
    } else {
      setQIdx(q => q + 1)
      setChosen(null)
    }
  }

  function retakeQuiz() {
    setQIdx(0)
    setChosen(null)
    setScore(0)
    setQuizDone(false)
  }

  const rec = getRecommendation(criteria)
  const currentMod = MODALITIES.find(m => m.id === selectedModality)
  const task = ENCDEC_TASKS[encdecTask]

  return (
    <div className="tl-root">
      <style>{css}</style>
      <NavBar />

      <div className="tl-hero">
        <div className="tl-eyebrow">LLM Landscape</div>
        <h1 className="tl-title">Types of <span>LLMs</span></h1>
        <p className="tl-subtitle">Encoder, decoder, encoder-decoder — and multimodal. Understand the architecture differences that determine when to use GPT, BERT, T5, or a vision model.</p>
      </div>

      <div className="tl-tabs">
        {TABS.map((t, i) => (
          <button
            key={t}
            className={`tl-tab${activeTab === i ? ' active' : ''}${i === 5 ? ' tl-tab-selector' : ''}`}
            onClick={() => setActiveTab(i)}
          >
            {t}{i === 5 && <span className="tl-tab-pulse" />}
          </button>
        ))}
      </div>

      <div className="tl-panel">

        {/* ── Tab 0: Overview ───────────────────────────────────────────────── */}
        {activeTab === 0 && (
          <>
            <div className="tl-card">
              <div className="tl-card-title">Not all LLMs are the same</div>
              <div className="tl-overview-grid">
                {[
                  { title: 'Architecture', desc: 'Encoder-only, decoder-only, or encoder-decoder. The architecture determines what the model can do — understand, generate, or both.' },
                  { title: 'Size', desc: 'From 66M to 1T+ parameters. Bigger models are more capable but far more expensive to run — and often overkill for narrow tasks.' },
                  { title: 'Training Objective', desc: 'Masked language modeling (BERT), next-token prediction (GPT), or text-to-text (T5). The objective shapes what the model is good at.' },
                  { title: 'Deployment', desc: 'Cloud API, on-premise, or local edge. Open-weight models enable self-hosting; closed models require API access and per-token billing.' },
                ].map(c => (
                  <div key={c.title} className="tl-overview-cell">
                    <div className="tl-overview-cell-title">{c.title}</div>
                    <div className="tl-overview-cell-desc">{c.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="tl-card">
              <div className="tl-card-title">Why size varies — model scale comparison</div>
              <p style={{ fontSize: 16, color: '#7a6050', marginBottom: 16, lineHeight: 1.7 }}>Proportional width shows relative scale (log-compressed). Actual parameter counts span 6 orders of magnitude.</p>
              {SIZE_MODELS.map(m => (
                <div key={m.name} className="tl-bar-row">
                  <div className="tl-bar-label">{m.name}</div>
                  <div className="tl-bar-bg">
                    <div className="tl-bar-fill" style={{ width: `${m.pct}%`, background: 'linear-gradient(90deg, rgba(251,146,60,0.6), rgba(251,146,60,0.3))' }}>
                      <span className="tl-bar-params">{m.params}</span>
                      <span className="tl-bar-cost">{m.cost}</span>
                    </div>
                  </div>
                </div>
              ))}
              <div className="tl-insight" style={{ marginTop: 20 }}>
                <strong>Key insight:</strong> Bigger ≠ better for your task. A 110M encoder often outperforms GPT-4 on classification at 1/1000th the cost.
              </div>
            </div>

            <div className="tl-card">
              <div className="tl-card-title">The three families — a map</div>
              <div className="tl-taxonomy-wrap">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 560, padding: '8px 0' }}>
                  <div className="tl-tree-root-box">Transformer</div>
                  <div className="tl-tree-stem" />
                  <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'flex-start', borderTop: '2px solid rgba(251,146,60,0.2)', paddingTop: 0 }}>
                    {[
                      { title: 'Encoder-only', desc: 'Understands, classifies, embeds', color: '#fbbf24', border: 'rgba(251,191,36,0.3)', bg: 'rgba(251,191,36,0.06)', note: '' },
                      { title: 'Encoder-Decoder', desc: 'Transforms input to different output', color: '#38bdf8', border: 'rgba(56,189,248,0.3)', bg: 'rgba(56,189,248,0.06)', note: '' },
                      { title: 'Decoder-only', desc: 'Generates, chats, reasons', color: '#fb923c', border: 'rgba(251,146,60,0.35)', bg: 'rgba(251,146,60,0.06)', note: '+ Multimodal = decoder-only + vision/audio encoders' },
                    ].map(b => (
                      <div key={b.title} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                        <div className="tl-tree-branch-stem" />
                        <div className="tl-tree-node" style={{ background: b.bg, border: `1px solid ${b.border}` }}>
                          <div className="tl-tree-node-title" style={{ color: b.color }}>{b.title}</div>
                          <div className="tl-tree-node-desc" style={{ color: b.color }}>{b.desc}</div>
                          {b.note && <div className="tl-tree-note" style={{ color: b.color }}>{b.note}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
                {[['BERT, RoBERTa, DeBERTa', '#fbbf24'], ['T5, BART, Flan-T5', '#38bdf8'], ['GPT-4, Claude, Llama, Gemini', '#fb923c']].map(([n, c]) => (
                  <div key={n} style={{ padding: '4px 12px', borderRadius: 100, border: `1px solid ${c}`, color: c, fontSize: 16, fontFamily: 'IBM Plex Mono, monospace', background: 'transparent' }}>{n}</div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── Tab 1: Decoder-only ───────────────────────────────────────────── */}
        {activeTab === 1 && (
          <>
            <p className="tl-section-sub">Decoder-only models generate text left-to-right. Each token is predicted based only on the tokens that came before it — enabling open-ended generation and chat.</p>

            <div className="tl-card">
              <div className="tl-card-title">Token-by-token generation demo</div>
              <p style={{ fontSize: 16, color: '#7a6050', marginBottom: 14, lineHeight: 1.7 }}>Each token is sampled from a probability distribution over the vocabulary. The probability shown is the model's confidence for that token at that step.</p>
              <div className="tl-decoder-controls">
                <button className="tl-btn" onClick={() => setDecoderStep(s => Math.min(s + 1, DECODER_DEMO.length))}>Step →</button>
                <button className="tl-btn secondary" onClick={() => setDecoderRunning(r => !r)}>
                  {decoderRunning ? 'Pause' : 'Auto-play'}
                </button>
                <button className="tl-btn secondary" onClick={() => { setDecoderStep(0); setDecoderRunning(false) }}>Reset</button>
              </div>
              <div className="tl-token-row">
                {DECODER_DEMO.map((t, i) => {
                  if (i < decoderStep) {
                    return (
                      <div key={i} className="tl-token-chip">
                        <div className="tl-token-prob" style={{ color: t.color }}>{Math.round(t.prob * 100)}%</div>
                        <div className="tl-token-text" style={{ background: `${t.color}18`, borderColor: t.color, color: t.color }}>{t.token}</div>
                      </div>
                    )
                  }
                  if (i === decoderStep && decoderStep < DECODER_DEMO.length) {
                    return (
                      <div key={i} className="tl-token-chip">
                        <div className="tl-token-prob" style={{ color: '#5a4030' }}>?</div>
                        <div className="tl-token-text" style={{ background: 'rgba(251,146,60,0.04)', borderColor: 'rgba(251,146,60,0.3)', color: '#fb923c' }}>
                          <span className="tl-token-cursor" />
                        </div>
                      </div>
                    )
                  }
                  return null
                })}
              </div>
              {decoderStep === 0 && (
                <p style={{ fontSize: 16, color: '#5a4030', fontStyle: 'italic' }}>Click "Step →" or "Auto-play" to watch token generation...</p>
              )}
              {decoderStep >= DECODER_DEMO.length && (
                <div className="tl-insight">Generation complete: <strong>"The capital of France is Paris."</strong> — 7 tokens, each sampled from a probability distribution.</div>
              )}
            </div>

            <div className="tl-card">
              <div className="tl-card-title">Causal attention mask — why decoders can't look ahead</div>
              <p style={{ fontSize: 16, color: '#7a6050', marginBottom: 16, lineHeight: 1.7 }}>Each token can only attend to tokens to its left (filled dots). Future tokens are masked (empty dots). This is what makes auto-regressive generation possible.</p>
              <div style={{ display: 'flex', gap: 8, marginBottom: 8, justifyContent: 'center', paddingLeft: 56 }}>
                {['T₁','T₂','T₃','T₄','T₅'].map(l => (
                  <div key={l} style={{ width: 20, textAlign: 'center', fontSize: 12, color: '#5a4030', fontFamily: 'IBM Plex Mono, monospace' }}>{l}</div>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'center' }}>
                {[0,1,2,3,4].map(row => (
                  <div key={row} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 48, fontSize: 12, color: '#5a4030', textAlign: 'right', fontFamily: 'IBM Plex Mono, monospace' }}>T{row+1}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 20px)', gap: 5 }}>
                      {[0,1,2,3,4].map(col => (
                        <div key={col} className={`tl-mask-dot ${col <= row ? 'visible' : 'hidden'}`} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 16, color: '#5a4030', marginTop: 14, textAlign: 'center' }}>Each token only sees tokens to its left.</p>
            </div>

            <div className="tl-card">
              <div className="tl-card-title">Notable decoder-only models</div>
              <div className="tl-model-grid">
                {DECODER_MODELS.map(m => (
                  <div key={m.name} className="tl-model-card" style={{ borderColor: `${m.color}33` }}>
                    <div className="tl-model-name" style={{ color: m.color }}>{m.name}</div>
                    <div className="tl-model-maker">{m.maker}</div>
                    <div className="tl-model-use">{m.use}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── Tab 2: Encoder-only ───────────────────────────────────────────── */}
        {activeTab === 2 && (
          <>
            <p className="tl-section-sub">Encoder-only models read the entire sequence bidirectionally — every token attends to every other token. This makes them excellent at understanding, not generation.</p>

            <div className="tl-card">
              <div className="tl-card-title">Bidirectional attention — click a token to see what it attends to</div>
              <div className="tl-token-chips">
                {ENCODER_SENTENCE.map((w, i) => (
                  <div
                    key={i}
                    className={`tl-chip ${selectedEncoderToken === i ? 'active' : 'inactive'}`}
                    onClick={() => setSelectedEncoderToken(i)}
                  >{w}</div>
                ))}
              </div>
              <p style={{ fontSize: 16, color: '#7a6050', marginBottom: 10, lineHeight: 1.6 }}>
                Attention weights from <strong style={{ color: '#fb923c' }}>"{ENCODER_SENTENCE[selectedEncoderToken]}"</strong> to each token:
              </p>
              <div className="tl-attn-rows">
                {ENCODER_SENTENCE.map((w, i) => {
                  const weight = ENCODER_ATTN[selectedEncoderToken][i]
                  return (
                    <div key={i} className="tl-attn-row">
                      <div className="tl-attn-token">{w}</div>
                      <div className="tl-attn-bar-bg">
                        <div className="tl-attn-bar-fill" style={{ width: `${weight * 100}%` }} />
                      </div>
                      <div className="tl-attn-val">{weight.toFixed(2)}</div>
                    </div>
                  )
                })}
              </div>
              <div className="tl-insight">The word <strong>"bank"</strong> (index 1) attends strongly to <strong>"river"</strong> and <strong>"bank"</strong> (index 5) — disambiguating the financial vs. geographic meaning through context.</div>
            </div>

            <div className="tl-card">
              <div className="tl-card-title">[MASK] prediction — how BERT was trained</div>
              <p style={{ fontSize: 16, color: '#7a6050', marginBottom: 12, lineHeight: 1.7 }}>Click a token to mask it. BERT predicts what word should fill the blank based on the full surrounding context.</p>
              <div className="tl-token-chips">
                {MASK_SENTENCE.map((w, i) => (
                  <div
                    key={i}
                    className={`tl-chip ${maskedIdx === i ? 'masked' : 'inactive'}`}
                    onClick={() => { setMaskedIdx(i); setShowMaskPrediction(true) }}
                  >{maskedIdx === i ? '[MASK]' : w}</div>
                ))}
                <button className="tl-btn secondary" style={{ padding: '4px 12px', fontSize: 16 }} onClick={() => { setShowMaskPrediction(false); setMaskedIdx(1) }}>Reset</button>
              </div>
              {showMaskPrediction && (
                <>
                  <p style={{ fontSize: 16, color: '#7a6050', marginTop: 12, marginBottom: 8 }}>Top predictions for position {maskedIdx} ("{MASK_SENTENCE[maskedIdx]}"):</p>
                  <div className="tl-mask-preds">
                    {MASK_PREDS[maskedIdx].map(([token, prob], pi) => (
                      <div key={pi} className="tl-mask-pred-row">
                        <div className="tl-mask-pred-token">{token}</div>
                        <div className="tl-mask-pred-bar-bg">
                          <div className="tl-mask-pred-bar-fill" style={{ width: `${prob * 100}%`, background: pi === 0 ? '#fb923c' : pi === 1 ? '#fbbf24' : '#818cf8' }} />
                        </div>
                        <div className="tl-mask-pred-pct">{Math.round(prob * 100)}%</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="tl-card">
              <div className="tl-card-title">Best use cases for encoder-only models</div>
              <div className="tl-usecase-grid">
                {[
                  { title: 'Text Classification', desc: 'Sentiment analysis, topic categorization, spam detection. Fine-tune a small encoder on your labels for best results.' },
                  { title: 'Named Entity Recognition', desc: 'Extract people, places, organizations from text. Encoders see full context for every token — ideal for span labeling.' },
                  { title: 'Embeddings / RAG', desc: 'Convert text to dense vectors for semantic search and retrieval. Models like E5 and BGE are purpose-built for this.' },
                  { title: 'Question Answering', desc: 'Extractive Q&A — find the answer span within a given context. Encoders attend to both question and context simultaneously.' },
                ].map(u => (
                  <div key={u.title} className="tl-usecase-cell">
                    <div className="tl-usecase-title">{u.title}</div>
                    <div className="tl-usecase-desc">{u.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="tl-card">
              <div className="tl-card-title">Notable encoder-only models</div>
              <div className="tl-model-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                {ENCODER_MODELS.map(m => (
                  <div key={m.name} className="tl-model-card" style={{ borderColor: `${m.color}33` }}>
                    <div className="tl-model-name" style={{ color: m.color }}>{m.name}</div>
                    <div className="tl-model-maker">{m.maker}</div>
                    <div className="tl-model-use">{m.use}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── Tab 3: Enc-Dec ────────────────────────────────────────────────── */}
        {activeTab === 3 && (
          <>
            <p className="tl-section-sub">Encoder-decoder models read the full input with the encoder, then generate output with the decoder using cross-attention. Purpose-built for seq2seq tasks like translation and summarization.</p>

            <div className="tl-card">
              <div className="tl-card-title">T5 text-to-text framework — same model, many tasks</div>
              <div className="tl-task-btns">
                {ENCDEC_TASKS.map((t, i) => (
                  <button
                    key={t.label}
                    className={`tl-task-btn ${encdecTask === i ? 'active' : ''}`}
                    style={{ color: t.color, borderColor: encdecTask === i ? t.color : '#2a1a0a' }}
                    onClick={() => setEncdecTask(i)}
                  >{t.label}</button>
                ))}
              </div>
              <div className="tl-encdec-layout">
                <div className="tl-encdec-box" style={{ borderColor: `${task.color}33`, background: `${task.color}06` }}>
                  <div className="tl-encdec-title" style={{ color: task.color }}>Encoder Input</div>
                  <div className="tl-encdec-prefix">{task.prefix}</div>
                  <div className="tl-encdec-text">{task.input}</div>
                </div>
                <div className="tl-encdec-bridge">
                  <div className="tl-encdec-bridge-line" />
                  <div className="tl-encdec-bridge-label">Cross-Attention</div>
                  <div className="tl-encdec-bridge-arrow">→</div>
                  <div className="tl-encdec-bridge-line" />
                </div>
                <div className="tl-encdec-box" style={{ borderColor: `${task.color}55`, background: `${task.color}0a` }}>
                  <div className="tl-encdec-title" style={{ color: task.color }}>Decoder Output</div>
                  <div className="tl-encdec-output">{task.output}</div>
                </div>
              </div>
              <div className="tl-insight">{task.insight}</div>
            </div>

            <div className="tl-card">
              <div className="tl-card-title">Notable encoder-decoder models</div>
              <div className="tl-model-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                {ENCDEC_MODELS.map(m => (
                  <div key={m.name} className="tl-model-card" style={{ borderColor: `${m.color}33` }}>
                    <div className="tl-model-name" style={{ color: m.color }}>{m.name}</div>
                    <div className="tl-model-maker">{m.maker}</div>
                    <div className="tl-model-use">{m.use}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── Tab 4: Multimodal ─────────────────────────────────────────────── */}
        {activeTab === 4 && (
          <>
            <p className="tl-section-sub">Multimodal models extend decoder-only LLMs with modality-specific encoders. Images, audio, and video are converted to tokens — then processed alongside text using standard attention.</p>

            <div className="tl-card">
              <div className="tl-card-title">How each modality is processed</div>
              <div className="tl-modality-btns">
                {MODALITIES.map(m => (
                  <button
                    key={m.id}
                    className={`tl-mod-btn ${selectedModality === m.id ? 'active' : ''}`}
                    style={selectedModality === m.id ? { borderColor: m.color, color: m.color, background: `${m.color}12` } : {}}
                    onClick={() => setSelectedModality(m.id)}
                  >{m.icon} {m.label}</button>
                ))}
              </div>
              {currentMod && (
                <>
                  <div className="tl-pipeline" style={{ '--mod-color': currentMod.color }}>
                    {currentMod.pipeline.map((step, i) => (
                      <span key={i} style={{ display: 'flex', alignItems: 'center' }}>
                        <div className="tl-pipeline-step" style={{ borderColor: `${currentMod.color}44` }}>{step}</div>
                        {i < currentMod.pipeline.length - 1 && <span className="tl-pipeline-arrow">→</span>}
                      </span>
                    ))}
                  </div>
                  <div className="tl-pipeline-meta">
                    {[
                      { label: 'Encoder', val: currentMod.encoder },
                      { label: 'Token Budget', val: currentMod.tokens },
                      { label: 'Example Models', val: currentMod.example },
                    ].map(item => (
                      <div key={item.label} className="tl-pipeline-meta-item">
                        <div className="tl-pipeline-meta-label">{item.label}</div>
                        <div className="tl-pipeline-meta-val">{item.val}</div>
                      </div>
                    ))}
                  </div>
                  <div className="tl-insight">{currentMod.insight}</div>
                </>
              )}
            </div>

            <div className="tl-card">
              <div className="tl-card-title">Capability matrix — what each model can do</div>
              <div style={{ overflowX: 'auto' }}>
                <table className="tl-matrix">
                  <thead>
                    <tr>
                      <th style={{ minWidth: 120 }}>Capability</th>
                      {CAPABILITY_MATRIX.models.map(m => <th key={m}>{m}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {CAPABILITY_MATRIX.capabilities.map(cap => (
                      <tr key={cap.label}>
                        <td>{cap.label}</td>
                        {cap.values.map((v, i) => (
                          <td key={i} className={v ? 'tl-matrix-yes' : 'tl-matrix-no'}>{v ? '✓' : '×'}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ── Tab 5: Model Selector ─────────────────────────────────────────── */}
        {activeTab === 5 && (
          <>
            <p className="tl-section-sub">Answer four questions about your task — get an architecture recommendation with reasoning and specific model suggestions. Updates live.</p>

            <div className="tl-selector-grid">
              <div className="tl-card" style={{ margin: 0, height: 'fit-content' }}>
                <div className="tl-card-title">Your requirements</div>
                <div className="tl-criteria-form">
                  <div className="tl-criteria-row">
                    <div className="tl-criteria-label">Does your task require generating new text?</div>
                    <div className="tl-toggle-pair">
                      <button className={`tl-toggle ${criteria.needsGeneration ? 'on' : 'off'}`} onClick={() => setCriteria(prev => ({ ...prev, needsGeneration: true }))}>Yes</button>
                      <button className={`tl-toggle ${!criteria.needsGeneration ? 'on' : 'off'}`} onClick={() => setCriteria(prev => ({ ...prev, needsGeneration: false }))}>No</button>
                    </div>
                  </div>

                  <div className="tl-criteria-row">
                    <div className="tl-criteria-label">Does your input include images or audio?</div>
                    <div className="tl-toggle-pair">
                      <button className={`tl-toggle ${criteria.hasImageInput ? 'on' : 'off'}`} onClick={() => setCriteria(prev => ({ ...prev, hasImageInput: true }))}>Yes</button>
                      <button className={`tl-toggle ${!criteria.hasImageInput ? 'on' : 'off'}`} onClick={() => setCriteria(prev => ({ ...prev, hasImageInput: false }))}>No</button>
                    </div>
                  </div>

                  <div className="tl-criteria-row">
                    <div className="tl-criteria-label">Task type:</div>
                    <div className="tl-pill-group">
                      {[['chat','Chat'],['summarize','Summarize'],['classify','Classify'],['embed','Embeddings']].map(([val, lbl]) => (
                        <button
                          key={val}
                          className={`tl-pill-btn ${criteria.taskType === val ? 'active' : 'inactive'}`}
                          onClick={() => setCriteria(prev => ({ ...prev, taskType: val }))}
                        >{lbl}</button>
                      ))}
                    </div>
                  </div>

                  <div className="tl-criteria-row">
                    <div className="tl-criteria-label">Deployment:</div>
                    <div className="tl-pill-group">
                      {[['api','Cloud API'],['local','Local'],['edge','Edge']].map(([val, lbl]) => (
                        <button
                          key={val}
                          className={`tl-pill-btn ${criteria.deployment === val ? 'active' : 'inactive'}`}
                          onClick={() => setCriteria(prev => ({ ...prev, deployment: val }))}
                        >{lbl}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="tl-result-card" style={{ '--rec-accent': rec.accent }}>
                <div style={{ fontSize: 12, color: 'rgba(251,146,60,0.5)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8, fontFamily: 'IBM Plex Mono, monospace' }}>Recommendation</div>
                <div className="tl-result-type">{rec.type}</div>
                <div className="tl-result-family">{rec.family}</div>
                <div className="tl-result-reason">{rec.reason}</div>
                <div style={{ fontSize: 12, color: 'rgba(52,211,153,0.6)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8, fontFamily: 'IBM Plex Mono, monospace' }}>Recommended models</div>
                <div className="tl-result-models">
                  {rec.models.map(m => <div key={m} className="tl-result-model-chip">{m}</div>)}
                </div>
                <div className="tl-result-avoid">
                  <div className="tl-result-avoid-label">Avoid</div>
                  {rec.avoid}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── Tab 6: Quiz ───────────────────────────────────────────────────── */}
        {activeTab === 6 && (
          <div className="tl-card">
            {!quizDone ? (
              <>
                <div className="tl-progress">
                  <div className="tl-progress-fill" style={{ width: `${(qIdx / QUIZ.length) * 100}%` }} />
                </div>
                <p style={{ fontSize: 16, color: '#5a4030', marginBottom: 14, fontFamily: 'IBM Plex Mono, monospace' }}>Question {qIdx + 1} of {QUIZ.length}</p>
                <div className="tl-quiz-q">{QUIZ[qIdx].q}</div>
                <div className="tl-quiz-opts">
                  {QUIZ[qIdx].opts.map((opt, i) => (
                    <button
                      key={i}
                      className={`tl-quiz-opt${chosen !== null ? (i === QUIZ[qIdx].correct ? ' correct' : i === chosen ? ' wrong' : '') : ''}`}
                      onClick={() => handleQuiz(i)}
                      disabled={chosen !== null}
                    >{opt}</button>
                  ))}
                </div>
                {chosen !== null && (
                  <>
                    <div className="tl-quiz-exp">{QUIZ[qIdx].explanation}</div>
                    <button className="tl-quiz-next" onClick={nextQ}>
                      {qIdx + 1 < QUIZ.length ? 'Next →' : 'See Results →'}
                    </button>
                  </>
                )}
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div className="tl-score-num">{score}/{QUIZ.length}</div>
                <p style={{ fontSize: 16, color: '#7a6050', margin: '12px 0 28px', lineHeight: 1.7 }}>
                  {score === QUIZ.length ? 'Perfect score! You understand LLM architectures deeply.' :
                   score >= 3 ? 'Strong result — you have a solid grasp of the landscape.' :
                   score >= 2 ? 'Good start. Review the architecture tabs to reinforce your understanding.' :
                   'Keep exploring — revisit the tabs for each architecture type.'}
                </p>
                <button className="tl-quiz-next" onClick={retakeQuiz}>Retake Quiz</button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
