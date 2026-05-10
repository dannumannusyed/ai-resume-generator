import React from 'react'
import ReactMarkdown from 'react-markdown'

interface TemplateProps {
  content: string
}

export default function TemplateClassic({ content }: TemplateProps) {
  return (
    <div className="p-16 print:pt-8 font-serif text-slate-900 bg-white shadow-2xl print:shadow-none h-full w-full overflow-hidden">
      <div className="prose prose-slate max-w-none prose-sm leading-relaxed
        prose-h1:text-center prose-h1:text-[22pt] prose-h1:mb-2 prose-h1:font-bold prose-h1:text-slate-900 prose-h1:tracking-tight
        prose-h2:text-slate-900 prose-h2:text-[11pt] prose-h2:font-bold prose-h2:uppercase prose-h2:tracking-[0.15em] prose-h2:border-b prose-h2:border-slate-900 prose-h2:pb-1 prose-h2:mt-10 prose-h2:mb-4
        prose-h3:text-slate-900 prose-h3:text-[11pt] prose-h3:font-bold prose-h3:mt-6 prose-h3:mb-1
        prose-p:text-slate-700 prose-p:text-[10pt] prose-p:my-1
        [&>p:first-of-type]:text-center [&>p:first-of-type]:text-[10pt] [&>p:first-of-type]:text-slate-600 [&>p:first-of-type]:mb-4 [&>p:first-of-type]:italic
        prose-li:my-1 prose-li:text-[10pt] prose-li:text-slate-700
        prose-strong:text-slate-900 prose-strong:font-bold
        marker:text-slate-900">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  )
}
