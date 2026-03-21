// pages/modules/calling.js
import Head from "next/head";
import ModuleTemplate from "../../components/ModuleTemplate";

const diagnostic = [
  { num: 1,  cat: "Clarity & Conviction",   text: "I can articulate my calling in one clear sentence.", ref: "Jeremiah 1:5" },
  { num: 2,  cat: "Clarity & Conviction",   text: "I know the difference between my calling and my current assignment." },
  { num: 3,  cat: "Clarity & Conviction",   text: "My sense of purpose does not shift with circumstances or seasons." },
  { num: 4,  cat: "Burden & Stewardship",   text: "There is a recurring burden I carry that I cannot walk away from.", ref: "Nehemiah 1:3–4" },
  { num: 5,  cat: "Burden & Stewardship",   text: "I steward the grace on my life with intentionality, not passivity." },
  { num: 6,  cat: "Burden & Stewardship",   text: "I am building for the next twenty-five years, not just the next five months." },
  { num: 7,  cat: "Character Under Weight", text: "My private life can sustain the weight of my public assignment." },
  { num: 8,  cat: "Character Under Weight", text: "I am the same person in private that I am on platform." },
  { num: 9,  cat: "Character Under Weight", text: "I have been tested under pressure — and I did not compromise my integrity." },
  { num: 10, cat: "Decision Clarity",       text: "I regularly say no to opportunities that don't align with my calling.", ref: "Ephesians 4:1" },
  { num: 11, cat: "Decision Clarity",       text: "I can identify the difference between healthy pressure and destructive overload." },
  { num: 12, cat: "Decision Clarity",       text: "I see difficulty as development, not punishment.", ref: "James 1:2–4" },
];

const principles = [
  {
    num: 1,
    title: "Design Precedes Deployment",
    ref: "Jeremiah 1:5",
    scripture: "\"Before I formed you in the womb I knew you, before you were born I set you apart.\" — Jeremiah 1:5",
    paragraphs: [
      "God forms before He sends. Calling originates in God's intention, not human ambition. Leadership must be formed internally before it is expressed externally.",
      "If deployment precedes design clarity, instability follows. You cannot build what you have not been shaped to carry. Many leaders launch before they are formed — and they fracture under the weight of an assignment their character was never prepared to hold.",
      "This is why hiddenness is not punishment. It is preparation. The years of obscurity are not wasted years — they are forming years. God does not waste formation. He invests it.",
    ],
    prompt: "Where in your life have you been deployed before you were formed? What was the result?",
  },
  {
    num: 2,
    title: "Calling Governs Decisions",
    ref: "Philippians 3:13–14",
    scripture: "\"I press on toward the goal for the prize of the upward call of God.\" — Philippians 3:13–14",
    paragraphs: [
      "Calling is not just inspiration. It is your decision-making filter — your true north. Every yes and every no a leader gives should be traceable back to their calling.",
      "Good opportunities are everywhere. Aligned assignments are rare. The leader who cannot distinguish between the two will be busy but never fruitful. Calling creates the boundaries that protect your assignment.",
      "When calling is clear, it protects you from drift, distraction, and overcommitment. Calling filters: what to pursue and what to refuse, who to partner with and who to release, where to invest energy and where to withdraw it.",
    ],
    prompt: "Name one opportunity or commitment you are currently carrying that does not align with your calling. What would it cost to release it?",
  },
  {
    num: 3,
    title: "Calling Carries Burden",
    ref: "Nehemiah 1:3–4",
    scripture: "\"When I heard these things, I sat down and wept. For some days I mourned and fasted and prayed.\" — Nehemiah 1:3–4",
    paragraphs: [
      "Calling is not a career preference. It is a burden you cannot set down. Nehemiah heard about the broken walls and could not stop weeping. That is the mark of calling — a weight that won't leave you alone.",
      "The burden of calling is not depression. It is a holy dissatisfaction with the way things are, combined with a God-given conviction that you are part of the solution. It interrupts your comfort. It refuses to let you settle.",
      "If you can walk away from it, it's probably not your calling. If it keeps you up at night, if it won't let you rest until you act — pay attention. That's the burden of the Lord.",
    ],
    prompt: "What burden do you carry that you cannot walk away from? What breaks your heart consistently?",
  },
  {
    num: 4,
    title: "Obscurity Prepares Authority",
    ref: "Luke 16:10",
    scripture: "\"One who is faithful in a very little is also faithful in much.\" — Luke 16:10",
    paragraphs: [
      "Hidden faithfulness builds structural integrity. Public authority without private formation eventually collapses. What the world calls delay, God calls development. What you grow in the unseen sustains what becomes visible.",
      "The leader who refuses hidden seasons refuses formation. And the leader who is not formed cannot carry the weight of the assignment they are asking for. Obscurity is not the absence of calling — it is the incubator of it.",
      "Many leaders despise the hidden season because it is invisible to others. But the work God does in private is always preparation for what He releases in public. Don't rush what God is building in the dark.",
    ],
    prompt: "What hidden season are you in right now — or have you recently come through? What did it build in you?",
  },
];

const exemplar = {
  title: "Exemplar: Joseph's Journey",
  subtitle: "Joseph's calling was to stewardship and restoration — and he carried it through every impossible season.",
  intro: "Joseph had a calling to steward and restore — and he carried it through slavery, false accusation, imprisonment, and finally elevation. His calling remained constant while his assignments changed. He served faithfully in Potiphar's house, then in Pharaoh's prison, then as Egypt's chief administrator. Same calling. Different assignments. Same character under different weights.",
  lessons: [
    "Calling operates across multiple life domains — family, work, spiritual influence, character formation.",
    "Assignments test calling. They reveal whether your conviction is genuine or circumstantial.",
    "Faithfulness in hiddenness precedes elevation to visibility.",
    "Calling is not validated by applause — it is validated by faithfulness under pressure.",
    "The weight of the assignment increases when calling is clear. Joseph needed thirteen years of formation to carry what the dream showed him.",
  ],
  questions: [
    "Where are you currently serving in a hidden or misunderstood season? How is your calling being tested?",
    "What would it mean to be as faithful in your current assignment as you would be at the level of visibility you are asking for?",
  ],
};

const stages = [
  {
    title: "Stage 1: Whisper (Stirring)",
    description: "You sense something — a burden, a direction — but it is not yet formed into words. It is intuitive, exploratory. You may not even speak it aloud. This is the beginning of calling awareness.",
    markers: ["Recurring internal convictions you cannot explain", "Emotional pull toward specific problems or people groups", "Restlessness in roles that don't align with your design"],
  },
  {
    title: "Stage 2: Word (Formation)",
    description: "You can now articulate it. You can name it. You can explain it to others. It becomes a conviction with language attached. You begin to build your vocabulary for who you are and what you carry.",
    markers: ["Ability to articulate calling in one or two sentences", "Increasingly clear about what does and doesn't fit", "Beginning to make decisions based on calling alignment"],
  },
  {
    title: "Stage 3: Confirmation (Community)",
    description: "Others begin to see it in you. Mentors affirm it. Community confirms it. Your calling becomes a shared reality, not just a personal conviction. This external confirmation provides stability and accountability.",
    markers: ["Mentors and leaders consistently speak to the same grace on your life", "Community validates what you sense about yourself", "Your calling is no longer private — it is spoken over and into"],
  },
  {
    title: "Stage 4: Release (Deployment)",
    description: "You are sent. You step into your assignment. Your calling moves from preparation to active expression. You are no longer just forming — you are building. And what you build is traceable back to who you were designed to become.",
    markers: ["Assignments clearly flow from your identified calling", "Decisions become easier — the filter is operative", "You are building fruit that outlasts your presence"],
  },
];

const commitmentPrompts = [
  { id: "macro_calling",        label: "My Macro Calling (What am I called to for a lifetime?)",          placeholder: "Define the landscape of who you were designed to become — not a role, but an identity and grace..." },
  { id: "current_assignment",   label: "My Current Assignment (What is God asking of me right now?)",      placeholder: "Define your specific role, responsibility, or season. How does it connect to your macro calling?..." },
  { id: "confirmation_voices",  label: "My Confirmation Community (Who confirms this calling with me?)",   placeholder: "Name the mentors, leaders, or voices who have consistently affirmed your calling..." },
  { id: "burden_statement",     label: "What I Cannot Walk Away From",                                     placeholder: "Name the burden, the weight, the recurring dissatisfaction that won't let you rest..." },
  { id: "calling_filter",       label: "How My Calling Filters My Decisions",                              placeholder: "Describe how your calling shapes your yes and your no. What does it protect you from?" },
];

const revisitTriggers = [
  "When you receive a new opportunity or assignment",
  "When you feel pressure to compromise your values or direction",
  "When your circumstances shift — season change, role change, relocation",
  "When you lose clarity or begin to drift",
  "When you complete a major project or assignment",
  "When you receive feedback that doesn't align with your sense of calling",
];

const applicationQuestions = [
  "What is one decision you are facing right now that your calling must settle?",
  "Who do you need to invite into your calling confirmation process?",
];

const config = {
  moduleNum: 1,
  title: "Calling",
  subtitle: "Potential (Purpose)",
  question: "Who was I designed to become?",
  accent: "#C8A951",
  accentLight: "#FFF9E6",
  accentMid: "#FDD20D",
  activationText: "Your calling is not what you do. It is who you were created to be — the landscape of your potential, your purpose, your design. It encompasses your identity, your grace, your burden, and your stewardship. This module will help you articulate your calling with clarity and anchor it in conviction. Not everyone will understand it. Not every opportunity will fit it. But you will know it — and that certainty becomes the anchor for every decision you make.",
  activationPrompts: [
    "If no one was watching and no one would applaud, what would you still feel compelled to build, protect, or restore?",
    "When have you felt most aligned — most fully yourself in your purpose — even briefly? Describe that moment.",
  ],
  diagnostic,
  principles,
  exemplar,
  stages,
  commitmentPrompts,
  revisitTriggers,
  applicationQuestions,
  aiPromptContext: "This leader has completed Module 1: Calling of the 5C Leadership Blueprint. Analyze their responses with focus on: (1) the clarity and precision of their calling articulation, (2) the nature of the burden they carry and whether it is genuinely theirs, (3) the health of their confirmation community, and (4) how well their calling is functioning as a decision filter. Be direct, apostolic in tone, and specific to what they wrote.",
  contrastTable: {
    title: "Calling vs. Assignment",
    leftTitle: "Calling — The Macro",
    rightTitle: "Assignment — The Micro",
    rows: [
      ["The ecosystem", "The expression"],
      ["Lifetime scope", "Season-specific"],
      ["Who you are designed to become", "What you are responsible for now"],
      ["Deepens over time", "Shifts with seasons and context"],
      ["Your identity and grace", "Your current role and mandate"],
      ["The root system", "The fruit in this season"],
      ["Cannot be lost", "Has a start and end date"],
    ],
  },
};

export default function CallingModule() {
  return (
    <>
      <Head><title>Calling | 5C Leadership Blueprint</title></Head>
      <ModuleTemplate config={config} />
    </>
  );
}
