'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { CheckCircle2, Sparkles, Rocket, ShieldCheck, Zap, ChevronRight, Lock } from 'lucide-react'

export default function TrialGate() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function checkSub() {
      if (!session) return
      try {
        const res = await fetch('/api/user/subscription')
        if (res.ok) {
          const { data } = await res.json()
          if (data && data.plan_id !== 'none' && data.status === 'active') {
            router.push('/dashboard')
          }
        }
      } catch (e) {
        console.error('Check sub failed:', e)
      }
    }
    checkSub()
  }, [session, router])

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handleStartTrial = async () => {
    if (!session) {
      router.push('/auth/login?callbackUrl=/trial')
      return
    }
    setLoading(true)
    const res = await loadRazorpay()

    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?')
      setLoading(false)
      return
    }

    try {
      const orderRes = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: 'free' }),
      })

      const orderData = await orderRes.json()
      if (orderData.error) throw new Error(orderData.error)

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'ResumeMaster',
        description: '3-Day Full Access Trial',
        order_id: orderData.id,
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                planId: 'free'
              })
            })

            if (verifyRes.ok) {
              alert('Trial Activated! Redirecting to Dashboard...')
              router.push('/dashboard')
            } else {
              const verifyData = await verifyRes.json()
              alert('Activation failed: ' + (verifyData.error || 'Unknown error'))
            }
          } catch (err) {
            console.error('Verification error:', err)
            alert('Error activating trial. Please contact support.')
          }
        },
        prefill: {
          name: session?.user?.name || '',
          email: session?.user?.email || '',
        },
        theme: { color: '#2563eb' },
      }

      const paymentObject = new (window as any).Razorpay(options)
      paymentObject.open()
    } catch (err: any) {
      console.error('Trial activation error:', err)
      alert(err.message || 'Trial initiation failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-6 selection:bg-blue-500/30 overflow-hidden relative">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>
      
      <div className="max-w-5xl w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Storytelling */}
          <div className="space-y-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest animate-bounce">
              <Sparkles className="w-3.5 h-3.5" /> Welcome to the Future
            </div>
            
            <div className="space-y-6">
              <h1 className="text-6xl font-black leading-[1.1] tracking-tight">
                One Step Closer to Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400">Dream Job.</span>
              </h1>
              <p className="text-slate-400 text-xl leading-relaxed max-w-lg">
                Activate your premium trial to access elite AI resume tools designed by ATS experts.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {[
                { icon: Zap, text: 'Unlimited AI-Powered Tailoring', desc: 'Match any job description perfectly.', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
                { icon: Rocket, text: 'Real-time ATS Score Prediction', desc: 'Know your chances before you apply.', color: 'text-blue-400', bg: 'bg-blue-400/10' },
                { icon: ShieldCheck, text: 'Designer Premium Templates', desc: 'Stand out from the crowd instantly.', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 group">
                  <div className={`p-3 rounded-2xl ${item.bg} border border-white/5 group-hover:border-white/20 transition-all ${item.color}`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-slate-100 font-bold text-lg">{item.text}</h3>
                    <p className="text-slate-500 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Activation Card */}
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-[2.5rem] blur opacity-30 animate-pulse" />
            
            <div className="relative bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl space-y-10 overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Lock className="w-32 h-32" />
              </div>

              <div className="text-center space-y-3 relative">
                <h2 className="text-sm font-bold text-blue-400 uppercase tracking-[0.2em]">Limited Time Trial</h2>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-6xl font-black tracking-tighter">1 Rs</span>
                  <span className="text-slate-500 font-medium">/3 days</span>
                </div>
                <p className="text-slate-400 text-sm">Full unrestricted access to all features</p>
              </div>

              <div className="space-y-6 relative">
                <button
                  onClick={handleStartTrial}
                  disabled={loading}
                  className="w-full group relative overflow-hidden py-5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xl shadow-[0_0_40px_rgba(37,99,235,0.3)] transition-all hover:shadow-[0_0_50px_rgba(37,99,235,0.5)] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:animate-shimmer" />
                  {loading ? 'Processing...' : 'ACTIVATE MY ACCESS'}
                  <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">PCI-DSS Secure Payment</span>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                  CANCEL ANYTIME
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                  INSTANT SETUP
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Bar */}
        <div className="mt-20 pt-10 border-t border-white/5 text-center space-y-6">
          <p className="text-slate-500 text-sm font-medium uppercase tracking-[0.3em]">Built for high-performance careers</p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 grayscale opacity-30 hover:opacity-50 transition-opacity">
            <span className="text-xl font-black">Google</span>
            <span className="text-xl font-black">Meta</span>
            <span className="text-xl font-black">Netflix</span>
            <span className="text-xl font-black">Amazon</span>
            <span className="text-xl font-black">Microsoft</span>
          </div>
        </div>
      </div>
    </div>
  )
}
