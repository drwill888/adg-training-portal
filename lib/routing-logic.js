// lib/routing-logic.js
// Layer 5 — Maps archetype to recommended Called to Carry tier
// ALL THREE tiers always shown. Primary changes based on archetype.

const TIERS = {
  founders: {
    id: 'founders',
    name: 'Founders Cohort',
    price: '$997',
    tagline: 'For those building businesses and ministries from the ground up.',
    description: '8-week covenant community. Application-required. Will reviews every application personally.',
    cta: 'Apply for the Founders Cohort',
    href: '/called-to-carry/founders/apply',
    badge: 'Best Match',
  },
  sprint: {
    id: 'sprint',
    name: '21-Day Sprint',
    price: '$497',
    tagline: 'An intensive live experience with Will.',
    description: 'For active leaders needing rapid alignment. Application-required. Live sessions over 21 days.',
    cta: 'Apply for the 21-Day Sprint',
    href: '/called-to-carry/sprint/apply',
    badge: 'Best Match',
  },
  selfPaced: {
    id: 'selfPaced',
    name: 'Self-Paced Portal',
    price: '$149',
    tagline: 'Full formation curriculum at your own pace.',
    description: 'Open enrollment. Six modules of structured Kingdom leadership formation.',
    cta: 'Enroll Now',
    href: '/called-to-carry',
    badge: 'Best Match',
  },
};

export function getRecommendedTier(office, overlay) {
  if (!office || !overlay) {
    return { primary: TIERS.founders, secondary: TIERS.sprint, tertiary: TIERS.selfPaced };
  }

  const o = office.toLowerCase();
  const v = overlay.toLowerCase();

  // Apostolic always Founders
  if (o === 'apostolic') {
    return { primary: TIERS.founders, secondary: TIERS.sprint, tertiary: TIERS.selfPaced };
  }

  // Builder overlay always Founders
  if (v === 'builder') {
    return { primary: TIERS.founders, secondary: TIERS.sprint, tertiary: TIERS.selfPaced };
  }

  // Prophetic + reformer → Founders
  if (o === 'prophetic' && (v === 'reformer' || v === 'builder')) {
    return { primary: TIERS.founders, secondary: TIERS.sprint, tertiary: TIERS.selfPaced };
  }

  // Teaching → Self-Paced primary
  if (o === 'teaching') {
    return { primary: TIERS.selfPaced, secondary: TIERS.sprint, tertiary: TIERS.founders };
  }

  // All others → Sprint primary, Founders always third
  return { primary: TIERS.sprint, secondary: TIERS.selfPaced, tertiary: TIERS.founders };
}

export { TIERS };