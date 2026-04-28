'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Zap, CheckCircle2, BarChart3, Download, Sparkles, X } from 'lucide-react'

export default function Home() {
  const router = useRouter()
  const [showDemo, setShowDemo] = useState(false)
  const [jobText, setJobText] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnalyze = async () => {
    if (!jobText.trim()) return
    setIsAnalyzing(true)
    try {
      const response = await fetch('/api/analyze-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobPosting: jobText }),
      })
      
      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('current_job_analysis', JSON.stringify(data))
        router.push('/builder/resume')
      } else {
        const err = await response.json()
        alert(err.error || err.message || 'Failed to analyze job')
      }
    } catch (error) {
      console.error('Analysis failed:', error)
      alert('Network error. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }
  return (
    <div className="w-full">
      {/* Navigation moved to global Layout */}

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-pulse delay-700" />

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-blue-100/50 backdrop-blur-sm text-blue-700 rounded-full text-sm font-bold border border-blue-200/50 animate-float">
              <Sparkles className="w-4 h-4" />
              Launch Your Dream Career
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 leading-[1.1] tracking-tight">
              Your AI Resume,<br />
              <span className="text-gradient">Tailored for Every Job</span>
            </h1>

            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Stop sending generic resumes. Our AI analyzes job descriptions in seconds and crafts a high-performing, ATS-optimized version of your experience.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/auth/signup"
                className="btn-primary text-lg px-10 py-5 rounded-2xl shadow-2xl shadow-blue-200 hover:shadow-blue-300 transition-all flex items-center gap-3"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button 
                onClick={() => setShowDemo(true)}
                className="btn-ghost text-lg px-8 py-5 rounded-2xl border border-slate-200 hover:border-blue-400 hover:text-blue-600 transition-all"
              >
                Watch Demo
              </button>
            </div>
          </div>

          {/* Interactive Job Analyzer Mockup */}
          <div className="max-w-4xl mx-auto group">
            <div className="glass-card p-2 rounded-[2rem] border-white/50">
              <div className="bg-slate-50/50 rounded-[1.5rem] p-6 sm:p-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-slate-900">Job Link / Description</h3>
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Step 1: Paste Requirements</p>
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    value={jobText}
                    onChange={(e) => setJobText(e.target.value)}
                    placeholder="Paste the job description here..."
                    className="w-full h-40 bg-white border border-slate-200 rounded-2xl p-6 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-slate-700 resize-none shadow-inner"
                  />
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !jobText.trim()}
                    className="absolute bottom-4 right-4 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-600 transition-all shadow-lg disabled:opacity-50"
                  >
                    {isAnalyzing ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Analyze Job
                        <Zap className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-heading mb-4">Why ResumeMaster?</h2>
            <p className="section-subheading">Everything you need to land your dream job</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card p-8">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">AI-Powered Tailoring</h3>
              <p className="text-slate-600">
                Our AI automatically customizes your resume for each job, matching keywords and requirements.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card p-8">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">ATS Optimization</h3>
              <p className="text-slate-600">
                Get real-time ATS scores and keyword suggestions to beat automated screening systems.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card p-8">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Download className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">One-Click Export</h3>
              <p className="text-slate-600">
                Download professional PDF resumes instantly. Perfect formatting guaranteed.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card p-8">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Conversational Builder</h3>
              <p className="text-slate-600">
                Fill your resume like having a conversation with a career coach. Easy and engaging.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="card p-8">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Live Preview</h3>
              <p className="text-slate-600">
                See your resume update in real-time as you make changes. Edit before downloading.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="card p-8">
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-cyan-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Lightning Fast</h3>
              <p className="text-slate-600">
                Generate a complete, tailored resume in under 2 minutes. No waiting around.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-heading text-center mb-16">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { num: 1, title: 'Sign Up', desc: 'Create free account in 30 seconds' },
              { num: 2, title: 'Build Resume', desc: 'Answer prompts like chatting with a coach' },
              { num: 3, title: 'Paste Job', desc: 'Share any job posting you want' },
              { num: 4, title: 'Download', desc: 'Get tailored PDF in seconds' },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-2xl mx-auto mb-4">
                  {step.num}
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-heading mb-4">Simple Pricing</h2>
            <p className="section-subheading">Start 3-Day Trial for free. Upgrade when you're ready.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto gap-8">
            <div className="card p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Weekly Access</h3>
              <p className="text-slate-600 mb-6">Perfect for quick updates</p>
              <div className="text-3xl font-bold text-slate-900 mb-1">79 Rs</div>
              <p className="text-sm text-slate-600 mb-6">/week</p>
              <ul className="space-y-3 mb-8">
                {['Unlimited resumes per week', 'All templates', 'AI Job Tailoring', 'No Watermarks'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/auth/signup" className="btn-secondary w-full inline-block text-center rounded-lg py-3 font-semibold">Start Free Trial</Link>
            </div>

            <div className="card p-8 border-2 border-blue-600 relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                  Recommended
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Monthly Access</h3>
              <p className="text-slate-600 mb-6">Best value for active job seekers</p>
              <div className="text-3xl font-bold text-slate-900 mb-1">129 Rs</div>
              <p className="text-sm text-slate-600 mb-6">/month</p>
              <ul className="space-y-3 mb-8">
                {['Everything in Weekly', 'Priority 24/7 support', 'Premium Layouts', 'Resume versioning'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/auth/signup" className="btn-primary w-full inline-block text-center rounded-lg py-3 font-semibold">Start Free Trial</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-12 text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Land Your Dream Job?</h2>
          <p className="text-lg text-blue-100 mb-8">
            Join thousands of job seekers who've already found success with ResumeMaster.
          </p>
          <Link href="/auth/signup" className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold hover:bg-blue-50 transition-colors inline-flex items-center gap-2">
            Start Free Trial
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                ResumeMaster
              </div>
              <p className="text-sm">AI-powered resume generation for the modern job seeker.</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#features" className="hover:text-white">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/about" className="hover:text-white">About</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>&copy; 2026 ResumeMaster. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Demo Modal */}
      {showDemo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4">
          <div className="bg-slate-900 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl relative">
            <button 
              onClick={() => setShowDemo(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors z-10 bg-black/50 rounded-full p-2"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="aspect-video w-full bg-slate-800 p-8 flex flex-col gap-6 relative overflow-hidden group/demo">
              {/* Background Glow */}
              <div className="absolute inset-0 bg-blue-600/10 blur-3xl group-hover/demo:bg-blue-600/20 transition-all duration-1000"></div>
              
              <div className="flex items-center justify-between border-b border-slate-700 pb-4 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="text-slate-500 text-xs font-mono">resumemaster/builder</div>
              </div>

              <div className="flex-1 flex gap-6 relative z-10">
                <div className="w-1/3 space-y-4">
                  <div className="h-4 bg-slate-700 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-slate-700 rounded w-2/3 animate-pulse"></div>
                  <div className="pt-4 space-y-2">
                     <div className="h-8 bg-blue-600/50 rounded w-full border border-blue-500/30"></div>
                     <div className="h-8 bg-slate-800 rounded w-full border border-slate-600/30"></div>
                  </div>
                </div>
                <div className="flex-1 bg-slate-900 rounded-xl border border-slate-700 p-6 flex flex-col gap-4 shadow-2xl">
                   <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center text-blue-400 mb-2">
                      <Sparkles className="w-6 h-6 animate-spin-slow" />
                   </div>
                   <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                   <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                   <div className="grid grid-cols-2 gap-4 mt-auto">
                      <div className="h-20 bg-slate-800 rounded-lg border border-slate-700 flex flex-col items-center justify-center gap-2">
                        <div className="text-green-400 font-bold text-xl">87%</div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-widest">ATS Match</div>
                      </div>
                      <div className="h-20 bg-slate-800 rounded-lg border border-slate-700 flex flex-col items-center justify-center gap-2">
                        <div className="text-blue-400 font-bold text-xl">12</div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-widest">Keywords</div>
                      </div>
                   </div>
                </div>
              </div>

              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px] opacity-0 group-hover/demo:opacity-100 transition-opacity cursor-pointer">
                 <div className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold shadow-xl flex items-center gap-2 transform group-hover/demo:scale-105 transition-transform">
                   <Zap className="w-5 h-5 fill-current" />
                   Launch Interactive Demo
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
