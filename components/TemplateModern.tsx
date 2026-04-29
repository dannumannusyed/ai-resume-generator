'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'

interface TemplateModernProps {
  content: string
}

export default function TemplateModern({ content }: TemplateModernProps) {
  // We split the content into sections
  const sections = content.split(/(?=^## )/m)
  
  // Header is everything before the first ##
  const headerContent = sections[0] || ''
  
  // Extract specific sections for sidebar
  const skillsSection = sections.find(s => s.trim().startsWith('## SKILLS')) || ''
  const educationSection = sections.find(s => s.trim().startsWith('## EDUCATION')) || ''
  
  // Main area: SUMMARY (if exists), EXPERIENCE, PROJECTS
  const mainSections = sections.filter(s => 
    s !== headerContent && 
    s !== skillsSection && 
    s !== educationSection
  )
  const mainContent = mainSections.join('\n')

  return (
    <div className="flex min-h-[297mm] w-full text-slate-800 font-sans bg-white overflow-hidden shadow-2xl print:shadow-none">
      {/* Left Sidebar (Dark Accent) */}
      <div className="w-[200pt] bg-slate-900 text-white p-10 flex flex-col shrink-0">
        <div className="mb-12">
            {/* Name and Title */}
            <div className="prose prose-invert max-w-none 
              prose-h1:text-left prose-h1:text-3xl prose-h1:font-black prose-h1:tracking-tighter prose-h1:leading-tight prose-h1:m-0 prose-h1:uppercase prose-h1:text-white
              prose-p:text-blue-400 prose-p:text-[10pt] prose-p:font-bold prose-p:mt-2 prose-p:mb-0
              [&>h2]:hidden [&>h3]:hidden [&>ul]:hidden [&>p:not(:first-of-type)]:hidden">
              <ReactMarkdown>{headerContent}</ReactMarkdown>
            </div>
            
            {/* Contact Info (Only show the last paragraph which usually has contact info) */}
            <div className="mt-8 pt-8 border-t border-white/10">
               <div className="prose prose-invert max-w-none
                 prose-p:text-slate-400 prose-p:text-[9pt] prose-p:my-1 prose-p:flex prose-p:items-center prose-p:gap-2
                 [&>h1]:hidden [&>h2]:hidden [&>h3]:hidden [&>ul]:hidden [&>p:first-of-type]:hidden">
                 <ReactMarkdown>{headerContent}</ReactMarkdown>
               </div>
            </div>
        </div>

        <div className="space-y-10 flex-grow">
            {skillsSection && (
                <section>
                    <div className="prose prose-invert max-w-none
                      prose-h2:text-[9pt] prose-h2:font-black prose-h2:uppercase prose-h2:tracking-[0.2em] prose-h2:text-blue-400 prose-h2:mb-4 prose-h2:mt-0 prose-h2:border-b prose-h2:border-white/10 prose-h2:pb-2
                      prose-p:text-[9pt] prose-p:text-slate-300 prose-p:leading-relaxed
                      prose-li:text-[9pt] prose-li:text-slate-300 prose-li:my-1
                      prose-ul:list-none prose-ul:pl-0 prose-li:pl-0">
                      <ReactMarkdown>{skillsSection}</ReactMarkdown>
                    </div>
                </section>
            )}

            {educationSection && (
                <section>
                    <div className="prose prose-invert max-w-none
                      prose-h2:text-[9pt] prose-h2:font-black prose-h2:uppercase prose-h2:tracking-[0.2em] prose-h2:text-blue-400 prose-h2:mb-4 prose-h2:mt-0 prose-h2:border-b prose-h2:border-white/10 prose-h2:pb-2
                      prose-h3:text-[10pt] prose-h3:font-black prose-h3:text-white prose-h3:mb-1 prose-h3:mt-4
                      prose-p:text-[9pt] prose-p:text-slate-400 prose-p:my-0
                      prose-strong:text-blue-400">
                      <ReactMarkdown>{educationSection}</ReactMarkdown>
                    </div>
                </section>
            )}
        </div>

        <div className="mt-auto pt-8 text-[7pt] text-slate-500 font-bold uppercase tracking-widest text-center border-t border-white/5">
            Modern Professional Series
        </div>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 bg-white p-14 h-full">
        <div className="prose prose-slate max-w-none
          prose-h2:text-[13pt] prose-h2:font-black prose-h2:uppercase prose-h2:tracking-[0.25em] prose-h2:text-blue-600 prose-h2:mb-8 prose-h2:mt-10 prose-h2:flex prose-h2:items-center prose-h2:gap-4
          prose-h2:after:content-[''] prose-h2:after:flex-1 prose-h2:after:h-[2px] prose-h2:after:bg-blue-50
          prose-h3:text-[12pt] prose-h3:font-black prose-h3:text-slate-900 prose-h3:mb-1 prose-h3:mt-8
          prose-p:text-[10pt] prose-p:text-slate-600 prose-p:leading-relaxed prose-p:my-2
          prose-li:text-[10pt] prose-li:text-slate-600 prose-li:my-1.5
          prose-strong:text-slate-900
          prose-ul:list-none prose-ul:pl-0
          prose-li:relative prose-li:pl-5
          prose-li:before:content-[''] prose-li:before:absolute prose-li:before:left-0 prose-li:before:top-[0.6em] prose-li:before:w-1.5 prose-li:before:h-1.5 prose-li:before:bg-blue-500 prose-li:before:rounded-full">
          <ReactMarkdown>{mainContent}</ReactMarkdown>
        </div>
      </div>
    </div>
  )
}
