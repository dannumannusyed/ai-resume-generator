'use client'

import { useState } from 'react'
import { Presentation, Loader2, Sparkles, HelpCircle, MessageSquare } from 'lucide-react'
import { useStore } from '@/lib/store'

interface Question {
  question: string
  category: string
  hint: string
}

export default function InterviewPrep() {
  const [jobPosting, setJobPosting] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null)

  const { resumeData } = useStore()

  const handleGenerate = async () => {
    if (!jobPosting.trim()) {
      setError('Please provide a job description.')
      return
    }

    if (!resumeData.personalInfo.firstName && resumeData.experience.length === 0) {
      setError('Please add some information to your resume in the Builder first.')
      return
    }

    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/interview-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobPosting,
          resumeData
        })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate interview questions')
      }

      setQuestions(data.questions || [])
      if (data.questions?.length > 0) setActiveQuestion(0)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-6 w-full h-full flex flex-col">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center shadow-sm">
            <Presentation className="w-6 h-6 text-purple-600" />
          </div>
          AI Interview Prep
        </h1>
        <p className="text-slate-500 font-medium italic">Practice for your next interview with contextual questions tailored to you.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 flex-1">
        
        {/* Left Column / Input Panel */}
        <div className="lg:col-span-5 flex flex-col bg-white border border-slate-200 rounded-2xl shadow-sm h-fit">
          <div className="p-6 border-b border-slate-100 bg-slate-50 rounded-t-2xl flex justify-between items-center">
            <h2 className="font-semibold text-slate-800">Job Description</h2>
            {resumeData.personalInfo.firstName ? (
              <span className="text-xs px-2.5 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                Resume Context Active
              </span>
            ) : (
              <span className="text-xs px-2.5 py-1 bg-orange-100 text-orange-700 rounded-full font-medium">
                No Resume Data
              </span>
            )}
          </div>
          <div className="p-6 flex flex-col">
            <textarea
              className="w-full h-64 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none mb-4"
              placeholder="Paste the target job description here to generate contextual interview questions..."
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
              className="w-full btn-primary py-3 px-4 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing Match & Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Custom Interview
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column / Output Panel */}
        <div className="lg:col-span-7 flex flex-col">
          {questions.length === 0 ? (
            <div className="h-full bg-white border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center p-12 min-h-[400px]">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <HelpCircle className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-2">Ready for your mock interview?</h3>
              <p className="text-slate-500 max-w-md">
                Paste a job description on the left. Our AI will analyze your resume against the requirements and generate the most likely questions you'll face.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="font-bold text-xl text-slate-800">Your Practice Questions</h3>
                <span className="text-sm font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                  {questions.length} Questions
                </span>
              </div>
              
              {questions.map((q, idx) => (
                <div 
                  key={idx} 
                  className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 ${activeQuestion === idx ? 'border-purple-300 shadow-md ring-1 ring-purple-100' : 'border-slate-200 hover:border-slate-300'}`}
                >
                  <button 
                    className="w-full text-left p-5 flex items-start gap-4 focus:outline-none"
                    onClick={() => setActiveQuestion(activeQuestion === idx ? null : idx)}
                  >
                    <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${activeQuestion === idx ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          q.category === 'behavioral' ? 'bg-blue-50 text-blue-600' : 
                          q.category === 'technical' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          {q.category}
                        </span>
                      </div>
                      <h4 className={`font-medium ${activeQuestion === idx ? 'text-slate-900' : 'text-slate-700'}`}>
                        {q.question}
                      </h4>
                    </div>
                  </button>
                  
                  {activeQuestion === idx && (
                    <div className="p-5 pt-0 pl-14">
                      <div className="bg-purple-50/50 border border-purple-100 p-4 rounded-xl relative">
                        <div className="absolute -top-3 left-4 bg-white border border-purple-100 px-2 py-0.5 rounded text-xs font-bold text-purple-600 flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" /> COACH HINT
                        </div>
                        <p className="text-sm text-slate-700 pt-2">{q.hint}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
