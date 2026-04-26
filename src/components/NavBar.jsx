import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'
import { useApiKey } from '../hooks/useApiKey.js'
import ApiKeyModal from './ApiKeyModal.jsx'

const CLERK_ENABLED = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY)

function KeyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="7.5" cy="15.5" r="3.5" />
      <path d="M10 13l8.5-8.5" />
      <path d="M16 7l3 3" />
      <path d="M18.5 4.5l2 2" />
    </svg>
  )
}

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

  .nav-keybtn {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 28px;
    padding: 0;
    background: transparent;
    border: 1px solid #1e3048;
    border-radius: 6px;
    color: #7a9bbf;
    cursor: pointer;
    transition: all 0.18s;
  }
  .nav-keybtn:hover { border-color: #94a3b8; color: #e2e8f0; }
  .nav-keybtn-dot {
    position: absolute;
    top: -3px;
    right: -3px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #34d399;
    box-shadow: 0 0 0 2px #050810, 0 0 6px rgba(52,211,153,0.6);
  }
`

export default function NavBar({ title }) {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const isGlossary = location.pathname === '/glossary'
  const { hasKey } = useApiKey()
  const [keyModalOpen, setKeyModalOpen] = useState(false)

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
          {CLERK_ENABLED && (
            <>
              <SignedOut>
                <Link to="/sign-in" className="nav-glossary">Sign in</Link>
              </SignedOut>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </>
          )}
          <button
            type="button"
            className="nav-keybtn"
            onClick={() => setKeyModalOpen(true)}
            aria-label={hasKey ? 'API key configured — manage' : 'Set API key'}
            title={hasKey ? 'API key configured' : 'Set API key'}
          >
            <KeyIcon />
            {hasKey && <span className="nav-keybtn-dot" aria-hidden="true" />}
          </button>
        </div>
      </nav>
      <ApiKeyModal open={keyModalOpen} onClose={() => setKeyModalOpen(false)} />
    </>
  )
}
