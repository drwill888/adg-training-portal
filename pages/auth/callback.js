// pages/auth/callback.js
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function AuthCallback() {
  const [status, setStatus] = useState('Signing you in...')

  useEffect(() => {
    async function handleCallback() {
      try {
        const hash = window.location.hash
        const params = new URLSearchParams(hash.replace('#', ''))
        const accessToken = params.get('access_token')
        const refreshToken = params.get('refresh_token')

        if (accessToken && refreshToken) {
          // Let the Supabase client handle session properly
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })

          if (error) {
            console.error('Set session error:', error)
            setStatus('Sign in failed. Taking you back...')
            setTimeout(() => { window.location.href = '/login' }, 2000)
            return
          }

          setStatus('Success! Loading your dashboard...')
          setTimeout(() => { window.location.href = '/' }, 500)
        } else {
          // No tokens in hash — check if Supabase already picked up the session
          const { data: { session } } = await supabase.auth.getSession()

          if (session) {
            setStatus('Success! Loading your dashboard...')
            setTimeout(() => { window.location.href = '/' }, 500)
          } else {
            setStatus('Link expired or already used.')
            setTimeout(() => { window.location.href = '/login' }, 2000)
          }
        }
      } catch (err) {
        console.error('Callback error:', err)
        setStatus('Something went wrong. Taking you back...')
        setTimeout(() => { window.location.href = '/login' }, 2000)
      }
    }

    handleCallback()
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