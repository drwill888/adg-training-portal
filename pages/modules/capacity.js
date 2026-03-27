// pages/modules/capacity.js
import Head from "next/head";
import ModuleTemplate from "../../components/ModuleTemplate";

const diagnostic = [
  { num: 1,  cat: "Resilience & Endurance", text: "I remain steady under prolonged pressure.", ref: "Romans 5:3–5" },
  { num: 2,  cat: "Resilience & Endurance", text: "Delay does not produce bitterness in me.", ref: "Psalm 105:19" },
  { num: 3,  cat: "Resilience & Endurance", text: "I can endure criticism without overreacting." },
  { num: 4,  cat: "Emotional Maturity",     text: "I forgive those who misrepresent me.", ref: "Genesis 50:20" },
  { num: 5,  cat: "Emotional Maturity",     text: "I restrain myself under provocation.", ref: "1 Samuel 24:6" },
  { num: 6,  cat: "Emotional Maturity",     text: "I respond instead of react in conflict." },
  { num: 7,  cat: "Humility & Growth",      text: "Success does not inflate my ego.", ref: "Proverbs 16:18" },
  { num: 8,  cat: "Humility & Growth",      text: "I receive correction without defensiveness." },
  { num: 9,  cat: "Humility & Growth",      text: "I remain teachable as influence grows." },
  { num: 10, cat: "Internal Stability",     text: "I maintain tenderness even after adversity.", ref: "Psalm 51:10" },
  { num: 11, cat: "Internal Stability",     text: "I do not transfer stress onto others." },
  { num: 12, cat: "Internal Stability",     text: "I can carry responsibility without emotional volatility.", ref: "Philippians 4:11" },
];

const principles = [
  {
    num: 1,
    title: "Pressure Reveals and Refines Character",
    ref: "Psalm 105:19",
    scripture: "\"Until what he had said came to pass, the word of the LORD tested him.\" — Psalm 105:19",
    paragraphs: [
      "Joseph received a dream, but the word of the Lord tested him before it elevated him. The dream was revelation. The testing was formation. Pressure is not interruption — it is exposure. It reveals what applause hides.",
      "Capacity grows when leaders allow pressure to reveal what must be refined: hidden insecurity, pride, emotional fragility, impatience, control tendencies. God does not test leaders to disqualify them. He tests them to strengthen what must carry influence.",
      "Leaders who avoid pressure avoid enlargement. You cannot expand what has not been tested. The container that holds great weight must be formed under compression — not shielded from it.",
    ],
    prompts: [
      "What has recent pressure revealed in you that needs refining? Name it honestly — not the external circumstance, but the internal response it exposed.",
    ],
  },
  {
    num: 2,
    title: "Hidden Seasons Enlarge Internal Strength",
    ref: "Psalm 78:70",
    scripture: "\"He chose David his servant and took him from the sheepfolds.\" — Psalm 78:70",
    paragraphs: [
      "David was anointed early. He was appointed much later. The wilderness between anointing and throne built capacity. Hidden seasons train private discipline, strengthen unseen obedience, deepen worship, expose character gaps, and build emotional endurance.",
      "Public authority without private depth collapses under strain. The leader who moves from affirmation to affirmation without ever sitting with hiddenness has never been tested in the place where their foundations matter most.",
      "Hidden seasons are not divine delay. They are divine enlargement. What grows in obscurity sustains influence in visibility. Capacity is often built where recognition is absent.",
    ],
    prompts: [
      "What hidden season are you in — or have you recently come through? What did it enlarge in you?",
    ],
  },
  {
    num: 3,
    title: "Restraint Protects Future Authority",
    ref: "1 Samuel 24:6",
    scripture: "\"The LORD forbid that I should do this thing to my lord, the LORD's anointed.\" — 1 Samuel 24:6",
    paragraphs: [
      "When David had the opportunity to eliminate Saul, he chose restraint. Immature leaders react. Enlarged leaders restrain. Restraint reveals emotional regulation, reverence for timing, trust in God's justice, and freedom from impulsiveness.",
      "Capacity includes the ability to hold power without abusing it. Influence without restraint becomes destructive. The leader who cannot restrain himself cannot be trusted with greater authority.",
      "Restraint builds credibility that promotion alone cannot produce. What you refuse in the hidden place becomes the evidence of your capacity in the public place.",
    ],
    prompts: [
      "Where are you being provoked right now? What would restraint look like instead of reaction?",
    ],
  },
  {
    num: 4,
    title: "Forgiveness Expands Emotional Capacity",
    ref: "Genesis 50:20",
    scripture: "\"You meant evil against me, but God meant it for good.\" — Genesis 50:20",
    paragraphs: [
      "Joseph interpreted betrayal through providence. Forgiveness is not emotional denial. It is theological alignment. Bitterness narrows internal space. Forgiveness enlarges it.",
      "Leaders who carry unresolved offense overreact, distrust prematurely, lead defensively, and transfer pain downward. Forgiveness protects influence from contamination.",
      "The leader who cannot forgive cannot sustain broad influence. Forgiveness is internal freedom that protects external authority. It is not releasing the person from accountability — it is releasing yourself from the weight of carrying their offense.",
    ],
    prompts: [
      "Who do you need to forgive — not for their sake, but because the weight of it is limiting your capacity? What would releasing it free you to carry?",
    ],
  },
  {
    num: 5,
    title: "Capacity Governs What You Can Carry",
    ref: "Romans 5:3–4",
    scripture: "\"Suffering produces endurance, and endurance produces character, and character produces hope.\" — Romans 5:3–4",
    paragraphs: [
      "Just as calling governs decisions and connection governs posture — capacity governs what you can carry. The question is not 'Is this opportunity good?' but 'Do I have the internal strength to sustain it?'",
      "Leaders who accept responsibility beyond their character capacity don't rise — they fracture. Promotion without enlargement produces collapse.",
      "Capacity as a filter asks: Do I have the emotional maturity this role demands? Can I handle the criticism that comes with this level of visibility? Am I carrying unresolved pain that will contaminate this assignment? Is my internal world large enough for what my external world is becoming?",
    ],
    prompts: [
      "What responsibility are you carrying — or being offered — that your current character capacity may not be ready for? What needs to be enlarged?",
    ],
  },
  {
    num: 6,
    title: "Rest Is a Capacity Discipline, Not a Reward",
    ref: "1 Kings 19:5",
    addendum: true,
    scripture: "\"And he lay down and slept under a broom tree. And behold, an angel touched him and said, 'Arise and eat.'\" — 1 Kings 19:5",
    paragraphs: [
      "Elijah had just called down fire from heaven and defeated 450 prophets. Then one threat from Jezebel sent him running into the wilderness, asking to die. God's response was not a rebuke, a strategy session, or a sermon. It was sleep and food. Twice.",
      "Rest is not what you earn after the battle. It is what keeps you standing for the next one. Leaders who never recover eventually collapse — not from lack of gifting, but from depletion of the vessel that carries the gifting.",
      "Sabbath rhythm is not spiritual luxury. It is capacity infrastructure. The leader who refuses to rest is not strong — they are unsustainable. If rest was necessary for Elijah at the height of his anointing, it is necessary for you.",
    ],
    prompts: [
      "When was the last time you rested before you had to — not because you collapsed, but because you chose to protect your capacity? What rhythm of rest do you need to build into your life this month?",
    ],
  },
  {
    num: 7,
    title: "Boundaries Protect Capacity",
    ref: "Luke 5:16",
    addendum: true,
    scripture: "\"But Jesus often withdrew to lonely places and prayed.\" — Luke 5:16",
    paragraphs: [
      "Jesus had unlimited demand on His life. Crowds followed Him everywhere. And yet He withdrew. He set boundaries on access, on timing, and on availability — not because He lacked compassion, but because He understood that unguarded capacity eventually fails everyone.",
      "Without boundaries, capacity leaks. Every unguarded 'yes' drains what should be reserved for the assignment. Leaders who cannot say no do not serve more people — they serve all people poorly. Availability without boundaries is not generosity. It is poor stewardship.",
      "Boundaries protect your energy, your emotional reserves, your time, and your focus. They are not walls of isolation — they are guardrails of sustainability. The leader who guards nothing eventually has nothing left to give.",
    ],
    prompts: [
      "Where is your capacity leaking right now because you have not set a boundary? What specific boundary do you need to establish — and what will it cost you to hold it?",
    ],
  },
  {
    num: 8,
    title: "Physical Health Is Leadership Infrastructure",
    ref: "1 Corinthians 6:19",
    addendum: true,
    scripture: "\"Do you not know that your body is a temple of the Holy Spirit within you, whom you have from God?\" — 1 Corinthians 6:19",
    paragraphs: [
      "Capacity is not only spiritual and emotional. It is physical. The body is the vessel that carries the assignment. Sleep deprivation erodes decision-making. Poor nutrition weakens emotional resilience. Physical neglect shortens longevity and dulls the mind that is supposed to lead with clarity.",
      "You can have a refined character, a clear calling, deep connection, and sharp competency — and still underperform because the body that carries all of it is breaking down. Neglecting your health is poor stewardship of everything the other dimensions built.",
      "Paul understood that the vessel matters: 'I discipline my body and keep it under control, lest after preaching to others I myself should be disqualified.' Physical discipline is not vanity — it is infrastructure. Sleep, nutrition, movement, and recovery are requirements for leaders who want to last.",
    ],
    prompts: [
      "How is your physical health affecting your leadership capacity right now? What one discipline — sleep, nutrition, exercise, or recovery — needs immediate attention?",
    ],
  },
  {
    num: 9,
    title: "Emotional Intelligence Is Developable Capacity",
    ref: "Proverbs 29:11",
    addendum: true,
    scripture: "\"A fool gives full vent to his spirit, but a wise man quietly holds it back.\" — Proverbs 29:11",
    paragraphs: [
      "Emotional intelligence is not a personality trait. It is a learnable, developable capacity that directly determines how much relational weight a leader can carry. Leaders with low emotional intelligence create chaos in every room they enter — regardless of how gifted they are.",
      "Four dimensions expand a leader's emotional capacity: Self-awareness — recognizing your own emotions, triggers, and patterns before they govern behavior. Self-regulation — managing emotional responses under pressure, not suppressing but governing. Empathy — perceiving and honoring what others are experiencing. Relational discernment — navigating complexity in relationships without manipulation, withdrawal, or overreaction.",
      "These are not soft skills. They are the infrastructure that determines whether teams trust you, whether conflict refines or destroys your relationships, and whether your influence grows or contracts under pressure.",
    ],
    prompts: [
      "Which of the four dimensions — self-awareness, self-regulation, empathy, or relational discernment — is your weakest? What would growing in that area change about your leadership in the next 90 days?",
    ],
  },
];

const exemplar = {
  title: "Exemplar: David — Wilderness Refinement",
  subtitle: "David's wilderness years were not wasted — they were the formation ground for everything he would build and sustain.",
  intro: "David was anointed early. He was refined slowly. He endured betrayal, pursuit, injustice, and prolonged delay. The throne did not create David's capacity. The wilderness did. He learned restraint when he had the chance to kill Saul and refused. He learned worship in the depths when Saul hunted him. He later led with the fruit of that refinement: 'With upright heart he shepherded them and guided them with his skillful hand.'",
  intro2: "David's pattern shows us that enlargement always precedes elevation. The wilderness was not a detour from destiny — it was the path to it. What pressure exposed in David, formation resolved. What adversity softened, authority later filled. He emerged from the wilderness with deep reserves — tested character, proven restraint, and a worship vocabulary forged in genuine suffering.",
  pattern: "Anointing → Wilderness → Restraint → Maturity → Stable Leadership",
  lessons: [
    "Capacity is not inherited. It is formed through repeated choices in unseen moments.",
    "What you refuse in the hidden place becomes the evidence of your capacity in the public place.",
    "Bitterness is a capacity problem. The leader who carries wounds that have not been processed will transfer them to their team.",
    "Wilderness deepens worship — or deepens bitterness. The difference is surrender.",
    "Every season of adversity carries embedded wisdom. The leader who extracts the wisdom and releases the pain emerges with more capacity than before.",
  ],
  questions: [
    "Have you learned restraint under provocation — or do you still retaliate when you have the power to?",
    "Has the wilderness deepened your worship or deepened your bitterness? What is the evidence?",
    "Name one wound from your leadership journey that you have not yet fully processed. What is it costing you to carry it unprocessed?",
  ],
};

const stages = [
  {
    title: "Stage 1: Testing (Compression)",
    description: "Pressure reveals internal gaps. God allows strain to expose what cannot sustain promotion. You are reactive, inconsistent, and unable to process adversity without significant disruption. This stage is painful — and essential.",
    markers: ["Reactive under criticism or conflict", "Stress transfers to those closest to you", "Difficulty distinguishing productive pressure from destructive overload"],
  },
  {
    title: "Stage 2: Refinement (Voluntary Surrender)",
    description: "Leaders choose humility, forgiveness, restraint, and obedience. Refinement is voluntary surrender under involuntary pressure. You are naming gaps, seeking formation, and choosing response over reaction.",
    markers: ["Naming specific character gaps without defensiveness", "Seeking formation help — counseling, mentoring, accountability", "Growing awareness of your triggers and default responses"],
  },
  {
    title: "Stage 3: Enlargement (Deepened Capacity)",
    description: "Internal space increases. Emotional resilience deepens. Leaders become harder to shake and slower to react. You are not just surviving pressure — you are metabolizing it. Adversity is producing wisdom, not just scars.",
    markers: ["Consistent practices of rest and spiritual renewal", "Growing ability to process conflict without collapse or avoidance", "Pressure producing refinement, not just reaction"],
  },
];

const commitmentPrompts = [
  { id: "pressure_response",    label: "What Pressure Has Revealed in Me",                                               placeholder: "Name the most significant thing recent pressure has exposed in you — positive or negative..." },
  { id: "forgiveness_decl",     label: "My Forgiveness Declaration (Who do I need to release?)",                        placeholder: "Write a declaration of forgiveness — not for their benefit, but for your freedom..." },
  { id: "restraint_commitment", label: "My Restraint Commitment (Where am I being provoked?)",                          placeholder: "Name where you are being provoked. What specific restraint will you practice instead of reacting?" },
  { id: "renewal_rhythm",       label: "My Renewal Rhythm (How I protect my internal world from erosion)",              placeholder: "What rhythm of rest, worship, or reflection will you establish? Be specific about when and how..." },
  { id: "capacity_next_step",   label: "My Next Step (One action within 7 days to grow internal capacity)",             placeholder: "Name the specific action — not a concept, an action..." },
];

const revisitTriggers = [
  "When new pressure surfaces emotions you thought were resolved",
  "When success begins to inflate your sense of self",
  "When bitterness or offense re-enters your internal world",
  "When you notice yourself reacting instead of responding",
  "When leadership fatigue signals your rhythms have broken down",
  "Quarterly, as a discipline of internal stewardship",
];

const applicationQuestions = [
  "Where has pressure been forming me — and where has it been breaking me?",
  "What must I forgive, release, or surrender to expand my internal capacity this season?",
];

const resources = {
  sectionTitle: "Additional Resources",
  blogs: [
    {
      title: "8 Benefits of the Fire",
      url: "https://awakeningdestiny.global/8-benefits-of-the-fire/",
      description: "Why the refining fire of God is not just about purging sin — it is about preparing you for what is next.",
    },
    {
      title: "6 Steps for Rekindling the Fire",
      url: "https://awakeningdestiny.global/6-steps-for-rekindling-the-fire/",
      description: "Practical steps for embracing the refining fire and the fear of the Lord for sustainable holiness.",
    },
    {
      title: "6 Steps: Fire on the Altar to a River of Fire",
      url: "https://awakeningdestiny.global/6-steps-fire-on-the-altar-to-a-river-of-fire/",
      description: "When fire on the altar of surrender becomes a continuous river from the throne — from visitation to habitation.",
    },
    {
      title: "7 Crucibles of Spiritual Formation",
      url: "https://awakeningdestiny.global/7-crucibles-of-spiritual-formation/",
      description: "The seven formative spaces where God shapes leaders — garden, potter's wheel, waters, fire, threshing floor, pruning, sitting.",
    },
    {
      title: "From Hollow to Hallowed: Restoring Leadership",
      url: "https://awakeningdestiny.global/from-hollow-to-hallowed-restoring-leadership-2/",
      description: "The journey from empty performance to sacred purpose in leadership.",
    },
    {
      title: "Transition and the Victory of the Cornerstone",
      url: "https://awakeningdestiny.global/transition-and-the-victory-of-the-cornerstone/",
      description: "Navigating leadership transitions anchored in Christ as the cornerstone.",
    },
  ],
  links: [
    { title: "Awakening Destiny Global", url: "https://awakeningdestiny.global", description: "Explore additional teaching, prophetic insight, and Kingdom leadership resources." },
  ],
};
var scriptures = {
  intro: "These are your anchor texts on capacity. Return to them when pressure mounts, when restraint is required, when waiting feels long, and when God is enlarging you through testing, humility, endurance, and inner formation.",
  verses: [
    { ref: "Psalm 105:19", text: "The word of the LORD tested him." },
    { ref: "Psalm 78:70-72", text: "Shepherded with upright heart and skillful hand." },
    { ref: "Psalm 78:70", text: "Hidden seasons prepare leaders for public responsibility." },
    { ref: "Psalm 51:10", text: "Create in me a clean heart." },
    { ref: "Psalm 4:1", text: "God enlarges us internally in seasons of distress." },
    { ref: "1 Samuel 16:13", text: "Anointed early. Appointed later." },
    { ref: "1 Samuel 24:4-7", text: "Restraint under provocation." },
    { ref: "1 Samuel 24:6", text: "Restraint protects future authority and reveals maturity." },
    { ref: "Genesis 50:20", text: "You meant evil, but God meant it for good." },
    { ref: "Proverbs 16:18", text: "Pride goes before destruction." },
    { ref: "Proverbs 15:33", text: "Humility prepares the leader for true honor." },
    { ref: "Romans 5:3-5", text: "Suffering produces endurance, character, and hope." },
    { ref: "Romans 5:1-5", text: "Pressure produces perseverance, proven character, and hope." },
    { ref: "James 1:2-4", text: "Testing produces steadfastness." },
    { ref: "James 1:2-8", text: "Trials develop endurance, wisdom, and maturity." },
    { ref: "Philippians 4:11-13", text: "I have learned to be content in every circumstance." },
    { ref: "1 Peter 5:6-11", text: "Humility, suffering, and steadfastness strengthen leaders over time." },
  ],
};
 
const config = {
  moduleNum: 4,
  title: "Capacity",
  subtitle: "Character (Sustainability)",
  question: "Can I sustain what I'm building?",
  accent: "#F47722",
  accentLight: "#FFF4EC",
  accentMid: "#F47722",
  activationText: "Many leaders rise quickly. Few leaders endure deeply. Capacity is what keeps leaders standing when pressure increases. It is the internal enlargement of character, resilience, humility, and emotional stability that enables a leader to sustain pressure, influence, responsibility, and growth. Without capacity, success destroys what calling began. God enlarges internally before expanding externally. Distress precedes expansion — and that is not punishment. It is mercy.",
  activationPrompts: [
    "When was the last time pressure revealed something in you that you didn't know was there — good or bad? What did it expose?",
    "Where in your leadership right now are you carrying more than your character can sustain? Be honest about the weight.",
  ],
  diagnostic,
  principles,
  exemplar,
  stages,
  commitmentPrompts,
  revisitTriggers,
  applicationQuestions,
  aiPromptContext: "This leader has completed Module 4: Capacity of the 5C Leadership Blueprint. Analyze their responses focusing on: (1) the honesty of their self-assessment about how pressure reveals their character, (2) the specific wound they have named and the cost of carrying it unprocessed, (3) the health and sustainability of their stated rhythms, and (4) the evidence of genuine formation through adversity. Be direct, compassionate where needed, and prophetically precise.",
  resources, scriptures: scriptures,
  learningObjectives: [
    "Assess your current capacity honestly — not what you wish you could carry, but what you are actually sustaining without breaking down.",
    "Identify which crucible of spiritual formation you are currently in, and understand what God is building in you through it.",
    "Recognize the difference between being busy and being fruitful — and where overextension is masquerading as faithfulness in your life.",
    "Develop a sustainable rhythm of rest, renewal, and re-engagement that protects your long-term effectiveness rather than sacrificing it for short-term output.",
    "Understand that character is the container for capacity — and that God will not entrust you with more than your character can hold.",
  ],
  keyTakeaways: [
    "Capacity is not about doing more. It is about sustaining what you have been entrusted with without collapse. The question is not how much you can start — it is how much you can finish.",
    "The fire of God is not punishment. It is preparation. Every crucible — the garden, the potter's wheel, the waters, the fire, the threshing floor, the pruning, the sitting — is forming something in you that platform cannot produce.",
    "You will not know your true value until you allow the fires of formation to work in your life. Gold and silver are not valued until they have been through the refining process.",
    "Burnout is not a badge of honor. It is a structural failure. Leaders who equate exhaustion with faithfulness are building on a foundation that will not hold.",
    "Rest is not the absence of work. It is the presence of trust. The leader who cannot rest cannot hear — and the leader who cannot hear will eventually build the wrong thing.",
  ],
  contrastTable: {
    title: "Two Responses to Pressure",
    leftTitle: "Reactive Leader",
    rightTitle: "Refined Leader",
    rows: [
      ["Collapses under criticism", "Remains steady under criticism"],
      ["Retaliates when betrayed", "Forgives and reinterprets through providence"],
      ["Reacts impulsively under pressure", "Responds with restraint and wisdom"],
      ["Hardens through adversity", "Softens and deepens through adversity"],
      ["Success inflates ego", "Success deepens humility"],
      ["Transfers stress onto others", "Absorbs pressure without transferring it"],
      ["Avoids conflict", "Handles conflict with maturity"],
      ["Burns out and blames others", "Builds rhythms that sustain endurance"],
    ],
  },

  activationPrayer: {
    theme: 'Strength & Endurance',
    context: 'When you are stretched, pressured, or fatigued',
    scriptures: [
      { ref: 'Colossians 1:11', text: '...strengthened with all might, according to His glorious power...' },
      { ref: 'Isaiah 40:31', text: 'But those who wait on the Lord shall renew their strength...' },
      { ref: '2 Corinthians 4:16', text: '...the inward man is being renewed day by day.' },
      { ref: 'James 1:2-4', text: 'Count it all joy... knowing that the testing of your faith produces patience. But let patience have its perfect work...' },
    ],
    prayer: `Father, strengthen me with all might according to Your glorious power. Let endurance and patience be established in me with joy — not striving.\n\nAs I wait on You, renew my strength. Let me run and not be weary. Let me walk and not faint.\n\nIn every trial, produce steadfastness in me. Let patience have its perfect work so I am complete, lacking nothing.\n\nThough outwardly I feel pressure, inwardly renew me day by day. Increase my capacity to carry what You have entrusted to me.\n\nStretch me — but do not break me. Expand me — but do not overwhelm me.\n\nI decree that I am strengthened, sustained, and expanded by Your power.`,
  },
};

export default function CapacityModule() {
  return (
    <>
      <Head>
        <title>Capacity | 5C Leadership Blueprint</title>
        <meta name="description" content="Module 4: Build the character and sustainability to carry your calling for the long haul." />
        <meta property="og:title" content="Capacity | 5C Leadership Blueprint" />
        <meta property="og:description" content="Module 4: Build the character and sustainability to carry your calling for the long haul." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://5cblueprint.awakeningdestiny.global/modules/capacity" />
        <meta property="og:site_name" content="5C Leadership Blueprint" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Capacity | 5C Leadership Blueprint" />
        <meta name="twitter:description" content="Module 4: Build the character and sustainability to carry your calling for the long haul." />
      </Head>
      <ModuleTemplate config={config} />
    </>
  );
}