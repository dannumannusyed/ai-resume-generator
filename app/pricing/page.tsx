'use client'

import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function Pricing() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const plans = [
    {
      name: 'Weekly Access',
      price: '79 Rs',
      billing: '/week',
      description: 'Perfect for quick resume touch-ups',
      features: [
        'Unlimited AI Tailoring',
        'ATS Expert Analysis',
        'No Watermarks',
        'Professional Templates',
        'Priority Support',
      ],
      cta: 'Get Weekly Access',
      highlighted: false,
      priceId: 'weekly',
    },
    {
      name: 'Monthly Access',
      price: '129 Rs',
      billing: '/month',
      description: 'The best value for serious job seekers',
      features: [
        'Unlimited AI Tailoring',
        'Everything in Weekly',
        'Premium Layouts',
        'Beta Feature Access',
        'Resume Versioning',
      ],
      cta: 'Get Monthly Access',
      highlighted: true,
      priceId: 'monthly',
    },
  ]


  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handleRazorpayCheckout = async (plan: any) => {
    if (!session) {
      router.push('/auth/login?callbackUrl=/pricing')
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
      // 1. Create order on server
      const orderRes = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseInt(plan.price.replace(/[^0-9]/g, '')),
          planId: plan.priceId,
        }),
      })

      const orderData = await orderRes.json()

      if (orderData.error) {
        throw new Error(orderData.error)
      }

      // 2. Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'ResumeMaster',
        description: `Payment for ${plan.name}`,
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
                planId: plan.priceId
              })
            })

            if (verifyRes.ok) {
              alert('Payment Successful! Your PRO features are now active.')
              router.push('/dashboard')
            } else {
              const verifyData = await verifyRes.json()
              alert('Payment verification failed: ' + (verifyData.error || 'Unknown error'))
            }
          } catch (err) {
            console.error('Verification error:', err)
            alert('Error verifying payment. Please contact support.')
          }
        },
        prefill: {
          name: session?.user?.name || 'Job Seeker',
          email: session?.user?.email || 'seeker@example.com',
        },
        notes: {
          plan: plan.name,
        },
        theme: {
          color: '#2563eb', // blue-600
        },
      }

      const paymentObject = new (window as any).Razorpay(options)
      paymentObject.open()

    } catch (err: any) {
      console.error('Checkout error:', err)
      alert(err.message || 'Payment initiation failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-20 px-6 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="section-heading mb-4 text-5xl">Simple, Transparent Pricing</h1>
          <p className="section-subheading text-lg sm:text-xl">Start your career with AI-powered resume tailoring</p>
          
          {/* Trial Banner */}
          <div className="mt-8 inline-block bg-blue-100 border border-blue-300 rounded-lg px-4 py-3 sm:px-6">
            <p className="text-blue-900 font-semibold text-sm sm:text-base">✨ Try it free for 3 days! Unrestricted access after starting trial (Autopay enabled).</p>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto gap-8 mb-12">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`card p-8 flex flex-col relative ${
                plan.highlighted ? 'ring-2 ring-blue-600 transform md:scale-105 z-10' : ''
              }`}
            >
              {plan.highlighted && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-blue-600 text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                  Most Popular
                </div>
              )}

              <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
              <p className="text-slate-600 mb-6 text-sm">{plan.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                <span className="text-slate-600">{plan.billing}</span>
              </div>

              <button
                onClick={() => handleRazorpayCheckout(plan)}
                disabled={loading}
                className={`py-3 rounded-lg font-semibold mb-8 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  plan.highlighted ? 'btn-primary' : 'btn-secondary'
                }`}
              >
                {loading ? 'Processing...' : plan.cta}
              </button>

              <div className="space-y-4">
                {plan.features.map((feature, j) => (
                  <div key={j} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">Frequently Asked Questions</h2>

          <div className="space-y-4">
            {[
              {
                q: 'Can I upgrade or downgrade anytime?',
                a: 'Yes! You can change your plan anytime. Changes take effect at the start of your next billing cycle.',
              },
              {
                q: 'What is the refund policy?',
                a: 'We do not offer refunds, but you can cancel your 3-day trial anytime before it ends to avoid being charged.',
              },
              {
                q: 'What happens to my resumes when I cancel?',
                a: 'Your resumes remain accessible. You can still download them, but you can\'t generate new ones.',
              },
              {
                q: 'Is there a contract?',
                a: 'No! All plans are month-to-month or annual. Cancel anytime, no strings attached.',
              },
              {
                q: 'Do you offer team plans?',
                a: 'Coming soon! We\'re building team collaboration features. Email us for early access.',
              },
            ].map((faq, i) => (
              <div key={i} className="card p-6">
                <h3 className="font-bold text-slate-900 mb-2">{faq.q}</h3>
                <p className="text-slate-600 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-slate-600 mb-6">
            Have questions? <a href="mailto:support@resumemaster.app" className="text-blue-600 font-semibold hover:underline">
              Contact us
            </a>
          </p>
          <Link href="/signup" className="inline-block btn-primary px-8 py-4 text-lg">
            Start Your Free Trial
          </Link>
        </div>
      </div>
    </div>
  )
}
