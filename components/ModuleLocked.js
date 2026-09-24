// components/ModuleLocked.js
// Shared "this module requires full access" screen. Previously lived only
// inline inside ModuleTemplate.js (as a client-side-only gate); now also
// used at the page level for paid modules, before any module content is
// fetched from the server — see pages/api/modules/[slug].js.
import Button from "./ui/Button";

export default function ModuleLocked() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#021A35", fontFamily: "'Outfit', sans-serif" }}>
      <div style={{ textAlign: "center", maxWidth: 440, padding: 40 }}>
        <div style={{ fontSize: 11, color: "#FDD20D", letterSpacing: "0.15em", fontWeight: 700, marginBottom: 16 }}>LOCKED</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: "#FDF8F0", fontSize: "2rem", marginBottom: 12 }}>This Module Requires Full Access</h1>
        <p style={{ color: "#9ca3af", fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>Unlock all five modules of the 5C Leadership Blueprint to continue your formation journey.</p>
        <Button onClick={function() { fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pathway: 'individual' }) }).then(function(r) { return r.json(); }).then(function(d) { if (d.url) window.location.href = d.url; }).catch(function() { alert('Something went wrong.'); }); }} style={{ marginBottom: 12 }}>Unlock — $149</Button>
        <br /><a href="/dashboard" style={{ color: "#9ca3af", fontSize: 13 }}>← Back to Dashboard</a>
      </div>
    </div>
  );
}
