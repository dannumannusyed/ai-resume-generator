'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Download, Edit2, ArrowLeft, Sparkles, Layout, ArrowUpRight, CheckCircle2, ChevronRight, Loader2, Save } from 'lucide-react'
import { useStore } from '@/lib/store'
import { ResumeData } from '@/lib/store'
import ResumeDocument, { TemplateType } from '@/components/ResumeDocument'

// ─── Build a plain original resume Markdown from raw resumeData ───────────────
function buildOriginalMarkdown(data: ResumeData): string {
  if (!data || !data.personalInfo) return ''
  const p = data.personalInfo
  const lines: string[] = []

  lines.push(`# ${p.firstName || ''} ${p.lastName || ''}`)
  lines.push(`${p.location || ''} · ${p.phone || ''} · ${p.email || ''}`)
  lines.push('')

  if (data.education && Array.isArray(data.education)) {
    lines.push('## EDUCATION')
    data.education.forEach(ed => {
      lines.push(`### ${ed.degree || ''} in ${ed.field || ''}`)
      lines.push(`${ed.school || ''} — ${ed.year || ''}`)
      lines.push('')
    })
  }

  if (data.experience && Array.isArray(data.experience)) {
    lines.push('## EXPERIENCE')
    data.experience.forEach(ex => {
      lines.push(`### ${ex.position || ''}`)
      lines.push(`${ex.company || ''} · ${ex.duration || ''}`)
      if (ex.achievements && typeof ex.achievements === 'string') {
        ex.achievements.split('\n').forEach(ach => {
          if (ach.trim()) lines.push(`- ${ach.trim()}`)
        })
      }
      lines.push('')
    })
  }

  if (data.skills && Array.isArray(data.skills)) {
    lines.push('## SKILLS')
    lines.push(data.skills.join(' · '))
    lines.push('')
  }

  if (data.projects && Array.isArray(data.projects)) {
    lines.push('## PROJECTS')
    data.projects.forEach(pr => {
      lines.push(`### ${pr.name || ''}`)
      if (pr.description) lines.push(pr.description)
      if (pr.link) lines.push(`[View Project](${pr.link})`)
      lines.push('')
    })
  }

  return lines.join('\n')
}

// ─── Compute a naive baseline ATS score ──────────────────────────────────────
function computeBaselineAts(data: ResumeData, jobAnalysis: any): number {
  if (!data) return 0
  if (!jobAnalysis || !jobAnalysis.requiredSkills) return 30
  
  const skills = Array.isArray(data.skills) ? data.skills : []
  const experience = Array.isArray(data.experience) ? data.experience : []
  const education = Array.isArray(data.education) ? data.education : []
  const projects = Array.isArray(data.projects) ? data.projects : []

  const allText = [
    ...skills,
    ...experience.flatMap(e => [e.position || '', e.achievements || '']),
    ...education.flatMap(e => [e.degree || '', e.field || '']),
    ...projects.flatMap(p => [p.name || '', p.description || ''])
  ].join(' ').toLowerCase()

  const required: string[] = jobAnalysis.requiredSkills || []
  const ats: string[] = jobAnalysis.atsKeywords || []
  const allKeywords = [...new Set([...required, ...ats])]
  if (allKeywords.length === 0) return 35

  let matches = 0
  allKeywords.forEach(kw => {
    if (kw && allText.includes(kw.toLowerCase())) matches++
  })
  const ratio = matches / allKeywords.length
  // Scale between 20-65 range for "original" so AI improvement is meaningful
  return Math.round(20 + ratio * 45)
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function ResumePreview() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const resumeId = searchParams.get('id')
  
  const { data: session } = useSession()
  const [phase, setPhase] = useState<'original' | 'optimized'>('original')
  const [editing, setEditing] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [loading, setLoading] = useState(!!resumeId)
  const [errorMsg, setErrorMsg] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('classic')

  const resumeData = useStore(state => state.resumeData)
  const setResumeData = useStore(state => state.setResumeData)
  const jobAnalysis = useStore(state => state.jobAnalysis)
  const generatedResume = useStore(state => state.generatedResume)
  const setGeneratedResume = useStore(state => state.setGeneratedResume)
  const setTemplate = useStore(state => state.setTemplate)

  const [isTrial, setIsTrial] = useState(true)
  const [originalMarkdown, setOriginalMarkdown] = useState('')
  const [originalAts, setOriginalAts] = useState(0)
  const [localResumeContent, setLocalResumeContent] = useState('')

  // Check subscription status
  useEffect(() => {
    async function checkSubscription() {
      if (!session) return
      try {
        const res = await fetch('/api/user/subscription')
        if (res.ok) {
          const { data } = await res.json()
          // Remove trial restrictions if they have an active plan or active trial (has_access is true)
          const hasAccess = data && data.has_access === true
          setIsTrial(!hasAccess)
        }
      } catch (err) {
        console.error('Sub check fail:', err)
      }
    }
    checkSubscription()
  }, [session])

  const handleTemplateChange = async (t: TemplateType) => {
    setSelectedTemplate(t)
    setTemplate(t)
    
    // Persist to DB if we have a resume ID
    if (resumeId) {
      try {
        await fetch(`/api/resumes?id=${resumeId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ template: t })
        })
      } catch (err) {
        console.error('Failed to save template choice:', err)
      }
    }
  }

  // Fetch resume if ID is present
  useEffect(() => {
    async function fetchResume() {
      if (!resumeId) return
      setLoading(true)
      try {
        const res = await fetch(`/api/resumes?id=${resumeId}`)
        if (!res.ok) throw new Error('Failed to load resume')
        const { data } = await res.json()
        
        if (data) {
          // Update store and local state
          const parsedData = data.resume_data || resumeData
          setResumeData(parsedData)
          
          if (data.template) {
            setSelectedTemplate(data.template as TemplateType)
            setTemplate(data.template)
          }

          if (data.is_tailored) {
            setPhase('optimized')
            setGeneratedResume({
              resumeText: data.content,
              atsScore: data.ats_score,
              strongPoints: [],
              missingKeywords: [],
              optimizations: []
            })
            setLocalResumeContent(data.content)
          }

          const md = buildOriginalMarkdown(parsedData)
          setOriginalMarkdown(md)
          // Use jobAnalysis from store if not in data (resumes don't store full analysis usually)
          setOriginalAts(computeBaselineAts(parsedData, data.job_analysis || jobAnalysis))
        }
      } catch (err) {
        console.error('Fetch error:', err)
        setErrorMsg('Failed to load the requested resume.')
      } finally {
        setLoading(false)
      }
    }
    fetchResume()
  }, [resumeId, setResumeData, setGeneratedResume, setTemplate, setSelectedTemplate]) // Removed resumeData and jobAnalysis to prevent loops

  // Initial render setup for new resumes
  useEffect(() => {
    if (resumeId) return // Skip if we are fetching by ID
    const md = buildOriginalMarkdown(resumeData)
    setOriginalMarkdown(md)
    setOriginalAts(computeBaselineAts(resumeData, jobAnalysis))
    
    // Use template from store if it exists
    const storeTemplate = useStore.getState().selectedTemplate as TemplateType
    if (storeTemplate) setSelectedTemplate(storeTemplate)

    if (generatedResume) {
      const text = generatedResume.resumeText.replace(/\\n/g, '\n')
      setLocalResumeContent(text)
    }
  }, [resumeId, resumeData, jobAnalysis, generatedResume])

  const handleDownloadPDF = () => {
    const A4_W = 794  // px — 210mm at 96dpi
    const A4_H = 1123 // px — 297mm at 96dpi

    const originalTitle = document.title
    const name = `${resumeData.personalInfo.firstName || ''} ${resumeData.personalInfo.lastName || ''}`.trim()
    const role = jobAnalysis?.role || 'Resume'
    document.title = `${name ? name + ' - ' : ''}${role} Resume`

    const canvas  = document.querySelector('.resume-canvas') as HTMLElement | null
    const wrapper = canvas?.parentElement as HTMLElement | null

    const beforePrint = () => {
      if (!canvas || !wrapper) return

      // ── Save current inline styles so we can restore after print ─────────
      wrapper.dataset.pWidth    = wrapper.style.width
      wrapper.dataset.pHeight   = wrapper.style.height
      wrapper.dataset.pOverflow = wrapper.style.overflow
      wrapper.dataset.pPosition = wrapper.style.position

      canvas.dataset.pTransform       = canvas.style.transform
      canvas.dataset.pTransformOrigin = canvas.style.transformOrigin
      canvas.dataset.pHeight          = canvas.style.height
      canvas.dataset.pWidth           = canvas.style.width
      canvas.dataset.pPosition        = canvas.style.position
      canvas.dataset.pOverflow        = canvas.style.overflow
      canvas.dataset.pTop             = canvas.style.top
      canvas.dataset.pLeft            = canvas.style.left

      // ── Reset wrapper to full A4 ──────────────────────────────────────────
      // Do NOT attempt to measure scrollHeight — on mobile the viewport
      // constraint makes scrollHeight unreliable and produces a wrong scale.
      // Instead, render at exact A4 size and let @page { size: A4 } + the
      // browser's print engine handle fitting the content to the paper.
      wrapper.style.width    = `${A4_W}px`
      wrapper.style.height   = `${A4_H}px`
      wrapper.style.overflow = 'hidden'
      wrapper.style.position = 'relative'

      // ── Reset canvas: exact A4, no transform ────────────────────────────
      canvas.style.position        = 'absolute'
      canvas.style.top             = '0'
      canvas.style.left            = '0'
      canvas.style.transform       = 'none'
      canvas.style.transformOrigin = 'top left'
      canvas.style.width           = `${A4_W}px`
      canvas.style.height          = `${A4_H}px`
      canvas.style.overflow        = 'hidden'
    }

    const afterPrint = () => {
      if (wrapper) {
        wrapper.style.width    = wrapper.dataset.pWidth    ?? ''
        wrapper.style.height   = wrapper.dataset.pHeight   ?? ''
        wrapper.style.overflow = wrapper.dataset.pOverflow ?? ''
        wrapper.style.position = wrapper.dataset.pPosition ?? ''
        delete wrapper.dataset.pWidth
        delete wrapper.dataset.pHeight
        delete wrapper.dataset.pOverflow
        delete wrapper.dataset.pPosition
      }
      if (canvas) {
        canvas.style.transform       = canvas.dataset.pTransform       ?? ''
        canvas.style.transformOrigin = canvas.dataset.pTransformOrigin ?? ''
        canvas.style.height          = canvas.dataset.pHeight          ?? ''
        canvas.style.width           = canvas.dataset.pWidth           ?? ''
        canvas.style.position        = canvas.dataset.pPosition        ?? ''
        canvas.style.overflow        = canvas.dataset.pOverflow        ?? ''
        canvas.style.top             = canvas.dataset.pTop             ?? ''
        canvas.style.left            = canvas.dataset.pLeft            ?? ''
        delete canvas.dataset.pTransform
        delete canvas.dataset.pTransformOrigin
        delete canvas.dataset.pHeight
        delete canvas.dataset.pWidth
        delete canvas.dataset.pPosition
        delete canvas.dataset.pOverflow
        delete canvas.dataset.pTop
        delete canvas.dataset.pLeft
      }
      document.title = originalTitle
      window.removeEventListener('beforeprint', beforePrint)
      window.removeEventListener('afterprint',  afterPrint)
    }

    window.addEventListener('beforeprint', beforePrint)
    window.addEventListener('afterprint',  afterPrint)
    window.print()
  }

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true)
    setErrorMsg('')
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData, jobAnalysis: jobAnalysis || {} })
      })
      if (!res.ok) throw new Error('Failed to generate.')
      const { data } = await res.json()
      // Groq sometimes returns literal \n in JSON strings — convert to real newlines
      if (data.resumeText) {
        data.resumeText = data.resumeText.replace(/\\n/g, '\n')
      }
      setGeneratedResume(data)
      setLocalResumeContent(data.resumeText)
      setPhase('optimized')

      // Save to Supabase (cloud)
      if (session?.user?.id) {
        try {
          await fetch('/api/resumes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: `${jobAnalysis?.role || 'Tailored'} Resume`,
              content: data.resumeText,
              resumeData,
              atsScore: data.atsScore,
              jobRole: jobAnalysis?.role || null,
              isTailored: true
            })
          })
        } catch (dbErr) {
          console.error('Failed to save to Supabase:', dbErr)
        }
      }
    } catch (err) {
      console.error(err)
      setErrorMsg('Generation failed. Please check your resume data and job analysis.')
    } finally {
      setIsGenerating(false)
    }
  }, [resumeData, jobAnalysis, setGeneratedResume])

  const displayContent = phase === 'original' ? originalMarkdown : localResumeContent
  const displayAts = phase === 'original' ? originalAts : (generatedResume?.atsScore ?? originalAts)
  const atsImprovement = generatedResume ? generatedResume.atsScore - originalAts : 0

  const atsColor = displayAts >= 75 ? 'text-green-600' : displayAts >= 50 ? 'text-amber-600' : 'text-red-500'
  const atsBg = displayAts >= 75 ? 'bg-green-500' : displayAts >= 50 ? 'bg-amber-500' : 'bg-red-500'
  const atsBorder = displayAts >= 75 ? 'bg-green-500' : displayAts >= 50 ? 'bg-amber-500' : 'bg-red-500'

  const [isSaving, setIsSaving] = useState(false)

  const handleSaveResume = async () => {
    if (!session?.user?.id) {
      alert('Please log in to save your resume.')
      return
    }
    
    const namePref = session?.user?.name ? `${session.user.name} - ` : ''
    const roleSuffix = jobAnalysis?.role ? `${jobAnalysis.role} Resume` : 'Resume'
    const fullResumeName = `${namePref}${roleSuffix}`

    try {
      if (resumeId) {
        // Update existing
        const res = await fetch(`/api/resumes?id=${resumeId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: fullResumeName,
            content: displayContent,
            ats_score: displayAts,
            template: selectedTemplate,
            resume_data: resumeData,
            is_tailored: phase === 'optimized'
          })
        })
        if (!res.ok) throw new Error('Failed to update')
        alert('Resume updated successfully!')
      } else {
        // Create new
        const res = await fetch('/api/resumes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: fullResumeName,
            content: displayContent,
            resumeData: resumeData,
            atsScore: displayAts,
            jobRole: jobAnalysis?.role || null,
            isTailored: phase === 'optimized',
            template: selectedTemplate
          })
        })
        
        if (res.ok) {
          const { data } = await res.json()
          if (data && data.id) {
             router.replace(`/builder/preview?id=${data.id}`)
          }
          alert('Resume saved successfully! You can view it in your dashboard.')
        } else {
          throw new Error('Failed to save')
        }
      }
    } catch (err) {
      console.error(err)
      alert('Error saving resume')
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-12 rounded-[2rem] shadow-xl border border-slate-200 flex flex-col items-center max-w-sm w-full">
          <div className="relative mb-6">
            <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
            <Loader2 className="w-8 h-8 text-blue-600 absolute inset-0 m-auto animate-pulse" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Loading Resume</h2>
          <p className="text-slate-500 mt-2 text-center text-sm">We're fetching your saved data from the database...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 print:bg-white print:p-0">
      <div className="max-w-[1280px] mx-auto">

        {/* ── Header ── */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
          <div className="flex items-center gap-4">
            <button className="btn-ghost shrink-0" onClick={() => router.push('/dashboard')}>
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 truncate">Resume Preview</h1>
              <p className="text-slate-500 text-xs md:text-sm truncate">
                {phase === 'original' ? 'Your original resume · baseline ATS score' : `Optimized for ${jobAnalysis?.role || 'the role'}`}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 md:gap-3 w-full md:w-auto mt-4 md:mt-0">
            <button
              className={`col-span-1 justify-center px-2 py-2.5 md:px-5 bg-white border border-slate-200 rounded-xl font-semibold transition-all flex items-center gap-1.5 md:gap-2 text-xs md:text-sm ${isSaving ? 'text-slate-400 cursor-not-allowed' : 'text-slate-700 hover:bg-slate-50 shadow-sm'}`}
              onClick={handleSaveResume}
              disabled={isSaving}
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save
            </button>
            {phase === 'optimized' ? (
              <button
                className="col-span-1 justify-center px-2 py-2.5 md:px-5 bg-white border border-slate-200 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-all flex items-center gap-1.5 md:gap-2 text-xs md:text-sm"
                onClick={() => setEditing(true)}
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
            ) : (
              <div className="col-span-1 hidden sm:block"></div>
            )}
            <button
              className="col-span-2 sm:col-auto w-full sm:w-auto justify-center btn-primary px-4 py-2.5 md:px-6 flex items-center gap-2 shadow-lg shadow-blue-200 text-sm"
              onClick={handleDownloadPDF}
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>

        {/* ── Phase Toggle Banner ── */}
        <div className="print:hidden mb-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-2 flex gap-2">
          <button
            onClick={() => setPhase('original')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${phase === 'original' ? 'bg-slate-900 text-white shadow' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Original Resume
          </button>
          <button
            onClick={() => generatedResume && setPhase('optimized')}
            disabled={!generatedResume}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              phase === 'optimized' ? 'bg-blue-600 text-white shadow' :
              generatedResume ? 'text-blue-600 hover:bg-blue-50' :
              'text-slate-300 cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            AI Optimized
            {generatedResume && atsImprovement > 0 && (
              <span className="text-[11px] bg-green-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                +{atsImprovement}%
              </span>
            )}
          </button>
        </div>

        {errorMsg ? (
          <div className="bg-white rounded-3xl shadow-xl border border-red-100 p-12 text-center max-w-2xl mx-auto my-12">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Generation Interrupted</h2>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">
              {errorMsg === 'Failed to generate.' 
                ? "The AI engine is currently busy. Please try again in a few moments." 
                : errorMsg}
            </p>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => setErrorMsg('')} 
                className="px-8 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-all"
              >
                Back to Preview
              </button>
              <button 
                onClick={handleGenerate} 
                className="px-8 py-3 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
              >
                Retry AI Tailoring
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 items-start">

            {/* ── Sidebar ── */}
            <div className="w-full lg:w-72 space-y-5 print:hidden lg:sticky lg:top-6">

              {/* ATS Score Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-1.5 h-full ${atsBorder}`} />
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  {phase === 'original' ? 'Baseline ATS Score' : 'Optimized ATS Score'}
                </p>
                <div className="flex items-end justify-between mb-3">
                  <span className={`text-4xl font-black ${atsColor}`}>{displayAts}%</span>
                  {phase === 'optimized' && atsImprovement > 0 && (
                    <span className="flex items-center gap-1 text-green-600 font-bold text-sm bg-green-50 px-2 py-1 rounded-lg">
                      <ArrowUpRight className="w-4 h-4" />
                      +{atsImprovement}% vs original
                    </span>
                  )}
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${atsBg}`}
                    style={{ width: `${displayAts}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-2.5">
                  {displayAts >= 75 ? '✓ Strong match for this role' :
                   displayAts >= 50 ? '⚠ Partial match — consider optimizing' :
                   '✗ Low match — optimization recommended'}
                </p>
              </div>

              {/* Generate Button (phase=original only) */}
              {phase === 'original' && (
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-sm shadow-lg shadow-blue-200 hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      AI is improving your resume...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate Tailored Resume
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}

              {/* Template Switcher */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-3">
                <p className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                  <Layout className="w-4 h-4 text-blue-600" />
                  Template
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {(['classic', 'executive', 'minimalist'] as TemplateType[]).map(t => (
                    <button
                      key={t}
                      onClick={() => handleTemplateChange(t)}
                      className={`py-2.5 rounded-xl border-2 text-[10px] font-bold capitalize transition-all ${
                        selectedTemplate === t
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Intelligence Panel (optimized phase only) */}
              {phase === 'optimized' && generatedResume && (
                <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-xl space-y-5">
                  <p className="font-bold flex items-center gap-2 text-blue-400 text-sm">
                    <Sparkles className="w-4 h-4" />
                    What AI Improved
                  </p>
                  <div className="space-y-3">
                    {generatedResume.strongPoints?.slice(0, 4).map((pt, i) => (
                      <div key={i} className="flex gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                  {generatedResume.missingKeywords?.length > 0 && (
                    <div>
                      <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-2">Still Missing</p>
                      <div className="flex flex-wrap gap-1.5">
                        {generatedResume.missingKeywords.slice(0, 6).map((kw, i) => (
                          <span key={i} className="px-2 py-0.5 bg-slate-800 text-[10px] rounded border border-slate-700 text-slate-400">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => setPhase('original')}
                    className="w-full text-xs text-slate-400 hover:text-white transition-colors py-2 border border-slate-700 rounded-xl hover:border-slate-500"
                  >
                    ← View Original
                  </button>
                </div>
              )}
            </div>

            {/* ── Resume Preview ── */}
            <div className="flex-1 w-full overflow-hidden print:overflow-visible">
              {isGenerating ? (
                <div className="bg-white rounded-2xl shadow-xl flex flex-col items-center justify-center p-24 border border-slate-200">
                  <div className="relative mb-8">
                    <div className="w-20 h-20 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
                    <Sparkles className="w-8 h-8 text-blue-600 absolute inset-0 m-auto animate-pulse" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">Improving Your Resume...</h2>
                  <p className="text-slate-500 mt-2 text-sm text-center max-w-xs">
                    AI is enhancing your existing experience with stronger language and relevant keywords.
                  </p>
                </div>
              ) : (
                <ResumeDocument 
                  content={displayContent} 
                  template={selectedTemplate} 
                  isTrial={isTrial && phase === 'optimized'}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Edit Modal ── */}
      {editing && generatedResume && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                  <Edit2 className="w-5 h-5 text-blue-600" /> Edit Resume Content
                </h2>
                <p className="text-sm text-slate-500 mt-1">Make direct changes to the AI-improved content</p>
              </div>
              <button
                onClick={() => setEditing(false)}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 transition-all"
              >
                ✕
              </button>
            </div>
            <div className="p-8 flex-1 overflow-auto">
              <textarea
                value={localResumeContent}
                onChange={(e) => setLocalResumeContent(e.target.value)}
                className="w-full h-[50vh] p-5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none font-mono text-sm leading-relaxed"
                placeholder="Resume content in markdown..."
              />
              <div className="flex gap-4 mt-6">
                <button onClick={() => setEditing(false)} className="flex-1 py-3 rounded-xl font-semibold text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-all">
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setGeneratedResume({ ...generatedResume, resumeText: localResumeContent })
                    setEditing(false)
                  }}
                  className="flex-1 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
