'use client'

import { SessionProvider } from 'next-auth/react'
import { useEffect } from 'react'
import { startKeepAlive } from '@/lib/keep-alive'

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Keep Supabase awake
    const stopKeepAlive = startKeepAlive()
    return () => {
      if (stopKeepAlive) stopKeepAlive()
    }
  }, [])

  return <SessionProvider>{children}</SessionProvider>
}
