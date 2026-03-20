// ═══════════════════════════════════════════════════════════════
// COMMISSIONING — Sent (Deployment)
// 5C Leadership Blueprint · Awakening Destiny Global
// Pages Router: pages/modules/commissioning.js
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
// Commissioning accent = Gold (full ADG ceremony weight)
const ACCENT       = GOLD_D;
const ACCENT_LIGHT = "#FFF9E6";
const ACCENT_MID   = GOLD;

// ─── 5C MODULE COLORS (for recap display) ────────────────────
const MODULE_ACCENTS = {
  Calling:     { color: GOLD_D,  light: "#FFF9E6",  label: "Potential (Purpose)",      question: "Who was I designed to become?" },
  Connection:  { color: BLUE,    light: "#E8F4FD",   label: "Identity (Relationships)", question: "Do I know whose I am?" },
  Competency:  { color: ORANGE,  light: "#FFF3E8",   label: "Excellence (Credibility)", question: "Can I carry what I\u2019m called to build?" },
  Capacity:    { color: SKY,     light: "#E0F7FD",   label: "Character (Sustainability)",question: "Can I sustain what I\u2019ve been called to carry?" },
  Convergence: { color: RED,     light: "#FEF2F2",   label: "Alignment (Legacy)",       question: "Am I becoming everything I was designed to be?" },
};

// ─── COMMISSIONING DIAGNOSTIC ────────────────────────────────
const commissioningDiagnostic = [
  { num: 1,  cat: "Readiness",          text: "I am leading from a clear sense of calling, not performance or pressure.", ref: "Jeremiah 1:7" },
  { num: 2,  cat: "Readiness",          text: "I can articulate my assignment with enough clarity to be accountable to it." },
  { num: 3,  cat: "Readiness",          text: "There is no area of known disobedience or unresolved compromise that I am carrying into this next season." },
  { num: 4,  cat: "Accountability",     text: "I have people in my life who have full access to my character, not just my output.", ref: "Proverbs 27:17" },
  { num: 5,  cat: "Accountability",     text: "I am submitted to spiritual authority in a way that protects my assignment, not just validates it." },
  { num: 6,  cat: "Accountability",     text: "I have named specific people who will hold me to what I have committed to in this blueprint." },
  { num: 7,  cat: "Deployment Posture", text: "I am moving forward in my assignment with courage, not waiting for perfect conditions.", ref: "Joshua 1:9" },
  { num: 8,  cat: "Deployment Posture", text: "I have identified the first concrete step I am taking out of this training." },
  { num: 9,  cat: "Deployment Posture", text: "I am sending others forward, not just moving forward myself." },
  { num: 10, cat: "Covenant Integrity", text: "The commitments I made in this blueprint reflect what I actually intend to do, not what I hoped sounded good.", ref: "Numbers 30:2" },
  { num: 11, cat: "Covenant Integrity", text: "I understand the weight of what I\u2019ve declared in this training and I am not treating it as an exercise." },
  { num: 12, cat: "Covenant Integrity", text: "I am willing to be held accountable to every commitment I made, including the hardest ones." },
];

// ─── STEPS ───────────────────────────────────────────────────
const STEPS = [
  { id: "activation",      label: "Opening" },
  { id: "review",          label: "5C Review" },
  { id: "pre-diagnostic",  label: "Readiness Check" },
  { id: "teaching",        label: "The Commission" },
  { id: "declaration",     label: "Declaration" },
  { id: "accountability",  label: "Accountability" },
  { id: "commitment",      label: "Sent" },
  { id: "summary",         label: "AI Commission" },
];

// ─── COMMISSIONING SCRIPTURES ────────────────────────────────
const COMMISSION_SCRIPTURES = [
  {
    ref: "Joshua 1:9",
    text: "\u201CHave I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.\u201D",
    note: "The commission does not guarantee ease. It guarantees presence."
  },
  {
    ref: "Matthew 28:19\u201320",
    text: "\u201CGo therefore and make disciples of all nations\u2026 And behold, I am with you always, to the end of the age.\u201D",
    note: "The Great Commission is not an invitation. It is an imperative with a promise."
  },
  {
    ref: "Isaiah 6:8",
    text: "\u201CThen I heard the voice of the Lord saying, \u2018Whom shall I send? And who will go for us?\u2019 And I said, \u2018Here am I. Send me!\u2019\u201D",
    note: "Commissioning begins with surrender before it produces deployment."
  },
  {
    ref: "Jeremiah 1:7\u20138",
    text: "\u201CBut the Lord said to me, \u2018Do not say, \u201cI am too young.\u201D You must go to everyone I send you to and say whatever I command you. Do not be afraid of them, for I am with you.\u2019\u201D",
    note: "Your inadequacy is not a disqualification. It is the condition under which God is most clearly seen."
  },
  {
    ref: "2 Timothy 4:5",
    text: "\u201CBut you, keep your head in all situations, endure hardship, do the work of an evangelist, discharge all the duties of your ministry.\u201D",
    note: "The commissioned leader is not called to a comfortable assignment. They are called to a complete one."
  },
];

// ─── THREE MARKS OF A COMMISSIONED LEADER ────────────────────
const MARKS = [
  {
    num: 1, title: "Commissioned Leaders Lead from Authorization, Not Ambition",
    ref: "John 20:21",
    scripture: "\u201CAs the Father has sent Me, I am sending you.\u201D \u2014 John 20:21",
    paragraphs: [
      "There is a decisive difference between leaders who send themselves and leaders who are sent. Leaders who send themselves lead from ambition \u2014 from desire, from comparison, from the need to prove something. Leaders who are sent lead from authorization \u2014 from assignment, from accountability, from the quiet certainty that they are exactly where they are supposed to be.",
      "This is the difference between pressure and peace. The leader who sent themselves must constantly justify their position. The leader who was sent can rest in the assignment. Their confidence is not in their credentials \u2014 it is in the One who commissioned them.",
      "To be commissioned is to operate under authority. That is not a limitation. It is a covering. The soldier who advances under orders has the backing of the entire army. The leader who advances under God\u2019s commissioning has the backing of heaven."
    ],
    prompt: "Are you operating from authorization or ambition? What is the evidence either way?"
  },
  {
    num: 2, title: "Commissioned Leaders Carry What Was Given, Not What Was Borrowed",
    ref: "Acts 3:6",
    scripture: "\u201CSilver or gold I do not have, but what I do have I give you.\u201D \u2014 Acts 3:6",
    paragraphs: [
      "Peter did not offer the lame man what he had seen others offer. He offered what he carried. The commissioning is not a license to imitate another leader\u2019s assignment. It is a mandate to deploy your own.",
      "One of the great diversions of leadership development is the temptation to carry borrowed weight \u2014 to lead with someone else\u2019s methods, someone else\u2019s voice, someone else\u2019s burden. It looks like humility. It is often avoidance. You have something to give that no one else can give, because no one else has your exact calling, your exact formation, your exact assignment.",
      "What you carry coming out of this training is yours. The questions you answered, the burdens you named, the commitments you made \u2014 those belong to your specific assignment. Go and give what you have."
    ],
    prompt: "What have you been carrying out of this training that is uniquely yours to give? What are you still tempted to borrow from someone else instead of deploying what you\u2019ve been given?"
  },
  {
    num: 3, title: "Commissioned Leaders Build for What They Will Not Personally See",
    ref: "Hebrews 11:13",
    scripture: "\u201CAll these people were still living by faith when they died. They did not receive the things promised; they only saw them and welcomed them from a distance.\u201D \u2014 Hebrews 11:13",
    paragraphs: [
      "The Hall of Faith is populated by leaders who built things they never saw completed. They obeyed a commission that stretched beyond their lifetime. Their assignment was not to finish \u2014 it was to be faithful with what their generation was given to carry.",
      "This is the most liberating reframe in leadership: you are not responsible for the harvest you will not see. You are responsible for the seed you are holding. Plant faithfully. Build with integrity. Transfer well. Trust the generation that follows to carry what you could not complete.",
      "The measure of a commissioned leader is not what they finished. It is what they made possible. The most generative leaders in history were not the most visible. They were the most faithful with the part of the story they were given to write."
    ],
    prompt: "What are you building that is designed to outlast you? Who is the generation you are planting for that you will likely never meet?"
  },
];

// ─── DECLARATION LINES ───────────────────────────────────────
const DECLARATION = [
  "I am called by God before platform, before performance, before proof.",
  "I lead from identity, not from fear. I do not need applause to be secure.",
  "I will build with excellence, because what I build is an act of worship.",
  "I will protect my capacity, because sustainable leadership is faithful leadership.",
  "I am aligning my life and leadership with my assignment, not with expectation.",
  "I will transfer what I carry to the leaders who come after me.",
  "I will finish the course assigned to me \u2014 faithfully, not perfectly, but fully.",
  "I am not building a platform. I am building a legacy.",
  "I go, not because I am ready, but because I am sent.",
  "The Lord my God is with me wherever I go.",
];

// ─── ACCOUNTABILITY FRAMEWORK ────────────────────────────────
const ACCOUNTABILITY_TYPES = [
  {
    type: "Spiritual Authority",
    description: "A covering relationship \u2014 someone who speaks into the direction and alignment of your assignment with apostolic or pastoral authority.",
    question: "Who is this person for you, and are they actually engaged with your calling \u2014 not just your calendar?"
  },
  {
    type: "Peer Accountability",
    description: "A peer who is running a comparable race and has permission to ask the hard questions about your character, not just your productivity.",
    question: "Who knows the full picture \u2014 the private not just the public \u2014 and will not protect your comfort over your integrity?"
  },
  {
    type: "Developmental Investment",
    description: "Someone you are pouring into with the same intentionality that formed you. Your accountability is incomplete without someone below you receiving what you received.",
    question: "Who is your Timothy, and what specifically are you transferring to them in the next 90 days?"
  },
];

// ─── SENT COMMITMENT PROMPTS ─────────────────────────────────
const COMMITMENT_PROMPTS = [
  { id: "assignment",    label: "1. My Sent Assignment",            placeholder: "In one sentence: what are you sent to do? Not your title. Your assignment." },
  { id: "firstaction",  label: "2. My First Action (72 Hours)",     placeholder: "What is the first concrete action you will take within 72 hours of completing this training? Name the action, the date, and who will know you did it." },
  { id: "authority",    label: "3. My Spiritual Authority",         placeholder: "Name the person who holds spiritual covering over your assignment. When will you meet with them next?" },
  { id: "peer",         label: "4. My Peer Accountability",         placeholder: "Name the peer who has full-access permission to your character. What specific commitments are you sharing with them from this blueprint?" },
  { id: "investment",   label: "5. Who I Am Developing",            placeholder: "Name the leader you are actively developing. What are you transferring to them in the next 90 days?" },
  { id: "declaration",  label: "6. My Sent Declaration",            placeholder: "In your own words \u2014 who are you, what are you called to build, and why does it matter to the generation after you?" },
];

// ─── REVISIT TRIGGERS ────────────────────────────────────────
const REVISIT_TRIGGERS = [
  "At the beginning of every new season or assignment",
  "When a significant opportunity arrives and you are not sure it is yours to take",
  "When you feel the pull of drift, comparison, or ambition",
  "When your accountability relationships have gone quiet",
  "When what you are building no longer feels like your assignment",
  "Annually, as a full-lifecycle recommissioning before God",
];


// ═══════════════════════════════════════════════════════════════
// WORD DOC DOWNLOAD
// ═══════════════════════════════════════════════════════════════
function downloadWordDoc(title, responses, commitments, preScores, diagnostic, aiSummary) {
  const now = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const scoreRows = diagnostic.map(q => `<tr><td style="padding:6px;border:1px solid #ccc;font-size:11px;">${q.num}</td><td style="padding:6px;border:1px solid #ccc;font-size:11px;">${q.text}</td><td style="padding:6px;border:1px solid #ccc;text-align:center;font-size:11px;">${preScores[q.num]||"-"}</td></tr>`).join("");
  const respEntries = Object.entries(responses).filter(([,v])=>v).map(([k,v])=>`<p style="margin:4px 0;"><b>${k}:</b> ${v}</p>`).join("");
  const commitEntries = Object.entries(commitments).filter(([,v])=>v).map(([k,v])=>`<p style="margin:4px 0;"><b>${k}:</b> ${v}</p>`).join("");
  const declHtml = DECLARATION.map(d=>`<p style="margin:6px 0;font-size:12px;font-style:italic;color:#021A35;">\u201C${d}\u201D</p>`).join("");
  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>${title}</title><style>body{font-family:Georgia,serif;color:#1a1a1a;max-width:700px;margin:0 auto;padding:40px 20px}h1{color:#021A35;font-size:22px;border-bottom:3px solid #C8A951;padding-bottom:8px}h2{color:#021A35;font-size:16px;margin-top:24px;border-bottom:1px solid #ddd;padding-bottom:4px}p{font-size:12px;line-height:1.6}table{border-collapse:collapse;width:100%;margin:12px 0}th{background:#021A35;color:#fff;padding:8px;font-size:11px;text-align:left}td{font-size:11px}.footer{margin-top:40px;border-top:2px solid #C8A951;padding-top:12px;font-size:10px;color:#888;text-align:center}</style></head><body><h1>5C Leadership Blueprint \u2014 Commissioning</h1><p style="color:#888;">Awakening Destiny Global \u2022 ${now}</p><h2>Readiness Check</h2><table><tr><th>#</th><th>Statement</th><th>Score</th></tr>${scoreRows}</table><p><b>Total:</b> ${Object.values(preScores).reduce((a,b)=>a+b,0)}/60</p><h2>Declaration</h2>${declHtml}${respEntries?`<h2>Reflections</h2>${respEntries}`:""}${commitEntries?`<h2>Sent Commitments</h2>${commitEntries}`:""}${aiSummary?`<h2>My Commissioning Word</h2><p>${aiSummary.replace(/\n\n/g,"</p><p>")}</p>`:""}<div class="footer"><p>\u00A9 Awakening Destiny Global \u2022 awakeningdestiny.global</p><p>5C Leadership Blueprint \u2014 Developing Leaders \u2022 Creating Champions</p></div></body></html>`;
  const blob = new Blob(["\ufeff", html], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = "My_Commissioning_Word.doc"; document.body.appendChild(a); a.click(); document.body.removeChild(a); setTimeout(() => URL.revokeObjectURL(url), 250);
}


// ═══════════════════════════════════════════════════════════════
// COMMISSIONING PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function CommissioningPage() {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState({});
  const [responses, setResponses] = useState({});
  const [commitments, setCommitments] = useState({});
  const [aiSummary, setAiSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [expandedMark, setExpandedMark] = useState(null);
  const [declaredLines, setDeclaredLines] = useState([]);
  const topRef = useRef(null);

  useEffect(() => { topRef.current?.scrollIntoView({ behavior: "smooth" }); }, [step]);
  const currentStep = STEPS[step];
  const totalScore = (obj) => Object.values(obj).reduce((a, b) => a + b, 0);
  const getInterp = (t) => {
    if (t >= 50) return { text: "Ready to be sent. Go with confidence.", color: ACCENT };
    if (t >= 40) return { text: "Nearly ready. Address the remaining gaps before stepping out.", color: ORANGE };
    if (t >= 30) return { text: "Foundation building. Take the next step with accountability.", color: RED };
    return { text: "More formation needed. Lean into the process before deployment.", color: "#991B1B" };
  };
  const toggleLine = (i) => setDeclaredLines(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);

  const generateSummary = async () => {
    setLoading(true);
    try {
      const prompt = `You are a Kingdom apostolic leader and commissioning voice for Awakening Destiny Global's 5C Leadership Blueprint.

You are commissioning a leader who has completed all five modules: Calling, Connection, Competency, Capacity, and Convergence.

READINESS CHECK SCORES:
${commissioningDiagnostic.map(q => `${q.num}. ${q.text} — Score: ${scores[q.num] || "N/A"}/5`).join("\n")}
Total: ${totalScore(scores)}/60

REFLECTION RESPONSES:
${Object.entries(responses).map(([k, v]) => `${k}: ${v}`).join("\n\n")}

SENT COMMITMENTS:
${Object.entries(commitments).map(([k, v]) => `${k}: ${v}`).join("\n\n")}

Write a personalized Commissioning Word (450-550 words) that:
1. Speaks directly to who this leader is and what they are sent to do — based entirely on what they have written
2. Names the weight of their specific assignment without softening it
3. Addresses the accountability and transfer structures they have named
4. Speaks prophetically to what God is releasing them into in this next season
5. Closes with a formal, weighty commissioning charge — not encouragement, but a send-off. The final paragraph should feel like a hand placed on their shoulder and a word spoken over their deployment.

Write in second person. Tone: apostolic, prophetic, direct, weighty. This is not a summary — it is a word. Use Scripture naturally and sparingly. No bullet points — flowing paragraphs. Let the final paragraph be the most powerful.`;
      const res = await fetch("/api/claude", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt }) });
      const data = await res.json();
      setAiSummary(data.response || data.content?.[0]?.text || "Generation failed.");
    } catch (err) { setAiSummary("Unable to generate. Please check your connection."); }
    setLoading(false);
  };

  // ─── SHARED COMPONENTS ──────────────────────────────────────
  const Scripture = ({ children }) => (<div className="my-4 py-3 px-4 rounded-lg border-l-4" style={{ borderColor: GOLD_D, background: CREAM }}><p className="italic text-sm leading-relaxed" style={{ color: NAVY }}>{children}</p></div>);
  const Reflect = ({ id, prompt }) => (<div className="mt-5 mb-6"><div className="flex items-center gap-2 mb-2"><div className="w-1.5 h-5 rounded-full" style={{ background: GOLD_D }} /><p className="text-xs sm:text-sm font-semibold tracking-wide" style={{ color: GOLD_D }}>PAUSE & PROCESS</p></div><p className="text-sm mb-3 italic leading-relaxed" style={{ color: "#444" }}>{prompt}</p><textarea className="w-full border rounded-lg p-3 text-sm leading-relaxed resize-none focus:outline-none focus:ring-2" style={{ borderColor: "#ddd", minHeight: "100px" }} placeholder="Write your reflection here..." value={responses[id] || ""} onChange={e => setResponses(r => ({ ...r, [id]: e.target.value }))} /></div>);
  const SectionHead = ({ children, sub }) => (<div className="mb-4"><h3 className="text-lg sm:text-xl font-bold" style={{ color: NAVY, fontFamily: "'Cormorant Garamond', serif" }}>{children}</h3>{sub && <p className="text-sm mt-1 italic" style={{ color: "#888" }}>{sub}</p>}</div>);

  // ─── READINESS DIAGNOSTIC ─────────────────────────────────
  const renderDiagnostic = () => {
    const categories = [...new Set(commissioningDiagnostic.map(q => q.cat))];
    return (<div className="space-y-5">{categories.map(cat => (<div key={cat}><div className="px-3 sm:px-4 py-2.5 rounded-t-lg font-semibold text-xs tracking-widest uppercase" style={{ background: NAVY, color: "#fff" }}>{cat}</div><div className="border border-t-0 rounded-b-lg divide-y" style={{ borderColor: "#e5e5e5" }}>{commissioningDiagnostic.filter(q => q.cat === cat).map(q => (<div key={q.num} className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 px-3 sm:px-4 py-3"><div className="flex items-start gap-2 flex-1 min-w-0"><span className="text-xs font-mono mt-0.5 w-5 shrink-0" style={{ color: "#bbb" }}>{q.num}</span><div className="flex-1"><p className="text-sm leading-relaxed" style={{ color: "#1a1a1a" }}>{q.text}</p>{q.ref && <p className="text-xs mt-0.5" style={{ color: "#aaa" }}>{q.ref}</p>}</div></div><div className="flex gap-1.5 shrink-0 ml-7 sm:ml-0">{[1,2,3,4,5].map(v => (<button key={v} onClick={() => setScores(p => ({ ...p, [q.num]: v }))} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full text-xs font-bold transition-all duration-200" style={{ background: scores[q.num] === v ? ACCENT : "transparent", color: scores[q.num] === v ? NAVY : "#999", border: `2px solid ${scores[q.num] === v ? ACCENT : "#e0e0e0"}` }}>{v}</button>))}</div></div>))}</div></div>))}<div className="mt-4 p-4 rounded-xl" style={{ background: ACCENT_LIGHT }}><div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2"><span className="font-bold text-lg" style={{ color: NAVY }}>Your Total: {totalScore(scores)} / 60</span><span className="text-sm font-medium" style={{ color: getInterp(totalScore(scores)).color }}>{getInterp(totalScore(scores)).text}</span></div></div></div>);
  };

  // ═══════════════════════════════════════════════════════════
  const renderStep = () => {
    switch (currentStep.id) {

      case "activation":
        return (<div className="space-y-6">
          {/* Ceremony header */}
          <div className="p-6 sm:p-8 rounded-2xl text-center" style={{ background: `linear-gradient(160deg, ${NAVY} 0%, #0d2d50 100%)` }}>
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: GOLD_D }}>Awakening Destiny Global</p>
            <h3 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: GOLD, fontFamily: "'Cormorant Garamond', serif" }}>5C Leadership Blueprint</h3>
            <div className="flex justify-center gap-2 my-4">
              {Object.entries(MODULE_ACCENTS).map(([name, m], i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-bold mb-1" style={{ background: m.color, color: "#fff" }}>C</div>
                  <p style={{ color: "#aaa", fontSize: "8px" }} className="hidden sm:block">{name}</p>
                </div>
              ))}
            </div>
            <p className="text-base sm:text-lg font-semibold" style={{ color: "#fff" }}>Commissioning</p>
            <p className="text-sm mt-1" style={{ color: GOLD_D }}>Sent (Deployment)</p>
          </div>
          <div className="p-5 rounded-xl" style={{ background: CREAM }}>
            <p className="text-sm leading-relaxed mb-3" style={{ color: "#333" }}>You have walked through all five dimensions of the 5C Leadership Blueprint. You have been asked to look honestly at your calling, your identity, your competency, your capacity, and your alignment.</p>
            <p className="text-sm leading-relaxed mb-3" style={{ color: "#333" }}>This final module is not more teaching. It is not another diagnostic. It is a threshold.</p>
            <p className="text-sm leading-relaxed font-medium" style={{ color: NAVY }}>Commissioning is the moment where formation becomes deployment. Where training becomes sending. Where the blueprint becomes a life.</p>
          </div>
          <div className="p-5 sm:p-6 rounded-2xl border-l-4" style={{ borderColor: ACCENT, background: `linear-gradient(135deg, ${ACCENT_LIGHT}, #fff)` }}>
            <p className="text-base sm:text-lg italic leading-relaxed" style={{ color: NAVY }}>"As the Father has sent Me, I am sending you." \u2014 John 20:21</p>
          </div>
          <Scripture>{"\u201CHave I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.\u201D \u2014 Joshua 1:9"}</Scripture>
          <div className="mt-4">
            <p className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: GOLD_D }}>BEFORE WE BEGIN</p>
            <p className="text-sm italic mb-4" style={{ color: "#666" }}>Two questions. Don\u2019t rush past them.</p>
            <Reflect id="opening_1" prompt="What is the single most significant thing God has revealed about you through this training? Not the most impressive thing \u2014 the most true thing." />
            <Reflect id="opening_2" prompt="What would it mean to actually live by what you\u2019ve written in this blueprint? What would have to change?" />
          </div>
        </div>);

      case "review":
        return (<div className="space-y-6">
          <SectionHead sub="Before you are commissioned, you name what you are carrying. Each dimension, in your own words.">Your 5C Summary</SectionHead>
          <div className="space-y-4">
            {Object.entries(MODULE_ACCENTS).map(([name, m], i) => (
              <div key={name} className="rounded-xl overflow-hidden border" style={{ borderColor: m.color }}>
                <div className="px-4 py-3 flex items-center gap-3" style={{ background: m.light }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: m.color, color: "#fff" }}>C</div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: NAVY }}>{name} \u2014 {m.label}</p>
                    <p className="text-xs italic" style={{ color: "#888" }}>{m.question}</p>
                  </div>
                </div>
                <div className="px-4 py-3">
                  <textarea className="w-full border rounded-lg p-3 text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 transition-all" style={{ borderColor: "#e0e0e0", minHeight: "80px" }} placeholder={`In 2\u20133 sentences: what did ${name} reveal about you, and what is your clearest takeaway?`} value={responses[`review_${name}`] || ""} onChange={e => setResponses(r => ({ ...r, [`review_${name}`]: e.target.value }))} />
                </div>
              </div>
            ))}
          </div>
          <div className="p-5 rounded-xl" style={{ background: CREAM }}>
            <p className="text-sm font-semibold mb-1" style={{ color: NAVY }}>Looking at all five together\u2026</p>
            <p className="text-sm italic mb-3" style={{ color: "#666" }}>Where is the most significant misalignment across the five? Where do they converge most powerfully?</p>
            <textarea className="w-full border rounded-lg p-3 text-sm leading-relaxed resize-none focus:outline-none focus:ring-2" style={{ borderColor: "#ddd", minHeight: "100px" }} placeholder="Write your integrated reflection here..." value={responses["review_integrated"] || ""} onChange={e => setResponses(r => ({ ...r, review_integrated: e.target.value }))} />
          </div>
        </div>);

      case "pre-diagnostic":
        return (<div className="space-y-6">
          <div className="p-5 rounded-xl" style={{ background: CREAM }}>
            <p className="font-semibold mb-1" style={{ color: NAVY }}>Commissioning Readiness Check</p>
            <p className="text-sm" style={{ color: "#666" }}>This is not a pre/post. This is a readiness assessment. Rate each statement from 1 (Not yet) to 5 (Fully). Be ruthlessly honest. Your commissioning word will be shaped by what you write here.</p>
          </div>
          {renderDiagnostic()}
          <Reflect id="readiness_reflect" prompt="Where is your readiness lowest? What does that tell you about the work still in front of you before you step out?" />
        </div>);

      case "teaching":
        return (<div className="space-y-10">
          <div>
            <SectionHead>What It Means to Be Commissioned</SectionHead>
            <p className="leading-relaxed mb-3" style={{ color: "#333" }}>Commissioning is not graduation. Graduation marks the end of a program. Commissioning marks the beginning of an assignment. You are not leaving this training because you are finished being formed. You are leaving because it is time to go.</p>
            <Scripture>{"\u201CHe said to them, \u2018As the Father has sent Me, I am sending you.\u2019\u201D \u2014 John 20:21"}</Scripture>
            <p className="leading-relaxed mb-3" style={{ color: "#333" }}>The word Jesus uses for \u201Csent\u201D (aposte\u0301llo) is the root of apostle \u2014 a sent one. Every commissioned leader carries apostolic function in some measure: they are deployed into a specific territory, under specific authority, for a specific purpose. They do not go on their own terms. They go on the terms of the One who sent them.</p>
          </div>

          {/* Commission Scriptures */}
          <div>
            <SectionHead sub="These are the five commissioning texts of Scripture. Read each one slowly.">The Commission in Scripture</SectionHead>
            <div className="space-y-4">
              {COMMISSION_SCRIPTURES.map((s, i) => (
                <div key={i} className="p-4 sm:p-5 rounded-xl border" style={{ borderColor: "#e0e0e0" }}>
                  <p className="font-bold text-xs uppercase tracking-wider mb-2" style={{ color: ACCENT }}>{s.ref}</p>
                  <p className="italic text-sm leading-relaxed mb-2" style={{ color: NAVY }}>{s.text}</p>
                  <p className="text-xs" style={{ color: "#888" }}>{s.note}</p>
                </div>
              ))}
            </div>
            <Reflect id="scripture_reflect" prompt="Which of these five commissioning texts speaks most directly to your assignment and this season? What does it say to you specifically?" />
          </div>

          {/* Three Marks */}
          <div>
            <SectionHead sub="These are not aspirations. They are identifiers of a leader who has been genuinely sent.">Three Marks of a Commissioned Leader</SectionHead>
            <div className="space-y-3">
              {MARKS.map(m => (
                <div key={m.num} className="rounded-xl overflow-hidden border" style={{ borderColor: expandedMark === m.num ? ACCENT : "#e5e5e5" }}>
                  <button onClick={() => setExpandedMark(expandedMark === m.num ? null : m.num)} className="w-full flex items-center justify-between px-4 sm:px-5 py-4 text-left transition-colors" style={{ background: expandedMark === m.num ? ACCENT_LIGHT : "#fff" }}>
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0" style={{ background: ACCENT, color: NAVY }}>{m.num}</span>
                      <div><p className="font-bold text-sm" style={{ color: NAVY }}>{m.title}</p><p className="text-xs" style={{ color: "#999" }}>{m.ref}</p></div>
                    </div>
                    <svg className={`w-5 h-5 transition-transform duration-300 ${expandedMark === m.num ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="#999"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {expandedMark === m.num && (
                    <div className="px-4 sm:px-5 pb-5 border-t" style={{ borderColor: "#eee" }}>
                      <Scripture>{m.scripture}</Scripture>
                      {m.paragraphs.map((para, i) => (<p key={i} className="text-sm leading-relaxed mb-3" style={{ color: "#333" }}>{para}</p>))}
                      <Reflect id={`mark_${m.num}`} prompt={m.prompt} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>);

      case "declaration":
        return (<div className="space-y-6">
          <SectionHead sub="A declaration is not a wishlist. It is a covenant statement — words you are putting your weight behind. Read each line aloud. Tap to mark the ones you receive.">The Commissioning Declaration</SectionHead>
          <div className="p-4 sm:p-5 rounded-xl border-2 mb-2" style={{ borderColor: ACCENT, background: ACCENT_LIGHT }}>
            <p className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: ACCENT }}>Instructions</p>
            <p className="text-sm" style={{ color: "#555" }}>Read each declaration aloud if you are able. Tap each line to mark it as received. These words are yours to carry.</p>
          </div>
          <div className="space-y-2">
            {DECLARATION.map((line, i) => (
              <button key={i} onClick={() => toggleLine(i)} className="w-full text-left px-4 py-4 rounded-xl border-2 transition-all duration-200 flex items-start gap-3" style={{ borderColor: declaredLines.includes(i) ? ACCENT : "#e5e5e5", background: declaredLines.includes(i) ? ACCENT_LIGHT : "#fff" }}>
                <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all" style={{ borderColor: declaredLines.includes(i) ? ACCENT : "#ccc", background: declaredLines.includes(i) ? ACCENT : "transparent" }}>
                  {declaredLines.includes(i) && <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke={NAVY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <p className="text-sm leading-relaxed italic" style={{ color: declaredLines.includes(i) ? NAVY : "#555", fontWeight: declaredLines.includes(i) ? "600" : "400" }}>{line}</p>
              </button>
            ))}
          </div>
          <div className="p-4 rounded-xl text-center" style={{ background: declaredLines.length === DECLARATION.length ? NAVY : "#f9f9f7" }}>
            <p className="text-sm font-semibold" style={{ color: declaredLines.length === DECLARATION.length ? GOLD : "#aaa" }}>
              {declaredLines.length === DECLARATION.length ? "Every declaration received. You are ready to be sent." : `${declaredLines.length} of ${DECLARATION.length} declarations received`}
            </p>
          </div>
          <Reflect id="declaration_reflect" prompt="Which declaration was hardest to receive? What does that resistance reveal about what God is still working in you?" />
        </div>);

      case "accountability":
        return (<div className="space-y-6">
          <SectionHead sub="A commissioned leader does not go alone. Accountability is not an optional add-on to deployment — it is the structure that protects the assignment.">Accountability Structure</SectionHead>
          <Scripture>{"\u201CIron sharpens iron, and one person sharpens another.\u201D \u2014 Proverbs 27:17"}</Scripture>
          <p className="text-sm leading-relaxed" style={{ color: "#333" }}>Three accountability relationships are required for sustainable deployment. Each one serves a different protective function. A leader who has only one \u2014 or none \u2014 is operating without covering. This is not a suggestion. It is a structural requirement for what you are being sent to do.</p>
          <div className="space-y-4">
            {ACCOUNTABILITY_TYPES.map((a, i) => (
              <div key={i} className="rounded-xl border overflow-hidden" style={{ borderColor: "#e0e0e0" }}>
                <div className="px-4 py-3" style={{ background: NAVY }}>
                  <p className="font-bold text-sm text-white">{i + 1}. {a.type}</p>
                </div>
                <div className="p-4">
                  <p className="text-sm leading-relaxed mb-3" style={{ color: "#333" }}>{a.description}</p>
                  <p className="text-xs italic mb-3" style={{ color: "#888" }}>{a.question}</p>
                  <textarea className="w-full border rounded-lg p-3 text-sm leading-relaxed resize-none focus:outline-none focus:ring-2" style={{ borderColor: "#e0e0e0", minHeight: "80px" }} placeholder="Name this person and describe your current accountability relationship with them..." value={responses[`acct_${i}`] || ""} onChange={e => setResponses(r => ({ ...r, [`acct_${i}`]: e.target.value }))} />
                </div>
              </div>
            ))}
          </div>
          <div className="p-5 rounded-xl" style={{ background: CREAM }}>
            <p className="text-sm font-semibold mb-2" style={{ color: NAVY }}>The Gap Check</p>
            <p className="text-sm italic mb-3" style={{ color: "#666" }}>Which of the three accountability relationships is most absent or most superficial in your current leadership? What will you do about it in the next 30 days?</p>
            <textarea className="w-full border rounded-lg p-3 text-sm leading-relaxed resize-none focus:outline-none focus:ring-2" style={{ borderColor: "#ddd", minHeight: "90px" }} placeholder="Write your honest answer here..." value={responses["acct_gap"] || ""} onChange={e => setResponses(r => ({ ...r, acct_gap: e.target.value }))} />
          </div>
        </div>);

      case "commitment":
        return (<div className="space-y-6">
          <div className="p-5 rounded-xl text-center" style={{ background: `linear-gradient(160deg, ${NAVY}, #0d2d50)` }}>
            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: GOLD_D }}>The Final Step</p>
            <h3 className="text-xl sm:text-2xl font-bold" style={{ color: GOLD, fontFamily: "'Cormorant Garamond', serif" }}>You Are Sent</h3>
            <p className="text-sm mt-2" style={{ color: "#ccc" }}>These six commitments are not a checklist. They are a covenant. Write them with the weight they deserve.</p>
          </div>
          <div className="space-y-5">{COMMITMENT_PROMPTS.map(c => (<div key={c.id}><label className="block text-sm font-semibold mb-2" style={{ color: NAVY }}>{c.label}</label><textarea className="w-full border rounded-lg p-3 text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 transition-all" style={{ borderColor: "#ddd", minHeight: "90px" }} placeholder={c.placeholder} value={commitments[c.id] || ""} onChange={e => setCommitments(p => ({ ...p, [c.id]: e.target.value }))} /></div>))}</div>
          <div className="mt-6 p-5 rounded-xl" style={{ background: ACCENT_LIGHT }}>
            <h4 className="font-bold mb-3" style={{ color: NAVY }}>Return to This Page</h4>
            <p className="text-sm mb-3 leading-relaxed" style={{ color: "#333" }}>The commissioning is not a one-time event. It is a posture you return to. When the assignment gets heavy, when the alignment drifts, when you are not sure you are still sent \u2014 come back to what you wrote here. Read your declaration again. Review your commitments. Let the word that commissioned you reorient you.</p>
            <p className="text-sm font-semibold mb-3" style={{ color: NAVY }}>Revisit your commissioning:</p>
            <div className="space-y-2 ml-1">{REVISIT_TRIGGERS.map((t, i) => (<div key={i} className="flex items-start gap-3"><span className="mt-1.5 w-2 h-2 rounded-full shrink-0" style={{ background: ACCENT }} /><p className="text-sm leading-relaxed" style={{ color: "#333" }}>{t}</p></div>))}</div>
          </div>
        </div>);

      case "summary":
        return (<div className="space-y-6">
          <div className="text-center">
            <p className="text-xs uppercase tracking-widest mb-1" style={{ color: ACCENT }}>Your Commissioning Word</p>
            <h3 className="text-xl sm:text-2xl font-bold" style={{ color: NAVY, fontFamily: "'Cormorant Garamond', serif" }}>Receive Your Send-Off</h3>
            <p className="text-sm mt-1 italic" style={{ color: "#888" }}>Generated from everything you have written across this training.</p>
          </div>
          {!aiSummary && !loading && (<button onClick={generateSummary} className="w-full py-4 rounded-xl font-bold text-lg transition-all hover:opacity-90" style={{ background: `linear-gradient(135deg, ${ACCENT_MID}, ${NAVY})`, color: NAVY }}>Generate My Commissioning Word</button>)}
          {loading && (<div className="text-center py-12"><div className="w-10 h-10 border-4 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: ACCENT_LIGHT, borderTopColor: ACCENT }} /><p className="text-sm" style={{ color: "#888" }}>Preparing your commissioning word...</p></div>)}
          {aiSummary && (<>
            <div className="p-5 sm:p-6 rounded-2xl border-2" style={{ borderColor: ACCENT, background: `linear-gradient(160deg, ${ACCENT_LIGHT}, #fff)` }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: ACCENT }}><span className="text-sm" style={{ color: NAVY }}>{"\u2726"}</span></div>
                <p className="font-bold" style={{ color: NAVY }}>Your Commissioning Word</p>
              </div>
              <div style={{ color: "#333" }}>{aiSummary.split("\n\n").map((para, i) => (<p key={i} className="mb-4 leading-relaxed text-sm" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "16px", lineHeight: "1.8" }}>{para}</p>))}</div>
            </div>
            <div className="p-5 rounded-xl text-center" style={{ background: NAVY }}>
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: GOLD_D }}>Awakening Destiny Global</p>
              <p className="text-sm font-semibold" style={{ color: "#fff" }}>5C Leadership Blueprint Complete</p>
              <p className="text-xs mt-1" style={{ color: GOLD_D }}>Calling \u00B7 Connection \u00B7 Competency \u00B7 Capacity \u00B7 Convergence</p>
            </div>
            <button onClick={() => downloadWordDoc("Commissioning", responses, commitments, scores, commissioningDiagnostic, aiSummary)} className="w-full py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 border-2" style={{ borderColor: ACCENT, color: NAVY, background: ACCENT_LIGHT }}>Download My Commissioning Word (.doc)</button>
          </>)}
        </div>);

      default: return null;
    }
  };

  // ═══════════════════════════════════════════════════════════
  // MAIN LAYOUT
  // ═══════════════════════════════════════════════════════════
  return (<>
    <Head><title>Commissioning | 5C Leadership Blueprint</title></Head>
    <div className="min-h-screen" style={{ background: "#FAFAF8", fontFamily: "'Outfit', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <div className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="/" className="text-sm font-medium flex items-center gap-1 hover:opacity-70 transition-opacity" style={{ color: NAVY }}>{"\u2190"} Dashboard</a>
          <div className="text-center"><p className="text-xs uppercase tracking-widest" style={{ color: ACCENT }}>Final Module</p><p className="text-sm font-bold" style={{ color: NAVY }}>Commissioning</p></div>
          <div className="w-16" />
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-4">
        <div className="flex items-center gap-1 overflow-x-auto pb-2 -mx-1 px-1">
          {STEPS.map((s, i) => (<button key={s.id} onClick={() => setStep(i)} className="flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all" style={{ background: i === step ? ACCENT : i < step ? ACCENT_LIGHT : "transparent", color: i === step ? NAVY : i < step ? ACCENT : "#aaa", border: `1px solid ${i <= step ? ACCENT : "#e5e5e5"}` }}>{i < step && <span>{"\u2713"}</span>}{s.label}</button>))}
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 pb-32" ref={topRef}>
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: ACCENT }}>{currentStep.label}</p>
          <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: NAVY, fontFamily: "'Cormorant Garamond', serif" }}>Commissioning: Sent (Deployment)</h2>
          <p className="text-sm mt-1 italic" style={{ color: "#888" }}>The blueprint is complete. Now you go.</p>
        </div>
        {renderStep()}
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-100 py-3 z-40">
        <div className="max-w-3xl mx-auto px-4 flex justify-between items-center">
          <button onClick={() => step > 0 && setStep(step - 1)} disabled={step === 0} className="px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-30" style={{ color: NAVY, border: `1px solid ${NAVY}` }}>{"\u2190"} Previous</button>
          <span className="text-xs" style={{ color: "#aaa" }}>{step + 1} of {STEPS.length}</span>
          <button onClick={() => step < STEPS.length - 1 && setStep(step + 1)} disabled={step === STEPS.length - 1} className="px-4 sm:px-5 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-30" style={{ background: step === STEPS.length - 1 ? "#e0e0e0" : ACCENT, color: step === STEPS.length - 1 ? "#aaa" : NAVY }}>
            {step === STEPS.length - 1 ? "Complete" : `Next \u2192`}
          </button>
        </div>
      </div>
    </div>
  </>);
}
