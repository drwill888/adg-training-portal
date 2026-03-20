// pages/login.js
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import Head from 'next/head'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!email || !password) { setError('Email and password required'); return }
    setLoading(true)
    setError('')

    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) { setError(error.message); setLoading(false); return }
      // Wait for session to be established
      if (data?.session) {
        window.location.href = '/'
      } else {
        // Try signing in immediately after signup
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
        if (signInError) { setError(signInError.message); setLoading(false); return }
        window.location.href = '/'
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { setError(error.message); setLoading(false); return }
      window.location.href = '/'
    }
  }

  const navy = '#021A35', gold = '#C8A951', gray = '#6b7280'

  return (
    <>
      <Head><title>Sign In | 5C Leadership Blueprint</title></Head>
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8F9FC', fontFamily: "'Raleway', sans-serif" }}>
        <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;600;700&display=swap" rel="stylesheet" />
        <div style={{ width: '100%', maxWidth: 420, padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h1 style={{ color: navy, fontSize: 24, fontWeight: 700, margin: '0 0 4px' }}>5C Leadership Blueprint</h1>
            <p style={{ color: gold, fontSize: 13, margin: 0, fontStyle: 'italic' }}>Awakening Destiny Global</p>
          </div>
          <div style={{ background: '#fff', borderRadius: 12, padding: 32, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
            <h2 style={{ color: navy, fontSize: 18, fontWeight: 700, margin: '0 0 24px' }}>
              {isSignUp ? 'Create Account' : 'Sign In'}
            </h2>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: navy, marginBottom: 6 }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e6ed', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', outline: 'none' }}
                placeholder="your@email.com" onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: navy, marginBottom: 6 }}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e6ed', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', outline: 'none' }}
                placeholder="••••••••" onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
            </div>
            {error && <p style={{ color: '#EE3124', fontSize: 13, marginBottom: 16 }}>{error}</p>}
            <button onClick={handleSubmit} disabled={loading}
              style={{ width: '100%', padding: '12px', background: navy, color: '#FDD20D', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: loading ? 'default' : 'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
            </button>
            <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: gray }}>
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
              <span onClick={() => { setIsSignUp(!isSignUp); setError('') }}
                style={{ color: '#0172BC', cursor: 'pointer', fontWeight: 600 }}>
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
