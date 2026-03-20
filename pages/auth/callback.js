// pages/auth/callback.js
// Handles the magic link redirect from Supabase
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabase'

export default function AuthCallback() {
  const router = useRouter()
  const [status, setStatus] = useState('Signing you in...')

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const { code, error: urlError } = router.query

        if (urlError) {
          setStatus('Link expired or invalid. Redirecting...')
          setTimeout(() => router.replace('/login'), 2000)
          return
        }

        if (code) {
          // Supabase v2 PKCE flow — exchange code for session
          const { error } = await supabase.auth.exchangeCodeForSession(code)
          if (error) {
            setStatus('Sign in failed. Redirecting...')
            setTimeout(() => router.replace('/login'), 2000)
            return
          }
          router.replace('/')
          return
        }

        // Fallback: listen for auth state change (handles hash-based tokens)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          if (event === 'SIGNED_IN' && session) {
            subscription.unsubscribe()
            router.replace('/')
          }
        })

        // Also check existing session
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          subscription.unsubscribe()
          router.replace('/')
          return
        }

        // Timeout fallback
        setTimeout(() => {
          subscription.unsubscribe()
          setStatus('Link may have expired. Please try again.')
          setTimeout(() => router.replace('/login'), 2500)
        }, 8000)

      } catch (err) {
        setStatus('Something went wrong. Redirecting...')
        setTimeout(() => router.replace('/login'), 2000)
      }
    }

    if (router.isReady) {
      handleAuth()
    }
  }, [router.isReady, router.query])

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#F8F9FC',
      fontFamily: "'Raleway', sans-serif"
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700&display=swap" rel="stylesheet" />
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 48, height: 48, border: '4px solid #e2e6ed',
          borderTop: '4px solid #C8A951', borderRadius: '50%',
          margin: '0 auto 20px', animation: 'spin 1s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        <p style={{ color: '#021A35', fontWeight: 600, fontSize: 16 }}>{status}</p>
      </div>
    </div>
  )
}
