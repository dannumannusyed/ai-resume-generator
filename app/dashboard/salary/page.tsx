'use client'

import { useState } from 'react'
import { DollarSign, Sparkles, Copy, Loader2, CheckCircle2 } from 'lucide-react'
import { useStore } from '@/lib/store'

export default function SalaryNegotiation() {
  const [jobTitle, setJobTitle] = useState('')
  const [location, setLocation] = useState('')
  const [strategy, setStrategy] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const { resumeData } = useStore()

  const handleGenerate = async () => {
    if (!jobTitle.trim() || !location.trim()) {
      setError('Please provide a job title and location.')
      return
    }

    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/salary-negotiation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle,
          location,
          resumeData
        })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate strategy')
      }

      setStrategy(data.strategy)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = () => {
    if (!strategy) return
    navigator.clipboard.writeText(strategy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-6 w-full h-full flex flex-col">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center shadow-sm">
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
          Salary Negotiation Assistant
        </h1>
        <p className="text-slate-500 font-medium italic">Get an AI-powered salary negotiation strategy based on your skills and target role.</p>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-8 flex-1 min-h-0">
        
        {/* Left Column - Input */}
        <div className="flex flex-col bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden min-h-[500px]">
          <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
            <h2 className="font-semibold text-slate-800">Role Details</h2>
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
              <label className="block text-sm font-medium text-slate-700 mb-1">Target Job Title</label>
              <input
                type="text"
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                placeholder="e.g. Senior Software Engineer"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
              <input
                type="text"
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                placeholder="e.g. San Francisco, CA or Remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
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
                disabled={isLoading || !jobTitle.trim() || !location.trim()}
                className="w-full btn-primary py-3 px-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing Data...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Negotiation Strategy
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Output */}
        <div className="flex flex-col bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden h-full min-h-[500px]">
          <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
            <h2 className="font-semibold text-slate-800">Your Negotiation Strategy</h2>
            <button 
              onClick={handleCopy}
              disabled={!strategy}
              className="text-sm px-3 py-1.5 flex items-center gap-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-slate-500" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="p-6 flex-1 flex flex-col bg-slate-50/50 overflow-auto">
             {strategy ? (
               <div
                 className="flex-1 w-full prose prose-slate prose-sm max-w-none text-slate-700 whitespace-pre-wrap"
               >
                 {strategy}
               </div>
             ) : (
               <div className="flex-1 flex flex-col items-center justify-center text-center px-8 h-full">
                 <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                   <DollarSign className="w-8 h-8 text-slate-300" />
                 </div>
                 <h3 className="font-medium text-slate-700 mb-1">No strategy yet</h3>
                 <p className="text-sm text-slate-500">Provide a job title and location to get your personalized salary strategy.</p>
               </div>
             )}
          </div>
        </div>

      </div>
    </div>
  )
}
