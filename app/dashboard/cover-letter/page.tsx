'use client'

import { useState } from 'react'
import { FileSignature, Sparkles, Copy, Loader2, CheckCircle2 } from 'lucide-react'
import { useStore } from '@/lib/store'

export default function CoverLetter() {
  const [jobPosting, setJobPosting] = useState('')
  const [coverLetter, setCoverLetter] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const { resumeData } = useStore()

  const handleGenerate = async () => {
    if (!jobPosting.trim()) {
      setError('Please provide a job description.')
      return
    }

    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/generate-cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobPosting,
          resumeData
        })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate cover letter')
      }

      setCoverLetter(data.coverLetter)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = () => {
    if (!coverLetter) return
    navigator.clipboard.writeText(coverLetter)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-6 w-full h-full flex flex-col">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2 flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center shadow-sm">
            <FileSignature className="w-6 h-6 text-indigo-600" />
          </div>
          AI Cover Letter Generator
        </h1>
        <p className="text-slate-500 font-medium italic">Paste a job description and generate a highly tailored cover letter in seconds.</p>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-8 flex-1 min-h-0">
        
        {/* Left Column - Input */}
        <div className="flex flex-col bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden h-[calc(100vh-12rem)] min-h-[500px]">
          <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
            <h2 className="font-semibold text-slate-800">Target Job Description</h2>
            {resumeData.personalInfo.firstName ? (
              <span className="text-xs px-2.5 py-1 bg-green-100 text-green-700 rounded-full font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Resume Loaded
              </span>
            ) : (
              <span className="text-xs px-2.5 py-1 bg-orange-100 text-orange-700 rounded-full font-medium">
                No Resume Data (Go to Builder)
              </span>
            )}
          </div>
          <div className="p-6 flex-1 flex flex-col">
            <textarea
              className="flex-1 w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none mb-4"
              placeholder="Paste the target job description here..."
              value={jobPosting}
              onChange={(e) => setJobPosting(e.target.value)}
            />
            {error && (
              <div className="p-3 mb-4 text-sm text-red-600 border border-red-200 bg-red-50 rounded-lg">
                {error}
              </div>
            )}
            <button
              onClick={handleGenerate}
              disabled={isLoading || !jobPosting.trim()}
              className="w-full btn-primary py-3 px-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Magic...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Cover Letter
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column - Output */}
        <div className="flex flex-col bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden h-[calc(100vh-12rem)] min-h-[500px]">
          <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
            <h2 className="font-semibold text-slate-800">Your AI Cover Letter</h2>
            <button 
              onClick={handleCopy}
              disabled={!coverLetter}
              className="text-sm px-3 py-1.5 flex items-center gap-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-slate-500" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="p-6 flex-1 flex flex-col bg-slate-50/50">
             {coverLetter ? (
               <textarea
                 className="flex-1 w-full p-6 border-0 bg-transparent outline-none resize-none leading-relaxed text-slate-700 font-serif"
                 value={coverLetter}
                 onChange={(e) => setCoverLetter(e.target.value)}
                 spellCheck="false"
               />
             ) : (
               <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
                 <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                   <FileSignature className="w-8 h-8 text-slate-300" />
                 </div>
                 <h3 className="font-medium text-slate-700 mb-1">No cover letter yet</h3>
                 <p className="text-sm text-slate-500">Add a job description and generate to see your customized cover letter appear here.</p>
               </div>
             )}
          </div>
        </div>

      </div>
    </div>
  )
}
