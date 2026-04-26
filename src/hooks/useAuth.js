import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-react'

const CLERK_ENABLED = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY)

function useAuthEnabled() {
  const { isLoaded, isSignedIn, signOut } = useClerkAuth()
  const { user } = useUser()
  return {
    isLoaded,
    isSignedIn: !!isSignedIn,
    user: user ?? null,
    signOut,
  }
}

function useAuthDisabled() {
  return {
    isLoaded: true,
    isSignedIn: false,
    user: null,
    signOut: async () => {},
  }
}

export const useAuth = CLERK_ENABLED ? useAuthEnabled : useAuthDisabled
export { CLERK_ENABLED }
