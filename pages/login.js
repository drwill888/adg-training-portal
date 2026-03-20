// pages/login.js
import { useState } from 'react'
import Head from 'next/head'

const colors = {
  navy: '#021A35', navyLight: '#0a2a4d',
  gold: '#C8A951', skyBlue: '#00AEEF',
  white: '#FFFFFF', offWhite: '#F8F9FC',
  gray200: '#e2e6ed', gray300: '#c8cdd6',
  gray500: '#6b7280', gray700: '#374151',
  red: '#EE3124',
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!email || !name) {
      setError('Please enter your name and email.')
      return
    }
    setLoading(true)
    setError('')

    try {
      // Dynamically import supabase only on client side
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      )

      const { error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: { full_name: name },
        },
      })

      if (authError) {
        setError(`Auth error: ${authError.message}`)
        setLoading(false)
      } else {
        setSent(true)
        setLoading(false)
      }
    } catch (err) {
      setError(`Error: ${err.message}`)
      setLoading(false)
    }
  }

  return (
    <>
      <Head><title>Sign In | 5C Leadership Blueprint</title></Head>
      <div style={{
        minHeight: '100vh', background: colors.navy,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Raleway', sans-serif", padding: '20px',
      }}>
        <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700&family=Cormorant+Garamond:wght@400;600;700&display=swap" rel="stylesheet" />

        <div style={{
          background: colors.white, borderRadius: 16, padding: '48px 40px',
          width: '100%', maxWidth: 440, boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: colors.navy, margin: '0 auto 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, color: colors.gold, fontWeight: 700,
            }}>✦</div>
            <h1 style={{
              fontSize: 22, fontWeight: 700, color: colors.navy,
              margin: '0 0 4px', fontFamily: "'Cormorant Garamond', serif",
            }}>5C Leadership Blueprint</h1>
            <p style={{ fontSize: 13, color: colors.gray500, margin: 0, fontStyle: 'italic' }}>
              Awakening Destiny Global
            </p>
          </div>

          {!sent ? (
            <>
              <p style={{ fontSize: 14, color: colors.gray700, textAlign: 'center', marginBottom: 28, lineHeight: 1.6 }}>
                Enter your name and email to receive your secure sign-in link.
              </p>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: colors.navy, marginBottom: 6, letterSpacing: '0.05em' }}>FULL NAME</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name"
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 8, fontSize: 14, border: `1.5px solid ${colors.gray200}`, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', color: colors.navy }}
                  onFocus={e => e.target.style.borderColor = colors.gold}
                  onBlur={e => e.target.style.borderColor = colors.gray200} />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: colors.navy, marginBottom: 6, letterSpacing: '0.05em' }}>EMAIL ADDRESS</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com"
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 8, fontSize: 14, border: `1.5px solid ${colors.gray200}`, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', color: colors.navy }}
                  onFocus={e => e.target.style.borderColor = colors.gold}
                  onBlur={e => e.target.style.borderColor = colors.gray200} />
              </div>

              {error && (
                <div style={{ padding: '10px 14px', background: '#FEF2F2', borderRadius: 8, marginBottom: 16, borderLeft: `3px solid ${colors.red}` }}>
                  <p style={{ fontSize: 13, color: colors.red, margin: 0 }}>{error}</p>
                </div>
              )}

              <button onClick={handleSubmit} disabled={loading}
                style={{ width: '100%', padding: '14px', borderRadius: 8, fontSize: 14, fontWeight: 700, border: 'none', cursor: loading ? 'default' : 'pointer', background: loading ? colors.gray300 : `linear-gradient(135deg, ${colors.navy}, ${colors.navyLight})`, color: colors.white, transition: 'all 0.2s', fontFamily: 'inherit' }}>
                {loading ? 'Sending...' : 'Send My Sign-In Link →'}
              </button>

              {/* Debug info */}
              <p style={{ fontSize: 10, color: colors.gray300, textAlign: 'center', marginTop: 12 }}>
                URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ set' : '✗ missing'}
              </p>
            </>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#F0FDF4', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>✓</div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: colors.navy, marginBottom: 12 }}>Check your email</h2>
              <p style={{ fontSize: 14, color: colors.gray700, lineHeight: 1.7, marginBottom: 8 }}>We sent a sign-in link to</p>
              <p style={{ fontSize: 14, fontWeight: 600, color: colors.navy, marginBottom: 20 }}>{email}</p>
              <p style={{ fontSize: 13, color: colors.gray500, lineHeight: 1.6 }}>Click the link in the email to access your Leadership Blueprint. The link expires in 1 hour.</p>
              <button onClick={() => setSent(false)} style={{ marginTop: 24, fontSize: 13, color: colors.gold, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}>← Use a different email</button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
