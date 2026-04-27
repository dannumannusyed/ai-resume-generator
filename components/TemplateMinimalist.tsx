import React from 'react'
import ReactMarkdown from 'react-markdown'

interface TemplateProps {
  content: string
}

export default function TemplateMinimalist({ content }: TemplateProps) {
  return (
    <div className="bg-white h-full w-full shadow-lg print:shadow-none font-light py-12 px-16 text-slate-700 overflow-hidden">
      <div className="prose prose-slate max-w-none 
        prose-h1:text-center prose-h1:text-4xl prose-h1:font-extralight prose-h1:tracking-[0.1em] prose-h1:mb-2 prose-h1:text-slate-900
        prose-h2:text-center prose-h2:text-[10px] prose-h2:uppercase prose-h2:tracking-[0.4em] prose-h2:font-bold prose-h2:text-slate-400 prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-none
        prose-h3:text-slate-800 prose-h3:text-sm prose-h3:font-bold prose-h3:mt-6 prose-h3:mb-1 prose-h3:uppercase prose-h3:tracking-widest
        prose-p:text-slate-500 prose-p:text-center prose-p:text-xs prose-p:my-1
        [&>p:not(:first-of-type)]:text-left [&>p:not(:first-of-type)]:text-sm
        prose-li:text-slate-500 prose-li:text-sm prose-li:my-1
        prose-strong:text-slate-800 prose-strong:font-medium">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>

      {/* Adding a subtle footline */}
      <div className="mt-20 border-t border-slate-100 pt-8 flex justify-center opacity-30">
        <div className="w-1 h-1 bg-slate-300 rounded-full mx-2" />
        <div className="w-1 h-1 bg-slate-300 rounded-full mx-2" />
        <div className="w-1 h-1 bg-slate-300 rounded-full mx-2" />
      </div>
    </div>
  )
}
