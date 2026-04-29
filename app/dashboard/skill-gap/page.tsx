'use client'

import { useState } from 'react'
import { Target, Sparkles, Copy, Loader2, CheckCircle2 } from 'lucide-react'
import { useStore } from '@/lib/store'

export default function SkillGap() {
  const [targetRole, setTargetRole] = useState('')
  const [analysis, setAnalysis] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const { resumeData } = useStore()

  const handleGenerate = async () => {
    if (!targetRole.trim()) {
      setError('Please provide a target role.')
      return
    }

    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/skill-gap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole,
          resumeData
        })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate gap analysis')
      }

      setAnalysis(data.gapAnalysis)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = () => {
    if (!analysis) return
    navigator.clipboard.writeText(analysis)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-6 w-full h-full flex flex-col">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2 flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center shadow-sm">
            <Target className="w-6 h-6 text-orange-600" />
          </div>
          Skill Gap Analysis
        </h1>
        <p className="text-slate-500 font-medium italic">Find exactly what skills you're missing to land your target role.</p>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-8 flex-1 min-h-0">
        
        {/* Left Column - Input */}
        <div className="flex flex-col bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden min-h-[400px]">
          <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
            <h2 className="font-semibold text-slate-800">Target Role</h2>
            {resumeData?.personalInfo?.firstName ? (
              <span className="text-xs px-2.5 py-1 bg-green-100 text-green-700 rounded-full font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Resume Context Active
              </span>
            ) : (
              <span className="text-xs px-2.5 py-1 bg-orange-100 text-orange-700 rounded-full font-medium">
                No Resume Data
              </span>
            )}
          </div>
          <div className="p-6 flex-1 flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">What is your dream job / next step?</label>
              <input
                type="text"
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                placeholder="e.g. Lead Cloud Architect"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
              />
            </div>
            {error && (
              <div className="p-3 text-sm text-red-600 border border-red-200 bg-red-50 rounded-lg">
                {error}
              </div>
            )}
            <div className="mt-auto pt-4">
              <button
                onClick={handleGenerate}
                disabled={isLoading || !targetRole.trim()}
                className="w-full btn-primary py-3 px-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-semibold transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Finding Gaps...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Analyze Skill Gap
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Output */}
        <div className="flex flex-col bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden h-full min-h-[500px]">
          <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
            <h2 className="font-semibold text-slate-800">Gap Analysis & Course Plan</h2>
            <button 
              onClick={handleCopy}
              disabled={!analysis}
              className="text-sm px-3 py-1.5 flex items-center gap-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-slate-500" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="p-6 flex-1 flex flex-col bg-slate-50/50 overflow-auto">
             {analysis ? (
               <div
                 className="flex-1 w-full prose prose-slate prose-sm max-w-none text-slate-700 whitespace-pre-wrap"
               >
                 {analysis}
               </div>
             ) : (
               <div className="flex-1 flex flex-col items-center justify-center text-center px-8 h-full">
                 <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                   <Target className="w-8 h-8 text-slate-300" />
                 </div>
                 <h3 className="font-medium text-slate-700 mb-1">No analysis yet</h3>
                 <p className="text-sm text-slate-500">Provide a target role to find out exactly what skills you're missing.</p>
               </div>
             )}
          </div>
        </div>

      </div>
    </div>
  )
}
