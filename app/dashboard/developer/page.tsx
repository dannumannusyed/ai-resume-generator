'use client'

import { useState, useEffect } from 'react'
import { Code, Key, Copy, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react'

export default function DeveloperPortal() {
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Check if key exists in local storage
    const savedKey = localStorage.getItem('rm_api_key')
    if (savedKey) {
      setApiKey(savedKey)
    }
  }, [])

  const generateApiKey = () => {
    // Mock key generation
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let token = 'sk_rm_'
    for (let i = 0; i < 32; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setApiKey(token)
    localStorage.setItem('rm_api_key', token)
  }

  const revokeKey = () => {
    setApiKey(null)
    localStorage.removeItem('rm_api_key')
  }

  const handleCopy = () => {
    if (!apiKey) return
    navigator.clipboard.writeText(apiKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-6 w-full h-full flex flex-col">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2 flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
              <Code className="w-6 h-6 text-white" />
            </div>
            Developer API
          </h1>
          <p className="text-slate-500">Generate programmatic resumes and ATS scores directly from your own applications.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Keys Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                <Key className="w-4 h-4 text-slate-500" /> API Keys
              </h2>
            </div>
            <div className="p-6">
              {apiKey ? (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between font-mono text-sm">
                    <span className="text-slate-700 truncate mr-4">{apiKey}</span>
                    <button 
                      onClick={handleCopy}
                      className="text-slate-500 hover:text-slate-700 p-2 rounded-md hover:bg-slate-200 transition-colors"
                    >
                      {copied ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={generateApiKey}
                      className="text-sm px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 font-medium transition-colors flex items-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" /> Roll Key
                    </button>
                    <button 
                      onClick={revokeKey}
                      className="text-sm px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-medium transition-colors"
                    >
                      Revoke Key
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Key className="w-6 h-6 text-slate-400" />
                  </div>
                  <h3 className="font-medium text-slate-800 mb-1">No API Key found</h3>
                  <p className="text-sm text-slate-500 mb-4">Generate an API key to access our tailoring endpoints.</p>
                  <button 
                    onClick={generateApiKey}
                    className="bg-slate-900 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
                  >
                    Generate Secret Key
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                 API Documentation
              </h2>
            </div>
            <div className="p-6">
              <h3 className="font-medium text-slate-800 mb-2">Tailor Resume (POST)</h3>
              <div className="bg-slate-900 p-4 rounded-xl font-mono text-xs text-green-400 overflow-x-auto">
                <p className="text-slate-400 mb-2"># Request Example</p>
                <p>curl -X POST https://api.resumemaster.com/v1/generate-resume \</p>
                <p>  -H "Authorization: Bearer sk_rm_..." \</p>
                <p>  -H "Content-Type: application/json" \</p>
                <p>  -d '{"{"}</p>
                <p>    "jobPosting": "Looking for React dev...",</p>
                <p>    "resumeData": {"{}"}</p>
                <p>  {"}"}'</p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
            <h3 className="font-medium text-blue-900 flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-blue-600" /> Protect your keys
            </h3>
            <p className="text-sm text-blue-800/80 leading-relaxed">
              Do not expose your secret API keys in any public repositories, client-side code, or mobile apps. Always route requests through your own backend.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
