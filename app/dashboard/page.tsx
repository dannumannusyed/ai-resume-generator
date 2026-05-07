'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FileText, ArrowRight } from 'lucide-react'
import { useSession } from 'next-auth/react'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import ResumeCard from '@/components/dashboard/ResumeCard'
import TrialBanner from '@/components/dashboard/TrialBanner'
import LoadingGrid from '@/components/dashboard/LoadingGrid'
import TrialExpiredModal from '@/components/dashboard/TrialExpiredModal'

export default function Dashboard() {
  const { data: session } = useSession()
  const router = useRouter()
  const [resumes, setResumes] = useState<any[]>([])
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [loadingResumes, setLoadingResumes] = useState(true)
  const [isAnalyzingPending, setIsAnalyzingPending] = useState(false)
  const [showExpiredModal, setShowExpiredModal] = useState(false)
  const [timeLeft, setTimeLeft] = useState<{days: number, hours: number, minutes: number, seconds: number} | null>(null)
  const [isPaidUser, setIsPaidUser] = useState(false)

  useEffect(() => {
    async function loadResumes() {
      if (!session) return
      setLoadingResumes(true)
      try {
        const res = await fetch('/api/resumes')
        if (res.ok) {
          const { data } = await res.json()
          if (data) {
            const mapped = data.map((r: any) => ({
              id: r.id,
              name: r.name,
              date: new Date(r.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
              atsScore: r.ats_score,
              content: r.content
            }))
            setResumes(mapped)
          }
        }
      } catch (err) {
        console.error('Failed to load resumes:', err)
      } finally {
        setLoadingResumes(false)
      }
    }

    loadResumes()
  }, [session])

  useEffect(() => {
    async function processPendingJob() {
      if (!session) return
      const pendingJobText = localStorage.getItem('pending_job_text')
      if (pendingJobText) {
        localStorage.removeItem('pending_job_text')
        setIsAnalyzingPending(true)
        try {
          const response = await fetch('/api/analyze-job', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jobPosting: pendingJobText }),
          })
          if (response.ok) {
            const data = await response.json()
            localStorage.setItem('current_job_analysis', JSON.stringify(data))
            router.push('/builder/resume')
          }
        } catch (error) {
          console.error('Analysis failed:', error)
        } finally {
          setIsAnalyzingPending(false)
        }
      }
    }

    processPendingJob()
  }, [session, router])

  useEffect(() => {
    const isPaid = localStorage.getItem('is_paid_user') === 'true'
    setIsPaidUser(isPaid)
    if (isPaid) return // Don't run timer or show expired modal for paid users

    let trialStart = localStorage.getItem('trialStartDate')
    if (!trialStart) {
      trialStart = Date.now().toString()
      localStorage.setItem('trialStartDate', trialStart)
    }
    
    const trialDurationMs = 3 * 24 * 60 * 60 * 1000 // 3 Days
    const expiryDate = parseInt(trialStart) + trialDurationMs

    const timer = setInterval(() => {
      const now = Date.now()
      const difference = expiryDate - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        setShowExpiredModal(true)
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/resumes?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setResumes(resumes.filter(r => r.id !== id))
        setConfirmDeleteId(null)
      }
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 w-full">
      {isAnalyzingPending && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center max-w-sm w-full">
            <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Analyzing Job...</h3>
            <p className="text-slate-500 text-center text-sm">Please wait while our AI tailors your resume for this role.</p>
          </div>
        </div>
      )}

      <DashboardHeader userName={session?.user?.name || ''} />

      {!isPaidUser && <TrialBanner timeLeft={timeLeft} />}

      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          Recent Resumes
        </h2>
      </div>

      {loadingResumes ? (
        <LoadingGrid />
      ) : resumes.length === 0 ? (
        <div className="glass-card rounded-[3rem] border-2 border-dashed border-slate-200/50 p-20 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03),transparent)]" />
          <div className="relative z-10">
            <div className="w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner group-hover:scale-110 transition-transform duration-500">
              <FileText className="w-12 h-12 text-blue-400" />
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">No resumes yet</h3>
            <p className="text-slate-500 max-w-sm mx-auto mb-10 font-medium">
              Start your career journey by creating your first AI-optimized resume.
            </p>
            <Link 
              href="/builder/resume" 
              className="inline-flex items-center gap-2 px-10 py-5 bg-slate-900 text-white rounded-2xl font-black hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 active:scale-95"
            >
              Build My Resume
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resumes.map((resume) => (
            <ResumeCard
              key={resume.id}
              resume={resume}
              onDeleteClick={(id) => setConfirmDeleteId(id)}
            />
          ))}
        </div>
      )}

      {confirmDeleteId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-black text-slate-900 mb-2">Delete Resume?</h3>
            <p className="text-slate-500 mb-8 font-medium">This action cannot be undone. Are you sure you want to delete this document?</p>
            <div className="flex gap-4">
              <button onClick={() => setConfirmDeleteId(null)} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all">Cancel</button>
              <button onClick={() => handleDelete(confirmDeleteId)} className="flex-1 py-4 bg-rose-500 text-white rounded-2xl font-bold hover:bg-rose-600 shadow-lg shadow-rose-100 transition-all">Delete</button>
            </div>
          </div>
        </div>
      )}

      {!isPaidUser && showExpiredModal && (
        <TrialExpiredModal onClose={() => setShowExpiredModal(false)} />
      )}
    </div>
  )
}
