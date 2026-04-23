// pages/called-to-carry/results.js
// Results page — displays archetype with label dropdown selector + product CTAs

import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  ARCHETYPES,
  OFFICE_LABELS,
  OVERLAY_DISPLAY,
  getArchetype,
  getOfficeLabels,
  getOverlayDisplay,
} from '../../../lib/archetypes';

export default function ResultsPage() {
  const router = useRouter();
  const { archetype: archetypeId } = router.query;

  const [data, setData] = useState(null);
  const [selectedLabel, setSelectedLabel] = useState('');
  const [savePref, setSavePref] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  // Load archetype data
  useEffect(() => {
    if (!archetypeId) return;

    const archetype = getArchetype(archetypeId);
    if (!archetype) {
      router.push('/called-to-carry/assessment');
      return;
    }

    const labels = getOfficeLabels(archetype.office);
    setData(archetype);
    setSelectedLabel(labels[0]); // default to first option (functional)
  }, [archetypeId, router]);

  // Save label preference to Supabase
  const handleSavePreference = async () => {
    if (!data) return;
    setSavePref(true);
    setSavedMsg('');

    try {
      const res = await fetch('/api/called-to-carry/save-label-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          archetypeId,
          customLabel: selectedLabel,
        }),
      });
      if (res.ok) {
        setSavedMsg('✓ Saved');
        setTimeout(() => setSavedMsg(''), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavePref(false);
    }
  };

  if (!data) {
    return (
      <div className={styles.loadingPage}>
        <p>Revealing your archetype...</p>
      </div>
    );
  }

  const labels = getOfficeLabels(data.office);
  const overlayDisplay = getOverlayDisplay(data.overlay);
  const fullTitle = `${selectedLabel} ${overlayDisplay}`;

  return (
    <>
      <Head>
        <title>{fullTitle} — Your Called to Carry Archetype</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Outfit:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className={styles.page}>
        {/* ── NAV ── */}
        <nav className={styles.nav}>
          <Link href="/" className={styles.navLogo}>Called to Carry</Link>
          <Link href="/dashboard" className={styles.navLink}>Portal Login →</Link>
        </nav>

        {/* ── HERO ── */}
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <p className={styles.eyebrow}>Your Called to Carry Archetype</p>
            <h1 className={styles.heroTitle}>
              You are a<br />
              <em>{fullTitle}.</em>
            </h1>
            <p className={styles.heroSub}>
              This is the grace on your leadership and the way you were built
              to carry your assignment.
            </p>

            {/* Office Label Selector */}
            <div className={styles.labelSelector}>
              <label className={styles.labelSelectorLabel}>
                Choose your preferred office label:
              </label>
              <div className={styles.labelSelectorRow}>
                <select
                  value={selectedLabel}
                  onChange={e => setSelectedLabel(e.target.value)}
                  className={styles.labelDropdown}
                >
                  {labels.map(label => (
                    <option key={label} value={label}>{label}</option>
                  ))}
                </select>
                <button
                  onClick={handleSavePreference}
                  disabled={savePref}
                  className={styles.btnSavePref}
                >
                  {savePref ? 'Saving...' : 'Save Preference'}
                </button>
              </div>
              {savedMsg && <p className={styles.savedMsg}>{savedMsg}</p>}
              <p className={styles.labelHint}>
                Some leaders embrace the fivefold language. Others prefer
                functional terms. Choose what fits how you carry your assignment.
              </p>
            </div>
          </div>
        </section>

        {/* ── ARCHETYPE DESCRIPTION ── */}
        <section className={styles.description}>
          <div className={styles.container}>

            <div className={styles.descSection}>
              <h2 className={styles.descHeading}>Who You Are</h2>
              {data.who.map((para, i) => (
                <p key={i} className={styles.descText}>{para}</p>
              ))}
            </div>

            <div className={styles.descSection}>
              <h2 className={styles.descHeading}>Your Assignment</h2>
              <p className={styles.descText}>{data.assignment}</p>
            </div>

            <div className={styles.descSection}>
              <h2 className={styles.descHeading}>Your Strength</h2>
              <p className={styles.descText}>{data.strength}</p>
            </div>

            <div className={styles.descSection}>
              <h2 className={styles.descHeading}>Your Temptation</h2>
              <p className={styles.descText}>{data.temptation}</p>
            </div>

            <div className={styles.scriptureBlock}>
              <p className={styles.scriptureText}>"{data.scripture.text}"</p>
              <p className={styles.scriptureRef}>— {data.scripture.ref}</p>
            </div>

          </div>
        </section>

        {/* ── NEXT STEPS / PRODUCT CTAS ── */}
        <section className={styles.nextSteps}>
          <div className={styles.container}>
            <p className={styles.eyebrowLight}>What's Next</p>
            <h2 className={styles.nextHeading}>
              Knowing your archetype is the first step.<br />
              <em>The journey is the formation.</em>
            </h2>
            <p className={styles.nextSub}>
              The Called to Carry framework offers three paths forward — each
              designed to take what you've discovered and turn it into formation
              that holds.
            </p>

            <div className={styles.tierGrid}>

              {/* SELF-PACED */}
              <div className={styles.tierCard}>
                <p className={styles.tierTier}>Self-Paced</p>
                <p className={styles.tierPrice}>$67</p>
                <p className={styles.tierDesc}>
                  6 modules. 3 months access. Your pace, your timing.
                  Formation work for the leader who wants to start now.
                </p>
                <ul className={styles.tierFeatures}>
                  <li>All 6 formation modules</li>
                  <li>Per-module Blueprint exports</li>
                  <li>Certificate of Completion</li>
                  <li>AI training assistant</li>
                </ul>
                <Link href="/self-paced" className={styles.btnTier}>
                  Start Self-Paced →
                </Link>
              </div>

              {/* COHORT */}
              <div className={`${styles.tierCard} ${styles.tierFeatured}`}>
                <span className={styles.tierBadge}>Most Popular</span>
                <p className={styles.tierTier}>Called to Carry Cohort</p>
                <p className={styles.tierPrice}>$497</p>
                <p className={styles.tierDesc}>
                  8 weeks of live formation, prophetic insight, and strategic
                  coaching. Built for leaders ready to be formed in community.
                </p>
                <ul className={styles.tierFeatures}>
                  <li>Everything in Self-Paced</li>
                  <li>8 live cohort sessions</li>
                  <li>Mid-Journey Diagnostic Report</li>
                  <li>Capstone Blueprint at Commissioning</li>
                </ul>
                <Link href="/cohort" className={styles.btnTier}>
                  Apply for the Cohort →
                </Link>
              </div>

              {/* BLUEPRINT */}
              <div className={styles.tierCard}>
                <p className={styles.tierTier}>Blueprint Intensive</p>
                <p className={styles.tierPrice}>$997</p>
                <p className={styles.tierDesc}>
                  21-day high-intensity formation. Application-gated.
                  Limited to 10 leaders. The deepest work we offer.
                </p>
                <ul className={styles.tierFeatures}>
                  <li>Everything in the Cohort</li>
                  <li>1:1 strategy session with Will</li>
                  <li>Custom Capstone Blueprint</li>
                  <li>Direct access throughout</li>
                </ul>
                <Link href="/blueprint" className={styles.btnTier}>
                  Apply for the Blueprint →
                </Link>
              </div>

            </div>
          </div>
        </section>

        {/* ── CLOSING ── */}
        <section className={styles.closing}>
          <div className={styles.container}>
            <h2 className={styles.closingHeading}>
              You were not given this archetype<br />
              <em>by accident.</em>
            </h2>
            <p className={styles.closingText}>
              The grace on your leadership has a purpose. The weight you've
              been carrying has a name. Now begins the formation that turns
              who you are into what you build.
            </p>
            <p className={styles.signature}>— Will, Founder · Awakening Destiny Global</p>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className={styles.footer}>
          <div className={styles.container}>
            <p>© {new Date().getFullYear()} Awakening Destiny Global · All Rights Reserved</p>
            <div className={styles.footerLinks}>
              <Link href="/">Home</Link>
              <Link href="/called-to-carry/assessment">Retake Assessment</Link>
              <Link href="/cohort">Cohort</Link>
              <Link href="/self-paced">Self-Paced</Link>
              <Link href="/blueprint">Blueprint</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
