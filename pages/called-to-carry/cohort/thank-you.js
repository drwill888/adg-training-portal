import Head from 'next/head';
import { useRouter } from 'next/router';

const NAVY = '#021A35';
const GOLD = '#FDD20D';

export default function CohortThankYou() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>You're In — Called to Carry Cohort</title>
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <div style={{ background: NAVY, minHeight: '100vh', fontFamily: "'Outfit', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ maxWidth: 580, textAlign: 'center' }}>

          <div style={{ fontSize: '3rem', marginBottom: 24 }}>✓</div>

          <p style={{ color: GOLD, fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', fontStyle: 'italic', marginBottom: 16 }}>
            Called to Carry Cohort
          </p>

          <h1 style={{ color: 'white', fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, lineHeight: 1.2, margin: '0 0 24px' }}>
            Your Application Is In.
          </h1>

          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: 16 }}>
            Payment confirmed. Your application has been received and your spot is secured.
          </p>

          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: 40 }}>
            Will reviews each application personally. You will receive an email within 48 hours with next steps, cohort dates, and access to the portal.
          </p>

          <div style={{ background: 'rgba(253,210,13,0.08)', border: '1px solid rgba(253,210,13,0.25)', borderRadius: 12, padding: '24px 28px', marginBottom: 40, textAlign: 'left' }}>
            <p style={{ color: GOLD, fontWeight: 600, margin: '0 0 12px', fontSize: '0.95rem' }}>What happens next:</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                'Check your email for a payment confirmation from Stripe',
                'Will reviews your application within 48 hours',
                'You will receive onboarding details and cohort schedule',
                'Portal access is granted before the first session',
              ].map((item, i) => (
                <li key={i} style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ color: GOLD, flexShrink: 0 }}>→</span> {item}
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => router.push('/')}
            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.6)', padding: '12px 28px', borderRadius: 8, fontSize: '0.9rem', cursor: 'pointer' }}>
            Return to Home
          </button>

        </div>
      </div>
    </>
  );
}