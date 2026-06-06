import { Link } from 'react-router-dom'
import {
  GraduationCapIcon, ChartScatterIcon, ThermometerSimpleIcon, LinkedinLogoIcon,
  HashIcon, RobotIcon, BrainIcon, PuzzlePieceIcon, PaletteIcon,
  BooksIcon, FlowArrowIcon, LightningIcon, PresentationChartIcon,
  GraphIcon, BookOpenIcon, ArrowRightIcon,
} from '@phosphor-icons/react'
import NavBar from '../components/NavBar.jsx'

const css = `
/* ── Phase 6: Home rebuilt on Prism tokens.
 *  Differentiation between cards = icon + tag (§5.1).
 *  Per-card accent colours dropped per §8. ─────────────────── */

.home { min-height: 100vh; background: var(--surface-base); color: var(--text-primary); }

/* Hero — obsidian + refracted light (§5.2) */
.hero {
  position: relative;
  text-align: center;
  padding: var(--spacing-7) var(--spacing-4) var(--spacing-6);
  background: var(--text-primary);
  color: var(--surface-base);
  overflow: hidden;
}
:root[data-theme="dark"] .hero {
  background: var(--surface-base);
  color: var(--text-primary);
}
.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--gradient-refracted-b);
  opacity: var(--refracted-opacity-standard);
  pointer-events: none;
}
.hero > * { position: relative; }

.hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  font: var(--text-weight-label) var(--text-size-caption)/1 var(--font-primary);
  letter-spacing: 0.08em;
  color: var(--orange-300);
  margin-bottom: var(--spacing-4);
  padding: var(--spacing-1) var(--spacing-3);
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.16);
  border-radius: 100px;
}
.hero-title {
  font: var(--text-weight-h1) clamp(var(--text-size-h2), 6vw, 64px)/1.05 var(--font-primary);
  letter-spacing: var(--text-ls-h1);
  margin-bottom: var(--spacing-4);
}
.hero-desc {
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  max-width: 560px;
  margin: 0 auto var(--spacing-6);
  opacity: 0.85;
}

.hero-stats { display: flex; justify-content: center; gap: var(--spacing-7); flex-wrap: wrap; }
.hero-stat-num {
  font: var(--text-weight-h1) var(--text-size-h2)/1 var(--font-primary);
  letter-spacing: var(--text-ls-h2);
  color: var(--orange-300);
}
.hero-stat-lbl {
  font: var(--text-weight-label) var(--text-size-caption)/1 var(--font-primary);
  letter-spacing: 0.08em;
  opacity: 0.7;
  margin-top: var(--spacing-1);
}

.hero-byline {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-3);
  flex-wrap: wrap;
  justify-content: center;
  margin-top: var(--spacing-6);
  font: var(--text-weight-body) var(--text-size-caption)/1.4 var(--font-primary);
  opacity: 0.7;
}
.hero-byline strong { font-weight: 600; opacity: 1; }
.hero-byline-sep { opacity: 0.4; }
.hero-byline-link {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-1);
  color: inherit;
  text-decoration: none;
  border-bottom: 1px solid currentColor;
  transition: opacity var(--duration-fast) var(--ease-standard);
}
.hero-byline-link:hover { opacity: 1; }

/* Section grid */
.lab-section { max-width: 1100px; margin: 0 auto; padding: 0 var(--spacing-4) var(--spacing-7); }
.section-header { display: flex; align-items: baseline; gap: var(--spacing-3); margin-bottom: var(--spacing-5); }
.section-label {
  font: var(--text-weight-label) var(--text-size-caption)/1 var(--font-primary);
  letter-spacing: 0.06em;
  color: var(--text-secondary);
}
.section-line {
  flex: 1;
  height: 1px;
  background: var(--border-default);
}

.viz-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: var(--spacing-4); }

.viz-card {
  position: relative;
  background: var(--surface-1);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--spacing-5);
  text-decoration: none;
  display: block;
  color: inherit;
  box-shadow: var(--shadow-e2);
  transition: border-color var(--duration-fast) var(--ease-standard),
              box-shadow var(--duration-fast) var(--ease-standard),
              transform var(--duration-fast) var(--ease-standard);
}
.viz-card:hover {
  border-color: var(--border-strong);
  box-shadow: var(--shadow-e2), var(--shadow-e1);
  transform: translateY(-2px);
}
.viz-card:focus-visible {
  outline: 3px solid var(--color-focus-ring);
  outline-offset: 2px;
}
.viz-card.coming-soon { opacity: 0.55; cursor: default; pointer-events: none; }

.card-icon-wrap {
  width: 52px;
  height: 52px;
  border-radius: var(--radius-md);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--surface-2);
  border: 1px solid var(--border-default);
  color: var(--text-primary);
  margin-bottom: var(--spacing-4);
}
.card-tag {
  display: inline-block;
  font: var(--text-weight-label) var(--text-size-meta)/1 var(--font-primary);
  letter-spacing: 0.06em;
  padding: 3px 8px;
  border-radius: var(--radius-sm);
  margin-bottom: var(--spacing-2);
  background: var(--surface-2);
  color: var(--text-secondary);
  border: 1px solid var(--border-default);
}
.card-title {
  font: var(--text-weight-h3) var(--text-size-h3)/var(--text-lh-h3) var(--font-primary);
  letter-spacing: var(--text-ls-h3);
  color: var(--text-primary);
  margin-bottom: var(--spacing-2);
}
.card-desc {
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-4);
}
.card-pills { display: flex; flex-wrap: wrap; gap: var(--spacing-1); }
.card-pill {
  font: var(--text-weight-body) var(--text-size-meta)/1 var(--font-primary);
  color: var(--text-tertiary);
  background: var(--surface-2);
  border: 1px solid var(--border-default);
  padding: 3px 8px;
  border-radius: var(--radius-sm);
}
.card-arrow {
  position: absolute;
  bottom: var(--spacing-5);
  right: var(--spacing-5);
  color: var(--text-tertiary);
  display: inline-flex;
  opacity: 0;
  transform: translateX(-4px);
  transition: opacity var(--duration-fast) var(--ease-standard), transform var(--duration-fast) var(--ease-standard);
}
.viz-card:hover .card-arrow { opacity: 1; transform: translateX(0); }

/* Beta-style "Coming soon" badge, mirroring .badge--beta */
.coming-label {
  position: absolute;
  top: var(--spacing-3);
  right: var(--spacing-3);
  display: inline-flex;
  align-items: center;
  font: var(--text-weight-label) var(--text-size-meta)/1 var(--font-primary);
  letter-spacing: 0.06em;
  padding: 3px 8px;
  border-radius: var(--radius-sm);
  background: var(--surface-1);
  border: 1px solid var(--color-info);
  color: var(--color-info);
}

.lab-footer {
  border-top: 1px solid var(--border-default);
  padding: var(--spacing-5) var(--spacing-4);
  text-align: center;
  font: var(--text-weight-body) var(--text-size-caption)/1.6 var(--font-primary);
  color: var(--text-tertiary);
}
.lab-footer strong { color: var(--text-secondary); font-weight: 600; }

/* Glossary utility row */
.gl-utility-bar { max-width: 1100px; margin: 0 auto; padding: var(--spacing-5) var(--spacing-4) var(--spacing-4); }
.gl-utility-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  background: var(--surface-1);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--spacing-3) var(--spacing-4);
  text-decoration: none;
  color: inherit;
  transition: background-color var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard);
}
.gl-utility-link:hover { background: var(--surface-2); border-color: var(--border-strong); }
.gl-utility-link:focus-visible { outline: 3px solid var(--color-focus-ring); outline-offset: 2px; }
.gl-utility-title {
  font: var(--text-weight-label) var(--text-size-body)/1.2 var(--font-primary);
  color: var(--text-primary);
}
.gl-utility-desc {
  font: var(--text-weight-body) var(--text-size-caption)/1.4 var(--font-primary);
  color: var(--text-secondary);
}
.gl-utility-arrow {
  margin-left: auto;
  color: var(--text-tertiary);
  display: inline-flex;
  transition: transform var(--duration-fast) var(--ease-standard);
}
.gl-utility-link:hover .gl-utility-arrow { transform: translateX(3px); }
`

// Phosphor icons, outlined / duotone, 28px. Card differentiation is icon
// shape only — Prism §9 + §5.1. All icons inherit colour from the card
// icon wrap (--text-primary), so no per-card accent leaks back in.
const ICON_MAP = {
  'learn-claude':         GraduationCapIcon,
  'intro-llms':           BrainIcon,
  'types-of-llms':        PuzzlePieceIcon,
  'image-generation':     PaletteIcon,
  'agents-tools':         RobotIcon,
  'workflow-canvas':      FlowArrowIcon,
  'token-optimization':   HashIcon,
  'temperature-sampling': ThermometerSimpleIcon,
  'rag':                  BooksIcon,
  'agent-simulation':     LightningIcon,
  'board-briefing':       PresentationChartIcon,
  'neural-networks':      GraphIcon,
  'vector-embeddings':    ChartScatterIcon,
  'glossary':             BookOpenIcon,
}

// Card data — no per-card palette. Differentiation is icon + tag.
const VISUALIZATIONS = [
  { path: '/learn-claude',         tag: 'Learn Claude',     title: 'Claude learning resources',          desc: 'Curated official and community resources for learning Claude — a guided path for your level.',                                pills: ['Beginner', 'Intermediate', 'Developer'],                                                ready: true },
  { path: '/intro-llms',           tag: 'Foundations',      title: 'Introduction to LLMs',               desc: 'Understand how large language models work — from next-token prediction to emergent abilities.',                              pills: ['What is an LLM?', 'How LLMs learn', 'Tokens and context', 'Prompts and responses', 'Limitations'], ready: true },
  { path: '/types-of-llms',        tag: 'LLM landscape',    title: 'Types of LLMs',                      desc: 'Compare encoder, decoder, and encoder-decoder architectures, and understand when to use GPT, BERT, T5, and multimodal models.', pills: ['Decoder-only', 'Encoder-only', 'Encoder-decoder', 'Multimodal', 'Model selection'],          ready: true },
  { path: '/image-generation',     tag: 'Generative AI',    title: 'Image generation',                   desc: 'See how diffusion models turn text prompts into images — from noise to pixels, CFG scale, samplers, and prompt craft.',          pills: ['Diffusion process', 'Prompt craft', 'CFG scale', 'Samplers', 'Quiz'],                       ready: true },
  { path: '/agents-tools',         tag: 'Agentic AI',       title: 'Agents, tools, and context',         desc: 'See how agents think in loops, call tools, and how context engineering shapes every decision they make.',                     pills: ['Agent loop', 'Tool calling', 'ReAct pattern', 'Context engineering', 'Multi-agent'],         ready: true },
  { path: '/workflow-canvas',      tag: 'AI tools',         title: 'Workflow canvas',                    desc: 'Design AI-ready workflows on a drag-and-drop canvas. Map human and AI tasks and get an automation readiness report.',           pills: ['Visual builder', 'Node types', 'AI readiness', 'Automation score'],                         ready: true },
  { path: '/token-optimization',   tag: 'LLM fundamentals', title: 'Token optimisation',                  desc: 'Understand how LLMs tokenise text, what tokens cost, and how to dramatically reduce your API spend.',                          pills: ['Live tokeniser', 'Cost calculator', 'KV cache', 'Context windows', 'Quiz'],                  ready: true },
  { path: '/temperature-sampling', tag: 'LLM fundamentals', title: 'Temperature and sampling',           desc: 'See how temperature, top-K, and top-P shape LLM output distributions — and why it matters for your use case.',                pills: ['Temperature', 'Top-K', 'Top-P nucleus', 'Comparison', 'Live sampler', 'Quiz'],               ready: true },
  { path: '/rag',                  tag: 'LLM architecture', title: 'Retrieval-augmented generation',     desc: 'See how RAG pipelines retrieve, chunk, and inject knowledge into LLM prompts.',                                              pills: ['Pipeline', 'Chunking', 'Retrieval', 'Prompt assembly', 'RAG vs fine-tuning'],                ready: true },
  { path: '/agent-simulation',     tag: 'AI agents',        title: 'Agent simulation sandbox',           desc: 'Walk a real agent pipeline — inspect every node, explore risks, latency, and cost, then run the happy path step by step.',     pills: ['Agent workflows', 'Decision gates', 'Risk analysis', 'Latency and cost', 'Human-in-the-loop'], ready: true },
  { path: '/board-briefing',       tag: 'Executive AI',     title: 'Board briefing generator',           desc: 'Generate a board-ready AI transformation brief from your company data.',                                                      pills: ['Brief generator', 'Risk analysis', 'Strategic recommendations'],                              ready: true },
  { path: '/neural-networks',      tag: 'Deep learning',    title: 'Neural networks',                    desc: 'Watch signals flow through a network, see activations, and understand how back-propagation trains weights.',                    pills: ['Overview', 'Forward pass', 'Activations', 'Backprop', 'Gradient descent'],                   ready: true },
  { path: '/vector-embeddings',    tag: 'Embeddings',       title: 'Vector embeddings',                  desc: 'Explore how words and concepts map to high-dimensional vectors, and why semantic similarity works.',                          pills: ['Word vectors', 'Cosine similarity', 'Semantic search', 'RAG', 'Quiz'],                       ready: true },
]

export default function Home() {
  const ready = VISUALIZATIONS.filter(v => v.ready)
  const coming = VISUALIZATIONS.filter(v => !v.ready)

  return (
    <div className="home">
      <style>{css}</style>
      <NavBar />
      <section className="hero">
        <div className="hero-eyebrow">Interactive learning platform</div>
        <h1 className="hero-title">Learn AI visually</h1>
        <p className="hero-desc">Stop reading about AI. Start seeing it. Every visualisation is interactive, hands-on, and built to give you real intuition — not just theory.</p>
        <div className="hero-stats">
          {[["13", "Visualisations"], ["53", "Glossary terms"], ["100%", "Free and open"]].map(([n, l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div className="hero-stat-num">{n}</div>
              <div className="hero-stat-lbl">{l}</div>
            </div>
          ))}
        </div>
        <div className="hero-byline">
          <span>Created by <strong>Babar M Bhatti</strong>, Chief AI Officer, PrismSkills.ai</span>
          <span className="hero-byline-sep">·</span>
          <a className="hero-byline-link" href="https://www.linkedin.com/in/bbhatti" target="_blank" rel="noopener noreferrer">
            <LinkedinLogoIcon size={14} weight="fill" /> LinkedIn
          </a>
        </div>
      </section>

      <div className="gl-utility-bar">
        <Link to="/glossary" className="gl-utility-link">
          <BookOpenIcon size={20} weight="duotone" />
          <div>
            <div className="gl-utility-title">Glossary</div>
            <div className="gl-utility-desc">53 terms · Foundations · Tokens · Sampling · Agents · Embeddings · RAG</div>
          </div>
          <ArrowRightIcon size={16} weight="bold" className="gl-utility-arrow" />
        </Link>
      </div>

      <div className="lab-section">
        <div className="section-header">
          <span className="section-label">Live now</span>
          <div className="section-line" />
        </div>
        <div className="viz-grid">
          {ready.map(v => {
            const Icon = v.path && ICON_MAP[v.path.replace('/', '')]
            return (
              <Link key={v.title} to={v.path} className="viz-card">
                <div className="card-icon-wrap">
                  {Icon ? <Icon size={28} weight="duotone" /> : null}
                </div>
                <div className="card-tag">{v.tag}</div>
                <div className="card-title">{v.title}</div>
                <div className="card-desc">{v.desc}</div>
                <div className="card-pills">{v.pills.map(p => <span key={p} className="card-pill">{p}</span>)}</div>
                <span className="card-arrow"><ArrowRightIcon size={18} weight="bold" /></span>
              </Link>
            )
          })}
          {coming.map(v => {
            const Icon = v.path && ICON_MAP[v.path.replace('/', '')]
            return (
              <div key={v.title} className="viz-card coming-soon" style={{ position: 'relative' }}>
                <div className="coming-label">Coming soon</div>
                <div className="card-icon-wrap">
                  {Icon ? <Icon size={28} weight="duotone" /> : null}
                </div>
                <div className="card-tag">{v.tag}</div>
                <div className="card-title">{v.title}</div>
                <div className="card-desc">{v.desc}</div>
                <div className="card-pills">{v.pills.map(p => <span key={p} className="card-pill">{p}</span>)}</div>
              </div>
            )
          })}
        </div>
      </div>

      <footer className="lab-footer">
        <div style={{ marginBottom: 'var(--spacing-1)' }}>
          Designed by <strong>Babar M Bhatti</strong> · Dallas AI · PrismSkills.ai
        </div>
        <div>Built with React + Vite · Deployed on Vercel · thebabar/ai-practice</div>
      </footer>
    </div>
  )
}
