# CLAUDE.md — ADG Training Portal

## Project Overview
Next.js 14 training platform for the 5C Leadership Blueprint. Supabase auth, Stripe payments, AI-powered coaching (Anthropic + OpenAI).

## Design System Authority: ive_designer + ive_designer_ui_systems

All UI work on this project is governed by the following design criteria. These are non-negotiable. Every component, page, and layout decision must pass through this lens before shipping.

---

### Critique Lens — Six Dimensions

Every screen, component, or layout change must be evaluated against all six:

1. **Purpose** — Does this element have a clear reason to exist? If you cannot state its job in one sentence, remove it.
2. **Clarity** — Can the user understand what to do and where they are within 3 seconds? If explanation is needed, the design has failed.
3. **Simplicity** — Is this the minimum effective expression? Every additional element, color, animation, or option must justify its existence against what would happen if it were removed.
4. **Integrity** — Does this match the visual and tonal language of the rest of the product? A single screen that feels like a different product is a system failure.
5. **Craft** — Are spacing, alignment, color, and typography precise? "Close enough" is not a standard. If padding is 14px in one place and 16px in another for no reason, that is a defect.
6. **Restraint** — Has decoration been mistaken for design? If an element is decorative but not functional, it must be removed. Watermarks, scroll indicators, animated flourishes — these are noise unless they serve navigation or comprehension.

---

### UI Critique Sequence

When reviewing any screen, follow this exact order:

1. **State the screen's purpose** in one sentence.
2. **Deliver a blunt verdict** — is it working or not, and why? No diplomatic hedging.
3. **What is working** — identify what earns its place. Be specific.
4. **What is confused or misleading** — where does the user hesitate, misread, or lose momentum?
5. **What to remove immediately** — elements that are actively hurting the experience right now.
6. **What to standardize** — inconsistencies that create visual drift or maintenance debt.
7. **Structural redesign recommendations** — larger changes that would meaningfully improve the screen.

---

### Non-Agreeable Stances

The following positions are held as defaults. Do not soften, hedge, or compromise on these unless the user provides an explicit, reasoned override:

- **Placeholder content in production is unacceptable.** If an image, bio, or section is not ready, remove it entirely. A placeholder communicates "unfinished" and damages credibility.
- **Competing CTAs create hesitation.** Every screen gets ONE primary action and ONE secondary. Three equal-weight buttons is a design failure.
- **Emoji as UI is fragile.** Emoji rendering varies by OS and device. Use SVG or CSS for icons, locks, badges, and indicators. Always.
- **Inline styles are technical debt.** Every `style={{}}` object is a future maintenance problem. Push toward shared tokens and components.
- **Two visual languages in one product is a brand fracture.** If the landing page feels different from the dashboard, the system is broken. Converge.
- **Generic SaaS patterns undermine authority.** Rounded cards on light gray backgrounds with sans-serif fonts say "project management tool," not "Kingdom formation system." The visual language must match the content's weight.
- **"Close enough" spacing is not close enough.** If the design system says 16px, then 14px is wrong. Precision is not perfectionism — it is craft.
- **Content should never be cut to fix a design problem.** The content is the product. Fix the rendering, not the curriculum.
- **Mobile is not an afterthought.** If a grid doesn't have a single-column fallback below 768px, it is not done.

---

### Token System Framework

All UI must draw from a single source of truth. No hardcoded values in components.

#### Required Token Categories

```
Palette:
  navy:        primary brand color (backgrounds, text)
  gold:        accent, CTAs, highlights
  cream:       page backgrounds
  white:       card surfaces
  gray-light:  borders, dividers
  gray-dark:   secondary text
  red:         error, destructive
  green:       success, completion

Typography:
  font-display:   Cormorant Garamond (headings, hero text)
  font-body:      ONE sans-serif only — Outfit OR Raleway, not both
  scale:          use a consistent modular scale (not arbitrary px values)

Spacing:
  unit:           4px base
  scale:          4, 8, 12, 16, 24, 32, 48, 64, 96
  Never use values outside this scale without justification.

Border Radius:
  sharp:          0px (hero sections, full-bleed containers)
  subtle:         4px (cards, inputs)
  rounded:        8px (buttons, badges)
  pill:           9999px (tags, status indicators)
  Never exceed 8px on cards. This is an authoritative brand, not a playful one.

Shadows:
  elevation-1:    subtle card lift
  elevation-2:    modals, overlays
  No more than 2 shadow levels. Shadows are structural, not decorative.
```

#### Token File Location
`styles/tokens.js` — single export, imported by every component and page. If this file does not exist, create it before building new UI.

---

### Screen-Specific Rules: Learning Portals

#### Landing Pages
- Hero headline must create emotional resonance in under 8 words.
- ONE primary CTA above the fold. Lowest friction action wins (e.g., free assessment > paid purchase > booking call).
- Section count: 8 maximum. If you need more, you are repeating yourself.
- FAQ must be collapsed (accordion). Open FAQs add 600-800px of page length for content most users skip.
- Pricing must be consistent across every surface. If the landing page says "discussed personally" and the dashboard shows $79.99, that is a trust violation.
- Social proof / bio sections require real content. No placeholders, no "coming soon."

#### Dashboards
- The dashboard must answer three questions instantly: Where am I? What did I do last? What should I do next?
- **First-run state is mandatory.** An empty dashboard with locked modules is hostile to new users. Show a dedicated welcome flow when progress is empty.
- **"Next up" card** must be the first thing a returning learner sees. They should never scan a grid to find their place.
- Module cards: single column preferred. Learners don't compare modules — they find their next one. Horizontal scanning across a 2-column grid adds friction.
- Progress indicators must be visible at the dashboard level AND within each module.
- Paywall messaging should integrate with the module grid, not sit as a separate sales block above it.

#### Module / Lesson Pages
- **Persistent step indicator is mandatory.** The learner must always see "Step 3 of 8" (or equivalent). A long-form module without position awareness is disorienting.
- Steps must be clickable for completed steps. Forcing backward navigation through each screen is unacceptable friction.
- **Teaching content must not exceed ~1,500 words per screen.** If a step has 5,000+ words, break it into sub-steps or use accordion collapse. No learner processes 7 principles in one scroll.
- Navigation must be accessible without scrolling to the bottom. Sticky footer nav or persistent top bar.
- Reflection/textarea components: one component, one pattern. Do not maintain two near-identical components (`PauseTextarea` and `Reflect`). Merge.
- Diagnostic scoring UI: group items by category with visual headers. Show category subtotals inline.
- Resource content (Scripture, book chapters) should not open in modals that block the writing area. Use collapsible panels or tabs.
- Blueprint/document generation must produce real `.docx` files, not HTML disguised as `.doc`.
- Auto-save must provide visible confirmation. No ambiguity about whether work was saved.

---

### Component Rules

- **Buttons:** Maximum 2 visual weights per screen (primary + secondary). Primary = filled. Secondary = outlined or text. Never 3 equal-weight buttons.
- **Cards:** Consistent padding (use spacing tokens). Consistent border-radius (use token). No mixing rounded and sharp cards on the same screen.
- **Progress bars:** Same component everywhere. Same height, same colors, same animation. Dashboard and module progress bars must be visually identical.
- **Badges / Tags:** One color system with semantic meaning. Gold = framework/dimension. Navy = status. Green = complete. Do not assign colors arbitrarily.
- **Icons:** SVG or CSS only. No Unicode characters (◈, ①) that render inconsistently. No emoji for functional UI elements.
- **Modals:** Use sparingly. If the user needs to reference modal content while interacting with the page, it should not be a modal.

---

### Responsive Strategy

One strategy for the entire product. Not three.

- **Breakpoints:** 480px (small phone), 768px (tablet), 1024px (desktop). These three. Everywhere.
- **Grid collapse:** All multi-column grids must have `grid-template-columns: 1fr` at 768px and below.
- **Touch targets:** Minimum 44px on mobile. Diagnostic score buttons, nav items, CTAs — all of them.
- **Test on real devices.** "Works on my laptop" is not responsive design.

---

### Brand Convergence Rule

The landing page and the app interior must feel like the same product. Specifically:

- Same font families (display + body)
- Same color palette (exact hex values, not "close")
- Same border-radius philosophy
- Same spacing scale
- Same component patterns (buttons, cards, badges)

If a new user would believe the landing page and dashboard were built by different teams, the system has failed. Fix it before adding features.

---

### Decision Framework: When In Doubt

1. Does it serve the learner's next action? If not, remove it.
2. Is it consistent with every other screen? If not, standardize it.
3. Could it be simpler? If yes, simplify it.
4. Would Jony Ive ship this? If the answer is "he'd ask why this exists," it should not exist.
