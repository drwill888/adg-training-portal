// pages/api/debug/env-check.js
// Diagnostic endpoint — confirms whether env vars reach the Lambda at runtime.
// DELETE THIS FILE AFTER DEBUGGING. Safe — never logs the actual key value.

export default function handler(req, res) {
  const claude = process.env.CLAUDE_API_KEY;
  const anthropic = process.env.ANTHROPIC_API_KEY;

  return res.status(200).json({
    claude: {
      exists: !!claude,
      length: claude?.length || 0,
      firstChars: claude ? claude.slice(0, 7) : null,  // safe prefix for sanity check
      lastChars: claude ? claude.slice(-4) : null,
    },
    anthropic: {
      exists: !!anthropic,
      length: anthropic?.length || 0,
      firstChars: anthropic ? anthropic.slice(0, 7) : null,
      lastChars: anthropic ? anthropic.slice(-4) : null,
    },
    other_env_sample: {
      has_supabase_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      has_supabase_service_role: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      has_resend: !!process.env.RESEND_API_KEY,
    },
  });
}