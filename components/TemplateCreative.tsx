import React from 'react'
import ReactMarkdown from 'react-markdown'

interface TemplateProps {
  content: string
}

export default function TemplateCreative({ content }: TemplateProps) {
  return (
    <div className="bg-white min-h-[11in] w-full shadow-lg print:shadow-none font-sans overflow-hidden">
      {/* Decorative Header */}
      <div className="bg-indigo-600 h-32 w-full flex flex-col items-center justify-center text-white relative">
        <div className="absolute top-0 right-0 w-64 h-full bg-indigo-500 skew-x-[-20deg] translate-x-32 opacity-50" />
        <div className="relative z-10 text-center">
            <div className="prose prose-invert max-w-none 
              prose-h1:text-center prose-h1:text-4xl prose-h1:font-black prose-h1:uppercase prose-h1:tracking-tighter prose-h1:m-0
              prose-p:text-indigo-100 prose-p:text-sm prose-p:font-medium prose-p:m-0
              [&>h2]:hidden [&>h3]:hidden [&>ul]:hidden [&>p:not(:first-of-type)]:hidden">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
        </div>
      </div>

      <div className="p-12">
        <div className="prose prose-slate max-w-none
          prose-h1:hidden
          prose-h2:text-indigo-600 prose-h2:text-sm prose-h2:font-black prose-h2:uppercase prose-h2:tracking-[0.2em] prose-h2:border-l-4 prose-h2:border-indigo-600 prose-h2:pl-4 prose-h2:mt-10 prose-h2:mb-4
          prose-h3:text-slate-900 prose-h3:text-lg prose-h3:font-bold prose-h3:mt-6 prose-h3:mb-1
          prose-p:text-slate-500 prose-p:leading-relaxed prose-p:my-1
          prose-li:text-slate-500 prose-li:my-1
          prose-strong:text-indigo-800
          [&>p:first-of-type]:hidden">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  )
}
