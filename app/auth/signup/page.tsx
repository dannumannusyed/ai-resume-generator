'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, ArrowRight, AlertCircle, CheckCircle, Sparkles, User, Lock } from 'lucide-react'
import { signIn } from 'next-auth/react'

export default function SignUp() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (!email || !password || !name) {
        throw new Error('Please fill in all fields')
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters')
      }

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sign up')
      }

      setSuccess('Account created successfully! Signing you in...')
      
      // Auto-login after signup
      const loginResult = await signIn('credentials', {
        email,
        password,
        redirect: false
      })

      if (loginResult?.error) {
        setSuccess('')
        throw new Error('Verification required or account error. Please try logging in.')
      }

      setTimeout(() => {
        router.push('/trial')
        router.refresh()
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthSignup = async (provider: 'github' | 'google') => {
    try {
      console.log(`Attempting ${provider} signup...`)
      const result = await signIn(provider, { 
        callbackUrl: '/trial',
        redirect: true 
      })
      console.log(`${provider} signup result:`, result)
    } catch (err) {
      console.error(`${provider} signup failed:`, err)
      alert(`Social signup failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50/30 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-400/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="text-2xl font-black text-slate-900 tracking-tight">ResumeMaster</div>
              <div className="text-xs text-blue-600 font-bold uppercase tracking-widest">AI Career Suite</div>
            </div>
          </Link>
        </div>

        {/* Card */}
        <div className="glass-card rounded-[2.5rem] p-10 space-y-8 animate-fade-in border-white/40">
          <div className="text-center">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Create Account</h1>
            <p className="text-slate-500 mt-2 font-medium">Join 10,000+ job seekers today</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start gap-3 animate-slide-in">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-800 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-100 rounded-2xl p-4 flex items-start gap-3 animate-slide-in">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <p className="text-green-800 text-sm font-medium">{success}</p>
            </div>
          )}

          {/* Sign Up Form */}
          <form onSubmit={handleSignUp} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="input h-14 bg-white/50 border-slate-200/60 rounded-2xl focus:ring-4 focus:ring-blue-100/50 pl-11"
                  required
                />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input h-14 bg-white/50 border-slate-200/60 rounded-2xl focus:ring-4 focus:ring-blue-100/50 pl-11"
                  required
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input h-14 bg-white/50 border-slate-200/60 rounded-2xl focus:ring-4 focus:ring-blue-100/50 pl-11"
                  required
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 ml-1">Minimum 6 characters</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full h-14 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-blue-200 hover:shadow-blue-300 transition-all disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Build My Resume'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/20 backdrop-blur-sm text-slate-400 font-bold uppercase tracking-widest">Or Secure Link</span>
            </div>
          </div>

          {/* Social Sign Up */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleOAuthSignup('github')}
              disabled={loading}
              className="h-14 rounded-2xl border border-slate-200 bg-white/50 hover:bg-white flex items-center justify-center gap-2 transition-all font-bold text-slate-700 disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
              GitHub
            </button>
            <button
              type="button"
              onClick={() => handleOAuthSignup('google')}
              disabled={loading}
              className="h-14 rounded-2xl border border-slate-200 bg-white/50 hover:bg-white flex items-center justify-center gap-2 transition-all font-bold text-slate-700 disabled:opacity-50"
            >
              <Mail className="w-5 h-5 text-red-500" />
              Google
            </button>
          </div>

          {/* Login Link */}
          <p className="text-center text-slate-500 font-medium">
            Already a member?{' '}
            <Link href="/auth/login" className="text-blue-600 font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span>✓ 3 Free Credits</span>
            <span>✓ ATS Optimized</span>
            <span>✓ SSL Secured</span>
          </div>
        </div>
      </div>
    </div>
  )
}
