'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Zap, ArrowRight, ArrowLeft } from 'lucide-react'
import { useStore } from '@/lib/store'
import PersonalInfoStep from '@/components/builder/PersonalInfoStep'
import EducationStep from '@/components/builder/EducationStep'
import ExperienceStep from '@/components/builder/ExperienceStep'
import SkillsStep from '@/components/builder/SkillsStep'
import ProjectsStep from '@/components/builder/ProjectsStep'
import TemplateStep from '@/components/builder/TemplateStep'

const INITIAL_STEPS = [
  { id: 'personal', title: 'Personal Info', icon: '👤' },
  { id: 'education', title: 'Education', icon: '🎓' },
  { id: 'experience', title: 'Experience', icon: '💼' },
  { id: 'skills', title: 'Skills', icon: '⚡' },
  { id: 'projects', title: 'Projects', icon: '🚀' },
  { id: 'template', title: 'Choose Template', icon: '🎨' },
]

export default function ResumeBuilder() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState(INITIAL_STEPS)
  const resumeData = useStore((state) => state.resumeData)
  const setResumeData = useStore((state) => state.setResumeData)
  const selectedTemplate = useStore((state) => state.selectedTemplate)
  const setTemplate = useStore((state) => state.setTemplate)
  const [isUploading, setIsUploading] = useState(false)
  const [skillsText, setSkillsText] = useState(resumeData.skills.join(', '))
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([])

  useEffect(() => {
    // Only update skillsText if the actual skills array has changed in a meaningful way
    // This prevents stripping trailing commas or spaces while the user is typing
    const currentSkills = skillsText.split(/[,\s]+/).map(s => s.trim()).filter(Boolean)
    const storeSkills = resumeData.skills.map((s: string) => s.trim()).filter(Boolean)
    
    if (JSON.stringify(currentSkills) !== JSON.stringify(storeSkills)) {
      setSkillsText(resumeData.skills.join(', '))
    }
  }, [resumeData.skills])

  useEffect(() => {
    const jobAnalysisStr = localStorage.getItem('current_job_analysis')
    if (jobAnalysisStr) {
      try {
        const analysis = JSON.parse(jobAnalysisStr)
        const combined = [...(analysis.requiredSkills || []), ...(analysis.niceToHave || []), ...(analysis.atsKeywords || [])]
        const uniqueSkills = Array.from(new Set(combined.map((s: string) => s.trim()).filter(Boolean)))
        setSuggestedSkills(uniqueSkills)
      } catch(e) {}
    }
  }, [])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file.')
      return
    }

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/parse-resume', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) throw new Error('Failed to parse PDF.')

      const { data } = await res.json()
      if (data) {
        setResumeData({
          ...useStore.getState().resumeData,
          personalInfo: { ...useStore.getState().resumeData.personalInfo, ...data.personalInfo },
          education: data.education?.length ? data.education : useStore.getState().resumeData.education,
          experience: data.experience?.length ? data.experience : useStore.getState().resumeData.experience,
          skills: data.skills?.length ? data.skills : useStore.getState().resumeData.skills,
          projects: data.projects?.length ? data.projects : useStore.getState().resumeData.projects,
        })
        alert('Resume parsed successfully! Please review the imported data.')
      }
    } catch (err: any) {
      console.error(err)
      alert('Error parsing resume: ' + err.message)
    } finally {
      setIsUploading(false)
      e.target.value = ''
    }
  }

  const handleFillDemoData = () => {
    setResumeData({
      personalInfo: { firstName: 'Sarah', lastName: 'Chen', email: 'sarah.chen@tech.io', phone: '(555) 012-3456', location: 'San Francisco, CA' },
      education: [{ school: 'Stanford University', degree: 'BS', field: 'Computer Science', year: '2020' }],
      experience: [{ company: 'Stripe', position: 'Software Engineer', duration: '2021 - Present', achievements: 'Led migration to microservices architecture, reducing latency by 40%. Implemented Redis caching.' }],
      skills: ['Python', 'TypeScript', 'React', 'Node.js', 'AWS', 'Docker', 'PostgreSQL'],
      projects: [{ name: 'PaymentGateway', description: 'Built an open-source payment wrapper.', link: 'github.com/sarah/pay' }],
      customSections: []
    })
    setCurrentStep(0)
  }

  const handleClearForm = () => {
    if (window.confirm("Are you sure you want to clear all data? This cannot be undone.")) {
      setResumeData({
        personalInfo: { firstName: '', lastName: '', email: '', phone: '', location: '' },
        education: [],
        experience: [],
        skills: [],
        projects: [],
        customSections: []
      })
      localStorage.removeItem('current_job_analysis')
      setCurrentStep(0)
    }
  }

  const handleNext = () => {
    if (currentStep === 0) {
      const { firstName, email, phone } = resumeData.personalInfo
      if (!firstName.trim() || !email.trim() || !phone.trim()) {
        alert("Please fill out your First Name, Email, and Phone Number before continuing.")
        return
      }
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      router.push('/builder/job')
    }
  }

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1)
  }

  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 selection:bg-blue-100 italic-text-fix">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-200">
              <Zap className="w-8 h-8 text-white fill-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">AI Resume Builder</h1>
              <p className="text-slate-500 font-medium italic">Crafting your professional future</p>
            </div>
          </div>

          <div className="flex bg-white p-2 rounded-2xl border border-slate-200 shadow-sm gap-2">
            <button 
              onClick={handleFillDemoData} 
              className="px-4 py-2 text-xs font-black uppercase tracking-widest text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
            >
              Demo Data
            </button>
            <div className="w-[1px] bg-slate-100" />
            <button 
              onClick={handleClearForm} 
              className="px-4 py-2 text-xs font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
            >
              Clear
            </button>
            <div className="w-[1px] bg-slate-100" />
            <div className="px-4 py-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Step {currentStep + 1}/{steps.length}</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <aside className="lg:col-span-3 space-y-3">
             {steps.map((step, index) => (
               <button
                 key={step.id}
                 onClick={() => setCurrentStep(index)}
                 className={`w-full text-left px-5 py-4 rounded-2xl transition-all flex items-center gap-4 border-2 ${
                   index === currentStep
                     ? 'bg-white border-blue-600 text-blue-700 shadow-xl shadow-blue-50'
                     : index < currentStep
                       ? 'bg-slate-50 border-transparent text-emerald-600 opacity-80 hover:opacity-100'
                       : 'bg-white border-transparent text-slate-400 hover:bg-slate-50'
                 }`}
               >
                 <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black ${
                   index === currentStep ? 'bg-blue-600 text-white' : index < currentStep ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100'
                 }`}>
                   {index < currentStep ? '✓' : index + 1}
                 </span>
                 <span className="font-bold tracking-tight">{step.title}</span>
               </button>
             ))}
             
             <div className="mt-8 p-6 bg-gradient-to-br from-slate-900 to-black rounded-[2rem] text-white overflow-hidden relative group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.2),transparent)] opacity-50" />
                <div className="relative z-10">
                   <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md">
                        <Check className="w-4 h-4 text-blue-400" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Resume Strength</span>
                   </div>
                   <div className="flex items-end gap-2 mb-3">
                      <span className="text-4xl font-black">{Math.round(progress)}%</span>
                      <span className="text-xs text-slate-400 font-bold mb-1.5 whitespace-nowrap">Industry Standard</span>
                   </div>
                   <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mb-2">
                      <div className="bg-blue-500 h-full rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
                   </div>
                   <p className="text-[10px] text-slate-400 font-medium">Keep going! Higher score means more interviews.</p>
                </div>
             </div>
          </aside>

          <main className="lg:col-span-9">
            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100 p-8 md:p-12 min-h-[600px] flex flex-col">
              <div className="flex-1">
                {currentStep === 0 && (
                  <PersonalInfoStep 
                    resumeData={resumeData} 
                    setResumeData={setResumeData} 
                    isUploading={isUploading} 
                    handleFileUpload={handleFileUpload} 
                  />
                )}
                {currentStep === 1 && <EducationStep resumeData={resumeData} setResumeData={setResumeData} />}
                {currentStep === 2 && <ExperienceStep resumeData={resumeData} setResumeData={setResumeData} />}
                {currentStep === 3 && (
                  <SkillsStep 
                    skillsText={skillsText} 
                    setSkillsText={setSkillsText} 
                    resumeData={resumeData} 
                    setResumeData={setResumeData} 
                    suggestedSkills={suggestedSkills} 
                  />
                )}
                {currentStep === 4 && <ProjectsStep resumeData={resumeData} setResumeData={setResumeData} />}
                {currentStep === 5 && (
                  <TemplateStep 
                    selectedTemplate={selectedTemplate} 
                    setTemplate={setTemplate} 
                  />
                )}
              </div>

              <footer className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between gap-4">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className="px-8 py-4 rounded-2xl border border-slate-200 text-slate-500 font-bold hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 group"
                >
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  Previous
                </button>
                
                <button
                  onClick={handleNext}
                  className="flex-1 max-w-xs px-8 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-blue-600 shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95 group"
                >
                  {currentStep === steps.length - 1 ? 'Finish Project' : 'Continue'}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </footer>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
