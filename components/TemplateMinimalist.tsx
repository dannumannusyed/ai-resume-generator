import React from 'react'
import ReactMarkdown from 'react-markdown'

interface TemplateProps {
  content: string
}

export default function TemplateMinimalist({ content }: TemplateProps) {
  return (
    <div className="bg-white h-full w-full shadow-2xl print:shadow-none font-sans py-20 print:pt-10 px-24 text-slate-700 overflow-hidden">
      <div className="prose prose-slate max-w-none 
        prose-h1:text-center prose-h1:text-5xl prose-h1:font-thin prose-h1:tracking-[0.15em] prose-h1:mb-4 prose-h1:text-slate-900 prose-h1:uppercase
        prose-p:text-slate-500 prose-p:text-center prose-p:text-[9pt] prose-p:tracking-[0.1em] prose-p:uppercase prose-p:my-2 prose-p:font-medium
        [&>p:not(:first-of-type)]:text-left [&>p:not(:first-of-type)]:text-[10pt] [&>p:not(:first-of-type)]:lowercase-none [&>p:not(:first-of-type)]:tracking-normal [&>p:not(:first-of-type)]:font-normal [&>p:not(:first-of-type)]:text-slate-600
        prose-h2:text-center prose-h2:text-[8pt] prose-h2:uppercase prose-h2:tracking-[0.5em] prose-h2:font-black prose-h2:text-slate-300 prose-h2:mt-16 prose-h2:mb-8 prose-h2:border-none
        prose-h3:text-slate-900 prose-h3:text-[11pt] prose-h3:font-black prose-h3:mt-8 prose-h3:mb-2 prose-h3:uppercase prose-h3:tracking-widest
        prose-li:text-slate-600 prose-li:text-[10pt] prose-li:my-2 prose-li:leading-relaxed
        prose-strong:text-slate-900 prose-strong:font-bold
        prose-ul:list-none prose-ul:pl-0
        prose-li:pl-0">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>

      {/* Footer detail */}
      <div className="mt-32 flex items-center justify-center gap-4 opacity-20">
        <div className="h-[1px] w-12 bg-slate-400" />
        <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
        <div className="h-[1px] w-12 bg-slate-400" />
      </div>
    </div>
  )
}
