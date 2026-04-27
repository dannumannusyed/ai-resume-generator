'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, BarChart3, ArrowLeft, Link2, FileText, AlertCircle } from 'lucide-react'
import { useStore } from '@/lib/store'

export default function JobAnalyzer() {
  const router = useRouter()
  const jobPosting = useStore((state) => state.jobPostingRaw)
  const setJobPosting = useStore((state) => state.setJobPostingRaw)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState('')
  const analysis = useStore((state) => state.jobAnalysis)
  const setAnalysis = useStore((state) => state.setJobAnalysis)
  const setGeneratedResume = useStore((state) => state.setGeneratedResume)

  const isUrl = /^https?:\/\/[^\s]+$/i.test(jobPosting.trim())

  const handleAnalyze = async () => {
    if (!jobPosting.trim()) return
    setIsAnalyzing(true)
    setError('')
    setAnalysis(null)
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobPosting })
      })

      const json = await response.json()

      if (!response.ok || json.error) {
        throw new Error(json.error || 'Failed to analyze job posting')
      }

      setAnalysis(json.data)
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to reach the AI analyzer. Please check the API configuration.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <button className="btn-ghost" onClick={() => router.push('/dashboard')}>
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Match Your Resume</h1>
            <p className="text-slate-600">Paste a job posting or URL to AI-analyze requirements</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Posting Input */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="label">Paste Job Posting or URL</label>
                  {isUrl && (
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-full px-3 py-1">
                      <Link2 className="w-3 h-3" />
                      URL Detected – will be scraped
                    </span>
                  )}
                  {!isUrl && jobPosting.trim().length > 0 && (
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-green-600 bg-green-50 border border-green-200 rounded-full px-3 py-1">
                      <FileText className="w-3 h-3" />
                      Text Detected
                    </span>
                  )}
                </div>
                <textarea
                  value={jobPosting}
                  onChange={(e) => setJobPosting(e.target.value)}
                  rows={12}
                  placeholder="Paste the full job posting here... or paste a URL to a job board (LinkedIn, Indeed, etc.)"
                  className="input"
                />
              </div>

              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !jobPosting.trim()}
                className="btn-primary w-full py-3 font-semibold flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                {isAnalyzing
                  ? isUrl ? 'Scraping URL & Analyzing...' : 'Analyzing with AI...'
                  : 'Analyze Job Posting'}
              </button>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3 items-start">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-800">Analysis Failed</p>
                    <p className="text-xs text-red-600 mt-1">{error}</p>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
                <p className="font-semibold mb-2">💡 Tips for best results:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Paste the complete job description</li>
                  <li>Or paste a job board URL (Indeed, LinkedIn, etc.)</li>
                  <li>We'll automatically extract all ATS keywords</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Analysis Results */}
          <div className="space-y-6">
            {isAnalyzing ? (
              <div className="bg-white rounded-2xl shadow-xl p-8 text-center py-16">
                <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-sm font-semibold text-slate-700">{isUrl ? 'Scraping URL...' : 'Analyzing...'}</p>
                <p className="text-xs text-slate-400 mt-1">Extracting requirements with AI</p>
              </div>
            ) : analysis ? (
              <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
                <div className="flex items-center gap-2 text-lg font-bold text-slate-900">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Analysis Results
                </div>

                {/* Role */}
                {analysis.role && (
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">Detected Role</p>
                    <p className="text-base font-bold text-blue-900">{analysis.role}</p>
                  </div>
                )}

                {/* Required Skills */}
                {analysis.requiredSkills && analysis.requiredSkills.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-2">Required Skills</p>
                    <div className="space-y-2">
                      {analysis.requiredSkills.map((skill: string, i: number) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full shrink-0" />
                          <span className="text-sm text-slate-700">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Nice to Have */}
                {analysis.niceToHave && analysis.niceToHave.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-2">Nice to Have</p>
                    <div className="flex flex-wrap gap-1.5">
                      {analysis.niceToHave.map((skill: string, i: number) => (
                        <span key={i} className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full border border-slate-200">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* ATS Keywords */}
                {analysis.atsKeywords && analysis.atsKeywords.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-2">ATS Keywords</p>
                    <div className="flex flex-wrap gap-2">
                      {analysis.atsKeywords.map((kw: string, i: number) => (
                        <span key={i} className="badge badge-success text-xs">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Experience Required */}
                {analysis.experience && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm">
                    <p className="font-semibold text-amber-900">Experience Required</p>
                    <p className="text-amber-800 mt-1">{analysis.experience}</p>
                  </div>
                )}

                {/* Generate Button */}
                <button className="btn-primary w-full py-3 font-semibold" onClick={() => {
                  setGeneratedResume(null)
                  router.push('/builder/preview')
                }}>
                  Generate Tailored Resume
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl p-8 text-center py-16 text-slate-500">
                <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="text-sm font-medium">Paste a job posting or URL</p>
                <p className="text-xs text-slate-400 mt-1">and click "Analyze" to see requirements</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
