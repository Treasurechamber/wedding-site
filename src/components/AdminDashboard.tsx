'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  LogIn,
  Users,
  UserCheck,
  UserX,
  Search,
  Download,
} from 'lucide-react'
import { useQuery, useConvexAuth } from 'convex/react'
import { useAuthActions } from '@convex-dev/auth/react'
import { api } from 'convex/_generated/api'
import { useAdmin } from '@/context/AdminContext'

type RSVP = {
  _id: string
  _creationTime: number
  full_name: string
  email: string
  phone?: string
  attending: boolean
  guest_count: number
  plus_one_name?: string
  message?: string
}

type FilterType = 'all' | 'attending' | 'declined'

export default function AdminDashboard() {
  const { isOpen, closeDashboard } = useAdmin()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')

  const rsvps = useQuery(api.rsvps.list) ?? []
  const { signIn, signOut } = useAuthActions()
  const { isAuthenticated } = useConvexAuth()

  // Show dashboard content when authenticated (after login)
  const showDashboard = isAuthenticated

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setLoginError('')
    try {
      const formData = new FormData()
      formData.set('email', email)
      formData.set('password', password)
      formData.set('flow', isSignUp ? 'signUp' : 'signIn')
      await signIn('password', formData)
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Sign in failed')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await signOut()
    setEmail('')
    setPassword('')
  }

  const filteredRsvps = (rsvps as RSVP[]).filter((r) => {
    const matchSearch =
      r.full_name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase())
    const matchFilter =
      filter === 'all' ||
      (filter === 'attending' && r.attending) ||
      (filter === 'declined' && !r.attending)
    return matchSearch && matchFilter
  })

  const stats = {
    total: rsvps.length,
    attending: rsvps.filter((r: RSVP) => r.attending).length,
    declined: rsvps.filter((r: RSVP) => !r.attending).length,
    guests: rsvps.filter((r: RSVP) => r.attending).reduce((acc: number, r: RSVP) => acc + r.guest_count, 0),
  }

  const exportCSV = () => {
    const headers = [
      'Name',
      'Email',
      'Phone',
      'Attending',
      'Guest Count',
      'Plus One',
      'Message',
      'Date',
    ]
    const rows = filteredRsvps.map((r) => [
      r.full_name,
      r.email,
      r.phone || '',
      r.attending ? 'Yes' : 'No',
      r.guest_count,
      r.plus_one_name || '',
      (r.message || '').replace(/,/g, ';'),
      new Date(r._creationTime).toLocaleDateString(),
    ])
    const csv = [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rsvps-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeDashboard}
      >
        <motion.div
          className="bg-[#0f1729] rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b border-[#D4AF37]/20">
            <h2 className="text-xl font-semibold text-[#FFFEF7]">Admin Dashboard</h2>
            <button
              onClick={closeDashboard}
              className="p-2 rounded-lg hover:bg-white/10 text-[#FFFEF7]"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {!showDashboard ? (
            <div className="p-8">
              <form onSubmit={handleLogin} className="max-w-sm mx-auto space-y-4">
                <h3 className="text-lg text-[#FFFEF7] mb-6">
                  {isSignUp ? 'Create admin account' : 'Sign in to view RSVPs'}
                </h3>
                {loginError && <p className="text-red-400 text-sm">{loginError}</p>}
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-[#1e3a5f]/50 border border-[#D4AF37]/30 text-[#FFFEF7] placeholder-[#FFFEF7]/40"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-[#1e3a5f]/50 border border-[#D4AF37]/30 text-[#FFFEF7] placeholder-[#FFFEF7]/40"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-lg bg-[#D4AF37] text-[#0f1729] font-semibold flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  {loading ? (isSignUp ? 'Creating account...' : 'Signing in...') : (isSignUp ? 'Sign Up' : 'Sign In')}
                </button>
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="w-full text-[#D4AF37] text-sm hover:underline"
                >
                  {isSignUp ? 'Already have an account? Sign in' : 'First time? Create an account'}
                </button>
              </form>
            </div>
          ) : (
            <>
              <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#1e3a5f]/50 rounded-xl p-4 border border-[#D4AF37]/20">
                  <div className="flex items-center gap-2 text-[#D4AF37]">
                    <Users className="w-5 h-5" />
                    <span className="text-sm">Total RSVPs</span>
                  </div>
                  <p className="text-2xl font-bold text-[#FFFEF7] mt-1">{stats.total}</p>
                </div>
                <div className="bg-[#1e3a5f]/50 rounded-xl p-4 border border-[#D4AF37]/20">
                  <div className="flex items-center gap-2 text-[#D4AF37]">
                    <UserCheck className="w-5 h-5" />
                    <span className="text-sm">Attending</span>
                  </div>
                  <p className="text-2xl font-bold text-[#FFFEF7] mt-1">{stats.attending}</p>
                </div>
                <div className="bg-[#1e3a5f]/50 rounded-xl p-4 border border-[#D4AF37]/20">
                  <div className="flex items-center gap-2 text-[#D4AF37]">
                    <UserX className="w-5 h-5" />
                    <span className="text-sm">Declined</span>
                  </div>
                  <p className="text-2xl font-bold text-[#FFFEF7] mt-1">{stats.declined}</p>
                </div>
                <div className="bg-[#1e3a5f]/50 rounded-xl p-4 border border-[#D4AF37]/20">
                  <div className="flex items-center gap-2 text-[#D4AF37]">
                    <Users className="w-5 h-5" />
                    <span className="text-sm">Total Guests</span>
                  </div>
                  <p className="text-2xl font-bold text-[#FFFEF7] mt-1">{stats.guests}</p>
                </div>
              </div>

              <div className="px-6 pb-4 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FFFEF7]/50" />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#1e3a5f]/50 border border-[#D4AF37]/30 text-[#FFFEF7] placeholder-[#FFFEF7]/40"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as FilterType)}
                    className="px-4 py-2 rounded-lg bg-[#1e3a5f]/50 border border-[#D4AF37]/30 text-[#FFFEF7]"
                  >
                    <option value="all">All</option>
                    <option value="attending">Attending</option>
                    <option value="declined">Declined</option>
                  </select>
                  <button
                    onClick={exportCSV}
                    className="px-4 py-2 rounded-lg bg-[#D4AF37] text-[#0f1729] font-medium flex items-center gap-2 hover:bg-[#e5c158]"
                  >
                    <Download className="w-4 h-4" />
                    Export CSV
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-lg border border-[#D4AF37]/30 text-[#FFFEF7] hover:bg-white/10"
                  >
                    Logout
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-auto px-6 pb-6">
                <div className="rounded-xl border border-[#D4AF37]/20 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-[#1e3a5f]/50">
                      <tr>
                        <th className="text-left p-4 text-[#D4AF37]">Name</th>
                        <th className="text-left p-4 text-[#D4AF37]">Email</th>
                        <th className="text-left p-4 text-[#D4AF37]">Status</th>
                        <th className="text-left p-4 text-[#D4AF37]">Guests</th>
                        <th className="text-left p-4 text-[#D4AF37]">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRsvps.map((r) => (
                        <tr
                          key={r._id}
                          className="border-t border-[#D4AF37]/10 hover:bg-[#1e3a5f]/30"
                        >
                          <td className="p-4 text-[#FFFEF7]">{r.full_name}</td>
                          <td className="p-4 text-[#FFFEF7]/80">{r.email}</td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                r.attending ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                              }`}
                            >
                              {r.attending ? 'Attending' : 'Declined'}
                            </span>
                          </td>
                          <td className="p-4 text-[#FFFEF7]">{r.guest_count}</td>
                          <td className="p-4 text-[#FFFEF7]/70">
                            {new Date(r._creationTime).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredRsvps.length === 0 && (
                    <p className="text-center py-12 text-[#FFFEF7]/60">No RSVPs yet</p>
                  )}
                </div>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
