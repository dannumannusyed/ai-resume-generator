import React from 'react'
import ReactMarkdown from 'react-markdown'

interface TemplateProps {
  content: string
}

export default function TemplateCreative({ content }: TemplateProps) {
  return (
    <div className="bg-white min-h-[297mm] w-full shadow-2xl print:shadow-none font-sans overflow-hidden">
      {/* Decorative Header */}
      <div className="bg-gradient-to-r from-indigo-700 to-purple-600 h-48 w-full flex flex-col items-center justify-center text-white relative">
        <div className="absolute top-0 right-0 w-96 h-full bg-white/10 skew-x-[-20deg] translate-x-32" />
        <div className="absolute bottom-0 left-0 w-64 h-full bg-black/10 skew-x-[20deg] -translate-x-32" />
        
        <div className="relative z-10 text-center px-10">
            <div className="prose prose-invert max-w-none 
              prose-h1:text-center prose-h1:text-5xl prose-h1:font-black prose-h1:uppercase prose-h1:tracking-tighter prose-h1:m-0 prose-h1:drop-shadow-2xl
              prose-p:text-indigo-100 prose-p:text-[10pt] prose-p:font-black prose-p:uppercase prose-p:tracking-[0.3em] prose-p:mt-2 prose-p:opacity-80
              [&>h2]:hidden [&>h3]:hidden [&>ul]:hidden [&>p:not(:first-of-type)]:hidden">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
            <div className="mt-4 flex justify-center gap-6">
                <div className="prose prose-invert max-w-none
                  prose-p:text-[9pt] prose-p:font-medium prose-p:text-white/70 prose-p:flex prose-p:items-center prose-p:gap-2
                  [&>h1]:hidden [&>h2]:hidden [&>h3]:hidden [&>ul]:hidden">
                  <ReactMarkdown>{content}</ReactMarkdown>
                </div>
            </div>
        </div>
      </div>

      <div className="p-20 columns-1 md:columns-2 gap-16">
        <div className="prose prose-slate max-w-none
          prose-h1:hidden
          prose-h2:text-indigo-600 prose-h2:text-[10pt] prose-h2:font-black prose-h2:uppercase prose-h2:tracking-[0.3em] prose-h2:mb-6 prose-h2:mt-12 prose-h2:flex prose-h2:items-center prose-h2:gap-3
          prose-h2:before:content-[''] prose-h2:before:w-2 prose-h2:before:h-2 prose-h2:before:bg-indigo-600 prose-h2:before:rounded-full
          prose-h3:text-slate-900 prose-h3:text-[12pt] prose-h3:font-black prose-h3:mt-8 prose-h3:mb-1
          prose-p:text-slate-500 prose-p:text-[10pt] prose-p:leading-relaxed prose-p:my-2
          prose-li:text-slate-500 prose-li:text-[10pt] prose-li:my-1.5
          prose-strong:text-indigo-900 prose-strong:font-bold
          [&>p:first-of-type]:hidden
          break-inside-avoid">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
      
      {/* Visual Accent */}
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-indigo-50 to-transparent rounded-tl-[100%] pointer-events-none" />
    </div>
  )
}
