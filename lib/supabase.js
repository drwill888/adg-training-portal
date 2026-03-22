// lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Guard against missing env vars during build
if (!supabaseUrl || !supabaseAnonKey) {
  if (typeof window !== 'undefined') {
    console.error('Missing Supabase environment variables')
  }
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
)
// Server-side admin client for training bot API routes
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseServiceKey)
  : null