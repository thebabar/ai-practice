import { useState } from 'react'
import NavBar from '../components/NavBar.jsx'
import { Link } from 'react-router-dom'
import { ArrowRightIcon, MagnifyingGlassIcon } from '@phosphor-icons/react'
import { TERMS } from '../data/glossary.js'

const css = `
/* ── Glossary rebound to Prism tokens. Per §5.1 the 6-category
 *  rainbow collapses to neutral badges — category text is the
 *  identifier, no per-category accent. ──────────────────────── */

.gl-root { min-height: 100vh; background: var(--surface-base); color: var(--text-primary); overflow-x: hidden; }

.gl-hero {
  position: relative;
  text-align: center;
  padding: var(--spacing-7) var(--spacing-4) var(--spacing-6);
  background: var(--text-primary);
  color: var(--surface-base);
  overflow: hidden;
}
:root[data-theme="dark"] .gl-hero {
  background: var(--surface-base);
  color: var(--text-primary);
}
.gl-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--gradient-refracted-b);
  opacity: var(--refracted-opacity-standard);
  pointer-events: none;
}
.gl-hero > * { position: relative; }
.gl-eyebrow {
  font: var(--text-weight-label) var(--text-size-caption)/var(--text-lh-caption) var(--font-primary);
  letter-spacing: 0.08em;
  color: var(--blue-300);
  margin-bottom: var(--spacing-3);
}
.gl-title {
  font: var(--text-weight-h1) var(--text-size-h1)/var(--text-lh-h1) var(--font-primary);
  letter-spacing: var(--text-ls-h1);
  margin-bottom: var(--spacing-3);
}
.gl-subtitle {
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  max-width: 480px;
  margin: 0 auto;
  opacity: 0.85;
}

.gl-controls { max-width: 920px; margin: 0 auto; padding: var(--spacing-5) var(--spacing-4) var(--spacing-3); }
.gl-search-wrap {
  position: relative;
  margin-bottom: var(--spacing-4);
}
.gl-search-icon {
  position: absolute;
  left: var(--spacing-3);
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-tertiary);
  pointer-events: none;
}
.gl-search {
  width: 100%;
  background: var(--surface-1);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--spacing-3) var(--spacing-3) var(--spacing-3) calc(var(--spacing-3) + 24px);
  color: var(--text-primary);
  font-family: 'IBM Plex Mono', ui-monospace, monospace;
  font-size: var(--text-size-body);
  outline: none;
  transition: border-color var(--duration-fast) var(--ease-standard), box-shadow var(--duration-fast) var(--ease-standard);
  box-sizing: border-box;
}
.gl-search:focus-visible {
  border-color: var(--purple-500);
  box-shadow: 0 0 0 3px var(--color-focus-ring);
}
.gl-search::placeholder { color: var(--text-tertiary); }

.gl-cats { display: flex; gap: var(--spacing-2); flex-wrap: wrap; }
.gl-cat {
  background: transparent;
  border: 1px solid var(--border-default);
  color: var(--text-secondary);
  font: var(--text-weight-label) var(--text-size-caption)/1 var(--font-primary);
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: 100px;
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard), color var(--duration-fast) var(--ease-standard);
}
.gl-cat:hover { background: var(--surface-2); border-color: var(--border-strong); color: var(--text-primary); }
.gl-cat.active { background: var(--text-primary); border-color: var(--text-primary); color: var(--surface-base); }
.gl-cat:focus-visible { outline: 3px solid var(--color-focus-ring); outline-offset: 2px; }

.gl-count {
  max-width: 920px;
  margin: 0 auto;
  padding: 0 var(--spacing-4) var(--spacing-4);
  font: var(--text-weight-body) var(--text-size-caption)/1 var(--font-primary);
  color: var(--text-tertiary);
  font-family: 'IBM Plex Mono', ui-monospace, monospace;
}

.gl-grid { max-width: 920px; margin: 0 auto; padding: 0 var(--spacing-4) var(--spacing-7); display: grid; grid-template-columns: 1fr; gap: var(--spacing-3); }
.gl-card {
  background: var(--surface-1);
  border: 1px solid var(--border-default);
  box-shadow: var(--shadow-e2);
  border-radius: var(--radius-md);
  padding: var(--spacing-5);
  transition: background-color var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard);
}
.gl-card:hover { background: var(--surface-2); border-color: var(--border-strong); }
.gl-card-top { display: flex; align-items: flex-start; justify-content: space-between; gap: var(--spacing-3); margin-bottom: var(--spacing-3); flex-wrap: wrap; }
.gl-term-name {
  font: var(--text-weight-h3) var(--text-size-h3)/var(--text-lh-h3) var(--font-primary);
  letter-spacing: var(--text-ls-h3);
  color: var(--text-primary);
}
.gl-cat-badge {
  font: var(--text-weight-label) var(--text-size-meta)/1 var(--font-primary);
  padding: 3px 10px;
  border-radius: 100px;
  border: 1px solid var(--border-default);
  background: var(--surface-2);
  color: var(--text-secondary);
  letter-spacing: 0.06em;
  white-space: nowrap;
}
.gl-definition {
  font: var(--text-weight-body) var(--text-size-body)/var(--text-lh-body) var(--font-primary);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-2);
}
.gl-example {
  font: italic var(--text-weight-body) var(--text-size-caption)/var(--text-lh-body) var(--font-primary);
  color: var(--text-tertiary);
  margin-bottom: var(--spacing-3);
}
.gl-see-in { display: flex; align-items: center; gap: var(--spacing-2); flex-wrap: wrap; }
.gl-see-in-label {
  font-family: 'IBM Plex Mono', ui-monospace, monospace;
  font-size: var(--text-size-caption);
  color: var(--text-tertiary);
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.gl-see-in-link {
  font-family: 'IBM Plex Mono', ui-monospace, monospace;
  font-size: var(--text-size-caption);
  color: var(--text-primary);
  text-decoration: none;
  border-bottom: 1px solid var(--text-primary);
  transition: opacity var(--duration-fast) var(--ease-standard);
}
.gl-see-in-link:hover { opacity: 0.7; }

.gl-empty {
  max-width: 920px;
  margin: 0 auto;
  padding: var(--spacing-7) var(--spacing-4);
  text-align: center;
  color: var(--text-tertiary);
  font-family: 'IBM Plex Mono', ui-monospace, monospace;
  font-size: var(--text-size-body);
}
`

export default function Glossary() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const CATEGORIES = ['All', 'Foundations', 'Tokens', 'Sampling', 'Agents', 'Embeddings', 'RAG']

  const filtered = (() => {
    const q = search.toLowerCase()
    const results = TERMS.filter(t => {
      const matchCat = activeCategory === 'All' || t.category === activeCategory
      const matchSearch = !q || t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q)
      return matchCat && matchSearch
    })
    if (!q) return results.sort((a, b) => a.term.localeCompare(b.term))
    // Relevance: exact term match → starts with → term contains → definition only
    const score = t => {
      const term = t.term.toLowerCase()
      if (term === q) return 0
      if (term.startsWith(q)) return 1
      if (term.includes(q)) return 2
      return 3
    }
    return results.sort((a, b) => {
      const diff = score(a) - score(b)
      return diff !== 0 ? diff : a.term.localeCompare(b.term)
    })
  })()

  return (
    <div className="gl-root">
      <style>{css}</style>
      <NavBar />
      <header className="gl-hero">
        <div className="gl-eyebrow">Reference</div>
        <h1 className="gl-title">Glossary</h1>
        <p className="gl-subtitle">Key terms and concepts across all AI Visual Lab topics. Search or filter by category.</p>
      </header>
      <div className="gl-controls">
        <div className="gl-search-wrap">
          <MagnifyingGlassIcon size={16} weight="duotone" className="gl-search-icon" />
          <input
            className="gl-search"
            type="text"
            placeholder="Search terms or definitions…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="gl-cats">
          {CATEGORIES.map(c => (
            <button
              key={c}
              className={`gl-cat${activeCategory === c ? ' active' : ''}`}
              onClick={() => setActiveCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <div className="gl-count">Showing {filtered.length} of {TERMS.length} terms</div>
      {filtered.length === 0 ? (
        <div className="gl-empty">No terms match "{search}".</div>
      ) : (
        <div className="gl-grid">
          {filtered.map(t => (
            <div key={t.id} className="gl-card">
              <div className="gl-card-top">
                <div className="gl-term-name">{t.term}</div>
                <span className="gl-cat-badge">{t.category}</span>
              </div>
              <div className="gl-definition">{t.definition}</div>
              {t.example && <div className="gl-example">e.g. {t.example}</div>}
              {t.seeIn.length > 0 && (
                <div className="gl-see-in">
                  <span className="gl-see-in-label">
                    <ArrowRightIcon size={12} weight="bold" /> see in:
                  </span>
                  {t.seeIn.map((s, i) => (
                    <Link key={i} to={s.path} className="gl-see-in-link">{s.label}</Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
