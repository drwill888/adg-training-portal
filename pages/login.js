// pages/login.js
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { colors, fonts } from '../styles/tokens'

export default function LoginPage({ session }) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [isForgot, setIsForgot] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  // If session is passed from _app.js, redirect to dashboard
  useEffect(() => {
    if (session) {
      router.replace('/')
    }
  }, [session])

  const handleSubmit = async () => {
    if (!email || (!isForgot && !password)) {
      setError(isForgot ? 'Email required' : 'Email and password required')
      return
    }
    setLoading(true)
    setError('')
    setMessage('')

    if (isForgot) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/auth/reset-password',
      })
      if (error) { setError(error.message); setLoading(false); return }
      setMessage('Check your email for a password reset link.')
      setLoading(false)
      return
    }

    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) { setError(error.message); setLoading(false); return }

      if (data?.session) {
        window.location.href = '/'
      } else if (data?.user && !data?.session) {
        setMessage('Check your email for a confirmation link, then sign in.')
        setLoading(false)
      } else {
        setError('Something went wrong. Please try again.')
        setLoading(false)
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { setError(error.message); setLoading(false); return }

      const { data: { session: confirmedSession } } = await supabase.auth.getSession()
      if (confirmedSession) {
        window.location.href = '/'
      } else {
        setError('Sign in succeeded but session was not established. Please try again.')
        setLoading(false)
      }
    }
  }

  const navy = colors.navy, gold = colors.gold, gray = colors.gray500

  return (
    <>
      <Head>
        <title>Sign In | 5C Leadership Blueprint</title>
        <meta name="description" content="Sign in to your 5C Leadership Blueprint account to continue your formation journey." />
        <meta property="og:title" content="Sign In | 5C Leadership Blueprint" />
        <meta property="og:description" content="Sign in to your 5C Leadership Blueprint account to continue your formation journey." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://5cblueprint.awakeningdestiny.global/login" />
        <meta property="og:site_name" content="5C Leadership Blueprint" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Sign In | 5C Leadership Blueprint" />
        <meta name="twitter:description" content="Sign in to your 5C Leadership Blueprint account to continue your formation journey." />
      </Head>
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: colors.navy, fontFamily: fonts.body }}>
        <div style={{ width: '100%', maxWidth: 420, padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h1 style={{ color: colors.cream, fontSize: 24, fontWeight: 700, margin: '0 0 4px' }}>5C Leadership Blueprint</h1>
            <p style={{ color: gold, fontSize: 13, margin: 0, fontStyle: 'italic' }}>Awakening Destiny Global</p>
          </div>
          <div style={{ background: colors.navyLight, borderRadius: 12, padding: 32, border: '1px solid rgba(253,210,13,0.15)' }}>
            <h2 style={{ color: colors.cream, fontSize: 18, fontWeight: 700, margin: '0 0 24px' }}>
              {isForgot ? 'Reset Password' : isSignUp ? 'Create Account' : 'Sign In'}
            </h2>
            {isForgot && (
              <p style={{ fontSize: 13, color: gray, marginBottom: 20, lineHeight: 1.5 }}>
                Enter your email and we'll send you a link to reset your password.
              </p>
            )}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: colors.cream, marginBottom: 6 }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid rgba(253,210,13,0.2)', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', outline: 'none', background: colors.navyMid, color: colors.cream }}
                placeholder="your@email.com" onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
            </div>
            {!isForgot && (
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: colors.cream, marginBottom: 6 }}>Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid rgba(253,210,13,0.2)', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', outline: 'none', background: colors.navyMid, color: colors.cream }}
                  placeholder="••••••••" onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
              </div>
            )}
            {error && <p style={{ color: '#EE3124', fontSize: 13, marginBottom: 16 }}>{error}</p>}
            {message && <p style={{ color: '#0172BC', fontSize: 13, marginBottom: 16 }}>{message}</p>}
            <button onClick={handleSubmit} disabled={loading}
              style={{ width: '100%', padding: '12px', background: gold, color: navy, border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: loading ? 'default' : 'pointer', opacity: loading ? 0.7 : 1, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              {loading ? 'Please wait...' : isForgot ? 'Send Reset Link' : isSignUp ? 'Create Account' : 'Sign In'}
            </button>
            {!isForgot && !isSignUp && (
              <p style={{ textAlign: 'center', marginTop: 12, fontSize: 13 }}>
                <span onClick={() => { setIsForgot(true); setError(''); setMessage('') }}
                  style={{ color: '#0172BC', cursor: 'pointer', fontWeight: 600 }}>
                  Forgot password?
                </span>
              </p>
            )}
            <p style={{ textAlign: 'center', marginTop: 12, fontSize: 13, color: colors.gray300 }}>
              {isForgot ? (
                <span onClick={() => { setIsForgot(false); setError(''); setMessage('') }}
                  style={{ color: '#0172BC', cursor: 'pointer', fontWeight: 600 }}>
                  Back to Sign In
                </span>
              ) : (
                <>
                  {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                  <span onClick={() => { setIsSignUp(!isSignUp); setError(''); setMessage('') }}
                    style={{ color: '#0172BC', cursor: 'pointer', fontWeight: 600 }}>
                    {isSignUp ? 'Sign In' : 'Sign Up'}
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}