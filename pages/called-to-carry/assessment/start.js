// pages/called-to-carry/assessment/start.js
// The 10-question assessment form. One question at a time.
// Reads lead info from sessionStorage (set by assessment/index.js).

import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { QUESTIONS } from '../../../lib/called-to-carry/questions';

const SCORABLE_QUESTIONS = QUESTIONS.filter(q => q.type !== 'open_text');
const TOTAL = QUESTIONS.length;

export default function AssessmentStart() {
  const router = useRouter();
  const [lead, setLead] = useState(null);
  const [current, setCurrent] = useState(0); // index into QUESTIONS
  const [answers, setAnswers] = useState({}); // { q1: ['q1_a'], q5: ['q5_a','q5_b'], q10: {text:'...'} }
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const raw = sessionStorage.getItem('ctc_lead');
    if (!raw) {
      const ctcBase = router.asPath.startsWith('/called-to-carry') ? '/called-to-carry' : '';
      router.replace(`${ctcBase}/assessment`);
      return;
    }
    setLead(JSON.parse(raw));
  }, [router]);

  if (!lead) return null;

  const question = QUESTIONS[current];
  const progress = Math.round(((current) / TOTAL) * 100);
  const isLast = current === TOTAL - 1;
  const answer = answers[question.id];

  // ── Answer selection ────────────────────────────────────────────────────
  function selectOption(optionId) {
    if (question.type === 'single_select') {
      setAnswers(a => ({ ...a, [question.id]: [optionId] }));
    } else if (question.type === 'multi_select') {
      const current = answers[question.id] || [];
      const max = question.maxSelections || Infinity;
      if (current.includes(optionId)) {
        setAnswers(a => ({ ...a, [question.id]: current.filter(id => id !== optionId) }));
      } else if (current.length < max) {
        setAnswers(a => ({ ...a, [question.id]: [...current, optionId] }));
      }
    }
  }

  function handleTextChange(e) {
    setAnswers(a => ({ ...a, [question.id]: { text: e.target.value } }));
  }

  // ── Navigation ──────────────────────────────────────────────────────────
  function canAdvance() {
    if (!question.required) return true;
    if (question.type === 'open_text') return true;
    const sel = answers[question.id];
    return Array.isArray(sel) && sel.length > 0;
  }

  function goNext() {
    if (!canAdvance()) {
      setError('Please select an answer to continue.');
      return;
    }
    setError('');
    if (isLast) {
      handleSubmit();
    } else {
      setCurrent(c => c + 1);
    }
  }

  function goBack() {
    if (current > 0) {
      setError('');
      setCurrent(c => c - 1);
    }
  }

  // ── Submit ──────────────────────────────────────────────────────────────
  async function handleSubmit() {
    setSubmitting(true);
    setError('');

    // Build responses array
    const responses = QUESTIONS.map(q => {
      const ans = answers[q.id];
      if (q.type === 'open_text') {
        return { questionId: q.id, optionIds: [], responseText: ans?.text?.trim() || '' };
      }
      return { questionId: q.id, optionIds: Array.isArray(ans) ? ans : [] };
    });

    // Get UTM params from URL if present
    const params = new URLSearchParams(window.location.search);
    const utm = {
      source: params.get('utm_source') || '',
      medium: params.get('utm_medium') || '',
      campaign: params.get('utm_campaign') || '',
    };

    try {
      const res = await fetch('/api/called-to-carry/assessment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: lead.firstName,
          lastName: lead.lastName,
          email: lead.email,
          responses,
          referrer: document.referrer || '',
          utm,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        setSubmitting(false);
        return;
      }

      // Clear sessionStorage, go to results.
      // On the subdomain (calledtocarry.*), router.asPath starts with /assessment/...
      // On the preview URL directly, it starts with /called-to-carry/assessment/...
      // We detect and adjust so both work correctly.
      sessionStorage.removeItem('ctc_lead');
      const ctcBase = router.asPath.startsWith('/called-to-carry') ? '/called-to-carry' : '';
      router.push(`${ctcBase}/assessment/results/${data.submissionId}`);
    } catch {
      setError('Network error. Please check your connection and try again.');
      setSubmitting(false);
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────
  const selectedIds = Array.isArray(answer) ? answer : [];

  return (
    <div style={styles.page}>
      <Head>
        <title>Called to Carry Assessment — Question {current + 1} of {TOTAL}</title>
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </Head>

      {/* Progress bar */}
      <div style={styles.progressWrap}>
        <div style={{ ...styles.progressBar, width: `${progress}%` }} />
      </div>

      <main style={styles.main}>
        <p style={styles.counter}>Question {current + 1} of {TOTAL}</p>

        <h2 style={styles.questionText}>{question.text}</h2>

        {question.type === 'multi_select' && (
          <p style={styles.hint}>
            {question.maxSelections
              ? `Select up to ${question.maxSelections}`
              : 'Select all that apply'}
          </p>
        )}

        {/* Options */}
        {question.type !== 'open_text' && (
          <div style={styles.options}>
            {question.options.map(opt => {
              const selected = selectedIds.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  onClick={() => selectOption(opt.id)}
                  style={{
                    ...styles.option,
                    ...(selected ? styles.optionSelected : {}),
                  }}
                >
                  <span style={{
                    ...styles.optionDot,
                    ...(selected ? styles.optionDotSelected : {}),
                  }} />
                  <span style={styles.optionLabel}>{opt.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Open text (Q10) */}
        {question.type === 'open_text' && (
          <div style={styles.textareaWrap}>
            <textarea
              value={answer?.text || ''}
              onChange={handleTextChange}
              maxLength={500}
              rows={5}
              placeholder="Take your time. This is just for you and Will — it will not affect your archetype result."
              style={styles.textarea}
            />
            <p style={styles.charCount}>
              {(answer?.text || '').length} / 500
            </p>
          </div>
        )}

        {error && <p style={styles.error}>{error}</p>}

        {/* Navigation */}
        <div style={styles.nav}>
          {current > 0 && (
            <button onClick={goBack} style={styles.backBtn} disabled={submitting}>
              ← Back
            </button>
          )}
          <button
            onClick={goNext}
            style={{
              ...styles.nextBtn,
              ...(submitting ? styles.btnDisabled : {}),
            }}
            disabled={submitting}
          >
            {submitting
              ? 'Submitting…'
              : isLast
              ? 'See My Results →'
              : 'Next →'}
          </button>
        </div>

        {question.type !== 'open_text' && !question.required && (
          <p style={styles.skipHint}>
            <button onClick={goNext} style={styles.skipBtn}>
              Skip this question
            </button>
          </p>
        )}
      </main>
    </div>
  );
}

const styles = {
  page: {
    background: '#021A35',
    minHeight: '100vh',
    color: '#FDF8F0',
    fontFamily: "'Georgia', serif",
    display: 'flex',
    flexDirection: 'column',
  },
  progressWrap: {
    height: '3px',
    background: 'rgba(255,255,255,0.08)',
    width: '100%',
  },
  progressBar: {
    height: '100%',
    background: '#C8A951',
    transition: 'width 0.3s ease',
  },
  main: {
    maxWidth: '640px',
    margin: '0 auto',
    padding: '3rem 1.5rem 4rem',
    width: '100%',
  },
  counter: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: '0.8rem',
    color: '#C8A951',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    marginBottom: '1.5rem',
  },
  questionText: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: 'clamp(1.4rem, 3.5vw, 2rem)',
    fontWeight: 400,
    lineHeight: 1.35,
    marginBottom: '0.75rem',
  },
  hint: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: '0.82rem',
    opacity: 0.55,
    marginBottom: '1.5rem',
  },
  options: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginTop: '1.75rem',
  },
  option: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '6px',
    color: '#FDF8F0',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.85rem',
    padding: '1rem 1.1rem',
    textAlign: 'left',
    transition: 'border-color 0.15s, background 0.15s',
    width: '100%',
  },
  optionSelected: {
    background: 'rgba(200,169,81,0.12)',
    border: '1px solid rgba(200,169,81,0.6)',
  },
  optionDot: {
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    border: '2px solid rgba(255,255,255,0.25)',
    flexShrink: 0,
    marginTop: '2px',
    transition: 'border-color 0.15s, background 0.15s',
  },
  optionDotSelected: {
    background: '#C8A951',
    border: '2px solid #C8A951',
  },
  optionLabel: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: '0.95rem',
    lineHeight: 1.55,
  },
  textareaWrap: {
    marginTop: '1.75rem',
  },
  textarea: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '6px',
    color: '#FDF8F0',
    fontFamily: "'Georgia', serif",
    fontSize: '1rem',
    lineHeight: 1.65,
    padding: '1rem',
    resize: 'vertical',
    width: '100%',
    outline: 'none',
  },
  charCount: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: '0.75rem',
    opacity: 0.4,
    marginTop: '0.4rem',
    textAlign: 'right',
  },
  error: {
    color: '#f87171',
    fontFamily: "'Outfit', sans-serif",
    fontSize: '0.88rem',
    marginTop: '1rem',
  },
  nav: {
    display: 'flex',
    gap: '1rem',
    marginTop: '2rem',
    alignItems: 'center',
  },
  backBtn: {
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '4px',
    color: 'rgba(255,255,255,0.6)',
    cursor: 'pointer',
    fontFamily: "'Outfit', sans-serif",
    fontSize: '0.9rem',
    padding: '0.75rem 1.25rem',
  },
  nextBtn: {
    background: '#C8A951',
    border: 'none',
    borderRadius: '4px',
    color: '#021A35',
    cursor: 'pointer',
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 600,
    fontSize: '1rem',
    padding: '0.85rem 2rem',
    flex: 1,
  },
  btnDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  skipHint: {
    marginTop: '1rem',
    textAlign: 'center',
  },
  skipBtn: {
    background: 'none',
    border: 'none',
    color: 'rgba(255,255,255,0.4)',
    cursor: 'pointer',
    fontFamily: "'Outfit', sans-serif",
    fontSize: '0.82rem',
    textDecoration: 'underline',
  },
};
