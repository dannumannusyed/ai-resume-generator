import React from 'react'
import TemplateClassic from './TemplateClassic'
import TemplateExecutive from './TemplateExecutive'
import TemplateMinimalist from './TemplateMinimalist'

export type TemplateType = 'classic' | 'executive' | 'minimalist'

interface ResumeDocumentProps {
  content: string
  template: TemplateType
  isTrial?: boolean
}

export default function ResumeDocument({ content, template, isTrial = false }: ResumeDocumentProps) {
  return (
    <div className={`resume-canvas-wrapper flex justify-center py-8 bg-slate-200/50 min-h-screen overflow-auto print:p-0 print:bg-white print:block ${isTrial ? 'select-none' : ''}`}>
      <div className="resume-canvas shadow-2xl print:shadow-none mb-12 print:mb-0 w-[210mm] min-h-[297mm] bg-white relative">
        {isTrial && (
          <>
            {/* watermark overlay */}
            <div className="absolute inset-0 z-[60] flex items-center justify-center pointer-events-none print:hidden opacity-[0.08] select-none">
              <div className="text-4xl font-black text-slate-900 -rotate-45 whitespace-nowrap space-y-20">
                <div className="opacity-100">UNAUTHORIZED PREVIEW</div>
                <div className="ml-40 opacity-100">79RS TO UNLOCK</div>
                <div className="-ml-40 opacity-100">UNAUTHORIZED PREVIEW</div>
                <div className="ml-20 opacity-100">79RS TO UNLOCK</div>
              </div>
            </div>
            {/* blur overlay */}
            <div className="absolute inset-0 z-50 backdrop-blur-[1.5px] bg-white/5 pointer-events-none flex flex-col items-center justify-center p-10 text-center">
               <div className="bg-slate-900/90 text-white px-6 py-4 rounded-3xl shadow-2xl pointer-events-auto transform translate-y-20">
                  <p className="font-bold text-lg">Trial View Only</p>
                  <p className="text-xs text-slate-300 mb-4">Pay 79 Rs to remove watermark and download PDF</p>
                  <a href="/pricing" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-sm transition-all inline-block hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/30">
                    Unlock Now
                  </a>
               </div>
            </div>
          </>
        )}
        <div className={isTrial ? 'blur-[3px] grayscale-[0.5] opacity-80' : ''}>
          {template === 'classic' && <TemplateClassic content={content} />}
          {template === 'executive' && <TemplateExecutive content={content} />}
          {template === 'minimalist' && <TemplateMinimalist content={content} />}
        </div>
      </div>
    </div>
  )
}
