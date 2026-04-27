'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sparkles, LayoutDashboard, LogOut } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'

export function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()

  // Hide Navbar completely on auth pages for a cleaner interface
  if (pathname?.startsWith('/auth')) {
    return null
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl text-blue-600 flex items-center gap-2">
          <Sparkles className="w-6 h-6" />
          ResumeMaster
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/#features" className="text-sm text-slate-600 hover:text-slate-900 hidden sm:block">
            Features
          </Link>
          <Link href="/#pricing" className="text-sm text-slate-600 hover:text-slate-900 hidden sm:block">
            Pricing
          </Link>
          
          {session ? (
            <>
              <Link href="/dashboard" className="text-sm text-slate-600 hover:text-blue-600 flex items-center gap-1">
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <button 
                onClick={() => signOut({ callbackUrl: '/' })} 
                className="btn-ghost flex items-center gap-1 text-rose-500 hover:text-rose-600 hover:bg-rose-50"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
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
      </div>
    </nav>
  )
}
