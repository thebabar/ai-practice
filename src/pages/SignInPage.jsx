import { SignIn } from '@clerk/clerk-react'
import NavBar from '../components/NavBar.jsx'

export default function SignInPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#050810' }}>
      <NavBar />
      <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 20px' }}>
        <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" afterSignInUrl="/" />
      </div>
    </div>
  )
}
