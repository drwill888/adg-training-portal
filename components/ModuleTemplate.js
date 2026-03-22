// components/ModuleTemplate.js
// Shared rendering engine for all 5C Leadership Blueprint modules

import { useState, useRef } from "react";
import FlameMark from "./FlameMark";
import { usePaymentStatus } from "../lib/usePaymentStatus";
import { supabase } from "../lib/supabase";

const NAVY = "#021A35";
const GOLD = "#FDD20D";

const STEPS = [
  { id: "activation",      label: "Activation" },
  { id: "pre-diagnostic",  label: "Pre-Check" },
  { id: "teaching",        label: "Teaching" },
  { id: "exemplar",        label: "Exemplar" },
  { id: "stages",          label: "Stages" },
  { id: "post-diagnostic", label: "Post-Check" },
  { id: "commitment",      label: "Commitment" },
  { id: "summary",         label: "AI Blueprint" },
];

function PauseTextarea({ prompt }) {
  const [val, setVal] = useState("");
  return (
    <div className="mb-4">
      {prompt && <p className="text-sm mb-2" style={{ color: "#333" }}>{prompt}</p>}
      <textarea
        className="w-full rounded-lg p-3 text-sm leading-relaxed resize-none focus:outline-none"
        style={{ border: "1px solid #ddd", background: "#fff", minHeight: 80 }}
        rows={3}
        placeholder="Write your response here..."
        value={val}
        onChange={e => setVal(e.target.value)}
      />
    </div>
  );
}

function ScoreButtons({ itemNum, scores, setScores, accent }) {
  return (
    <div style={{ display: "flex", gap: 4, alignItems: "center", flexShrink: 0, flexWrap: "wrap" }}>
      {[1, 2, 3, 4, 5].map(score => (
        <button key={score}
          onClick={() => setScores(p => ({ ...p, [itemNum]: score }))}
          style={{
            width: 32, height: 32, borderRadius: 6, fontSize: 13, fontWeight: "bold",
            border: "none", cursor: "pointer", transition: "all 0.15s",
            background: scores[itemNum] === score ? accent : "#f0f0f0",
            color: scores[itemNum] === score ? NAVY : "#999",
          }}>
          {score}
        </button>
      ))}
      <button
        onClick={() => setScores(p => ({ ...p, [itemNum]: "na" }))}
        style={{
          height: 32, padding: "0 7px", borderRadius: 6, fontSize: 11,
          fontWeight: "bold", cursor: "pointer", transition: "all 0.15s",
          background: scores[itemNum] === "na" ? "#6b7280" : "transparent",
          color: scores[itemNum] === "na" ? "#fff" : "#bbb",
          border: "1px dashed #ccc",
        }}>
        N/A
      </button>
    </div>
  );
}

function DiagnosticSection({ diagnostic, scores, setScores, accent, label }) {
  return (
    <div className="space-y-4">
      <div className="mb-2">
        <p className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: accent }}>{label}</p>
        <p className="text-sm" style={{ color: "#666" }}>Rate each statement: 1 = Not true · 5 = Absolutely true · N/A = Does not apply</p>
      </div>
      {diagnostic.map(d => (
        <div key={d.num} className="p-4 border rounded-xl bg-white" style={{ borderColor: "#e5e7eb" }}>
          <div className="flex items-start justify-between gap-4 flex-wrap sm:flex-nowrap">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: accent }}>{d.cat}</p>
              <p className="text-sm leading-relaxed" style={{ color: "#333" }}>{d.text}</p>
              {d.ref && <p className="text-xs mt-1.5" style={{ color: "#aaa" }}>{d.ref}</p>}
            </div>
            <ScoreButtons itemNum={d.num} scores={scores} setScores={setScores} accent={accent} />
          </div>
        </div>
      ))}
    </div>
  );
}

function Reflect({ prompt }) {
  const [val, setVal] = useState("");
  return (
    <div className="mb-5 p-4 rounded-xl" style={{ background: "#f9fafb", border: "1px solid #e5e7eb" }}>
      <p className="text-sm font-semibold mb-3" style={{ color: NAVY }}>{prompt}</p>
      <textarea
        className="w-full rounded-lg p-3 text-sm leading-relaxed resize-none focus:outline-none"
        style={{ border: "1px solid #ddd", background: "#fff", minHeight: 90 }}
        rows={4}
        placeholder="Write your honest reflection here..."
        value={val}
        onChange={e => setVal(e.target.value)}
      />
    </div>
  );
}

function SectionHead({ children, sub }) {
  return (
    <div className="mb-5">
      <h3 className="text-xl sm:text-2xl font-bold" style={{ color: NAVY, fontFamily: "'Cormorant Garamond', serif" }}>{children}</h3>
      {sub && <p className="text-sm mt-1.5" style={{ color: "#888" }}>{sub}</p>}
    </div>
  );
}

function downloadBlueprint(title, commitments, summary) {
  const html = `<html><head><meta charset='utf-8'/><style>body{font-family:Georgia,serif;color:#333;line-height:1.7;margin:40px;}h1{color:#021A35;font-size:26px;}h2{color:#C8A951;font-size:18px;border-bottom:2px solid #FDD20D;padding-bottom:4px;margin-top:28px;}.section{background:#FFF9E6;border-left:4px solid #C8A951;padding:16px;margin:20px 0;border-radius:4px;}p{margin:8px 0;}</style></head><body><h1>🎯 ${title} Blueprint</h1><p><strong>5C Leadership Blueprint · Awakening Destiny Global</strong></p><p style="color:#888;font-style:italic;">Generated ${new Date().toLocaleDateString()}</p>${summary ? `<div class="section"><h2>AI Analysis</h2><p>${summary.replace(/\n/g, "<br/>")}</p></div>` : ""}<h2>Your Commitments</h2>${Object.entries(commitments).map(([k,v]) => `<p><strong>${k.replace(/_/g," ")}:</strong> ${v||"(not completed)"}</p>`).join("")}<footer style="margin-top:48px;padding-top:16px;border-top:1px solid #ddd;font-size:11px;color:#aaa;"><p>© 2026 Awakening Destiny Global · awakeningdestiny.global</p><p>Review this blueprint regularly. Let it anchor your decisions and deepen your alignment.</p></footer></body></html>`;
  const blob = new Blob([html], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `${title}-Blueprint.doc`; a.click();
  URL.revokeObjectURL(url);
}

export default function ModuleTemplate({ config }) {
  const {
    moduleNum, title, subtitle, question,
    accent, accentLight, accentMid,
    activationText, activationPrompts,
    diagnostic, principles, exemplar, stages,
    commitmentPrompts, revisitTriggers, applicationQuestions,
    aiPromptContext, contrastTable,
  } = config;

  // ALL hooks must be called before any early returns
  const { paid, loading: payLoading } = usePaymentStatus();
  const isFree = moduleNum === 0;

  const [step, setStep]               = useState(0);
  const [preScores, setPreScores]     = useState({});
  const [postScores, setPostScores]   = useState({});
  const [commitments, setCommitments] = useState({});
  const [aiSummary, setAiSummary]     = useState("");
  const [loading, setLoading]         = useState(false);
  const topRef = useRef(null);
  const cur = STEPS[step];

  const scrollTop = () => topRef.current && topRef.current.scrollIntoView({ behavior: "smooth" });

  // Payment gate — loading state
  if (!isFree && payLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FAFAF8" }}>
        <p style={{ color: "#999", fontSize: 14 }}>Loading...</p>
      </div>
    );
  }

  // Payment gate — not paid
  if (!isFree && !paid) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FAFAF8", fontFamily: "'Outfit', sans-serif" }}>
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <div style={{ textAlign: "center", maxWidth: 440, padding: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", color: NAVY, fontSize: "2rem", marginBottom: 12 }}>This Module Requires Full Access</h1>
          <p style={{ color: "#666", fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>Unlock all five modules of the 5C Leadership Blueprint to continue your formation journey.</p>
          <button onClick={async () => {
            try {
              const { data: { session } } = await supabase.auth.getSession();
              const email = session?.user?.email;
              const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
              });
              const data = await res.json();
              if (data.url) window.location.href = data.url;
            } catch (err) { alert('Something went wrong. Please try again.'); }
          }} style={{ padding: "12px 32px", background: GOLD, color: NAVY, border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer", marginBottom: 12 }}>
            Unlock — $3.99
          </button>
          <br />
          <a href="/" style={{ color: "#888", fontSize: 13 }}>← Back to Dashboard</a>
        </div>
      </div>
    );
  }

  const generateSummary = async () => {
    setLoading(true);
    try {
      const commitStr = Object.entries(commitments).map(([k,v]) => `${k.replace(/_/g," ")}: ${v||"(not provided)"}`).join("\n");
      const prompt = `You are an apostolic leadership development coach with the 5C Leadership Blueprint (Awakening Destiny Global). Analyze this leader's responses for the ${title} dimension and write a 200-300 word personalized blueprint. Be direct, apostolic in tone, prophetically insightful, and practically actionable. Do not use flowery language. Address their specific commitments and call out what you see.\n\n${aiPromptContext}\n\nTheir Commitments:\n${commitStr}\n\nKeep it focused, specific, and formative.`;
      const res = await fetch("/api/claude", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt }) });
      const data = await res.json();
      setAiSummary(data.response || "");
    } catch (e) {
      setAiSummary("Unable to generate analysis at this time. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (cur.id) {

      case "activation":
        return (
          <div className="space-y-6">
            <SectionHead sub="Set aside distractions. You are entering formational territory.">Welcome to {title}</SectionHead>
            <div className="p-6 rounded-2xl" style={{ background: NAVY, color: "#fff" }}>
              {question && (
                <>
                  <p className="text-xs uppercase tracking-widest mb-2 font-semibold" style={{ color: accent }}>The Central Question</p>
                  <p className="text-lg italic mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>"{question}"</p>
                </>
              )}
              <p className="text-sm leading-relaxed" style={{ color: "#c8cdd6" }}>{activationText}</p>
            </div>
            <div>
              <SectionHead sub="Take three minutes in silence. Write the first honest answer that surfaces.">Activation Prompts</SectionHead>
              {activationPrompts.map((p, i) => <Reflect key={i} prompt={p} />)}
            </div>
          </div>
        );

      case "pre-diagnostic":
        return <DiagnosticSection diagnostic={diagnostic} scores={preScores} setScores={setPreScores} accent={accent} label="Pre-Teaching Self-Assessment" />;

      case "teaching":
        return (
          <div className="space-y-8">
            {contrastTable && (
              <div className="mb-2">
                <SectionHead sub="Which column describes your default — not your best day, but under pressure?">{contrastTable.title || "Two Ways to Lead"}</SectionHead>
                <div className="overflow-x-auto rounded-xl border" style={{ borderColor: "#e5e7eb" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th style={{ background: "#f9fafb", color: "#555", fontWeight: 700, fontSize: 13, padding: "12px 16px", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>{contrastTable.leftTitle}</th>
                        <th style={{ background: accentLight, color: NAVY, fontWeight: 700, fontSize: 13, padding: "12px 16px", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>{contrastTable.rightTitle}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contrastTable.rows.map((row, i) => (
                        <tr key={i} style={{ borderBottom: "1px solid #f0f0f0" }}>
                          <td style={{ padding: "10px 16px", fontSize: 13, color: "#666", background: "#fff" }}>{row[0]}</td>
                          <td style={{ padding: "10px 16px", fontSize: 13, color: NAVY, fontWeight: 500, background: i % 2 === 0 ? accentLight + "66" : "#fff" }}>{row[1]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            <SectionHead sub="These principles anchor everything about this dimension.">{principles.length} Governing Principles</SectionHead>
            {principles.map((p, idx) => {
              const promptList = p.prompts ? p.prompts : (p.prompt ? [p.prompt] : []);
              const isAddendum = p.addendum === true;
              return (
                <div key={idx} className="p-5 sm:p-6 rounded-xl"
                  style={{ background: isAddendum ? "#fafafa" : accentLight, borderLeft: `4px solid ${isAddendum ? accentMid : accent}`, border: isAddendum ? `1px solid #e5e7eb` : "none", borderLeftWidth: 4, borderLeftStyle: "solid", borderLeftColor: isAddendum ? accentMid : accent }}>
                  {isAddendum && (
                    <p className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: accentMid }}>Addendum Principle</p>
                  )}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0" style={{ background: NAVY, color: accentMid }}>{idx + 1}</div>
                    <div>
                      <h4 className="font-bold text-lg" style={{ color: NAVY, fontFamily: "'Cormorant Garamond', serif" }}>{p.title}</h4>
                      {p.ref && <p className="text-xs mt-0.5" style={{ color: "#999" }}>{p.ref}</p>}
                    </div>
                  </div>
                  {p.scripture && <p className="text-sm italic mb-4" style={{ color: NAVY, borderLeft: `2px solid ${accent}`, paddingLeft: 12, marginLeft: 44 }}>{p.scripture}</p>}
                  <div className="space-y-3 mb-4">
                    {p.paragraphs.map((para, i) => <p key={i} className="text-sm leading-relaxed" style={{ color: "#333" }}>{para}</p>)}
                  </div>
                  {promptList.length > 0 && (
                    <div className="pt-4" style={{ borderTop: `1px solid ${accent}44` }}>
                      <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: NAVY }}>Pause & Process</p>
                      {promptList.map((q, qi) => <PauseTextarea key={qi} prompt={q} />)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );

      case "exemplar":
        return (
          <div className="space-y-6">
            <SectionHead sub={exemplar.subtitle}>{exemplar.title}</SectionHead>
            <p className="text-sm leading-relaxed" style={{ color: "#333" }}>{exemplar.intro}</p>
            {exemplar.intro2 && <p className="text-sm leading-relaxed" style={{ color: "#333" }}>{exemplar.intro2}</p>}
            <div className="p-5 rounded-xl" style={{ background: accentLight, border: `1px solid ${accent}44` }}>
              <p className="text-sm font-bold mb-3 uppercase tracking-wide" style={{ color: NAVY }}>What this teaches us:</p>
              <ul className="space-y-2.5">
                {exemplar.lessons.map((l, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="mt-0.5 flex-shrink-0 font-bold" style={{ color: accent }}>✦</span>
                    <span style={{ color: "#333" }}>{l}</span>
                  </li>
                ))}
              </ul>
            </div>
            {exemplar.pattern && (
              <div className="p-4 rounded-xl text-center" style={{ background: NAVY }}>
                <p className="text-xs uppercase tracking-widest mb-2 font-semibold" style={{ color: accent }}>Pattern</p>
                <p className="text-sm font-semibold italic" style={{ color: "#fff", fontFamily: "'Cormorant Garamond', serif" }}>{exemplar.pattern}</p>
              </div>
            )}
            {exemplar.questions && exemplar.questions.length > 0 && (
              <div>
                <p className="text-sm font-semibold mb-3" style={{ color: NAVY }}>Coaching Questions:</p>
                {exemplar.questions.map((q, i) => <Reflect key={i} prompt={q} />)}
              </div>
            )}
          </div>
        );

      case "stages":
        return (
          <div className="space-y-5">
            <SectionHead sub="These stages are recognizable across every leader's journey. You are in one right now.">Stages of {title} Development</SectionHead>
            {stages.map((s, i) => (
              <div key={i} className="p-5 rounded-xl" style={{ background: "#fff", border: `1px solid #e5e7eb`, borderLeft: `4px solid ${accent}` }}>
                <h4 className="font-bold mb-2" style={{ color: NAVY, fontFamily: "'Cormorant Garamond', serif", fontSize: 17 }}>{s.title}</h4>
                <p className="text-sm leading-relaxed" style={{ color: "#444" }}>{s.description}</p>
                {s.markers && (
                  <ul className="mt-3 space-y-1.5">
                    {s.markers.map((m, j) => <li key={j} className="flex gap-2 text-xs" style={{ color: "#666" }}><span style={{ color: accent }}>·</span> {m}</li>)}
                  </ul>
                )}
              </div>
            ))}
            <div className="p-4 rounded-xl" style={{ background: accentLight }}>
              <p className="text-sm font-semibold mb-2" style={{ color: NAVY }}>Which stage are you in right now?</p>
              <PauseTextarea prompt="Name the stage and describe the specific evidence that supports your answer." />
            </div>
          </div>
        );

      case "post-diagnostic":
        return <DiagnosticSection diagnostic={diagnostic} scores={postScores} setScores={setPostScores} accent={accent} label="Post-Teaching Self-Assessment — What Has Shifted?" />;

      case "commitment":
        return (
          <div className="space-y-6">
            <SectionHead sub="Revelation must become responsibility. Write in full sentences — not fragments.">My {title} Commitment</SectionHead>
            <div className="space-y-5">
              {commitmentPrompts.map(c => (
                <div key={c.id}>
                  <label className="block text-sm font-semibold mb-2" style={{ color: NAVY }}>{c.label}</label>
                  <textarea
                    className="w-full rounded-xl p-3 text-sm leading-relaxed resize-none focus:outline-none"
                    style={{ border: "1px solid #ddd", minHeight: 90 }}
                    rows={4} placeholder={c.placeholder}
                    value={commitments[c.id] || ""}
                    onChange={e => setCommitments(p => ({ ...p, [c.id]: e.target.value }))}
                  />
                </div>
              ))}
            </div>
            {revisitTriggers && revisitTriggers.length > 0 && (
              <div className="p-5 rounded-xl" style={{ background: accentLight }}>
                <h4 className="font-bold mb-3" style={{ color: NAVY, fontFamily: "'Cormorant Garamond', serif" }}>{title} is a Living Discipline</h4>
                <p className="text-sm mb-3 leading-relaxed" style={{ color: "#333" }}>What you write today is not a one-time exercise. Return to it regularly as your season deepens.</p>
                <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: NAVY }}>Revisit when:</p>
                <ul className="space-y-2">
                  {revisitTriggers.map((t, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: accentMid }} />
                      <span style={{ color: "#444" }}>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {applicationQuestions && applicationQuestions.length > 0 && (
              <div>
                <SectionHead sub="Translate this dimension into leadership behavior.">Application Moment</SectionHead>
                {applicationQuestions.map((q, i) => <Reflect key={i} prompt={q} />)}
              </div>
            )}
          </div>
        );

      case "summary":
        return (
          <div className="space-y-6">
            <SectionHead sub={`Based on your reflections and commitments — your personalized ${title} analysis.`}>Your {title} Blueprint</SectionHead>
            {!aiSummary && !loading && (
              <button onClick={generateSummary} className="w-full py-4 rounded-2xl font-bold text-base transition-all" style={{ background: NAVY, color: accentMid }}>
                Generate My {title} Blueprint →
              </button>
            )}
            {loading && (
              <div className="text-center py-12">
                <div className="w-10 h-10 border-4 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: accentLight, borderTopColor: accent }} />
                <p className="text-sm" style={{ color: "#999" }}>Generating your personalized blueprint...</p>
              </div>
            )}
            {aiSummary && (
              <>
                <div className="p-6 rounded-2xl" style={{ border: `2px solid ${accent}`, background: accentLight }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: NAVY, color: accentMid, fontSize: 14 }}>✦</div>
                    <p className="font-bold" style={{ color: NAVY, fontFamily: "'Cormorant Garamond', serif", fontSize: 17 }}>Your {title} Blueprint</p>
                  </div>
                  <div>{aiSummary.split("\n\n").map((para, i) => <p key={i} className="text-sm leading-relaxed mb-3" style={{ color: "#222" }}>{para}</p>)}</div>
                </div>
                <button onClick={() => downloadBlueprint(title, commitments, aiSummary)} className="w-full py-3 rounded-2xl font-semibold text-sm transition-all" style={{ border: `2px solid ${NAVY}`, color: NAVY, background: "#fff" }}>
                  ↓ Download My {title} Blueprint (.doc)
                </button>
              </>
            )}
          </div>
        );

      default: return null;
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "#FAFAF8", fontFamily: "'Outfit', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      <div className="sticky top-0 z-50 border-b" style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", borderColor: "#f0f0f0" }}>
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="/" className="text-sm font-medium flex items-center gap-1.5 hover:opacity-70 transition-opacity" style={{ color: NAVY }}>← Dashboard</a>
          <div className="text-center">
            <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: NAVY }}>{moduleNum === 0 ? "Introduction" : moduleNum === 6 ? "Commissioning" : `Module ${moduleNum}`}</p>
            <p className="text-sm font-bold" style={{ color: NAVY }}>{title}</p>
          </div>
          <div style={{ width: 28, display: "flex", justifyContent: "flex-end" }}><FlameMark size={28} /></div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pt-4 pb-2">
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {STEPS.map((s, i) => (
            <button key={s.id} onClick={() => { setStep(i); scrollTop(); }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex-shrink-0"
              style={{ background: i === step ? accent : i < step ? accentLight : "transparent", color: i === step ? NAVY : i < step ? accent : "#bbb", border: `1px solid ${i <= step ? accent : "#e5e5e5"}` }}>
              {i < step ? "✓ " : ""}{s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-36" ref={topRef}>
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: accent }}>{cur.label}</p>
          <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: NAVY, fontFamily: "'Cormorant Garamond', serif" }}>{title}{subtitle ? `: ${subtitle}` : ""}</h2>
          {question && <p className="text-sm mt-1 italic" style={{ color: "#888" }}>Central Question: {question}</p>}
        </div>
        {renderStep()}
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t py-3 z-40" style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)", borderColor: "#f0f0f0" }}>
        <div className="max-w-3xl mx-auto px-4 flex justify-between items-center">
          <button onClick={() => { if (step > 0) { setStep(step - 1); scrollTop(); } }} disabled={step === 0}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-30" style={{ color: NAVY, border: `1.5px solid ${NAVY}` }}>← Previous</button>
          <span className="text-xs" style={{ color: "#bbb" }}>{step + 1} / {STEPS.length}</span>
          <button onClick={() => { if (step < STEPS.length - 1) { setStep(step + 1); scrollTop(); } }} disabled={step === STEPS.length - 1}
            className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-30" style={{ background: NAVY, color: accentMid }}>Next →</button>
        </div>
        <p className="text-center text-xs mt-1.5" style={{ color: "#ccc" }}>© 2026 Awakening Destiny Global</p>
      </div>
    </div>
  );
}