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

const bookChapter = {
  title: "Called to Run the Race",
  source: "From Leaders for Life (updated) by Will Meier — Awakening Destiny Global",
  // Edited from Leaders for Life - updated
  paragraphs: [
    { type: "text", text: "It was the Wednesday before a long vacation when my wife and I watched the movie Secretariat. It is an award-winning film about the legendary horse who won the Triple Crown against all odds. Although the story ends in triumph, the beginning is marked by loss, pressure, and near collapse. The horse farm that owned Secretariat was on the verge of bankruptcy, and nearly the entire family—except for one person, Penny Chenery—wanted to shut it down because it was bleeding money. As I watched the story unfold, something deep within me stirred, and I wept." },
    { type: "scripture", text: "Deep calls to deep at the noise of Your waterfalls; all Your waves and Your billows have gone over me. — Psalm 42:7" },
    { type: "text", text: "This story awakened a cry in my heart: it is time to rise against the odds and go for it. Everything began with the faith of one person. Penny Chenery believed in the potential hidden within a bloodline. She believed that greatness still lived in the legacy of that farm, and that the seed carried the promise of a champion. Her faith reached beyond what was visible and laid hold of what was possible. She believed in the power of potential contained in the seed." },
    { type: "text", text: "Peter writes that we have been born again, not of perishable seed, but of imperishable seed, through the living and enduring Word of God (1 Peter 1:23). That seed, when nurtured, does not remain buried. It grows. It becomes a Kingdom expression of life, like a tree in which the life, presence, and word of God flow and flourish (Matthew 13:31–32)." },
    { type: "text", text: "There was someone who believed in Secretariat's future and destiny before others could see it. Chenery hired a gifted trainer, and together they nurtured, disciplined, and prepared the horse to run according to the design placed within him. That is what gripped me so deeply. It was more than a story about horse racing. It was a story about vision, stewardship, faith, and the courage to contend for greatness hidden beneath the surface." },
    { type: "text", text: "In one powerful scene, the father and owner of the estate shared a lucid moment with his daughter and spoke words that seemed to unlock the whole story: \"Let him run his race.\" Those words became more than dialogue. They became permission. They became prophecy. They became the track upon which Secretariat would fulfill his purpose. I believe there is a cry and hunger in every human heart to fulfill the race set before them. Like Peter, who was called into greatness through both failure and redemption, each of us carries a longing to become what God intended." },
    { type: "text", text: "The word destiny does not appear in Scripture, but there is a powerful opposite that helps define it. The Greek word hamartia, often translated sin, means to miss the mark, to miss the true end and scope of our lives in God. In that sense, sin is not only transgression; it is falling short of the fullness for which we were created. Destiny, then, is moving toward that God-ordained end. It is coming into the fullness of Christ, the maturity of His life in us, and the completion of what He intended from the beginning (Ephesians 4:13). In Secretariat's story, it was the daughter who carried the vision with sacrifice, resolve, commitment, and endurance until a champion emerged. And perhaps that is why the story struck me so deeply: because it reminds us that greatness is often hidden beneath pressure, and destiny is revealed when someone dares to believe enough to say, against all odds, let him run his race." },
    { type: "text", text: "There comes a moment when fear must step aside, when doubt must lose its voice, and when what God planted must be given room to run. The cry of heaven is not that we shrink back, but that we arise, align, and run the race marked out for us. Let the seed grow. Let the champion emerge. Let the sons and daughters of God run with endurance until they come into the fullness of Christ and the destiny prepared for them from the beginning." },
  ],
};

var scriptures = {
  intro: "These are your core texts on formation and readiness. Return to them when the process feels slow, when comfort tempts you to settle, and when you need to remember that God builds the leader before He builds the assignment.",
  verses: [
    { ref: "Romans 12:2", text: "Be transformed by the renewing of your mind." },
    { ref: "Psalm 127:1", text: "Unless the LORD builds the house, the builders labor in vain." },
    { ref: "Proverbs 24:27", text: "Prepare your work outside; get everything ready." },
    { ref: "Luke 14:28-30", text: "Count the cost before you build." },
    { ref: "Isaiah 28:16", text: "I am the one who has laid a foundation — a tested stone, a precious cornerstone." },
    { ref: "2 Timothy 2:21", text: "A vessel for honorable use, set apart, useful to the master, prepared for every good work." },
    { ref: "Hebrews 12:11", text: "Discipline seems painful, but yields the peaceful fruit of righteousness." },
    { ref: "Psalm 139:23-24", text: "Search me, O God, and know my heart." },
    { ref: "James 1:22-25", text: "Be doers of the word, not hearers only." },
    { ref: "Philippians 1:6", text: "He who began a good work in you will bring it to completion." },
    { ref: "Proverbs 4:7", text: "The beginning of wisdom is this: get wisdom." },
    { ref: "Psalm 51:6", text: "Behold, You delight in truth in the inward being." },
    { ref: "Nehemiah 2:11-18", text: "Nehemiah surveyed the work before rallying others to build." },
    { ref: "1 Corinthians 3:10-11", text: "Let each one take care how he builds upon the foundation." },
    { ref: "Ezra 3:10-11", text: "The builders laid the foundation and the people praised God." },
    { ref: "Matthew 7:24-27", text: "The wise man built his house on the rock." },
    { ref: "2 Chronicles 7:14", text: "If my people humble themselves, pray, seek, and turn — I will heal." },
    { ref: "Psalm 90:12", text: "Teach us to number our days that we may get a heart of wisdom." },
  ],
};

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
    { title: "Awakening Destiny Global", url: "https://awakeningdestiny.global", description: "Explore additional teaching, prophetic insight, and Kingdom leadership resources." },
  ],
};

var config = {
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
  diagnostic: diagnostic,
  principles: principles,
  exemplar: exemplar,
  stages: stages,
  commitmentPrompts: commitmentPrompts,
  revisitTriggers: revisitTriggers,
  applicationQuestions: applicationQuestions,
  aiPromptContext: "This is the Introduction module of the 5C Leadership Blueprint. The leader has completed their baseline self-assessment and written their initial commitments about why they are taking this course, their primary leadership gap, and their first draft of their calling. Focus your analysis on: (1) their formation readiness and posture, (2) the significance of the gap they named, (3) the quality of their calling articulation, and (4) what they most need to receive from this process.",
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
  bookChapter: bookChapter,
  scriptures: scriptures,
  resources: resources,

  activationPrayer: {
    theme: 'Alignment in Christ',
    context: 'When you are preparing your heart to receive, align, and be strengthened in the Lord',
    scriptures: [
      { ref: 'Colossians 2:10', text: 'And you are complete in Him, who is the head of all principality and power.' },
      { ref: 'Ephesians 1:18-19', text: 'The eyes of your understanding being enlightened; that you may know what is the hope of His calling... and what is the exceeding greatness of His power toward us who believe...' },
      { ref: 'Romans 12:1-2', text: 'Present your bodies a living sacrifice... and do not be conformed to this world, but be transformed by the renewing of your mind...' },
    ],
    prayer: `Father, I come before You in the name of Jesus, yielding myself afresh to You.\n\nThank You that I am complete in Christ. Thank You that my life is not rooted in lack, fear, striving, or performance, but in Your finished work.\n\nOpen the eyes of my understanding. Enlighten my heart. Let me see what You are saying and discern what You are doing in this season.\n\nRenew my mind and align my heart with heaven. Wash away confusion, passivity, distraction, and unbelief. Bring every part of my life into agreement with Your will.\n\nI present myself to You as a living sacrifice. Consecrate my thoughts, my desires, my gifts, my relationships, and my assignment.\n\nAs I pray through these 5Cs, establish me in Christ. Bring clarity to my calling. Root me in divine connection. Grow me in wisdom and competency. Strengthen and enlarge my capacity. Bring all things into convergence.\n\nI decree that I am aligned in Christ, awakened by the Spirit, and ready to receive all that You desire to form in me and release through me.\n\nIn Jesus' name. Amen.`,
  },
  podcast: { showId: '2527180', episodeId: '18846412' },
};

export default function IntroductionModule() {
  return (
    <>
      <Head>
        <title>Introduction | 5C Leadership Blueprint</title>
        <meta name="description" content="Begin your formation journey with the course foundation module — free to all learners." />
        <meta property="og:title" content="Introduction | 5C Leadership Blueprint" />
        <meta property="og:description" content="Begin your formation journey with the course foundation module — free to all learners." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://5cblueprint.awakeningdestiny.global/modules/introduction" />
        <meta property="og:site_name" content="5C Leadership Blueprint" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Introduction | 5C Leadership Blueprint" />
        <meta name="twitter:description" content="Begin your formation journey with the course foundation module — free to all learners." />
      </Head>
      <ModuleTemplate config={config} />
    </>
  );
}
