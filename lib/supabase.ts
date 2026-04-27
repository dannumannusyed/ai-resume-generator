import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// ── Browser / client-side singleton ──────────────────────────────────────────
// We use a getter to avoid initializing during build time if keys are missing
export const supabase = (function() {
  if (typeof window !== 'undefined' || (supabaseUrl && supabaseAnonKey)) {
    return createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder')
  }
  return null as any
})()

// ── Server-side admin client (bypasses RLS) ───────────────────────────────────
export function createServerSupabaseClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || supabaseUrl === '') {
     console.error('CRITICAL: NEXT_PUBLIC_SUPABASE_URL is missing!')
     // Return a dummy client to avoid crashing build, but it will fail at runtime
     return createClient('https://placeholder.supabase.co', 'placeholder')
  }

  if (!serviceRoleKey) {
    return createClient(supabaseUrl, supabaseAnonKey)
  }
  
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// ── Database Types ────────────────────────────────────────────────────────────
export type Resume = {
  id: string
  user_id: string
  name: string
  content: string | null
  resume_data: Record<string, any> | null
  ats_score: number
  job_role: string | null
  is_tailored: boolean
  created_at: string
  updated_at: string
}

export type Profile = {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  trial_started_at: string
  created_at: string
}

export type Subscription = {
  id: string
  user_id: string
  plan: 'trial' | 'weekly' | 'yearly'
  status: 'active' | 'expired' | 'cancelled'
  razorpay_payment_id: string | null
  current_period_end: string | null
  created_at: string
}
