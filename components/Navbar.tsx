'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sparkles, LayoutDashboard, LogOut, Menu, X } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'

export function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Hide Navbar completely on app-specific pages for a cleaner interface
  if (pathname?.startsWith('/auth') || pathname?.startsWith('/dashboard') || pathname?.startsWith('/builder') || pathname?.startsWith('/settings') || pathname?.startsWith('/trial')) {
    return null
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl text-blue-600 flex items-center gap-2 z-50">
            <Sparkles className="w-6 h-6" />
            ResumeMaster
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/#features" className="text-sm text-slate-600 hover:text-slate-900">
              Features
            </Link>
            <Link href="/#pricing" className="text-sm text-slate-600 hover:text-slate-900">
              Pricing
            </Link>
            
            {session ? (
              <>
                <Link href="/dashboard" className="text-sm text-slate-600 hover:text-blue-600 flex items-center gap-1">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <button 
                  onClick={() => signOut({ callbackUrl: '/' })} 
                  className="btn-ghost flex items-center gap-1 text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="btn-ghost">
                  Login
                </Link>
                <Link href="/auth/signup" className="btn-primary">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden flex items-center z-50">
            <button
              onClick={toggleMobileMenu}
              className="p-2 -mr-2 text-slate-600 hover:text-slate-900 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white md:hidden flex flex-col pt-20 px-4 pb-6 overflow-y-auto">
          <div className="flex flex-col gap-6 items-center">
            <Link href="/#features" onClick={toggleMobileMenu} className="text-lg font-bold text-slate-600 hover:text-slate-900">
              Features
            </Link>
            <Link href="/#pricing" onClick={toggleMobileMenu} className="text-lg font-bold text-slate-600 hover:text-slate-900">
              Pricing
            </Link>

            {session ? (
              <>
                <Link href="/dashboard" onClick={toggleMobileMenu} className="text-lg font-bold text-blue-600 flex items-center gap-2">
                  <LayoutDashboard className="w-5 h-5" />
                  Dashboard
                </Link>
                <button 
                  onClick={() => signOut({ callbackUrl: '/' })} 
                  className="text-lg font-bold text-rose-500 hover:text-rose-600 flex items-center gap-2"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-4 w-full max-w-xs mt-4">
                <Link href="/auth/login" onClick={toggleMobileMenu} className="btn-secondary w-full text-center py-3">
                  Login
                </Link>
                <Link href="/auth/signup" onClick={toggleMobileMenu} className="btn-primary w-full text-center py-3">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
