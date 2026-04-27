'use client'

import React from 'react'

interface TemplateModernProps {
  content: string
}

export default function TemplateModern({ content }: TemplateModernProps) {
  let data: any = { personalInfo: {}, education: [], experience: [], skills: [], projects: [] }
  try {
    data = JSON.parse(content)
  } catch (e) {
    console.error('Failed to parse resume content', e)
  }

  const { personalInfo, education, experience, skills, projects } = data

  return (
    <div className="flex h-full text-slate-800 font-sans">
      {/* Left Sidebar (Dark Accent) */}
      <div className="w-[180pt] bg-slate-900 text-white p-8 flex flex-col h-full overflow-hidden">
        <div className="mb-10 text-center">
            {personalInfo.firstName && (
                <div className="w-24 h-24 bg-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center text-4xl font-black shadow-lg shadow-black/20">
                    {personalInfo.firstName[0]}{personalInfo.lastName?.[0]}
                </div>
            )}
            <h1 className="text-2xl font-black tracking-tight leading-tight uppercase">
                {personalInfo.firstName} <br />
                <span className="text-blue-400">{personalInfo.lastName}</span>
            </h1>
        </div>

        <div className="space-y-8 flex-grow">
            <section>
                <h2 className="text-[9pt] font-black uppercase tracking-[0.2em] text-blue-400 mb-4 border-b border-white/10 pb-2">Contact</h2>
                <div className="space-y-3 text-[9.5pt] font-medium text-slate-300">
                    <p className="flex items-center gap-2 overflow-hidden text-ellipsis">
                        <span className="text-blue-500">📧</span> {personalInfo.email}
                    </p>
                    <p className="flex items-center gap-2">
                        <span className="text-blue-500">📱</span> {personalInfo.phone}
                    </p>
                    <p className="flex items-center gap-2">
                        <span className="text-blue-500">📍</span> {personalInfo.location}
                    </p>
                </div>
            </section>

            <section>
                <h2 className="text-[9pt] font-black uppercase tracking-[0.2em] text-blue-400 mb-4 border-b border-white/10 pb-2">Proficiency</h2>
                <div className="flex flex-wrap gap-2">
                    {skills.map((skill: string, i: number) => (
                        <span key={i} className="text-[8.5pt] bg-white/10 px-2.5 py-1 rounded-md font-bold hover:bg-blue-600 transition-colors">
                            {skill}
                        </span>
                    ))}
                </div>
            </section>

            {education.length > 0 && (
                <section>
                    <h2 className="text-[9pt] font-black uppercase tracking-[0.2em] text-blue-400 mb-4 border-b border-white/10 pb-2">Education</h2>
                    <div className="space-y-4">
                        {education.map((edu: any, i: number) => (
                            <div key={i} className="space-y-1">
                                <p className="text-[10pt] font-black text-white">{edu.school}</p>
                                <p className="text-[9pt] font-bold text-blue-400">{edu.degree}</p>
                                <p className="text-[8pt] text-slate-400">{edu.year}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>

        <div className="mt-auto pt-8 text-[7pt] text-slate-500 font-bold uppercase tracking-widest text-center border-t border-white/5">
            Modern Executive Layout
        </div>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 bg-white p-12 overflow-hidden h-full">
        <section className="mb-12">
            <h2 className="text-[12pt] font-black uppercase tracking-[0.25em] text-blue-600 mb-6 flex items-center gap-4">
                Professional Experience
                <div className="flex-1 h-[2px] bg-blue-50" />
            </h2>
            <div className="space-y-8">
                {experience.map((exp: any, i: number) => (
                    <div key={i} className="relative pl-6 border-l-2 border-slate-100 pb-2">
                        <div className="absolute -left-[5px] top-1.5 w-2 h-2 bg-blue-600 rounded-full" />
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="text-[11pt] font-black text-slate-900">{exp.position}</h3>
                                <p className="text-[10pt] font-bold text-blue-600 uppercase tracking-tight">{exp.company}</p>
                            </div>
                            <span className="text-[9pt] font-black text-slate-400 bg-slate-50 px-3 py-1 rounded-full uppercase tracking-tighter">{exp.duration}</span>
                        </div>
                        <div className="text-[9.5pt] text-slate-600 leading-relaxed font-medium">
                            {exp.achievements.split('\n').filter(Boolean).map((line: string, idx: number) => (
                                <p key={idx} className="mb-2 flex gap-3">
                                    <span className="text-blue-500 mt-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0" />
                                    {line.replace(/^[•\-\*]\s*/, '')}
                                </p>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {projects.length > 0 && (
            <section>
                <h2 className="text-[12pt] font-black uppercase tracking-[0.25em] text-blue-600 mb-6 flex items-center gap-4">
                    Key Projects
                    <div className="flex-1 h-[2px] bg-blue-50" />
                </h2>
                <div className="grid grid-cols-1 gap-6">
                    {projects.map((proj: any, i: number) => (
                        <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all">
                            <h3 className="text-[10.5pt] font-black text-slate-900 mb-2">{proj.name}</h3>
                            <p className="text-[9pt] text-slate-600 leading-relaxed font-medium mb-3">{proj.description}</p>
                            {proj.link && (
                                <a href={proj.link} className="text-[8pt] font-black text-blue-600 uppercase tracking-widest hover:text-blue-800 transition-colors">
                                    View Project ↗
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        )}
      </div>
    </div>
  )
}
