// pages/modules/connection.js
import Head from "next/head";
import ModuleTemplate from "../../components/ModuleTemplate";

const diagnostic = [
  { num: 1,  cat: "Sonship Security",      text: "I lead from a place of identity security, not the need for external validation.", ref: "Matthew 3:17" },
  { num: 2,  cat: "Sonship Security",      text: "I know the difference between performing for approval and leading from approval." },
  { num: 3,  cat: "Sonship Security",      text: "My sense of worth is not determined by my results, role, or recognition." },
  { num: 4,  cat: "Approval Posture",      text: "I receive correction and discipline without interpreting it as rejection.", ref: "Hebrews 12:6" },
  { num: 5,  cat: "Approval Posture",      text: "I can celebrate others' success without comparing or competing with them." },
  { num: 6,  cat: "Approval Posture",      text: "My motivation for service comes from rest, not striving.", ref: "John 15:4" },
  { num: 7,  cat: "Relational Health",     text: "I have a clear network of relationships that confirm and strengthen my identity." },
  { num: 8,  cat: "Relational Health",     text: "I can distinguish between those assigned to this season and those in my permanent circle." },
  { num: 9,  cat: "Relational Health",     text: "I have at least one relationship where I am fully known — not just seen in my role." },
  { num: 10, cat: "Community Foundation",  text: "I am not relationally isolated in my leadership." },
  { num: 11, cat: "Community Foundation",  text: "I am planted in a community that provides accountability, not just affirmation.", ref: "1 Samuel 3:8–9" },
  { num: 12, cat: "Community Foundation",  text: "I have mentors or spiritual fathers/mothers who have spoken into my identity and calling." },
];

const principles = [
  {
    num: 1,
    title: "Sonship Precedes Service",
    ref: "Matthew 3:17",
    scripture: "\"This is My beloved Son, with whom I am well pleased.\" — Matthew 3:17",
    paragraphs: [
      "Before Jesus healed the sick, cast out demons, or preached a sermon, the Father declared identity. Jesus did not earn sonship through obedience. He obeyed because He was a Son. Service flows from sonship — not toward it.",
      "When leaders reverse this order, striving replaces stability. They work to earn what has already been given. The performing leader is not a strong leader — they are an exhausted one. The performing leader eventually collapses because no achievement can permanently satisfy a hunger for belonging.",
      "Abiding is the practice of sonship. The branch does not strain to produce fruit. It remains connected. Sonship produces fruit without panic — because the fruit is a byproduct of the relationship, not the basis of it.",
    ],
    prompt: "Where are you serving to earn approval instead of serving from a place of rest and identity? Be specific.",
  },
  {
    num: 2,
    title: "Sonship Requires Discipline",
    ref: "Hebrews 12:5–6",
    scripture: "\"The Lord disciplines the one He loves, and chastises every son whom He receives.\" — Hebrews 12:5–6",
    paragraphs: [
      "Discipline is not rejection. Correction is not abandonment. Training is not punishment. It is love shaping maturity. Leaders who resist correction remain emotionally fragile. Leaders who embrace discipline grow in humility and depth.",
      "Without discipline, sonship becomes entitlement. With discipline, sonship produces authority. The son who cannot receive correction will eventually lead without accountability — and that is the most dangerous kind of leadership.",
      "The fruit of discipline is not immediate comfort. It is the peaceful fruit of righteousness — a settled, rooted, undeniable stability that only comes to leaders who have been formed through trial.",
    ],
    prompt: "Where have you interpreted discipline as rejection? What would it mean to receive it as formation instead?",
  },
  {
    num: 3,
    title: "Identity Governs Posture",
    ref: "John 15:4–5",
    scripture: "\"Abide in Me, and I in you. Apart from Me you can do nothing.\" — John 15:4–5",
    paragraphs: [
      "How a leader leads is always an expression of who a leader believes they are. The orphan leads from scarcity. The son leads from abundance. The orphan hoards, controls, and competes. The son empowers, releases, and celebrates. The difference is not strategy — it is identity.",
      "Abiding is the discipline that maintains identity under pressure. When the assignment gets heavy, when relationships disappoint, when recognition is absent — abiding keeps the leader anchored in what is true rather than reactive to what is felt.",
      "This is not passive mysticism. Abiding is active, intentional, daily. It means returning to the source before drawing from the well. Leaders who abide stay full. Leaders who neglect abiding run dry — and a dry leader is dangerous to everyone around them.",
    ],
    prompt: "Which column of the Orphan vs. Son contrast table describes your default under pressure? What specific behavior reveals that posture?",
  },
  {
    num: 4,
    title: "Relational Investment is Kingdom Strategy",
    ref: "1 Samuel 3:8–9",
    scripture: "\"Then Eli realized that the Lord was calling the boy.\" — 1 Samuel 3:8–9",
    paragraphs: [
      "Samuel heard God's voice but needed Eli to help him interpret it. Calling does not mature in isolation. It requires mentors, community, and external confirmation. A calling that no one else can see or confirm may be ambition dressed in spiritual language.",
      "Community provides three essential functions: interpretation (helping you understand what God is saying), confirmation (verifying what you're sensing), and accountability (holding you to what you've declared). You need all three — not just the ones that feel comfortable.",
      "Relational investment is not a personal luxury. In the Kingdom, it is a structural requirement. The leader who refuses depth in relationships is not strong — they are unformed. And unformed leaders form unhealthy teams.",
    ],
    prompt: "Who in your life is providing interpretation, confirmation, and accountability for your calling? If no one, what does that tell you?",
  },
];

const exemplar = {
  title: "Exemplar: David — Son Before King",
  subtitle: "David's identity as beloved held him together through rejection, wilderness, and war.",
  intro: "David was anointed king while still tending sheep. He was not installed — he was formed. The years between the anointing and the throne were not waiting years. They were sonship years. In the wilderness, running from Saul's spear, David wrote Psalms — the outpouring of a man who knew who he belonged to even when no one recognized it.",
  intro2: "David did not lead from the throne's validation. He led from his connection to God that was established long before he was known publicly. When Saul rejected him, when his family misunderstood him, when his military victories weren't enough — David ran back to the source. 'You are my Father, my God, and the Rock of my salvation.' That identity sustained everything else.",
  lessons: [
    "Identity established in hiddenness sustains you through public pressure — both the pressure of opposition and the pressure of success.",
    "The orphan posture surfaces under stress. The son posture is built in secret, through consistent abiding.",
    "Relational wounds do not disqualify — they deepen. David's betrayals became the raw material of his most profound worship.",
    "You cannot lead others into identity security you have not found yourself.",
  ],
  questions: [
    "Where in your leadership journey has your identity been most tested? What did you discover about your posture?",
    "Who has been your 'Eli' — someone who helped you hear and interpret what God was saying about your identity and calling?",
  ],
};

const stages = [
  {
    title: "Stage 1: Orphan (Striving)",
    description: "The default mode for most leaders before intentional formation. You lead from the need for approval, significance, or security. You may be effective externally but internally exhausted and relationally shallow.",
    markers: ["Performing for validation", "Comparing and competing with peers", "Difficulty receiving correction without feeling rejected"],
  },
  {
    title: "Stage 2: Awakening (Recognition)",
    description: "You begin to see the orphan posture for what it is. This is often triggered by failure, relational rupture, or spiritual encounter. Something breaks the performance cycle and exposes the need beneath it.",
    markers: ["Awareness of what drives your leadership", "Beginning to question the cost of striving", "Initial encounters with true identity security"],
  },
  {
    title: "Stage 3: Sonship (Rest)",
    description: "You are actively transitioning from performance to rest. Identity is becoming your anchor. You are building spiritual disciplines that maintain sonship — not as a formula, but as a lifestyle of abiding.",
    markers: ["Increasingly leading from security rather than striving", "Receiving correction without collapse", "Celebrating others genuinely without comparison"],
  },
  {
    title: "Stage 4: Multiplication (Fathering)",
    description: "You are so settled in your own identity that you can now give identity to others. You become a spiritual father or mother — someone whose presence establishes others in who they are. This is the fruit of decades of formation.",
    markers: ["Leaders around you grow into identity security because of your investment", "You release and celebrate rather than hold and control", "Your relational legacy outlasts your organizational output"],
  },
];

const commitmentPrompts = [
  { id: "identity_declaration",  label: "My Identity Declaration (Who do I belong to? What does that mean?)",         placeholder: "Write a statement of who you are as a son/daughter — not your role or title, your identity..." },
  { id: "orphan_pattern",        label: "The Orphan Pattern I Am Renouncing",                                         placeholder: "Name the specific striving or approval-seeking behavior you are committed to breaking..." },
  { id: "abiding_practice",      label: "My Abiding Practice (How I maintain identity under pressure)",               placeholder: "Describe the specific spiritual disciplines that keep you anchored in sonship..." },
  { id: "community_investment",  label: "My Relational Investment (Who am I walking with this season?)",              placeholder: "Name the specific people — mentors, peers, community — who are part of your formation..." },
  { id: "fathering_commitment",  label: "Who I Am Called to Establish in Identity",                                   placeholder: "Name one or more people into whom you will pour your own sonship journey..." },
];

const revisitTriggers = [
  "When you notice yourself performing instead of resting",
  "When criticism or correction triggers a disproportionate reaction",
  "When you find yourself comparing or competing instead of celebrating",
  "When relationships in your team feel more transactional than covenant",
  "When you feel isolated, unseen, or misunderstood in your leadership",
  "When success begins to inflate rather than deepen your dependency on God",
];

const applicationQuestions = [
  "What is one relationship you need to invest in this week that reflects covenant, not just utility?",
  "What specific orphan pattern will you bring into accountability with a trusted person this week?",
];

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
