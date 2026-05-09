'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  FileText, Briefcase, Settings, Menu, X, Sparkles
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { FEATURE_FLAGS } from '@/lib/config'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [timeLeft, setTimeLeft] = useState<{days: number, hours: number, minutes: number, seconds: number} | null>(null)
  const [checkingAccess, setCheckingAccess] = useState(true)
  const [isTrialUser, setIsTrialUser] = useState(true)
  const [trialExpiryDate, setTrialExpiryDate] = useState<number | null>(null)

  useEffect(() => {
    async function checkAccess() {
      if (!session) return
      try {
        const res = await fetch('/api/user/subscription')
        if (res.ok) {
          const { data } = await res.json()
          if (!data || !data.has_access) {
            // If they previously had a plan (trial or paid) and it expired, send them to pricing.
            // Only send completely new users (plan_id === 'none') to the trial gate.
            if (data && data.plan_id !== 'none') {
              router.push('/pricing')
            } else {
              router.push('/trial')
            }
            return
          }
          setIsTrialUser(data.is_trial)
          if (data.is_trial && data.current_period_end) {
            setTrialExpiryDate(new Date(data.current_period_end).getTime())
          } else if (!data.is_trial) {
            localStorage.setItem('is_paid_user', 'true')
          }
        }
      } catch (err) {
        console.error('Dashboard Access Check Error:', err)
      } finally {
        setCheckingAccess(false)
      }
    }
    checkAccess()
  }, [session, router])

  useEffect(() => {
    if (!isTrialUser || !trialExpiryDate) return // Don't run timer for paid users or without expiry

    const calculateTimeLeft = () => {
      const now = Date.now()
      const difference = trialExpiryDate - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [isTrialUser, trialExpiryDate])

  const navLinks = [
    { href: '/dashboard', label: 'Resumes', subtitle: 'Manage documents', icon: FileText },
    { href: '/dashboard/jobs', label: 'Job Matches', subtitle: 'Analyze postings', icon: Briefcase },
  ]

  if (checkingAccess && session) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Desktop & Mobile Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-[70] w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 transform md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 h-20 flex items-center border-b border-slate-100 shrink-0">
          <Link href="/" className="font-black text-2xl text-slate-900 tracking-tight flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg">
               <Sparkles className="w-5 h-5" />
            </div>
            ResumeMaster
          </Link>
        </div>
        
        <nav className="flex-1 overflow-y-auto px-4 py-8 space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            const Icon = link.icon
            
            if (link.label === 'Job Matches' && !FEATURE_FLAGS.jobMatches) return null

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
                <div className="flex flex-col justify-center">
                  <span className={`text-sm font-bold leading-none mb-1 ${isActive ? 'text-white' : 'text-slate-700'}`}>{link.label}</span>
                  <span className={`text-[10px] leading-none uppercase tracking-widest font-black ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>{link.subtitle}</span>
                </div>
              </Link>
            )
          })}
        </nav>

        <div className="p-6 border-t border-slate-100">
          <Link
            href="/settings"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 ${
              pathname === '/settings' 
                ? 'bg-slate-900 text-white shadow-xl' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Settings className={`w-5 h-5 ${pathname === '/settings' ? 'text-white' : 'text-slate-400'}`} />
            <div className="flex flex-col justify-center">
              <span className={`text-sm font-bold leading-none mb-1 ${pathname === '/settings' ? 'text-white' : 'text-slate-700'}`}>Settings</span>
              <span className={`text-[10px] leading-none uppercase tracking-widest font-black ${pathname === '/settings' ? 'text-slate-400' : 'text-slate-400'}`}>Account & Profile</span>
            </div>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 text-slate-500 hover:text-slate-900 md:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex-1">
              {pathname !== '/dashboard' && (
                 <Link href="/dashboard" className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] hover:text-blue-600 transition-colors flex items-center gap-2">
                   ← Back
                 </Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            {isTrialUser ? (
              <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-blue-50/50 rounded-xl border border-blue-100 shadow-inner">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Trial Ending in</span>
                <span className="text-sm text-blue-900 font-bold tracking-tight">
                  {timeLeft ? `${timeLeft.days}d ${timeLeft.hours}h` : '...'}
                </span>
              </div>
            ) : (
              <Link href="/pricing" className="btn-primary text-sm py-2.5 px-4 md:px-6 shadow-lg shadow-blue-100 hover:shadow-blue-200 transition-all font-bold rounded-xl whitespace-nowrap">
                Upgrade Pro
              </Link>
            )}
          </div>
        </header>
        <div className="flex-1 overflow-y-auto w-full bg-slate-50/30">
          {children}
        </div>
      </main>
    </div>
  )
}
