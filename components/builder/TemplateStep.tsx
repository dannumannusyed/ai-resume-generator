'use client'

import { Check, Sparkles } from 'lucide-react'

interface TemplateStepProps {
  selectedTemplate: string
  setTemplate: (tpl: string) => void
}

const templates = [
  { id: 'classic', name: 'Classic', icon: '📄', description: 'Traditional & Clean', primaryColor: 'slate' },
  { id: 'executive', name: 'Executive', icon: '💎', description: 'High-Trust & Sidebar', primaryColor: 'blue' },
  { id: 'minimalist', name: 'Minimalist', icon: '☁️', description: 'Elegant Whitespace', primaryColor: 'indigo' },
  { id: 'modern', name: 'Modern', icon: '🚀', description: 'Dynamic & Bold', primaryColor: 'cyan' },
  { id: 'creative', name: 'Creative', icon: '🎨', description: 'Visual & Unique', primaryColor: 'pink' },
]

export default function TemplateStep({ selectedTemplate, setTemplate }: TemplateStepProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Choose Your Design</h2>
        <p className="text-slate-500 font-medium leading-relaxed">
          Select a layout that best matches your target industry. You can preview and change this at any time later.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
        {templates.map((tpl) => (
          <button
            key={tpl.id}
            onClick={() => setTemplate(tpl.id)}
            className={`group relative p-8 rounded-[2.5rem] border-4 transition-all duration-500 text-left flex flex-col items-center text-center overflow-hidden h-full ${
              selectedTemplate === tpl.id
                ? 'border-blue-600 bg-white ring-8 ring-blue-50/50 shadow-2xl shadow-blue-200'
                : 'border-slate-100 bg-slate-50/50 hover:bg-white hover:border-blue-200 hover:shadow-xl hover:shadow-slate-100'
            }`}
          >
            {/* Background Accent */}
            <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full opacity-5 transition-all group-hover:scale-150 duration-700 ${
              selectedTemplate === tpl.id ? 'bg-blue-600' : 'bg-slate-900'
            }`} />

            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-6 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 ${
              selectedTemplate === tpl.id 
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' 
                : 'bg-white shadow-lg shadow-slate-100 text-slate-400 group-hover:text-blue-500'
            }`}>
              {tpl.icon}
            </div>
            
            <h3 className={`font-black text-xl mb-2 transition-colors ${
              selectedTemplate === tpl.id ? 'text-blue-700' : 'text-slate-900'
            }`}>
              {tpl.name}
            </h3>
            
            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6 px-4">
              {tpl.description}
            </p>
            
            {selectedTemplate === tpl.id && (
              <div className="mt-auto px-6 py-2 bg-blue-600 text-white rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 animate-in slide-in-from-bottom-2">
                <Check className="w-4 h-4" />
                Selected
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Sparkles className="w-32 h-32 text-blue-400" />
         </div>
         <div className="relative z-10 flex items-center gap-6 max-w-2xl">
            <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-inner">
              💡
            </div>
            <div>
              <p className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-2">Pro Tip</p>
              <p className="text-slate-300 leading-relaxed font-medium">
                <strong>Executive</strong> is highly recommended for corporate roles, while <strong>Minimalist</strong> works best for tech and design. All our templates are <span className="text-white font-bold">ATS-compatible</span>.
              </p>
            </div>
         </div>
      </div>
    </div>
  )
}
