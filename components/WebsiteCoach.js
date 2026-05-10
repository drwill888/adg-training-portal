// components/WebsiteCoach.js
// Public-facing website coaching agent widget for awakeningdestiny.global
// and coaching4impact.com. Separate from the in-portal C-Help (TrainingChat).
//
// Phases wired in this build:
//   1. Free chat against /api/coach/chat (system prompt + KB retrieval).
//   2. Anonymous session_id stored in localStorage so server can stitch turns.
//   3. Lead form (name, email, interest) that posts to /api/coach/lead.
//   4. "Email me a summary" button that posts to /api/coach/summary.

import { useEffect, useRef, useState } from "react";
import { colors as tok, fonts as tokFonts } from "../styles/tokens";

const BRAND = {
  navy: tok.navy,
  navyLight: tok.navyLight,
  gold: tok.gold,
  cream: tok.cream,
};

const STORAGE_KEY = "adg_coach_session";

const INTEREST_OPTIONS = [
  { value: "", label: "What brings you here? (optional)" },
  { value: "leadership", label: "Leadership growth" },
  { value: "coaching", label: "Personal coaching" },
  { value: "5c", label: "5C Leadership Blueprint" },
  { value: "cohort", label: "Apostolic cohort" },
  { value: "prophetic", label: "Prophetic ministry" },
  { value: "apostolic", label: "Apostolic ministry" },
  { value: "speaking", label: "Speaking / events" },
  { value: "training", label: "Training / courses" },
  { value: "other", label: "Something else" },
];

function uuid() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function WebsiteCoach({
  title = "ADG Guide",
  subtitle = "Awakening Destiny Global",
  opener = "How can I help you today? Ask about the 5C Leadership Blueprint, coaching, the cohort, or anything else on the site.",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadForm, setLeadForm] = useState({
    firstName: "",
    email: "",
    interest: "",
  });
  const [leadStatus, setLeadStatus] = useState({ state: "idle", message: "" });
  const [summaryStatus, setSummaryStatus] = useState({ state: "idle", message: "" });
  const [gateMessage, setGateMessage] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.sessionId) setSessionId(parsed.sessionId);
        if (parsed?.leadCaptured) setLeadCaptured(true);
        return;
      }
    } catch {}
    const fresh = uuid();
    setSessionId(fresh);
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ sessionId: fresh, leadCaptured: false })
      );
    } catch {}
  }, []);

  useEffect(() => {
    if (!sessionId || typeof window === "undefined") return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ sessionId, leadCaptured })
      );
    } catch {}
  }, [sessionId, leadCaptured]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, showLeadForm]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen]);

  async function handleAsk() {
    if (!question.trim() || loading || !sessionId) return;

    const userMsg = { role: "user", content: question.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setQuestion("");
    setLoading(true);
    setGateMessage(null);

    try {
      const res = await fetch("/api/coach/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: userMsg.content,
          sessionId,
          sourceUrl: typeof window !== "undefined" ? window.location.href : null,
          referrer: typeof document !== "undefined" ? document.referrer : null,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        if (data.conversationId) setConversationId(data.conversationId);
        if (data.gated) {
          setGateMessage(data.answer);
          setShowLeadForm(true);
        } else {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: data.answer || "" },
          ]);
          // After 2 substantive exchanges, gently surface the lead form.
          if (!leadCaptured && (data.freeQuestionsUsed ?? 0) >= 2) {
            setShowLeadForm(true);
          }
        }
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              data.error || "Something went wrong on my end. Please try again.",
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Connection error. Please try again." },
      ]);
    }

    setLoading(false);
  }

  async function handleSubmitLead(e) {
    e?.preventDefault?.();
    if (!leadForm.email.trim()) {
      setLeadStatus({ state: "error", message: "Email is required." });
      return;
    }
    setLeadStatus({ state: "loading", message: "" });
    try {
      const res = await fetch("/api/coach/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          conversationId,
          email: leadForm.email.trim(),
          firstName: leadForm.firstName.trim() || null,
          interest: leadForm.interest || null,
          sourceUrl: typeof window !== "undefined" ? window.location.href : null,
          referrer: typeof document !== "undefined" ? document.referrer : null,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setLeadCaptured(true);
        setLeadStatus({
          state: "success",
          message:
            "Thanks — your details are saved. Keep the conversation going below.",
        });
        if (data.conversationId) setConversationId(data.conversationId);
        setShowLeadForm(false);
        setGateMessage(null);
      } else {
        setLeadStatus({
          state: "error",
          message: data.error || "Could not save. Please try again.",
        });
      }
    } catch {
      setLeadStatus({
        state: "error",
        message: "Connection error. Please try again.",
      });
    }
  }

  async function handleEmailSummary() {
    if (!conversationId) {
      setSummaryStatus({
        state: "error",
        message: "Send a message first so I have something to summarize.",
      });
      return;
    }
    setSummaryStatus({ state: "loading", message: "" });
    try {
      const res = await fetch("/api/coach/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          sendVisitorEmail: leadCaptured,
          sendTeamEmail: leadCaptured,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSummaryStatus({
          state: "success",
          message: leadCaptured
            ? "Sent. Check your inbox for the summary."
            : "Summary saved. Share your email to receive it.",
        });
      } else {
        setSummaryStatus({
          state: "error",
          message: data.error || "Could not generate summary.",
        });
      }
    } catch {
      setSummaryStatus({
        state: "error",
        message: "Connection error. Please try again.",
      });
    }
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
        @keyframes adgCoachPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes adgCoachSlideIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>

      {/* Floating launcher */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? "Close coaching guide" : "Open coaching guide"}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          height: "52px",
          paddingLeft: isOpen ? "14px" : "18px",
          paddingRight: isOpen ? "14px" : "22px",
          borderRadius: "26px",
          backgroundColor: BRAND.gold,
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          boxShadow: "0 6px 24px rgba(2, 26, 53, 0.3)",
          zIndex: 9999,
          fontFamily: tokFonts?.body || "'Outfit', sans-serif",
          fontSize: "14px",
          fontWeight: 700,
          color: BRAND.navy,
          letterSpacing: "0.03em",
          transition: "transform 200ms ease, box-shadow 200ms ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.06)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
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
            <span>Ask the ADG Guide</span>
          </>
        )}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Awakening Destiny Global coaching guide"
          style={{
            position: "fixed",
            bottom: "92px",
            right: "24px",
            width: "420px",
            maxWidth: "calc(100vw - 32px)",
            height: "620px",
            maxHeight: "calc(100vh - 120px)",
            borderRadius: "18px",
            overflow: "hidden",
            boxShadow: "0 12px 48px rgba(2, 26, 53, 0.3)",
            zIndex: 9998,
            display: "flex",
            flexDirection: "column",
            animation: "adgCoachSlideIn 0.25s ease-out",
            fontFamily: tokFonts?.body || "'Outfit', sans-serif",
            backgroundColor: BRAND.navyLight,
          }}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: BRAND.navy,
              padding: "14px 18px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: "6px",
                height: "32px",
                backgroundColor: BRAND.gold,
                borderRadius: "2px",
              }}
            />
            <div style={{ flex: 1 }}>
              <h2
                style={{
                  fontFamily: tokFonts?.heading || "'Outfit', sans-serif",
                  color: BRAND.gold,
                  fontSize: "16px",
                  fontWeight: 700,
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                {title}
              </h2>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "11px", margin: 0 }}>
                {subtitle}
              </p>
            </div>
            <button
              onClick={handleEmailSummary}
              disabled={!conversationId || summaryStatus.state === "loading"}
              title="Email me a summary of this conversation"
              style={{
                padding: "6px 10px",
                fontSize: "11px",
                fontWeight: 600,
                borderRadius: "999px",
                border: "1px solid rgba(253,210,13,0.3)",
                backgroundColor: "transparent",
                color: BRAND.gold,
                cursor: conversationId ? "pointer" : "not-allowed",
                opacity: conversationId ? 1 : 0.4,
              }}
            >
              Email summary
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px",
              backgroundColor: BRAND.navyLight,
            }}
          >
            {messages.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "32px 12px",
                  color: "rgba(253,248,240,0.55)",
                  fontSize: "13px",
                  lineHeight: 1.5,
                }}
              >
                <p
                  style={{
                    fontFamily: tokFonts?.heading || "'Outfit', sans-serif",
                    fontSize: "18px",
                    fontWeight: 600,
                    color: BRAND.gold,
                    marginBottom: "8px",
                  }}
                >
                  Welcome.
                </p>
                <p>{opener}</p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  marginBottom: "12px",
                  display: "flex",
                  justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "88%",
                    padding: "10px 14px",
                    borderRadius:
                      msg.role === "user"
                        ? "14px 14px 4px 14px"
                        : "14px 14px 14px 4px",
                    backgroundColor:
                      msg.role === "user" ? BRAND.gold : "rgba(2,26,53,0.85)",
                    color: msg.role === "user" ? BRAND.navy : BRAND.cream,
                    fontSize: "13.5px",
                    lineHeight: 1.55,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {gateMessage && (
              <div
                style={{
                  margin: "12px 0",
                  padding: "12px 14px",
                  borderRadius: "12px",
                  backgroundColor: "rgba(253,210,13,0.08)",
                  border: "1px solid rgba(253,210,13,0.35)",
                  color: BRAND.cream,
                  fontSize: "13px",
                  lineHeight: 1.55,
                }}
              >
                {gateMessage}
              </div>
            )}

            {loading && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "rgba(253,248,240,0.5)",
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
                    animation: "adgCoachPulse 1s infinite",
                  }}
                />
                Thinking...
              </div>
            )}

            {/* Lead form */}
            {showLeadForm && !leadCaptured && (
              <form
                onSubmit={handleSubmitLead}
                style={{
                  marginTop: "12px",
                  padding: "14px",
                  borderRadius: "12px",
                  backgroundColor: "rgba(2,26,53,0.6)",
                  border: "1px solid rgba(253,210,13,0.25)",
                }}
              >
                <p
                  style={{
                    color: BRAND.gold,
                    fontSize: "13px",
                    fontWeight: 600,
                    margin: "0 0 6px",
                  }}
                >
                  Want a personal summary?
                </p>
                <p
                  style={{
                    color: "rgba(253,248,240,0.7)",
                    fontSize: "12px",
                    margin: "0 0 10px",
                    lineHeight: 1.5,
                  }}
                >
                  Share your name and email and I will send you a short summary
                  and the best next step from Will.
                </p>
                <input
                  type="text"
                  value={leadForm.firstName}
                  onChange={(e) =>
                    setLeadForm((p) => ({ ...p, firstName: e.target.value }))
                  }
                  placeholder="First name"
                  style={inputStyle()}
                />
                <input
                  type="email"
                  required
                  value={leadForm.email}
                  onChange={(e) =>
                    setLeadForm((p) => ({ ...p, email: e.target.value }))
                  }
                  placeholder="Email"
                  style={inputStyle()}
                />
                <select
                  value={leadForm.interest}
                  onChange={(e) =>
                    setLeadForm((p) => ({ ...p, interest: e.target.value }))
                  }
                  style={inputStyle()}
                >
                  {INTEREST_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                  <button
                    type="submit"
                    disabled={leadStatus.state === "loading"}
                    style={{
                      flex: 1,
                      padding: "9px 12px",
                      borderRadius: "10px",
                      border: "none",
                      backgroundColor: BRAND.gold,
                      color: BRAND.navy,
                      fontWeight: 700,
                      fontSize: "13px",
                      cursor: "pointer",
                    }}
                  >
                    {leadStatus.state === "loading" ? "Saving..." : "Send"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowLeadForm(false)}
                    style={{
                      padding: "9px 12px",
                      borderRadius: "10px",
                      border: "1px solid rgba(253,248,240,0.2)",
                      backgroundColor: "transparent",
                      color: "rgba(253,248,240,0.7)",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                  >
                    Not now
                  </button>
                </div>
                {leadStatus.state === "error" && (
                  <p
                    style={{
                      color: "#ff9999",
                      fontSize: "11px",
                      margin: "6px 0 0",
                    }}
                  >
                    {leadStatus.message}
                  </p>
                )}
              </form>
            )}

            {leadStatus.state === "success" && leadCaptured && (
              <p
                style={{
                  fontSize: "11px",
                  color: BRAND.gold,
                  textAlign: "center",
                  margin: "10px 0 0",
                }}
              >
                {leadStatus.message}
              </p>
            )}

            {summaryStatus.message && (
              <p
                style={{
                  fontSize: "11px",
                  color:
                    summaryStatus.state === "error"
                      ? "#ff9999"
                      : "rgba(253,210,13,0.85)",
                  textAlign: "center",
                  margin: "10px 0 0",
                }}
              >
                {summaryStatus.message}
              </p>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            style={{
              padding: "12px",
              backgroundColor: BRAND.navy,
              borderTop: "1px solid rgba(253,210,13,0.12)",
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
              placeholder="Ask about ADG, the 5C Blueprint, coaching, the cohort..."
              rows={1}
              style={{
                flex: 1,
                padding: "10px 12px",
                borderRadius: "10px",
                border: "1px solid rgba(253,210,13,0.2)",
                backgroundColor: BRAND.navyLight,
                color: BRAND.cream,
                fontSize: "13px",
                resize: "none",
                outline: "none",
                fontFamily: "inherit",
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
                cursor: loading || !question.trim() ? "not-allowed" : "pointer",
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

function inputStyle() {
  return {
    width: "100%",
    boxSizing: "border-box",
    padding: "9px 11px",
    marginBottom: "8px",
    borderRadius: "8px",
    border: "1px solid rgba(253,248,240,0.18)",
    backgroundColor: "rgba(2,26,53,0.5)",
    color: "#FDF8F0",
    fontSize: "13px",
    outline: "none",
    fontFamily: "inherit",
  };
}
