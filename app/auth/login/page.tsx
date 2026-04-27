'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, AlertCircle, Github, Mail } from 'lucide-react'
import { signIn } from 'next-auth/react'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleOAuthLogin = (provider: 'github' | 'google') => {
    signIn(provider, { callbackUrl: '/dashboard' })
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!email || !password) {
        throw new Error('Please fill in all fields')
      }

      // Explicitly sign out first to clear any stale cookies if the user is stuck
      console.log('Attempting login for:', email)
      
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        console.error('NextAuth Error:', result.error)
        if (result.error === 'CredentialsSignin') {
          throw new Error('Invalid email or password. Please check your credentials.')
        } else {
          throw new Error(`Authentication error: ${result.error}`)
        }
      }

      console.log('Login successful, redirecting to dashboard...')
      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      console.error('Login Catch:', err)
      setError(err instanceof Error ? err.message : 'An unexpected error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-3xl font-bold text-blue-600 mb-2">ResumeMaster</div>
          <p className="text-slate-600">AI-Powered Resume Generator</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
            <p className="text-slate-600 mt-2">Login to your account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="label">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input"
                required
              />
            </div>

            <div>
              <label className="label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">Or continue with</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => handleOAuthLogin('github')}
              disabled={loading}
              className="w-full btn border border-slate-300 hover:bg-slate-50 flex items-center justify-center gap-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <Github className="w-5 h-5" />
              GitHub
            </button>
            <button
              type="button"
              onClick={() => handleOAuthLogin('google')}
              disabled={loading}
              className="w-full btn border border-slate-300 hover:bg-slate-50 flex items-center justify-center gap-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <Mail className="w-5 h-5" />
              Google
            </button>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-slate-600">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-blue-600 font-semibold hover:underline">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
