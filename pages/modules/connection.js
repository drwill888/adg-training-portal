// pages/modules/connection.js
import Head from "next/head";
import ModuleTemplate from "../../components/ModuleTemplate";

const diagnostic = [
  { num: 1,  cat: "Sonship & Identity",      text: "I lead from a settled sense of who I am, not from what I produce.", ref: "Matthew 3:17" },
  { num: 2,  cat: "Sonship & Identity",      text: "I do not need applause to feel confident in my assignment." },
  { num: 3,  cat: "Sonship & Identity",      text: "My identity remains stable when I am criticized or overlooked." },
  { num: 4,  cat: "Discipline & Formation",  text: "I receive correction without defensiveness.", ref: "Hebrews 12:6" },
  { num: 5,  cat: "Discipline & Formation",  text: "I see discipline as evidence of love, not rejection." },
  { num: 6,  cat: "Discipline & Formation",  text: "I seek out truth-tellers, not just encouragers." },
  { num: 7,  cat: "Security & Empowerment",  text: "I celebrate when others around me accelerate.", ref: "Philippians 2:3" },
  { num: 8,  cat: "Security & Empowerment",  text: "I freely release responsibility to develop others." },
  { num: 9,  cat: "Security & Empowerment",  text: "I do not compete with those I lead or serve beside." },
  { num: 10, cat: "Rhythm & Abiding",        text: "I have a consistent rhythm of solitude and communion.", ref: "Mark 1:35" },
  { num: 11, cat: "Rhythm & Abiding",        text: "Busyness does not consistently crowd out my time with God." },
  { num: 12, cat: "Rhythm & Abiding",        text: "I am aware of when I am drifting from rest into striving.", ref: "John 15:4" },
];

const principles = [
  {
    num: 1,
    title: "Sonship Precedes Service",
    ref: "Matthew 3:17",
    scripture: "\"This is My beloved Son, with whom I am well pleased.\" — Matthew 3:17",
    paragraphs: [
      "Before Jesus healed the sick, cast out demons, or preached a sermon, the Father declared identity. Jesus did not earn sonship through obedience. He obeyed because He was a Son. Service flows from sonship — not toward it.",
      "When leaders reverse this order, striving replaces stability. They work to earn what has already been given. The performing leader is not a strong leader — they are an exhausted one who eventually collapses.",
      "Abiding is the practice of sonship. The branch does not strain to produce fruit. It remains connected. Sonship produces fruit without panic — because the fruit is a byproduct of the relationship, not the basis of it.",
    ],
    prompts: [
      "Where are you serving to earn approval instead of serving from a place of rest and identity? Be specific.",
    ],
  },
  {
    num: 2,
    title: "Sonship Requires Discipline",
    ref: "Hebrews 12:5–6",
    scripture: "\"The Lord disciplines the one He loves, and chastises every son whom He receives.\" — Hebrews 12:5–6",
    paragraphs: [
      "Discipline is not rejection. Correction is not abandonment. Training is not punishment. It is love shaping maturity. Leaders who resist correction remain emotionally fragile. Leaders who embrace discipline grow in humility and depth.",
      "Without discipline, sonship becomes entitlement. With discipline, sonship produces authority. The son who cannot receive correction will eventually lead without accountability — and that is the most dangerous kind of leadership.",
      "Connection matures through formative obedience. The leader who cannot receive correction cannot carry greater weight.",
    ],
    prompts: [
      "When was the last time you received correction well? When was the last time you resisted it? What was the difference?",
    ],
  },
  {
    num: 3,
    title: "Identity Precedes Influence",
    ref: "Galatians 4:7",
    scripture: "\"So you are no longer a slave, but a son, and if a son, then an heir through God.\" — Galatians 4:7",
    paragraphs: [
      "Secure sons do not seek identity through platform. They know who they are before anyone else affirms it. Influence flows from rooted identity — not the other way around.",
      "Leaders unsure of identity attempt to secure it through performance, titles, and visibility. They lead with anxiety. Secure sons lead without it.",
      "This is also where connection becomes a decision-making filter. The question is not just 'Is this a good opportunity?' but: 'Am I making this decision from security or from insecurity? From sonship or from striving?'",
    ],
    prompts: [
      "Name a recent decision. Did you make it from security or insecurity? From sonship or striving? How can you tell?",
    ],
  },
  {
    num: 4,
    title: "Security Enables Empowerment",
    ref: "Philippians 2:3",
    scripture: "\"Do nothing from selfish ambition or conceit, but in humility count others more significant than yourselves.\" — Philippians 2:3",
    paragraphs: [
      "Only secure sons elevate others freely. Insecure leaders compete. Secure leaders release. Insecure leaders hoard influence. Secure leaders multiply it.",
      "Security eliminates comparison. When you know who you belong to, you are not threatened by someone else's acceleration. You celebrate it. You fund it. You create space for it.",
      "Empowerment is the evidence of sonship maturity. The leader who cannot release others has not yet settled the identity question.",
    ],
    prompts: [
      "Who around you is rising? Are you celebrating their growth or feeling threatened by it? What does your honest answer reveal?",
      "What responsibility could you release to someone else right now that would develop them — but you've been holding onto?",
    ],
  },
  {
    num: 5,
    title: "Solitude Sustains Awareness",
    ref: "Mark 1:35",
    scripture: "\"Rising very early in the morning, while it was still dark, He departed and went out to a desolate place, and there He prayed.\" — Mark 1:35",
    paragraphs: [
      "Sonship awareness fades in busyness. The noise of leadership — demands, decisions, crises, opportunities — can drown out the voice that says 'You are Mine.' Jesus withdrew early to pray. Not because He was weak. Because He was intentional.",
      "Solitude was the rhythm that protected His identity from being consumed by His assignment. Abiding requires rhythm. Silence protects identity. Solitude renews alignment.",
      "Without this rhythm, even the most grounded leader begins to drift from sonship into performance. The calendar fills. The soul empties. And leadership becomes mechanical.",
    ],
    prompts: [
      "What is your current rhythm of solitude and communion? Be honest — is it consistent or has busyness consumed it?",
      "What one change to your daily or weekly rhythm would protect your awareness of who you belong to?",
    ],
  },
  {
    num: 6,
    title: "Work the Net to Build the Network",
    ref: "Ecclesiastes 4:9–10",
    addendum: true,
    scripture: "\"Two are better than one, because they have a good reward for their toil. For if they fall, one will lift up his fellow.\" — Ecclesiastes 4:9–10",
    paragraphs: [
      "Connection is not passive. You do not build a network by waiting for relationships to find you. You build it by working the net — intentionally pursuing, cultivating, and stewarding the relationships God assigns to your life.",
      "A net is made of individual threads woven together with purpose. Each thread is a relationship. Each knot is a point of trust. The strength of the net is not determined by how many threads exist — but by how well they are connected. A net with holes catches nothing.",
      "Working the net means showing up before you need something. It means giving before you ask. It means following up, following through, and being the kind of connection others can count on. Leaders who only reach out when they need something do not have a network — they have a contact list.",
    ],
    prompts: [
      "Are you intentionally building your network — or waiting for relationships to happen? What would it look like to 'work the net' over the next 90 days?",
    ],
  },
  {
    num: 7,
    title: "Relationships Orbit at Different Frequencies",
    ref: "Mark 3:14",
    addendum: true,
    scripture: "\"And He appointed twelve that they might be with Him and that He might send them out.\" — Mark 3:14",
    paragraphs: [
      "Jesus had crowds. He had the seventy-two. He had the twelve. He had the three. He had the one. Not every relationship operated at the same frequency — and neither will yours.",
      "The mature leader discerns which orbit each relationship belongs in and stewards accordingly. Inner Circle (weekly): accountability, prayer, honest correction. Core Alliance (monthly): strategic partnership, prophetic exchange. Seasonal Connectors (quarterly): encouragement, broader perspective. Annual Touchpoints: legacy relationships, long-range alignment.",
      "The mistake most leaders make is treating every relationship with the same frequency — exhausting themselves trying to maintain inner-circle depth with everyone, or neglecting key relationships because they have no system for staying connected. Both produce relational poverty.",
    ],
    prompts: [
      "Map your current network using the orbit framework. Who is in your inner circle? Your core alliance? Your seasonal connectors? Where are the gaps — and where are you over-investing or under-investing?",
      "Who in your network needs a different frequency than what you are currently giving them? Who have you neglected — and who needs to be repositioned?",
    ],
  },
];

const exemplar = {
  title: "Exemplar: Jesus — Son Before Savior",
  subtitle: "Before miracles. Before disciples. Before influence. The Father declared identity.",
  intro: "Jesus' entire ministry flowed from one declaration at the Jordan: 'This is My beloved Son, with whom I am well pleased.' Before He cast out a single demon, healed a single person, or preached a single sermon — identity was established. Sonship preceded service. Belovedness preceded assignment.",
  intro2: "Scripture also tells us: 'Although He was a Son, He learned obedience through what He suffered.' Sonship did not eliminate formation. It required obedience. Correction did not threaten identity. Suffering did not negate sonship. Sonship matured through obedience. Jesus modeled the full pattern: Belovedness → Alignment → Obedience → Authority → Impact.",
  pattern: "Belovedness → Alignment → Obedience → Authority → Impact",
  lessons: [
    "Identity declared before ministry begins is the only identity that sustains ministry.",
    "Sonship is not a feeling — it is a position. Jesus maintained alignment even when the crowds turned against Him.",
    "Authority flows from intimacy. Power flows from alignment. True authority flows from relational alignment — not positional control.",
    "Solitude was not weakness in Jesus — it was the practice that kept identity intact under maximum demand.",
    "The goal is not to produce more — it is to abide more. Fruit is a byproduct of the relationship.",
  ],
  questions: [
    "Do you lead from approval or for approval? What is the evidence?",
    "When suffering or correction comes, does your identity remain stable — or does it fracture?",
    "Is your authority rooted in intimacy with God or in activity for God?",
  ],
};

const stages = [
  {
    title: "Stage 1: Revelation (Understanding Belonging)",
    description: "Understanding your identity as adopted and loved. The first encounter with belonging. You begin to grasp that you are not a servant earning favor — you are a son or daughter already loved.",
    markers: ["First encounters with sonship language and identity security", "Beginning to question performance-based leadership", "Initial awareness of the orphan posture"],
  },
  {
    title: "Stage 2: Formation (Receiving Discipline)",
    description: "Receiving correction, discipline, and alignment. Learning that love includes refinement. The orphan patterns are being exposed. You are learning to interpret correction as formation rather than rejection.",
    markers: ["Increasing ability to receive honest input without collapse", "Naming specific orphan patterns and working on them", "Solitude and abiding becoming more intentional"],
  },
  {
    title: "Stage 3: Mature Sonship (Leading from Rest)",
    description: "Operating from secure identity shaped through discipline. Leading from rest, not striving. You have settled the identity question deeply enough that it no longer needs to be re-answered under pressure.",
    markers: ["Consistent rest and security even under pressure or criticism", "Freely empowering others without feeling threatened", "Solitude as a non-negotiable rhythm, not an occasional luxury"],
  },
];

const commitmentPrompts = [
  { id: "identity_statement",   label: "My Identity Statement (Who am I in God — apart from title, role, or accomplishment?)", placeholder: "Write one sentence that captures who you are in God alone..." },
  { id: "orphan_pattern",       label: "The Orphan Pattern I Am Renouncing",                                                   placeholder: "Name the specific striving or approval-seeking behavior you are committed to breaking..." },
  { id: "sonship_rhythm",       label: "My Sonship Rhythm (What specific practice protects your connection with God?)",        placeholder: "Solitude, prayer, worship, silence, journaling? Describe what and when..." },
  { id: "relational_investment",label: "My Relational Investment (Who am I walking with this season?)",                       placeholder: "Name the specific people — mentors, peers, community — who are part of your formation..." },
  { id: "empowerment_target",   label: "Who I Am Called to Establish in Identity",                                            placeholder: "Name one or more people into whom you will pour your sonship journey..." },
];

const revisitTriggers = [
  "When you notice striving replacing rest",
  "When criticism destabilizes your confidence",
  "When you start performing for approval again",
  "When your solitude rhythm breaks down",
  "When comparison or competition surfaces",
  "Quarterly, as a discipline of awareness",
];

const applicationQuestions = [
  "Where do I lead from insecurity or comparison? What would change this month if I led from anchored identity?",
  "What specific orphan pattern will you bring into accountability with a trusted person this week?",
];

const resources = {
  sectionTitle: "Additional Resources",
  blogs: [
    {
      title: "Building Community — Belonging Through Prayer — Part 1",
      url: "https://awakeningdestiny.global/building-community-purposeful-prayer-pt-1/",
      description: "Five steps to building Kingdom community through purposeful, persistent prayer.",
    },
    {
      title: "God's Governance: Leadership Collaboration — 7 Steps",
      url: "https://awakeningdestiny.global/gods-governance-leadership-collaboration/",
      description: "What happens when leaders and tribes come together under divine governance — a Kingdom collaboration model.",
    },
    {
      title: "2 Apostolic Measures: Faith and Love",
      url: "https://awakeningdestiny.global/2-apostolic-measures-faith-and-love/",
      description: "Paul's apostolic benchmarks for church and community health — and why they still measure what matters most.",
    },
  ],
  links: [
    { title: "Awakening Destiny Global", url: "https://awakeningdestiny.global", description: "Explore additional teaching, prophetic insight, and Kingdom leadership resources." },
  ],
};
var scriptures = {
  intro: "These are your anchor texts on connection. Return to them when belonging feels distant, when performance tempts you, and when you need to remember that leadership flows from abiding, sonship, love, and relational alignment.",
  verses: [
    { ref: "Matthew 3:17", text: "The Father declares identity before ministry begins." },
    { ref: "Matthew 3:16-17", text: "Identity is affirmed before ministry is expressed." },
    { ref: "Romans 8:15-17", text: "You have received the Spirit of adoption as sons." },
    { ref: "Romans 8:15", text: "Connection begins with adoption, not performance." },
    { ref: "Galatians 4:6-7", text: "No longer a slave, but a son — and an heir through God." },
    { ref: "John 15:4-5", text: "Abide in Me. Apart from Me you can do nothing." },
    { ref: "John 15:4", text: "Lasting fruit flows from abiding, not striving." },
    { ref: "John 5:19", text: "The Son does nothing of His own accord." },
    { ref: "Hebrews 12:5-11", text: "The Lord disciplines the one He loves." },
    { ref: "Hebrews 5:8", text: "Sonship matures through obedience and formation." },
    { ref: "Proverbs 3:11-12", text: "Do not despise the Lord's discipline." },
    { ref: "1 John 3:1", text: "See what kind of love the Father has given to us." },
    { ref: "1 John 4:16", text: "Whoever abides in love abides in God." },
    { ref: "1 John 2:14", text: "Mature fathers carry deep relational knowing and strength rooted in God." },
    { ref: "Mark 1:35", text: "Rising early, He went to a desolate place and prayed." },
    { ref: "Ecclesiastes 4:9-10", text: "Connection creates strength, support, and shared reward." },
    { ref: "Proverbs 27:17", text: "Growth in relationship includes sharpening through honest friction." },
    { ref: "Proverbs 13:20", text: "The people you walk with shape your wisdom and trajectory." },
    { ref: "Mark 3:14", text: "Jesus called leaders first to be with Him before sending them out." },
    { ref: "1 Corinthians 12:14", text: "No leader flourishes in isolation; we are built as one body." },
  ],
};
const config = {
  moduleNum: 2,
  title: "Connection",
  subtitle: "Identity (Relationships)",
  question: "Whose am I?",
  accent: "#00AEEF",
  accentLight: "#E8F8FF",
  accentMid: "#00AEEF",
  activationText: "Calling gives direction. Connection gives security. You can know what you were built for and still collapse — if you don't know who you belong to. Connection is relational alignment with God that establishes identity through sonship before function. It is belonging before burden. Union before utility. This module will anchor your identity so that your calling doesn't crush you — it carries you.",
  activationPrompts: [
    "When was the last time you felt truly secure in who you are — not because of what you accomplished, but simply because of who you belong to?",
    "Where in your leadership right now are you performing for approval instead of leading from approval?",
  ],
  diagnostic,
  principles,
  exemplar,
  stages,
  commitmentPrompts,
  revisitTriggers,
  applicationQuestions,
  aiPromptContext: "This leader has completed Module 2: Connection of the 5C Leadership Blueprint. Analyze their responses focusing on: (1) the depth of their identity security in God versus performance-based leadership, (2) the specific orphan patterns they are renouncing and how real that commitment appears, (3) the quality and depth of their relational investment, and (4) their capacity to give identity to others. Be direct and apostolic.",
  resources,
  learningObjectives: [
    "Identify the five to seven relationships that most shape your leadership — and assess whether each one is sharpening you or draining you.",
    "Distinguish between transactional networking and covenantal connection, and know which one your leadership is currently built on.",
    "Articulate who you are accountable to — not in theory, but in practice — and whether that structure is strong enough to hold you.",
    "Recognize the relational patterns that produce isolation, and build intentional rhythms of community into your leadership rhythm.",
    "Understand how connection anchors identity — and why leaders who disconnect from healthy community eventually lose clarity about who they are.",
  ],
  keyTakeaways: [
    "You become like the people you give access to your life. If your inner circle is not sharpening you, it is shaping you by default — and default is not alignment.",
    "Connection is not networking. It is covenantal alignment. Networking builds contacts. Connection builds covering.",
    "Isolation is not strength. It is a leadership vulnerability. The enemy's first strategy against a leader is to disconnect them from the voices that tell them the truth.",
    "Faith and love are the apostolic measures of a healthy community. If those two things are not growing in your relational world, something is structurally wrong.",
    "Your confirmation community is not optional. It is the relational infrastructure that holds your calling in place when your own confidence cannot.",
  ],
  contrastTable: {
    title: "Two Postures of Leadership",
    leftTitle: "Orphan Posture",
    rightTitle: "Son/Daughter Posture",
    rows: [
      ["Performs for approval", "Leads from approval"],
      ["Strives to prove worth", "Rests in known identity"],
      ["Compares and competes", "Celebrates and releases"],
      ["Controls people and outcomes", "Empowers and trusts"],
      ["Interprets correction as rejection", "Receives correction as formation"],
      ["Hoards influence", "Multiplies influence"],
      ["Burns out chasing recognition", "Endures through belonging"],
      ["Driven by fear of failure", "Anchored in love"],
    ],
  },
};

export default function ConnectionModule() {
  return (
    <>
      <Head><title>Connection | 5C Leadership Blueprint</title></Head>
      <ModuleTemplate config={config} />
    </>
  );
}