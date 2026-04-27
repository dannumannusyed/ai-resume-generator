import { createServerSupabaseClient } from './supabase'
import { isAdmin } from './auth-utils'

export type SubscriptionStatus = {
  hasAccess: boolean
  isTrial: boolean
  plan: string
  status: string
  error?: string
}

/**
 * Server-side utility to verify if a user has access to premium/AI features.
 * Use this in API routes.
 */
export async function checkSubscriptionAccess(
  userId: string,
  email?: string | null
): Promise<SubscriptionStatus> {
  // 1. Admin Bypass
  if (email && isAdmin(email)) {
    return {
      hasAccess: true,
      isTrial: false,
      plan: 'admin',
      status: 'active'
    }
  }

  const db = createServerSupabaseClient()

  // 2. Fetch subscription
  const { data: subscription, error } = await db
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('[SUBSCRIPTION CHECK ERROR]:', error)
    return { hasAccess: false, isTrial: false, plan: 'none', status: 'error', error: error.message }
  }

  // 3. No subscription found
  if (!subscription) {
    return {
      hasAccess: false,
      isTrial: false,
      plan: 'none',
      status: 'none'
    }
  }

  // 4. Check if expired
  const now = new Date()
  const expiry = subscription.current_period_end ? new Date(subscription.current_period_end) : null
  const isExpired = expiry ? now > expiry : false
  const isActive = subscription.status === 'active' && !isExpired

  return {
    hasAccess: isActive,
    isTrial: subscription.plan === 'trial',
    plan: subscription.plan,
    status: isActive ? 'active' : 'expired'
  }
}
