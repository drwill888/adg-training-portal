// pages/blueprint/apply.js
// Application form for the Called to Carry Blueprint ($997)
// Same pattern as cohort apply — saves to Supabase, fires Resend emails

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
  "I have not taken the assessment yet",
];

const STAGES = [
  'Emerging — discovering my calling',
  'Developing — building the foundation',
  'Established — scaling with purpose',
  'Executive — leading at full capacity',
];

const PREV_EXPERIENCE = [
  'No — this is my first Called to Carry experience',
  'Yes — I completed the Self-Paced Journey',
  'Yes — I completed the Called to Carry Cohort',
  'Yes — both Self-Paced and Cohort',
];

export default function BlueprintApply() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    archetype: '',
    stage: '',
    prevExperience: '',
    businessOrMinistry: '',
    whyNow: '',
    commitment: false,
  });
  const [status, setStatus] = useState('idle');
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
      const res = await fetch('/api/blueprint/submit-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Submission failed. Please try again.');
      }

      window.location.href = '/blueprint/thank-you?applied=true';
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message);
    }
  };

  return (
    <>
      <Head>
        <title>Apply — Called to Carry Blueprint</title>
        <meta name="description" content="Apply for the Called to Carry Blueprint — 21-day intensive with Will. Limited to 10 seats." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=Outfit:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className={styles.page}>
        <nav className={styles.nav}>
          <Link href="/blueprint" className={styles.navBack}>← Back to Blueprint</Link>
          <span className={styles.navTitle}>Blueprint Application</span>
        </nav>

        <main className={styles.main}>
          <div className={styles.header}>
            <p className={styles.eyebrow}>Limited to 10 Seats · Called to Carry Blueprint</p>
            <h1 className={styles.heading}>Tell Us About Your Assignment</h1>
            <p className={styles.sub}>
              Every Blueprint seat is confirmed personally by Will. This application
              helps ensure the right fit and prepares for your arrival. Takes 5 minutes.
            </p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>Personal Information</legend>
              <div className={styles.row2}>
                <div className={styles.field}>
                  <label htmlFor="firstName" className={styles.label}>First Name *</label>
                  <input id="firstName" type="text" required className={styles.input}
                    value={form.firstName} onChange={set('firstName')} placeholder="First" />
                </div>
                <div className={styles.field}>
                  <label htmlFor="lastName" className={styles.label}>Last Name *</label>
                  <input id="lastName" type="text" required className={styles.input}
                    value={form.lastName} onChange={set('lastName')} placeholder="Last" />
                </div>
              </div>
              <div className={styles.row2}>
                <div className={styles.field}>
                  <label htmlFor="email" className={styles.label}>Email Address *</label>
                  <input id="email" type="email" required className={styles.input}
                    value={form.email} onChange={set('email')} placeholder="you@email.com" />
                </div>
                <div className={styles.field}>
                  <label htmlFor="phone" className={styles.label}>Phone (optional)</label>
                  <input id="phone" type="tel" className={styles.input}
                    value={form.phone} onChange={set('phone')} placeholder="+1 (555) 000-0000" />
                </div>
              </div>
              <div className={styles.field}>
                <label htmlFor="city" className={styles.label}>City & State / Country *</label>
                <input id="city" type="text" required className={styles.input}
                  value={form.city} onChange={set('city')} placeholder="e.g. Atlanta, GA" />
              </div>
            </fieldset>

            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>Your Assignment</legend>
              <div className={styles.field}>
                <label htmlFor="archetype" className={styles.label}>Your Called to Carry Archetype *</label>
                <select id="archetype" required className={styles.select}
                  value={form.archetype} onChange={set('archetype')}>
                  <option value="">Select your archetype</option>
                  {ARCHETYPES.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div className={styles.field}>
                <label htmlFor="stage" className={styles.label}>Leadership Stage *</label>
                <select id="stage" required className={styles.select}
                  value={form.stage} onChange={set('stage')}>
                  <option value="">Select your stage</option>
                  {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className={styles.field}>
                <label htmlFor="prevExperience" className={styles.label}>Previous Called to Carry Experience *</label>
                <select id="prevExperience" required className={styles.select}
                  value={form.prevExperience} onChange={set('prevExperience')}>
                  <option value="">Select one</option>
                  {PREV_EXPERIENCE.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className={styles.field}>
                <label htmlFor="businessOrMinistry" className={styles.label}>
                  Describe your business, ministry, or current assignment *
                </label>
                <textarea id="businessOrMinistry" required className={styles.textarea} rows={4}
                  value={form.businessOrMinistry} onChange={set('businessOrMinistry')}
                  placeholder="What are you building? What sphere are you called to?" />
              </div>
              <div className={styles.field}>
                <label htmlFor="whyNow" className={styles.label}>
                  Why is now the right season for the Blueprint? *
                </label>
                <textarea id="whyNow" required className={styles.textarea} rows={4}
                  value={form.whyNow} onChange={set('whyNow')}
                  placeholder="What needs clarity? What are you ready to build from?" />
              </div>
            </fieldset>

            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>Commitment</legend>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" required className={styles.checkbox}
                  checked={form.commitment} onChange={set('commitment')} />
                <span>
                  I understand that Blueprint seats are limited to 10, confirmed personally
                  by Will, and that the $997 investment is collected at confirmation.
                  I commit to attending all 3 live group calls and engaging fully
                  with the 21-day formation process.
                </span>
              </label>
            </fieldset>

            {errorMsg && <div className={styles.error}>{errorMsg}</div>}

            <button type="submit" className={styles.submitBtn} disabled={status === 'loading'}>
              {status === 'loading' ? 'Submitting…' : 'Submit My Application →'}
            </button>

            <p className={styles.disclaimer}>
              Your information is secure. Will reviews every Blueprint application personally.
            </p>
          </form>
        </main>
      </div>
    </>
  );
}
