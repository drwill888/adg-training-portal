// pages/auth/reset-password.js
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Head from 'next/head'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Supabase will automatically pick up the recovery token from the URL
    // and establish a session. We listen for that event.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setReady(true)
      }
    })

    // Also check if session already exists (user may have refreshed)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setReady(true)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleReset = async () => {
    if (!password) { setError('Please enter a new password.'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return }

    setLoading(true)
    setError('')

    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setMessage('Password updated! Redirecting to your dashboard...')
    setTimeout(() => { window.location.href = '/' }, 2000)
  }

  const navy = '#021A35', gold = '#C8A951', gray = '#6b7280'

  return (
    <>
      <Head><title>Set New Password | 5C Leadership Blueprint</title></Head>
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8F9FC', fontFamily: "'Raleway', sans-serif" }}>
        <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700&display=swap" rel="stylesheet" />
        <div style={{ width: '100%', maxWidth: 420, padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h1 style={{ color: navy, fontSize: 24, fontWeight: 700, margin: '0 0 4px' }}>5C Leadership Blueprint</h1>
            <p style={{ color: gold, fontSize: 13, margin: 0, fontStyle: 'italic' }}>Awakening Destiny Global</p>
          </div>
          <div style={{ background: '#fff', borderRadius: 12, padding: 32, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
            {!ready && !message ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: 48, height: 48, border: '4px solid #e2e6ed',
                  borderTop: '4px solid ' + gold, borderRadius: '50%',
                  margin: '0 auto 20px', animation: 'spin 1s linear infinite',
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
                <p style={{ color: navy, fontWeight: 600, fontSize: 14 }}>Verifying your reset link...</p>
                <p style={{ color: gray, fontSize: 13, marginTop: 8 }}>
                  If this takes too long, your link may have expired.{' '}
                  <span onClick={() => { window.location.href = '/login' }}
                    style={{ color: '#0172BC', cursor: 'pointer', fontWeight: 600 }}>
                    Request a new one
                  </span>
                </p>
              </div>
            ) : (
              <>
                <h2 style={{ color: navy, fontSize: 18, fontWeight: 700, margin: '0 0 24px' }}>
                  Set New Password
                </h2>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: navy, marginBottom: 6 }}>New Password</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e6ed', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', outline: 'none' }}
                    placeholder="At least 6 characters" onKeyDown={e => e.key === 'Enter' && handleReset()} />
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: navy, marginBottom: 6 }}>Confirm Password</label>
                  <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e6ed', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', outline: 'none' }}
                    placeholder="••••••••" onKeyDown={e => e.key === 'Enter' && handleReset()} />
                </div>
                {error && <p style={{ color: '#EE3124', fontSize: 13, marginBottom: 16 }}>{error}</p>}
                {message && <p style={{ color: '#0172BC', fontSize: 13, marginBottom: 16 }}>{message}</p>}
                <button onClick={handleReset} disabled={loading || !!message}
                  style={{ width: '100%', padding: '12px', background: navy, color: '#FDD20D', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: loading ? 'default' : 'pointer', opacity: loading || message ? 0.7 : 1 }}>
                  {loading ? 'Please wait...' : 'Update Password'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}