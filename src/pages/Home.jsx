import { Link } from 'react-router-dom'
import NavBar from '../components/NavBar.jsx'

const css = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap');

.home { min-height: 100vh; background: #050810; color: #e0e8f0; font-family: 'IBM Plex Mono', monospace; }

.hero { position: relative; padding: 80px 24px 64px; text-align: center; overflow: hidden; }
.hero-glow { position: absolute; inset: 0; background: radial-gradient(ellipse 80% 40% at 50% -10%, rgba(56,189,248,0.12) 0%, transparent 60%), radial-gradient(ellipse 40% 30% at 20% 80%, rgba(129,140,248,0.07) 0%, transparent 50%), radial-gradient(ellipse 30% 25% at 80% 70%, rgba(52,211,153,0.06) 0%, transparent 50%); pointer-events: none; }
.hero-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(56,189,248,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.04) 1px, transparent 1px); background-size: 48px 48px; pointer-events: none; mask-image: radial-gradient(ellipse 80% 60% at 50% 50%, black 0%, transparent 80%); }

.hero-eyebrow { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; letter-spacing: 0.2em; text-transform: uppercase; color: #38bdf8; margin-bottom: 20px; padding: 6px 14px; background: rgba(56,189,248,0.08); border: 1px solid rgba(56,189,248,0.2); border-radius: 100px; }
.hero-title { font-family: 'IBM Plex Sans', sans-serif; font-size: clamp(42px, 7vw, 88px); font-weight: 900; letter-spacing: -0.04em; line-height: 0.95; color: #fff; margin-bottom: 24px; }
.hero-title .line2 { display: block; background: linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #34d399 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.hero-desc { font-size: 16px; color: #7a9bbf; max-width: 520px; margin: 0 auto 48px; line-height: 1.8; }

.hero-stats { display: flex; justify-content: center; gap: 32px; flex-wrap: wrap; }
.hero-stat-num { font-family: 'IBM Plex Sans', sans-serif; font-size: 28px; font-weight: 900; color: #38bdf8; line-height: 1; }
.hero-stat-lbl { font-size: 16px; color: #4a6a8a; letter-spacing: 0.12em; text-transform: uppercase; margin-top: 4px; }

.lab-section { max-width: 1100px; margin: 0 auto; padding: 0 24px 100px; }
.section-header { display: flex; align-items: baseline; gap: 14px; margin-bottom: 28px; }
.section-label { font-size: 13px; letter-spacing: 0.18em; text-transform: uppercase; color: #38bdf8; }
.section-line { flex: 1; height: 1px; background: linear-gradient(90deg, rgba(56,189,248,0.3), transparent); }

.viz-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }

.viz-card { position: relative; background: #0a1020; border: 1px solid #141e35; border-radius: 16px; padding: 28px; text-decoration: none; display: block; overflow: hidden; transition: all 0.25s cubic-bezier(.4,0,.2,1); }
.viz-card::before { content: ''; position: absolute; inset: 0; border-radius: 16px; opacity: 0; transition: opacity 0.25s; background: var(--card-glow); }
.viz-card:hover { border-color: var(--card-accent); transform: translateY(-3px); box-shadow: 0 20px 60px rgba(0,0,0,0.4), 0 0 40px var(--card-glow-color); }
.viz-card:hover::before { opacity: 1; }
.viz-card.coming-soon { opacity: 0.5; cursor: default; pointer-events: none; }

.card-icon-wrap { width: 52px; height: 52px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 18px; background: var(--card-icon-bg); border: 1px solid var(--card-accent-dim); position: relative; z-index: 1; }
.card-tag { display: inline-block; font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; padding: 3px 8px; border-radius: 4px; margin-bottom: 10px; background: var(--card-tag-bg); color: var(--card-accent); border: 1px solid var(--card-accent-dim); position: relative; z-index: 1; }
.card-title { font-family: 'IBM Plex Sans', sans-serif; font-size: 20px; font-weight: 800; color: #fff; margin-bottom: 8px; letter-spacing: -0.02em; position: relative; z-index: 1; }
.card-desc { font-size: 16px; color: #5a7a9a; line-height: 1.7; margin-bottom: 20px; position: relative; z-index: 1; }
.card-pills { display: flex; flex-wrap: wrap; gap: 6px; position: relative; z-index: 1; }
.card-pill { font-size: 16px; color: #3a5a7a; background: rgba(255,255,255,0.03); border: 1px solid #141e35; padding: 3px 8px; border-radius: 4px; }
.card-arrow { position: absolute; bottom: 24px; right: 24px; font-size: 18px; color: var(--card-accent); opacity: 0; transform: translateX(-6px); transition: all 0.2s; z-index: 1; }
.viz-card:hover .card-arrow { opacity: 1; transform: translateX(0); }
.coming-label { position: absolute; top: 16px; right: 16px; font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: #3a5a7a; background: rgba(255,255,255,0.04); border: 1px solid #1a2744; padding: 4px 8px; border-radius: 4px; }

.lab-footer { border-top: 1px solid #0d1828; padding: 28px 24px; text-align: center; font-size: 13px; color: #2a4060; letter-spacing: 0.06em; }
`

const TokenIcon = () => (
  <svg width="32" height="32" viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg">
    <rect x="0"  y="0"  width="36" height="22" rx="4" fill="rgba(56,189,248,0.15)"  stroke="#38bdf8" strokeWidth="2"/>
    <rect x="40" y="0"  width="28" height="22" rx="4" fill="rgba(129,140,248,0.15)" stroke="#818cf8" strokeWidth="2"/>
    <rect x="72" y="0"  width="44" height="22" rx="4" fill="rgba(52,211,153,0.15)"  stroke="#34d399" strokeWidth="2"/>
    <rect x="120" y="0" width="22" height="22" rx="4" fill="rgba(251,191,36,0.15)"  stroke="#fbbf24" strokeWidth="2"/>
    <rect x="0"  y="30" width="50" height="22" rx="4" fill="rgba(249,115,22,0.15)"  stroke="#f97316" strokeWidth="2"/>
    <rect x="54" y="30" width="30" height="22" rx="4" fill="rgba(56,189,248,0.15)"  stroke="#38bdf8" strokeWidth="2"/>
    <rect x="88" y="30" width="52" height="22" rx="4" fill="rgba(129,140,248,0.15)" stroke="#818cf8" strokeWidth="2"/>
    <line x1="70" y1="58" x2="70" y2="72" stroke="#38bdf8" strokeWidth="2" strokeOpacity="0.5"/>
    <polygon points="62,72 78,72 70,82" fill="#38bdf8" opacity="0.5"/>
    <rect x="0"  y="88" width="22" height="14" rx="3" fill="rgba(56,189,248,0.25)"  stroke="#38bdf8" strokeWidth="2"/>
    <rect x="26" y="88" width="16" height="14" rx="3" fill="rgba(129,140,248,0.25)" stroke="#818cf8" strokeWidth="2"/>
    <rect x="46" y="88" width="28" height="14" rx="3" fill="rgba(52,211,153,0.25)"  stroke="#34d399" strokeWidth="2"/>
    <rect x="78" y="88" width="14" height="14" rx="3" fill="rgba(251,191,36,0.25)"  stroke="#fbbf24" strokeWidth="2"/>
    <rect x="96" y="88" width="20" height="14" rx="3" fill="rgba(249,115,22,0.25)"  stroke="#f97316" strokeWidth="2"/>
  </svg>
)

const AgentLoopIcon = () => (
  <svg width="28" height="28" viewBox="-80 -80 160 160" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <marker id="ag-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
        <path d="M2 1L8 5L2 9" fill="none" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </marker>
    </defs>
    <path d="M 0 -68 A 68 68 0 1 1 -48 48" fill="none" stroke="#34d399" strokeWidth="7" strokeLinecap="round" markerEnd="url(#ag-arrow)"/>
    <path d="M 0 40 A 40 40 0 1 0 28 -28" fill="none" stroke="#34d399" strokeWidth="4" strokeLinecap="round" strokeOpacity="0.4" markerEnd="url(#ag-arrow)"/>
    <circle cx="0" cy="0" r="10" fill="#34d399" fillOpacity="0.15" stroke="#34d399" strokeWidth="2"/>
    <circle cx="0" cy="0" r="4" fill="#34d399"/>
  </svg>
)

const TemperatureIcon = () => (
  <svg width="30" height="30" viewBox="0 0 90 90" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="12" width="10" height="46" rx="5" fill="rgba(236,72,153,0.15)" stroke="#ec4899" strokeWidth="2"/>
    <circle cx="25" cy="65" r="12" fill="rgba(236,72,153,0.15)" stroke="#ec4899" strokeWidth="2"/>
    <rect x="22.5" y="36" width="5" height="29" rx="2.5" fill="#ec4899"/>
    <circle cx="25" cy="65" r="8" fill="#ec4899"/>
    <line x1="20" y1="22" x2="14" y2="22" stroke="#ec4899" strokeWidth="1.5" strokeOpacity="0.5"/>
    <line x1="20" y1="34" x2="17" y2="34" stroke="#ec4899" strokeWidth="1.5" strokeOpacity="0.5"/>
    <line x1="20" y1="46" x2="14" y2="46" stroke="#ec4899" strokeWidth="1.5" strokeOpacity="0.5"/>
    <rect x="46" y="52" width="8" height="16" rx="2" fill="rgba(236,72,153,0.25)" stroke="#ec4899" strokeWidth="1.5"/>
    <rect x="58" y="36" width="8" height="32" rx="2" fill="rgba(236,72,153,0.5)" stroke="#ec4899" strokeWidth="1.5"/>
    <rect x="70" y="44" width="8" height="24" rx="2" fill="rgba(236,72,153,0.35)" stroke="#ec4899" strokeWidth="1.5"/>
  </svg>
)

const VectorEmbeddingsIcon = () => (
  <svg width="30" height="30" viewBox="0 0 90 90" xmlns="http://www.w3.org/2000/svg">
    <circle cx="42" cy="52" r="3" fill="#f97316"/>
    <line x1="42" y1="52" x2="78" y2="52" stroke="#f97316" strokeWidth="2" strokeOpacity="0.7"/>
    <polygon points="78,49 85,52 78,55" fill="#f97316" opacity="0.7"/>
    <line x1="42" y1="52" x2="42" y2="10" stroke="#f97316" strokeWidth="2" strokeOpacity="0.7"/>
    <polygon points="39,10 42,3 45,10" fill="#f97316" opacity="0.7"/>
    <line x1="42" y1="52" x2="16" y2="72" stroke="#f97316" strokeWidth="2" strokeOpacity="0.45"/>
    <polygon points="14,74 9,81 18,79" fill="#f97316" opacity="0.45"/>
    <circle cx="66" cy="26" r="4.5" fill="#f97316" fillOpacity="0.85"/>
    <circle cx="28" cy="32" r="3.5" fill="#f97316" fillOpacity="0.6"/>
    <circle cx="62" cy="40" r="3.5" fill="#f97316" fillOpacity="0.7"/>
    <circle cx="32" cy="46" r="3" fill="#f97316" fillOpacity="0.5"/>
  </svg>
)

const RAGIcon = () => (
  <svg viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg" width="30" height="30">
    <ellipse cx="25" cy="22" rx="15" ry="7" stroke="#06b6d4" strokeWidth="2.5"/>
    <rect x="10" y="22" width="30" height="28" fill="none" stroke="#06b6d4" strokeWidth="2.5"/>
    <ellipse cx="25" cy="50" rx="15" ry="7" stroke="#06b6d4" strokeWidth="2.5"/>
    <path d="M46 45 L58 45" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M55 39 L63 45 L55 51" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="64" y="30" width="18" height="30" rx="4" stroke="#06b6d4" strokeWidth="2.5"/>
  </svg>
)

const ICON_MAP = {
  'token-optimization': TokenIcon,
  'agents-tools': AgentLoopIcon,
  'temperature-sampling': TemperatureIcon,
  'vector-embeddings': VectorEmbeddingsIcon,
  'rag': RAGIcon,
}

const VISUALIZATIONS = [
  {
    path: '/token-optimization',
    icon: null,
    tag: 'LLM Fundamentals',
    title: 'Token Optimization',
    desc: 'Understand how LLMs tokenize text, what tokens cost, and how to dramatically reduce your API spend.',
    pills: ['Live Tokenizer', 'Cost Calculator', 'KV Cache', 'Context Windows', 'Quiz'],
    accent: '#38bdf8', accentDim: 'rgba(56,189,248,0.2)', iconBg: 'rgba(56,189,248,0.1)',
    glow: 'radial-gradient(ellipse at 0% 0%, rgba(56,189,248,0.08) 0%, transparent 60%)',
    glowColor: 'rgba(56,189,248,0.08)', ready: true,
  },
  {
    path: '/agents-tools',
    icon: null,
    tag: 'Agentic AI',
    title: 'Agents, Tools & Context',
    desc: 'See how AI agents think in loops, call tools, and how context engineering shapes every decision they make.',
    pills: ['Agent Loop', 'Tool Calling', 'ReAct Pattern', 'Context Engineering', 'Multi-Agent'],
    accent: '#34d399', accentDim: 'rgba(52,211,153,0.2)', iconBg: 'rgba(52,211,153,0.1)',
    glow: 'radial-gradient(ellipse at 0% 0%, rgba(52,211,153,0.08) 0%, transparent 60%)',
    glowColor: 'rgba(52,211,153,0.08)', ready: true,
  },
  {
    path: null, icon: '🧠', tag: 'Deep Learning', title: 'Neural Networks',
    desc: 'Watch a neural network learn in real-time. Adjust layers, neurons, and activation functions interactively.',
    pills: ['Forward Pass', 'Backprop', 'Gradient Descent', 'Activations'],
    accent: '#818cf8', accentDim: 'rgba(129,140,248,0.2)', iconBg: 'rgba(129,140,248,0.1)',
    glow: 'radial-gradient(ellipse at 0% 0%, rgba(129,140,248,0.08) 0%, transparent 60%)',
    glowColor: 'rgba(129,140,248,0.08)', ready: false,
  },
  {
    path: '/vector-embeddings',
    icon: null,
    tag: 'Embeddings', title: 'Vector Embeddings',
    desc: 'Explore how words and concepts map to high-dimensional vectors, and why semantic similarity works.',
    pills: ['Word Vectors', 'Cosine Similarity', 'Semantic Search', 'RAG', 'Quiz'],
    accent: '#f97316', accentDim: 'rgba(249,115,22,0.2)', iconBg: 'rgba(249,115,22,0.1)',
    glow: 'radial-gradient(ellipse at 0% 0%, rgba(249,115,22,0.08) 0%, transparent 60%)',
    glowColor: 'rgba(249,115,22,0.08)', ready: true,
  },
  {
    path: '/temperature-sampling',
    icon: null,
    tag: 'LLM Fundamentals', title: 'Temperature & Sampling',
    desc: 'See how temperature, top-k and top-p affect LLM output distributions — and why it matters for your use case.',
    pills: ['Temperature', 'Top-K', 'Top-P Nucleus', 'Comparison', 'Live Sampler', 'Quiz'],
    accent: '#ec4899', accentDim: 'rgba(236,72,153,0.2)', iconBg: 'rgba(236,72,153,0.1)',
    glow: 'radial-gradient(ellipse at 0% 0%, rgba(236,72,153,0.08) 0%, transparent 60%)',
    glowColor: 'rgba(236,72,153,0.08)', ready: true,
  },
  {
    path: '/rag',
    icon: null,
    tag: 'LLM Architecture',
    title: 'Retrieval-Augmented Generation',
    desc: 'See how RAG pipelines retrieve, chunk, and inject knowledge into LLM prompts.',
    pills: ['Pipeline', 'Chunking', 'Retrieval', 'Prompt Assembly', 'RAG vs Fine-Tuning'],
    accent: '#06b6d4',
    accentDim: 'rgba(6,182,212,0.15)',
    iconBg: 'rgba(6,182,212,0.1)',
    glow: 'radial-gradient(ellipse at 0% 0%, rgba(6,182,212,0.08) 0%, transparent 60%)',
    glowColor: 'rgba(6,182,212,0.09)',
    ready: true,
  },
]

export default function Home() {
  const ready = VISUALIZATIONS.filter(v => v.ready)
  const coming = VISUALIZATIONS.filter(v => !v.ready)

  return (
    <div className="home">
      <style>{css}</style>
      <NavBar />
      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-grid" />
        <div className="hero-eyebrow">🧪 Interactive Learning Platform</div>
        <h1 className="hero-title">Learn AI<span className="line2">Visually</span></h1>
        <p className="hero-desc">Stop reading about AI. Start seeing it. Every visualization is interactive, hands-on, and built to give you real intuition — not just theory.</p>
        <div className="hero-stats">
          {[["2", "Live Now"], ["4+", "Coming Soon"], ["100%", "Free & Open"]].map(([n, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div className="hero-stat-num">{n}</div>
              <div className="hero-stat-lbl">{l}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="lab-section">
        <div className="section-header">
          <span className="section-label">✦ Live Now</span>
          <div className="section-line" />
        </div>
        <div className="viz-grid" style={{ marginBottom: 56 }}>
          {ready.map(v => (
            <Link key={v.title} to={v.path} className="viz-card"
              style={{ '--card-accent': v.accent, '--card-accent-dim': v.accentDim, '--card-icon-bg': v.iconBg, '--card-glow': v.glow, '--card-glow-color': v.glowColor, '--card-tag-bg': v.iconBg }}>
              <div className="card-icon-wrap">{(() => { const IC = v.path && ICON_MAP[v.path.replace('/','')]; return IC ? <IC /> : v.icon })()}</div>
              <div className="card-tag">{v.tag}</div>
              <div className="card-title">{v.title}</div>
              <div className="card-desc">{v.desc}</div>
              <div className="card-pills">{v.pills.map(p => <span key={p} className="card-pill">{p}</span>)}</div>
              <div className="card-arrow">→</div>
            </Link>
          ))}
        </div>

        <div className="section-header">
          <span className="section-label" style={{ color: '#3a5a7a' }}>◦ Coming Soon</span>
          <div className="section-line" style={{ background: 'linear-gradient(90deg, rgba(58,90,122,0.3), transparent)' }} />
        </div>
        <div className="viz-grid">
          {coming.map(v => (
            <div key={v.title} className="viz-card coming-soon"
              style={{ '--card-accent': v.accent, '--card-accent-dim': v.accentDim, '--card-icon-bg': v.iconBg, '--card-glow': v.glow, '--card-glow-color': v.glowColor, '--card-tag-bg': v.iconBg }}>
              <div className="coming-label">Coming Soon</div>
              <div className="card-icon-wrap">{(() => { const IC = v.path && ICON_MAP[v.path.replace('/','')]; return IC ? <IC /> : v.icon })()}</div>
              <div className="card-tag">{v.tag}</div>
              <div className="card-title">{v.title}</div>
              <div className="card-desc">{v.desc}</div>
              <div className="card-pills">{v.pills.map(p => <span key={p} className="card-pill">{p}</span>)}</div>
            </div>
          ))}
        </div>
      </div>

      <footer className="lab-footer">Built with React + Vite · Deployed on Vercel · thebabar/ai-practice</footer>
    </div>
  )
}
