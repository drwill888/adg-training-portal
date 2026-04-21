// pages/called-to-carry/assessment/index.js
// Assessment entry page — collects name + email before starting questions.

import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function AssessmentLanding() {
  const router = useRouter();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!form.firstName.trim()) return setError('Please enter your first name.');
    if (!form.email.trim() || !form.email.includes('@')) return setError('Please enter a valid email address.');

    setLoading(true);

    // Store in sessionStorage so the start page can read it
    sessionStorage.setItem('ctc_lead', JSON.stringify({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.toLowerCase().trim(),
    }));

    const ctcBase = router.asPath.startsWith('/called-to-carry') ? '/called-to-carry' : '';
    router.push(`${ctcBase}/assessment/start`);
  }

  return (
    <div style={styles.page}>
      <Head>
        <title>Called to Carry Assessment</title>
        <meta name="description" content="10 questions. 6 minutes. One clear next step for your leadership." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </Head>

      <main style={styles.main}>
        <p style={styles.eyebrow}>Called to Carry · Leadership Assessment</p>
        <h1 style={styles.headline}>
          What are you<br /><em>actually carrying?</em>
        </h1>
        <p style={styles.sub}>
          10 questions. About 6 minutes. A personalised result that names exactly where you are
          in your leadership journey — and your clearest next step.
        </p>

        <form onSubmit={handleSubmit} style={styles.form} noValidate>
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label} htmlFor="firstName">First name *</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                value={form.firstName}
                onChange={handleChange}
                style={styles.input}
                placeholder="Will"
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label} htmlFor="lastName">Last name</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                value={form.lastName}
                onChange={handleChange}
                style={styles.input}
                placeholder="Meier"
              />
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label} htmlFor="email">Email address *</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              style={styles.input}
              placeholder="you@example.com"
            />
          </div>

          <p style={styles.consent}>
            By continuing you agree to receive your results and occasional emails from Awakening Destiny Global.
            You can unsubscribe any time.
          </p>

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? 'Starting…' : 'Begin the Assessment →'}
          </button>
        </form>

        <p style={styles.footer}>
          Free · No payment required · Results sent to your email
        </p>
      </main>
    </div>
  );
}

const styles = {
  page: {
    background: '#021A35',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 1rem',
    fontFamily: "'Georgia', serif",
    color: '#FDF8F0',
  },
  main: {
    maxWidth: '520px',
    width: '100%',
    textAlign: 'center',
  },
  eyebrow: {
    color: '#C8A951',
    letterSpacing: '0.12em',
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    fontFamily: "'Outfit', sans-serif",
    marginBottom: '1.5rem',
  },
  headline: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: 'clamp(2rem, 5vw, 3rem)',
    fontWeight: 400,
    lineHeight: 1.2,
    marginBottom: '1.25rem',
  },
  sub: {
    fontSize: '1rem',
    lineHeight: 1.75,
    opacity: 0.8,
    marginBottom: '2.5rem',
  },
  form: {
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  label: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: '0.82rem',
    opacity: 0.7,
    letterSpacing: '0.04em',
  },
  input: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '4px',
    color: '#FDF8F0',
    fontFamily: "'Outfit', sans-serif",
    fontSize: '1rem',
    padding: '0.75rem 1rem',
    outline: 'none',
    width: '100%',
  },
  consent: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: '0.78rem',
    opacity: 0.5,
    lineHeight: 1.6,
  },
  error: {
    color: '#f87171',
    fontFamily: "'Outfit', sans-serif",
    fontSize: '0.88rem',
  },
  btn: {
    background: '#C8A951',
    color: '#021A35',
    border: 'none',
    borderRadius: '4px',
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 600,
    fontSize: '1rem',
    padding: '0.9rem 2rem',
    cursor: 'pointer',
    width: '100%',
    marginTop: '0.5rem',
  },
  footer: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: '0.8rem',
    opacity: 0.45,
    marginTop: '1.5rem',
  },
};
