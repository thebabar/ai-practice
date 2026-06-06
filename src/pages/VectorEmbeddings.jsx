import { useState, useEffect, useRef } from 'react'
import NavBar from '../components/NavBar.jsx'
import {
  MagnifyingGlassIcon, SparkleIcon, CompassIcon, LinkIcon,
  BrainIcon, TargetIcon, LockKeyIcon, LightningIcon,
  QuestionIcon, HashIcon, FileTextIcon, RobotIcon, CheckCircleIcon,
  ArrowRightIcon,
} from '@phosphor-icons/react'

const ICON_BY_KEY = {
  search: MagnifyingGlassIcon, sparkle: SparkleIcon, compass: CompassIcon, link: LinkIcon,
  brain: BrainIcon, target: TargetIcon, lock: LockKeyIcon, lightning: LightningIcon,
  question: QuestionIcon, hash: HashIcon, file: FileTextIcon, robot: RobotIcon, check: CheckCircleIcon,
}
const IconFor = ({ name, ...rest }) => {
  const C = ICON_BY_KEY[name]
  return C ? <C {...rest} /> : null
}

const css = `
/* ── Phase 5c: Vector Embeddings rebound to Prism tokens.
 *  Per §5.3 — the similarity axis is the page's organizing semantic:
 *  cosine-similar pairs read with --color-success, mid match → orange,
 *  unrelated → text-tertiary. Two signals total + neutrals. ───── */

.ve-root { min-height: 100vh; background: var(--surface-base); color: var(--text-primary); overflow-x: hidden; }

.ve-hero {
  position: relative;
  text-align: center;
  padding: var(--spacing-7) var(--spacing-4) var(--spacing-6);
  background: var(--text-primary);
  color: var(--surface-base);
  overflow: hidden;
}
:root[data-theme="dark"] .ve-hero {
  background: var(--surface-base);
  color: var(--text-primary);
}
.ve-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--gradient-refracted-b);
  opacity: var(--refracted-opacity-standard);
  pointer-events: none;
}
.ve-hero > * { position: relative; }
.ve-eyebrow {
  font: var(--text-weight-label) var(--text-size-caption)/var(--text-lh-caption) var(--font-primary);
  letter-spacing: 0.08em;
  color: var(--orange-300);
  margin-bottom: var(--spacing-3);
}
.ve-title {
  font: var(--text-weight-h1) var(--text-size-h1)/var(--text-lh-h1) var(--font-primary);
  letter-spacing: var(--text-ls-h1);
  margin-bottom: var(--spacing-3);
}
.ve-subtitle {
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  max-width: 540px;
  margin: 0 auto;
  opacity: 0.85;
}

.ve-tabs-row {
  display: flex;
  justify-content: center;
  padding: var(--spacing-5) var(--spacing-4) var(--spacing-6);
  background: var(--surface-base);
}

.ve-panel { max-width: 920px; margin: 0 auto; padding: 0 var(--spacing-4) var(--spacing-7); }
.ve-section-title {
  font: var(--text-weight-h2) var(--text-size-h2)/var(--text-lh-h2) var(--font-primary);
  letter-spacing: var(--text-ls-h2);
  color: var(--text-primary);
  margin-bottom: var(--spacing-2);
}
.ve-section-sub {
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-6);
  max-width: 720px;
}

.ve-card {
  background: var(--surface-1);
  border: 1px solid var(--border-default);
  box-shadow: var(--shadow-e2);
  border-radius: var(--radius-md);
  padding: var(--spacing-5);
  margin-bottom: var(--spacing-5);
}
.ve-card-title {
  font: var(--text-weight-h3) var(--text-size-h3)/var(--text-lh-h3) var(--font-primary);
  letter-spacing: var(--text-ls-h3);
  color: var(--text-primary);
  margin-bottom: var(--spacing-4);
}

/* ── What are embeddings ── */
.word-to-vec {
  display: flex;
  align-items: center;
  gap: 0;
  flex-wrap: wrap;
  justify-content: center;
  margin: var(--spacing-5) 0;
}
.wtv-word {
  background: var(--orange-50);
  border: 1px solid var(--orange-500);
  border-radius: var(--radius-md);
  padding: var(--spacing-3) var(--spacing-4);
  font: var(--text-weight-label) var(--text-size-h3)/1.2 var(--font-primary);
  color: var(--orange-500);
}
.wtv-arrow { color: var(--text-tertiary); margin: 0 var(--spacing-3); display: inline-flex; }
.wtv-vector { display: flex; gap: 4px; flex-wrap: wrap; max-width: 340px; }
.wtv-dim {
  width: 30px;
  height: 30px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'IBM Plex Mono', ui-monospace, monospace;
  font-size: var(--text-size-meta);
  border: 1px solid transparent;
  transition: background-color var(--duration-deliberate) var(--ease-standard);
}

.analogy-box { display: grid; grid-template-columns: 1fr auto 1fr auto 1fr auto 1fr; gap: var(--spacing-2); align-items: center; margin: var(--spacing-4) 0; }
@media (max-width: 600px) { .analogy-box { grid-template-columns: 1fr auto 1fr; } }
.analogy-word {
  background: var(--surface-2);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--spacing-3);
  text-align: center;
}
.analogy-word .aw-word {
  font: var(--text-weight-label) var(--text-size-body)/1.2 var(--font-primary);
  color: var(--text-primary);
}
.analogy-word .aw-vec {
  font-family: 'IBM Plex Mono', ui-monospace, monospace;
  font-size: var(--text-size-meta);
  color: var(--text-tertiary);
  margin-top: var(--spacing-1);
}
.analogy-op {
  font: var(--text-weight-label) var(--text-size-h3)/1 var(--font-primary);
  color: var(--text-secondary);
  text-align: center;
}
.analogy-result {
  background: var(--surface-1);
  border: 2px solid var(--color-success);
  border-radius: var(--radius-md);
  padding: var(--spacing-3);
  text-align: center;
}
.analogy-result .aw-word { color: var(--color-success); }

/* ── 2D Space ── */
.space-canvas {
  background: var(--surface-2);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  position: relative;
  overflow: hidden;
}
.space-point { position: absolute; transform: translate(-50%, -50%); transition: transform var(--duration-deliberate) var(--ease-standard); }
.space-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid;
  transition: background-color var(--duration-fast) var(--ease-standard), transform var(--duration-fast) var(--ease-standard);
  cursor: pointer;
}
.space-label {
  position: absolute;
  font: var(--text-weight-body) var(--text-size-caption)/1 var(--font-primary);
  white-space: nowrap;
  pointer-events: none;
}
.cluster-label {
  position: absolute;
  font: var(--text-weight-label) var(--text-size-meta)/1 var(--font-primary);
  letter-spacing: 0.1em;
  pointer-events: none;
  opacity: 0.7;
}
.space-legend {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-4);
  margin-top: var(--spacing-3);
  font: var(--text-weight-body) var(--text-size-caption)/1 var(--font-primary);
  color: var(--text-secondary);
}
.legend-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; margin-right: 5px; vertical-align: middle; }

/* ── Similarity ── */
.sim-pair { display: grid; grid-template-columns: 1fr auto 1fr; gap: var(--spacing-3); align-items: center; margin-bottom: var(--spacing-3); }
.sim-word-box {
  background: var(--surface-2);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--spacing-3);
  text-align: center;
}
.sim-word {
  font: var(--text-weight-label) var(--text-size-body)/1.2 var(--font-primary);
  color: var(--text-primary);
}
.sim-score-col { text-align: center; }
.sim-bar-wrap {
  width: 100%;
  background: var(--surface-2);
  border-radius: 100px;
  height: 8px;
  overflow: hidden;
  border: 1px solid var(--border-default);
  margin-top: var(--spacing-1);
}
.sim-bar { height: 100%; border-radius: 100px; transition: width var(--duration-deliberate) var(--ease-standard); }
.sim-val {
  font: var(--text-weight-h2) var(--text-size-h3)/1 var(--font-primary);
}
.sim-label {
  font: var(--text-weight-label) var(--text-size-meta)/1 var(--font-primary);
  color: var(--text-tertiary);
  margin-top: var(--spacing-1);
}
.sim-selector { display: flex; gap: var(--spacing-2); flex-wrap: wrap; margin-bottom: var(--spacing-5); }
.sim-btn {
  background: transparent;
  border: 1px solid var(--border-default);
  color: var(--text-secondary);
  font: var(--text-weight-label) var(--text-size-caption)/1 var(--font-primary);
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard), color var(--duration-fast) var(--ease-standard);
}
.sim-btn:hover { background: var(--surface-2); border-color: var(--border-strong); color: var(--text-primary); }
.sim-btn.active { background: var(--text-primary); border-color: var(--text-primary); color: var(--surface-base); }
.sim-btn:focus-visible { outline: 3px solid var(--color-focus-ring); outline-offset: 2px; }

/* ── Semantic Search ── */
.search-result {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-3) var(--spacing-4);
  background: var(--surface-1);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-2);
  transition: background-color var(--duration-deliberate) var(--ease-standard), border-color var(--duration-deliberate) var(--ease-standard);
}
.search-result.top { border-color: var(--orange-500); background: var(--orange-50); }
.sr-rank {
  font: var(--text-weight-label) var(--text-size-caption)/1 var(--font-primary);
  color: var(--text-tertiary);
  width: 28px;
  flex-shrink: 0;
}
.search-result.top .sr-rank { color: var(--orange-500); }
.sr-text {
  flex: 1;
  font: var(--text-weight-body) var(--text-size-caption)/var(--text-lh-body) var(--font-primary);
  color: var(--text-primary);
}
.sr-score-bar { width: 80px; flex-shrink: 0; }
.sr-score-val {
  font: var(--text-weight-label) var(--text-size-caption)/1 var(--font-primary);
  color: var(--text-secondary);
  text-align: right;
  margin-bottom: var(--spacing-1);
}
.search-result.top .sr-score-val { color: var(--orange-500); }
.sr-bar-bg { background: var(--surface-3); border-radius: 100px; height: 4px; overflow: hidden; }
.sr-bar-fill {
  height: 100%;
  border-radius: 100px;
  background: var(--text-secondary);
  transition: width var(--duration-deliberate) var(--ease-standard);
}
.search-result.top .sr-bar-fill { background: var(--orange-500); }

.search-queries { display: flex; gap: var(--spacing-2); flex-wrap: wrap; margin-bottom: var(--spacing-4); }
.query-chip {
  background: transparent;
  border: 1px solid var(--border-default);
  color: var(--text-secondary);
  font: var(--text-weight-label) var(--text-size-caption)/1 var(--font-primary);
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: 100px;
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard), color var(--duration-fast) var(--ease-standard);
}
.query-chip:hover { background: var(--surface-2); border-color: var(--border-strong); color: var(--text-primary); }
.query-chip.active { background: var(--text-primary); border-color: var(--text-primary); color: var(--surface-base); }
.query-chip:focus-visible { outline: 3px solid var(--color-focus-ring); outline-offset: 2px; }

/* ── RAG timeline ── */
.rag-flow { display: flex; flex-direction: column; gap: 0; }
.rag-step { display: flex; gap: var(--spacing-4); position: relative; }
.rag-step::before {
  content: '';
  position: absolute;
  left: 19px;
  top: 44px;
  bottom: -12px;
  width: 2px;
  background: var(--border-default);
}
.rag-step:last-child::before { display: none; }
.rag-dot {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid var(--rag-tint);
  background: var(--rag-soft);
  color: var(--rag-tint);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
}
.rag-body { flex: 1; padding-bottom: var(--spacing-5); }
.rag-type {
  font: var(--text-weight-label) var(--text-size-caption)/1 var(--font-primary);
  margin-bottom: var(--spacing-1);
  color: var(--rag-tint);
}
.rag-content {
  background: var(--surface-2);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--spacing-3) var(--spacing-4);
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  color: var(--text-secondary);
}
.rag-content strong { color: var(--text-primary); }

/* ── Quiz ── */
.ve-quiz-q {
  font: var(--text-weight-h3) var(--text-size-h3)/var(--text-lh-h3) var(--font-primary);
  letter-spacing: var(--text-ls-h3);
  color: var(--text-primary);
  margin-bottom: var(--spacing-4);
}
.ve-quiz-meta {
  font: var(--text-weight-label) var(--text-size-caption)/1 var(--font-primary);
  color: var(--text-tertiary);
  margin-bottom: var(--spacing-3);
}
.ve-quiz-opts { display: flex; flex-direction: column; gap: var(--spacing-2); }
.ve-quiz-opt {
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
.ve-quiz-opt:hover:not(:disabled) { background: var(--surface-2); border-color: var(--border-strong); }
.ve-quiz-opt:focus-visible { outline: 3px solid var(--color-focus-ring); outline-offset: 2px; }
.ve-quiz-opt:disabled { cursor: default; }
.ve-quiz-opt.correct { border-color: var(--color-success); }
.ve-quiz-opt.wrong   { border-color: var(--color-error); }
.ve-quiz-opt-letter {
  font-family: 'IBM Plex Mono', ui-monospace, monospace;
  color: var(--text-tertiary);
  margin-right: var(--spacing-2);
}
.ve-quiz-exp {
  margin-top: var(--spacing-4);
  padding: var(--spacing-3) var(--spacing-4);
  background: var(--surface-2);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  color: var(--text-secondary);
}
.ve-quiz-next {
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
.ve-quiz-next:hover { background: #D45C10; border-color: #D45C10; }
.ve-quiz-next:focus-visible { outline: 3px solid var(--color-focus-ring); outline-offset: 2px; }
.ve-progress {
  background: var(--surface-3);
  border-radius: 100px;
  height: 4px;
  margin-bottom: var(--spacing-5);
  overflow: hidden;
}
.ve-progress-fill {
  height: 100%;
  background: var(--text-primary);
  border-radius: 100px;
  transition: width var(--duration-standard) var(--ease-standard);
}
.ve-score-num {
  font: var(--text-weight-h1) var(--text-size-h1)/1 var(--font-primary);
  letter-spacing: var(--text-ls-h1);
  color: var(--text-primary);
  text-align: center;
  margin: var(--spacing-2) 0;
}
.ve-diff-badge {
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
.ve-diff-badge::before {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}
.ve-diff-badge.easy   { color: var(--color-success); border-color: var(--color-success); }
.ve-diff-badge.medium { color: var(--color-warning); border-color: var(--color-warning); }
.ve-diff-badge.hard   { color: var(--color-info);    border-color: var(--color-info); }
`

// ── Word vectors (simplified 8-dim) ──────────────────────────────────────────
const WORDS = {
  king:   [0.9, 0.1, 0.8, 0.2, 0.7, 0.1, 0.3, 0.6],
  queen:  [0.9, 0.8, 0.8, 0.2, 0.7, 0.1, 0.3, 0.6],
  man:    [0.4, 0.1, 0.3, 0.1, 0.2, 0.1, 0.1, 0.2],
  woman:  [0.4, 0.8, 0.3, 0.1, 0.2, 0.1, 0.1, 0.2],
  dog:    [0.1, 0.1, 0.1, 0.9, 0.1, 0.8, 0.7, 0.1],
  cat:    [0.1, 0.1, 0.1, 0.8, 0.1, 0.8, 0.6, 0.1],
  paris:  [0.2, 0.2, 0.1, 0.1, 0.9, 0.2, 0.1, 0.8],
  france: [0.2, 0.2, 0.1, 0.1, 0.8, 0.1, 0.1, 0.9],
}

function cosineSim(a, b) {
  const dot = a.reduce((s, v, i) => s + v * b[i], 0)
  const magA = Math.sqrt(a.reduce((s, v) => s + v * v, 0))
  const magB = Math.sqrt(b.reduce((s, v) => s + v * v, 0))
  return dot / (magA * magB)
}

// Activation intensity ramp: strong = orange-500, mid = orange-300, weak = surface-2.
// Keeps the "vector dimension" cell to a single signal (orange) per §5.1.
function vecColor(val) {
  if (val > 0.7) return { bg: 'var(--orange-500)', border: 'var(--orange-500)', color: '#fff' }
  if (val > 0.4) return { bg: 'var(--orange-100)', border: 'var(--orange-300)', color: 'var(--orange-500)' }
  return { bg: 'var(--surface-2)', border: 'var(--border-default)', color: 'var(--text-tertiary)' }
}

// ── 2D word space ─────────────────────────────────────────────────────────────
// Four clusters compressed to 2 signals + 2 neutrals per §5.1 (max two
// signals visible). Same-side clusters share their tint so the eye still
// reads "these belong together".
const SPACE_WORDS = [
  { word: 'king',    x: 22, y: 18, tint: 'var(--orange-500)', cluster: 'royalty' },
  { word: 'queen',   x: 35, y: 15, tint: 'var(--orange-500)', cluster: 'royalty' },
  { word: 'prince',  x: 28, y: 28, tint: 'var(--orange-500)', cluster: 'royalty' },
  { word: 'man',     x: 18, y: 55, tint: 'var(--blue-500)',   cluster: 'people' },
  { word: 'woman',   x: 32, y: 58, tint: 'var(--blue-500)',   cluster: 'people' },
  { word: 'person',  x: 24, y: 68, tint: 'var(--blue-500)',   cluster: 'people' },
  { word: 'dog',     x: 65, y: 20, tint: 'var(--text-primary)', cluster: 'animals' },
  { word: 'cat',     x: 75, y: 28, tint: 'var(--text-primary)', cluster: 'animals' },
  { word: 'wolf',    x: 70, y: 38, tint: 'var(--text-primary)', cluster: 'animals' },
  { word: 'paris',   x: 62, y: 68, tint: 'var(--text-secondary)', cluster: 'places' },
  { word: 'london',  x: 72, y: 60, tint: 'var(--text-secondary)', cluster: 'places' },
  { word: 'tokyo',   x: 82, y: 72, tint: 'var(--text-secondary)', cluster: 'places' },
  { word: 'france',  x: 55, y: 80, tint: 'var(--text-secondary)', cluster: 'places' },
]
const CLUSTER_LEGEND = [
  { tint: 'var(--orange-500)',   label: 'Royalty' },
  { tint: 'var(--blue-500)',     label: 'People' },
  { tint: 'var(--text-primary)', label: 'Animals' },
  { tint: 'var(--text-secondary)', label: 'Places' },
]

// ── Similarity pairs ──────────────────────────────────────────────────────────
const SIM_SETS = {
  'Semantic': [
    { a: 'dog', b: 'cat', score: 0.92, label: 'Very similar' },
    { a: 'king', b: 'queen', score: 0.89, label: 'Very similar' },
    { a: 'paris', b: 'france', score: 0.87, label: 'Very similar' },
    { a: 'man', b: 'woman', score: 0.78, label: 'Similar' },
    { a: 'king', b: 'dog', score: 0.18, label: 'Unrelated' },
    { a: 'paris', b: 'cat', score: 0.11, label: 'Unrelated' },
  ],
  'King - Man + Woman': [
    { a: 'king', b: 'man', score: 0.71, label: 'king ≈ man + royalty' },
    { a: 'queen', b: 'woman', score: 0.69, label: 'queen ≈ woman + royalty' },
    { a: 'king − man', b: 'queen − woman', score: 0.97, label: 'Gender offset matches!' },
    { a: 'paris − france', b: 'london − uk', score: 0.94, label: 'Capital offset matches!' },
  ],
}

// ── Semantic Search data ──────────────────────────────────────────────────────
const DOCS = [
  "Machine learning models are trained on large datasets to recognize patterns.",
  "Neural networks are inspired by the structure of the human brain.",
  "Python is a popular programming language for data science and AI.",
  "The transformer architecture revolutionized natural language processing.",
  "Vector databases store embeddings for fast similarity search.",
  "Gradient descent is used to optimize neural network weights.",
  "BERT and GPT are both based on the transformer architecture.",
  "Retrieval-augmented generation combines search with language models.",
  "Embeddings represent semantic meaning as points in vector space.",
  "Cosine similarity measures the angle between two vectors.",
  "Training data quality directly impacts model performance.",
  "Large language models can generate coherent and contextually relevant text.",
]

const QUERIES = {
  "How does AI learn?": [0, 5, 1, 2, 10, 3, 6, 4, 9, 7, 11, 8],
  "What is a vector?": [8, 4, 9, 3, 7, 1, 0, 6, 11, 5, 2, 10],
  "Tell me about transformers": [3, 6, 1, 11, 7, 0, 8, 9, 4, 5, 2, 10],
  "How does semantic search work?": [7, 4, 8, 9, 3, 6, 1, 0, 11, 5, 10, 2],
}

const QUERY_SCORES = {
  "How does AI learn?":          [0.94, 0.91, 0.87, 0.82, 0.76, 0.71, 0.65, 0.58, 0.51, 0.44, 0.38, 0.31],
  "What is a vector?":           [0.96, 0.92, 0.88, 0.84, 0.79, 0.72, 0.64, 0.56, 0.48, 0.41, 0.35, 0.28],
  "Tell me about transformers":  [0.95, 0.91, 0.85, 0.80, 0.75, 0.69, 0.62, 0.55, 0.49, 0.42, 0.36, 0.30],
  "How does semantic search work?": [0.97, 0.93, 0.89, 0.83, 0.77, 0.70, 0.63, 0.57, 0.50, 0.43, 0.37, 0.29],
}

// ── RAG steps ─────────────────────────────────────────────────────────────────
// User input + retrieved context = orange (incoming / external content);
// embed + search = blue (structured transformation); grounded answer = success.
const RAG_STEPS = [
  { iconKey: 'question', type: 'User query',         tint: 'var(--orange-500)',    soft: 'var(--orange-50)', content: <span><strong>"What are the best practices for prompt engineering?"</strong> — the query is received by the RAG system.</span> },
  { iconKey: 'hash',     type: 'Embed query',        tint: 'var(--blue-500)',      soft: 'var(--blue-50)',   content: <span>The query is passed through an embedding model → <strong>[0.82, 0.14, 0.67, 0.31, …]</strong> — a vector that captures its meaning.</span> },
  { iconKey: 'search',   type: 'Vector search',      tint: 'var(--blue-500)',      soft: 'var(--blue-50)',   content: <span>Cosine similarity is computed between the query vector and all document vectors. The <strong>top-k most similar chunks</strong> are retrieved from the vector database.</span> },
  { iconKey: 'file',     type: 'Retrieved context',  tint: 'var(--orange-500)',    soft: 'var(--orange-50)', content: <span>Top 3 chunks retrieved: <strong>"Be specific and provide examples…" | "Use delimiters to separate…" | "Chain-of-thought prompting…"</strong></span> },
  { iconKey: 'robot',    type: 'LLM generation',     tint: 'var(--blue-500)',      soft: 'var(--blue-50)',   content: <span>The query + retrieved context is sent to the LLM. It <strong>grounds its answer</strong> in the retrieved documents, not just training memory.</span> },
  { iconKey: 'check',    type: 'Grounded answer',    tint: 'var(--color-success)', soft: 'var(--surface-1)', content: <span><strong>"Best practices include: (1) be specific about the task… (2) use structured formats… (3) provide few-shot examples…"</strong> — an accurate, sourced answer.</span> },
]

// ── Quiz ──────────────────────────────────────────────────────────────────────
const QUIZ = [
  // easy
  {
    id: 0, difficulty: 'easy',
    q: 'What is a vector embedding?',
    opts: ['A compressed image format used in AI', 'A numerical representation of data that captures semantic meaning', 'A type of neural network layer', 'A method for encrypting text data'],
    correct: 1,
    explanation: 'An embedding is a dense vector of numbers that represents data (text, images, etc.) in a way that captures semantic meaning. Similar concepts end up close together in this vector space.',
  },
  {
    id: 1, difficulty: 'easy',
    q: 'What does "king − man + woman ≈ queen" demonstrate?',
    opts: ['That embeddings are just random numbers', 'That vector arithmetic can capture semantic relationships and analogies', 'That all royal words are stored near each other by coincidence', 'That LLMs memorize every word combination'],
    correct: 1,
    explanation: 'This famous example shows that embedding spaces encode semantic relationships as geometric directions. The "royalty" direction is consistent across genders — so subtracting "man" and adding "woman" navigates to "queen".',
  },
  {
    id: 2, difficulty: 'easy',
    q: 'What is cosine similarity used for in embeddings?',
    opts: ['Measuring how long a vector is', 'Measuring the angle between two vectors to determine semantic similarity', 'Compressing vectors to save storage space', 'Training the embedding model on new data'],
    correct: 1,
    explanation: 'Cosine similarity measures the cosine of the angle between two vectors, ranging from -1 to 1. A score near 1 means the vectors point in the same direction — semantically similar. It\'s preferred over Euclidean distance because it\'s length-independent.',
  },
  {
    id: 3, difficulty: 'easy',
    q: 'In Retrieval-Augmented Generation (RAG), what role do embeddings play?',
    opts: ['They generate the final answer directly', 'They translate the text into another language first', 'They convert queries and documents into vectors for fast similarity search', 'They fine-tune the LLM on new documents'],
    correct: 2,
    explanation: 'In RAG, both the query and all documents are embedded into vectors. At query time, the system finds the most semantically similar document chunks using vector similarity search, then passes them as context to the LLM — grounding its answer in real data.',
  },
  // medium
  {
    id: 4, difficulty: 'medium',
    q: 'Why is cosine similarity preferred over Euclidean distance for comparing text embeddings?',
    opts: ['Cosine similarity is faster to compute', 'Cosine similarity is length-independent — a short and long document on the same topic still score high', 'Euclidean distance cannot handle negative numbers', 'Cosine similarity works only in 2D space'],
    correct: 1,
    explanation: 'Euclidean distance is affected by vector magnitude — a longer document would have a larger magnitude and appear "far" from a short one even if they discuss the same topic. Cosine similarity measures the angle between vectors, ignoring magnitude, making it robust to length differences.',
  },
  {
    id: 5, difficulty: 'medium',
    q: 'In a typical production embedding model (e.g., text-embedding-3), how many dimensions does a single vector have?',
    opts: ['8 dimensions', '64 dimensions', '768–3072 dimensions', '1 million dimensions'],
    correct: 2,
    explanation: 'Modern embedding models produce vectors with hundreds to thousands of dimensions (e.g., 768 for BERT, 1536 for OpenAI text-embedding-3-small, 3072 for the large variant). Each dimension captures a different latent feature. Higher dimensions generally mean more expressive embeddings but higher storage and compute costs.',
  },
  {
    id: 6, difficulty: 'medium',
    q: 'What is a "vector database" and why is it needed for semantic search at scale?',
    opts: ['A database that stores only numbers, not text', 'A specialized store that indexes high-dimensional vectors for fast approximate nearest-neighbor search', 'A database that converts text to vectors on the fly', 'A distributed file system for storing embedding model weights'],
    correct: 1,
    explanation: 'A standard SQL or key-value database cannot efficiently find the most similar vector among millions of candidates — brute-force comparison would take too long. Vector databases (Pinecone, Weaviate, Qdrant, pgvector) use specialized indexes like HNSW or IVF to find approximate nearest neighbors in milliseconds.',
  },
  {
    id: 7, difficulty: 'medium',
    q: 'What is "semantic chunking" in a RAG pipeline and why does it matter?',
    opts: ['Compressing embeddings to use less memory', 'Splitting documents into semantically coherent pieces so each chunk represents a complete idea', 'Translating documents before embedding them', 'Filtering out irrelevant documents before embedding'],
    correct: 1,
    explanation: 'If you split a document mid-sentence or mid-paragraph, each chunk may lack context and embed poorly. Semantic chunking splits on natural boundaries (paragraphs, sections, sentences) to ensure each chunk represents a complete idea. Better chunks lead to better retrieval relevance.',
  },
  // hard
  {
    id: 8, difficulty: 'hard',
    q: 'What problem does "dimensionality reduction" (e.g., PCA, UMAP) solve when working with embeddings?',
    opts: ['It makes embedding models faster to train', 'It projects high-dimensional vectors into 2D/3D for visualization while preserving local neighborhood structure', 'It increases the accuracy of cosine similarity calculations', 'It removes duplicate embeddings from the vector store'],
    correct: 1,
    explanation: 'Humans can\'t visualize 1536-dimensional space. PCA and UMAP reduce dimensions to 2D or 3D while trying to preserve the relative distances between points (local and global structure). The resulting plot lets you visually inspect how concepts cluster — though some information is always lost in the compression.',
  },
  {
    id: 9, difficulty: 'hard',
    q: 'You embed a query "best Italian food in NYC" and retrieve 5 documents. Document #1 scores 0.97 similarity. What risk should you investigate?',
    opts: ['The score is too high — something must be wrong with the model', 'The document may be semantically similar but factually outdated or wrong — high similarity doesn\'t guarantee factual accuracy', 'The query was tokenized incorrectly', 'You should use Euclidean distance instead'],
    correct: 1,
    explanation: 'High cosine similarity means the document\'s meaning aligns with the query — but it says nothing about the document\'s accuracy, recency, or authority. A high-scoring document could be a 10-year-old blog post or contain incorrect information. RAG systems need metadata filtering and freshness checks alongside similarity scores.',
  },
  {
    id: 10, difficulty: 'hard',
    q: 'What is "embedding drift" and why does it cause problems in production RAG systems?',
    opts: ['Embeddings becoming larger over time due to repeated indexing', 'When a newer embedding model produces vectors in a different space than the model used to index existing documents', 'CPU/GPU memory issues when storing large numbers of vectors', 'Gradual degradation of the vector database index'],
    correct: 1,
    explanation: 'When you upgrade your embedding model, the new model lives in a fundamentally different vector space — a query embedded by model v2 cannot be meaningfully compared to documents embedded by model v1. You must re-embed all documents with the new model before switching. Mixing embeddings from different models silently destroys retrieval quality.',
  },
  {
    id: 11, difficulty: 'hard',
    q: 'In a RAG system with 1 million documents, you notice the top retrieved chunks are always from the same 100 documents regardless of the query. What is the most likely cause?',
    opts: ['The vector database is running out of memory', 'Those 100 documents have abnormally long text, giving them larger vector magnitudes that dominate cosine similarity', 'The embedding model was not trained on enough data', 'The query router is caching results'],
    correct: 1,
    explanation: 'Although cosine similarity is theoretically length-independent, in practice very long documents that have been chunked into many overlapping segments — or documents with generic, high-frequency language — can dominate retrieval. This is a "retrieval bias" issue. Solutions include max-marginal-relevance reranking, chunk normalization, and filtering by document metadata.',
  },
]

const DIFFICULTY_ORDER = ['easy', 'medium', 'hard']
const SESSION_SIZE = 6

function bumpDifficulty(current, correct) {
  const idx = DIFFICULTY_ORDER.indexOf(current)
  return correct ? DIFFICULTY_ORDER[Math.min(idx + 1, 2)]
                 : DIFFICULTY_ORDER[Math.max(idx - 1, 0)]
}

function pickQuestion(targetDiff, usedIds, quiz) {
  let pool = quiz.filter(q => q.difficulty === targetDiff && !usedIds.has(q.id))
  if (!pool.length) {
    const idx = DIFFICULTY_ORDER.indexOf(targetDiff)
    for (const alt of [DIFFICULTY_ORDER[idx+1], DIFFICULTY_ORDER[idx-1]].filter(Boolean)) {
      pool = quiz.filter(q => q.difficulty === alt && !usedIds.has(q.id))
      if (pool.length) break
    }
  }
  if (!pool.length) pool = quiz.filter(q => q.difficulty === targetDiff)
  return pool[Math.floor(Math.random() * pool.length)]
}

// ═════════════════════════════════════════════════════════════════════════════
export default function VectorEmbeddings() {
  const [tab, setTab] = useState(0)
  const TABS = ['What are embeddings?', 'Vector space', 'Similarity', 'Semantic search', 'RAG', 'Quiz']

  // word selector
  const [selectedWord, setSelectedWord] = useState('king')

  // space hover
  const [hoveredWord, setHoveredWord] = useState(null)

  // similarity set
  const [simSet, setSimSet] = useState('Semantic')

  // search
  const [activeQuery, setActiveQuery] = useState('How does AI learn?')
  const [searchResults, setSearchResults] = useState([])

  // quiz
  const nextDiffRef = useRef('easy')
  const [currentQ, setCurrentQ] = useState(null)
  const [qNum, setQNum] = useState(0)
  const [chosen, setChosen] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const [difficulty, setDifficulty] = useState('easy')
  const [usedIds, setUsedIds] = useState(new Set())

  useEffect(() => {
    const order = QUERIES[activeQuery]
    const scores = QUERY_SCORES[activeQuery]
    setSearchResults(order.slice(0, 7).map((docIdx, rank) => ({
      text: DOCS[docIdx], score: scores[rank], rank: rank + 1
    })))
  }, [activeQuery])

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
    setCurrentQ(q)
    setUsedIds(new Set([q.id]))
    setQNum(0)
    setChosen(null)
    setScore(0)
    setDone(false)
    setDifficulty('easy')
  }

  const vec = WORDS[selectedWord] || []

  return (
    <div className="ve-root">
      <style>{css}</style>
      <NavBar />

      <header className="ve-hero">
        <div className="ve-eyebrow">Interactive guide</div>
        <h1 className="ve-title">Vector embeddings</h1>
        <p className="ve-subtitle">How AI turns words, sentences, and concepts into numbers — and why nearby numbers mean similar meanings.</p>
      </header>

      <div className="ve-tabs-row">
        <div className="prism-tabs" role="tablist" aria-label="Sections">
          {TABS.map((t, i) => (
            <button
              key={i}
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

      {/* ── Tab 0: What are embeddings ── */}
      {tab === 0 && (
        <div className="ve-panel">
          <div className="ve-section-title">What are vector embeddings?</div>
          <p className="ve-section-sub">An embedding converts text (or any data) into a list of numbers called a vector. Words with similar meanings end up with similar numbers — so the meaning is baked into the math. Click a word to see its vector.</p>

          <div className="ve-card">
            <div className="ve-card-title">Word → vector</div>
            <div style={{ display: 'flex', gap: 'var(--spacing-2)', flexWrap: 'wrap', marginBottom: 'var(--spacing-5)' }}>
              {Object.keys(WORDS).map(w => (
                <button key={w} className={`sim-btn${selectedWord === w ? ' active' : ''}`} onClick={() => setSelectedWord(w)}>{w}</button>
              ))}
            </div>
            <div className="word-to-vec">
              <div className="wtv-word">"{selectedWord}"</div>
              <div className="wtv-arrow"><ArrowRightIcon size={20} weight="bold" /></div>
              <div className="wtv-vector">
                {vec.map((v, i) => {
                  const c = vecColor(v)
                  return (
                    <div key={i} className="wtv-dim" style={{ background: c.bg, borderColor: c.border, color: c.color }}
                      title={`dim ${i+1}: ${v.toFixed(2)}`}>
                      {v.toFixed(1)}
                    </div>
                  )
                })}
              </div>
            </div>
            <p style={{ font: 'var(--text-weight-body) var(--text-size-caption)/var(--text-lh-body) var(--font-primary)', color: 'var(--text-secondary)', marginTop: 'var(--spacing-3)' }}>
              Each number represents how strongly the word activates a learned dimension. Real embeddings have 768–3072 dimensions — we're showing 8 for clarity.
              <span style={{ color: 'var(--orange-500)', marginLeft: 'var(--spacing-2)' }}>Darker orange means stronger activation.</span>
            </p>
          </div>

          <div className="ve-card">
            <div className="ve-card-title">The famous analogy: king − man + woman ≈ queen</div>
            <p style={{ font: 'var(--text-weight-body) var(--text-size-caption)/var(--text-lh-body) var(--font-primary)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-4)' }}>
              Because meaning is encoded geometrically, you can do arithmetic on embeddings. The direction from "man" to "woman" is the same as from "king" to "queen".
            </p>
            <div className="analogy-box">
              {[
                { word: 'king',   vec: '[0.9, 0.1, 0.8…]' },
                { op: '−' },
                { word: 'man',    vec: '[0.4, 0.1, 0.3…]' },
                { op: '+' },
                { word: 'woman',  vec: '[0.4, 0.8, 0.3…]' },
                { op: '≈' },
                { word: 'queen',  vec: '[0.9, 0.8, 0.8…]', result: true },
              ].map((item, i) => item.op
                ? <div key={i} className="analogy-op">{item.op}</div>
                : <div key={i} className={item.result ? 'analogy-result' : 'analogy-word'}>
                    <div className="aw-word">{item.word}</div>
                    <div className="aw-vec">{item.vec}</div>
                  </div>
              )}
            </div>
            <div style={{ marginTop: 'var(--spacing-4)', padding: 'var(--spacing-3) var(--spacing-4)', background: 'var(--surface-2)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', font: 'var(--text-weight-body) var(--text-size-caption)/var(--text-lh-body) var(--font-primary)', color: 'var(--text-secondary)' }}>
              This works because the embedding space learned that "royalty" and "gender" are separate, independent directions. Vector arithmetic navigates those directions.
            </div>
          </div>

          <div className="ve-card">
            <div className="ve-card-title">Why do embeddings matter?</div>
            <div style={{ display: 'grid', gap: 'var(--spacing-3)' }}>
              {[
                { iconKey: 'search',   title: 'Semantic search',         desc: 'Find documents that mean the same thing, even if they use different words. "automobile" and "car" end up near each other.' },
                { iconKey: 'sparkle',  title: 'RAG systems',             desc: 'Retrieve the most relevant context for an LLM by comparing query embeddings to document embeddings.' },
                { iconKey: 'compass',  title: 'Recommendations',         desc: 'Netflix, Spotify, and Amazon all use embeddings to find items similar to ones you liked.' },
                { iconKey: 'link',     title: 'Cross-modal matching',    desc: 'Text and image embeddings can share the same space — enabling search like "find images similar to this sentence."' },
              ].map(({ iconKey, title, desc }) => (
                <div key={title} style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
                  <span style={{ color: 'var(--orange-500)', flexShrink: 0, marginTop: 2 }}><IconFor name={iconKey} size={20} weight="duotone" /></span>
                  <div>
                    <div style={{ font: 'var(--text-weight-label) var(--text-size-body)/1.4 var(--font-primary)', color: 'var(--text-primary)', marginBottom: 'var(--spacing-1)' }}>{title}</div>
                    <div style={{ font: 'var(--text-weight-body) var(--text-size-caption)/var(--text-lh-body) var(--font-primary)', color: 'var(--text-secondary)' }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Tab 1: Vector Space ── */}
      {tab === 1 && (
        <div className="ve-panel">
          <div className="ve-section-title">Vector space visualisation</div>
          <p className="ve-section-sub">In a real embedding space, similar words cluster together. This 2D map is a simplified projection — imagine it in 768+ dimensions. Hover over any word.</p>

          <div className="ve-card">
            <div className="ve-card-title">2D embedding space (simplified projection)</div>
            <div className="space-canvas" style={{ height: 380 }}>
              {/* Words */}
              {SPACE_WORDS.map(w => (
                <div key={w.word} className="space-point"
                  style={{ left: `${w.x}%`, top: `${w.y}%` }}
                  onMouseEnter={() => setHoveredWord(w.word)}
                  onMouseLeave={() => setHoveredWord(null)}>
                  <div className="space-dot" style={{
                    background: hoveredWord === w.word ? w.tint : 'transparent',
                    borderColor: w.tint,
                    transform: hoveredWord === w.word ? 'scale(1.6)' : 'scale(1)',
                  }} />
                  <div className="space-label" style={{
                    color: w.tint,
                    top: -18, left: 8,
                    fontWeight: hoveredWord === w.word ? 600 : 400,
                  }}>{w.word}</div>
                </div>
              ))}

              {/* Cluster labels */}
              <div className="cluster-label" style={{ left: '12%', top: '10%', color: 'var(--orange-500)' }}>Royalty</div>
              <div className="cluster-label" style={{ left: '10%', top: '46%', color: 'var(--blue-500)' }}>People</div>
              <div className="cluster-label" style={{ left: '60%', top: '10%', color: 'var(--text-primary)' }}>Animals</div>
              <div className="cluster-label" style={{ left: '51%', top: '54%', color: 'var(--text-secondary)' }}>Places</div>

              {/* Hover info */}
              {hoveredWord && (
                <div style={{ position: 'absolute', bottom: 12, left: 12, background: 'var(--surface-1)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', padding: 'var(--spacing-2) var(--spacing-3)', font: 'var(--text-weight-body) var(--text-size-caption)/1 var(--font-primary)', color: 'var(--text-secondary)', boxShadow: 'var(--shadow-e1)' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>{hoveredWord}</strong>
                  {' '}— cluster: <span style={{ color: SPACE_WORDS.find(w => w.word === hoveredWord)?.tint }}>
                    {SPACE_WORDS.find(w => w.word === hoveredWord)?.cluster}
                  </span>
                </div>
              )}
            </div>

            <div className="space-legend">
              {CLUSTER_LEGEND.map(({ tint, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center' }}>
                  <span className="legend-dot" style={{ background: tint }} />{label}
                </div>
              ))}
            </div>
          </div>

          <div className="ve-card">
            <div className="ve-card-title">Key insight: distance equals meaning</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-3)' }}>
              {[
                { label: 'Close in space', tint: 'var(--color-success)', soft: 'var(--surface-1)', points: ['"dog" and "cat" are nearby', '"paris" and "london" are nearby', '"king" and "queen" are nearby', 'Same semantic category — vectors agree'] },
                { label: 'Far in space',   tint: 'var(--orange-500)',    soft: 'var(--orange-50)', points: ['"dog" and "paris" are far apart', '"king" and "wolf" are far apart', 'Different categories — vectors diverge', 'Distance encodes difference'] },
              ].map(col => (
                <div key={col.label} style={{ background: col.soft, border: `1px solid ${col.tint}`, borderRadius: 'var(--radius-md)', padding: 'var(--spacing-4)' }}>
                  <div style={{ font: 'var(--text-weight-label) var(--text-size-body)/1.2 var(--font-primary)', color: col.tint, marginBottom: 'var(--spacing-3)' }}>{col.label}</div>
                  {col.points.map(p => (
                    <div key={p} style={{ display: 'flex', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-1)', font: 'var(--text-weight-body) var(--text-size-caption)/var(--text-lh-body) var(--font-primary)', color: 'var(--text-secondary)' }}>
                      <span style={{ color: col.tint, flexShrink: 0 }}>▸</span>{p}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Tab 2: Similarity ── */}
      {tab === 2 && (
        <div className="ve-panel">
          <div className="ve-section-title">Cosine similarity</div>
          <p className="ve-section-sub">Cosine similarity measures the angle between two vectors, not their distance. A score of 1.0 means identical direction (same meaning), 0 means unrelated. Select a set to explore.</p>

          <div className="ve-card">
            <div className="ve-card-title">Similarity explorer</div>
            <div className="sim-selector">
              {Object.keys(SIM_SETS).map(k => (
                <button key={k} className={`sim-btn${simSet === k ? ' active' : ''}`} onClick={() => setSimSet(k)}>{k}</button>
              ))}
            </div>
            {SIM_SETS[simSet].map((pair, i) => {
              const pct = pair.score * 100
              const tint = pair.score > 0.85 ? 'var(--color-success)' : pair.score > 0.5 ? 'var(--orange-500)' : 'var(--text-tertiary)'
              return (
                <div key={i} style={{ marginBottom: 'var(--spacing-4)' }}>
                  <div className="sim-pair">
                    <div className="sim-word-box"><div className="sim-word">{pair.a}</div></div>
                    <div className="sim-score-col">
                      <div className="sim-val" style={{ color: tint }}>{pair.score.toFixed(2)}</div>
                      <div className="sim-label">{pair.label}</div>
                    </div>
                    <div className="sim-word-box"><div className="sim-word">{pair.b}</div></div>
                  </div>
                  <div className="sim-bar-wrap">
                    <div className="sim-bar" style={{ width: `${pct}%`, background: tint }} />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="ve-card">
            <div className="ve-card-title">How cosine similarity works</div>
            <p style={{ font: 'var(--text-weight-body) var(--text-size-caption)/var(--text-lh-body) var(--font-primary)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-4)' }}>
              Instead of measuring how far apart two points are (Euclidean distance), cosine similarity measures the angle between them. This makes it <strong style={{ color: 'var(--text-primary)' }}>length-independent</strong> — a short and long document about the same topic will still score high.
            </p>
            <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-4)', fontFamily: 'IBM Plex Mono, ui-monospace, monospace', fontSize: 'var(--text-size-caption)', color: 'var(--text-primary)', lineHeight: 1.9 }}>
              <div style={{ color: 'var(--text-tertiary)' }}>// Formula</div>
              similarity(A, B) = <span style={{ color: 'var(--orange-500)' }}>cos(θ)</span> = <span style={{ color: 'var(--blue-500)' }}>(A · B)</span> / <span style={{ color: 'var(--blue-500)' }}>(|A| × |B|)</span>
              <div style={{ marginTop: 'var(--spacing-2)', font: 'var(--text-weight-body) var(--text-size-meta)/1.4 var(--font-primary)', color: 'var(--text-tertiary)' }}>
                A · B is the dot product · |A|, |B| are vector magnitudes.
              </div>
            </div>
            <div style={{ marginTop: 'var(--spacing-4)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-2)' }}>
              {[
                { val: '1.0', label: 'Identical',  tint: 'var(--color-success)' },
                { val: '0.5', label: 'Related',    tint: 'var(--orange-500)' },
                { val: '0.0', label: 'Unrelated',  tint: 'var(--text-tertiary)' },
              ].map(({ val, label, tint }) => (
                <div key={val} style={{ background: 'var(--surface-2)', border: `1px solid ${tint}`, borderRadius: 'var(--radius-md)', padding: 'var(--spacing-3)', textAlign: 'center' }}>
                  <div style={{ font: 'var(--text-weight-h2) var(--text-size-h2)/1 var(--font-primary)', letterSpacing: 'var(--text-ls-h2)', color: tint }}>{val}</div>
                  <div style={{ font: 'var(--text-weight-body) var(--text-size-caption)/1 var(--font-primary)', color: 'var(--text-tertiary)', marginTop: 'var(--spacing-1)' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Tab 3: Semantic Search ── */}
      {tab === 3 && (
        <div className="ve-panel">
          <div className="ve-section-title">Semantic search</div>
          <p className="ve-section-sub">Unlike keyword search (which matches exact words), semantic search finds documents with similar meaning. Click a query to see how the results change based on semantic similarity — not word overlap.</p>

          <div className="ve-card">
            <div className="ve-card-title">Live semantic search demo</div>
            <div style={{ font: 'var(--text-weight-body) var(--text-size-caption)/1.4 var(--font-primary)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-3)' }}>Try a query:</div>
            <div className="search-queries">
              {Object.keys(QUERIES).map(q => (
                <button key={q} className={`query-chip${activeQuery === q ? ' active' : ''}`} onClick={() => setActiveQuery(q)}>"{q}"</button>
              ))}
            </div>
            <div style={{ marginBottom: 'var(--spacing-4)', padding: 'var(--spacing-3) var(--spacing-4)', background: 'var(--orange-50)', border: '1px solid var(--orange-100)', borderRadius: 'var(--radius-md)', font: 'var(--text-weight-body) var(--text-size-caption)/var(--text-lh-body) var(--font-primary)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
              <MagnifyingGlassIcon size={16} weight="duotone" color="var(--orange-500)" />
              Query: <strong style={{ color: 'var(--orange-500)' }}>"{activeQuery}"</strong>
            </div>
            {searchResults.map((r, i) => (
              <div key={i} className={`search-result${i === 0 ? ' top' : ''}`}>
                <div className="sr-rank">#{r.rank}</div>
                <div className="sr-text">{r.text}</div>
                <div className="sr-score-bar">
                  <div className="sr-score-val">{r.score.toFixed(2)}</div>
                  <div className="sr-bar-bg">
                    <div className="sr-bar-fill" style={{ width: `${r.score * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="ve-card">
            <div className="ve-card-title">Keyword search vs semantic search</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-3)' }}>
              {[
                { label: 'Keyword search',  tint: 'var(--color-error)',   soft: 'var(--surface-1)', points: ['Matches exact words only', '"car" won\'t find "automobile"', '"ML" won\'t find "machine learning"', 'Order and context ignored'] },
                { label: 'Semantic search', tint: 'var(--color-success)', soft: 'var(--surface-1)', points: ['Matches meaning, not words', '"car" finds "automobile" and "vehicle"', 'Paraphrases match correctly', 'Context and nuance captured'] },
              ].map(col => (
                <div key={col.label} style={{ background: col.soft, border: `1px solid ${col.tint}`, borderRadius: 'var(--radius-md)', padding: 'var(--spacing-4)' }}>
                  <div style={{ font: 'var(--text-weight-label) var(--text-size-body)/1.2 var(--font-primary)', color: col.tint, marginBottom: 'var(--spacing-3)' }}>{col.label}</div>
                  {col.points.map(p => (
                    <div key={p} style={{ display: 'flex', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-1)', font: 'var(--text-weight-body) var(--text-size-caption)/var(--text-lh-body) var(--font-primary)', color: 'var(--text-secondary)' }}>
                      <span style={{ color: col.tint, flexShrink: 0 }}>▸</span>{p}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Tab 4: RAG ── */}
      {tab === 4 && (
        <div className="ve-panel">
          <div className="ve-section-title">Retrieval-augmented generation (RAG)</div>
          <p className="ve-section-sub">RAG combines embeddings, vector search, and LLMs. Instead of relying on training memory alone, the model retrieves relevant documents at query time and grounds its answer in real data.</p>

          <div className="ve-card">
            <div className="ve-card-title">RAG pipeline</div>
            <div className="rag-flow">
              {RAG_STEPS.map((step, i) => (
                <div key={i} className="rag-step">
                  <div className="rag-dot" style={{ '--rag-tint': step.tint, '--rag-soft': step.soft }}>
                    <IconFor name={step.iconKey} size={18} weight="duotone" />
                  </div>
                  <div className="rag-body">
                    <div className="rag-type" style={{ '--rag-tint': step.tint }}>{step.type}</div>
                    <div className="rag-content">{step.content}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="ve-card">
            <div className="ve-card-title">Why RAG matters</div>
            <div style={{ display: 'grid', gap: 'var(--spacing-3)' }}>
              {[
                { iconKey: 'brain',     title: 'Overcomes knowledge cutoffs',     desc: "LLMs have training cutoffs. RAG lets them answer questions about documents from today — no retraining required." },
                { iconKey: 'target',    title: 'Reduces hallucination',           desc: "By grounding answers in retrieved text, the model is less likely to invent facts. It's citing sources, not guessing." },
                { iconKey: 'lock',      title: 'Private knowledge stays private', desc: "Your internal documents never leave your system. The LLM reads chunks at inference time — no fine-tuning needed." },
                { iconKey: 'lightning', title: 'More efficient than fine-tuning', desc: "Adding new knowledge via RAG is instant and cheap. Fine-tuning a model costs thousands of dollars and hours of compute." },
              ].map(({ iconKey, title, desc }) => (
                <div key={title} style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
                  <span style={{ color: 'var(--blue-500)', flexShrink: 0, marginTop: 2 }}><IconFor name={iconKey} size={20} weight="duotone" /></span>
                  <div>
                    <div style={{ font: 'var(--text-weight-label) var(--text-size-body)/1.4 var(--font-primary)', color: 'var(--text-primary)', marginBottom: 'var(--spacing-1)' }}>{title}</div>
                    <div style={{ font: 'var(--text-weight-body) var(--text-size-caption)/var(--text-lh-body) var(--font-primary)', color: 'var(--text-secondary)' }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Tab 5: Quiz ── */}
      {tab === 5 && (
        <div className="ve-panel">
          <div className="ve-section-title">Quick quiz</div>
          <p className="ve-section-sub">Six questions to check what stuck. The next question is picked from a harder or easier pool based on how you do.</p>
          {!done ? (
            <div className="ve-card">
              {currentQ && (
                <>
                  <div className="ve-progress"><div className="ve-progress-fill" style={{ width: `${(qNum / SESSION_SIZE) * 100}%` }} /></div>
                  <div className="ve-quiz-meta">Question {qNum + 1} of {SESSION_SIZE}</div>
                  <span className={`ve-diff-badge ${currentQ.difficulty}`}>{currentQ.difficulty}</span>
                  <div className="ve-quiz-q">{currentQ.q}</div>
                  <div className="ve-quiz-opts" role="radiogroup">
                    {currentQ.opts.map((opt, i) => (
                      <button
                        key={i}
                        disabled={chosen !== null}
                        role="radio"
                        aria-checked={chosen === i}
                        className={`ve-quiz-opt${chosen !== null && i === currentQ.correct ? ' correct' : ''}${chosen === i && i !== currentQ.correct ? ' wrong' : ''}`}
                        onClick={() => handleQuiz(i)}
                      >
                        <span className="ve-quiz-opt-letter">{['A','B','C','D'][i]}.</span>
                        {opt}
                      </button>
                    ))}
                  </div>
                  {chosen !== null && (
                    <>
                      <div className="ve-quiz-exp">{currentQ.explanation}</div>
                      <button className="ve-quiz-next" onClick={nextQ}>
                        {qNum + 1 < SESSION_SIZE ? 'Next question' : 'See results'}
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="ve-card" style={{ textAlign: 'center', padding: 'var(--spacing-7)' }}>
              <div className="ve-quiz-meta" style={{ textAlign: 'center' }}>Final score</div>
              <div className="ve-score-num">{score}/{SESSION_SIZE}</div>
              <div style={{ font: 'var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary)', color: 'var(--text-secondary)', marginTop: 'var(--spacing-2)' }}>
                {score >= SESSION_SIZE
                  ? 'You understand embeddings deeply.'
                  : score >= SESSION_SIZE / 2
                    ? 'Solid run. Worth a quick re-read of the trickier sections.'
                    : 'Embeddings take a couple of passes to click. Try a tab you skipped, then retake.'}
              </div>
              <button className="ve-quiz-next" style={{ marginTop: 'var(--spacing-6)' }} onClick={retake}>
                Retake quiz
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
