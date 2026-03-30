// components/ReferralFooter.js
// Slide-up invite form shown in module footer area
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

var NAVY = "#021A35";
var GOLD = "#FDD20D";

export default function ReferralFooter({ moduleContext }) {
  var openS = useState(false); var isOpen = openS[0]; var setIsOpen = openS[1];
  var nameS = useState(""); var name = nameS[0]; var setName = nameS[1];
  var emailS = useState(""); var email = emailS[0]; var setEmail = emailS[1];
  var statusS = useState(null); var status = statusS[0]; var setStatus = statusS[1];

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("sending");
    try {
      var sr = await supabase.auth.getSession();
      var session = sr.data.session;
      if (!session || !session.user) {
        setStatus("error");
        return;
      }
      var user = session.user;
      var referrerName = user.user_metadata?.full_name || user.user_metadata?.first_name || user.email;
      var result = await supabase.from("referrals").insert({
        referrer_id: user.id,
        referrer_email: user.email,
        referrer_name: referrerName,
        referred_email: email.trim(),
        referred_name: name.trim() || null,
        module_context: moduleContext || null,
      });
      if (result.error) throw result.error;
      setStatus("sent");
      setName("");
      setEmail("");
      setTimeout(function() { setStatus(null); setIsOpen(false); }, 3000);
    } catch (err) {
      console.error("Referral error:", err);
      setStatus("error");
      setTimeout(function() { setStatus(null); }, 3000);
    }
  }

  return (
    <div style={{ position: "fixed", bottom: 64, left: "50%", transform: "translateX(-50%)", zIndex: 45, maxWidth: 480, width: "calc(100% - 32px)" }}>
      {!isOpen && (
        <button
          onClick={function() { setIsOpen(true); }}
          style={{ display: "block", width: "100%", padding: "10px 20px", background: NAVY, color: GOLD, border: "2px solid " + GOLD, borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: "pointer", textAlign: "center", fontFamily: "'Outfit', sans-serif", letterSpacing: "0.03em" }}>
          Know someone who needs this? Invite them.
        </button>
      )}
      {isOpen && (
        <div style={{ background: "#fff", borderRadius: 14, border: "2px solid " + GOLD, padding: "20px 20px 16px", boxShadow: "0 8px 32px rgba(2,26,53,0.15)", animation: "slideUp 0.25s ease-out" }}>
          <style>{`@keyframes slideUp { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: NAVY, margin: 0 }}>Invite a Leader</p>
            <button onClick={function() { setIsOpen(false); }} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#999", padding: 0 }}>&times;</button>
          </div>
          <p style={{ fontSize: 12, color: "#666", marginBottom: 14, lineHeight: 1.5 }}>Know a leader who needs this framework? We'll save their info so you can follow up.</p>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Their name (optional)"
              value={name}
              onChange={function(e) { setName(e.target.value); }}
              style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 13, marginBottom: 8, boxSizing: "border-box", fontFamily: "'Outfit', sans-serif" }}
            />
            <input
              type="email"
              placeholder="Their email address"
              value={email}
              onChange={function(e) { setEmail(e.target.value); }}
              required
              style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 13, marginBottom: 12, boxSizing: "border-box", fontFamily: "'Outfit', sans-serif" }}
            />
            <button
              type="submit"
              disabled={status === "sending"}
              style={{ width: "100%", padding: "10px 0", background: NAVY, color: GOLD, border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: status === "sending" ? "not-allowed" : "pointer", fontFamily: "'Outfit', sans-serif" }}>
              {status === "sending" ? "Saving..." : status === "sent" ? "Saved! Thank you." : status === "error" ? "Something went wrong" : "Save Referral"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
