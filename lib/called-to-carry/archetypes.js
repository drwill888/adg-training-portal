// lib/called-to-carry/archetypes.js
// Four archetype definitions — locked per called-to-carry-assessment-spec.md §1.
// Each archetype has a marketplace name, prophetic subtitle, results copy, and CTA.

export const ARCHETYPES = {
  misaligned_builder: {
    id: 'misaligned_builder',
    name: 'The Misaligned Builder',
    subtitle: 'The one still building what was right for a season that has already ended.',
    // Results page copy — spec §3.1
    body: [
      'You built something real. That is not the problem.',
      'The problem is that you are still building it — or still running it, still fronting it, still showing up for it — past the point where it was yours to carry. Something in your current structure was right for who you were and what was needed at the time. You were obedient when you built it. But obedience in one season does not obligate you to maintain its structures indefinitely into the next.',
      'What you feel in the early mornings, when your mind starts running before you\'ve given it permission — that low-grade unease that doesn\'t have a clean object — is your nervous system registering what your calendar hasn\'t been allowed to say yet. Nothing has broken. The commitments still function. People are still depending on you. And that loyalty, that sense of responsibility, is part of what has kept you here longer than you should have stayed.',
      'What you most need now is not more effort or more strategy. You have proven you can work. What you need is discernment — a structured, honest process to separate what is genuinely still yours from what belonged to a previous season, and the permission to put down what isn\'t yours anymore without dismantling the people and structures that depend on you in the process.',
    ],
    nextSteps: [
      'Name specifically what you are responsible for that no longer fits who you are becoming',
      'Identify the commitments that are draining the energy needed for what comes next',
      'Begin the deliberate work of realignment before quiet erosion becomes a visible crisis',
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
    subtitle: 'The one with something formed and ready — that has not yet been given permission to come out.',
    body: [
      'The weight you are feeling is not mainly about what you are doing wrong. It is about what you have not yet done.',
      'There is something in you. You have sensed it for a long time — probably years. You may have named it privately, in journals or late-night conversations or in prayer. You have felt its outline clearly enough to know it is real. But you have not released it into the world. And the longer it stays inside, the heavier and more restless it becomes. This is not ordinary ambition. It is the specific pressure of something that has already formed and is waiting for permission to come out.',
      'The misalignment here is not between you and your work. Your current role may be functioning. Your responsibilities may be legitimate. What is not fine is that none of it is the main thing — and some part of you has always known that. The thing you are sitting with privately is more significant than what you are showing publicly, and that gap is costing you more than you can fully account for.',
      'Leaders in your position often make one of two mistakes. The first is to assume they need to find their voice — when in fact it has already formed and simply needs to be released. The second is to self-sabotage just before the release, pulling back at the moment it would become real and irreversible. Both mistakes come from the same root: the fear that the thing you have been given is too specific, too exposed, or too costly to actually bring out. It is not. What you most need now is a structured process to give language to what is already in you, and a community of formation that keeps you honest through the release.',
    ],
    nextSteps: [
      'Name the one thing you have been sitting with most consistently — and write it down',
      'Identify the specific reason it has not been released yet',
      'Take one irreversible step toward bringing it into the world',
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
    subtitle: 'The one between seasons — where something has ended and the next thing has not yet taken shape.',
    body: [
      'You are not lost. You are between.',
      'One season is ending — or has already ended, even if the structures around you haven\'t acknowledged it yet. The language that used to work feels slightly foreign now. The confidence that carried you into your last assignment is thinner than it used to be, not because you have failed but because it was confidence calibrated for something that is no longer the assignment. The next season has not taken shape. You can feel the open space where it should be, and that open space is uncomfortable in a way that\'s hard to explain to people who haven\'t been here.',
      'Leaders at the threshold almost always make one of two mistakes. The first is to force it — to grab the first thing that looks like clarity because the ambiguity is intolerable, and to build momentum toward it before it has actually been discerned. The second is to collapse — to tell yourself you are "waiting on God" when in fact you are avoiding the work the threshold requires. Waiting and avoiding feel identical from the inside. They produce very different results.',
      'What this season is actually for is formation. What is being built in you during the in-between is often more significant than what you will do when you come out the other side. The threshold is not a delay. It is preparation for an assignment that cannot be carried by the version of you that existed before it.',
      'What you most need now is not a strategic plan. You need a process for reading the season accurately — one that helps you distinguish what God is forming in you from what you are manufacturing out of impatience, and that prepares you to recognize the next assignment clearly when it arrives.',
    ],
    nextSteps: [
      'Resist the pressure to manufacture clarity before it has actually come',
      'Identify what this season is forming in you that the previous one could not have produced',
      'Build the listening practices that allow you to recognize the next assignment when it becomes visible',
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
    subtitle: 'The one walking in the right assignment, in the right season — and building accordingly.',
    body: [
      'What the assessment is showing is not common. Receive it properly.',
      'Most leaders spend the majority of their career chasing what you are currently living. You are, by the measures here, doing the right work in the right season — your yes and your no are both relatively clear, you are not building past the end of your assignment, and something in you genuinely believes the next eighteen months are worth building toward. That is a specific grace, and it deserves to be acknowledged rather than deflected.',
      'That said, alignment is not a resting place. It is a platform — and platforms have a useful life.',
      'The leaders who remain aligned across decades are not the ones who stop questioning. They are the ones who stay in active discernment even when nothing is visibly wrong, because they understand that the next transition rarely announces itself loudly. The cost of misalignment is obvious when it happens. The cost of remaining in a season past its end is subtler — it often looks like faithfulness from the outside while slowly narrowing what is possible on the inside. Aligned leaders get blindsided not because they stop working hard, but because they stop reading.',
      'What you most need now is not correction. It is company — peers who are building at the same level, and a formation environment that keeps you honest about what is actually working and what the next transition is likely to require of you before it arrives.',
    ],
    nextSteps: [
      'Receive the alignment — don\'t deflect or immediately look for what you\'re missing',
      'Identify the one area of your current season that is most likely to shift in the next twelve months',
      'Begin preparing for that transition now, before it arrives and forces the preparation',
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
