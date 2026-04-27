'use client'

import { FileText, Clock, X, Trash2, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface ResumeCardProps {
  resume: {
    id: string
    name: string
    date: string
    atsScore: number
  }
  confirmDeleteId: string | null
  setConfirmDeleteId: (id: string | null) => void
  handleDeleteConfirm: (id: string) => void
  handleDownload: (resume: any) => void
}

export default function ResumeCard({ 
  resume, 
  confirmDeleteId, 
  setConfirmDeleteId, 
  handleDeleteConfirm,
  handleDownload
}: ResumeCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:border-blue-200 transition-all group relative">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <FileText className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
              {resume.name}
            </p>
            <p className="text-xs text-slate-500 flex items-center gap-1 font-medium">
              <Clock className="w-3 h-3" />
              {resume.date}
            </p>
          </div>
        </div>

        {/* Delete UI */}
        {confirmDeleteId !== resume.id ? (
          <button
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              setConfirmDeleteId(resume.id)
            }}
            className="ml-2 p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100"
            title="Delete Resume"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex items-center gap-1 ml-2 shrink-0 animate-in fade-in slide-in-from-right-2 duration-200">
            <button
              onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(null); }}
              className="px-2 py-1 text-[10px] uppercase font-bold rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
            >
              No
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleDeleteConfirm(resume.id); }}
              className="px-2 py-1 text-[10px] uppercase font-bold rounded-lg bg-rose-500 text-white hover:bg-rose-600 transition-all shadow-lg shadow-rose-100"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* ATS Score Section */}
      <div className="bg-slate-50 rounded-xl p-4 mb-5 border border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-blue-400">ATS Optimization</p>
          <span className="font-black text-slate-900 group-hover:text-blue-600 text-sm">{resume.atsScore}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-slate-900 group-hover:bg-blue-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${resume.atsScore}%` }}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Link 
          href={`/builder/preview?id=${resume.id}`} 
          className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold text-center hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-1"
        >
          Open
          <ChevronRight className="w-3 h-3" />
        </Link>
        <button 
          className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-100" 
          onClick={() => handleDownload(resume)}
        >
          Download
        </button>
      </div>
    </div>
  )
}
