'use client'

import { useState } from 'react'
import { Linkedin, Loader2, Sparkles, Copy, CheckCircle2 } from 'lucide-react'
import { useStore } from '@/lib/store'

interface LinkedInData {
  headline: string
  summary: string
  experience: { company: string; bullets: string[] }[]
  skillsToPin: string[]
}

export default function LinkedInOptimizer() {
  const [data, setData] = useState<LinkedInData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [copiedState, setCopiedState] = useState<Record<string, boolean>>({})

  const { resumeData } = useStore()

  const handleGenerate = async () => {
    if (!resumeData.personalInfo.firstName && resumeData.experience.length === 0) {
      setError('Please add some information to your resume in the Builder first.')
      return
    }

    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/optimize-linkedin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData })
      })

      const resData = await response.json()
      
      if (!response.ok) {
        throw new Error(resData.error || 'Failed to optimize LinkedIn profile')
      }

      setData(resData)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedState({ ...copiedState, [id]: true })
    setTimeout(() => setCopiedState(prev => ({ ...prev, [id]: false })), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="w-16 h-16 bg-[#0A66C2]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Linkedin className="w-8 h-8 text-[#0A66C2]" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
          LinkedIn Profile Optimizer
        </h1>
        <p className="text-slate-500 max-w-xl mx-auto">
          Stand out to recruiters. We'll analyze your resume and craft the perfect headline, summary, and experience sections for your LinkedIn profile.
        </p>
      </div>

      {!data && (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-sm mb-8">
          <div className="mb-6 flex justify-center">
             {resumeData.personalInfo.firstName ? (
                <span className="px-4 py-1.5 bg-green-50 text-green-700 rounded-full font-medium flex items-center gap-2 border border-green-200 text-sm">
                  <CheckCircle2 className="w-4 h-4" /> Resume Data Ready
                </span>
              ) : (
                <span className="px-4 py-1.5 bg-orange-50 text-orange-700 rounded-full font-medium border border-orange-200 text-sm">
                  ⚠️ No Resume Data Found (Please go to builder)
                </span>
              )}
          </div>
          
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="btn-primary py-4 px-8 text-lg w-full md:w-auto mx-auto flex items-center justify-center gap-3 bg-[#0A66C2] hover:bg-[#084e96] border-none text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Analyzing Profile...
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6" />
                Generate LinkedIn Profile
              </>
            )}
          </button>
          {error && <p className="mt-4 text-red-500 font-medium">{error}</p>}
        </div>
      )}

      {data && (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-2 px-2">
            <h2 className="text-xl font-bold text-slate-800">Your Optimized Profile</h2>
            <button 
              onClick={handleGenerate}
              disabled={isLoading}
              className="text-sm font-medium text-[#0A66C2] hover:underline flex items-center gap-1"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Regenerate
            </button>
          </div>

          {/* Headline */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-100 p-4 flex justify-between items-center">
              <h3 className="font-semibold text-slate-800">Headline</h3>
              <button 
                onClick={() => handleCopy(data.headline, 'headline')}
                className="text-slate-500 hover:text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 transition-colors"
              >
                {copiedState['headline'] ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                {copiedState['headline'] ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="p-6">
              <p className="text-lg text-slate-800 font-medium">{data.headline}</p>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-100 p-4 flex justify-between items-center">
              <h3 className="font-semibold text-slate-800">About (Summary)</h3>
              <button 
                onClick={() => handleCopy(data.summary, 'summary')}
                className="text-slate-500 hover:text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 transition-colors"
              >
                {copiedState['summary'] ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                {copiedState['summary'] ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="p-6">
              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{data.summary}</p>
            </div>
          </div>

          {/* Top Skills */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-100 p-4">
              <h3 className="font-semibold text-slate-800 mb-1">Top Skills to Pin</h3>
              <p className="text-xs text-slate-500">Add these to your LinkedIn Skills section and pin them to the top.</p>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap gap-2">
                {data.skillsToPin.map((skill, idx) => (
                  <span key={idx} className="bg-blue-50 text-[#0A66C2] px-3 py-1.5 rounded-lg font-medium text-sm border border-blue-100">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Experience */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-100 p-4">
              <h3 className="font-semibold text-slate-800">Experience Highlights</h3>
            </div>
            <div className="p-4 flex flex-col gap-4">
              {data.experience.map((exp, idx) => {
                const textToCopy = exp.bullets.join('\n');
                return (
                  <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-xl relative group">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-bold text-slate-800">{exp.company}</h4>
                      <button 
                        onClick={() => handleCopy(textToCopy, `exp_${idx}`)}
                        className="text-slate-400 hover:text-[#0A66C2] transition-colors"
                        title="Copy bullets"
                      >
                         {copiedState[`exp_${idx}`] ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                    <ul className="list-disc pl-5 space-y-1.5 text-slate-700 text-sm">
                      {exp.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      )}
    </div>
  )
}
