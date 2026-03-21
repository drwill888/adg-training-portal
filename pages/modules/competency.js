// pages/modules/competency.js
import Head from "next/head";
import ModuleTemplate from "../../components/ModuleTemplate";

const diagnostic = [
  { num: 1,  cat: "Skill Stewardship",    text: "I can identify specific skill gaps in my current assignment.", ref: "2 Timothy 2:15" },
  { num: 2,  cat: "Skill Stewardship",    text: "I have a deliberate plan to develop my competency for this season." },
  { num: 3,  cat: "Skill Stewardship",    text: "My preparation level matches the weight of my current assignment.", ref: "Proverbs 22:29" },
  { num: 4,  cat: "Excellence Posture",   text: "I treat every responsibility — large or small — with the same standard of excellence.", ref: "Colossians 3:23" },
  { num: 5,  cat: "Excellence Posture",   text: "I am not relying on anointing alone — I am doing the work of preparation." },
  { num: 6,  cat: "Excellence Posture",   text: "I regularly seek feedback to identify blind spots in my competency." },
  { num: 7,  cat: "Execution Discipline", text: "I consistently follow through on what I start — I don't just inspire, I complete.", ref: "Luke 16:10" },
  { num: 8,  cat: "Execution Discipline", text: "I can build systems and structures that outlast my personal presence.", ref: "Genesis 41:33" },
  { num: 9,  cat: "Execution Discipline", text: "My team trusts my follow-through because I consistently deliver." },
  { num: 10, cat: "Learning Posture",     text: "I am growing in the specific skills this season demands." },
  { num: 11, cat: "Learning Posture",     text: "I know the difference between what I do well and what my assignment specifically needs." },
  { num: 12, cat: "Learning Posture",     text: "I complete tasks with quality, not just speed — and I finish what I begin." },
];

const principles = [
  {
    num: 1,
    title: "Revelation Must Become Reality",
    ref: "Genesis 41:33–36",
    scripture: "\"Now therefore let Pharaoh select a discerning and wise man, and set him over the land of Egypt.\" — Genesis 41:33",
    paragraphs: [
      "Joseph did not only interpret Pharaoh's dream — he designed the solution. He moved from insight to strategy to administration to a sustainable system. Most leaders stop at the seeing. Champions build what they see.",
      "Revelation without execution creates excitement but not impact. Seeing the problem is not the same as solving it. Naming the vision is not the same as building it. The gap between what a leader sees and what a leader can build is the competency gap.",
      "The plans of the diligent lead to abundance. The key word is plans — not wishes, not impressions, not inspiration. Plans. Competency converts insight into strategy, and strategy into reality.",
    ],
    prompt: "What have you seen clearly — a vision, a solution, a direction — that you have not yet been able to build? What is the specific competency gap between the seeing and the building?",
  },
  {
    num: 2,
    title: "Excellence is a Spiritual Standard",
    ref: "Colossians 3:23",
    scripture: "\"Whatever you do, work heartily, as for the Lord and not for men.\" — Colossians 3:23",
    paragraphs: [
      "Excellence is not perfectionism. It is wholehearted stewardship. It is treating preparation as worship and responsibility as sacred. To work heartily as for the Lord means that the standard of your output is set by the character of your King, not the expectations of your audience.",
      "Faithfulness includes competence. Being trustworthy is not only character — it is capability. God does not entrust greater weight to leaders who handle small things carelessly. Excellence in the small is the qualification for weight in the large.",
      "Excellence is built through daily discipline, not occasional intensity. The question is not 'Do I have anointing?' but 'Have I prepared to steward what the anointing opens?'",
    ],
    prompt: "Where in your current assignment are you settling for adequate when excellent is possible? What would it require to close that gap?",
  },
  {
    num: 3,
    title: "Skill Opens Doors — Character Keeps Them",
    ref: "Proverbs 22:29",
    scripture: "\"Do you see a man skillful in his work? He will stand before kings.\" — Proverbs 22:29",
    paragraphs: [
      "Competency creates access. The skilled leader gets the room. But character is what keeps the seat. The history of gifted leaders who opened significant doors and then lost them through character failure is long and sobering.",
      "Anointing opens the door. Competency keeps it open. Character determines how long you stay. The leader who develops skill without simultaneous character development is building an opportunity they cannot sustain.",
      "Competency and character must grow together. Every development investment must be matched by a formation investment. A leader who becomes more skilled without becoming more refined is becoming more dangerous, not more effective.",
    ],
    prompt: "Where in your current assignment is your competency ahead of your character? Where is your character ahead of your competency?",
  },
  {
    num: 4,
    title: "Competency Builds What Outlasts You",
    ref: "Luke 16:10",
    scripture: "\"One who is faithful in a very little is also faithful in much.\" — Luke 16:10",
    paragraphs: [
      "The purpose of competency is not personal advancement. It is generational stewardship. The most competent leaders are not those who make themselves indispensable — they are those who build what doesn't require them to be present for it to function.",
      "Competency includes the ability to transfer what you know. If you can do it but cannot teach it, you have skill but not yet leadership competency. The systems, processes, and structures you build determine what outlasts your presence.",
      "Faithful in the little is the qualification for much — not because God is testing minimum thresholds, but because how you handle small weight reveals whether your character is strong enough to carry greater weight.",
    ],
    prompt: "What do you do exceptionally well that you have not yet transferred to the next generation of leaders around you? What is holding you back from teaching what you know?",
  },
];

const exemplar = {
  title: "Exemplar: Daniel — Excellence in Exile",
  subtitle: "Daniel demonstrated that Kingdom competency is not diminished by hostile circumstances — it is amplified by them.",
  intro: "Daniel was taken from his homeland, educated in a foreign system, and placed in an environment hostile to his values. He had every reason to perform minimally. Instead, he resolved to excel. He studied, disciplined himself, and prepared with the same rigor he would have given to service in Jerusalem. His competency in Babylon was an act of worship.",
  intro2: "Daniel's preparation gave him access that his anointing alone would never have opened. Yes, God gave him supernatural insight — but Daniel also studied and prepared. The supernatural and the natural worked together. He was 'ten times better' than his peers — not just because of divine favor, but because of disciplined preparation and wholehearted stewardship.",
  lessons: [
    "Excellence in hostile environments is not compromise — it is testimony. Your competency is a form of witness.",
    "Anointing and preparation are not in competition. The leader who has both is the most dangerous force for the Kingdom.",
    "Resolving to excel before the circumstances demand it is the mark of a Kingdom-minded builder.",
    "Competency that is tested and proven under pressure carries more authority than competency that has only functioned under ideal conditions.",
  ],
  questions: [
    "Where in your current assignment are you in a 'Babylon' context — a challenging environment that is demanding more of your competency than you anticipated?",
    "What does 'ten times better' look like in your specific assignment right now?",
  ],
};

const stages = [
  {
    title: "Stage 1: Discovery",
    description: "You are identifying your natural gifts and beginning to understand what you do well. This stage is about inventory — not yet deployment. You are learning what you carry and what you don't.",
    markers: ["High enthusiasm, inconsistent execution", "Learning through trial and error", "Beginning to identify core strengths and recurring gaps"],
  },
  {
    title: "Stage 2: Development",
    description: "You are deliberately developing specific skills aligned with your calling and current assignment. You have moved from natural gifting to disciplined growth. You are building the gap-closing plan.",
    markers: ["Actively pursuing skill development", "Increasing ability to finish what you start", "Beginning to receive and act on feedback"],
  },
  {
    title: "Stage 3: Deployment",
    description: "Your competency is producing consistent results. You can be trusted with significant responsibility because your delivery is predictable. You have developed both the skill and the systems to sustain it.",
    markers: ["Consistent execution and follow-through", "Building systems that don't require your constant presence", "Mentoring others in the competencies you have developed"],
  },
  {
    title: "Stage 4: Mastery",
    description: "Your competency is deep enough that you can transfer it. You are building leaders who are as skilled as you are — or more skilled in specific areas. Mastery is not about personal performance anymore; it is about multiplication.",
    markers: ["Known for a specific area of excellence beyond your organization", "What you build continues to function without your daily oversight", "You are developing the next generation of competent builders"],
  },
];

const commitmentPrompts = [
  { id: "primary_gap",         label: "My Primary Competency Gap (What specific skill must I develop this season?)", placeholder: "Name the specific skill or knowledge gap that is limiting your current assignment..." },
  { id: "development_plan",    label: "My 90-Day Development Plan",                                                  placeholder: "What specific steps will you take in the next 90 days to close your primary gap?" },
  { id: "excellence_standard", label: "My Standard of Excellence (What does 'excellent' look like in my role?)",    placeholder: "Define what excellence looks like in your specific current assignment..." },
  { id: "systems_to_build",    label: "What I Will Build That Outlasts My Presence",                                 placeholder: "Name one system, process, or structure you will build that doesn't require you to run it..." },
  { id: "transfer_commitment", label: "What I Will Transfer to the Next Generation",                                 placeholder: "Name a specific competency you will intentionally teach and transfer to someone in your sphere..." },
];

const revisitTriggers = [
  "When you receive a new assignment with unfamiliar skill requirements",
  "When you notice yourself relying on personality or anointing to cover a competency gap",
  "When a team member or project is failing because of your underdevelopment in a specific area",
  "When you receive critical feedback about execution or follow-through",
  "When you feel called to a new level of responsibility",
  "When what worked last season stops producing results",
];

const applicationQuestions = [
  "Name one skill gap you will begin closing this week. What is the first specific action?",
  "Who in your circle is more competent than you in an area you need? Will you invite them to teach you?",
];

const config = {
  moduleNum: 3,
  title: "Competency",
  subtitle: "Excellence (Credibility)",
  question: "Can I carry what I'm called to build?",
  accent: "#0172BC",
  accentLight: "#E8F3FF",
  accentMid: "#00AEEF",
  activationText: "You can know your purpose and be secure in your identity — and still lack the skill, discipline, and preparation to build what God has assigned. Anointing does not replace preparation. Passion does not replace process. Vision does not replace skill. Competency is what makes a leader dependable — not just inspired. It is the stewardship of responsibility. The credibility that can be trusted when the weight increases.",
  activationPrompts: [
    "Where in your leadership do you know you have the calling but lack the competency to execute it? Where is the gap between what you see and what you can build?",
    "When was the last time you relied on passion or anointing alone — and it wasn't enough? What happened?",
  ],
  diagnostic,
  principles,
  exemplar,
  stages,
  commitmentPrompts,
  revisitTriggers,
  applicationQuestions,
  aiPromptContext: "This leader has completed Module 3: Competency of the 5C Leadership Blueprint. Analyze their responses focusing on: (1) the honesty and specificity of their identified competency gap, (2) the realism of their development plan, (3) their posture toward excellence — are they building for the long term or managing for the short term, and (4) their readiness to transfer competency to others. Be direct, challenging where needed, and specific to what they wrote.",
  contrastTable: {
    title: "Two Modes of Building",
    leftTitle: "Anointed Only",
    rightTitle: "Anointed & Prepared",
    rows: [
      ["Inspired but inconsistent", "Inspired and disciplined"],
      ["Visionary but chaotic", "Visionary and executable"],
      ["Gifted but undisciplined", "Gifted and reliable"],
      ["Starts strong, finishes weak", "Starts strong, sustains momentum"],
      ["Leads by emotion", "Leads by wisdom and preparation"],
      ["Opens doors through favor", "Keeps doors open through credibility"],
      ["Creates excitement", "Creates lasting results"],
      ["Dependent on personal presence", "Builds what outlasts personality"],
    ],
  },
};

export default function CompetencyModule() {
  return (
    <>
      <Head><title>Competency | 5C Leadership Blueprint</title></Head>
      <ModuleTemplate config={config} />
    </>
  );
}
