// pages/api/called-to-carry/capture-lead.js
// Adds 10-Q takers to Icegram Express list via WP REST API
// Non-blocking — assessment flow continues even if this fails

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const { email, firstName } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email required.' });
  }

  const wpUrl = process.env.WORDPRESS_URL;
  const wpUser = process.env.WP_APP_USER;
  const wpPass = process.env.WP_APP_PASSWORD;
  const listId = process.env.ICEGRAM_ASSESSMENT_LIST_ID;

  // Fail silently if WP credentials not yet configured — does not block assessment
  if (!wpUrl || !wpUser || !wpPass || !listId) {
    console.warn('[capture-lead] WP credentials not set — skipping Icegram capture.');
    return res.status(200).json({ captured: false, reason: 'credentials_missing' });
  }

  try {
    const credentials = Buffer.from(`${wpUser}:${wpPass}`).toString('base64');

    const response = await fetch(`${wpUrl}/wp-json/icegram-express/v1/subscribers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${credentials}`,
      },
      body: JSON.stringify({
        email,
        first_name: firstName || '',
        list_id: parseInt(listId, 10),
        source: 'called-to-carry-10q',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[capture-lead] Icegram error:', JSON.stringify(data));
      return res.status(200).json({ captured: false, reason: 'icegram_error' });
    }

    return res.status(200).json({ captured: true });
  } catch (err) {
    console.error('[capture-lead] Network error:', err.message);
    // Always return 200 — never fail the parent assessment flow
    return res.status(200).json({ captured: false, reason: 'network_error' });
  }
}
