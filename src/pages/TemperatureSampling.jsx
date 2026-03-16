import { useState, useEffect, useRef, useCallback } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import NavBar from '../components/NavBar.jsx'

const css = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap');

.ts-root { min-height: 100vh; background: #050810; color: #e0e8f0; font-family: 'IBM Plex Mono', monospace; overflow-x: hidden; }

.ts-hero { text-align: center; padding: 48px 24px 28px; position: relative; }
.ts-hero::before { content: ''; position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 700px; height: 320px; background: radial-gradient(ellipse at 50% 0%, rgba(236,72,153,0.09) 0%, transparent 70%); pointer-events: none; }
.ts-eyebrow { font-size: 16px; letter-spacing: 0.22em; color: #ec4899; text-transform: uppercase; margin-bottom: 14px; }
.ts-title { font-family: 'IBM Plex Sans', sans-serif; font-size: clamp(28px, 5vw, 52px); font-weight: 800; letter-spacing: -0.02em; color: #fff; line-height: 1.05; margin-bottom: 12px; }
.ts-title span { color: #ec4899; }
.ts-subtitle { font-size: 16px; color: #7a5a6a; max-width: 540px; margin: 0 auto 32px; line-height: 1.8; }

.ts-tabs { display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; padding: 0 16px 32px; }
.ts-tab { background: transparent; border: 1px solid #2a1222; color: #7a5a6a; font-family: 'IBM Plex Mono', monospace; font-size: 16px; letter-spacing: 0.1em; padding: 8px 16px; border-radius: 6px; cursor: pointer; transition: all 0.18s; text-transform: uppercase; }
.ts-tab:hover { border-color: #ec4899; color: #ec4899; }
.ts-tab.active { background: rgba(236,72,153,0.1); border-color: #ec4899; color: #ec4899; }

.ts-panel { max-width: 920px; margin: 0 auto; padding: 0 20px 80px; }
.ts-section-title { font-family: 'IBM Plex Sans', sans-serif; font-size: 22px; font-weight: 700; color: #fff; margin-bottom: 8px; }
.ts-section-sub { font-size: 16px; color: #7a5a6a; margin-bottom: 28px; line-height: 1.8; }

.ts-card { background: #0a080e; border: 1px solid #1e1020; border-radius: 14px; padding: 24px; margin-bottom: 20px; }
.ts-card-title { font-family: 'IBM Plex Sans', sans-serif; font-size: 16px; font-weight: 700; color: #ec4899; margin-bottom: 16px; }

/* ── Slider ── */
.ts-slider-row { display: flex; align-items: center; gap: 14px; margin-bottom: 8px; }
.ts-slider-label { font-size: 12px; color: #7a5a6a; width: 100px; flex-shrink: 0; }
.ts-slider { flex: 1; accent-color: #ec4899; cursor: pointer; }
.ts-slider-val { font-family: 'IBM Plex Sans', sans-serif; font-size: 18px; font-weight: 800; color: #ec4899; width: 48px; text-align: right; flex-shrink: 0; }

/* ── Distribution bars ── */
.dist-container { margin: 16px 0; }
.dist-row { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
.dist-token { font-size: 14px; color: #b0a0b8; width: 120px; flex-shrink: 0; text-align: right; font-family: 'IBM Plex Mono', monospace; }
.dist-bar-bg { flex: 1; background: #0a080e; border-radius: 100px; height: 22px; overflow: hidden; border: 1px solid #1e1020; }
.dist-bar-fill { height: 100%; border-radius: 100px; transition: width 0.5s cubic-bezier(.4,0,.2,1); display: flex; align-items: center; padding-right: 8px; justify-content: flex-end; }
.dist-pct { font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.8); }
.dist-prob { width: 52px; font-size: 12px; color: #5a4a5a; flex-shrink: 0; text-align: left; }
.dist-sampled { width: 16px; height: 16px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 9px; }

/* ── Sampling viz ── */
.sample-output { background: #06040a; border: 1px solid #1e1020; border-radius: 8px; padding: 16px; min-height: 60px; font-size: 16px; color: #b0a0b8; line-height: 1.8; margin-top: 14px; }
.sample-token { display: inline-block; margin: 2px; padding: 2px 6px; border-radius: 4px; font-family: 'IBM Plex Mono', monospace; font-size: 14px; transition: all 0.2s; }
.sample-btn { background: rgba(236,72,153,0.1); border: 1px solid #ec4899; color: #ec4899; font-family: 'IBM Plex Mono', monospace; font-size: 16px; padding: 9px 18px; border-radius: 6px; cursor: pointer; letter-spacing: 0.08em; text-transform: uppercase; transition: all 0.18s; margin-top: 12px; }
.sample-btn:hover { background: rgba(236,72,153,0.2); }
.sample-btn:disabled { opacity: 0.5; cursor: default; }

/* ── Comparison grid ── */
.compare-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
@media (max-width: 600px) { .compare-grid { grid-template-columns: 1fr; } }
.compare-card { background: #06040a; border: 1px solid #1e1020; border-radius: 10px; padding: 16px; }
.compare-temp { font-family: 'IBM Plex Sans', sans-serif; font-size: 22px; font-weight: 800; margin-bottom: 4px; }
.compare-label { font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 12px; }
.compare-output { font-size: 14px; color: #9a8a9a; line-height: 1.7; font-style: italic; border-left: 2px solid; padding-left: 10px; margin-bottom: 10px; }
.compare-tags { display: flex; flex-wrap: wrap; gap: 5px; }
.compare-tag { font-size: 10px; padding: 2px 7px; border-radius: 4px; border: 1px solid; letter-spacing: 0.05em; }

/* ── Top-K / Top-P ── */
.topk-visual { display: flex; gap: 6px; flex-wrap: wrap; margin: 14px 0; align-items: flex-end; }
.topk-bar-col { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.topk-bar { width: 36px; border-radius: 4px 4px 0 0; transition: all 0.4s cubic-bezier(.4,0,.2,1); border: 1px solid transparent; }
.topk-token-label { font-size: 10px; color: #7a5a6a; font-family: 'IBM Plex Mono', monospace; }
.topk-pct-label { font-size: 9px; color: #5a4a5a; }

.cutoff-line { width: 2px; height: 120px; background: #ec4899; border-radius: 2px; align-self: flex-start; margin-top: 4px; position: relative; }
.cutoff-label { position: absolute; top: -18px; left: 6px; font-size: 10px; color: #ec4899; white-space: nowrap; letter-spacing: 0.06em; }

/* ── Nucleus (top-p) bar ── */
.nucleus-track { background: #06040a; border: 1px solid #1e1020; border-radius: 100px; height: 32px; overflow: hidden; display: flex; margin: 14px 0; }
.nucleus-segment { height: 100%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 600; transition: width 0.5s cubic-bezier(.4,0,.2,1); overflow: hidden; white-space: nowrap; padding: 0 4px; }

/* ── Quiz ── */
.ts-quiz-q { font-family: 'IBM Plex Sans', sans-serif; font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 16px; line-height: 1.4; }
.ts-quiz-opts { display: flex; flex-direction: column; gap: 8px; }
.ts-quiz-opt { background: #06040a; border: 1px solid #1e1020; border-radius: 8px; padding: 12px 16px; font-size: 16px; color: #9a8a9a; cursor: pointer; text-align: left; font-family: 'IBM Plex Mono', monospace; transition: all 0.18s; }
.ts-quiz-opt:hover:not(:disabled) { border-color: #ec4899; color: #e0e8f0; }
.ts-quiz-opt.correct { border-color: #34d399; background: rgba(52,211,153,0.08); color: #34d399; }
.ts-quiz-opt.wrong   { border-color: #ef4444; background: rgba(239,68,68,0.06); color: #f87171; }
.ts-quiz-exp { margin-top: 14px; padding: 12px; background: rgba(236,72,153,0.05); border: 1px solid rgba(236,72,153,0.18); border-radius: 8px; font-size: 16px; color: #b08090; line-height: 1.7; }
.ts-quiz-next { margin-top: 12px; background: rgba(236,72,153,0.1); border: 1px solid #ec4899; color: #ec4899; font-family: 'IBM Plex Mono', monospace; font-size: 16px; padding: 9px 18px; border-radius: 6px; cursor: pointer; letter-spacing: 0.08em; text-transform: uppercase; transition: all 0.18s; }
.ts-quiz-next:hover { background: rgba(236,72,153,0.2); }
.ts-progress { background: #0a080e; border-radius: 100px; height: 4px; margin-bottom: 20px; overflow: hidden; }
.ts-progress-fill { height: 100%; background: linear-gradient(90deg, #ec4899, #f97316); border-radius: 100px; transition: width 0.4s; }
.ts-score-num { font-family: 'IBM Plex Sans', sans-serif; font-size: 64px; font-weight: 800; color: #ec4899; text-align: center; }

.ts-diff-badge { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.1em; text-transform: uppercase; padding: 3px 10px; border-radius: 100px; border: 1px solid; margin-bottom: 14px; font-weight: 500; }
.ts-diff-badge.easy   { color: #34d399; border-color: rgba(52,211,153,0.35);  background: rgba(52,211,153,0.08); }
.ts-diff-badge.medium { color: #fbbf24; border-color: rgba(251,191,36,0.35);  background: rgba(251,191,36,0.08); }
.ts-diff-badge.hard   { color: #f87171; border-color: rgba(248,113,113,0.35); background: rgba(239,68,68,0.08); }
`

// ── Token vocabulary with base logits ─────────────────────────────────────────
const BASE_TOKENS = [
  { token: 'the',      logit: 4.2, color: '#ec4899' },
  { token: 'a',        logit: 3.8, color: '#f97316' },
  { token: 'beautiful',logit: 3.1, color: '#fbbf24' },
  { token: 'dark',     logit: 2.7, color: '#818cf8' },
  { token: 'bright',   logit: 2.4, color: '#38bdf8' },
  { token: 'mysterious',logit:1.9, color: '#34d399' },
  { token: 'ancient',  logit: 1.5, color: '#a78bfa' },
  { token: 'strange',  logit: 1.1, color: '#fb7185' },
]

function softmax(logits, temperature) {
  const scaled = logits.map(l => l / Math.max(temperature, 0.01))
  const maxL = Math.max(...scaled)
  const exps = scaled.map(l => Math.exp(l - maxL))
  const sum = exps.reduce((a, b) => a + b, 0)
  return exps.map(e => e / sum)
}

function sampleFromDist(probs) {
  const r = Math.random()
  let cum = 0
  for (let i = 0; i < probs.length; i++) {
    cum += probs[i]
    if (r < cum) return i
  }
  return probs.length - 1
}

function applyTopK(probs, k) {
  const sorted = probs.map((p, i) => ({ p, i })).sort((a, b) => b.p - a.p)
  const topK = sorted.slice(0, k)
  const sum = topK.reduce((s, t) => s + t.p, 0)
  const result = new Array(probs.length).fill(0)
  topK.forEach(t => result[t.i] = t.p / sum)
  return result
}

function applyTopP(probs, p) {
  const sorted = probs.map((prob, i) => ({ prob, i })).sort((a, b) => b.prob - a.prob)
  let cum = 0
  const nucleus = []
  for (const item of sorted) {
    nucleus.push(item)
    cum += item.prob
    if (cum >= p) break
  }
  const sum = nucleus.reduce((s, t) => s + t.prob, 0)
  const result = new Array(probs.length).fill(0)
  nucleus.forEach(t => result[t.i] = t.prob / sum)
  return result
}

// ── Comparison outputs ────────────────────────────────────────────────────────
const TEMP_EXAMPLES = [
  {
    temp: 0.1,
    label: 'Deterministic',
    color: '#38bdf8',
    border: 'rgba(56,189,248,0.3)',
    bg: 'rgba(56,189,248,0.05)',
    outputs: [
      'The capital of France is Paris.',
      'The capital of France is Paris.',
      'The capital of France is Paris.',
    ],
    tags: ['Predictable', 'Repetitive', 'Factual tasks'],
    tagColor: '#38bdf8',
  },
  {
    temp: 1.0,
    label: 'Balanced',
    color: '#ec4899',
    border: 'rgba(236,72,153,0.3)',
    bg: 'rgba(236,72,153,0.05)',
    outputs: [
      'Paris is the beautiful capital of France.',
      'France\'s capital city is the historic Paris.',
      'The vibrant city of Paris serves as France\'s capital.',
    ],
    tags: ['Varied', 'Natural', 'General use'],
    tagColor: '#ec4899',
  },
  {
    temp: 2.0,
    label: 'Creative Chaos',
    color: '#f97316',
    border: 'rgba(249,115,22,0.3)',
    bg: 'rgba(249,115,22,0.05)',
    outputs: [
      'France! Capital? Perhaps Paris dances tonight...',
      'Paris, magnificent ancient labyrinth of strange wonders!',
      'Strange beautiful Paris — mysterious ancient French heartbeat.',
    ],
    tags: ['Unpredictable', 'Creative', 'May hallucinate'],
    tagColor: '#f97316',
  },
]

// ── Quiz ──────────────────────────────────────────────────────────────────────
const QUIZ = [
  // easy
  {
    id: 0, difficulty: 'easy',
    q: 'What happens to an LLM\'s output when you set temperature to 0?',
    opts: ['The model refuses to generate text', 'The model always picks the highest-probability token — output becomes deterministic', 'The model generates completely random text', 'The model shortens its responses'],
    correct: 1,
    explanation: 'At temperature=0, the model always picks the single most likely next token (greedy decoding). The output is deterministic — you\'ll get the same result every time. Useful for factual tasks, but produces repetitive, predictable text.',
  },
  {
    id: 1, difficulty: 'easy',
    q: 'Top-K sampling with K=3 means:',
    opts: ['The model only generates 3 tokens total', 'Only the 3 most probable tokens are considered at each step', 'The temperature is divided by 3', 'The model runs 3 sampling passes and picks the best'],
    correct: 1,
    explanation: 'Top-K restricts sampling to the K highest-probability tokens at each step, zeroing out all others. This prevents the model from ever picking very unlikely tokens, while still allowing some variety among the top candidates.',
  },
  {
    id: 2, difficulty: 'easy',
    q: 'What does Top-P (nucleus) sampling do differently than Top-K?',
    opts: ['It uses probability instead of logits', 'It selects the smallest set of tokens whose cumulative probability exceeds P', 'It always includes exactly P tokens', 'It multiplies all probabilities by P'],
    correct: 1,
    explanation: 'Top-P (nucleus) sampling dynamically picks the smallest group of tokens that together account for P% of the probability mass. Unlike Top-K which uses a fixed count, Top-P adapts — using more tokens when the distribution is flat, fewer when one token dominates.',
  },
  {
    id: 3, difficulty: 'easy',
    q: 'You\'re building a customer support bot that needs consistent, accurate answers. What settings would you choose?',
    opts: ['Temperature=2.0, Top-P=0.99 for maximum creativity', 'Temperature=0.1–0.3, Top-K=10–20 for predictable, accurate responses', 'Temperature=1.0, no Top-K or Top-P constraints', 'Temperature=0.7, Top-P=0.95 for creative storytelling'],
    correct: 1,
    explanation: 'For factual, consistent outputs like customer support, use low temperature (0.1–0.3) to keep responses predictable and accurate. Adding a low Top-K further limits the token pool to safe, high-probability choices — reducing hallucination risk.',
  },
  // medium
  {
    id: 4, difficulty: 'medium',
    q: 'What is the mathematical effect of dividing logits by a temperature value less than 1.0?',
    opts: ['It makes all logits equal, flattening the distribution', 'It amplifies differences between logits, sharpening the distribution so high-probability tokens dominate more', 'It randomly shuffles the logit values', 'It adds noise to prevent repetitive outputs'],
    correct: 1,
    explanation: 'Dividing by a small temperature (e.g., 0.3) makes logit differences larger. After softmax, the token with the highest logit gets an even larger probability share while lower-ranked tokens shrink toward zero. Conversely, high temperature (e.g., 2.0) compresses differences, flattening the distribution toward uniform.',
  },
  {
    id: 5, difficulty: 'medium',
    q: 'You set Top-P=0.9 and the model\'s distribution is very peaked (one token has 95% probability). How many tokens will be in the nucleus?',
    opts: ['All tokens, because the distribution is peaked', 'Just 1 token — it already covers 95% > 90% of probability mass', 'Exactly 9 tokens (10% of a typical 90-token vocabulary)', 'The nucleus size cannot be predicted without more information'],
    correct: 1,
    explanation: 'Top-P takes the smallest set of tokens that together exceed the threshold P. If the top token has 95% probability and P=0.9, then one token already exceeds 90% — so the nucleus contains only that single token. Top-P dynamically adapts to the distribution shape.',
  },
  {
    id: 6, difficulty: 'medium',
    q: 'A colleague reports that their LLM responses are highly varied but sometimes incoherent. They\'re using temp=1.8, top_k=50, top_p=0.98. What is the MOST impactful change to improve coherence while keeping variety?',
    opts: ['Increase top_k to 100', 'Lower temperature to 0.9–1.1 — it\'s the primary driver of incoherence at 1.8', 'Set top_p to 1.0 to use all tokens', 'Switch to a smaller model'],
    correct: 1,
    explanation: 'Temperature 1.8 is very high — it nearly flattens the distribution, giving roughly equal probability to many tokens including low-quality ones. Reducing to 0.9–1.1 is the single most impactful change. Top-K and Top-P are secondary controls that refine the distribution after temperature is set.',
  },
  {
    id: 7, difficulty: 'medium',
    q: 'What does it mean for sampling to be "stochastic" vs "deterministic"?',
    opts: ['Stochastic uses a random number generator; deterministic always produces the same output given the same input', 'Stochastic is faster; deterministic is slower', 'Stochastic works only with Top-P; deterministic works only with Top-K', 'Stochastic models are fine-tuned; deterministic models are base models'],
    correct: 0,
    explanation: 'Deterministic decoding (temperature=0, greedy) always picks the argmax token, so the same prompt always produces the same output. Stochastic sampling (temperature > 0) introduces a random draw from the probability distribution — the same prompt can produce different outputs each run. This is why setting a random seed ensures reproducibility in stochastic settings.',
  },
  // hard
  {
    id: 8, difficulty: 'hard',
    q: 'You apply Top-K=5 and Top-P=0.8 together. The top-5 tokens cover 60% of probability mass. Which tokens form the actual sampling pool?',
    opts: ['The top-5 tokens (Top-K takes precedence)', 'The top-5 tokens, but they are renormalized before sampling — Top-P then has no further effect since 60% < 80%', 'The smallest set of top-5 tokens that covers 80% — but since 60% < 80%, all 5 tokens are kept', 'Additional tokens beyond top-5 are added until 80% is reached'],
    correct: 2,
    explanation: 'When both are applied, Top-K first restricts to K tokens. Then Top-P checks if those K tokens already cover P% of mass — if not, all K tokens are kept (you can\'t go below what Top-K already selected). Since 60% < 80%, Top-P doesn\'t further reduce the pool — all 5 tokens are kept and renormalized. Top-P only reduces the pool further if it would include fewer than K tokens.',
  },
  {
    id: 9, difficulty: 'hard',
    q: 'What is "repetition penalty" and what problem does it solve that temperature alone cannot?',
    opts: ['It penalizes long responses to save tokens', 'It reduces the probability of tokens that already appeared in the output, preventing looping and repetitive text patterns', 'It increases temperature for already-generated tokens', 'It prevents the model from repeating the user\'s prompt verbatim'],
    correct: 1,
    explanation: 'Even at moderate temperatures, LLMs can fall into "degenerate loops" — repeating the same phrase or sentence. Temperature alone doesn\'t prevent this because the repeated token may still have the highest probability. Repetition penalty (or presence/frequency penalties in OpenAI\'s API) explicitly reduces the logit of any token that already appeared in the output, breaking the loop.',
  },
  {
    id: 10, difficulty: 'hard',
    q: 'An LLM with temperature=1.0 produces probabilities [0.5, 0.3, 0.15, 0.05] for tokens [A, B, C, D]. You sample 1000 times. Approximately how many times would token C be selected?',
    opts: ['Always 0 times — only the top token is sampled', 'About 150 times', 'About 500 times', 'Exactly 15 times'],
    correct: 1,
    explanation: 'At temperature=1.0 sampling uses the raw probabilities directly. Token C has probability 0.15, so in 1000 samples it appears ~150 times. This demonstrates that low-probability tokens are selected regularly at temperature=1.0 — not eliminated like in Top-K. In 1000 trials: A≈500, B≈300, C≈150, D≈50.',
  },
  {
    id: 11, difficulty: 'hard',
    q: 'In beam search decoding (an alternative to sampling), the model maintains B candidate sequences and expands each at every step. What is the main trade-off vs. temperature sampling?',
    opts: ['Beam search is always worse than sampling', 'Beam search finds higher-probability (more "optimal") sequences but is computationally expensive (O(B×V) per step) and tends to produce generic, safe outputs', 'Beam search uses temperature internally', 'Beam search works only for classification tasks'],
    correct: 1,
    explanation: 'Beam search systematically explores the B most probable continuations at each step, producing sequences with higher log-probability than greedy. But it is B times more expensive, scales poorly to long sequences, and tends to produce short, generic, high-probability outputs — lacking the diversity of sampling. Modern LLMs usually prefer sampling + temperature over beam search for open-ended generation.',
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
export default function TemperatureSampling() {
  const [tab, setTab] = useState(0)
  const TABS = ['Temperature', 'Top-K Sampling', 'Top-P (Nucleus)', 'Comparison', 'Live Sampler', 'Quiz']

  // Temperature tab
  const [temp, setTemp] = useState(1.0)
  const probs = softmax(BASE_TOKENS.map(t => t.logit), temp)

  // Top-K tab
  const [topK, setTopK] = useState(3)
  const [topKTemp, setTopKTemp] = useState(1.0)
  const topKBaseProbs = softmax(BASE_TOKENS.map(t => t.logit), topKTemp)
  const topKProbs = applyTopK(topKBaseProbs, topK)

  // Top-P tab
  const [topP, setTopP] = useState(0.9)
  const [topPTemp, setTopPTemp] = useState(1.0)
  const topPBaseProbs = softmax(BASE_TOKENS.map(t => t.logit), topPTemp)
  const topPProbs = applyTopP(topPBaseProbs, topP)

  // Live sampler
  const [samplerTemp, setSamplerTemp] = useState(1.0)
  const [samplerK, setSamplerK] = useState(8)
  const [samplerP, setSamplerP] = useState(1.0)
  const [sampledTokens, setSampledTokens] = useState([])
  const [sampling, setSampling] = useState(false)
  const samplerRef = useRef(null)

  // Quiz
  const nextDiffRef = useRef('easy')
  const [currentQ, setCurrentQ] = useState(null)
  const [qNum, setQNum] = useState(0)
  const [chosen, setChosen] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const [difficulty, setDifficulty] = useState('easy')
  const [usedIds, setUsedIds] = useState(new Set())

  const PROMPTS = ['Once upon a time in', 'The scientist discovered that', 'In the distant future,', 'The old castle stood']
  const [promptIdx, setPromptIdx] = useState(0)

  function runSampler() {
    setSampledTokens([])
    setSampling(true)
    let count = 0
    const max = 12
    function step() {
      if (count >= max) { setSampling(false); return }
      let p = softmax(BASE_TOKENS.map(t => t.logit), samplerTemp)
      if (samplerK < BASE_TOKENS.length) p = applyTopK(p, samplerK)
      if (samplerP < 1.0) p = applyTopP(p, samplerP)
      const idx = sampleFromDist(p)
      setSampledTokens(prev => [...prev, { token: BASE_TOKENS[idx].token, color: BASE_TOKENS[idx].color, prob: p[idx] }])
      count++
      samplerRef.current = setTimeout(step, 200)
    }
    step()
  }

  useEffect(() => () => clearTimeout(samplerRef.current), [])

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

  // nucleus cumulative breakdown
  const sortedForNucleus = topPBaseProbs
    .map((p, i) => ({ p, i, token: BASE_TOKENS[i].token, color: BASE_TOKENS[i].color }))
    .sort((a, b) => b.p - a.p)
  let nucleusCum = 0
  const nucleusItems = sortedForNucleus.map(item => {
    const inNucleus = nucleusCum < topP
    nucleusCum += item.p
    return { ...item, inNucleus: inNucleus || nucleusCum - item.p < topP }
  })

  return (
    <div className="ts-root">
      <style>{css}</style>
      <NavBar />

      <div className="ts-hero">
        <div className="ts-eyebrow">Interactive Guide</div>
        <h1 className="ts-title">Temperature &<br /><span>Sampling</span></h1>
        <p className="ts-subtitle">How randomness, temperature, and sampling strategies control what LLMs say — and how to tune them for your use case.</p>
      </div>

      <div className="ts-tabs">
        {TABS.map((t, i) => (
          <button key={i} className={`ts-tab${tab === i ? ' active' : ''}`} onClick={() => setTab(i)}>{t}</button>
        ))}
      </div>

      {/* ── Tab 0: Temperature ── */}
      {tab === 0 && (
        <div className="ts-panel">
          <div className="ts-section-title">What is Temperature?</div>
          <p className="ts-section-sub">Before sampling a token, the model produces a score (logit) for every possible next word. Temperature scales these scores before converting to probabilities. Drag the slider and watch the distribution change.</p>

          <div className="ts-card">
            <div className="ts-card-title">// Token Probability Distribution</div>
            <div className="ts-slider-row">
              <span className="ts-slider-label">Temperature</span>
              <input type="range" className="ts-slider" min={0.1} max={2.5} step={0.05}
                value={temp} onChange={e => setTemp(+e.target.value)} />
              <span className="ts-slider-val">{temp.toFixed(2)}</span>
            </div>

            <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
              {[
                { val: 0.1, label: 'Deterministic' },
                { val: 0.7, label: 'Focused' },
                { val: 1.0, label: 'Balanced' },
                { val: 1.8, label: 'Creative' },
              ].map(p => (
                <button key={p.val} className={`sample-btn`}
                  style={{ padding: '5px 12px', fontSize: 11, marginTop: 0, background: Math.abs(temp - p.val) < 0.1 ? 'rgba(236,72,153,0.2)' : 'transparent', borderColor: Math.abs(temp - p.val) < 0.1 ? '#ec4899' : '#2a1222', color: Math.abs(temp - p.val) < 0.1 ? '#ec4899' : '#7a5a6a' }}
                  onClick={() => setTemp(p.val)}>
                  {p.val} — {p.label}
                </button>
              ))}
            </div>

            {(() => {
              const maxProb = Math.max(...probs)
              const data = BASE_TOKENS.map((t, i) => ({
                token: `"${t.token}"`,
                prob: +(probs[i] * 100).toFixed(1),
                color: t.color,
                isTop: probs[i] === maxProb,
              }))
              return (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={data} margin={{ top: 10, right: 10, bottom: 5, left: -10 }} barCategoryGap="25%">
                    <XAxis dataKey="token" tick={{ fill: '#b0a0b8', fontSize: 12, fontFamily: 'IBM Plex Mono' }} axisLine={{ stroke: '#1e1020' }} tickLine={false} />
                    <YAxis domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{ fill: '#5a4a5a', fontSize: 11, fontFamily: 'IBM Plex Mono' }} axisLine={false} tickLine={false} width={44} />
                    <Tooltip
                      cursor={{ fill: 'rgba(236,72,153,0.06)' }}
                      contentStyle={{ background: '#0a080e', border: '1px solid #2a1222', borderRadius: 8, fontFamily: 'IBM Plex Mono', fontSize: 12 }}
                      labelStyle={{ color: '#ec4899', marginBottom: 4 }}
                      formatter={val => [`${val}%`, 'Probability']}
                      itemStyle={{ color: '#e0e8f0' }}
                    />
                    <Bar dataKey="prob" radius={[4, 4, 0, 0]} isAnimationActive animationDuration={400}>
                      {data.map((entry, i) => (
                        <Cell key={i} fill={entry.color} fillOpacity={entry.isTop ? 1 : 0.4} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )
            })()}

            <div style={{ marginTop: 16, padding: '10px 14px', background: 'rgba(236,72,153,0.06)', border: '1px solid rgba(236,72,153,0.2)', borderRadius: 8, fontSize: 13, color: '#b08090', lineHeight: 1.7 }}>
              {temp < 0.3 && '🧊 Very low temperature: one token dominates. Output is nearly deterministic.'}
              {temp >= 0.3 && temp < 0.8 && '🎯 Low-medium temperature: focused distribution. Top tokens still dominate.'}
              {temp >= 0.8 && temp < 1.3 && '⚖️ Balanced temperature: reasonable spread. Good general-purpose setting.'}
              {temp >= 1.3 && temp < 1.8 && '🎨 High temperature: flattening distribution. More surprise, more variety.'}
              {temp >= 1.8 && '🌪️ Very high temperature: nearly uniform. Tokens get equal chance — expect chaos!'}
            </div>
          </div>

          <div className="ts-card">
            <div className="ts-card-title">// The Math Behind Temperature</div>
            <p style={{ fontSize: 13, color: '#7a5a6a', lineHeight: 1.8, marginBottom: 14 }}>
              The model outputs raw scores called <span style={{ color: '#ec4899' }}>logits</span>. Temperature divides these before the softmax function converts them to probabilities.
            </p>
            <div style={{ background: '#06040a', border: '1px solid rgba(236,72,153,0.2)', borderRadius: 8, padding: 16, fontFamily: "'IBM Plex Mono',monospace", fontSize: 13, lineHeight: 2.2 }}>
              <div style={{ color: '#5a4a5a' }}>// Step 1: Scale logits by temperature</div>
              <div style={{ color: '#b0a0b8' }}>scaled_logit = logit / <span style={{ color: '#ec4899' }}>temperature</span></div>
              <div style={{ color: '#5a4a5a', marginTop: 8 }}>// Step 2: Convert to probabilities via softmax</div>
              <div style={{ color: '#b0a0b8' }}>prob(token) = <span style={{ color: '#34d399' }}>exp(scaled_logit)</span> / <span style={{ color: '#38bdf8' }}>Σ exp(all scaled_logits)</span></div>
              <div style={{ color: '#5a4a5a', marginTop: 8 }}>// Low temp → large differences amplified → one token wins</div>
              <div style={{ color: '#5a4a5a' }}>// High temp → differences shrink → flatter distribution</div>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab 1: Top-K ── */}
      {tab === 1 && (
        <div className="ts-panel">
          <div className="ts-section-title">Top-K Sampling</div>
          <p className="ts-section-sub">Top-K keeps only the K most probable tokens at each step, zeroing out the rest. This prevents the model from ever picking very unlikely tokens — reducing incoherence while keeping variety.</p>

          <div className="ts-card">
            <div className="ts-card-title">// Top-K Cutoff Visualizer</div>
            <div className="ts-slider-row">
              <span className="ts-slider-label" style={{ color: '#34d399' }}>K value</span>
              <input type="range" className="ts-slider" style={{ accentColor: '#34d399' }} min={1} max={8} step={1}
                value={topK} onChange={e => setTopK(+e.target.value)} />
              <span className="ts-slider-val" style={{ color: '#34d399' }}>K={topK}</span>
            </div>
            <div className="ts-slider-row">
              <span className="ts-slider-label" style={{ color: '#ec4899' }}>Temperature</span>
              <input type="range" className="ts-slider" style={{ accentColor: '#ec4899' }} min={0.1} max={2.0} step={0.05}
                value={topKTemp} onChange={e => setTopKTemp(+e.target.value)} />
              <span className="ts-slider-val" style={{ color: '#ec4899' }}>{topKTemp.toFixed(1)}</span>
            </div>

            {(() => {
              const sorted = [...topKBaseProbs].map((p, idx) => ({ p, idx })).sort((a, b) => b.p - a.p)
              const topKSet = new Set(sorted.slice(0, topK).map(s => s.idx))
              const data = BASE_TOKENS.map((t, i) => ({
                token: `"${t.token}"`,
                prob: +(topKBaseProbs[i] * 100).toFixed(1),
                color: t.color,
                inTopK: topKSet.has(i),
              }))
              return (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={data} margin={{ top: 10, right: 10, bottom: 5, left: -10 }} barCategoryGap="25%">
                    <XAxis dataKey="token" tick={{ fill: '#b0a0b8', fontSize: 12, fontFamily: 'IBM Plex Mono' }} axisLine={{ stroke: '#1e1020' }} tickLine={false} />
                    <YAxis domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{ fill: '#5a4a5a', fontSize: 11, fontFamily: 'IBM Plex Mono' }} axisLine={false} tickLine={false} width={44} />
                    <Tooltip
                      cursor={{ fill: 'rgba(236,72,153,0.06)' }}
                      contentStyle={{ background: '#0a080e', border: '1px solid #2a1222', borderRadius: 8, fontFamily: 'IBM Plex Mono', fontSize: 12 }}
                      labelStyle={{ color: '#ec4899', marginBottom: 4 }}
                      formatter={(val, _n, props) => [`${val}%`, props.payload.inTopK ? '✓ In top-K' : '✗ Excluded']}
                      itemStyle={{ color: '#e0e8f0' }}
                    />
                    <Bar dataKey="prob" radius={[4, 4, 0, 0]} isAnimationActive animationDuration={350}>
                      {data.map((entry, i) => (
                        <Cell key={i} fill={entry.color} fillOpacity={entry.inTopK ? 1 : 0.15} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )
            })()}

            <div style={{ display: 'flex', gap: 16, marginTop: 8, flexWrap: 'wrap', fontSize: 13 }}>
              <div style={{ color: '#ec4899' }}>
                ✓ <strong>In top-{topK}:</strong> {BASE_TOKENS.filter((_, i) => {
                  const sorted = [...topKBaseProbs].map((p, idx) => ({ p, idx })).sort((a, b) => b.p - a.p)
                  return sorted.findIndex(s => s.idx === i) < topK
                }).map(t => `"${t.token}"`).join(', ')}
              </div>
            </div>
            <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(236,72,153,0.06)', border: '1px solid rgba(236,72,153,0.2)', borderRadius: 8, fontSize: 13, color: '#b08090', lineHeight: 1.7 }}>
              {topK === 1 && '🎯 K=1 = greedy decoding. Always picks the single most likely token. Deterministic.'}
              {topK === 2 && '⚡ K=2: Very focused. Only the top 2 tokens compete.'}
              {topK >= 3 && topK <= 5 && `🎯 K=${topK}: Good balance — likely tokens only, no random noise from tail.`}
              {topK > 5 && `🌊 K=${topK}: Wide selection. The long tail of improbable tokens is still excluded.`}
            </div>
          </div>

          <div className="ts-card">
            <div className="ts-card-title">// Top-K Trade-offs</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { label: 'Low K (1–5)', color: '#38bdf8', bg: 'rgba(56,189,248,0.05)', border: 'rgba(56,189,248,0.2)', points: ['High consistency', 'Factual tasks, code generation', 'Risk: repetitive, less creative', 'Good for: Q&A, summarization'] },
                { label: 'High K (20–50)', color: '#f97316', bg: 'rgba(249,115,22,0.05)', border: 'rgba(249,115,22,0.2)', points: ['More variety and surprise', 'Creative writing, brainstorming', 'Risk: occasional incoherence', 'Good for: story generation'] },
              ].map(col => (
                <div key={col.label} style={{ background: col.bg, border: `1px solid ${col.border}`, borderRadius: 10, padding: 16 }}>
                  <div style={{ fontFamily: "'IBM Plex Sans',sans-serif", fontWeight: 700, fontSize: 13, color: col.color, marginBottom: 10 }}>{col.label}</div>
                  {col.points.map(p => (
                    <div key={p} style={{ display: 'flex', gap: 8, marginBottom: 6, fontSize: 12, color: '#7a5a6a', lineHeight: 1.5 }}>
                      <span style={{ color: col.color, flexShrink: 0 }}>▸</span>{p}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Tab 2: Top-P ── */}
      {tab === 2 && (
        <div className="ts-panel">
          <div className="ts-section-title">Top-P (Nucleus) Sampling</div>
          <p className="ts-section-sub">Instead of a fixed token count, Top-P dynamically selects the smallest group of tokens whose cumulative probability exceeds P. The nucleus adapts — smaller when one token dominates, larger when the distribution is flat.</p>

          <div className="ts-card">
            <div className="ts-card-title">// Nucleus Size Visualizer</div>
            <div className="ts-slider-row">
              <span className="ts-slider-label">Top-P</span>
              <input type="range" className="ts-slider" min={0.05} max={1.0} step={0.01}
                value={topP} onChange={e => setTopP(+e.target.value)} />
              <span className="ts-slider-val">{topP.toFixed(2)}</span>
            </div>
            <div className="ts-slider-row">
              <span className="ts-slider-label">Temperature</span>
              <input type="range" className="ts-slider" min={0.1} max={2.0} step={0.05}
                value={topPTemp} onChange={e => setTopPTemp(+e.target.value)} />
              <span className="ts-slider-val">{topPTemp.toFixed(1)}</span>
            </div>

            <div style={{ fontSize: 12, color: '#5a4a5a', marginBottom: 10 }}>Tokens sorted by probability — shaded tokens form the nucleus:</div>
            <div className="nucleus-track">
              {nucleusItems.map((item, i) => (
                <div key={i} className="nucleus-segment"
                  style={{
                    width: `${item.p * 100}%`,
                    background: item.inNucleus ? `${item.color}cc` : '#1e1020',
                    color: item.inNucleus ? '#fff' : '#3a2a3a',
                    borderRight: i < nucleusItems.length - 1 ? '1px solid rgba(0,0,0,0.3)' : 'none',
                    minWidth: item.p > 0.03 ? undefined : 0,
                  }}>
                  {item.p > 0.06 ? `"${item.token}"` : ''}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 10, flexWrap: 'wrap' }}>
              <div style={{ fontSize: 13, color: '#ec4899' }}>
                Nucleus size: <strong>{nucleusItems.filter(i => i.inNucleus).length}</strong> tokens
              </div>
              <div style={{ fontSize: 13, color: '#7a5a6a' }}>
                Covers: <strong style={{ color: '#34d399' }}>
                  {(nucleusItems.filter(i => i.inNucleus).reduce((s, i) => s + i.p, 0) * 100).toFixed(1)}%
                </strong> of probability mass
              </div>
            </div>

            <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(236,72,153,0.06)', border: '1px solid rgba(236,72,153,0.2)', borderRadius: 8, fontSize: 13, color: '#b08090', lineHeight: 1.7 }}>
              💡 Notice: when temperature is high, the nucleus expands (flat distribution needs more tokens to reach P%). When temperature is low, it shrinks (one token covers most probability). This adaptability is Top-P's key advantage over Top-K.
            </div>
          </div>

          <div className="ts-card">
            <div className="ts-card-title">// Top-K vs Top-P</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { label: 'Top-K', color: '#38bdf8', bg: 'rgba(56,189,248,0.05)', border: 'rgba(56,189,248,0.2)', points: ['Fixed number of tokens every step', 'Simple to understand and tune', 'K=50 always means 50 candidates', 'Can be too broad or too narrow'] },
                { label: 'Top-P (Nucleus)', color: '#ec4899', bg: 'rgba(236,72,153,0.05)', border: 'rgba(236,72,153,0.2)', points: ['Adapts to the distribution shape', 'P=0.9 = 90% of probability mass', 'Fewer tokens when one dominates', 'More robust across different prompts'] },
              ].map(col => (
                <div key={col.label} style={{ background: col.bg, border: `1px solid ${col.border}`, borderRadius: 10, padding: 16 }}>
                  <div style={{ fontFamily: "'IBM Plex Sans',sans-serif", fontWeight: 700, fontSize: 13, color: col.color, marginBottom: 10 }}>{col.label}</div>
                  {col.points.map(p => (
                    <div key={p} style={{ display: 'flex', gap: 8, marginBottom: 6, fontSize: 12, color: '#7a5a6a', lineHeight: 1.5 }}>
                      <span style={{ color: col.color, flexShrink: 0 }}>▸</span>{p}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: 8, fontSize: 13, color: '#60a880', lineHeight: 1.7 }}>
              💡 In practice, most APIs combine both: <strong style={{ color: '#34d399' }}>Temperature + Top-P + Top-K</strong> are applied together. A common production setting: temp=0.7, top_p=0.9, top_k=40.
            </div>
          </div>
        </div>
      )}

      {/* ── Tab 3: Comparison ── */}
      {tab === 3 && (
        <div className="ts-panel">
          <div className="ts-section-title">Temperature in Practice</div>
          <p className="ts-section-sub">The same prompt produces very different outputs at different temperatures. Here's the same question — "What is the capital of France?" — sampled three times at each setting.</p>

          <div className="ts-card">
            <div className="ts-card-title">// Same Prompt, Different Temperatures</div>
            <div className="compare-grid">
              {TEMP_EXAMPLES.map(ex => (
                <div key={ex.temp} className="compare-card" style={{ borderColor: ex.border, background: ex.bg }}>
                  <div className="compare-temp" style={{ color: ex.color }}>T={ex.temp}</div>
                  <div className="compare-label" style={{ color: ex.color }}>{ex.label}</div>
                  {ex.outputs.map((out, i) => (
                    <div key={i} className="compare-output" style={{ borderColor: ex.border }}>{out}</div>
                  ))}
                  <div className="compare-tags">
                    {ex.tags.map(tag => (
                      <span key={tag} className="compare-tag" style={{ color: ex.tagColor, background: `${ex.tagColor}12`, borderColor: `${ex.tagColor}30` }}>{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="ts-card">
            <div className="ts-card-title">// Recommended Settings by Use Case</div>
            <div style={{ display: 'grid', gap: 10 }}>
              {[
                { useCase: 'Code generation', temp: '0.1–0.3', topP: '0.9', topK: '10', color: '#38bdf8', reason: 'Correctness matters — low variance, no hallucinated syntax' },
                { useCase: 'Q&A / Factual', temp: '0.1–0.5', topP: '0.9', topK: '20', color: '#34d399', reason: 'Accurate answers, slightly varied phrasing' },
                { useCase: 'Chat / Conversation', temp: '0.7–1.0', topP: '0.9', topK: '40', color: '#ec4899', reason: 'Natural, human-like responses with variety' },
                { useCase: 'Creative writing', temp: '1.0–1.5', topP: '0.95', topK: '50', color: '#f97316', reason: 'Imagination and surprise — some incoherence is acceptable' },
                { useCase: 'Brainstorming', temp: '1.2–1.8', topP: '0.98', topK: '60', color: '#fbbf24', reason: 'Diverse ideas — diversity over coherence' },
              ].map(row => (
                <div key={row.useCase} style={{ display: 'flex', gap: 14, padding: '10px 14px', background: '#06040a', borderRadius: 8, border: `1px solid ${row.color}20`, alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ fontFamily: "'IBM Plex Sans',sans-serif", fontWeight: 700, fontSize: 13, color: row.color, minWidth: 140 }}>{row.useCase}</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {[['T', row.temp], ['P', row.topP], ['K', row.topK]].map(([label, val]) => (
                      <span key={label} style={{ background: `${row.color}12`, border: `1px solid ${row.color}25`, color: row.color, borderRadius: 4, padding: '2px 8px', fontSize: 11, fontFamily: "'IBM Plex Mono',monospace" }}>{label}={val}</span>
                    ))}
                  </div>
                  <div style={{ fontSize: 12, color: '#7a5a6a', flex: 1, minWidth: 200 }}>{row.reason}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Tab 4: Live Sampler ── */}
      {tab === 4 && (
        <div className="ts-panel">
          <div className="ts-section-title">Live Token Sampler</div>
          <p className="ts-section-sub">Adjust temperature, Top-K, and Top-P, then watch the model sample tokens one by one. Each token color reflects how likely it was — brighter means more probable.</p>

          <div className="ts-card">
            <div className="ts-card-title">// Configure & Sample</div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: '#7a5a6a', marginBottom: 8 }}>Starting prompt:</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {PROMPTS.map((p, i) => (
                  <button key={i} className="sample-btn"
                    style={{ padding: '5px 12px', fontSize: 11, marginTop: 0, background: promptIdx === i ? 'rgba(236,72,153,0.2)' : 'transparent', borderColor: promptIdx === i ? '#ec4899' : '#2a1222', color: promptIdx === i ? '#ec4899' : '#7a5a6a' }}
                    onClick={() => { setPromptIdx(i); setSampledTokens([]) }}>
                    "{p}"
                  </button>
                ))}
              </div>
            </div>

            <div className="ts-slider-row">
              <span className="ts-slider-label">Temperature</span>
              <input type="range" className="ts-slider" min={0.1} max={2.5} step={0.05}
                value={samplerTemp} onChange={e => setSamplerTemp(+e.target.value)} />
              <span className="ts-slider-val">{samplerTemp.toFixed(1)}</span>
            </div>
            <div className="ts-slider-row">
              <span className="ts-slider-label">Top-K</span>
              <input type="range" className="ts-slider" min={1} max={8} step={1}
                value={samplerK} onChange={e => setSamplerK(+e.target.value)} />
              <span className="ts-slider-val">K={samplerK}</span>
            </div>
            <div className="ts-slider-row">
              <span className="ts-slider-label">Top-P</span>
              <input type="range" className="ts-slider" min={0.1} max={1.0} step={0.01}
                value={samplerP} onChange={e => setSamplerP(+e.target.value)} />
              <span className="ts-slider-val">{samplerP.toFixed(2)}</span>
            </div>

            <div className="sample-output">
              <span style={{ color: '#5a4a5a' }}>{PROMPTS[promptIdx]} </span>
              {sampledTokens.map((t, i) => (
                <span key={i} className="sample-token"
                  style={{
                    background: `${t.color}${Math.round(t.prob * 200 + 30).toString(16).padStart(2,'0')}`,
                    color: '#fff',
                    border: `1px solid ${t.color}60`,
                  }}>
                  {t.token}
                </span>
              ))}
              {sampling && <span style={{ color: '#ec4899', animation: 'none' }}>▌</span>}
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
              <button className="sample-btn" onClick={() => { setSampledTokens([]); runSampler() }} disabled={sampling}>
                {sampling ? '⏳ Sampling...' : '▶ Sample Tokens'}
              </button>
              <button className="sample-btn" style={{ background: 'transparent', borderColor: '#2a1222', color: '#7a5a6a' }}
                onClick={() => setSampledTokens([])}>
                ↺ Clear
              </button>
            </div>

            {sampledTokens.length > 0 && (
              <div style={{ marginTop: 12, fontSize: 12, color: '#5a4a5a' }}>
                Token colors indicate probability: <span style={{ color: '#ec4899' }}>bright = likely</span>, <span style={{ color: '#5a4a5a' }}>dim = less likely</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Tab 5: Quiz ── */}
      {tab === 5 && (
        <div className="ts-panel">
          <div className="ts-section-title">Quick Quiz</div>
          <p className="ts-section-sub">Test your understanding of temperature and sampling strategies.</p>
          {!done ? (
            <div className="ts-card">
              {currentQ && (
                <>
                  <div className="ts-progress"><div className="ts-progress-fill" style={{ width: `${(qNum / SESSION_SIZE) * 100}%` }} /></div>
                  <div style={{ fontSize: 12, color: '#5a4a5a', marginBottom: 16 }}>QUESTION {qNum + 1} / {SESSION_SIZE}</div>
                  <span className={`ts-diff-badge ${currentQ.difficulty}`}>⬤ {currentQ.difficulty}</span>
                  <div className="ts-quiz-q">{currentQ.q}</div>
                  <div className="ts-quiz-opts">
                    {currentQ.opts.map((opt, i) => (
                      <button key={i} disabled={chosen !== null}
                        className={`ts-quiz-opt${chosen !== null && i === currentQ.correct ? ' correct' : ''}${chosen === i && i !== currentQ.correct ? ' wrong' : ''}`}
                        onClick={() => handleQuiz(i)}>
                        {['A','B','C','D'][i]}. {opt}
                      </button>
                    ))}
                  </div>
                  {chosen !== null && (
                    <>
                      <div className="ts-quiz-exp">{currentQ.explanation}</div>
                      <button className="ts-quiz-next" onClick={nextQ}>{qNum + 1 < SESSION_SIZE ? 'Next Question →' : 'See Results →'}</button>
                    </>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="ts-card" style={{ textAlign: 'center', padding: 40 }}>
              <div style={{ fontSize: 12, color: '#5a4a5a', marginBottom: 12, letterSpacing: '0.12em' }}>FINAL SCORE</div>
              <div className="ts-score-num">{score}/{SESSION_SIZE}</div>
              <div style={{ fontSize: 14, color: '#7a5a6a', marginTop: 8 }}>
                {score >= SESSION_SIZE ? 'Perfect! You understand sampling deeply. 🎉' : score >= SESSION_SIZE / 2 ? 'Good work! Review the tricky sections. 📚' : 'Keep exploring — sampling strategies take time to click. 💪'}
              </div>
              <button className="ts-quiz-next" style={{ marginTop: 24 }} onClick={retake}>Retake Quiz ↺</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
