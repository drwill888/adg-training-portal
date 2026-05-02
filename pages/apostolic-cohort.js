// pages/apostolic-cohort.js
// Apostolic Cohort — A Relational Leadership Community

import Head from 'next/head';

const css = `
  #adg-cohort, #adg-cohort * { box-sizing: border-box !important; }
  #adg-cohort *:not(script):not(style) { font-family: 'Outfit', sans-serif !important; }

  #adg-cohort {
    background: var(--navy) !important;
    color: var(--cream) !important;
    overflow-x: hidden !important;
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    max-width: 100% !important;
    line-height: normal !important;
    --navy: #021A35;
    --gold: #FDD20D;
    --blue: #0172BC;
    --orange: #F47722;
    --red: #EE3124;
    --cream: #FDF8F0;
    --navy-light: #0a2d52;
  }

  #adg-cohort .container { max-width: 1140px !important; margin: 0 auto !important; padding: 0 2rem !important; }
  #adg-cohort .section-title { font-family: 'Cormorant Garamond', serif !important; font-size: clamp(2.2rem, 5vw, 3.8rem) !important; font-weight: 600 !important; line-height: 1.1 !important; color: var(--cream) !important; }
  #adg-cohort .section-title em { color: var(--gold) !important; font-style: italic !important; }
  #adg-cohort .body-text { font-size: 1.05rem !important; line-height: 1.8 !important; color: rgba(253,248,240,0.8) !important; }
  #adg-cohort .gold-line { width: 48px !important; height: 2px !important; background: var(--gold) !important; margin: 1.2rem 0 !important; display: block !important; }
  #adg-cohort .gold-line.center { margin: 1.2rem auto !important; }
  #adg-cohort .gold-divider { height: 1px !important; background: linear-gradient(90deg, transparent, rgba(253,210,13,0.35), transparent) !important; display: block !important; }

  #adg-cohort .section-badge { display: inline-block !important; background: rgba(253,210,13,0.12) !important; border: 1px solid rgba(253,210,13,0.35) !important; color: var(--gold) !important; font-size: 0.65rem !important; letter-spacing: 0.25em !important; text-transform: uppercase !important; padding: 0.3rem 0.8rem !important; margin-bottom: 1.25rem !important; font-weight: 600 !important; }
  #adg-cohort .section-badge.dark { background: rgba(2,26,53,0.08) !important; border-color: rgba(2,26,53,0.2) !important; color: var(--blue) !important; }

  #adg-cohort .btn-primary { background: var(--gold) !important; color: var(--navy) !important; font-family: 'Outfit', sans-serif !important; font-size: 0.85rem !important; font-weight: 700 !important; letter-spacing: 0.1em !important; text-transform: uppercase !important; padding: 1rem 2.2rem !important; border: none !important; cursor: pointer !important; text-decoration: none !important; display: inline-block !important; transition: transform 0.2s, box-shadow 0.2s !important; border-radius: 0 !important; }
  #adg-cohort .btn-primary:hover { transform: translateY(-2px) !important; box-shadow: 0 8px 30px rgba(253,210,13,0.3) !important; }
  #adg-cohort .btn-gold-outline { background: transparent !important; color: var(--gold) !important; font-family: 'Outfit', sans-serif !important; font-size: 0.85rem !important; font-weight: 700 !important; letter-spacing: 0.1em !important; text-transform: uppercase !important; padding: 1rem 2.2rem !important; border: 1px solid var(--gold) !important; cursor: pointer !important; text-decoration: none !important; display: inline-block !important; border-radius: 0 !important; }
  #adg-cohort .btn-gold-outline:hover { background: var(--gold) !important; color: var(--navy) !important; }

  #adg-cohort nav { position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; z-index: 99999 !important; padding: 1.25rem 2rem !important; display: flex !important; align-items: center !important; justify-content: space-between !important; background: rgba(2,26,53,0.97) !important; backdrop-filter: blur(12px) !important; border-bottom: 1px solid rgba(253,210,13,0.35) !important; }
  #adg-cohort .nav-logo { font-family: 'Cormorant Garamond', serif !important; font-size: 1.2rem !important; font-weight: 600 !important; color: var(--cream) !important; text-decoration: none !important; }
  #adg-cohort .nav-logo span { color: var(--gold) !important; }
  #adg-cohort .nav-right { display: flex !important; align-items: center !important; gap: 1.25rem !important; }
  #adg-cohort .nav-link { font-size: 0.78rem !important; color: rgba(253,248,240,0.75) !important; text-decoration: none !important; letter-spacing: 0.08em !important; text-transform: uppercase !important; font-weight: 500 !important; }
  #adg-cohort .nav-link:hover { color: var(--gold) !important; }
  #adg-cohort .nav-cta { background: var(--gold) !important; color: var(--navy) !important; font-size: 0.78rem !important; font-weight: 700 !important; letter-spacing: 0.08em !important; text-transform: uppercase !important; padding: 0.6rem 1.3rem !important; border: none !important; text-decoration: none !important; display: inline-block !important; }

  /* HERO */
  #adg-cohort #hero { min-height: 92vh !important; display: flex !important; align-items: center !important; position: relative !important; overflow: hidden !important; padding: 9rem 2rem 6rem !important; background: var(--navy) !important; text-align: center !important; }
  #adg-cohort .hero-bg { position: absolute !important; inset: 0 !important; background: radial-gradient(ellipse 70% 60% at 50% 45%, rgba(253,210,13,0.08) 0%, transparent 70%), radial-gradient(ellipse 60% 80% at 20% 90%, rgba(1,114,188,0.08) 0%, transparent 60%), #021A35 !important; }
  #adg-cohort .hero-grid { position: absolute !important; inset: 0 !important; background-image: linear-gradient(rgba(253,210,13,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(253,210,13,0.04) 1px, transparent 1px) !important; background-size: 60px 60px !important; }
  #adg-cohort .hero-content { position: relative !important; z-index: 2 !important; max-width: 860px !important; margin: 0 auto !important; }
  #adg-cohort .hero-eyebrow { display: inline-flex !important; align-items: center !important; gap: 0.75rem !important; background: rgba(253,210,13,0.12) !important; border: 1px solid rgba(253,210,13,0.35) !important; padding: 0.4rem 1rem !important; margin-bottom: 2rem !important; font-size: 0.7rem !important; font-weight: 600 !important; letter-spacing: 0.25em !important; text-transform: uppercase !important; color: var(--gold) !important; }
  #adg-cohort .hero-title { font-family: 'Cormorant Garamond', serif !important; font-size: clamp(3rem, 7vw, 5.5rem) !important; font-weight: 700 !important; line-height: 1.0 !important; margin-bottom: 1.5rem !important; color: var(--cream) !important; }
  #adg-cohort .hero-title .accent { color: var(--gold) !important; font-style: italic !important; display: block !important; }
  #adg-cohort .hero-subtitle { font-size: 1.15rem !important; line-height: 1.75 !important; color: rgba(253,248,240,0.82) !important; max-width: 660px !important; margin: 0 auto 2rem !important; }
  #adg-cohort .hero-values { display: flex !important; justify-content: center !important; gap: 2rem !important; flex-wrap: wrap !important; margin-top: 2rem !important; }
  #adg-cohort .hero-value { font-family: 'Cormorant Garamond', serif !important; font-style: italic !important; font-size: 1.15rem !important; color: rgba(253,210,13,0.85) !important; }

  /* INTRO */
  #adg-cohort #intro { padding: 6rem 2rem !important; background: var(--navy-light) !important; }
  #adg-cohort .intro-inner { max-width: 780px !important; margin: 0 auto !important; text-align: center !important; }
  #adg-cohort .intro-inner p { font-family: 'Cormorant Garamond', serif !important; font-size: 1.45rem !important; font-weight: 400 !important; font-style: italic !important; line-height: 1.6 !important; color: rgba(253,248,240,0.88) !important; margin-bottom: 1.5rem !important; }
  #adg-cohort .intro-inner p.body-text { font-family: 'Outfit', sans-serif !important; font-style: normal !important; font-size: 1.05rem !important; color: rgba(253,248,240,0.75) !important; }

  /* FOUNDATION */
  #adg-cohort #foundation { padding: 7rem 2rem !important; background: var(--cream) !important; color: var(--navy) !important; }
  #adg-cohort #foundation .section-title { color: var(--navy) !important; }
  #adg-cohort #foundation .section-title em { color: var(--blue) !important; }
  #adg-cohort .foundation-inner { max-width: 860px !important; margin: 0 auto !important; }
  #adg-cohort .scripture-quote { margin: 2rem 0 2.5rem !important; padding: 1.5rem 2rem !important; border-left: 4px solid var(--gold) !important; background: rgba(253,210,13,0.08) !important; }
  #adg-cohort .scripture-quote p { font-family: 'Cormorant Garamond', serif !important; font-size: 1.4rem !important; font-style: italic !important; line-height: 1.55 !important; color: var(--navy) !important; margin-bottom: 0.5rem !important; }
  #adg-cohort .scripture-quote .ref { font-size: 0.8rem !important; letter-spacing: 0.15em !important; text-transform: uppercase !important; color: var(--orange) !important; font-weight: 600 !important; }
  #adg-cohort #foundation p { font-size: 1.02rem !important; line-height: 1.85 !important; color: rgba(2,26,53,0.78) !important; margin-bottom: 1.25rem !important; }

  /* CULTIVATE */
  #adg-cohort #cultivate { padding: 7rem 2rem !important; background: var(--navy) !important; }
  #adg-cohort .cultivate-intro { text-align: center !important; max-width: 640px !important; margin: 0 auto 4rem !important; }
  #adg-cohort .cultivate-intro p { font-family: 'Cormorant Garamond', serif !important; font-style: italic !important; font-size: 1.2rem !important; color: rgba(253,248,240,0.8) !important; margin-top: 1rem !important; }
  #adg-cohort .values-grid { display: grid !important; grid-template-columns: repeat(4, 1fr) !important; gap: 1.5rem !important; margin-top: 2rem !important; }
  #adg-cohort .value-card { padding: 2.25rem 1.5rem !important; border: 1px solid rgba(253,210,13,0.2) !important; background: rgba(253,210,13,0.04) !important; text-align: center !important; transition: transform 0.2s, border-color 0.2s !important; }
  #adg-cohort .value-card:hover { transform: translateY(-4px) !important; border-color: rgba(253,210,13,0.5) !important; }
  #adg-cohort .value-roman { font-family: 'Cormorant Garamond', serif !important; font-size: 2.4rem !important; font-weight: 700 !important; color: var(--gold) !important; display: block !important; margin-bottom: 0.75rem !important; line-height: 1 !important; }
  #adg-cohort .value-card h4 { font-family: 'Cormorant Garamond', serif !important; font-size: 1.5rem !important; font-weight: 600 !important; color: var(--cream) !important; margin-bottom: 0.75rem !important; }
  #adg-cohort .value-card p { font-size: 0.92rem !important; line-height: 1.65 !important; color: rgba(253,248,240,0.7) !important; }
  #adg-cohort .pull-quote { margin: 4rem auto 0 !important; max-width: 780px !important; text-align: center !important; padding: 2.5rem 2rem !important; border-top: 1px solid rgba(253,210,13,0.2) !important; border-bottom: 1px solid rgba(253,210,13,0.2) !important; }
  #adg-cohort .pull-quote p { font-family: 'Cormorant Garamond', serif !important; font-style: italic !important; font-size: 1.55rem !important; line-height: 1.5 !important; color: var(--cream) !important; margin-bottom: 1rem !important; }
  #adg-cohort .pull-quote .ref { font-size: 0.78rem !important; letter-spacing: 0.15em !important; text-transform: uppercase !important; color: var(--gold) !important; font-weight: 600 !important; }

  /* INSIDE */
  #adg-cohort #inside { padding: 7rem 2rem !important; background: var(--navy-light) !important; }
  #adg-cohort .inside-intro { text-align: center !important; margin-bottom: 4rem !important; }
  #adg-cohort .inside-grid { display: grid !important; grid-template-columns: repeat(3, 1fr) !important; gap: 1.5rem !important; }
  #adg-cohort .inside-card { background: rgba(253,210,13,0.05) !important; border-left: 3px solid var(--gold) !important; padding: 2rem 1.75rem !important; }
  #adg-cohort .inside-card h4 { font-family: 'Cormorant Garamond', serif !important; font-size: 1.35rem !important; font-weight: 600 !important; color: var(--gold) !important; margin-bottom: 0.75rem !important; line-height: 1.25 !important; }
  #adg-cohort .inside-card p { font-size: 0.95rem !important; line-height: 1.7 !important; color: rgba(253,248,240,0.75) !important; }

  /* JOIN */
  #adg-cohort #join { padding: 7rem 2rem !important; background: var(--cream) !important; color: var(--navy) !important; }
  #adg-cohort #join .section-title { color: var(--navy) !important; }
  #adg-cohort #join .section-title em { color: var(--orange) !important; }
  #adg-cohort .join-intro { max-width: 680px !important; margin-bottom: 4rem !important; }
  #adg-cohort .join-intro p { font-size: 1.02rem !important; line-height: 1.8 !important; color: rgba(2,26,53,0.75) !important; }
  #adg-cohort .join-steps { display: grid !important; grid-template-columns: repeat(3, 1fr) !important; gap: 2rem !important; }
  #adg-cohort .join-step { background: #fff !important; border-top: 3px solid var(--gold) !important; padding: 2.25rem 1.75rem !important; box-shadow: 0 4px 20px rgba(2,26,53,0.06) !important; }
  #adg-cohort .join-step-num { font-family: 'Cormorant Garamond', serif !important; font-size: 3rem !important; font-weight: 700 !important; color: var(--gold) !important; line-height: 1 !important; display: block !important; margin-bottom: 0.75rem !important; }
  #adg-cohort .join-step h4 { font-family: 'Cormorant Garamond', serif !important; font-size: 1.35rem !important; font-weight: 600 !important; color: var(--navy) !important; margin-bottom: 0.75rem !important; }
  #adg-cohort .join-step p { font-size: 0.94rem !important; line-height: 1.7 !important; color: rgba(2,26,53,0.72) !important; }

  /* FOR YOU */
  #adg-cohort #for-you { padding: 7rem 2rem !important; background: var(--navy) !important; }
  #adg-cohort .foryou-inner { max-width: 820px !important; margin: 0 auto !important; }
  #adg-cohort .foryou-list { margin-top: 3rem !important; list-style: none !important; padding: 0 !important; }
  #adg-cohort .foryou-list li { position: relative !important; padding: 1.25rem 0 1.25rem 2.5rem !important; border-bottom: 1px solid rgba(253,210,13,0.15) !important; font-size: 1.02rem !important; line-height: 1.65 !important; color: rgba(253,248,240,0.82) !important; }
  #adg-cohort .foryou-list li::before { content: '' !important; position: absolute !important; left: 0 !important; top: 1.75rem !important; width: 18px !important; height: 2px !important; background: var(--gold) !important; }
  #adg-cohort .foryou-list li:last-child { border-bottom: none !important; }

  /* CLOSING CTA */
  #adg-cohort #cta-close { padding: 8rem 2rem !important; background: var(--navy-light) !important; text-align: center !important; position: relative !important; overflow: hidden !important; }
  #adg-cohort #cta-close::before { content: '' !important; position: absolute !important; inset: 0 !important; background: radial-gradient(ellipse 70% 80% at 50% 50%, rgba(253,210,13,0.08) 0%, transparent 70%) !important; }
  #adg-cohort .cta-inner { position: relative !important; z-index: 2 !important; max-width: 720px !important; margin: 0 auto !important; }
  #adg-cohort .cta-lines { font-family: 'Cormorant Garamond', serif !important; font-size: clamp(2rem, 4.5vw, 3.2rem) !important; font-weight: 600 !important; line-height: 1.15 !important; color: var(--cream) !important; margin-bottom: 2rem !important; }
  #adg-cohort .cta-lines span { display: block !important; color: var(--gold) !important; font-style: italic !important; }
  #adg-cohort .cta-subtext { font-size: 1.02rem !important; line-height: 1.75 !important; color: rgba(253,248,240,0.78) !important; margin-bottom: 2.5rem !important; max-width: 620px !important; margin-left: auto !important; margin-right: auto !important; }
  #adg-cohort .cta-small { font-size: 0.82rem !important; color: rgba(253,248,240,0.5) !important; margin-top: 1.5rem !important; display: block !important; letter-spacing: 0.03em !important; }

  /* FOOTER */
  #adg-cohort footer { background: #010f1f !important; padding: 3rem 2rem !important; border-top: 1px solid rgba(253,210,13,0.35) !important; }
  #adg-cohort .footer-inner { display: flex !important; align-items: center !important; justify-content: space-between !important; flex-wrap: wrap !important; gap: 1rem !important; }
  #adg-cohort .footer-brand { font-family: 'Cormorant Garamond', serif !important; font-size: 1.1rem !important; font-weight: 600 !important; color: rgba(253,248,240,0.7) !important; }
  #adg-cohort .footer-brand span { color: var(--gold) !important; }
  #adg-cohort .footer-links { display: flex !important; gap: 2rem !important; flex-wrap: wrap !important; }
  #adg-cohort .footer-links a { font-size: 0.8rem !important; color: rgba(253,248,240,0.5) !important; text-decoration: none !important; letter-spacing: 0.08em !important; }
  #adg-cohort .footer-links a:hover { color: var(--gold) !important; }
  #adg-cohort .footer-copy { font-size: 0.78rem !important; color: rgba(253,248,240,0.35) !important; text-align: center !important; margin-top: 2rem !important; display: block !important; }

  @media (max-width: 900px) {
    #adg-cohort .values-grid { grid-template-columns: repeat(2, 1fr) !important; }
    #adg-cohort .inside-grid { grid-template-columns: 1fr !important; }
    #adg-cohort .join-steps { grid-template-columns: 1fr !important; }
    #adg-cohort .nav-right .nav-link { display: none !important; }
  }
  @media (max-width: 600px) {
    #adg-cohort .values-grid { grid-template-columns: 1fr !important; }
    #adg-cohort .hero-values { gap: 0.5rem !important; flex-direction: column !important; }
  }
`;

export default function ApostolicCohortPage() {
  const values = [
    { roman: 'I', title: 'Humility', body: 'Leaders who are willing to be known—not just admired. Where authenticity becomes a doorway for God\u2019s power.' },
    { roman: 'II', title: 'Honor', body: 'A culture where every leader is valued, every voice matters, and we carry one another with the reverence due to members of the same body.' },
    { roman: 'III', title: 'Transparency', body: 'Wise vulnerability within trusted relationships. Not careless disclosure, but a genuine connection that deepens trust and releases life.' },
    { roman: 'IV', title: 'Spiritual Maturity', body: 'Growing from servanthood into sonship, from sonship into friendship with God, and into the fullness of spiritual fathering and mothering.' },
  ];

  const inside = [
    { title: 'Leaders Who Pray for One Another', body: 'Not performance. Not posturing. A community where leaders minister to each other in humility, truth, and genuine spiritual partnership.' },
    { title: 'Identity-Driven Development', body: 'Leadership that flows from who you are before what you do. We develop identity first—because activity without identity leads to burnout, not breakthrough.' },
    { title: 'Prophetic Insight & Revelatory Training', body: 'Spirit-led teaching that equips you to hear, discern, and walk in the fullness of your calling with clarity and courage.' },
    { title: 'A Safe Place to Be Strengthened', body: 'Receiving ministry does not make you less of a leader. Here, even the one who leads is covered, encouraged, and built up by the body.' },
    { title: 'Relationships That Bear Fruit Over Time', body: 'This is not a program with an expiration date. It is a relational community where trust deepens, hearts open, and leaders sharpen one another across seasons.' },
    { title: 'Equipped to Build on the Right Foundation', body: 'This is not just a place to be restored—it is a place to be released. Leaders are equipped with the Word of God, prophetic insight, and practical wisdom to build Kingdom enterprises, families, and communities that carry the presence and power of God.' },
  ];

  const steps = [
    { num: '01', title: 'Personal Invitation or Inquiry', body: 'Most leaders join through a personal invitation from a current member. If you don\u2019t have a direct connection but sense this is for you, you can express interest and begin a conversation with us.' },
    { num: '02', title: 'A Conversation, Not an Application', body: 'We hold a brief conversation to explore alignment—not to evaluate your qualifications, but to ensure the values, heart, and relational culture we are building will serve your growth and you will strengthen ours.' },
    { num: '03', title: 'Welcome Into Community', body: 'Once there is mutual alignment, you are welcomed into the cohort relationally. No contracts, no pressure—just a community of leaders committed to growing together with integrity, honor, and authenticity.' },
  ];

  const forYou = [
    'Are tired of leading in isolation and long for trusted spiritual community',
    'Value formation and identity over platform and performance',
    'Want to be sharpened by leaders who walk in humility, not competition',
    'Desire prophetic insight, revelatory training, and practical wisdom for their calling',
    'Are ready to both give and receive ministry within a trusted body',
    'Believe that authentic leadership flows from surrender, not performance',
  ];

  return (
    <>
      <Head>
        <title>Apostolic Cohort | Awakening Destiny Global</title>
        <meta name="description" content="A relational leadership community built on Christ as the foundation. Formation over information. Identity before activity." />
        <meta property="og:title" content="Apostolic Cohort | Awakening Destiny Global" />
        <meta property="og:description" content="A relational leadership community built on Christ as the foundation. Formation over information. Identity before activity." />
        <meta property="og:type" content="website" />
      </Head>

      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div id="adg-cohort">

        {/* NAV */}
        <nav>
          <a href="https://awakeningdestiny.global" className="nav-logo">Awakening <span>Destiny</span></a>
          <div className="nav-right">
            <a href="https://awakeningdestiny.global/about/" className="nav-link">About</a>
            <a href="https://awakeningdestiny.global/blogs/" className="nav-link">Blogs</a>
            <a href="https://awakeningdestiny.global/contact/" className="nav-link">Contact</a>
            <a href="https://awakeningdestiny.global/donate/" className="nav-cta">Donate Now</a>
          </div>
        </nav>

        {/* HERO */}
        <section id="hero">
          <div className="hero-bg"></div>
          <div className="hero-grid"></div>
          <div className="hero-content">
            <div className="hero-eyebrow">A Relational Leadership Community</div>
            <h1 className="hero-title">
              The Apostolic<br />
              <span className="accent">Cohort</span>
            </h1>
            <p className="hero-subtitle">
              A place where leaders grow in identity, maturity, and spiritual strength together—without competition, without comparison, and without carrying the weight alone.
            </p>
            <div className="hero-values">
              <span className="hero-value">Christ as the foundation.</span>
              <span className="hero-value">Formation over information.</span>
              <span className="hero-value">Identity before activity.</span>
            </div>
          </div>
        </section>

        {/* INTRO */}
        <section id="intro">
          <div className="intro-inner">
            <p>&ldquo;There is a kind of leadership community many leaders long for but rarely find.&rdquo;</p>
            <p className="body-text">
              A place where you do not have to perform. Where you do not have to maintain an image. Where leaders can grow in identity, maturity, and spiritual strength together—without competition, without comparison, and without carrying the weight alone.
            </p>
            <p className="body-text">
              The Apostolic Cohort was built for leaders who want more than information. It exists for those who want friendship and formation.
            </p>
          </div>
        </section>

        {/* FOUNDATION */}
        <section id="foundation">
          <div className="container foundation-inner">
            <div className="section-badge dark">The Foundation We Build On</div>
            <h2 className="section-title">Christ as the <em>Cornerstone.</em></h2>
            <div className="gold-line" style={{background:'#0172BC'}}></div>
            <div className="scripture-quote">
              <p>&ldquo;For no other foundation can anyone lay than that which is laid, which is Jesus Christ.&rdquo;</p>
              <span className="ref">— 1 Corinthians 3:11</span>
            </div>
            <p>The Apostolic Cohort is not built on methodology. It is built on Christ—the cornerstone of everything we do, every conversation we hold, and every leader we walk alongside.</p>
            <p>As leaders, we worship before we strategize. Before we build, we consecrate. This is a place where altars are built unto the Lord—where leaders come first to encounter His presence, and from that place of holy habitation, are equipped and sent to build.</p>
            <p>We believe that what is built in God&rsquo;s presence carries God&rsquo;s power. And what is built on any other foundation will not stand. So we begin where Scripture begins—with Christ as the foundation, the Word as the authority, and the Spirit as the guide.</p>
            <p>This is not a networking group with spiritual language. This is a community consecrated to raising up leaders who build Kingdom enterprises, families, ministries, and communities on the only foundation that endures.</p>
          </div>
        </section>

        {/* CULTIVATE */}
        <section id="cultivate">
          <div className="container">
            <div className="cultivate-intro">
              <div className="section-badge">What We Cultivate</div>
              <h2 className="section-title">Marks of the <em>Culture</em></h2>
              <p>Everything we cultivate flows from one foundation: Christ in us, the hope of glory.</p>
            </div>
            <div className="values-grid">
              {values.map(v => (
                <div key={v.title} className="value-card">
                  <span className="value-roman">{v.roman}</span>
                  <h4>{v.title}</h4>
                  <p>{v.body}</p>
                </div>
              ))}
            </div>
            <div className="pull-quote">
              <p>&ldquo;But we have this treasure in earthen vessels, that the excellence of the power may be of God and not of us.&rdquo;</p>
              <span className="ref">— 2 Corinthians 4:7</span>
            </div>
          </div>
        </section>

        {/* INSIDE THE COHORT */}
        <section id="inside">
          <div className="container">
            <div className="inside-intro">
              <div className="section-badge">Inside the Cohort</div>
              <h2 className="section-title">What You Will <em>Find Here</em></h2>
            </div>
            <div className="inside-grid">
              {inside.map(card => (
                <div key={card.title} className="inside-card">
                  <h4>{card.title}</h4>
                  <p>{card.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW LEADERS JOIN */}
        <section id="join">
          <div className="container">
            <div className="join-intro">
              <div className="section-badge dark">How Leaders Join</div>
              <h2 className="section-title" style={{color:'#021A35'}}>A <em style={{color:'#F47722'}}>Relational</em> Path In</h2>
              <div className="gold-line" style={{background:'#F47722'}}></div>
              <p>Because culture matters, participation in the Apostolic Cohort is intentionally limited. Leaders enter through relationship, not registration.</p>
            </div>
            <div className="join-steps">
              {steps.map(step => (
                <div key={step.num} className="join-step">
                  <span className="join-step-num">{step.num}</span>
                  <h4>{step.title}</h4>
                  <p>{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* IS THIS FOR YOU */}
        <section id="for-you">
          <div className="container foryou-inner">
            <div className="section-badge">Is This for You?</div>
            <h2 className="section-title">This Cohort Is for <em>Leaders Who&hellip;</em></h2>
            <ul className="foryou-list">
              {forYou.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* CLOSING CTA */}
        <section id="cta-close">
          <div className="cta-inner">
            <div className="cta-lines">
              The altar is built.<br />
              The table is set.<br />
              <span>The seat is yours.</span>
            </div>
            <p className="cta-subtext">
              If you are looking for a leadership community marked by authenticity, honor, and spiritual formation—rather than by performance and platform-building—we would love to begin a conversation.
            </p>
            <a href="https://awakeningdestiny.global/contact/" className="btn-primary">Request a Conversation</a>
            <span className="cta-small">Or reach out to a current member for a personal invitation.</span>
          </div>
        </section>

        <div className="gold-divider"></div>

        {/* FOOTER */}
        <footer>
          <div className="container">
            <div className="footer-inner">
              <div className="footer-brand">Awakening Destiny <span>Global</span></div>
              <div className="footer-links">
                <a href="https://awakeningdestiny.global">Home</a>
                <a href="https://awakeningdestiny.global/about/">About</a>
                <a href="https://awakeningdestiny.global/blogs/">Blogs</a>
                <a href="https://awakeningdestiny.global/contact/">Contact</a>
                <a href="https://awakeningdestiny.global/donate/">Donate</a>
              </div>
            </div>
            <span className="footer-copy">Engaging, Equipping, and Empowering History Makers · © 2026 Awakening Destiny Global · All Rights Reserved</span>
          </div>
        </footer>

      </div>
    </>
  );
}
