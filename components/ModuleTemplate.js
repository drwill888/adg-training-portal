import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

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

function parseReport(reportText) {
  if (!reportText) return null;

  const sections = { opening: '', threads: [], assignedPeople: '', declaration: '' };

  const openingMatch = reportText.match(/\*\*THE THREAD I SEE IN YOU\*\*\s*([\s\S]*?)(?=\*\*YOUR THREE PURPOSE THREADS\*\*)/i);
  if (openingMatch) sections.opening = openingMatch[1].trim();

  const threadsMatch = reportText.match(/\*\*YOUR THREE PURPOSE THREADS\*\*([\s\S]*?)(?=\*\*YOUR ASSIGNED PEOPLE\*\*)/i);
  if (threadsMatch) {
    const threadsText = threadsMatch[1];
    const threadPattern = /Thread \d+ — ([^\n]+)\n([\s\S]*?)(?=Thread \d+|$)/gi;
    let match;
    while ((match = threadPattern.exec(threadsText)) !== null) {
      sections.threads.push({ name: match[1].trim(), body: match[2].trim() });
    }
  }

  const peopleMatch = reportText.match(/\*\*YOUR ASSIGNED PEOPLE\*\*\s*([\s\S]*?)(?=\*\*YOUR CALLING DECLARATION\*\*)/i);
  if (peopleMatch) sections.assignedPeople = peopleMatch[1].trim();

  const declarationMatch = reportText.match(/\*\*YOUR CALLING DECLARATION\*\*\s*([\s\S]*?)$/i);
  if (declarationMatch) sections.declaration = declarationMatch[1].trim();

  if (!sections.opening && !sections.threads.length) sections.raw = reportText;

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
    else setLoadingExisting(false);
  }, [userId]);

  const loadExistingReport = async () => {
    try {
      const { data } = await supabase
        .from('purpose_threads')
        .select('answers, report')
        .eq('user_id', userId)
        .single();

      if (data && data.report) {
        setAnswers(data.answers || Array(10).fill(''));
        setReport(data.report);
        setParsedReport(parseReport(data.report));
        setHasExisting(true);
        setShowForm(false);
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
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '40px 0' }}>
        <div style={{ width: 32, height: 32, border: '3px solid rgba(200,169,81,0.2)', borderTop: '3px solid #C8A951', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ color: '#6b7280', fontSize: 14, margin: 0 }}>Loading your Calling profile...</p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", paddingTop: 8 }}>

      {/* Toggle tabs if report exists */}
      {hasExisting && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <button
            style={{ padding: '8px 20px', borderRadius: 6, border: showForm ? '1px solid #C8A951' : '1px solid #334155', backgroundColor: showForm ? 'rgba(200,169,81,0.12)' : 'transparent', color: showForm ? '#C8A951' : '#94A3B8', fontSize: 13, fontWeight: showForm ? 600 : 500, cursor: 'pointer' }}
            onClick={() => setShowForm(true)}
          >My Answers</button>
          <button
            style={{ padding: '8px 20px', borderRadius: 6, border: !showForm ? '1px solid #C8A951' : '1px solid #334155', backgroundColor: !showForm ? 'rgba(200,169,81,0.12)' : 'transparent', color: !showForm ? '#C8A951' : '#94A3B8', fontSize: 13, fontWeight: !showForm ? 600 : 500, cursor: 'pointer' }}
            onClick={() => setShowForm(false)}
          >My Report</button>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div>
          {/* Progress bar */}
          <div style={{ backgroundColor: 'rgba(10,45,82,0.6)', border: '1px solid rgba(253,210,13,0.1)', borderRadius: 10, padding: '14px 16px', marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#FDF8F0' }}>{answeredCount} of 10 answered</span>
              <span style={{ fontSize: 11, color: '#6b7280' }}>7 minimum to generate</span>
            </div>
            <div style={{ height: 5, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(answeredCount / 10) * 100}%`, backgroundColor: answeredCount >= 7 ? '#C8A951' : '#0172BC', borderRadius: 3, transition: 'width 0.3s ease' }} />
            </div>
          </div>

          {/* Questions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {QUESTIONS.map((q, i) => (
              <div key={q.id} style={{ backgroundColor: 'rgba(10,45,82,0.5)', border: '1px solid rgba(253,210,13,0.1)', borderLeft: answers[i].trim().length > 0 ? '3px solid #C8A951' : '3px solid rgba(253,210,13,0.15)', borderRadius: '0 10px 10px 0', padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#C8A951', letterSpacing: '0.05em' }}>0{q.id}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b7280', flex: 1 }}>{q.label}</span>
                  {answers[i].trim().length > 0 && <span style={{ fontSize: 12, color: '#C8A951', fontWeight: 700 }}>✓</span>}
                </div>
                <p style={{ fontSize: 14, color: '#FDF8F0', lineHeight: 1.6, margin: '0 0 12px', fontWeight: 500 }}>{q.text}</p>
                <textarea
                  style={{ width: '100%', padding: '10px 12px', fontSize: 13, color: '#FDF8F0', backgroundColor: 'rgba(2,26,53,0.5)', border: '1px solid rgba(253,210,13,0.15)', borderRadius: 8, resize: 'vertical', lineHeight: 1.6, fontFamily: "'Outfit', sans-serif", outline: 'none', boxSizing: 'border-box' }}
                  placeholder="Write your answer here..."
                  value={answers[i]}
                  onChange={e => handleAnswerChange(i, e.target.value)}
                  rows={3}
                />
              </div>
            ))}
          </div>

          {error && (
            <div style={{ backgroundColor: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: 8, padding: '10px 14px', color: '#f87171', fontSize: 13, marginTop: 16 }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, paddingTop: 20 }}>
            <button
              style={{ padding: '14px 36px', backgroundColor: '#021A35', color: '#FFFFFF', border: '2px solid #C8A951', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: answeredCount >= 7 && !loading ? 'pointer' : 'not-allowed', opacity: answeredCount >= 7 && !loading ? 1 : 0.5, minWidth: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
              onClick={handleSubmit}
              disabled={answeredCount < 7 || loading}
            >
              {loading ? (
                <>
                  <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Identifying Your Threads...
                </>
              ) : (
                <>Generate My Purpose Threads Report <span style={{ color: '#C8A951', fontSize: 16 }}>→</span></>
              )}
            </button>
            {answeredCount < 7 && (
              <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>
                Answer {7 - answeredCount} more question{7 - answeredCount !== 1 ? 's' : ''} to unlock your report
              </p>
            )}
          </div>
        </div>
      )}

      {/* Report */}
      {!showForm && report && (
        <div ref={reportRef}>
          <div style={{ borderBottom: '1px solid rgba(253,210,13,0.15)', paddingBottom: 16, marginBottom: 24, position: 'relative' }}>
            <div style={{ position: 'absolute', bottom: -1, left: 0, width: 50, height: 2, backgroundColor: '#C8A951' }} />
            <h3 style={{ fontSize: 20, fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color: '#FDF8F0', margin: 0 }}>Your Purpose Threads Report</h3>
          </div>

          {parsedReport?.raw ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {parsedReport.raw.split('\n').map((line, i) => (
                <p key={i} style={{ fontSize: line.startsWith('**') ? 15 : 14, fontWeight: line.startsWith('**') ? 700 : 400, color: line.startsWith('**') ? '#FDD20D' : '#c8cdd6', lineHeight: 1.7, margin: line.startsWith('**') ? '12px 0 4px' : 0 }}>
                  {line.replace(/\*\*/g, '')}
                </p>
              ))}
            </div>
          ) : parsedReport ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

              {parsedReport.opening && (
                <div style={{ display: 'flex', gap: 0, backgroundColor: '#021A35', borderRadius: 10, overflow: 'hidden' }}>
                  <div style={{ width: 4, minWidth: 4, backgroundColor: '#C8A951' }} />
                  <p style={{ fontSize: 16, lineHeight: 1.75, color: '#E2E8F0', margin: 0, padding: '20px 20px', fontStyle: 'italic', fontFamily: "'Cormorant Garamond', serif" }}>{parsedReport.opening}</p>
                </div>
              )}

              {parsedReport.threads.length > 0 && (
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6b7280', margin: '0 0 12px' }}>Your Three Purpose Threads</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {parsedReport.threads.map((thread, i) => (
                      <div key={i} style={{ backgroundColor: 'rgba(10,45,82,0.5)', borderLeft: '4px solid #C8A951', borderRadius: '0 10px 10px 0', padding: '16px 20px' }}>
                        <p style={{ fontSize: 11, fontWeight: 700, color: '#C8A951', letterSpacing: '0.1em', margin: '0 0 4px' }}>0{i + 1}</p>
                        <h5 style={{ fontSize: 16, fontWeight: 700, color: '#FDF8F0', margin: '0 0 8px', fontFamily: "'Cormorant Garamond', serif" }}>{thread.name}</h5>
                        <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.7, margin: 0 }}>{thread.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {parsedReport.assignedPeople && (
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6b7280', margin: '0 0 8px' }}>Your Assigned People</p>
                  <p style={{ fontSize: 14, color: '#c8cdd6', lineHeight: 1.7, margin: 0 }}>{parsedReport.assignedPeople}</p>
                </div>
              )}

              {parsedReport.declaration && (
                <div style={{ backgroundColor: '#021A35', borderRadius: 10, padding: '24px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 10 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C8A951' }}>Your Calling Declaration</span>
                  <blockquote style={{ fontSize: 18, fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 600, color: '#FFFFFF', lineHeight: 1.6, margin: 0, maxWidth: 560 }}>
                    "{parsedReport.declaration}"
                  </blockquote>
                </div>
              )}

            </div>
          ) : null}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 20, marginTop: 8, borderTop: '1px solid rgba(253,210,13,0.1)' }}>
            <button style={{ padding: '8px 16px', backgroundColor: 'transparent', border: '1px solid rgba(253,210,13,0.2)', borderRadius: 8, color: '#6b7280', fontSize: 12, fontWeight: 500, cursor: 'pointer' }} onClick={() => setShowForm(true)}>
              Revisit My Answers
            </button>
            <p style={{ fontSize: 11, color: '#4b5563', margin: 0 }}>✓ Saved to your profile</p>
          </div>
        </div>
      )}

    </div>
  );
}