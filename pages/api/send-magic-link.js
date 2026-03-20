// pages/api/send-magic-link.js
import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { email, name } = req.body
  if (!email || !name) return res.status(400).json({ error: 'Email and name required' })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({
      error: `Supabase env vars missing. URL: ${supabaseUrl ? 'set' : 'MISSING'}, Key: ${supabaseKey ? 'set' : 'MISSING'}`
    })
  }

  // Create a fresh server-side client
  const supabase = createClient(supabaseUrl, supabaseKey)

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: 'https://adg-training-portal.vercel.app/auth/callback',
      data: { full_name: name },
      shouldCreateUser: true,
    },
  })

  if (error) {
    console.error('Magic link error:', error)
    return res.status(400).json({ error: error.message })
  }

  return res.status(200).json({ success: true })
}
