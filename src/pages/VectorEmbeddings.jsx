import { useState, useEffect, useRef } from 'react'
import NavBar from '../components/NavBar.jsx'

const css = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap');

.ve-root { min-height: 100vh; background: #050810; color: #e0e8f0; font-family: 'IBM Plex Mono', monospace; overflow-x: hidden; }

.ve-hero { text-align: center; padding: 48px 24px 28px; position: relative; }
.ve-hero::before { content: ''; position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 700px; height: 320px; background: radial-gradient(ellipse at 50% 0%, rgba(249,115,22,0.09) 0%, transparent 70%); pointer-events: none; }
.ve-eyebrow { font-size: 16px; letter-spacing: 0.22em; color: #f97316; text-transform: uppercase; margin-bottom: 14px; }
.ve-title { font-family: 'IBM Plex Sans', sans-serif; font-size: clamp(28px, 5vw, 52px); font-weight: 800; letter-spacing: -0.02em; color: #fff; line-height: 1.05; margin-bottom: 12px; }
.ve-title span { color: #f97316; }
.ve-subtitle { font-size: 16px; color: #7a6a5a; max-width: 540px; margin: 0 auto 32px; line-height: 1.8; }

.ve-tabs { display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; padding: 0 16px 32px; }
.ve-tab { background: transparent; border: 1px solid #2a1e12; color: #7a6a5a; font-family: 'IBM Plex Mono', monospace; font-size: 16px; letter-spacing: 0.1em; padding: 8px 16px; border-radius: 6px; cursor: pointer; transition: all 0.18s; text-transform: uppercase; }
.ve-tab:hover { border-color: #f97316; color: #f97316; }
.ve-tab.active { background: rgba(249,115,22,0.1); border-color: #f97316; color: #f97316; }

.ve-panel { max-width: 920px; margin: 0 auto; padding: 0 20px 80px; }
.ve-section-title { font-family: 'IBM Plex Sans', sans-serif; font-size: 22px; font-weight: 700; color: #fff; margin-bottom: 8px; }
.ve-section-sub { font-size: 16px; color: #7a6a5a; margin-bottom: 28px; line-height: 1.8; }

.ve-card { background: #0a0c10; border: 1px solid #1e1408; border-radius: 14px; padding: 24px; margin-bottom: 20px; }
.ve-card-title { font-family: 'IBM Plex Sans', sans-serif; font-size: 16px; font-weight: 700; color: #f97316; margin-bottom: 16px; }

/* ── What are embeddings ── */
.word-to-vec { display: flex; align-items: center; gap: 0; flex-wrap: wrap; justify-content: center; margin: 20px 0; }
.wtv-word { background: rgba(249,115,22,0.1); border: 1px solid rgba(249,115,22,0.3); border-radius: 8px; padding: 10px 18px; font-family: 'IBM Plex Sans', sans-serif; font-size: 18px; font-weight: 700; color: #f97316; }
.wtv-arrow { font-size: 22px; color: #3a2a1a; margin: 0 12px; }
.wtv-vector { display: flex; gap: 4px; flex-wrap: wrap; max-width: 340px; }
.wtv-dim { width: 28px; height: 28px; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 500; transition: all 0.4s; border: 1px solid transparent; }

.analogy-box { display: grid; grid-template-columns: 1fr auto 1fr auto 1fr auto 1fr; gap: 8px; align-items: center; margin: 16px 0; }
@media (max-width: 600px) { .analogy-box { grid-template-columns: 1fr auto 1fr; } }
.analogy-word { background: rgba(249,115,22,0.08); border: 1px solid rgba(249,115,22,0.2); border-radius: 8px; padding: 10px; text-align: center; }
.analogy-word .aw-word { font-family: 'IBM Plex Sans', sans-serif; font-size: 16px; font-weight: 700; color: #f97316; }
.analogy-word .aw-vec { font-size: 10px; color: #5a4a3a; margin-top: 4px; }
.analogy-op { font-size: 18px; color: #5a4a3a; text-align: center; font-weight: 700; }
.analogy-result { background: rgba(52,211,153,0.08); border: 2px solid rgba(52,211,153,0.3); border-radius: 8px; padding: 10px; text-align: center; }
.analogy-result .aw-word { color: #34d399; }

/* ── 2D Space ── */
.space-canvas { background: #06080c; border: 1px solid #1e1408; border-radius: 10px; position: relative; overflow: hidden; cursor: crosshair; }
.space-point { position: absolute; transform: translate(-50%, -50%); transition: all 0.4s cubic-bezier(.4,0,.2,1); }
.space-dot { width: 12px; height: 12px; border-radius: 50%; border: 2px solid; transition: all 0.3s; cursor: pointer; }
.space-dot:hover { transform: scale(1.4); }
.space-label { position: absolute; font-size: 11px; white-space: nowrap; font-family: 'IBM Plex Mono', monospace; pointer-events: none; }
.space-line { position: absolute; pointer-events: none; transform-origin: 0 0; }
.cluster-label { position: absolute; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; opacity: 0.4; pointer-events: none; }
.space-legend { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 14px; font-size: 12px; }
.legend-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; margin-right: 5px; vertical-align: middle; }

/* ── Similarity ── */
.sim-pair { display: grid; grid-template-columns: 1fr auto 1fr; gap: 12px; align-items: center; margin-bottom: 12px; }
.sim-word-box { background: #06080c; border: 1px solid #1e1408; border-radius: 8px; padding: 12px 16px; text-align: center; }
.sim-word { font-family: 'IBM Plex Sans', sans-serif; font-size: 16px; font-weight: 700; color: #e0e8f0; }
.sim-score-col { text-align: center; }
.sim-bar-wrap { width: 100%; background: #06080c; border-radius: 100px; height: 8px; overflow: hidden; border: 1px solid #1e1408; margin-top: 4px; }
.sim-bar { height: 100%; border-radius: 100px; transition: width 0.6s cubic-bezier(.4,0,.2,1); }
.sim-val { font-family: 'IBM Plex Sans', sans-serif; font-size: 18px; font-weight: 800; }
.sim-label { font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: #5a4a3a; margin-top: 2px; }
.sim-selector { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
.sim-btn { background: transparent; border: 1px solid #2a1e12; color: #7a6a5a; font-family: 'IBM Plex Mono', monospace; font-size: 11px; padding: 6px 12px; border-radius: 6px; cursor: pointer; transition: all 0.18s; }
.sim-btn:hover, .sim-btn.active { background: rgba(249,115,22,0.1); border-color: #f97316; color: #f97316; }

/* ── Semantic Search ── */
.search-box { display: flex; gap: 10px; margin-bottom: 20px; }
.search-input { flex: 1; background: #06080c; border: 1px solid #1e1408; border-radius: 8px; color: #e0e8f0; font-family: 'IBM Plex Mono', monospace; font-size: 16px; padding: 12px 16px; outline: none; transition: border-color 0.2s; }
.search-input:focus { border-color: #f97316; }
.search-btn { background: rgba(249,115,22,0.15); border: 1px solid #f97316; color: #f97316; font-family: 'IBM Plex Mono', monospace; font-size: 12px; padding: 12px 20px; border-radius: 8px; cursor: pointer; white-space: nowrap; transition: all 0.18s; letter-spacing: 0.08em; text-transform: uppercase; }
.search-btn:hover { background: rgba(249,115,22,0.25); }
.search-result { display: flex; align-items: center; gap: 14px; padding: 12px 16px; background: #06080c; border: 1px solid #1e1408; border-radius: 8px; margin-bottom: 8px; transition: all 0.3s; }
.search-result.top { border-color: rgba(249,115,22,0.4); background: rgba(249,115,22,0.04); }
.sr-rank { font-family: 'IBM Plex Sans', sans-serif; font-size: 13px; font-weight: 700; color: #3a2a1a; width: 24px; flex-shrink: 0; }
.sr-text { flex: 1; font-size: 16px; color: #b0a898; line-height: 1.5; }
.sr-score-bar { width: 80px; flex-shrink: 0; }
.sr-score-val { font-family: 'IBM Plex Sans', sans-serif; font-size: 12px; font-weight: 700; color: #f97316; text-align: right; margin-bottom: 3px; }
.sr-bar-bg { background: #1e1408; border-radius: 100px; height: 4px; overflow: hidden; }
.sr-bar-fill { height: 100%; border-radius: 100px; background: #f97316; transition: width 0.5s; }
.search-queries { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }
.query-chip { background: transparent; border: 1px solid #2a1e12; color: #7a6a5a; font-family: 'IBM Plex Mono', monospace; font-size: 11px; padding: 5px 10px; border-radius: 100px; cursor: pointer; transition: all 0.18s; }
.query-chip:hover, .query-chip.active { background: rgba(249,115,22,0.1); border-color: #f97316; color: #f97316; }

/* ── RAG ── */
.rag-flow { display: flex; flex-direction: column; gap: 0; }
.rag-step { display: flex; gap: 16px; }
.rag-step::before { content: ''; width: 2px; margin-left: 19px; margin-top: 44px; height: 28px; background: linear-gradient(#1e1408, transparent); display: block; position: absolute; }
.rag-dot { width: 40px; height: 40px; border-radius: 50%; border: 2px solid; display: flex; align-items: center; justify-content: center; font-size: 15px; flex-shrink: 0; margin-top: 2px; }
.rag-body { flex: 1; padding-bottom: 20px; }
.rag-type { font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 6px; font-weight: 500; }
.rag-content { background: #06080c; border: 1px solid #1e1408; border-radius: 8px; padding: 12px 16px; font-size: 16px; color: #9a8878; line-height: 1.7; }
.rag-content strong { color: #e0e8f0; }
.rag-connector { width: 2px; height: 24px; background: linear-gradient(#1e1408, #1e1408); margin-left: 19px; margin-bottom: 0; }

/* ── Quiz ── */
.ve-quiz-q { font-family: 'IBM Plex Sans', sans-serif; font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 16px; line-height: 1.4; }
.ve-quiz-opts { display: flex; flex-direction: column; gap: 8px; }
.ve-quiz-opt { background: #06080c; border: 1px solid #1e1408; border-radius: 8px; padding: 12px 16px; font-size: 16px; color: #9a8878; cursor: pointer; text-align: left; font-family: 'IBM Plex Mono', monospace; transition: all 0.18s; }
.ve-quiz-opt:hover:not(:disabled) { border-color: #f97316; color: #e0e8f0; }
.ve-quiz-opt.correct { border-color: #34d399; background: rgba(52,211,153,0.08); color: #34d399; }
.ve-quiz-opt.wrong   { border-color: #ef4444; background: rgba(239,68,68,0.06); color: #f87171; }
.ve-quiz-exp { margin-top: 14px; padding: 12px; background: rgba(249,115,22,0.05); border: 1px solid rgba(249,115,22,0.18); border-radius: 8px; font-size: 16px; color: #b08060; line-height: 1.7; }
.ve-quiz-next { margin-top: 12px; background: rgba(249,115,22,0.1); border: 1px solid #f97316; color: #f97316; font-family: 'IBM Plex Mono', monospace; font-size: 16px; padding: 9px 18px; border-radius: 6px; cursor: pointer; letter-spacing: 0.08em; text-transform: uppercase; transition: all 0.18s; }
.ve-quiz-next:hover { background: rgba(249,115,22,0.2); }
.ve-progress { background: #0a0c10; border-radius: 100px; height: 4px; margin-bottom: 20px; overflow: hidden; }
.ve-progress-fill { height: 100%; background: linear-gradient(90deg, #f97316, #fbbf24); border-radius: 100px; transition: width 0.4s; }
.ve-score-num { font-family: 'IBM Plex Sans', sans-serif; font-size: 64px; font-weight: 800; color: #f97316; text-align: center; }

.ve-diff-badge { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.1em; text-transform: uppercase; padding: 3px 10px; border-radius: 100px; border: 1px solid; margin-bottom: 14px; font-weight: 500; }
.ve-diff-badge.easy   { color: #34d399; border-color: rgba(52,211,153,0.35);  background: rgba(52,211,153,0.08); }
.ve-diff-badge.medium { color: #fbbf24; border-color: rgba(251,191,36,0.35);  background: rgba(251,191,36,0.08); }
.ve-diff-badge.hard   { color: #f87171; border-color: rgba(248,113,113,0.35); background: rgba(239,68,68,0.08); }
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

function vecColor(val) {
  if (val > 0.7) return { bg: 'rgba(249,115,22,0.7)', border: '#f97316', color: '#fff' }
  if (val > 0.4) return { bg: 'rgba(251,191,36,0.4)', border: '#fbbf24', color: '#fde68a' }
  return { bg: 'rgba(255,255,255,0.04)', border: '#1e1408', color: '#4a3a2a' }
}

// ── 2D word space (manual layout for clarity) ─────────────────────────────────
const SPACE_WORDS = [
  { word: 'king',    x: 22, y: 18, color: '#f97316', cluster: 'royalty' },
  { word: 'queen',   x: 35, y: 15, color: '#f97316', cluster: 'royalty' },
  { word: 'prince',  x: 28, y: 28, color: '#f97316', cluster: 'royalty' },
  { word: 'man',     x: 18, y: 55, color: '#38bdf8', cluster: 'people' },
  { word: 'woman',   x: 32, y: 58, color: '#38bdf8', cluster: 'people' },
  { word: 'person',  x: 24, y: 68, color: '#38bdf8', cluster: 'people' },
  { word: 'dog',     x: 65, y: 20, color: '#34d399', cluster: 'animals' },
  { word: 'cat',     x: 75, y: 28, color: '#34d399', cluster: 'animals' },
  { word: 'wolf',    x: 70, y: 38, color: '#34d399', cluster: 'animals' },
  { word: 'paris',   x: 62, y: 68, color: '#818cf8', cluster: 'places' },
  { word: 'london',  x: 72, y: 60, color: '#818cf8', cluster: 'places' },
  { word: 'tokyo',   x: 82, y: 72, color: '#818cf8', cluster: 'places' },
  { word: 'france',  x: 55, y: 80, color: '#818cf8', cluster: 'places' },
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
const RAG_STEPS = [
  { icon: '❓', type: 'User Query', color: '#f97316', dotBg: 'rgba(249,115,22,0.15)', dotBorder: '#f97316', content: <span><strong>"What are the best practices for prompt engineering?"</strong> — Query is received by the RAG system.</span> },
  { icon: '🔢', type: 'Embed Query', color: '#38bdf8', dotBg: 'rgba(56,189,248,0.15)', dotBorder: '#38bdf8', content: <span>The query is passed through an embedding model → <strong>[0.82, 0.14, 0.67, 0.31, ...]</strong> — a vector that captures its meaning.</span> },
  { icon: '🔍', type: 'Vector Search', color: '#818cf8', dotBg: 'rgba(129,140,248,0.15)', dotBorder: '#818cf8', content: <span>Cosine similarity is computed between the query vector and all document vectors. The <strong>top-k most similar chunks</strong> are retrieved from the vector database.</span> },
  { icon: '📄', type: 'Retrieved Context', color: '#fbbf24', dotBg: 'rgba(251,191,36,0.1)', dotBorder: '#fbbf24', content: <span>Top 3 chunks retrieved: <strong>"Be specific and provide examples..." | "Use delimiters to separate..." | "Chain-of-thought prompting..."</strong></span> },
  { icon: '🤖', type: 'LLM Generation', color: '#34d399', dotBg: 'rgba(52,211,153,0.1)', dotBorder: '#34d399', content: <span>The query + retrieved context is sent to the LLM. It <strong>grounds its answer</strong> in the retrieved documents, not just training memory.</span> },
  { icon: '✅', type: 'Grounded Answer', color: '#34d399', dotBg: 'rgba(52,211,153,0.1)', dotBorder: '#34d399', content: <span><strong>"Best practices include: (1) Be specific about the task... (2) Use structured formats... (3) Provide few-shot examples..."</strong> — accurate, sourced answer.</span> },
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
  const TABS = ['What are Embeddings?', 'Vector Space', 'Similarity', 'Semantic Search', 'RAG', 'Quiz']

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

      <div className="ve-hero">
        <div className="ve-eyebrow">Interactive Guide</div>
        <h1 className="ve-title">Vector <span>Embeddings</span></h1>
        <p className="ve-subtitle">How AI turns words, sentences, and concepts into numbers — and why nearby numbers mean similar meanings.</p>
      </div>

      <div className="ve-tabs">
        {TABS.map((t, i) => (
          <button key={i} className={`ve-tab${tab === i ? ' active' : ''}`} onClick={() => setTab(i)}>{t}</button>
        ))}
      </div>

      {/* ── Tab 0: What are embeddings ── */}
      {tab === 0 && (
        <div className="ve-panel">
          <div className="ve-section-title">What Are Vector Embeddings?</div>
          <p className="ve-section-sub">An embedding converts text (or any data) into a list of numbers called a vector. Words with similar meanings end up with similar numbers — so the meaning is baked into the math. Click a word to see its vector.</p>

          <div className="ve-card">
            <div className="ve-card-title">// Word → Vector</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
              {Object.keys(WORDS).map(w => (
                <button key={w} className={`sim-btn${selectedWord === w ? ' active' : ''}`} onClick={() => setSelectedWord(w)}>{w}</button>
              ))}
            </div>
            <div className="word-to-vec">
              <div className="wtv-word">"{selectedWord}"</div>
              <div className="wtv-arrow">→</div>
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
            <p style={{ fontSize: 12, color: '#5a4a3a', marginTop: 14, lineHeight: 1.7 }}>
              Each number represents how strongly the word activates a learned dimension. Real embeddings have 768–3072 dimensions — we're showing 8 for clarity.
              <span style={{ color: '#f97316', marginLeft: 8 }}>Darker orange = stronger activation.</span>
            </p>
          </div>

          <div className="ve-card">
            <div className="ve-card-title">// The Famous Analogy: king − man + woman ≈ queen</div>
            <p style={{ fontSize: 13, color: '#7a6a5a', marginBottom: 16, lineHeight: 1.7 }}>
              Because meaning is encoded geometrically, you can do arithmetic on embeddings.
              The direction from "man" to "woman" is the same as from "king" to "queen".
            </p>
            <div className="analogy-box">
              {[
                { word: 'king',   vec: '[0.9, 0.1, 0.8...]' },
                { op: '−' },
                { word: 'man',    vec: '[0.4, 0.1, 0.3...]' },
                { op: '+' },
                { word: 'woman',  vec: '[0.4, 0.8, 0.3...]' },
                { op: '≈' },
                { word: 'queen',  vec: '[0.9, 0.8, 0.8...]', result: true },
              ].map((item, i) => item.op
                ? <div key={i} className="analogy-op">{item.op}</div>
                : <div key={i} className={item.result ? 'analogy-result' : 'analogy-word'}>
                    <div className="aw-word">{item.word}</div>
                    <div className="aw-vec">{item.vec}</div>
                  </div>
              )}
            </div>
            <div style={{ marginTop: 14, padding: '10px 14px', background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 8, fontSize: 13, color: '#c08060', lineHeight: 1.7 }}>
              💡 This works because the embedding space learned that "royalty" and "gender" are separate, independent directions. Vector arithmetic navigates these directions.
            </div>
          </div>

          <div className="ve-card">
            <div className="ve-card-title">// Why Do Embeddings Matter?</div>
            <div style={{ display: 'grid', gap: 12 }}>
              {[
                ['🔍 Semantic Search', 'Find documents that mean the same thing, even if they use different words. "automobile" and "car" end up near each other.'],
                ['🤖 RAG Systems', 'Retrieve the most relevant context for an LLM by comparing query embeddings to document embeddings.'],
                ['🧭 Recommendations', 'Netflix, Spotify, and Amazon all use embeddings to find items similar to ones you liked.'],
                ['🔗 Cross-modal matching', 'Text and image embeddings can share the same space — enabling search like "find images similar to this sentence."'],
              ].map(([title, desc]) => (
                <div key={title} style={{ display: 'flex', gap: 12 }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{title.split(' ')[0]}</span>
                  <div>
                    <div style={{ fontFamily: "'IBM Plex Sans',sans-serif", fontSize: 14, fontWeight: 700, color: '#e0e8f0', marginBottom: 3 }}>{title.slice(2)}</div>
                    <div style={{ fontSize: 13, color: '#7a6a5a', lineHeight: 1.6 }}>{desc}</div>
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
          <div className="ve-section-title">Vector Space Visualization</div>
          <p className="ve-section-sub">In a real embedding space, similar words cluster together. This 2D map is a simplified projection — imagine it in 768+ dimensions. Hover over any word.</p>

          <div className="ve-card">
            <div className="ve-card-title">// 2D Embedding Space (simplified projection)</div>
            <div className="space-canvas" style={{ height: 380 }}>
              {/* Cluster background regions */}
              <div style={{ position: 'absolute', left: '10%', top: '8%', width: '34%', height: '32%', background: 'rgba(249,115,22,0.04)', border: '1px dashed rgba(249,115,22,0.15)', borderRadius: 12 }} />
              <div style={{ position: 'absolute', left: '8%', top: '44%', width: '32%', height: '34%', background: 'rgba(56,189,248,0.04)', border: '1px dashed rgba(56,189,248,0.15)', borderRadius: 12 }} />
              <div style={{ position: 'absolute', left: '57%', top: '8%', width: '36%', height: '38%', background: 'rgba(52,211,153,0.04)', border: '1px dashed rgba(52,211,153,0.15)', borderRadius: 12 }} />
              <div style={{ position: 'absolute', left: '48%', top: '52%', width: '44%', height: '40%', background: 'rgba(129,140,248,0.04)', border: '1px dashed rgba(129,140,248,0.15)', borderRadius: 12 }} />

              {/* Cluster labels */}
              <div className="cluster-label" style={{ left: '12%', top: '10%', color: '#f97316' }}>Royalty</div>
              <div className="cluster-label" style={{ left: '10%', top: '46%', color: '#38bdf8' }}>People</div>
              <div className="cluster-label" style={{ left: '60%', top: '10%', color: '#34d399' }}>Animals</div>
              <div className="cluster-label" style={{ left: '51%', top: '54%', color: '#818cf8' }}>Places</div>

              {/* Words */}
              {SPACE_WORDS.map(w => (
                <div key={w.word} className="space-point"
                  style={{ left: `${w.x}%`, top: `${w.y}%` }}
                  onMouseEnter={() => setHoveredWord(w.word)}
                  onMouseLeave={() => setHoveredWord(null)}>
                  <div className="space-dot" style={{
                    background: hoveredWord === w.word ? w.color : `${w.color}30`,
                    borderColor: w.color,
                    transform: hoveredWord === w.word ? 'scale(1.6)' : 'scale(1)',
                  }} />
                  <div className="space-label" style={{
                    color: hoveredWord === w.word ? w.color : `${w.color}90`,
                    top: -18, left: 8,
                    fontWeight: hoveredWord === w.word ? 700 : 400,
                    fontSize: hoveredWord === w.word ? 13 : 11,
                  }}>{w.word}</div>
                </div>
              ))}

              {/* Hover info */}
              {hoveredWord && (
                <div style={{ position: 'absolute', bottom: 12, left: 12, background: 'rgba(10,12,16,0.95)', border: '1px solid #2a1e12', borderRadius: 8, padding: '8px 14px', fontSize: 12, color: '#b0a898' }}>
                  <span style={{ color: '#f97316', fontWeight: 700 }}>{hoveredWord}</span>
                  {' '}— cluster: <span style={{ color: SPACE_WORDS.find(w => w.word === hoveredWord)?.color }}>
                    {SPACE_WORDS.find(w => w.word === hoveredWord)?.cluster}
                  </span>
                </div>
              )}
            </div>

            <div className="space-legend">
              {[['#f97316','Royalty'],['#38bdf8','People'],['#34d399','Animals'],['#818cf8','Places']].map(([c, l]) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', fontSize: 12, color: '#7a6a5a' }}>
                  <span className="legend-dot" style={{ background: c }} />{l}
                </div>
              ))}
            </div>
          </div>

          <div className="ve-card">
            <div className="ve-card-title">// Key Insight: Distance = Meaning</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { label: '📍 Close in space', color: '#34d399', bg: 'rgba(52,211,153,0.05)', border: 'rgba(52,211,153,0.2)', points: ['"dog" and "cat" are nearby', '"paris" and "london" are nearby', '"king" and "queen" are nearby', 'Same semantic category → close'] },
                { label: '🌐 Far in space', color: '#f97316', bg: 'rgba(249,115,22,0.05)', border: 'rgba(249,115,22,0.2)', points: ['"dog" and "paris" are far apart', '"king" and "wolf" are far apart', 'Different categories → distant', 'Distance encodes difference'] },
              ].map(col => (
                <div key={col.label} style={{ background: col.bg, border: `1px solid ${col.border}`, borderRadius: 10, padding: 16 }}>
                  <div style={{ fontFamily: "'IBM Plex Sans',sans-serif", fontWeight: 700, fontSize: 13, color: col.color, marginBottom: 10 }}>{col.label}</div>
                  {col.points.map(p => (
                    <div key={p} style={{ display: 'flex', gap: 8, marginBottom: 6, fontSize: 12, color: '#7a6a5a', lineHeight: 1.5 }}>
                      <span style={{ color: col.color, flexShrink: 0 }}>▸</span>{p}
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
          <div className="ve-section-title">Cosine Similarity</div>
          <p className="ve-section-sub">Cosine similarity measures the angle between two vectors — not their distance. A score of 1.0 means identical direction (same meaning), 0 means unrelated. Select a set to explore.</p>

          <div className="ve-card">
            <div className="ve-card-title">// Similarity Explorer</div>
            <div className="sim-selector">
              {Object.keys(SIM_SETS).map(k => (
                <button key={k} className={`sim-btn${simSet === k ? ' active' : ''}`} onClick={() => setSimSet(k)}>{k}</button>
              ))}
            </div>
            {SIM_SETS[simSet].map((pair, i) => {
              const pct = pair.score * 100
              const color = pair.score > 0.8 ? '#34d399' : pair.score > 0.5 ? '#f97316' : '#ef4444'
              return (
                <div key={i} style={{ marginBottom: 16 }}>
                  <div className="sim-pair">
                    <div className="sim-word-box"><div className="sim-word">{pair.a}</div></div>
                    <div className="sim-score-col">
                      <div className="sim-val" style={{ color }}>{pair.score.toFixed(2)}</div>
                      <div className="sim-label">{pair.label}</div>
                    </div>
                    <div className="sim-word-box"><div className="sim-word">{pair.b}</div></div>
                  </div>
                  <div className="sim-bar-wrap">
                    <div className="sim-bar" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}80, ${color})` }} />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="ve-card">
            <div className="ve-card-title">// How Cosine Similarity Works</div>
            <p style={{ fontSize: 13, color: '#7a6a5a', lineHeight: 1.8, marginBottom: 14 }}>
              Instead of measuring how far apart two points are (Euclidean distance), cosine similarity measures the angle between them. This makes it <span style={{ color: '#f97316' }}>length-independent</span> — a short and long document about the same topic will still score high.
            </p>
            <div style={{ background: '#06080c', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 8, padding: 16, fontFamily: "'IBM Plex Mono',monospace", fontSize: 13, color: '#f97316', lineHeight: 2 }}>
              <div style={{ color: '#5a4a3a' }}>// Formula</div>
              similarity(A, B) = <span style={{ color: '#fbbf24' }}>cos(θ)</span> = <span style={{ color: '#34d399' }}>(A · B)</span> / <span style={{ color: '#38bdf8' }}>(|A| × |B|)</span>
              <div style={{ marginTop: 8, fontSize: 12, color: '#5a4a3a' }}>
                <span style={{ color: '#34d399' }}>A · B</span> = dot product &nbsp;|&nbsp;
                <span style={{ color: '#38bdf8' }}>|A|, |B|</span> = vector magnitudes
              </div>
            </div>
            <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
              {[['1.0', 'Identical', '#34d399'], ['0.5', 'Related', '#f97316'], ['0.0', 'Unrelated', '#818cf8']].map(([val, label, color]) => (
                <div key={val} style={{ background: '#06080c', border: `1px solid ${color}30`, borderRadius: 8, padding: 12, textAlign: 'center' }}>
                  <div style={{ fontFamily: "'IBM Plex Sans',sans-serif", fontSize: 22, fontWeight: 800, color }}>{val}</div>
                  <div style={{ fontSize: 12, color: '#5a4a3a', marginTop: 4 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Tab 3: Semantic Search ── */}
      {tab === 3 && (
        <div className="ve-panel">
          <div className="ve-section-title">Semantic Search</div>
          <p className="ve-section-sub">Unlike keyword search (which matches exact words), semantic search finds documents with similar meaning. Click a query to see how the results change based on semantic similarity — not word overlap.</p>

          <div className="ve-card">
            <div className="ve-card-title">// Live Semantic Search Demo</div>
            <div style={{ fontSize: 13, color: '#7a6a5a', marginBottom: 12 }}>Try a query:</div>
            <div className="search-queries">
              {Object.keys(QUERIES).map(q => (
                <button key={q} className={`query-chip${activeQuery === q ? ' active' : ''}`} onClick={() => setActiveQuery(q)}>"{q}"</button>
              ))}
            </div>
            <div style={{ marginBottom: 16, padding: '10px 14px', background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 8, fontSize: 13, color: '#b08060' }}>
              🔍 Query: <span style={{ color: '#f97316', fontWeight: 600 }}>"{activeQuery}"</span>
            </div>
            {searchResults.map((r, i) => (
              <div key={i} className={`search-result${i === 0 ? ' top' : ''}`}>
                <div className="sr-rank" style={{ color: i === 0 ? '#f97316' : '#3a2a1a' }}>#{r.rank}</div>
                <div className="sr-text">{r.text}</div>
                <div className="sr-score-bar">
                  <div className="sr-score-val">{r.score.toFixed(2)}</div>
                  <div className="sr-bar-bg">
                    <div className="sr-bar-fill" style={{ width: `${r.score * 100}%`, opacity: 0.6 + i * -0.06 }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="ve-card">
            <div className="ve-card-title">// Keyword Search vs. Semantic Search</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { label: '❌ Keyword Search', color: '#f87171', bg: 'rgba(239,68,68,0.05)', border: 'rgba(239,68,68,0.2)', points: ['Matches exact words only', '"car" won\'t find "automobile"', '"ML" won\'t find "machine learning"', 'Order and context ignored'] },
                { label: '✅ Semantic Search', color: '#34d399', bg: 'rgba(52,211,153,0.05)', border: 'rgba(52,211,153,0.2)', points: ['Matches meaning, not words', '"car" finds "automobile", "vehicle"', 'Paraphrases match correctly', 'Context and nuance captured'] },
              ].map(col => (
                <div key={col.label} style={{ background: col.bg, border: `1px solid ${col.border}`, borderRadius: 10, padding: 16 }}>
                  <div style={{ fontFamily: "'IBM Plex Sans',sans-serif", fontWeight: 700, fontSize: 13, color: col.color, marginBottom: 10 }}>{col.label}</div>
                  {col.points.map(p => (
                    <div key={p} style={{ display: 'flex', gap: 8, marginBottom: 6, fontSize: 12, color: '#7a6a5a', lineHeight: 1.5 }}>
                      <span style={{ color: col.color, flexShrink: 0 }}>▸</span>{p}
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
          <div className="ve-section-title">Retrieval-Augmented Generation (RAG)</div>
          <p className="ve-section-sub">RAG combines embeddings + vector search + LLMs. Instead of relying on training memory alone, the model retrieves relevant documents at query time and grounds its answer in real data.</p>

          <div className="ve-card">
            <div className="ve-card-title">// RAG Pipeline</div>
            <div className="rag-flow">
              {RAG_STEPS.map((step, i) => (
                <div key={i}>
                  <div className="rag-step">
                    <div className="rag-dot" style={{ background: step.dotBg, borderColor: step.dotBorder, color: step.color }}>{step.icon}</div>
                    <div className="rag-body">
                      <div className="rag-type" style={{ color: step.color }}>{step.type}</div>
                      <div className="rag-content">{step.content}</div>
                    </div>
                  </div>
                  {i < RAG_STEPS.length - 1 && <div className="rag-connector" />}
                </div>
              ))}
            </div>
          </div>

          <div className="ve-card">
            <div className="ve-card-title">// Why RAG Matters</div>
            <div style={{ display: 'grid', gap: 12 }}>
              {[
                ['🧠 Overcomes knowledge cutoffs', 'LLMs have training cutoffs. RAG lets them answer questions about documents from today — no retraining required.'],
                ['🎯 Reduces hallucination', 'By grounding answers in retrieved text, the model is less likely to invent facts. It\'s citing sources, not guessing.'],
                ['🔒 Private knowledge', 'Your internal documents never leave your system. The LLM reads chunks at inference time — no fine-tuning needed.'],
                ['⚡ More efficient than fine-tuning', 'Adding new knowledge via RAG is instant and cheap. Fine-tuning a model costs thousands of dollars and hours of compute.'],
              ].map(([title, desc]) => (
                <div key={title} style={{ display: 'flex', gap: 12 }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{title.split(' ')[0]}</span>
                  <div>
                    <div style={{ fontFamily: "'IBM Plex Sans',sans-serif", fontSize: 14, fontWeight: 700, color: '#e0e8f0', marginBottom: 3 }}>{title.slice(2)}</div>
                    <div style={{ fontSize: 13, color: '#7a6a5a', lineHeight: 1.6 }}>{desc}</div>
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
          <div className="ve-section-title">Quick Quiz</div>
          <p className="ve-section-sub">Test your understanding of vector embeddings, similarity, and RAG.</p>
          {!done ? (
            <div className="ve-card">
              {currentQ && (
                <>
                  <div className="ve-progress"><div className="ve-progress-fill" style={{ width: `${(qNum / SESSION_SIZE) * 100}%` }} /></div>
                  <div style={{ fontSize: 12, color: '#5a4a3a', marginBottom: 16 }}>QUESTION {qNum + 1} / {SESSION_SIZE}</div>
                  <span className={`ve-diff-badge ${currentQ.difficulty}`}>⬤ {currentQ.difficulty}</span>
                  <div className="ve-quiz-q">{currentQ.q}</div>
                  <div className="ve-quiz-opts">
                    {currentQ.opts.map((opt, i) => (
                      <button key={i} disabled={chosen !== null}
                        className={`ve-quiz-opt${chosen !== null && i === currentQ.correct ? ' correct' : ''}${chosen === i && i !== currentQ.correct ? ' wrong' : ''}`}
                        onClick={() => handleQuiz(i)}>
                        {['A','B','C','D'][i]}. {opt}
                      </button>
                    ))}
                  </div>
                  {chosen !== null && (
                    <>
                      <div className="ve-quiz-exp">{currentQ.explanation}</div>
                      <button className="ve-quiz-next" onClick={nextQ}>{qNum + 1 < SESSION_SIZE ? 'Next Question →' : 'See Results →'}</button>
                    </>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="ve-card" style={{ textAlign: 'center', padding: 40 }}>
              <div style={{ fontSize: 12, color: '#5a4a3a', marginBottom: 12, letterSpacing: '0.12em' }}>FINAL SCORE</div>
              <div className="ve-score-num">{score}/{SESSION_SIZE}</div>
              <div style={{ fontSize: 14, color: '#7a6a5a', marginTop: 8 }}>
                {score >= SESSION_SIZE ? 'Perfect! You understand embeddings deeply. 🎉' : score >= SESSION_SIZE / 2 ? 'Good work! Review the sections you found tricky. 📚' : 'Keep exploring — embeddings take time to click. 💪'}
              </div>
              <button className="ve-quiz-next" style={{ marginTop: 24 }} onClick={retake}>Retake Quiz ↺</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
