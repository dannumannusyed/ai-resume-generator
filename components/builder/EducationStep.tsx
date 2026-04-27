'use client'

import { GraduationCap, Plus, Trash2 } from 'lucide-react'

interface EducationStepProps {
  resumeData: any
  setResumeData: (data: any) => void
}

export default function EducationStep({ resumeData, setResumeData }: EducationStepProps) {
  const addEducation = () => {
    setResumeData({
      ...resumeData, 
      education: [...resumeData.education, { school: '', degree: '', field: '', year: '' }]
    })
  }

  const updateEducation = (index: number, fields: any) => {
    const newEdu = [...resumeData.education]
    newEdu[index] = { ...newEdu[index], ...fields }
    setResumeData({ ...resumeData, education: newEdu })
  }

  const removeEducation = (index: number) => {
    const newEdu = resumeData.education.filter((_: any, i: number) => i !== index)
    setResumeData({ ...resumeData, education: newEdu })
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      {resumeData.education.map((edu: any, index: number) => (
        <div key={index} className="group relative bg-slate-50 border border-slate-200 rounded-3xl p-6 transition-all hover:border-blue-200 hover:bg-white hover:shadow-xl hover:shadow-slate-100">
          <button 
            onClick={() => removeEducation(index)}
            className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:shadow-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-10"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">University / School</label>
              <div className="relative">
                <GraduationCap className="absolute left-4 top-4 w-5 h-5 text-slate-300" />
                <input 
                  type="text" 
                  className="w-full pl-12 pr-5 py-4 rounded-2xl bg-white border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium text-slate-900 shadow-sm" 
                  placeholder="e.g. Stanford University"
                  value={edu.school}
                  onChange={(e) => updateEducation(index, { school: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Degree</label>
                <input 
                  type="text" 
                  className="w-full px-5 py-3.5 rounded-2xl bg-white border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium text-slate-900 shadow-sm" 
                  placeholder="e.g. Bachelor of Science"
                  value={edu.degree}
                  onChange={(e) => updateEducation(index, { degree: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Graduation Year</label>
                <input 
                  type="text" 
                  className="w-full px-5 py-3.5 rounded-2xl bg-white border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium text-slate-900 shadow-sm" 
                  placeholder="e.g. 2024"
                  value={edu.year}
                  onChange={(e) => updateEducation(index, { year: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>
      ))}

      <button 
        onClick={addEducation}
        className="w-full py-4 rounded-2xl border-2 border-dashed border-slate-200 text-slate-500 font-bold hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 transition-all flex items-center justify-center gap-2 group"
      >
        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
        Add Another Education
      </button>
    </div>
  )
}
