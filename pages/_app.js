// pages/_app.js
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import '../styles/globals.css'

// Pages that don't require authentication
const publicPages = ['/login', '/auth/callback']

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
      router.replace('/')
    }
  }, [session, loading, router.pathname])

  // Show branded loading spinner while checking auth
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: '#F8F9FC',
        fontFamily: "'Raleway', sans-serif",
      }}>
        <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700&display=swap" rel="stylesheet" />
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 48, height: 48, border: '4px solid #e2e6ed',
            borderTop: '4px solid #C8A951', borderRadius: '50%',
            margin: '0 auto 20px', animation: 'spin 1s linear infinite',
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          <p style={{ color: '#021A35', fontWeight: 600, fontSize: 16 }}>Loading...</p>
        </div>
      </div>
    )
  }

  // If on a protected page with no session, show nothing while redirecting
  const isPublicPage = publicPages.includes(router.pathname)
  if (!session && !isPublicPage) {
    return null
  }

  return <Component {...pageProps} session={session} />
}