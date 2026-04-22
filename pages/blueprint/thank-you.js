// pages/blueprint/thank-you.js

import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from '../../styles/CohortThankYou.module.css';

export default function BlueprintThankYou() {
  const router = useRouter();
  const { applied, session_id } = router.query;
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const isPurchase = !!session_id;

  return (
    <>
      <Head>
        <title>{isPurchase ? 'Payment Confirmed' : 'Application Received'} — Called to Carry Blueprint</title>
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
              <p className={styles.eyebrow}>Payment Confirmed · Called to Carry Blueprint</p>
              <h1 className={styles.heading}>
                Your Blueprint<br />
                <em>begins now.</em>
              </h1>
              <p className={styles.body}>
                Your investment is confirmed. Check your email — your portal
                access link and first call details are on their way.
              </p>
              <p className={styles.body}>
                21 days. All 7 modules. Will in the room. Show up fully.
              </p>
              <div className={styles.actions}>
                <Link href="/dashboard" className={styles.btnPrimary}>
                  Access Your Portal
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className={styles.eyebrow}>Application Received · Called to Carry Blueprint</p>
              <h1 className={styles.heading}>
                Ten seats.<br />
                <em>Stay ready.</em>
              </h1>
              <p className={styles.body}>
                Your application has been received. Will reviews every Blueprint
                application personally — expect a response within 3–5 business days.
              </p>
              <p className={styles.body}>
                In the meantime, if you have not taken the Called to Carry Assessment,
                now is the time. Your archetype will be part of your Week 1 work.
              </p>
              <div className={styles.actions}>
                <Link href="/assessment" className={styles.btnPrimary}>
                  Take the Assessment
                </Link>
                <Link href="/blueprint" className={styles.btnGhost}>
                  Review the Blueprint
                </Link>
              </div>
            </>
          )}

          <blockquote className={styles.scripture}>
            "The steps of a good man are ordered by the Lord —
            and he delights in his way."
            <cite>Psalm 37:23</cite>
          </blockquote>
        </main>
        <footer className={styles.footer}>
          <p>© {new Date().getFullYear()} Awakening Destiny Global</p>
        </footer>
      </div>
    </>
  );
}
