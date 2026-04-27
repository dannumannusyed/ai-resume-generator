'use client'

import { useState } from 'react'
import { UploadCloud, Sparkles, Loader2 } from 'lucide-react'

interface PersonalInfoStepProps {
  resumeData: any
  setResumeData: (data: any) => void
  isUploading: boolean
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement> | { target: { files: FileList | null, value: string } }) => void
}

export default function PersonalInfoStep({ 
  resumeData, 
  setResumeData, 
  isUploading, 
  handleFileUpload 
}: PersonalInfoStepProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      if (files[0].type !== 'application/pdf') {
        alert('Please drop a PDF file.')
        return
      }
      // Mocking the event structure for compatibility with existing handler
      handleFileUpload({ target: { files, value: '' } } as any)
    }
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
      {/* PDF Upload Banner */}
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-[2.5rem] p-10 relative overflow-hidden transition-all duration-300 border-4 border-dashed ${
          isDragging 
            ? 'border-white/50 scale-[1.02] shadow-2xl shadow-blue-400 p-12' 
            : 'border-transparent shadow-xl shadow-blue-100'
        }`}
      >
        <div className={`absolute top-0 right-0 p-4 transition-all duration-500 ${isDragging ? 'opacity-30 scale-125 rotate-12' : 'opacity-10 scale-100'}`}>
          <UploadCloud className="w-56 h-56 text-white" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-3xl font-black text-white flex items-center justify-center md:justify-start gap-3 mb-3 tracking-tight">
              <Sparkles className={`w-8 h-8 text-yellow-300 ${isDragging ? 'animate-bounce' : 'animate-pulse'}`} /> 
              {isDragging ? 'Drop it here!' : 'Import from PDF'}
            </h3>
            <p className="text-blue-100 font-medium max-w-sm text-lg leading-relaxed">
              {isDragging 
                ? 'Great! Release to start extracting with AI.' 
                : 'Upload your current resume and let our AI extract everything in seconds.'}
            </p>
          </div>
          <label className="shrink-0 group">
            <input 
              type="file" 
              accept="application/pdf" 
              className="hidden" 
              disabled={isUploading} 
              onChange={handleFileUpload} 
            />
            <div className={`px-10 py-5 bg-white text-blue-700 rounded-3xl font-black shadow-2xl transition-all cursor-pointer flex items-center gap-3 active:scale-95 group-hover:bg-blue-50 group-hover:scale-105 ${isUploading ? 'opacity-70 pointer-events-none' : ''}`}>
              {isUploading ? <Loader2 className="w-6 h-6 animate-spin text-blue-600" /> : <UploadCloud className="w-6 h-6" />}
              <span className="uppercase tracking-widest text-sm">
                {isUploading ? 'AI Parsing...' : 'Select or Drag PDF'}
              </span>
            </div>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">First Name</label>
          <input
            type="text"
            placeholder="John"
            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium text-slate-900"
            value={resumeData.personalInfo.firstName}
            onChange={(e) =>
              setResumeData({
                ...resumeData,
                personalInfo: { ...resumeData.personalInfo, firstName: e.target.value },
              })
            }
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Last Name</label>
          <input
            type="text"
            placeholder="Doe"
            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium text-slate-900"
            value={resumeData.personalInfo.lastName}
            onChange={(e) =>
              setResumeData({
                ...resumeData,
                personalInfo: { ...resumeData.personalInfo, lastName: e.target.value },
              })
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
        <div className="relative">
          <input
            type="email"
            placeholder="john@example.com"
            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium text-slate-900"
            value={resumeData.personalInfo.email}
            onChange={(e) =>
              setResumeData({
                ...resumeData,
                personalInfo: { ...resumeData.personalInfo, email: e.target.value },
              })
            }
          />
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          {['@gmail.com', '@yahoo.com', '@outlook.com'].map((domain) => (
            <button
              key={domain}
              type="button"
              className="text-[10px] font-bold uppercase px-3 py-1.5 bg-white text-slate-500 border border-slate-200 rounded-lg hover:border-blue-200 hover:text-blue-600 transition-all"
              onClick={() => {
                const prefix = resumeData.personalInfo.email.split('@')[0] || ''
                setResumeData({
                  ...resumeData,
                  personalInfo: { ...resumeData.personalInfo, email: prefix + domain }
                })
              }}
            >
              {domain}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Phone</label>
          <input
            type="tel"
            placeholder="+1 (555) 000-0000"
            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium text-slate-900"
            value={resumeData.personalInfo.phone}
            onChange={(e) =>
              setResumeData({
                ...resumeData,
                personalInfo: { ...resumeData.personalInfo, phone: e.target.value },
              })
            }
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Location</label>
          <input
            type="text"
            placeholder="San Francisco, CA"
            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium text-slate-900"
            value={resumeData.personalInfo.location}
            onChange={(e) =>
              setResumeData({
                ...resumeData,
                personalInfo: { ...resumeData.personalInfo, location: e.target.value },
              })
            }
          />
        </div>
      </div>
    </div>
  )
}
