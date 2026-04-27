'use client'

import { Briefcase, Plus, Trash2 } from 'lucide-react'

interface ExperienceStepProps {
  resumeData: any
  setResumeData: (data: any) => void
}

export default function ExperienceStep({ resumeData, setResumeData }: ExperienceStepProps) {
  const addExperience = () => {
    setResumeData({
      ...resumeData, 
      experience: [...resumeData.experience, { company: '', position: '', duration: '', achievements: '' }]
    })
  }

  const updateExperience = (index: number, fields: any) => {
    const newExp = [...resumeData.experience]
    newExp[index] = { ...newExp[index], ...fields }
    setResumeData({ ...resumeData, experience: newExp })
  }

  const removeExperience = (index: number) => {
    const newExp = resumeData.experience.filter((_: any, i: number) => i !== index)
    setResumeData({ ...resumeData, experience: newExp })
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      {resumeData.experience.map((exp: any, index: number) => (
        <div key={index} className="group relative bg-slate-50 border border-slate-200 rounded-3xl p-6 transition-all hover:border-blue-200 hover:bg-white hover:shadow-xl hover:shadow-slate-100">
          <button 
            onClick={() => removeExperience(index)}
            className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:shadow-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-10"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Company Name</label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-3.5 w-5 h-5 text-slate-300" />
                  <input 
                    type="text" 
                    className="w-full pl-12 pr-5 py-3.5 rounded-2xl bg-white border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium text-slate-900 shadow-sm" 
                    placeholder="e.g. Google"
                    value={exp.company}
                    onChange={(e) => updateExperience(index, { company: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Job Position</label>
                <input 
                  type="text" 
                  className="w-full px-5 py-3.5 rounded-2xl bg-white border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium text-slate-900 shadow-sm" 
                  placeholder="e.g. Senior Product Manager"
                  value={exp.position}
                  onChange={(e) => updateExperience(index, { position: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Key Achievements (Bullet points)</label>
              <textarea
                rows={4}
                className="w-full px-5 py-4 rounded-2xl bg-white border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium text-slate-900 shadow-sm resize-none"
                placeholder="• Led a team of 5 to redesign the core product...
• Increased user retention by 20% through data-driven optimizations..."
                value={exp.achievements}
                onChange={(e) => updateExperience(index, { achievements: e.target.value })}
              ></textarea>
            </div>
          </div>
        </div>
      ))}

      <button 
        onClick={addExperience}
        className="w-full py-4 rounded-2xl border-2 border-dashed border-slate-200 text-slate-500 font-bold hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 transition-all flex items-center justify-center gap-2 group"
      >
        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
        Add Work Experience
      </button>
    </div>
  )
}
