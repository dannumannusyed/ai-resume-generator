'use client'

import React, { useEffect, useState, useRef } from 'react'
import TemplateClassic from './TemplateClassic'
import TemplateExecutive from './TemplateExecutive'
import TemplateMinimalist from './TemplateMinimalist'

export type TemplateType = 'classic' | 'executive' | 'minimalist'

const A4_WIDTH_PX = 794   // 210mm at 96dpi
const A4_HEIGHT_PX = 1123 // 297mm at 96dpi

interface ResumeDocumentProps {
  content: string
  template: TemplateType
  isTrial?: boolean
}

export default function ResumeDocument({ content, template, isTrial = false }: ResumeDocumentProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    function computeScale() {
      const viewportWidth = window.innerWidth
      const mobile = viewportWidth < 1024
      setIsMobile(mobile)

      if (mobile && wrapperRef.current) {
        // Subtract horizontal padding (1rem each side = 32px)
        const availableWidth = wrapperRef.current.clientWidth
        const newScale = availableWidth / A4_WIDTH_PX
        setScale(newScale)
      } else {
        setScale(1)
      }
    }

    computeScale()
    window.addEventListener('resize', computeScale)
    return () => window.removeEventListener('resize', computeScale)
  }, [])

  return (
    <div
      ref={wrapperRef}
      className={`resume-canvas-wrapper flex justify-center py-4 md:py-8 bg-slate-100 print:p-0 print:bg-white print:block ${isTrial ? 'select-none' : ''}`}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Outer container — on mobile, its height equals the scaled A4 height */}
      <div
        className="relative"
        style={
          isMobile
            ? {
                width: `${A4_WIDTH_PX * scale}px`,
                height: `${A4_HEIGHT_PX * scale}px`,
              }
            : { width: `${A4_WIDTH_PX}px` }
        }
      >
        {/* Anti-inspect shield — blocks right-click / touch selection */}
        <div
          className="absolute inset-0 z-[70] bg-transparent cursor-default print:hidden"
          style={{ touchAction: 'none' }}
          onContextMenu={(e) => e.preventDefault()}
        />

        {/* The actual A4 canvas — always 794×1123px, scaled on mobile */}
        <div
          className="resume-canvas bg-white shadow-2xl print:shadow-none relative print:transform-none"
          style={{
            width: `${A4_WIDTH_PX}px`,
            height: `${A4_HEIGHT_PX}px`,
            transformOrigin: 'top left',
            transform: isMobile ? `scale(${scale})` : 'none',
          }}
        >
          {isTrial && (
            <>
              {/* Watermark */}
              <div className="absolute inset-0 z-[60] flex items-center justify-center pointer-events-none print:hidden opacity-[0.08] select-none">
                <div className="text-4xl font-black text-slate-900 -rotate-45 whitespace-nowrap space-y-20">
                  <div>UNAUTHORIZED PREVIEW</div>
                  <div className="ml-40">79RS TO UNLOCK</div>
                  <div className="-ml-40">UNAUTHORIZED PREVIEW</div>
                  <div className="ml-20">79RS TO UNLOCK</div>
                </div>
              </div>
              {/* Blur / Paywall overlay */}
              <div className="absolute inset-0 z-50 backdrop-blur-[1.5px] bg-white/5 pointer-events-none flex flex-col items-center justify-center p-10 text-center">
                <div className="bg-slate-900/90 text-white px-6 py-4 rounded-3xl shadow-2xl pointer-events-auto transform translate-y-20">
                  <p className="font-bold text-lg">Trial View Only</p>
                  <p className="text-xs text-slate-300 mb-4">Pay ₹79 to remove watermark and download PDF</p>
                  <a
                    href="/pricing"
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-sm transition-all inline-block hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/30"
                  >
                    Unlock Now
                  </a>
                </div>
              </div>
            </>
          )}

          <div className={isTrial ? 'blur-[3px] grayscale-[0.5] opacity-80' : ''}>
            {template === 'classic'    && <TemplateClassic    content={content} />}
            {template === 'executive' && <TemplateExecutive  content={content} />}
            {template === 'minimalist'&& <TemplateMinimalist content={content} />}
          </div>
        </div>
      </div>
    </div>
  )
}
