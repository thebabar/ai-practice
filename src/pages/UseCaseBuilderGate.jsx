import { useState } from 'react'
import { useSignIn, useSignUp } from '@clerk/clerk-react'
import NavBar from '../components/NavBar.jsx'
import UseCaseBuilder from './UseCaseBuilder.jsx'
import { useAuth, CLERK_ENABLED } from '../hooks/useAuth.js'

const ACCENT = '#38bdf8'

const css = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap');

.ucbg-root { min-height: 100vh; background: #050810; color: #e0e8f0; font-family: 'IBM Plex Sans', sans-serif; }
.ucbg-wrap {
  display: flex; align-items: flex-start; justify-content: center;
  padding: 80px 24px 60px; min-height: calc(100vh - 60px);
}
.ucbg-card {
  width: 100%; max-width: 440px;
  background: #0a0d14; border: 1px solid rgba(255,255,255,0.08); border-radius: 14px;
  padding: 40px 36px;
}
.ucbg-eyebrow {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase;
  color: ${ACCENT}; margin-bottom: 12px;
}
.ucbg-title { font-size: 26px; font-weight: 700; letter-spacing: -0.01em; color: #fff; margin: 0 0 12px; }
.ucbg-sub { font-size: 14px; color: #7a8da8; line-height: 1.6; margin: 0 0 28px; }

.ucbg-form { display: flex; flex-direction: column; gap: 12px; }
.ucbg-input {
  background: #050810; color: #e0e8f0;
  border: 1px solid rgba(255,255,255,0.12); border-radius: 8px;
  padding: 12px 14px; font-size: 15px; font-family: 'IBM Plex Sans', sans-serif;
  outline: none; transition: border-color 0.15s;
}
.ucbg-input:focus { border-color: ${ACCENT}; }
.ucbg-input::placeholder { color: #3a4a5e; }
.ucbg-input:disabled { opacity: 0.6; }

.ucbg-btn {
  background: ${ACCENT}; color: #050810;
  border: none; border-radius: 8px;
  padding: 12px 16px; font-size: 14px; font-weight: 600;
  font-family: 'IBM Plex Sans', sans-serif;
  cursor: pointer; transition: opacity 0.15s;
}
.ucbg-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.ucbg-btn.ghost {
  background: transparent; color: #7a8da8;
  border: 1px solid rgba(255,255,255,0.12);
  margin-top: 16px;
}
.ucbg-btn.ghost:hover { color: #e0e8f0; border-color: rgba(255,255,255,0.25); }

.ucbg-err {
  margin-top: 14px; padding: 10px 12px;
  background: rgba(248,113,113,0.08); border: 1px solid rgba(248,113,113,0.25);
  border-radius: 8px; color: #f87171; font-size: 13px;
  font-family: 'IBM Plex Mono', monospace;
}
.ucbg-loading { color: #7a8da8; font-size: 14px; padding: 80px 24px; text-align: center; }
.ucbg-config {
  background: rgba(248,113,113,0.06); border: 1px solid rgba(248,113,113,0.25);
  border-radius: 10px; padding: 20px; color: #f87171;
  font-family: 'IBM Plex Mono', monospace; font-size: 13px; line-height: 1.6;
}
`

function humanize(err) {
  const first = err?.errors?.[0]
  if (first?.longMessage) return first.longMessage
  if (first?.message) return first.message
  if (err?.message) return err.message
  return ''
}

export default function UseCaseBuilderGate() {
  if (!CLERK_ENABLED) {
    return <ConfigNotice />
  }
  return <ClerkAwareGate />
}

function ConfigNotice() {
  return (
    <div className="ucbg-root">
      <style>{css}</style>
      <NavBar />
      <div className="ucbg-wrap">
        <div className="ucbg-card">
          <div className="ucbg-eyebrow">Setup required</div>
          <h1 className="ucbg-title">AI Use Case Builder</h1>
          <div className="ucbg-config">
            Clerk is not configured. Set <strong>VITE_CLERK_PUBLISHABLE_KEY</strong> in your environment and enable email-link sign-in in the Clerk dashboard.
          </div>
        </div>
      </div>
    </div>
  )
}

function ClerkAwareGate() {
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) {
    return (
      <div className="ucbg-root">
        <style>{css}</style>
        <NavBar />
        <div className="ucbg-loading">Loading…</div>
      </div>
    )
  }
  if (isSignedIn) {
    return <UseCaseBuilder />
  }
  return <MagicLinkGate />
}

function MagicLinkGate() {
  const { signIn, isLoaded: signInLoaded } = useSignIn()
  const { signUp, isLoaded: signUpLoaded } = useSignUp()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [errorMessage, setErrorMessage] = useState('')

  const ready = signInLoaded && signUpLoaded
  const trimmed = email.trim()

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!ready || !trimmed || status === 'sending') return
    setStatus('sending')
    setErrorMessage('')

    const redirectUrl = window.location.origin + '/use-case-builder/verify'

    try {
      const si = await signIn.create({ identifier: trimmed })
      const factor = si.supportedFirstFactors?.find((f) => f.strategy === 'email_link')
      if (!factor) {
        throw new Error('Email link sign-in is not enabled. Turn on the Email link strategy in the Clerk dashboard.')
      }
      const flow = signIn.createEmailLinkFlow()
      flow.startEmailLinkFlow({
        emailAddressId: factor.emailAddressId,
        redirectUrl,
      }).catch(() => { /* verify page handles activation */ })
      setStatus('sent')
    } catch (err) {
      const code = err?.errors?.[0]?.code
      if (code === 'form_identifier_not_found') {
        try {
          await signUp.create({ emailAddress: trimmed })
          const flow = signUp.createEmailLinkFlow()
          flow.startEmailLinkFlow({ redirectUrl }).catch(() => {})
          setStatus('sent')
        } catch (err2) {
          setStatus('error')
          setErrorMessage(humanize(err2) || 'Could not send the email. Please try again.')
        }
      } else {
        setStatus('error')
        setErrorMessage(humanize(err) || 'Could not send the email. Please try again.')
      }
    }
  }

  return (
    <div className="ucbg-root">
      <style>{css}</style>
      <NavBar />
      <div className="ucbg-wrap">
        <div className="ucbg-card">
          {status === 'sent' ? (
            <>
              <div className="ucbg-eyebrow">Check your email</div>
              <h1 className="ucbg-title">We sent you a link</h1>
              <p className="ucbg-sub">
                We emailed a sign-in link to <strong style={{ color: '#e0e8f0' }}>{trimmed}</strong>. Click the link to access the AI Use Case Builder. You can close this tab.
              </p>
              <button type="button" className="ucbg-btn ghost" onClick={() => { setStatus('idle'); setEmail('') }}>
                Use a different email
              </button>
            </>
          ) : (
            <>
              <div className="ucbg-eyebrow">Sign in</div>
              <h1 className="ucbg-title">AI Use Case Builder</h1>
              <p className="ucbg-sub">Enter your email and we'll send you a one-click link. No password.</p>
              <form className="ucbg-form" onSubmit={onSubmit}>
                <input
                  type="email"
                  required
                  autoFocus
                  className="ucbg-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'sending'}
                />
                <button
                  type="submit"
                  className="ucbg-btn"
                  disabled={!ready || !trimmed || status === 'sending'}
                >
                  {status === 'sending' ? 'Sending…' : 'Send me access'}
                </button>
              </form>
              {errorMessage && <div className="ucbg-err">{errorMessage}</div>}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
