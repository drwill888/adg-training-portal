// pages/auth/callback.js
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabase'

export default function AuthCallback() {
  const router = useRouter()
  const [status, setStatus] = useState('Signing you in...')

  useEffect(() => {
    // The Supabase JS client automatically detects and processes
    // the access_token in the URL hash when it loads.
    // We just need to listen for the SIGNED_IN event.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        subscription.unsubscribe()
        router.replace('/')
      }
    })

    // Also check immediately — token may already be processed
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        subscription.unsubscribe()
        router.replace('/')
      }
    })

    // Timeout: if nothing happens in 10s, send back to login
    const timeout = setTimeout(() => {
      subscription.unsubscribe()
      setStatus('Link expired or already used. Redirecting to login...')
      setTimeout(() => router.replace('/login'), 2000)
    }, 10000)

    return () => {
      subscription.unsubscribe()
      clearTimeout(timeout)
    }
  }, [])

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
        <p style={{ color: '#6b7280', fontSize: 13, marginTop: 8 }}>Please wait...</p>
      </div>
    </div>
  )
}
