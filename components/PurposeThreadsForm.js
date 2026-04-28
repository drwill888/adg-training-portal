import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const QUESTIONS = [
  {
    id: 1,
    label: "The Burden Question",
    text: "What injustice, gap, or brokenness in the world makes you angry in a way others around you do not seem to feel as deeply?"
  },
  {
    id: 2,
    label: "The Trusted Question",
    text: "What have people repeatedly come to you for — even before you considered yourself qualified to help?"
  },
  {
    id: 3,
    label: "The Flow Question",
    text: "What kind of work makes you lose track of time and feel most fully like yourself?"
  },
  {
    id: 4,
    label: "The Becoming Question",
    text: "What do you want to become on the inside — not what you want to do, but who you are being shaped into?"
  },
  {
    id: 5,
    label: "The Appointment Question",
    text: "Where have you been trusted with responsibility, leadership, or influence before you felt fully prepared for it?"
  },
  {
    id: 6,
    label: "The Assignment Question",
    text: "Who are the specific people you feel an unexplainable pull toward — to serve, speak into, or fight for?"
  },
  {
    id: 7,
    label: "The Persistent Vision Question",
    text: "What vision, idea, or assignment has stayed with you for years — one you have tried to set down but could not?"
  },
  {
    id: 8,
    label: "The Legacy Question",
    text: "Twenty years from now, what do you want to have built, changed, or made possible for the next generation?"
  },
  {
    id: 9,
    label: "The Resistance Question",
    text: "What is the most persistent lie you believe about yourself that has slowed your assignment down the most?"
  },
  {
    id: 10,
    label: "The Pattern Question",
    text: "Looking back across your life — what single word, image, or theme keeps showing up in your most significant moments?"
  }
];

// Parse the AI report into structured sections for rendering
function parseReport(reportText) {
  if (!reportText) return null;

  const sections = {
    opening: '',
    threads: [],
    assignedPeople: '',
    declaration: ''
  };

  // Extract opening (THE THREAD I SEE IN YOU)
  const openingMatch = reportText.match(/\*\*THE THREAD I SEE IN YOU\*\*\s*([\s\S]*?)(?=\*\*YOUR THREE PURPOSE THREADS\*\*)/i);
  if (openingMatch) sections.opening = openingMatch[1].trim();

  // Extract threads
  const threadsMatch = reportText.match(/\*\*YOUR THREE PURPOSE THREADS\*\*([\s\S]*?)(?=\*\*YOUR ASSIGNED PEOPLE\*\*)/i);
  if (threadsMatch) {
    const threadsText = threadsMatch[1];
    const threadPattern = /Thread \d+ — ([^\n]+)\n([\s\S]*?)(?=Thread \d+|$)/gi;
    let match;
    while ((match = threadPattern.exec(threadsText)) !== null) {
      sections.threads.push({
        name: match[1].trim(),
        body: match[2].trim()
      });
    }
  }

  // Extract assigned people
  const peopleMatch = reportText.match(/\*\*YOUR ASSIGNED PEOPLE\*\*\s*([\s\S]*?)(?=\*\*YOUR CALLING DECLARATION\*\*)/i);
  if (peopleMatch) sections.assignedPeople = peopleMatch[1].trim();

  // Extract calling declaration
  const declarationMatch = reportText.match(/\*\*YOUR CALLING DECLARATION\*\*\s*([\s\S]*?)$/i);
  if (declarationMatch) sections.declaration = declarationMatch[1].trim();

  // If parsing fails for any section, fall back to raw text
  if (!sections.opening && !sections.threads.length) {
    sections.raw = reportText;
  }

  return sections;
}

export default function PurposeThreadsForm({ userId }) {
  const [answers, setAnswers] = useState(Array(10).fill(''));
  const [report, setReport] = useState(null);
  const [parsedReport, setParsedReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(true);
  const [error, setError] = useState(null);
  const [hasExisting, setHasExisting] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const reportRef = useRef(null);

  const answeredCount = answers.filter(a => a.trim().length > 0).length;

  useEffect(() => {
    if (userId) loadExistingReport();
  }, [userId]);

  const loadExistingReport = async () => {
    try {
      const { data } = await supabase
        .from('purpose_threads')
        .select('answers, report')
        .eq('user_id', userId)
        .single();

      if (data?.report) {
        setAnswers(data.answers || Array(10).fill(''));
        setReport(data.report);
        setParsedReport(parseReport(data.report));
        setHasExisting(true);
        setShowForm(false); // Show report first if already generated
      }
    } catch {
      // No existing report — show blank form
    } finally {
      setLoadingExisting(false);
    }
  };

  const handleAnswerChange = (index, value) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    if (answeredCount < 7) {
      setError('Please answer at least 7 questions before generating your report.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/purpose-threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, userId })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to generate report');
      }

      const data = await res.json();
      setReport(data.report);
      setParsedReport(parseReport(data.report));
      setHasExisting(true);
      setShowForm(false);

      setTimeout(() => {
        reportRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);

    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingExisting) {
    return (
      <div style={styles.loadingWrap}>
        <div style={styles.spinner} />
        <p style={styles.loadingText}>Loading your Calling profile…</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerAccent} />
        <div style={styles.headerInner}>
          <span style={styles.sectionTag}>Purpose Discovery</span>
          <h2 style={styles.title}>Find Your Purpose Threads</h2>
          <p style={styles.subtitle}>
            Answer these questions with honesty and depth. There are no right answers —
            only yours. When you're done, your Purpose Threads Report will identify the
            patterns, assignments, and calling woven through your responses.
          </p>
          {hasExisting && (
            <div style={styles.toggleRow}>
              <button
                style={showForm ? styles.toggleBtnActive : styles.toggleBtn}
                onClick={() => setShowForm(true)}
              >
                My Answers
              </button>
              <button
                style={!showForm ? styles.toggleBtnActive : styles.toggleBtn}
                onClick={() => setShowForm(false)}
              >
                My Report
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div style={styles.formSection}>
          <div style={styles.progressBar}>
            <div style={styles.progressLabel}>
              <span style={styles.progressText}>{answeredCount} of 10 answered</span>
              <span style={styles.progressNote}>7 minimum to generate</span>
            </div>
            <div style={styles.progressTrack}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${(answeredCount / 10) * 100}%`,
                  backgroundColor: answeredCount >= 7 ? '#C8A951' : '#0172BC'
                }}
              />
            </div>
          </div>

          <div style={styles.questionsGrid}>
            {QUESTIONS.map((q, i) => (
              <div key={q.id} style={styles.questionCard}>
                <div style={styles.questionMeta}>
                  <span style={styles.questionNumber}>0{q.id}</span>
                  <span style={styles.questionLabel}>{q.label}</span>
                  {answers[i].trim().length > 0 && (
                    <span style={styles.answeredBadge}>✓</span>
                  )}
                </div>
                <p style={styles.questionText}>{q.text}</p>
                <textarea
                  style={styles.textarea}
                  placeholder="Write your answer here…"
                  value={answers[i]}
                  onChange={e => handleAnswerChange(i, e.target.value)}
                  rows={4}
                />
              </div>
            ))}
          </div>

          {error && (
            <div style={styles.errorBox}>
              <span style={styles.errorIcon}>⚠</span> {error}
            </div>
          )}

          <div style={styles.submitArea}>
            <button
              style={{
                ...styles.submitBtn,
                opacity: answeredCount >= 7 && !loading ? 1 : 0.5,
                cursor: answeredCount >= 7 && !loading ? 'pointer' : 'not-allowed'
              }}
              onClick={handleSubmit}
              disabled={answeredCount < 7 || loading}
            >
              {loading ? (
                <span style={styles.btnInner}>
                  <span style={styles.btnSpinner} />
                  Identifying Your Threads…
                </span>
              ) : (
                <span style={styles.btnInner}>
                  Generate My Purpose Threads Report
                  <span style={styles.btnArrow}>→</span>
                </span>
              )}
            </button>
            {answeredCount < 7 && (
              <p style={styles.submitHint}>
                Answer {7 - answeredCount} more question{7 - answeredCount !== 1 ? 's' : ''} to unlock your report
              </p>
            )}
          </div>
        </div>
      )}

      {/* Report */}
      {!showForm && report && (
        <div ref={reportRef} style={styles.reportSection}>
          <div style={styles.reportHeader}>
            <div style={styles.reportHeaderAccent} />
            <h3 style={styles.reportTitle}>Your Purpose Threads Report</h3>
          </div>

          {parsedReport?.raw ? (
            // Fallback: render raw text if parsing failed
            <div style={styles.reportRaw}>
              {parsedReport.raw.split('\n').map((line, i) => (
                <p key={i} style={line.startsWith('**') ? styles.reportBoldLine : styles.reportLine}>
                  {line.replace(/\*\*/g, '')}
                </p>
              ))}
            </div>
          ) : parsedReport ? (
            <div style={styles.reportBody}>

              {/* Opening */}
              {parsedReport.opening && (
                <div style={styles.reportOpening}>
                  <div style={styles.openingBorderLeft} />
                  <p style={styles.openingText}>{parsedReport.opening}</p>
                </div>
              )}

              {/* Threads */}
              {parsedReport.threads.length > 0 && (
                <div style={styles.threadsSection}>
                  <h4 style={styles.sectionHeading}>Your Three Purpose Threads</h4>
                  <div style={styles.threadsGrid}>
                    {parsedReport.threads.map((thread, i) => (
                      <div key={i} style={styles.threadCard}>
                        <div style={styles.threadNumber}>{`0${i + 1}`}</div>
                        <h5 style={styles.threadName}>{thread.name}</h5>
                        <p style={styles.threadBody}>{thread.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Assigned People */}
              {parsedReport.assignedPeople && (
                <div style={styles.reportBlock}>
                  <h4 style={styles.sectionHeading}>Your Assigned People</h4>
                  <p style={styles.reportBlockText}>{parsedReport.assignedPeople}</p>
                </div>
              )}

              {/* Calling Declaration */}
              {parsedReport.declaration && (
                <div style={styles.declarationBlock}>
                  <span style={styles.declarationLabel}>Your Calling Declaration</span>
                  <blockquote style={styles.declarationText}>
                    "{parsedReport.declaration}"
                  </blockquote>
                </div>
              )}

            </div>
          ) : null}

          <div style={styles.reportFooter}>
            <button style={styles.redoBtn} onClick={() => setShowForm(true)}>
              Revisit My Answers
            </button>
            <p style={styles.reportSavedNote}>
              ✓ This report is saved to your profile
            </p>
          </div>
        </div>
      )}

    </div>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = {
  container: {
    fontFamily: "'Outfit', sans-serif",
    maxWidth: '860px',
    margin: '0 auto',
    padding: '0 0 60px'
  },

  // Loading
  loadingWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    padding: '60px 0'
  },
  spinner: {
    width: '36px',
    height: '36px',
    border: '3px solid #0172BC22',
    borderTop: '3px solid #C8A951',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite'
  },
  loadingText: {
    color: '#6B7280',
    fontSize: '15px'
  },

  // Header
  header: {
    position: 'relative',
    backgroundColor: '#021A35',
    borderRadius: '16px',
    overflow: 'hidden',
    marginBottom: '32px'
  },
  headerAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    background: 'linear-gradient(90deg, #C8A951, #FDD20D, #C8A951)'
  },
  headerInner: {
    padding: '40px 40px 36px'
  },
  sectionTag: {
    display: 'inline-block',
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: '#C8A951',
    marginBottom: '12px'
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#FFFFFF',
    margin: '0 0 12px',
    fontFamily: "'Cormorant Garamond', serif",
    lineHeight: '1.2'
  },
  subtitle: {
    fontSize: '15px',
    color: '#94A3B8',
    lineHeight: '1.7',
    margin: '0',
    maxWidth: '600px'
  },
  toggleRow: {
    display: 'flex',
    gap: '8px',
    marginTop: '24px'
  },
  toggleBtn: {
    padding: '8px 20px',
    borderRadius: '6px',
    border: '1px solid #334155',
    backgroundColor: 'transparent',
    color: '#94A3B8',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },
  toggleBtnActive: {
    padding: '8px 20px',
    borderRadius: '6px',
    border: '1px solid #C8A951',
    backgroundColor: '#C8A95120',
    color: '#C8A951',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer'
  },

  // Form
  formSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  progressBar: {
    backgroundColor: '#F8FAFC',
    border: '1px solid #E2E8F0',
    borderRadius: '10px',
    padding: '16px 20px'
  },
  progressLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px'
  },
  progressText: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#021A35'
  },
  progressNote: {
    fontSize: '12px',
    color: '#94A3B8'
  },
  progressTrack: {
    height: '6px',
    backgroundColor: '#E2E8F0',
    borderRadius: '3px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    borderRadius: '3px',
    transition: 'width 0.3s ease, background-color 0.3s ease'
  },

  questionsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '12px',
    padding: '24px',
    transition: 'border-color 0.2s ease'
  },
  questionMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '10px'
  },
  questionNumber: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#C8A951',
    letterSpacing: '0.05em'
  },
  questionLabel: {
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: '#94A3B8',
    flex: 1
  },
  answeredBadge: {
    fontSize: '13px',
    color: '#C8A951',
    fontWeight: '700'
  },
  questionText: {
    fontSize: '16px',
    color: '#1E293B',
    lineHeight: '1.6',
    margin: '0 0 14px',
    fontWeight: '500'
  },
  textarea: {
    width: '100%',
    padding: '12px 14px',
    fontSize: '14px',
    color: '#334155',
    backgroundColor: '#F8FAFC',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    resize: 'vertical',
    lineHeight: '1.6',
    fontFamily: "'Outfit', sans-serif",
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease'
  },

  // Submit
  submitArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    paddingTop: '8px'
  },
  submitBtn: {
    padding: '16px 40px',
    backgroundColor: '#021A35',
    color: '#FFFFFF',
    border: '2px solid #C8A951',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    minWidth: '320px'
  },
  btnInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px'
  },
  btnSpinner: {
    display: 'inline-block',
    width: '16px',
    height: '16px',
    border: '2px solid #FFFFFF44',
    borderTop: '2px solid #FFFFFF',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite'
  },
  btnArrow: {
    fontSize: '18px',
    color: '#C8A951'
  },
  submitHint: {
    fontSize: '13px',
    color: '#94A3B8',
    margin: '0'
  },

  // Error
  errorBox: {
    backgroundColor: '#FEF2F2',
    border: '1px solid #FECACA',
    borderRadius: '8px',
    padding: '12px 16px',
    color: '#DC2626',
    fontSize: '14px'
  },
  errorIcon: {
    marginRight: '6px'
  },

  // Report
  reportSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0'
  },
  reportHeader: {
    position: 'relative',
    paddingBottom: '20px',
    marginBottom: '8px',
    borderBottom: '1px solid #E2E8F0'
  },
  reportHeaderAccent: {
    position: 'absolute',
    bottom: '-1px',
    left: '0',
    width: '60px',
    height: '2px',
    backgroundColor: '#C8A951'
  },
  reportTitle: {
    fontSize: '22px',
    fontFamily: "'Cormorant Garamond', serif",
    fontWeight: '700',
    color: '#021A35',
    margin: '0'
  },
  reportBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
    paddingTop: '28px'
  },

  // Opening
  reportOpening: {
    display: 'flex',
    gap: '20px',
    backgroundColor: '#021A35',
    borderRadius: '12px',
    padding: '28px 28px 28px 8px',
    overflow: 'hidden'
  },
  openingBorderLeft: {
    width: '4px',
    minWidth: '4px',
    backgroundColor: '#C8A951',
    borderRadius: '2px'
  },
  openingText: {
    fontSize: '17px',
    lineHeight: '1.75',
    color: '#E2E8F0',
    margin: '0',
    fontStyle: 'italic',
    fontFamily: "'Cormorant Garamond', serif"
  },

  // Threads
  threadsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  sectionHeading: {
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: '#94A3B8',
    margin: '0 0 4px'
  },
  threadsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  threadCard: {
    backgroundColor: '#F8FAFC',
    border: '1px solid #E2E8F0',
    borderLeft: '4px solid #C8A951',
    borderRadius: '0 10px 10px 0',
    padding: '20px 24px'
  },
  threadNumber: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#C8A951',
    letterSpacing: '0.1em',
    marginBottom: '4px'
  },
  threadName: {
    fontSize: '17px',
    fontWeight: '700',
    color: '#021A35',
    margin: '0 0 10px',
    fontFamily: "'Cormorant Garamond', serif"
  },
  threadBody: {
    fontSize: '15px',
    color: '#475569',
    lineHeight: '1.7',
    margin: '0'
  },

  // Assigned People
  reportBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  reportBlockText: {
    fontSize: '15px',
    color: '#334155',
    lineHeight: '1.7',
    margin: '0'
  },

  // Declaration
  declarationBlock: {
    backgroundColor: '#021A35',
    borderRadius: '12px',
    padding: '32px 32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    alignItems: 'center',
    textAlign: 'center'
  },
  declarationLabel: {
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: '#C8A951'
  },
  declarationText: {
    fontSize: '20px',
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle: 'italic',
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: '1.6',
    margin: '0',
    maxWidth: '600px'
  },

  // Raw fallback
  reportRaw: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    paddingTop: '28px'
  },
  reportLine: {
    fontSize: '15px',
    color: '#334155',
    lineHeight: '1.7',
    margin: '0'
  },
  reportBoldLine: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#021A35',
    margin: '16px 0 4px'
  },

  // Report Footer
  reportFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '28px',
    marginTop: '8px',
    borderTop: '1px solid #E2E8F0'
  },
  redoBtn: {
    padding: '10px 20px',
    backgroundColor: 'transparent',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    color: '#475569',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer'
  },
  reportSavedNote: {
    fontSize: '12px',
    color: '#94A3B8',
    margin: '0'
  }
};
