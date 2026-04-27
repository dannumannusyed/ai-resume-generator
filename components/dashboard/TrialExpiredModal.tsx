'use client'

import { AlertTriangle, Lock, ArrowRight, X } from 'lucide-react'
import Link from 'next/link'

interface TrialExpiredModalProps {
  onClose: () => void
}

export default function TrialExpiredModal({ onClose }: TrialExpiredModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="relative p-10 text-center">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto mb-8 rotate-3 shadow-lg shadow-rose-100">
            <AlertTriangle className="w-10 h-10 text-rose-500" />
          </div>

          <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Your trial has expired!</h2>
          <p className="text-slate-500 mb-10 leading-relaxed">
            We hope you enjoyed using our AI features! To continue generating 
            <span className="text-slate-900 font-bold"> AI-tailored resumes</span> and accessing 
            <span className="text-slate-900 font-bold"> job-specific insights</span>, please upgrade to a premium plan.
          </p>

          <div className="space-y-4">
            <Link 
              href="/pricing"
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-[0.98]"
            >
              Upgrade Now
              <ArrowRight className="w-5 h-5" />
            </Link>
            
            <div className="p-4 bg-slate-50 rounded-2xl flex items-center gap-3 text-left">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                <Lock className="w-5 h-5 text-slate-400" />
              </div>
              <p className="text-xs text-slate-500 leading-tight">
                Basic resume building via questionnaire remains free, but AI features require a subscription.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
