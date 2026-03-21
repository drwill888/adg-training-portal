import { useState, useEffect, useCallback } from "react";

// ─── MOBILE HOOK ──────────────────────────────────────────────
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
  yellow: "#FDD20D", red: "#EE3124", gold: "#C8A951", goldLight: "#d4b86a",
  white: "#FFFFFF", offWhite: "#F8F9FC",
  gray100: "#f1f3f7", gray200: "#e2e6ed", gray300: "#c8cdd6",
  gray500: "#6b7280", gray700: "#374151",
};

const LOGO_SRC = "data:image/png;base64,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": "LOGO_PLACEHOLDER"
};

const modules = [
  { id: 0, title: "Introduction", subtitle: "Course Foundation", icon: "◈", type: "intro" },
  { id: 1, title: "Calling", subtitle: "Potential (Purpose)", question: "Who was I designed to become?", icon: "①", exemplar: "Jeremiah" },
  { id: 2, title: "Connection", subtitle: "Identity (Relationships)", question: "Whose am I?", icon: "②", exemplar: "Jesus" },
  { id: 3, title: "Competency", subtitle: "Excellence (Credibility)", question: "Can I carry what I'm called to build?", icon: "③", exemplar: "Joseph" },
  { id: 4, title: "Capacity", subtitle: "Character (Sustainability)", question: "Can I sustain what I'm building?", icon: "④", exemplar: "David" },
  { id: 5, title: "Convergence", subtitle: "Sweet Spot (Impact)", question: "Am I operating in my sweet spot?", icon: "⑤", exemplar: "David" },
  { id: 6, title: "Commissioning", subtitle: "Conclusion & Certificate", icon: "◉", type: "conclusion" },
];

function ProgressRing({ percent, size = 120, sw = 8 }) {
  const r = (size - sw) / 2, c = 2 * Math.PI * r;
  return <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
    <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={colors.gray200} strokeWidth={sw} />
    <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={colors.gold} strokeWidth={sw} strokeDasharray={c} strokeDashoffset={c-(percent/100)*c} strokeLinecap="round" style={{ transition: "stroke-dashoffset 1.5s ease" }} />
  </svg>;
}

function Sidebar({ currentPage, setCurrentPage, open, onClose }) {
  const isMobile = useIsMobile();
  const navItems = [
    { key: "dashboard", label: "Dashboard", icon: "⬡" },
    { key: "intro", label: "Introduction", icon: "◈" },
    ...modules.filter(m => m.id >= 1 && m.id <= 5).map(m => ({ key: `module-${m.id}`, label: `${m.id}. ${m.title}`, icon: m.icon })),
    { key: "conclusion", label: "Commissioning", icon: "◉" },
  ];

  const handleClick = (key) => {
    if (key === "dashboard") { setCurrentPage("dashboard"); if (isMobile) onClose(); return; }
    if (key === "intro") { window.location.href = "/modules/introduction"; return; }
    if (key === "conclusion") { window.location.href = "/modules/commissioning"; return; }
    if (key.startsWith("module-")) {
      const id = parseInt(key.split("-")[1]);
      const mod = modules.find(m => m.id === id);
      if (mod) window.location.href = `/modules/${mod.title.toLowerCase()}`;
    }
  };

  return (
    <>
      {isMobile && open && <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 49 }} />}
      <div style={{ width: 260, minHeight: "100vh", background: colors.navy, borderRight: `1px solid ${colors.navyMid}`, flexShrink: 0, display: "flex", flexDirection: "column", ...(isMobile ? { position: "fixed", top: 0, left: 0, zIndex: 50, height: "100vh", overflowY: "auto", transform: open ? "translateX(0)" : "translateX(-100%)", transition: "transform 0.3s ease" } : {}) }}>
        <div style={{ padding: "20px 16px 16px", borderBottom: `1px solid ${colors.navyMid}` }}>
          <div style={{ fontSize: 13, color: colors.white, fontWeight: 700, textAlign: "center", marginBottom: 4 }}>5C Leadership Blueprint</div>
          <div style={{ fontSize: 11, color: colors.gray300, textAlign: "center", fontStyle: "italic" }}>Awakening Destiny Global</div>
        </div>
        <div style={{ padding: "12px 0", flex: 1, overflowY: "auto" }}>
          {navItems.map(item => {
            const act = currentPage === item.key;
            return (
              <div key={item.key} onClick={() => handleClick(item.key)}
                style={{ padding: "10px 20px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, background: act ? colors.navyLight : "transparent", borderLeft: act ? `3px solid ${colors.gold}` : "3px solid transparent", transition: "all 0.2s ease" }}
                onMouseEnter={e => { if (!act) e.currentTarget.style.background = colors.navyLight; }}
                onMouseLeave={e => { if (!act) e.currentTarget.style.background = "transparent"; }}>
                <span style={{ fontSize: 14, width: 22, textAlign: "center", color: act ? colors.skyBlue : colors.gray300 }}>{item.icon}</span>
                <span style={{ fontSize: 13, fontWeight: act ? 600 : 400, color: act ? colors.white : colors.gray300 }}>{item.label}</span>
              </div>
            );
          })}
        </div>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${colors.navyMid}`, textAlign: "center" }}>
          <div style={{ fontSize: 11, color: colors.gray500 }}>From Design to Destiny</div>
        </div>
      </div>
    </>
  );
}

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Raleway','Segoe UI',sans-serif", background: colors.offWhite, color: colors.gray700 }}>
      <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <Sidebar currentPage={page} setCurrentPage={setPage} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div style={{ flex: 1, minHeight: "100vh", overflowY: "auto" }}>
        <div style={{ padding: isMobile ? "10px 16px" : "12px 40px", borderBottom: `1px solid ${colors.gray200}`, background: colors.white, display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 30 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {isMobile && (
              <button onClick={() => setSidebarOpen(s => !s)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", flexDirection: "column", gap: 5 }}>
                <div style={{ width: 22, height: 2, background: colors.navy, borderRadius: 2 }} />
                <div style={{ width: 22, height: 2, background: colors.navy, borderRadius: 2 }} />
                <div style={{ width: 22, height: 2, background: colors.navy, borderRadius: 2 }} />
              </button>
            )}
            <div style={{ fontSize: isMobile ? 12 : 13, color: colors.gray500 }}>5C Leadership Blueprint</div>
          </div>
        </div>
        <div style={{ padding: isMobile ? "20px 16px" : "32px 40px", maxWidth: 960 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: colors.navy, margin: "0 0 6px" }}>Welcome to the 5C Leadership Blueprint</h1>
          <p style={{ fontSize: 14, color: colors.gray500, margin: "0 0 32px" }}>Select a module from the sidebar to begin your leadership formation journey.</p>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 16 }}>
            {modules.filter(m => m.id >= 0 && m.id <= 6).map((m, i) => {
              const accs = [colors.gold, colors.skyBlue, colors.royalBlue, colors.orange, colors.skyBlue, colors.red, colors.gold];
              const hrefs = ["/modules/introduction", "/modules/calling", "/modules/connection", "/modules/competency", "/modules/capacity", "/modules/convergence", "/modules/commissioning"];
              return (
                <div key={m.id} onClick={() => window.location.href = hrefs[i]}
                  style={{ background: colors.white, borderRadius: 12, padding: 20, border: `1px solid ${colors.gray200}`, borderTop: `3px solid ${accs[i]}`, cursor: "pointer", transition: "all 0.2s ease" }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)"}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{m.icon}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: colors.navy, marginBottom: 4 }}>{m.title}</div>
                  <div style={{ fontSize: 12, color: colors.gray500, fontStyle: "italic", marginBottom: 8 }}>{m.subtitle}</div>
                  {m.question && <div style={{ fontSize: 12, color: colors.royalBlue }}>{m.question}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
