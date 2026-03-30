// pages/_app.js
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import { colors, fonts } from '../styles/tokens'
import '../styles/globals.css'
import TrainingChat from '../components/TrainingChat'

// Pages that don't require authentication
const publicPages = ['/login', '/auth/callback', '/auth/reset-password', '/', '/assessment']

export default function App({ Component, pageProps }) {
  const router = useRouter()
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Listen for auth state changes (sign in, sign out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (loading) return

    const isPublicPage = publicPages.includes(router.pathname)

    if (!session && !isPublicPage) {
      // No session + protected page = go to login
      router.replace('/login')
    } else if (session && router.pathname === '/login') {
      // Already signed in + on login page = go to dashboard
      router.replace('/dashboard')
    }
  }, [session, loading, router.pathname])

  // Show branded loading spinner while checking auth
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: colors.navy,
        fontFamily: fonts.body,
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 48, height: 48, border: '4px solid ' + colors.gray200,
            borderTop: '4px solid ' + colors.gold, borderRadius: '50%',
            margin: '0 auto 20px', animation: 'spin 1s linear infinite',
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          <p style={{ color: colors.navy, fontWeight: 600, fontSize: 16 }}>Loading...</p>
        </div>
      </div>
    )
  }

  // If on a protected page with no session, show nothing while redirecting
  const isPublicPage = publicPages.includes(router.pathname)
  if (!session && !isPublicPage) {
    return null
  }

return (
    <>
      <Component {...pageProps} session={session} />
      <TrainingChat />
    </>
  )
}