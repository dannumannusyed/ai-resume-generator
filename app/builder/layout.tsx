'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function BuilderLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkAccess() {
      if (!session) return
      
      try {
        const res = await fetch('/api/user/subscription')
        if (res.ok) {
          const { data } = await res.json()
          if (!data || data.plan_id === 'none') {
            router.push('/trial')
            return
          }
          if (!data.has_access) {
            router.push('/pricing')
            return
          }
        }
      } catch (err) {
        console.error('Builder Access Check Error:', err)
      } finally {
        setLoading(false)
      }
    }

    checkAccess()
  }, [session, router])

  if (loading && session) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  return <>{children}</>
}
