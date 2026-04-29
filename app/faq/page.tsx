'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ChevronDown, ChevronUp, Sparkles } from 'lucide-react'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      q: "How does the AI tailoring work?",
      a: "Our AI analyzes the job description you provide and compares it with your current resume. it identifies key requirements, skills, and terminology used by the employer, and then suggests optimizations to ensure your resume passes ATS filters and catches the recruiter's eye."
    },
    {
      q: "Is my data secure?",
      a: "Yes, we take security seriously. Your data is encrypted and stored securely. We never sell your personal information to third parties. Your resumes are private to you unless you choose to download or share them."
    },
    {
      q: "What is an ATS and why does it matter?",
      a: "ATS stands for Applicant Tracking System. Most large companies use these systems to automatically scan resumes for keywords before a human even sees them. Our AI is specifically trained to optimize your resume for these systems."
    },
    {
      q: "Can I cancel my subscription anytime?",
      a: "Absolutely. You can cancel your subscription or trial at any time through your account settings. If you cancel during the 3-day trial, you won't be charged anything beyond the initial 1 Rs activation fee."
    },
    {
      q: "How many resumes can I create?",
      a: "With a premium subscription (Weekly or Monthly), you can create and tailor unlimited resumes for as many different job applications as you need."
    },
    {
      q: "Do you offer refunds?",
      a: "Since we provide a 3-day full-access trial for just 1 Rs, we do not offer refunds once a full subscription payment has been processed. We encourage users to evaluate the service during the trial period."
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-blue-600 font-bold mb-8 hover:gap-3 transition-all">
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>

        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-4 h-4" /> Support Center
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Frequently Asked Questions</h1>
          <p className="text-slate-600 text-lg">Everything you need to know about ResumeMaster</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="glass-card rounded-2xl overflow-hidden border-slate-200/60 shadow-sm transition-all hover:shadow-md">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full p-6 text-left flex items-center justify-between group"
              >
                <span className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">{faq.q}</span>
                {openIndex === i ? (
                  <ChevronUp className="w-5 h-5 text-blue-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </button>
              {openIndex === i && (
                <div className="px-6 pb-6 animate-fade-in">
                  <p className="text-slate-600 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-20 p-10 bg-slate-900 rounded-[2.5rem] text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.1),transparent)]" />
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-white mb-4">Still have questions?</h2>
            <p className="text-slate-400 mb-8">We're here to help you land your dream job. Reach out to our support team.</p>
            <a href="mailto:support@resumemaster.app" className="btn-primary px-8 py-4 inline-block rounded-2xl font-bold">
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
