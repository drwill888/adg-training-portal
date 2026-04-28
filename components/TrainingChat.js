// components/TrainingChat.js
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { colors as tok, fonts as tokFonts } from "../styles/tokens";

const BRAND = {
  navy: tok.navy,
  gold: tok.gold,
  blue: tok.royalBlue,
  orange: tok.orange,
  red: tok.red,
  cream: tok.cream,
};

const MODULES = [
  { value: "", label: "All Modules" },
  { value: "introduction", label: "Introduction" },
  { value: "calling", label: "Calling" },
  { value: "connection", label: "Connection" },
  { value: "competency", label: "Competency" },
  { value: "capacity", label: "Capacity" },
  { value: "convergence", label: "Convergence" },
  { value: "commissioning", label: "Commissioning" },
  { value: "general", label: "General" },
];

const ROUTE_MODULE_MAP = {
  "/modules/introduction": "introduction",
  "/modules/calling": "calling",
  "/modules/connection": "connection",
  "/modules/competency": "competency",
  "/modules/capacity": "capacity",
  "/modules/convergence": "convergence",
  "/modules/commissioning": "commissioning",
  "/dashboard": "general",
  "/training-bot": "general",
};

export default function TrainingChat({ defaultModule }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");

  const detectedModule = ROUTE_MODULE_MAP[router.pathname] || defaultModule || "";
  const [selectedModule, setSelectedModule] = useState(detectedModule);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-update module when route changes
  useEffect(() => {
    const detected = ROUTE_MODULE_MAP[router.pathname] || defaultModule || "";
    setSelectedModule(detected);
  }, [router.pathname, defaultModule]);

  // Track mobile viewport so the C-Help button clears the fixed bottom nav
  // (Previous / Next bar) on module pages instead of overlapping it.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq.matches);
    update();
    if (mq.addEventListener) {
      mq.addEventListener("change", update);
      return () => mq.removeEventListener("change", update);
    } else {
      // Safari < 14 fallback
      mq.addListener(update);
      return () => mq.removeListener(update);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 300);
    }
  }, [isOpen]);

  async function handleAsk() {
    if (!question.trim() || loading) return;

    const userMessage = { role: "user", content: question };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);

    try {
      const res = await fetch("/api/training/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: userMessage.content,
          module: selectedModule || undefined,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.answer || "I wasn't able to generate a response.",
            sources: data.sources || [],
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.error || "Something went wrong. Please try again.",
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Connection error. Please try again." },
      ]);
    }

    setLoading(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  }

  return (
    <>
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes slideIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideOut {
          from { transform: translateY(0); opacity: 1; }
          to { transform: translateY(20px); opacity: 0; }
        }
      `}</style>

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: isMobile ? "160px" : "80px",
          right: "24px",
          height: "44px",
          paddingLeft: isOpen ? "12px" : "14px",
          paddingRight: isOpen ? "12px" : "18px",
          borderRadius: "22px",
          backgroundColor: BRAND.gold,
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          boxShadow: "0 4px 20px rgba(2, 26, 53, 0.3)",
          zIndex: 9999,
          transition: "transform 300ms ease, box-shadow 300ms ease",
          fontFamily: tokFonts.body,
          fontSize: "13px",
          fontWeight: 700,
          color: BRAND.navy,
          letterSpacing: "0.03em",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.08)";
          e.currentTarget.style.boxShadow = "0 6px 28px rgba(2, 26, 53, 0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 20px rgba(2, 26, 53, 0.3)";
        }}
      >
        {isOpen ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={BRAND.navy} strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={BRAND.navy} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span>C-Help</span>
          </>
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: isMobile ? "230px" : "150px",
            right: "24px",
            width: "400px",
            maxWidth: "calc(100vw - 48px)",
            height: "560px",
            maxHeight: isMobile ? "calc(100vh - 220px)" : "calc(100vh - 140px)",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 8px 40px rgba(2, 26, 53, 0.25)",
            zIndex: 9998,
            display: "flex",
            flexDirection: "column",
            animation: "slideIn 0.25s ease-out",
            fontFamily: "'Outfit', sans-serif",
          }}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: BRAND.navy,
              padding: "14px 18px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: "6px",
                height: "28px",
                backgroundColor: BRAND.gold,
                borderRadius: "2px",
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1 }}>
              <h2
                style={{
                  fontFamily: tokFonts.heading,
                  color: BRAND.gold,
                  fontSize: "16px",
                  fontWeight: 700,
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                C-Help
              </h2>
              <p
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontSize: "11px",
                  margin: 0,
                }}
              >
                {selectedModule && selectedModule !== "general"
                  ? selectedModule.charAt(0).toUpperCase() + selectedModule.slice(1) + " Module"
                  : "Awakening Destiny Global"}
              </p>
            </div>
            {/* Module Filter */}
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              style={{
                padding: "4px 8px",
                borderRadius: "4px",
                border: "none",
                fontSize: "11px",
                backgroundColor: "rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.8)",
                outline: "none",
                cursor: "pointer",
              }}
            >
              {MODULES.map((m) => (
                <option key={m.value} value={m.value} style={{ color: "#333" }}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px",
              backgroundColor: "#0a2d52",
            }}
          >
            {messages.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 16px",
                  color: "rgba(253,248,240,0.4)",
                }}
              >
                <p
                  style={{
                    fontFamily: tokFonts.heading,
                    fontSize: "18px",
                    fontWeight: 600,
                    color: BRAND.gold,
                    marginBottom: "6px",
                  }}
                >
                  How can I help?
                </p>
                <p style={{ fontSize: "13px", lineHeight: 1.5 }}>
                  {selectedModule && selectedModule !== "general"
                    ? `You\'re in the ${selectedModule.charAt(0).toUpperCase() + selectedModule.slice(1)} module. Ask me anything about it.`
                    : "Ask about the 5C Blueprint — Calling, Connection, Competency, Capacity, or Convergence."}
                </p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  marginBottom: "14px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: msg.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "88%",
                    padding: "10px 14px",
                    borderRadius: msg.role === "user"
                      ? "12px 12px 2px 12px"
                      : "12px 12px 12px 2px",
                    backgroundColor: msg.role === "user" ? BRAND.gold : "rgba(2,26,53,0.8)",
                    color: msg.role === "user" ? BRAND.navy : "#FDF8F0",
                    fontSize: "13px",
                    lineHeight: 1.6,
                    whiteSpace: "pre-wrap",
                    boxShadow: msg.role === "assistant" ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
                  }}
                >
                  {msg.content}
                </div>

                {/* Source Citations */}
                {msg.sources && msg.sources.length > 0 && (
                  <div
                    style={{
                      maxWidth: "88%",
                      marginTop: "6px",
                      padding: "8px 10px",
                      borderRadius: "8px",
                      backgroundColor: `${BRAND.gold}12`,
                      border: `1px solid ${BRAND.gold}30`,
                    }}
                  >
                    <p
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        color: BRAND.navy,
                        marginBottom: "4px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Sources
                    </p>
                    {msg.sources.map((src, j) => (
                      <div
                        key={j}
                        style={{
                          fontSize: "11px",
                          color: "rgba(253,248,240,0.7)",
                          marginBottom: "2px",
                          paddingLeft: "6px",
                          borderLeft: `2px solid ${BRAND.gold}`,
                        }}
                      >
                        {src.module && (
                          <span style={{ fontWeight: 600, textTransform: "capitalize" }}>
                            {src.module}
                          </span>
                        )}
                        {src.sectionTitle && (
                          <span> — {src.sectionTitle}</span>
                        )}
                        <span style={{ color: "rgba(253,248,240,0.4)" }}>
                          {" "}({(src.similarity * 100).toFixed(0)}%)
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "rgba(253,248,240,0.4)",
                  fontSize: "12px",
                  padding: "6px 0",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    backgroundColor: BRAND.gold,
                    animation: "pulse 1s infinite",
                  }}
                />
                Searching training materials...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            style={{
              padding: "12px",
              backgroundColor: BRAND.navy,
              borderTop: "1px solid rgba(253,210,13,0.1)",
              display: "flex",
              gap: "8px",
              flexShrink: 0,
            }}
          >
            <textarea
              ref={inputRef}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about the 5C Blueprint..."
              rows={1}
              style={{
                flex: 1,
                padding: "10px 12px",
                borderRadius: "10px",
                border: "1px solid rgba(253,210,13,0.2)",
                backgroundColor: "#0a2d52",
                color: "#FDF8F0",
                fontSize: "13px",
                resize: "none",
                outline: "none",
                fontFamily: "'Outfit', sans-serif",
                lineHeight: 1.4,
              }}
            />
            <button
              onClick={handleAsk}
              disabled={loading || !question.trim()}
              style={{
                padding: "10px 16px",
                borderRadius: "10px",
                border: "none",
                backgroundColor: loading ? "rgba(253,210,13,0.5)" : BRAND.gold,
                color: BRAND.navy,
                fontWeight: 700,
                fontSize: "13px",
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "'Outfit', sans-serif",
                flexShrink: 0,
              }}
            >
              Ask
            </button>
          </div>
        </div>
      )}
    </>
  );
}