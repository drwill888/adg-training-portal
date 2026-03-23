// pages/welcome.js
// Landing page for the 5C Leadership Blueprint
import Head from "next/head";
import { useState } from "react";

var NAVY = "#021A35";
var GOLD = "#C8A951";
var GOLD_BRIGHT = "#FDD20D";
var CREAM = "#FDF8F0";

var dimensions = [
  { num: 1, title: "Calling", subtitle: "Potential (Purpose)", question: "Who was I designed to become?", color: "#C8A951" },
  { num: 2, title: "Connection", subtitle: "Identity (Relationships)", question: "Whose am I?", color: "#00AEEF" },
  { num: 3, title: "Competency", subtitle: "Excellence (Credibility)", question: "Can I carry what I'm called to build?", color: "#0172BC" },
  { num: 4, title: "Capacity", subtitle: "Character (Sustainability)", question: "Can I sustain what I'm building?", color: "#F47722" },
  { num: 5, title: "Convergence", subtitle: "Sweet Spot (Impact)", question: "Am I operating in my sweet spot?", color: "#EE3124" },
];

function handleCheckout() {
  fetch("/api/checkout", { method: "POST" })
    .then(function(r) { return r.json(); })
    .then(function(data) { if (data.url) window.location.href = data.url; })
    .catch(function() { alert("Something went wrong. Please try again."); });
}

export default function Welcome() {
  return (
    <>
      <Head>
        <title>5C Leadership Blueprint | Awakening Destiny Global</title>
        <meta name="description" content="A formation-based leadership development experience. Five dimensions. One integrated framework. From design to destiny." />
      </Head>
      <div style={{ fontFamily: "'Outfit', sans-serif", background: CREAM, minHeight: "100vh" }}>
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

        {/* ── Hero ── */}
        <div style={{ background: "linear-gradient(165deg, " + NAVY + " 0%, #0a2a4d 50%, #132f50 100%)", padding: "80px 24px 60px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(circle at 30% 20%, rgba(200,169,81,0.08) 0%, transparent 50%)", pointerEvents: "none" }} />
          <div style={{ maxWidth: 720, margin: "0 auto", position: "relative" }}>
            <p style={{ fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, color: GOLD, marginBottom: 16 }}>Awakening Destiny Global</p>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.2rem, 5vw, 3.4rem)", fontWeight: 700, color: "#fff", lineHeight: 1.15, marginBottom: 20 }}>
              The 5C Leadership<br />Blueprint
            </h1>
            <p style={{ fontSize: 17, color: "#c8cdd6", lineHeight: 1.7, maxWidth: 520, margin: "0 auto 32px", fontWeight: 300 }}>
              A formation-based leadership development experience. Five dimensions. One integrated framework. From design to destiny.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={function() { window.location.href = "/modules/introduction"; }}
                style={{ padding: "14px 36px", background: GOLD, color: NAVY, border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}>
                Start Free Introduction
              </button>
              <button onClick={handleCheckout}
                style={{ padding: "14px 36px", background: "transparent", color: GOLD, border: "2px solid " + GOLD, borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
                Unlock Full Program — $3.99
              </button>
            </div>
          </div>
        </div>

        {/* ── What This Is ── */}
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "64px 24px 48px" }}>
          <p style={{ fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, color: GOLD, marginBottom: 8 }}>The Framework</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.8rem", fontWeight: 700, color: NAVY, marginBottom: 16 }}>This Is Not a Course. It Is Formation.</h2>
          <p style={{ fontSize: 15, color: "#555", lineHeight: 1.8, marginBottom: 24 }}>
            Most leadership programs add information to an unchanged life. The 5C Blueprint renovates the interior world. Five interconnected dimensions — each building on the one before — moving you from fragmented growth to integrated impact. The depth of your transformation depends entirely on the honesty you bring.
          </p>
          <div style={{ background: NAVY, borderRadius: 12, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 28 }}>📖</span>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: GOLD_BRIGHT }}>Includes AI-Powered Personal Blueprint</p>
              <p style={{ fontSize: 12, color: "#c8cdd6" }}>Each module generates a personalized leadership analysis based on your responses.</p>
            </div>
          </div>
        </div>

        {/* ── The Five Dimensions ── */}
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px 64px" }}>
          <p style={{ fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, color: GOLD, marginBottom: 8 }}>Five Dimensions</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.8rem", fontWeight: 700, color: NAVY, marginBottom: 24 }}>The Architecture of a Formed Leader</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {dimensions.map(function(d) {
              return (
                <div key={d.num} style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", borderLeft: "4px solid " + d.color, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: d.color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: d.color }}>{d.num}</div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: NAVY }}>{d.title}</div>
                      <div style={{ fontSize: 12, color: "#888", fontStyle: "italic" }}>{d.subtitle}</div>
                    </div>
                  </div>
                  <p style={{ fontSize: 14, color: "#0172BC", fontStyle: "italic" }}>{d.question}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── What You Get ── */}
        <div style={{ background: "#fff", padding: "64px 24px" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <p style={{ fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, color: GOLD, marginBottom: 8 }}>What Is Included</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.8rem", fontWeight: 700, color: NAVY, marginBottom: 24 }}>The Full Formation Experience</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
              {[
                { icon: "◈", title: "Free Introduction", desc: "Assess your readiness and establish your formation posture before entering the modules." },
                { icon: "✦", title: "5 Leadership Modules", desc: "Calling, Connection, Competency, Capacity, and Convergence — each with teaching, diagnostics, and commitments." },
                { icon: "🎯", title: "AI-Powered Blueprints", desc: "Personalized leadership analysis generated from your responses at the end of each module." },
                { icon: "📄", title: "Downloadable Reports", desc: "Export your blueprint as a document to revisit, share with mentors, and track growth." },
                { icon: "📖", title: "Scripture Study Banks", desc: "Curated scripture collections for deeper meditation on each leadership dimension." },
                { icon: "↺", title: "Save & Resume", desc: "Your progress is saved automatically. Leave and return anytime without losing your work." },
              ].map(function(item, i) {
                return (
                  <div key={i} style={{ padding: "20px", borderRadius: 12, border: "1px solid #e5e7eb" }}>
                    <div style={{ fontSize: 24, marginBottom: 8 }}>{item.icon}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: NAVY, marginBottom: 4 }}>{item.title}</div>
                    <div style={{ fontSize: 13, color: "#666", lineHeight: 1.6 }}>{item.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── CTA ── */}
        <div style={{ padding: "64px 24px", textAlign: "center" }}>
          <div style={{ maxWidth: 520, margin: "0 auto" }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.6rem", fontWeight: 700, color: NAVY, marginBottom: 8 }}>Ready to Begin?</p>
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.7, marginBottom: 24 }}>
              Start with the free Introduction to assess your readiness. When you are ready for the full formation experience, unlock all five modules for $3.99.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={function() { window.location.href = "/modules/introduction"; }}
                style={{ padding: "14px 36px", background: NAVY, color: GOLD_BRIGHT, border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
                Start Free Introduction
              </button>
              <button onClick={handleCheckout}
                style={{ padding: "14px 36px", background: GOLD, color: NAVY, border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
                Unlock Full Program — $3.99
              </button>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div style={{ background: NAVY, padding: "32px 24px", textAlign: "center" }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: GOLD, marginBottom: 4 }}>Awakening Destiny Global</p>
          <p style={{ fontSize: 11, color: "#6b7280", fontStyle: "italic", marginBottom: 8 }}>From Design to Destiny</p>
          <p style={{ fontSize: 11, color: "#4b5563" }}>© 2026 Awakening Destiny Global · awakeningdestiny.global</p>
        </div>
      </div>
    </>
  );
}
