'use client'

import { useState } from 'react'
import { Briefcase, Loader2, Sparkles, MapPin, DollarSign, CheckCircle2, ArrowRight } from 'lucide-react'
import { useStore } from '@/lib/store'
import Link from 'next/link'

interface Job {
  title: string
  company: string
  location: string
  salary: string
  matchScore: number
  matchReasons: string[]
  description: string
}

export default function JobMatching() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [hasScanned, setHasScanned] = useState(false)

  const { resumeData } = useStore()

  const handleScan = async () => {
    if (!resumeData.personalInfo.firstName && resumeData.experience.length === 0) {
      setError('Please add some information to your resume in the Builder first.')
      return
    }

    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/job-matching', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to analyze job matches')
      }

      setJobs(data.jobs || [])
      setHasScanned(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2 flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-emerald-600" />
            </div>
            AI Job Matches
          </h1>
          <p className="text-slate-500">Discover roles specifically chosen for your unique combination of skills and experience.</p>
        </div>
        
        {hasScanned && (
          <button 
            onClick={handleScan}
            disabled={isLoading}
            className="btn-ghost flex items-center gap-2 self-start md:self-auto"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Refresh Matches
          </button>
        )}
      </div>

      {!hasScanned && (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm flex flex-col items-center">
          <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
             <Sparkles className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">Find Your Next Role</h2>
          <p className="text-slate-500 max-w-md mx-auto mb-8">
            Our AI engine will analyze your resume against thousands of active job postings to find the absolute best matches that fit your profile.
          </p>
          
          {error && <div className="text-red-500 font-medium mb-4 p-3 bg-red-50 rounded-lg">{error}</div>}
          
          <button
            onClick={handleScan}
            disabled={isLoading}
            className="btn-primary py-4 px-8 text-lg w-full md:w-auto mx-auto flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 border-none text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Scanning Job Boards...
              </>
            ) : (
              <>
                <Briefcase className="w-6 h-6" />
                Scan For Matches
              </>
            )}
          </button>
        </div>
      )}

      {hasScanned && jobs.length > 0 && (
        <div className="grid gap-6">
          {jobs.map((job, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group flex flex-col lg:flex-row gap-6 items-start lg:items-center">
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-4 mb-2">
                  <h3 className="text-xl font-bold text-slate-900 truncate">{job.title}</h3>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-bold border border-emerald-100 flex items-center gap-1 shrink-0">
                    <Sparkles className="w-3.5 h-3.5" />
                    {job.matchScore}% Match
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-4 font-medium">
                  <span className="text-slate-700 font-bold">{job.company}</span>
                  <div className="flex items-center gap-1"><MapPin className="w-4 h-4 text-slate-400" /> {job.location}</div>
                  <div className="flex items-center gap-1"><DollarSign className="w-4 h-4 text-slate-400" /> {job.salary}</div>
                </div>
                
                <p className="text-slate-600 text-sm mb-4 line-clamp-2">{job.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {job.matchReasons.map((reason, rIdx) => (
                    <span key={rIdx} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      {reason}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="w-full lg:w-auto shrink-0 flex flex-col gap-3">
                <Link 
                  href="/dashboard/cover-letter" 
                  className="w-full lg:w-auto btn-primary py-2.5 px-6 whitespace-nowrap"
                >
                  Apply & Tailor Resume
                </Link>
                <button className="w-full lg:w-auto btn-ghost py-2.5 px-6 whitespace-nowrap text-slate-500 flex items-center justify-center gap-2">
                  Save Job <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}
