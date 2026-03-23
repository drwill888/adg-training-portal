// pages/modules/introduction.js
import Head from "next/head";
import ModuleTemplate from "../../components/ModuleTemplate";

const diagnostic = [
  { num: 1,  cat: "Formation Posture",  text: "I am entering this course looking for formation, not just information." },
  { num: 2,  cat: "Formation Posture",  text: "I am willing to let this process expose areas in me that need to change." },
  { num: 3,  cat: "Formation Posture",  text: "I understand that real growth requires internal change, not just new knowledge." },
  { num: 4,  cat: "Self-Awareness",     text: "I can honestly assess my leadership strengths without defaulting to pride or deflection." },
  { num: 5,  cat: "Self-Awareness",     text: "I can honestly name at least one thing in my leadership that is not working right now." },
  { num: 6,  cat: "Self-Awareness",     text: "I am not entering this course to confirm what I already believe — I am open to correction." },
  { num: 7,  cat: "Commitment Level",   text: "I have made space in my schedule to process, reflect, and apply what I receive.", ref: "Luke 14:28" },
  { num: 8,  cat: "Commitment Level",   text: "I have a mentor, covenant partner, or community to process this material with." },
  { num: 9,  cat: "Commitment Level",   text: "I am ready to make specific, written commitments that will require accountability." },
  { num: 10, cat: "Baseline Clarity",   text: "I can articulate, at least broadly, what I believe I am called to build." },
  { num: 11, cat: "Baseline Clarity",   text: "I am entering this course with honesty, not performance." },
  { num: 12, cat: "Baseline Clarity",   text: "I am ready to begin." },
];

const principles = [
  {
    num: 1,
    title: "Formation, Not Information",
    ref: "Romans 12:2",
    scripture: "\"Do not be conformed to this world, but be transformed by the renewing of your mind.\" — Romans 12:2",
    paragraphs: [
      "Leadership development is not about adding content to an unchanged life. It is about the renovation of an interior world. Information fills the mind. Formation reshapes the whole person — the will, the emotions, the instincts, the character.",
      "The 5C Leadership Blueprint is not a leadership course in the conventional sense. It is a formation experience. It will ask you to be honest about what is broken, what is underdeveloped, and what is misaligned. That honesty is the prerequisite for everything that follows.",
      "Many leaders arrive at development experiences seeking confirmation of what they already believe about themselves. The leaders who leave changed are the ones who arrive willing to be challenged.",
    ],
    prompt: "What do you need to set down — what assumption, defense, or posture — to fully receive this formation process?",
  },
  {
    num: 2,
    title: "Architecture Before Acceleration",
    ref: "Psalm 127:1",
    scripture: "\"Unless the Lord builds the house, those who build it labor in vain.\" — Psalm 127:1",
    paragraphs: [
      "The five dimensions are not isolated skills. They are a progression. Calling establishes the foundation. Connection anchors the identity. Competency develops the capacity to build. Capacity determines how much the leader can sustain. Convergence is where it all aligns into lasting impact.",
      "Skip a dimension, and the structure weakens. Many leaders try to accelerate to impact without first building the architecture. That is how gifted leaders collapse under the weight of the assignment they were given.",
      "This course asks you to do the patient work of building correctly — even if it means returning to foundations you thought you had already laid.",
    ],
    prompt: "Which of the five dimensions do you most want to skip? That is likely the one that needs the most attention.",
  },
  {
    num: 3,
    title: "Calling Precedes Platform",
    ref: "Jeremiah 1:5",
    scripture: "\"Before I formed you in the womb I knew you, before you were born I set you apart.\" — Jeremiah 1:5",
    paragraphs: [
      "Leadership that begins with platform ends in exhaustion. Leadership that begins with calling builds legacy. This framework starts with calling because everything else must flow from that foundation. You cannot stay connected to the right people if you are unclear about your calling. You cannot develop the right competencies if you don't know what you're building toward.",
      "Calling is not self-expression. It is divine stewardship. And stewardship always begins with understanding what you have been entrusted with — before you spend a single resource building.",
    ],
    prompt: "In one sentence, write the clearest articulation of your calling you can right now. Don't overthink it — write what you know.",
  },
];

const exemplar = {
  title: "Exemplar: The Builder's Posture",
  subtitle: "Every lasting leader has submitted to the process of formation before stepping into lasting impact.",
  intro: "Nehemiah did not begin with a project. He began with a burden. Before the walls were assessed, before the resources were gathered, before the opposition was encountered — Nehemiah fasted, prayed, and positioned himself before God for four months. The formation preceded the assignment.",
  intro2: "This is the posture this course requires. Not passivity — Nehemiah was strategically active. But he was formed before he built. He knew who sent him, what he was carrying, and why it mattered before he laid a single stone.",
  lessons: [
    "Formation is never wasted time — it is the structural integrity of everything you build.",
    "The clearer your internal foundation, the more weight your external assignment can hold.",
    "Every lasting movement begins with someone willing to be broken open before being deployed.",
    "What you carry into this course will shape what you leave with. Bring your real self.",
  ],
  questions: [
    "What burden have you been carrying that brought you to this course? Name it specifically.",
    "What would it mean for you to be fully honest — not impressive — throughout this process?",
  ],
};

const stages = [
  {
    title: "Stage 1: Arrival",
    description: "You are new to intentional leadership formation. You have gifts and some clarity, but you lack an integrated framework for your development. This course gives you that framework.",
    markers: ["You lead reactively", "Your growth is inconsistent and self-directed", "You can't articulate your calling with precision"],
  },
  {
    title: "Stage 2: Awareness",
    description: "You are beginning to identify the gaps between who you are and who you are called to become. Formation begins with honest self-assessment — this stage is the threshold.",
    markers: ["You can name specific gaps in your leadership", "You are open to external input and accountability", "You are beginning to distinguish calling from assignment"],
  },
  {
    title: "Stage 3: Alignment",
    description: "You are actively working to align your inner life with your outer assignment. This is where the 5C Blueprint does its deepest work — correcting drift, building foundations, and integrating what has been fragmented.",
    markers: ["You are making deliberate changes based on new awareness", "Your decisions are increasingly filtered through your calling", "Your relationships are becoming more intentional"],
  },
  {
    title: "Stage 4: Anchored",
    description: "You lead from a settled internal foundation. Pressure no longer destabilizes you. You know who you are, whose you are, what you are building, and who you are building it with. This is the fruit of formation.",
    markers: ["You lead from identity, not approval", "Your decisions are consistent across seasons", "You are forming others — not just building output"],
  },
];

const commitmentPrompts = [
  { id: "purpose_for_course", label: "Why I Am Here (My Purpose for This Course)", placeholder: "Write why you are entering this formation process. Be specific about what you are seeking..." },
  { id: "honest_gap", label: "The Most Honest Gap I Am Aware Of", placeholder: "Name the area in your leadership you most need to address. Don't sanitize it..." },
  { id: "accountability_structure", label: "My Accountability Structure", placeholder: "Name the person or community who will process this course with you and hold you accountable..." },
  { id: "calling_first_draft", label: "My Calling — First Draft", placeholder: "In one or two sentences, write your clearest current articulation of your calling..." },
  { id: "course_commitment", label: "My Commitment to This Process", placeholder: "Write a declaration of how you will engage this formation experience — what you commit to bring..." },
];

const revisitTriggers = [
  "When you feel overwhelmed by a module and want to skip it",
  "When the process gets uncomfortable and you are tempted to disengage",
  "When you finish the course and want to identify next steps",
  "When you begin to form others through this framework",
];

const applicationQuestions = [
  "Which of the five dimensions do you most need right now? Why?",
  "Who needs to know you are going through this process so they can support and hold you accountable?",
];

// ─── TRAINING OBJECTIVES (NEW) ──────────────────────────────
// ModuleTemplate will render this section before the main content
const trainingObjectives = {
  headline: "What This Training Will Build In You",
  intro: "The 5C Leadership Blueprint is a formation experience built for leaders who are ready to move beyond surface-level development. Whether you are a Kingdom entrepreneur, pastor, emerging leader, or executive — this training meets you where you are and moves you toward where you are called to be.",
  outcomes: [
    {
      title: "Clarity of Calling",
      description: "Articulate your calling in one sentence. Know what you are designed to build — and what you are not. Stop drifting between opportunities and start operating from conviction.",
    },
    {
      title: "Deeper Relational Alignment",
      description: "Identify the relationships that sharpen you and the ones that drain you. Build a confirmation community that holds you accountable and calls out your grace.",
    },
    {
      title: "Sharpened Competency",
      description: "Close the gap between your gifting and your readiness. Develop the specific skills your assignment demands — with excellence, not just effort.",
    },
    {
      title: "Expanded Capacity",
      description: "Increase what you can sustain without burning out. Build character, emotional resilience, and the internal infrastructure to hold the weight of what God is entrusting to you.",
    },
    {
      title: "Convergence — Your Sweet Spot",
      description: "Align calling, connection, competency, and capacity into focused, lasting impact. Stop scattered activity. Start operating in the zone where everything you carry comes together.",
    },
  ],
  deliverables: [
    "Pre-and-post diagnostic assessments that show your measurable growth",
    "A personalized leadership summary for each module based on your responses",
    "A downloadable blueprint document you can revisit and build from for years",
    "Curated resources — articles, teaching, and tools — tied directly to each dimension",
    "Written commitments with built-in accountability prompts",
  ],
  closingStatement: "This is not another leadership course you complete and forget. This is the framework you carry forward — into your next assignment, your next season, and the leaders you are called to form after you.",
};

// ─── RESOURCES (NEW) ──────────────────────────────────────────
// ModuleTemplate will render this section at the end of the module
const resources = {
  sectionTitle: "Resources",
  book: {
    title: "Leaders for Life: Creating Champions Through the NOW Leadership Process",
    author: "Will Meier",
    url: "https://www.amazon.com/Leaders-Life-Creating-Champions-Leadership/dp/1939944473",
    description: "A practical handbook that introduces the 12C NOW Leadership model — integrating biblical perspective with contemporary case studies to create champions who solve complex problems.",
    coverImage: "/images/leaders-for-life-cover.jpg",
  },
  links: [
    {
      title: "Awakening Destiny Global",
      url: "https://awakeningdestiny.global",
      description: "Explore additional teaching, prophetic insight, and Kingdom leadership resources.",
    },
  ],
};

const config = {
  moduleNum: 0,
  title: "Introduction",
  subtitle: "Course Foundation",
  question: null,
  accent: "#C8A951",
  accentLight: "#FFF9E6",
  accentMid: "#FDD20D",
  activationText: "There are many leadership courses that teach skills. Few form leaders. The 5C Leadership Blueprint is not information transfer — it is leadership formation. It is designed to move you from potential to precision, from fragmented growth to integrated impact. Five interconnected dimensions. A progression. Each builds on the previous. What you are about to engage is not a program. It is a formation journey. The depth of your transformation depends entirely on the honesty you bring.",
  activationPrompts: [
    "What has been the greatest unaddressed gap in your leadership development up to this point?",
    "What would it mean for you to leave this course fundamentally different — not just more informed, but genuinely changed?",
  ],
  diagnostic,
  principles,
  exemplar,
  stages,
  commitmentPrompts,
  revisitTriggers,
  applicationQuestions,
  trainingObjectives,
  resources,
  // Renamed from "aiPromptContext" — this drives the personalized summary engine (not learner-facing)
  summaryPromptContext: "This is the Introduction module of the 5C Leadership Blueprint. The leader has completed their baseline self-assessment and written their initial commitments about why they are taking this course, their primary leadership gap, and their first draft of their calling. Focus your analysis on: (1) their formation readiness and posture, (2) the significance of the gap they named, (3) the quality of their calling articulation, and (4) what they most need to receive from this process.",
  contrastTable: {
    title: "Two Kinds of Development",
    leftTitle: "Information-Based Development",
    rightTitle: "Formation-Based Development",
    rows: [
      ["Adds content to an unchanged life", "Renovates the interior world"],
      ["Builds knowledge", "Builds character"],
      ["Produces confident leaders", "Produces anchored leaders"],
      ["Requires good teaching", "Requires honest engagement"],
      ["Result: knowing more", "Result: becoming more"],
      ["Can be done passively", "Requires full participation"],
      ["Ends when the course ends", "Deepens long after the course ends"],
    ],
  },
};

export default function IntroductionModule() {
  return (
    <>
      <Head><title>Introduction | 5C Leadership Blueprint</title></Head>
      <ModuleTemplate config={config} />
    </>
  );
}