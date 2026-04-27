import React from 'react'
import ReactMarkdown from 'react-markdown'

interface TemplateProps {
  content: string
}

export default function TemplateExecutive({ content }: TemplateProps) {
  // Extract parts for sidebar if possible, but keep it simple with Markdown for now
  // We can use custom Markdown styling to create a faux-sidebar look or real flex layout
  return (
    <div className="bg-white h-full w-full shadow-lg flex print:shadow-none overflow-hidden">
      {/* Sidebar */}
      <div className="w-1/3 bg-slate-900 px-8 py-12 text-white flex flex-col items-center">
        <div className="prose prose-invert max-w-none 
          prose-h1:text-center prose-h1:text-2xl prose-h1:mb-1 prose-h1:font-bold prose-h1:text-white
          prose-headings:text-blue-300 prose-headings:text-sm prose-headings:uppercase prose-headings:tracking-widest prose-headings:mt-8 prose-headings:mb-2 prose-headings:border-b prose-headings:border-slate-700 prose-headings:pb-1
          prose-p:text-slate-300 prose-p:text-[11px] prose-p:my-0.5
          prose-li:text-slate-300 prose-li:text-[11px] prose-li:my-0.5
          prose-strong:text-white
          [&>p:first-of-type]:text-center [&>p:first-of-type]:mb-2">
          {/* We handle the sidebar content by injecting relevant sections if we had them 
              For now, we just styled the first few headings differently in CSS below */}
          <ReactMarkdown
            components={{
              h2: ({node, ...props}) => <h2 className="executive-sidebar-h2" {...props} />,
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-2/3 p-12 bg-white">
        <div className="prose prose-slate max-w-none prose-sm leading-relaxed
          prose-h1:hidden
          prose-h2:text-slate-900 prose-h2:text-lg prose-h2:font-extrabold prose-h2:uppercase prose-h2:tracking-wider prose-h2:border-b-2 prose-h2:border-slate-200 prose-h2:pb-1 prose-h2:mt-8 prose-h2:mb-4
          prose-h3:text-blue-700 prose-h3:text-md prose-h3:font-bold prose-h3:mt-4 prose-h3:mb-1
          prose-p:text-slate-600 prose-p:my-1
          prose-li:text-slate-600 prose-li:my-1
          prose-strong:text-slate-900
          [&>p:first-of-type]:hidden">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>

      <style jsx global>{`
        .executive-sidebar-h2 {
          display: block !important;
        }
        /* Hide sections in sidebar that belong in main */
        .w-1/3 h2:nth-of-type(n+3) { display: none; } 
        /* Hide sections in main that belong in sidebar */
        .w-2/3 h2:nth-of-type(-n+2) { display: none; }
      `}</style>
    </div>
  )
}
