// pages/mid-journey-report.js
import Head from 'next/head';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const OFFICE_DISPLAY = {
  apostolic: 'Apostolic', prophetic: 'Prophetic', evangelistic: 'Evangelistic',
  pastoral: 'Pastoral', teaching: 'Teaching',
};
const OVERLAY_DISPLAY = {
  builder: 'Builder', burden_bearer: 'Burden Bearer', reformer: 'Reformer',
  covenant_keeper: 'Covenant Keeper', equipper: 'Equipper',
};

export async function getServerSideProps({ req }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  // Get auth token from cookie
  const cookies = req.headers.cookie || '';
  const tokenMatch = cookies.match(/sb-[^=]+-auth-token=([^;]+)/);
  
  let userId = null;
  let userEmail = null;

  if (tokenMatch) {
    try {
      const decoded = decodeURIComponent(tokenMatch[1]);
      const tokenData = JSON.parse(decoded);
      userId = tokenData?.user?.id || tokenData?.[0]?.user?.id;
      userEmail = tokenData?.user?.email || tokenData?.[0]?.user?.email;
    } catch (e) {}
  }

  // Also try getting user from Supabase auth header
  if (!userId) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
      userId = user?.id;
      userEmail = user?.email;
    }
  }

  if (!userId && !userEmail) {
    return { redirect: { destination: '/login?redirect=/mid-journey-report', permanent: false } };
  }

  // Try by user_id first, then email fallback
  let report = null;
  if (userId) {
    const { data } = await supabase
      .from('mid_journey_reports')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    report = data;
  }
  if (!report && userEmail) {
    const { data } = await supabase
      .from('mid_journey_reports')
      .select('*')
      .eq('email', userEmail)
      .maybeSingle();
    report = data;
  }

  return {
    props: {
      report: report ? JSON.parse(JSON.stringify(report)) : null,
      userId: userId || null,
      userEmail: userEmail || null,
    },
  };
}

export default function MidJourneyReportPage({ report, userId }) {
  async function handleDownload() {
    if (!userId) return;
    window.location.href = `/api/mid-journey/download-docx?userId=${userId}`;
  }

  if (!report) {
    return (
      <div style={styles.page}>
        <Head><title>Mid-Journey Blueprint — Awakening Destiny</title></Head>
        <main style={styles.main}>
          <p style={styles.eyebrow}>Mid-Journey Blueprint</p>
          <h1 style={styles.lockedTitle}>Not Yet Unlocked</h1>
          <p style={styles.lockedBody}>
            Your Mid-Journey Blueprint becomes available after you complete the Capacity module (Module 4).
          </p>
          <Link href="/dashboard" style={styles.ctaBtn}>Back to Dashboard</Link>
        </main>
      </div>
    );
  }

  const officeName = OFFICE_DISPLAY[report.archetype_office] || report.archetype_office;
  const overlayName = OVERLAY_DISPLAY[report.archetype_overlay] || report.archetype_overlay;
  const archetypeDisplay = `The ${officeName} ${overlayName}`;

  return (
    <div style={styles.page}>
      <Head>
        <title>Your Mid-Journey Blueprint — Awakening Destiny</title>
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <main style={styles.main}>
        <div style={styles.header}>
          <p style={styles.eyebrow}>Mid-Journey Blueprint · Your Report</p>
          <h1 style={styles.title}>{archetypeDisplay}</h1>
          <p style={styles.subtitle}>Generated at the Capacity threshold — your formation diagnostic across Calling, Connection, Competency, and Capacity.</p>
        </div>
        <div style={styles.actionRow}>
          <button onClick={handleDownload} style={styles.downloadBtn}>Download as Word Document</button>
          <Link href="/dashboard" style={styles.backLink}>← Dashboard</Link>
        </div>
        <article style={styles.article}>
          {renderMarkdown(report.content)}
        </article>
        <div style={styles.footer}>
          <p style={styles.footerNote}>
            Generated {new Date(report.generated_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} · Awakening Destiny Global
          </p>
        </div>
      </main>
    </div>
  );
}

function renderMarkdown(text) {
  if (!text) return null;
  return text.trim().split(/\n\n+/).map((block, i) => {
    if (block.startsWith('## ')) {
      return <h2 key={i} style={styles.h2}>{block.replace(/^## /, '')}</h2>;
    }
    const parts = block.split(/(\*[^*]+\*)/g).map((part, j) => {
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={j} style={styles.italic}>{part.slice(1, -1)}</em>;
      }
      return part;
    });
    return <p key={i} style={styles.para}>{parts}</p>;
  });
}

const styles = {
  page: { background: '#021A35', minHeight: '100vh', color: '#FDF8F0', fontFamily: "'Outfit', sans-serif" },
  main: { maxWidth: '720px', margin: '0 auto', padding: '4rem 1.5rem 6rem' },
  header: { textAlign: 'center', marginBottom: '2rem' },
  eyebrow: { color: '#C8A951', letterSpacing: '0.14em', fontSize: '0.78rem', textTransform: 'uppercase', marginBottom: '1.5rem', fontWeight: 500 },
  title: { fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(2.2rem, 6vw, 3.6rem)', fontWeight: 400, lineHeight: 1.1, marginBottom: '1rem' },
  subtitle: { fontSize: '1rem', lineHeight: 1.6, opacity: 0.7, fontStyle: 'italic', maxWidth: '520px', margin: '0 auto' },
  actionRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)' },
  downloadBtn: { background: '#C8A951', color: '#021A35', border: 'none', borderRadius: '4px', padding: '0.8rem 1.6rem', fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' },
  backLink: { color: '#C8A951', textDecoration: 'none', fontSize: '0.9rem', opacity: 0.7 },
  article: { fontFamily: 'Georgia, serif' },
  h2: { fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1.4rem, 3.5vw, 1.9rem)', fontWeight: 400, color: '#C8A951', marginTop: '2.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(200,169,81,0.2)', paddingBottom: '0.5rem' },
  para: { fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '1.25rem', opacity: 0.92 },
  italic: { fontStyle: 'italic', color: '#FDD20D' },
  footer: { textAlign: 'center', marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)' },
  footerNote: { fontSize: '0.78rem', opacity: 0.45, letterSpacing: '0.05em' },
  lockedTitle: { fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '2.5rem', fontWeight: 400, textAlign: 'center', marginBottom: '1.5rem' },
  lockedBody: { fontSize: '1.05rem', lineHeight: 1.7, textAlign: 'center', opacity: 0.8, maxWidth: '480px', margin: '1rem auto 2.5rem' },
  ctaBtn: { display: 'block', background: '#C8A951', color: '#021A35', textDecoration: 'none', padding: '0.85rem 2rem', borderRadius: '4px', fontWeight: 600, textAlign: 'center', maxWidth: '200px', margin: '0 auto' },
};