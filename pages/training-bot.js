// pages/training-bot.jsx
import { useState, useRef, useEffect } from "react";

const BRAND = {
  navy: "#021A35",
  gold: "#FDD20D",
  blue: "#0172BC",
  orange: "#F47722",
  red: "#EE3124",
  cream: "#FDF8F0",
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

export default function TrainingBotPage() {
  const [activeTab, setActiveTab] = useState("chat");

  // Chat state
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [selectedModule, setSelectedModule] = useState("");
  const [loadingChat, setLoadingChat] = useState(false);
  const messagesEndRef = useRef(null);

  // Ingest state
  const [title, setTitle] = useState("");
  const [trainingText, setTrainingText] = useState("");
  const [ingestModule, setIngestModule] = useState("general");
  const [contentType, setContentType] = useState("curriculum");
  const [ingestMessage, setIngestMessage] = useState("");
  const [loadingIngest, setLoadingIngest] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleAsk() {
    if (!question.trim() || loadingChat) return;

    const userMessage = { role: "user", content: question };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoadingChat(true);

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

    setLoadingChat(false);
  }

  async function handleIngest() {
    if (!title.trim() || !trainingText.trim() || loadingIngest) return;

    setLoadingIngest(true);
    setIngestMessage("");

    try {
      const res = await fetch("/api/training/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          text: trainingText,
          module: ingestModule,
          contentType,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setIngestMessage(
          `✓ "${title}" loaded into ${ingestModule} module. ${data.chunksCreated} chunks created.`
        );
        setTitle("");
        setTrainingText("");
      } else {
        setIngestMessage(`✗ Error: ${data.error || "Failed to load content."}`);
      }
    } catch (err) {
      setIngestMessage("✗ Connection error. Please try again.");
    }

    setLoadingIngest(false);
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
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Outfit:wght@300;400;500;600;700&display=swap');
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>

      <main
        style={{
          fontFamily: "'Outfit', sans-serif",
          backgroundColor: BRAND.cream,
          minHeight: "100vh",
        }}
      >
        {/* Header */}
        <header
          style={{
            backgroundColor: BRAND.navy,
            padding: "16px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "8px",
                height: "32px",
                backgroundColor: BRAND.gold,
                borderRadius: "2px",
              }}
            />
            <div>
              <h1
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  color: BRAND.gold,
                  fontSize: "20px",
                  fontWeight: 700,
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                5C Leadership Blueprint
              </h1>
              <p
                style={{
                  color: "rgba(255,255,255,0.6)",
                  fontSize: "12px",
                  margin: 0,
                }}
              >
                Awakening Destiny Global — Training Assistant
              </p>
            </div>
          </div>

          {/* Tab Toggle */}
          <div style={{ display: "flex", gap: "4px" }}>
            <button
              onClick={() => setActiveTab("chat")}
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 600,
                backgroundColor: activeTab === "chat" ? BRAND.gold : "transparent",
                color: activeTab === "chat" ? BRAND.navy : "rgba(255,255,255,0.7)",
              }}
            >
              Ask
            </button>
            <button
              onClick={() => setActiveTab("ingest")}
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 600,
                backgroundColor: activeTab === "ingest" ? BRAND.gold : "transparent",
                color: activeTab === "ingest" ? BRAND.navy : "rgba(255,255,255,0.7)",
              }}
            >
              Load Content
            </button>
          </div>
        </header>

        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px" }}>
          {/* ===================== CHAT TAB ===================== */}
          {activeTab === "chat" && (
            <div>
              {/* Module Filter */}
              <div style={{ marginBottom: "16px" }}>
                <select
                  value={selectedModule}
                  onChange={(e) => setSelectedModule(e.target.value)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: `1px solid ${BRAND.navy}20`,
                    fontSize: "13px",
                    backgroundColor: "white",
                    color: BRAND.navy,
                  }}
                >
                  {MODULES.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Messages */}
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  border: `1px solid ${BRAND.navy}10`,
                  minHeight: "400px",
                  maxHeight: "60vh",
                  overflowY: "auto",
                  padding: "20px",
                  marginBottom: "16px",
                }}
              >
                {messages.length === 0 && (
                  <div
                    style={{
                      textAlign: "center",
                      color: BRAND.navy + "60",
                      padding: "80px 20px",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: "22px",
                        fontWeight: 600,
                        color: BRAND.navy,
                        marginBottom: "8px",
                      }}
                    >
                      Welcome to the 5C Training Assistant
                    </p>
                    <p style={{ fontSize: "14px" }}>
                      Ask about Calling, Connection, Competency, Capacity, or
                      Convergence — and get answers grounded in the curriculum.
                    </p>
                  </div>
                )}

                {messages.map((msg, i) => (
                  <div
                    key={i}
                    style={{
                      marginBottom: "20px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: msg.role === "user" ? "flex-end" : "flex-start",
                    }}
                  >
                    <div
                      style={{
                        maxWidth: "85%",
                        padding: "12px 16px",
                        borderRadius: "10px",
                        backgroundColor:
                          msg.role === "user" ? BRAND.navy : `${BRAND.blue}08`,
                        color: msg.role === "user" ? "white" : BRAND.navy,
                        fontSize: "14px",
                        lineHeight: 1.6,
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {msg.content}
                    </div>

                    {/* Source Citations */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div
                        style={{
                          maxWidth: "85%",
                          marginTop: "8px",
                          padding: "10px 14px",
                          borderRadius: "8px",
                          backgroundColor: `${BRAND.gold}15`,
                          border: `1px solid ${BRAND.gold}40`,
                        }}
                      >
                        <p
                          style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            color: BRAND.navy,
                            marginBottom: "6px",
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
                              fontSize: "12px",
                              color: BRAND.navy + "CC",
                              marginBottom: "4px",
                              paddingLeft: "8px",
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
                            <span style={{ color: BRAND.navy + "80" }}>
                              {" "}
                              ({(src.similarity * 100).toFixed(0)}% match)
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {loadingChat && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      color: BRAND.navy + "80",
                      fontSize: "13px",
                      padding: "8px 0",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        width: "8px",
                        height: "8px",
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
              <div style={{ display: "flex", gap: "8px" }}>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about the 5C Blueprint..."
                  rows={2}
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    borderRadius: "10px",
                    border: `1px solid ${BRAND.navy}20`,
                    fontSize: "14px",
                    resize: "none",
                    outline: "none",
                    fontFamily: "'Outfit', sans-serif",
                  }}
                />
                <button
                  onClick={handleAsk}
                  disabled={loadingChat || !question.trim()}
                  style={{
                    padding: "12px 24px",
                    borderRadius: "10px",
                    border: "none",
                    backgroundColor: loadingChat ? BRAND.navy + "60" : BRAND.navy,
                    color: BRAND.gold,
                    fontWeight: 700,
                    fontSize: "14px",
                    cursor: loadingChat ? "not-allowed" : "pointer",
                    fontFamily: "'Outfit', sans-serif",
                  }}
                >
                  Ask
                </button>
              </div>
            </div>
          )}

          {/* ===================== INGEST TAB ===================== */}
          {activeTab === "ingest" && (
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "24px",
                border: `1px solid ${BRAND.navy}10`,
              }}
            >
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "20px",
                  fontWeight: 700,
                  color: BRAND.navy,
                  marginBottom: "20px",
                }}
              >
                Load Training Content
              </h2>

              {/* Title */}
              <label style={{ fontSize: "13px", fontWeight: 600, color: BRAND.navy }}>
                Document Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='e.g., "Calling Module — Participant Workbook"'
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: `1px solid ${BRAND.navy}20`,
                  fontSize: "14px",
                  marginBottom: "16px",
                  marginTop: "6px",
                  boxSizing: "border-box",
                }}
              />

              {/* Module + Content Type */}
              <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: BRAND.navy }}>
                    Module
                  </label>
                  <select
                    value={ingestModule}
                    onChange={(e) => setIngestModule(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: `1px solid ${BRAND.navy}20`,
                      fontSize: "14px",
                      marginTop: "6px",
                      backgroundColor: "white",
                    }}
                  >
                    {MODULES.filter((m) => m.value).map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: BRAND.navy }}>
                    Content Type
                  </label>
                  <select
                    value={contentType}
                    onChange={(e) => setContentType(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: `1px solid ${BRAND.navy}20`,
                      fontSize: "14px",
                      marginTop: "6px",
                      backgroundColor: "white",
                    }}
                  >
                    <option value="curriculum">Curriculum</option>
                    <option value="workbook">Workbook</option>
                    <option value="podcast_script">Podcast Script</option>
                    <option value="blog">Blog Content</option>
                    <option value="assessment_guide">Assessment Guide</option>
                  </select>
                </div>
              </div>

              {/* Content */}
              <label style={{ fontSize: "13px", fontWeight: 600, color: BRAND.navy }}>
                Training Content
              </label>
              <textarea
                value={trainingText}
                onChange={(e) => setTrainingText(e.target.value)}
                placeholder="Paste your workbook chapter, podcast script, or training content here..."
                rows={14}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: "8px",
                  border: `1px solid ${BRAND.navy}20`,
                  fontSize: "14px",
                  resize: "vertical",
                  marginTop: "6px",
                  marginBottom: "16px",
                  fontFamily: "'Outfit', sans-serif",
                  lineHeight: 1.6,
                  boxSizing: "border-box",
                }}
              />

              <button
                onClick={handleIngest}
                disabled={loadingIngest || !title.trim() || !trainingText.trim()}
                style={{
                  padding: "12px 28px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: BRAND.navy,
                  color: BRAND.gold,
                  fontWeight: 700,
                  fontSize: "14px",
                  cursor:
                    loadingIngest || !title.trim() || !trainingText.trim()
                      ? "not-allowed"
                      : "pointer",
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                {loadingIngest ? "Processing..." : "Load Training Content"}
              </button>

              {ingestMessage && (
                <p
                  style={{
                    marginTop: "12px",
                    fontSize: "14px",
                    color: ingestMessage.startsWith("✓") ? "#16a34a" : BRAND.red,
                    fontWeight: 500,
                  }}
                >
                  {ingestMessage}
                </p>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}