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

/* Prism faceted-diamond mark (icon only — no wordmark).
 * fill="currentColor" so it follows the NavBar text color.
 * Source: PrismAI/Marketing26/Prism Logo - Icon Black.svg
 * Minimum size 20px per Prism brand kit §6. */
function PrismMark({ size = 20 }) {
  return (
    <svg
      width={Math.round((size * 227) / 263)}
      height={size}
      viewBox="0 0 227 263"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M113.502 0C136.263 13.142 200.248 52.4526 226 67.5215V194.73C190.401 216.006 152.074 239.749 113.537 262C97.2243 252.581 7.63449 199.172 0 194.623V67.5752C25.6709 52.2003 88.7545 14.289 113.502 0ZM29.5791 181.939C24.3153 184.979 11.0048 192.643 10.8438 193.125C20.4711 198.684 100.304 246.955 110.048 252.581V229.943C97.0792 222.455 48.9508 193.124 29.5791 181.939ZM196.636 181.939C174.669 194.623 128.529 223.147 116.758 229.943V252.581C137.356 240.238 192.943 206.057 215.156 193.231C207.649 188.897 203.829 186.093 196.636 181.939ZM113.504 188.897L113.675 188.794H113.33L113.504 188.897ZM63.8809 159.302L111.05 187.434V132.745L64.1328 105.979L63.8809 159.302ZM6.87109 75.0137C6.87112 98.806 7.4082 160.618 7.4082 187.345C13.4114 183.355 19.8468 179.914 26.0352 176.213L26.3037 86.3057C20.4912 82.9009 13.1084 78.615 6.87109 75.0137ZM199.696 86.4131V175.945C202.324 177.494 215.908 185.201 219.344 187.185C219.344 165.526 219.362 99.8447 219.29 74.9072L199.696 86.4131ZM117.05 132.697V186.762L162.655 159.302C162.655 141.707 162.075 128.784 162.017 106.479L117.05 132.697ZM113.484 73.3555C102.463 79.7189 79.5617 93.2767 67.0879 100.757L114.009 127.524L159.176 101.189C144.348 92.4696 125.233 80.139 113.484 73.3555ZM116.937 32.0938C143.683 48.1451 170.042 64.4542 196.743 80.5801C203.113 76.7699 209.45 72.8928 215.908 69.2344C181.641 49.4489 132.689 18.2313 116.937 9.13574V32.0938ZM110.11 9.13574C106.437 11.2567 43.9355 50.2938 10.5752 69.5557C15.0218 72.1231 28.1097 79.5344 29.3643 80.2588C35.8996 76.4853 99.2302 38.3758 110.11 32.0938V9.13574Z"
        fill="currentColor"
      />
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
          <PrismMark size={20} />
          <span>AI</span><span className="nav-logo-suffix"> Visual Lab</span>
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
