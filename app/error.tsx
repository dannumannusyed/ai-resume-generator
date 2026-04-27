// Custom Next.js error page
'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 px-4">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <AlertTriangle className="w-16 h-16 text-red-600 mx-auto" />
        </div>

        <h1 className="text-3xl font-bold text-slate-900 mb-2">Something went wrong</h1>
        <p className="text-slate-600 mb-6">We encountered an unexpected error. Please try again.</p>

        {error.message && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-red-700 font-mono">{error.message}</p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => reset()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Try again
          </button>
          <Link
            href="/"
            className="w-full bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold py-3 rounded-lg transition block"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
