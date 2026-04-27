// pages/called-to-carry/index.js
// Called to Carry — landing/sales page (Phase 2)
// Ported from called-to-carry-cohort-v2.html

import Head from 'next/head';
import Link from 'next/link';
import s from '../../styles/called-to-carry-landing.module.css';

// ── Inline SVG helpers ────────────────────────────────────────────────────────
function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="9" fill="#C8A951" fillOpacity="0.15" />
      <path d="M5 9l3 3 5-5" stroke="#C8A951" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="8" fill="#C8A951" fillOpacity="0.1" />
      <path d="M5 5l6 6M11 5l-6 6" stroke="#C8A951" strokeOpacity="0.7" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon({ open }) {
  return (
    <svg
      className={s.faqIcon}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      style={{ transform: open ? 'rotate(45deg)' : 'none' }}
    >
      <path d="M10 4v12M4 10h12" stroke="#C8A951" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

// ── Data ──────────────────────────────────────────────────────────────────────
const FRAMEWORK_CARDS = [
  {
    step: '01',
    title: 'Clarity',
    body: 'Understand what you are actually carrying — the weight, the assignment, the season.',
  },
  {
    step: '02',
    title: 'Capacity',
    body: 'Build the internal structure to hold what God has entrusted to you without collapsing under it.',
  },
  {
    step: '03',
    title: 'Calibration',
    body: 'Align your pace, priorities, and posture to the actual demands of your assignment.',
  },
  {
    step: '04',
    title: 'Contribution',
    body: 'Move from private preparation to public impact — releasing what you carry into the world.',
  },
  {
    step: '05',
    title: 'Continuity',
    body: 'Build the systems and succession that ensure your assignment outlasts your current season.',
  },
];

const INCLUDED_ITEMS = [
  {
    title: '10-Question Archetype Assessment',
    body: 'Identify exactly where you are in your leadership journey — and what is actually holding you back.',
  },
  {
    title: 'Personalised Results Report',
    body: 'A detailed breakdown of your archetype, your specific growth edges, and your clearest next step.',
  },
  {
    title: '6-Week Cohort Experience',
    body: 'Live sessions with Will Meier, structured around the 5C Framework, delivered in a small cohort of serious leaders.',
  },
  {
    title: 'Private Community Access',
    body: 'Ongoing conversation and accountability with the other leaders in your cohort.',
  },
  {
    title: 'Lifetime Access to Session Recordings',
    body: 'Review any session at any time. The material compounds — you will return to it.',
  },
];

const OUTCOMES = [
  'Name what you are carrying with language that actually fits',
  'Identify the internal structures that are limiting your capacity',
  'Stop cycling through the same frustrations with different contexts',
  'Build a personal development framework you can maintain',
  'Lead with more clarity and less internal noise',
  'Know your next step — and have the conviction to take it',
];

const FOR_ITEMS = [
  'Leaders who feel the weight of what they carry but lack language for it',
  'Those in transition between seasons and needing to recalibrate',
  'People who are spiritually awake but practically stuck',
  'Leaders who want structured development, not just inspiration',
  'Those ready to invest seriously in their own growth',
];

const NOT_FOR_ITEMS = [
  'People looking for quick fixes or motivation without transformation',
  'Those not willing to do honest inner work',
  'Leaders who want someone to solve their problems for them',
  'People who are not in an active leadership assignment',
];

const FAQ_ITEMS = [
  {
    q: 'When does the cohort start?',
    a: 'The next cohort begins in early 2025. Exact dates are confirmed with accepted applicants. Spots are limited to maintain the quality of the cohort experience.',
  },
  {
    q: 'Is this a course or a coaching programme?',
    a: 'Neither — it is a cohort. You will do the work alongside a small group of other leaders, with live facilitation from Will. It is structured like a course but feels like a conversation.',
  },
  {
    q: 'What is the time commitment?',
    a: 'Approximately 3–4 hours per week across 6 weeks. This includes live sessions, personal reflection, and optional community engagement.',
  },
  {
    q: 'Do I need to take the assessment first?',
    a: 'Yes. The assessment is part of the cohort experience. It gives you and Will a shared vocabulary before the first session and ensures the cohort is calibrated to the people in it.',
  },
  {
    q: 'What if I cannot attend a live session?',
    a: 'All sessions are recorded and available within 24 hours. You will not lose access to the material, though live attendance significantly increases the value.',
  },
  {
    q: 'Is there a payment plan?',
    a: 'Yes. A two-payment option is available at checkout. Full details are on the application page.',
  },
];

// ── Page component ────────────────────────────────────────────────────────────
export default function CalledToCarryLanding() {
  return (
    <div className={s.page}>
      <Head>
        <title>Called to Carry — Awakening Destiny Global</title>
        <meta
          name="description"
          content="A 6-week cohort for leaders who carry more than they currently have language for. Discover your archetype and your clearest next step."
        />
        <meta property="og:title" content="Called to Carry" />
        <meta
          property="og:description"
          content="A 6-week cohort for leaders who carry more than they currently have language for."
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Outfit:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* ── Nav ── */}
      <nav className={s.nav}>
        <div className={s.navInner}>
          <span className={s.navLogo}>Awakening Destiny Global</span>
          <Link href="/assessment" className={s.navCta}>
            Take the Assessment
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className={s.hero}>
        <div className={s.heroInner}>
          <p className={s.heroEyebrow}>Called to Carry · Founder Cohort</p>
          <h1 className={s.heroHeadline}>
            You are carrying something
            <br />
            <em>larger than your current language for it.</em>
          </h1>
          <p className={s.heroSub}>
            A 6-week cohort for leaders who sense their assignment is expanding — and need the
            clarity, capacity, and framework to carry it well.
          </p>
          <div className={s.heroCtas}>
            <Link href="/called-to-carry/founders/apply" className={s.ctaPrimary}>
              Claim Your Founder Seat <ArrowIcon />
            </Link>
            <Link href="/assessment" className={s.ctaSecondary}>
              Take the Free Assessment
            </Link>
          </div>
          <p className={s.heroScarcity}>
            <span className={s.scarcityDot} />
            Founder pricing closes when cohort seats are filled
          </p>
        </div>
      </section>

      {/* ── Problem ── */}
      <section className={s.problem}>
        <div className={s.sectionInner}>
          <p className={s.sectionLabel}>The Problem</p>
          <h2 className={s.sectionHeadline}>
            The weight is real. The language is missing.
          </h2>
          <div className={s.problemGrid}>
            <div className={s.problemCard}>
              <p>
                You know you are carrying something significant — a vision, an assignment, a weight
                that others around you do not seem to feel.
              </p>
            </div>
            <div className={s.problemCard}>
              <p>
                But the internal experience of that is often confusion, frustration, or quiet
                exhaustion — because you do not yet have the language, the structure, or the
                community to carry it well.
              </p>
            </div>
            <div className={s.problemCard}>
              <p>
                Called to Carry exists to give you that language — and to build the internal
                architecture to match the weight of what you are carrying.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Framework ── */}
      <section className={s.framework}>
        <div className={s.sectionInner}>
          <p className={s.sectionLabel}>The Framework</p>
          <h2 className={s.sectionHeadline}>The 5C Framework for Leaders</h2>
          <p className={s.sectionSub}>
            Every session in the cohort maps to one of five dimensions of leadership development.
            Together they form a complete architecture for carrying your assignment well.
          </p>
          <div className={s.frameworkGrid}>
            {FRAMEWORK_CARDS.map((card) => (
              <div key={card.step} className={s.frameworkCard}>
                <span className={s.frameworkStep}>{card.step}</span>
                <h3 className={s.frameworkTitle}>{card.title}</h3>
                <p className={s.frameworkBody}>{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Included ── */}
      <section className={s.included}>
        <div className={s.sectionInner}>
          <p className={s.sectionLabel}>What&apos;s Included</p>
          <h2 className={s.sectionHeadline}>Everything you need. Nothing you don&apos;t.</h2>
          <div className={s.includedGrid}>
            {INCLUDED_ITEMS.map((item) => (
              <div key={item.title} className={s.includedCard}>
                <CheckIcon />
                <div>
                  <h3 className={s.includedTitle}>{item.title}</h3>
                  <p className={s.includedBody}>{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Outcomes ── */}
      <section className={s.outcomes}>
        <div className={s.sectionInner}>
          <p className={s.sectionLabel}>Outcomes</p>
          <h2 className={s.sectionHeadline}>What you will walk away with</h2>
          <ul className={s.outcomesList}>
            {OUTCOMES.map((outcome) => (
              <li key={outcome} className={s.outcomesItem}>
                <CheckIcon />
                <span>{outcome}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Author ── */}
      <section className={s.author}>
        <div className={s.sectionInner}>
          <div className={s.authorGrid}>
            <div className={s.authorPhoto}>
              <div className={s.authorPhotoPlaceholder}>WM</div>
            </div>
            <div className={s.authorContent}>
              <p className={s.sectionLabel}>Your Guide</p>
              <h2 className={s.authorName}>Will Meier</h2>
              <p className={s.authorTitle}>Founder, Awakening Destiny Global</p>
              <p className={s.authorBio}>
                Will has spent two decades working with leaders who carry significant assignments —
                helping them name what they are carrying, build the internal architecture to hold it,
                and release it into the world with clarity and conviction.
              </p>
              <p className={s.authorBio}>
                Called to Carry is the distillation of everything he has learned about what it takes
                to carry an assignment well — and to build organisations, movements, and legacies
                that outlast any single season.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className={s.pricing} id="pricing">
        <div className={s.sectionInner}>
          <p className={s.sectionLabel}>Investment</p>
          <h2 className={s.sectionHeadline}>Founder Pricing</h2>
          <p className={s.sectionSub}>
            Founder seats are offered at a reduced rate to the first cohort. This pricing will not
            be available again.
          </p>
          <div className={s.pricingCard}>
            <div className={s.pricingBadge}>Founder Rate</div>
            <div className={s.pricingAmount}>
              <span className={s.pricingCurrency}>$</span>
              <span className={s.pricingNumber}>497</span>
            </div>
            <p className={s.pricingNote}>or 2 payments of $267</p>
            <ul className={s.pricingList}>
              {INCLUDED_ITEMS.map((item) => (
                <li key={item.title} className={s.pricingListItem}>
                  <CheckIcon />
                  <span>{item.title}</span>
                </li>
              ))}
            </ul>
            <Link href="/cohort/apply" className={s.ctaPrimary}>
              Claim Your Founder Seat <ArrowIcon />
            </Link>
            <p className={s.pricingFootnote}>
              Secure checkout · Application reviewed within 48 hours
            </p>
          </div>
        </div>
      </section>

      {/* ── Guarantee ── */}
      <section className={s.guarantee}>
        <div className={s.sectionInner}>
          <div className={s.guaranteeCard}>
            <h2 className={s.guaranteeTitle}>The Clarity Guarantee</h2>
            <p className={s.guaranteeBody}>
              If after the first two sessions you do not feel you have gained meaningful clarity on
              what you are carrying and your next step, we will refund your investment in full — no
              questions asked.
            </p>
            <p className={s.guaranteeBody}>
              We are confident in the value of this work. We want you to be too.
            </p>
          </div>
        </div>
      </section>

      {/* ── For / Not For ── */}
      <section className={s.forNotFor}>
        <div className={s.sectionInner}>
          <div className={s.forNotForGrid}>
            <div className={s.forCol}>
              <h3 className={s.forTitle}>This is for you if…</h3>
              <ul className={s.forList}>
                {FOR_ITEMS.map((item) => (
                  <li key={item} className={s.forItem}>
                    <CheckIcon />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={s.notForCol}>
              <h3 className={s.notForTitle}>This is not for you if…</h3>
              <ul className={s.notForList}>
                {NOT_FOR_ITEMS.map((item) => (
                  <li key={item} className={s.notForItem}>
                    <CrossIcon />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className={s.finalCta}>
        <div className={s.sectionInner}>
          <h2 className={s.finalCtaHeadline}>
            You were made to carry this.
            <br />
            <em>It is time to do it well.</em>
          </h2>
          <div className={s.heroCtas}>
            <Link href="/cohort/apply" className={s.ctaPrimary}>
              Claim Your Founder Seat <ArrowIcon />
            </Link>
            <Link href="/assessment" className={s.ctaSecondary}>
              Take the Free Assessment First
            </Link>
          </div>
          <p className={s.heroScarcity}>
            <span className={s.scarcityDot} />
            Founder pricing closes when cohort seats are filled
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className={s.faq}>
        <div className={s.sectionInner}>
          <p className={s.sectionLabel}>Questions</p>
          <h2 className={s.sectionHeadline}>Frequently asked</h2>
          <div className={s.faqList}>
            {FAQ_ITEMS.map((item) => (
              <details key={item.q} className={s.faqItem}>
                <summary className={s.faqQuestion}>
                  <span>{item.q}</span>
                  <PlusIcon />
                </summary>
                <p className={s.faqAnswer}>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className={s.footer}>
        <div className={s.footerInner}>
          <p className={s.footerLogo}>Awakening Destiny Global</p>
          <nav className={s.footerNav}>
            <Link href="/assessment">Take the Assessment</Link>
            <Link href="/cohort/apply">Apply for the Cohort</Link>
            <a href="mailto:will@awakeningdestiny.global">Contact</a>
          </nav>
          <p className={s.footerLegal}>
            &copy; {new Date().getFullYear()} Awakening Destiny Global. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
