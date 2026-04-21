// pages/cohort/apply.js
// Application form for the Called to Carry Founder Cohort.
// On submit: saves to Supabase `cohort_applications` table + triggers Resend confirmation email.

import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import styles from '../../styles/CohortApply.module.css';

const ARCHETYPES = [
  'The Burden Bearer',
  'The Builder',
  'The Prophetic Voice',
  'The Covenant Keeper',
  'The Equipper',
  'The Reformer',
  'I have not taken the assessment yet',
];

const STAGES = [
  'Emerging — discovering my calling',
  'Developing — building the foundation',
  'Established — scaling with purpose',
  'Executive — leading at full capacity',
];

export default function CohortApply() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    archetype: '',
    stage: '',
    businessOrMinistry: '',
    whyNow: '',
    commitment: false,
  });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const set = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/cohort/submit-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Submission failed. Please try again.');
      }

      setStatus('success');
      window.location.href = '/cohort/thank-you?applied=true';
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message);
    }
  };

  return (
    <>
      <Head>
        <title>Apply — Founder Cohort · Called to Carry</title>
        <meta
          name="description"
          content="Apply for the Called to Carry Founder Cohort. Limited seats. Kingdom leaders only."
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=Outfit:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className={styles.page}>
        <nav className={styles.nav}>
          <Link href="/cohort" className={styles.navBack}>
            ← Back to Cohort
          </Link>
          <span className={styles.navTitle}>Founder Cohort Application</span>
        </nav>

        <main className={styles.main}>
          <div className={styles.header}>
            <p className={styles.eyebrow}>Limited Enrollment · Founder Cohort</p>
            <h1 className={styles.heading}>Tell Us About Yourself</h1>
            <p className={styles.sub}>
              Every seat in this cohort is intentional. This brief application helps us confirm
              fit and prepare for your arrival. Takes 5 minutes.
            </p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            {/* ── Personal Info ── */}
            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>Personal Information</legend>

              <div className={styles.row2}>
                <div className={styles.field}>
                  <label htmlFor="firstName" className={styles.label}>First Name *</label>
                  <input
                    id="firstName"
                    type="text"
                    required
                    className={styles.input}
                    value={form.firstName}
                    onChange={set('firstName')}
                    placeholder="First"
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="lastName" className={styles.label}>Last Name *</label>
                  <input
                    id="lastName"
                    type="text"
                    required
                    className={styles.input}
                    value={form.lastName}
                    onChange={set('lastName')}
                    placeholder="Last"
                  />
                </div>
              </div>

              <div className={styles.row2}>
                <div className={styles.field}>
                  <label htmlFor="email" className={styles.label}>Email Address *</label>
                  <input
                    id="email"
                    type="email"
                    required
                    className={styles.input}
                    value={form.email}
                    onChange={set('email')}
                    placeholder="you@email.com"
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="phone" className={styles.label}>Phone (optional)</label>
                  <input
                    id="phone"
                    type="tel"
                    className={styles.input}
                    value={form.phone}
                    onChange={set('phone')}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="city" className={styles.label}>City & State / Country *</label>
                <input
                  id="city"
                  type="text"
                  required
                  className={styles.input}
                  value={form.city}
                  onChange={set('city')}
                  placeholder="e.g. Atlanta, GA"
                />
              </div>
            </fieldset>

            {/* ── Context ── */}
            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>Your Assignment</legend>

              <div className={styles.field}>
                <label htmlFor="archetype" className={styles.label}>
                  Your Called to Carry Archetype *
                </label>
                <select
                  id="archetype"
                  required
                  className={styles.select}
                  value={form.archetype}
                  onChange={set('archetype')}
                >
                  <option value="">Select your archetype</option>
                  {ARCHETYPES.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label htmlFor="stage" className={styles.label}>Leadership Stage *</label>
                <select
                  id="stage"
                  required
                  className={styles.select}
                  value={form.stage}
                  onChange={set('stage')}
                >
                  <option value="">Select your stage</option>
                  {STAGES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label htmlFor="businessOrMinistry" className={styles.label}>
                  Briefly describe your business, ministry, or current assignment *
                </label>
                <textarea
                  id="businessOrMinistry"
                  required
                  className={styles.textarea}
                  rows={4}
                  value={form.businessOrMinistry}
                  onChange={set('businessOrMinistry')}
                  placeholder="What are you building? What sphere are you called to?"
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="whyNow" className={styles.label}>
                  Why is now the right season for you to be in this cohort? *
                </label>
                <textarea
                  id="whyNow"
                  required
                  className={styles.textarea}
                  rows={4}
                  value={form.whyNow}
                  onChange={set('whyNow')}
                  placeholder="What's stirring in you right now? What's the weight you're carrying?"
                />
              </div>
            </fieldset>

            {/* ── Commitment ── */}
            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>Commitment</legend>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  required
                  className={styles.checkbox}
                  checked={form.commitment}
                  onChange={set('commitment')}
                />
                <span>
                  I understand that cohort seats are limited, confirmed individually, and that
                  payment is collected at confirmation. I commit to attending the live sessions
                  and engaging fully with the formation process.
                </span>
              </label>
            </fieldset>

            {errorMsg && (
              <div className={styles.error}>
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Submitting…' : 'Submit My Application →'}
            </button>

            <p className={styles.disclaimer}>
              Your information is secure and will only be used for cohort communication.
              We review every application personally.
            </p>
          </form>
        </main>
      </div>
    </>
  );
}
