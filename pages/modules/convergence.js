// ═══════════════════════════════════════════════════════════════
// MODULE 5: CONVERGENCE — Alignment (Legacy)
// 5C Leadership Blueprint · Awakening Destiny Global
// Pages Router: pages/modules/convergence.js
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
// Module 5 accent = Red
const ACCENT       = RED;
const ACCENT_LIGHT = "#FEF2F2";
const ACCENT_MID   = "#FCA5A5";

// ─── DIAGNOSTIC DATA ─────────────────────────────────────────
const convergenceDiagnostic = [
  { num: 1,  cat: "Alignment & Integration",     text: "My calling, relationships, skills, and pace are all working together in this season.", ref: "Ephesians 4:13" },
  { num: 2,  cat: "Alignment & Integration",     text: "My daily decisions are consistent with my long-term assignment." },
  { num: 3,  cat: "Alignment & Integration",     text: "I am not building something that no longer aligns with who God has called me to be." },
  { num: 4,  cat: "Fruitfulness & Multiplication", text: "My leadership is producing lasting fruit, not just visible activity.", ref: "John 15:16" },
  { num: 5,  cat: "Fruitfulness & Multiplication", text: "I am multiplying leaders, not just managing followers." },
  { num: 6,  cat: "Fruitfulness & Multiplication", text: "I can point to people whose lives and leadership are different because of my investment." },
  { num: 7,  cat: "Legacy Thinking",              text: "I am building something that will outlast my involvement.", ref: "Acts 13:36" },
  { num: 8,  cat: "Legacy Thinking",              text: "I think in generations, not just in ministry seasons or fiscal years." },
  { num: 9,  cat: "Legacy Thinking",              text: "I have identified and am developing the leaders who will carry this assignment forward." },
  { num: 10, cat: "Finishing Well",               text: "I am as faithful and excellent now as I was when I started this assignment.", ref: "2 Timothy 4:7" },
  { num: 11, cat: "Finishing Well",               text: "There is no area of my life or leadership where I am quietly drifting from my values." },
  { num: 12, cat: "Finishing Well",               text: "The people closest to me would say I am finishing well — not just appearing to." },
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

// ─── FRAGMENTED vs. CONVERGENT CONTRAST TABLE ────────────────
const CONTRAST_TABLE = [
  { dimension: "Identity Source",        left: "Role-defined",                         right: "Calling-defined" },
  { dimension: "Decision Filter",        left: "Opportunity-driven",                   right: "Assignment-driven" },
  { dimension: "Time Horizon",           left: "This season",                          right: "Next generation" },
  { dimension: "Success Metric",         left: "Output and visibility",                right: "Fruitfulness and transfer" },
  { dimension: "Relationships",          left: "Network to leverage",                  right: "People to develop" },
  { dimension: "Response to Pruning",    left: "Resistance and self-protection",       right: "Surrender and trust" },
  { dimension: "Pace",                   left: "Driven by demand",                     right: "Governed by design" },
  { dimension: "End-Game Awareness",     left: "Hasn’t considered how it ends",   right: "Building toward a clear finish" },
  { dimension: "Legacy",                 left: "What people remember about you",       right: "What they carry because of you" },
];

// ─── 5 GOVERNING PRINCIPLES ─────────────────────────────────
const PRINCIPLES = [
  {
    num: 1, title: "Convergence Is Alignment, Not Arrival", ref: "Ephesians 4:13",
    scripture: "“Until we all reach unity in the faith and in the knowledge of the Son of God and become mature, attaining to the whole measure of the fullness of Christ.” — Ephesians 4:13",
    paragraphs: [
      "Convergence is not a destination you arrive at. It is a posture you sustain. It is the ongoing alignment of who you are with what you are called to do, in the season you are actually in — not the season you wish you were in, or the season five years ahead.",
      "Many leaders misread convergence as a finish line. They believe that once they reach a certain level of influence, revenue, or platform, everything will finally come together. But convergence does not come with scale. It comes with surrender. It is available in the small assignment and the large one alike — if you are aligned.",
      "The Greek word translated “mature” (téleios) carries the sense of completeness, of something that has reached its intended end. Convergence is the ongoing process of becoming what you were designed to be — fully, not partially. It is not the end of growth. It is growth at its most integrated."
    ],
    prompt: "Where in your life and leadership are you not yet aligned? Where are you operating in a previous season’s assignment instead of the current one?"
  },
  {
    num: 2, title: "Fruitfulness Requires Pruning", ref: "John 15:1–2",
    scripture: "“Every branch in Me that does bear fruit He prunes so that it will be even more fruitful.” — John 15:2",
    paragraphs: [
      "The most disorienting seasons of a leader’s convergence are the pruning seasons — when God removes things that were good to make room for things that are necessary. Pruning does not feel like promotion. It feels like loss. But the Vinedresser knows the difference between dead wood and load-bearing branches.",
      "Pruning is not punishment. It is precision. God does not prune what is not fruitful. He prunes what is fruitful to make it more so. The leader who resists every season of reduction is the leader who never reaches their full yield. You cannot carry the harvest of convergence and the dead weight of the previous season at the same time.",
      "What God is asking you to release may be a title, a relationship, an organization, a ministry expression, or an identity you have built around a specific role. The question is not whether it was good. The question is whether it is still yours to carry — or whether holding it is preventing the next measure of fruitfulness."
    ],
    prompt: "What is God currently pruning in your leadership? What are you holding onto that is costing you more fruit than it is producing?"
  },
  {
    num: 3, title: "You Build for Generations You Will Never Meet", ref: "Acts 13:36",
    scripture: "“David, after he had served the purpose of God in his own generation, fell asleep.” — Acts 13:36",
    paragraphs: [
      "This is the most sobering sentence in Scripture about legacy. David served the purpose of God — not his own purpose. Not the most impressive purpose. Not the largest platform. The purpose of God, for his generation. Then he died. And the next generation built what his generation made possible.",
      "The temple David could not build, Solomon built — because David served his generation faithfully. Legacy does not require that you personally complete what God has called you to begin. It requires that you steward your season so thoroughly that the next generation has something to build on.",
      "This reframes every long-term leadership decision. The question shifts from “What can I accomplish in my lifetime?” to “What am I building that will outlast me?” The most fruitful leaders are not the ones who do the most. They are the ones who leave the most behind for those who come after them."
    ],
    prompt: "If you fell asleep today, what would the next generation have to build on? What would they lack because of what you left unfinished or untransferred?"
  },
  {
    num: 4, title: "Finishing Well Is the Most Demanding Leadership Discipline", ref: "2 Timothy 4:7",
    scripture: "“I have fought the good fight, I have finished the race, I have kept the faith.” — 2 Timothy 4:7",
    paragraphs: [
      "Paul wrote these words from prison, awaiting execution, with most of his companions gone. There was no platform. No applause. No visible fruit in the room. Just the interior certainty of a man who had stayed aligned with his assignment from beginning to end. That is finishing well.",
      "More leaders begin well than finish well. The drift is rarely dramatic. It is gradual — a slight compromise in character, an unchecked ambition, a slow erosion of the private disciplines that once sustained the public weight. Finishing well demands the same vigilance at year twenty-five that it demanded at year one.",
      "The race Paul refers to is not a sprint. It is a course — a specific route assigned to a specific runner. You cannot finish well on someone else’s course. Finishing well means staying on your route, at your pace, with your faith intact, to the end of your assignment. Not further. Not shorter. To the end."
    ],
    prompt: "Are you on track to finish well? What area of your life or leadership represents the greatest threat to the integrity of your finish?"
  },
  {
    num: 5, title: "Convergence Is the Sum of the Other Four", ref: "Colossians 1:28–29",
    scripture: "“Him we proclaim, warning everyone and teaching everyone with all wisdom, that we may present everyone mature in Christ. For this I toil, struggling with all His energy.” — Colossians 1:28–29",
    paragraphs: [
      "Convergence does not exist in isolation. It is the integration of everything the 5C Blueprint has been building. Calling establishes the design. Connection grounds the identity. Competency equips the execution. Capacity sustains the weight. Convergence is where all four come together into a life fully aligned with its purpose.",
      "Paul’s word for “mature” here is téleios again — complete, whole, lacking nothing. That is the vision. Not a person who has arrived, but a person who is fully becoming what they were designed to be, in every dimension at once. That is convergence.",
      "The measure of convergence is not what you have built. It is what you have become. And what you have become is what you will leave behind — in the lives of the leaders you developed, the systems you built, the assignments you finished, and the next generation you made room for."
    ],
    prompt: "Looking across all five dimensions — Calling, Connection, Competency, Capacity, Convergence — where is the most significant misalignment in your current leadership? What does full integration require from you?"
  }
];

// ─── EXEMPLAR: PAUL ──────────────────────────────────────────
const EXEMPLAR = {
  name: "Paul", title: "The Finished Course", refs: "Acts 9; Philippians 3:12–14; 2 Timothy 4:6–8",
  intro: "Paul is Scripture’s most complete portrait of convergence — a man whose calling, identity, competency, capacity, and finish line were so fully integrated that even chains and execution could not move him off course.",
  mainScripture: "“I have fought the good fight, I have finished the race, I have kept the faith. Now there is in store for me the crown of righteousness.” — 2 Timothy 4:7–8",
  bodyParagraphs: [
    "Paul’s convergence was not the result of linear progress. It was the result of radical reorientation. On the Damascus road, every credential he had built was rendered irrelevant. He spent years in Arabia before his public assignment began. The calling preceded the platform by more than a decade.",
    "His self-assessment in Philippians 3 is the most honest leadership inventory in the New Testament: “Not that I have already obtained all this, or have already arrived at my goal, but I press on to take hold of that for which Christ Jesus took hold of me.” Convergence is not claiming to have arrived. It is refusing to stop pressing.",
    "By 2 Timothy, written in his final imprisonment, Paul had full visibility of his finish line. He was not managing optics or protecting his legacy. He was simply telling the truth about a life that had stayed on course. That is the goal.",
  ],
  arc: [
    { stage: "Reorientation", text: "Damascus road. Every credential surrendered. Every assumption overturned. Convergence begins with the willingness to be fully redirected." },
    { stage: "Formation", text: "Years in Arabia before public assignment. Convergence requires the hidden seasons. The platform is never the first chapter." },
    { stage: "Alignment", text: "Calling, identity, competency, and capacity integrating across decades of mission. No wasted season. Every hardship producing what comfort could not." },
    { stage: "Transfer", text: "Timothy. Titus. Faithful people entrusted with what Paul carried. Convergence is incomplete without intentional transfer." },
    { stage: "Finish", text: "“I have kept the faith.” Not just built a movement — finished the assignment. That is the standard." },
  ],
  coachingQuestions: [
    "What “Damascus road” moment has God used to reorient your leadership — and are you still walking in the direction it sent you?",
    "Who is your Timothy? Who are you transferring your assignment to with the same intentionality Paul invested in his successors?",
    "Can you say, in this season, that you are pressing forward — not coasting, not drifting, not protecting what you’ve already built?",
  ]
};

// ─── THREE STAGES ────────────────────────────────────────────
const STAGES = [
  { name: "Fragmented", description: "Operating in multiple disconnected modes. Calling is known but not consistently governing decisions. Relationships, skills, and pace are not yet integrated. There is activity, even significant activity, but it lacks a unified center. You are busy building things that don’t all point the same direction.", ref: "Haggai 1:5–6", marker: "You stop asking ‘What else can I do?’ and start asking ‘What am I actually called to build?’" },
  { name: "Integrating", description: "The five dimensions are beginning to work together. Decisions are increasingly filtered through calling. Relationships are being built with intentionality. Competency is matched to assignment. Capacity rhythms are stabilizing. You can feel the difference between seasons of alignment and seasons of drift — and you’re learning to choose alignment.", ref: "Philippians 3:12–14", marker: "You stop tolerating misalignment and start making the harder decisions that protect your course." },
  { name: "Convergent", description: "Everything is pointing the same direction. Who you are, what you do, how you lead, and who you’re developing are all in alignment. You are not trying to do everything — you are doing your thing, excellently, sustainably, for the long haul. You are building a legacy, not a platform. You are becoming, not just performing.", ref: "2 Timothy 4:7", marker: "You can say, with Paul, that you are finishing the course assigned to you — faithfully, not perfectly, but fully." }
];

// ─── KEY SCRIPTURES ──────────────────────────────────────────
const KEY_SCRIPTURES = [
  { ref: "2 Timothy 4:7",         note: "Fought the good fight. Finished the race. Kept the faith." },
  { ref: "Acts 13:36",            note: "Served the purpose of God in his own generation." },
  { ref: "John 15:1–2, 16",   note: "Pruned to bear fruit that remains." },
  { ref: "Ephesians 4:13",        note: "Until we reach the whole measure of the fullness of Christ." },
  { ref: "Colossians 1:28–29",note: "Present everyone mature — toiling with all His energy." },
  { ref: "Philippians 3:12–14",note: "Not arrived — pressing on to take hold of the full purpose." },
  { ref: "Haggai 1:5–6",      note: "Consider your ways — misalignment wastes what you’re building." },
  { ref: "Genesis 1:31",          note: "God saw all He had made — and it was very good. Integration produces wholeness." },
  { ref: "2 Corinthians 5:9",     note: "Whether present or absent, our goal is to please Him." },
  { ref: "Hebrews 12:1–2",    note: "Run with endurance the race marked out specifically for you." },
];

// ─── MACRO / MICRO ────────────────────────────────────────────
const MACRO_MICRO = {
  macro: { title: "Macro — Lifetime Alignment", description: "The full arc of your leadership — all five dimensions functioning together in sustained, integrated alignment over a lifetime. This is the whole picture: who you are, what you carry, how you build, who you develop, and how you finish. Legacy at its fullest." },
  micro: { title: "Micro — Present-Season Integration", description: "The specific work of alignment in this season. Convergence is not someday. It is available now, in the assignment you currently hold. The question is not whether you will converge eventually. The question is whether you are choosing alignment today, in this season, with these people, in this assignment." }
};

// ─── COMMITMENT / REVISIT / APPLICATION ──────────────────────
const COMMITMENT_PROMPTS = [
  { id: "alignment",     label: "1. My Current Alignment Assessment",  placeholder: "Where are the five dimensions (Calling, Connection, Competency, Capacity, Convergence) most integrated right now? Where are they most fragmented?" },
  { id: "pruning",       label: "2. What I’m Releasing",            placeholder: "What is God pruning from your current leadership? What good thing are you releasing to make room for the necessary thing?" },
  { id: "legacy",        label: "3. My Legacy Statement",               placeholder: "In one or two sentences: what are you building that will outlast you? What do you want the next generation to carry forward because of your leadership?" },
  { id: "transfer",      label: "4. My Transfer Target",                placeholder: "Who are you developing to carry this assignment forward? Name them. What specifically are you transferring to them in the next 90 days?" },
  { id: "finish",        label: "5. My Finish Line",                    placeholder: "What does finishing well look like for you in this specific season? What are the conditions and character qualities required to reach it?" },
  { id: "accountability",label: "6. My Accountability",                 placeholder: "Who in your life can see all five dimensions and has full permission to speak honestly about your alignment?" },
];
const REVISIT_TRIGGERS = [
  "When you find yourself building things that don’t point the same direction",
  "When a season ends and a new assignment begins",
  "When you feel the pull of opportunity over the discipline of alignment",
  "When you sense God asking you to release something you’ve built",
  "When the gap between who you are becoming and who you are performing grows wider",
  "Annually, as a full-lifecycle leadership review across all five dimensions",
];
const APPLICATION_QUESTIONS = [
  "What decision am I avoiding that full alignment would require me to make?",
  "Am I building a legacy or a platform — and what is the difference in my daily choices?",
  "What would it look like for me to serve the purpose of God in my generation, fully, and then entrust the rest to the generation that follows?",
];


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
// CONVERGENCE PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function ConvergencePage() {
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
      saveModuleProgress(userId, 5, "Convergence", {
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
      saveModuleProgress(userId, 5, "Convergence", {
        post_score: total,
        commitments: commitments,
      });
    }
  }, [step]);
  const currentStep = STEPS[step];
  const setScore = (target, num, val) => { if (target === "pre") setPreScores(p => ({ ...p, [num]: val })); if (target === "post") setPostScores(p => ({ ...p, [num]: val })); };
  const totalScore = (obj) => Object.values(obj).reduce((a, b) => a + b, 0);
  const getInterp = (t) => {
    if (t >= 50) return { text: "Strong alignment. Sustain, deepen, and transfer.", color: ACCENT };
    if (t >= 40) return { text: "Integrating well. Close the remaining gaps with intention.", color: ORANGE };
    if (t >= 30) return { text: "Fragmented in key areas. Alignment requires deliberate action.", color: RED };
    return { text: "Significant drift. Convergence demands honest reorientation now.", color: "#991B1B" };
  };

  const generateSummary = async () => {
    setLoading(true);
    try {
      const prompt = `You are a Kingdom leadership coach analyzing a leader's Convergence diagnostic and reflections from the 5C Leadership Blueprint by Awakening Destiny Global.

MODULE: Convergence — Alignment (Legacy)
CENTRAL QUESTION: "Am I becoming everything I was designed to be?"

PRE-DIAGNOSTIC SCORES:
${convergenceDiagnostic.map(q => `${q.num}. ${q.text} — Score: ${preScores[q.num] || "N/A"}/5`).join("\n")}
Pre-Total: ${totalScore(preScores)}/60

POST-DIAGNOSTIC SCORES:
${convergenceDiagnostic.map(q => `${q.num}. ${q.text} — Score: ${postScores[q.num] || "N/A"}/5`).join("\n")}
Post-Total: ${totalScore(postScores)}/60

REFLECTION RESPONSES:
${Object.entries(responses).map(([k, v]) => `${k}: ${v}`).join("\n\n")}

COMMITMENTS:
${Object.entries(commitments).map(([k, v]) => `${k}: ${v}`).join("\n\n")}

Write a personalized Convergence Blueprint (400-500 words) that:
1. Identifies their strongest and most vulnerable diagnostic categories
2. Names the shift between pre and post scores
3. Addresses their legacy statement and transfer target
4. Speaks directly to where alignment and finishing well are most at stake
5. Gives 2-3 actionable recommendations rooted in the five Convergence principles
6. Closes with a prophetic commissioning — not just encouragement, but a send-off. Speak to who they are becoming and the generational weight of their assignment.

Write in second person. Tone: direct, warm, apostolic — with particular gravity in the closing. This is the final module. Let it carry the full weight of completion. Use Scripture naturally. No bullet points — flowing paragraphs.`;
      const res = await fetch("/api/claude", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt }) });
      const data = await res.json();
      const summaryText = data.response || data.content?.[0]?.text || "Summary generation failed.";
      setAiSummary(summaryText);
      if (userId && summaryText !== "Summary generation failed.") {
        await saveAiSummary(userId, 5, "Convergence", summaryText);
        await saveModuleProgress(userId, 5, "Convergence", {
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
    const categories = [...new Set(convergenceDiagnostic.map(q => q.cat))];
    return (<div className="space-y-5">{categories.map(cat => (<div key={cat}><div className="px-3 sm:px-4 py-2.5 rounded-t-lg font-semibold text-xs tracking-widest uppercase" style={{ background: NAVY, color: "#fff" }}>{cat}</div><div className="border border-t-0 rounded-b-lg divide-y" style={{ borderColor: "#e5e5e5" }}>{convergenceDiagnostic.filter(q => q.cat === cat).map(q => (<div key={q.num} className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 px-3 sm:px-4 py-3"><div className="flex items-start gap-2 flex-1 min-w-0"><span className="text-xs font-mono mt-0.5 w-5 shrink-0" style={{ color: "#bbb" }}>{q.num}</span><div className="flex-1"><p className="text-sm leading-relaxed" style={{ color: "#1a1a1a" }}>{q.text}</p>{q.ref && <p className="text-xs mt-0.5" style={{ color: "#aaa" }}>{q.ref}</p>}</div></div><div className="flex gap-1.5 shrink-0 ml-7 sm:ml-0">{[1,2,3,4,5].map(v => (<button key={v} onClick={() => setScore(target, q.num, v)} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full text-xs font-bold transition-all duration-200" style={{ background: scoreObj[q.num] === v ? ACCENT : "transparent", color: scoreObj[q.num] === v ? "#fff" : "#999", border: `2px solid ${scoreObj[q.num] === v ? ACCENT : "#e0e0e0"}` }}>{v}</button>))}</div></div>))}</div></div>))}<div className="mt-4 p-4 rounded-xl" style={{ background: ACCENT_LIGHT }}><div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2"><span className="font-bold text-lg" style={{ color: NAVY }}>Your Total: {totalScore(scoreObj)} / 60</span><span className="text-sm font-medium" style={{ color: getInterp(totalScore(scoreObj)).color }}>{getInterp(totalScore(scoreObj)).text}</span></div></div></div>);
  };

  // ═══════════════════════════════════════════════════════════
  const renderStep = () => {
    switch (currentStep.id) {

      case "activation":
        return (<div className="space-y-6">
          <div className="p-5 rounded-xl" style={{ background: CREAM }}>
            <p className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: GOLD_D }}>THE 5C LEADERSHIP LIFECYCLE</p>
            <p className="text-sm leading-relaxed mb-3" style={{ color: "#333" }}>You have worked through Calling, Connection, Competency, and Capacity. Now we arrive at the module that makes sense of all four — the dimension where everything converges.</p>
            <div className="flex gap-1 overflow-x-auto py-2 -mx-1 px-1">
              {["CALLING","CONNECTION","COMPETENCY","CAPACITY","CONVERGENCE"].map((c, i) => (
                <div key={c} className="px-2 sm:px-3 py-2 rounded-lg text-center text-xs font-bold tracking-wide shrink-0" style={{ background: i === 4 ? NAVY : ACCENT_LIGHT, color: i === 4 ? ACCENT : ACCENT, minWidth: "80px" }}>{c}</div>
              ))}
            </div>
            <p className="text-sm leading-relaxed mt-3" style={{ color: "#333" }}>Convergence answers the fifth and final question: <strong style={{ color: NAVY }}>Am I becoming everything I was designed to be?</strong></p>
            <p className="text-sm leading-relaxed mt-2" style={{ color: "#333" }}>This is not a question about what you have built. It is a question about who you are becoming — and whether all of it is pointing the same direction, for the long haul, with a legacy that outlasts your leadership.</p>
          </div>
          <div className="p-5 sm:p-6 rounded-2xl border-l-4" style={{ borderColor: ACCENT, background: `linear-gradient(135deg, ${ACCENT_LIGHT}, #fff)` }}>
            <p className="text-base sm:text-lg italic leading-relaxed" style={{ color: NAVY }}>"The most dangerous leader is not the one who burns out. It is the one who drifts — slowly, invisibly, until the life they are living no longer resembles the assignment they were given."</p>
          </div>
          <div className="mt-6">
            <p className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: GOLD_D }}>OPENING ACTIVATION</p>
            <p className="text-sm italic mb-4" style={{ color: "#666" }}>Before we teach, we listen. Sit with the weight of these questions. Write what is true.</p>
            <Reflect id="activation_1" prompt="Looking across your whole life and leadership right now — are the five dimensions (who you are, who you’re connected to, what you’re building, how you’re holding up, and where it’s all heading) aligned? Where is the most significant gap?" />
            <Reflect id="activation_2" prompt="If you are honest about the trajectory of your current leadership — not your platform, but your character and alignment — are you on course to finish well? What does your answer reveal?" />
          </div>
        </div>);

      case "pre-diagnostic":
        return (<div className="space-y-6">
          <div className="p-5 rounded-xl" style={{ background: CREAM }}><p className="font-semibold mb-1" style={{ color: NAVY }}>Convergence Diagnostic — Pre-Assessment</p><p className="text-sm" style={{ color: "#666" }}>Rate each statement honestly from 1 (Strongly Disagree) to 5 (Strongly Agree). This is a mirror, not a test.</p></div>
          {renderDiagnostic("pre", preScores)}
          <Reflect id="pre_diag_reflect" prompt="Look at your lowest category. What does it tell you about where your convergence is still fragmented or under construction?" />
        </div>);

      case "teaching":
        return (<div className="space-y-10">
          {/* Definition */}
          <div>
            <SectionHead>Definition</SectionHead>
            <p className="leading-relaxed mb-3" style={{ color: "#333" }}>Convergence is the ongoing integration of calling, identity, competency, capacity, and legacy into a life and leadership that is fully aligned with its divine design — sustainable across decades and transferable to the generations that follow.</p>
            <Scripture>{"“For David, after he had served the purpose of God in his own generation, fell asleep.” — Acts 13:36"}</Scripture>
            <p className="leading-relaxed mb-3" style={{ color: "#333" }}>Convergence is not the absence of tension. It is the presence of alignment — the experience of all five dimensions functioning together toward the same end. It is available now, in the season you are in, in the assignment you currently hold.</p>
            <Scripture>{"“I have fought the good fight, I have finished the race, I have kept the faith.” — 2 Timothy 4:7"}</Scripture>
          </div>

          {/* Contrast Table */}
          <div>
            <SectionHead sub="These are not just personality types. They are leadership postures with vastly different outcomes.">Fragmented vs. Convergent Leadership</SectionHead>
            <div className="block sm:hidden space-y-3">
              {CONTRAST_TABLE.map((row, i) => (
                <div key={i} className="rounded-lg border overflow-hidden" style={{ borderColor: "#e0e0e0" }}>
                  <div className="px-3 py-2 text-xs font-bold" style={{ background: "#f9fafb", color: NAVY }}>{row.dimension}</div>
                  <div className="grid grid-cols-2 divide-x" style={{ divideColor: "#e0e0e0" }}>
                    <div className="px-3 py-2" style={{ background: "#FEF2F2" }}><p className="text-xs font-semibold mb-0.5" style={{ color: RED }}>Fragmented</p><p className="text-xs" style={{ color: "#7F1D1D" }}>{row.left}</p></div>
                    <div className="px-3 py-2" style={{ background: ACCENT_LIGHT }}><p className="text-xs font-semibold mb-0.5" style={{ color: ACCENT }}>Convergent</p><p className="text-xs" style={{ color: NAVY }}>{row.right}</p></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="hidden sm:block overflow-x-auto rounded-xl border" style={{ borderColor: "#e0e0e0" }}>
              <table className="w-full text-sm"><thead><tr>
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider" style={{ background: "#f9fafb", color: "#888", width: "28%" }}>Dimension</th>
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider" style={{ background: "#FEE2E2", color: RED }}>Fragmented</th>
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider" style={{ background: NAVY, color: "#fff" }}>Convergent</th>
              </tr></thead><tbody>{CONTRAST_TABLE.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-3 font-medium text-sm" style={{ color: NAVY }}>{row.dimension}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: "#7F1D1D" }}>{row.left}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: ACCENT }}>{row.right}</td>
                </tr>
              ))}</tbody></table>
            </div>
            <Reflect id="contrast_reflect" prompt="Look at the ‘Fragmented’ column. Where do you see yourself honestly — not where you hope to be, but where you actually are right now?" />
          </div>

          {/* Macro & Micro */}
          <div>
            <SectionHead sub="Convergence operates at both the lifetime level and the present-season level.">Convergence: Macro & Micro</SectionHead>
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
            <Reflect id="macro_micro" prompt="What does full convergence look like for you in this specific season — not the idealized future, but the aligned present? What is one decision that would move you measurably toward it?" />
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
          <SectionHead sub="These are not stages you graduate from. They are depths you grow into.">How Convergence Develops: Three Stages</SectionHead>
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
          <Reflect id="stages_reflect" prompt="Which stage most accurately describes your current leadership — not your aspirational self, but your actual present? What would it take to move forward?" />
        </div>);

      case "post-diagnostic":
        return (<div className="space-y-6">
          <div className="p-5 rounded-xl" style={{ background: CREAM }}><p className="font-semibold mb-1" style={{ color: NAVY }}>Convergence Diagnostic — Post-Assessment</p><p className="text-sm" style={{ color: "#666" }}>Rate yourself again. Be honest about what shifted — and what didn’t.</p></div>
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
          <Reflect id="post_diag_reflect" prompt="What did this diagnostic reveal about your alignment? Where is the gap between where you are and where you need to be to finish well?" />
          <div className="mt-8">
            <SectionHead sub="These are your anchor texts for the long haul. Return to them when the finish line feels distant, when alignment is costing you something, when legacy requires sacrifice.">Key Scriptures on Convergence</SectionHead>
            <div className="space-y-2">{KEY_SCRIPTURES.map((s, i) => (<div key={i} className="flex flex-col sm:flex-row sm:items-start gap-0.5 sm:gap-3 py-2"><span className="font-bold text-sm shrink-0" style={{ color: NAVY, minWidth: "190px" }}>{s.ref}</span><span className="text-sm italic" style={{ color: "#555" }}>{s.note}</span></div>))}</div>
          </div>
        </div>);

      case "commitment":
        return (<div className="space-y-6">
          <SectionHead sub="Convergence requires decisions, not just awareness. These commitments close the loop on all five modules.">My Convergence Commitment</SectionHead>
          <div className="space-y-5">{COMMITMENT_PROMPTS.map(c => (<div key={c.id}><label className="block text-sm font-semibold mb-2" style={{ color: NAVY }}>{c.label}</label><textarea className="w-full border rounded-lg p-3 text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 transition-all" style={{ borderColor: "#ddd", minHeight: "90px" }} placeholder={c.placeholder} value={commitments[c.id] || ""} onChange={e => setCommitments(p => ({ ...p, [c.id]: e.target.value }))} /></div>))}</div>
          <div className="mt-8 p-5 rounded-xl" style={{ background: ACCENT_LIGHT }}>
            <h4 className="font-bold mb-3" style={{ color: NAVY }}>Convergence Is a Living Discipline</h4>
            <p className="text-sm mb-2 leading-relaxed" style={{ color: "#333" }}>This is not a one-time commitment. Alignment requires constant maintenance. Success can fragment you as quickly as failure. Promotion can pull you off course as easily as persecution. The disciplines of convergence — honest self-assessment, intentional transfer, guarded alignment — must become as regular as the work itself.</p>
            <p className="text-sm font-semibold mb-3 mt-4" style={{ color: NAVY }}>Revisit your convergence:</p>
            <div className="space-y-2 ml-1">{REVISIT_TRIGGERS.map((t, i) => (<div key={i} className="flex items-start gap-3"><span className="mt-1.5 w-2 h-2 rounded-full shrink-0" style={{ background: ACCENT }} /><p className="text-sm leading-relaxed" style={{ color: "#333" }}>{t}</p></div>))}</div>
          </div>
          <div className="mt-8">
            <SectionHead sub="Let the full weight of this module land. These questions are not academic.">Application Moment</SectionHead>
            {APPLICATION_QUESTIONS.map((q, i) => (<Reflect key={i} id={`application_${i}`} prompt={q} />))}
          </div>
          {/* 5C Complete Banner */}
          <div className="mt-8 p-6 rounded-2xl text-center" style={{ background: `linear-gradient(135deg, ${NAVY}, #0d2d50)` }}>
            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: GOLD }}>5C LEADERSHIP BLUEPRINT</p>
            <div className="flex justify-center gap-2 my-3">
              {[{c:"C",l:"Calling",col:GOLD_D},{c:"C",l:"Connection",col:BLUE},{c:"C",l:"Competency",col:ORANGE},{c:"C",l:"Capacity",col:SKY},{c:"C",l:"Convergence",col:RED}].map((item,i)=>(<div key={i} className="flex flex-col items-center"><div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1" style={{ background: item.col, color: "#fff" }}>{item.c}</div><p className="text-xs" style={{ color: "#aaa", fontSize: "9px" }}>{item.l}</p></div>))}
            </div>
            <p className="text-sm font-semibold mt-3" style={{ color: "#fff" }}>All five dimensions complete.</p>
            <p className="text-xs mt-1" style={{ color: GOLD_D }}>Generate your full AI Blueprint below to receive your personalized Convergence analysis.</p>
          </div>
        </div>);

      case "summary":
        return (<div className="space-y-6">
          <SectionHead sub="Based on your diagnostics, reflections, and commitments — here is your personalized Convergence analysis.">Your Convergence Blueprint</SectionHead>
          {!aiSummary && !loading && (<button onClick={generateSummary} className="w-full py-4 rounded-xl font-bold text-lg transition-all hover:opacity-90 text-white" style={{ background: `linear-gradient(135deg, ${ACCENT}, ${NAVY})` }}>Generate My Convergence Blueprint</button>)}
          {loading && (<div className="text-center py-12"><div className="w-10 h-10 border-4 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: ACCENT_LIGHT, borderTopColor: ACCENT }} /><p className="text-sm" style={{ color: "#888" }}>Generating your personalized blueprint...</p></div>)}
          {aiSummary && (<>
            <div className="p-5 sm:p-6 rounded-2xl border" style={{ borderColor: ACCENT }}>
              <div className="flex items-center gap-2 mb-4"><div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: ACCENT }}><span className="text-white text-sm">{"✦"}</span></div><p className="font-bold" style={{ color: NAVY }}>Your Convergence Blueprint</p></div>
              <div style={{ color: "#333" }}>{aiSummary.split("\n\n").map((para, i) => (<p key={i} className="mb-3 leading-relaxed text-sm">{para}</p>))}</div>
            </div>
            <button onClick={() => downloadWordDoc("Convergence", responses, commitments, preScores, postScores, convergenceDiagnostic, aiSummary)} className="w-full py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 border-2" style={{ borderColor: ACCENT, color: NAVY, background: ACCENT_LIGHT }}>Download My Convergence Blueprint (.doc)</button>
          </>)}
        </div>);

      default: return null;
    }
  };

  // ═══════════════════════════════════════════════════════════
  // MAIN LAYOUT
  // ═══════════════════════════════════════════════════════════
  return (<>
    <Head><title>Convergence | 5C Leadership Blueprint</title></Head>
    <div className="min-h-screen" style={{ background: "#FAFAF8", fontFamily: "'Outfit', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <div className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="/" className="text-sm font-medium flex items-center gap-1 hover:opacity-70 transition-opacity" style={{ color: NAVY }}>{"←"} Dashboard</a>
          <div className="text-center"><p className="text-xs uppercase tracking-widest" style={{ color: ACCENT }}>Module 5</p><p className="text-sm font-bold" style={{ color: NAVY }}>Convergence</p></div>
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
          <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: NAVY, fontFamily: "'Cormorant Garamond', serif" }}>Convergence: Alignment (Legacy)</h2>
          <p className="text-sm mt-1 italic" style={{ color: "#888" }}>Central Question: Am I becoming everything I was designed to be?</p>
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
