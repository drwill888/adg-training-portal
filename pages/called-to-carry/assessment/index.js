// pages/called-to-carry/assessment/index.js
// Called to Carry — 10-Q Assessment with 5 Coaching Layers
// Path B: inline results (no redirect to results/[id].js)
//
// Layer 1: Enhanced intro screen
// Layer 2: Helper text per question (collapsible)
// Layer 3: Mid-reflection after Q5 (Claude API)
// Layer 4: Prophetic mirror at reveal (Claude API + archetypes.js)
// Layer 5: Tier routing card (archetype-aware)

import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import styles from '../../../styles/Assessment.module.css';
import c from '../../../styles/AssessmentCoaching.module.css';
import { QUESTION_HELPER_TEXT } from '../../../lib/coaching-prompts';
import { getRecommendedTier } from '../../../lib/routing-logic';

// ─── OFFICE QUESTIONS (5) ─────────────────────────────────────────────────
const OFFICE_QUESTIONS = [
  {
    id: 'office_1',
    track: 'office',
    question: 'When you see a new territory — a new market, community, ministry opportunity, or spiritual landscape — your first instinct is to:',
    options: [
      { label: 'Plant something new that has never existed there', score: 'apostolic' },
      { label: 'Listen for what God is already saying about it', score: 'prophetic' },
      { label: 'Invite people into it and draw them together', score: 'evangelistic' },
      { label: 'Care for those already there and make sure they are held', score: 'pastoral' },
      { label: 'Understand it deeply and explain it to others', score: 'teaching' },
    ],
  },
  {
    id: 'office_2',
    track: 'office',
    question: 'The weight you most consistently carry in your leadership is:',
    options: [
      { label: 'The weight of pioneering what no one else has built', score: 'apostolic' },
      { label: 'The weight of seeing what others do not yet see', score: 'prophetic' },
      { label: 'The weight of those who are not yet gathered in', score: 'evangelistic' },
      { label: 'The weight of the people entrusted to my care', score: 'pastoral' },
      { label: 'The weight of truth that has not yet been made clear', score: 'teaching' },
    ],
  },
  {
    id: 'office_3',
    track: 'office',
    question: 'When you enter a room full of people you do not know, you are most likely to:',
    options: [
      { label: 'Sense what is missing and start drawing a vision for what could be', score: 'apostolic' },
      { label: 'Feel the spiritual atmosphere before anyone has spoken', score: 'prophetic' },
      { label: 'Find the person on the edge and make them feel seen', score: 'evangelistic' },
      { label: 'Notice who is struggling and quietly move toward them', score: 'pastoral' },
      { label: 'Observe the dynamics and begin to understand the group', score: 'teaching' },
    ],
  },
  {
    id: 'office_4',
    track: 'office',
    question: 'When you teach, speak, or lead — what comes most naturally is:',
    options: [
      { label: 'Casting vision that calls people into something new', score: 'apostolic' },
      { label: 'Declaring what God is saying in this moment', score: 'prophetic' },
      { label: 'Inviting people to encounter something bigger than themselves', score: 'evangelistic' },
      { label: 'Walking alongside people through what they are facing', score: 'pastoral' },
      { label: 'Bringing clarity to what has been confusing or misunderstood', score: 'teaching' },
    ],
  },
  {
    id: 'office_5',
    track: 'office',
    question: 'The thing you are most afraid of losing in your leadership is:',
    options: [
      { label: 'The pioneering edge — becoming too safe or settled', score: 'apostolic' },
      { label: 'The prophetic clarity — becoming dull or distracted', score: 'prophetic' },
      { label: 'The heart for the lost — becoming insulated from outsiders', score: 'evangelistic' },
      { label: 'The intimacy with my people — becoming a manager instead of a shepherd', score: 'pastoral' },
      { label: 'The depth of truth — becoming shallow or untethered from study', score: 'teaching' },
    ],
  },
];

// ─── OVERLAY QUESTIONS (5) ────────────────────────────────────────────────
const OVERLAY_QUESTIONS = [
  {
    id: 'overlay_1',
    track: 'overlay',
    question: 'When you engage a problem that needs addressing, you most naturally:',
    options: [
      { label: 'Design a structure that solves it long-term', score: 'builder' },
      { label: 'Absorb the weight of it until it shifts', score: 'burden_bearer' },
      { label: 'Confront what is broken and call for change', score: 'reformer' },
      { label: 'Connect the right people to it and hold them together', score: 'covenant_keeper' },
      { label: 'Train others to be able to handle problems like this themselves', score: 'equipper' },
    ],
  },
  {
    id: 'overlay_2',
    track: 'overlay',
    question: 'The assignments you are most drawn to are the ones that involve:',
    options: [
      { label: 'Building something lasting — structures, systems, institutions', score: 'builder' },
      { label: 'Carrying weight others cannot — intercession, the hidden place', score: 'burden_bearer' },
      { label: 'Confronting what is broken — reforming what has gone wrong', score: 'reformer' },
      { label: 'Forming long-term covenant relationships — lifelong alliances', score: 'covenant_keeper' },
      { label: 'Raising up leaders — training, mentoring, multiplying', score: 'equipper' },
    ],
  },
  {
    id: 'overlay_3',
    track: 'overlay',
    question: 'When you look back at your life, the patterns you see most clearly are:',
    options: [
      { label: 'A track record of building things from nothing', score: 'builder' },
      { label: 'A track record of carrying weight that shaped me in hidden ways', score: 'burden_bearer' },
      { label: 'A track record of confronting what needed to change', score: 'reformer' },
      { label: 'A track record of long, faithful relationships across seasons', score: 'covenant_keeper' },
      { label: 'A track record of pouring into others and raising them up', score: 'equipper' },
    ],
  },
  {
    id: 'overlay_4',
    track: 'overlay',
    question: 'The greatest temptation you fight in your leadership is:',
    options: [
      { label: 'Building beyond what I can sustain or releasing too slowly', score: 'builder' },
      { label: 'Carrying weight that was never mine to carry', score: 'burden_bearer' },
      { label: 'Confronting before relational equity has been established', score: 'reformer' },
      { label: 'Holding onto covenants past the season God has released me from', score: 'covenant_keeper' },
      { label: 'Holding onto leaders too long instead of releasing them', score: 'equipper' },
    ],
  },
  {
    id: 'overlay_5',
    track: 'overlay',
    question: 'When God measures your life, the primary question will be:',
    options: [
      { label: 'What did you build that was meant to outlast you?', score: 'builder' },
      { label: 'What weight did you faithfully bear in the secret place?', score: 'burden_bearer' },
      { label: 'What did you confront on My behalf?', score: 'reformer' },
      { label: 'What covenants did you keep when it cost you?', score: 'covenant_keeper' },
      { label: 'Who did you raise up to be released into their own assignment?', score: 'equipper' },
    ],
  },
];

// Interleave Office and Overlay questions
const QUESTIONS = [];
for (let i = 0; i < 5; i++) {
  QUESTIONS.push(OFFICE_QUESTIONS[i]);
  QUESTIONS.push(OVERLAY_QUESTIONS[i]);
}

// ─── SCORING ──────────────────────────────────────────────────────────────
function calculateArchetype(answers) {
  const officeScores = { apostolic: 0, prophetic: 0, evangelistic: 0, pastoral: 0, teaching: 0 };
  const overlayScores = { builder: 0, burden_bearer: 0, reformer: 0, covenant_keeper: 0, equipper: 0 };

  answers.forEach((answer, idx) => {
    const question = QUESTIONS[idx];
    if (question.track === 'office') officeScores[answer.score] += 1;
    else overlayScores[answer.score] += 1;
  });

  const topOffice = Object.keys(officeScores).reduce((a, b) =>
    officeScores[a] > officeScores[b] ? a : b
  );
  const topOverlay = Object.keys(overlayScores).reduce((a, b) =>
    overlayScores[a] > overlayScores[b] ? a : b
  );

  return { office: topOffice, overlay: topOverlay, officeScores, overlayScores,
    archetypeId: `${topOffice}_${topOverlay}` };
}

// Office display labels
const OFFICE_LABELS = {
  apostolic: 'Apostolic', prophetic: 'Prophetic', evangelistic: 'Evangelistic',
  pastoral: 'Pastoral', teaching: 'Teaching',
};
const OVERLAY_LABELS = {
  builder: 'Builder', burden_bearer: 'Burden Bearer', reformer: 'Reformer',
  covenant_keeper: 'Covenant Keeper', equipper: 'Equipper',
};

// ─── COMPONENT ────────────────────────────────────────────────────────────
export default function AssessmentPage() {
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [gateData, setGateData] = useState({ firstName: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Layer 2
  const [helperOpen, setHelperOpen] = useState(false);

  // Layer 3
  const [midReflectionLoading, setMidReflectionLoading] = useState(false);
  const [midReflectionText, setMidReflectionText] = useState('');
  const [midReflectionDone, setMidReflectionDone] = useState(false);

  // Layer 4 + 5
  const [mirrorPhase, setMirrorPhase] = useState('idle'); // 'idle' | 'loading' | 'done'
  const [mirrorText, setMirrorText] = useState('');
  const [archetypeResult, setArchetypeResult] = useState(null);
  const [tierData, setTierData] = useState(null);

  // ── Answer a question ────────────────────────────────────────────────────
  const handleAnswer = (option) => {
    const newAnswers = [...answers, { ...option, question: QUESTIONS[currentQ].question }];
    setAnswers(newAnswers);
    setHelperOpen(false);

    const nextQ = currentQ + 1;

    // Trigger mid-reflection after Q5 (index 4 answered → next is index 5)
    if (nextQ === 5 && !midReflectionDone) {
      setCurrentQ(5);
      triggerMidReflection(newAnswers, gateData.firstName);
    } else if (nextQ >= QUESTIONS.length) {
      setCurrentQ(QUESTIONS.length); // gate
    } else {
      setCurrentQ(nextQ);
    }
  };

  const handleBack = () => {
    if (currentQ > 0 && currentQ < QUESTIONS.length) {
      setAnswers(answers.slice(0, -1));
      setCurrentQ(currentQ - 1);
      setHelperOpen(false);
    }
  };

  // ── Layer 3 — mid-reflection ─────────────────────────────────────────────
  const triggerMidReflection = async (currentAnswers, firstName) => {
    setMidReflectionLoading(true);
    try {
      const res = await fetch('/api/called-to-carry/mid-reflection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: currentAnswers, firstName }),
      });
      const data = await res.json();
      setMidReflectionText(data.reflection || '');
    } catch {
      setMidReflectionText('');
    } finally {
      setMidReflectionLoading(false);
    }
  };

  // ── Gate submit ──────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = calculateArchetype(answers);

      // 1. Write to DB + send archetype email (existing endpoint)
      const res = await fetch('/api/called-to-carry/submit-archetype', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: gateData.firstName,
          email: gateData.email,
          office: result.office,
          overlay: result.overlay,
          archetypeId: result.archetypeId,
          officeScores: result.officeScores,
          overlayScores: result.overlayScores,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed.');

      // 2. Non-blocking Icegram capture
      fetch('/api/called-to-carry/capture-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: gateData.email, firstName: gateData.firstName }),
      }).catch(() => {});

      // 3. Build archetype display data
      const displayName = `${OFFICE_LABELS[result.office] || result.office} ${OVERLAY_LABELS[result.overlay] || result.overlay}`;
      const archetype = { ...result, displayName };
      setArchetypeResult(archetype);
      setTierData(getRecommendedTier(result.office, result.overlay));

      // 4. Layer 4 — fetch prophetic mirror
      setMirrorPhase('loading');
      const mirrorRes = await fetch('/api/called-to-carry/prophetic-mirror', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ archetype, answers, firstName: gateData.firstName }),
      });
      const mirrorData = await mirrorRes.json();
      setMirrorText(mirrorData.mirror || '');
      setMirrorPhase('done');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // ════════════════════════════════════════════════════════════════════════
  // VIEWS
  // ════════════════════════════════════════════════════════════════════════

  // ── Layer 1: Enhanced intro ──────────────────────────────────────────────
  if (!started) {
    return (
      <>
        <Head><title>Called to Carry Assessment — Awakening Destiny Global</title></Head>
        <div className={styles.page}>
          <div className={styles.landingInner}>
            <p className={styles.eyebrow}>The Called to Carry Assessment</p>
            <h1 className={styles.title}>Discover What You Were Built to Carry.</h1>
            <p className={styles.subtitle}>
              Ten questions. Two tracks. One archetype that names the grace on your
              leadership and the weight you were built to carry.
            </p>
            <ul className={styles.benefits}>
              <li>5 Offices × 5 Overlays = 25 unique archetype combinations</li>
              <li>Personalised identity insight rooted in Scripture</li>
              <li>A prophetic word spoken over your specific archetype</li>
              <li>Takes less than 5 minutes</li>
            </ul>
            <p className={styles.subtitle} style={{ fontSize: '14px', opacity: 0.6, marginTop: '-8px' }}>
              Answer from who you actually are — not who you are trying to become.
              There are no wrong answers. There is only your truth.
            </p>
            <button onClick={() => setStarted(true)} className={styles.btnPrimary}>
              Begin the Assessment →
            </button>
          </div>
        </div>
      </>
    );
  }

  // ── Layer 3: Mid-reflection (after Q5, before Q6) ────────────────────────
  if (currentQ === 5 && !midReflectionDone) {
    return (
      <>
        <Head><title>Halfway — Called to Carry</title></Head>
        <div className={styles.page}>
          <div className={c.midReflectionWrap}>
            {midReflectionLoading || !midReflectionText ? (
              <>
                <p className={c.midReflectionEyebrow}>Listening to what you have shared…</p>
                <div className={c.midReflectionSpinner} />
                <p className={c.midReflectionLoadText}>A word is forming.</p>
              </>
            ) : (
              <>
                <p className={c.midReflectionEyebrow}>Halfway through</p>
                <div className={c.midReflectionCard}>
                  <p className={c.midReflectionText}>{midReflectionText}</p>
                  <button
                    className={c.midReflectionContinue}
                    onClick={() => setMidReflectionDone(true)}
                  >
                    Continue → <span style={{ opacity: 0.7 }}>5 questions remaining</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </>
    );
  }

  // ── Gate ─────────────────────────────────────────────────────────────────
  if (currentQ >= QUESTIONS.length && mirrorPhase === 'idle') {
    return (
      <>
        <Head><title>Your Archetype — Called to Carry</title></Head>
        <div className={styles.page}>
          <div className={styles.gateInner}>
            <p className={styles.eyebrow}>Your Archetype Is Ready</p>
            <h1 className={styles.title}>Where should we send your results?</h1>
            <p className={styles.subtitle}>
              Enter your name and email to receive your Called to Carry archetype
              with a personalised prophetic word.
            </p>
            <form onSubmit={handleSubmit} className={styles.gateForm}>
              <input
                type="text"
                required
                placeholder="First name"
                value={gateData.firstName}
                onChange={e => setGateData({ ...gateData, firstName: e.target.value })}
                className={styles.input}
              />
              <input
                type="email"
                required
                placeholder="Your email address"
                value={gateData.email}
                onChange={e => setGateData({ ...gateData, email: e.target.value })}
                className={styles.input}
              />
              {error && <p className={styles.error}>{error}</p>}
              <button type="submit" disabled={loading} className={styles.btnPrimary}>
                {loading ? 'Processing…' : 'Reveal My Archetype →'}
              </button>
              <p className={styles.privacyNote}>We respect your inbox. No spam, ever.</p>
            </form>
          </div>
        </div>
      </>
    );
  }

  // ── Layer 4 + 5: Mirror loading → reveal ────────────────────────────────
  if (mirrorPhase === 'loading' || mirrorPhase === 'done') {
    const { primary, secondary } = tierData || {};

    return (
      <>
        <Head><title>Your Archetype — Called to Carry</title></Head>
        <div className={styles.page}>
          {mirrorPhase === 'loading' ? (
            <div className={c.mirrorLoadWrap}>
              <div className={c.mirrorSpinner} />
              <p className={c.mirrorLoadText}>Speaking your prophetic word…</p>
            </div>
          ) : (
            <div className={c.mirrorWrap}>
              {/* Archetype identity */}
              <div className={c.mirrorArchetypeLabel}>
                <span className={c.mirrorEyebrow}>Your Archetype</span>
                <h1 className={c.mirrorArchetypeName}>{archetypeResult?.displayName}</h1>
                <div className={c.mirrorDivider} />
              </div>

              {/* Layer 4: Prophetic mirror */}
              {mirrorText && (
                <div className={c.mirrorCard}>
                  <p className={c.mirrorSectionLabel}>A Word for You</p>
                  <p className={c.mirrorText}>{mirrorText}</p>
                </div>
              )}

              {/* Layer 5: Tier routing */}
              {primary && (
                <div className={c.tierWrap}>
                  <h2 className={c.tierHeading}>Your Recommended Next Step</h2>
                  <p className={c.tierSubheading}>
                    Based on your archetype, here is where this journey continues.
                  </p>

                  {/* Primary tier */}
                  <div className={`${c.tierCard} ${c.tierCardPrimary}`}>
                    <span className={c.tierBadge}>{primary.badge}</span>
                    <p className={c.tierName}>{primary.name}</p>
                    <p className={c.tierPrice}>{primary.price}</p>
                    <p className={c.tierTagline}>{primary.tagline}</p>
                    <Link href={primary.href} className={c.tierCta}>
                      {primary.cta} →
                    </Link>
                  </div>

                  {/* Secondary tier */}
                  {secondary && (
                    <div className={c.tierCard}>
                      <p className={c.tierName}>{secondary.name}</p>
                      <p className={c.tierPrice}>{secondary.price}</p>
                      <p className={c.tierTagline}>{secondary.tagline}</p>
                      <Link href={secondary.href} className={`${c.tierCta} ${c.tierCtaSecondary}`}>
                        {secondary.cta} →
                      </Link>
                    </div>
                  )}

                  <p style={{ textAlign: 'center', marginTop: 32, fontSize: 13,
                    color: 'rgba(253,248,240,0.35)', fontFamily: 'Outfit, sans-serif' }}>
                    Your full archetype — including Your Strength, Your Temptation,
                    and Your Scripture — is waiting inside the portal.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </>
    );
  }

  // ── Question view ────────────────────────────────────────────────────────
  const question = QUESTIONS[currentQ];
  const progress = ((currentQ + 1) / QUESTIONS.length) * 100;
  const helperText = QUESTION_HELPER_TEXT[question?.id];

  return (
    <>
      <Head><title>Question {currentQ + 1} of {QUESTIONS.length} — Called to Carry</title></Head>
      <div className={styles.page}>
        <div className={styles.questionInner}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
          <p className={styles.progressText}>
            Question {currentQ + 1} of {QUESTIONS.length}
            <span className={styles.trackBadge}>
              {question.track === 'office' ? 'Office' : 'Overlay'}
            </span>
          </p>
          <h2 className={styles.questionText}>{question.question}</h2>

          {/* Layer 2: Helper text toggle */}
          {helperText && (
            <>
              <button
                className={c.helperToggle}
                onClick={() => setHelperOpen(!helperOpen)}
                type="button"
              >
                <span className={c.helperToggleIcon}>{helperOpen ? '−' : '?'}</span>
                {helperOpen ? 'Hide guidance' : 'How should I answer this?'}
              </button>
              {helperOpen && <p className={c.helperText}>{helperText}</p>}
            </>
          )}

          <div className={styles.options}>
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(option)}
                className={styles.optionButton}
              >
                <span className={styles.optionLabel}>{String.fromCharCode(65 + idx)}</span>
                <span className={styles.optionText}>{option.label}</span>
              </button>
            ))}
          </div>
          {currentQ > 0 && (
            <button onClick={handleBack} className={styles.btnBack}>← Back</button>
          )}
        </div>
      </div>
    </>
  );
}
