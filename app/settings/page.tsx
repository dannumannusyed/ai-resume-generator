'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { ArrowLeft, User, CreditCard, Bell, Shield, LogOut } from 'lucide-react'

export default function Settings() {
  const { data: session } = useSession()
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: ''
  })

  useEffect(() => {
    if (session?.user) {
      const nameParts = (session.user.name || '').split(' ')
      setProfile({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: session.user.email || ''
      })
    }
  }, [session])

  const [marketingEmails, setMarketingEmails] = useState(true)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Settings saved successfully!')
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="btn-ghost p-2 rounded-full hover:bg-slate-200 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Account Settings</h1>
        </div>

        {/* Settings Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          
          {/* Profile Section */}
          <div className="p-8 border-b border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <User className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Personal Information</h2>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">First Name</label>
                  <input 
                    type="text" 
                    className="input" 
                    value={profile.firstName}
                    onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="label">Last Name</label>
                  <input 
                    type="text" 
                    className="input" 
                    value={profile.lastName}
                    onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="label">Email Address</label>
                <input 
                  type="email" 
                  className="input" 
                  value={profile.email}
                  disabled
                />
                <p className="text-xs text-slate-500 mt-1">Email address cannot be changed currently.</p>
              </div>
              <button type="submit" className="btn-primary py-2 px-6">Save Changes</button>
            </form>
          </div>

          {/* Billing Section */}
          <div className="p-8 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Subscription & Billing</h2>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-semibold text-slate-900 text-lg">3-Day Trial Active</p>
                  <p className="text-sm text-slate-600">You are evaluating the <strong className="text-slate-800">129 Rs Monthly Access</strong>.</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">ACTIVE</span>
              </div>
              
              <div className="w-full bg-slate-100 h-2 rounded-full mb-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '33%' }}></div>
              </div>
              <p className="text-xs text-slate-500 mb-6">1 of 3 days used. Your subscription will renew at 129 Rs in 2 days.</p>

              <div className="flex gap-4">
                <button className="btn-secondary py-2 px-4 text-sm font-semibold flex-1" onClick={() => alert('Redirecting to Stripe Billing Portal...')}>Manage Billing</button>
                <Link href="/pricing" className="btn-ghost py-2 px-4 text-sm font-semibold flex-1 text-center">View Plans</Link>
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="p-8 border-b border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                <Bell className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Preferences</h2>
            </div>

            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="font-semibold text-slate-900">Marketing & Promotional Emails</p>
                  <p className="text-sm text-slate-500">Receive offers and news about ResumeMaster</p>
                </div>
                <input 
                  type="checkbox" 
                  className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-600"
                  checked={marketingEmails}
                  onChange={(e) => setMarketingEmails(e.target.checked)}
                />
              </label>
              
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="font-semibold text-slate-900">Resume Activity Alerts</p>
                  <p className="text-sm text-slate-500">Notify me when my resumes match new job postings (Coming Soon)</p>
                </div>
                <input type="checkbox" className="w-5 h-5 text-slate-400 rounded border-slate-300" disabled />
              </label>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="p-8 bg-red-50/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                <Shield className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-red-900">Danger Zone</h2>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900">Sign Out</p>
                <p className="text-sm text-slate-500">Securely disconnect from this device</p>
              </div>
              <button 
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-100"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
