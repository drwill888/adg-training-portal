import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const FOR_WHOM = [
  "You carry a weight you can't fully explain — and you're done carrying it alone",
  "You've been called to something bigger but you're not sure how to step into it",
  "You're building something — a ministry, a business, a movement — and you need the right people around you",
  "You sense this is a kairos moment and you want to move with precision, not impulse",
  "You want accountability, prophetic sharpening, and apostolic framework — not just information",
];

const INCLUDES = [
  { icon: '🔥', title: '6 Live Cohort Sessions', desc: 'Deep-dive group calls with Will — apostolic teaching, prophetic activation, and strategic formation' },
  { icon: '📖', title: 'Called to Carry Framework', desc: 'The full 5C Leadership Blueprint mapped to your office and assignment' },
  { icon: '🧭', title: 'Archetype Integration', desc: 'Your Called to Carry archetype applied to every decision, relationship, and build' },
  { icon: '🤝', title: 'Covenant Community', desc: 'A cohort of aligned leaders walking the same road — iron sharpening iron' },
  { icon: '⚡', title: 'Prophetic Portal Access', desc: 'Full access to the Called to Carry training portal and AI Blueprint tools' },
  { icon: '📧', title: 'Direct Access to Will', desc: 'Private channel for questions, prayer, and strategic input between sessions' },
];

const NAVY = '#021A35';
const GOLD = '#FDD20D';
const GOLD_DARK = '#C8A951';

export default function CohortPage({ cohortOpen }) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleWaitlist(e) {
    e.preventDefault();
    setLoading(true);
    await supabase.from('cohort_waitlist').upsert(
      { email, first_name: name || null },
      { onConflict: 'email' }
    );
    setSubmitted(true);
    setLoading(false);
  }

  return (
    <>
      <Head>
        <title>Called to Carry Cohort — Awakening Destiny Global</title>
        <meta name="description" content="A covenant cohort for leaders who carry an assignment they cannot outrun. Limited seats." />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div style={{ background: NAVY, minHeight: '100vh', fontFamily: "'Outfit', sans-serif" }}>

        {/* Hero */}
        <section style={{ padding: '80px 24px 64px', textAlign: 'center', maxWidth: 720, margin: '0 auto' }}>
          <p style={{ color: GOLD, fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', fontStyle: 'italic', marginBottom: 20 }}>
            A Covenant Cohort for Kingdom Leaders
          </p>
          <h1 style={{ color: 'white', fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.4rem, 6vw, 4rem)', fontWeight: 700, lineHeight: 1.15, margin: '0 0 28px' }}>
            You Were Built to Carry This.
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: 40 }}>
            The Called to Carry Cohort is a six-week apostolic formation experience for leaders who sense the weight of assignment and are ready to build with clarity, covenant, and conviction.
          </p>
          {cohortOpen ? (
            <button
              onClick={() => router.push('/cohort/apply')}
              style={{ background: GOLD, color: NAVY, border: 'none', padding: '18px 48px', borderRadius: 8, fontSize: '1.05rem', fontWeight: 700, cursor: 'pointer' }}>
              Apply for the Cohort — $497
            </button>
          ) : (
            <div style={{ display: 'inline-block', background: 'rgba(253,210,13,0.1)', border: '1px solid rgba(253,210,13,0.3)', borderRadius: 8, padding: '14px 32px' }}>
              <p style={{ color: GOLD, margin: 0, fontWeight: 600 }}>Enrollment is currently closed</p>
              <p style={{ color: 'rgba(255,255,255,0.55)', margin: '6px 0 0', fontSize: '0.85rem' }}>Join the waitlist below</p>
            </div>
          )}
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem', marginTop: 16 }}>Limited to 12 leaders per cohort</p>
        </section>

        {/* Who It Is For */}
        <section style={{ padding: '64px 24px', maxWidth: 720, margin: '0 auto' }}>
          <h2 style={{ color: 'white', fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>
            This Cohort Is for You If...
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {FOR_WHOM.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', padding: '18px 20px', background: 'rgba(255,255,255,0.04)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.07)' }}>
                <span style={{ color: GOLD, fontSize: '1.2rem', flexShrink: 0 }}>→</span>
                <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, lineHeight: 1.6 }}>{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* What Is Included */}
        <section style={{ padding: '64px 24px', background: 'rgba(1,114,188,0.08)' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <h2 style={{ color: 'white', fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 700, textAlign: 'center', marginBottom: 48 }}>
              What Is Included
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
              {INCLUDES.map((item, i) => (
                <div key={i} style={{ padding: '24px', background: 'rgba(255,255,255,0.05)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: '1.8rem', marginBottom: 12 }}>{item.icon}</div>
                  <h3 style={{ color: 'white', margin: '0 0 8px', fontSize: '1rem', fontWeight: 600 }}>{item.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0, fontSize: '0.88rem', lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section style={{ padding: '80px 24px', textAlign: 'center', maxWidth: 560, margin: '0 auto' }}>
          <h2 style={{ color: 'white', fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 700, marginBottom: 32 }}>Investment</h2>
          <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(253,210,13,0.25)', borderRadius: 16, padding: '40px 32px', marginBottom: 32 }}>
            <p style={{ color: GOLD, fontFamily: "'Cormorant Garamond', serif", fontSize: '3.5rem', fontWeight: 700, margin: '0 0 8px', lineHeight: 1 }}>$497</p>
            <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0, fontSize: '0.9rem' }}>One-time payment. Full cohort access.</p>
            <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '24px 0' }} />
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, textAlign: 'left' }}>
              {['6 live sessions with Will', 'Full portal and training access', 'Archetype integration work', 'Covenant community access', 'Direct access channel'].map((item, i) => (
                <li key={i} style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.92rem', padding: '6px 0', display: 'flex', gap: 10 }}>
                  <span style={{ color: GOLD }}>✓</span> {item}
                </li>
              ))}
            </ul>
          </div>

          {cohortOpen ? (
            <>
              <button
                onClick={() => router.push('/cohort/apply')}
                style={{ background: GOLD, color: NAVY, border: 'none', padding: '18px', borderRadius: 8, fontSize: '1.05rem', fontWeight: 700, cursor: 'pointer', width: '100%' }}>
                Apply Now — $497
              </button>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', marginTop: 14 }}>
                Applications reviewed within 48 hours. Secure checkout via Stripe.
              </p>
            </>
          ) : !submitted ? (
            <form onSubmit={handleWaitlist}>
              <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 20 }}>Enrollment is closed. Join the waitlist.</p>
              <input type="text" placeholder="First name" value={name} onChange={e => setName(e.target.value)}
                style={{ width: '100%', padding: '14px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.07)', color: 'white', fontSize: '0.95rem', marginBottom: 12, boxSizing: 'border-box' }} />
              <input type="email" required placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)}
                style={{ width: '100%', padding: '14px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.07)', color: 'white', fontSize: '0.95rem', marginBottom: 16, boxSizing: 'border-box' }} />
              <button type="submit" disabled={loading}
                style={{ width: '100%', background: GOLD, color: NAVY, border: 'none', padding: '16px', borderRadius: 8, fontSize: '1rem', fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Joining...' : 'Join the Waitlist'}
              </button>
            </form>
          ) : (
            <div style={{ background: 'rgba(253,210,13,0.1)', border: '1px solid rgba(253,210,13,0.3)', borderRadius: 12, padding: '28px 24px' }}>
              <p style={{ color: GOLD, fontWeight: 600, margin: '0 0 8px' }}>You are on the waitlist.</p>
              <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0, fontSize: '0.9rem' }}>We will notify you when enrollment opens.</p>
            </div>
          )}
        </section>

        <div style={{ textAlign: 'center', padding: '24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.8rem', margin: 0 }}>
            {new Date().getFullYear()} Awakening Destiny Global
          </p>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const val = (process.env.CALLED_TO_CARRY_COHORT_OPEN || '').toLowerCase().trim();
  const cohortOpen = val === 'true' || val === '1' || val === 'yes';
  return { props: { cohortOpen } };
}