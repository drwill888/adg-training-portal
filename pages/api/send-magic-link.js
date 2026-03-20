// pages/api/send-magic-link.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { email, name } = req.body
  if (!email || !name) return res.status(400).json({ error: 'Email and name required' })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: 'Supabase not configured. URL: ' + (supabaseUrl ? 'set' : 'missing') + ', Key: ' + (supabaseKey ? 'set' : 'missing') })
  }

  try {
    const response = await fetch(`${supabaseUrl}/auth/v1/otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({
        email,
        data: { full_name: name },
        create_user: true,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return res.status(400).json({ error: data.message || data.error || 'Failed to send magic link' })
    }

    return res.status(200).json({ success: true })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
