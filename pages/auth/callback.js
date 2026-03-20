// pages/auth/callback.js
// Handles the magic link redirect from Supabase
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabase'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    // Supabase automatically handles the token from the URL
    // Just check the session and redirect
    const handleAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.replace('/')
      } else {
        router.replace('/login')
      }
    }
    handleAuth()
  }, [router])

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
        <p style={{ color: '#021A35', fontWeight: 600, fontSize: 16 }}>Signing you in...</p>
      </div>
    </div>
  )
}
