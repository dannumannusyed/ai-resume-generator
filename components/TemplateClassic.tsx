import React from 'react'
import ReactMarkdown from 'react-markdown'

interface TemplateProps {
  content: string
}

export default function TemplateClassic({ content }: TemplateProps) {
  return (
    <div className="p-8 md:p-12 font-serif text-slate-900 bg-white shadow-sm border border-slate-200 h-full overflow-hidden">
      <div className="prose prose-slate max-w-none prose-sm leading-snug
        prose-h1:text-center prose-h1:text-3xl prose-h1:mb-1 prose-h1:font-bold prose-h1:text-black
        prose-h2:text-black prose-h2:text-lg prose-h2:font-bold prose-h2:uppercase prose-h2:tracking-wider prose-h2:border-b-2 prose-h2:border-slate-800 prose-h2:pb-1 prose-h2:mt-6 prose-h2:mb-3
        prose-h3:text-black prose-h3:text-md prose-h3:font-bold prose-h3:mt-3 prose-h3:mb-1
        prose-p:text-slate-700 prose-p:my-0.5
        [&>p:first-of-type]:text-center [&>p:first-of-type]:mb-0.5
        prose-li:my-0.5 prose-li:text-slate-700
        prose-strong:text-black prose-strong:font-semibold
        marker:text-slate-800">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  )
}
