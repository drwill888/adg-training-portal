// lib/routing-logic.js
// Layer 5 — Maps archetype (office + overlay) to recommended Called to Carry tier

const TIERS = {
  founders: {
    id: 'founders',
    name: 'Founders Cohort',
    price: '$997',
    tagline: 'For those building businesses and ministries from the ground up.',
    description:
      'An 8-week covenant community for founders. Application-required. Will reviews every application personally. Limited seats.',
    cta: 'Apply for the Founders Cohort',
    href: '/called-to-carry/founders/apply',
    badge: 'Best Match',
  },
  sprint: {
    id: 'sprint',
    name: '21-Day Sprint',
    price: '$497',
    tagline: 'An intensive live experience with Will.',
    description:
      'For active leaders who need rapid alignment and direct formation. Application-required. Live sessions with Will over 21 days.',
    cta: 'Apply for the 21-Day Sprint',
    href: '/called-to-carry/sprint/apply',
    badge: 'Best Match',
  },
  selfPaced: {
    id: 'selfPaced',
    name: 'Self-Paced Portal',
    price: '$149',
    tagline: 'Full formation curriculum at your own pace.',
    description:
      'Open enrollment. Six modules of structured Kingdom leadership formation — work through it at the pace your season allows.',
    cta: 'Enroll Now',
    href: '/called-to-carry',
    badge: 'Best Match',
  },
};

/**
 * Determine the recommended tier based on office + overlay archetype.
 *
 * Logic:
 * - Apostolic office → Founders (pioneers/builders by calling)
 * - Prophetic + Builder or Reformer → Founders (building from revelation)
 * - Teaching office → Self-Paced (wired for deep, structured formation)
 * - Builder overlay (any office not above) → Founders
 * - All others → Sprint (active leaders needing intensive alignment)
 */
export function getRecommendedTier(office, overlay) {
  if (!office || !overlay) return { primary: TIERS.sprint, secondary: TIERS.selfPaced };

  const o = office.toLowerCase();
  const v = overlay.toLowerCase();

  // Apostolic — always Founders
  if (o === 'apostolic') {
    return { primary: TIERS.founders, secondary: TIERS.sprint };
  }

  // Prophetic + builder or reformer → Founders; others → Sprint
  if (o === 'prophetic') {
    if (v === 'builder' || v === 'reformer') {
      return { primary: TIERS.founders, secondary: TIERS.sprint };
    }
    return { primary: TIERS.sprint, secondary: TIERS.founders };
  }

  // Teaching → Self-Paced primary
  if (o === 'teaching') {
    if (v === 'builder' || v === 'reformer') {
      return { primary: TIERS.sprint, secondary: TIERS.selfPaced };
    }
    return { primary: TIERS.selfPaced, secondary: TIERS.sprint };
  }

  // Any office with Builder overlay → Founders
  if (v === 'builder') {
    return { primary: TIERS.founders, secondary: TIERS.sprint };
  }

  // Evangelistic and Pastoral → Sprint
  return { primary: TIERS.sprint, secondary: TIERS.selfPaced };
}

export { TIERS };
