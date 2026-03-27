// components/ModuleTemplate.js
// Shared rendering engine for all 5C Leadership Blueprint modules

import { useState, useRef, useEffect } from "react";
import FlameMark from "./FlameMark";
import { usePaymentStatus } from "../lib/usePaymentStatus";
import { supabase } from "../lib/supabase";
import { downloadCertificate } from "../lib/certificate";

var NAVY = "#021A35";
var GOLD = "#FDD20D";

var STEPS_DEFAULT = [
  { id: "activation", label: "Activation" },
  { id: "pre-diagnostic", label: "Pre-Check" },
  { id: "teaching", label: "Teaching" },
  { id: "exemplar", label: "Exemplar" },
  { id: "stages", label: "Stages" },
  { id: "post-diagnostic", label: "Post-Check" },
  { id: "commitment", label: "Commitment" },
  { id: "summary", label: "Blueprint" },
];

var STEPS_INTRO = [
  { id: "activation", label: "Activation" },
  { id: "teaching", label: "Teaching" },
  { id: "exemplar", label: "Exemplar" },
  { id: "stages", label: "Stages" },
  { id: "commitment", label: "Commitment" },
  { id: "assessment", label: "Assessment" },
  { id: "summary", label: "Blueprint" },
];

function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(2,26,53,0.85)" }} />
      <div style={{ position: "relative", width: "90%", maxWidth: 640, maxHeight: "85vh", overflowY: "auto", background: "#fff", borderRadius: 16, padding: "32px 28px", boxShadow: "0 24px 64px rgba(0,0,0,0.3)" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 12, right: 16, background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#999" }}>×</button>
        {children}
        <button onClick={onClose} style={{ display: "block", width: "100%", marginTop: 24, padding: "12px 0", background: NAVY, color: GOLD, border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer", textAlign: "center" }}>Close Window</button>
      </div>
    </div>
  );
}

function ScriptureContent({ scriptures }) {
  if (!scriptures) return null;
  return (
    <div>
      <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, color: GOLD, marginBottom: 4 }}>Further Study</p>
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", color: NAVY, fontSize: "1.6rem", fontWeight: 700, marginBottom: 12 }}>Scriptures for Further Study</h2>
      <p style={{ fontSize: 14, color: "#555", lineHeight: 1.7, marginBottom: 24, fontStyle: "italic" }}>{scriptures.intro}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {scriptures.verses.map(function(v, i) {
          return (
            <div key={i} style={{ padding: "12px 16px", borderRadius: 10, background: i % 2 === 0 ? "#FFF9E6" : "#f9fafb", borderLeft: "3px solid " + GOLD }}>
              <span style={{ fontWeight: 700, color: NAVY, fontSize: 13 }}>{v.ref}</span>
              <span style={{ color: "#555", fontSize: 13 }}> — {v.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BookChapterContent({ chapter }) {
  if (!chapter) return null;
  return (
    <div>
      <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, color: GOLD, marginBottom: 4 }}>From the Book</p>
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", color: NAVY, fontSize: "1.6rem", fontWeight: 700, marginBottom: 16 }}>{chapter.title}</h2>
      {chapter.paragraphs.map(function(p, i) {
        if (p.type === "scripture") {
          return <p key={i} style={{ fontSize: 14, color: NAVY, fontStyle: "italic", borderLeft: "3px solid " + GOLD, paddingLeft: 16, margin: "16px 0", lineHeight: 1.7 }}>{p.text}</p>;
        }
        return <p key={i} style={{ fontSize: 14, color: "#333", lineHeight: 1.8, marginBottom: 14 }}>{p.text}</p>;
      })}
      {chapter.source && <p style={{ fontSize: 12, color: "#999", marginTop: 20, fontStyle: "italic" }}>{chapter.source}</p>}
    </div>
  );
}

function PauseTextarea({ prompt }) {
  var s = useState("");
  return (
    <div className="mb-4">
      {prompt && <p className="text-sm mb-2" style={{ color: "#333" }}>{prompt}</p>}
      <textarea className="w-full rounded-lg p-3 text-sm leading-relaxed resize-none focus:outline-none" style={{ border: "1px solid #ddd", background: "#fff", minHeight: 80 }} rows={3} placeholder="Write your response here..." value={s[0]} onChange={function(e) { s[1](e.target.value); }} />
    </div>
  );
}

function ScoreButtons({ itemNum, scores, setScores, accent }) {
  return (
    <div style={{ display: "flex", gap: 4, alignItems: "center", flexShrink: 0, flexWrap: "wrap" }}>
      {[1, 2, 3, 4, 5].map(function(score) {
        return (
          <button key={score} onClick={function() { setScores(function(p) { var n = Object.assign({}, p); n[itemNum] = score; return n; }); }} style={{ width: 32, height: 32, borderRadius: 6, fontSize: 13, fontWeight: "bold", border: "none", cursor: "pointer", transition: "all 0.15s", background: scores[itemNum] === score ? accent : "#f0f0f0", color: scores[itemNum] === score ? NAVY : "#999" }}>{score}</button>
        );
      })}
      <button onClick={function() { setScores(function(p) { var n = Object.assign({}, p); n[itemNum] = "na"; return n; }); }} style={{ height: 32, padding: "0 7px", borderRadius: 6, fontSize: 11, fontWeight: "bold", cursor: "pointer", transition: "all 0.15s", background: scores[itemNum] === "na" ? "#6b7280" : "transparent", color: scores[itemNum] === "na" ? "#fff" : "#bbb", border: "1px dashed #ccc" }}>N/A</button>
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
      {diagnostic.map(function(d) {
        return (
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
        );
      })}
    </div>
  );
}

function Reflect({ prompt }) {
  var s = useState("");
  return (
    <div className="mb-5 p-4 rounded-xl" style={{ background: "#f9fafb", border: "1px solid #e5e7eb" }}>
      <p className="text-sm font-semibold mb-3" style={{ color: NAVY }}>{prompt}</p>
      <textarea className="w-full rounded-lg p-3 text-sm leading-relaxed resize-none focus:outline-none" style={{ border: "1px solid #ddd", background: "#fff", minHeight: 90 }} rows={4} placeholder="Write your honest reflection here..." value={s[0]} onChange={function(e) { s[1](e.target.value); }} />
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
  var html = '<html><head><meta charset="utf-8"/><style>body{font-family:Georgia,serif;color:#333;line-height:1.7;margin:40px;}h1{color:#021A35;font-size:26px;}h2{color:#C8A951;font-size:18px;border-bottom:2px solid #FDD20D;padding-bottom:4px;margin-top:28px;}.section{background:#FFF9E6;border-left:4px solid #C8A951;padding:16px;margin:20px 0;border-radius:4px;}p{margin:8px 0;}</style></head><body>';
  html += '<h1>' + title + ' Blueprint</h1>';
  html += '<p><strong>5C Leadership Blueprint - Awakening Destiny Global</strong></p>';
  html += '<p style="color:#888;font-style:italic;">Generated ' + new Date().toLocaleDateString() + '</p>';
  if (summary) { html += '<div class="section"><h2>Leadership Analysis</h2><p>' + summary.replace(/\n/g, "<br/>") + '</p></div>'; }
  html += '<h2>Your Commitments</h2>';
  Object.entries(commitments).forEach(function(entry) { html += '<p><strong>' + entry[0].replace(/_/g, " ") + ':</strong> ' + (entry[1] || "(not completed)") + '</p>'; });
  html += '<footer style="margin-top:48px;padding-top:16px;border-top:1px solid #ddd;font-size:11px;color:#aaa;"><p>© 2026 Awakening Destiny Global - awakeningdestiny.global</p></footer></body></html>';
  var blob = new Blob([html], { type: "application/msword" });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url; a.download = title + "-Blueprint.doc"; a.click();
  URL.revokeObjectURL(url);
}

export default function ModuleTemplate({ config }) {
  var moduleNum = config.moduleNum;
  var title = config.title;
  var subtitle = config.subtitle;
  var question = config.question;
  var accent = config.accent;
  var accentLight = config.accentLight;
  var accentMid = config.accentMid;
  var activationText = config.activationText;
  var activationPrompts = config.activationPrompts;
  var diagnostic = config.diagnostic;
  var principles = config.principles;
  var exemplar = config.exemplar;
  var stages = config.stages;
  var commitmentPrompts = config.commitmentPrompts;
  var revisitTriggers = config.revisitTriggers;
  var applicationQuestions = config.applicationQuestions;
  var aiPromptContext = config.aiPromptContext;
  var contrastTable = config.contrastTable;
  var scriptures = config.scriptures;
  var bookChapter = config.bookChapter;
  var activationPrayer = config.activationPrayer;
  var podcast = config.podcast;

  var payStatus = usePaymentStatus();
  var paid = payStatus.paid;
  var payLoading = payStatus.loading;
  var isFree = moduleNum === 0;
  var STEPS = moduleNum === 0 ? STEPS_INTRO : STEPS_DEFAULT;

  var stepS = useState(0); var step = stepS[0]; var setStep = stepS[1];
  var preS = useState({}); var preScores = preS[0]; var setPreScores = preS[1];
  var postS = useState({}); var postScores = postS[0]; var setPostScores = postS[1];
  var comS = useState({}); var commitments = comS[0]; var setCommitments = comS[1];
  var sumS = useState(""); var aiSummary = sumS[0]; var setAiSummary = sumS[1];
  var ldS = useState(false); var loading = ldS[0]; var setLoading = ldS[1];
  var scS = useState(false); var showScriptures = scS[0]; var setShowScriptures = scS[1];
  var bkS = useState(false); var showBookChapter = bkS[0]; var setShowBookChapter = bkS[1];
  var rlS = useState(false); var resumeLoaded = rlS[0]; var setResumeLoaded = rlS[1];
  var poS = useState(false); var prayerOpen = poS[0]; var setPrayerOpen = poS[1];
  var rtS = useState(null); var resumeToast = rtS[0]; var setResumeToast = rtS[1];
  var leS = useState(null); var loadError = leS[0]; var setLoadError = leS[1];
  var seS = useState(null); var saveError = seS[0]; var setSaveError = seS[1];
  var sueS = useState(null); var summaryError = sueS[0]; var setSummaryError = sueS[1];
  var topRef = useRef(null);
  var cur = STEPS[step];
  var scrollTop = function() { if (topRef.current) topRef.current.scrollIntoView({ behavior: "smooth" }); };

  useEffect(function() {
    async function load() {
      try {
        var sr = await supabase.auth.getSession();
        var ss = sr.data.session;
        if (!ss || !ss.user || !ss.user.email) { setResumeLoaded(true); return; }
        var r = await supabase.from("module_progress").select("*").eq("user_email", ss.user.email).eq("module_num", moduleNum).single();
        if (r.data) {
          var savedStep = r.data.step || 0;
          if (r.data.step) setStep(r.data.step);
          if (r.data.pre_scores) setPreScores(r.data.pre_scores);
          if (r.data.post_scores) setPostScores(r.data.post_scores);
          if (r.data.commitments) setCommitments(r.data.commitments);
          if (r.data.ai_summary) setAiSummary(r.data.ai_summary);
          if (savedStep > 0) {
            var stepList = moduleNum === 0 ? STEPS_INTRO : STEPS_DEFAULT;
            var stepName = stepList[savedStep] ? stepList[savedStep].label : ("step " + savedStep);
            setResumeToast("Welcome back! Resuming from " + stepName);
          }
        }
      } catch (e) {
        console.error("Failed to load progress:", e);
        setLoadError("Couldn't load your progress. Your work is safe — refresh to try again.");
      }
      setResumeLoaded(true);
    }
    load();
  }, [moduleNum]);

  useEffect(function() {
    if (!resumeLoaded) return;
    var t = setTimeout(function() {
      async function save() {
        try {
          var sr = await supabase.auth.getSession();
          var ss = sr.data.session;
          if (!ss || !ss.user || !ss.user.email) return;
          await supabase.from("module_progress").upsert({ user_email: ss.user.email, module_num: moduleNum, step: step, pre_scores: preScores, post_scores: postScores, commitments: commitments, ai_summary: aiSummary, updated_at: new Date().toISOString() }, { onConflict: "user_email,module_num" });
        } catch (e) {
          console.error("Failed to save progress:", e);
          setSaveError("Progress didn't save. Check your connection and try again.");
          setTimeout(function() { setSaveError(null); }, 5000);
        }
      }
      save();
    }, 1500);
    return function() { clearTimeout(t); };
  }, [step, preScores, postScores, commitments, aiSummary, resumeLoaded, moduleNum]);

  useEffect(function() {
    if (!resumeToast) return;
    var t = setTimeout(function() { setResumeToast(null); }, 4000);
    return function() { clearTimeout(t); };
  }, [resumeToast]);

  if (!isFree && payLoading) {
    return (<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FAFAF8" }}><p style={{ color: "#999", fontSize: 14 }}>Loading...</p></div>);
  }

  if (!isFree && !paid) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FAFAF8", fontFamily: "'Outfit', sans-serif" }}>
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <div style={{ textAlign: "center", maxWidth: 440, padding: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", color: NAVY, fontSize: "2rem", marginBottom: 12 }}>This Module Requires Full Access</h1>
          <p style={{ color: "#666", fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>Unlock all five modules of the 5C Leadership Blueprint to continue your formation journey.</p>
          <button onClick={function() { fetch('/api/checkout', { method: 'POST' }).then(function(r) { return r.json(); }).then(function(d) { if (d.url) window.location.href = d.url; }).catch(function() { alert('Something went wrong.'); }); }} style={{ padding: "12px 32px", background: GOLD, color: NAVY, border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer", marginBottom: 12 }}>Unlock — $3.99</button>
          <br /><a href="/" style={{ color: "#888", fontSize: 13 }}>← Back to Dashboard</a>
        </div>
      </div>
    );
  }

  var generateSummary = function() {
    setLoading(true);
    var commitStr = Object.entries(commitments).map(function(e) { return e[0].replace(/_/g, " ") + ": " + (e[1] || "(left blank)"); }).join("\n");
    var blanks = Object.entries(commitments).filter(function(e) { return !e[1] || e[1].trim() === ""; }).map(function(e) { return e[0].replace(/_/g, " "); });
    var blankNote = blanks.length > 0 ? "\n\nThe following fields were left blank: " + blanks.join(", ") + ". Name what was left unanswered and challenge them to return and complete the work." : "";
    var prompt = "You are an apostolic leadership development coach with the 5C Leadership Blueprint (Awakening Destiny Global). Analyze this leader's responses for the " + title + " dimension.\n\nRules:\n- Keep your response under 150 words.\n- Be concise. No filler. Every sentence must be actionable or diagnostic.\n- Do not repeat what the leader wrote back to them.\n- Be direct, apostolic in tone, prophetically insightful, and practically actionable.\n- If fields were left blank, name what was left unanswered and challenge them to return and complete the work.\n- Do not fabricate analysis for empty fields.\n\n" + aiPromptContext + "\n\nTheir Commitments:\n" + commitStr + blankNote + "\n\nKeep it focused, specific, and formative.";
    fetch("/api/claude", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: prompt }) })
      .then(function(r) { return r.json(); })
      .then(function(d) { setAiSummary(d.response || ""); })
      .catch(function(e) {
        console.error("Failed to generate AI summary:", e);
        setSummaryError("Summary unavailable right now — your responses are saved and you can continue.");
      })
      .finally(function() { setLoading(false); });
  };

  var handleCertificate = async function() {
    var sessionRes = await supabase.auth.getSession();
    var session = sessionRes.data.session;
    var email = session && session.user ? session.user.email : "";
    var user = session && session.user ? session.user : null;

    // Try to get real name from session metadata or profile
    var certName = "";
    try {
      // Check user_metadata first (set at signup)
      if (user?.user_metadata?.full_name) {
        certName = user.user_metadata.full_name;
      } else if (user?.user_metadata?.first_name) {
        certName = user.user_metadata.first_name + (user.user_metadata.last_name ? " " + user.user_metadata.last_name : "");
      } else {
        // Fall back to profile table
        var profileRes = await supabase.from("user_profiles").select("full_name").eq("id", user.id).single();
        if (profileRes.data?.full_name) {
          certName = profileRes.data.full_name;
        }
      }
    } catch (e) { /* silent — use fallback */ }

    // Final fallback: derive from email as before
    if (!certName && email) {
      certName = email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, function(c) { return c.toUpperCase(); });
    }

    downloadCertificate(certName || "Leader");
  };

  var renderStep = function() {
    switch (cur.id) {

      case "activation":
        return (
          <div className="space-y-6">
            <SectionHead sub="Set aside distractions. You are entering formational territory.">Welcome to {title}</SectionHead>
            {bookChapter && (
              <button onClick={function() { setShowBookChapter(true); }} style={{ width: "100%", padding: "16px 20px", background: NAVY, borderRadius: 12, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <span style={{ fontSize: 24 }}>📖</span>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: GOLD }}>From the Book: Leaders for Life</div>
                  <div style={{ fontSize: 12, color: "#c8cdd6" }}>{bookChapter.title} — Tap to read</div>
                </div>
              </button>
            )}
            <div className="p-6 rounded-2xl" style={{ background: NAVY, color: "#fff" }}>
              {question && (
                <div>
                  <p className="text-xs uppercase tracking-widest mb-2 font-semibold" style={{ color: accent }}>The Central Question</p>
                  <p className="text-lg italic mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>"{question}"</p>
                </div>
              )}
              <p className="text-sm leading-relaxed" style={{ color: "#c8cdd6" }}>{activationText}</p>
            </div>
            <div>
              <SectionHead sub="Take three minutes in silence. Write the first honest answer that surfaces.">Activation Prompts</SectionHead>
              {activationPrompts.map(function(p, i) { return <Reflect key={i} prompt={p} />; })}
            </div>
            {podcast && (
              <div style={{ marginTop: 24 }}>
                <p className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: accent }}>Podcast — Introduction Episode</p>
                <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #e5e7eb" }}>
                  <iframe
                    src={"https://www.buzzsprout.com/" + podcast.showId + "/" + podcast.episodeId + "?client_source=small_player&iframe=true"}
                    loading="lazy"
                    width="100%"
                    height="200"
                    frameBorder="0"
                    scrolling="no"
                    title="5C Blueprint Podcast"
                  />
                </div>
              </div>
            )}
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
                      {contrastTable.rows.map(function(row, i) {
                        return (
                          <tr key={i} style={{ borderBottom: "1px solid #f0f0f0" }}>
                            <td style={{ padding: "10px 16px", fontSize: 13, color: "#666", background: "#fff" }}>{row[0]}</td>
                            <td style={{ padding: "10px 16px", fontSize: 13, color: NAVY, fontWeight: 500, background: i % 2 === 0 ? accentLight + "66" : "#fff" }}>{row[1]}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            <SectionHead sub="These principles anchor everything about this dimension.">{principles.length} Governing Principles</SectionHead>
            {principles.map(function(p, idx) {
              var promptList = p.prompts ? p.prompts : (p.prompt ? [p.prompt] : []);
              var isAdd = p.addendum === true;
              return (
                <div key={idx} className="p-5 sm:p-6 rounded-xl" style={{ background: isAdd ? "#fafafa" : accentLight, borderLeftWidth: 4, borderLeftStyle: "solid", borderLeftColor: isAdd ? accentMid : accent, border: isAdd ? "1px solid #e5e7eb" : "none" }}>
                  {isAdd && <p className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: accentMid }}>Addendum Principle</p>}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0" style={{ background: NAVY, color: accentMid }}>{idx + 1}</div>
                    <div>
                      <h4 className="font-bold text-lg" style={{ color: NAVY, fontFamily: "'Cormorant Garamond', serif" }}>{p.title}</h4>
                      {p.ref && <p className="text-xs mt-0.5" style={{ color: "#999" }}>{p.ref}</p>}
                    </div>
                  </div>
                  {p.scripture && <p className="text-sm italic mb-4" style={{ color: NAVY, borderLeft: "2px solid " + accent, paddingLeft: 12, marginLeft: 44 }}>{p.scripture}</p>}
                  <div className="space-y-3 mb-4">
                    {p.paragraphs.map(function(para, i) { return <p key={i} className="text-sm leading-relaxed" style={{ color: "#333" }}>{para}</p>; })}
                  </div>
                  {promptList.length > 0 && (
                    <div className="pt-4" style={{ borderTop: "1px solid " + accent + "44" }}>
                      <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: NAVY }}>Pause & Process</p>
                      {promptList.map(function(q, qi) { return <PauseTextarea key={qi} prompt={q} />; })}
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
            <div className="p-5 rounded-xl" style={{ background: accentLight, border: "1px solid " + accent + "44" }}>
              <p className="text-sm font-bold mb-3 uppercase tracking-wide" style={{ color: NAVY }}>What this teaches us:</p>
              <ul className="space-y-2.5">
                {exemplar.lessons.map(function(l, i) {
                  return (<li key={i} className="flex gap-3 text-sm"><span className="mt-0.5 flex-shrink-0 font-bold" style={{ color: accent }}>✦</span><span style={{ color: "#333" }}>{l}</span></li>);
                })}
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
                {exemplar.questions.map(function(q, i) { return <Reflect key={i} prompt={q} />; })}
              </div>
            )}
          </div>
        );

      case "stages":
        return (
          <div className="space-y-5">
            <SectionHead sub="These stages are recognizable across every leader's journey. You are in one right now.">Stages of {title} Development</SectionHead>
            {stages.map(function(s, i) {
              return (
                <div key={i} className="p-5 rounded-xl" style={{ background: "#fff", border: "1px solid #e5e7eb", borderLeft: "4px solid " + accent }}>
                  <h4 className="font-bold mb-2" style={{ color: NAVY, fontFamily: "'Cormorant Garamond', serif", fontSize: 17 }}>{s.title}</h4>
                  <p className="text-sm leading-relaxed" style={{ color: "#444" }}>{s.description}</p>
                  {s.markers && (
                    <ul className="mt-3 space-y-1.5">
                      {s.markers.map(function(m, j) { return <li key={j} className="flex gap-2 text-xs" style={{ color: "#666" }}><span style={{ color: accent }}>·</span> {m}</li>; })}
                    </ul>
                  )}
                </div>
              );
            })}
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
              {commitmentPrompts.map(function(c) {
                return (
                  <div key={c.id}>
                    <label className="block text-sm font-semibold mb-2" style={{ color: NAVY }}>{c.label}</label>
                    <textarea className="w-full rounded-xl p-3 text-sm leading-relaxed resize-none focus:outline-none" style={{ border: "1px solid #ddd", minHeight: 90 }} rows={4} placeholder={c.placeholder} value={commitments[c.id] || ""} onChange={function(e) { var id = c.id; var v = e.target.value; setCommitments(function(p) { var n = Object.assign({}, p); n[id] = v; return n; }); }} />
                  </div>
                );
              })}
            </div>
            {revisitTriggers && revisitTriggers.length > 0 && (
              <div className="p-5 rounded-xl" style={{ background: accentLight }}>
                <h4 className="font-bold mb-3" style={{ color: NAVY, fontFamily: "'Cormorant Garamond', serif" }}>{title} is a Living Discipline</h4>
                <p className="text-sm mb-3 leading-relaxed" style={{ color: "#333" }}>What you write today is not a one-time exercise. Return to it regularly as your season deepens.</p>
                <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: NAVY }}>Revisit when:</p>
                <ul className="space-y-2">
                  {revisitTriggers.map(function(t, i) {
                    return (<li key={i} className="flex items-start gap-3 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: accentMid }} /><span style={{ color: "#444" }}>{t}</span></li>);
                  })}
                </ul>
              </div>
            )}
            {applicationQuestions && applicationQuestions.length > 0 && (
              <div>
                <SectionHead sub="Translate this dimension into leadership behavior.">Application Moment</SectionHead>
                {applicationQuestions.map(function(q, i) { return <Reflect key={i} prompt={q} />; })}
              </div>
            )}
          </div>
        );

      case "summary":
        return (
          <div className="space-y-6">
            <SectionHead sub={"Based on your reflections and commitments — your personalized " + title + " analysis."}>Your {title} Blueprint</SectionHead>
            {activationPrayer && (
              <div style={{ marginBottom: 8 }}>
                <button
                  onClick={function() { setPrayerOpen(function(o) { return !o; }); }}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", background: "transparent", border: "1px solid " + accent + "66", borderRadius: 12, cursor: "pointer", textAlign: "left" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 18 }}>🙏</span>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: NAVY, margin: 0 }}>Activation Prayer — {activationPrayer.theme}</p>
                      <p style={{ fontSize: 11, color: "#888", margin: 0 }}>{activationPrayer.context}</p>
                    </div>
                  </div>
                  <span style={{ fontSize: 12, color: accent, fontWeight: 700 }}>{prayerOpen ? "Close ↑" : "Open ↓"}</span>
                </button>
                {prayerOpen && (
                  <div style={{ padding: "20px 18px", background: "#FAFAF8", border: "1px solid " + accent + "44", borderTop: "none", borderRadius: "0 0 12px 12px" }}>
                    <div style={{ marginBottom: 16 }}>
                      {activationPrayer.scriptures.map(function(s, i) {
                        return (
                          <div key={i} style={{ padding: "10px 14px", borderLeft: "3px solid " + accent, marginBottom: 8, background: "#fff", borderRadius: "0 8px 8px 0" }}>
                            <p style={{ fontSize: 12, fontWeight: 700, color: NAVY, margin: "0 0 2px" }}>{s.ref}</p>
                            <p style={{ fontSize: 12, color: "#555", margin: 0, fontStyle: "italic" }}>{s.text}</p>
                          </div>
                        );
                      })}
                    </div>
                    <div style={{ padding: "16px 18px", background: NAVY, borderRadius: 10 }}>
                      {activationPrayer.prayer.split("\n\n").map(function(para, i) {
                        return <p key={i} style={{ fontSize: 13, color: "#c8cdd6", lineHeight: 1.8, margin: "0 0 10px" }}>{para}</p>;
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
            {!aiSummary && !loading && (
              <div>
                <button onClick={generateSummary} className="w-full py-4 rounded-2xl font-bold text-base transition-all" style={{ background: NAVY, color: accentMid }}>Generate My Personalized Summary →</button>
                {summaryError && (
                  <p style={{ fontSize: 12, color: "#991b1b", marginTop: 8 }}>⚠ Summary unavailable right now — your responses are saved and you can continue.</p>
                )}
              </div>
            )}
            {loading && (
              <div className="text-center py-12">
                <div className="w-10 h-10 border-4 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: accentLight, borderTopColor: accent }} />
                <p className="text-sm" style={{ color: "#999" }}>Generating your personalized summary...</p>
              </div>
            )}
            {aiSummary && (
              <div>
                <div className="p-6 rounded-2xl" style={{ border: "2px solid " + accent, background: accentLight }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: NAVY, color: accentMid, fontSize: 14 }}>✦</div>
                    <p className="font-bold" style={{ color: NAVY, fontFamily: "'Cormorant Garamond', serif", fontSize: 17 }}>Your {title} Blueprint</p>
                  </div>
                  <div>{aiSummary.split("\n\n").map(function(para, i) { return <p key={i} className="text-sm leading-relaxed mb-3" style={{ color: "#222" }}>{para}</p>; })}</div>
                </div>
                <button onClick={function() { downloadBlueprint(title, commitments, aiSummary); }} className="w-full py-3 rounded-2xl font-semibold text-sm transition-all" style={{ border: "2px solid " + NAVY, color: NAVY, background: "#fff", marginTop: 12 }}>↓ Download My {title} Blueprint (.doc)</button>
              </div>
            )}

            {moduleNum === 6 && aiSummary && (
              <button onClick={handleCertificate} className="w-full py-3 rounded-2xl font-semibold text-sm transition-all" style={{ border: "2px solid " + NAVY, color: NAVY, background: "#FFF9E6" }}>🎓 Download Completion Certificate</button>
            )}

            {config.resources && config.resources.blogs && (
              <div style={{ marginTop: 16 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 12 }}>Blog Articles & Resources</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {config.resources.blogs.map(function(b, i) {
                    return (
                      <a key={i} href={b.url} target="_blank" rel="noopener noreferrer" style={{ padding: "14px 16px", borderRadius: 10, background: "#fff", border: "1px solid #e5e7eb", textDecoration: "none", display: "block" }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 2 }}>{b.title}</div>
                        <div style={{ fontSize: 12, color: "#666", lineHeight: 1.5 }}>{b.description}</div>
                      </a>
                    );
                  })}
                </div>
                {config.resources.links && config.resources.links.map(function(l, i) {
                  return (<a key={i} href={l.url} target="_blank" rel="noopener noreferrer" style={{ display: "block", marginTop: 10, fontSize: 13, color: "#0172BC" }}>{l.title} →</a>);
                })}
              </div>
            )}

            {scriptures && (
              <button onClick={function() { setShowScriptures(true); }} className="w-full py-3 rounded-2xl font-semibold text-sm transition-all" style={{ border: "2px solid " + GOLD, color: NAVY, background: "#FFF9E6" }}>📖 Scriptures for Further Study</button>
            )}
          </div>
        );

      case "assessment":
        return (
          <div className="space-y-6">
            <SectionHead sub="This is your honest formation check. Rate each statement as you stand right now — not as you hope to be.">Formation Readiness Assessment</SectionHead>
            <DiagnosticSection diagnostic={diagnostic} scores={postScores} setScores={setPostScores} accent={accent} label="Formation Assessment" />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "#FAFAF8", fontFamily: "'Outfit', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      <Modal open={showScriptures} onClose={function() { setShowScriptures(false); }}>
        <ScriptureContent scriptures={scriptures} />
      </Modal>

      <Modal open={showBookChapter} onClose={function() { setShowBookChapter(false); }}>
        <BookChapterContent chapter={bookChapter} />
      </Modal>

      <div className="sticky top-0 z-50 border-b" style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", borderColor: "#f0f0f0" }}>
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="/" className="text-sm font-medium flex items-center gap-1.5 hover:opacity-70 transition-opacity" style={{ color: NAVY }}>← Dashboard</a>
          <div className="text-center">
            <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: NAVY }}>{moduleNum === 0 ? "Introduction" : moduleNum === 6 ? "Bonus Module" : "Module " + moduleNum}</p>
            <p className="text-sm font-bold" style={{ color: NAVY }}>{title}</p>
          </div>
          <div style={{ width: 28, display: "flex", justifyContent: "flex-end" }}><FlameMark size={28} /></div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pt-4 pb-2">
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {STEPS.map(function(s, i) {
            return (
              <button key={s.id} onClick={function() { setStep(i); scrollTop(); }} className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex-shrink-0" style={{ background: i === step ? accent : i < step ? accentLight : "transparent", color: i === step ? NAVY : i < step ? accent : "#bbb", border: "1px solid " + (i <= step ? accent : "#e5e5e5") }}>
                {i < step ? "✓ " : ""}{s.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-36" ref={topRef}>
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: accent }}>{cur.label}</p>
          <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: NAVY, fontFamily: "'Cormorant Garamond', serif" }}>{title}{subtitle ? ": " + subtitle : ""}</h2>
          {question && <p className="text-sm mt-1 italic" style={{ color: "#888" }}>Central Question: {question}</p>}
        </div>
        {loadError && (
          <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 8, padding: "10px 16px", fontSize: 12, color: "#991b1b", marginBottom: 12 }}>
            {loadError}
          </div>
        )}
        {saveError && (
          <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 8, padding: "10px 16px", fontSize: 12, color: "#991b1b", marginBottom: 12 }}>
            {saveError}
          </div>
        )}
        {renderStep()}
      </div>

      {resumeToast && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 9998, background: "#fff", color: "#021A35", borderLeft: "4px solid #C8A951", borderRadius: 8, padding: "12px 20px", boxShadow: "0 4px 16px rgba(0,0,0,0.12)", fontSize: 13, fontFamily: "'Raleway', 'Outfit', sans-serif", whiteSpace: "nowrap", transition: "opacity 0.3s" }}>{resumeToast}</div>
      )}

      <div className="fixed bottom-0 left-0 right-0 border-t py-3 z-40" style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)", borderColor: "#f0f0f0" }}>
        <div className="max-w-3xl mx-auto px-4 flex justify-between items-center">
          <button onClick={function() { if (step > 0) { setStep(step - 1); scrollTop(); } }} disabled={step === 0} className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-30" style={{ color: NAVY, border: "1.5px solid " + NAVY }}>← Previous</button>
          <span className="text-xs" style={{ color: "#bbb" }}>{step + 1} / {STEPS.length}</span>
          <button onClick={function() { if (step < STEPS.length - 1) { setStep(step + 1); scrollTop(); } }} disabled={step === STEPS.length - 1} className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-30" style={{ background: NAVY, color: accentMid }}>Next →</button>
        </div>
        <p className="text-center text-xs mt-1.5" style={{ color: "#ccc" }}>© 2026 Awakening Destiny Global</p>
      </div>
    </div>
  );
}