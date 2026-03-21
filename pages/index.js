import { useState, useEffect } from "react";
import { usePaymentStatus } from "../lib/usePaymentStatus";

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

function Sidebar({ currentPage, setCurrentPage, open, onClose, paid }) {
  const isMobile = useIsMobile();
  const navItems = [
    { key: "dashboard", label: "Dashboard", icon: "⬡" },
    ...modules.map(m => ({ key: "mod-" + m.id, label: m.id === 0 ? "Introduction" : m.id === 6 ? "Commissioning" : m.id + ". " + m.title, icon: m.icon, href: m.href, locked: !m.free && !paid })),
  ];

  return (
    <>
      {isMobile && open && <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 49 }} />}
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
                  if (item.href) { window.location.href = item.href; } else { setCurrentPage(item.key); if (isMobile) onClose(); }
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

async function handleCheckout() {
  try {
    const res = await fetch('/api/checkout', { method: 'POST' });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
  } catch (err) {
    console.error('Checkout error:', err);
    alert('Something went wrong. Please try again.');
  }
}

export default function App() {
  var isMobile = useIsMobile();
  var pageState = useState("dashboard");
  var page = pageState[0];
  var setPage = pageState[1];
  var sidebarState = useState(false);
  var sidebarOpen = sidebarState[0];
  var setSidebarOpen = sidebarState[1];
  var { paid, loading } = usePaymentStatus();

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Raleway','Segoe UI',sans-serif", background: colors.offWhite }}>
      <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <Sidebar currentPage={page} setCurrentPage={setPage} open={sidebarOpen} onClose={function() { setSidebarOpen(false); }} paid={paid} />
      <div style={{ flex: 1, minHeight: "100vh", overflowY: "auto" }}>
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
          <h1 style={{ fontSize: 26, fontWeight: 700, color: colors.navy, margin: "0 0 6px" }}>5C Leadership Blueprint</h1>
          <p style={{ fontSize: 14, color: colors.gray500, margin: "0 0 32px", fontStyle: "italic" }}>Select a module below to begin your leadership formation journey.</p>

          {!paid && !loading && (
            <div style={{ padding: 24, background: "linear-gradient(135deg, #021A35, #0a2a4d)", borderRadius: 12, marginBottom: 24, display: "flex", alignItems: isMobile ? "flex-start" : "center", justifyContent: "space-between", flexDirection: isMobile ? "column" : "row", gap: 16 }}>
              <div>
                <div style={{ fontSize: 11, color: colors.gold, letterSpacing: "0.1em", fontWeight: 600, marginBottom: 6 }}>FULL ACCESS</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: colors.white, marginBottom: 4 }}>Unlock the Complete 5C Blueprint</div>
                <div style={{ fontSize: 13, color: colors.gray300 }}>Get full access to all five leadership modules plus Commissioning.</div>
              </div>
              <button onClick={handleCheckout}
                style={{ padding: "12px 32px", background: colors.gold, color: colors.navy, border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>
                Unlock — $3.99
              </button>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: 16, marginBottom: 24 }}>
            {modules.map(function(m, i) {
              var locked = !m.free && !paid;
              return (
                <div key={m.id}
                  onClick={function() { if (!locked) window.location.href = m.href; }}
                  style={{ background: colors.white, borderRadius: 12, padding: 24, border: "1px solid " + colors.gray200, borderTop: "3px solid " + (locked ? colors.gray300 : accents[i]), cursor: locked ? "default" : "pointer", opacity: locked ? 0.6 : 1, position: "relative" }}
                  onMouseEnter={function(e) { if (!locked) e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"; }}
                  onMouseLeave={function(e) { if (!locked) e.currentTarget.style.boxShadow = "none"; }}>
                  {locked && (
                    <div style={{ position: "absolute", top: 12, right: 12, fontSize: 14 }}>🔒</div>
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: m.question ? 10 : 0 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: (locked ? colors.gray300 : accents[i]) + "22", border: "2px solid " + (locked ? colors.gray300 : accents[i]), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: locked ? colors.gray300 : accents[i], flexShrink: 0 }}>{m.icon}</div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: colors.navy }}>{m.title}</div>
                      <div style={{ fontSize: 12, color: colors.gray500, fontStyle: "italic" }}>{m.subtitle}</div>
                    </div>
                  </div>
                  {m.question && <div style={{ fontSize: 13, color: locked ? colors.gray500 : "#0172BC", fontStyle: "italic", borderTop: "1px solid " + colors.gray200, paddingTop: 10 }}>{m.question}</div>}
                </div>
              );
            })}
          </div>

          <div style={{ padding: 24, background: colors.navy, borderRadius: 12, textAlign: "center" }}>
            <div style={{ fontSize: 11, color: colors.gold, letterSpacing: "0.1em", fontWeight: 600, marginBottom: 6 }}>START HERE</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: colors.white, marginBottom: 4 }}>Begin with the Introduction</div>
            <div style={{ fontSize: 13, color: colors.gray300, marginBottom: 16 }}>Understand the framework before entering the modules.</div>
            <button onClick={function() { window.location.href = "/modules/introduction"; }}
              style={{ padding: "10px 32px", background: colors.gold, color: colors.navy, border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
              Begin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}