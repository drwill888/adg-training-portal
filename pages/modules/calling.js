// ═══════════════════════════════════════════════════════════════
// MODULE 1: CALLING — Potential (Purpose)
// 5C Leadership Blueprint · Awakening Destiny Global
// Pages Router: pages/modules/calling.js
// ═══════════════════════════════════════════════════════════════
import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { supabase } from '../../lib/supabase';

// ─── INLINE DB HELPERS ────────────────────────────────────────
async function saveModuleProgress(userId, moduleId, moduleTitle, updates) {
  await supabase.from('module_progress').upsert({
    user_id: userId, module_id: moduleId, module_title: moduleTitle,
    updated_at: new Date().toISOString(), ...updates,
  }, { onConflict: 'user_id,module_id' });
}
async function saveAiSummary(userId, moduleId, moduleTitle, summaryText) {
  await supabase.from('ai_summaries').upsert({
    user_id: userId, module_id: moduleId, module_title: moduleTitle,
    summary_text: summaryText, updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id,module_id' });
}

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
  { num: 4,  cat: "Burden & Stewardship",   text: "There is a recurring burden I carry that I cannot walk away from.", ref: "Nehemiah 1:3–4" },
  { num: 5,  cat: "Burden & Stewardship",   text: "I steward the grace on my life with intentionality, not passivity." },
  { num: 6,  cat: "Burden & Stewardship",   text: "I am building for the next twenty-five years, not just the next five months.", ref: "Exodus 20:8" },
  { num: 7,  cat: "Character Under Weight",  text: "My private life can sustain the weight of my public assignment." },
  { num: 8,  cat: "Character Under Weight",  text: "I am the same person in private that I am on platform." },
  { num: 9,  cat: "Character Under Weight",  text: "I have been tested under pressure — and I did not compromise my integrity." },
  { num: 10, cat: "Expanding Capacity",      text: "I am growing in my ability to carry more without breaking." },
  { num: 11, cat: "Expanding Capacity",      text: "I can identify the difference between healthy pressure and destructive overload." },
  { num: 12, cat: "Expanding Capacity",      text: "I see difficulty as development, not punishment.", ref: "James 1:2–4" },
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
    title: "Macro — Calling (Ecosystem)",
    description: "Your calling is the whole landscape of who you were designed to become. It encompasses your identity, your grace, your burden, your design. It doesn't change with seasons. It deepens. It's the territory God assigned you to steward across your lifetime."
  },
  micro: {
    title: "Micro — Assignment (The Now)",
    description: "Your assignment is the specific expression of your calling in this season, this context, this role, this responsibility. Assignments shift. They have start dates and end dates. You can be called to restore — and your assignment right now might be rebuilding one team, one organization, one family system. The calling remains. The assignment evolves."
  }
};

// ─── 4 GOVERNING PRINCIPLES ─────────────────────────────────
const PRINCIPLES = [
  {
    num: 1,
    title: "Design Precedes Deployment",
    ref: "Jeremiah 1:5",
    scripture: "\"Before I formed you in the womb I knew you, before you were born I set you apart.\" — Jeremiah 1:5",
    paragraphs: [
      "God forms before He sends. Calling originates in God's intention, not human ambition. Leadership must be formed internally before it is expressed externally.",
      "If deployment precedes design clarity, instability follows. You cannot build what you have not been shaped to carry. Many leaders launch before they are formed — and they fracture under the weight of an assignment their character was never prepared to hold.",
      "This is why hiddenness is not punishment. It is preparation. The years of obscurity are not wasted years — they are forming years. God does not waste formation. He invests it."
    ],
    prompt: "Where in your life have you been deployed before you were formed? What was the result?"
  },
  {
    num: 2,
    title: "Calling Carries Burden",
    ref: "Nehemiah 1:3–4",
    scripture: "\"When I heard these things, I sat down and wept. For some days I mourned and fasted and prayed before the God of heaven.\" — Nehemiah 1:3–4",
    paragraphs: [
      "Calling is not a career preference. It is a burden you cannot set down. Nehemiah heard about the broken walls and could not stop weeping. That is the mark of calling — a weight that won't leave you alone.",
      "The burden of calling is not depression. It is not anxiety. It is a holy dissatisfaction with the way things are combined with a God-given conviction that you are part of the solution. It interrupts your comfort. It refuses to let you settle.",
      "If you can walk away from it, it's probably not your calling. If it keeps you up at night, if it won't let you rest until you act, if you feel physically unable to ignore it — pay attention. That's the burden of the Lord."
    ],
    prompt: "What burden do you carry that you cannot walk away from? What breaks your heart consistently?"
  },
  {
    num: 3,
    title: "Calling Must Be Confirmed in Community",
    ref: "1 Samuel 3:8–9",
    scripture: "\"Then Eli realized that the Lord was calling the boy. So Eli told Samuel, 'Go and lie down, and if He calls you, say, Speak, Lord, for your servant is listening.'\" — 1 Samuel 3:8–9",
    paragraphs: [
      "Samuel heard God's voice but needed Eli to help him interpret it. Calling does not mature in isolation. It requires mentors, community, and external confirmation. A calling that no one else can see or confirm may be ambition dressed in spiritual language.",
      "Community provides three essential functions for calling: interpretation (helping you understand what God is saying), confirmation (verifying what you're sensing), and accountability (holding you to what you've declared).",
      "This is not about seeking human approval. It is about humility. The leader who refuses external input on their calling is not confident — they are isolated. And isolated callings produce fragile leaders."
    ],
    prompt: "Who in your life has confirmed your calling? If no one has, what does that tell you?"
  },
  {
    num: 4,
    title: "Calling Governs Decisions",
    ref: "Ephesians 4:1",
    scripture: "\"Walk worthy of the calling with which you were called.\" — Ephesians 4:1",
    paragraphs: [
      "Once calling is clarified, it becomes the filter for every decision. Not every opportunity is for you. Not every success is yours to celebrate. Calling eliminates false options — and that is its mercy.",
      "Leaders without calling clarity are blown around by market demands, board pressure, and the loudest voice in the room. But leaders rooted in calling can say no to the good in order to protect the great. They can walk away from money, influence, and applause if those things distract from their true assignment.",
      "This is the power of conviction: it narrows your options in order to focus your impact. Walking worthy of your calling means your decisions become predictable — not because you are rigid, but because you are resolved."
    ],
    prompt: "What decisions have you made recently that were in conflict with your stated calling? What does that reveal?"
  }
];

const COMMITMENT_PROMPTS = [
  { id: "macro_clarity", label: "My Macro Calling (What am I called to for a lifetime?)", placeholder: "Define the landscape of who you were designed to become..." },
  { id: "current_assignment", label: "My Current Assignment (What is God asking of me right now?)", placeholder: "Define your specific role, responsibility, or season..." },
  { id: "confirmation_community", label: "My Confirmation Community (Who confirms this calling with me?)", placeholder: "List the mentors, leaders, or voices who have affirmed your calling..." },
  { id: "burden_statement", label: "What I Cannot Walk Away From", placeholder: "Name the burden, the weight, the recurring dissatisfaction that won't let you rest..." },
  { id: "conviction_filter", label: "How My Calling Filters My Decisions", placeholder: "Describe how your calling shapes your yes and your no..." }
];

const REVISIT_TRIGGERS = [
  "When you receive a new opportunity or assignment",
  "When you feel pressure to compromise your values or direction",
  "When your circumstances shift (season change, role change, relocation)",
  "When you lose clarity or begin to drift",
  "When you complete a major project or assignment",
  "When you receive feedback that doesn't align with your sense of calling"
];

const APPLICATION_QUESTIONS = [
  "What is one decision you are facing right now that your calling must settle?",
  "Who do you need to invite into your calling confirmation process?"
];

// ─── WORD DOC EXPORT ──────────────────────────────────────────
function downloadWordDoc(moduleName, responses, commitments, preScores, postScores, diagnostic, summary) {
  const lineBreak = "<br/>";
  const html = `
    <html>
      <head>
        <meta charset='utf-8'/>
        <style>
          body { font-family: 'Cormorant Garamond', serif; color: #333; line-height: 1.6; }
          h1 { color: #021A35; font-size: 28px; margin: 20px 0 10px; }
          h2 { color: #C8A951; font-size: 20px; margin: 16px 0 8px; border-bottom: 2px solid #FDD20D; padding-bottom: 4px; }
          h3 { color: #021A35; font-size: 16px; margin: 12px 0 6px; }
          .accent { color: #C8A951; font-weight: bold; }
          .section { margin: 24px 0; padding: 16px; background: #FFF9E6; border-left: 4px solid #C8A951; }
          table { width: 100%; border-collapse: collapse; margin: 16px 0; }
          th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background: #021A35; color: white; font-weight: bold; }
          tr:nth-child(even) { background: #f9f9f9; }
        </style>
      </head>
      <body>
        <h1>🎯 ${moduleName} Blueprint</h1>
        <p><strong>5C Leadership Blueprint · Awakening Destiny Global</strong></p>
        <p style="color: #666; font-style: italic;">Generated on ${new Date().toLocaleDateString()}</p>
        ${summary ? `<div class="section"><h2>Your ${moduleName} Analysis</h2><p>${summary.replace(/\n/g, lineBreak)}</p></div>` : ''}
        <h2>Your Commitments</h2>
        <div>${Object.entries(commitments).map(([k, v]) => `<p><strong>${k.replace(/_/g, ' ')}:</strong> ${v || '(not completed)'}</p>`).join('')}</div>
        <footer style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #999;">
          <p>© Awakening Destiny Global · awakeningdestiny.global</p>
          <p>This blueprint is your personal leadership formation document. Review it regularly and revisit your commitments as you grow.</p>
        </footer>
      </body>
    </html>
  `;
  const blob = new Blob([html], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${moduleName}-Blueprint.doc`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── COMPONENT: SECTION HEAD ──────────────────────────────────
function SectionHead({ children, sub }) {
  return (
    <div className="mb-4">
      <h3 className="text-lg sm:text-xl font-bold" style={{ color: NAVY, fontFamily: "'Cormorant Garamond', serif" }}>{children}</h3>
      {sub && <p className="text-xs sm:text-sm mt-2" style={{ color: "#999" }}>{sub}</p>}
    </div>
  );
}

// ─── COMPONENT: REFLECTION PROMPT ────────────────────────────
function Reflect({ id, prompt }) {
  const [resp, setResp] = useState("");
  return (
    <div className="mb-6 p-4 rounded-lg border border-gray-200">
      <p className="text-sm font-semibold mb-3" style={{ color: NAVY }}>{prompt}</p>
      <textarea className="w-full border rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 transition-all" style={{ borderColor: "#ddd" }} placeholder="Your reflection..." rows={5} value={resp} onChange={e => setResp(e.target.value)} />
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────
export default function CallingModule() {
  const [step, setStep] = useState(0);
  const [responses, setResponses] = useState({});
  const [commitments, setCommitments] = useState({});
  const [preScores, setPreScores] = useState({});
  const [postScores, setPostScores] = useState({});
  const [aiSummary, setAiSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const topRef = useRef(null);

  const currentStep = STEPS[step];

  const generateSummary = async () => {
    setLoading(true);
    try {
      const prompt = `Based on the following module data for the Calling dimension of the 5C Leadership Blueprint, provide a brief, personalized analysis (200-300 words) addressing: (1) clarity of calling, (2) burden/weight they carry, (3) confirmation community, (4) how calling filters decisions. Be concise, apostolic in tone, and actionable.

Commitments:
${Object.entries(commitments).map(([k, v]) => `${k}: ${v}`).join('\n')}

Keep it focused and direct.`;

      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setAiSummary(data.response || "");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep.id) {
      case "activation":
        return (
          <div className="space-y-6">
            <SectionHead sub="Settle into this moment. Set aside distractions. You are entering formational territory.">Welcome to Calling</SectionHead>
            <div className="p-6 rounded-xl" style={{ background: NAVY, color: "#fff" }}>
              <h4 className="text-lg font-bold mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>The Central Question</h4>
              <p className="text-lg italic mb-4">"Who was I designed to become?"</p>
              <p className="text-sm leading-relaxed mb-4">Your calling is not what you do. It is who you were created to be — the landscape of your potential, your purpose, your design. It encompasses your identity, your grace, your burden, and your stewardship.</p>
              <p className="text-sm leading-relaxed">This module will help you articulate your calling with clarity and anchor it in conviction. Not everyone will understand it. Not every opportunity will fit it. But you will know it — and that certainty becomes the anchor for every decision you make.</p>
            </div>
            <div className="space-y-4">
              <SectionHead sub="Take your time with these questions.">Activation Prompts</SectionHead>
              <Reflect id="activation_1" prompt="When you think about your calling, what image or phrase comes to mind?" />
              <Reflect id="activation_2" prompt="What has always been consistent about your convictions across different seasons?" />
            </div>
          </div>
        );

      case "pre-diagnostic":
        return (
          <div className="space-y-6">
            <SectionHead sub="Rate your alignment with each statement (1 = Not true, 5 = Absolutely true)">Self-Assessment</SectionHead>
            <div className="space-y-4">
              {callingDiagnostic.map(d => (
                <div key={d.num} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-sm font-semibold mb-1" style={{ color: NAVY }}>{d.cat}</p>
                      <p className="text-sm leading-relaxed">{d.text}</p>
                      {d.ref && <p className="text-xs mt-2" style={{ color: "#888" }}>{d.ref}</p>}
                    </div>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(score => (
                        <button key={score} onClick={() => setPreScores(p => ({ ...p, [d.num]: score }))} className="w-8 h-8 rounded text-sm font-bold transition-all" style={{ background: preScores[d.num] === score ? ACCENT : "#f0f0f0", color: preScores[d.num] === score ? NAVY : "#999" }}>
                          {score}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "teaching":
        return (
          <div className="space-y-8">
            <SectionHead sub="These principles anchor everything about calling.">4 Governing Principles</SectionHead>
            {PRINCIPLES.map(p => (
              <div key={p.num} className="p-5 sm:p-6 border-l-4 rounded-lg" style={{ borderColor: ACCENT, background: ACCENT_LIGHT }}>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold" style={{ background: NAVY, color: ACCENT, flexShrink: 0 }}>{p.num}</div>
                  <div className="flex-1">
                    <h4 className="font-bold" style={{ color: NAVY, fontFamily: "'Cormorant Garamond', serif", fontSize: "18px" }}>{p.title}</h4>
                    <p className="text-xs mt-1" style={{ color: "#888" }}>{p.ref}</p>
                  </div>
                </div>
                <p className="text-sm italic mb-3" style={{ color: NAVY }}>"{p.scripture}"</p>
                <div className="space-y-2">
                  {p.paragraphs.map((para, i) => (<p key={i} className="text-sm leading-relaxed" style={{ color: "#333" }}>{para}</p>))}
                </div>
                <div className="mt-4 pt-4 border-t border-current border-opacity-20">
                  <p className="text-xs font-semibold mb-2" style={{ color: NAVY }}>Reflection:</p>
                  <p className="text-sm" style={{ color: "#555" }}>{p.prompt}</p>
                </div>
              </div>
            ))}
          </div>
        );

      case "exemplar":
        return (
          <div className="space-y-6">
            <SectionHead sub="Joseph's calling was to stewardship and restoration across seven dimensions of his life.">Exemplar: Joseph's Journey</SectionHead>
            <p className="text-sm leading-relaxed" style={{ color: "#333" }}>Joseph had a calling to steward and restore — and he carried it through slavery, false accusation, imprisonment, and finally elevation. His calling remained constant while his assignments changed. He served faithfully in Potiphar's house, then in Pharaoh's prison, then as Egypt's chief administrator. Same calling. Different assignments. Same character under different weights.</p>
            <div className="space-y-3">
              <SectionHead sub="">What Joseph's calling teaches us:</SectionHead>
              <ul className="space-y-2">
                <li className="text-sm flex gap-3">
                  <span style={{ color: ACCENT, fontWeight: "bold" }}>•</span>
                  <span>Calling operates across multiple life domains — family, work, spiritual influence, character formation.</span>
                </li>
                <li className="text-sm flex gap-3">
                  <span style={{ color: ACCENT, fontWeight: "bold" }}>•</span>
                  <span>Assignments test calling. They reveal whether your conviction is genuine or circumstantial.</span>
                </li>
                <li className="text-sm flex gap-3">
                  <span style={{ color: ACCENT, fontWeight: "bold" }}>•</span>
                  <span>Faithfulness in hiddenness precedes elevation to visibility.</span>
                </li>
              </ul>
            </div>
          </div>
        );

      case "stages":
        return (
          <div className="space-y-6">
            <SectionHead sub="Calling unfolds in recognizable stages. You are in one right now.">Stages of Calling Development</SectionHead>
            <div className="space-y-4">
              <div className="p-4 rounded-lg border-l-4" style={{ borderColor: ORANGE, background: "#fff8f3" }}>
                <h4 className="font-bold mb-2" style={{ color: NAVY, fontFamily: "'Cormorant Garamond', serif" }}>Stage 1: Whisper (Stirring)</h4>
                <p className="text-sm" style={{ color: "#333" }}>You sense something — a burden, a burden, a direction — but it is not yet formed into words. It is intuitive, exploratory. You may not even speak it aloud.</p>
              </div>
              <div className="p-4 rounded-lg border-l-4" style={{ borderColor: ORANGE, background: "#fff8f3" }}>
                <h4 className="font-bold mb-2" style={{ color: NAVY, fontFamily: "'Cormorant Garamond', serif" }}>Stage 2: Word (Formation)</h4>
                <p className="text-sm" style={{ color: "#333" }}>You can now articulate it. You can name it. You can explain it to others. It becomes a conviction with words attached.</p>
              </div>
              <div className="p-4 rounded-lg border-l-4" style={{ borderColor: ORANGE, background: "#fff8f3" }}>
                <h4 className="font-bold mb-2" style={{ color: NAVY, fontFamily: "'Cormorant Garamond', serif" }}>Stage 3: Confirmation (Community)</h4>
                <p className="text-sm" style={{ color: "#333" }}>Others begin to see it in you. Mentors affirm it. Community confirms it. Your calling becomes a shared reality, not just a personal conviction.</p>
              </div>
              <div className="p-4 rounded-lg border-l-4" style={{ borderColor: ORANGE, background: "#fff8f3" }}>
                <h4 className="font-bold mb-2" style={{ color: NAVY, fontFamily: "'Cormorant Garamond', serif" }}>Stage 4: Release (Deployment)</h4>
                <p className="text-sm" style={{ color: "#333" }}>You are sent. You step into your assignment. Your calling moves from preparation to active expression.</p>
              </div>
            </div>
          </div>
        );

      case "post-diagnostic":
        return (
          <div className="space-y-6">
            <SectionHead sub="Rate your alignment now, after the teaching. What has shifted?">Post-Teaching Assessment</SectionHead>
            <div className="space-y-4">
              {callingDiagnostic.map(d => (
                <div key={d.num} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-sm font-semibold mb-1" style={{ color: NAVY }}>{d.cat}</p>
                      <p className="text-sm leading-relaxed">{d.text}</p>
                    </div>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(score => (
                        <button key={score} onClick={() => setPostScores(p => ({ ...p, [d.num]: score }))} className="w-8 h-8 rounded text-sm font-bold transition-all" style={{ background: postScores[d.num] === score ? ACCENT : "#f0f0f0", color: postScores[d.num] === score ? NAVY : "#999" }}>
                          {score}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "commitment":
        return (
          <div className="space-y-6">
            <SectionHead sub="Calling must move from revelation to responsibility. Write these in full sentences — not fragments.">My Calling Commitment</SectionHead>
            <div className="space-y-5">
              {COMMITMENT_PROMPTS.map(c => (
                <div key={c.id}>
                  <label className="block text-sm font-semibold mb-2" style={{ color: NAVY }}>{c.label}</label>
                  <textarea className="w-full border rounded-lg p-3 text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 transition-all" style={{ borderColor: "#ddd" }} placeholder={c.placeholder} value={commitments[c.id] || ""} onChange={e => setCommitments(p => ({ ...p, [c.id]: e.target.value }))} minHeight="90px" rows={5} />
                </div>
              ))}
            </div>
            <div className="mt-8 p-5 rounded-xl" style={{ background: ACCENT_LIGHT }}>
              <h4 className="font-bold mb-3" style={{ color: NAVY, fontFamily: "'Cormorant Garamond', serif" }}>Calling Is a Living Discipline</h4>
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
            <SectionHead sub="Based on your diagnostics, reflections, and commitments — here is your personalized Calling analysis.">Your Calling Blueprint</SectionHead>
            {!aiSummary && !loading && (
              <button onClick={generateSummary} className="w-full py-4 rounded-xl font-bold text-lg transition-all" style={{ background: NAVY, color: GOLD }}>
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
                <div className="p-5 sm:p-6 rounded-2xl border" style={{ borderColor: ACCENT, background: ACCENT_LIGHT }}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: NAVY, color: ACCENT }}>{"✦"}</div>
                    <p className="font-bold" style={{ color: NAVY, fontFamily: "'Cormorant Garamond', serif" }}>Your Calling Blueprint</p>
                  </div>
                  <div style={{ color: "#333" }}>
                    {aiSummary.split("\n\n").map((para, i) => (<p key={i} className="mb-3 leading-relaxed text-sm">{para}</p>))}
                  </div>
                </div>
                <button onClick={() => downloadWordDoc("Calling", responses, commitments, preScores, postScores, callingDiagnostic, aiSummary)} className="w-full py-3 rounded-xl font-semibold text-sm transition-all border-2" style={{ borderColor: NAVY, color: NAVY, background: "#fff" }}>
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

        {/* Top Bar with Logo */}
        <div className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-gray-100">
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="/" className="text-sm font-medium flex items-center gap-1 hover:opacity-70 transition-opacity" style={{ color: NAVY }}>{"←"} Dashboard</a>
            <div className="text-center">
              <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: NAVY }}>Module 1</p>
              <p className="text-sm font-bold" style={{ color: NAVY }}>Calling</p>
            </div>
            <div className="w-16 text-right">
              <svg width="24" height="24" viewBox="0 0 100 100" style={{ display: "inline" }}>
                <circle cx="50" cy="50" r="40" fill={NAVY} />
                <path d="M 50 30 Q 60 40 50 50 Q 40 40 50 30" fill={GOLD} />
              </svg>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-1 overflow-x-auto pb-2 -mx-1 px-1">
            {STEPS.map((s, i) => (
              <button key={s.id} onClick={() => setStep(i)} className="flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all" style={{ background: i === step ? ACCENT : i < step ? ACCENT_LIGHT : "transparent", color: i === step ? NAVY : i < step ? ACCENT : "#aaa", border: `1px solid ${i <= step ? ACCENT : "#e5e5e5"}` }}>
                {i < step && <span>{"✓"}</span>}{s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-4 pb-32" ref={topRef}>
          <div className="mb-8">
            <p className="text-xs uppercase tracking-widest mb-1 font-semibold" style={{ color: NAVY }}>{currentStep.label}</p>
            <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: NAVY, fontFamily: "'Cormorant Garamond', serif" }}>Calling: Potential (Purpose)</h2>
            <p className="text-sm mt-1 italic" style={{ color: "#888" }}>Central Question: Who was I designed to become?</p>
          </div>
          {renderStep()}
        </div>

        {/* Bottom Nav */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-100 py-3 z-40">
          <div className="max-w-3xl mx-auto px-4 flex justify-between items-center">
            <button onClick={() => step > 0 && setStep(step - 1)} disabled={step === 0} className="px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-30" style={{ color: NAVY, border: `1px solid ${NAVY}` }}>{"←"} Previous</button>
            <span className="text-xs" style={{ color: "#aaa" }}>{step + 1} of {STEPS.length}</span>
            <button onClick={() => step < STEPS.length - 1 && setStep(step + 1)} disabled={step === STEPS.length - 1} className="px-4 sm:px-5 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-30" style={{ background: NAVY, color: GOLD }}>Next {"→"}</button>
          </div>
        </div>
      </div>
    </>
  );
}
