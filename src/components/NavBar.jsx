import { Link, useLocation } from 'react-router-dom'

const navStyle = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap');

  .nav-bar {
    position: sticky;
    top: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 28px;
    background: rgba(5,8,16,0.85);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }

  .nav-logo {
    font-family: 'IBM Plex Sans', sans-serif;
    font-weight: 800;
    font-size: 16px;
    color: #fff;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 8px;
    letter-spacing: -0.01em;
  }

  .nav-logo span { color: #38bdf8; }

  .nav-back {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 16px;
    color: #7a9bbf;
    text-decoration: none;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border: 1px solid #1e3048;
    border-radius: 6px;
    transition: all 0.18s;
  }
  .nav-back:hover { border-color: #38bdf8; color: #38bdf8; }

  .nav-badge {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    color: #38bdf8;
    background: rgba(56,189,248,0.1);
    border: 1px solid rgba(56,189,248,0.25);
    padding: 4px 10px;
    border-radius: 100px;
    letter-spacing: 0.1em;
  }

  .nav-glossary {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    color: #3a5a7a;
    text-decoration: none;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 5px 10px;
    border: 1px solid #1e3048;
    border-radius: 6px;
    transition: all 0.18s;
  }
  .nav-glossary:hover { border-color: #94a3b8; color: #94a3b8; }
  .nav-glossary.active { color: #94a3b8; border-color: #94a3b8; }
`

export default function NavBar({ title }) {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const isGlossary = location.pathname === '/glossary'

  return (
    <>
      <style>{navStyle}</style>
      <nav className="nav-bar">
        <Link to="/" className="nav-logo">
          🧪 <span>AI</span> Visual Lab
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link to="/glossary" className={`nav-glossary${isGlossary ? ' active' : ''}`}>Glossary</Link>
          {!isHome && !isGlossary && (
            <Link to="/" className="nav-back">← Back</Link>
          )}
          {(isHome || isGlossary) && (
            <div className="nav-badge">Interactive Learning</div>
          )}
        </div>
      </nav>
    </>
  )
}
