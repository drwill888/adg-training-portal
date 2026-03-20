// ═══════════════════════════════════════════════════════════════
// MODULE 1: CALLING — Potential (Purpose)
// 5C Leadership Blueprint · Awakening Destiny Global
// Pages Router: pages/modules/calling.js
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
// Module 1 accent = Gold
const ACCENT       = GOLD_D;
const ACCENT_LIGHT = "#FFF9E6";
const ACCENT_MID   = GOLD;

// ─── DIAGNOSTIC DATA ─────────────────────────────────────────
const callingDiagnostic = [
  { num: 1,  cat: "Clarity & Conviction",   text: "I can articulate my calling in one clear sentence.", ref: "Jeremiah 1:5" },
  { num: 2,  cat: "Clarity & Conviction",   text: "I know the difference between my calling and my current assignment." },
  { num: 3,  cat: "Clarity & Conviction",   text: "My sense of purpose does not shift with circumstances or seasons." },
  { num: 4,  cat: "Burden & Stewardship",   text: "There is a recurring burden I carry that I cannot walk away from.", ref: "Nehemiah 1:3\u20134" },
  { num: 5,  cat: "Burden & Stewardship",   text: "I steward the grace on my life with intentionality, not passivity." },
  { num: 6,  cat: "Burden & Stewardship",   text: "I am building for the next twenty-five years, not just the next five months.", ref: "Exodus 20:8" },
  { num: 7,  cat: "Character Under Weight",  text: "My private life can sustain the weight of my public assignment." },
  { num: 8,  cat: "Character Under Weight",  text: "I am the same person in private that I am on platform." },
  { num: 9,  cat: "Character Under Weight",  text: "I have been tested under pressure \u2014 and I did not compromise my integrity." },
  { num: 10, cat: "Expanding Capacity",      text: "I am growing in my ability to carry more without breaking." },
  { num: 11, cat: "Expanding Capacity",      text: "I can identify the difference between healthy pressure and destructive overload." },
  { num: 12, cat: "Expanding Capacity",      text: "I see difficulty as development, not punishment.", ref: "James 1:2\u20134" },
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

// ─── CALLING VS ASSIGNMENT (MACRO/MICRO) ─────────────────────
const MACRO_MICRO = {
  macro: {
    title: "Macro \u2014 Calling (Ecosystem)",
    description: "Your calling is the whole landscape of who you were designed to become. It encompasses your identity, your grace, your burden, your design. It doesn\u2019t change with seasons. It deepens. It\u2019s the territory God assigned you to steward across your lifetime."
  },
  micro: {
    title: "Micro \u2014 Assignment (The Now)",
    description: "Your assignment is the specific expression of your calling in this season, this context, this role, this responsibility. Assignments shift. They have start dates and end dates. You can be called to restore \u2014 and your assignment right now might be rebuilding one team, one organization, one family system. The calling remains. The assignment evolves."
  }
};

// ─── 4 GOVERNING PRINCIPLES ─────────────────────────────────
const PRINCIPLES = [
  {
    num: 1,
    title: "Design Precedes Deployment",
    ref: "Jeremiah 1:5",
    scripture: "\u201CBefore I formed you in the womb I knew you, before you were born I set you apart.\u201D \u2014 Jeremiah 1:5",
    paragraphs: [
      "God forms before He sends. Calling originates in God\u2019s intention, not human ambition. Leadership must be formed internally before it is expressed externally.",
      "If deployment precedes design clarity, instability follows. You cannot build what you have not been shaped to carry. Many leaders launch before they are formed \u2014 and they fracture under the weight of an assignment their character was never prepared to hold.",
      "This is why hiddenness is not punishment. It is preparation. The years of obscurity are not wasted years \u2014 they are forming years. God does not waste formation. He invests it."
    ],
    prompt: "Where in your life have you been deployed before you were formed? What was the result?"
  },
  {
    num: 2,
    title: "Calling Carries Burden",
    ref: "Nehemiah 1:3\u20134",
    scripture: "\u201CWhen I heard these things, I sat down and wept. For some days I mourned and fasted and prayed before the God of heaven.\u201D \u2014 Nehemiah 1:3\u20134",
    paragraphs: [
      "Calling is not a career preference. It is a burden you cannot set down. Nehemiah heard about the broken walls and could not stop weeping. That is the mark of calling \u2014 a weight that won\u2019t leave you alone.",
      "The burden of calling is not depression. It is not anxiety. It is a holy dissatisfaction with the way things are combined with a God-given conviction that you are part of the solution. It interrupts your comfort. It refuses to let you settle.",
      "If you can walk away from it, it\u2019s probably not your calling. If it keeps you up at night, if it won\u2019t let you rest until you act, if you feel physically unable to ignore it \u2014 pay attention. That\u2019s the burden of the Lord."
    ],
    prompt: "What burden do you carry that you cannot walk away from? What breaks your heart consistently?"
  },
  {
    num: 3,
    title: "Calling Must Be Confirmed in Community",
    ref: "1 Samuel 3:8\u20139",
    scripture: "\u201CThen Eli realized that the Lord was calling the boy. So Eli told Samuel, \u2018Go and lie down, and if He calls you, say, Speak, Lord, for your servant is listening.\u2019\u201D \u2014 1 Samuel 3:8\u20139",
    paragraphs: [
      "Samuel heard God\u2019s voice but needed Eli to help him interpret it. Calling does not mature in isolation. It requires mentors, community, and external confirmation. A calling that no one else can see or confirm may be ambition dressed in spiritual language.",
      "Community provides three essential functions for calling: interpretation (helping you understand what God is saying), confirmation (verifying what you\u2019re sensing), and accountability (holding you to what you\u2019ve declared).",
      "This is not about seeking human approval. It is about humility. The leader who refuses external input on their calling is not confident \u2014 they are isolated. And isolated callings produce fragile leaders."
    ],
    prompt: "Who in your life has confirmed your calling? If no one has, what does that tell you?"
  },
  {
    num: 4,
    title: "Calling Governs Decisions",
    ref: "Ephesians 4:1",
    scripture: "\u201CWalk worthy of the calling with which you were called.\u201D \u2014 Ephesians 4:1",
    paragraphs: [
      "Your calling is your decision-making filter. Every opportunity, every invitation, every open door should run through one question: Does this align with my calling, or does it distract from it?",
      "Leaders without a calling filter say yes to everything. They accumulate responsibility instead of stewarding assignment. They end up overcommitted, misaligned, and resentful \u2014 not because the opportunities were bad, but because the opportunities were not theirs.",
      "Calling gives you permission to say no. It protects you from drift, distraction, and overcommitment. The most focused leaders are not the busiest \u2014 they are the most aligned. Every decision passes through the filter: Is this my calling, or someone else\u2019s?"
    ],
    prompt: "What have you said yes to recently that does not align with your calling? What would change if you used your calling as a filter?"
  }
];

// ─── EXEMPLAR: JEREMIAH ──────────────────────────────────────
const EXEMPLAR = {
  name: "Jeremiah",
  title: "Formed Before Sent",
  refs: "Jeremiah 1:4\u201310; 20:9",
  intro: "God spoke to Jeremiah before his birth. The calling preceded the assignment, the resistance, and the suffering.",
  mainScripture: "\u201CBefore I formed you in the womb I knew you, before you were born I set you apart; I appointed you as a prophet to the nations.\u201D \u2014 Jeremiah 1:5",
  bodyParagraphs: [
    "Jeremiah\u2019s immediate response was insecurity: \u201CI do not know how to speak; I am too young.\u201D God did not argue with his weakness. He overrode it with design: \u201CDo not say, \u2018I am too young.\u2019 You must go to everyone I send you to and say whatever I command you.\u201D",
    "Jeremiah\u2019s arc is the arc of every leader who carries a genuine calling: insecurity confronted by divine appointment, obedience tested by opposition, and endurance sustained by the burden that would not let him quit.",
    "\u201CBut if I say, \u2018I will not mention His word or speak anymore in His name,\u2019 His word is in my heart like a fire, a fire shut up in my bones. I am weary of holding it in; indeed, I cannot.\u201D \u2014 Jeremiah 20:9",
  ],
  arc: [
    { stage: "Insecurity", text: "Jeremiah objected to his calling based on age and ability. God overrode the objection with design." },
    { stage: "Confrontation", text: "He was called to speak hard truths to resistant people. His calling required courage, not comfort." },
    { stage: "Opposition", text: "He was imprisoned, mocked, and isolated. His calling did not protect him from suffering \u2014 it sustained him through it." },
    { stage: "Endurance", text: "He could not quit. The word was fire in his bones. Calling is not a preference you can abandon when it gets hard." },
    { stage: "Legacy", text: "His words outlasted his life. Calling produces fruit that transcends the leader\u2019s lifetime." },
  ],
  coachingQuestions: [
    "Where are you using weakness or inadequacy as an excuse to avoid your calling?",
    "What opposition are you facing right now \u2014 and is it evidence that your calling is real?",
    "Is there a fire in your bones that you\u2019ve been trying to suppress? What would happen if you stopped holding it in?",
  ]
};

// ─── THREE STAGES ────────────────────────────────────────────
const STAGES = [
  {
    name: "Discovery",
    description: "The initial awakening to purpose. You sense something stirring but cannot yet articulate it clearly. There are clues \u2014 recurring burdens, recurring themes, moments where time disappears because you are operating in alignment.",
    ref: "1 Samuel 3:1\u201310",
    marker: "You stop asking \u201CWhat should I do with my life?\u201D and start asking \u201CWhat has God already placed in me?\u201D"
  },
  {
    name: "Development",
    description: "Calling is being tested, refined, and confirmed through experience, mentorship, and failure. This is the forming stage \u2014 where skills sharpen, character deepens, and the gap between vision and execution begins to close.",
    ref: "Jeremiah 1:17\u201319",
    marker: "You stop performing for others and start stewarding what\u2019s been placed in you."
  },
  {
    name: "Deployment",
    description: "Calling becomes operational. You are actively building what you were designed to build, in the context God has assigned. This is not arrival \u2014 it is sustained obedience with increasing clarity and impact.",
    ref: "Ephesians 4:1",
    marker: "You lead from design, not desperation. Your decisions flow from clarity, not reaction."
  }
];

// ─── KEY SCRIPTURES ──────────────────────────────────────────
const KEY_SCRIPTURES = [
  { ref: "Jeremiah 1:5", note: "Formed and set apart before birth." },
  { ref: "Ephesians 4:1", note: "Walk worthy of the calling." },
  { ref: "Romans 12:6\u20138", note: "Gifts differ according to grace given." },
  { ref: "Nehemiah 1:3\u20134", note: "Burden as evidence of calling." },
  { ref: "1 Samuel 3:8\u20139", note: "Calling confirmed through mentorship." },
  { ref: "Exodus 20:8", note: "Long-term stewardship, not short-term ambition." },
  { ref: "Luke 12:48", note: "Greater calling, greater accountability." },
  { ref: "Jeremiah 20:9", note: "Fire shut up in the bones \u2014 calling that cannot be suppressed." },
  { ref: "2 Timothy 1:6", note: "Fan into flame the gift of God." },
  { ref: "Proverbs 29:18", note: "Without vision, the people perish." },
];

// ─── COMMITMENT FIELDS ──────────────────────────────────────
const COMMITMENT_PROMPTS = [
  { id: "thesis", label: "1. My Calling Thesis", placeholder: "Write one sentence that captures your calling \u2014 the design and purpose God placed in you before platform or performance." },
  { id: "burden", label: "2. My Recurring Burden", placeholder: "What burden do you carry that will not leave you alone? What breaks your heart consistently and demands your action?" },
  { id: "assignment", label: "3. My Current Assignment", placeholder: "What is the specific expression of your calling in this season? Who are you serving and what are you building right now?" },
  { id: "filter", label: "4. My Decision Filter", placeholder: "What will you say no to based on this clarity? What opportunities or expectations do not align with your calling?" },
  { id: "nextstep", label: "5. My Next Step", placeholder: "One concrete action you will take within 7 days based on what this module revealed." },
  { id: "accountability", label: "6. My Accountability", placeholder: "Name one person who has permission to ask you about this commitment." },
];

// ─── REVISIT TRIGGERS ────────────────────────────────────────
const REVISIT_TRIGGERS = [
  "When you feel pulled in too many directions at once",
  "When you\u2019ve said yes to something and immediately felt misaligned",
  "When your assignment changes but your calling feels unclear",
  "When you\u2019re comparing your path to someone else\u2019s",
  "When the burden fades and momentum replaces conviction",
  "Quarterly, as a discipline of alignment",
];

// ─── APPLICATION QUESTIONS ───────────────────────────────────
const APPLICATION_QUESTIONS = [
  "What am I currently building that is not aligned with my calling?",
  "Where am I letting other people\u2019s expectations define my assignment?",
  "What would change this month if every decision ran through my calling filter?",
];


// ═══════════════════════════════════════════════════════════════
// WORD DOC DOWNLOAD HELPER
// ═══════════════════════════════════════════════════════════════
function downloadWordDoc(title, responses, commitments, preScores, postScores, diagnostic, aiSummary) {
  const now = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const scoreRows = diagnostic.map(q =>
    `<tr><td style="padding:6px;border:1px solid #ccc;font-size:11px;">${q.num}</td><td style="padding:6px;border:1px solid #ccc;font-size:11px;">${q.text}</td><td style="padding:6px;border:1px solid #ccc;text-align:center;font-size:11px;">${preScores[q.num]||"-"}</td><td style="padding:6px;border:1px solid #ccc;text-align:center;font-size:11px;">${postScores[q.num]||"-"}</td></tr>`
  ).join("");
  const respEntries = Object.entries(responses).filter(([,v])=>v).map(([k,v])=>`<p style="margin:4px 0;"><b>${k}:</b> ${v}</p>`).join("");
  const commitEntries = Object.entries(commitments).filter(([,v])=>v).map(([k,v])=>`<p style="margin:4px 0;"><b>${k}:</b> ${v}</p>`).join("");

  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><title>${title}</title>
<style>body{font-family:Georgia,serif;color:#1a1a1a;max-width:700px;margin:0 auto;padding:40px 20px}h1{color:#021A35;font-size:22px;border-bottom:3px solid #C8A951;padding-bottom:8px}h2{color:#021A35;font-size:16px;margin-top:24px;border-bottom:1px solid #ddd;padding-bottom:4px}p{font-size:12px;line-height:1.6}table{border-collapse:collapse;width:100%;margin:12px 0}th{background:#021A35;color:#fff;padding:8px;font-size:11px;text-align:left}td{font-size:11px}.footer{margin-top:40px;border-top:2px solid #C8A951;padding-top:12px;font-size:10px;color:#888;text-align:center}</style></head>
<body>
<h1>5C Leadership Blueprint \u2014 ${title}</h1>
<p style="color:#888;">Awakening Destiny Global \u2022 ${now}</p>
<h2>Diagnostic Scores</h2>
<table><tr><th>#</th><th>Statement</th><th>Pre</th><th>Post</th></tr>${scoreRows}</table>
<p><b>Pre-Total:</b> ${Object.values(preScores).reduce((a,b)=>a+b,0)}/60 &nbsp;&nbsp; <b>Post-Total:</b> ${Object.values(postScores).reduce((a,b)=>a+b,0)}/60</p>
${respEntries ? `<h2>Reflections</h2>${respEntries}` : ""}
${commitEntries ? `<h2>Commitments</h2>${commitEntries}` : ""}
${aiSummary ? `<h2>My ${title} Blueprint</h2><p>${aiSummary.replace(/\n\n/g,"</p><p>")}</p>` : ""}
<div class="footer"><p>\u00A9 Awakening Destiny Global \u2022 awakeningdestiny.global</p><p>5C Leadership Blueprint \u2014 Developing Leaders \u2022 Creating Champions</p></div>
</body></html>`;

  const blob = new Blob(["\ufeff", html], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `My_${title.replace(/\s+/g,"_")}_Blueprint.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 250);
}


// ═══════════════════════════════════════════════════════════════
// CALLING PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function CallingPage() {
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
  const setScore = (target, num, val) => {
    if (target === "pre") setPreScores(p => ({ ...p, [num]: val }));
    if (target === "post") setPostScores(p => ({ ...p, [num]: val }));
  };
  const totalScore = (obj) => Object.values(obj).reduce((a, b) => a + b, 0);
  const getInterp = (t) => {
    if (t >= 50) return { text: "Strong clarity. Steward and sharpen.", color: ACCENT };
    if (t >= 40) return { text: "Growing clarity. Confirm and deepen.", color: ORANGE };
    if (t >= 30) return { text: "Emerging awareness. Intentional development needed.", color: RED };
    return { text: "Low clarity. Prioritize discovery, mentorship, and reflection.", color: "#991B1B" };
  };

  const generateSummary = async () => {
    setLoading(true);
    try {
      const prompt = `You are a Kingdom leadership coach analyzing a leader's Calling diagnostic and reflections from the 5C Leadership Blueprint by Awakening Destiny Global.

MODULE: Calling — Potential (Purpose)
CENTRAL QUESTION: "Who was I designed to become?"

PRE-DIAGNOSTIC SCORES:
${callingDiagnostic.map(q => `${q.num}. ${q.text} — Score: ${preScores[q.num] || "N/A"}/5`).join("\n")}
Pre-Total: ${totalScore(preScores)}/60

POST-DIAGNOSTIC SCORES:
${callingDiagnostic.map(q => `${q.num}. ${q.text} — Score: ${postScores[q.num] || "N/A"}/5`).join("\n")}
Post-Total: ${totalScore(postScores)}/60

REFLECTION RESPONSES:
${Object.entries(responses).map(([k, v]) => `${k}: ${v}`).join("\n\n")}

COMMITMENTS:
${Object.entries(commitments).map(([k, v]) => `${k}: ${v}`).join("\n\n")}

Write a personalized Calling Blueprint (400-500 words) that:
1. Identifies their strongest and most vulnerable diagnostic categories
2. Names the shift between pre and post scores
3. Addresses their calling thesis and recurring burden
4. Connects their current assignment to their macro calling
5. Gives 2-3 actionable recommendations rooted in the four Calling principles
6. Closes with a prophetic encouragement about their design and purpose

Write in second person. Tone: direct, warm, apostolic. Use Scripture naturally. No bullet points — flowing paragraphs.`;
      const res = await fetch("/api/claude", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt }) });
      const data = await res.json();
      setAiSummary(data.response || data.content?.[0]?.text || "Summary generation failed.");
    } catch (err) { setAiSummary("Unable to generate summary. Please check your connection."); }
    setLoading(false);
  };

  // ─── SHARED COMPONENTS ──────────────────────────────────────
  const Scripture = ({ children }) => (
    <div className="my-4 py-3 px-4 rounded-lg border-l-4" style={{ borderColor: GOLD_D, background: CREAM }}>
      <p className="italic text-sm leading-relaxed" style={{ color: NAVY }}>{children}</p>
    </div>
  );
  const Reflect = ({ id, prompt }) => (
    <div className="mt-5 mb-6">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-1.5 h-5 rounded-full" style={{ background: GOLD_D }} />
        <p className="text-xs sm:text-sm font-semibold tracking-wide" style={{ color: GOLD_D }}>PAUSE & PROCESS</p>
      </div>
      <p className="text-sm mb-3 italic leading-relaxed" style={{ color: "#444" }}>{prompt}</p>
      <textarea className="w-full border rounded-lg p-3 text-sm leading-relaxed resize-none focus:outline-none focus:ring-2" style={{ borderColor: "#ddd", minHeight: "100px" }} placeholder="Write your reflection here..." value={responses[id] || ""} onChange={e => setResponses(r => ({ ...r, [id]: e.target.value }))} />
    </div>
  );
  const SectionHead = ({ children, sub }) => (
    <div className="mb-4">
      <h3 className="text-lg sm:text-xl font-bold" style={{ color: NAVY, fontFamily: "'Cormorant Garamond', serif" }}>{children}</h3>
      {sub && <p className="text-sm mt-1 italic" style={{ color: "#888" }}>{sub}</p>}
    </div>
  );

  // ─── DIAGNOSTIC TABLE (MOBILE RESPONSIVE) ──────────────────
  const renderDiagnostic = (target, scoreObj) => {
    const categories = [...new Set(callingDiagnostic.map(q => q.cat))];
    return (
      <div className="space-y-5">
        {categories.map(cat => (
          <div key={cat}>
            <div className="px-3 sm:px-4 py-2.5 rounded-t-lg font-semibold text-xs tracking-widest uppercase" style={{ background: NAVY, color: "#fff" }}>{cat}</div>
            <div className="border border-t-0 rounded-b-lg divide-y" style={{ borderColor: "#e5e5e5" }}>
              {callingDiagnostic.filter(q => q.cat === cat).map(q => (
                <div key={q.num} className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 px-3 sm:px-4 py-3">
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <span className="text-xs font-mono mt-0.5 w-5 shrink-0" style={{ color: "#bbb" }}>{q.num}</span>
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed" style={{ color: "#1a1a1a" }}>{q.text}</p>
                      {q.ref && <p className="text-xs mt-0.5" style={{ color: "#aaa" }}>{q.ref}</p>}
                    </div>
                  </div>
                  <div className="flex gap-1.5 shrink-0 ml-7 sm:ml-0">
                    {[1,2,3,4,5].map(v => (
                      <button key={v} onClick={() => setScore(target, q.num, v)} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full text-xs font-bold transition-all duration-200" style={{ background: scoreObj[q.num] === v ? ACCENT : "transparent", color: scoreObj[q.num] === v ? NAVY : "#999", border: `2px solid ${scoreObj[q.num] === v ? ACCENT : "#e0e0e0"}` }}>{v}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="mt-4 p-4 rounded-xl" style={{ background: ACCENT_LIGHT }}>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <span className="font-bold text-lg" style={{ color: NAVY }}>Your Total: {totalScore(scoreObj)} / 60</span>
            <span className="text-sm font-medium" style={{ color: getInterp(totalScore(scoreObj)).color }}>{getInterp(totalScore(scoreObj)).text}</span>
          </div>
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════
  // RENDER EACH STEP
  // ═══════════════════════════════════════════════════════════
  const renderStep = () => {
    switch (currentStep.id) {

      case "activation":
        return (
          <div className="space-y-6">
            <div className="p-5 rounded-xl" style={{ background: CREAM }}>
              <p className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: GOLD_D }}>THE 5C LEADERSHIP LIFECYCLE</p>
              <div className="flex gap-1 overflow-x-auto py-2 -mx-1 px-1">
                {["CALLING","CONNECTION","COMPETENCY","CAPACITY","CONVERGENCE"].map((c, i) => (
                  <div key={c} className="px-2 sm:px-3 py-2 rounded-lg text-center text-xs font-bold tracking-wide shrink-0" style={{ background: i === 0 ? NAVY : "#f5f5f0", color: i === 0 ? GOLD : "#999", minWidth: "80px" }}>{c}</div>
                ))}
              </div>
              <p className="text-sm leading-relaxed mt-3" style={{ color: "#333" }}>
                Calling is the foundation. It answers the first and most essential question: <strong style={{ color: NAVY }}>Who was I designed to become?</strong>
              </p>
              <p className="text-sm leading-relaxed mt-2" style={{ color: "#333" }}>
                Without calling clarity, leaders drift \u2014 even when they look productive. They chase opportunity instead of mandate. They build from ambition instead of design. And they exhaust themselves doing things that were never theirs to carry.
              </p>
            </div>
            <div className="p-5 sm:p-6 rounded-2xl border-l-4" style={{ borderColor: ACCENT, background: `linear-gradient(135deg, ${ACCENT_LIGHT}, #fff)` }}>
              <p className="text-base sm:text-lg italic leading-relaxed" style={{ color: NAVY }}>
                "You were designed before you were deployed. You were known before you were named. Calling is not what you choose \u2014 it is what you were chosen for."
              </p>
            </div>
            <div className="mt-6">
              <p className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: GOLD_D }}>OPENING ACTIVATION</p>
              <p className="text-sm italic mb-4" style={{ color: "#666" }}>Before we teach, we listen. Sit with these questions. Write what surfaces \u2014 not what sounds right.</p>
              <Reflect id="activation_1" prompt="If you had to explain to someone \u2014 in one sentence \u2014 what you were put on this earth to do, what would you say?" />
              <Reflect id="activation_2" prompt="When have you felt most aligned \u2014 most fully yourself in your purpose \u2014 even briefly? Describe that moment." />
            </div>
          </div>
        );

      case "pre-diagnostic":
        return (
          <div className="space-y-6">
            <div className="p-5 rounded-xl" style={{ background: CREAM }}>
              <p className="font-semibold mb-1" style={{ color: NAVY }}>Calling Diagnostic \u2014 Pre-Assessment</p>
              <p className="text-sm" style={{ color: "#666" }}>Rate each statement honestly from 1 (Strongly Disagree) to 5 (Strongly Agree). This is a mirror, not a test.</p>
            </div>
            {renderDiagnostic("pre", preScores)}
            <Reflect id="pre_diag_reflect" prompt="Look at your lowest category. What does it tell you about where your calling clarity is still under construction?" />
          </div>
        );

      case "teaching":
        return (
          <div className="space-y-10">
            {/* Definition */}
            <div>
              <SectionHead>Definition</SectionHead>
              <p className="leading-relaxed mb-3" style={{ color: "#333" }}>Calling is the divine design and grace assignment placed within a person before platform, position, or performance.</p>
              <Scripture>{"\u201CBefore I formed you in the womb I knew you, before you were born I set you apart.\u201D \u2014 Jeremiah 1:5"}</Scripture>
              <p className="leading-relaxed mb-3" style={{ color: "#333" }}>Calling is not self-expression. It is divine stewardship. It carries both invitation and obligation \u2014 grace with weight.</p>
              <Scripture>{"\u201CWalk worthy of the calling with which you were called.\u201D \u2014 Ephesians 4:1"}</Scripture>
            </div>

            {/* Macro & Micro */}
            <div>
              <SectionHead sub="Calling is the ecosystem. Assignment is the expression. Confusing these is where leaders burn out or drift.">Calling: Macro & Micro</SectionHead>
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
              <Reflect id="macro_micro" prompt="What is your calling (the macro)? And what is your current assignment (the micro)? Can you distinguish between them?" />
            </div>

            {/* Principles */}
            <div>
              <SectionHead>Governing Principles</SectionHead>
              <div className="space-y-3">
                {PRINCIPLES.map(p => (
                  <div key={p.num} className="rounded-xl overflow-hidden border" style={{ borderColor: expandedPrinciple === p.num ? ACCENT : "#e5e5e5" }}>
                    <button onClick={() => setExpandedPrinciple(expandedPrinciple === p.num ? null : p.num)} className="w-full flex items-center justify-between px-4 sm:px-5 py-4 text-left transition-colors" style={{ background: expandedPrinciple === p.num ? ACCENT_LIGHT : "#fff" }}>
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0" style={{ background: ACCENT, color: NAVY }}>{p.num}</span>
                        <div>
                          <p className="font-bold text-sm" style={{ color: NAVY }}>{p.title}</p>
                          <p className="text-xs" style={{ color: "#999" }}>{p.ref}</p>
                        </div>
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
          </div>
        );

      case "exemplar":
        return (
          <div className="space-y-6">
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
          </div>
        );

      case "stages":
        return (
          <div className="space-y-6">
            <SectionHead sub="These are not stages you graduate from. They are depths you grow into.">How Calling Develops: Three Stages</SectionHead>
            {/* Mobile: stack cards. Desktop: table */}
            <div className="block sm:hidden space-y-4">
              {STAGES.map((s, i) => (
                <div key={i} className="rounded-xl border overflow-hidden" style={{ borderColor: "#e0e0e0" }}>
                  <div className="px-4 py-3" style={{ background: NAVY }}><p className="font-bold text-white text-sm">Stage {i+1}: {s.name}</p></div>
                  <div className="p-4">
                    <p className="text-sm leading-relaxed mb-2" style={{ color: "#333" }}>{s.description}</p>
                    <p className="text-xs italic mb-3" style={{ color: "#888" }}>{s.ref}</p>
                    <div className="p-3 rounded-lg" style={{ background: ACCENT_LIGHT }}>
                      <p className="text-xs uppercase tracking-wider font-semibold mb-1" style={{ color: ACCENT }}>Transition Marker</p>
                      <p className="text-sm italic" style={{ color: NAVY }}>{s.marker}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="hidden sm:block overflow-x-auto rounded-xl border" style={{ borderColor: "#e0e0e0" }}>
              <table className="w-full text-sm">
                <thead><tr>{STAGES.map((s, i) => (<th key={i} className="text-left px-4 py-3 font-bold text-xs uppercase tracking-wider" style={{ background: NAVY, color: "#fff", width: "33.3%" }}>Stage {i+1}: {s.name}</th>))}</tr></thead>
                <tbody><tr>{STAGES.map((s, i) => (<td key={i} className="px-4 py-4 align-top text-sm leading-relaxed" style={{ color: "#333" }}>{s.description}<p className="text-xs italic mt-2" style={{ color: "#888" }}>{s.ref}</p><div className="mt-3 p-3 rounded-lg" style={{ background: ACCENT_LIGHT }}><p className="text-xs uppercase font-semibold mb-1" style={{ color: ACCENT }}>Transition Marker</p><p className="text-sm italic" style={{ color: NAVY }}>{s.marker}</p></div></td>))}</tr></tbody>
              </table>
            </div>
            <Reflect id="stages_reflect" prompt="Which stage are you in right now? What evidence supports your answer?" />
          </div>
        );

      case "post-diagnostic":
        return (
          <div className="space-y-6">
            <div className="p-5 rounded-xl" style={{ background: CREAM }}>
              <p className="font-semibold mb-1" style={{ color: NAVY }}>Calling Diagnostic \u2014 Post-Assessment</p>
              <p className="text-sm" style={{ color: "#666" }}>Now that you\u2019ve walked through the teaching, rate yourself again. Be honest about what shifted \u2014 and what didn\u2019t.</p>
            </div>
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
            <Reflect id="post_diag_reflect" prompt="What did this diagnostic reveal? Where did you score lowest \u2014 and what does that tell you?" />
            <div className="mt-8">
              <SectionHead sub="These are your anchor texts. Return to them when direction feels unclear, when drift tempts you, when the burden feels too heavy.">Key Scriptures on Calling</SectionHead>
              <div className="space-y-2">
                {KEY_SCRIPTURES.map((s, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-0.5 sm:gap-3 py-2">
                    <span className="font-bold text-sm shrink-0" style={{ color: NAVY, minWidth: "140px" }}>{s.ref}</span>
                    <span className="text-sm italic" style={{ color: "#555" }}>{s.note}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "commitment":
        return (
          <div className="space-y-6">
            <SectionHead sub="Calling must move from revelation to responsibility. Write these in full sentences \u2014 not fragments.">My Calling Commitment</SectionHead>
            <div className="space-y-5">
              {COMMITMENT_PROMPTS.map(c => (
                <div key={c.id}>
                  <label className="block text-sm font-semibold mb-2" style={{ color: NAVY }}>{c.label}</label>
                  <textarea className="w-full border rounded-lg p-3 text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 transition-all" style={{ borderColor: "#ddd", minHeight: "90px" }} placeholder={c.placeholder} value={commitments[c.id] || ""} onChange={e => setCommitments(p => ({ ...p, [c.id]: e.target.value }))} />
                </div>
              ))}
            </div>
            <div className="mt-8 p-5 rounded-xl" style={{ background: ACCENT_LIGHT }}>
              <h4 className="font-bold mb-3" style={{ color: NAVY }}>Calling Is a Living Discipline</h4>
              <p className="text-sm mb-2 leading-relaxed" style={{ color: "#333" }}>What you wrote in this workbook is not a one-time exercise. Calling deepens, sharpens, and sometimes redirects as you grow. The macro never changes. But your awareness of it and your alignment with it require constant renewal.</p>
              <p className="text-sm font-semibold mb-3 mt-4" style={{ color: NAVY }}>Revisit your calling:</p>
              <div className="space-y-2 ml-1">
                {REVISIT_TRIGGERS.map((t, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="mt-1.5 w-2 h-2 rounded-full shrink-0" style={{ background: ACCENT }} />
                    <p className="text-sm leading-relaxed" style={{ color: "#333" }}>{t}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-8">
              <SectionHead sub="Translate calling clarity into leadership behavior.">Application Moment</SectionHead>
              {APPLICATION_QUESTIONS.map((q, i) => (<Reflect key={i} id={`application_${i}`} prompt={q} />))}
            </div>
          </div>
        );

      case "summary":
        return (
          <div className="space-y-6">
            <SectionHead sub="Based on your diagnostics, reflections, and commitments \u2014 here is your personalized Calling analysis.">Your Calling Blueprint</SectionHead>
            {!aiSummary && !loading && (
              <button onClick={generateSummary} className="w-full py-4 rounded-xl font-bold text-lg transition-all hover:opacity-90" style={{ background: `linear-gradient(135deg, ${ACCENT}, ${NAVY})`, color: "#fff" }}>
                Generate My Calling Blueprint
              </button>
            )}
            {loading && (
              <div className="text-center py-12">
                <div className="w-10 h-10 border-4 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: ACCENT_LIGHT, borderTopColor: ACCENT }} />
                <p className="text-sm" style={{ color: "#888" }}>Generating your personalized blueprint...</p>
              </div>
            )}
            {aiSummary && (
              <>
                <div className="p-5 sm:p-6 rounded-2xl border" style={{ borderColor: ACCENT }}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: ACCENT }}><span className="text-sm" style={{ color: NAVY }}>{"\u2726"}</span></div>
                    <p className="font-bold" style={{ color: NAVY }}>Your Calling Blueprint</p>
                  </div>
                  <div style={{ color: "#333" }}>
                    {aiSummary.split("\n\n").map((para, i) => (<p key={i} className="mb-3 leading-relaxed text-sm">{para}</p>))}
                  </div>
                </div>
                <button onClick={() => downloadWordDoc("Calling", responses, commitments, preScores, postScores, callingDiagnostic, aiSummary)} className="w-full py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 border-2" style={{ borderColor: ACCENT, color: NAVY, background: ACCENT_LIGHT }}>
                  Download My Calling Blueprint (.doc)
                </button>
              </>
            )}
          </div>
        );

      default: return null;
    }
  };

  // ═══════════════════════════════════════════════════════════
  // MAIN LAYOUT
  // ═══════════════════════════════════════════════════════════
  return (
    <>
      <Head><title>Calling | 5C Leadership Blueprint</title></Head>
      <div className="min-h-screen" style={{ background: "#FAFAF8", fontFamily: "'Outfit', sans-serif" }}>
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

        {/* Top Bar */}
        <div className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-gray-100">
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="/" className="text-sm font-medium flex items-center gap-1 hover:opacity-70 transition-opacity" style={{ color: NAVY }}>{"\u2190"} Dashboard</a>
            <div className="text-center">
              <p className="text-xs uppercase tracking-widest" style={{ color: ACCENT }}>Module 1</p>
              <p className="text-sm font-bold" style={{ color: NAVY }}>Calling</p>
            </div>
            <div className="w-16" />
          </div>
        </div>

        {/* Progress Steps */}
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-1 overflow-x-auto pb-2 -mx-1 px-1">
            {STEPS.map((s, i) => (
              <button key={s.id} onClick={() => setStep(i)} className="flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all" style={{ background: i === step ? ACCENT : i < step ? ACCENT_LIGHT : "transparent", color: i === step ? NAVY : i < step ? ACCENT : "#aaa", border: `1px solid ${i <= step ? ACCENT : "#e5e5e5"}` }}>
                {i < step && <span>{"\u2713"}</span>}{s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-4 pb-32" ref={topRef}>
          <div className="mb-8">
            <p className="text-xs uppercase tracking-widest mb-1" style={{ color: ACCENT }}>{currentStep.label}</p>
            <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: NAVY, fontFamily: "'Cormorant Garamond', serif" }}>Calling: Potential (Purpose)</h2>
            <p className="text-sm mt-1 italic" style={{ color: "#888" }}>Central Question: Who was I designed to become?</p>
          </div>
          {renderStep()}
        </div>

        {/* Bottom Nav */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-100 py-3 z-40">
          <div className="max-w-3xl mx-auto px-4 flex justify-between items-center">
            <button onClick={() => step > 0 && setStep(step - 1)} disabled={step === 0} className="px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-30" style={{ color: NAVY, border: `1px solid ${NAVY}` }}>{"\u2190"} Previous</button>
            <span className="text-xs" style={{ color: "#aaa" }}>{step + 1} of {STEPS.length}</span>
            <button onClick={() => step < STEPS.length - 1 && setStep(step + 1)} disabled={step === STEPS.length - 1} className="px-4 sm:px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-30" style={{ background: ACCENT, color: NAVY }}>Next {"\u2192"}</button>
          </div>
        </div>
      </div>
    </>
  );
}
