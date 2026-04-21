// pages/api/called-to-carry/assessment/unsubscribe.js
// One-click unsubscribe handler.
// GET ?sid=<sequenceId>&token=<hmac> → marks sequence unsubscribed, shows confirmation page.

import { createClient } from '@supabase/supabase-js';
import { verifyToken } from '../../../../lib/called-to-carry/auth/tokens';

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { sid, token } = req.query;

  if (!sid || !token) {
    return res.status(400).send(errorPage('Invalid unsubscribe link.'));
  }

  // Verify HMAC token
  if (!verifyToken(sid, token)) {
    return res.status(403).send(errorPage('This unsubscribe link is invalid or has expired.'));
  }

  const supabase = getAdminClient();

  // Fetch the sequence so we can confirm it exists and get the email
  const { data: seq, error: fetchError } = await supabase
    .from('email_sequences')
    .select('id, email, status')
    .eq('id', sid)
    .single();

  if (fetchError || !seq) {
    return res.status(404).send(errorPage('Sequence not found.'));
  }

  // Idempotent — already unsubscribed is fine
  if (seq.status !== 'unsubscribed') {
    const { error: updateError } = await supabase
      .from('email_sequences')
      .update({
        status: 'unsubscribed',
        unsubscribed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', sid);

    if (updateError) {
      console.error('unsubscribe update error:', updateError.message);
      return res.status(500).send(errorPage('Something went wrong. Please email will@awakeningdestiny.global to unsubscribe manually.'));
    }
  }

  return res.status(200).send(successPage(seq.email));
}

function successPage(email) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Unsubscribed — Called to Carry</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Georgia', serif; background: #021A35; color: #FDF8F0;
           min-height: 100vh; display: flex; align-items: center; justify-content: center;
           padding: 2rem; text-align: center; }
    .card { max-width: 480px; }
    .label { color: #C8A951; letter-spacing: 0.12em; font-size: 0.8rem;
             text-transform: uppercase; margin-bottom: 1.5rem; font-family: 'Outfit', sans-serif; }
    h1 { font-size: 2rem; font-weight: 400; margin-bottom: 1rem; line-height: 1.3; }
    p { opacity: 0.75; line-height: 1.7; margin-bottom: 1rem; font-size: 0.95rem; }
    a { color: #C8A951; }
  </style>
</head>
<body>
  <div class="card">
    <p class="label">Called to Carry</p>
    <h1>You have been unsubscribed.</h1>
    <p>The email address <strong>${email}</strong> has been removed from all Called to Carry email sequences.</p>
    <p>If this was a mistake, reply to any email you received or contact <a href="mailto:will@awakeningdestiny.global">will@awakeningdestiny.global</a>.</p>
  </div>
</body>
</html>`;
}

function errorPage(message) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Unsubscribe Error — Called to Carry</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Georgia', serif; background: #021A35; color: #FDF8F0;
           min-height: 100vh; display: flex; align-items: center; justify-content: center;
           padding: 2rem; text-align: center; }
    .card { max-width: 480px; }
    h1 { font-size: 1.8rem; font-weight: 400; margin-bottom: 1rem; }
    p { opacity: 0.75; line-height: 1.7; font-size: 0.95rem; }
    a { color: #C8A951; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Something went wrong.</h1>
    <p>${message}</p>
  </div>
</body>
</html>`;
}
