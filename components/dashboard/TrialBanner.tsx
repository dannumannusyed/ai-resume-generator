'use client'

import Link from 'next/link'
import { Sparkles } from 'lucide-react'

interface TrialBannerProps {
  timeLeft: { days: number; hours: number; minutes: number; seconds: number } | null
}

export default function TrialBanner({ timeLeft }: TrialBannerProps) {
  if (!timeLeft) return null

  const isExpired = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0

  return (
    <div className={`border rounded-2xl p-6 mb-8 flex items-center justify-between shadow-sm transition-all ${
      isExpired 
        ? 'bg-gradient-to-r from-rose-50 to-red-50 border-red-200' 
        : 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200'
    }`}>
      <div>
        <p className={`font-bold mb-1 flex items-center gap-2 ${isExpired ? 'text-red-900' : 'text-blue-900'}`}>
          {isExpired ? '🚫 Trial Expired' : '✨ 3-Day Free Trial Active'}
        </p>
        <p className={`text-sm ${isExpired ? 'text-red-800' : 'text-blue-800'}`}>
          {isExpired ? (
            'Your trial has expired. Upgrade now to unlock AI tailoring and job matching.'
          ) : (
            <>
              Your trial expires in <strong className="font-mono bg-white/50 px-2 py-0.5 rounded border border-blue-200">
                {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
              </strong>. Upgrade now for unlimited access.
            </>
          )}
        </p>
      </div>
      <Link href="/pricing" className={`btn-primary whitespace-nowrap shadow-md hover:shadow-lg transition-all ${
        isExpired ? 'bg-red-600 hover:bg-red-700 shadow-red-100' : ''
      }`}>
        {isExpired ? 'Renew Now' : 'Upgrade Now'}
      </Link>
    </div>
  )
}
