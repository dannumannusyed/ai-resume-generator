import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ResumeData {
  personalInfo: { firstName: string, lastName: string, email: string, phone: string, location: string }
  education: Array<{ school: string, degree: string, field: string, year: string }>
  experience: Array<{ company: string, position: string, duration: string, achievements: string }>
  skills: string[]
  projects: Array<{ name: string, description: string, link: string }>
  customSections?: Array<{ id: string, title: string, content: string }>
}

interface JobAnalysis {
  role?: string
  requiredSkills?: string[]
  niceToHave?: string[]
  keywords?: string[]
  experience?: string
  atsKeywords?: string[]
}

export interface GeneratedResume {
  resumeText: string
  atsScore: number
  strongPoints: string[]
  missingKeywords: string[]
  optimizations: string[]
}

interface AppStore {
  resumeData: ResumeData
  setResumeData: (data: ResumeData) => void
  
  jobPostingRaw: string
  setJobPostingRaw: (text: string) => void

  jobAnalysis: JobAnalysis | null
  setJobAnalysis: (analysis: JobAnalysis | null) => void

  generatedResume: GeneratedResume | null
  setGeneratedResume: (data: GeneratedResume | null) => void

  selectedTemplate: string
  setTemplate: (t: string) => void
}

export const useStore = create<AppStore>()(
  persist(
    (set) => ({
      resumeData: {
        personalInfo: { firstName: '', lastName: '', email: '', phone: '', location: '' },
        education: [],
        experience: [],
        skills: [],
        projects: [],
        customSections: [],
      },
      setResumeData: (data) => set({ resumeData: data }),

      jobPostingRaw: '',
      setJobPostingRaw: (text) => set({ jobPostingRaw: text }),

      jobAnalysis: null,
      setJobAnalysis: (analysis) => set({ jobAnalysis: analysis }),

      generatedResume: null,
      setGeneratedResume: (data) => set({ generatedResume: data }),

      selectedTemplate: 'classic',
      setTemplate: (t) => set({ selectedTemplate: t })
    }),
    {
      name: 'resume-builder-storage',
    }
  )
)
