'use client'

import { useState } from 'react'
import { Users, UserPlus, Mail, Shield, Trash2, CheckCircle2 } from 'lucide-react'

// Mock Data
const MOCK_TEAM = [
  { id: 1, email: 'alex@company.com', role: 'Admin', status: 'Active' },
  { id: 2, email: 'sarah@company.com', role: 'Member', status: 'Active' },
  { id: 3, email: 'mike@company.com', role: 'Member', status: 'Pending' },
]

export default function TeamManagement() {
  const [teamMembers, setTeamMembers] = useState(MOCK_TEAM)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('Member')
  const [successMsg, setSuccessMsg] = useState('')

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteEmail) return

    setTeamMembers([
      ...teamMembers,
      { id: Date.now(), email: inviteEmail, role: inviteRole, status: 'Pending' }
    ])
    setInviteEmail('')
    setSuccessMsg(`Invitation sent to ${inviteEmail}`)
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  const handleRemove = (id: number) => {
    setTeamMembers(teamMembers.filter(m => m.id !== id))
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-6 w-full h-full flex flex-col">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2 flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-indigo-600" />
            </div>
            Team Management
          </h1>
          <p className="text-slate-500">Manage your organization's members, roles, and shared billing (B2B Reseller).</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Col - Team Members */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2">
              <Shield className="w-4 h-4 text-slate-500" /> Team Members
            </h2>
            <span className="text-xs px-2.5 py-1 bg-slate-200 text-slate-700 rounded-full font-medium">
              {teamMembers.length} Members
            </span>
          </div>
          
          <div className="divide-y divide-slate-100">
            {teamMembers.map(member => (
              <div key={member.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-medium">
                    {member.email.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{member.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wider ${
                        member.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {member.role}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wider ${
                        member.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {member.status}
                      </span>
                    </div>
                  </div>
                </div>
                {member.role !== 'Admin' && (
                  <button 
                    onClick={() => handleRemove(member.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Col - Invite Form */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm h-fit">
          <div className="p-6 border-b border-slate-100 bg-slate-50">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2">
               <UserPlus className="w-4 h-4 text-slate-500" /> Invite to Team
            </h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full pl-9 p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                    placeholder="colleague@company.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm bg-white"
                >
                  <option value="Member">Member</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              {successMsg && (
                <div className="p-3 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> {successMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={!inviteEmail}
                className="w-full bg-indigo-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                Send Invitation
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  )
}
