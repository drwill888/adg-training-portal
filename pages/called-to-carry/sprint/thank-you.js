// pages/called-to-carry/sprint/thank-you.js
import Head from 'next/head';
import Link from 'next/link';

const NAVY = '#021A35';
const GOLD = '#C8A951';

export default function SprintThankYou() {
  return (
    <>
      <Head>
        <title>Application Received — 21-Day Sprint</title>
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <div style={{ background: NAVY, minHeight: '100vh', fontFamily: "'Outfit', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ maxWidth: 560, textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: 24 }}>✓</div>
          <p style={{ color: GOLD, fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', fontStyle: 'italic', marginBottom: 16 }}>
            21-Day Sprint
          </p>
          <h1 style={{ color: 'white', fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, lineHeight: 1.2, margin: '0 0 24px' }}>
            Your Application Is In.
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: 16 }}>
            Will reviews every Sprint application personally. This is not open enrollment — every seat is confirmed individually.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: 40 }}>
            Check your email for a confirmation. No payment is collected at this step — Will will reach out within 48 hours to confirm fit before enrollment is finalized.
          </p>
          <div style={{ background: 'rgba(200,169,81,0.08)', border: '1px solid rgba(200,169,81,0.25)', borderRadius: 12, padding: '24px 28px', marginBottom: 40, textAlign: 'left' }}>
            <p style={{ color: GOLD, fontWeight: 600, margin: '0 0 12px', fontSize: '0.95rem' }}>What happens next:</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                'Check your email for an application confirmation',
                'Will reviews your application within 48 hours',
                'Will reaches out directly to confirm fit and timing',
                'Enrollment is finalized and you receive a payment link',
              ].map((item, i) => (
                <li key={i} style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ color: GOLD, flexShrink: 0 }}>→</span> {item}
                </li>
              ))}
            </ul>
          </div>
          <Link href="/called-to-carry/sprint"
            style={{ display: 'inline-block', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.6)', padding: '12px 28px', borderRadius: 8, fontSize: '0.9rem', textDecoration: 'none' }}>
            Return to Called to Carry
          </Link>
        </div>
      </div>
    </>
  );
}