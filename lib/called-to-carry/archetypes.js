// lib/called-to-carry/archetypes.js
// Four archetype definitions — locked per called-to-carry-assessment-spec.md §1.
// Each archetype has a marketplace name, prophetic subtitle, results copy, and CTA.

export const ARCHETYPES = {
  misaligned_builder: {
    id: 'misaligned_builder',
    name: 'The Misaligned Builder',
    subtitle: 'The one carrying what was once his, but isn\'t anymore.',
    // Results page copy — spec §3.1
    body: [
      'You built something real. That\'s not in question.',
      'What the assessment is showing is that some of what you built was right for who you were, and some of what you built was right for a season that is ending. The weight you\'re feeling isn\'t failure — it\'s the weight of carrying structures that used to fit and don\'t anymore.',
      'This is one of the most disorienting places a leader can be, because nothing has broken. The business still works. The commitments still function. And yet something in you knows that continuing to carry this the same way for another eighteen months will cost you more than you can currently name.',
      'What you most need now is not more effort. You\'ve proven you can work. What you need is discernment — a clear, structured process to separate what is still yours to carry from what was yours in a previous season, and the courage to let go of what isn\'t yours anymore without breaking the things and people who depend on you.',
    ],
    nextSteps: [
      'Name what you\'re carrying that no longer fits',
      'Identify the 20% of your yes-list that\'s draining the other 80%',
      'Begin the slow, deliberate work of realignment before the erosion becomes a crisis',
    ],
    cta: {
      primary: { label: 'Learn about the Cohort →', href: '/cohort' },
      fallback: 'Not ready to commit to a cohort? Take 21 days to receive one short, specific email each morning — written for The Misaligned Builder. No pitch in the first two weeks.',
    },
    emailSequenceDays: 21,
    emailSequenceCount: 7,
  },

  unreleased_voice: {
    id: 'unreleased_voice',
    name: 'The Unreleased Voice',
    subtitle: 'The one carrying something that hasn\'t yet come out.',
    body: [
      'What the assessment is showing is that the weight you feel is not mainly about what you\'re doing wrong — it\'s about what you haven\'t yet done.',
      'There is something in you. You\'ve sensed it for a long time, probably years. You may have named it privately, in journals or in prayer, but you have not released it into the world. The unexpressed thing has become its own kind of weight.',
      'This is a specific kind of misalignment — not between you and your work, but between you and your voice. Your current role may be fine. Your business may be fine. What isn\'t fine is that something is forming in you that has no outlet yet, and the longer it stays inside, the heavier it gets. This is the condition Scripture describes as a burden of the Lord. It is not ordinary fatigue. It is the pressure of something that wants to come out.',
      'Leaders in your situation often make a mistake: they assume they need to find their voice, when in fact their voice has already formed — they just have not given it permission to speak. What you most need is not more content, more training, or more platform strategy. You need a process that gives language to what is already in you and a structured path to release it without self-sabotaging.',
    ],
    nextSteps: [
      'Name the one thing you have been carrying most consistently',
      'Identify why it has not yet been released',
      'Take the first structured step toward bringing it forth',
    ],
    cta: {
      primary: { label: 'Learn about the Cohort →', href: '/cohort' },
      fallback: 'Not ready for the cohort? Take 21 days to receive one short, specific email each morning — written for The Unreleased Voice. We\'ll name what\'s been forming in you, one day at a time.',
    },
    emailSequenceDays: 21,
    emailSequenceCount: 7,
  },

  threshold: {
    id: 'threshold',
    name: 'The Leader at the Threshold',
    subtitle: 'The one between the seasons, holding the weight of the door.',
    body: [
      'What the assessment is showing is that you are not currently misaligned in the ordinary sense. You are between.',
      'One season is ending — or has already ended, even if the paperwork hasn\'t caught up — and the next has not yet taken shape. This is one of the most spiritually significant places a leader can be, and also one of the most disorienting. The old script no longer fits. The new script is not yet written.',
      'Leaders at the threshold often make two mistakes. The first is to force the next season prematurely, grabbing at the first thing that looks like clarity because the ambiguity is intolerable. The second is to collapse into the discomfort and delay, telling themselves they are "being still" when in fact they are avoiding.',
      'Neither serves the assignment. The threshold has its own work, and that work is discernment — hearing with precision what the next season is actually for, and preparing to carry it well before it fully arrives.',
      'What you most need now is not a strategic plan for the next thirty days. You need a process that helps you read the season you\'re in, discern what God is forming in you through the waiting, and recognize the next assignment when it shows up — which it will.',
    ],
    nextSteps: [
      'Stop pushing to resolve the ambiguity',
      'Identify what the threshold is forming in you',
      'Build the listening infrastructure to recognize the next thing when it becomes visible',
    ],
    cta: {
      primary: { label: 'Learn about the Cohort →', href: '/cohort' },
      intensive: { label: 'Learn about the Intensive →', href: '/intensive' },
      fallback: 'Not ready for either? Take 21 days to receive one short, specific email each morning — written for The Leader at the Threshold. Designed to help you read the in-between.',
    },
    emailSequenceDays: 21,
    emailSequenceCount: 7,
  },

  aligned_builder: {
    id: 'aligned_builder',
    name: 'The Aligned Builder',
    subtitle: 'The one walking in what he was given to carry.',
    body: [
      'What the assessment is showing is something rare. You are, by the measures here, carrying what you were given to carry, in roughly the right proportion, in roughly the right season.',
      'That is not a small thing.',
      'Most leaders do not experience this — and many leaders who appear to be in your position are in fact quietly misaligned and covering it well. The fact that your answers converge toward alignment is a confirmation worth receiving.',
      'That said, alignment is not a resting place. It is a platform.',
      'The leaders who remain aligned across decades are the ones who stay in active discernment even when nothing is wrong — because the work that comes next often requires you to release something you are currently doing well in order to carry something larger. The cost of misalignment is obvious. The cost of staying in a season past its end is subtler, and it often catches aligned leaders by surprise.',
      'What you most need now is not correction. It is company — peers and formation that keep you honest as you continue to build, and the interpretive resources to recognize the next transition before it arrives.',
    ],
    nextSteps: [
      'Stay honest about what is actually working',
      'Identify the one thing in your current season that is likely ending next',
      'Begin preparing for that transition before it forces you',
    ],
    cta: {
      // No Blueprint push for Aligned Builder — direct to Advisory
      primary: { label: 'Reply to Will about the Advisory →', href: 'mailto:will@awakeningdestiny.global?subject=Advisory%20inquiry' },
      fallback: 'Want a low-pressure nurture rhythm? Receive one short, thoughtful email every Monday — written for The Aligned Builder. Reflection, not promotion.',
    },
    emailSequenceDays: 30,
    emailSequenceCount: 5,
  },
};

// Ordered list for tiebreaker logic (spec §2 — MB > UV > TH > AB)
export const TIEBREAK_ORDER = [
  'misaligned_builder',
  'unreleased_voice',
  'threshold',
  'aligned_builder',
];
