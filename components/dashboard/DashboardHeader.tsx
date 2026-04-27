'use client'

import { Plus } from 'lucide-react'
import Link from 'next/link'

interface DashboardHeaderProps {
  userName?: string
}

export default function DashboardHeader({ userName }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
          Hello, {userName?.split(' ')[0] || 'there'}! 👋
        </h1>
        <p className="text-slate-500 font-medium">
          Welcome back. Ready to land your next dream job?
        </p>
      </div>
      
      <Link
        href="/builder/resume"
        className="inline-flex items-center gap-2 px-6 py-3.5 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 hover:shadow-blue-200 active:scale-[0.98]"
      >
        <Plus className="w-5 h-5" />
        Create New Resume
      </Link>
    </div>
  )
}
