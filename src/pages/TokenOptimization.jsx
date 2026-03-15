import { useState, useEffect } from "react";
import NavBar from '../components/NavBar.jsx'

const styleTag = `
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@400;600;700;800&display=swap');

.tok-root {
  min-height: 100vh;
  background: #050810;
  color: #e0e8f0;
  font-family: 'DM Mono', monospace;
  overflow-x: hidden;
}

.tok-hero {
  text-align: center;
  padding: 48px 24px 28px;
  position: relative;
}

.tok-hero::before {
  content: '';
  position: absolute;
  top: 0; left: 50%;
  transform: translateX(-50%);
  width: 600px; height: 300px;
  background: radial-gradient(ellipse at 50% 0%, rgba(56,189,248,0.1) 0%, transparent 70%);
  pointer-events: none;
}

.tok-eyebrow {
  font-size: 11px;
  letter-spacing: 0.22em;
  color: #38bdf8;
  text-transform: uppercase;
  margin-bottom: 14px;
}

.tok-title {
  font-family: 'Syne', sans-serif;
  font-size: clamp(28px, 5vw, 50px);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #fff;
  line-height: 1.1;
  margin-bottom: 12px;
}

.tok-title span { color: #38bdf8; }

.tok-subtitle {
  font-size: 13px;
  color: #7a9bbf;
  max-width: 500px;
  margin: 0 auto 32px;
  line-height: 1.7;
}

.tok-nav {
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
  padding: 0 16px 32px;
}

.tok-nav-btn {
  background: transparent;
  border: 1px solid #1e3048;
  color: #7a9bbf;
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.1em;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.18s;
  text-transform: uppercase;
}
.tok-nav-btn:hover { border-color: #38bdf8; color: #38bdf8; }
.tok-nav-btn.active { background: rgba(56,189,248,0.12); border-color: #38bdf8; color: #38bdf8; }

.tok-panel { max-width: 860px; margin: 0 auto; padding: 0 20px 80px; }

.tok-section-title { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 700; color: #fff; margin-bottom: 8px; }
.tok-section-sub { font-size: 12px; color: #7a9bbf; margin-bottom: 28px; line-height: 1.7; }

.tok-card { background: #0d1520; border: 1px solid #1e3048; border-radius: 12px; padding: 24px; margin-bottom: 20px; }
.tok-card-title { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; color: #38bdf8; margin-bottom: 14px; }

.tok-input { width: 100%; background: #07101a; border: 1px solid #1e3048; border-radius: 8px; color: #e0e8f0; font-family: 'DM Mono', monospace; font-size: 13px; padding: 14px; resize: vertical; min-height: 80px; outline: none; transition: border-color 0.2s; }
.tok-input:focus { border-color: #38bdf8; }

.tok-tokens-display { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 14px; min-height: 40px; }

.tok-token { display: inline-block; padding: 3px 7px; border-radius: 4px; font-size: 12px; font-family: 'DM Mono', monospace; border: 1px solid transparent; transition: transform 0.15s; cursor: default; }
.tok-token:hover { transform: scale(1.08); }

.tok-stats-row { display: flex; gap: 16px; margin-top: 16px; flex-wrap: wrap; }
.tok-stat { background: #07101a; border: 1px solid #1e3048; border-radius: 8px; padding: 10px 16px; flex: 1; min-width: 100px; text-align: center; }
.tok-stat-val { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; color: #38bdf8; }
.tok-stat-lbl { font-size: 10px; color: #7a9bbf; letter-spacing: 0.08em; text-transform: uppercase; margin-top: 2px; }

.cost-bar-wrap { margin-bottom: 14px; }
.cost-bar-label { display: flex; justify-content: space-between; font-size: 11px; color: #7a9bbf; margin-bottom: 5px; }
.cost-bar-track { background: #07101a; border-radius: 100px; height: 22px; overflow: hidden; border: 1px solid #1e3048; }
.cost-bar-fill { height: 100%; border-radius: 100px; transition: width 0.5s cubic-bezier(.4,0,.2,1); }

.tok-slider { width: 100%; accent-color: #38bdf8; margin: 8px 0 4px; cursor: pointer; }

.technique-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; margin-bottom: 20px; }

.technique-card { background: #07101a; border: 1px solid #1e3048; border-radius: 10px; padding: 18px; cursor: pointer; transition: all 0.2s; position: relative; overflow: hidden; }
.technique-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, var(--accent, #38bdf8), transparent); opacity: 0; transition: opacity 0.2s; }
.technique-card:hover, .technique-card.selected { border-color: var(--accent, #38bdf8); box-shadow: 0 0 24px rgba(56,189,248,0.08); }
.technique-card:hover::before, .technique-card.selected::before { opacity: 1; }

.technique-icon { font-size: 22px; margin-bottom: 10px; }
.technique-name { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; color: #e0e8f0; margin-bottom: 6px; }
.technique-desc { font-size: 11px; color: #7a9bbf; line-height: 1.6; }
.technique-saving { display: inline-block; margin-top: 10px; font-size: 10px; padding: 3px 8px; border-radius: 4px; border: 1px solid; letter-spacing: 0.06em; }

.ba-compare { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
@media (max-width: 560px) { .ba-compare { grid-template-columns: 1fr; } }
.ba-box { background: #07101a; border-radius: 8px; padding: 14px; border: 1px solid #1e3048; }
.ba-label { font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 8px; font-weight: 500; }
.ba-text { font-size: 12px; color: #b0c8e0; line-height: 1.7; white-space: pre-wrap; }
.ba-tok-count { margin-top: 10px; font-size: 11px; color: #7a9bbf; }
.ba-tok-count span { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 16px; }

.savings-badge { display: flex; align-items: center; justify-content: center; gap: 8px; background: rgba(52,211,153,0.08); border: 1px solid rgba(52,211,153,0.2); border-radius: 8px; padding: 10px; margin-top: 12px; font-size: 12px; color: #34d399; }

.kv-visual { display: flex; gap: 6px; flex-wrap: wrap; margin: 14px 0; }
.kv-block { height: 36px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 500; transition: all 0.3s; min-width: 50px; flex: 1; }
.kv-cached { background: rgba(56,189,248,0.15); border: 1px solid rgba(56,189,248,0.4); color: #38bdf8; }
.kv-new    { background: rgba(251,191,36,0.1); border: 1px solid rgba(251,191,36,0.35); color: #fbbf24; }
.kv-legend { display: flex; gap: 18px; font-size: 11px; color: #7a9bbf; margin-bottom: 14px; }
.kv-dot { width: 10px; height: 10px; border-radius: 2px; display: inline-block; margin-right: 5px; vertical-align: middle; }

.ctx-bar { background: #07101a; border: 1px solid #1e3048; border-radius: 10px; height: 48px; overflow: hidden; display: flex; margin: 16px 0 8px; }
.ctx-segment { height: 100%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 500; transition: width 0.5s cubic-bezier(.4,0,.2,1); overflow: hidden; white-space: nowrap; }
.ctx-system  { background: rgba(139,92,246,0.3);  color: #c4b5fd; }
.ctx-history { background: rgba(56,189,248,0.2);  color: #7dd3fc; }
.ctx-user    { background: rgba(251,191,36,0.2);  color: #fde68a; }
.ctx-reserve { background: rgba(52,211,153,0.15); color: #6ee7b7; }
.ctx-overflow{ background: rgba(239,68,68,0.2);   color: #fca5a5; }

.info-row { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 10px; }
.info-chip { font-size: 11px; padding: 4px 10px; border-radius: 100px; border: 1px solid; display: flex; align-items: center; gap: 5px; }

.quiz-q { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 16px; line-height: 1.4; }
.quiz-opts { display: flex; flex-direction: column; gap: 8px; }
.quiz-opt { background: #07101a; border: 1px solid #1e3048; border-radius: 8px; padding: 12px 16px; font-size: 13px; color: #b0c8e0; cursor: pointer; text-align: left; font-family: 'DM Mono', monospace; transition: all 0.18s; }
.quiz-opt:hover:not(:disabled) { border-color: #38bdf8; color: #e0e8f0; }
.quiz-opt.correct { border-color: #34d399; background: rgba(52,211,153,0.1); color: #34d399; }
.quiz-opt.wrong   { border-color: #ef4444; background: rgba(239,68,68,0.08); color: #f87171; }
.quiz-explanation { margin-top: 14px; padding: 12px; background: rgba(56,189,248,0.06); border: 1px solid rgba(56,189,248,0.2); border-radius: 8px; font-size: 12px; color: #93c5fd; line-height: 1.7; }
.quiz-next { margin-top: 14px; background: rgba(56,189,248,0.15); border: 1px solid #38bdf8; color: #38bdf8; font-family: 'DM Mono', monospace; font-size: 12px; padding: 10px 20px; border-radius: 6px; cursor: pointer; letter-spacing: 0.08em; text-transform: uppercase; transition: all 0.18s; }
.quiz-next:hover { background: rgba(56,189,248,0.25); }

.progress-bar { background: #0d1520; border-radius: 100px; height: 4px; margin-bottom: 20px; overflow: hidden; }
.progress-fill { height: 100%; background: linear-gradient(90deg, #38bdf8, #818cf8); border-radius: 100px; transition: width 0.4s; }

.score-display { text-align: center; padding: 30px; }
.score-num { font-family: 'Syne', sans-serif; font-size: 64px; font-weight: 800; color: #38bdf8; }
.score-sub { font-size: 14px; color: #7a9bbf; margin-top: 8px; }
`;

const TOKEN_COLORS = [
  { bg: "rgba(56,189,248,0.15)",  border: "rgba(56,189,248,0.5)",  color: "#38bdf8" },
  { bg: "rgba(129,140,248,0.15)", border: "rgba(129,140,248,0.5)", color: "#818cf8" },
  { bg: "rgba(52,211,153,0.15)",  border: "rgba(52,211,153,0.5)",  color: "#34d399" },
  { bg: "rgba(251,191,36,0.15)",  border: "rgba(251,191,36,0.5)",  color: "#fbbf24" },
  { bg: "rgba(249,115,22,0.15)",  border: "rgba(249,115,22,0.5)",  color: "#f97316" },
  { bg: "rgba(236,72,153,0.15)",  border: "rgba(236,72,153,0.5)",  color: "#ec4899" },
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

const SECTIONS = ["What are Tokens?", "Cost & Speed", "Optimization Tips", "KV Cache", "Context Windows", "Quick Quiz"];

const TECHNIQUES = [
  { id: "compress", icon: "🗜️", name: "Compress Verbose Prompts", desc: "Remove pleasantries, filler, and redundant instructions.", saving: "20–40% fewer tokens", accent: "#38bdf8", before: `Hello! I hope you're doing well today. I was wondering if you could please help me with something. I need you to summarize the following text for me. The text is quite long and I need it shorter. Please make sure the summary is concise. Here is the text:`, after: `Summarize this text concisely:`, beforeCount: 52, afterCount: 5 },
  { id: "structured", icon: "📐", name: "Use Structured Formats", desc: "JSON, XML, or bullet lists reduce ambiguity and save tokens.", saving: "15–30% fewer tokens", accent: "#818cf8", before: `Please extract the name of the person, their age, and their job title from the text. Return the name, then the age, then the job title, each on a new line.`, after: `Extract from text. Return JSON: {name, age, title}`, beforeCount: 38, afterCount: 11 },
  { id: "cache", icon: "⚡", name: "Prompt Caching", desc: "Place static content first. Repeated prefixes are cached and free.", saving: "Up to 90% cost on cached tokens", accent: "#34d399", before: `[Long system prompt repeated every call — 2,000 tokens each time × 1,000 calls]`, after: `[Same system prompt, cached — paid once, reused 1,000 times]`, beforeCount: 2000000, afterCount: 2000 },
  { id: "fewshot", icon: "🎯", name: "Optimize Few-Shot Examples", desc: "Use minimal but representative examples. Quality beats quantity.", saving: "50–80% fewer example tokens", accent: "#fbbf24", before: `Here are 8 examples of good customer emails...\n[800 tokens of examples]`, after: `Here are 2 examples:\nExample 1: [concise]\nExample 2: [concise]`, beforeCount: 820, afterCount: 160 },
];

const KV_TURNS = [
  { label: "System Prompt", size: 4 },
  { label: "User Turn 1",   size: 2 },
  { label: "AI Reply 1",    size: 3 },
  { label: "User Turn 2",   size: 2 },
  { label: "AI Reply 2",    size: 3 },
];

const QUIZ = [
  { q: "Approximately how many tokens is 1,000 English words?", opts: ["~500 tokens", "~750 tokens", "~1,333 tokens", "~2,000 tokens"], correct: 2, explanation: "A common rule of thumb is ~1 token ≈ ¾ of a word, so 1,000 words ≈ 1,333 tokens. Different languages can be much more token-dense." },
  { q: "Which part of an API call is typically MORE expensive per token?", opts: ["Input (prompt) tokens", "Output (completion) tokens", "They cost the same", "Tokens are free"], correct: 1, explanation: "Output tokens cost 3–5× more than input tokens because generating each token requires a full forward pass, while input tokens can be processed in parallel." },
  { q: "What is 'prompt caching' and why does it save money?", opts: ["Saving prompts to a file so you don't retype them", "Reusing pre-computed key-value attention states for repeated prompt prefixes", "Compressing the prompt before sending it", "Batching prompts together into one request"], correct: 1, explanation: "Prompt caching stores the KV attention states for a fixed prefix. On subsequent calls with the same prefix, the model skips recomputing those tokens — saving compute and cost (often ~90% cheaper)." },
  { q: "A prompt has 10,000 tokens but the model's context window is 8,192. What happens?", opts: ["The model automatically summarizes the excess", "The request errors out or older tokens are truncated", "The model upgrades its context window automatically", "Nothing — context limits don't actually exist"], correct: 1, explanation: "Context windows are a hard limit. Exceeding them causes an error or the provider truncates older tokens, losing that context. This is why context management matters!" },
];

const COSTS = [
  { name: "Haiku 3.5", inputPer1M: 0.80, outputPer1M: 4,  color: "#34d399" },
  { name: "Sonnet 4",  inputPer1M: 3,     outputPer1M: 15, color: "#38bdf8" },
  { name: "Opus 4",    inputPer1M: 15,    outputPer1M: 75, color: "#818cf8" },
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
  const [qIdx, setQIdx] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

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

  const ctxUsed = systemToks + historyToks + userToks;
  const ctxPct = (v) => Math.min((v / CTX_MAX) * 100, 100);
  const overflowToks = Math.max(0, ctxUsed - CTX_MAX);
  const reservePct = Math.max(0, ctxPct(CTX_MAX - ctxUsed));

  function handleQuiz(idx) {
    if (chosen !== null) return;
    setChosen(idx);
    if (idx === QUIZ[qIdx].correct) setScore(s => s + 1);
  }

  function nextQ() {
    if (qIdx + 1 >= QUIZ.length) { setDone(true); return; }
    setQIdx(q => q + 1);
    setChosen(null);
  }

  const tech = TECHNIQUES[selectedTech];
  const pct = (n) => Math.min((n / Math.max(tech.beforeCount, 1)) * 100, 100);
  const barMax = COSTS[2].outputPer1M;

  return (
    <div className="tok-root">
      <style>{styleTag}</style>
      <NavBar />

      <div className="tok-hero">
        <div className="tok-eyebrow">Interactive Guide</div>
        <h1 className="tok-title">LLM <span>Token</span> Optimization</h1>
        <p className="tok-subtitle">Understand what tokens are, how they affect cost & speed, and learn practical techniques to optimize your prompts.</p>
      </div>

      <div className="tok-nav">
        {SECTIONS.map((s, i) => (
          <button key={i} className={`tok-nav-btn${section === i ? " active" : ""}`} onClick={() => setSection(i)}>{s}</button>
        ))}
      </div>

      {section === 0 && (
        <div className="tok-panel">
          <div className="tok-section-title">What Are Tokens?</div>
          <p className="tok-section-sub">Tokens are the fundamental unit LLMs use to read and write text. Type anything below to see it tokenized in real-time.</p>
          <div className="tok-card">
            <div className="tok-card-title">// Live Tokenizer</div>
            <textarea className="tok-input" value={inputText} onChange={e => setInputText(e.target.value)} placeholder="Type something to tokenize..." />
            <div className="tok-tokens-display">
              {tokens.filter(t => !t.isSpace || t.text.trim()).length === 0
                ? <span style={{ color: "#3a5a7a", fontSize: 12 }}>tokens appear here...</span>
                : tokens.map((t, i) => {
                    if (/^\s+$/.test(t.text)) return null;
                    const c = TOKEN_COLORS[i % TOKEN_COLORS.length];
                    return <span key={i} className="tok-token" style={{ background: c.bg, borderColor: c.border, color: c.color }}>{t.text}</span>;
                  })}
            </div>
            <div className="tok-stats-row">
              {[["Tokens", tokenCount], ["Characters", charCount], ["Chars/Token", tokenCount > 0 ? (charCount / tokenCount).toFixed(1) : "—"], ["Est. Input Cost*", `$${cost}`]].map(([lbl, val]) => (
                <div key={lbl} className="tok-stat"><div className="tok-stat-val">{val}</div><div className="tok-stat-lbl">{lbl}</div></div>
              ))}
            </div>
          </div>
          <div className="tok-card">
            <div className="tok-card-title">// Key Facts</div>
            <div style={{ display: "grid", gap: 12 }}>
              {[["~¾ word = 1 token", "In English, 1 token ≈ 0.75 words on average. 1,000 tokens ≈ 750 words."], ["Common words = 1 token", '"the", "cat", "run" are single tokens. Rare words split into subwords.'], ["Spaces are baked in", 'Most tokenizers attach leading spaces: " hello" is one token, not two.'], ["Non-English is denser", "Languages like Chinese or Arabic use more tokens per concept than English."]].map(([title, desc]) => (
                <div key={title} style={{ display: "flex", gap: 12 }}>
                  <div style={{ color: "#38bdf8", fontSize: 16, flexShrink: 0 }}>▸</div>
                  <div>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 700, color: "#e0e8f0", marginBottom: 3 }}>{title}</div>
                    <div style={{ fontSize: 12, color: "#7a9bbf", lineHeight: 1.6 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p style={{ fontSize: 10, color: "#3a5a7a" }}>* Uses Claude Sonnet input pricing ($3/M tokens). Tokenization is illustrative.</p>
        </div>
      )}

      {section === 1 && (
        <div className="tok-panel">
          <div className="tok-section-title">Cost & Speed</div>
          <p className="tok-section-sub">Every token costs money and latency. Understanding the economics helps you make smart trade-offs.</p>
          <div className="tok-card">
            <div className="tok-card-title">// Model Cost Comparison (per 1M tokens)</div>
            {COSTS.map(m => (
              <div key={m.name} style={{ marginBottom: 18 }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13, color: m.color, marginBottom: 8 }}>{m.name}</div>
                {[["Input", m.inputPer1M], ["Output", m.outputPer1M]].map(([label, price]) => (
                  <div key={label} className="cost-bar-wrap">
                    <div className="cost-bar-label"><span>{label}</span><span>${price}/M</span></div>
                    <div className="cost-bar-track">
                      <div className="cost-bar-fill" style={{ width: `${(price / barMax) * 100}%`, background: label === "Input" ? `${m.color}55` : `${m.color}88`, borderRight: `2px solid ${m.color}` }} />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="tok-card">
            <div className="tok-card-title">// Interactive Cost Calculator</div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#7a9bbf", marginBottom: 4 }}>
                <span>Tokens per request</span>
                <span style={{ color: "#38bdf8", fontFamily: "'Syne',sans-serif", fontWeight: 700 }}>{tokenSlider.toLocaleString()}</span>
              </div>
              <input type="range" className="tok-slider" min={100} max={100000} step={100} value={tokenSlider} onChange={e => setTokenSlider(+e.target.value)} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
              {[10, 1000, 100000].map(calls => (
                <div key={calls} className="tok-stat">
                  <div style={{ fontSize: 10, color: "#7a9bbf", marginBottom: 6 }}>{calls.toLocaleString()} calls</div>
                  {COSTS.map(m => (
                    <div key={m.name} style={{ fontSize: 12, color: m.color, margin: "3px 0" }}>
                      <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700 }}>${((tokenSlider / 1_000_000) * m.inputPer1M * calls).toFixed(calls >= 1000 ? 1 : 3)}</span>
                      <span style={{ fontSize: 10, color: "#3a5a7a", marginLeft: 4 }}>{m.name.split(" ")[0]}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14, padding: "10px 14px", background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)", borderRadius: 8, fontSize: 12, color: "#fbbf24" }}>
              ⚡ At scale, halving token usage = halving your bill.
            </div>
          </div>
        </div>
      )}

      {section === 2 && (
        <div className="tok-panel">
          <div className="tok-section-title">Optimization Techniques</div>
          <p className="tok-section-sub">Click a technique to see a before/after comparison with real token savings.</p>
          <div className="technique-grid">
            {TECHNIQUES.map((t, i) => (
              <div key={t.id} className={`technique-card${selectedTech === i ? " selected" : ""}`} style={{ "--accent": t.accent }} onClick={() => setSelectedTech(i)}>
                <div className="technique-icon">{t.icon}</div>
                <div className="technique-name">{t.name}</div>
                <div className="technique-desc">{t.desc}</div>
                <div className="technique-saving" style={{ background: `${t.accent}18`, borderColor: `${t.accent}40`, color: t.accent }}>{t.saving}</div>
              </div>
            ))}
          </div>
          <div className="tok-card">
            <div className="tok-card-title" style={{ color: tech.accent }}>// {tech.name} — Before vs After</div>
            <div className="ba-compare">
              {[{ label: "✗ BEFORE", text: tech.before, count: tech.beforeCount, barPct: 100, color: "#f87171", barBg: "rgba(239,68,68,0.4)", borderColor: "#ef444440" },
                { label: "✓ AFTER",  text: tech.after,  count: tech.afterCount,  barPct: pct(tech.afterCount), color: "#34d399", barBg: "rgba(52,211,153,0.5)", borderColor: "#34d39940" }].map(box => (
                <div key={box.label} className="ba-box" style={{ borderColor: box.borderColor }}>
                  <div className="ba-label" style={{ color: box.color }}>{box.label}</div>
                  <div className="ba-text">{box.text}</div>
                  <div className="ba-tok-count"><span style={{ color: box.color }}>{box.count.toLocaleString()}</span> tokens</div>
                  <div style={{ marginTop: 8, background: "#07101a", borderRadius: 6, height: 8, overflow: "hidden" }}>
                    <div style={{ width: `${box.barPct}%`, height: "100%", background: box.barBg, borderRadius: 6, transition: "width 0.5s" }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="savings-badge">🎉 Saved <strong style={{ margin: "0 4px" }}>{(tech.beforeCount - tech.afterCount).toLocaleString()}</strong> tokens ({Math.round((1 - tech.afterCount / tech.beforeCount) * 100)}% reduction)</div>
          </div>
        </div>
      )}

      {section === 3 && (
        <div className="tok-panel">
          <div className="tok-section-title">KV Cache & Prompt Caching</div>
          <p className="tok-section-sub">The KV cache stores attention computations so they don't have to be repeated on every request.</p>
          <div className="tok-card">
            <div className="tok-card-title">// Conversation KV Cache Animation</div>
            <div className="kv-legend">
              <div><span className="kv-dot" style={{ background: "rgba(56,189,248,0.4)", border: "1px solid #38bdf8" }} />Cached</div>
              <div><span className="kv-dot" style={{ background: "rgba(251,191,36,0.3)", border: "1px solid #fbbf24" }} />New tokens</div>
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
            <div style={{ fontSize: 12, color: "#7a9bbf", marginTop: 12 }}>
              Turn <strong style={{ color: "#38bdf8" }}>{Math.min(kvTurn + 1, KV_TURNS.length)}</strong> of {KV_TURNS.length} — only new tokens cost compute.
              {kvTurn >= KV_TURNS.length - 1 && (
                <button onClick={() => setKvTurn(0)} style={{ marginLeft: 12, background: "none", border: "1px solid #38bdf8", color: "#38bdf8", fontSize: 11, padding: "3px 10px", borderRadius: 4, cursor: "pointer" }}>Replay ↺</button>
              )}
            </div>
          </div>
          <div className="tok-card">
            <div className="tok-card-title">// Prompt Caching Cost Comparison</div>
            <div style={{ display: "grid", gap: 14 }}>
              {[{ label: "Without caching", detail: "Every API call re-computes the full system prompt (2,000 tokens × $3/M × 1,000 calls = $6.00)", color: "#ef4444", val: "$6.00" },
                { label: "With prompt caching", detail: "System prompt computed once, cached. 999 subsequent calls pay ~10% of normal price.", color: "#34d399", val: "$0.60" }].map(row => (
                <div key={row.label} style={{ display: "flex", gap: 14, padding: 12, background: "#07101a", borderRadius: 8, border: `1px solid ${row.color}30` }}>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 22, color: row.color, minWidth: 60 }}>{row.val}</div>
                  <div>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13, color: row.color, marginBottom: 4 }}>{row.label}</div>
                    <div style={{ fontSize: 11, color: "#7a9bbf", lineHeight: 1.6 }}>{row.detail}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14, fontSize: 12, color: "#34d399", background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: 8, padding: "10px 14px" }}>
              💡 Always put your static system prompt and documents FIRST in the message.
            </div>
          </div>
        </div>
      )}

      {section === 4 && (
        <div className="tok-panel">
          <div className="tok-section-title">Context Window Management</div>
          <p className="tok-section-sub">The context window is the total tokens the model can see at once. Drag the sliders to explore.</p>
          <div className="tok-card">
            <div className="tok-card-title">// Context Window Visualizer (Max: 8,192 tokens)</div>
            {[{ label: "System Prompt", val: systemToks, set: setSystemToks, max: 3000, color: "#8b5cf6" },
              { label: "Conversation History", val: historyToks, set: setHistoryToks, max: 6000, color: "#38bdf8" },
              { label: "User Input", val: userToks, set: setUserToks, max: 2000, color: "#fbbf24" }].map(s => (
              <div key={s.label} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#7a9bbf", marginBottom: 4 }}>
                  <span style={{ color: s.color }}>{s.label}</span><span>{s.val.toLocaleString()} tokens</span>
                </div>
                <input type="range" className="tok-slider" min={0} max={s.max} step={50} value={s.val} onChange={e => s.set(+e.target.value)} style={{ accentColor: s.color }} />
              </div>
            ))}
            <div className="ctx-bar">
              <div className="ctx-segment ctx-system"  style={{ width: `${ctxPct(Math.min(systemToks, CTX_MAX))}%` }}>System</div>
              <div className="ctx-segment ctx-history" style={{ width: `${ctxPct(Math.min(historyToks, Math.max(0, CTX_MAX - systemToks)))}%` }}>History</div>
              <div className="ctx-segment ctx-user"    style={{ width: `${ctxPct(Math.min(userToks, Math.max(0, CTX_MAX - systemToks - historyToks)))}%` }}>User</div>
              {overflowToks === 0 && <div className="ctx-segment ctx-reserve" style={{ width: `${reservePct}%` }}>Reserve</div>}
              {overflowToks > 0  && <div className="ctx-segment ctx-overflow" style={{ width: "8%" }}>⚠ Over</div>}
            </div>
            <div className="info-row">
              <div className="info-chip" style={{ borderColor: "#38bdf840", color: "#7dd3fc" }}>Used: {Math.min(ctxUsed, CTX_MAX).toLocaleString()} / {CTX_MAX.toLocaleString()}</div>
              {overflowToks > 0
                ? <div className="info-chip" style={{ borderColor: "#ef444450", color: "#fca5a5" }}>⚠ Overflow: {overflowToks.toLocaleString()} tokens lost</div>
                : <div className="info-chip" style={{ borderColor: "#34d39940", color: "#6ee7b7" }}>✓ Reserve: {(CTX_MAX - ctxUsed).toLocaleString()} tokens</div>}
            </div>
            {overflowToks > 0 && (
              <div style={{ marginTop: 14, fontSize: 12, color: "#fca5a5", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 8, padding: "10px 14px" }}>
                ⚠ {overflowToks.toLocaleString()} tokens will be truncated — the model will lose that context.
              </div>
            )}
          </div>
        </div>
      )}

      {section === 5 && (
        <div className="tok-panel">
          <div className="tok-section-title">Quick Quiz</div>
          <p className="tok-section-sub">Test what you've learned about token optimization.</p>
          {!done ? (
            <div className="tok-card">
              <div className="progress-bar"><div className="progress-fill" style={{ width: `${(qIdx / QUIZ.length) * 100}%` }} /></div>
              <div style={{ fontSize: 11, color: "#7a9bbf", marginBottom: 16 }}>QUESTION {qIdx + 1} / {QUIZ.length}</div>
              <div className="quiz-q">{QUIZ[qIdx].q}</div>
              <div className="quiz-opts">
                {QUIZ[qIdx].opts.map((opt, i) => (
                  <button key={i} disabled={chosen !== null}
                    className={`quiz-opt${chosen !== null && i === QUIZ[qIdx].correct ? " correct" : ""}${chosen === i && i !== QUIZ[qIdx].correct ? " wrong" : ""}`}
                    onClick={() => handleQuiz(i)}>
                    {["A","B","C","D"][i]}. {opt}
                  </button>
                ))}
              </div>
              {chosen !== null && (
                <>
                  <div className="quiz-explanation">{QUIZ[qIdx].explanation}</div>
                  <button className="quiz-next" onClick={nextQ}>{qIdx + 1 < QUIZ.length ? "Next Question →" : "See Results →"}</button>
                </>
              )}
            </div>
          ) : (
            <div className="tok-card">
              <div className="score-display">
                <div style={{ fontSize: 12, color: "#7a9bbf", marginBottom: 12 }}>FINAL SCORE</div>
                <div className="score-num">{score}/{QUIZ.length}</div>
                <div className="score-sub">{score === QUIZ.length ? "Perfect! You're a token expert. 🎉" : score >= QUIZ.length / 2 ? "Good work! Review the tricky sections. 📚" : "Keep exploring to build your knowledge. 💪"}</div>
                <button className="quiz-next" style={{ marginTop: 24 }} onClick={() => { setQIdx(0); setChosen(null); setScore(0); setDone(false); }}>Retake Quiz ↺</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
