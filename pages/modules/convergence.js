// pages/modules/convergence.js
import Head from "next/head";
import ModuleTemplate from "../../components/ModuleTemplate";

const diagnostic = [
  { num: 1,  cat: "Alignment & Focus",      text: "I am clear about my primary assignment in this season.", ref: "Philippians 3:13–14" },
  { num: 2,  cat: "Alignment & Focus",      text: "I have eliminated responsibilities outside my grace." },
  { num: 3,  cat: "Alignment & Focus",      text: "My schedule reflects my priorities, not other people's demands." },
  { num: 4,  cat: "Integration & Stability",text: "My internal world matches my external responsibility.", ref: "Psalm 1:3" },
  { num: 5,  cat: "Integration & Stability",text: "I am not overextended beyond my capacity." },
  { num: 6,  cat: "Integration & Stability",text: "Growth feels aligned, not chaotic." },
  { num: 7,  cat: "Favor & Peace",          text: "I experience ruling peace in leadership decisions.", ref: "Colossians 3:15" },
  { num: 8,  cat: "Favor & Peace",          text: "Others trust my consistency and leadership steadiness." },
  { num: 9,  cat: "Favor & Peace",          text: "I see increasing favor relationally and spiritually.", ref: "Luke 2:52" },
  { num: 10, cat: "Legacy & Succession",    text: "I am intentionally preparing successors.", ref: "1 Chronicles 28:9–10" },
  { num: 11, cat: "Legacy & Succession",    text: "I am building something that will outlast me.", ref: "Psalm 145:4" },
  { num: 12, cat: "Legacy & Succession",    text: "I am stewarding influence, not chasing visibility.", ref: "Luke 12:48" },
];

const principles = [
  {
    num: 1,
    title: "Integration Precedes Expansion",
    ref: "Ecclesiastes 3:1",
    scripture: "\"For everything there is a season, and a time for every matter under heaven.\" — Ecclesiastes 3:1",
    paragraphs: [
      "Convergence does not begin with acceleration. It begins with integration. If the internal world is divided — calling unclear, connection unstable, competency inconsistent, capacity fragile — then expansion becomes dangerous.",
      "This is why some opportunities feel 'too big' when they arrive early: not because the opportunity is wrong, but because the leader is not yet integrated. Integrated leaders expand without fragmentation. Unintegrated leaders expand and break.",
      "Convergence is the season when God brings alignment across the whole life. It is rooted expansion — growth that does not fracture. The planted leader does not panic under pressure and does not expand faster than their foundations.",
    ],
    prompts: [
      "Across the 5Cs, where are you most integrated? Where is the weakest link? What would integration look like in that area before you expand further?",
    ],
  },
  {
    num: 2,
    title: "Focus Protects Impact",
    ref: "Philippians 3:13–14",
    scripture: "\"One thing I do: forgetting what lies behind and straining forward to what lies ahead, I press on toward the goal.\" — Philippians 3:13–14",
    paragraphs: [
      "Paul did not say 'these seventeen things I attempt.' He said 'one thing I do.' At the convergence stage, the greatest threat is not lack of opportunity. It is too much opportunity.",
      "Convergence is not doing more. It is doing the right things with precision — because the season demands stewardship, not experimentation. Scattered leaders leak energy. Focused leaders concentrate force.",
      "Focus protects your energy from diffusion, your team from confusion, your legacy from dilution, and your peace from erosion.",
    ],
    prompts: [
      "What are you doing right now that someone else should be carrying? What would you do with the energy you freed up?",
      "What one thing must you protect as non-negotiable in this season?",
    ],
  },
  {
    num: 3,
    title: "Strategic Release Expands Influence",
    ref: "John 12:24",
    scripture: "\"Unless a grain of wheat falls into the earth and dies, it remains alone; but if it dies, it bears much fruit.\" — John 12:24",
    paragraphs: [
      "Convergence requires pruning. To enter the sweet spot, leaders must release what once served them but now competes with their assignment. Old roles. Old patterns. Old attachments. Old expectations. Lower-level responsibilities that prevent higher-level stewardship.",
      "Many leaders fail to converge because they refuse to die to what is familiar. But in Scripture, death precedes multiplication. Strategic release is not loss. It is alignment.",
      "Release also requires adaptability. The converged leader does not cling to methods that worked last season. They adapt their expression without abandoning their assignment. The assignment stays. The approach evolves.",
    ],
    prompts: [
      "What role, responsibility, relationship, or pattern do you need to release to step more fully into your sweet spot?",
      "Where do you need to adapt your approach without abandoning your assignment?",
    ],
  },
  {
    num: 4,
    title: "Succession Must Be Intentional",
    ref: "1 Chronicles 28:9–10",
    scripture: "\"Know the God of your father and serve Him with a whole heart and with a willing mind. Be strong and do it.\" — 1 Chronicles 28:9–10",
    paragraphs: [
      "David did not merely build a kingdom. He prepared a successor. He transferred wisdom. He funded the vision. He created infrastructure for the next generation to build on.",
      "Convergence shifts leadership from personal growth to generational stewardship. From personal success to organizational sustainability. From personal authority to distributed strength. Succession is not an afterthought — it is a convergence responsibility.",
      "The converged leader asks: 'What will this look like when I am no longer in the room?' Greater influence carries greater generational accountability. The measure is not what you built — it is what you passed on.",
    ],
    prompts: [
      "Who are you intentionally preparing to carry what you've built? If no one — why not?",
      "What would your leadership legacy look like if you left tomorrow? Does that satisfy you?",
    ],
  },
  {
    num: 5,
    title: "Convergence Governs Your Legacy",
    ref: "Colossians 3:15",
    scripture: "\"Let the peace of Christ rule in your hearts.\" — Colossians 3:15",
    paragraphs: [
      "Just as calling governs decisions, connection governs posture, competency governs what you build, and capacity governs what you carry — convergence governs your legacy. The question is no longer 'What can I do?' but 'What must I protect, build, and multiply?'",
      "At the convergence level, peace becomes the governing compass. Not passivity. Not laziness. Ruling peace — the internal witness that confirms you are operating in your lane of grace.",
      "Convergence as a filter asks: Am I protecting my sweet spot or allowing drift? Is this expanding my impact or diluting it? Am I building for legacy or chasing for visibility? Do I feel peace or restlessness about this direction?",
    ],
    prompts: [
      "Where do you feel ruling peace in your leadership right now? Where do you feel restlessness? What does the contrast reveal?",
    ],
  },
  {
    num: 6,
    title: "Convergence Can Be Lost",
    ref: "Galatians 5:7",
    addendum: true,
    scripture: "\"You were running well. Who hindered you from obeying the truth?\" — Galatians 5:7",
    paragraphs: [
      "Convergence is not a permanent arrival. It can be entered — and it can be exited. Leaders who assume alignment is automatic become vulnerable to the very drift they thought they had outgrown.",
      "Success scatters what alignment built. A new opportunity flatters you back into overextension. A compliment pulls you outside your lane. And slowly — without a single dramatic failure — you drift from your sweet spot into scattered busyness again.",
      "Drift is not dramatic. It is incremental. It does not announce itself. It accumulates. The leader who does not actively defend convergence will lose it — not to crisis, but to distraction dressed as opportunity.",
    ],
    prompts: [
      "Have you ever been in alignment and drifted out of it? What pulled you away — and what would it take to recognize the early signs of drift before it becomes a pattern?",
    ],
  },
  {
    num: 7,
    title: "Legacy Requires Documentation",
    ref: "Habakkuk 2:2",
    addendum: true,
    scripture: "\"Write the vision; make it plain on tablets, so he may run who reads it.\" — Habakkuk 2:2",
    paragraphs: [
      "David did not whisper the temple vision to Solomon over dinner. He gave him the plans — the measurements, the materials, the organizational structure, the division of labor, the funding. He documented everything so that what God revealed to one generation could be built by the next.",
      "Your values, your processes, your reasoning, your decisions — if they live only in your head, they die with your presence. Inspiration without documentation fades within a generation. A blueprint lasts.",
      "Documentation is not bureaucracy. It is stewardship. It is the discipline of translating what you carry internally into something others can build from externally. The leader who documents creates a bridge. The leader who does not creates a gap the next generation must rebuild from scratch.",
    ],
    prompts: [
      "What do you carry — systems, processes, values, lessons, frameworks — that currently lives only in your head? What would you need to document so the next generation can build from where you finished, not from where you started?",
    ],
  },
  {
    num: 8,
    title: "Guard Against Isolation at the Top",
    ref: "Hebrews 10:24–25",
    addendum: true,
    scripture: "\"Let us consider how to stir one another up to love and good works, not neglecting to meet together.\" — Hebrews 10:24–25",
    paragraphs: [
      "As leaders converge and narrow, a quiet danger emerges: isolation. The higher you go, the fewer people understand your weight. Convergence without community becomes a prison of competence. The leader operates with clarity and precision — but without anyone close enough to challenge, encourage, or correct them.",
      "Decisions go unchecked. Burdens go unshared. Blind spots go unnamed. And the very focus that produced alignment begins to produce loneliness.",
      "This is not a call to widen your circle. It is a call to deepen it. At the convergence level, you do not need more people. You need the right people — two or three who carry enough weight themselves to understand yours, who have earned the right to speak honestly, and who will not be intimidated by your authority.",
    ],
    prompts: [
      "Do you have two or three people who understand the weight of what you carry — and have permission to challenge you? If not, who could fill that role, and what is preventing you from inviting them in?",
    ],
  },
  {
    num: 9,
    title: "Stewardship of Resources Is a Convergence Responsibility",
    ref: "1 Chronicles 29:2",
    addendum: true,
    scripture: "\"With great pains I have provided for the house of the LORD 100,000 talents of gold, a million talents of silver, and bronze and iron beyond weighing.\" — 1 Chronicles 29:2",
    paragraphs: [
      "David did not just prepare Solomon with vision, wisdom, and organizational structure. He funded the assignment. He stewarded resources across his entire reign so the next generation could build without begging.",
      "At the convergence level, resource stewardship becomes legacy infrastructure. This includes financial resources, relational capital, intellectual property, organizational assets, and institutional knowledge. How you steward what has been entrusted to you determines whether the next generation builds or starts over.",
      "Resource stewardship at this level asks different questions: Not 'Can I afford this?' but 'Am I positioning resources so this outlasts me?' Not 'Is this profitable?' but 'Is this generationally sustainable?' The converged leader who consumes everything they produce leaves the next generation an empty table. The leader who stewards with intention leaves an inheritance.",
    ],
    prompts: [
      "Are you stewarding your resources — financial, relational, organizational — in a way that equips the next generation to build? What would need to change so that what you leave behind is an inheritance, not an empty table?",
    ],
  },
];

const exemplar = {
  title: "Exemplar: David — Warrior to King",
  subtitle: "David's life arc is the full 5C journey, culminating in convergence through integration, consolidation, and legacy transfer.",
  intro: "David's convergence was not merely sitting on a throne. When he was finally made king over all Israel, the tribes said 'We are your bone and flesh.' He unified a divided nation. He consolidated governance. He established covenant culture. He stabilized what had been fractured for years. That is convergence: not personal success, but the alignment of one person's formation with the needs of a generation.",
  intro2: "And when convergence was complete, David turned to legacy: 'Know the God of your father and serve Him with a whole heart.' He prepared Solomon. He funded the temple. He transferred vision. He built himself out of the center and invested everything into what would outlast him. David did not just build a kingdom — he prepared a builder.",
  pattern: "Calling → Wilderness → Integration → Consolidation → Legacy Transfer",
  lessons: [
    "Convergence is not arrival — it is the season where everything comes together and the leader decides to build for the next generation.",
    "Unified influence is the fruit of integrated formation. David could not have unified Israel if he had not been unified internally.",
    "Legacy is not what you leave behind as monument — it is who you send forward as multiplier.",
    "The converged leader builds themselves out of the center. The goal is to become unnecessary — not because you quit, but because you reproduced.",
    "Governing from peace is the evidence of convergence. David, at his best, shepherded with upright heart and skillful hand.",
  ],
  questions: [
    "Does your leadership currently unify or divide? What does that reveal about your convergence?",
    "Are you building yourself out of the center — or are you building yourself into the center?",
    "Are you governing from peace or reacting from pressure? What is the evidence in your last 30 days?",
  ],
};

const stages = [
  {
    title: "Stage 1: Clarification",
    description: "Focus sharpens. Distractions are identified and removed. The leader defines the assignment with precision. Pruning begins. You stop asking 'What else could I do?' and start asking 'What must I protect?'",
    markers: ["Awareness of what you are best at and most called to", "Restlessness in roles that don't align", "Beginning to name the sweet spot, even if you can't fully inhabit it yet"],
  },
  {
    title: "Stage 2: Consolidation",
    description: "Systems strengthen. Culture stabilizes. Team matures. Capacity and competency reinforce so expansion does not fracture. Succession begins.",
    markers: ["Making difficult decisions to release responsibilities or roles", "Organizing your time around your highest contribution", "Beginning to prepare the next generation intentionally"],
  },
  {
    title: "Stage 3: Activation",
    description: "The leader steps fully into the weight of assignment. Leading with clarity, peace, and increasing favor with God and man. Fruitful and at peace — because you are doing what you were built to do.",
    markers: ["High productivity without proportional increase in exhaustion", "The right doors opening without forcing them", "Growing sense of rightness about the work you are doing"],
  },
];

const commitmentPrompts = [
  { id: "sweet_spot",         label: "My Sweet Spot Statement (Where all 5Cs align in me)",                          placeholder: "One sentence capturing your convergence zone — where calling, grace, skill, character, and timing all intersect..." },
  { id: "convergence_now",    label: "My Current Convergence Expression (Where alignment is producing fruit now)",   placeholder: "Name the specific assignment, focus, or initiative that is your highest contribution right now..." },
  { id: "release_list",       label: "My Release List (Three things I will delegate, prune, or release)",            placeholder: "Release 1:\n\nRelease 2:\n\nRelease 3:" },
  { id: "succession_target",  label: "My Succession Target (Who am I preparing to carry what I've built?)",          placeholder: "Name them. Describe your plan for transfer and what you are entrusting to them..." },
  { id: "legacy_declaration", label: "My Legacy Declaration (What will still be standing when I am gone?)",          placeholder: "Write what you are building that will outlast you — people, systems, culture, mission..." },
];

const revisitTriggers = [
  "When new opportunities tempt you to scatter",
  "When busyness replaces fruitfulness",
  "When peace erodes and restlessness returns",
  "When succession stalls or gets postponed",
  "When your schedule no longer reflects your priorities",
  "Quarterly, as a discipline of alignment",
];

const applicationQuestions = [
  "Name one thing you will release this week in order to protect your sweet spot. Who will you tell?",
  "Who is the person you will most intentionally invest in for multiplication this season?",
];

const resources = {
  sectionTitle: "Additional Resources",
  blogs: [
    {
      title: "Convergence: Discover Your Sweet Spot — The 5C's",
      url: "https://awakeningdestiny.global/5-steps-to-your-sweet-spot-convergence/",
      description: "Where all five dimensions align into your zone of maximum impact.",
    },
    {
      title: "2 Keys to Unlocking Your Books of Destiny",
      url: "https://awakeningdestiny.global/2-keys-to-unlocking-your-books-of-destiny/",
      description: "Worship and intercession as the keys to accessing your divine purpose and heavenly scrolls.",
    },
    {
      title: "Are You Laboring in the Right Space?",
      url: "https://awakeningdestiny.global/are-you-laboring-in-the-right-space/",
      description: "How to discern whether your current assignment matches your design — or is draining it.",
    },
    {
      title: "7 Steps to Moving in the Glory Realms",
      url: "https://awakeningdestiny.global/7-steps-to-moving-in-the-glory-realms/",
      description: "A blueprint for the Ekklesia to operate in the supernatural realms of God's presence and authority.",
    },
  ],
  links: [
    { title: "Awakening Destiny Global", url: "https://awakeningdestiny.global", description: "Explore additional teaching, prophetic insight, and Kingdom leadership resources." },
  ],
};

var scriptures = {
  intro: "These are your anchor texts on convergence. Return to them when drift threatens, when opportunities multiply, and when you need wisdom to align timing, focus, peace, stewardship, succession, and lasting impact.",
  verses: [
    { ref: "Luke 2:52", text: "Integrated growth — wisdom, stature, favor with God and man." },
    { ref: "Matthew 6:10", text: "Convergence is heaven's will expressed through aligned lives on earth." },
    { ref: "Proverbs 16:3", text: "Commit your work to the LORD and your plans will be established." },
    { ref: "Ecclesiastes 3:1", text: "For everything there is a season." },
    { ref: "Philippians 3:13-14", text: "One thing I do — I press on toward the goal." },
    { ref: "John 12:24", text: "Unless a grain of wheat falls and dies, it remains alone." },
    { ref: "Psalm 1:3", text: "Like a tree planted by streams of water." },
    { ref: "1 Chronicles 28:9-10", text: "Know the God of your father. Be strong and do it." },
    { ref: "Colossians 3:15", text: "Let the peace of Christ rule in your hearts." },
    { ref: "Luke 12:48", text: "To whom much is given, much is required." },
    { ref: "1 Corinthians 9:22", text: "I have become all things to all people." },
    { ref: "1 John 4:16", text: "Whoever abides in love abides in God." },
    { ref: "2 Samuel 5:1-5", text: "Convergence is the coming together of identity, authority, and assignment." },
    { ref: "Psalm 78:70-72", text: "Convergence joins upright heart with skillful hands." },
  ],
};
 
const config = {
  moduleNum: 5,
  title: "Convergence",
  subtitle: "Sweet Spot (Impact)",
  question: "Am I operating in my sweet spot?",
  accent: "#EE3124",
  accentLight: "#FFF0EF",
  accentMid: "#F47722",
  activationText: "You have built the foundation. Calling established purpose. Connection anchored identity. Competency sharpened credibility. Capacity deepened character. Now we arrive at the integration point — where everything converges. Convergence is not a destination. It is the alignment that makes everything else sustainable. It is where design, intimacy, skill, and endurance all align into one unified operating system. Many leaders grow. Few leaders integrate. This module is about the difference.",
  activationPrompts: [
    "If you could only do one thing for the rest of your leadership life — one assignment, one focus, one contribution — what would it be? And are you doing it now?",
    "What are you currently carrying that you know is no longer yours to hold? What would it cost to release it?",
  ],
  diagnostic,
  principles,
  exemplar,
  stages,
  commitmentPrompts,
  revisitTriggers,
  applicationQuestions,
  aiPromptContext: "This leader has completed Module 5: Convergence — the capstone module of the 5C Leadership Blueprint. Analyze their responses focusing on: (1) how clearly they can articulate their sweet spot and whether it integrates all five dimensions, (2) the courage and specificity of what they are releasing, (3) the clarity of their primary assignment, and (4) the intentionality of their legacy investment. Draw together all five dimensions into a unified word for this leader.",
  resources, scriputures: scriptures,
  learningObjectives: [
    "Identify whether you are currently operating in your sweet spot — or scattered across too many lanes that dilute your impact.",
    "Map the intersection of your calling, connection, competency, and capacity to define the specific zone where your greatest contribution lives.",
    "Recognize the difference between convergence and comfort — and understand that operating in your sweet spot does not mean operating without resistance.",
    "Develop a filter for evaluating new opportunities based on alignment, not just availability — so that every yes serves your convergence and every no protects it.",
    "Build a succession and stewardship plan that ensures your convergence produces legacy — not just personal impact.",
  ],
  keyTakeaways: [
    "Convergence is where calling, connection, competency, and capacity align into focused, sustainable impact. It is not a destination you arrive at — it is a zone you operate from.",
    "Convergence is not permanent. It can be entered and it can be lost. Success scatters what alignment built. The leader who does not actively defend convergence will drift back into overextension.",
    "The sweet spot is not where everything is easy. It is where everything you carry comes together with maximum fruitfulness and minimum waste. Resistance may still be present — but you are operating from design, not default.",
    "Busy is not fruitful. Scattered is not faithful. Convergence demands the discipline to say no to good things in order to protect the right things.",
    "Legacy is the fruit of convergence stewarded over time. What you build at the intersection of your design will outlast what you build from ambition alone.",
  ],
  contrastTable: {
    title: "Two Modes at This Stage",
    leftTitle: "Scattered Leader",
    rightTitle: "Converged Leader",
    rows: [
      ["Overextended across too many things", "Focused on what only they can carry"],
      ["Says yes to every good opportunity", "Says no to protect the best assignment"],
      ["Driven by demand", "Governed by design"],
      ["Energy diffused, impact thin", "Energy concentrated, impact deep"],
      ["Holds everything tightly", "Releases freely to multiply"],
      ["Busy but unfulfilled", "Fruitful and at peace"],
      ["Chases momentum", "Stewards legacy"],
      ["Builds what attracts attention", "Builds what outlasts personality"],
    ],
  },

  activationPrayer: {
    theme: 'Fullness & Integration',
    context: 'When everything must come together into maturity and fruit',
    scriptures: [
      { ref: 'Ephesians 3:18-19', text: '...that you may be able to comprehend... and to know the love of Christ... that you may be filled with all the fullness of God.' },
      { ref: 'Romans 8:28', text: 'All things work together for good...' },
    ],
    prayer: `Father, bring me into the fullness of Christ. Let me comprehend the depth, width, and height of Your love.\n\nTake every part of my life — every season, every experience — and bring it into alignment. Let nothing be wasted.\n\nWhere there has been fragmentation, bring integration. Where there has been confusion, bring clarity.\n\nFill me with all Your fullness. Let my life reflect maturity, wholeness, and fruitfulness.\n\nI decree that everything is coming together according to Your purpose.`,
  },
};

export default function ConvergenceModule() {
  return (
    <>
      <Head>
        <title>Convergence | 5C Leadership Blueprint</title>
        <meta name="description" content="Module 5: Find your sweet spot where calling, connection, competency, and capacity align for maximum impact." />
        <meta property="og:title" content="Convergence | 5C Leadership Blueprint" />
        <meta property="og:description" content="Module 5: Find your sweet spot where calling, connection, competency, and capacity align for maximum impact." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://5cblueprint.awakeningdestiny.global/modules/convergence" />
        <meta property="og:site_name" content="5C Leadership Blueprint" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Convergence | 5C Leadership Blueprint" />
        <meta name="twitter:description" content="Module 5: Find your sweet spot where calling, connection, competency, and capacity align for maximum impact." />
      </Head>
      <ModuleTemplate config={config} />
    </>
  );
}