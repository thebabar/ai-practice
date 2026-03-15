import { useState, useEffect, useRef } from 'react'
import NavBar from '../components/NavBar.jsx'

const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@600;700;800&display=swap');

.ag-root { min-height: 100vh; background: #050810; color: #e0e8f0; font-family: 'DM Mono', monospace; overflow-x: hidden; }

.ag-hero { text-align: center; padding: 48px 24px 28px; position: relative; }
.ag-hero::before { content: ''; position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 700px; height: 320px; background: radial-gradient(ellipse at 50% 0%, rgba(52,211,153,0.1) 0%, transparent 70%); pointer-events: none; }
.ag-eyebrow { font-size: 11px; letter-spacing: 0.22em; color: #34d399; text-transform: uppercase; margin-bottom: 14px; }
.ag-title { font-family: 'Syne', sans-serif; font-size: clamp(28px, 5vw, 52px); font-weight: 800; letter-spacing: -0.02em; color: #fff; line-height: 1.05; margin-bottom: 12px; }
.ag-title span { color: #34d399; }
.ag-subtitle { font-size: 13px; color: #6a8a7a; max-width: 520px; margin: 0 auto 32px; line-height: 1.8; }

.ag-tabs { display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; padding: 0 16px 32px; }
.ag-tab { background: transparent; border: 1px solid #1a2e22; color: #6a8a7a; font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.1em; padding: 8px 16px; border-radius: 6px; cursor: pointer; transition: all 0.18s; text-transform: uppercase; }
.ag-tab:hover { border-color: #34d399; color: #34d399; }
.ag-tab.active { background: rgba(52,211,153,0.1); border-color: #34d399; color: #34d399; }

.ag-panel { max-width: 920px; margin: 0 auto; padding: 0 20px 80px; }
.ag-section-title { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 700; color: #fff; margin-bottom: 8px; }
.ag-section-sub { font-size: 12px; color: #6a8a7a; margin-bottom: 28px; line-height: 1.8; }

.ag-card { background: #080f14; border: 1px solid #0f2018; border-radius: 14px; padding: 24px; margin-bottom: 20px; }
.ag-card-title { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; color: #34d399; margin-bottom: 16px; }

/* ── Agent Loop ── */
.loop-container { position: relative; display: flex; flex-direction: column; align-items: center; gap: 0; }

.loop-node { width: 100%; max-width: 520px; border-radius: 10px; padding: 16px 20px; border: 1px solid; display: flex; align-items: center; gap: 14px; transition: all 0.4s; position: relative; z-index: 2; }
.loop-node.active { box-shadow: 0 0 30px var(--node-glow); transform: scale(1.02); }
.loop-node.done { opacity: 0.5; }

.loop-connector { width: 2px; height: 32px; margin: 0 auto; position: relative; z-index: 1; }
.loop-connector::after { content: '▼'; position: absolute; bottom: -8px; left: 50%; transform: translateX(-50%); font-size: 10px; }

.node-icon { font-size: 22px; flex-shrink: 0; width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; background: var(--node-icon-bg); }
.node-content { flex: 1; }
.node-label { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; color: #fff; margin-bottom: 4px; }
.node-desc { font-size: 11px; color: #6a8a7a; line-height: 1.6; }
.node-output { margin-top: 8px; font-size: 11px; color: var(--node-color); background: var(--node-icon-bg); border: 1px solid var(--node-border); border-radius: 6px; padding: 6px 10px; font-style: italic; line-height: 1.5; }

.loop-badge { position: absolute; right: -12px; top: 50%; transform: translateY(-50%); background: #080f14; border: 1px solid #1a2e22; border-radius: 100px; font-size: 9px; color: #34d399; padding: 3px 8px; letter-spacing: 0.1em; white-space: nowrap; }

.loop-controls { display: flex; gap: 10px; justify-content: center; margin-top: 20px; flex-wrap: wrap; }
.loop-btn { background: rgba(52,211,153,0.1); border: 1px solid #34d399; color: #34d399; font-family: 'DM Mono', monospace; font-size: 11px; padding: 8px 18px; border-radius: 6px; cursor: pointer; letter-spacing: 0.08em; text-transform: uppercase; transition: all 0.18s; }
.loop-btn:hover { background: rgba(52,211,153,0.2); }
.loop-btn.secondary { background: transparent; border-color: #1a2e22; color: #6a8a7a; }
.loop-btn.secondary:hover { border-color: #34d399; color: #34d399; }

/* ── Tools Grid ── */
.tools-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; margin-bottom: 20px; }

.tool-card { background: #06100d; border: 1px solid #0f2018; border-radius: 10px; padding: 16px; cursor: pointer; transition: all 0.2s; position: relative; overflow: hidden; }
.tool-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, var(--t-accent), transparent); opacity: 0; transition: opacity 0.2s; }
.tool-card:hover, .tool-card.selected { border-color: var(--t-accent); }
.tool-card:hover::before, .tool-card.selected::before { opacity: 1; }
.tool-card.calling { animation: tool-pulse 0.6s ease-in-out; }

@keyframes tool-pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.04); box-shadow: 0 0 20px var(--t-accent-glow); }
  100% { transform: scale(1); }
}

.tool-icon { font-size: 20px; margin-bottom: 10px; }
.tool-name { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; color: #e0e8f0; margin-bottom: 4px; }
.tool-sig { font-size: 10px; color: var(--t-accent); margin-bottom: 6px; font-style: italic; }
.tool-desc { font-size: 11px; color: #4a6a5a; line-height: 1.6; }

.tool-call-sim { background: #020809; border: 1px solid #0f2018; border-radius: 10px; padding: 18px; font-family: 'DM Mono', monospace; font-size: 12px; line-height: 1.9; }
.tc-line { display: flex; gap: 10px; align-items: flex-start; margin-bottom: 4px; opacity: 0; transform: translateY(4px); transition: all 0.3s; }
.tc-line.visible { opacity: 1; transform: translateY(0); }
.tc-role { font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; padding: 2px 8px; border-radius: 4px; flex-shrink: 0; margin-top: 2px; }
.tc-role.llm    { background: rgba(52,211,153,0.12); color: #34d399; border: 1px solid rgba(52,211,153,0.25); }
.tc-role.tool   { background: rgba(251,191,36,0.1);  color: #fbbf24; border: 1px solid rgba(251,191,36,0.25); }
.tc-role.system { background: rgba(129,140,248,0.1); color: #818cf8; border: 1px solid rgba(129,140,248,0.25); }
.tc-role.result { background: rgba(249,115,22,0.1);  color: #f97316; border: 1px solid rgba(249,115,22,0.25); }
.tc-text { color: #b0c8b8; flex: 1; }
.tc-text .hl { color: #34d399; }
.tc-text .hl-y { color: #fbbf24; }
.tc-text .hl-p { color: #818cf8; }
.tc-text .hl-o { color: #f97316; }

/* ── ReAct ── */
.react-timeline { display: flex; flex-direction: column; gap: 0; }
.react-step { display: flex; gap: 16px; position: relative; }
.react-step::before { content: ''; position: absolute; left: 19px; top: 44px; bottom: -16px; width: 2px; background: linear-gradient(#0f2018, transparent); }
.react-step:last-child::before { display: none; }

.react-dot { width: 40px; height: 40px; border-radius: 50%; border: 2px solid; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; margin-top: 2px; }
.react-body { flex: 1; padding-bottom: 24px; }
.react-type { font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 6px; font-weight: 500; }
.react-content { background: #06100d; border: 1px solid #0f2018; border-radius: 8px; padding: 12px 16px; font-size: 12px; color: #9abaa8; line-height: 1.7; }
.react-content strong { color: #e0e8f0; }

/* ── Context Engineering ── */
.ctx-layers { display: flex; flex-direction: column; gap: 10px; }
.ctx-layer { border-radius: 10px; padding: 16px 20px; border: 1px solid; cursor: pointer; transition: all 0.2s; }
.ctx-layer:hover { transform: translateX(4px); }
.ctx-layer-header { display: flex; align-items: center; gap: 12px; margin-bottom: 0; }
.ctx-layer.expanded .ctx-layer-header { margin-bottom: 12px; }
.ctx-layer-icon { font-size: 18px; flex-shrink: 0; }
.ctx-layer-name { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; flex: 1; }
.ctx-layer-tokens { font-size: 10px; letter-spacing: 0.08em; padding: 3px 8px; border-radius: 100px; border: 1px solid; }
.ctx-layer-chevron { font-size: 12px; transition: transform 0.2s; color: #4a6a5a; }
.ctx-layer.expanded .ctx-layer-chevron { transform: rotate(90deg); }
.ctx-layer-body { font-size: 12px; color: #6a8a7a; line-height: 1.8; border-top: 1px solid; padding-top: 12px; }
.ctx-layer-body code { background: rgba(52,211,153,0.08); color: #34d399; padding: 1px 5px; border-radius: 3px; font-size: 11px; }
.ctx-tip { font-size: 11px; margin-top: 8px; padding: 8px 12px; background: rgba(52,211,153,0.05); border-left: 2px solid #34d399; border-radius: 0 6px 6px 0; color: #5a8a6a; line-height: 1.6; }

/* ── Multi-Agent ── */
.ma-diagram { position: relative; display: grid; grid-template-columns: 1fr auto 1fr; gap: 0; align-items: start; }
.ma-agents { display: flex; flex-direction: column; gap: 10px; }
.ma-agent { background: #06100d; border: 1px solid; border-radius: 10px; padding: 14px 16px; transition: all 0.3s; }
.ma-agent.active { box-shadow: 0 0 20px var(--a-glow); transform: scale(1.02); }
.ma-agent-name { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; margin-bottom: 4px; }
.ma-agent-role { font-size: 10px; color: #4a6a5a; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 8px; }
.ma-agent-tools { display: flex; flex-wrap: wrap; gap: 4px; }
.ma-tool-tag { font-size: 9px; padding: 2px 6px; border-radius: 3px; border: 1px solid; letter-spacing: 0.06em; }

.ma-center { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 0 20px; gap: 8px; }
.ma-orchestrator { background: rgba(52,211,153,0.08); border: 2px solid #34d399; border-radius: 14px; padding: 20px 16px; text-align: center; width: 130px; }
.ma-orch-icon { font-size: 28px; margin-bottom: 8px; }
.ma-orch-name { font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 700; color: #34d399; }
.ma-orch-sub { font-size: 10px; color: #4a6a5a; margin-top: 4px; }
.ma-arrow { font-size: 18px; color: #1a3a28; }

.ma-msg { background: #020809; border: 1px solid #0f2018; border-radius: 8px; padding: 10px 14px; font-size: 11px; color: #6a8a7a; line-height: 1.6; margin-top: 14px; min-height: 60px; transition: all 0.3s; }
.ma-msg strong { color: #34d399; }

@media (max-width: 600px) {
  .ma-diagram { grid-template-columns: 1fr; }
  .ma-center { flex-direction: row; padding: 10px 0; }
}

/* ── Quiz ── */
.ag-quiz-q { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 16px; line-height: 1.4; }
.ag-quiz-opts { display: flex; flex-direction: column; gap: 8px; }
.ag-quiz-opt { background: #06100d; border: 1px solid #0f2018; border-radius: 8px; padding: 12px 16px; font-size: 12px; color: #9abaa8; cursor: pointer; text-align: left; font-family: 'DM Mono', monospace; transition: all 0.18s; }
.ag-quiz-opt:hover:not(:disabled) { border-color: #34d399; color: #e0e8f0; }
.ag-quiz-opt.correct { border-color: #34d399; background: rgba(52,211,153,0.08); color: #34d399; }
.ag-quiz-opt.wrong   { border-color: #ef4444; background: rgba(239,68,68,0.06); color: #f87171; }
.ag-quiz-exp { margin-top: 14px; padding: 12px; background: rgba(52,211,153,0.05); border: 1px solid rgba(52,211,153,0.18); border-radius: 8px; font-size: 12px; color: #7ab898; line-height: 1.7; }
.ag-quiz-next { margin-top: 12px; background: rgba(52,211,153,0.1); border: 1px solid #34d399; color: #34d399; font-family: 'DM Mono', monospace; font-size: 11px; padding: 9px 18px; border-radius: 6px; cursor: pointer; letter-spacing: 0.08em; text-transform: uppercase; transition: all 0.18s; }
.ag-quiz-next:hover { background: rgba(52,211,153,0.2); }
.ag-progress { background: #0a1810; border-radius: 100px; height: 4px; margin-bottom: 20px; overflow: hidden; }
.ag-progress-fill { height: 100%; background: linear-gradient(90deg, #34d399, #38bdf8); border-radius: 100px; transition: width 0.4s; }
.ag-score-num { font-family: 'Syne', sans-serif; font-size: 64px; font-weight: 800; color: #34d399; text-align: center; }
`

// ── AGENT LOOP STEPS ──────────────────────────────────────────────────────────
const LOOP_STEPS = [
  {
    id: 'perceive', icon: '👁️', label: 'Perceive', color: '#38bdf8', border: '#1a3a5a', bg: '#060e18', iconBg: 'rgba(56,189,248,0.1)', glow: 'rgba(56,189,248,0.15)',
    desc: 'The agent receives its context window — system prompt, memory, tool definitions, and the current user message.',
    output: '"Research the latest AI papers and summarize the top 3 findings."',
  },
  {
    id: 'think', icon: '💭', label: 'Think (Reason)', color: '#818cf8', border: '#1e1a5a', bg: '#08071a', iconBg: 'rgba(129,140,248,0.1)', glow: 'rgba(129,140,248,0.15)',
    desc: 'The LLM reasons about the task. In ReAct-style agents, this step produces a "Thought:" explaining the plan before acting.',
    output: 'Thought: I should search for recent AI papers, then read the top results, then summarize.',
  },
  {
    id: 'act', icon: '🔧', label: 'Act (Tool Call)', color: '#fbbf24', border: '#3a2a00', bg: '#100c00', iconBg: 'rgba(251,191,36,0.08)', glow: 'rgba(251,191,36,0.15)',
    desc: 'The agent calls a tool — web search, code execution, database lookup, API call — and waits for the result.',
    output: 'tool_call: web_search({ query: "top AI papers 2025" })',
  },
  {
    id: 'observe', icon: '📥', label: 'Observe (Tool Result)', color: '#f97316', border: '#3a1800', bg: '#0e0700', iconBg: 'rgba(249,115,22,0.08)', glow: 'rgba(249,115,22,0.15)',
    desc: 'The tool result is injected back into the context window as a new message. The agent now "sees" the result.',
    output: 'tool_result: ["Attention Is All You Need", "Gemini 1.5", "DeepSeek R1", ...]',
  },
  {
    id: 'respond', icon: '✅', label: 'Respond or Loop', color: '#34d399', border: '#0a2e1a', bg: '#030e08', iconBg: 'rgba(52,211,153,0.08)', glow: 'rgba(52,211,153,0.15)',
    desc: 'If the task is done, the agent returns its final answer. Otherwise, it loops back to Think — calling more tools as needed.',
    output: 'Final: "Top 3 findings: (1) Long-context models... (2) Reasoning via RL... (3)..."',
  },
]

// ── TOOLS ─────────────────────────────────────────────────────────────────────
const TOOLS = [
  { id: 'search', icon: '🔍', name: 'web_search', sig: 'search(query: string)', desc: 'Retrieve real-time web results. Essential for grounding agents in current facts.', accent: '#38bdf8', glow: 'rgba(56,189,248,0.2)' },
  { id: 'code', icon: '💻', name: 'code_exec', sig: 'run_python(code: string)', desc: 'Execute code in a sandbox. Enables calculations, data analysis, and file creation.', accent: '#818cf8', glow: 'rgba(129,140,248,0.2)' },
  { id: 'memory', icon: '🧠', name: 'memory_recall', sig: 'recall(query: string)', desc: 'Retrieve relevant memories from past interactions stored in a vector database.', accent: '#34d399', glow: 'rgba(52,211,153,0.2)' },
  { id: 'browser', icon: '🌐', name: 'browse_url', sig: 'fetch(url: string)', desc: 'Fetch and parse the full content of a webpage for deeper research.', accent: '#fbbf24', glow: 'rgba(251,191,36,0.2)' },
  { id: 'files', icon: '📁', name: 'file_write', sig: 'write(path, content)', desc: 'Create, read, or edit files. Enables agents to produce persistent artifacts.', accent: '#f97316', glow: 'rgba(249,115,22,0.2)' },
  { id: 'api', icon: '🔌', name: 'api_call', sig: 'call(endpoint, params)', desc: 'Call any external API — Slack, GitHub, databases, payment systems, and more.', accent: '#ec4899', glow: 'rgba(236,72,153,0.2)' },
]

const TOOL_CALL_DEMO = [
  { role: 'system', text: <span>You are a research assistant. Available tools: <span className="hl">web_search</span>, <span className="hl">browse_url</span></span>, delay: 0 },
  { role: 'llm', text: <span><span className="hl-p">Thought:</span> I need to find the latest Claude release. I'll search first.</span>, delay: 400 },
  { role: 'tool', text: <span>web_search(<span className="hl-y">"Claude latest model 2025"</span>)</span>, delay: 900 },
  { role: 'result', text: <span>→ ["Claude Sonnet 4", "Claude Opus 4", "claude.ai/news..."]</span>, delay: 1500 },
  { role: 'llm', text: <span><span className="hl-p">Thought:</span> I should read the news page for details.</span>, delay: 2000 },
  { role: 'tool', text: <span>browse_url(<span className="hl-y">"claude.ai/news"</span>)</span>, delay: 2500 },
  { role: 'result', text: <span>→ "Claude Sonnet 4 features improved reasoning, 200K context..."</span>, delay: 3200 },
  { role: 'llm', text: <span><span className="hl">Final answer:</span> The latest Claude model is Sonnet 4 with improved reasoning and 200K context window.</span>, delay: 4000 },
]

// ── ReAct STEPS ───────────────────────────────────────────────────────────────
const REACT_STEPS = [
  { type: 'Thought', color: '#818cf8', dotBg: 'rgba(129,140,248,0.15)', dotBorder: '#818cf8', icon: '💭', content: <span>I need to book a flight from NYC to London next Friday. Let me first check what dates are available.</span> },
  { type: 'Action', color: '#fbbf24', dotBg: 'rgba(251,191,36,0.1)', dotBorder: '#fbbf24', icon: '🔧', content: <span><strong>search_flights</strong>({`{ from: "NYC", to: "LHR", date: "2025-12-05" }`})</span> },
  { type: 'Observation', color: '#f97316', dotBg: 'rgba(249,115,22,0.1)', dotBorder: '#f97316', icon: '📥', content: <span>Found 3 flights: BA178 (08:30, $620), AA100 (11:15, $580), VS4 (22:00, $540). All have seats available.</span> },
  { type: 'Thought', color: '#818cf8', dotBg: 'rgba(129,140,248,0.15)', dotBorder: '#818cf8', icon: '💭', content: <span>VS4 is cheapest. The user didn't specify a budget, but I should confirm before booking. Let me check their preferences first.</span> },
  { type: 'Action', color: '#fbbf24', dotBg: 'rgba(251,191,36,0.1)', dotBorder: '#fbbf24', icon: '🔧', content: <span><strong>memory_recall</strong>({`{ query: "user flight preferences budget" }`})</span> },
  { type: 'Observation', color: '#f97316', dotBg: 'rgba(249,115,22,0.1)', dotBorder: '#f97316', icon: '📥', content: <span>Memory: User previously selected business class, prefers morning departures, budget under $800.</span> },
  { type: 'Thought', color: '#818cf8', dotBg: 'rgba(129,140,248,0.15)', dotBorder: '#818cf8', icon: '💭', content: <span>BA178 morning flight fits preferences. Let me check business class availability and price.</span> },
  { type: 'Final Answer', color: '#34d399', dotBg: 'rgba(52,211,153,0.1)', dotBorder: '#34d399', icon: '✅', content: <span><strong>Recommended:</strong> BA178 (08:30 Fri Dec 5). Business class available at $1,840 — within typical range. Shall I book?</span> },
]

// ── CONTEXT LAYERS ────────────────────────────────────────────────────────────
const CTX_LAYERS = [
  {
    icon: '⚙️', name: 'System Prompt', tokens: '~800 tok', color: '#818cf8', border: 'rgba(129,140,248,0.3)', bg: 'rgba(129,140,248,0.05)', tokenBg: 'rgba(129,140,248,0.1)', tokenBorder: 'rgba(129,140,248,0.3)',
    body: `The foundation of every agent. Defines the agent's persona, capabilities, constraints, and available tools.\n\nBest practices: Be concise but complete. Define what the agent CAN and CANNOT do. List all tools with clear descriptions.\n\nExample structure:`,
    code: `You are a research assistant.\nTools: web_search, browse_url, code_exec\nRules: Always cite sources. Never make up facts.`,
    tip: '💡 The system prompt is the most important piece of context. Vague system prompts = unpredictable agents.',
  },
  {
    icon: '🗂️', name: 'Tool Definitions', tokens: '~400 tok', color: '#38bdf8', border: 'rgba(56,189,248,0.3)', bg: 'rgba(56,189,248,0.05)', tokenBg: 'rgba(56,189,248,0.1)', tokenBorder: 'rgba(56,189,248,0.3)',
    body: `JSON schemas describing each tool — its name, description, and parameters. The model reads these to know when and how to call tools.\n\nCritical: The tool description IS the prompt. Vague descriptions = wrong tool usage.`,
    code: `{\n  "name": "web_search",\n  "description": "Search the web for current info. Use for facts, news, prices.",\n  "parameters": { "query": { "type": "string" } }\n}`,
    tip: '💡 Spend more time writing tool descriptions than you think you need. They\'re the most leveraged text in your agent.',
  },
  {
    icon: '🧠', name: 'Memory / RAG', tokens: '~1,200 tok', color: '#34d399', border: 'rgba(52,211,153,0.3)', bg: 'rgba(52,211,153,0.04)', tokenBg: 'rgba(52,211,153,0.08)', tokenBorder: 'rgba(52,211,153,0.25)',
    body: `Retrieved context from a vector database — past conversations, documents, user preferences, or domain knowledge. Injected selectively based on relevance to the current task.\n\nTypes: Episodic (past interactions), Semantic (knowledge base), Procedural (how-to guides).`,
    code: `# Retrieved from vector DB (similarity > 0.85):\n[User prefs]: Prefers concise answers, UK English\n[Past task]: Built React app on 2024-11-10`,
    tip: '💡 Only retrieve what\'s relevant. Injecting too much memory dilutes attention and wastes tokens.',
  },
  {
    icon: '📜', name: 'Conversation History', tokens: '~2,000 tok', color: '#fbbf24', border: 'rgba(251,191,36,0.3)', bg: 'rgba(251,191,36,0.04)', tokenBg: 'rgba(251,191,36,0.08)', tokenBorder: 'rgba(251,191,36,0.25)',
    body: `All prior turns in the session: user messages, agent responses, tool calls, and tool results. Grows with every exchange.\n\nChallenge: Unbounded history eventually overflows the context window. Strategies: sliding window, summarization, or hybrid.`,
    code: `user: "Research AI papers"\nassistant: [tool_call: web_search...]\ntool_result: [...results...]\nassistant: "Here are the top 3..."`,
    tip: '💡 Summarize old conversation turns rather than truncating them — you preserve meaning while freeing up tokens.',
  },
  {
    icon: '💬', name: 'Current User Message', tokens: '~150 tok', color: '#f97316', border: 'rgba(249,115,22,0.3)', bg: 'rgba(249,115,22,0.04)', tokenBg: 'rgba(249,115,22,0.08)', tokenBorder: 'rgba(249,115,22,0.25)',
    body: `The immediate input from the user or the task orchestrator. Clear, specific inputs lead to better agent behavior.\n\nContext engineering tip: Inject task-specific context here dynamically rather than bloating the system prompt.`,
    code: `"Summarize the 3 most-cited AI papers\nfrom the last 6 months. Focus on\npractical applications."`,
    tip: '💡 The clearer the user message, the less the agent has to "infer" — reducing hallucination risk.',
  },
]

// ── MULTI-AGENT ────────────────────────────────────────────────────────────────
const MA_LEFT = [
  { name: 'Researcher', role: 'Sub-agent', color: '#38bdf8', border: 'rgba(56,189,248,0.3)', glow: 'rgba(56,189,248,0.15)', tools: ['web_search', 'browse_url'] },
  { name: 'Coder', role: 'Sub-agent', color: '#818cf8', border: 'rgba(129,140,248,0.3)', glow: 'rgba(129,140,248,0.15)', tools: ['code_exec', 'file_write'] },
]
const MA_RIGHT = [
  { name: 'Writer', role: 'Sub-agent', color: '#fbbf24', border: 'rgba(251,191,36,0.3)', glow: 'rgba(251,191,36,0.15)', tools: ['file_write', 'memory'] },
  { name: 'Reviewer', role: 'Sub-agent', color: '#f97316', border: 'rgba(249,115,22,0.3)', glow: 'rgba(249,115,22,0.15)', tools: ['quality_check', 'api_call'] },
]
const MA_MESSAGES = [
  '← Orchestrator assigns tasks to specialized sub-agents based on their capabilities',
  '→ Researcher returns findings: "Found 5 relevant papers with key results..."',
  '→ Coder returns: "Script written. Ran analysis. Results: accuracy 94.2%"',
  '→ Writer returns: "Report draft complete. 1,200 words with citations."',
  '← Reviewer checks quality, Orchestrator assembles final output for user',
]

// ── QUIZ ──────────────────────────────────────────────────────────────────────
const QUIZ = [
  {
    q: 'What is the "agent loop" in agentic AI?',
    opts: ['A single LLM API call that returns a long answer', 'A cycle of Perceive → Think → Act → Observe repeated until task is done', 'A loop that retries failed API calls automatically', 'The process of fine-tuning a model on agent data'],
    correct: 1, explanation: 'The agent loop is the core pattern: the agent perceives its context, reasons about what to do, calls a tool (act), observes the result, then loops — calling more tools as needed — until the task is complete.',
  },
  {
    q: 'In a tool definition, what is the MOST important thing to get right?',
    opts: ['The exact function name in camelCase', 'The tool\'s description — it tells the model when and how to use it', 'The number of parameters', 'The return type of the tool'],
    correct: 1, explanation: 'The tool description is effectively a prompt instruction. Vague descriptions cause the model to misuse or skip tools. Investing time in clear descriptions is the highest-leverage work in agent engineering.',
  },
  {
    q: 'What does "RAG" stand for and why is it used in agents?',
    opts: ['Real-time Agent Generation — to make agents faster', 'Retrieval-Augmented Generation — to inject relevant external knowledge into context', 'Recursive Agent Graph — to coordinate multi-agent pipelines', 'Rule-based Action Gating — to control which tools agents can use'],
    correct: 1, explanation: 'RAG (Retrieval-Augmented Generation) retrieves relevant documents from a vector database and injects them into the context window. This lets agents access large knowledge bases without fitting everything into the context at once.',
  },
  {
    q: 'What is "context engineering" in the context of AI agents?',
    opts: ['Writing system prompts only', 'Compressing token usage in tool outputs', 'Deliberately designing what information goes into the context window at each step', 'Engineering the agent\'s reward function for RL training'],
    correct: 2, explanation: 'Context engineering is the practice of deliberately deciding what information the agent can "see" at any moment — system prompt, memory, tool definitions, conversation history, and current input. It\'s the highest-leverage skill in building reliable agents.',
  },
]

// ══════════════════════════════════════════════════════════════════════════════
export default function AgentsTools() {
  const [tab, setTab] = useState(0)
  const TABS = ['Agent Loop', 'Tool Calling', 'ReAct Pattern', 'Context Layers', 'Multi-Agent', 'Quiz']

  // loop
  const [loopStep, setLoopStep] = useState(0)
  const [loopRunning, setLoopRunning] = useState(false)
  const loopRef = useRef(null)

  // tool call demo
  const [selectedTool, setSelectedTool] = useState(0)
  const [demoLines, setDemoLines] = useState([])
  const [demoRunning, setDemoRunning] = useState(false)
  const [callingTool, setCallingTool] = useState(null)

  // context
  const [expandedCtx, setExpandedCtx] = useState(null)

  // multi-agent
  const [maStep, setMaStep] = useState(0)
  const [maActive, setMaActive] = useState(null)
  const maRef = useRef(null)

  // quiz
  const [qIdx, setQIdx] = useState(0)
  const [chosen, setChosen] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  // Loop auto-advance
  useEffect(() => {
    if (loopRunning) {
      loopRef.current = setTimeout(() => {
        setLoopStep(s => {
          if (s >= LOOP_STEPS.length - 1) { setLoopRunning(false); return s }
          return s + 1
        })
      }, 1800)
    }
    return () => clearTimeout(loopRef.current)
  }, [loopRunning, loopStep])

  // Tool call demo lines
  useEffect(() => {
    if (!demoRunning) return
    setDemoLines([])
    setCallingTool(null)
    TOOL_CALL_DEMO.forEach((line, i) => {
      setTimeout(() => {
        setDemoLines(prev => [...prev, i])
        if (line.role === 'tool') setCallingTool(i)
        if (line.role === 'result') setCallingTool(null)
      }, line.delay)
    })
    setTimeout(() => setDemoRunning(false), 4500)
  }, [demoRunning])

  // Multi-agent auto
  useEffect(() => {
    if (tab === 4) {
      maRef.current = setInterval(() => {
        setMaStep(s => (s + 1) % MA_MESSAGES.length)
      }, 2200)
    }
    return () => clearInterval(maRef.current)
  }, [tab])

  useEffect(() => {
    const agents = [MA_LEFT[0], MA_LEFT[1], null, MA_RIGHT[0], MA_RIGHT[1]]
    setMaActive(agents[maStep % agents.length])
  }, [maStep])

  function handleQuiz(idx) {
    if (chosen !== null) return
    setChosen(idx)
    if (idx === QUIZ[qIdx].correct) setScore(s => s + 1)
  }
  function nextQ() {
    if (qIdx + 1 >= QUIZ.length) { setDone(true); return }
    setQIdx(q => q + 1); setChosen(null)
  }

  return (
    <div className="ag-root">
      <style>{css}</style>
      <NavBar />

      <div className="ag-hero">
        <div className="ag-eyebrow">Interactive Guide</div>
        <h1 className="ag-title">Agents, Tools &<br /><span>Context Engineering</span></h1>
        <p className="ag-subtitle">How AI agents loop, call tools, and how context engineering determines everything they can perceive, reason about, and do.</p>
      </div>

      <div className="ag-tabs">
        {TABS.map((t, i) => (
          <button key={i} className={`ag-tab${tab === i ? ' active' : ''}`} onClick={() => setTab(i)}>{t}</button>
        ))}
      </div>

      {/* ── Tab 0: Agent Loop ── */}
      {tab === 0 && (
        <div className="ag-panel">
          <div className="ag-section-title">The Agent Loop</div>
          <p className="ag-section-sub">Unlike a single LLM call, agents operate in a loop — perceiving context, reasoning, calling tools, observing results, and repeating until the task is done. Watch it run step by step.</p>

          <div className="ag-card">
            <div className="ag-card-title">// Agent Execution Loop</div>
            <div className="loop-container">
              {LOOP_STEPS.map((step, i) => (
                <div key={step.id}>
                  <div className={`loop-node${loopStep === i ? ' active' : ''}${loopStep > i ? ' done' : ''}`}
                    style={{ background: step.bg, borderColor: loopStep === i ? step.color : step.border, '--node-glow': step.glow, '--node-color': step.color, '--node-icon-bg': step.iconBg, '--node-border': step.border }}>
                    <div className="node-icon">{step.icon}</div>
                    <div className="node-content">
                      <div className="node-label" style={{ color: loopStep >= i ? step.color : '#4a6a5a' }}>{step.label}</div>
                      <div className="node-desc">{step.desc}</div>
                      {loopStep >= i && (
                        <div className="node-output" style={{ color: step.color, background: step.iconBg, borderColor: step.border }}>{step.output}</div>
                      )}
                    </div>
                    {i === LOOP_STEPS.length - 1 && loopStep === i && (
                      <div className="loop-badge">↺ Loop again?</div>
                    )}
                  </div>
                  {i < LOOP_STEPS.length - 1 && (
                    <div className="loop-connector" style={{ background: loopStep > i ? step.color : '#0f2018', color: loopStep > i ? step.color : '#1a2e22' }} />
                  )}
                </div>
              ))}
            </div>
            <div className="loop-controls">
              {!loopRunning && loopStep < LOOP_STEPS.length - 1 && (
                <button className="loop-btn" onClick={() => setLoopRunning(true)}>▶ Auto Run</button>
              )}
              {!loopRunning && (
                <button className="loop-btn" onClick={() => setLoopStep(s => Math.min(s + 1, LOOP_STEPS.length - 1))}>Step →</button>
              )}
              {loopRunning && (
                <button className="loop-btn secondary" onClick={() => setLoopRunning(false)}>⏸ Pause</button>
              )}
              <button className="loop-btn secondary" onClick={() => { setLoopStep(0); setLoopRunning(false) }}>↺ Reset</button>
            </div>
          </div>

          <div className="ag-card">
            <div className="ag-card-title">// Agent vs. Simple LLM Call</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { label: '❌ Simple LLM Call', color: '#f87171', bg: 'rgba(239,68,68,0.05)', border: 'rgba(239,68,68,0.2)', points: ['Single input → single output', 'No tools or external data', 'Relies purely on training knowledge', 'One shot — no self-correction'] },
                { label: '✅ Agent', color: '#34d399', bg: 'rgba(52,211,153,0.05)', border: 'rgba(52,211,153,0.2)', points: ['Multi-step reasoning loop', 'Calls real tools (search, code, APIs)', 'Grounds answers in live data', 'Self-corrects by observing results'] },
              ].map(col => (
                <div key={col.label} style={{ background: col.bg, border: `1px solid ${col.border}`, borderRadius: 10, padding: 16 }}>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13, color: col.color, marginBottom: 12 }}>{col.label}</div>
                  {col.points.map(p => (
                    <div key={p} style={{ display: 'flex', gap: 8, marginBottom: 7, fontSize: 12, color: '#6a8a7a', lineHeight: 1.5 }}>
                      <span style={{ color: col.color, flexShrink: 0 }}>▸</span>{p}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Tab 1: Tool Calling ── */}
      {tab === 1 && (
        <div className="ag-panel">
          <div className="ag-section-title">Tool Calling</div>
          <p className="ag-section-sub">Tools are what turn an LLM into an agent. The model reads tool definitions, decides which to call, and the result flows back into context. Click a tool to explore it, then watch a live call simulation.</p>

          <div className="ag-card">
            <div className="ag-card-title">// Available Tools</div>
            <div className="tools-grid">
              {TOOLS.map((t, i) => (
                <div key={t.id} className={`tool-card${selectedTool === i ? ' selected' : ''}${callingTool !== null && demoRunning ? ' calling' : ''}`}
                  style={{ '--t-accent': t.accent, '--t-accent-glow': t.glow }}
                  onClick={() => setSelectedTool(i)}>
                  <div className="tool-icon">{t.icon}</div>
                  <div className="tool-name" style={{ color: selectedTool === i ? t.accent : '#e0e8f0' }}>{t.name}</div>
                  <div className="tool-sig">{t.sig}</div>
                  <div className="tool-desc">{t.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="ag-card">
            <div className="ag-card-title">// Live Tool Call Simulation</div>
            <p style={{ fontSize: 12, color: '#6a8a7a', marginBottom: 14, lineHeight: 1.7 }}>Watch how an agent uses <span style={{ color: '#38bdf8' }}>web_search</span> and <span style={{ color: '#38bdf8' }}>browse_url</span> to answer a research question — each tool result feeding back into the agent's context.</p>
            <div className="tool-call-sim">
              {TOOL_CALL_DEMO.map((line, i) => (
                <div key={i} className={`tc-line${demoLines.includes(i) ? ' visible' : ''}`} style={{ transitionDelay: `${i * 0.05}s` }}>
                  <span className={`tc-role ${line.role}`}>{line.role}</span>
                  <span className="tc-text">{line.text}</span>
                </div>
              ))}
              {demoLines.length === 0 && !demoRunning && (
                <div style={{ color: '#1a3a28', fontSize: 12 }}>// Press "Run Demo" to watch the agent work...</div>
              )}
            </div>
            <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
              <button className="loop-btn" onClick={() => { setDemoLines([]); setTimeout(() => setDemoRunning(true), 100) }} disabled={demoRunning}>
                {demoRunning ? '⏳ Running...' : '▶ Run Demo'}
              </button>
              <button className="loop-btn secondary" onClick={() => { setDemoLines([]); setDemoRunning(false) }}>↺ Reset</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab 2: ReAct ── */}
      {tab === 2 && (
        <div className="ag-panel">
          <div className="ag-section-title">The ReAct Pattern</div>
          <p className="ag-section-sub">ReAct (Reason + Act) is the most widely-used agent pattern. The agent alternates between explicit <span style={{ color: '#818cf8' }}>Thought</span> steps and <span style={{ color: '#fbbf24' }}>Action</span> steps, with <span style={{ color: '#f97316' }}>Observations</span> from tool results. This makes reasoning transparent and debuggable.</p>

          <div className="ag-card">
            <div className="ag-card-title">// ReAct Trace — Flight Booking Agent</div>
            <div className="react-timeline">
              {REACT_STEPS.map((step, i) => (
                <div key={i} className="react-step">
                  <div className="react-dot" style={{ background: step.dotBg, borderColor: step.dotBorder, color: step.color }}>{step.icon}</div>
                  <div className="react-body">
                    <div className="react-type" style={{ color: step.color }}>{step.type}</div>
                    <div className="react-content">{step.content}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="ag-card">
            <div className="ag-card-title">// Why ReAct Works</div>
            <div style={{ display: 'grid', gap: 12 }}>
              {[
                ['🔍 Transparent reasoning', 'Every decision has an explicit Thought. You can read the trace and see exactly why the agent did what it did.'],
                ['🛡️ Reduces hallucination', 'The agent grounds claims in tool results rather than generating from memory. If the tool returns nothing, it knows to say so.'],
                ['🔄 Self-correcting', 'When an Observation contradicts expectations, the next Thought can adapt the plan — no need for external oversight on every step.'],
                ['🐛 Debuggable', 'When something goes wrong, the Thought/Action/Observation trail tells you exactly where reasoning broke down.'],
              ].map(([title, desc]) => (
                <div key={title} style={{ display: 'flex', gap: 12 }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{title.split(' ')[0]}</span>
                  <div>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 700, color: '#e0e8f0', marginBottom: 3 }}>{title.slice(2)}</div>
                    <div style={{ fontSize: 12, color: '#6a8a7a', lineHeight: 1.6 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Tab 3: Context Layers ── */}
      {tab === 3 && (
        <div className="ag-panel">
          <div className="ag-section-title">Context Engineering</div>
          <p className="ag-section-sub">Context engineering is the practice of deliberately designing what information goes into the context window at each step. It's the most important skill in building reliable agents. Click each layer to expand it.</p>

          <div className="ag-card">
            <div className="ag-card-title">// Agent Context Window Anatomy</div>
            <div style={{ fontSize: 12, color: '#6a8a7a', marginBottom: 16, lineHeight: 1.7 }}>
              A typical agent context window has 5 layers. Together they define everything the agent can perceive.
              Total: <span style={{ color: '#34d399', fontFamily: "'Syne',sans-serif", fontWeight: 700 }}>~4,550 tokens</span> before any tool results.
            </div>

            {/* Stacked bar */}
            <div style={{ display: 'flex', height: 32, borderRadius: 8, overflow: 'hidden', marginBottom: 20, border: '1px solid #0f2018' }}>
              {CTX_LAYERS.map((l, i) => {
                const widths = [17, 9, 26, 44, 4]
                return <div key={i} style={{ width: `${widths[i]}%`, background: l.bg, borderRight: i < CTX_LAYERS.length - 1 ? `1px solid #0a1810` : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: l.color, letterSpacing: '0.06em', overflow: 'hidden', whiteSpace: 'nowrap', padding: '0 4px' }}>
                  {widths[i] > 10 ? l.name.split(' ')[0] : ''}
                </div>
              })}
            </div>

            <div className="ctx-layers">
              {CTX_LAYERS.map((layer, i) => (
                <div key={i} className={`ctx-layer${expandedCtx === i ? ' expanded' : ''}`}
                  style={{ background: layer.bg, borderColor: expandedCtx === i ? layer.color : layer.border, '--l-color': layer.color }}
                  onClick={() => setExpandedCtx(expandedCtx === i ? null : i)}>
                  <div className="ctx-layer-header">
                    <span className="ctx-layer-icon">{layer.icon}</span>
                    <span className="ctx-layer-name" style={{ color: layer.color }}>{layer.name}</span>
                    <span className="ctx-layer-tokens" style={{ color: layer.color, background: layer.tokenBg, borderColor: layer.tokenBorder }}>{layer.tokens}</span>
                    <span className="ctx-layer-chevron">▶</span>
                  </div>
                  {expandedCtx === i && (
                    <div className="ctx-layer-body" style={{ borderColor: layer.border, color: '#7a9a88' }}>
                      <p style={{ marginBottom: 12 }}>{layer.body}</p>
                      <div style={{ background: '#020809', border: `1px solid ${layer.border}`, borderRadius: 6, padding: 12, fontFamily: "'DM Mono',monospace", fontSize: 11, color: layer.color, lineHeight: 1.7, whiteSpace: 'pre-wrap', marginBottom: 10 }}>{layer.code}</div>
                      <div className="ctx-tip">{layer.tip}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Tab 4: Multi-Agent ── */}
      {tab === 4 && (
        <div className="ag-panel">
          <div className="ag-section-title">Multi-Agent Systems</div>
          <p className="ag-section-sub">For complex tasks, multiple specialized agents collaborate under an orchestrator. Each agent has its own context, tools, and role — the orchestrator delegates, collects results, and assembles the final output.</p>

          <div className="ag-card">
            <div className="ag-card-title">// Orchestrator + Sub-Agents</div>
            <div className="ma-diagram">
              <div className="ma-agents">
                {MA_LEFT.map(a => (
                  <div key={a.name} className={`ma-agent${maActive?.name === a.name ? ' active' : ''}`}
                    style={{ borderColor: maActive?.name === a.name ? a.color : 'rgba(255,255,255,0.06)', '--a-glow': a.glow }}>
                    <div className="ma-agent-name" style={{ color: a.color }}>{a.name}</div>
                    <div className="ma-agent-role">{a.role}</div>
                    <div className="ma-agent-tools">
                      {a.tools.map(t => <span key={t} className="ma-tool-tag" style={{ color: a.color, background: `${a.color}10`, borderColor: `${a.color}30` }}>{t}</span>)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="ma-center">
                <div className="ma-arrow">⟷</div>
                <div className="ma-orchestrator">
                  <div className="ma-orch-icon">🎯</div>
                  <div className="ma-orch-name">Orchestrator</div>
                  <div className="ma-orch-sub">Plans & delegates</div>
                </div>
                <div className="ma-arrow">⟷</div>
              </div>

              <div className="ma-agents">
                {MA_RIGHT.map(a => (
                  <div key={a.name} className={`ma-agent${maActive?.name === a.name ? ' active' : ''}`}
                    style={{ borderColor: maActive?.name === a.name ? a.color : 'rgba(255,255,255,0.06)', '--a-glow': a.glow }}>
                    <div className="ma-agent-name" style={{ color: a.color }}>{a.name}</div>
                    <div className="ma-agent-role">{a.role}</div>
                    <div className="ma-agent-tools">
                      {a.tools.map(t => <span key={t} className="ma-tool-tag" style={{ color: a.color, background: `${a.color}10`, borderColor: `${a.color}30` }}>{t}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="ma-msg">
              <strong>→ </strong>{MA_MESSAGES[maStep % MA_MESSAGES.length]}
            </div>
          </div>

          <div className="ag-card">
            <div className="ag-card-title">// When to Use Multi-Agent</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { label: '✅ Use Multi-Agent When', color: '#34d399', bg: 'rgba(52,211,153,0.05)', border: 'rgba(52,211,153,0.2)', points: ['Task requires parallel work streams', 'Subtasks need specialized expertise', 'One context window isn\'t large enough', 'You want fault isolation between steps'] },
                { label: '⚠️ Avoid When', color: '#fbbf24', bg: 'rgba(251,191,36,0.05)', border: 'rgba(251,191,36,0.2)', points: ['Single-step tasks (over-engineering)', 'Latency is critical (agents add overhead)', 'Debugging is already hard (adds complexity)', 'Cost is constrained (multiple LLM calls)'] },
              ].map(col => (
                <div key={col.label} style={{ background: col.bg, border: `1px solid ${col.border}`, borderRadius: 10, padding: 16 }}>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 12, color: col.color, marginBottom: 10 }}>{col.label}</div>
                  {col.points.map(p => (
                    <div key={p} style={{ display: 'flex', gap: 8, marginBottom: 6, fontSize: 11, color: '#6a8a7a', lineHeight: 1.5 }}>
                      <span style={{ color: col.color, flexShrink: 0 }}>▸</span>{p}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Tab 5: Quiz ── */}
      {tab === 5 && (
        <div className="ag-panel">
          <div className="ag-section-title">Quick Quiz</div>
          <p className="ag-section-sub">Test your understanding of agents, tool calling, and context engineering.</p>
          {!done ? (
            <div className="ag-card">
              <div className="ag-progress"><div className="ag-progress-fill" style={{ width: `${(qIdx / QUIZ.length) * 100}%` }} /></div>
              <div style={{ fontSize: 11, color: '#4a6a5a', marginBottom: 16 }}>QUESTION {qIdx + 1} / {QUIZ.length}</div>
              <div className="ag-quiz-q">{QUIZ[qIdx].q}</div>
              <div className="ag-quiz-opts">
                {QUIZ[qIdx].opts.map((opt, i) => (
                  <button key={i} disabled={chosen !== null}
                    className={`ag-quiz-opt${chosen !== null && i === QUIZ[qIdx].correct ? ' correct' : ''}${chosen === i && i !== QUIZ[qIdx].correct ? ' wrong' : ''}`}
                    onClick={() => handleQuiz(i)}>
                    {['A','B','C','D'][i]}. {opt}
                  </button>
                ))}
              </div>
              {chosen !== null && (
                <>
                  <div className="ag-quiz-exp">{QUIZ[qIdx].explanation}</div>
                  <button className="ag-quiz-next" onClick={nextQ}>{qIdx + 1 < QUIZ.length ? 'Next Question →' : 'See Results →'}</button>
                </>
              )}
            </div>
          ) : (
            <div className="ag-card" style={{ textAlign: 'center', padding: 40 }}>
              <div style={{ fontSize: 12, color: '#4a6a5a', marginBottom: 12, letterSpacing: '0.12em' }}>FINAL SCORE</div>
              <div className="ag-score-num">{score}/{QUIZ.length}</div>
              <div style={{ fontSize: 14, color: '#6a8a7a', marginTop: 8 }}>
                {score === QUIZ.length ? 'Perfect! You understand agents deeply. 🤖' : score >= 2 ? 'Good work! Revisit the tricky sections. 📚' : 'Keep exploring — agents take time to click. 💪'}
              </div>
              <button className="ag-quiz-next" style={{ marginTop: 24 }} onClick={() => { setQIdx(0); setChosen(null); setScore(0); setDone(false) }}>Retake Quiz ↺</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
