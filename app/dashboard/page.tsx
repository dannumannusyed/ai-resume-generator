'use client'

import { useState, useEffect } from 'react'
import { FileText } from 'lucide-react'
import { useSession } from 'next-auth/react'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import ResumeCard from '@/components/dashboard/ResumeCard'
import TrialBanner from '@/components/dashboard/TrialBanner'
import LoadingGrid from '@/components/dashboard/LoadingGrid'
import TrialExpiredModal from '@/components/dashboard/TrialExpiredModal'

export default function Dashboard() {
  const { data: session } = useSession()
  const [resumes, setResumes] = useState<any[]>([])
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [loadingResumes, setLoadingResumes] = useState(true)
  const [showExpiredModal, setShowExpiredModal] = useState(false)
  const [timeLeft, setTimeLeft] = useState<{days: number, hours: number, minutes: number, seconds: number} | null>(null)

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
    let timer: NodeJS.Timeout

    async function fetchSubscription() {
      if (!session) return
      try {
        const res = await fetch('/api/user/subscription')
        if (res.ok) {
          const { data } = await res.json()
          if (data && data.plan_id === 'admin') {
            setTimeLeft(null)
            setShowExpiredModal(false)
            return
          }
          if (data && data.current_period_end) {
            const expiryDate = new Date(data.current_period_end).getTime()
            
            const calculateTimeLeft = () => {
              const now = Date.now()
              const difference = expiryDate - now

              if (difference > 0) {
                const tl = {
                  days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                  hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                  minutes: Math.floor((difference / 1000 / 60) % 60),
                  seconds: Math.floor((difference / 1000) % 60)
                }
                setTimeLeft(tl)
              } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
                // Only show modal if user hasn't seen/dismissed it this session or similar logic
                // For now, we'll show it once when they land on dashboard and it's expired
                setShowExpiredModal(true)
              }
            }

            calculateTimeLeft()
            timer = setInterval(calculateTimeLeft, 1000)
          }
        }
      } catch (err) {
        console.error('Failed to fetch subscription:', err)
      }
    }

    fetchSubscription()
    return () => { if (timer) clearInterval(timer) }
  }, [session])

  const handleDeleteConfirm = async (id: string) => {
    try {
      const res = await fetch(`/api/resumes?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setResumes(prev => prev.filter(r => r.id !== id))
        setConfirmDeleteId(null)
      } else {
        alert('Failed to delete resume')
      }
    } catch (err) {
      console.error('Delete error:', err)
      alert('Error deleting resume')
    }
  }

  const handleDownload = async (resume: any) => {
    try {
      const response = await fetch('/api/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeContent: resume.content || JSON.stringify(resume) }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        const userName = session?.user?.name ? `${session.user.name} - ` : ''
        a.download = `${userName}${resume.name || 'Resume'}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        alert('Failed to generate PDF')
      }
    } catch (error) {
      console.error('Download failed:', error)
      alert('Error downloading PDF')
    }
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 w-full">
      <DashboardHeader userName={session?.user?.name || ''} />

      <TrialBanner timeLeft={timeLeft} />

      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          Recent Resumes
        </h2>
      </div>

      {loadingResumes ? (
        <LoadingGrid />
      ) : resumes.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 p-20 text-center">
          <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-blue-400" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">No resumes yet</h3>
          <p className="text-slate-500 max-w-sm mx-auto mb-8">
            Create your first AI-tailored resume to boost your interview chances.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resumes.map((resume) => (
            <ResumeCard
              key={resume.id}
              resume={resume}
              confirmDeleteId={confirmDeleteId}
              setConfirmDeleteId={setConfirmDeleteId}
              handleDeleteConfirm={handleDeleteConfirm}
              handleDownload={handleDownload}
            />
          ))}
        </div>
      )}

      {showExpiredModal && (
        <TrialExpiredModal onClose={() => setShowExpiredModal(false)} />
      )}
    </div>
  )
}
