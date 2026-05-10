'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'

interface TemplateProps {
  content: string
}

export default function TemplateExecutive({ content }: TemplateProps) {
  const sections = content.split(/(?=^## )/m)
  
  // Header part
  const headerContent = sections[0] || ''
  
  // Sidebar candidates: SKILLS, EDUCATION, LANGUAGES
  const sidebarHeaders = ['## SKILLS', '## EDUCATION', '## LANGUAGES', '## CERTIFICATIONS']
  const sidebarSections = sections.filter(s => 
    sidebarHeaders.some(h => s.trim().startsWith(h))
  )
  
  // Main area: SUMMARY, EXPERIENCE, PROJECTS
  const mainSections = sections.filter(s => 
    s !== headerContent && !sidebarSections.includes(s)
  )

  const sidebarMarkdown = sidebarSections.join('\n')
  const mainMarkdown = mainSections.join('\n')

  return (
    <div className="bg-white h-full w-full shadow-2xl print:shadow-none flex overflow-hidden font-sans">
      {/* Sidebar */}
      <div className="w-[220pt] bg-slate-900 px-10 py-16 print:pt-8 text-white flex flex-col shrink-0">
        <div className="mb-12 border-b border-slate-700 pb-8">
            <div className="prose prose-invert max-w-none 
              prose-h1:text-left prose-h1:text-3xl prose-h1:font-black prose-h1:uppercase prose-h1:tracking-tight prose-h1:text-white prose-h1:m-0
              prose-p:text-slate-400 prose-p:text-[9pt] prose-p:font-bold prose-p:mt-3 prose-p:mb-0 prose-p:uppercase prose-p:tracking-widest
              [&>h2]:hidden [&>h3]:hidden [&>ul]:hidden">
              <ReactMarkdown>{headerContent}</ReactMarkdown>
            </div>
            <div className="mt-6 space-y-2">
               <div className="prose prose-invert max-w-none
                 prose-p:text-slate-500 prose-p:text-[8.5pt] prose-p:my-1 prose-p:font-medium
                 [&>h1]:hidden [&>h2]:hidden [&>h3]:hidden [&>ul]:hidden">
                 <ReactMarkdown>{headerContent}</ReactMarkdown>
               </div>
            </div>
        </div>

        <div className="space-y-12">
            <div className="prose prose-invert max-w-none 
              prose-h2:text-blue-400 prose-h2:text-[9pt] prose-h2:font-black prose-h2:uppercase prose-h2:tracking-[0.2em] prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-slate-800 prose-h2:pb-2
              prose-h3:text-white prose-h3:text-[10pt] prose-h3:font-bold prose-h3:mt-4 prose-h3:mb-1
              prose-p:text-slate-400 prose-p:text-[9pt] prose-p:my-1
              prose-li:text-slate-400 prose-li:text-[9pt] prose-li:my-1
              prose-strong:text-white">
              <ReactMarkdown>{sidebarMarkdown}</ReactMarkdown>
            </div>
        </div>
        
        <div className="mt-auto pt-10 text-[7pt] text-slate-600 font-bold uppercase tracking-[0.3em] text-center">
            Executive Elite Series
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-16 print:pt-8 bg-white">
        <div className="prose prose-slate max-w-none prose-sm
          prose-h2:text-slate-900 prose-h2:text-[14pt] prose-h2:font-black prose-h2:uppercase prose-h2:tracking-[0.2em] prose-h2:border-b-2 prose-h2:border-slate-100 prose-h2:pb-3 prose-h2:mt-12 prose-h2:mb-6
          prose-h3:text-blue-700 prose-h3:text-[12pt] prose-h3:font-black prose-h3:mt-8 prose-h3:mb-2
          prose-p:text-slate-600 prose-p:text-[10pt] prose-p:leading-relaxed prose-p:my-3
          prose-li:text-slate-600 prose-li:text-[10pt] prose-li:my-2
          prose-strong:text-slate-900 prose-strong:font-bold">
          <ReactMarkdown>{mainMarkdown}</ReactMarkdown>
        </div>
      </div>
    </div>
  )
}
