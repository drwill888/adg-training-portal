// pages/auth/callback.js
import { useEffect, useState } from 'react'

export default function AuthCallback() {
  const [status, setStatus] = useState('Signing you in...')

  useEffect(() => {
    try {
      const hash = window.location.hash
      const params = new URLSearchParams(hash.replace('#', ''))
      const accessToken = params.get('access_token')
      const refreshToken = params.get('refresh_token')

      if (accessToken) {
        // Store tokens so supabase client picks them up on next page
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
        const projectRef = supabaseUrl.replace('https://', '').split('.')[0]
        if (projectRef) {
          const storageKey = `sb-${projectRef}-auth-token`
          localStorage.setItem(storageKey, JSON.stringify({
            access_token: accessToken,
            refresh_token: refreshToken,
            token_type: 'bearer',
            expires_at: Math.floor(Date.now() / 1000) + 3600,
          }))
        }
        setStatus('Success! Loading your dashboard...')
        setTimeout(() => { window.location.href = '/' }, 500)
      } else {
        // No hash token — Supabase may have already set the session
        setTimeout(() => {
          const keys = Object.keys(localStorage)
          const authKey = keys.find(k => k.startsWith('sb-') && k.includes('auth-token'))
          if (authKey) {
            try {
              const stored = JSON.parse(localStorage.getItem(authKey))
              if (stored?.access_token) {
                window.location.href = '/'
                return
              }
            } catch {}
          }
          setStatus('Link expired or already used.')
          setTimeout(() => { window.location.href = '/login' }, 2000)
        }, 1500)
      }
    } catch (err) {
      console.error('Callback error:', err)
      setStatus('Something went wrong. Taking you back...')
      setTimeout(() => { window.location.href = '/login' }, 2000)
    }
  }, [])

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
        <p style={{ color: '#021A35', fontWeight: 600, fontSize: 16 }}>{status}</p>
        <p style={{ color: '#6b7280', fontSize: 13, marginTop: 8 }}>Please wait...</p>
      </div>
    </div>
  )
}
