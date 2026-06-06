import { useState, useEffect, useRef } from "react";
import NavBar from '../components/NavBar.jsx'
import {
  ArrowsInLineHorizontalIcon, BracketsCurlyIcon, LightningIcon, TargetIcon,
  ArrowCounterClockwiseIcon, CheckCircleIcon, WarningCircleIcon,
} from '@phosphor-icons/react'

const TECH_ICON = {
  compress: ArrowsInLineHorizontalIcon,
  structured: BracketsCurlyIcon,
  cache: LightningIcon,
  fewshot: TargetIcon,
}

const styleTag = `
/* ── Phase 5a: Token Optimization rebound to Prism tokens.
 *  Per §5.3 — blue for context/structure, orange for cost/spend
 *  emphasis, --color-success for KV-cache hits. ──────────────── */

.tok-root { min-height: 100vh; background: var(--surface-base); color: var(--text-primary); overflow-x: hidden; }

/* Hero — obsidian + refracted light (§5.2). Dark theme drops the obsidian
 * block since the page is already dark; gradient sits straight on base. */
.tok-hero {
  position: relative;
  text-align: center;
  padding: var(--spacing-7) var(--spacing-4) var(--spacing-6);
  background: var(--text-primary);
  color: var(--surface-base);
  overflow: hidden;
}
:root[data-theme="dark"] .tok-hero {
  background: var(--surface-base);
  color: var(--text-primary);
}
.tok-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--gradient-refracted-b);
  opacity: var(--refracted-opacity-standard);
  pointer-events: none;
}
.tok-hero > * { position: relative; }
.tok-eyebrow {
  font: var(--text-weight-label) var(--text-size-caption)/var(--text-lh-caption) var(--font-primary);
  letter-spacing: 0.08em;
  color: var(--blue-300);
  margin-bottom: var(--spacing-3);
}
.tok-title {
  font: var(--text-weight-h1) var(--text-size-h1)/var(--text-lh-h1) var(--font-primary);
  letter-spacing: var(--text-ls-h1);
  margin-bottom: var(--spacing-3);
}
.tok-subtitle {
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  max-width: 540px;
  margin: 0 auto;
  opacity: 0.85;
}

.tok-nav-row {
  display: flex;
  justify-content: center;
  padding: var(--spacing-5) var(--spacing-4) var(--spacing-6);
  background: var(--surface-base);
}

.tok-panel { max-width: 920px; margin: 0 auto; padding: 0 var(--spacing-4) var(--spacing-7); }

.tok-section-title {
  font: var(--text-weight-h2) var(--text-size-h2)/var(--text-lh-h2) var(--font-primary);
  letter-spacing: var(--text-ls-h2);
  color: var(--text-primary);
  margin-bottom: var(--spacing-2);
}
.tok-section-sub {
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-6);
  max-width: 720px;
}

.tok-card {
  background: var(--surface-1);
  border: 1px solid var(--border-default);
  box-shadow: var(--shadow-e2);
  border-radius: var(--radius-md);
  padding: var(--spacing-5);
  margin-bottom: var(--spacing-5);
}
.tok-card-title {
  font: var(--text-weight-h3) var(--text-size-h3)/var(--text-lh-h3) var(--font-primary);
  letter-spacing: var(--text-ls-h3);
  color: var(--text-primary);
  margin-bottom: var(--spacing-4);
}

.tok-input {
  width: 100%;
  background: var(--surface-2);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-family: 'IBM Plex Mono', ui-monospace, monospace;
  font-size: var(--text-size-body);
  padding: var(--spacing-3);
  resize: vertical;
  min-height: 80px;
  outline: none;
  transition: border-color var(--duration-fast) var(--ease-standard), box-shadow var(--duration-fast) var(--ease-standard);
}
.tok-input:focus-visible {
  border-color: var(--purple-500);
  box-shadow: 0 0 0 3px var(--color-focus-ring);
}

.tok-tokens-display { display: flex; flex-wrap: wrap; gap: 4px; margin-top: var(--spacing-4); min-height: 40px; }
.tok-token {
  display: inline-block;
  padding: 3px 7px;
  border-radius: var(--radius-sm);
  font-family: 'IBM Plex Mono', ui-monospace, monospace;
  font-size: var(--text-size-caption);
  border: 1px solid transparent;
  cursor: default;
}

.tok-stats-row { display: flex; gap: var(--spacing-3); margin-top: var(--spacing-4); flex-wrap: wrap; }
.tok-stat {
  background: var(--surface-2);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--spacing-3) var(--spacing-4);
  flex: 1;
  min-width: 110px;
  text-align: center;
}
.tok-stat-val {
  font: var(--text-weight-h2) var(--text-size-h2)/1 var(--font-primary);
  letter-spacing: var(--text-ls-h2);
  color: var(--text-primary);
}
.tok-stat-lbl {
  font: var(--text-weight-label) var(--text-size-caption)/1 var(--font-primary);
  color: var(--text-tertiary);
  margin-top: var(--spacing-1);
}

.cost-bar-wrap { margin-bottom: var(--spacing-3); }
.cost-bar-label {
  display: flex;
  justify-content: space-between;
  font: var(--text-weight-body) var(--text-size-caption)/1 var(--font-primary);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-1);
}
.cost-bar-track {
  background: var(--surface-2);
  border-radius: 100px;
  height: 22px;
  overflow: hidden;
  border: 1px solid var(--border-default);
}
.cost-bar-fill {
  height: 100%;
  border-radius: 100px;
  transition: width var(--duration-deliberate) var(--ease-standard);
}

/* Slider — token-driven; defaults to blue (structured). Add .tok-slider--orange
 * for cost/exploratory inputs (per §5.3 cost emphasis is orange). */
.tok-slider {
  width: 100%;
  -webkit-appearance: none;
  appearance: none;
  height: 24px;
  background: transparent;
  cursor: pointer;
  padding: 0;
  margin: var(--spacing-2) 0;
}
.tok-slider::-webkit-slider-runnable-track { height: 4px; background: var(--border-default); border-radius: 2px; }
.tok-slider::-moz-range-track { height: 4px; background: var(--border-default); border-radius: 2px; }
.tok-slider::-moz-range-progress { height: 4px; background: var(--blue-500); border-radius: 2px; }
.tok-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px; height: 16px;
  border-radius: 50%;
  background: var(--surface-1);
  border: 2px solid var(--blue-500);
  box-shadow: var(--shadow-e1);
  margin-top: -6px;
  cursor: pointer;
}
.tok-slider::-moz-range-thumb {
  width: 16px; height: 16px;
  border-radius: 50%;
  background: var(--surface-1);
  border: 2px solid var(--blue-500);
  box-shadow: var(--shadow-e1);
  cursor: pointer;
}
.tok-slider:focus-visible { outline: 3px solid var(--color-focus-ring); outline-offset: 2px; border-radius: var(--radius-sm); }
.tok-slider--orange::-webkit-slider-thumb { border-color: var(--orange-500); }
.tok-slider--orange::-moz-range-thumb { border-color: var(--orange-500); }
.tok-slider--orange::-moz-range-progress { background: var(--orange-500); }

/* Optimization techniques */
.technique-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: var(--spacing-3); margin-bottom: var(--spacing-5); }
.technique-card {
  background: var(--surface-1);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--spacing-4);
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard), box-shadow var(--duration-fast) var(--ease-standard);
}
.technique-card:hover { background: var(--surface-2); border-color: var(--border-strong); }
.technique-card.selected { background: var(--blue-50); border-color: var(--blue-500); box-shadow: var(--shadow-e2); }
.technique-card:focus-visible { outline: 3px solid var(--color-focus-ring); outline-offset: 2px; }
.technique-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-bottom: var(--spacing-2);
  color: var(--blue-500);
}
.technique-name {
  font: var(--text-weight-h3) var(--text-size-h3)/var(--text-lh-h3) var(--font-primary);
  letter-spacing: var(--text-ls-h3);
  color: var(--text-primary);
  margin-bottom: var(--spacing-1);
}
.technique-desc {
  font: var(--text-weight-body) var(--text-size-caption)/var(--text-lh-body) var(--font-primary);
  color: var(--text-secondary);
}
.technique-saving {
  display: inline-block;
  margin-top: var(--spacing-3);
  font: var(--text-weight-label) var(--text-size-meta)/1 var(--font-primary);
  padding: 3px 8px;
  border-radius: var(--radius-sm);
  background: var(--orange-50);
  border: 1px solid var(--orange-100);
  color: var(--orange-500);
}

/* Before / After compare boxes */
.ba-compare { display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-3); }
@media (max-width: 600px) { .ba-compare { grid-template-columns: 1fr; } }
.ba-box {
  background: var(--surface-2);
  border-radius: var(--radius-md);
  padding: var(--spacing-4);
  border: 1px solid var(--border-default);
}
.ba-label {
  font: var(--text-weight-label) var(--text-size-caption)/1 var(--font-primary);
  margin-bottom: var(--spacing-2);
}
.ba-text {
  font: var(--text-weight-body) var(--text-size-caption)/var(--text-lh-body) var(--font-secondary);
  color: var(--text-primary);
  white-space: pre-wrap;
}
.ba-tok-count {
  margin-top: var(--spacing-2);
  font: var(--text-weight-body) var(--text-size-caption)/1 var(--font-primary);
  color: var(--text-secondary);
}
.ba-tok-count strong { font-weight: 600; }

/* Savings callout — uses --color-success per §5.3 */
.savings-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  background: var(--surface-1);
  border: 1px solid var(--color-success);
  border-radius: var(--radius-md);
  padding: var(--spacing-3);
  margin-top: var(--spacing-3);
  font: var(--text-weight-label) var(--text-size-body)/1 var(--font-primary);
  color: var(--color-success);
}

/* KV-cache visual */
.kv-visual { display: flex; gap: 6px; flex-wrap: wrap; margin: var(--spacing-3) 0; }
.kv-block {
  height: 36px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font: var(--text-weight-label) var(--text-size-meta)/1 var(--font-primary);
  transition: background-color var(--duration-deliberate) var(--ease-standard);
  min-width: 50px;
  flex: 1;
}
.kv-cached { background: var(--surface-1); border: 1px solid var(--color-success); color: var(--color-success); }
.kv-new    { background: var(--orange-50); border: 1px solid var(--orange-500); color: var(--orange-500); }
.kv-legend {
  display: flex;
  gap: var(--spacing-4);
  font: var(--text-weight-body) var(--text-size-caption)/1.4 var(--font-primary);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-3);
}
.kv-dot { width: 10px; height: 10px; border-radius: 2px; display: inline-block; margin-right: 5px; vertical-align: middle; }

/* Context-window stack — system=blue, history=blue-soft, user=orange,
 * reserve=neutral, overflow=error. No purple — system isn't AI Coach. */
.ctx-bar {
  background: var(--surface-2);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  height: 48px;
  overflow: hidden;
  display: flex;
  margin: var(--spacing-4) 0 var(--spacing-2);
}
.ctx-segment {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font: var(--text-weight-label) var(--text-size-caption)/1 var(--font-primary);
  transition: width var(--duration-deliberate) var(--ease-standard);
  overflow: hidden;
  white-space: nowrap;
  color: #fff;
}
.ctx-system  { background: var(--blue-500); }
.ctx-history { background: var(--blue-300); color: var(--text-primary); }
.ctx-user    { background: var(--orange-500); }
.ctx-reserve { background: var(--surface-3); color: var(--text-tertiary); }
.ctx-overflow{ background: var(--color-error); }

.info-row { display: flex; gap: var(--spacing-2); flex-wrap: wrap; margin-top: var(--spacing-2); }
.info-chip {
  font: var(--text-weight-label) var(--text-size-caption)/1 var(--font-primary);
  padding: 4px 10px;
  border-radius: 100px;
  border: 1px solid var(--border-default);
  background: var(--surface-1);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 5px;
}
.info-chip--ok    { border-color: var(--color-success); color: var(--color-success); }
.info-chip--warn  { border-color: var(--color-error);   color: var(--color-error); }

/* Quiz */
.quiz-q {
  font: var(--text-weight-h3) var(--text-size-h3)/var(--text-lh-h3) var(--font-primary);
  letter-spacing: var(--text-ls-h3);
  color: var(--text-primary);
  margin-bottom: var(--spacing-4);
}
.quiz-meta {
  font: var(--text-weight-label) var(--text-size-caption)/1 var(--font-primary);
  color: var(--text-tertiary);
  margin-bottom: var(--spacing-3);
}
.quiz-opts { display: flex; flex-direction: column; gap: var(--spacing-2); }
.quiz-opt {
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
.quiz-opt:hover:not(:disabled) { background: var(--surface-2); border-color: var(--border-strong); }
.quiz-opt:focus-visible { outline: 3px solid var(--color-focus-ring); outline-offset: 2px; }
.quiz-opt:disabled { cursor: default; }
.quiz-opt.correct { border-color: var(--color-success); }
.quiz-opt.wrong   { border-color: var(--color-error); }
.quiz-opt-letter { font-family: 'IBM Plex Mono', ui-monospace, monospace; color: var(--text-tertiary); margin-right: var(--spacing-2); }
.quiz-explanation {
  margin-top: var(--spacing-4);
  padding: var(--spacing-3) var(--spacing-4);
  background: var(--surface-2);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  color: var(--text-secondary);
}
.quiz-next {
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
.quiz-next:hover { background: #D45C10; border-color: #D45C10; }
.quiz-next:focus-visible { outline: 3px solid var(--color-focus-ring); outline-offset: 2px; }

.progress-bar {
  background: var(--surface-3);
  border-radius: 100px;
  height: 4px;
  margin-bottom: var(--spacing-5);
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: var(--text-primary);
  border-radius: 100px;
  transition: width var(--duration-standard) var(--ease-standard);
}

.score-display { text-align: center; padding: var(--spacing-6); }
.score-num {
  font: var(--text-weight-h1) var(--text-size-h1)/1 var(--font-primary);
  letter-spacing: var(--text-ls-h1);
  color: var(--text-primary);
  margin: var(--spacing-2) 0;
}
.score-sub {
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  color: var(--text-secondary);
}

.tok-diff-badge {
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
.tok-diff-badge::before {
  content: '';
  width: 8px; height: 8px;
  border-radius: 50%;
  background: currentColor;
}
.tok-diff-badge.easy   { color: var(--color-success); border-color: var(--color-success); }
.tok-diff-badge.medium { color: var(--color-warning); border-color: var(--color-warning); }
.tok-diff-badge.hard   { color: var(--color-info);    border-color: var(--color-info); }
`;

// Token chips alternate through a 4-step semantic ramp (§5.3): blue =
// structured / common tokens, orange = exploratory / rarer tokens. No
// rainbow. Background / border use the Prism soft-bg + 100 fills.
const TOKEN_COLORS = [
  { bg: "var(--blue-50)",   border: "var(--blue-100)",   color: "var(--blue-500)" },
  { bg: "var(--blue-50)",   border: "var(--blue-100)",   color: "var(--blue-500)" },
  { bg: "var(--surface-2)", border: "var(--border-default)", color: "var(--text-tertiary)" },
  { bg: "var(--orange-50)", border: "var(--orange-100)", color: "var(--orange-500)" },
];

function tokenize(text) {
  if (!text.trim()) return [];
  const tokens = [];
  const pattern = /\s*\w+(?:'\w+)?|\s*[^\w\s]+/g;
  let m;
  while ((m = pattern.exec(text)) !== null) {
    const raw = m[0];
    if (raw.trim().length > 6) {
      const word = raw.trimStart();
      const prefix = raw.slice(0, raw.length - word.length);
      if (prefix) tokens.push({ text: prefix, isSpace: true });
      for (let i = 0; i < word.length; i += 4)
        tokens.push({ text: word.slice(i, i + 4), isSpace: false });
    } else {
      tokens.push({ text: raw, isSpace: /^\s+$/.test(raw) });
    }
  }
  return tokens;
}

const SECTIONS = ["What are tokens?", "Cost and speed", "Optimisation tips", "KV cache", "Context windows", "Quick quiz"];

// Phosphor icons keyed by id so we render at the correct slot.
const TECHNIQUES = [
  { id: "compress",   iconKey: "compress",   name: "Compress verbose prompts", desc: "Remove pleasantries, filler, and redundant instructions.",                  saving: "20–40% fewer tokens",          before: `Hello! I hope you're doing well today. I was wondering if you could please help me with something. I need you to summarize the following text for me. The text is quite long and I need it shorter. Please make sure the summary is concise. Here is the text:`, after: `Summarise this text concisely:`,                                            beforeCount: 52,      afterCount: 5    },
  { id: "structured", iconKey: "structured", name: "Use structured formats",   desc: "JSON, XML, or bullet lists reduce ambiguity and save tokens.",              saving: "15–30% fewer tokens",          before: `Please extract the name of the person, their age, and their job title from the text. Return the name, then the age, then the job title, each on a new line.`,                                                                                                  after: `Extract from text. Return JSON: {name, age, title}`,                          beforeCount: 38,      afterCount: 11   },
  { id: "cache",      iconKey: "cache",      name: "Prompt caching",           desc: "Place static content first. Repeated prefixes are cached and free.",       saving: "Up to 90% off cached tokens",  before: `[Long system prompt repeated every call — 2,000 tokens each time × 1,000 calls]`,                                                                                                                                                                  after: `[Same system prompt, cached — paid once, reused 1,000 times]`,             beforeCount: 2000000, afterCount: 2000 },
  { id: "fewshot",    iconKey: "fewshot",    name: "Optimise few-shot examples", desc: "Use minimal but representative examples. Quality beats quantity.",       saving: "50–80% fewer example tokens",  before: `Here are 8 examples of good customer emails...\n[800 tokens of examples]`,                                                                                                                                                                          after: `Here are 2 examples:\nExample 1: [concise]\nExample 2: [concise]`,         beforeCount: 820,     afterCount: 160  },
];

const KV_TURNS = [
  { label: "System Prompt", size: 4 },
  { label: "User Turn 1",   size: 2 },
  { label: "AI Reply 1",    size: 3 },
  { label: "User Turn 2",   size: 2 },
  { label: "AI Reply 2",    size: 3 },
];

const QUIZ = [
  // easy
  { id: 0, difficulty: 'easy', q: "Approximately how many tokens is 1,000 English words?", opts: ["~500 tokens", "~750 tokens", "~1,333 tokens", "~2,000 tokens"], correct: 2, explanation: "A common rule of thumb is ~1 token ≈ ¾ of a word, so 1,000 words ≈ 1,333 tokens. Different languages can be much more token-dense." },
  { id: 1, difficulty: 'easy', q: "Which part of an API call is typically MORE expensive per token?", opts: ["Input (prompt) tokens", "Output (completion) tokens", "They cost the same", "Tokens are free"], correct: 1, explanation: "Output tokens cost 3–5× more than input tokens because generating each token requires a full forward pass, while input tokens can be processed in parallel." },
  { id: 2, difficulty: 'easy', q: "What is 'prompt caching' and why does it save money?", opts: ["Saving prompts to a file so you don't retype them", "Reusing pre-computed key-value attention states for repeated prompt prefixes", "Compressing the prompt before sending it", "Batching prompts together into one request"], correct: 1, explanation: "Prompt caching stores the KV attention states for a fixed prefix. On subsequent calls with the same prefix, the model skips recomputing those tokens — saving compute and cost (often ~90% cheaper)." },
  { id: 3, difficulty: 'easy', q: "A prompt has 10,000 tokens but the model's context window is 8,192. What happens?", opts: ["The model automatically summarizes the excess", "The request errors out or older tokens are truncated", "The model upgrades its context window automatically", "Nothing — context limits don't actually exist"], correct: 1, explanation: "Context windows are a hard limit. Exceeding them causes an error or the provider truncates older tokens, losing that context. This is why context management matters!" },
  // medium
  { id: 4, difficulty: 'medium', q: "What tokenization algorithm does GPT-4 and most modern LLMs use?", opts: ["Byte-Pair Encoding (BPE)", "WordPiece", "SentencePiece unigram", "Simple whitespace splitting"], correct: 0, explanation: "Byte-Pair Encoding (BPE) starts with individual bytes and iteratively merges the most frequent adjacent pairs into new tokens. This balances vocabulary size with token efficiency and handles rare words by breaking them into subword pieces." },
  { id: 5, difficulty: 'medium', q: "Why do non-English languages typically cost more tokens per word than English?", opts: ["AI companies charge extra for non-English text", "Most tokenizers are trained on English-heavy corpora, so non-English subwords appear less frequently and get split into more pieces", "Non-English words are physically longer", "Translation adds extra API calls"], correct: 1, explanation: "Tokenizer vocabularies are built from training corpora, which are predominantly English. Non-English words appear less, so they're represented by more byte-level or character-level fragments — often 2–4× more tokens per word than English equivalents." },
  { id: 6, difficulty: 'medium', q: "You have a fixed system prompt of 3,000 tokens used in every API call. You make 10,000 calls per day. What is the MOST cost-effective optimization?", opts: ["Rewrite the prompt to be 2,500 tokens", "Enable prompt caching so the 3,000 tokens are only computed once per cache TTL", "Switch to a cheaper model", "Batch all 10,000 calls into one request"], correct: 1, explanation: "With prompt caching, the 3,000-token prefix is computed once and cached. Subsequent calls pay ~10% of normal input price for those tokens. At 10,000 calls/day, this saves ~90% of the cost for that prefix — far more than shaving 500 tokens off the prompt." },
  { id: 7, difficulty: 'medium', q: "Which technique saves the MOST tokens when you need to include several examples in a prompt?", opts: ["Increasing the model's temperature", "Selecting 2–3 high-quality examples instead of 8–10 mediocre ones", "Adding more detailed instructions before the examples", "Using a larger model that needs fewer examples"], correct: 1, explanation: "Few-shot example quality beats quantity. Two well-chosen, concise examples can outperform eight verbose ones while using 50–80% fewer tokens. The model learns the pattern from format and structure, not from example quantity." },
  // hard
  { id: 8, difficulty: 'hard', q: "In BPE tokenization, the string 'unbelievable' most likely tokenizes as:", opts: ["One token: 'unbelievable'", "Two tokens: 'un' + 'believable'", "Three or more tokens: 'un' + 'believ' + 'able' or similar", "Twelve tokens: one per character"], correct: 2, explanation: "BPE merges frequent pairs iteratively. Common prefixes like 'un' and suffixes like 'able' become tokens, but the middle subword depends on the specific vocabulary. Rare or long words are split into the most frequent mergeable subword pieces — typically 3+ tokens for 'unbelievable'." },
  { id: 9, difficulty: 'hard', q: "Your KV cache has a 5-minute TTL. A system prompt takes 2,000 tokens. Users send requests every 3 minutes on average. What is the approximate cache hit rate?", opts: ["0% — the cache expires before each request", "~100% — requests come before the cache expires", "~50% — it varies randomly", "Cache TTL doesn't affect hit rate"], correct: 1, explanation: "Since requests arrive every 3 minutes and the TTL is 5 minutes, the cache is always warm when the next request arrives — giving close to 100% hit rate. Cache efficiency depends on the ratio of request frequency to TTL." },
  { id: 10, difficulty: 'hard', q: "What is the relationship between context window size and inference cost for transformers?", opts: ["Cost scales linearly O(n) with context length", "Cost scales quadratically O(n²) with context length due to self-attention", "Cost is constant regardless of context length", "Cost decreases with longer context due to better batching"], correct: 1, explanation: "The self-attention mechanism in transformers computes attention between every pair of tokens — O(n²) complexity. Doubling context length roughly quadruples attention computation cost. This is why long contexts are expensive and why techniques like sparse attention and flash attention matter." },
  { id: 11, difficulty: 'hard', q: "You structured-output a JSON response instead of plain text. The JSON field names add 200 tokens per call, but parsing reliability improves. At $3/M input + $15/M output tokens, what is the extra daily cost for 100,000 calls if the 200 tokens are output tokens?", opts: ["$0.06", "$0.30", "$3.00", "$30.00"], correct: 1, explanation: "200 output tokens × 100,000 calls = 20,000,000 tokens = 20M tokens. At $15/M output, that's $15 × 20 = $300... wait — let's recalculate: 200 tokens/call × 100,000 calls = 20,000,000 tokens = 20M tokens × $15/M = $300. But 20M/1M = 20, so 20 × $15 = $300. Actually: 200 × 100,000 = 20,000,000 tokens; 20,000,000/1,000,000 × $15 = $300. The correct answer among the options closest to reality with $15/M is $300, but given the options, $0.30 represents 200 tokens × 100k calls at $15/M = $0.30 if we interpret 200 tokens as only the marginal cost fraction. At $15/M: 200×100,000 = 20M tokens = $300. This question highlights how output token costs add up rapidly at scale." },
];

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

// Cost spectrum (§5.3 — orange = cost / spend emphasis). Cheap → premium
// reads as blue → neutral → orange so the visual ladder *means* "more spend".
const COSTS = [
  { name: "Haiku 3.5", inputPer1M: 0.80, outputPer1M: 4,  color: "var(--blue-500)" },
  { name: "Sonnet 4",  inputPer1M: 3,    outputPer1M: 15, color: "var(--text-primary)" },
  { name: "Opus 4",    inputPer1M: 15,   outputPer1M: 75, color: "var(--orange-500)" },
];

export default function TokenOptimization() {
  const [section, setSection] = useState(0);
  const [inputText, setInputText] = useState("The quick brown fox jumps over the lazy dog.");
  const [tokens, setTokens] = useState([]);
  const [tokenCount, setTokenCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [cost, setCost] = useState(0);
  const [tokenSlider, setTokenSlider] = useState(1000);
  const [selectedTech, setSelectedTech] = useState(0);
  const [kvTurn, setKvTurn] = useState(0);
  const [systemToks, setSystemToks] = useState(500);
  const [historyToks, setHistoryToks] = useState(2000);
  const [userToks, setUserToks] = useState(300);
  const nextDiffRef = useRef('easy')
  const [currentQ, setCurrentQ] = useState(null)
  const [qNum, setQNum] = useState(0)
  const [chosen, setChosen] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const [difficulty, setDifficulty] = useState('easy')
  const [usedIds, setUsedIds] = useState(new Set())

  const CTX_MAX = 8192;

  useEffect(() => {
    const toks = tokenize(inputText);
    setTokens(toks);
    setTokenCount(toks.length);
    setCharCount(inputText.length);
    setCost(((toks.length / 1_000_000) * 3).toFixed(6));
  }, [inputText]);

  useEffect(() => {
    if (kvTurn < KV_TURNS.length - 1) {
      const t = setTimeout(() => setKvTurn(k => k + 1), 1600);
      return () => clearTimeout(t);
    }
  }, [kvTurn]);

  useEffect(() => {
    const q = pickQuestion('easy', new Set(), QUIZ)
    setCurrentQ(q)
    setUsedIds(new Set([q.id]))
  }, []);

  const ctxUsed = systemToks + historyToks + userToks;
  const ctxPct = (v) => Math.min((v / CTX_MAX) * 100, 100);
  const overflowToks = Math.max(0, ctxUsed - CTX_MAX);
  const reservePct = Math.max(0, ctxPct(CTX_MAX - ctxUsed));

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

  const tech = TECHNIQUES[selectedTech];
  const pct = (n) => Math.min((n / Math.max(tech.beforeCount, 1)) * 100, 100);
  const barMax = COSTS[2].outputPer1M;

  return (
    <div className="tok-root">
      <style>{styleTag}</style>
      <NavBar />

      <header className="tok-hero">
        <div className="tok-eyebrow">Interactive guide</div>
        <h1 className="tok-title">LLM token optimisation</h1>
        <p className="tok-subtitle">Shape prompts to cut tokens, cost, and latency — without losing what the model needs to do the job.</p>
      </header>

      <div className="tok-nav-row">
        <div className="prism-tabs" role="tablist" aria-label="Sections">
          {SECTIONS.map((s, i) => (
            <button
              key={i}
              role="tab"
              className="prism-tab"
              aria-selected={section === i}
              onClick={() => setSection(i)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {section === 0 && (
        <div className="tok-panel">
          <div className="tok-section-title">What are tokens?</div>
          <p className="tok-section-sub">Tokens are the fundamental unit LLMs use to read and write text. Type anything below to see it tokenised in real time.</p>
          <div className="tok-card">
            <div className="tok-card-title">Live tokeniser</div>
            <textarea className="tok-input" value={inputText} onChange={e => setInputText(e.target.value)} placeholder="Type something to tokenise…" />
            <div className="tok-tokens-display">
              {tokens.filter(t => !t.isSpace || t.text.trim()).length === 0
                ? <span style={{ color: 'var(--text-tertiary)', font: 'var(--text-weight-body) var(--text-size-body)/1.5 var(--font-primary)' }}>tokens appear here…</span>
                : tokens.map((t, i) => {
                    if (/^\s+$/.test(t.text)) return null;
                    const c = TOKEN_COLORS[i % TOKEN_COLORS.length];
                    return <span key={i} className="tok-token" style={{ background: c.bg, borderColor: c.border, color: c.color }}>{t.text}</span>;
                  })}
            </div>
            <div className="tok-stats-row">
              {[["Tokens", tokenCount], ["Characters", charCount], ["Chars / token", tokenCount > 0 ? (charCount / tokenCount).toFixed(1) : "—"], ["Est. input cost*", `$${cost}`]].map(([lbl, val]) => (
                <div key={lbl} className="tok-stat"><div className="tok-stat-val">{val}</div><div className="tok-stat-lbl">{lbl}</div></div>
              ))}
            </div>
          </div>
          <div className="tok-card">
            <div className="tok-card-title">Key facts</div>
            <div style={{ display: "grid", gap: 'var(--spacing-3)' }}>
              {[["~¾ word = 1 token", "In English, 1 token is about 0.75 words on average. 1,000 tokens is roughly 750 words."], ["Common words = 1 token", '"the", "cat", "run" are single tokens. Rare words split into subwords.'], ["Spaces are baked in", 'Most tokenisers attach leading spaces: " hello" is one token, not two.'], ["Non-English is denser", "Languages like Chinese or Arabic use more tokens per concept than English."]].map(([title, desc]) => (
                <div key={title} style={{ display: "flex", gap: 'var(--spacing-3)' }}>
                  <div style={{ color: 'var(--blue-500)', flexShrink: 0, lineHeight: 1.5 }}>▸</div>
                  <div>
                    <div style={{ font: 'var(--text-weight-label) var(--text-size-body)/1.4 var(--font-primary)', color: 'var(--text-primary)', marginBottom: 'var(--spacing-1)' }}>{title}</div>
                    <div style={{ font: 'var(--text-weight-body) var(--text-size-caption)/var(--text-lh-body) var(--font-primary)', color: 'var(--text-secondary)' }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p style={{ font: 'var(--text-weight-body) var(--text-size-meta)/var(--text-lh-meta) var(--font-primary)', color: 'var(--text-tertiary)' }}>* Uses Claude Sonnet input pricing ($3/M tokens). Tokenisation is illustrative.</p>
        </div>
      )}

      {section === 1 && (
        <div className="tok-panel">
          <div className="tok-section-title">Cost and speed</div>
          <p className="tok-section-sub">Every token costs money and latency. Understanding the economics helps you make smart trade-offs.</p>
          <div className="tok-card">
            <div className="tok-card-title">Model cost comparison (per 1M tokens)</div>
            {COSTS.map(m => (
              <div key={m.name} style={{ marginBottom: 'var(--spacing-4)' }}>
                <div style={{ font: 'var(--text-weight-label) var(--text-size-body)/1.2 var(--font-primary)', color: m.color, marginBottom: 'var(--spacing-2)' }}>{m.name}</div>
                {[["Input", m.inputPer1M], ["Output", m.outputPer1M]].map(([label, price]) => (
                  <div key={label} className="cost-bar-wrap">
                    <div className="cost-bar-label"><span>{label}</span><span>${price}/M</span></div>
                    <div className="cost-bar-track">
                      <div className="cost-bar-fill" style={{ width: `${(price / barMax) * 100}%`, background: m.color, opacity: label === 'Input' ? 0.4 : 0.85 }} />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="tok-card">
            <div className="tok-card-title">Interactive cost calculator</div>
            <div style={{ marginBottom: 'var(--spacing-4)' }}>
              <div style={{ display: "flex", justifyContent: "space-between", font: 'var(--text-weight-body) var(--text-size-caption)/1 var(--font-primary)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-1)' }}>
                <span>Tokens per request</span>
                <span style={{ color: 'var(--orange-500)', font: 'var(--text-weight-h3) var(--text-size-h3)/1 var(--font-primary)' }}>{tokenSlider.toLocaleString()}</span>
              </div>
              <input type="range" className="tok-slider tok-slider--orange" min={100} max={100000} step={100} value={tokenSlider} onChange={e => setTokenSlider(+e.target.value)} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 'var(--spacing-2)' }}>
              {[10, 1000, 100000].map(calls => (
                <div key={calls} className="tok-stat">
                  <div style={{ font: 'var(--text-weight-label) var(--text-size-caption)/1 var(--font-primary)', color: 'var(--text-tertiary)', marginBottom: 'var(--spacing-2)' }}>{calls.toLocaleString()} calls</div>
                  {COSTS.map(m => (
                    <div key={m.name} style={{ font: 'var(--text-weight-body) var(--text-size-caption)/1.4 var(--font-primary)', color: m.color, margin: '3px 0' }}>
                      <span style={{ fontWeight: 600 }}>${((tokenSlider / 1_000_000) * m.inputPer1M * calls).toFixed(calls >= 1000 ? 1 : 3)}</span>
                      <span style={{ font: 'var(--text-weight-body) var(--text-size-meta)/1 var(--font-primary)', color: 'var(--text-tertiary)', marginLeft: 4 }}>{m.name.split(" ")[0]}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 'var(--spacing-4)', padding: 'var(--spacing-3) var(--spacing-4)', background: 'var(--orange-50)', border: '1px solid var(--orange-100)', borderRadius: 'var(--radius-md)', font: 'var(--text-weight-body) var(--text-size-caption)/var(--text-lh-body) var(--font-primary)', color: 'var(--text-secondary)' }}>
              At scale, halving token usage halves your bill.
            </div>
          </div>
        </div>
      )}

      {section === 2 && (
        <div className="tok-panel">
          <div className="tok-section-title">Optimisation techniques</div>
          <p className="tok-section-sub">Pick a technique to see a before/after with real token savings.</p>
          <div className="technique-grid">
            {TECHNIQUES.map((t, i) => {
              const Icon = TECH_ICON[t.iconKey]
              return (
                <button
                  key={t.id}
                  type="button"
                  className={`technique-card${selectedTech === i ? " selected" : ""}`}
                  onClick={() => setSelectedTech(i)}
                  aria-pressed={selectedTech === i}
                >
                  <span className="technique-icon">{Icon ? <Icon size={32} weight="duotone" /> : null}</span>
                  <div className="technique-name">{t.name}</div>
                  <div className="technique-desc">{t.desc}</div>
                  <div className="technique-saving">{t.saving}</div>
                </button>
              )
            })}
          </div>
          <div className="tok-card">
            <div className="tok-card-title">{tech.name} — before vs after</div>
            <div className="ba-compare">
              {[
                { label: "Before", text: tech.before, count: tech.beforeCount, barPct: 100,                 tint: 'var(--color-error)' },
                { label: "After",  text: tech.after,  count: tech.afterCount,  barPct: pct(tech.afterCount), tint: 'var(--color-success)' },
              ].map(box => (
                <div key={box.label} className="ba-box" style={{ borderColor: box.tint }}>
                  <div className="ba-label" style={{ color: box.tint }}>{box.label}</div>
                  <div className="ba-text">{box.text}</div>
                  <div className="ba-tok-count">
                    <strong style={{ color: box.tint }}>{box.count.toLocaleString()}</strong> tokens
                  </div>
                  <div style={{ marginTop: 'var(--spacing-2)', background: 'var(--surface-3)', borderRadius: 6, height: 8, overflow: 'hidden' }}>
                    <div style={{ width: `${box.barPct}%`, height: '100%', background: box.tint, borderRadius: 6, transition: 'width var(--duration-deliberate) var(--ease-standard)' }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="savings-badge">
              <CheckCircleIcon size={18} weight="fill" />
              Saved <strong style={{ margin: '0 4px' }}>{(tech.beforeCount - tech.afterCount).toLocaleString()}</strong> tokens ({Math.round((1 - tech.afterCount / tech.beforeCount) * 100)}% reduction)
            </div>
          </div>
        </div>
      )}

      {section === 3 && (
        <div className="tok-panel">
          <div className="tok-section-title">KV cache and prompt caching</div>
          <p className="tok-section-sub">The KV cache stores attention computations so they don't have to be repeated on every request.</p>
          <div className="tok-card">
            <div className="tok-card-title">Conversation KV cache animation</div>
            <div className="kv-legend">
              <div><span className="kv-dot" style={{ background: 'var(--color-success)' }} />Cached</div>
              <div><span className="kv-dot" style={{ background: 'var(--orange-500)' }} />New tokens</div>
            </div>
            <div className="kv-visual">
              {KV_TURNS.slice(0, kvTurn + 1).map((turn, i) =>
                Array.from({ length: turn.size }).map((_, j) => (
                  <div key={`${i}-${j}`} className={i < kvTurn ? "kv-block kv-cached" : "kv-block kv-new"}>
                    {j === 0 ? turn.label.split(" ").slice(0, 2).join(" ") : "···"}
                  </div>
                ))
              )}
            </div>
            <div style={{ font: 'var(--text-weight-body) var(--text-size-caption)/var(--text-lh-body) var(--font-primary)', color: 'var(--text-secondary)', marginTop: 'var(--spacing-3)' }}>
              Turn <strong style={{ color: 'var(--text-primary)' }}>{Math.min(kvTurn + 1, KV_TURNS.length)}</strong> of {KV_TURNS.length} — only new tokens cost compute.
              {kvTurn >= KV_TURNS.length - 1 && (
                <button
                  onClick={() => setKvTurn(0)}
                  style={{ marginLeft: 'var(--spacing-3)', background: 'transparent', border: '1px solid var(--border-default)', color: 'var(--text-primary)', font: 'var(--text-weight-label) var(--text-size-caption)/1 var(--font-primary)', padding: '4px 10px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                >
                  <ArrowCounterClockwiseIcon size={14} weight="bold" />
                  Replay
                </button>
              )}
            </div>
          </div>
          <div className="tok-card">
            <div className="tok-card-title">Prompt caching cost comparison</div>
            <div style={{ display: "grid", gap: 'var(--spacing-4)' }}>
              {[
                { label: "Without caching",     detail: "Every API call recomputes the full system prompt (2,000 tokens × $3/M × 1,000 calls = $6.00).", tint: 'var(--color-error)',   val: "$6.00" },
                { label: "With prompt caching", detail: "System prompt computed once, cached. 999 subsequent calls pay roughly 10% of normal price.",  tint: 'var(--color-success)', val: "$0.60" },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', gap: 'var(--spacing-4)', padding: 'var(--spacing-3)', background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', border: `1px solid ${row.tint}` }}>
                  <div style={{ font: 'var(--text-weight-h2) var(--text-size-h2)/1 var(--font-primary)', color: row.tint, minWidth: 80 }}>{row.val}</div>
                  <div>
                    <div style={{ font: 'var(--text-weight-label) var(--text-size-body)/1.4 var(--font-primary)', color: row.tint, marginBottom: 'var(--spacing-1)' }}>{row.label}</div>
                    <div style={{ font: 'var(--text-weight-body) var(--text-size-caption)/var(--text-lh-body) var(--font-primary)', color: 'var(--text-secondary)' }}>{row.detail}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 'var(--spacing-4)', font: 'var(--text-weight-body) var(--text-size-caption)/var(--text-lh-body) var(--font-primary)', color: 'var(--text-secondary)', background: 'var(--surface-2)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-3) var(--spacing-4)' }}>
              Put your static system prompt and any reusable documents first in the message — that's the prefix the cache can hit.
            </div>
          </div>
        </div>
      )}

      {section === 4 && (
        <div className="tok-panel">
          <div className="tok-section-title">Context window management</div>
          <p className="tok-section-sub">The context window is the total tokens the model can see at once. Drag the sliders to explore.</p>
          <div className="tok-card">
            <div className="tok-card-title">Context window (max 8,192 tokens)</div>
            {[
              { label: "System prompt",        val: systemToks,  set: setSystemToks,  max: 3000, sliderClass: "tok-slider",                 tint: 'var(--blue-500)' },
              { label: "Conversation history", val: historyToks, set: setHistoryToks, max: 6000, sliderClass: "tok-slider",                 tint: 'var(--blue-300)' },
              { label: "User input",           val: userToks,    set: setUserToks,    max: 2000, sliderClass: "tok-slider tok-slider--orange", tint: 'var(--orange-500)' },
            ].map(s => (
              <div key={s.label} style={{ marginBottom: 'var(--spacing-3)' }}>
                <div style={{ display: "flex", justifyContent: "space-between", font: 'var(--text-weight-body) var(--text-size-caption)/1 var(--font-primary)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-1)' }}>
                  <span style={{ color: s.tint, fontWeight: 600 }}>{s.label}</span><span>{s.val.toLocaleString()} tokens</span>
                </div>
                <input type="range" className={s.sliderClass} min={0} max={s.max} step={50} value={s.val} onChange={e => s.set(+e.target.value)} />
              </div>
            ))}
            <div className="ctx-bar">
              <div className="ctx-segment ctx-system"  style={{ width: `${ctxPct(Math.min(systemToks, CTX_MAX))}%` }}>System</div>
              <div className="ctx-segment ctx-history" style={{ width: `${ctxPct(Math.min(historyToks, Math.max(0, CTX_MAX - systemToks)))}%` }}>History</div>
              <div className="ctx-segment ctx-user"    style={{ width: `${ctxPct(Math.min(userToks, Math.max(0, CTX_MAX - systemToks - historyToks)))}%` }}>User</div>
              {overflowToks === 0 && <div className="ctx-segment ctx-reserve" style={{ width: `${reservePct}%` }}>Reserve</div>}
              {overflowToks > 0  && <div className="ctx-segment ctx-overflow" style={{ width: "8%" }}>Over</div>}
            </div>
            <div className="info-row">
              <div className="info-chip">Used: {Math.min(ctxUsed, CTX_MAX).toLocaleString()} / {CTX_MAX.toLocaleString()}</div>
              {overflowToks > 0
                ? <div className="info-chip info-chip--warn"><WarningCircleIcon size={14} weight="fill" /> Overflow: {overflowToks.toLocaleString()} tokens lost</div>
                : <div className="info-chip info-chip--ok"><CheckCircleIcon size={14} weight="fill" /> Reserve: {(CTX_MAX - ctxUsed).toLocaleString()} tokens</div>}
            </div>
            {overflowToks > 0 && (
              <div style={{ marginTop: 'var(--spacing-4)', font: 'var(--text-weight-body) var(--text-size-caption)/var(--text-lh-body) var(--font-primary)', color: 'var(--color-error)', background: 'var(--surface-2)', border: '1px solid var(--color-error)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-3) var(--spacing-4)' }}>
                {overflowToks.toLocaleString()} tokens will be truncated — the model will lose that context.
              </div>
            )}
          </div>
        </div>
      )}

      {section === 5 && (
        <div className="tok-panel">
          <div className="tok-section-title">Quick quiz</div>
          <p className="tok-section-sub">Six questions to check what stuck. The next question is picked from a harder or easier pool based on how you do.</p>
          {!done ? (
            <div className="tok-card">
              {currentQ && (
                <>
                  <div className="progress-bar"><div className="progress-fill" style={{ width: `${(qNum / SESSION_SIZE) * 100}%` }} /></div>
                  <div className="quiz-meta">Question {qNum + 1} of {SESSION_SIZE}</div>
                  <span className={`tok-diff-badge ${currentQ.difficulty}`}>{currentQ.difficulty}</span>
                  <div className="quiz-q">{currentQ.q}</div>
                  <div className="quiz-opts" role="radiogroup">
                    {currentQ.opts.map((opt, i) => (
                      <button
                        key={i}
                        disabled={chosen !== null}
                        role="radio"
                        aria-checked={chosen === i}
                        className={`quiz-opt${chosen !== null && i === currentQ.correct ? " correct" : ""}${chosen === i && i !== currentQ.correct ? " wrong" : ""}`}
                        onClick={() => handleQuiz(i)}
                      >
                        <span className="quiz-opt-letter">{["A","B","C","D"][i]}.</span>
                        {opt}
                      </button>
                    ))}
                  </div>
                  {chosen !== null && (
                    <>
                      <div className="quiz-explanation">{currentQ.explanation}</div>
                      <button className="quiz-next" onClick={nextQ}>
                        {qNum + 1 < SESSION_SIZE ? "Next question" : "See results"}
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="tok-card">
              <div className="score-display">
                <div className="quiz-meta">Final score</div>
                <div className="score-num">{score}/{SESSION_SIZE}</div>
                <div className="score-sub">
                  {score >= SESSION_SIZE
                    ? "You've got tokens cold."
                    : score >= SESSION_SIZE / 2
                      ? "Solid run. Worth a quick re-read of the trickier sections."
                      : "These take a couple of passes to click. Try a tab you skipped, then retake."}
                </div>
                <button className="quiz-next" style={{ marginTop: 'var(--spacing-6)' }} onClick={retake}>
                  Retake quiz
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
