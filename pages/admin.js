// pages/admin.js
// Admin dashboard — locked to Will's email only
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { colors as tok } from "../styles/tokens";

var NAVY = tok.navy;
var GOLD = tok.gold;
var GOLD_BRIGHT = tok.gold;

var MODULE_NAMES = ["Introduction", "Calling", "Connection", "Competency", "Capacity", "Convergence", "Commissioning"];
var ADMIN_EMAIL = "meier.will@gmail.com";

var TOTAL_STEPS = { 0: 9, 1: 11, 2: 11, 3: 11, 4: 11, 5: 11, 6: 8 };

var ACCENT_COLORS = [tok.gold, tok.skyBlue, tok.royalBlue, tok.orange, tok.skyBlue, tok.red, tok.gold];

var DIMENSIONS = ["calling", "connection", "competency", "capacity", "convergence"];

export default function AdminDashboard() {
  var authState = useState(null);
  var user = authState[0];
  var setUser = authState[1];

  var loadingState = useState(true);
  var loading = loadingState[0];
  var setLoading = loadingState[1];

  var paymentsState = useState([]);
  var payments = paymentsState[0];
  var setPayments = paymentsState[1];

  var progressState = useState([]);
  var progress = progressState[0];
  var setProgress = progressState[1];

  var profilesState = useState([]);
  var profiles = profilesState[0];
  var setProfiles = profilesState[1];

  var assessmentsState = useState([]);
  var assessments = assessmentsState[0];
  var setAssessments = assessmentsState[1];

  var tabState = useState("overview");
  var tab = tabState[0];
  var setTab = tabState[1];

  // Check auth
  useEffect(function() {
    async function checkAuth() {
      var result = await supabase.auth.getSession();
      var session = result.data.session;
      if (session && session.user) {
        setUser(session.user);
      }
      setLoading(false);
    }
    checkAuth();
  }, []);

  // Load data when user is confirmed admin
  useEffect(function() {
    if (!user || user.email !== ADMIN_EMAIL) return;

    async function loadData() {
      // payments
      var payResult = await supabase.from("payments").select("*").order("created_at", { ascending: false });
      if (payResult.data) setPayments(payResult.data);

      // user_progress (correct table)
      var progResult = await supabase.from("user_progress").select("*").order("updated_at", { ascending: false });
      if (progResult.data) setProgress(progResult.data);

      // user_profiles for email lookup
      var profilesResult = await supabase.from("user_profiles").select("id, full_name, email");
      if (profilesResult.data) setProfiles(profilesResult.data);

      // assessments
      var assessResult = await supabase.from("assessments").select("*").order("taken_at", { ascending: false });
      if (assessResult.data) setAssessments(assessResult.data);
    }
    loadData();
  }, [user]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FAFAF8" }}>
        <p style={{ color: "#999", fontSize: 14 }}>Loading...</p>
      </div>
    );
  }

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FAFAF8", fontFamily: "'Outfit', sans-serif" }}>
        <div style={{ textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", color: NAVY, fontSize: "1.8rem", marginBottom: 12 }}>Admin Access Only</h1>
          <p style={{ color: "#666", fontSize: 14, marginBottom: 24 }}>You must be logged in as the administrator to view this page.</p>
          <a href="/" style={{ color: "#0172BC", fontSize: 14 }}>← Back to Dashboard</a>
        </div>
      </div>
    );
  }

  // Calculate stats
  var totalPayments = payments.length;
  var totalRevenue = payments.reduce(function(sum, p) { return sum + (p.amount || 0); }, 0) / 100;
  var uniqueUserIds = [];
  progress.forEach(function(p) {
    if (uniqueUserIds.indexOf(p.user_id) === -1) uniqueUserIds.push(p.user_id);
  });
  var totalUsers = profiles.length > 0 ? profiles.length : uniqueUserIds.length;
  var assessmentsTaken = assessments.length;

  // Email lookup helper
  function emailFor(userId) {
    var p = profiles.find(function(p) { return p.id === userId; });
    return p ? (p.email || p.full_name || userId.slice(0, 8) + "…") : userId.slice(0, 8) + "…";
  }

  // Get completion data per user
  function getUserProgress(userId) {
    var userProg = progress.filter(function(p) { return p.user_id === userId; });
    var mods = {};
    userProg.forEach(function(p) {
      mods[p.module_id] = { step: p.current_step || 0, hasCommitments: p.commitments && Object.keys(p.commitments).length > 0, hasSummary: !!p.ai_summary };
    });
    return mods;
  }

  function getStepLabel(stepNum) {
    var labels = ["Activation", "Pre-Check", "Teaching", "Exemplar", "Stages", "Post-Check", "Commitment", "Blueprint"];
    return labels[stepNum] || ("Step " + stepNum);
  }

  function exportCSV() {
    var rows = [["Email", "Module", "Current Step", "Has Commitments", "Has Blueprint", "Last Updated"]];
    progress.forEach(function(p) {
      rows.push([
        emailFor(p.user_id),
        MODULE_NAMES[p.module_id] || "Module " + p.module_id,
        getStepLabel(p.current_step || 0),
        p.commitments && Object.keys(p.commitments).length > 0 ? "Yes" : "No",
        !!p.ai_summary ? "Yes" : "No",
        p.updated_at ? new Date(p.updated_at).toLocaleDateString() : ""
      ]);
    });
    var csv = rows.map(function(r) { return r.join(","); }).join("\n");
    var blob = new Blob([csv], { type: "text/csv" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "5c-blueprint-progress-" + new Date().toISOString().split("T")[0] + ".csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportPaymentsCSV() {
    var rows = [["Email", "Amount", "Status", "Stripe Session", "Date"]];
    payments.forEach(function(p) {
      rows.push([
        p.email,
        "$" + ((p.amount || 0) / 100).toFixed(2),
        p.status,
        p.stripe_session_id || "",
        p.created_at ? new Date(p.created_at).toLocaleDateString() : ""
      ]);
    });
    var csv = rows.map(function(r) { return r.join(","); }).join("\n");
    var blob = new Blob([csv], { type: "text/csv" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "5c-blueprint-payments-" + new Date().toISOString().split("T")[0] + ".csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div style={{ minHeight: "100vh", background: tok.cream, fontFamily: "'Outfit', sans-serif" }}>

      {/* Header */}
      <div style={{ background: NAVY, padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>5C Blueprint — Admin</div>
          <div style={{ fontSize: 11, color: GOLD, fontStyle: "italic" }}>Awakening Destiny Global</div>
        </div>
        <a href="/" style={{ fontSize: 13, color: GOLD, textDecoration: "none" }}>← Dashboard</a>
      </div>

      {/* Stats Cards */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px 16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16 }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", border: "1px solid #e5e7eb", borderTop: "3px solid " + GOLD }}>
            <div style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, marginBottom: 4 }}>Total Users</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: NAVY }}>{totalUsers}</div>
          </div>
          <div style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", border: "1px solid #e5e7eb", borderTop: "3px solid #00AEEF" }}>
            <div style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, marginBottom: 4 }}>Payments</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: NAVY }}>{totalPayments}</div>
          </div>
          <div style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", border: "1px solid #e5e7eb", borderTop: "3px solid #0172BC" }}>
            <div style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, marginBottom: 4 }}>Revenue</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: NAVY }}>${totalRevenue.toFixed(2)}</div>
          </div>
          <div style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", border: "1px solid #e5e7eb", borderTop: "3px solid #F47722" }}>
            <div style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, marginBottom: 4 }}>Progress Records</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: NAVY }}>{progress.length}</div>
          </div>
          <div style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", border: "1px solid #e5e7eb", borderTop: "3px solid #EE3124" }}>
            <div style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, marginBottom: 4 }}>Assessments</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: NAVY }}>{assessmentsTaken}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "8px 24px" }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["overview", "payments", "progress", "analytics"].map(function(t) {
            return (
              <button key={t} onClick={function() { setTab(t); }}
                style={{
                  padding: "8px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
                  background: tab === t ? NAVY : "transparent",
                  color: tab === t ? GOLD_BRIGHT : "#888",
                  border: tab === t ? "none" : "1px solid #e5e7eb",
                }}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "16px 24px 48px" }}>

        {/* Overview Tab */}
        {tab === "overview" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontWeight: 700, color: NAVY }}>User Progress Overview</h2>
              <button onClick={exportCSV} style={{ padding: "8px 16px", background: NAVY, color: GOLD_BRIGHT, border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                ↓ Export CSV
              </button>
            </div>
            {uniqueUserIds.length === 0 && (
              <p style={{ color: "#888", fontSize: 14, padding: 24, textAlign: "center" }}>No user progress data yet.</p>
            )}
            {uniqueUserIds.map(function(userId) {
              var userMods = getUserProgress(userId);
              var isPaid = payments.some(function(p) { return p.email === emailFor(userId) && p.status === "completed"; });
              return (
                <div key={userId} style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", border: "1px solid #e5e7eb", marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>{emailFor(userId)}</div>
                      <div style={{ fontSize: 12, color: isPaid ? "#16a34a" : "#888" }}>{isPaid ? "✓ Paid" : "Free tier"}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {MODULE_NAMES.map(function(name, idx) {
                      var mod = userMods[idx];
                      var stepNum = mod ? mod.step : -1;
                      var completed = stepNum >= (TOTAL_STEPS[idx] || 10);
                      var inProgress = stepNum > 0 && stepNum < (TOTAL_STEPS[idx] || 10);
                      return (
                        <div key={idx} style={{
                          padding: "6px 12px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                          background: completed ? "#dcfce7" : inProgress ? "#FFF9E6" : "#f3f4f6",
                          color: completed ? "#16a34a" : inProgress ? "#92400e" : "#9ca3af",
                          border: "1px solid " + (completed ? "#bbf7d0" : inProgress ? "#fde68a" : "#e5e7eb"),
                        }}>
                          {name}{inProgress ? " (" + getStepLabel(stepNum) + ")" : completed ? " ✓" : ""}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Payments Tab */}
        {tab === "payments" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontWeight: 700, color: NAVY }}>Payment Records</h2>
              <button onClick={exportPaymentsCSV} style={{ padding: "8px 16px", background: NAVY, color: GOLD_BRIGHT, border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                ↓ Export CSV
              </button>
            </div>
            {payments.length === 0 && (
              <p style={{ color: "#888", fontSize: 14, padding: 24, textAlign: "center" }}>No payments recorded yet.</p>
            )}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: 12, overflow: "hidden" }}>
                <thead>
                  <tr style={{ background: "#f9fafb" }}>
                    <th style={{ padding: "12px 16px", fontSize: 12, fontWeight: 700, color: "#555", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>Email</th>
                    <th style={{ padding: "12px 16px", fontSize: 12, fontWeight: 700, color: "#555", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>Amount</th>
                    <th style={{ padding: "12px 16px", fontSize: 12, fontWeight: 700, color: "#555", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>Status</th>
                    <th style={{ padding: "12px 16px", fontSize: 12, fontWeight: 700, color: "#555", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map(function(p, i) {
                    return (
                      <tr key={i} style={{ borderBottom: "1px solid #f0f0f0" }}>
                        <td style={{ padding: "12px 16px", fontSize: 13, color: NAVY }}>{p.email}</td>
                        <td style={{ padding: "12px 16px", fontSize: 13, color: NAVY, fontWeight: 600 }}>${((p.amount || 0) / 100).toFixed(2)}</td>
                        <td style={{ padding: "12px 16px", fontSize: 12 }}>
                          <span style={{ padding: "3px 10px", borderRadius: 12, fontSize: 11, fontWeight: 600, background: p.status === "completed" ? "#dcfce7" : "#fef9c3", color: p.status === "completed" ? "#16a34a" : "#92400e" }}>
                            {p.status}
                          </span>
                        </td>
                        <td style={{ padding: "12px 16px", fontSize: 12, color: "#888" }}>{p.created_at ? new Date(p.created_at).toLocaleDateString() : ""}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Progress Tab */}
        {tab === "progress" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontWeight: 700, color: NAVY }}>Detailed Progress</h2>
              <button onClick={exportCSV} style={{ padding: "8px 16px", background: NAVY, color: GOLD_BRIGHT, border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                ↓ Export CSV
              </button>
            </div>
            {progress.length === 0 && (
              <p style={{ color: "#888", fontSize: 14, padding: 24, textAlign: "center" }}>No progress data yet.</p>
            )}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: 12, overflow: "hidden" }}>
                <thead>
                  <tr style={{ background: "#f9fafb" }}>
                    <th style={{ padding: "12px 16px", fontSize: 12, fontWeight: 700, color: "#555", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>Email</th>
                    <th style={{ padding: "12px 16px", fontSize: 12, fontWeight: 700, color: "#555", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>Module</th>
                    <th style={{ padding: "12px 16px", fontSize: 12, fontWeight: 700, color: "#555", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>Current Step</th>
                    <th style={{ padding: "12px 16px", fontSize: 12, fontWeight: 700, color: "#555", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>Commitments</th>
                    <th style={{ padding: "12px 16px", fontSize: 12, fontWeight: 700, color: "#555", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>Blueprint</th>
                    <th style={{ padding: "12px 16px", fontSize: 12, fontWeight: 700, color: "#555", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {progress.map(function(p, i) {
                    var hasCommit = p.commitments && Object.keys(p.commitments).length > 0;
                    var hasSummary = !!p.ai_summary;
                    return (
                      <tr key={i} style={{ borderBottom: "1px solid #f0f0f0" }}>
                        <td style={{ padding: "12px 16px", fontSize: 13, color: NAVY }}>{emailFor(p.user_id)}</td>
                        <td style={{ padding: "12px 16px", fontSize: 13, color: NAVY, fontWeight: 600 }}>{MODULE_NAMES[p.module_id] || "Module " + p.module_id}</td>
                        <td style={{ padding: "12px 16px", fontSize: 12, color: "#555" }}>{getStepLabel(p.current_step || 0)}</td>
                        <td style={{ padding: "12px 16px", fontSize: 12 }}>
                          <span style={{ color: hasCommit ? "#16a34a" : "#9ca3af" }}>{hasCommit ? "✓ Yes" : "—"}</span>
                        </td>
                        <td style={{ padding: "12px 16px", fontSize: 12 }}>
                          <span style={{ color: hasSummary ? "#16a34a" : "#9ca3af" }}>{hasSummary ? "✓ Generated" : "—"}</span>
                        </td>
                        <td style={{ padding: "12px 16px", fontSize: 12, color: "#888" }}>{p.updated_at ? new Date(p.updated_at).toLocaleString() : ""}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {tab === "analytics" && (
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontWeight: 700, color: NAVY, marginBottom: 24 }}>Analytics</h2>

            {/* Section A: Module Completion Funnel */}
            <div style={{ background: "#fff", borderRadius: 12, padding: "24px", border: "1px solid #e5e7eb", marginBottom: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: NAVY, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.05em" }}>Module Completion Funnel</h3>
              {MODULE_NAMES.map(function(modName, idx) {
                var started = progress.filter(function(p) { return p.module_id === idx && p.current_step > 0; }).length;
                var completed = progress.filter(function(p) { return p.module_id === idx && p.current_step >= (TOTAL_STEPS[idx] || 10); }).length;
                return (
                  <div key={idx} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: NAVY }}>{modName}</span>
                      <span style={{ fontSize: 12, color: "#888" }}>{completed} completed / {started} started</span>
                    </div>
                    <div style={{ height: 8, background: "#f0f0f0", borderRadius: 4, position: "relative" }}>
                      <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: (started / Math.max(totalUsers, 1) * 100) + "%", background: ACCENT_COLORS[idx] + "55", borderRadius: 4 }} />
                      <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: (completed / Math.max(totalUsers, 1) * 100) + "%", background: ACCENT_COLORS[idx], borderRadius: 4 }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Section B: Assessment Overview */}
            <div style={{ background: "#fff", borderRadius: 12, padding: "24px", border: "1px solid #e5e7eb", marginBottom: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: NAVY, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.05em" }}>Diagnostic Assessments</h3>
              <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 2 }}>Total Taken</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: NAVY }}>{assessments.length}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 2 }}>Avg Score</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: NAVY }}>
                    {assessments.length > 0
                      ? (assessments.reduce(function(sum, a) { return sum + (a.total_score || 0); }, 0) / assessments.length).toFixed(1)
                      : "—"}
                  </div>
                </div>
              </div>
              {assessments.length > 0 && (
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 10 }}>Dimension Averages</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {DIMENSIONS.map(function(dim) {
                      var scored = assessments.filter(function(a) { return a.dimension_scores && a.dimension_scores[dim] != null; });
                      var avg = scored.length > 0
                        ? (scored.reduce(function(sum, a) { return sum + (a.dimension_scores[dim] || 0); }, 0) / scored.length).toFixed(1)
                        : "—";
                      return (
                        <div key={dim} style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, padding: "8px 14px", textAlign: "center" }}>
                          <div style={{ fontSize: 11, color: "#888", textTransform: "capitalize", fontWeight: 600, marginBottom: 2 }}>{dim}</div>
                          <div style={{ fontSize: 18, fontWeight: 700, color: NAVY }}>{avg}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {assessments.length === 0 && (
                <p style={{ color: "#888", fontSize: 14, margin: 0 }}>No assessments taken yet.</p>
              )}
            </div>

            {/* Section C: Revenue by Month */}
            <div style={{ background: "#fff", borderRadius: 12, padding: "24px", border: "1px solid #e5e7eb" }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: NAVY, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.05em" }}>Revenue by Month</h3>
              {payments.length === 0 && (
                <p style={{ color: "#888", fontSize: 14, margin: 0 }}>No payments yet.</p>
              )}
              {payments.length > 0 && (function() {
                var monthMap = {};
                payments.forEach(function(p) {
                  if (!p.created_at) return;
                  var d = new Date(p.created_at);
                  var key = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0");
                  if (!monthMap[key]) monthMap[key] = { total: 0, count: 0, label: d.toLocaleString("default", { month: "long", year: "numeric" }) };
                  monthMap[key].total += (p.amount || 0);
                  monthMap[key].count += 1;
                });
                var keys = Object.keys(monthMap).sort().reverse().slice(0, 6);
                if (keys.length === 0) return <p style={{ color: "#888", fontSize: 14, margin: 0 }}>No payments yet.</p>;
                return (
                  <div>
                    {keys.map(function(key) {
                      var m = monthMap[key];
                      return (
                        <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f0f0f0" }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: NAVY }}>{m.label}</span>
                          <span style={{ fontSize: 13, color: "#555" }}>
                            <span style={{ fontWeight: 700, color: NAVY }}>${(m.total / 100).toFixed(2)}</span>
                            <span style={{ fontSize: 12, color: "#888", marginLeft: 8 }}>({m.count} payment{m.count !== 1 ? "s" : ""})</span>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
