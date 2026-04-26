import { SignUp } from '@clerk/clerk-react'
import NavBar from '../components/NavBar.jsx'

export default function SignUpPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#050810' }}>
      <NavBar />
      <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 20px' }}>
        <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" afterSignUpUrl="/" />
      </div>
    </div>
  )
}
