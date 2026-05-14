<?php
/*
 * Template Name: ADG - Training
 * Description:  Training page with Three Paths pricing — no Elementor dependency.
 *               Place in: wp-content/themes/hello-elementor-child/
 *               Assign:   WP Admin → Pages → Training
 *                         → Page Attributes → Template → "ADG - Training"
 *
 * Stripe links: Update the two application hrefs once Vercel env is confirmed:
 *   Sprint apply:  https://5cblueprint.awakeningdestiny.global/called-to-carry/sprint/apply
 *   Cohort apply:  https://5cblueprint.awakeningdestiny.global/called-to-carry/founders/apply
 */

add_filter( 'elementor/page_templates/canvas/override_page_template', '__return_false' );

get_header();
?>

<style>
    /* ============================================================
       ADG BRAND TOKENS
       ============================================================ */
    :root {
      --navy:        #021A35;
      --navy-deep:   #011120;
      --blue:        #0172BC;
      --sky:         #00AEEF;
      --gold:        #C8A951;
      --gold-bright: #FDD20D;
      --cream:       #FDF8F0;
      --white:       #FFFFFF;
      --text-dark:   #0D1F33;
      --text-mid:    #3A4F63;
      --text-light:  #6B7E91;
      --font-serif:  'Cormorant Garamond', Georgia, serif;
      --font-sans:   'Outfit', system-ui, sans-serif;
      --radius:      3px;
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; font-size: 16px; }
    body { font-family: var(--font-sans); color: var(--text-dark); background: var(--white); line-height: 1.65; -webkit-font-smoothing: antialiased; }
    img  { max-width: 100%; display: block; }
    a    { color: inherit; }

    h1, h2, h3, h4 { font-family: var(--font-serif); font-weight: 600; line-height: 1.18; }
    h1 { font-size: clamp(2.4rem, 5.5vw, 4rem); }
    h2 { font-size: clamp(1.9rem, 3.8vw, 3rem); }
    h3 { font-size: clamp(1.2rem, 2vw, 1.6rem); }
    h4 { font-size: 1.15rem; }
    p  { font-size: 1.05rem; line-height: 1.78; color: var(--text-mid); }
    em { font-style: italic; }

    .container         { max-width: 1140px; margin: 0 auto; padding: 0 1.75rem; }
    .container--narrow { max-width: 820px;  margin: 0 auto; padding: 0 1.75rem; }
    .section           { padding: 5.5rem 0; }
    .section--lg       { padding: 7rem 0; }
    .text-center       { text-align: center; }
    .mt-sm { margin-top: 0.75rem; }
    .mt-md { margin-top: 1.5rem; }
    .mt-lg { margin-top: 2.5rem; }

    .eyebrow {
      font-family: var(--font-sans);
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--gold);
      margin-bottom: 0.6rem;
    }
    .gold-rule { width: 48px; height: 2px; background: var(--gold); margin-bottom: 1.5rem; }
    .gold-rule--center { margin-left: auto; margin-right: auto; }

    /* HIGH-SPECIFICITY BUTTON OVERRIDES */
    main.adg-custom-page a.btn,
    main.adg-custom-page .btn {
      text-decoration: none !important;
      display: inline-block;
      font-family: var(--font-sans);
      font-weight: 500;
      border-radius: var(--radius);
      transition: all 0.2s ease;
      cursor: pointer;
      letter-spacing: 0.02em;
      white-space: nowrap;
    }
    main.adg-custom-page a.btn-primary,
    main.adg-custom-page .btn-primary {
      background: var(--blue) !important;
      color: #FFFFFF !important;
      padding: 0.9rem 2.2rem;
      font-size: 0.95rem;
    }
    main.adg-custom-page a.btn-primary:hover,
    main.adg-custom-page .btn-primary:hover {
      background: var(--sky) !important;
      color: #FFFFFF !important;
    }
    main.adg-custom-page a.btn-ghost,
    main.adg-custom-page .btn-ghost {
      border: 1px solid rgba(255,255,255,0.35) !important;
      color: rgba(255,255,255,0.88) !important;
      padding: 0.9rem 2.2rem;
      font-size: 0.95rem;
      background: transparent !important;
    }
    main.adg-custom-page a.btn-ghost:hover,
    main.adg-custom-page .btn-ghost:hover {
      border-color: var(--gold) !important;
      color: var(--gold) !important;
    }
    main.adg-custom-page a.btn-gold,
    main.adg-custom-page .btn-gold {
      background: var(--gold) !important;
      color: #021A35 !important;
      padding: 0.9rem 2.4rem;
      font-size: 0.95rem;
      font-weight: 600;
    }
    main.adg-custom-page a.btn-gold:hover,
    main.adg-custom-page .btn-gold:hover {
      background: var(--gold-bright) !important;
      color: #021A35 !important;
    }
    main.adg-custom-page a.btn-navy,
    main.adg-custom-page .btn-navy {
      background: var(--navy) !important;
      color: #FFFFFF !important;
      padding: 0.85rem 2.2rem;
      font-size: 0.95rem;
    }
    main.adg-custom-page a.btn-navy:hover,
    main.adg-custom-page .btn-navy:hover {
      background: #032d5a !important;
      color: #FFFFFF !important;
    }
    main.adg-custom-page a.btn-outline-navy,
    main.adg-custom-page .btn-outline-navy {
      border: 2px solid var(--navy) !important;
      color: #021A35 !important;
      background: transparent !important;
      padding: 0.85rem 2.2rem;
      font-size: 0.95rem;
    }
    main.adg-custom-page a.btn-outline-navy:hover,
    main.adg-custom-page .btn-outline-navy:hover {
      background: var(--navy) !important;
      color: #FFFFFF !important;
    }
    main.adg-custom-page a.btn-outline-gold,
    main.adg-custom-page .btn-outline-gold {
      border: 1.5px solid var(--gold) !important;
      color: var(--gold) !important;
      background: transparent !important;
      padding: 0.8rem 2rem;
      font-size: 0.92rem;
    }
    main.adg-custom-page a.btn-outline-gold:hover,
    main.adg-custom-page .btn-outline-gold:hover {
      background: var(--gold) !important;
      color: #021A35 !important;
    }
    main.adg-custom-page a.btn-outline-cream,
    main.adg-custom-page .btn-outline-cream {
      border: 1.5px solid rgba(255,255,255,0.4) !important;
      color: #FFFFFF !important;
      background: transparent !important;
      padding: 0.8rem 2rem;
      font-size: 0.92rem;
    }
    main.adg-custom-page a.btn-outline-cream:hover,
    main.adg-custom-page .btn-outline-cream:hover {
      border-color: var(--gold) !important;
      color: var(--gold) !important;
    }
    main.adg-custom-page a.btn-sm,
    main.adg-custom-page .btn-sm {
      padding: 0.65rem 1.5rem !important;
      font-size: 0.85rem !important;
    }

    .nav-logo img { height: 38px; }

    /* ============================================================
       HERO
       ============================================================ */
    .hero {
      background: var(--navy);
      color: var(--white);
      padding: 6.5rem 0 6rem;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .hero::before {
      content: '';
      position: absolute;
      inset: 0;
      background:
        radial-gradient(ellipse at 60% 30%, rgba(1,114,188,0.22) 0%, transparent 60%),
        radial-gradient(ellipse at 25% 80%, rgba(200,169,81,0.1)  0%, transparent 55%);
      pointer-events: none;
    }
    .hero::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 80px;
      height: 2px;
      background: var(--gold);
      opacity: 0.55;
    }
    .hero-inner { position: relative; z-index: 2; max-width: 820px; margin: 0 auto; padding: 0 1.75rem; }
    .hero .eyebrow { color: var(--gold); }
    .hero h1 { color: var(--white); margin: 0.5rem 0 1.25rem; }
    .hero h1 em { color: var(--gold); font-style: italic; }
    .hero-sub { font-size: 1.1rem; color: rgba(255,255,255,0.7); max-width: 600px; margin: 0 auto 2.75rem; line-height: 1.72; font-weight: 300; }
    .hero-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }

    /* ============================================================
       THREE PATHS
       ============================================================ */
    .paths-section { background: var(--cream); }
    .paths-intro { max-width: 660px; margin: 0 auto; text-align: center; margin-bottom: 4rem; }
    .paths-intro h2 { margin-bottom: 1rem; }
    .paths-intro p  { font-size: 1.05rem; }

    .paths-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.75rem;
      align-items: start;
    }

    .path-card {
      background: var(--white);
      border: 1px solid rgba(2,26,53,0.1);
      border-top: 4px solid var(--gold);
      padding: 2.25rem 2rem 2.5rem;
      position: relative;
      transition: box-shadow 0.25s ease;
    }
    .path-card:hover { box-shadow: 0 8px 32px rgba(2,26,53,0.1); }

    .path-card--featured {
      background: var(--navy);
      border-color: var(--navy);
      border-top-color: var(--gold);
      box-shadow: 0 12px 48px rgba(2,26,53,0.22);
    }
    .path-card--featured .path-tier-label { color: var(--gold); }
    .path-card--featured h3 { color: #FFFFFF !important; }
    .path-card--featured .path-price { color: #FFFFFF !important; }
    .path-card--featured .path-price span { color: rgba(255,255,255,0.55); }
    .path-card--featured .path-desc { color: rgba(255,255,255,0.72); }
    .path-card--featured .path-features li { color: rgba(255,255,255,0.8); border-bottom-color: rgba(255,255,255,0.1); }
    .path-card--featured .path-features li::before { color: var(--gold); }
    .path-card--featured .path-tag { background: var(--gold); color: #021A35 !important; }

    .path-badge {
      position: absolute;
      top: -1px;
      right: 1.5rem;
      background: var(--gold);
      color: var(--navy);
      font-family: var(--font-sans);
      font-size: 0.68rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      padding: 0.3rem 0.75rem;
    }

    .path-tier-label {
      font-family: var(--font-sans);
      font-size: 0.7rem;
      font-weight: 600;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--blue);
      margin-bottom: 0.75rem;
    }
    .path-card h3 { margin-bottom: 0.25rem; }
    .path-price {
      font-family: var(--font-serif);
      font-size: 2.8rem;
      font-weight: 600;
      color: var(--navy);
      line-height: 1.1;
      margin: 1rem 0 0.25rem;
    }
    .path-price span {
      font-size: 1rem;
      font-weight: 400;
      color: var(--text-light);
      font-family: var(--font-sans);
    }
    .path-tag {
      display: inline-block;
      background: rgba(1,114,188,0.1);
      color: var(--blue);
      font-size: 0.72rem;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 0.3rem 0.7rem;
      border-radius: 2px;
      margin-bottom: 1.25rem;
    }
    .path-desc {
      font-size: 0.97rem;
      color: var(--text-mid);
      line-height: 1.7;
      margin-bottom: 1.5rem;
    }
    .path-divider { height: 1px; background: rgba(2,26,53,0.1); margin: 1.25rem 0; }
    .path-card--featured .path-divider { background: rgba(255,255,255,0.12); }
    .path-features { list-style: none; margin-bottom: 2rem; }
    .path-features li {
      font-size: 0.92rem;
      color: var(--text-mid);
      padding: 0.55rem 0;
      border-bottom: 1px solid rgba(2,26,53,0.07);
      display: flex;
      gap: 0.65rem;
      align-items: flex-start;
    }
    .path-features li::before {
      content: '→';
      color: var(--gold);
      font-family: var(--font-sans);
      flex-shrink: 0;
    }
    .path-cta { display: block; text-align: center; }

    .paths-note {
      text-align: center;
      margin-top: 2.25rem;
      font-size: 0.88rem;
      color: var(--text-light);
    }
    .paths-note a { color: var(--blue); text-decoration: none; }
    .paths-note a:hover { color: var(--gold); }

    @media (max-width: 900px) {
      .paths-grid { grid-template-columns: 1fr; max-width: 480px; margin: 0 auto; }
      .path-card--featured { order: -1; }
    }

    /* ============================================================
       PROPHETIC COHORT LAUNCH BANNER
       ============================================================ */
    .prophetic-launch { background: var(--navy); }
    .prophetic-launch-inner {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 3rem;
      align-items: center;
      border: 1px solid rgba(200,169,81,0.3);
      border-left: 4px solid var(--gold);
      padding: 2.5rem 2.75rem;
      background: rgba(255,255,255,0.04);
    }
    .prophetic-launch .eyebrow { color: var(--gold); }
    .prophetic-launch h2 { color: var(--white); margin: 0.4rem 0 1rem; }
    .prophetic-launch p  { color: rgba(255,255,255,0.7); max-width: 560px; }
    .prophetic-date {
      display: inline-block;
      background: rgba(200,169,81,0.15);
      border: 1px solid rgba(200,169,81,0.35);
      color: var(--gold);
      font-size: 0.88rem;
      font-weight: 600;
      letter-spacing: 0.06em;
      padding: 0.45rem 1.1rem;
      margin: 1.25rem 0 1.75rem;
    }
    .prophetic-launch-actions { display: flex; flex-direction: column; gap: 0.75rem; align-items: center; flex-shrink: 0; }
    @media (max-width: 640px) {
      .prophetic-launch-inner { grid-template-columns: 1fr; }
      .prophetic-launch-actions { flex-direction: row; flex-wrap: wrap; align-items: flex-start; }
    }

    /* ============================================================
       5C MODULE SECTION
       ============================================================ */
    .modules-section { background: var(--white); }
    .modules-header { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; margin-bottom: 3.5rem; }
    .modules-header p { margin-top: 1rem; }
    .module-strip {
      display: flex;
      gap: 0;
      background: var(--cream);
      border: 1px solid rgba(2,26,53,0.08);
      overflow: hidden;
      flex-wrap: wrap;
    }
    .module-chip {
      flex: 1;
      min-width: 120px;
      text-align: center;
      padding: 1rem 0.5rem;
      font-family: var(--font-sans);
      font-size: 0.78rem;
      font-weight: 500;
      color: var(--text-mid);
      letter-spacing: 0.04em;
      border-right: 1px solid rgba(2,26,53,0.08);
    }
    .module-chip:last-child { border-right: none; }
    .module-chip span {
      display: block;
      font-family: var(--font-serif);
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--navy);
      margin-bottom: 0.25rem;
    }
    .flagship-card {
      background: var(--cream);
      border-top: 3px solid var(--gold);
      padding: 2.5rem;
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 2rem;
      align-items: center;
    }
    .flagship-label {
      font-family: var(--font-sans);
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--blue);
      margin-bottom: 0.6rem;
    }
    .flagship-card h3 { margin-bottom: 0.75rem; }
    .flagship-card p  { font-size: 0.97rem; }
    .flagship-actions { display: flex; flex-direction: column; gap: 0.75rem; align-items: flex-end; flex-shrink: 0; }

    @media (max-width: 768px) {
      .modules-header { grid-template-columns: 1fr; gap: 2rem; }
      .flagship-card  { grid-template-columns: 1fr; }
      .flagship-actions { align-items: flex-start; flex-direction: row; flex-wrap: wrap; }
    }

    /* ============================================================
       APOSTOLIC HUBS
       ============================================================ */
    .hubs-section { background: var(--navy); color: #FFFFFF !important; }
    .hubs-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; align-items: center; }
    .hubs-inner h2 { color: #FFFFFF !important; }
    .hubs-inner p  { color: rgba(255,255,255,0.68); margin-top: 1rem; }
    .hubs-actions  { display: flex; gap: 1rem; margin-top: 2rem; flex-wrap: wrap; }
    .hubs-coming   { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 1.75rem 2rem; }
    .hubs-coming h4 { color: var(--white); font-family: var(--font-serif); margin-bottom: 0.5rem; }
    .hubs-coming p  { font-size: 0.95rem; }
    .coming-badge {
      display: inline-block;
      font-size: 0.65rem;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--gold);
      border: 1px solid rgba(200,169,81,0.4);
      padding: 0.25rem 0.65rem;
      margin-bottom: 0.75rem;
    }

    @media (max-width: 768px) {
      .hubs-inner { grid-template-columns: 1fr; gap: 2.5rem; }
    }

    /* ============================================================
       TESTIMONIALS
       ============================================================ */
    .testimonials-section { background: var(--cream); }
    .testi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; margin-top: 3rem; }
    .testi-card { background: var(--white); padding: 2rem 1.75rem; position: relative; }
    .testi-card::before { content: '\201C'; font-family: var(--font-serif); font-size: 5rem; color: var(--gold); opacity: 0.2; position: absolute; top: -0.25rem; left: 1.25rem; line-height: 1; pointer-events: none; }
    .testi-card p { font-size: 0.97rem; color: var(--text-mid); padding-top: 1.5rem; line-height: 1.72; }
    .testi-meta { margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid rgba(2,26,53,0.1); }
    .testi-meta strong { display: block; font-size: 0.9rem; color: var(--text-dark); font-family: var(--font-sans); }
    .testi-meta span   { font-size: 0.82rem; color: var(--text-light); }
    @media (max-width: 780px) { .testi-grid { grid-template-columns: 1fr; } }

    /* ============================================================
       CTA CLOSE
       ============================================================ */
    .cta-close {
      background: var(--navy);
      text-align: center;
      padding: 6.5rem 0;
      position: relative;
      overflow: hidden;
    }
    .cta-close::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse at 50% 50%, rgba(1,114,188,0.18) 0%, transparent 70%);
      pointer-events: none;
    }
    .cta-inner { position: relative; z-index: 2; }
    .cta-close .eyebrow { color: var(--gold); }
    .cta-close h2 { color: var(--white); max-width: 680px; margin: 0.5rem auto 1.25rem; }
    .cta-close h2 em { color: var(--gold); }
    .cta-close p { color: rgba(255,255,255,0.65); max-width: 540px; margin: 0 auto 2.75rem; }
    .cta-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }

</style>

<main id="primary" class="site-main adg-custom-page" role="main">


<!-- ============================================================
     HERO
     ============================================================ -->
<section class="hero" aria-labelledby="hero-heading">
  <div class="hero-inner">
    <p class="eyebrow">Kingdom Formation</p>
    <h1 id="hero-heading">Built to <em>Form</em> You,<br>Not Just Inform You.</h1>
    <p class="hero-sub">
      Every training in the ADG catalog is built on Scripture, tested in the field,
      and designed for the leader ready to move from calling into commissioning.
    </p>
    <div class="hero-actions">
      <a href="https://5cblueprint.awakeningdestiny.global/called-to-carry/assessment" class="btn btn-primary">Begin the Free Introduction &rarr;</a>
      <a href="#three-paths" class="btn btn-ghost">See All Paths &darr;</a>
    </div>
  </div>
</section>


<!-- ============================================================
     THREE PATHS
     ============================================================ -->
<section class="section--lg paths-section" id="three-paths" aria-labelledby="paths-heading">
  <div class="container">

    <div class="paths-intro">
      <p class="eyebrow">Choose Your Path</p>
      <div class="gold-rule gold-rule--center"></div>
      <h2 id="paths-heading">Three Paths Into<br>the 5C Blueprint.</h2>
      <p>
        Start with the free diagnostic. Then choose the depth of formation your assignment demands.
        Every path enters the same seven-module covenant framework — the difference is community,
        intensity, and the depth of co-labor.
      </p>
    </div>

    <div class="paths-grid">

      <!-- PATH 1: SELF-PACED -->
      <div class="path-card">
        <p class="path-tier-label">Path 01</p>
        <h3>Self-Paced Blueprint</h3>
        <div class="path-price">$149 <span>one-time</span></div>
        <span class="path-tag">Open Enrollment</span>
        <p class="path-desc">
          Seven modules. Your timeline. Full access to the 5C Leadership Blueprint —
          formation at the pace your season allows.
        </p>
        <div class="path-divider"></div>
        <ul class="path-features">
          <li>All 7 formation modules — Calling through Commissioning</li>
          <li>25-Q archetype diagnostic</li>
          <li>AI-generated personalized blueprint report</li>
          <li>Branded .docx Commissioning export</li>
          <li>Certificate of Completion</li>
          <li>6-month portal access</li>
        </ul>
        <a href="https://5cblueprint.awakeningdestiny.global" class="btn btn-navy btn-cta path-cta">
          Enter the Blueprint &rarr;
        </a>
      </div>

      <!-- PATH 2: 21-DAY SPRINT — featured -->
      <div class="path-card path-card--featured">
        <div class="path-badge">Most Intensive</div>
        <p class="path-tier-label">Path 02</p>
        <h3>21-Day Sprint</h3>
        <div class="path-price">$497 <span>one-time</span></div>
        <span class="path-tag">Application Required</span>
        <p class="path-desc">
          A focused 21-day intensive through the full 5C Blueprint. Structured timeline.
          Accountability checkpoints. For the leader who needs to move now.
        </p>
        <div class="path-divider"></div>
        <ul class="path-features">
          <li>All 7 modules on a structured 21-day timeline</li>
          <li>25-Q archetype diagnostic + full AI report</li>
          <li>Weekly accountability touchpoints</li>
          <li>Branded .docx Commissioning export</li>
          <li>Certificate of Completion</li>
          <li>Priority portal support</li>
        </ul>
        <a href="https://5cblueprint.awakeningdestiny.global/called-to-carry/sprint/apply"
           class="btn btn-gold path-cta">
          Apply for the Sprint &rarr;
        </a>
      </div>

      <!-- PATH 3: FOUNDERS COHORT -->
      <div class="path-card">
        <p class="path-tier-label">Path 03</p>
        <h3>Founders Cohort</h3>
        <div class="path-price">$997 <span>one-time</span></div>
        <span class="path-tag">Application Required</span>
        <p class="path-desc">
          An 8-week covenant community for founders carrying apostolic and marketplace assignments.
          Will reviews every application personally. Limited seats per cohort.
        </p>
        <div class="path-divider"></div>
        <ul class="path-features">
          <li>Full 5C Blueprint — cohort-paced over 8 weeks</li>
          <li>25-Q diagnostic + AI Report 1 &amp; Report 2 (Capstone)</li>
          <li>Live cohort sessions with Will Meier</li>
          <li>Covenant community access — founders network</li>
          <li>Branded .docx Commissioning export</li>
          <li>Certificate of Completion</li>
        </ul>
        <a href="https://5cblueprint.awakeningdestiny.global/called-to-carry/founders/apply"
           class="btn btn-primary path-cta">
          Apply for the Cohort &rarr;
        </a>
      </div>

    </div><!-- .paths-grid -->

    <p class="paths-note">
      Not sure where to start?
      <a href="https://5cblueprint.awakeningdestiny.global/called-to-carry/assessment">Take the free 10-Q diagnostic &rarr;</a>
      &nbsp;&nbsp;|&nbsp;&nbsp;
      <a href="https://awakeningdestiny.global/contact/">Book a free coaching call &rarr;</a>
    </p>

  </div>
</section>


<!-- ============================================================
     PROPHETIC COHORT LAUNCH BANNER
     ============================================================ -->
<section class="section prophetic-launch" aria-labelledby="prophetic-launch-heading">
  <div class="container">
    <div class="prophetic-launch-inner">
      <div>
        <p class="eyebrow">Now Enrolling</p>
        <h2 id="prophetic-launch-heading">Prophetic Cohort</h2>
        <p>A formation environment for prophetic voices called to hear accurately, release courageously, and govern through revelation &mdash; in communities, businesses, and nations.</p>
        <div class="prophetic-date">Starts June 23rd &nbsp;&middot;&nbsp; 8:00 PM &nbsp;&middot;&nbsp; Zoom</div>
      </div>
      <div class="prophetic-launch-actions">
        <a href="mailto:info@awakeningdestiny.global" class="btn btn-gold">Contact to Enroll &rarr;</a>
        <a href="mailto:info@awakeningdestiny.global" class="btn btn-outline-cream btn-sm">info@awakeningdestiny.global</a>
      </div>
    </div>
  </div>
</section>


<!-- ============================================================
     FLAGSHIP MODULE VIEW
     ============================================================ -->
<section class="section modules-section" id="5c-blueprint" aria-labelledby="modules-heading">
  <div class="container">
    <div class="modules-header">
      <div>
        <p class="eyebrow">Flagship Training</p>
        <div class="gold-rule"></div>
        <h2 id="modules-heading">5C Leadership Blueprint</h2>
        <p>
          A covenant journey through seven modules of Kingdom leadership formation —
          built for the leader standing at the threshold of their next level.
          <em>Most leadership development tells you what to do. The 5C Blueprint forms who you are.</em>
        </p>
      </div>
      <div>
        <div class="module-strip" role="list" aria-label="5C Blueprint modules">
          <div class="module-chip" role="listitem"><span>01</span>Introduction</div>
          <div class="module-chip" role="listitem"><span>02</span>Calling</div>
          <div class="module-chip" role="listitem"><span>03</span>Connection</div>
          <div class="module-chip" role="listitem"><span>04</span>Competency</div>
          <div class="module-chip" role="listitem"><span>05</span>Capacity</div>
          <div class="module-chip" role="listitem"><span>06</span>Convergence</div>
          <div class="module-chip" role="listitem"><span>07</span>Commissioning</div>
        </div>
      </div>
    </div>

    <div class="flagship-card">
      <div>
        <p class="flagship-label">Flagship · All Three Paths</p>
        <h3>Calling, Connection, Competency,<br>Capacity, Convergence — Commissioning.</h3>
        <p>
          Seven modules. One covenant framework. Built on Scripture, tested in the field,
          and designed for the leader who is done being equipped for a room they've already outgrown.
          Begin free with the Introduction module — no payment required.
        </p>
      </div>
      <div class="flagship-actions">
        <a href="https://5cblueprint.awakeningdestiny.global" class="btn btn-navy">Enter the Blueprint &rarr;</a>
        <a href="#three-paths" class="btn btn-outline-gold btn-sm">Compare Paths</a>
      </div>
    </div>
  </div>
</section>


<!-- ============================================================
     APOSTOLIC HUBS + COMING SOON
     ============================================================ -->
<section class="section hubs-section" id="apostolic-hubs" aria-labelledby="hubs-heading">
  <div class="container">
    <div class="hubs-inner">
      <div>
        <p class="eyebrow" style="color: var(--gold);">Active Training</p>
        <div class="gold-rule" style="background: rgba(200,169,81,0.45);"></div>
        <h2 id="hubs-heading">Apostolic Hubs</h2>
        <p>
          Kingdom governance training for leaders with apostolic grace called to build, govern,
          and pioneer across the municipality, ministry, and marketplace. Learn how to establish
          Kingdom hubs that carry divine authority and cultural influence.
        </p>
        <div class="hubs-actions">
          <a href="https://awakeningdestiny.global/apostolic-cohort/" class="btn btn-gold">Explore Apostolic Hubs &rarr;</a>
          <a href="https://awakeningdestiny.global/contact/" class="btn btn-outline-cream">Apply Now</a>
        </div>
      </div>
      <div>
        <div class="hubs-coming" style="margin-bottom: 1.5rem;">
          <span class="coming-badge">Coming Soon</span>
          <h4>Discovering Your Destiny Scrolls</h4>
          <p style="color: rgba(255,255,255,0.6); font-size: 0.93rem;">
            Uncover the prophetic blueprints written over your life before time began — and learn
            how to read, align with, and walk in the fullness of your divine scroll.
          </p>
          <a href="#" style="display:inline-block; margin-top:0.75rem; font-size:0.82rem; color: var(--gold); text-decoration:none; letter-spacing:0.04em;">
            Notify Me When Live &rarr;
          </a>
        </div>
        <div class="hubs-coming">
          <span class="coming-badge">Coming Soon</span>
          <h4>10 Characteristics of Apostolic Hubs</h4>
          <p style="color: rgba(255,255,255,0.6); font-size: 0.93rem;">
            A deep dive into the ten defining marks of a true apostolic hub — the DNA that
            distinguishes a Kingdom building from a religious institution.
          </p>
          <a href="#" style="display:inline-block; margin-top:0.75rem; font-size:0.82rem; color: var(--gold); text-decoration:none; letter-spacing:0.04em;">
            Notify Me When Live &rarr;
          </a>
        </div>
      </div>
    </div>
  </div>
</section>


<!-- ============================================================
     TESTIMONIALS
     ============================================================ -->
<section class="section testimonials-section" id="testimonials" aria-labelledby="testi-heading">
  <div class="container">
    <div class="text-center">
      <p class="eyebrow">Voices from the Journey</p>
      <div class="gold-rule gold-rule--center"></div>
      <h2 id="testi-heading">What God Has Done</h2>
    </div>
    <div class="testi-grid">

      <div class="testi-card">
        <p>
          Will's 5C Leadership Blueprint is exactly what the next generation needs — a framework
          designed to raise up empowered, trained leaders whose identity is rooted in Christ.
          We are believing for this to be implemented across every year level and watching in faith
          for what God will do.
        </p>
        <div class="testi-meta">
          <strong>Anna</strong>
          <span>Intercessor &amp; Ministry Leader &mdash; Australia</span>
        </div>
      </div>

      <div class="testi-card">
        <p>
          The teaching and leadership guidance I've received through Awakening Destiny Global has been
          instrumental in my personal and ministry growth. I came seeking clarity and found a deeper
          understanding of my calling and direction. Today I lead with greater confidence and focus —
          anchored more deeply in my calling than I have ever been.
        </p>
        <div class="testi-meta">
          <strong>Pastor Andrew Mkare</strong>
          <span>Senior Pastor &mdash; Kenya, Africa</span>
        </div>
      </div>

      <div class="testi-card">
        <p>
          Will carries a unique gift — the ability to express deep truths of the Holy Spirit in ways
          that are immediately actionable. Through ADG, he helped me redirect an entire manuscript
          from book to online curriculum. He brings a clarity you can apply to your spiritual walk
          starting today.
        </p>
        <div class="testi-meta">
          <strong>Ken B.</strong>
          <span>Doctor of Business, Marketing &mdash; Virginia</span>
        </div>
      </div>

    </div>
  </div>
</section>


<!-- ============================================================
     CTA CLOSE
     ============================================================ -->
<section class="cta-close" aria-labelledby="cta-heading">
  <div class="container">
    <div class="cta-inner">
      <p class="eyebrow">The Blueprint Is Waiting</p>
      <h2 id="cta-heading">
        Formation Before <em>Commissioning.</em><br>
        Start Where You Are.
      </h2>
      <p>
        Begin free. The Introduction module costs nothing and commits to nothing —
        except showing you exactly what carrying your assignment is going to require.
      </p>
      <div class="cta-actions">
        <a href="https://5cblueprint.awakeningdestiny.global/called-to-carry/assessment" class="btn btn-gold">Begin the Free Introduction &rarr;</a>
        <a href="https://awakeningdestiny.global/leadership-coaching/" class="btn btn-outline-cream">Book a Coaching Call &rarr;</a>
      </div>
    </div>
  </div>
</section>


</main>

<?php
get_footer();
?>
