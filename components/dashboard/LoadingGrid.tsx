'use client'

export default function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 animate-pulse">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-slate-100 rounded-xl" />
            <div className="flex-1">
              <div className="h-4 bg-slate-100 rounded w-3/4 mb-2" />
              <div className="h-3 bg-slate-50 rounded w-1/2" />
            </div>
          </div>
          <div className="h-20 bg-slate-50 rounded-xl mb-6" />
          <div className="flex gap-2">
            <div className="h-10 bg-slate-50 rounded-xl flex-1" />
            <div className="h-10 bg-slate-100 rounded-xl flex-1" />
          </div>
        </div>
      ))}
    </div>
  )
}
