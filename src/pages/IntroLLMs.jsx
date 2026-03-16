import { useState, useEffect, useRef, useMemo } from 'react'
import NavBar from '../components/NavBar.jsx'

const css = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap');

.il-root { min-height: 100vh; background: #050810; color: #e0e8f0; font-family: 'IBM Plex Mono', monospace; overflow-x: hidden; }

.il-hero { text-align: center; padding: 48px 24px 28px; position: relative; }
.il-hero::before { content: ''; position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 700px; height: 320px; background: radial-gradient(ellipse at 50% 0%, rgba(167,139,250,0.09) 0%, transparent 70%); pointer-events: none; }
.il-eyebrow { font-size: 16px; letter-spacing: 0.22em; color: #a78bfa; text-transform: uppercase; margin-bottom: 14px; }
.il-title { font-family: 'IBM Plex Sans', sans-serif; font-size: clamp(28px, 5vw, 52px); font-weight: 800; letter-spacing: -0.02em; color: #fff; line-height: 1.05; margin-bottom: 12px; }
.il-title span { color: #a78bfa; }
.il-subtitle { font-size: 16px; color: #3a3a5a; max-width: 540px; margin: 0 auto 32px; line-height: 1.8; }

.il-tabs { display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; padding: 0 16px 32px; }
.il-tab { background: transparent; border: 1px solid #0a1530; color: #3a3a5a; font-family: 'IBM Plex Mono', monospace; font-size: 16px; letter-spacing: 0.1em; padding: 8px 16px; border-radius: 6px; cursor: pointer; transition: all 0.18s; text-transform: uppercase; }
.il-tab:hover { border-color: #a78bfa; color: #a78bfa; }
.il-tab.active { background: rgba(167,139,250,0.1); border-color: #a78bfa; color: #a78bfa; }

.il-panel { max-width: 920px; margin: 0 auto; padding: 0 20px 80px; }

.il-section-title { font-family: 'IBM Plex Sans', sans-serif; font-size: 22px; font-weight: 700; color: #fff; margin-bottom: 8px; }
.il-section-sub { font-size: 16px; color: #3a3a5a; line-height: 1.7; margin-bottom: 24px; }

.il-card { background: rgba(167,139,250,0.04); border: 1px solid rgba(167,139,250,0.15); border-radius: 14px; padding: 20px 24px; margin-bottom: 16px; }
.il-card-plain { background: rgba(255,255,255,0.02); border: 1px solid #0d1428; border-radius: 14px; padding: 20px 24px; margin-bottom: 16px; }

.il-btn { background: rgba(167,139,250,0.1); border: 1px solid #a78bfa; color: #a78bfa; font-family: 'IBM Plex Mono', monospace; font-size: 14px; padding: 10px 20px; border-radius: 8px; cursor: pointer; transition: all 0.18s; letter-spacing: 0.08em; }
.il-btn:hover { background: rgba(167,139,250,0.18); }
.il-btn-ghost { background: transparent; border: 1px solid #1a2040; color: #3a3a5a; font-family: 'IBM Plex Mono', monospace; font-size: 14px; padding: 10px 20px; border-radius: 8px; cursor: pointer; transition: all 0.18s; letter-spacing: 0.08em; margin-left: 10px; }
.il-btn-ghost:hover { border-color: #3a3a7a; color: #6a6aaa; }

.il-stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; margin-bottom: 32px; }
.il-stat-card { background: rgba(167,139,250,0.04); border: 1px solid rgba(167,139,250,0.12); border-radius: 12px; padding: 18px 20px; }
.il-stat-label { font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: #a78bfa; margin-bottom: 8px; font-weight: 600; }
.il-stat-value { font-family: 'IBM Plex Sans', sans-serif; font-size: 15px; font-weight: 700; color: #e0e0f8; line-height: 1.4; }

.il-prompt-chips { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
.il-chip { background: transparent; border: 1px solid #0d1428; color: #3a3a5a; font-family: 'IBM Plex Mono', monospace; font-size: 13px; padding: 7px 14px; border-radius: 100px; cursor: pointer; transition: all 0.18s; }
.il-chip:hover { border-color: #a78bfa; color: #a78bfa; }
.il-chip.active { background: rgba(167,139,250,0.1); border-color: #a78bfa; color: #a78bfa; }

.il-pred-row { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
.il-pred-token { font-family: 'IBM Plex Mono', monospace; font-size: 14px; min-width: 110px; }
.il-pred-bar-bg { flex: 1; height: 8px; background: #0d1428; border-radius: 4px; overflow: hidden; }
.il-pred-bar { height: 100%; border-radius: 4px; transition: width 0.4s ease; }
.il-pred-pct { font-family: 'IBM Plex Mono', monospace; font-size: 13px; min-width: 42px; text-align: right; }

.il-token-display { display: flex; flex-wrap: wrap; gap: 4px; padding: 16px; background: rgba(255,255,255,0.02); border: 1px solid #0d1428; border-radius: 10px; min-height: 60px; }
.il-token { padding: 3px 8px; border-radius: 4px; font-family: 'IBM Plex Mono', monospace; font-size: 13px; font-weight: 500; }

.il-loop-nodes { display: flex; justify-content: center; align-items: center; gap: 0; flex-wrap: wrap; margin: 24px 0; }
.il-loop-node { background: rgba(255,255,255,0.02); border: 1px solid #0d1428; border-radius: 10px; padding: 14px 16px; text-align: center; width: 140px; transition: all 0.3s; }
.il-loop-node.active { background: rgba(167,139,250,0.1); border-color: #a78bfa; }
.il-loop-arrow { color: #1a2040; font-size: 18px; padding: 0 6px; }
.il-loop-icon { font-size: 22px; margin-bottom: 6px; }
.il-loop-label { font-family: 'IBM Plex Sans', sans-serif; font-size: 13px; font-weight: 700; color: #fff; margin-bottom: 4px; }
.il-loop-desc { font-size: 11px; color: #3a3a5a; line-height: 1.4; }
.il-loop-node.active .il-loop-label { color: #a78bfa; }

.il-limit-card { border-radius: 12px; border: 1px solid #0d1428; background: rgba(255,255,255,0.02); margin-bottom: 10px; cursor: pointer; transition: border-color 0.18s; overflow: hidden; }
.il-limit-card:hover { border-color: #1a2040; }
.il-limit-card.expanded { border-color: rgba(167,139,250,0.3); background: rgba(167,139,250,0.04); }
.il-limit-header { display: flex; align-items: center; gap: 12px; padding: 16px 20px; }
.il-limit-icon { font-size: 22px; }
.il-limit-title { font-family: 'IBM Plex Sans', sans-serif; font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 2px; }
.il-limit-short { font-size: 13px; color: #4a4a7a; }
.il-limit-detail { padding: 0 20px 16px 54px; font-size: 13px; color: #3a3a5a; line-height: 1.7; }
.il-severity { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-left: auto; flex-shrink: 0; }

.il-role-box { border-radius: 10px; padding: 14px 18px; margin-bottom: 8px; }
.il-role-label { font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; font-weight: 700; margin-bottom: 6px; font-family: 'IBM Plex Mono', monospace; }
.il-role-text { font-size: 14px; line-height: 1.6; }

.il-response-box { background: rgba(52,211,153,0.04); border: 1px solid rgba(52,211,153,0.2); border-radius: 10px; padding: 16px 20px; font-size: 14px; color: #a0d4c0; line-height: 1.7; transition: opacity 0.3s; }
.il-response-box.hidden { opacity: 0; }

.il-context-bar-bg { width: 100%; height: 24px; background: #080f18; border-radius: 6px; overflow: hidden; margin: 12px 0; position: relative; }
.il-context-bar-fill { height: 100%; border-radius: 6px; background: linear-gradient(90deg, rgba(167,139,250,0.5), rgba(167,139,250,0.2)); transition: width 0.5s; display: flex; align-items: center; padding-left: 8px; }

.il-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
@media (max-width: 640px) { .il-two-col { grid-template-columns: 1fr; } }

.il-preset-btns { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
.il-preset-btn { background: transparent; border: 1px solid #0d1428; color: #3a3a5a; font-family: 'IBM Plex Mono', monospace; font-size: 13px; padding: 7px 14px; border-radius: 6px; cursor: pointer; transition: all 0.18s; }
.il-preset-btn.active { background: rgba(167,139,250,0.1); border-color: #a78bfa; color: #a78bfa; }
.il-preset-btn:hover:not(.active) { border-color: #2a2050; color: #6a5a9a; }

.il-context-btn { background: transparent; border: 1px solid #0d1428; color: #3a3a5a; font-family: 'IBM Plex Mono', monospace; font-size: 13px; padding: 7px 14px; border-radius: 6px; cursor: pointer; transition: all 0.18s; }
.il-context-btn.active { background: rgba(167,139,250,0.1); border-color: #a78bfa; color: #a78bfa; }
.il-context-btn:hover:not(.active) { border-color: #2a2050; color: #6a5a9a; }

/* Quiz */
.il-quiz-wrap { max-width: 680px; margin: 0 auto; }
.il-quiz-progress { display: flex; align-items: center; gap: 12px; margin-bottom: 28px; }
.il-quiz-progress-bar-bg { flex: 1; height: 4px; background: #0d1428; border-radius: 2px; overflow: hidden; }
.il-quiz-progress-bar { height: 100%; background: #a78bfa; border-radius: 2px; transition: width 0.4s; }
.il-quiz-progress-label { font-size: 13px; color: #3a3a5a; font-family: 'IBM Plex Mono', monospace; white-space: nowrap; }

.il-diff-badge { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.1em; text-transform: uppercase; padding: 3px 10px; border-radius: 100px; border: 1px solid; margin-bottom: 14px; font-weight: 500; }
.il-diff-badge.easy   { color: #34d399; border-color: rgba(52,211,153,0.35);  background: rgba(52,211,153,0.08); }
.il-diff-badge.medium { color: #fbbf24; border-color: rgba(251,191,36,0.35);  background: rgba(251,191,36,0.08); }
.il-diff-badge.hard   { color: #f87171; border-color: rgba(248,113,113,0.35); background: rgba(239,68,68,0.08); }

.il-quiz-q { font-family: 'IBM Plex Sans', sans-serif; font-size: 18px; font-weight: 700; color: #fff; line-height: 1.5; margin-bottom: 24px; }
.il-quiz-opts { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
.il-quiz-opt { background: rgba(255,255,255,0.02); border: 1px solid #0d1428; border-radius: 10px; padding: 14px 18px; cursor: pointer; transition: all 0.18s; text-align: left; font-family: 'IBM Plex Sans', sans-serif; font-size: 15px; color: #a0b0c8; }
.il-quiz-opt:hover:not(:disabled) { border-color: #a78bfa; color: #c0c0f0; }
.il-quiz-opt.correct { border-color: #34d399; background: rgba(52,211,153,0.08); color: #34d399; }
.il-quiz-opt.wrong { border-color: #f87171; background: rgba(248,113,113,0.08); color: #f87171; }
.il-quiz-opt.neutral { opacity: 0.5; }
.il-quiz-opt:disabled { cursor: default; }

.il-quiz-explanation { background: rgba(167,139,250,0.05); border: 1px solid rgba(167,139,250,0.15); border-radius: 10px; padding: 16px 20px; font-size: 14px; color: #6a5a9a; line-height: 1.7; margin-bottom: 20px; }
.il-quiz-explanation strong { color: #a78bfa; }

.il-quiz-done { text-align: center; padding: 40px 0; }
.il-quiz-done-score { font-family: 'IBM Plex Sans', sans-serif; font-size: 56px; font-weight: 900; color: #a78bfa; line-height: 1; margin-bottom: 8px; }
.il-quiz-done-label { font-size: 16px; color: #3a3a5a; margin-bottom: 32px; }

.il-textarea { width: 100%; background: rgba(255,255,255,0.03); border: 1px solid #0d1428; border-radius: 8px; padding: 12px 14px; color: #c0c0f0; font-family: 'IBM Plex Mono', monospace; font-size: 13px; outline: none; resize: vertical; min-height: 72px; transition: border-color 0.18s; box-sizing: border-box; }
.il-textarea:focus { border-color: rgba(167,139,250,0.5); }
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

// ─── Token colors ─────────────────────────────────────────────────────────
const TOKEN_COLORS = [
  { bg: 'rgba(167,139,250,0.15)', border: 'rgba(167,139,250,0.4)', color: '#c4b0ff' },
  { bg: 'rgba(56,189,248,0.15)',  border: 'rgba(56,189,248,0.4)',  color: '#7dd3f8' },
  { bg: 'rgba(52,211,153,0.15)',  border: 'rgba(52,211,153,0.4)',  color: '#6ee7b7' },
  { bg: 'rgba(251,191,36,0.15)',  border: 'rgba(251,191,36,0.4)',  color: '#fcd34d' },
]

// ─── Training loop nodes ─────────────────────────────────────────────────
const LOOP_NODES = [
  { icon: '📚', label: 'Training Data', desc: 'Batch of text examples loaded' },
  { icon: '➡️', label: 'Forward Pass', desc: 'Input flows through transformer layers' },
  { icon: '📉', label: 'Compute Loss', desc: 'Compare prediction to actual next token' },
  { icon: '🔄', label: 'Update Weights', desc: 'Gradient descent adjusts millions of parameters' },
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
    label: 'Formal Expert',
    system: 'You are a technical expert. Be precise and use proper terminology.',
    response: 'Machine learning is a subset of artificial intelligence that employs statistical methods to enable computational systems to learn from data, iteratively improving task performance without being explicitly programmed for each scenario.'
  },
  {
    label: 'Casual Friend',
    system: 'You are a friendly assistant. Keep things simple and conversational.',
    response: "Basically, machine learning is when you teach a computer by showing it tons of examples instead of writing out every rule. Like, instead of coding \"a cat has pointy ears,\" you just show it 10,000 cat photos and it figures out the pattern itself!"
  },
  {
    label: 'Socratic Teacher',
    system: 'You are a Socratic teacher. Guide with questions, do not give direct answers.',
    response: "Great question! Let's explore this together. Have you ever noticed how spam filters seem to 'know' what's junk mail? How do you think they learned that? What if you could teach a computer the same way a child learns — through examples rather than strict rules?"
  }
]

// ─── Limitations ─────────────────────────────────────────────────────────
const LIMITATIONS = [
  {
    icon: '🎭',
    title: 'Hallucination',
    short: 'LLMs can confidently state false information.',
    detail: 'Because LLMs predict likely text rather than retrieve facts, they can generate plausible-sounding but completely fabricated details — wrong dates, fake citations, invented statistics. The model has no internal "truth checker." Mitigation: use RAG to ground answers in real sources, always verify critical facts.',
    severity: 'high'
  },
  {
    icon: '📅',
    title: 'Knowledge Cutoff',
    short: 'LLMs only know what was in their training data.',
    detail: "Training data has a fixed end date. The model has no awareness of events, papers, or changes after that date. Ask about yesterday's news and it will either say it doesn't know or — worse — hallucinate an answer. Mitigation: RAG with live data sources, or models with web search tools.",
    severity: 'medium'
  },
  {
    icon: '🧠',
    title: 'No Persistent Memory',
    short: 'Each conversation starts fresh with no memory of past sessions.',
    detail: 'Unlike humans, LLMs have no memory between separate conversations. Every new chat starts from zero. Within a conversation, they only remember what fits in the current context window. Mitigation: external memory stores, conversation summarization, RAG over past interactions.',
    severity: 'medium'
  },
  {
    icon: '📏',
    title: 'Context Window Limit',
    short: 'LLMs can only process a fixed amount of text at once.',
    detail: "Even large-context models have limits. Feeding in too much text leads to the 'lost in the middle' problem — the model underweights information in the center of a long context. Mitigation: smart chunking, retrieval, summarization of long documents before sending.",
    severity: 'medium'
  },
  {
    icon: '⚖️',
    title: 'Bias & Consistency',
    short: 'Outputs can reflect training data biases and vary between runs.',
    detail: 'LLMs absorb biases present in their training data. They can also give different answers to the same question asked differently, or on different days. They are not deterministic (unless temperature=0). Mitigation: careful prompt design, output validation, human review for high-stakes decisions.',
    severity: 'low'
  }
]

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
  const TABS = ['What is an LLM?', 'How LLMs Learn', 'Tokens & Context', 'Prompts & Responses', 'Limitations', 'Quiz']

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

  // ─── Severity color ──────────────────────────────────────────────────────
  function severityColor(s) {
    if (s === 'high') return '#f87171'
    if (s === 'medium') return '#fbbf24'
    return '#60a5fa'
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="il-root">
      <style>{css}</style>
      <NavBar />

      <div className="il-hero">
        <div className="il-eyebrow">Foundations</div>
        <h1 className="il-title">Introduction to <span>LLMs</span></h1>
        <p className="il-subtitle">Understand how large language models work — from next-token prediction to emergent abilities, tokens, prompts, and limitations.</p>
      </div>

      <div className="il-tabs">
        {TABS.map((t, i) => (
          <button key={t} className={`il-tab${tab === i ? ' active' : ''}`} onClick={() => setTab(i)}>{t}</button>
        ))}
      </div>

      <div className="il-panel">

        {/* ── Tab 0: What is an LLM? ──────────────────────────────────────────── */}
        {tab === 0 && (
          <div>
            <div className="il-section-title">What is a Large Language Model?</div>
            <p className="il-section-sub">
              A Large Language Model is a neural network trained on vast amounts of text to predict the most likely next token. Through this simple objective, it learns grammar, facts, reasoning, and much more.
            </p>

            {/* Scale cards */}
            <div className="il-stats-grid">
              {[
                { label: 'Parameters', value: 'GPT-4: ~1.8 trillion' },
                { label: 'Training Data', value: '~13 trillion tokens' },
                { label: 'Training Time', value: 'Months on thousands of GPUs' },
                { label: 'Emergent Abilities', value: 'Appear beyond ~10B params' },
              ].map(s => (
                <div key={s.label} className="il-stat-card">
                  <div className="il-stat-label">{s.label}</div>
                  <div className="il-stat-value">{s.value}</div>
                </div>
              ))}
            </div>

            {/* Next Token Prediction demo */}
            <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Next Token Prediction</div>
            <p style={{ fontSize: 14, color: '#3a3a5a', marginBottom: 16, lineHeight: 1.7 }}>
              Select a sentence starter to see the top predicted next tokens and their probabilities — the core mechanism powering every LLM.
            </p>

            <div className="il-prompt-chips">
              {NEXT_TOKEN_DATA.map((d, i) => (
                <button key={i} className={`il-chip${selectedPrompt === i ? ' active' : ''}`} onClick={() => setSelectedPrompt(i)}>
                  {d.prompt.length > 32 ? d.prompt.slice(0, 32) + '…' : d.prompt}
                </button>
              ))}
            </div>

            <div className="il-card-plain" style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: '#3a3a5a', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Prompt</div>
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 15, color: '#c0c0f0', marginBottom: 20, padding: '10px 14px', background: 'rgba(167,139,250,0.06)', borderRadius: 8, border: '1px solid rgba(167,139,250,0.2)' }}>
                {NEXT_TOKEN_DATA[selectedPrompt].prompt} <span style={{ color: '#a78bfa', animation: 'none' }}>▌</span>
              </div>

              <div style={{ fontSize: 13, color: '#3a3a5a', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Top-5 predicted next tokens</div>
              {NEXT_TOKEN_DATA[selectedPrompt].predictions.map((p, i) => (
                <div key={p.token} className="il-pred-row">
                  <div className="il-pred-token" style={{ color: i === 0 ? '#a78bfa' : '#5a5a8a' }}>
                    {i === 0 && <span style={{ color: '#a78bfa', marginRight: 6, fontSize: 11 }}>★</span>}
                    <span style={{ fontFamily: 'IBM Plex Mono' }}>{p.token}</span>
                  </div>
                  <div className="il-pred-bar-bg">
                    <div className="il-pred-bar" style={{ width: `${p.prob * 100}%`, background: i === 0 ? '#a78bfa' : '#1a1a3a' }} />
                  </div>
                  <div className="il-pred-pct" style={{ color: i === 0 ? '#a78bfa' : '#3a3a5a' }}>
                    {Math.round(p.prob * 100)}%
                  </div>
                </div>
              ))}
            </div>

            {/* Key insight */}
            <div className="il-card">
              <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 15, fontWeight: 700, color: '#a78bfa', marginBottom: 8 }}>Key insight</div>
              <p style={{ fontSize: 14, color: '#4a4a7a', lineHeight: 1.7, margin: 0 }}>
                By predicting the next token billions of times across trillions of examples, the model develops an internal world model — understanding context, meaning, relationships, and even simple reasoning.
              </p>
            </div>
          </div>
        )}

        {/* ── Tab 1: How LLMs Learn ───────────────────────────────────────────── */}
        {tab === 1 && (
          <div>
            <div className="il-section-title">How LLMs Learn</div>
            <p className="il-section-sub">Training happens in two phases: pre-training on massive unlabeled text, then fine-tuning on curated examples to shape behavior.</p>

            {/* Pre-training vs Fine-tuning */}
            <div className="il-two-col" style={{ marginBottom: 32 }}>
              <div className="il-card-plain">
                <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 15, fontWeight: 700, color: '#a78bfa', marginBottom: 8 }}>Pre-training</div>
                <p style={{ fontSize: 14, color: '#4a4a7a', lineHeight: 1.7, margin: 0 }}>
                  Train on massive unlabeled text from the internet, books, code. Objective: predict the next token. Result: broad general knowledge.
                </p>
              </div>
              <div className="il-card-plain">
                <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 15, fontWeight: 700, color: '#34d399', marginBottom: 8 }}>Fine-tuning</div>
                <p style={{ fontSize: 14, color: '#4a4a7a', lineHeight: 1.7, margin: 0 }}>
                  Continue training on curated, labeled examples. Objective: follow instructions, be helpful, avoid harm. Result: assistant behavior.
                </p>
              </div>
            </div>

            {/* Training loop animation */}
            <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Training Loop</div>
            <p style={{ fontSize: 14, color: '#3a3a5a', marginBottom: 16, lineHeight: 1.7 }}>
              Watch the training loop: each cycle the model sees data, makes predictions, measures error, and updates its weights.
            </p>

            <div className="il-loop-nodes">
              {LOOP_NODES.map((node, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                  <div className={`il-loop-node${loopStep === i ? ' active' : ''}`}>
                    <div className="il-loop-icon">{node.icon}</div>
                    <div className="il-loop-label">{node.label}</div>
                    <div className="il-loop-desc">{node.desc}</div>
                  </div>
                  {i < LOOP_NODES.length - 1 && <div className="il-loop-arrow">→</div>}
                  {i === LOOP_NODES.length - 1 && <div className="il-loop-arrow" style={{ color: '#1a1a3a', fontSize: 14 }}>↩</div>}
                </div>
              ))}
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
              <button className="il-btn" onClick={isLooping ? stopLoop : startLoop}>
                {isLooping ? '⏸ Stop' : '▶ Start Training'}
              </button>
              <button className="il-btn-ghost" onClick={resetLoop}>↺ Reset</button>
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 14, color: '#6a5a9a', marginLeft: 8 }}>
                Epoch: <span style={{ color: '#a78bfa' }}>{epoch}</span> &nbsp;|&nbsp; Loss: <span style={{ color: '#a78bfa' }}>{loss.toFixed(2)}</span>
              </div>
            </div>

            {/* Loss chart */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #0d1428', borderRadius: 12, padding: '16px 20px', marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: '#3a3a5a', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Training Loss Curve</div>
              <svg viewBox={`0 0 ${chartW} ${chartH}`} style={{ width: '100%', height: 120, display: 'block' }}>
                <polyline
                  points={lossCurvePoints}
                  fill="none"
                  stroke="rgba(167,139,250,0.3)"
                  strokeWidth="2"
                />
                <polyline
                  points={LOSS_CURVE.slice(0, epoch + 1).map((l, i) => `${(i / (LOSS_CURVE.length - 1)) * chartW},${lossToY(l)}`).join(' ')}
                  fill="none"
                  stroke="#a78bfa"
                  strokeWidth="2.5"
                />
                <circle
                  cx={currentEpochX}
                  cy={currentEpochY}
                  r="5"
                  fill="#a78bfa"
                />
                <text x="4" y={lossToY(2.4) + 4} fill="#3a3a5a" fontSize="10" fontFamily="IBM Plex Mono">2.4</text>
                <text x="4" y={lossToY(0.3) - 4} fill="#3a3a5a" fontSize="10" fontFamily="IBM Plex Mono">0.3</text>
              </svg>
            </div>
            <div style={{ fontSize: 12, color: '#2a2050', textAlign: 'center', marginBottom: 24 }}>Loss decreases as the model's predictions improve over training epochs</div>
          </div>
        )}

        {/* ── Tab 2: Tokens & Context ─────────────────────────────────────────── */}
        {tab === 2 && (
          <div>
            <div className="il-section-title">Tokens & Context</div>
            <p className="il-section-sub">LLMs don't see words — they see tokens. Understanding tokenization and context windows is fundamental to working with LLMs effectively.</p>

            {/* Tokenizer demo */}
            <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Live Tokenizer</div>
            <p style={{ fontSize: 14, color: '#3a3a5a', marginBottom: 14, lineHeight: 1.7 }}>
              Edit the text below to see how it splits into tokens. Each color represents a distinct token unit.
            </p>

            <textarea
              className="il-textarea"
              value={tokenText}
              onChange={e => setTokenText(e.target.value)}
              style={{ marginBottom: 12 }}
            />

            <div className="il-token-display" style={{ marginBottom: 8 }}>
              {tokens.map((tok, i) => {
                const c = TOKEN_COLORS[i % 4]
                return (
                  <span key={i} className="il-token" style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.color }}>
                    {tok}
                  </span>
                )
              })}
              {tokens.length === 0 && <span style={{ color: '#2a2050', fontFamily: 'IBM Plex Mono', fontSize: 13 }}>Start typing above…</span>}
            </div>
            <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 13, color: '#6a5a9a', marginBottom: 32 }}>
              <span style={{ color: '#a78bfa' }}>{tokens.length}</span> tokens
            </div>

            {/* Context window explainer */}
            <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Context Window</div>
            <p style={{ fontSize: 14, color: '#3a3a5a', marginBottom: 16, lineHeight: 1.7 }}>
              The context window is the total amount of text (input + output) the model can process at once. Select a scenario to see how different sizes compare.
            </p>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
              {CONTEXT_SCENARIOS.map((s, i) => (
                <button key={i} className={`il-context-btn${contextScenario === i ? ' active' : ''}`} onClick={() => setContextScenario(i)}>
                  {s.label}
                </button>
              ))}
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #0d1428', borderRadius: 12, padding: '18px 20px', marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 14, fontWeight: 700, color: '#c0c0f0' }}>
                  {CONTEXT_SCENARIOS[contextScenario].tokens.toLocaleString()} tokens
                </div>
                <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 13, color: '#a78bfa' }}>
                  {CONTEXT_SCENARIOS[contextScenario].use}
                </div>
              </div>
              <div className="il-context-bar-bg">
                <div
                  className="il-context-bar-fill"
                  style={{ width: `${(CONTEXT_SCENARIOS[contextScenario].tokens / CONTEXT_SCENARIOS[contextScenario].max) * 100}%` }}
                >
                  {CONTEXT_SCENARIOS[contextScenario].tokens >= 4096 && (
                    <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
                      {CONTEXT_SCENARIOS[contextScenario].tokens.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
              <div style={{ fontSize: 12, color: '#2a2050', marginTop: 6, fontFamily: 'IBM Plex Mono' }}>
                relative to 128K max
              </div>
            </div>

            {/* Why context length matters */}
            <div className="il-card">
              <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 15, fontWeight: 700, color: '#a78bfa', marginBottom: 8 }}>Why context length matters</div>
              <p style={{ fontSize: 14, color: '#4a4a7a', lineHeight: 1.7, margin: 0 }}>
                The context window is the model's working memory. Everything before the current token in the window is what the model "sees." Older tokens fall off the left edge as the conversation grows. A larger context window means longer conversations, bigger documents — but also more compute cost and the risk of the model losing focus on early content.
              </p>
            </div>
          </div>
        )}

        {/* ── Tab 3: Prompts & Responses ──────────────────────────────────────── */}
        {tab === 3 && (
          <div>
            <div className="il-section-title">Prompts & Responses</div>
            <p className="il-section-sub">Every LLM interaction is structured around three message roles. How you construct those messages determines everything about what you get back.</p>

            {/* Anatomy of a prompt */}
            <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 14 }}>Anatomy of a Prompt</div>

            <div style={{ marginBottom: 8 }}>
              {[
                {
                  role: 'SYSTEM',
                  text: 'You are a helpful assistant specializing in science.',
                  bg: 'rgba(167,139,250,0.06)',
                  border: 'rgba(167,139,250,0.2)',
                  labelColor: '#a78bfa',
                  textColor: '#c4b0ff',
                },
                {
                  role: 'USER',
                  text: 'Explain how black holes form.',
                  bg: 'rgba(56,189,248,0.06)',
                  border: 'rgba(56,189,248,0.2)',
                  labelColor: '#38bdf8',
                  textColor: '#7dd3f8',
                },
                {
                  role: 'ASSISTANT',
                  text: 'A black hole forms when a massive star collapses under its own gravity…',
                  bg: 'rgba(52,211,153,0.06)',
                  border: 'rgba(52,211,153,0.2)',
                  labelColor: '#34d399',
                  textColor: '#6ee7b7',
                },
              ].map(r => (
                <div key={r.role} className="il-role-box" style={{ background: r.bg, border: `1px solid ${r.border}`, marginBottom: 8 }}>
                  <div className="il-role-label" style={{ color: r.labelColor }}>{r.role}</div>
                  <div className="il-role-text" style={{ color: r.textColor }}>{r.text}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 13, color: '#3a3a5a', marginBottom: 32, lineHeight: 1.6 }}>
              System sets behavior, User sends the question, Assistant generates the reply.
            </div>

            {/* System prompt effect demo */}
            <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 8 }}>System Prompt Effect</div>
            <p style={{ fontSize: 14, color: '#3a3a5a', marginBottom: 16, lineHeight: 1.7 }}>
              The same user question gets a very different answer depending on the system prompt. Select a persona to see how tone and style shift.
            </p>

            <div className="il-preset-btns">
              {SYSTEM_PRESETS.map((p, i) => (
                <button key={i} className={`il-preset-btn${selectedPreset === i ? ' active' : ''}`} onClick={() => changePreset(i)}>
                  {p.label}
                </button>
              ))}
            </div>

            {/* System prompt */}
            <div style={{ fontSize: 11, color: '#a78bfa', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 6, fontFamily: 'IBM Plex Mono', fontWeight: 700 }}>System Prompt</div>
            <div className="il-role-box" style={{ background: 'rgba(167,139,250,0.06)', border: '1px solid rgba(167,139,250,0.2)', marginBottom: 12 }}>
              <div className="il-role-text" style={{ color: '#c4b0ff', fontSize: 13 }}>{SYSTEM_PRESETS[selectedPreset].system}</div>
            </div>

            {/* User question */}
            <div style={{ fontSize: 11, color: '#38bdf8', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 6, fontFamily: 'IBM Plex Mono', fontWeight: 700 }}>User</div>
            <div className="il-role-box" style={{ background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.2)', marginBottom: 12 }}>
              <div className="il-role-text" style={{ color: '#7dd3f8', fontSize: 13 }}>What is machine learning?</div>
            </div>

            {/* Assistant response */}
            <div style={{ fontSize: 11, color: '#34d399', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 6, fontFamily: 'IBM Plex Mono', fontWeight: 700 }}>Assistant</div>
            <div className={`il-response-box${responseVisible ? '' : ' hidden'}`}>
              {SYSTEM_PRESETS[selectedPreset].response}
            </div>
          </div>
        )}

        {/* ── Tab 4: Limitations ──────────────────────────────────────────────── */}
        {tab === 4 && (
          <div>
            <div className="il-section-title">LLM Limitations</div>
            <p className="il-section-sub">LLMs are remarkable but imperfect. Understanding their limitations helps you build reliable, trustworthy AI systems. Click any card to expand details.</p>

            {LIMITATIONS.map((lim, i) => (
              <div
                key={i}
                className={`il-limit-card${expandedLimitation === i ? ' expanded' : ''}`}
                onClick={() => toggleLimitation(i)}
              >
                <div className="il-limit-header">
                  <div className="il-limit-icon">{lim.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div className="il-limit-title">{lim.title}</div>
                    <div className="il-limit-short">{lim.short}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                    <span style={{ fontSize: 11, fontFamily: 'IBM Plex Mono', textTransform: 'uppercase', letterSpacing: '0.1em', color: severityColor(lim.severity), opacity: 0.8 }}>{lim.severity}</span>
                    <div className="il-severity" style={{ background: severityColor(lim.severity) }} />
                    <span style={{ color: '#3a3a5a', fontSize: 14 }}>{expandedLimitation === i ? '▲' : '▼'}</span>
                  </div>
                </div>
                {expandedLimitation === i && (
                  <div className="il-limit-detail">{lim.detail}</div>
                )}
              </div>
            ))}

            <div className="il-card" style={{ marginTop: 24 }}>
              <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 15, fontWeight: 700, color: '#a78bfa', marginBottom: 8 }}>The bottom line</div>
              <p style={{ fontSize: 14, color: '#4a4a7a', lineHeight: 1.7, margin: 0 }}>
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
                  {score === SESSION_SIZE ? 'Perfect score! You know your LLMs.' :
                   score >= SESSION_SIZE * 0.7 ? 'Great job! Solid understanding.' :
                   score >= SESSION_SIZE * 0.5 ? 'Good effort. Review the tabs above.' :
                   'Keep exploring — revisit the tabs to strengthen your knowledge.'}
                </div>
                <button className="il-btn" onClick={retake}>↺ Retake Quiz</button>
              </div>
            ) : currentQ ? (
              <div>
                <div className="il-quiz-progress">
                  <div className="il-quiz-progress-bar-bg">
                    <div className="il-quiz-progress-bar" style={{ width: `${(qNum / SESSION_SIZE) * 100}%` }} />
                  </div>
                  <div className="il-quiz-progress-label">{qNum + 1} / {SESSION_SIZE}</div>
                </div>

                <div className={`il-diff-badge ${difficulty}`}>
                  {difficulty === 'easy' ? '◦ Easy' : difficulty === 'medium' ? '◈ Medium' : '◆ Hard'}
                </div>

                <div className="il-quiz-q">{currentQ.q}</div>

                <div className="il-quiz-opts">
                  {currentQ.opts.map((opt, i) => {
                    let cls = 'il-quiz-opt'
                    if (chosen !== null) {
                      if (i === currentQ.correct) cls += ' correct'
                      else if (i === chosen && chosen !== currentQ.correct) cls += ' wrong'
                      else cls += ' neutral'
                    }
                    return (
                      <button key={i} className={cls} disabled={chosen !== null} onClick={() => handleQuiz(i)}>
                        {opt}
                      </button>
                    )
                  })}
                </div>

                {chosen !== null && (
                  <div className="il-quiz-explanation">
                    <strong>{chosen === currentQ.correct ? '✓ Correct!' : '✗ Not quite.'}</strong> {currentQ.explanation}
                  </div>
                )}

                {chosen !== null && (
                  <button className="il-btn" onClick={nextQ}>
                    {qNum + 1 >= SESSION_SIZE ? 'See Results →' : 'Next Question →'}
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
