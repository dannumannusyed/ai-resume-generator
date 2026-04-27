import { supabase } from './supabase'

/**
 * Periodically pings Supabase to prevent the project from pausing (free tier).
 * Pings every 5 minutes while the app is active.
 */
export function startKeepAlive() {
  if (typeof window === 'undefined') return

  console.log('[KEEP-ALIVE]: Starting Supabase activity pinger...')
  
  const ping = async () => {
    try {
      // Simple lightweight query to check connection
      const { error } = await supabase.from('profiles').select('id').limit(1)
      if (error) {
        console.warn('[KEEP-ALIVE]: Supabase ping failed (might be paused):', error.message)
      } else {
        console.log('[KEEP-ALIVE]: Supabase is active.')
      }
    } catch (e) {
      console.error('[KEEP-ALIVE]: Unexpected error during ping:', e)
    }
  }

  // Initial ping
  ping()

  // Set interval (5 minutes)
  const interval = setInterval(ping, 5 * 60 * 1000)

  return () => clearInterval(interval)
}
