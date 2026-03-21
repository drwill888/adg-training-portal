// pages/modules/commissioning.js
// Commissioning is the capstone — built from the full 5C framework.
// It does not introduce a new dimension. It deploys the whole person.

import Head from "next/head";
import ModuleTemplate from "../../components/ModuleTemplate";

const diagnostic = [
  { num: 1,  cat: "Deployment Readiness",  text: "I can articulate my assignment in this season with clarity and conviction.", ref: "Matthew 28:19–20" },
  { num: 2,  cat: "Deployment Readiness",  text: "I have completed the formation process honestly — not perfectly, but intentionally." },
  { num: 3,  cat: "Deployment Readiness",  text: "I have released what is no longer mine to carry so I can carry what is." },
  { num: 4,  cat: "Kingdom Authority",     text: "I am operating with authority that has been tested, not just declared.", ref: "Acts 13:1–3" },
  { num: 5,  cat: "Kingdom Authority",     text: "I am sent by community — confirmed by others, not just self-authorized." },
  { num: 6,  cat: "Kingdom Authority",     text: "The commissioning of my life is visible to those closest to me — they can see the grace and confirm the call." },
  { num: 7,  cat: "Generational Impact",   text: "I have a clear picture of what I am building and why it matters beyond my lifetime.", ref: "2 Timothy 2:2" },
  { num: 8,  cat: "Generational Impact",   text: "I know who I am sending — I am not only doing, I am multiplying." },
  { num: 9,  cat: "Generational Impact",   text: "The people I am forming will carry what I carry, and carry it further." },
  { num: 10, cat: "Missional Clarity",     text: "My assignment is clear enough that I can give my best without being pulled in every direction.", ref: "John 20:21" },
  { num: 11, cat: "Missional Clarity",     text: "I am ready to be sent — not just inspired or encouraged, but commissioned and deployed." },
  { num: 12, cat: "Missional Clarity",     text: "I am sent. I know where. I know with whom. I know why." },
];

const principles = [
  {
    num: 1,
    title: "Sent Leaders Carry Authority",
    ref: "Matthew 28:18–20",
    scripture: "\"All authority in heaven and on earth has been given to Me. Go therefore...\" — Matthew 28:18–20",
    paragraphs: [
      "The Great Commission does not begin with a command — it begins with a declaration of authority. Jesus establishes the source before He gives the mandate. Sent leaders do not manufacture authority. They receive it, walk under it, and deploy it.",
      "Commissioned authority is different from positional authority. Position gives you a title. Commission gives you a mandate. Many leaders hold positions without mandate — they have been placed but not sent. The sent leader carries something that the positioned leader may not: the weight of divine assignment.",
      "Authority grows through stewardship. The leader who is faithful in their assignment under authority will receive expanding authority. The leader who operates outside their commissioning will find that what they build will not hold the weight they expected.",
    ],
    prompt: "Under whose authority are you sent? Who are the fathers, mothers, and community that confirm and cover your assignment?",
  },
  {
    num: 2,
    title: "Commissioning Requires Community",
    ref: "Acts 13:1–3",
    scripture: "\"While they were worshiping the Lord and fasting, the Holy Spirit said, 'Set apart for Me Barnabas and Saul...' Then after fasting and praying, they laid their hands on them and sent them off.\" — Acts 13:1–3",
    paragraphs: [
      "Paul was not self-sent. He was sent by a praying community, confirmed by the Spirit, and covered by the laying on of hands. This is the model of Kingdom commissioning — the individual's inner conviction confirmed by corporate discernment.",
      "Self-sent leaders are dangerous — not because their calling is false, but because they lack the covering, correction, and accountability that community provides. The Antioch church didn't just bless Paul and Barnabas. They fasted with them. They prayed over them. They sent them with relational weight.",
      "Commissioning without community produces isolated, self-referencing leadership. Commissioning through community produces leaders who remain accountable even as they expand. The community that sends you is the community you remain answerable to.",
    ],
    prompt: "Who is your Antioch? Who is the praying, confirming community that is sending you into your next assignment — not just cheering you, but committing to cover and correct you?",
  },
  {
    num: 3,
    title: "The Sent One Multiplies the Sender",
    ref: "John 20:21",
    scripture: "\"As the Father has sent Me, even so I am sending you.\" — John 20:21",
    paragraphs: [
      "Jesus did not only receive His commissioning — He became a commissioning leader. The pattern of the Father sending the Son became the pattern of the Son sending His disciples. Commissioning is meant to reproduce itself.",
      "The fully commissioned leader is not only sent — they send. They form the next generation. They lay hands on those who carry similar grace. They pray over, confirm, cover, and release others into assignments they will never personally occupy.",
      "If you have been mentored, you are obligated to mentor. If you have been formed, you are obligated to form. If you have been sent, you are obligated to send. The generational multiplication of the Kingdom depends on leaders who refuse to be the final link in the chain.",
    ],
    prompt: "Who are you actively commissioning? Name the specific leaders you are covering, confirming, and preparing to send.",
  },
  {
    num: 4,
    title: "Every Generation Must Commission the Next",
    ref: "2 Timothy 2:2",
    scripture: "\"What you have heard from me in the presence of many witnesses entrust to faithful people who will be able to teach others also.\" — 2 Timothy 2:2",
    paragraphs: [
      "Paul's instruction to Timothy was not about content transfer alone. It was about generational multiplication. Four generations are embedded in this verse: Paul → Timothy → faithful people → others also. The Kingdom moves forward through intentional commissioning, not just organic growth.",
      "The leader who reaches the end of their assignment and cannot name who they are releasing into what they built has not completed their commissioning — they have stalled it. Legacy is not what you leave behind. It is who you send forward.",
      "Every generation of leaders has a responsibility to the generation that follows. Not to clone themselves — to form, release, and commission those who will carry the burden to places and people the current generation will never reach.",
    ],
    prompt: "Name four generations: yourself, the one you are forming, the one they will form, and the impact that carries to. What does that generational chain look like from where you stand?",
  },
];

const exemplar = {
  title: "Exemplar: Paul at Antioch — The Model Commissioning",
  subtitle: "Paul's commissioning at Antioch shows us what it looks like when the individual, the community, and the Spirit align.",
  intro: "By the time Paul is commissioned in Acts 13, he has already been formed for over a decade. He was converted, discipled in Arabia, returned to Jerusalem, mentored by Barnabas, and brought into the Antioch church community. His commissioning was not the beginning of his formation — it was the public release of what had already been built privately.",
  intro2: "Three things are present at Antioch that mark every legitimate commissioning: community in agreement, the voice of the Spirit, and the act of sending. Paul and Barnabas were not self-deployed. They were discerned, covered, and released. Then they went — not cautiously, not reluctantly, but with the full weight of heaven and community behind them. They turned the known world upside down. That is what happens when the sent one is truly sent.",
  lessons: [
    "Commissioning is the culmination of formation — not the beginning of it. You cannot send what has not been formed.",
    "The Spirit confirms what the community discerns. Both are required. Neither replaces the other.",
    "Being sent means carrying the authority and accountability of those who sent you. That weight is protective, not limiting.",
    "The most significant thing about Paul's commissioning is what he did with it — he reproduced it. Timothy, Titus, Lydia, Priscilla, Aquila. He became a commissioning leader.",
    "You were not commissioned to be impressive. You were commissioned to multiply. The metric of a sent leader is not how far they went, but how many they sent forward.",
  ],
  questions: [
    "As you reflect on your entire 5C formation journey, what is the most significant thing God has built in you that you are now ready to carry into deployment?",
    "What would it look like to build an 'Antioch' in your own sphere — a praying, discerning community that sends others?",
  ],
};

const stages = [
  {
    title: "Stage 1: Prepared (Formation Complete)",
    description: "The five dimensions have been honestly engaged. You are not perfect — but you are formed. The foundation has been laid, tested, and is ready to bear the weight of the assignment. You know who you are, whose you are, what you carry, what you can sustain, and where you are most aligned.",
    markers: ["Clear articulation of calling and current assignment", "Settled identity that is not destabilized by pressure or recognition", "Known competency gaps with a plan to close them"],
  },
  {
    title: "Stage 2: Confirmed (Community Agreement)",
    description: "Others have seen, confirmed, and are covering what you carry. You are not self-sent. You have fathers, mothers, peers, and a community who have discerned your assignment alongside you. Their confirmation does not create your calling — it confirms and covers it.",
    markers: ["Mentors and community have consistently spoken to your grace", "Your assignment is understood and supported by your closest circle", "You are accountable to people who will correct you, not just applaud you"],
  },
  {
    title: "Stage 3: Released (Active Deployment)",
    description: "You have been sent. You are actively building the assignment you were formed for. The fruit is real. The weight is real. The cost is real. And the rightness of what you are building is undeniable — because you are in your lane, with the right people, carrying what you were made to carry.",
    markers: ["Sustained fruitfulness without constant overextension", "The work you are doing aligns with every dimension of the 5C framework", "You are leading from wholeness, not from deficit"],
  },
  {
    title: "Stage 4: Reproducing (Commissioning Others)",
    description: "You are sending others. You are laying hands, confirming calling, covering the sent, and releasing what you have built into the hands of those you have formed. You are not just a leader. You are a commissioning leader. The greatest thing you will do is not what you built — it is who you sent.",
    markers: ["Leaders in your sphere are being commissioned and deployed", "What you built does not require your daily presence to flourish", "Your greatest investment is in people, not projects"],
  },
];

const commitmentPrompts = [
  { id: "deployment_declaration",    label: "My Deployment Declaration (I am sent to...)",                                  placeholder: "Write your commissioning declaration — who sent you, where you are sent, and what you carry..." },
  { id: "commissioning_community",   label: "My Antioch (The community sending and covering me)",                           placeholder: "Name the community, fathers, mothers, and peers who confirm and cover your assignment..." },
  { id: "five_c_synthesis",          label: "My 5C Synthesis (What each dimension has built in me)",                        placeholder: "Briefly describe what each of the five dimensions has produced: Calling, Connection, Competency, Capacity, Convergence..." },
  { id: "generational_investment",   label: "Who I Am Sending Forward",                                                     placeholder: "Name the leaders you are intentionally forming and commissioning. What are you entrusting to them?" },
  { id: "legacy_declaration",         label: "My Legacy Declaration (What will still be standing when I am gone?)",          placeholder: "Write a declaration of what you are building that will outlast you — people, systems, culture, mission..." },
];

const revisitTriggers = [
  "When a major season transition arrives and you need to re-anchor your commissioning",
  "When the weight of your assignment threatens to disconnect you from your community",
  "When you are considering deploying someone into a new assignment",
  "When you have completed a major phase of building and are assessing what comes next",
  "When you need to remember why you were sent and who sent you",
  "When the cost of the assignment makes you question whether you heard correctly",
];

const applicationQuestions = [
  "Write your commissioning declaration in one paragraph: who sent you, where you are going, what you carry, and who you are taking with you.",
  "Name the person you will lay hands on, confirm, and send this season. What specifically will you entrust to them?",
];

const config = {
  moduleNum: 6,
  title: "Commissioning",
  subtitle: "Sent (Deployment)",
  question: null,
  accent: "#C8A951",
  accentLight: "#FFF9E6",
  accentMid: "#FDD20D",
  activationText: "This is the capstone. Not the end — the deployment. Everything the 5C Leadership Blueprint has built in you was always moving toward this: the moment you are formed enough to be sent, confirmed enough to carry authority, and aligned enough to build legacy. Commissioning is not a ceremony. It is an activation. You were not formed to be impressive. You were formed to be sent. And the sent leader does not carry the assignment alone — they carry the weight of those who sent them, the covering of those who confirmed them, and the responsibility of those they will send forward.",
  activationPrompts: [
    "As you come to the end of this formation journey, what is the most significant thing God has built in you that was not there — or not this developed — when you began?",
    "What does it mean for you to be sent? Not inspired, not affirmed, not excited — but genuinely sent, with authority, accountability, and a clear assignment?",
  ],
  diagnostic,
  principles,
  exemplar,
  stages,
  commitmentPrompts,
  revisitTriggers,
  applicationQuestions,
  aiPromptContext: "This leader has completed Module 6: Commissioning — the capstone of the 5C Leadership Blueprint. This is the synthesis and deployment module. Analyze their responses focusing on: (1) the depth and clarity of their deployment declaration, (2) the reality and health of their commissioning community, (3) how well their 5C synthesis integrates all five dimensions, (4) the specificity of their generational investment, and (5) the weight and authenticity of their legacy declaration. Write a commissioning word — apostolic, prophetic, and specific — that calls them forward into what they were formed to build.",
  contrastTable: {
    title: "Two Kinds of Leaders at Deployment",
    leftTitle: "Inspired But Not Sent",
    rightTitle: "Formed and Commissioned",
    rows: [
      ["Self-authorized", "Sent by confirmed community"],
      ["Excited about the vision", "Anchored to the assignment"],
      ["Building what impresses", "Building what endures"],
      ["Multiplying activity", "Multiplying leaders"],
      ["Operating in isolation", "Covered and accountable"],
      ["Leading for recognition", "Leading for legacy"],
      ["Leaving when it gets hard", "Staying until the work is done"],
      ["Impact ends with presence", "Impact outlasts personality"],
    ],
  },
};

export default function CommissioningModule() {
  return (
    <>
      <Head><title>Commissioning | 5C Leadership Blueprint</title></Head>
      <ModuleTemplate config={config} />
    </>
  );
}
