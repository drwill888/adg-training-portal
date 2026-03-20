// ═══════════════════════════════════════════════════════════════
// MODULE 3: COMPETENCY — Excellence (Credibility)
// 5C Leadership Blueprint · Awakening Destiny Global
// Pages Router: pages/modules/competency.js
// ═══════════════════════════════════════════════════════════════
import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { supabase } from '../../lib/supabase';
import { saveModuleProgress, saveAiSummary } from '../../lib/db';

// ─── BRAND PALETTE ───────────────────────────────────────────
const NAVY    = "#021A35";
const GOLD    = "#FDD20D";
const GOLD_D  = "#C8A951";
const BLUE    = "#0172BC";
const SKY     = "#00AEEF";
const ORANGE  = "#F47722";
const RED     = "#EE3124";
const CREAM   = "#FDF8F0";
// Module 3 accent = Orange
const ACCENT       = ORANGE;
const ACCENT_LIGHT = "#FFF3E8";
const ACCENT_MID   = "#FDBA74";

// ─── DIAGNOSTIC DATA ─────────────────────────────────────────
const competencyDiagnostic = [
  { num: 1,  cat: "Skill & Discipline",          text: "I invest consistently in developing my core skills.", ref: "Proverbs 22:29" },
  { num: 2,  cat: "Skill & Discipline",          text: "I pursue excellence as a spiritual standard, not just a professional one.", ref: "Colossians 3:23" },
  { num: 3,  cat: "Skill & Discipline",          text: "I can distinguish between what I’m anointed for and what I’m actually prepared for." },
  { num: 4,  cat: "Execution & Reliability",     text: "I follow through on commitments consistently.", ref: "Luke 16:10" },
  { num: 5,  cat: "Execution & Reliability",     text: "Others trust me to deliver what I promise." },
  { num: 6,  cat: "Execution & Reliability",     text: "I can manage complexity without becoming reactive or overwhelmed." },
  { num: 7,  cat: "Systems & Sustainability",    text: "I build systems that outlast emotional momentum.", ref: "Exodus 18:21–23" },
  { num: 8,  cat: "Systems & Sustainability",    text: "I delegate with clarity and defined expectations." },
  { num: 9,  cat: "Systems & Sustainability",    text: "I can organize people and process for sustainable outcomes." },
  { num: 10, cat: "Multiplication & Transfer",   text: "I can train others in what I do.", ref: "2 Timothy 2:2" },
  { num: 11, cat: "Multiplication & Transfer",   text: "I develop leaders with reproducible process, not just inspiration." },
  { num: 12, cat: "Multiplication & Transfer",   text: "I create pathways where others grow in competency over time." },
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

// ─── ANOINTED ONLY VS. ANOINTED & PREPARED ───────────────────
const CONTRAST_TABLE = [
  { dimension: "Foundation",         left: "Gifting alone",                     right: "Gifting + preparation" },
  { dimension: "Leadership Style",   left: "Improvisation under pressure",     right: "Structured execution" },
  { dimension: "Response to Growth", left: "Overwhelmed by scale",             right: "Systems absorb growth" },
  { dimension: "Team Development",   left: "Inspiration without transfer",     right: "Reproducible training" },
  { dimension: "Decision-Making",    left: "Reactive and instinctual",         right: "Strategic and informed" },
  { dimension: "Sustainability",     left: "Momentum-dependent",               right: "System-sustained" },
  { dimension: "Delegation",         left: "Abdication or micromanagement",    right: "Clarity with accountability" },
  { dimension: "Under Pressure",     left: "Talent compensates for gaps",      right: "Preparation absorbs pressure" },
  { dimension: "Legacy",             left: "Dependent on the leader’s presence", right: "Transferable beyond the leader" },
];

// ─── 5 GOVERNING PRINCIPLES ─────────────────────────────────
const PRINCIPLES = [
  {
    num: 1, title: "Revelation Must Become Reality", ref: "Genesis 41:33–36",
    scripture: "“Now therefore, let Pharaoh select a discerning and wise man, and set him over the land of Egypt.” — Genesis 41:33",
    paragraphs: [
      "Joseph did not just interpret the dream. He built a system to execute it. Revelation without structure is a vision that dies on the whiteboard. Many leaders can see what God is doing. Few can build what God is showing.",
      "The gap between revelation and reality is competency. It is the ability to take what God reveals and translate it into strategy, structure, and sustainable execution. Without this bridge, prophetic leaders become frustrated dreamers.",
      "God gives revelation. Leaders must build the structure to steward it. The dream was God’s. The plan was Joseph’s. And the execution required competency that had been forged through years of preparation in Potiphar’s house, in prison, and in obscurity."
    ],
    prompt: "Where in your leadership do you have revelation without structure? What vision has God given you that you have not yet built a system to execute?"
  },
  {
    num: 2, title: "Excellence Is a Spiritual Standard", ref: "Colossians 3:23",
    scripture: "“Whatever you do, work heartily, as for the Lord and not for men.” — Colossians 3:23",
    paragraphs: [
      "Excellence is not perfectionism. It is the refusal to offer God or people less than your best. It is a spiritual posture before it is a professional standard. The leader who settles for mediocrity in their craft is not being humble — they are being unfaithful.",
      "Anointing does not replace preparation. Passion does not replace process. Vision does not replace skill. Many leaders are gifted. Few are trained. And the gap between what they see and what they can build is the competency gap.",
      "Excellence positions leaders. “Do you see a man skillful in his work? He will stand before kings; he will not stand before obscure men.” — Proverbs 22:29. Skill opens doors that anointing alone cannot."
    ],
    prompt: "Where are you relying on anointing to compensate for preparation you haven’t done? What skill gap is limiting your effectiveness?"
  },
  {
    num: 3, title: "Systems Sustain Momentum", ref: "Exodus 18:21–23",
    scripture: "“Moreover, look for able men from all the people, men who fear God, who are trustworthy and hate a bribe, and place such men over the people.” — Exodus 18:21",
    paragraphs: [
      "Moses was burning out. Jethro’s intervention was not spiritual — it was structural. He told Moses to build a system of delegation that would sustain what one leader could not carry alone.",
      "Leaders who resist systems eventually become the bottleneck of their own vision. They cannot scale what lives only in their head. They cannot sustain what depends entirely on their presence. Systems are not unspiritual. They are stewardship.",
      "The question is not whether you need systems — it is whether you will build them before you break under the weight of what you’re carrying."
    ],
    prompt: "Where are you the bottleneck in your own organization? What system could you build this month that would free you to lead at a higher level?"
  },
  {
    num: 4, title: "Competency Must Be Transferable", ref: "2 Timothy 2:2",
    scripture: "“And what you have heard from me in the presence of many witnesses entrust to faithful people who will be able to teach others also.” — 2 Timothy 2:2",
    paragraphs: [
      "Competency that cannot be transferred is a ceiling, not a foundation. If your organization cannot function without you, you have not built leaders — you have built dependency.",
      "Paul’s instruction to Timothy reveals a four-generation multiplication chain: Paul → Timothy → faithful people → others also. That is the competency standard. It is not enough to be skilled. You must make others skilled.",
      "The test of competency is not what you can do. It is what you can reproduce. The leader who develops other leaders has multiplied their competency. The leader who hoards their skill has limited their legacy."
    ],
    prompt: "What competency do you have that you have not yet transferred to anyone else? Who should you be training right now?"
  },
  {
    num: 5, title: "Competency Governs What You Build", ref: "Proverbs 21:5",
    scripture: "“The plans of the diligent lead surely to abundance, but everyone who is hasty comes only to poverty.” — Proverbs 21:5",
    paragraphs: [
      "This principle is your decision-making filter for competency. The question: Am I building this because I’m gifted here, or because my calling demands it? If your calling demands a competency you don’t have, the answer is not to avoid it — it is to develop it.",
      "Competency is not static. What worked last season may bottleneck this one. Skills decay without intentional maintenance. The leader who was competent five years ago may be the leader who is limiting their organization today.",
      "Diligence is not just working hard. It is working strategically — building the right skills, in the right order, for the right season. Competency without alignment is just busyness."
    ],
    prompt: "Am I competent for what this season demands? Where is the widest gap between what my calling requires and what my skills can deliver?"
  }
];

// ─── EXEMPLAR: JOSEPH ────────────────────────────────────────
const EXEMPLAR = {
  name: "Joseph", title: "Structured Excellence", refs: "Genesis 39–41",
  intro: "Joseph is the clearest biblical model of competency forged through preparation. His journey from slave to second-in-command was not a leap — it was a long obedience in obscurity.",
  mainScripture: "“The Lord was with Joseph, and he became a successful man.” — Genesis 39:2",
  bodyParagraphs: [
    "In Potiphar’s house, Joseph managed a household with excellence. In prison, he managed inmates and operations with the same standard. The context changed. The competency didn’t.",
    "When Pharaoh’s dream required interpretation, Joseph delivered revelation. But he didn’t stop there. He immediately followed with a strategic plan — a system of storage, distribution, and governance that would sustain an entire nation through seven years of famine.",
    "Joseph’s competency was not accidental. It was forged in every season of obscurity, injustice, and waiting. By the time the platform arrived, the preparation had already been done.",
  ],
  arc: [
    { stage: "Potiphar’s House", text: "Managed a household with excellence. Faithfulness in a small assignment revealed capacity for a larger one." },
    { stage: "Prison", text: "Same standard, harder context. Joseph didn’t lower his competency because his circumstances lowered." },
    { stage: "Pharaoh’s Court", text: "Revelation became strategy. He didn’t just interpret the dream — he built the system to execute it." },
    { stage: "National Governance", text: "Fourteen years of sustained leadership. Competency at scale. The system outlasted the crisis." },
    { stage: "Legacy", text: "Joseph’s competency preserved a nation and positioned his family for generational impact." },
  ],
  coachingQuestions: [
    "Where are you managing with excellence right now — even in a small or unglamorous assignment?",
    "What competency is God building in you during this season of obscurity or waiting?",
    "Can you turn your revelation into a strategy — or does it stay in the dream stage?",
  ]
};

// ─── THREE STAGES ────────────────────────────────────────────
const STAGES = [
  { name: "Learning Foundations", description: "Acquiring the base knowledge, skills, and disciplines your calling demands. This is the classroom stage — formal or informal. Reading, studying, apprenticing, failing, and learning from failure.", ref: "Proverbs 1:5", marker: "You stop assuming gifting is enough and start investing in structured development." },
  { name: "Skill Development", description: "Moving from knowledge to application. You can execute reliably. You deliver what you promise. Others begin to trust your output. You are building a track record of competence, not just potential.", ref: "2 Timothy 2:15", marker: "You stop talking about what you could do and start being known for what you consistently deliver." },
  { name: "Structural Execution", description: "Building systems that sustain and multiply. You are not just skilled — you are building structures where others become skilled. Delegation is clear. Transfer is intentional. Your competency has moved from personal to organizational.", ref: "Exodus 18:21–23", marker: "Your organization runs without your constant presence. Your competency lives in others, not just in you." }
];

// ─── KEY SCRIPTURES ──────────────────────────────────────────
const KEY_SCRIPTURES = [
  { ref: "Proverbs 22:29",        note: "Skillful work positions leaders before kings." },
  { ref: "2 Timothy 2:15",        note: "Present yourself approved — a worker unashamed." },
  { ref: "Colossians 3:23",       note: "Whatever you do, work heartily as for the Lord." },
  { ref: "Proverbs 21:5",         note: "The plans of the diligent lead to abundance." },
  { ref: "Luke 16:10",            note: "Faithful in little, faithful in much." },
  { ref: "Exodus 18:21–23",       note: "Systems protect leaders and sustain momentum." },
  { ref: "1 Corinthians 9:22",    note: "Adaptability without compromise." },
  { ref: "2 Timothy 2:2",         note: "Entrust to faithful people who can teach others." },
  { ref: "Titus 1:5",             note: "Put what remains into order." },
  { ref: "Genesis 41:38–49",      note: "Revelation became strategy, strategy became governance." },
];

// ─── COMMITMENT / REVISIT / APPLICATION ──────────────────────
const COMMITMENT_PROMPTS = [
  { id: "gap",           label: "1. My Top Competency Gap",         placeholder: "What is the single biggest gap between your calling and your current skill level?" },
  { id: "season",        label: "2. My Current Season Demand",      placeholder: "What specific competency does this season require that you have not yet developed?" },
  { id: "plan",          label: "3. My Development Plan",           placeholder: "What will you do in the next 90 days to close your top competency gap? Be specific." },
  { id: "transfer",      label: "4. My Transferability Target",     placeholder: "Who are you training? What competency will you transfer to someone else this quarter?" },
  { id: "system",        label: "5. My System to Build",            placeholder: "What system or structure will you build this month to sustain what you’re carrying?" },
  { id: "accountability",label: "6. My Accountability",             placeholder: "Who will hold you accountable to this development plan?" },
];
const REVISIT_TRIGGERS = [
  "When your calling demands something your skills cannot deliver",
  "When you feel overwhelmed by scale or complexity",
  "When delegation breaks down or nobody can do what you do",
  "When your systems no longer fit your current season",
  "When excellence has been replaced by survival mode",
  "Quarterly, as a discipline of professional stewardship",
];
const APPLICATION_QUESTIONS = [
  "What am I currently building that my competency cannot sustain?",
  "Where am I coasting on past skill instead of developing new capacity?",
  "What would change this month if I treated competency as a spiritual discipline?",
];

// ─── MACRO / MICRO ───────────────────────────────────────────
const MACRO_MICRO = {
  macro: { title: "Macro — Skill Base (Lifetime)", description: "Your accumulated skills, knowledge, and expertise built over years. This is your competency reservoir — everything you’ve learned, practiced, and mastered across every season of your leadership." },
  micro: { title: "Micro — Season Demands (Current)", description: "The specific competencies this season requires. Your skill base may be deep, but every new season brings new demands. The question: Am I competent for what this season demands — not just what last season required?" }
};


// ═══════════════════════════════════════════════════════════════
// WORD DOC DOWNLOAD
// ═══════════════════════════════════════════════════════════════
function downloadWordDoc(title, responses, commitments, preScores, postScores, diagnostic, aiSummary) {
  const now = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const scoreRows = diagnostic.map(q => `<tr><td style="padding:6px;border:1px solid #ccc;font-size:11px;">${q.num}</td><td style="padding:6px;border:1px solid #ccc;font-size:11px;">${q.text}</td><td style="padding:6px;border:1px solid #ccc;text-align:center;font-size:11px;">${preScores[q.num]||"-"}</td><td style="padding:6px;border:1px solid #ccc;text-align:center;font-size:11px;">${postScores[q.num]||"-"}</td></tr>`).join("");
  const respEntries = Object.entries(responses).filter(([,v])=>v).map(([k,v])=>`<p style="margin:4px 0;"><b>${k}:</b> ${v}</p>`).join("");
  const commitEntries = Object.entries(commitments).filter(([,v])=>v).map(([k,v])=>`<p style="margin:4px 0;"><b>${k}:</b> ${v}</p>`).join("");
  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>${title}</title><style>body{font-family:Georgia,serif;color:#1a1a1a;max-width:700px;margin:0 auto;padding:40px 20px}h1{color:#021A35;font-size:22px;border-bottom:3px solid #C8A951;padding-bottom:8px}h2{color:#021A35;font-size:16px;margin-top:24px;border-bottom:1px solid #ddd;padding-bottom:4px}p{font-size:12px;line-height:1.6}table{border-collapse:collapse;width:100%;margin:12px 0}th{background:#021A35;color:#fff;padding:8px;font-size:11px;text-align:left}td{font-size:11px}.footer{margin-top:40px;border-top:2px solid #C8A951;padding-top:12px;font-size:10px;color:#888;text-align:center}</style></head><body><h1>5C Leadership Blueprint — ${title}</h1><p style="color:#888;">Awakening Destiny Global • ${now}</p><h2>Diagnostic Scores</h2><table><tr><th>#</th><th>Statement</th><th>Pre</th><th>Post</th></tr>${scoreRows}</table><p><b>Pre-Total:</b> ${Object.values(preScores).reduce((a,b)=>a+b,0)}/60 &nbsp;&nbsp; <b>Post-Total:</b> ${Object.values(postScores).reduce((a,b)=>a+b,0)}/60</p>${respEntries?`<h2>Reflections</h2>${respEntries}`:""}${commitEntries?`<h2>Commitments</h2>${commitEntries}`:""}${aiSummary?`<h2>My ${title} Blueprint</h2><p>${aiSummary.replace(/\n\n/g,"</p><p>")}</p>`:""}<div class="footer"><p>© Awakening Destiny Global • awakeningdestiny.global</p><p>5C Leadership Blueprint — Developing Leaders • Creating Champions</p></div></body></html>`;
  const blob = new Blob(["﻿", html], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = `My_${title.replace(/\s+/g,"_")}_Blueprint.doc`; document.body.appendChild(a); a.click(); document.body.removeChild(a); setTimeout(() => URL.revokeObjectURL(url), 250);
}


// ═══════════════════════════════════════════════════════════════
// COMPETENCY PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function CompetencyPage() {
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

  const [userId, setUserId] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) setUserId(session.user.id);
    });
  }, []);

  useEffect(() => {
    if (step > 1 && userId && Object.keys(preScores).length > 0) {
      const total = Object.values(preScores).reduce((a, b) => a + b, 0);
      saveModuleProgress(userId, 3, "Competency", {
        status: "in_progress",
        pre_score: total,
        reflections: responses,
        started_at: new Date().toISOString(),
      });
    }
  }, [step]);

  useEffect(() => {
    if (step > 5 && userId && Object.keys(postScores).length > 0) {
      const total = Object.values(postScores).reduce((a, b) => a + b, 0);
      saveModuleProgress(userId, 3, "Competency", {
        post_score: total,
        commitments: commitments,
      });
    }
  }, [step]);
  const currentStep = STEPS[step];
  const setScore = (target, num, val) => { if (target === "pre") setPreScores(p => ({ ...p, [num]: val })); if (target === "post") setPostScores(p => ({ ...p, [num]: val })); };
  const totalScore = (obj) => Object.values(obj).reduce((a, b) => a + b, 0);
  const getInterp = (t) => {
    if (t >= 50) return { text: "Strong credibility. Refine and multiply.", color: ACCENT };
    if (t >= 40) return { text: "Developing strength. Sharpen execution and transferability.", color: ORANGE };
    if (t >= 30) return { text: "Emerging competency. Prioritize skill-building and discipline.", color: RED };
    return { text: "High calling, low readiness. Urgent development required.", color: "#991B1B" };
  };

  const generateSummary = async () => {
    setLoading(true);
    try {
      const prompt = `You are a Kingdom leadership coach analyzing a leader's Competency diagnostic and reflections from the 5C Leadership Blueprint by Awakening Destiny Global.

MODULE: Competency — Excellence (Credibility)
CENTRAL QUESTION: "Can I carry what I'm called to build?"

PRE-DIAGNOSTIC SCORES:
${competencyDiagnostic.map(q => `${q.num}. ${q.text} — Score: ${preScores[q.num] || "N/A"}/5`).join("\n")}
Pre-Total: ${totalScore(preScores)}/60

POST-DIAGNOSTIC SCORES:
${competencyDiagnostic.map(q => `${q.num}. ${q.text} — Score: ${postScores[q.num] || "N/A"}/5`).join("\n")}
Post-Total: ${totalScore(postScores)}/60

REFLECTION RESPONSES:
${Object.entries(responses).map(([k, v]) => `${k}: ${v}`).join("\n\n")}

COMMITMENTS:
${Object.entries(commitments).map(([k, v]) => `${k}: ${v}`).join("\n\n")}

Write a personalized Competency Blueprint (400-500 words) that:
1. Identifies their strongest and most vulnerable diagnostic categories
2. Names the shift between pre and post scores
3. Addresses their top competency gap and development plan
4. Connects their season demands to their transferability target
5. Gives 2-3 actionable recommendations rooted in the five Competency principles
6. Closes with a prophetic encouragement about their preparation and excellence

Write in second person. Tone: direct, warm, apostolic. Use Scripture naturally. No bullet points — flowing paragraphs.`;
      const res = await fetch("/api/claude", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt }) });
      const data = await res.json();
      const summaryText = data.response || data.content?.[0]?.text || "Summary generation failed.";
      setAiSummary(summaryText);
      if (userId && summaryText !== "Summary generation failed.") {
        await saveAiSummary(userId, 3, "Competency", summaryText);
        await saveModuleProgress(userId, 3, "Competency", {
          status: "completed",
          completed_at: new Date().toISOString(),
        });
      }
    } catch (err) { setAiSummary("Unable to generate summary. Please check your connection."); }
    setLoading(false);
  };

  // ─── SHARED COMPONENTS ──────────────────────────────────────
  const Scripture = ({ children }) => (<div className="my-4 py-3 px-4 rounded-lg border-l-4" style={{ borderColor: GOLD_D, background: CREAM }}><p className="italic text-sm leading-relaxed" style={{ color: NAVY }}>{children}</p></div>);
  const Reflect = ({ id, prompt }) => (<div className="mt-5 mb-6"><div className="flex items-center gap-2 mb-2"><div className="w-1.5 h-5 rounded-full" style={{ background: GOLD_D }} /><p className="text-xs sm:text-sm font-semibold tracking-wide" style={{ color: GOLD_D }}>PAUSE & PROCESS</p></div><p className="text-sm mb-3 italic leading-relaxed" style={{ color: "#444" }}>{prompt}</p><textarea className="w-full border rounded-lg p-3 text-sm leading-relaxed resize-none focus:outline-none focus:ring-2" style={{ borderColor: "#ddd", minHeight: "100px" }} placeholder="Write your reflection here..." value={responses[id] || ""} onChange={e => setResponses(r => ({ ...r, [id]: e.target.value }))} /></div>);
  const SectionHead = ({ children, sub }) => (<div className="mb-4"><h3 className="text-lg sm:text-xl font-bold" style={{ color: NAVY, fontFamily: "'Cormorant Garamond', serif" }}>{children}</h3>{sub && <p className="text-sm mt-1 italic" style={{ color: "#888" }}>{sub}</p>}</div>);

  // ─── DIAGNOSTIC TABLE (MOBILE) ─────────────────────────────
  const renderDiagnostic = (target, scoreObj) => {
    const categories = [...new Set(competencyDiagnostic.map(q => q.cat))];
    return (<div className="space-y-5">{categories.map(cat => (<div key={cat}><div className="px-3 sm:px-4 py-2.5 rounded-t-lg font-semibold text-xs tracking-widest uppercase" style={{ background: NAVY, color: "#fff" }}>{cat}</div><div className="border border-t-0 rounded-b-lg divide-y" style={{ borderColor: "#e5e5e5" }}>{competencyDiagnostic.filter(q => q.cat === cat).map(q => (<div key={q.num} className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 px-3 sm:px-4 py-3"><div className="flex items-start gap-2 flex-1 min-w-0"><span className="text-xs font-mono mt-0.5 w-5 shrink-0" style={{ color: "#bbb" }}>{q.num}</span><div className="flex-1"><p className="text-sm leading-relaxed" style={{ color: "#1a1a1a" }}>{q.text}</p>{q.ref && <p className="text-xs mt-0.5" style={{ color: "#aaa" }}>{q.ref}</p>}</div></div><div className="flex gap-1.5 shrink-0 ml-7 sm:ml-0">{[1,2,3,4,5].map(v => (<button key={v} onClick={() => setScore(target, q.num, v)} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full text-xs font-bold transition-all duration-200" style={{ background: scoreObj[q.num] === v ? ACCENT : "transparent", color: scoreObj[q.num] === v ? "#fff" : "#999", border: `2px solid ${scoreObj[q.num] === v ? ACCENT : "#e0e0e0"}` }}>{v}</button>))}</div></div>))}</div></div>))}<div className="mt-4 p-4 rounded-xl" style={{ background: ACCENT_LIGHT }}><div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2"><span className="font-bold text-lg" style={{ color: NAVY }}>Your Total: {totalScore(scoreObj)} / 60</span><span className="text-sm font-medium" style={{ color: getInterp(totalScore(scoreObj)).color }}>{getInterp(totalScore(scoreObj)).text}</span></div></div></div>);
  };

  // ═══════════════════════════════════════════════════════════
  const renderStep = () => {
    switch (currentStep.id) {

      case "activation":
        return (<div className="space-y-6">
          <div className="p-5 rounded-xl" style={{ background: CREAM }}>
            <p className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: GOLD_D }}>THE 5C LEADERSHIP LIFECYCLE</p>
            <p className="text-sm leading-relaxed mb-3" style={{ color: "#333" }}>In Modules 1 and 2, we established Calling and Connection — design and identity. Now we move to the dimension that makes calling executable.</p>
            <div className="flex gap-1 overflow-x-auto py-2 -mx-1 px-1">
              {["CALLING","CONNECTION","COMPETENCY","CAPACITY","CONVERGENCE"].map((c, i) => (
                <div key={c} className="px-2 sm:px-3 py-2 rounded-lg text-center text-xs font-bold tracking-wide shrink-0" style={{ background: i === 2 ? NAVY : i < 2 ? ACCENT_LIGHT : "#f5f5f0", color: i === 2 ? ACCENT : i < 2 ? ACCENT : "#999", minWidth: "80px" }}>{c}</div>
              ))}
            </div>
            <p className="text-sm leading-relaxed mt-3" style={{ color: "#333" }}>Competency answers the third essential question: <strong style={{ color: NAVY }}>Can I carry what I’m called to build?</strong></p>
            <p className="text-sm leading-relaxed mt-2" style={{ color: "#333" }}>Anointing does not replace preparation. Passion does not replace process. Vision does not replace skill. This is where calling becomes executable.</p>
          </div>
          <div className="p-5 sm:p-6 rounded-2xl border-l-4" style={{ borderColor: ACCENT, background: `linear-gradient(135deg, ${ACCENT_LIGHT}, #fff)` }}>
            <p className="text-base sm:text-lg italic leading-relaxed" style={{ color: NAVY }}>"The gap between what you see and what you can build is the competency gap. And it is the gap that most leaders never close."</p>
          </div>
          <div className="mt-6">
            <p className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: GOLD_D }}>OPENING ACTIVATION</p>
            <p className="text-sm italic mb-4" style={{ color: "#666" }}>Before we teach, we listen. Write what surfaces honestly.</p>
            <Reflect id="activation_1" prompt="Where is the biggest gap between what you’ve been called to build and what you are currently equipped to execute?" />
            <Reflect id="activation_2" prompt="Where have you relied on gifting or anointing to compensate for skills you haven’t developed?" />
          </div>
        </div>);

      case "pre-diagnostic":
        return (<div className="space-y-6">
          <div className="p-5 rounded-xl" style={{ background: CREAM }}><p className="font-semibold mb-1" style={{ color: NAVY }}>Competency Diagnostic — Pre-Assessment</p><p className="text-sm" style={{ color: "#666" }}>Rate each statement honestly from 1 (Strongly Disagree) to 5 (Strongly Agree). This is a mirror, not a test.</p></div>
          {renderDiagnostic("pre", preScores)}
          <Reflect id="pre_diag_reflect" prompt="Look at your lowest category. What does it tell you about where your competency is still under construction?" />
        </div>);

      case "teaching":
        return (<div className="space-y-10">
          {/* Definition */}
          <div>
            <SectionHead>Definition</SectionHead>
            <p className="leading-relaxed mb-3" style={{ color: "#333" }}>Competency is the disciplined development of skill, knowledge, and structure that enables calling to function effectively and sustainably.</p>
            <Scripture>{"“Do you see a man skillful in his work? He will stand before kings; he will not stand before obscure men.” — Proverbs 22:29"}</Scripture>
            <p className="leading-relaxed mb-3" style={{ color: "#333" }}>Competency is not optional. It is the bridge between revelation and reality, between what God shows you and what you can actually build. Without it, vision remains a dream. With it, vision becomes structure.</p>
            <Scripture>{"“Whatever you do, work heartily, as for the Lord and not for men.” — Colossians 3:23"}</Scripture>
          </div>

          {/* Contrast Table */}
          <div>
            <SectionHead sub="Every leader operates from one of two internal postures regarding skill and preparation.">Anointed Only vs. Anointed & Prepared</SectionHead>
            <div className="block sm:hidden space-y-3">
              {CONTRAST_TABLE.map((row, i) => (
                <div key={i} className="rounded-lg border overflow-hidden" style={{ borderColor: "#e0e0e0" }}>
                  <div className="px-3 py-2 text-xs font-bold" style={{ background: "#f9fafb", color: NAVY }}>{row.dimension}</div>
                  <div className="grid grid-cols-2 divide-x" style={{ divideColor: "#e0e0e0" }}>
                    <div className="px-3 py-2" style={{ background: "#FEF2F2" }}><p className="text-xs font-semibold mb-0.5" style={{ color: RED }}>Anointed Only</p><p className="text-xs" style={{ color: "#7F1D1D" }}>{row.left}</p></div>
                    <div className="px-3 py-2" style={{ background: ACCENT_LIGHT }}><p className="text-xs font-semibold mb-0.5" style={{ color: ACCENT }}>Anointed & Prepared</p><p className="text-xs" style={{ color: NAVY }}>{row.right}</p></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="hidden sm:block overflow-x-auto rounded-xl border" style={{ borderColor: "#e0e0e0" }}>
              <table className="w-full text-sm"><thead><tr>
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider" style={{ background: "#f9fafb", color: "#888", width: "28%" }}>Dimension</th>
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider" style={{ background: "#FEE2E2", color: RED }}>Anointed Only</th>
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider" style={{ background: NAVY, color: "#fff" }}>Anointed & Prepared</th>
              </tr></thead><tbody>{CONTRAST_TABLE.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-3 font-medium text-sm" style={{ color: NAVY }}>{row.dimension}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: "#7F1D1D" }}>{row.left}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: ACCENT }}>{row.right}</td>
                </tr>
              ))}</tbody></table>
            </div>
            <Reflect id="contrast_reflect" prompt="Look at the ‘Anointed Only’ column. Where do you see yourself? Be honest — not aspirational." />
          </div>

          {/* Macro & Micro */}
          <div>
            <SectionHead sub="Just as Calling and Connection have macro/micro dimensions, Competency does too.">Competency: Macro & Micro</SectionHead>
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
            <Reflect id="macro_micro" prompt="What competencies does this specific season demand that previous seasons did not? Are you developing them or avoiding them?" />
          </div>

          {/* 5 Principles */}
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
            <h3 className="text-xl sm:text-2xl font-bold" style={{ color: NAVY, fontFamily: "'Cormorant Garamond', serif" }}>{EXEMPLAR.name} — {EXEMPLAR.title}</h3>
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
          <SectionHead sub="These are not stages you graduate from. They are depths you grow into.">How Competency Develops: Three Stages</SectionHead>
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
          <Reflect id="stages_reflect" prompt="Which stage are you in right now? What evidence supports your answer?" />
        </div>);

      case "post-diagnostic":
        return (<div className="space-y-6">
          <div className="p-5 rounded-xl" style={{ background: CREAM }}><p className="font-semibold mb-1" style={{ color: NAVY }}>Competency Diagnostic — Post-Assessment</p><p className="text-sm" style={{ color: "#666" }}>Rate yourself again. Be honest about what shifted — and what didn’t.</p></div>
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
          <Reflect id="post_diag_reflect" prompt="What did this diagnostic reveal? Where is the widest gap between your calling and your competency?" />
          <div className="mt-8">
            <SectionHead sub="These are your anchor texts. Return to them when preparation feels tedious, when the gap between vision and execution feels overwhelming.">Key Scriptures on Competency</SectionHead>
            <div className="space-y-2">{KEY_SCRIPTURES.map((s, i) => (<div key={i} className="flex flex-col sm:flex-row sm:items-start gap-0.5 sm:gap-3 py-2"><span className="font-bold text-sm shrink-0" style={{ color: NAVY, minWidth: "160px" }}>{s.ref}</span><span className="text-sm italic" style={{ color: "#555" }}>{s.note}</span></div>))}</div>
          </div>
        </div>);

      case "commitment":
        return (<div className="space-y-6">
          <SectionHead sub="Competency must move from awareness to action. Write these in full sentences.">My Competency Commitment</SectionHead>
          <div className="space-y-5">{COMMITMENT_PROMPTS.map(c => (<div key={c.id}><label className="block text-sm font-semibold mb-2" style={{ color: NAVY }}>{c.label}</label><textarea className="w-full border rounded-lg p-3 text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 transition-all" style={{ borderColor: "#ddd", minHeight: "90px" }} placeholder={c.placeholder} value={commitments[c.id] || ""} onChange={e => setCommitments(p => ({ ...p, [c.id]: e.target.value }))} /></div>))}</div>
          <div className="mt-8 p-5 rounded-xl" style={{ background: ACCENT_LIGHT }}>
            <h4 className="font-bold mb-3" style={{ color: NAVY }}>Competency Is a Living Discipline</h4>
            <p className="text-sm mb-2 leading-relaxed" style={{ color: "#333" }}>What you wrote here is not a one-time exercise. Skills decay without intentional maintenance. Systems outgrow their design. What worked last season can bottleneck this one. Competency must be audited, sharpened, and expanded as your calling deepens.</p>
            <p className="text-sm font-semibold mb-3 mt-4" style={{ color: NAVY }}>Revisit your competency:</p>
            <div className="space-y-2 ml-1">{REVISIT_TRIGGERS.map((t, i) => (<div key={i} className="flex items-start gap-3"><span className="mt-1.5 w-2 h-2 rounded-full shrink-0" style={{ background: ACCENT }} /><p className="text-sm leading-relaxed" style={{ color: "#333" }}>{t}</p></div>))}</div>
          </div>
          <div className="mt-8">
            <SectionHead sub="Translate competency awareness into leadership behavior.">Application Moment</SectionHead>
            {APPLICATION_QUESTIONS.map((q, i) => (<Reflect key={i} id={`application_${i}`} prompt={q} />))}
          </div>
          <div className="p-5 rounded-xl text-center" style={{ background: NAVY }}>
            <p className="text-xs uppercase tracking-widest mb-1" style={{ color: GOLD }}>NEXT MODULE</p>
            <p className="text-lg font-bold" style={{ color: "#fff" }}>CAPACITY</p>
            <p className="text-sm" style={{ color: ACCENT_MID }}>Character (Sustainability)</p>
          </div>
        </div>);

      case "summary":
        return (<div className="space-y-6">
          <SectionHead sub="Based on your diagnostics, reflections, and commitments — here is your personalized Competency analysis.">Your Competency Blueprint</SectionHead>
          {!aiSummary && !loading && (<button onClick={generateSummary} className="w-full py-4 rounded-xl font-bold text-lg transition-all hover:opacity-90 text-white" style={{ background: `linear-gradient(135deg, ${ACCENT}, ${NAVY})` }}>Generate My Competency Blueprint</button>)}
          {loading && (<div className="text-center py-12"><div className="w-10 h-10 border-4 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: ACCENT_LIGHT, borderTopColor: ACCENT }} /><p className="text-sm" style={{ color: "#888" }}>Generating your personalized blueprint...</p></div>)}
          {aiSummary && (<>
            <div className="p-5 sm:p-6 rounded-2xl border" style={{ borderColor: ACCENT }}>
              <div className="flex items-center gap-2 mb-4"><div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: ACCENT }}><span className="text-white text-sm">{"✦"}</span></div><p className="font-bold" style={{ color: NAVY }}>Your Competency Blueprint</p></div>
              <div style={{ color: "#333" }}>{aiSummary.split("\n\n").map((para, i) => (<p key={i} className="mb-3 leading-relaxed text-sm">{para}</p>))}</div>
            </div>
            <button onClick={() => downloadWordDoc("Competency", responses, commitments, preScores, postScores, competencyDiagnostic, aiSummary)} className="w-full py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 border-2" style={{ borderColor: ACCENT, color: NAVY, background: ACCENT_LIGHT }}>Download My Competency Blueprint (.doc)</button>
          </>)}
        </div>);

      default: return null;
    }
  };

  // ═══════════════════════════════════════════════════════════
  // MAIN LAYOUT
  // ═══════════════════════════════════════════════════════════
  return (<>
    <Head><title>Competency | 5C Leadership Blueprint</title></Head>
    <div className="min-h-screen" style={{ background: "#FAFAF8", fontFamily: "'Outfit', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <div className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="/" className="text-sm font-medium flex items-center gap-1 hover:opacity-70 transition-opacity" style={{ color: NAVY }}>{"←"} Dashboard</a>
          <div className="text-center"><p className="text-xs uppercase tracking-widest" style={{ color: ACCENT }}>Module 3</p><p className="text-sm font-bold" style={{ color: NAVY }}>Competency</p></div>
          <div className="w-16" />
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-4">
        <div className="flex items-center gap-1 overflow-x-auto pb-2 -mx-1 px-1">
          {STEPS.map((s, i) => (<button key={s.id} onClick={() => setStep(i)} className="flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all" style={{ background: i === step ? ACCENT : i < step ? ACCENT_LIGHT : "transparent", color: i === step ? "#fff" : i < step ? ACCENT : "#aaa", border: `1px solid ${i <= step ? ACCENT : "#e5e5e5"}` }}>{i < step && <span>{"✓"}</span>}{s.label}</button>))}
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 pb-32" ref={topRef}>
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: ACCENT }}>{currentStep.label}</p>
          <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: NAVY, fontFamily: "'Cormorant Garamond', serif" }}>Competency: Excellence (Credibility)</h2>
          <p className="text-sm mt-1 italic" style={{ color: "#888" }}>Central Question: Can I carry what I’m called to build?</p>
        </div>
        {renderStep()}
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-100 py-3 z-40">
        <div className="max-w-3xl mx-auto px-4 flex justify-between items-center">
          <button onClick={() => step > 0 && setStep(step - 1)} disabled={step === 0} className="px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-30" style={{ color: NAVY, border: `1px solid ${NAVY}` }}>{"←"} Previous</button>
          <span className="text-xs" style={{ color: "#aaa" }}>{step + 1} of {STEPS.length}</span>
          <button onClick={() => step < STEPS.length - 1 && setStep(step + 1)} disabled={step === STEPS.length - 1} className="px-4 sm:px-5 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-30" style={{ background: ACCENT, color: "#fff" }}>Next {"→"}</button>
        </div>
      </div>
    </div>
  </>);
}
