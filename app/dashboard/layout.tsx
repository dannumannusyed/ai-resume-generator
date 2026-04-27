'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  FileText, Briefcase, Settings, Menu, X
} from 'lucide-react'
import { FEATURE_FLAGS } from '@/lib/config'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [timeLeft, setTimeLeft] = useState<{days: number, hours: number, minutes: number, seconds: number} | null>(null)

  useEffect(() => {
    let trialStart = localStorage.getItem('trialStartDate')
    if (!trialStart) {
      trialStart = Date.now().toString()
      localStorage.setItem('trialStartDate', trialStart)
    }
    
    const trialDurationMs = 3 * 24 * 60 * 60 * 1000 // 3 Days
    const expiryDate = parseInt(trialStart) + trialDurationMs

    const calculateTimeLeft = () => {
      const now = Date.now()
      const difference = expiryDate - now

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
  }, [])

  const navLinks = [
    { href: '/dashboard', label: 'Resumes', subtitle: 'Manage documents', icon: FileText },
    { href: '/dashboard/jobs', label: 'Job Matches', subtitle: 'Analyze postings', icon: Briefcase },
  ]

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col bg-white border-r border-slate-200 md:flex">
        <div className="p-6 h-16 flex items-center border-b border-slate-100">
          <Link href="/" className="font-bold text-2xl text-blue-600">
            ResumeMaster
          </Link>
        </div>
        
        <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            
            // Toggle logic for Job Matches
            if (link.label === 'Job Matches' && !FEATURE_FLAGS.jobMatches) {
              return (
                /* 
                <Link key={link.href} href={link.href} ... /> 
                Module: Job Matches is currently commented out as per backend requirement.
                */
                null
              )
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <link.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <div className="flex flex-col justify-center translate-y-[2px]">
                  <span className="text-sm font-bold leading-none mb-1">{link.label}</span>
                  <span className="text-[11px] text-slate-500 leading-none">{link.subtitle}</span>
                </div>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <Link
            href="/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <Settings className="w-5 h-5 text-slate-400" />
            Settings
          </Link>
        </div>
      </aside>

      {/* Mobile Header & Sidebar */}
      <div className="md:hidden flex flex-col absolute inset-0 z-50 pointer-events-none">
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 pointer-events-auto">
          <Link href="/" className="font-bold text-xl text-blue-600">
            ResumeMaster
          </Link>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600 rounded-lg hover:bg-slate-100">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        {isMobileMenuOpen && (
          <div className="flex-1 bg-black/20 pointer-events-auto" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="w-64 bg-white h-full flex flex-col" onClick={e => e.stopPropagation()}>
              <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive 
                          ? 'bg-blue-50 text-blue-700' 
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <link.icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                      {link.label}
                    </Link>
                  )
                })}
              </nav>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden pt-16 md:pt-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex-1"></div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-200">
              <span className="text-xs font-semibold text-blue-600">✨ TRIAL</span>
              <span className="text-sm text-blue-900 font-medium tracking-tight w-24 text-right">
                {timeLeft ? `${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m` : '...'}
              </span>
            </div>
            <Link href="/pricing" className="btn-primary text-sm py-2 px-4 shadow-sm hover:shadow transition-all">
              Upgrade
            </Link>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto w-full">
          {children}
        </div>
      </main>
    </div>
  )
}
