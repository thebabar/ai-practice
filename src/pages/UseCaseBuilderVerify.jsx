import { useEffect, useState } from 'react'
import { useClerk } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar.jsx'
import { CLERK_ENABLED } from '../hooks/useAuth.js'

const css = `
.ucbv-root { min-height: 100vh; background: #050810; color: #e0e8f0; font-family: 'IBM Plex Sans', sans-serif; }
.ucbv-wrap {
  display: flex; align-items: flex-start; justify-content: center;
  padding: 100px 24px;
}
.ucbv-card {
  width: 100%; max-width: 420px;
  background: #0a0d14; border: 1px solid rgba(255,255,255,0.08); border-radius: 14px;
  padding: 36px;
}
.ucbv-msg { color: #7a8da8; font-size: 14px; line-height: 1.6; margin: 0; }
.ucbv-err { color: #f87171; font-family: 'IBM Plex Mono', monospace; font-size: 13px; line-height: 1.6; }
`

export default function UseCaseBuilderVerify() {
  if (!CLERK_ENABLED) {
    return (
      <div className="ucbv-root">
        <style>{css}</style>
        <NavBar />
        <div className="ucbv-wrap">
          <div className="ucbv-card">
            <p className="ucbv-msg">Clerk is not configured.</p>
          </div>
        </div>
      </div>
    )
  }
  return <ClerkVerify />
}

function ClerkVerify() {
  const clerk = useClerk()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function run() {
      try {
        await clerk.handleEmailLinkVerification({
          redirectUrl: '/use-case-builder/verify',
          redirectUrlComplete: '/use-case-builder',
        })
        if (!cancelled) navigate('/use-case-builder', { replace: true })
      } catch (e) {
        if (!cancelled) {
          const msg = e?.errors?.[0]?.longMessage || e?.errors?.[0]?.message || e?.message || 'Could not verify the link. It may have expired.'
          setError(msg)
        }
      }
    }
    run()
    return () => { cancelled = true }
  }, [clerk, navigate])

  return (
    <div className="ucbv-root">
      <style>{css}</style>
      <NavBar />
      <div className="ucbv-wrap">
        <div className="ucbv-card">
          {error ? (
            <p className="ucbv-err">{error}</p>
          ) : (
            <p className="ucbv-msg">Verifying your sign-in link…</p>
          )}
        </div>
      </div>
    </div>
  )
}
