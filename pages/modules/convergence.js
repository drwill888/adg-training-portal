// pages/modules/convergence.js
import Head from "next/head";
import ModuleTemplate from "../../components/ModuleTemplate";

const diagnostic = [
  { num: 1,  cat: "Alignment & Focus",     text: "I can articulate the specific zone where my calling, skill, and burden all intersect.", ref: "Proverbs 16:3" },
  { num: 2,  cat: "Alignment & Focus",     text: "I have narrowed my focus enough that I am deep somewhere, not just wide everywhere." },
  { num: 3,  cat: "Alignment & Focus",     text: "My daily work produces a sense of rightness, not just busyness.", ref: "Ecclesiastes 3:1" },
  { num: 4,  cat: "Releasing & Delegating",text: "I have released responsibilities that are no longer mine to carry." },
  { num: 5,  cat: "Releasing & Delegating",text: "I say no more than I say yes — and my no protects my best assignment." },
  { num: 6,  cat: "Releasing & Delegating",text: "The people around me are aligned with where I am going, not just where I've been." },
  { num: 7,  cat: "Legacy & Multiplication",text: "I am building something that will outlast my personality and platform.", ref: "John 12:24" },
  { num: 8,  cat: "Legacy & Multiplication",text: "My leadership produces multiplication, not just results." },
  { num: 9,  cat: "Legacy & Multiplication",text: "I am not chasing momentum — I am stewarding legacy." },
  { num: 10, cat: "Sustained Fruitfulness", text: "The fruit I'm producing is sustainable — it doesn't require me to overextend.", ref: "Luke 2:52" },
  { num: 11, cat: "Sustained Fruitfulness", text: "I operate with more peace than striving — because I am in my lane." },
  { num: 12, cat: "Sustained Fruitfulness", text: "I have clarity about the next chapter — what to build, who to build with, and what to release." },
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
      "The season of convergence is not about acquiring more. It is about synthesizing what has been built — calling, identity, skill, and character — into a unified operating system. Before the next chapter begins, the current one must be integrated.",
    ],
    prompt: "Which of the five dimensions feels most unintegrated right now? What would it mean to tend to that dimension before moving toward the next level of expansion?",
  },
  {
    num: 2,
    title: "Narrowing Increases Impact",
    ref: "Philippians 3:13–14",
    scripture: "\"One thing I do: forgetting what lies behind and straining forward to what lies ahead.\" — Philippians 3:13–14",
    paragraphs: [
      "Paul did not say 'many things I do.' He said one thing. The most impactful leaders are not the most diversified ones — they are the most focused ones. Breadth attracts attention. Depth creates transformation.",
      "Convergence requires the courage to say no to the many good things in order to say a full yes to the right thing. This is not limitation. It is precision. The laser and the light bulb use the same energy — but one cuts through steel and the other merely illuminates a room.",
      "Every no at this stage is an act of stewardship. You are protecting the assignment that only you can carry. The leader who refuses to narrow becomes the leader who produces a lot of activity and very little legacy.",
    ],
    prompt: "What are you currently carrying that is not yours to carry? What would you need to believe to release it without guilt?",
  },
  {
    num: 3,
    title: "Legacy Requires Releasing",
    ref: "John 12:24",
    scripture: "\"Unless a grain of wheat falls into the earth and dies, it remains alone; but if it dies, it bears much fruit.\" — John 12:24",
    paragraphs: [
      "Multiplication requires release. The seed must be planted to produce harvest. The leader who holds everything tightly produces a single impressive plant. The leader who plants intentionally produces a field.",
      "Releasing is one of the hardest leadership disciplines — because it feels like loss. Releasing a team member to greater responsibility feels like personal diminishment. Releasing a role you've built feels like identity loss. Releasing a ministry feels like abandonment.",
      "But the grain that stays in the hand remains alone. The leader whose greatest contribution is what they personally produced has not yet entered convergence. The leader whose greatest contribution is who they formed and released — that leader has begun to build legacy.",
    ],
    prompt: "What do you need to release in this season in order to multiply rather than protect? Name it specifically — person, role, responsibility, or title.",
  },
  {
    num: 4,
    title: "Stewardship Over Striving",
    ref: "Proverbs 16:3",
    scripture: "\"Commit your work to the LORD, and your plans will be established.\" — Proverbs 16:3",
    paragraphs: [
      "The Hebrew word for 'established' in this verse is kun — to be made firm, stable, to stand securely. Convergence stabilizes leadership influence. It produces rooted expansion — growth that does not fracture the leader, the culture, or the mission.",
      "Striving produces output but not sustainability. Stewardship produces fruit that remains. The converged leader is not working harder than everyone else — they are working in deeper alignment. The work feels different because it flows from design, not from demand.",
      "When you are in your sweet spot, what once exhausted you now energizes you. Not because the work is easier — the weight may be greater than ever — but because you are carrying what you were made to carry. That is the mark of convergence.",
    ],
    prompt: "What does your current assignment feel like — striving or stewarding? What would it mean to release the effort required by misalignment and enter the work you were built for?",
  },
];

const exemplar = {
  title: "Exemplar: Paul — From Damascus to Legacy",
  subtitle: "Paul's convergence came after years of preparation, and produced a legacy that outlasted every empire.",
  intro: "Paul before Damascus was Saul — brilliant, zealous, highly trained, deeply connected to the best networks of his era. But his gifts were pointing in the wrong direction. Convergence for Paul began with a collision, not a gradual transition. Everything he was — his Pharisaic training, his Roman citizenship, his Jewish lineage, his apostolic call — all of it converged into a singular, focused assignment: to carry the gospel to the Gentile world.",
  intro2: "What makes Paul's convergence remarkable is not the breadth of what he built — it is the depth of what he focused on. He did not attempt to stay in Jerusalem and build what was comfortable. He did not spread himself across every opportunity. He identified his lane with unusual clarity and ran with everything he had — 'one thing I do.' His letters, his churches, his disciples outlasted him by millennia. That is not accident. That is convergence.",
  lessons: [
    "Convergence often begins with disruption — not smooth transition. Sometimes God must interrupt before He can align.",
    "Your background, training, and experience are not abandoned in convergence — they are integrated into your lane.",
    "The depth of Paul's focus is what produced the breadth of his legacy. Narrow to the lane. Go deep.",
    "Converged leaders produce successors, not just followers. Timothy, Titus, Priscilla, Aquila — Paul multiplied himself intentionally.",
    "Legacy is not what you do when you have more time. It is what you build into others while you are in full capacity.",
  ],
  questions: [
    "What is your 'one thing' — the single focus around which all your other activity should organize?",
    "Who is your Timothy? Who are you intentionally forming to carry what you carry, and beyond?",
  ],
};

const stages = [
  {
    title: "Stage 1: Awareness (The Sweet Spot Emerges)",
    description: "You are beginning to see the intersection — the place where your calling, your grace, your burden, and your competency all point in the same direction. You may not be there yet, but you can see it. This stage is characterized by growing clarity and increasing frustration with misalignment.",
    markers: ["Awareness of what you are best at and most called to", "Restlessness in roles that don't align", "Beginning to name the sweet spot, even if you can't fully inhabit it yet"],
  },
  {
    title: "Stage 2: Alignment (The Pruning Season)",
    description: "You are actively releasing what is not yours to carry so you can fully inhabit what is. This stage requires courage — you are saying no to good things and yes to the right thing. It feels like loss. It is actually precision.",
    markers: ["Making difficult decisions to release responsibilities or roles", "Beginning to organize your time around your highest contribution", "Others may misunderstand your narrowing — and you hold to it anyway"],
  },
  {
    title: "Stage 3: Acceleration (The Fruitful Season)",
    description: "You are operating in your sweet spot. The work is still hard — but it is right. You have the right people around you, the right focus in front of you, and the right foundation under you. Fruit is coming and it is sustainable.",
    markers: ["High productivity without proportional increase in exhaustion", "The right doors opening without you forcing them", "Growing sense of rightness about the work you are doing"],
  },
  {
    title: "Stage 4: Legacy (The Multiplication Season)",
    description: "Your convergence has become transferable. You are not just building — you are building builders. The next generation is being formed by what you carry. This is the fullest expression of convergence: impact that outlasts your direct involvement.",
    markers: ["Leaders in your orbit are building with your DNA in their foundation", "What you've built continues without your daily presence", "You are known not just for what you've done but for who you've developed"],
  },
];

const commitmentPrompts = [
  { id: "sweet_spot_definition",   label: "My Sweet Spot (Where calling + grace + burden + skill all intersect)",       placeholder: "Describe the specific zone where all five dimensions align in you. Be precise..." },
  { id: "what_to_release",         label: "What I Am Releasing This Season",                                              placeholder: "Name the specific responsibilities, roles, or relationships that are no longer yours to hold..." },
  { id: "focus_declaration",       label: "My One Thing (The singular focus that governs everything else)",               placeholder: "Write the one thing — the primary assignment — around which you are organizing your leadership..." },
  { id: "legacy_investment",       label: "Who I Am Intentionally Building Into Legacy",                                  placeholder: "Name the specific people you are investing in for succession, multiplication, and generational impact..." },
  { id: "convergence_evidence",    label: "Evidence That I Am in My Sweet Spot",                                          placeholder: "Describe what it looks and feels like when you are operating in alignment. How do you know?" },
];

const revisitTriggers = [
  "When you notice yourself scattered across too many initiatives",
  "When the work has stopped producing the fruit it once did",
  "When you are busy but not fulfilled — productive but not at peace",
  "When a new opportunity arises that would pull you out of your lane",
  "When you are considering a significant season shift or leadership transition",
  "When the legacy questions become urgent — 'What am I building that outlasts me?'",
];

const applicationQuestions = [
  "Name one thing you will release this week in order to protect your sweet spot. Who will you tell?",
  "Who is the Timothy in your sphere — the person you are most intentionally investing in for multiplication?",
];

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
  aiPromptContext: "This leader has completed Module 5: Convergence — the capstone module of the 5C Leadership Blueprint. Analyze their responses focusing on: (1) how clearly they can articulate their sweet spot and whether it integrates all five dimensions, (2) the courage and specificity of what they are releasing, (3) the clarity of their 'one thing,' and (4) the intentionality of their legacy investment. This is the synthesis module — your analysis should draw together all five dimensions into a unified word for this leader.",
  contrastTable: {
    title: "Two Modes of Leadership at This Stage",
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
};

export default function ConvergenceModule() {
  return (
    <>
      <Head><title>Convergence | 5C Leadership Blueprint</title></Head>
      <ModuleTemplate config={config} />
    </>
  );
}
