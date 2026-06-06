import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'
import { SunIcon, MoonIcon } from '@phosphor-icons/react'
import { useApiKey } from '../hooks/useApiKey.js'
import ApiKeyModal from './ApiKeyModal.jsx'

const CLERK_ENABLED = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY)
const THEME_STORAGE_KEY = 'ai-visual-lab-theme'

function resolveInitialTheme() {
  if (typeof window === 'undefined') return 'light'
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch { /* ignore */ }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function useTheme() {
  const [theme, setTheme] = useState(() => {
    const initial = resolveInitialTheme()
    if (typeof document !== 'undefined') document.documentElement.dataset.theme = initial
    return initial
  })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem(THEME_STORAGE_KEY, theme) } catch { /* ignore */ }
  }, [theme])

  return [theme, () => setTheme(t => (t === 'dark' ? 'light' : 'dark'))]
}

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

  .nav-themebtn {
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
  .nav-themebtn:hover { border-color: #94a3b8; color: #e2e8f0; }

  /* Right-side controls cluster — gap shrinks on mobile */
  .nav-right {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }

  .nav-logo-suffix { display: inline; }

  @media (max-width: 720px) {
    .nav-bar { padding: 10px 14px; gap: 8px; }
    .nav-right { gap: 6px; }
    .nav-logo { font-size: 14px; gap: 6px; }
    /* Hide the "Visual Lab" tail and the decorative badge to free up space */
    .nav-logo-suffix { display: none; }
    .nav-badge { display: none; }
    .nav-glossary {
      font-size: 11px;
      padding: 4px 8px;
      letter-spacing: 0.04em;
    }
    .nav-back {
      font-size: 12px;
      padding: 4px 8px;
      letter-spacing: 0.04em;
    }
  }

  @media (max-width: 480px) {
    /* Glossary becomes icon-style: drop letter-spacing, very compact */
    .nav-glossary { padding: 4px 6px; font-size: 10px; }
    .nav-back     { padding: 4px 6px; font-size: 11px; }
  }
`

export default function NavBar({ title }) {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const isGlossary = location.pathname === '/glossary'
  const { hasKey } = useApiKey()
  const [keyModalOpen, setKeyModalOpen] = useState(false)
  const [theme, toggleTheme] = useTheme()

  return (
    <>
      <style>{navStyle}</style>
      <nav className="nav-bar">
        <Link to="/" className="nav-logo">
          🧪 <span>AI</span><span className="nav-logo-suffix"> Visual Lab</span>
        </Link>
        <div className="nav-right">
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
            className="nav-themebtn"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {theme === 'dark'
              ? <SunIcon size={16} weight="duotone" />
              : <MoonIcon size={16} weight="duotone" />}
          </button>
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
