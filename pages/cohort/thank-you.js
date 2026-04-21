// pages/cohort/thank-you.js
// Handles two entry points:
//   ?applied=true   — after application form submission
//   ?session_id=... — after successful Stripe checkout
//   (no params)     — generic fallback

import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from '../../styles/CohortThankYou.module.css';

export default function CohortThankYou() {
  const router = useRouter();
  const { applied, session_id } = router.query;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isPurchase = !!session_id;
  const isApplication = !!applied;

  return (
    <>
      <Head>
        <title>
          {isPurchase ? 'Payment Confirmed' : 'Application Received'} — Called to Carry
        </title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=Outfit:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className={styles.page}>
        <div className={styles.grain} aria-hidden="true" />

        <main className={`${styles.main} ${mounted ? styles.visible : ''}`}>
          <div className={styles.mark}>✦</div>

          {isPurchase ? (
            <>
              <p className={styles.eyebrow}>Payment Confirmed · Founder Cohort</p>
              <h1 className={styles.heading}>
                You're in.<br />
                <em>Welcome to the cohort.</em>
              </h1>
              <p className={styles.body}>
                Your investment is confirmed. You'll receive an email within 24 hours with
                your onboarding details, cohort start date, and access to the 5C Leadership
                Blueprint portal.
              </p>
              <p className={styles.body}>
                You made the decision. Now show up fully. This is your season.
              </p>
            </>
          ) : (
            <>
              <p className={styles.eyebrow}>Application Received · Founder Cohort</p>
              <h1 className={styles.heading}>
                It's in our hands now.<br />
                <em>Stay ready.</em>
              </h1>
              <p className={styles.body}>
                Your application has been received. Every application is reviewed personally —
                expect a response within 3–5 business days.
              </p>
              <p className={styles.body}>
                In the meantime, stay in the Word. Stay in prayer. What you carry was placed
                there on purpose — and this cohort is designed to help you build with it.
              </p>
            </>
          )}

          <div className={styles.actions}>
            <Link href="/" className={styles.btnPrimary}>
              Return to Called to Carry
            </Link>
            {!isPurchase && (
              <Link href="/cohort" className={styles.btnGhost}>
                Review the Cohort Page
              </Link>
            )}
          </div>

          <blockquote className={styles.scripture}>
            "For we are God's handiwork, created in Christ Jesus to do good works,
            which God prepared in advance for us to do."
            <cite>Ephesians 2:10</cite>
          </blockquote>
        </main>

        <footer className={styles.footer}>
          <p>© {new Date().getFullYear()} Awakening Destiny Global</p>
        </footer>
      </div>
    </>
  );
}
