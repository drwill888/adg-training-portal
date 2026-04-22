// pages/self-paced/thank-you.js

import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from '../../styles/CohortThankYou.module.css';

export default function SelfPacedThankYou() {
  const router = useRouter();
  const { session_id } = router.query;
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  return (
    <>
      <Head>
        <title>Access Confirmed — Called to Carry Self-Paced Journey</title>
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
          <p className={styles.eyebrow}>Access Confirmed · Self-Paced Journey</p>
          <h1 className={styles.heading}>
            Your journey<br />
            <em>starts now.</em>
          </h1>
          <p className={styles.body}>
            Your access is confirmed. Check your email — a welcome message with
            your portal login link is on its way right now.
          </p>
          <p className={styles.body}>
            You have 3 months. Six modules. Go at your own pace —
            but go with intention.
          </p>
          <div className={styles.actions}>
            <Link href="/dashboard" className={styles.btnPrimary}>
              Begin the Journey
            </Link>
          </div>
          <blockquote className={styles.scripture}>
            "Before I formed you in the womb I knew you,
            before you were born I set you apart."
            <cite>Jeremiah 1:5</cite>
          </blockquote>
        </main>
        <footer className={styles.footer}>
          <p>© {new Date().getFullYear()} Awakening Destiny Global</p>
        </footer>
      </div>
    </>
  );
}
