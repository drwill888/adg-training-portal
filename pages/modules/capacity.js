// ═══════════════════════════════════════════════════════════════
// MODULE 4: CAPACITY — Character (Sustainability)
// 5C Leadership Blueprint · Awakening Destiny Global
// Pages Router: pages/modules/capacity.js
// ═══════════════════════════════════════════════════════════════
import { useState, useEffect, useRef } from "react";
import Head from "next/head";

// ─── BRAND PALETTE ───────────────────────────────────────────
const NAVY    = "#021A35";
const GOLD    = "#FDD20D";
const GOLD_D  = "#C8A951";
const BLUE    = "#0172BC";
const SKY     = "#00AEEF";
const ORANGE  = "#F47722";
const RED     = "#EE3124";
const CREAM   = "#FDF8F0";
// Module 4 accent = Sky
const ACCENT       = SKY;
const ACCENT_LIGHT = "#E0F7FD";
const ACCENT_MID   = "#67D0EC";

// ─── DIAGNOSTIC DATA ─────────────────────────────────────────
const capacityDiagnostic = [
  { num: 1,  cat: "Character Foundation",      text: "My private character matches the weight of my public assignment.", ref: "2 Peter 1:5\u20138" },
  { num: 2,  cat: "Character Foundation",      text: "I lead from integrity even when no one is watching." },
  { num: 3,  cat: "Character Foundation",      text: "I can identify the areas of my character still under construction." },
  { num: 4,  cat: "Emotional Reserves",        text: "I am aware of my personal depletion warning signs before I crash.", ref: "1 Kings 19:4\u20138" },
  { num: 5,  cat: "Emotional Reserves",        text: "I have the internal reserves to handle unexpected pressure without becoming reactive." },
  { num: 6,  cat: "Emotional Reserves",        text: "I process disappointment and failure in healthy, constructive ways." },
  { num: 7,  cat: "Rhythm & Renewal",          text: "I practice consistent rhythms of rest that protect my long-term capacity.", ref: "Genesis 2:2\u20133" },
  { num: 8,  cat: "Rhythm & Renewal",          text: "I have disciplines of spiritual renewal that restore, not just maintain, my strength." },
  { num: 9,  cat: "Rhythm & Renewal",          text: "I know when to say no, and I say it without guilt or overcorrection." },
  { num: 10, cat: "Sustained Endurance",       text: "I have grown through adversity without becoming bitter, cynical, or closed.", ref: "James 1:2\u20134" },
  { num: 11, cat: "Sustained Endurance",       text: "I have evidence that my capacity has expanded through tested seasons." },
  { num: 12, cat: "Sustained Endurance",       text: "I am building for the next decade, not just surviving the next quarter." },
];

// ─── STEPS ───────────────────────────────────────────────────
const STEPS = [
  { id: "activation",      label: "Activation" },
  { id: "pre-diagnostic",  label: "Pre-Diagnostic" },
  { id: "teaching",        label: "Core Teaching" },
  { id: "exemplar",        label: "Exemplar" },
  { id: "stages",          label: "Stages" },
  { id: "post-diagnostic", label: "Post-Diagnostic" },
  { id: "commitment",      label: "Commitment" },
  { id: "summary",         label: "AI Blueprint" },
];

// ─── HIGH OUTPUT vs. SUSTAINABLE LEADERSHIP CONTRAST ────────
const CONTRAST_TABLE = [
  { dimension: "Foundation",          left: "Gifting and momentum",               right: "Character and discipline" },
  { dimension: "Pace",                left: "Sprint until collapse",               right: "Sustainable rhythm" },
  { dimension: "Response to Pressure",left: "Reactive and destabilized",           right: "Anchored and composed" },
  { dimension: "Rest",                left: "A reward you haven\u2019t earned yet", right: "A discipline that expands capacity" },
  { dimension: "Failure",             left: "Identity threat",                     right: "Formation opportunity" },
  { dimension: "Strength Source",     left: "External validation",                 right: "Internal conviction" },
  { dimension: "Longevity",           left: "Dependent on circumstances",          right: "Built through endurance" },
  { dimension: "Under Load",          left: "Compensate with more effort",         right: "Draw from deeper reserves" },
  { dimension: "Legacy",              left: "What you built before burning out",   right: "What you sustained for decades" },
];

// ─── 4 GOVERNING PRINCIPLES ─────────────────────────────────
const PRINCIPLES = [
  {
    num: 1, title: "Character Determines Carrying Capacity", ref: "2 Peter 1:5\u20138",
    scripture: "\u201CMake every effort to add to your faith goodness; and to goodness, knowledge; and to knowledge, self-control; and to self-control, perseverance.\u201D \u2014 2 Peter 1:5\u20136",
    paragraphs: [
      "You cannot carry beyond what your character can hold. Gifting may open doors, but character determines how long you stay in the room. Leaders who build faster than they form will eventually fracture under the weight of what they\u2019ve built.",
      "Peter\u2019s list is not a ladder to climb once. It is a chain \u2014 each quality reinforcing and enabling the next. Faith without goodness collapses under moral pressure. Goodness without self-control becomes erratic under load. Self-control without perseverance breaks in sustained hardship. Capacity is not built in a moment. It is forged link by link.",
      "The question is not whether your vision is large enough. The question is whether your character is deep enough to sustain it. Vision without character is a building without foundation \u2014 spectacular until the first real storm."
    ],
    prompt: "Where is your character still catching up to your calling? What does your private life reveal about your actual carrying capacity?"
  },
  {
    num: 2, title: "Rhythm Protects What Vision Depletes", ref: "Genesis 2:2\u20133; Mark 6:31",
    scripture: "\u201CBy the seventh day God had finished the work he had been doing; so on the seventh day he rested from all his work.\u201D \u2014 Genesis 2:2",
    paragraphs: [
      "God did not rest because He was tired. He rested because rhythm is a creation principle. What He built into the cosmos, He built into leadership: seasons of intense output must be followed by seasons of intentional renewal. Leaders who ignore this don\u2019t just get tired \u2014 they get brittle.",
      "Jesus pulled his disciples away from the crowds \u2014 \u201CCome away by yourselves to a desolate place and rest a while.\u201D (Mark 6:31) This was not indulgence. It was strategy. A depleted leader makes depleted decisions, leads depleted teams, and builds depleted culture.",
      "Rest is not the absence of work. It is the practice of trusting God with what you cannot control while your body and soul recover. Leaders who cannot rest are leaders who do not yet fully trust. Rhythm is an act of faith as much as it is a discipline of sustainability."
    ],
    prompt: "What rhythms of rest and renewal are currently missing from your life? What is your depletion costing your leadership and the people around you?"
  },
  {
    num: 3, title: "Trials Develop What Comfort Cannot", ref: "James 1:2\u20134",
    scripture: "\u201CConsider it pure joy, my brothers and sisters, whenever you face trials of many kinds, because you know that the testing of your faith produces perseverance.\u201D \u2014 James 1:2\u20133",
    paragraphs: [
      "Capacity is not handed to you \u2014 it is developed through tested seasons. The Greek word for \u201Ctesting\u201D (dokimi\u014D) carries the image of assaying metal under heat. What survives is refined, not diminished. The trial does not remove capacity \u2014 it reveals and expands it.",
      "Comfort preserves what you have. Adversity produces what you need. Leaders who spend their energy avoiding difficulty are actually spending their energy avoiding formation. The hardest seasons of your leadership are not interruptions to your development \u2014 they are the curriculum.",
      "The promise of James 1 is not that trials are pleasant. It is that trials are productive. Perseverance, when it has done its full work, produces completeness \u2014 a leader who lacks nothing. That is a different kind of strength than talent or gifting can produce."
    ],
    prompt: "What trial are you currently in? What is God developing in you through it that could not be produced any other way?"
  },
  {
    num: 4, title: "Weakness Surrendered Becomes Sustainable Strength", ref: "2 Corinthians 12:9\u201310",
    scripture: "\u201CMy grace is sufficient for you, for my power is made perfect in weakness.\u201D \u2014 2 Corinthians 12:9",
    paragraphs: [
      "Paul asked three times for his thorn to be removed. God said no. Not because God was indifferent, but because the weakness was producing something the absence of weakness could not: a capacity rooted in grace rather than giftedness, in dependence rather than self-reliance.",
      "The leader who has never hit a wall has never discovered what is on the other side of the wall. There is a kind of strength \u2014 sustainable, unshakeable, humble strength \u2014 that is only accessed through acknowledged limitation. \u201CWhen I am weak, then I am strong.\u201D This is not paradox. It is the physics of the Kingdom.",
      "Capacity built on your own resources will always have a ceiling. Capacity built through surrendered weakness taps into an inexhaustible source. The most durable leaders are not the most naturally gifted \u2014 they are the most dependent on God through the most tested seasons."
    ],
    prompt: "Where have you been trying to compensate for weakness rather than surrendering it to God? What would it look like to lead from acknowledged limitation rather than hidden depletion?"
  }
];

// ─── EXEMPLAR: ELIJAH ────────────────────────────────────────
const EXEMPLAR = {
  name: "Elijah", title: "The Collapsed Prophet", refs: "1 Kings 18\u201319; James 5:17",
  intro: "Elijah called fire from heaven on Mount Carmel. Then, within twenty-four hours, he was under a juniper tree asking God to let him die. This is the most honest portrait of capacity failure in Scripture \u2014 and God\u2019s response is the most instructive.",
  mainScripture: "\u201CHe himself went a day\u2019s journey into the wilderness and came and sat down under a juniper tree. And he asked that he might die, saying, \u2018It is enough; now, O Lord, take away my life.\u2019\u201D \u2014 1 Kings 19:4",
  bodyParagraphs: [
    "Elijah did not collapse because he lacked faith. He collapsed because he lacked reserves. He had poured everything into a singular confrontation of national magnitude \u2014 and there was nothing left. The victory depleted him as much as the battle would have.",
    "God\u2019s response is striking in what it does not include: no rebuke, no urgency, no assignment. Just food, water, and rest. Twice. The angel said, \u201CArise and eat, for the journey is too great for you.\u201D God\u2019s first answer to depletion was not a word. It was a meal and a nap.",
    "Then, at Horeb, came the still small voice. Not the wind. Not the earthquake. Not the fire. The voice came after the noise settled. Elijah\u2019s renewed capacity was not produced by his effort. It was produced by God\u2019s provision in the place of his honest collapse.",
  ],
  arc: [
    { stage: "Peak Output", text: "Carmel was a high-water mark \u2014 supernatural faith, public confrontation, national breakthrough. But even peak moments consume reserves." },
    { stage: "Depletion", text: "Jezebel\u2019s threat broke what Baal\u2019s prophets couldn\u2019t. One threatening voice after a season of maximum output sent him running." },
    { stage: "Collapse & Honesty", text: "He didn\u2019t perform his way through the crash. He told the truth. \u201CIt is enough.\u201D Honest collapse is the beginning of real renewal." },
    { stage: "God\u2019s Response", text: "Rest, food, and presence. Then a new direction. God met his capacity crisis with practical care, not theological correction." },
    { stage: "Renewed Assignment", text: "Out of Horeb came a new mandate. Elisha. A successor. Multiplication. Elijah\u2019s capacity was not just restored \u2014 it was redirected toward legacy." },
  ],
  coachingQuestions: [
    "Where are you currently running on empty while still performing at full volume?",
    "Have you allowed yourself to be honest about your depletion \u2014 with God, with yourself, with anyone?",
    "What would it mean for you to sit under the juniper tree and let God meet you there instead of pushing through?",
  ]
};

// ─── THREE STAGES ────────────────────────────────────────────
const STAGES = [
  { name: "Overloaded", description: "Carrying more than your character can sustain. Driven by ambition, obligation, or the fear of disappointing others. Output is high; reserves are low. Warning signs are present but being overridden. Burnout is not a question of if \u2014 only when.", ref: "1 Kings 19:4", marker: "You stop performing through exhaustion and start telling the truth about your depletion." },
  { name: "Calibrated", description: "Learning to match your load to your actual capacity. Establishing rhythms of rest. Identifying depletion triggers. Building structures that protect your reserves. Saying no to things that are good so you can say yes to things that are yours.", ref: "Mark 6:31", marker: "You stop treating rest as weakness and start treating it as stewardship." },
  { name: "Expanded", description: "Capacity has grown through tested character and intentional renewal. You carry more without breaking because you\u2019ve been broken and rebuilt. Sustainability is not just a goal \u2014 it is a practice. You are building for decades, not just seasons.", ref: "James 1:4", marker: "You lead others through capacity crises because you have navigated your own with wisdom." }
];

// ─── KEY SCRIPTURES ──────────────────────────────────────────
const KEY_SCRIPTURES = [
  { ref: "2 Peter 1:5\u20138",        note: "Character layers that build sustainable capacity." },
  { ref: "1 Kings 19:4\u20138",       note: "God\u2019s response to depletion: rest, food, presence." },
  { ref: "James 1:2\u20134",          note: "Tested faith produces perseverance and completeness." },
  { ref: "2 Corinthians 12:9\u201310", note: "Weakness surrendered becomes sustainable strength." },
  { ref: "Isaiah 40:31",             note: "Waiting on the Lord renews strength." },
  { ref: "Genesis 2:2\u20133",        note: "Rest is a creation principle, not a reward." },
  { ref: "Mark 6:31",                note: "Come away and rest \u2014 Jesus\u2019 strategy, not an afterthought." },
  { ref: "Galatians 6:9",            note: "Do not grow weary in doing good." },
  { ref: "Hebrews 12:1\u20132",       note: "Run with endurance, eyes on the Author and Finisher." },
  { ref: "2 Corinthians 4:8\u20139",  note: "Hard-pressed but not crushed \u2014 the anatomy of endurance." },
];

// ─── MACRO / MICRO ────────────────────────────────────────────
const MACRO_MICRO = {
  macro: { title: "Macro \u2014 Character (Lifetime)", description: "Your character reservoir \u2014 the accumulated depth of integrity, emotional maturity, and spiritual formation built through decades of tested obedience. This is what determines your ultimate carrying capacity. It doesn\u2019t change overnight; it grows through sustained, faithful development." },
  micro: { title: "Micro \u2014 Current Load (Season)", description: "The specific weight you are carrying right now. Every season brings new demands on your reserves. The critical question: Does your current capacity match your current assignment? Or are you carrying more than your character can sustainably hold?" }
};

// ─── COMMITMENT / REVISIT / APPLICATION ──────────────────────
const COMMITMENT_PROMPTS = [
  { id: "load",          label: "1. My Current Load Assessment",   placeholder: "What are you carrying right now? List the assignments, responsibilities, and pressures that are drawing from your reserves." },
  { id: "gap",           label: "2. My Capacity Gap",              placeholder: "Where is your character not yet matching your assignment? Be specific about what is being exposed under pressure." },
  { id: "rhythm",        label: "3. My Rhythm Commitment",         placeholder: "What specific rhythm of rest and renewal will you establish? Name the day, the practice, the non-negotiable." },
  { id: "warning",       label: "4. My Depletion Warning Signs",   placeholder: "What are your first indicators that your reserves are running low? What do people close to you notice before you do?" },
  { id: "expansion",     label: "5. My Capacity Expansion Plan",   placeholder: "What trial or discipline are you embracing this season to expand your capacity? What is God building in you through it?" },
  { id: "accountability",label: "6. My Accountability",            placeholder: "Who in your life has full permission to speak to your capacity \u2014 honestly, without you managing the narrative?" },
];
const REVISIT_TRIGGERS = [
  "When you feel yourself operating in survival mode instead of sustainable rhythm",
  "When you notice yourself becoming reactive, withdrawn, or emotionally flat",
  "When you are consistently dreading what you once loved",
  "When your private world is deteriorating while your public output holds steady",
  "When rest feels like failure instead of faithfulness",
  "Quarterly, as a discipline of honest self-assessment",
];
const APPLICATION_QUESTIONS = [
  "What am I currently carrying that was never mine to carry?",
  "Where is my pace outrunning my character \u2014 and what is the cost to the people around me?",
  "What one rhythm change this week would most protect my long-term capacity?",
];


// ═══════════════════════════════════════════════════════════════
// WORD DOC DOWNLOAD
// ═══════════════════════════════════════════════════════════════
function downloadWordDoc(title, responses, commitments, preScores, postScores, diagnostic, aiSummary) {
  const now = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const scoreRows = diagnostic.map(q => `<tr><td style="padding:6px;border:1px solid #ccc;font-size:11px;">${q.num}</td><td style="padding:6px;border:1px solid #ccc;font-size:11px;">${q.text}</td><td style="padding:6px;border:1px solid #ccc;text-align:center;font-size:11px;">${preScores[q.num]||"-"}</td><td style="padding:6px;border:1px solid #ccc;text-align:center;font-size:11px;">${postScores[q.num]||"-"}</td></tr>`).join("");
  const respEntries = Object.entries(responses).filter(([,v])=>v).map(([k,v])=>`<p style="margin:4px 0;"><b>${k}:</b> ${v}</p>`).join("");
  const commitEntries = Object.entries(commitments).filter(([,v])=>v).map(([k,v])=>`<p style="margin:4px 0;"><b>${k}:</b> ${v}</p>`).join("");
  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>${title}</title><style>body{font-family:Georgia,serif;color:#1a1a1a;max-width:700px;margin:0 auto;padding:40px 20px}h1{color:#021A35;font-size:22px;border-bottom:3px solid #C8A951;padding-bottom:8px}h2{color:#021A35;font-size:16px;margin-top:24px;border-bottom:1px solid #ddd;padding-bottom:4px}p{font-size:12px;line-height:1.6}table{border-collapse:collapse;width:100%;margin:12px 0}th{background:#021A35;color:#fff;padding:8px;font-size:11px;text-align:left}td{font-size:11px}.footer{margin-top:40px;border-top:2px solid #C8A951;padding-top:12px;font-size:10px;color:#888;text-align:center}</style></head><body><h1>5C Leadership Blueprint \u2014 ${title}</h1><p style="color:#888;">Awakening Destiny Global \u2022 ${now}</p><h2>Diagnostic Scores</h2><table><tr><th>#</th><th>Statement</th><th>Pre</th><th>Post</th></tr>${scoreRows}</table><p><b>Pre-Total:</b> ${Object.values(preScores).reduce((a,b)=>a+b,0)}/60 &nbsp;&nbsp; <b>Post-Total:</b> ${Object.values(postScores).reduce((a,b)=>a+b,0)}/60</p>${respEntries?`<h2>Reflections</h2>${respEntries}`:""}${commitEntries?`<h2>Commitments</h2>${commitEntries}`:""}${aiSummary?`<h2>My ${title} Blueprint</h2><p>${aiSummary.replace(/\n\n/g,"</p><p>")}</p>`:""}<div class="footer"><p>\u00A9 Awakening Destiny Global \u2022 awakeningdestiny.global</p><p>5C Leadership Blueprint \u2014 Developing Leaders \u2022 Creating Champions</p></div></body></html>`;
  const blob = new Blob(["\ufeff", html], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = `My_${title.replace(/\s+/g,"_")}_Blueprint.doc`; document.body.appendChild(a); a.click(); document.body.removeChild(a); setTimeout(() => URL.revokeObjectURL(url), 250);
}


// ═══════════════════════════════════════════════════════════════
// CAPACITY PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function CapacityPage() {
  const [step, setStep] = useState(0);
  const [preScores, setPreScores] = useState({});
  const [postScores, setPostScores] = useState({});
  const [responses, setResponses] = useState({});
  const [commitments, setCommitments] = useState({});
  const [aiSummary, setAiSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [expandedPrinciple, setExpandedPrinciple] = useState(null);
  const topRef = useRef(null);

  useEffect(() => { topRef.current?.scrollIntoView({ behavior: "smooth" }); }, [step]);
  const currentStep = STEPS[step];
  const setScore = (target, num, val) => { if (target === "pre") setPreScores(p => ({ ...p, [num]: val })); if (target === "post") setPostScores(p => ({ ...p, [num]: val })); };
  const totalScore = (obj) => Object.values(obj).reduce((a, b) => a + b, 0);
  const getInterp = (t) => {
    if (t >= 50) return { text: "Strong sustainability. Deepen and protect.", color: ACCENT };
    if (t >= 40) return { text: "Developing rhythms. Strengthen character and reserves.", color: ORANGE };
    if (t >= 30) return { text: "Emerging awareness. Capacity development is urgent.", color: RED };
    return { text: "High output, low reserves. Crisis is building without intervention.", color: "#991B1B" };
  };

  const generateSummary = async () => {
    setLoading(true);
    try {
      const prompt = `You are a Kingdom leadership coach analyzing a leader's Capacity diagnostic and reflections from the 5C Leadership Blueprint by Awakening Destiny Global.

MODULE: Capacity — Character (Sustainability)
CENTRAL QUESTION: "Can I sustain what I've been called to carry?"

PRE-DIAGNOSTIC SCORES:
${capacityDiagnostic.map(q => `${q.num}. ${q.text} — Score: ${preScores[q.num] || "N/A"}/5`).join("\n")}
Pre-Total: ${totalScore(preScores)}/60

POST-DIAGNOSTIC SCORES:
${capacityDiagnostic.map(q => `${q.num}. ${q.text} — Score: ${postScores[q.num] || "N/A"}/5`).join("\n")}
Post-Total: ${totalScore(postScores)}/60

REFLECTION RESPONSES:
${Object.entries(responses).map(([k, v]) => `${k}: ${v}`).join("\n\n")}

COMMITMENTS:
${Object.entries(commitments).map(([k, v]) => `${k}: ${v}`).join("\n\n")}

Write a personalized Capacity Blueprint (400-500 words) that:
1. Identifies their strongest and most vulnerable diagnostic categories
2. Names the shift between pre and post scores
3. Addresses their current load and capacity gap
4. Speaks directly to their depletion warning signs and rhythm commitment
5. Gives 2-3 actionable recommendations rooted in the four Capacity principles
6. Closes with a prophetic encouragement about God's grace sustaining what He has called them to carry

Write in second person. Tone: direct, warm, apostolic. Use Scripture naturally. No bullet points — flowing paragraphs.`;
      const res = await fetch("/api/claude", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt }) });
      const data = await res.json();
      setAiSummary(data.response || data.content?.[0]?.text || "Summary generation failed.");
    } catch (err) { setAiSummary("Unable to generate summary. Please check your connection."); }
    setLoading(false);
  };

  // ─── SHARED COMPONENTS ──────────────────────────────────────
  const Scripture = ({ children }) => (<div className="my-4 py-3 px-4 rounded-lg border-l-4" style={{ borderColor: GOLD_D, background: CREAM }}><p className="italic text-sm leading-relaxed" style={{ color: NAVY }}>{children}</p></div>);
  const Reflect = ({ id, prompt }) => (<div className="mt-5 mb-6"><div className="flex items-center gap-2 mb-2"><div className="w-1.5 h-5 rounded-full" style={{ background: GOLD_D }} /><p className="text-xs sm:text-sm font-semibold tracking-wide" style={{ color: GOLD_D }}>PAUSE & PROCESS</p></div><p className="text-sm mb-3 italic leading-relaxed" style={{ color: "#444" }}>{prompt}</p><textarea className="w-full border rounded-lg p-3 text-sm leading-relaxed resize-none focus:outline-none focus:ring-2" style={{ borderColor: "#ddd", minHeight: "100px" }} placeholder="Write your reflection here..." value={responses[id] || ""} onChange={e => setResponses(r => ({ ...r, [id]: e.target.value }))} /></div>);
  const SectionHead = ({ children, sub }) => (<div className="mb-4"><h3 className="text-lg sm:text-xl font-bold" style={{ color: NAVY, fontFamily: "'Cormorant Garamond', serif" }}>{children}</h3>{sub && <p className="text-sm mt-1 italic" style={{ color: "#888" }}>{sub}</p>}</div>);

  // ─── DIAGNOSTIC TABLE (MOBILE) ─────────────────────────────
  const renderDiagnostic = (target, scoreObj) => {
    const categories = [...new Set(capacityDiagnostic.map(q => q.cat))];
    return (<div className="space-y-5">{categories.map(cat => (<div key={cat}><div className="px-3 sm:px-4 py-2.5 rounded-t-lg font-semibold text-xs tracking-widest uppercase" style={{ background: NAVY, color: "#fff" }}>{cat}</div><div className="border border-t-0 rounded-b-lg divide-y" style={{ borderColor: "#e5e5e5" }}>{capacityDiagnostic.filter(q => q.cat === cat).map(q => (<div key={q.num} className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 px-3 sm:px-4 py-3"><div className="flex items-start gap-2 flex-1 min-w-0"><span className="text-xs font-mono mt-0.5 w-5 shrink-0" style={{ color: "#bbb" }}>{q.num}</span><div className="flex-1"><p className="text-sm leading-relaxed" style={{ color: "#1a1a1a" }}>{q.text}</p>{q.ref && <p className="text-xs mt-0.5" style={{ color: "#aaa" }}>{q.ref}</p>}</div></div><div className="flex gap-1.5 shrink-0 ml-7 sm:ml-0">{[1,2,3,4,5].map(v => (<button key={v} onClick={() => setScore(target, q.num, v)} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full text-xs font-bold transition-all duration-200" style={{ background: scoreObj[q.num] === v ? ACCENT : "transparent", color: scoreObj[q.num] === v ? "#fff" : "#999", border: `2px solid ${scoreObj[q.num] === v ? ACCENT : "#e0e0e0"}` }}>{v}</button>))}</div></div>))}</div></div>))}<div className="mt-4 p-4 rounded-xl" style={{ background: ACCENT_LIGHT }}><div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2"><span className="font-bold text-lg" style={{ color: NAVY }}>Your Total: {totalScore(scoreObj)} / 60</span><span className="text-sm font-medium" style={{ color: getInterp(totalScore(scoreObj)).color }}>{getInterp(totalScore(scoreObj)).text}</span></div></div></div>);
  };

  // ═══════════════════════════════════════════════════════════
  const renderStep = () => {
    switch (currentStep.id) {

      case "activation":
        return (<div className="space-y-6">
          <div className="p-5 rounded-xl" style={{ background: CREAM }}>
            <p className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: GOLD_D }}>THE 5C LEADERSHIP LIFECYCLE</p>
            <p className="text-sm leading-relaxed mb-3" style={{ color: "#333" }}>In Modules 1 through 3, we established Calling, Connection, and Competency \u2014 design, identity, and skill. Now we move to the dimension that determines whether everything you\u2019ve built will last.</p>
            <div className="flex gap-1 overflow-x-auto py-2 -mx-1 px-1">
              {["CALLING","CONNECTION","COMPETENCY","CAPACITY","CONVERGENCE"].map((c, i) => (
                <div key={c} className="px-2 sm:px-3 py-2 rounded-lg text-center text-xs font-bold tracking-wide shrink-0" style={{ background: i === 3 ? NAVY : i < 3 ? ACCENT_LIGHT : "#f5f5f0", color: i === 3 ? ACCENT : i < 3 ? ACCENT : "#999", minWidth: "80px" }}>{c}</div>
              ))}
            </div>
            <p className="text-sm leading-relaxed mt-3" style={{ color: "#333" }}>Capacity answers the fourth essential question: <strong style={{ color: NAVY }}>Can I sustain what I\u2019ve been called to carry?</strong></p>
            <p className="text-sm leading-relaxed mt-2" style={{ color: "#333" }}>You can have calling without capacity. You can be gifted without being sustainable. This module examines the character depth required to carry your assignment for decades, not just seasons.</p>
          </div>
          <div className="p-5 sm:p-6 rounded-2xl border-l-4" style={{ borderColor: ACCENT, background: `linear-gradient(135deg, ${ACCENT_LIGHT}, #fff)` }}>
            <p className="text-base sm:text-lg italic leading-relaxed" style={{ color: NAVY }}>"The leader who cannot sustain what they\u2019ve built will eventually become the biggest threat to what they\u2019ve been called to lead."</p>
          </div>
          <div className="mt-6">
            <p className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: GOLD_D }}>OPENING ACTIVATION</p>
            <p className="text-sm italic mb-4" style={{ color: "#666" }}>Before we teach, we listen. Write what is true \u2014 not what sounds sustainable.</p>
            <Reflect id="activation_1" prompt="Where in your current leadership are you running on reserves you don\u2019t actually have? What is it costing you?" />
            <Reflect id="activation_2" prompt="What does your pace and rhythm reveal about what you actually believe about God\u2019s sufficiency for your assignment?" />
          </div>
        </div>);

      case "pre-diagnostic":
        return (<div className="space-y-6">
          <div className="p-5 rounded-xl" style={{ background: CREAM }}><p className="font-semibold mb-1" style={{ color: NAVY }}>Capacity Diagnostic \u2014 Pre-Assessment</p><p className="text-sm" style={{ color: "#666" }}>Rate each statement honestly from 1 (Strongly Disagree) to 5 (Strongly Agree). This is a mirror, not a test.</p></div>
          {renderDiagnostic("pre", preScores)}
          <Reflect id="pre_diag_reflect" prompt="Look at your lowest category. What does it tell you about where your capacity is most vulnerable right now?" />
        </div>);

      case "teaching":
        return (<div className="space-y-10">
          {/* Definition */}
          <div>
            <SectionHead>Definition</SectionHead>
            <p className="leading-relaxed mb-3" style={{ color: "#333" }}>Capacity is the depth of character, the strength of reserves, and the sustainability of rhythm that enables a leader to carry their calling for the long haul without fracturing under the weight of it.</p>
            <Scripture>{"\u201CMy grace is sufficient for you, for my power is made perfect in weakness.\u201D \u2014 2 Corinthians 12:9"}</Scripture>
            <p className="leading-relaxed mb-3" style={{ color: "#333" }}>Capacity is not the absence of limits. It is the wisdom to know your limits, steward your reserves, and trust God with what your limits cannot hold. The leader who understands capacity leads for decades. The leader who ignores it burns out before their assignment is complete.</p>
            <Scripture>{"\u201CThose who wait on the Lord shall renew their strength; they shall mount up with wings like eagles.\u201D \u2014 Isaiah 40:31"}</Scripture>
          </div>

          {/* Contrast Table */}
          <div>
            <SectionHead sub="Every leader operates from one of two postures when it comes to sustainability.">High Output vs. Sustainable Leadership</SectionHead>
            <div className="block sm:hidden space-y-3">
              {CONTRAST_TABLE.map((row, i) => (
                <div key={i} className="rounded-lg border overflow-hidden" style={{ borderColor: "#e0e0e0" }}>
                  <div className="px-3 py-2 text-xs font-bold" style={{ background: "#f9fafb", color: NAVY }}>{row.dimension}</div>
                  <div className="grid grid-cols-2 divide-x" style={{ divideColor: "#e0e0e0" }}>
                    <div className="px-3 py-2" style={{ background: "#FEF2F2" }}><p className="text-xs font-semibold mb-0.5" style={{ color: RED }}>High Output</p><p className="text-xs" style={{ color: "#7F1D1D" }}>{row.left}</p></div>
                    <div className="px-3 py-2" style={{ background: ACCENT_LIGHT }}><p className="text-xs font-semibold mb-0.5" style={{ color: ACCENT }}>Sustainable</p><p className="text-xs" style={{ color: NAVY }}>{row.right}</p></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="hidden sm:block overflow-x-auto rounded-xl border" style={{ borderColor: "#e0e0e0" }}>
              <table className="w-full text-sm"><thead><tr>
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider" style={{ background: "#f9fafb", color: "#888", width: "28%" }}>Dimension</th>
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider" style={{ background: "#FEE2E2", color: RED }}>High Output</th>
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider" style={{ background: NAVY, color: "#fff" }}>Sustainable Leadership</th>
              </tr></thead><tbody>{CONTRAST_TABLE.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-3 font-medium text-sm" style={{ color: NAVY }}>{row.dimension}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: "#7F1D1D" }}>{row.left}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: ACCENT }}>{row.right}</td>
                </tr>
              ))}</tbody></table>
            </div>
            <Reflect id="contrast_reflect" prompt="Look at the \u2018High Output\u2019 column. Where do you see yourself honestly? Not aspirationally \u2014 currently." />
          </div>

          {/* Macro & Micro */}
          <div>
            <SectionHead sub="Just as each previous C has macro/micro dimensions, Capacity does too.">Capacity: Macro & Micro</SectionHead>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 sm:p-5 rounded-xl border-2" style={{ borderColor: ACCENT, background: ACCENT_LIGHT }}>
                <p className="font-bold text-xs uppercase tracking-widest mb-2" style={{ color: ACCENT }}>{MACRO_MICRO.macro.title}</p>
                <p className="text-sm leading-relaxed" style={{ color: "#333" }}>{MACRO_MICRO.macro.description}</p>
              </div>
              <div className="p-4 sm:p-5 rounded-xl border-2" style={{ borderColor: NAVY, background: CREAM }}>
                <p className="font-bold text-xs uppercase tracking-widest mb-2" style={{ color: NAVY }}>{MACRO_MICRO.micro.title}</p>
                <p className="text-sm leading-relaxed" style={{ color: "#333" }}>{MACRO_MICRO.micro.description}</p>
              </div>
            </div>
            <Reflect id="macro_micro" prompt="Is your current load sustainable for the next three years at this pace? If not, what is the honest answer about what needs to change?" />
          </div>

          {/* 4 Principles */}
          <div>
            <SectionHead>Governing Principles</SectionHead>
            <div className="space-y-3">
              {PRINCIPLES.map(p => (
                <div key={p.num} className="rounded-xl overflow-hidden border" style={{ borderColor: expandedPrinciple === p.num ? ACCENT : "#e5e5e5" }}>
                  <button onClick={() => setExpandedPrinciple(expandedPrinciple === p.num ? null : p.num)} className="w-full flex items-center justify-between px-4 sm:px-5 py-4 text-left transition-colors" style={{ background: expandedPrinciple === p.num ? ACCENT_LIGHT : "#fff" }}>
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0" style={{ background: ACCENT }}>{p.num}</span>
                      <div><p className="font-bold text-sm" style={{ color: NAVY }}>{p.title}</p><p className="text-xs" style={{ color: "#999" }}>{p.ref}</p></div>
                    </div>
                    <svg className={`w-5 h-5 transition-transform duration-300 ${expandedPrinciple === p.num ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="#999"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {expandedPrinciple === p.num && (
                    <div className="px-4 sm:px-5 pb-5 border-t" style={{ borderColor: "#eee" }}>
                      <Scripture>{p.scripture}</Scripture>
                      {p.paragraphs.map((para, i) => (<p key={i} className="text-sm leading-relaxed mb-3" style={{ color: "#333" }}>{para}</p>))}
                      <Reflect id={`principle_${p.num}`} prompt={p.prompt} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>);

      case "exemplar":
        return (<div className="space-y-6">
          <div className="text-center mb-6">
            <p className="text-xs uppercase tracking-widest mb-1" style={{ color: ACCENT }}>Leadership Exemplar</p>
            <h3 className="text-xl sm:text-2xl font-bold" style={{ color: NAVY, fontFamily: "'Cormorant Garamond', serif" }}>{EXEMPLAR.name} \u2014 {EXEMPLAR.title}</h3>
            <p className="text-xs mt-1" style={{ color: "#999" }}>{EXEMPLAR.refs}</p>
          </div>
          <p className="leading-relaxed" style={{ color: "#333" }}>{EXEMPLAR.intro}</p>
          <Scripture>{EXEMPLAR.mainScripture}</Scripture>
          {EXEMPLAR.bodyParagraphs.map((p, i) => (<p key={i} className="leading-relaxed text-sm" style={{ color: "#333" }}>{p}</p>))}
          <div className="relative pl-6 sm:pl-8 border-l-2 space-y-6 my-6" style={{ borderColor: ACCENT_MID }}>
            {EXEMPLAR.arc.map((a, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-[21px] sm:-left-[25px] w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2" style={{ background: i === 0 ? ACCENT : "#fff", borderColor: ACCENT, top: "4px" }} />
                <p className="font-bold text-sm uppercase tracking-wider mb-1" style={{ color: ACCENT }}>{a.stage}</p>
                <p className="text-sm leading-relaxed" style={{ color: "#444" }}>{a.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 p-4 sm:p-5 rounded-xl" style={{ background: CREAM }}>
            <p className="font-semibold text-xs uppercase tracking-widest mb-4" style={{ color: GOLD_D }}>COACHING QUESTIONS</p>
            {EXEMPLAR.coachingQuestions.map((q, i) => (<Reflect key={i} id={`exemplar_q_${i}`} prompt={q} />))}
          </div>
        </div>);

      case "stages":
        return (<div className="space-y-6">
          <SectionHead sub="These are not stages you graduate from. They are depths you grow into.">How Capacity Develops: Three Stages</SectionHead>
          <div className="block sm:hidden space-y-4">
            {STAGES.map((s, i) => (
              <div key={i} className="rounded-xl border overflow-hidden" style={{ borderColor: "#e0e0e0" }}>
                <div className="px-4 py-3" style={{ background: NAVY }}><p className="font-bold text-white text-sm">Stage {i+1}: {s.name}</p></div>
                <div className="p-4"><p className="text-sm leading-relaxed mb-2" style={{ color: "#333" }}>{s.description}</p><p className="text-xs italic mb-3" style={{ color: "#888" }}>{s.ref}</p><div className="p-3 rounded-lg" style={{ background: ACCENT_LIGHT }}><p className="text-xs uppercase tracking-wider font-semibold mb-1" style={{ color: ACCENT }}>Transition Marker</p><p className="text-sm italic" style={{ color: NAVY }}>{s.marker}</p></div></div>
              </div>
            ))}
          </div>
          <div className="hidden sm:block overflow-x-auto rounded-xl border" style={{ borderColor: "#e0e0e0" }}>
            <table className="w-full text-sm"><thead><tr>{STAGES.map((s, i) => (<th key={i} className="text-left px-4 py-3 font-bold text-xs uppercase tracking-wider" style={{ background: NAVY, color: "#fff", width: "33.3%" }}>Stage {i+1}: {s.name}</th>))}</tr></thead>
            <tbody><tr>{STAGES.map((s, i) => (<td key={i} className="px-4 py-4 align-top text-sm leading-relaxed" style={{ color: "#333" }}>{s.description}<p className="text-xs italic mt-2" style={{ color: "#888" }}>{s.ref}</p><div className="mt-3 p-3 rounded-lg" style={{ background: ACCENT_LIGHT }}><p className="text-xs uppercase font-semibold mb-1" style={{ color: ACCENT }}>Transition Marker</p><p className="text-sm italic" style={{ color: NAVY }}>{s.marker}</p></div></td>))}</tr></tbody></table>
          </div>
          <Reflect id="stages_reflect" prompt="Which stage are you in right now? What evidence supports your answer \u2014 not what you wish were true, but what is actually true?" />
        </div>);

      case "post-diagnostic":
        return (<div className="space-y-6">
          <div className="p-5 rounded-xl" style={{ background: CREAM }}><p className="font-semibold mb-1" style={{ color: NAVY }}>Capacity Diagnostic \u2014 Post-Assessment</p><p className="text-sm" style={{ color: "#666" }}>Rate yourself again. Be honest about what shifted \u2014 and what didn\u2019t.</p></div>
          {renderDiagnostic("post", postScores)}
          {totalScore(preScores) > 0 && totalScore(postScores) > 0 && (
            <div className="mt-6 p-5 rounded-xl border-2" style={{ borderColor: ACCENT }}>
              <p className="font-bold mb-3" style={{ color: NAVY }}>Your Shift</p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div><p className="text-xl sm:text-2xl font-bold" style={{ color: "#999" }}>{totalScore(preScores)}</p><p className="text-xs uppercase tracking-wider" style={{ color: "#999" }}>Before</p></div>
                <div><p className="text-xl sm:text-2xl font-bold" style={{ color: totalScore(postScores) - totalScore(preScores) > 0 ? ACCENT : RED }}>{totalScore(postScores) - totalScore(preScores) > 0 ? "+" : ""}{totalScore(postScores) - totalScore(preScores)}</p><p className="text-xs uppercase tracking-wider" style={{ color: ACCENT }}>Shift</p></div>
                <div><p className="text-xl sm:text-2xl font-bold" style={{ color: NAVY }}>{totalScore(postScores)}</p><p className="text-xs uppercase tracking-wider" style={{ color: NAVY }}>After</p></div>
              </div>
            </div>
          )}
          <Reflect id="post_diag_reflect" prompt="What did this diagnostic reveal? Where is the most dangerous gap between your current load and your actual capacity?" />
          <div className="mt-8">
            <SectionHead sub="These are your anchor texts. Return to them when the pace is unsustainable, when the reserves are empty, when the question is whether you can finish what you started.">Key Scriptures on Capacity</SectionHead>
            <div className="space-y-2">{KEY_SCRIPTURES.map((s, i) => (<div key={i} className="flex flex-col sm:flex-row sm:items-start gap-0.5 sm:gap-3 py-2"><span className="font-bold text-sm shrink-0" style={{ color: NAVY, minWidth: "180px" }}>{s.ref}</span><span className="text-sm italic" style={{ color: "#555" }}>{s.note}</span></div>))}</div>
          </div>
        </div>);

      case "commitment":
        return (<div className="space-y-6">
          <SectionHead sub="Sustainability requires decisions, not just awareness. Write these in full sentences.">My Capacity Commitment</SectionHead>
          <div className="space-y-5">{COMMITMENT_PROMPTS.map(c => (<div key={c.id}><label className="block text-sm font-semibold mb-2" style={{ color: NAVY }}>{c.label}</label><textarea className="w-full border rounded-lg p-3 text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 transition-all" style={{ borderColor: "#ddd", minHeight: "90px" }} placeholder={c.placeholder} value={commitments[c.id] || ""} onChange={e => setCommitments(p => ({ ...p, [c.id]: e.target.value }))} /></div>))}</div>
          <div className="mt-8 p-5 rounded-xl" style={{ background: ACCENT_LIGHT }}>
            <h4 className="font-bold mb-3" style={{ color: NAVY }}>Capacity Is a Living Discipline</h4>
            <p className="text-sm mb-2 leading-relaxed" style={{ color: "#333" }}>What you wrote here is not a one-time exercise. Your capacity will be tested by success as much as by failure. Seasons of high output erode what seasons of pressure develop. The disciplines that protect your reserves must be guarded with the same intentionality you protect your most important relationships.</p>
            <p className="text-sm font-semibold mb-3 mt-4" style={{ color: NAVY }}>Revisit your capacity:</p>
            <div className="space-y-2 ml-1">{REVISIT_TRIGGERS.map((t, i) => (<div key={i} className="flex items-start gap-3"><span className="mt-1.5 w-2 h-2 rounded-full shrink-0" style={{ background: ACCENT }} /><p className="text-sm leading-relaxed" style={{ color: "#333" }}>{t}</p></div>))}</div>
          </div>
          <div className="mt-8">
            <SectionHead sub="Translate capacity awareness into leadership behavior.">Application Moment</SectionHead>
            {APPLICATION_QUESTIONS.map((q, i) => (<Reflect key={i} id={`application_${i}`} prompt={q} />))}
          </div>
          <div className="p-5 rounded-xl text-center" style={{ background: NAVY }}>
            <p className="text-xs uppercase tracking-widest mb-1" style={{ color: GOLD }}>NEXT MODULE</p>
            <p className="text-lg font-bold" style={{ color: "#fff" }}>CONVERGENCE</p>
            <p className="text-sm" style={{ color: ACCENT_MID }}>Alignment (Legacy)</p>
          </div>
        </div>);

      case "summary":
        return (<div className="space-y-6">
          <SectionHead sub="Based on your diagnostics, reflections, and commitments \u2014 here is your personalized Capacity analysis.">Your Capacity Blueprint</SectionHead>
          {!aiSummary && !loading && (<button onClick={generateSummary} className="w-full py-4 rounded-xl font-bold text-lg transition-all hover:opacity-90 text-white" style={{ background: `linear-gradient(135deg, ${ACCENT}, ${NAVY})` }}>Generate My Capacity Blueprint</button>)}
          {loading && (<div className="text-center py-12"><div className="w-10 h-10 border-4 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: ACCENT_LIGHT, borderTopColor: ACCENT }} /><p className="text-sm" style={{ color: "#888" }}>Generating your personalized blueprint...</p></div>)}
          {aiSummary && (<>
            <div className="p-5 sm:p-6 rounded-2xl border" style={{ borderColor: ACCENT }}>
              <div className="flex items-center gap-2 mb-4"><div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: ACCENT }}><span className="text-white text-sm">{"\u2726"}</span></div><p className="font-bold" style={{ color: NAVY }}>Your Capacity Blueprint</p></div>
              <div style={{ color: "#333" }}>{aiSummary.split("\n\n").map((para, i) => (<p key={i} className="mb-3 leading-relaxed text-sm">{para}</p>))}</div>
            </div>
            <button onClick={() => downloadWordDoc("Capacity", responses, commitments, preScores, postScores, capacityDiagnostic, aiSummary)} className="w-full py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 border-2" style={{ borderColor: ACCENT, color: NAVY, background: ACCENT_LIGHT }}>Download My Capacity Blueprint (.doc)</button>
          </>)}
        </div>);

      default: return null;
    }
  };

  // ═══════════════════════════════════════════════════════════
  // MAIN LAYOUT
  // ═══════════════════════════════════════════════════════════
  return (<>
    <Head><title>Capacity | 5C Leadership Blueprint</title></Head>
    <div className="min-h-screen" style={{ background: "#FAFAF8", fontFamily: "'Outfit', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <div className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="/" className="text-sm font-medium flex items-center gap-1 hover:opacity-70 transition-opacity" style={{ color: NAVY }}>{"\u2190"} Dashboard</a>
          <div className="text-center"><p className="text-xs uppercase tracking-widest" style={{ color: ACCENT }}>Module 4</p><p className="text-sm font-bold" style={{ color: NAVY }}>Capacity</p></div>
          <div className="w-16" />
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-4">
        <div className="flex items-center gap-1 overflow-x-auto pb-2 -mx-1 px-1">
          {STEPS.map((s, i) => (<button key={s.id} onClick={() => setStep(i)} className="flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all" style={{ background: i === step ? ACCENT : i < step ? ACCENT_LIGHT : "transparent", color: i === step ? "#fff" : i < step ? ACCENT : "#aaa", border: `1px solid ${i <= step ? ACCENT : "#e5e5e5"}` }}>{i < step && <span>{"\u2713"}</span>}{s.label}</button>))}
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 pb-32" ref={topRef}>
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: ACCENT }}>{currentStep.label}</p>
          <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: NAVY, fontFamily: "'Cormorant Garamond', serif" }}>Capacity: Character (Sustainability)</h2>
          <p className="text-sm mt-1 italic" style={{ color: "#888" }}>Central Question: Can I sustain what I\u2019ve been called to carry?</p>
        </div>
        {renderStep()}
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-100 py-3 z-40">
        <div className="max-w-3xl mx-auto px-4 flex justify-between items-center">
          <button onClick={() => step > 0 && setStep(step - 1)} disabled={step === 0} className="px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-30" style={{ color: NAVY, border: `1px solid ${NAVY}` }}>{"\u2190"} Previous</button>
          <span className="text-xs" style={{ color: "#aaa" }}>{step + 1} of {STEPS.length}</span>
          <button onClick={() => step < STEPS.length - 1 && setStep(step + 1)} disabled={step === STEPS.length - 1} className="px-4 sm:px-5 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-30" style={{ background: ACCENT, color: "#fff" }}>Next {"\u2192"}</button>
        </div>
      </div>
    </div>
  </>);
}
