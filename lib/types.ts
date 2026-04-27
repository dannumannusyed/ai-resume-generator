export type ResumeData = {
  personalInfo: PersonalInfo
  education: Education[]
  experience: Experience[]
  skills: string[]
  projects: Project[]
}

export type PersonalInfo = {
  firstName: string
  lastName: string
  email: string
  phone: string
  location: string
  summary: string
}

export type Education = {
  school: string
  degree: string
  field: string
  startDate: string
  endDate: string
}

export type Experience = {
  company: string
  position: string
  startDate: string
  endDate: string
  description: string
  current: boolean
}

export type Project = {
  name: string
  description: string
  technologies: string[]
  link: string
}

export type JobAnalysis = {
  role: string
  company: string
  requiredSkills: string[]
  niceToHave: string[]
  keywords: string[]
  atsKeywords: string[]
  yearsExperience: string
}

export type ATSSuggestions = {
  strengths: string[]
  improvements: string[]
  missingKeywords: string[]
  tips: string[]
}

export type PricingPlan = {
  name: string
  price: string
  resumes: number | string
  features: string[]
}

export type User = {
  id: string
  email: string
  name: string
  createdAt: Date
  trialsRemaining: number
  subscription?: 'free' | 'pro' | 'unlimited'
}
