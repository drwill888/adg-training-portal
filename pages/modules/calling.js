// pages/modules/calling.js
import Head from "next/head";
import ModuleTemplate from "../../components/ModuleTemplate";

const diagnostic = [
  { num: 1,  cat: "Clarity & Articulation",  text: "I can clearly articulate my calling in one sentence.", ref: "Jeremiah 1:5" },
  { num: 2,  cat: "Clarity & Articulation",  text: "My daily decisions align with my calling." },
  { num: 3,  cat: "Clarity & Articulation",  text: "I know what I am not called to do." },
  { num: 4,  cat: "Alignment & Grace",       text: "My current responsibilities reflect my design.", ref: "Romans 12:6" },
  { num: 5,  cat: "Alignment & Grace",       text: "I experience grace, not constant striving, in my assignment." },
  { num: 6,  cat: "Alignment & Grace",       text: "I feel burdened but not crushed by responsibility." },
  { num: 7,  cat: "Confirmation & Community",text: "Mature leaders have affirmed my calling.", ref: "1 Timothy 4:14" },
  { num: 8,  cat: "Confirmation & Community",text: "I seek counsel in major decisions." },
  { num: 9,  cat: "Confirmation & Community",text: "I receive correction without defensiveness." },
  { num: 10, cat: "Conviction & Endurance",  text: "Opposition does not easily shake my calling.", ref: "Ephesians 4:1" },
  { num: 11, cat: "Conviction & Endurance",  text: "I would remain faithful even without recognition." },
  { num: 12, cat: "Conviction & Endurance",  text: "I feel accountable before God for my calling.", ref: "Luke 12:48" },
];

const principles = [
  {
    num: 1, title: "Design Precedes Deployment", ref: "Jeremiah 1:5",
    scripture: "\"Before I formed you in the womb I knew you, before you were born I set you apart.\" — Jeremiah 1:5",
    paragraphs: [
      "God forms before He sends. Calling originates in God's intention, not human ambition. Leadership must be formed internally before it is expressed externally.",
      "If deployment precedes design clarity, instability follows. You cannot build what you have not been shaped to carry. Many leaders launch before they are formed — and they fracture under the weight of an assignment their character was never prepared to hold.",
      "This is why hiddenness is not punishment. It is preparation. The years of obscurity are not wasted years — they are forming years. God does not waste formation. He invests it.",
    ],
    prompts: ["Where in your life have you been deployed before you were formed? What was the result?"],
  },
  {
    num: 2, title: "Calling Governs Decisions", ref: "Philippians 3:13-14",
    scripture: "\"One thing I do: forgetting what lies behind and straining forward to what lies ahead, I press on toward the goal for the prize of the upward call of God.\" — Philippians 3:13-14",
    paragraphs: [
      "Calling is not just inspiration. It is your decision-making filter — your true north. Every yes and every no a leader gives should be traceable back to their calling.",
      "Good opportunities are everywhere. Aligned assignments are rare. The leader who cannot distinguish between the two will be busy but never fruitful. Calling creates the boundaries that protect your assignment.",
      "When calling is clear, it protects you from drift, distraction, and overcommitment. Without this filter, leaders say yes to everything and wonder why nothing bears fruit.",
    ],
    prompts: [
      "Name one opportunity or commitment you are currently carrying that does not align with your calling. What would it cost to release it?",
      "What decision are you facing right now that becomes clearer when filtered through your calling?",
    ],
  },
  {
    num: 3, title: "Obscurity Prepares Authority", ref: "Luke 16:10",
    scripture: "\"One who is faithful in a very little is also faithful in much.\" — Luke 16:10",
    paragraphs: [
      "Hidden faithfulness builds structural integrity. Public authority without private formation eventually collapses. What the world calls delay, God calls development.",
      "The leader who refuses hidden seasons refuses formation. And the leader who is not formed cannot carry the weight of the assignment they are asking for. Obscurity is not the absence of calling — it is the incubator of it.",
      "What grows in the unseen sustains what becomes visible. The roots grow deepest when the tree is not yet visible. And it is the depth of the root system that determines what the tree can carry when the storm comes.",
    ],
    prompts: ["What hidden season are you in right now — or have you recently come through? What did it build in you?"],
  },
  {
    num: 4, title: "Calling Unfolds Progressively", ref: "Proverbs 4:18",
    scripture: "\"The path of the righteous is like the light of dawn, which shines brighter and brighter until full day.\" — Proverbs 4:18",
    paragraphs: [
      "God often reveals the next step — not the entire path. Abraham was told 'Go to the land I will show you' before he was told where. Obedience preceded clarity.",
      "Impatience distorts calling. Faithfulness matures it. The leader who demands the full blueprint before taking the first step will never move.",
      "Calling is not a revelation you receive once and then execute on. It is a progressive disclosure — unfolding across seasons, sharpening through obedience, deepening through formation.",
    ],
    prompts: ["What is the next step of obedience you already know you need to take — even without the full picture?"],
  },
  {
    num: 5, title: "Calling Must Be Confirmed in Community", ref: "1 Timothy 4:14",
    scripture: "\"Do not neglect the gift you have, which was given you by prophecy when the council of elders laid their hands on you.\" — 1 Timothy 4:14",
    paragraphs: [
      "In Scripture, calling is never purely private. It is recognized and affirmed by mature leaders. Samuel needed Eli. Timothy needed Paul. Community confirmation strengthens courage and protects from self-appointment.",
      "Uninterpreted revelation can lead to distortion. Calling matures through mentorship, accountability, and the witness of those who see your grace before you fully trust it yourself.",
      "A calling that no one else can see or confirm may be ambition dressed in spiritual language. The leader who refuses external input on their calling is not confident — they are isolated.",
    ],
    prompts: ["Who has confirmed your calling? If no one has, who do you trust enough to speak into it?"],
  },
  {
    num: 6, title: "Calling Is Confirmed Through Prophetic Presbytery", ref: "Acts 13:3", addendum: true,
    scripture: "\"Then after fasting and praying they laid their hands on them and sent them off.\" — Acts 13:3",
    paragraphs: [
      "Calling is not self-appointed. It is recognized, confirmed, and activated through the laying on of hands by mature, healthy prophetic leadership. Samuel anointed David. The elders at Antioch set apart Paul and Barnabas. The presbytery confirmed Timothy. This was not ceremony — it was spiritual governance.",
      "The laying on of hands confirms what God has already spoken internally, activates what may be dormant, provides spiritual covering under recognized authority, and creates a public record the leader can return to when doubt or opposition rises.",
      "Not every voice qualifies. The presbytery must be mature — not just gifted. Healthy — not just anointed. Prophetic accuracy without character integrity produces manipulation, not confirmation.",
    ],
    prompts: ["Has your calling been confirmed through the laying on of hands by mature, healthy prophetic leadership? If yes, what was spoken — and have you returned to it? If not, what is preventing you from seeking confirmation?"],
  },
  {
    num: 7, title: "Prophecy Is a Weapon — War With It", ref: "1 Timothy 1:18", addendum: true,
    scripture: "\"This charge I entrust to you, Timothy, my child, in accordance with the prophecies previously made about you, that by them you may wage the good warfare.\" — 1 Timothy 1:18",
    paragraphs: [
      "Prophetic words are not souvenirs. They are weapons. Paul did not tell Timothy to frame his prophecies. He told him to fight with them.",
      "Every leader will face seasons where the calling feels distant and the assignment feels impossible. In those moments, you do not fight from your own confidence. You fight from what was confirmed over you. You return to what was spoken and declare it in the face of opposition.",
      "Waging war with your prophecies means: writing them down and reviewing them regularly, declaring them in seasons of opposition, making decisions that align with what was spoken, and refusing to let discouragement nullify what was confirmed. A confirmed word that is not fought for becomes a forgotten word — and a forgotten word produces a forfeited assignment.",
    ],
    prompts: [
      "What prophetic words have been spoken over your life and calling? Are you waging war with them — or have they been filed away and forgotten?",
      "What specific prophecy do you need to pick back up and fight with this season?",
    ],
  },
];

const exemplar = {
  title: "Exemplar: Jeremiah — The Reluctant Prophet",
  subtitle: "Jeremiah's calling preceded his confidence. His story teaches us that calling does not eliminate pain — it produces endurance.",
  intro: "Jeremiah was called before birth, consecrated before formation, appointed before maturity. And his first response was insecurity: 'Ah, Lord GOD! Behold, I do not know how to speak, for I am only a youth.' God did not comfort the insecurity. He confronted it: 'Do not say I am only a youth — for to all to whom I send you, you shall go.'",
  intro2: "Jeremiah faced resistance, rejection, isolation, and misunderstanding. He was mocked. He was imprisoned. He wanted to quit. Later he confessed he felt deceived, that the assignment had cost him everything. Yet he could not silence the call: 'If I say I will not mention Him, there is in my heart as it were a burning fire shut up in my bones.' Calling did not eliminate pain. It produced endurance.",
  pattern: "Design → Resistance → Refinement → Endurance",
  lessons: [
    "Calling does not eliminate insecurity — it confronts it and transforms it.",
    "Opposition is not disqualification. It is part of the pattern.",
    "The burning fire that you cannot silence is the mark of genuine calling.",
    "Calling that costs nothing is worth nothing. Jeremiah's calling cost him everything — and he still could not walk away.",
    "Hiddenness, rejection, and delay do not cancel calling. They authenticate it.",
  ],
  questions: [
    "What insecurity are you using as an excuse for delayed obedience?",
    "Have you mistaken opposition for disqualification? Where does the fire in you keep burning regardless of the cost?",
    "Is there a burden you feel compelled to carry that you cannot silence — even when everything around you says quit?",
  ],
};

const stages = [
  {
    title: "Stage 1: Encounter (Revelation Without Clarity)",
    description: "You sense something — a burden, a direction — but it is not yet formed into words. It is intuitive, exploratory. You may not even speak it aloud. The first encounter with calling awareness.",
    markers: ["Recurring internal convictions you cannot explain", "Emotional pull toward specific problems or people groups", "Restlessness in roles that don't align with your design"],
  },
  {
    title: "Stage 2: Interpretation (Mentorship & Confirmation)",
    description: "You can now articulate it. Mentorship and confirmation help you interpret what God is saying. Others help you see your grace before you fully trust it yourself. It becomes a conviction with language attached.",
    markers: ["Ability to articulate calling in one or two sentences", "Increasingly clear about what does and doesn't fit", "Mentors confirming what you are sensing"],
  },
  {
    title: "Stage 3: Stewardship (Faithful Obedience Over Time)",
    description: "You are actively stewarding the calling through seasons. Same calling, different assignments. You stop asking 'What excites me?' and start asking 'What must I steward?' Faithfulness is maturing the calling.",
    markers: ["Decisions consistently filtered through calling", "Assignments clearly traceable back to your design", "You are building fruit that outlasts your presence"],
  },
];

const commitmentPrompts = [
  { id: "calling_thesis",        label: "My Calling Thesis (One sentence — not a paragraph)",                           placeholder: "Write your calling in one sentence that captures what you are designed and graced to do..." },
  { id: "current_assignment",    label: "My Current Assignment (The micro — right now)",                                 placeholder: "Name the specific expression of your calling in this season. What are you responsible for now?" },
  { id: "formative_moments",     label: "Three Formative Moments That Shaped My Calling",                               placeholder: "Moment 1:\n\nMoment 2:\n\nMoment 3:" },
  { id: "recurring_burden",      label: "My Recurring Burden (What I cannot walk away from)",                           placeholder: "What breaks your heart consistently? What injustice, gap, or dysfunction do you feel compelled to address?" },
  { id: "next_obedience",        label: "My Next Step of Obedience (Not the five-year plan — the next step)",           placeholder: "What one action will you take within 7 days to walk worthy of this calling?" },
  { id: "accountability_person", label: "My Accountability (Who will hold you to this?)",                               placeholder: "Name the mentor, peer, or trusted leader who can hold you accountable to what you wrote today..." },
];

const revisitTriggers = [
  "When a major season ends or begins",
  "When an assignment completes and a new one emerges",
  "When confusion or drift returns",
  "When promotion or expansion demands deeper clarity",
  "When you receive a prophetic word that confirms or redirects",
  "Quarterly, as a discipline of stewardship",
];

const applicationQuestions = [
  "Where is my calling currently expressed — and where am I under-functioning or playing small?",
  "What responsibility have I been delaying that aligns directly with my calling?",
];

var scriptures = {
  intro: "These are your anchor texts on calling. Return to them when clarity fades, when opposition rises, when purpose feels costly, and when you need to remember that God designs, confirms, and matures what He calls.",
  verses: [
    { ref: "Jeremiah 1:5", text: "Called before birth. Designed with intention." },
    { ref: "Jeremiah 1:4-10", text: "God appoints before full maturity and puts His word into yielded vessels." },
    { ref: "Romans 8:28-30", text: "All things work together for those called according to His purpose." },
    { ref: "Romans 11:29", text: "The gifts and calling of God are irrevocable." },
    { ref: "2 Timothy 1:9", text: "Called with a holy calling, not according to works." },
    { ref: "Ephesians 1:18", text: "The eyes of your heart enlightened to know the hope of His calling." },
    { ref: "Ephesians 4:1", text: "Walk worthy of the calling." },
    { ref: "Ephesians 4:13", text: "Calling is meant to mature us into fullness in Christ." },
    { ref: "Philippians 3:13-14", text: "Press on toward the goal for the prize of the upward call." },
    { ref: "Hebrews 3:1", text: "Consider Jesus, the apostle of our confession." },
    { ref: "Hebrews 12:1", text: "Calling is not merely received; it must be run with endurance." },
    { ref: "1 Corinthians 1:26-29", text: "God chose the foolish to shame the wise." },
    { ref: "1 Peter 4:10", text: "As each has received a gift, use it to serve one another." },
    { ref: "1 Peter 1:23", text: "Calling unfolds from incorruptible seed planted by the Word of God." },
    { ref: "1 Samuel 3:4, 8-9, 19", text: "Calling is often recognized through listening, response, and faithful stewardship." },
    { ref: "Jeremiah 20:7-9", text: "True calling carries an inner fire that cannot be silenced." },
    { ref: "1 Timothy 4:14", text: "Calling is often affirmed through prophetic and communal confirmation." },
    { ref: "Proverbs 11:14", text: "Calling is strengthened and protected through wise counsel." },
    { ref: "Luke 16:10", text: "Hidden faithfulness prepares leaders for greater trust." },
    { ref: "Matthew 25:21", text: "Stewardship in small things precedes enlarged responsibility." },
    { ref: "Proverbs 4:18", text: "Calling often unfolds progressively, not all at once." },
  ],
};

var config = {
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
  diagnostic: diagnostic,
  principles: principles,
  exemplar: exemplar,
  stages: stages,
  commitmentPrompts: commitmentPrompts,
  revisitTriggers: revisitTriggers,
  applicationQuestions: applicationQuestions,
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
  scriptures: scriptures,

  activationPrayer: {
    theme: 'Identity & Purpose',
    context: 'When you need clarity and grounding in who you are',
    scriptures: [
      { ref: 'Ephesians 1:17-18', text: '...that the God of our Lord Jesus Christ, the Father of glory, may give to you the spirit of wisdom and revelation in the knowledge of Him, the eyes of your understanding being enlightened; that you may know what is the hope of His calling...' },
      { ref: 'Romans 8:30', text: 'Whom He predestined, these He also called...' },
      { ref: '2 Timothy 1:9', text: 'Who has saved us and called us with a holy calling...' },
    ],
    prayer: `Father of glory, I ask that You release the spirit of wisdom and revelation in the knowledge of You.\n\nEnlighten the eyes of my understanding.\n\nLet me see clearly the hope of Your calling. Anchor me in identity, not performance.\n\nI break agreement with confusion, striving, and misalignment. I decree that clarity is established and purpose is awakened.\n\nI will know who I am. I will walk in the hope of my calling.`,
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
