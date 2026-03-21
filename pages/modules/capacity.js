// pages/modules/capacity.js
import Head from "next/head";
import ModuleTemplate from "../../components/ModuleTemplate";

const diagnostic = [
  { num: 1,  cat: "Pressure Response",   text: "I remain stable under criticism without retaliating or shutting down.", ref: "Psalm 105:19" },
  { num: 2,  cat: "Pressure Response",   text: "I can distinguish between productive pressure and destructive overload." },
  { num: 3,  cat: "Pressure Response",   text: "I have been tested under significant adversity — and it deepened me rather than hardened me.", ref: "James 1:2–4" },
  { num: 4,  cat: "Emotional Maturity",  text: "I have forgiven the people and situations that have wounded me in leadership." },
  { num: 5,  cat: "Emotional Maturity",  text: "I do not transfer stress onto my team, family, or closest relationships." },
  { num: 6,  cat: "Emotional Maturity",  text: "I handle conflict directly and maturely instead of avoiding or overreacting." },
  { num: 7,  cat: "Character Depth",     text: "Success has not inflated my ego — it has deepened my dependence on God.", ref: "Proverbs 15:33" },
  { num: 8,  cat: "Character Depth",     text: "My private life has the same integrity as my public life." },
  { num: 9,  cat: "Character Depth",     text: "I carry wisdom from my past wounds — not bitterness or offense.", ref: "Psalm 4:1" },
  { num: 10, cat: "Rhythm & Endurance",  text: "I have built rhythms of rest, renewal, and recovery into my leadership." },
  { num: 11, cat: "Rhythm & Endurance",  text: "I can carry more now than one year ago — because I have been formed, not just hardened." },
  { num: 12, cat: "Rhythm & Endurance",  text: "I have a clear understanding of what depletes me and what restores me.", ref: "Psalm 78:70" },
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
    prompt: "What has recent pressure revealed in you that needs refining? Name it honestly — not the external circumstance, but the internal response it exposed.",
  },
  {
    num: 2,
    title: "Hidden Seasons Enlarge Internal Strength",
    ref: "Psalm 78:70",
    scripture: "\"He chose David his servant and took him from the sheepfolds.\" — Psalm 78:70",
    paragraphs: [
      "David was anointed early. He was appointed much later. The wilderness between anointing and throne built capacity. Hidden seasons train private discipline, strengthen unseen obedience, deepen worship, expose character gaps, and build emotional endurance.",
      "Public authority without private depth collapses under strain. The leader who moves from affirmation to affirmation without ever sitting with hiddenness has never been tested in the place where their foundations matter most.",
      "Hidden seasons are not divine delay. They are divine enlargement. The roots grow deepest when the tree is not yet visible. And it is the depth of the root system that determines what the tree can carry when the storm comes.",
    ],
    prompt: "What hidden season are you in right now, or have recently come through? What did God build in you that would not have been built any other way?",
  },
  {
    num: 3,
    title: "Humility Precedes Honor",
    ref: "Proverbs 15:33",
    scripture: "\"Before honor comes humility.\" — Proverbs 15:33",
    paragraphs: [
      "Capacity and humility are inseparable. Every expansion of influence must be matched by a corresponding deepening of surrender. The leader who grows in platform without growing in humility becomes increasingly dangerous — not because of their power, but because of their blindness.",
      "Success is one of the greatest tests of capacity. Adversity reveals fragility. Success reveals pride. Many leaders survive their failures but are ultimately undone by their successes. Capacity to handle honor is rarer than capacity to handle hardship.",
      "Humility is not self-deprecation. It is accurate self-assessment in light of God's grace. The humble leader knows what they carry — and knows clearly that they did not produce it themselves. That knowledge keeps them safe in seasons of high visibility.",
    ],
    prompt: "Where has success most recently threatened your humility? What did it reveal about the posture of your heart?",
  },
  {
    num: 4,
    title: "Rhythms Sustain What Intensity Builds",
    ref: "Matthew 11:28–30",
    scripture: "\"Come to Me, all who labor and are heavy laden, and I will give you rest.\" — Matthew 11:28–30",
    paragraphs: [
      "Intensity builds. Rhythms sustain. The leader who can only function in sprint mode will eventually collapse — not from lack of calling or capacity, but from lack of restoration. Without renewal, the leader draws down from what they have accumulated. Eventually, the account empties.",
      "Rest is not a reward for the finished. It is a weapon against the unsustainable. Leaders who build rest, renewal, and recovery into their rhythms are not less productive — they are more sustainable. They run the race that endures, not just the sprint that impresses.",
      "The yoke of Christ is easy and His burden is light — not because the assignment is trivial, but because the pace is sustainable. The invitation to rest is not an invitation to lesser leadership. It is the path to lasting leadership.",
    ],
    prompt: "What rhythms of rest and renewal have you built into your leadership? Are they genuine restoration, or are they simply scheduled pauses between sprints?",
  },
];

const exemplar = {
  title: "Exemplar: David — Capacity Forged in the Wilderness",
  subtitle: "David's wilderness years were not wasted — they were the formation ground for everything he would build and sustain.",
  intro: "David was prepared for the throne in the wilderness, not in a palace. He fought lions and bears alone, before he fought Goliath publicly. He learned to worship under rejection, before he led others in worship. He developed emotional depth in hiddenness — and that depth sustained him through every subsequent pressure.",
  intro2: "When Saul threw his spear, David didn't retaliate. When he had the opportunity to kill Saul and seize the throne early, he refused — not because he lacked the strength, but because he had developed the internal capacity to wait on God's timing. That restraint was the evidence of deep formation. Capacity is not just what you can endure. It is what you can refuse.",
  lessons: [
    "Capacity is not inherited. It is formed through repeated choices in unseen moments.",
    "What you refuse in the hidden place becomes the evidence of your capacity in the public place.",
    "Emotional depth — the ability to feel fully and remain stable — is the mark of the refined leader.",
    "Bitterness is a capacity problem. The leader who carries wounds that have not been processed will transfer them to their team.",
    "Every wilderness experience carries embedded wisdom. The leader who extracts the wisdom and releases the pain emerges with more capacity than before.",
  ],
  questions: [
    "What is your current equivalent of the wilderness — the hidden, pressure-filled context that is forming you right now?",
    "Name one wound from your leadership journey that you have not yet fully processed. What is it costing you to carry it unprocessed?",
  ],
};

const stages = [
  {
    title: "Stage 1: Overwhelm (Compression)",
    description: "The pressure exceeds your current capacity. You are reactive, inconsistent, and unable to process adversity without significant disruption. This stage is painful — and it is also essential. You cannot expand what has not been pressed.",
    markers: ["Reactive under criticism or conflict", "Stress transfers to those closest to you", "Difficulty distinguishing productive pressure from destructive overload"],
  },
  {
    title: "Stage 2: Awareness (Exposure)",
    description: "You are beginning to see what pressure is revealing in you. This is the stage of painful but productive self-awareness. You can name what has been hidden. You are no longer surprised by what emerges under pressure — you are working on it.",
    markers: ["Naming specific character gaps without defensiveness", "Beginning to seek formation help — counseling, mentoring, accountability", "Increasing awareness of your triggers and default responses"],
  },
  {
    title: "Stage 3: Rhythm (Sustainability)",
    description: "You have built patterns that sustain your capacity. Rest, renewal, and recovery are built into your life. You are not just surviving pressure — you are metabolizing it. Adversity is producing wisdom, not just scars.",
    markers: ["Consistent practices of rest and spiritual renewal", "Growing ability to process conflict without collapse or avoidance", "Pressure is producing refinement, not just reaction"],
  },
  {
    title: "Stage 4: Endurance (Formation)",
    description: "Your capacity has been tested, enlarged, and proven over time. You carry genuine wisdom from genuine trial. You lead with a steadiness that can only come from having survived significant pressure without losing your integrity or identity.",
    markers: ["Calm under pressure that others find stabilizing", "Deep reserves of tested character", "Ability to absorb adversity without transferring it to your team or family"],
  },
];

const commitmentPrompts = [
  { id: "pressure_response",    label: "My Default Response to Pressure (What does pressure reveal in me?)",        placeholder: "Be honest about how you actually respond when the weight increases..." },
  { id: "wound_to_process",     label: "The Wound I Am Carrying That Must Be Processed",                            placeholder: "Name one wound — relational, professional, or personal — that you have not yet fully surrendered..." },
  { id: "rhythm_design",        label: "My Sustainable Rhythm (How I sustain capacity over time)",                  placeholder: "Describe your specific practices of rest, renewal, and recovery..." },
  { id: "character_gap",         label: "The Character Gap Pressure Has Revealed",                                   placeholder: "Name the specific internal gap — pride, fear, control, insecurity — that pressure has exposed..." },
  { id: "enlargement_evidence", label: "How God Has Enlarged Me Through Adversity",                                 placeholder: "Describe what God has built in you through a hidden or difficult season..." },
];

const revisitTriggers = [
  "When a season of significant pressure begins",
  "When you notice your emotional responses have become disproportionate",
  "When rest has been absent from your rhythms for more than a few weeks",
  "When someone close to you reflects that you seem depleted or reactive",
  "When bitterness, resentment, or cynicism begins to color your leadership",
  "When a new season of growth is creating compression you haven't experienced before",
];

const applicationQuestions = [
  "What is one rhythm of restoration you will build into the next 30 days — not someday, but now?",
  "Who will you give permission to speak honestly to you when they see your capacity being depleted?",
];

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
  aiPromptContext: "This leader has completed Module 4: Capacity of the 5C Leadership Blueprint. Analyze their responses focusing on: (1) the honesty of their self-assessment about how pressure reveals their character, (2) the specific wound they have named and the cost of carrying it unprocessed, (3) the health and sustainability of their stated rhythms, and (4) the evidence of genuine formation through adversity versus managed performance. Be direct, compassionate where needed, and prophetically precise.",
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
};

export default function CapacityModule() {
  return (
    <>
      <Head><title>Capacity | 5C Leadership Blueprint</title></Head>
      <ModuleTemplate config={config} />
    </>
  );
}
