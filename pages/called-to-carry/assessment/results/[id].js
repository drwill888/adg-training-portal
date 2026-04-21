// pages/called-to-carry/assessment/results/[id].js
// Archetype results page. Fetches submission by ID, displays archetype content.
// Server-side rendered — submission ID comes from URL.

import Head from 'next/head';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { ARCHETYPES } from '../../../../lib/called-to-carry/archetypes';
// ARCHETYPES is a keyed object — access by archetype id directly

export async function getServerSideProps({ params }) {
  const { id } = params;

  // Basic UUID check
  if (!id || !/^[0-9a-f-]{36}$/.test(id)) {
    return { notFound: true };
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data, error } = await supabase
    .from('assessment_submissions')
    .select('id, first_name, archetype, archetype_confidence, scores, completed_at')
    .eq('id', id)
    .single();

  if (error || !data || !data.archetype) {
    return { notFound: true };
  }

  return {
    props: {
      submission: {
        id: data.id,
        firstName: data.first_name || null,
        archetype: data.archetype,
        confidence: data.archetype_confidence,
        scores: data.scores,
        completedAt: data.completed_at,
      },
    },
  };
}

export default function AssessmentResults({ submission }) {
  const archetype = ARCHETYPES[submission.archetype];

  if (!archetype) {
    return (
      <div style={styles.page}>
        <p style={{ textAlign: 'center', padding: '4rem', opacity: 0.6 }}>
          Results not found.
        </p>
      </div>
    );
  }

  const firstName = submission.firstName;
  const greeting = firstName ? `${firstName}, you are` : 'You are';

  return (
    <div style={styles.page}>
      <Head>
        <title>{archetype.name} — Called to Carry Results</title>
        <meta name="description" content={`Your Called to Carry archetype: ${archetype.name}. ${archetype.subtitle}`} />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </Head>

      <main style={styles.main}>

        {/* Header */}
        <div style={styles.header}>
          <p style={styles.eyebrow}>Called to Carry · Your Result</p>
          <p style={styles.greeting}>{greeting}</p>
          <h1 style={styles.archetypeName}>{archetype.name.replace(/_/g, ' ')}</h1>
          <p style={styles.subtitle}>{archetype.subtitle}</p>
        </div>

        {/* Body paragraphs */}
        <div style={styles.body}>
          {archetype.body.map((para, i) => (
            <p key={i} style={styles.para}>{para}</p>
          ))}
        </div>

        {/* Next steps */}
        <div style={styles.nextStepsCard}>
          <p style={styles.cardLabel}>Your Next Steps</p>
          <ul style={styles.nextStepsList}>
            {archetype.nextSteps.map((step, i) => (
              <li key={i} style={styles.nextStepItem}>
                <span style={styles.stepDot}>→</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div style={styles.ctaSection}>
          <Link href={archetype.cta.primary.href} style={styles.ctaBtn}>
            {archetype.cta.primary.label}
          </Link>
          {archetype.cta.fallback && (
            <p style={styles.ctaNote}>{archetype.cta.fallback}</p>
          )}
        </div>

        {/* Score breakdown (subtle) */}
        <div style={styles.scores}>
          <p style={styles.scoresLabel}>Score breakdown</p>
          <div style={styles.scoreGrid}>
            {Object.entries(submission.scores || {}).map(([key, val]) => (
              <div key={key} style={styles.scoreItem}>
                <span style={styles.scoreKey}>{key.replace(/_/g, ' ')}</span>
                <span style={styles.scoreVal}>{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p style={styles.footerNote}>
          A copy of your results has been sent to your email.{' '}
          <Link href="/" style={styles.footerLink}>Return to Called to Carry</Link>
        </p>

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
  },
  main: {
    maxWidth: '680px',
    margin: '0 auto',
    padding: '4rem 1.5rem 6rem',
  },
  header: {
    textAlign: 'center',
    marginBottom: '3rem',
  },
  eyebrow: {
    color: '#C8A951',
    letterSpacing: '0.12em',
    fontSize: '0.78rem',
    textTransform: 'uppercase',
    fontFamily: "'Outfit', sans-serif",
    marginBottom: '1.5rem',
  },
  greeting: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: '1rem',
    opacity: 0.7,
    marginBottom: '0.4rem',
  },
  archetypeName: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: 'clamp(2rem, 6vw, 3.5rem)',
    fontWeight: 400,
    lineHeight: 1.1,
    marginBottom: '1rem',
    textTransform: 'capitalize',
  },
  subtitle: {
    fontSize: '1.1rem',
    lineHeight: 1.6,
    opacity: 0.8,
    fontStyle: 'italic',
    maxWidth: '480px',
    margin: '0 auto',
  },
  body: {
    marginBottom: '2.5rem',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    paddingTop: '2.5rem',
  },
  para: {
    fontSize: '1.05rem',
    lineHeight: 1.8,
    marginBottom: '1.25rem',
    opacity: 0.9,
  },
  nextStepsCard: {
    background: 'rgba(200,169,81,0.08)',
    border: '1px solid rgba(200,169,81,0.2)',
    borderRadius: '8px',
    padding: '2rem',
    marginBottom: '2.5rem',
  },
  cardLabel: {
    color: '#C8A951',
    fontFamily: "'Outfit', sans-serif",
    fontSize: '0.78rem',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    marginBottom: '1.25rem',
  },
  nextStepsList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.9rem',
  },
  nextStepItem: {
    display: 'flex',
    gap: '0.75rem',
    fontFamily: "'Outfit', sans-serif",
    fontSize: '0.95rem',
    lineHeight: 1.55,
    alignItems: 'flex-start',
  },
  stepDot: {
    color: '#C8A951',
    flexShrink: 0,
  },
  ctaSection: {
    textAlign: 'center',
    marginBottom: '3rem',
    padding: '2.5rem 0',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  ctaIntro: {
    fontSize: '1rem',
    lineHeight: 1.7,
    opacity: 0.8,
    marginBottom: '1.5rem',
    maxWidth: '480px',
    margin: '0 auto 1.5rem',
  },
  ctaBtn: {
    display: 'inline-block',
    background: '#C8A951',
    color: '#021A35',
    borderRadius: '4px',
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 600,
    fontSize: '1rem',
    padding: '0.9rem 2.2rem',
    textDecoration: 'none',
    marginBottom: '1rem',
  },
  ctaNote: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: '0.8rem',
    opacity: 0.5,
    marginTop: '0.75rem',
  },
  scores: {
    marginBottom: '2rem',
    opacity: 0.45,
  },
  scoresLabel: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: '0.75rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    marginBottom: '0.75rem',
  },
  scoreGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.4rem 2rem',
  },
  scoreItem: {
    display: 'flex',
    justifyContent: 'space-between',
    fontFamily: "'Outfit', sans-serif",
    fontSize: '0.82rem',
  },
  scoreKey: {
    textTransform: 'capitalize',
  },
  scoreVal: {
    color: '#C8A951',
  },
  footerNote: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: '0.82rem',
    opacity: 0.45,
    textAlign: 'center',
  },
  footerLink: {
    color: '#C8A951',
  },
};
