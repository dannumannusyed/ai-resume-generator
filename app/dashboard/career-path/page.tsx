'use client'

import { useState } from 'react'
import { Map, Sparkles, Copy, Loader2, CheckCircle2 } from 'lucide-react'
import { useStore } from '@/lib/store'

export default function CareerPath() {
  const [paths, setPaths] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const { resumeData } = useStore()

  const handleGenerate = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/career-path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeData
        })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate career paths')
      }

      setPaths(data.paths)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = () => {
    if (!paths) return
    navigator.clipboard.writeText(paths)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-6 w-full h-full flex flex-col">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center shadow-sm">
            <Map className="w-6 h-6 text-purple-600" />
          </div>
          Career Path Recommendations
        </h1>
        <p className="text-slate-500 font-medium italic">Discover potential career transitions and goals based on your AI profile.</p>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-8 flex-1 min-h-0">
        
        {/* Left Column - Input */}
        <div className="flex flex-col bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden min-h-[400px] h-fit">
          <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
            <h2 className="font-semibold text-slate-800">Your Profile</h2>
            {resumeData?.personalInfo?.firstName ? (
              <span className="text-xs px-2.5 py-1 bg-green-100 text-green-700 rounded-full font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Ready for Analysis
              </span>
            ) : (
              <span className="text-xs px-2.5 py-1 bg-orange-100 text-orange-700 rounded-full font-medium">
                No Resume Data (Go to Builder)
              </span>
            )}
          </div>
          <div className="p-6 flex-1 flex flex-col">
            <p className="text-slate-600 mb-6 leading-relaxed">
              Our AI will analyze your stated experience, education, and skills to output 3 highly viable career paths you may want to explore next, including what critical skills you need to reach them.
            </p>
            {error && (
              <div className="p-3 mb-4 text-sm text-red-600 border border-red-200 bg-red-50 rounded-lg">
                {error}
              </div>
            )}
            <button
              onClick={handleGenerate}
              disabled={isLoading || !resumeData?.personalInfo?.firstName}
              className="w-full mt-auto btn-primary py-3 px-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing Profile...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Career Paths
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column - Output */}
        <div className="flex flex-col bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden h-full min-h-[500px]">
          <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
            <h2 className="font-semibold text-slate-800">Recommended Paths</h2>
            <button 
              onClick={handleCopy}
              disabled={!paths}
              className="text-sm px-3 py-1.5 flex items-center gap-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-slate-500" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="p-6 flex-1 flex flex-col bg-slate-50/50 overflow-auto">
             {paths ? (
               <div
                 className="flex-1 w-full prose prose-slate prose-sm max-w-none text-slate-700 whitespace-pre-wrap"
               >
                 {paths}
               </div>
             ) : (
               <div className="flex-1 flex flex-col items-center justify-center text-center px-8 h-full">
                 <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                   <Map className="w-8 h-8 text-slate-300" />
                 </div>
                 <h3 className="font-medium text-slate-700 mb-1">No analysis yet</h3>
                 <p className="text-sm text-slate-500">Run the generator to see your career paths plotted here.</p>
               </div>
             )}
          </div>
        </div>

      </div>
    </div>
  )
}
