// pages/modules/competency.js
import Head from "next/head";
import ModuleTemplate from "../../components/ModuleTemplate";

const diagnostic = [
  { num: 1,  cat: "Skill & Discipline",        text: "I consistently develop my skills through intentional learning and practice." },
  { num: 2,  cat: "Skill & Discipline",        text: "I prepare thoroughly before major responsibilities.", ref: "2 Timothy 2:15" },
  { num: 3,  cat: "Skill & Discipline",        text: "I pursue excellence consistently, not just occasionally.", ref: "Colossians 3:23" },
  { num: 4,  cat: "Execution & Reliability",   text: "Others trust my competence under pressure.", ref: "Genesis 41:39–40" },
  { num: 5,  cat: "Execution & Reliability",   text: "I consistently follow through and deliver measurable outcomes." },
  { num: 6,  cat: "Execution & Reliability",   text: "I can manage complexity without becoming reactive or overwhelmed." },
  { num: 7,  cat: "Systems & Sustainability",  text: "I build systems that outlast emotional momentum.", ref: "Exodus 18:21–23" },
  { num: 8,  cat: "Systems & Sustainability",  text: "I delegate with clarity and defined expectations." },
  { num: 9,  cat: "Systems & Sustainability",  text: "I can organize people and process for sustainable outcomes." },
  { num: 10, cat: "Multiplication",            text: "I can train others in what I do.", ref: "2 Timothy 2:2" },
  { num: 11, cat: "Multiplication",            text: "I develop leaders with reproducible process, not just inspiration." },
  { num: 12, cat: "Multiplication",            text: "I create pathways where others grow in competency over time." },
];

const principles = [
  {
    num: 1,
    title: "Revelation Must Become Reality",
    ref: "Genesis 41:33",
    scripture: "\"Now therefore let Pharaoh select a discerning and wise man, and set him over the land of Egypt.\" — Genesis 41:33",
    paragraphs: [
      "Joseph did not only interpret Pharaoh's dream — he designed the solution. He moved from insight to strategy to administration to a sustainable system. Most leaders stop at the seeing. Champions build what they see.",
      "Revelation without execution creates excitement but not impact. Seeing the problem is not the same as solving it. Naming the vision is not the same as building it. The gap between what a leader sees and what a leader can build is the competency gap.",
      "Competency converts insight into strategy, and strategy into reality. The plans of the diligent lead to abundance — not the visions of the inspired.",
    ],
    prompts: [
      "What have you seen clearly — a vision, a solution, a direction — that you have not yet been able to build? What is the specific competency gap between the seeing and the building?",
    ],
  },
  {
    num: 2,
    title: "Excellence Is a Spiritual Standard",
    ref: "Colossians 3:23",
    scripture: "\"Whatever you do, work heartily, as for the Lord and not for men.\" — Colossians 3:23",
    paragraphs: [
      "Excellence is not perfectionism. It is wholehearted stewardship. It is treating preparation as worship and responsibility as sacred. To work heartily as for the Lord means the standard of your output is set by the character of your King, not the expectations of your audience.",
      "Faithfulness includes competence. Being trustworthy is not only character — it is capability. God does not entrust greater weight to leaders who handle small things carelessly.",
      "Excellence is built through daily discipline, not occasional intensity. The question is not 'Do I have anointing?' but 'Have I prepared to steward what the anointing opens?'",
    ],
    prompts: [
      "Where in your leadership are you relying on inspiration instead of preparation? What would change if you treated that area as worship?",
    ],
  },
  {
    num: 3,
    title: "Systems Sustain Momentum",
    ref: "Exodus 18:21",
    scripture: "\"Look for able men from all the people, men who fear God, who are trustworthy, and place such men over the people.\" — Exodus 18:21",
    paragraphs: [
      "Moses had a calling. He had connection with God. He had competency. But without systems, he was wearing down. The work was consuming the worker. Jethro's counsel introduced the principle that saves leaders from self-destruction: build what carries the weight so you don't carry it alone.",
      "Systems are not corporate. They are spiritual stewardship. They protect people, preserve momentum, and prevent burnout. Competent leaders build systems that clarify roles, strengthen delegation, increase capacity without increasing chaos, and enable growth without collapse.",
      "If everything depends on you, nothing will outlast you.",
    ],
    prompts: [
      "What area of your leadership currently depends entirely on you? What could you build that would carry that weight even in your absence?",
    ],
  },
  {
    num: 4,
    title: "Competency Must Be Transferable",
    ref: "2 Timothy 2:2",
    scripture: "\"What you have heard from me in the presence of many witnesses entrust to faithful men, who will be able to teach others also.\" — 2 Timothy 2:2",
    paragraphs: [
      "Competency is not only personal mastery. It is the ability to train others into capability. If you cannot teach what you do, it dies with you. Your leadership becomes a bottleneck instead of a bridge.",
      "Paul didn't just build churches — he built leaders who could build churches. He established governance, trained successors, and created reproducible pathways. The measure of your competency is not what you can do alone — it is what you can build in others.",
    ],
    prompts: [
      "What do you do well that no one else around you can do? Is that excellence — or a sign you haven't trained anyone?",
    ],
  },
  {
    num: 5,
    title: "Competency Governs What You Build",
    ref: "Philippians 3:13–14",
    scripture: "\"One thing I do: forgetting what lies behind and straining forward to what lies ahead, I press on toward the goal.\" — Philippians 3:13–14",
    paragraphs: [
      "Just as calling governs your decisions and connection governs your posture, competency governs what you build. The question is not 'Can I do this?' but 'Should I build this?'",
      "Leaders are often tempted to build what they're good at rather than what their calling demands. Skill can become a trap when it pulls you away from your assignment and toward your comfort zone.",
      "Competency as a filter asks: Am I building this because I'm gifted here, or because my calling demands it? Is this the highest use of my preparation in this season? Disciplined competency is not about doing everything well — it is about doing the right things with excellence.",
    ],
    prompts: [
      "What are you building right now because you're good at it — but it may not be what your calling demands this season?",
    ],
  },
  {
    num: 6,
    title: "Assessment Tools Accelerate Competency",
    ref: "Proverbs 20:5",
    addendum: true,
    scripture: "\"The purposes of a person's heart are deep waters, but one who has insight draws them out.\" — Proverbs 20:5",
    paragraphs: [
      "You cannot sharpen what you do not understand. Personality and strengths assessments are not corporate exercises — they are competency intelligence. They reveal how you are wired to operate, communicate, and lead so you build from awareness instead of assumption.",
      "StrengthsFinder (CliftonStrengths) identifies your top natural talents — the areas where investment produces the greatest return. Leaders who build from strength outperform leaders who spend their energy compensating for weakness. DISC reveals how you communicate, how you respond under pressure, and how you naturally lead others. Together, these tools give you a competency map.",
      "A leader who understands both builds with precision instead of guesswork. StrengthsFinder shows where to invest. DISC shows how to deliver.",
    ],
    prompts: [
      "Have you taken StrengthsFinder or DISC? If yes, what did they reveal — and are you building from those insights? If not, commit to completing at least one within 30 days.",
    ],
  },
  {
    num: 7,
    title: "Mentorship Is a Competency Strategy",
    ref: "2 Kings 2:9",
    addendum: true,
    scripture: "\"Elisha said, 'Please let there be a double portion of your spirit on me.'\" — 2 Kings 2:9",
    paragraphs: [
      "Courses give information. Proximity gives formation. The fastest way to close a competency gap is not another book — it is apprenticeship. Getting near someone who already carries what you need and learning by proximity, not just curriculum.",
      "Elisha did not attend Elijah's conference. He followed him. He served him. He watched how the man operated under pressure, how he made decisions, how he carried authority. Competency transferred through relationship, not instruction.",
      "Identify who carries the competency you lack. Get close. Serve. Observe. Ask questions. Proximity is the most underrated competency strategy in leadership.",
    ],
    prompts: [
      "Who carries the competency you currently lack? What would it take to get into proximity with them — not as a fan, but as a learner?",
    ],
  },
  {
    num: 8,
    title: "Feedback Loops Protect Against Blind Spots",
    ref: "Proverbs 27:6",
    addendum: true,
    scripture: "\"Faithful are the wounds of a friend; profuse are the kisses of an enemy.\" — Proverbs 27:6",
    paragraphs: [
      "Competent leaders do not assume they see everything. They build systems for receiving honest input — trusted advisors, post-project debriefs, and regular conversations that ask one question: What am I missing?",
      "Without feedback, blind spots compound quietly. What starts as a small gap in awareness becomes a pattern that erodes trust, frustrates teams, and limits influence. The leader who is too insulated to hear correction is too fragile to sustain authority.",
      "Build a feedback rhythm: identify two or three people who have permission to tell you the truth without penalty. Ask them regularly. Receive it without defensiveness.",
    ],
    prompts: [
      "Who in your life has permission to give you honest feedback — and when was the last time you asked for it?",
    ],
  },
  {
    num: 9,
    title: "Stewardship of Time Is a Competency",
    ref: "Ephesians 5:15–16",
    addendum: true,
    scripture: "\"Look carefully then how you walk, not as unwise but as wise, making the best use of the time.\" — Ephesians 5:15–16",
    paragraphs: [
      "You can be highly skilled and still ineffective if your time, energy, and priorities are misaligned. Time management is not administrative — it is a leadership competency that determines whether your best skills ever reach their highest use.",
      "Leaders who do not govern their time are governed by other people's urgency. Their best competencies are buried under reactive busyness. The gap between what they could build and what they actually build is a time stewardship gap.",
      "Your calendar reveals your actual priorities — not your stated ones. Competent leaders audit regularly: Does my schedule reflect my assignment, or has it been hijacked?",
    ],
    prompts: [
      "Look at last week's calendar. What percentage of your time was spent in your zone of highest competency? What consumed time that should have been delegated or eliminated?",
    ],
  },
];

const exemplar = {
  title: "Exemplar: Joseph — Structured Excellence",
  subtitle: "Joseph moved from revelation to strategy to administration to sustained national impact.",
  intro: "Joseph interpreted Pharaoh's dream — but he did not stop at revelation. He immediately moved from insight to strategy: 'Now therefore let Pharaoh select a discerning and wise man, and set him over the land of Egypt.' He designed a 20% storage model, established regional oversight, created administrative leadership, and built a long-term system that sustained a nation through seven years of famine.",
  intro2: "Revelation earned attention. Competency earned trust. Pharaoh said: 'Since God has shown you all this, there is none so discerning and wise as you are.' Joseph was not just anointed — he was prepared. He built what he saw, and what he built outlasted the crisis that demanded it.",
  pattern: "Revelation → Strategy → Systems → Sustained Impact",
  lessons: [
    "Most leaders stop at the seeing. Joseph built what he saw. That is the competency difference.",
    "Anointing opened the door. Competency kept it open and sustained the assignment.",
    "The system Joseph built did not require his daily presence to function. That is the mark of transferable competency.",
    "Excellence in crisis is the evidence of preparation in obscurity. Joseph was ready because he had been faithful with less.",
    "Competency and character grew together in Joseph — character in the prison, competency in administration. Both are required.",
  ],
  questions: [
    "Have you developed the skill to carry your calling — or are you relying on the dream alone?",
    "Are you building what outlasts emotion and momentum — systems and structures that function without your constant presence?",
    "Are you solving problems or only naming them? Where is your revelation waiting for execution?",
  ],
};

const stages = [
  {
    title: "Stage 1: Learning",
    description: "Building understanding, values, and core knowledge. Study, observe, practice, submit to correction. Competency grows through friction at this stage.",
    markers: ["High enthusiasm, inconsistent execution", "Learning through trial and error", "Beginning to identify core strengths and recurring gaps"],
  },
  {
    title: "Stage 2: Refining",
    description: "Repetition, feedback, and improvement. Competency grows through friction. Failure becomes teacher. You are learning what works, what doesn't, and why.",
    markers: ["Increasing ability to finish what you start", "Beginning to receive and act on feedback", "Growing reliability and follow-through"],
  },
  {
    title: "Stage 3: Building",
    description: "Creating systems, teams, and repeatable processes. Moving from personal skill to scalable excellence. You stop asking 'Can I do this?' and start asking 'Can I build this to last — and teach others to carry it?'",
    markers: ["Building systems that don't require constant personal oversight", "Mentoring others in specific competencies", "Known for reliable execution and delivery"],
  },
];

const commitmentPrompts = [
  { id: "primary_gap",          label: "My Primary Competency Gap (The single biggest skill gap right now)",             placeholder: "Name the specific skill or knowledge gap that is limiting your current assignment..." },
  { id: "development_plan",     label: "My 30-Day Development Plan",                                                     placeholder: "What will you do in the next 30 days to close the gap? Learning, mentorship, practice, system?" },
  { id: "excellence_standard",  label: "My Standard of Excellence (What does 'excellent' look like in my role?)",       placeholder: "Define what excellence looks like in your specific current assignment..." },
  { id: "transferability",      label: "What I Will Begin Teaching to Someone Else",                                     placeholder: "Name a specific competency you will intentionally teach and transfer. Who will you train?" },
  { id: "system_to_build",      label: "The System I Will Build That Outlasts Me",                                       placeholder: "Name one system, process, or rhythm that will reduce chaos and carry weight without you..." },
];

const revisitTriggers = [
  "When an assignment outgrows your current skill",
  "When you are relying on personality or anointing to cover a competency gap",
  "When a team member or project is failing because of your underdevelopment",
  "When you receive critical feedback about execution or follow-through",
  "When you feel called to a new level of responsibility",
  "Quarterly, as a discipline of stewardship",
];

const applicationQuestions = [
  "What skill gap will you begin closing this week — and what is the first specific action?",
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
  aiPromptContext: "This leader has completed Module 3: Competency of the 5C Leadership Blueprint. Analyze their responses focusing on: (1) the honesty and specificity of their identified competency gap, (2) the realism of their development plan, (3) their posture toward excellence — are they building for the long term or managing for the short term, and (4) their readiness to transfer competency to others.",
  contrastTable: {
    title: "Two Modes of Building",
    leftTitle: "Anointed Only",
    rightTitle: "Anointed & Prepared",
    rows: [
      ["Inspired but inconsistent", "Inspired and disciplined"],
      ["Visionary but chaotic", "Visionary and executable"],
      ["Gifted but undisciplined", "Gifted and reliable"],
      ["Starts strong, finishes weak", "Starts strong, sustains momentum"],
      ["Opens doors through favor", "Keeps doors open through credibility"],
      ["Creates excitement", "Creates lasting results"],
      ["Dependent on personal presence", "Builds what outlasts personality"],
      ["Leads by emotion", "Leads by wisdom and preparation"],
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
