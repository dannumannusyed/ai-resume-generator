'use client'

import { Sparkles, Plus } from 'lucide-react'

interface SkillsStepProps {
  skillsText: string
  setSkillsText: (text: string) => void
  resumeData: any
  setResumeData: (data: any) => void
  suggestedSkills: string[]
}

export default function SkillsStep({ 
  skillsText, 
  setSkillsText, 
  resumeData, 
  setResumeData, 
  suggestedSkills 
}: SkillsStepProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
      <div>
        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Your Skills (comma-separated)</label>
        <textarea
          rows={6}
          value={skillsText}
          onChange={(e) => {
            setSkillsText(e.target.value)
            setResumeData({
              ...resumeData, 
              skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
            })
          }}
          placeholder="React, TypeScript, AWS, Project Management..."
          className="w-full px-6 py-5 rounded-[2rem] bg-slate-50 border border-slate-200 focus:ring-8 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium text-slate-900 shadow-inner mt-2 resize-none"
        ></textarea>

        {suggestedSkills.length > 0 && (
          <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-[2.5rem] border border-blue-100 shadow-sm">
            <p className="text-sm font-black text-blue-900 mb-6 flex items-center gap-2 uppercase tracking-widest">
              <Sparkles className="w-5 h-5 text-blue-600 animate-pulse" />
              AI Recommended Keywords
            </p>
            <div className="flex flex-wrap gap-3">
              {suggestedSkills.filter(skill => !resumeData.skills.some((s: string) => s.toLowerCase() === skill.toLowerCase())).map((skill, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    const prev = skillsText.trim()
                    const newText = prev ? (prev.endsWith(',') ? prev + ' ' + skill : prev + ', ' + skill) : skill
                    setSkillsText(newText)
                    setResumeData({
                      ...resumeData, 
                      skills: newText.split(',').map(s => s.trim()).filter(Boolean)
                    })
                  }}
                  className="text-xs px-4 py-2.5 bg-white text-blue-700 border border-blue-200 rounded-2xl hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-lg hover:shadow-blue-100 transition-all font-bold flex items-center gap-2 active:scale-95"
                >
                  <Plus className="w-3 h-3" />
                  {skill}
                </button>
              ))}
              {suggestedSkills.filter(skill => !resumeData.skills.some((s: string) => s.toLowerCase() === skill.toLowerCase())).length === 0 && (
                <div className="w-full text-center py-4 text-slate-400 font-medium italic">
                  Awesome! You've added all our recommended keywords.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
