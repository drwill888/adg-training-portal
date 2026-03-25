// pages/dashboard.js
// Renamed from pages/index.js — dashboard now lives at /dashboard

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { usePaymentStatus } from "../lib/usePaymentStatus";
import { supabase } from "../lib/supabase";

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false
  );
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [breakpoint]);
  return isMobile;
}

const colors = {
  navy: "#021A35", navyLight: "#0a2a4d", navyMid: "#132f50",
  skyBlue: "#00AEEF", royalBlue: "#0172BC", orange: "#F47722",
  gold: "#C8A951", white: "#FFFFFF", offWhite: "#F8F9FC",
  gray200: "#e2e6ed", gray300: "#c8cdd6", gray500: "#6b7280",
  cream: "#FDF8F0",
};

const modules = [
  { id: 0, title: "Introduction", subtitle: "Course Foundation", icon: "◈", href: "/modules/introduction", free: true },
  { id: 1, title: "Calling", subtitle: "Potential (Purpose)", question: "Who was I designed to become?", icon: "①", href: "/modules/calling" },
  { id: 2, title: "Connection", subtitle: "Identity (Relationships)", question: "Whose am I?", icon: "②", href: "/modules/connection" },
  { id: 3, title: "Competency", subtitle: "Excellence (Credibility)", question: "Can I carry what I'm called to build?", icon: "③", href: "/modules/competency" },
  { id: 4, title: "Capacity", subtitle: "Character (Sustainability)", question: "Can I sustain what I'm building?", icon: "④", href: "/modules/capacity" },
  { id: 5, title: "Convergence", subtitle: "Sweet Spot (Impact)", question: "Am I operating in my sweet spot?", icon: "⑤", href: "/modules/convergence" },
  { id: 6, title: "Commissioning", subtitle: "Sent (Deployment)", icon: "◉", href: "/modules/commissioning" },
];

const accents = [colors.gold, colors.skyBlue, colors.royalBlue, colors.orange, colors.skyBlue, "#EE3124", colors.gold];

const TOTAL_STEPS = { 0: 9, 1: 11, 2: 11, 3: 11, 4: 11, 5: 11, 6: 8 };

function Sidebar({ currentPage, setCurrentPage, open, onClose, paid }) {
  const isMobile = useIsMobile();
  const navItems = [
    { key: "dashboard", label: "Dashboard", icon: "⬡" },
    ...modules.map(m => ({
      key: "mod-" + m.id,
      label: m.id === 0 ? "Introduction" : m.id === 6 ? "Commissioning" : m.id + ". " + m.title,
      icon: m.icon,
      href: m.href,
      locked: !m.free && !paid,
    })),
  ];

  return (
    <>
      {isMobile && open && (
        <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 49 }} />
      )}
      <div style={{ width: 260, minHeight: "100vh", background: colors.navy, flexShrink: 0, display: "flex", flexDirection: "column", ...(isMobile ? { position: "fixed", top: 0, left: 0, zIndex: 50, height: "100vh", overflowY: "auto", transform: open ? "translateX(0)" : "translateX(-100%)", transition: "transform 0.3s ease" } : {}) }}>
        <div style={{ padding: "24px 16px 16px", borderBottom: "1px solid " + colors.navyMid, textAlign: "center" }}>
          <div style={{ fontSize: 14, color: colors.white, fontWeight: 700, marginBottom: 4 }}>5C Leadership Blueprint</div>
          <div style={{ fontSize: 11, color: colors.gold, fontStyle: "italic" }}>Awakening Destiny Global</div>
        </div>
        <div style={{ padding: "12px 0", flex: 1, overflowY: "auto" }}>
          {navItems.map(function(item) {
            var act = currentPage === item.key;
            return (
              <div key={item.key}
                onClick={function() {
                  if (item.locked) return;
                  if (item.href) { window.location.href = item.href; }
                  else { setCurrentPage(item.key); if (isMobile) onClose(); }
                }}
                style={{ padding: "10px 20px", cursor: item.locked ? "default" : "pointer", display: "flex", alignItems: "center", gap: 10, background: act ? colors.navyLight : "transparent", borderLeft: act ? "3px solid " + colors.gold : "3px solid transparent", opacity: item.locked ? 0.4 : 1, transition: "all 0.2s" }}
                onMouseEnter={function(e) { if (!act && !item.locked) e.currentTarget.style.background = colors.navyLight; }}
                onMouseLeave={function(e) { if (!act && !item.locked) e.currentTarget.style.background = "transparent"; }}>
                <span style={{ fontSize: 14, width: 22, textAlign: "center", color: act ? colors.skyBlue : colors.gray300 }}>{item.locked ? "🔒" : item.icon}</span>
                <span style={{ fontSize: 13, fontWeight: act ? 600 : 400, color: act ? colors.white : colors.gray300 }}>{item.label}</span>
              </div>
            );
          })}
        </div>
        <div style={{ padding: "16px 20px", borderTop: "1px solid " + colors.navyMid, textAlign: "center" }}>
          <div style={{ fontSize: 11, color: colors.gray500 }}>From Design to Destiny</div>
        </div>
      </div>
    </>
  );
}

function ProgressBar({ percent, accent, height }) {
  return (
    <div style={{ width: "100%", height: height || 6, background: colors.gray200, borderRadius: 4, overflow: "hidden" }}>
      <div style={{ width: percent + "%", height: "100%", background: accent || colors.gold, borderRadius: 4, transition: "width 0.4s ease" }} />
    </div>
  );
}

// ─── CHECKOUT — success redirects to /dashboard ───────────────────
async function handleCheckout() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const email = session?.user?.email;
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
  } catch (err) {
    console.error('Checkout error:', err);
    alert('Something went wrong. Please try again.');
  }
}

export default function Dashboard() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { paid, loading } = usePaymentStatus();

  // ─── AUTH GUARD — redirect to login if not authenticated ─────────
  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/login');
        }
      } catch (e) {
        router.push('/login');
      }
    }
    checkAuth();
  }, []);

  // ─── LEARNER FIRST NAME ──────────────────────────────────────────
  const [firstName, setFirstName] = useState("");
  useEffect(() => {
    async function loadName() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const meta = session.user.user_metadata;
          if (meta?.first_name) {
            setFirstName(meta.first_name);
          } else if (meta?.full_name) {
            setFirstName(meta.full_name.split(" ")[0]);
          } else {
            const { data } = await supabase
              .from("profiles")
              .select("first_name")
              .eq("id", session.user.id)
              .single();
            if (data?.first_name) setFirstName(data.first_name);
          }
        }
      } catch (e) { /* silent fallback */ }
    }
    loadName();
  }, []);

  // ─── MODULE PROGRESS ─────────────────────────────────────────────
  const [progress, setProgress] = useState({});
  useEffect(() => {
    async function loadProgress() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;
        const { data } = await supabase
          .from("user_progress")
          .select("module_id, current_step")
          .eq("user_id", session.user.id);
        if (data) {
          const map = {};
          data.forEach(function(row) { map[row.module_id] = row.current_step; });
          setProgress(map);
        }
      } catch (e) { /* silent fallback */ }
    }
    loadProgress();
  }, []);

  // ─── OVERALL PROGRESS ────────────────────────────────────────────
  var totalSteps = 0;
  var completedSteps = 0;
  modules.forEach(function(m) {
    var total = TOTAL_STEPS[m.id] || 10;
    totalSteps += total;
    completedSteps += Math.min(progress[m.id] || 0, total);
  });
  var overallPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  var greeting = firstName ? ("Welcome back, " + firstName) : "Welcome";

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Raleway','Segoe UI',sans-serif", background: colors.offWhite }}>
      <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700&family=Cormorant+Garamond:wght@400;600;700&display=swap" rel="stylesheet" />

      <Sidebar
        currentPage={page}
        setCurrentPage={setPage}
        open={sidebarOpen}
        onClose={function() { setSidebarOpen(false); }}
        paid={paid}
      />

      <div style={{ flex: 1, minHeight: "100vh", overflowY: "auto" }}>

        {/* ─── TOPBAR ─── */}
        <div style={{ padding: isMobile ? "10px 16px" : "12px 40px", borderBottom: "1px solid " + colors.gray200, background: colors.white, display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 0, zIndex: 30 }}>
          {isMobile && (
            <button onClick={function() { setSidebarOpen(function(s) { return !s; }); }} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", flexDirection: "column", gap: 5 }}>
              <div style={{ width: 22, height: 2, background: colors.navy, borderRadius: 2 }} />
              <div style={{ width: 22, height: 2, background: colors.navy, borderRadius: 2 }} />
              <div style={{ width: 22, height: 2, background: colors.navy, borderRadius: 2 }} />
            </button>
          )}
          <div style={{ fontSize: 13, color: colors.gray500 }}>Dashboard</div>
        </div>

        <div style={{ padding: isMobile ? "20px 16px" : "32px 40px", maxWidth: 960 }}>

          {/* ─── GREETING + PROGRESS ─── */}
          <h1 style={{ fontSize: 26, fontWeight: 700, color: colors.navy, margin: "0 0 4px" }}>{greeting}</h1>
          <p style={{ fontSize: 14, color: colors.gray500, margin: "0 0 20px", fontStyle: "italic" }}>Your leadership formation journey — from design to destiny.</p>

          <div style={{ marginBottom: 28, padding: "16px 20px", background: colors.white, borderRadius: 10, border: "1px solid " + colors.gray200 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: colors.navy }}>Overall Progress</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: colors.gold }}>{overallPercent}%</span>
            </div>
            <ProgressBar percent={overallPercent} accent={colors.gold} height={8} />
          </div>

          {/* ─── MARKETING / UNLOCK CTA ─── */}
          {!paid && !loading && (
            <div style={{ padding: isMobile ? 20 : 28, background: "linear-gradient(135deg, #021A35 0%, #0a2a4d 100%)", borderRadius: 14, marginBottom: 28, border: "1px solid rgba(200,169,81,0.2)" }}>
              <div style={{ fontSize: 11, color: colors.gold, letterSpacing: "0.12em", fontWeight: 700, marginBottom: 10 }}>THE 5C LEADERSHIP BLUEPRINT</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: colors.white, lineHeight: 1.35, marginBottom: 12 }}>
                Most leaders are overcommitted and underaligned. This training changes that.
              </div>
              <p style={{ fontSize: 13, color: colors.gray300, lineHeight: 1.7, margin: "0 0 10px" }}>
                The 5C Blueprint is a formation experience — not a course. Five integrated dimensions that move you from scattered potential to focused, sustainable impact. Each module builds on the last. By the end, you will have a personalized leadership blueprint anchored in your calling, sharpened by honest self-assessment, and ready to deploy.
              </p>
              <p style={{ fontSize: 13, color: colors.gray300, lineHeight: 1.7, margin: "0 0 20px" }}>
                Personalized summaries. Pre-and-post diagnostics that show your growth. A downloadable blueprint document you can revisit for years. Built for Kingdom entrepreneurs, pastors, prophetic voices, and emerging leaders who are done with surface-level development.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
                {["Calling — Who you are", "Connection — Whose you are", "Competency — What you carry", "Capacity — What you sustain", "Convergence — Where it all aligns"].map(function(item, i) {
                  return (
                    <div key={i} style={{ fontSize: 12, padding: "5px 12px", background: "rgba(200,169,81,0.12)", border: "1px solid rgba(200,169,81,0.25)", borderRadius: 6, color: colors.gold, fontWeight: 500 }}>
                      {item}
                    </div>
                  );
                })}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                <button
                  onClick={handleCheckout}
                  style={{ padding: "12px 36px", background: colors.gold, color: colors.navy, border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
                  Unlock Full Access
                </button>
                <span style={{ fontSize: 12, color: colors.gray500 }}>Introduction module is free — start there.</span>
              </div>
            </div>
          )}

          {/* ─── MODULE GRID ─── */}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: 16, marginBottom: 24 }}>
            {modules.map(function(m, i) {
              var locked = !m.free && !paid;
              var stepsDone = progress[m.id] || 0;
              var stepsTotal = TOTAL_STEPS[m.id] || 10;
              var modPercent = Math.min(Math.round((stepsDone / stepsTotal) * 100), 100);
              return (
                <div key={m.id}
                  onClick={function() { if (!locked) window.location.href = m.href; }}
                  style={{ background: colors.white, borderRadius: 12, padding: 20, border: "1px solid " + colors.gray200, borderTop: "3px solid " + (locked ? colors.gray300 : accents[i]), cursor: locked ? "default" : "pointer", opacity: locked ? 0.6 : 1, position: "relative", transition: "box-shadow 0.2s" }}
                  onMouseEnter={function(e) { if (!locked) e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"; }}
                  onMouseLeave={function(e) { if (!locked) e.currentTarget.style.boxShadow = "none"; }}>
                  {locked && (
                    <div style={{ position: "absolute", top: 12, right: 12, fontSize: 14 }}>🔒</div>
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: (locked ? colors.gray300 : accents[i]) + "22", border: "2px solid " + (locked ? colors.gray300 : accents[i]), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: locked ? colors.gray300 : accents[i], flexShrink: 0 }}>{m.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: colors.navy }}>{m.title}</div>
                      <div style={{ fontSize: 12, color: colors.gray500, fontStyle: "italic" }}>{m.subtitle}</div>
                    </div>
                  </div>
                  {!locked && (
                    <div style={{ marginBottom: 8 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 11, color: colors.gray500 }}>{modPercent === 100 ? "Complete" : modPercent > 0 ? "In progress" : "Not started"}</span>
                        <span style={{ fontSize: 11, fontWeight: 600, color: accents[i] }}>{modPercent}%</span>
                      </div>
                      <ProgressBar percent={modPercent} accent={accents[i]} height={4} />
                    </div>
                  )}
                  {m.question && (
                    <div style={{ fontSize: 13, color: locked ? colors.gray500 : "#0172BC", fontStyle: "italic", borderTop: "1px solid " + colors.gray200, paddingTop: 10 }}>{m.question}</div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ─── START HERE CTA ─── */}
          <div style={{ padding: 24, background: colors.navy, borderRadius: 12, textAlign: "center" }}>
            <div style={{ fontSize: 11, color: colors.gold, letterSpacing: "0.1em", fontWeight: 600, marginBottom: 6 }}>START HERE</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: colors.white, marginBottom: 4 }}>Begin with the Introduction</div>
            <div style={{ fontSize: 13, color: colors.gray300, marginBottom: 16 }}>Understand the framework before entering the modules.</div>
            <button
              onClick={function() { window.location.href = "/modules/introduction"; }}
              style={{ padding: "10px 32px", background: colors.gold, color: colors.navy, border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
              Begin
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}