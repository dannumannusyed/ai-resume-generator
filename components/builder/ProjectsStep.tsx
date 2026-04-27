'use client'

import { Rocket, Plus, Trash2, Link as LinkIcon } from 'lucide-react'

interface ProjectsStepProps {
  resumeData: any
  setResumeData: (data: any) => void
}

export default function ProjectsStep({ resumeData, setResumeData }: ProjectsStepProps) {
  const addProject = () => {
    setResumeData({
      ...resumeData, 
      projects: [...resumeData.projects, { name: '', description: '', link: '' }]
    })
  }

  const updateProject = (index: number, fields: any) => {
    const newProj = [...resumeData.projects]
    newProj[index] = { ...newProj[index], ...fields }
    setResumeData({ ...resumeData, projects: newProj })
  }

  const removeProject = (index: number) => {
    const newProj = resumeData.projects.filter((_: any, i: number) => i !== index)
    setResumeData({ ...resumeData, projects: newProj })
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      {resumeData.projects.map((proj: any, index: number) => (
        <div key={index} className="group relative bg-slate-50 border border-slate-200 rounded-3xl p-6 transition-all hover:border-blue-200 hover:bg-white hover:shadow-xl hover:shadow-slate-100">
          <button 
            onClick={() => removeProject(index)}
            className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:shadow-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-10"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Project Name</label>
              <div className="relative">
                <Rocket className="absolute left-4 top-3.5 w-5 h-5 text-slate-300" />
                <input 
                  type="text" 
                  className="w-full pl-12 pr-5 py-3.5 rounded-2xl bg-white border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium text-slate-900 shadow-sm" 
                  placeholder="e.g. AI Resume Generator"
                  value={proj.name}
                  onChange={(e) => updateProject(index, { name: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Description</label>
                <textarea 
                  rows={3} 
                  className="w-full px-5 py-4 rounded-2xl bg-white border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium text-slate-900 shadow-sm resize-none"
                  placeholder="Briefly describe what you built and the impact it had..."
                  value={proj.description}
                  onChange={(e) => updateProject(index, { description: e.target.value })}
                ></textarea>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Project Link (Optional)</label>
                <div className="relative">
                  <LinkIcon className="absolute left-4 top-3.5 w-4 h-4 text-slate-300" />
                  <input 
                    type="url" 
                    className="w-full pl-12 pr-5 py-3.5 rounded-2xl bg-white border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium text-slate-900 shadow-sm" 
                    placeholder="e.g. github.com/yourusername/project"
                    value={proj.link}
                    onChange={(e) => updateProject(index, { link: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <button 
        onClick={addProject}
        className="w-full py-4 rounded-2xl border-2 border-dashed border-slate-200 text-slate-500 font-bold hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 transition-all flex items-center justify-center gap-2 group"
      >
        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
        Add Another Project
      </button>
    </div>
  )
}
