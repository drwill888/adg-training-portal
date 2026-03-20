// ═══════════════════════════════════════════════════════════════
// INTRODUCTION — Foundation (Framework)
// 5C Leadership Blueprint · Awakening Destiny Global
// Pages Router: pages/modules/introduction.js
// ═══════════════════════════════════════════════════════════════
import { useState, useEffect } from "react";
import Head from "next/head";

const colors = {
  navy: "#021A35", navyLight: "#0a2a4d", navyMid: "#132f50",
  skyBlue: "#00AEEF", royalBlue: "#0172BC", orange: "#F47722",
  yellow: "#FDD20D", red: "#EE3124", gold: "#C8A951", goldLight: "#d4b86a",
  white: "#FFFFFF", offWhite: "#F8F9FC",
  gray100: "#f1f3f7", gray200: "#e2e6ed", gray300: "#c8cdd6",
  gray500: "#6b7280", gray700: "#374151",
};

const modules = [
  { id: 1, title: "Calling",     subtitle: "Potential (Purpose)",        question: "Who was I designed to become?",     icon: "①", exemplar: "Jeremiah" },
  { id: 2, title: "Connection",  subtitle: "Identity (Relationships)",   question: "Whose am I?",                       icon: "②", exemplar: "Jesus" },
  { id: 3, title: "Competency",  subtitle: "Excellence (Credibility)",   question: "Can I carry what I'm called to build?", icon: "③", exemplar: "Joseph" },
  { id: 4, title: "Capacity",    subtitle: "Character (Sustainability)", question: "Can I sustain what I'm building?",  icon: "④", exemplar: "David" },
  { id: 5, title: "Convergence", subtitle: "Sweet Spot (Impact)",        question: "Am I operating in my sweet spot?",  icon: "⑤", exemplar: "David" },
];

const preCoursePrompts = [
  { id: 1, text: "What do you want to get out of this course?", hint: "Clarity? Focus? Renewed alignment? Greater impact? Sustainability?" },
  { id: 2, text: "What would make this course transformational for you, not just informational?" },
  { id: 3, text: "Where do you currently feel the greatest tension in your leadership?", hint: "Consider: Calling clarity • Identity security • Skill gaps • Emotional capacity • Overextension • Lack of focus" },
  { id: 4, text: "If nothing changes in the next 12 months, what will it cost you?" },
  { id: 5, text: "If alignment increases across all five dimensions, what becomes possible?" },
];

const acc = [colors.skyBlue, colors.royalBlue, colors.orange, colors.red, colors.gold];
const dist = ["Calling vs. Assignment","Orphan vs. Son","Anointed Only vs. Prepared","Reactive vs. Refined","Scattered vs. Converged"];

function FadeIn({ children, delay = 0 }) {
  const [v, setV] = useState(false);
  useEffect(() => { const t = setTimeout(() => setV(true), delay); return () => clearTimeout(t); }, [delay]);
  return <div style={{ opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(16px)", transition: "opacity 0.6s ease, transform 0.6s ease" }}>{children}</div>;
}

function BackBtn({ onClick, label = "Back" }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ padding: "10px 20px", background: h ? colors.navy : colors.white, border: `1.5px solid ${colors.navy}`, borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", color: h ? colors.white : colors.navy, display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s ease" }}>
      <span style={{ fontSize: 16 }}>←</span> {label}
    </button>
  );
}

function NextBtn({ onClick, label = "Continue", gold = false, disabled = false }) {
  const bg = gold ? colors.gold : colors.navy;
  const fg = gold ? colors.navy : colors.white;
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ padding: "10px 24px", background: disabled ? colors.gray300 : bg, color: disabled ? colors.gray500 : fg, border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: disabled ? "default" : "pointer", display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s ease" }}>
      {label} <span style={{ fontSize: 16 }}>→</span>
    </button>
  );
}

function Nav({ back, next }) {
  return <div style={{ display: "flex", justifyContent: back ? "space-between" : "flex-end", marginTop: 32 }}>
    {back && <BackBtn onClick={back.onClick} label={back.label} />}
    {next && <NextBtn onClick={next.onClick} label={next.label} gold={next.gold} disabled={next.disabled} />}
  </div>;
}

export default function IntroductionPage() {
  const [r, setR] = useState({});
  const [s, setS] = useState(0);
  const [committed, setCommitted] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState(null);


  const secs = ["overview","why","objectives","structure","map","reflection","commitment","summary"];

  return (
    <>
      <Head><title>Introduction | 5C Leadership Blueprint</title></Head>
      <div style={{ minHeight: "100vh", background: colors.offWhite, fontFamily: "'Raleway','Segoe UI',sans-serif" }}>
        <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

        {/* Top bar */}
        <div style={{ position: "sticky", top: 0, zIndex: 30, background: colors.white, borderBottom: `1px solid ${colors.gray200}`, padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ fontSize: 13, fontWeight: 600, color: colors.navy, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>← Dashboard</a>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 11, color: colors.gold, fontWeight: 600, letterSpacing: "0.1em" }}>INTRODUCTION</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: colors.navy }}>5C Leadership Blueprint</div>
          </div>
          <div style={{ width: 80 }} />
        </div>

        {/* Progress bar */}
        <div style={{ padding: "16px 24px 0" }}>
          <div style={{ display: "flex", gap: 4, maxWidth: 780, margin: "0 auto" }}>
            {secs.map((x, i) => (
              <div key={x} onClick={() => setS(i)} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= s ? colors.gold : colors.gray200, transition: "background 0.3s", cursor: "pointer" }} />
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: 780, margin: "0 auto", padding: "24px 24px 60px" }}>

          {/* STEP 0: Overview */}
          {s === 0 && <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <h1 style={{ fontSize: 30, fontWeight: 700, color: colors.navy, margin: "0 0 8px" }}>5C Leadership Blueprint</h1>
              <p style={{ fontSize: 15, color: colors.gray500, fontStyle: "italic", margin: 0 }}>From Design to Destiny</p>
            </div>
            <div style={{ padding: 24, background: colors.offWhite, borderRadius: 12, borderLeft: `4px solid ${colors.gold}`, marginBottom: 24 }}>
              <p style={{ fontSize: 15, color: colors.navy, lineHeight: 1.7, margin: 0, fontWeight: 500 }}>There are many leadership courses that teach skills. Few form leaders.</p>
              <p style={{ fontSize: 14, color: colors.gray700, lineHeight: 1.7, margin: "12px 0 0" }}>The 5C Leadership Blueprint is not information transfer. It is leadership formation. It is designed to move you from potential to precision — from fragmented growth to integrated impact.</p>
            </div>
            <p style={{ fontSize: 14, color: colors.gray700, lineHeight: 1.7, marginBottom: 24 }}>This framework is built on five interconnected dimensions. They are not separate compartments. They are a progression. Each builds on the previous. Skip one, and the structure weakens.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 8 }}>
              {modules.map((m, i) => (
                <div key={m.id} style={{ background: colors.white, borderRadius: 10, padding: 16, textAlign: "center", border: `1px solid ${colors.gray200}`, borderTop: `3px solid ${acc[i]}` }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{m.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: colors.navy, marginBottom: 4 }}>{m.title}</div>
                  <div style={{ fontSize: 11, color: colors.gray500, fontStyle: "italic" }}>{m.subtitle}</div>
                </div>
              ))}
            </div>
            <Nav next={{ onClick: () => setS(1) }} />
          </FadeIn>}

          {/* STEP 1: Why This Matters */}
          {s === 1 && <FadeIn>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: colors.navy, marginBottom: 16 }}>Why This Matters</h2>
            <p style={{ fontSize: 14, color: colors.gray700, lineHeight: 1.8 }}>Many leaders plateau not because they lack vision, but because something is misaligned internally.</p>
            <p style={{ fontSize: 14, color: colors.gray700, lineHeight: 1.8 }}>Some know their calling but lack competency. Some are skilled but lack capacity. Some are deeply spiritual but scattered. Some are gifted but insecure. Some are successful but unsustainable.</p>
            <div style={{ padding: 20, background: colors.navy, borderRadius: 10, margin: "24px 0", color: colors.white, fontSize: 15, fontWeight: 500, lineHeight: 1.7 }}>The 5C Blueprint exposes gaps and strengthens foundations. It creates leaders who are internally anchored and externally effective.</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 8 }}>
              {[
                { q: "Who was I designed to become?", c: "Calling", a: colors.skyBlue },
                { q: "Whose am I?", c: "Connection", a: colors.royalBlue },
                { q: "Can I carry what I'm called to build?", c: "Competency", a: colors.orange },
                { q: "Can I sustain what I'm building?", c: "Capacity", a: colors.red },
                { q: "Am I operating in my sweet spot?", c: "Convergence", a: colors.gold },
              ].map((item, i) => (
                <div key={i} style={{ padding: 14, background: colors.offWhite, borderRadius: 8, borderLeft: `3px solid ${item.a}` }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: item.a, marginBottom: 4 }}>{item.c}</div>
                  <div style={{ fontSize: 13, color: colors.navy, fontStyle: "italic" }}>{item.q}</div>
                </div>
              ))}
            </div>
            <Nav back={{ onClick: () => setS(0) }} next={{ onClick: () => setS(2) }} />
          </FadeIn>}

          {/* STEP 2: Learning Objectives */}
          {s === 2 && <FadeIn>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: colors.navy, marginBottom: 16 }}>Learning Objectives</h2>
            <p style={{ fontSize: 14, color: colors.gray700, lineHeight: 1.7, marginBottom: 20 }}>By the end of this course, you will:</p>
            {[
              { n: 1, t: "Clarify Your Calling", d: "Articulate your design in clear language and distinguish between calling and seasonal assignments." },
              { n: 2, t: "Strengthen Your Connection", d: "Identify whether you are leading from approval or striving for approval, and stabilize your identity." },
              { n: 3, t: "Develop Your Competency", d: "Identify skill gaps and create a growth plan aligned with your current assignment." },
              { n: 4, t: "Expand Your Capacity", d: "Recognize where pressure is refining you and develop resilience to sustain influence." },
              { n: 5, t: "Enter Convergence", d: "Narrow your focus, release misaligned responsibilities, and operate in your sweet spot." },
            ].map(o => (
              <div key={o.n} style={{ display: "flex", gap: 14, marginBottom: 14, padding: 14, background: colors.white, borderRadius: 8, border: `1px solid ${colors.gray200}` }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: colors.navy, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: colors.gold, fontSize: 14, fontWeight: 700 }}>{o.n}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: colors.navy }}>{o.t}</div>
                  <div style={{ fontSize: 13, color: colors.gray700, marginTop: 2, lineHeight: 1.6 }}>{o.d}</div>
                </div>
              </div>
            ))}
            <div style={{ padding: 20, background: colors.offWhite, borderRadius: 10, margin: "20px 0 0", borderLeft: `4px solid ${colors.orange}` }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: colors.navy, marginBottom: 8 }}>Expected Outcomes</div>
              <div style={{ fontSize: 13, color: colors.gray700, lineHeight: 1.8 }}>A one-sentence articulation of your calling, a personal diagnostic across all 5Cs, clear next steps for growth, a focused leadership plan for this season, increased clarity, steadiness, and alignment — and a framework you can use to develop others.</div>
            </div>
            <Nav back={{ onClick: () => setS(1) }} next={{ onClick: () => setS(3) }} />
          </FadeIn>}

          {/* STEP 3: How to Use */}
          {s === 3 && <FadeIn>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: colors.navy, marginBottom: 16 }}>How to Use This Course</h2>
            <p style={{ fontSize: 14, color: colors.gray700, lineHeight: 1.7, marginBottom: 20 }}>The 5C Leadership Blueprint is designed for depth, not speed. Each module is a formation experience, not a lecture. How you engage determines what you receive.</p>
            {[
              { s: "Opening Activation", p: "Reflection prompts to prepare your heart and mind" },
              { s: "Core Teaching", p: "Definition, key distinctions, and the macro/micro framework" },
              { s: "Governing Principles", p: "Biblical principles with Pause & Process prompts" },
              { s: "Leadership Exemplar", p: "A biblical leader who embodies the dimension" },
              { s: "Diagnostic", p: "12-question self-assessment with scoring" },
              { s: "Commitment", p: "Where revelation becomes responsibility" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: `1px solid ${colors.gray100}` }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: colors.gold, marginTop: 6, flexShrink: 0 }} />
                <div><span style={{ fontSize: 13, fontWeight: 600, color: colors.navy }}>{item.s}</span><span style={{ fontSize: 13, color: colors.gray500 }}> — {item.p}</span></div>
              </div>
            ))}
            <div style={{ padding: 16, background: colors.navy, borderRadius: 10, color: colors.white, fontSize: 13, lineHeight: 1.7, marginTop: 20 }}>
              <strong style={{ color: colors.gold }}>Best Practice:</strong> Be ruthlessly honest. Write everything down. Don't rush the Pause & Process moments. Revisit your workbook quarterly.
            </div>
            <Nav back={{ onClick: () => setS(2) }} next={{ onClick: () => setS(4) }} />
          </FadeIn>}

          {/* STEP 4: Module Overview */}
          {s === 4 && <FadeIn>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: colors.navy, marginBottom: 16 }}>Module Overview</h2>
            <p style={{ fontSize: 14, color: colors.gray700, lineHeight: 1.7, marginBottom: 20 }}>Here is a high-level map of the five modules and what each one addresses.</p>
            {modules.map((m, i) => (
              <div key={m.id} style={{ display: "grid", gridTemplateColumns: "48px 1fr", gap: 16, padding: 18, marginBottom: 12, background: colors.white, borderRadius: 10, border: `1px solid ${colors.gray200}` }}>
                <div style={{ width: 48, height: 48, borderRadius: 10, background: `${acc[i]}15`, border: `2px solid ${acc[i]}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: acc[i] }}>{m.id}</div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: colors.navy }}>{m.title}</div>
                    <div style={{ fontSize: 11, color: colors.gray500 }}>Exemplar: {m.exemplar}</div>
                  </div>
                  <div style={{ fontSize: 13, color: colors.royalBlue, fontStyle: "italic", margin: "4px 0" }}>{m.question}</div>
                  <div style={{ fontSize: 12, color: colors.gray500 }}>Key Distinction: <span style={{ fontWeight: 600, color: colors.gray700 }}>{dist[i]}</span></div>
                </div>
              </div>
            ))}
            <Nav back={{ onClick: () => setS(3) }} next={{ onClick: () => setS(5), label: "Begin Reflection", gold: true }} />
          </FadeIn>}

          {/* STEP 5: Pre-Course Reflection */}
          {s === 5 && <FadeIn>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.15em", color: colors.gold, fontWeight: 600, marginBottom: 6 }}>PRE-COURSE REFLECTION</div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: colors.navy, margin: "0 0 8px" }}>Before We Begin</h2>
              <p style={{ fontSize: 14, color: colors.gray500, fontStyle: "italic" }}>Take a moment to reflect honestly. This is between you and God. There are no wrong answers — only honest ones.</p>
            </div>
            {preCoursePrompts.map((p, i) => (
              <FadeIn key={p.id} delay={i * 100}>
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: colors.navy, marginBottom: 8, lineHeight: 1.5 }}>{p.text}</label>
                  {p.hint && <div style={{ fontSize: 12, color: colors.gray500, fontStyle: "italic", marginBottom: 8 }}>{p.hint}</div>}
                  <textarea value={r[p.id] || ""} onChange={e => setR(prev => ({ ...prev, [p.id]: e.target.value }))} rows={4}
                    style={{ width: "100%", padding: 14, borderRadius: 8, fontSize: 14, border: `1px solid ${r[p.id] ? colors.gold : colors.gray300}`, background: colors.white, resize: "vertical", lineHeight: 1.6, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
                    onFocus={e => e.target.style.borderColor = colors.skyBlue}
                    onBlur={e => e.target.style.borderColor = r[p.id] ? colors.gold : colors.gray300} />
                </div>
              </FadeIn>
            ))}
            <Nav back={{ onClick: () => setS(4), label: "Back to Overview" }} next={{ onClick: () => setS(6), label: "Save & Continue", disabled: Object.keys(r).length < 5 }} />
          </FadeIn>}

          {/* STEP 6: Commitment */}
          {s === 6 && <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.15em", color: colors.gold, fontWeight: 600, marginBottom: 6 }}>OUR COMMITMENT</div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: colors.navy, margin: "0 0 12px" }}>The Journey Begins</h2>
            </div>
            <div style={{ padding: 28, background: colors.offWhite, borderRadius: 12, border: `1px solid ${colors.gray200}`, marginBottom: 24 }}>
              <p style={{ fontSize: 14, color: colors.gray700, lineHeight: 1.8, margin: "0 0 12px" }}>This course will ask you to be honest. It will ask you to release some things. It may expose gaps. It may confront comfort zones.</p>
              <p style={{ fontSize: 14, color: colors.gray700, lineHeight: 1.8, margin: "0 0 12px" }}>But it will also clarify your lane, strengthen your resolve, and sharpen your assignment.</p>
              <p style={{ fontSize: 14, color: colors.navy, lineHeight: 1.8, margin: 0, fontWeight: 600 }}>What you put in determines what you take out. The workbook is designed for depth. The prompts are designed for encounter. The diagnostics are designed for truth. The commitments are designed for action.</p>
            </div>
            <div style={{ padding: 24, background: colors.white, borderRadius: 12, border: `2px solid ${colors.gold}`, textAlign: "center" }}>
              <p style={{ fontSize: 15, color: colors.navy, fontWeight: 600, lineHeight: 1.7, margin: "0 0 20px" }}>I commit to engaging this course with honesty, openness, and a willingness to be formed.</p>
              <label style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, cursor: "pointer", marginBottom: 16 }} onClick={() => setCommitted(!committed)}>
                <div style={{ width: 22, height: 22, borderRadius: 4, border: `2px solid ${committed ? colors.gold : colors.gray300}`, background: committed ? colors.gold : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", flexShrink: 0 }}>
                  {committed && <span style={{ color: colors.white, fontSize: 14, fontWeight: 700 }}>✓</span>}
                </div>
                <span style={{ fontSize: 14, color: colors.navy }}>I accept this commitment</span>
              </label>
              <button disabled={!committed} onClick={async () => {
                setS(7);
                setAiLoading(true);
                try {
                  const prompt = `You are a Kingdom leadership coach for Awakening Destiny Global's 5C Leadership Blueprint.

A leader has completed their pre-course reflection. Based on their responses, generate a personalized Leadership Formation Snapshot.

REFLECTIONS:
${preCoursePrompts.map(p => `${p.text}\nAnswer: ${r[p.id] || "Not answered"}`).join("\n\n")}

Write a personalized snapshot with these five sections:
1. Leadership Posture — What their answers reveal about where they are entering the journey
2. Primary Tension — The core leadership tension or misalignment their answers point to
3. Formation Focus — Which of the 5 dimensions will likely produce the most transformation for them
4. The Cost They Named — Speak to what they said it would cost if nothing changes
5. Their Trajectory — A forward-looking encouragement based on the honesty they demonstrated

Respond ONLY with a JSON object (no markdown, no backticks) with keys: leadership_posture, primary_tension, formation_focus, cost_of_inaction, trajectory. Each value is 2-3 sentences. Tone: apostolic, direct, warm.`;
                  const res = await fetch("/api/claude", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt }) });
                  const data = await res.json();
                  const text = data.response || data.content?.[0]?.text || "";
                  const clean = text.replace(/```json|```/g, "").trim();
                  setAiSummary(JSON.parse(clean));
                } catch (err) {
                  setAiSummary({
                    leadership_posture: "You are entering this journey from a place of honest self-awareness. Your reflections reveal a leader who recognizes the gap between where you are and where you are designed to operate.",
                    primary_tension: "The greatest tension you identified points toward a misalignment between your internal capacity and your external responsibility.",
                    formation_focus: "Your formation journey will likely produce the deepest transformation in Calling clarity and Capacity expansion.",
                    cost_of_inaction: "You named what it will cost you if nothing changes. That honesty is rare. Hold onto that awareness.",
                    trajectory: "If you engage this course with the honesty you've already demonstrated, alignment across all five dimensions is not aspirational — it is inevitable.",
                  });
                }
                setAiLoading(false);
              }} style={{ padding: "14px 40px", background: committed ? `linear-gradient(135deg, ${colors.navy}, ${colors.royalBlue})` : colors.gray300, color: colors.white, border: "none", borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: committed ? "pointer" : "default", transition: "all 0.3s" }}>
                Accept & Generate My Summary →
              </button>
            </div>
            <p style={{ textAlign: "center", fontSize: 13, color: colors.gray500, fontStyle: "italic", marginTop: 16 }}>Your AI Leadership Snapshot will be generated from your reflections.</p>
            <div style={{ marginTop: 16 }}><BackBtn onClick={() => setS(5)} label="Back to Reflection" /></div>
          </FadeIn>}

          {/* STEP 7: AI Summary */}
          {s === 7 && <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.15em", color: colors.gold, fontWeight: 600, marginBottom: 6 }}>AI LEADERSHIP SNAPSHOT</div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: colors.navy, margin: "0 0 8px" }}>Your Pre-Course Summary</h2>
              <p style={{ fontSize: 14, color: colors.gray500, fontStyle: "italic" }}>Generated from your reflection responses</p>
            </div>

            {aiLoading && (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <div style={{ width: 48, height: 48, border: `4px solid ${colors.gray200}`, borderTop: `4px solid ${colors.gold}`, borderRadius: "50%", margin: "0 auto 20px", animation: "spin 1s linear infinite" }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
                <div style={{ fontSize: 15, fontWeight: 600, color: colors.navy, marginBottom: 8 }}>Generating your leadership snapshot...</div>
                <div style={{ fontSize: 13, color: colors.gray500 }}>Analyzing your reflections across all five dimensions</div>
              </div>
            )}

            {!aiLoading && aiSummary && <>
              <div style={{ background: `linear-gradient(135deg, ${colors.navy}, ${colors.navyLight})`, borderRadius: 12, padding: 24, marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: colors.gold, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>✦</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: colors.white }}>Leadership Formation Snapshot</div>
                    <div style={{ fontSize: 11, color: colors.gray300 }}>5C Leadership Blueprint • Pre-Course</div>
                  </div>
                </div>
                {[
                  { label: "Your Leadership Posture", text: aiSummary.leadership_posture, accent: colors.skyBlue },
                  { label: "Primary Tension Identified", text: aiSummary.primary_tension, accent: colors.orange },
                  { label: "Formation Focus Areas", text: aiSummary.formation_focus, accent: colors.gold },
                  { label: "The Cost You Named", text: aiSummary.cost_of_inaction, accent: colors.red },
                  { label: "Your Trajectory", text: aiSummary.trajectory, accent: colors.skyBlue },
                ].map((item, i) => (
                  <div key={i} style={{ marginBottom: i < 4 ? 16 : 0, padding: 16, background: "rgba(255,255,255,0.06)", borderRadius: 8, borderLeft: `3px solid ${item.accent}` }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: item.accent, letterSpacing: "0.05em", marginBottom: 6 }}>{item.label.toUpperCase()}</div>
                    <div style={{ fontSize: 13, color: colors.gray200, lineHeight: 1.7 }}>{item.text}</div>
                  </div>
                ))}
              </div>

              <div style={{ background: colors.white, borderRadius: 12, border: `1px solid ${colors.gray200}`, padding: 20, marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: colors.navy, marginBottom: 12 }}>Your Reflections Summary</div>
                {preCoursePrompts.map(p => r[p.id] ? (
                  <div key={p.id} style={{ marginBottom: 12, padding: 12, background: colors.offWhite, borderRadius: 8 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: colors.royalBlue, marginBottom: 4 }}>{p.text}</div>
                    <div style={{ fontSize: 13, color: colors.gray700, lineHeight: 1.6 }}>{r[p.id]}</div>
                  </div>
                ) : null)}
              </div>

              <div style={{ textAlign: "center" }}>
                <button onClick={() => window.location.href = "/modules/calling"} style={{ padding: "14px 48px", background: `linear-gradient(135deg, ${colors.navy}, ${colors.royalBlue})`, color: colors.white, border: "none", borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 12px rgba(1,114,188,0.3)" }}>
                  Begin Module 1: Calling →
                </button>
                <p style={{ fontSize: 13, color: colors.gray500, fontStyle: "italic", marginTop: 12 }}>"Leadership that begins with design builds legacy."</p>
              </div>
              <div style={{ marginTop: 16 }}><BackBtn onClick={() => setS(6)} label="Back to Commitment" /></div>
            </>}
          </FadeIn>}

        </div>
      </div>
    </>
  );
}
