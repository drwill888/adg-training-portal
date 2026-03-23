// components/ModuleTemplate.js
// Shared rendering engine for all 5C Leadership Blueprint modules
// Updated: March 2026 — Training Improvements Tracker items #1–#14

import { useState, useRef } from "react";
import FlameMark from "./FlameMark";
import { usePaymentStatus } from "../lib/usePaymentStatus";
import { supabase } from "../lib/supabase";

const NAVY = "#021A35";
const GOLD = "#FDD20D";

// ─── DYNAMIC STEPS ───────────────────────────────────────────
// Introduction gets a single diagnostic after summary. Modules 1–6 get
// pre-diagnostic early + post-diagnostic at end with comparison & feedback.
function getSteps(moduleNum) {
  if (moduleNum === 0) {
    return [
      { id: "activation",    label: "Welcome" },
      { id: "teaching",      label: "Teaching" },
      { id: "exemplar",      label: "Exemplar" },
      { id: "stages",        label: "Stages" },
      { id: "commitment",    label: "Commitment" },
      { id: "summary",       label: "Blueprint" },
      { id: "diagnostic",    label: "Self-Assessment" },
      { id: "takeaways",     label: "Takeaways" },
      { id: "resources",     label: "Resources" },
    ];
  }
  return [
    { id: "activation",      label: "Activation" },
    { id: "pre-diagnostic",  label: "Pre-Check" },
    { id: "teaching",        label: "Teaching" },
    { id: "exemplar",        label: "Exemplar" },
    { id: "stages",          label: "Stages" },
    { id: "commitment",      label: "Commitment" },
    { id: "summary",         label: "Blueprint" },
    { id: "post-diagnostic", label: "Post-Check" },
    { id: "growth",          label: "Growth" },
    { id: "takeaways",       label: "Takeaways" },
    { id: "completion",      label: "Complete" },
  ];
}

// ─── SUBCOMPONENTS ───────────────────────────────────────────

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

// ─── DIAGNOSTIC COMPARISON (#8) ──────────────────────────────
function DiagnosticComparison({ diagnostic, preScores, postScores, accent, accentLight }) {
  const items = diagnostic.filter(d => {
    const pre = preScores[d.num];
    const post = postScores[d.num];
    return typeof pre === "number" && typeof post === "number";
  });
  if (items.length === 0) return <p className="text-sm" style={{ color: "#999" }}>Complete both diagnostics to see your growth comparison.</p>;

  const totalPre = items.reduce((s, d) => s + preScores[d.num], 0);
  const totalPost = items.reduce((s, d) => s + postScores[d.num], 0);
  const delta = totalPost - totalPre;

  return (
    <div className="space-y-4">
      {/* Overall summary */}
      <div className="p-5 rounded-xl text-center" style={{ background: NAVY }}>
        <p className="text-xs uppercase tracking-widest mb-2 font-semibold" style={{ color: accent }}>Your Growth</p>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 24 }}>
          <div>
            <p className="text-2xl font-bold" style={{ color: "#fff" }}>{totalPre}</p>
            <p className="text-xs" style={{ color: "#999" }}>Pre-Score</p>
          </div>
          <div style={{ fontSize: 24, color: accent }}>→</div>
          <div>
            <p className="text-2xl font-bold" style={{ color: accent }}>{totalPost}</p>
            <p className="text-xs" style={{ color: "#999" }}>Post-Score</p>
          </div>
          <div style={{ padding: "6px 14px", borderRadius: 8, background: delta > 0 ? "#dcfce7" : delta < 0 ? "#fef2f2" : "#f3f4f6" }}>
            <p className="text-sm font-bold" style={{ color: delta > 0 ? "#166534" : delta < 0 ? "#991b1b" : "#666" }}>
              {delta > 0 ? "+" : ""}{delta}
            </p>
          </div>
        </div>
      </div>
      {/* Per-item comparison */}
      <div className="space-y-2">
        {items.map(d => {
          const pre = preScores[d.num];
          const post = postScores[d.num];
          const diff = post - pre;
          return (
            <div key={d.num} className="flex items-center justify-between gap-3 p-3 rounded-lg" style={{ background: "#fff", border: "1px solid #e5e7eb" }}>
              <div className="flex-1 min-w-0">
                <p className="text-xs truncate" style={{ color: "#666" }}>{d.text}</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                <span className="text-xs" style={{ color: "#999" }}>{pre}</span>
                <span style={{ color: "#ccc" }}>→</span>
                <span className="text-xs font-bold" style={{ color: NAVY }}>{post}</span>
                {diff !== 0 && (
                  <span className="text-xs font-bold" style={{ color: diff > 0 ? "#16a34a" : "#dc2626" }}>
                    {diff > 0 ? "↑" : "↓"}{Math.abs(diff)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── RESOURCES SECTION (#11–14) ──────────────────────────────
function ResourcesSection({ resources, accent, accentLight }) {
  if (!resources) return null;
  return (
    <div className="space-y-5">
      <SectionHead sub="Continue your formation with these curated resources.">{resources.sectionTitle || "Additional Resources"}</SectionHead>

      {/* Book card */}
      {resources.book && (
        <a href={resources.book.url} target="_blank" rel="noopener noreferrer" className="block p-5 rounded-xl transition-all hover:shadow-md" style={{ background: "#fff", border: "1px solid #e5e7eb", textDecoration: "none" }}>
          <div className="flex gap-4">
            {resources.book.coverImage && (
              <div style={{ width: 80, height: 120, borderRadius: 6, overflow: "hidden", flexShrink: 0, background: "#f3f4f6" }}>
                <img src={resources.book.coverImage} alt={resources.book.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.target.style.display = "none"; }} />
              </div>
            )}
            <div>
              <p className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: accent }}>Recommended Reading</p>
              <p className="font-bold mb-1" style={{ color: NAVY, fontFamily: "'Cormorant Garamond', serif", fontSize: 16 }}>{resources.book.title}</p>
              {resources.book.author && <p className="text-xs mb-2" style={{ color: "#888" }}>by {resources.book.author}</p>}
              {resources.book.description && <p className="text-sm leading-relaxed" style={{ color: "#555" }}>{resources.book.description}</p>}
              <p className="text-xs mt-2 font-semibold" style={{ color: "#0172BC" }}>View on Amazon →</p>
            </div>
          </div>
        </a>
      )}

      {/* Blog posts */}
      {resources.blogs && resources.blogs.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: NAVY }}>Further Reading</p>
          <div className="space-y-2">
            {resources.blogs.map((blog, i) => (
              <a key={i} href={blog.url} target="_blank" rel="noopener noreferrer"
                className="block p-4 rounded-lg transition-all hover:shadow-sm"
                style={{ background: accentLight, border: `1px solid ${accent}33`, textDecoration: "none" }}>
                <p className="text-sm font-semibold mb-0.5" style={{ color: NAVY }}>{blog.title}</p>
                {blog.description && <p className="text-xs leading-relaxed" style={{ color: "#666" }}>{blog.description}</p>}
                <p className="text-xs mt-1" style={{ color: "#0172BC" }}>Read on Awakening Destiny Global →</p>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* General links */}
      {resources.links && resources.links.length > 0 && (
        <div className="space-y-2">
          {resources.links.map((link, i) => (
            <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-lg transition-all hover:shadow-sm"
              style={{ background: "#fff", border: "1px solid #e5e7eb", textDecoration: "none" }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: NAVY, color: GOLD, fontSize: 12 }}>↗</div>
              <div>
                <p className="text-sm font-semibold" style={{ color: NAVY }}>{link.title}</p>
                {link.description && <p className="text-xs" style={{ color: "#888" }}>{link.description}</p>}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── TRAINING OBJECTIVES (Introduction only, #3 supplement) ──
function TrainingObjectivesSection({ objectives, accent, accentLight }) {
  if (!objectives) return null;
  return (
    <div className="space-y-5 mt-6">
      <SectionHead sub={objectives.intro}>{objectives.headline}</SectionHead>

      {/* Outcome cards */}
      <div className="space-y-3">
        {objectives.outcomes.map((o, i) => (
          <div key={i} className="p-4 rounded-xl" style={{ background: "#fff", border: "1px solid #e5e7eb", borderLeft: `4px solid ${accent}` }}>
            <p className="font-bold mb-1" style={{ color: NAVY, fontFamily: "'Cormorant Garamond', serif", fontSize: 16 }}>{o.title}</p>
            <p className="text-sm leading-relaxed" style={{ color: "#444" }}>{o.description}</p>
          </div>
        ))}
      </div>

      {/* Deliverables */}
      {objectives.deliverables && (
        <div className="p-5 rounded-xl" style={{ background: accentLight }}>
          <p className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: NAVY }}>What You Will Receive</p>
          <ul className="space-y-2">
            {objectives.deliverables.map((d, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="mt-1 flex-shrink-0" style={{ color: accent }}>✦</span>
                <span style={{ color: "#333" }}>{d}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Closing statement */}
      {objectives.closingStatement && (
        <div className="p-4 rounded-xl text-center" style={{ background: NAVY }}>
          <p className="text-sm italic leading-relaxed" style={{ color: "#c8cdd6", fontFamily: "'Cormorant Garamond', serif", fontSize: 15 }}>{objectives.closingStatement}</p>
        </div>
      )}
    </div>
  );
}

// ─── DOWNLOAD BLUEPRINT ──────────────────────────────────────
function downloadBlueprint(title, commitments, summary) {
  const html = `<html><head><meta charset='utf-8'/><style>body{font-family:Georgia,serif;color:#333;line-height:1.7;margin:40px;}h1{color:#021A35;font-size:26px;}h2{color:#C8A951;font-size:18px;border-bottom:2px solid #FDD20D;padding-bottom:4px;margin-top:28px;}.section{background:#FFF9E6;border-left:4px solid #C8A951;padding:16px;margin:20px 0;border-radius:4px;}p{margin:8px 0;}</style></head><body><h1>🎯 ${title} Blueprint</h1><p><strong>5C Leadership Blueprint · Awakening Destiny Global</strong></p><p style="color:#888;font-style:italic;">Generated ${new Date().toLocaleDateString()}</p>${summary ? `<div class="section"><h2>Your Personalized Analysis</h2><p>${summary.replace(/\n/g, "<br/>")}</p></div>` : ""}<h2>Your Commitments</h2>${Object.entries(commitments).map(([k,v]) => `<p><strong>${k.replace(/_/g," ")}:</strong> ${v||"(not completed)"}</p>`).join("")}<footer style="margin-top:48px;padding-top:16px;border-top:1px solid #ddd;font-size:11px;color:#aaa;"><p>© 2026 Awakening Destiny Global · awakeningdestiny.global</p><p>Review this blueprint regularly. Let it anchor your decisions and deepen your alignment.</p></footer></body></html>`;
  const blob = new Blob([html], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `${title}-Blueprint.doc`; a.click();
  URL.revokeObjectURL(url);
}

// ─── MAIN COMPONENT ──────────────────────────────────────────

export default function ModuleTemplate({ config }) {
  const {
    moduleNum, title, subtitle, question,
    accent, accentLight, accentMid,
    activationText, activationPrompts,
    diagnostic, principles, exemplar, stages,
    commitmentPrompts, revisitTriggers, applicationQuestions,
    contrastTable,
    // New config keys
    trainingObjectives, resources, learningObjectives, keyTakeaways,
  } = config;

  // Support both old and new key names
  const promptContext = config.summaryPromptContext || config.aiPromptContext || "";

  const STEPS = getSteps(moduleNum);

  // ALL hooks before any early returns
  const { paid, loading: payLoading } = usePaymentStatus();
  const isFree = moduleNum === 0;

  const [step, setStep]               = useState(0);
  const [preScores, setPreScores]     = useState({});
  const [postScores, setPostScores]   = useState({});
  const [commitments, setCommitments] = useState({});
  const [aiSummary, setAiSummary]     = useState("");
  const [loading, setLoading]         = useState(false);
  const [feedback, setFeedback]       = useState({ takeaway: "", suggestion: "" });
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
      const prompt = `You are an apostolic leadership development coach with the 5C Leadership Blueprint (Awakening Destiny Global). Analyze this leader's responses for the ${title} dimension and write a 200-300 word personalized blueprint. Be direct, apostolic in tone, prophetically insightful, and practically actionable. Do not use flowery language. Address their specific commitments and call out what you see.\n\n${promptContext}\n\nTheir Commitments:\n${commitStr}\n\nKeep it focused, specific, and formative.`;
      const res = await fetch("/api/claude", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt }) });
      const data = await res.json();
      setAiSummary(data.response || "");
    } catch (e) {
      setAiSummary("Unable to generate analysis at this time. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ─── STEP RENDERER ────────────────────────────────────────
  const renderStep = () => {
    switch (cur.id) {

      case "activation":
        return (
          <div className="space-y-6">
            {/* How to Use */}
            <div className="px-4 py-3 rounded-lg flex items-start gap-3" style={{ background: "#f3f4f6", border: "1px solid #e5e7eb" }}>
              <span style={{ color: accent, fontSize: 16, flexShrink: 0, marginTop: 1 }}>◈</span>
              <p className="text-xs leading-relaxed" style={{ color: "#666" }}>
                {moduleNum === 0
                  ? "Set aside 30–45 minutes. Move through each step in order. Write in full sentences — not fragments. This is not a quiz. It is a formation tool. The depth of what you receive depends on the honesty you bring."
                  : "Set aside 45–60 minutes. Move through each step in order. Complete the Pre-Check before engaging the teaching. Write reflections in full sentences. Your responses feed your personalized blueprint — the more specific you are, the more targeted your analysis will be."
                }
              </p>
            </div>
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
            {/* Training Objectives — Introduction only (#3 supplement) */}
            {moduleNum === 0 && trainingObjectives && (
              <TrainingObjectivesSection objectives={trainingObjectives} accent={accent} accentLight={accentLight} />
            )}
            {/* Learning Objectives */}
            {learningObjectives && learningObjectives.length > 0 && (
              <div className="p-5 rounded-xl" style={{ background: "#fff", border: `1px solid ${accent}44` }}>
                <p className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: accent }}>By the end of this module, you will be able to:</p>
                <ul className="space-y-3">
                  {learningObjectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5" style={{ background: NAVY, color: accentMid }}>{i + 1}</span>
                      <span style={{ color: "#333", lineHeight: 1.6 }}>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div>
              <SectionHead sub="Take three minutes in silence. Write the first honest answer that surfaces.">Activation Prompts</SectionHead>
              {activationPrompts.map((p, i) => <Reflect key={i} prompt={p} />)}
            </div>
          </div>
        );

      case "pre-diagnostic":
        return <DiagnosticSection diagnostic={diagnostic} scores={preScores} setScores={setPreScores} accent={accent} label="Pre-Teaching Self-Assessment" />;

      // Introduction single diagnostic (placed after summary per #1)
      case "diagnostic":
        return <DiagnosticSection diagnostic={diagnostic} scores={preScores} setScores={setPreScores} accent={accent} label="Baseline Self-Assessment — Answer with honest clarity." />;

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
                <div className="mt-4">
                  <PauseTextarea prompt="Based on the table above — which column describes your default? Where do you see the gap between where you are and where this training is taking you?" />
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

      // ─── GROWTH COMPARISON (#8) ───────────────────────────
      case "growth":
        return (
          <div className="space-y-6">
            <SectionHead sub="Compare your pre-teaching and post-teaching assessments to see what shifted.">Your Growth in {title}</SectionHead>
            <DiagnosticComparison diagnostic={diagnostic} preScores={preScores} postScores={postScores} accent={accent} accentLight={accentLight} />
          </div>
        );

      // ─── TAKEAWAYS (#new) ──────────────────────────────────
      case "takeaways":
        return (
          <div className="space-y-6">
            <SectionHead sub="Carry these truths with you. They are the non-negotiables of this dimension.">Key Takeaways: {title}</SectionHead>
            <div className="space-y-3">
              {keyTakeaways && keyTakeaways.map((t, i) => (
                <div key={i} className="p-4 rounded-xl flex items-start gap-4" style={{ background: i % 2 === 0 ? accentLight : "#fff", border: `1px solid ${accent}33` }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5" style={{ background: NAVY, color: accentMid }}>{i + 1}</div>
                  <p className="text-sm leading-relaxed" style={{ color: "#333" }}>{t}</p>
                </div>
              ))}
              {(!keyTakeaways || keyTakeaways.length === 0) && (
                <p className="text-sm" style={{ color: "#999" }}>Takeaways will be available once this module is fully configured.</p>
              )}
            </div>
            <div className="p-4 rounded-xl" style={{ background: accentLight }}>
              <PauseTextarea prompt="Which takeaway challenged you the most — and what will you do differently because of it?" />
            </div>
          </div>
        );

      // ─── COMPLETION: THANK-YOU + FEEDBACK + RESOURCES (#9, #10, #11–14) ──
      case "completion":
        return (
          <div className="space-y-8">
            {/* Thank-you message (#9) */}
            <div className="p-6 rounded-2xl text-center" style={{ background: NAVY }}>
              <p className="text-xs uppercase tracking-widest mb-3 font-semibold" style={{ color: accent }}>Module Complete</p>
              <h3 className="text-xl font-bold mb-3" style={{ color: "#fff", fontFamily: "'Cormorant Garamond', serif" }}>Well done.</h3>
              <p className="text-sm leading-relaxed mb-2" style={{ color: "#c8cdd6" }}>
                You have completed the {title} dimension of the 5C Leadership Blueprint. What you wrote here is not homework — it is a formation document. Return to your commitments. Revisit your blueprint. Let this work deepen as your season unfolds.
              </p>
              <p className="text-sm italic" style={{ color: accent, fontFamily: "'Cormorant Garamond', serif" }}>
                "Faithful in little, ruler over much."
              </p>
            </div>

            {/* Learner feedback (#10) */}
            <div className="space-y-4">
              <SectionHead sub="Your honest input helps us sharpen this training for every leader who follows you.">Your Feedback</SectionHead>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: NAVY }}>What was your biggest takeaway from this module?</label>
                <textarea
                  className="w-full rounded-xl p-3 text-sm leading-relaxed resize-none focus:outline-none"
                  style={{ border: "1px solid #ddd", minHeight: 80 }}
                  rows={3} placeholder="What shifted, challenged, or clarified something for you?"
                  value={feedback.takeaway}
                  onChange={e => setFeedback(p => ({ ...p, takeaway: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: NAVY }}>Any suggestions for improvement?</label>
                <textarea
                  className="w-full rounded-xl p-3 text-sm leading-relaxed resize-none focus:outline-none"
                  style={{ border: "1px solid #ddd", minHeight: 80 }}
                  rows={3} placeholder="What could be clearer, deeper, or more practical?"
                  value={feedback.suggestion}
                  onChange={e => setFeedback(p => ({ ...p, suggestion: e.target.value }))}
                />
              </div>
              <button
                onClick={async () => {
                  try {
                    const { data: { session } } = await supabase.auth.getSession();
                    if (session?.user) {
                      await supabase.from("feedback").insert({
                        user_id: session.user.id,
                        module: title.toLowerCase(),
                        takeaway: feedback.takeaway,
                        suggestion: feedback.suggestion,
                      });
                    }
                    alert("Thank you for your feedback.");
                  } catch (e) { /* silent */ }
                }}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{ background: NAVY, color: accentMid }}>
                Submit Feedback
              </button>
            </div>

            {/* Resources (#11–14) */}
            {resources && <ResourcesSection resources={resources} accent={accent} accentLight={accentLight} />}

            {/* Next module prompt */}
            <div className="text-center pt-4">
              <a href="/" className="text-sm font-medium hover:opacity-70 transition-opacity" style={{ color: NAVY }}>← Return to Dashboard</a>
            </div>
          </div>
        );

      // ─── INTRO RESOURCES (standalone step for Introduction module) ──
      case "resources":
        return (
          <div className="space-y-6">
            <ResourcesSection resources={resources} accent={accent} accentLight={accentLight} />
            <div className="text-center pt-4">
              <a href="/" className="text-sm font-medium hover:opacity-70 transition-opacity" style={{ color: NAVY }}>← Return to Dashboard</a>
            </div>
          </div>
        );

      default: return null;
    }
  };

  // ─── LAYOUT ────────────────────────────────────────────────
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