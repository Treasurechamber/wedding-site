'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Users,
  UserCheck,
  UserX,
  Search,
  Download,
  ArrowLeft,
  MessageSquare,
  KeyRound,
  LogOut,
} from 'lucide-react'
import { useQuery, useConvex, useConvexAuth } from 'convex/react'
import { useAuthActions } from '@convex-dev/auth/react'
import { api } from 'convex/_generated/api'

const COUPLE_ID_STORAGE_KEY = 'wedding_couple_id'

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

export default function AdminPage() {
  const [coupleIdInput, setCoupleIdInput] = useState('')
  const [storedCoupleId, setStoredCoupleId] = useState<string | null>(null)
  const [authError, setAuthError] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')

  const convex = useConvex()
  const { signOut } = useAuthActions()
  const { isAuthenticated: isConvexAuth } = useConvexAuth()
  const role = useQuery(api.roles.myRole) ?? null
  const coupleIdExists = useQuery(api.coupleAuth.exists) ?? false
  const verifyResult = useQuery(api.coupleAuth.verify, storedCoupleId ? { candidateId: storedCoupleId } : 'skip')
  const rsvps = useQuery(
    api.rsvps.list,
    storedCoupleId ? { coupleId: storedCoupleId } : isConvexAuth && (role === 'admin' || role === 'master') ? {} : 'skip'
  ) ?? []


  useEffect(() => {
    const id = typeof window !== 'undefined' ? localStorage.getItem(COUPLE_ID_STORAGE_KEY) : null
    setStoredCoupleId(id)
  }, [])

  useEffect(() => {
    if (storedCoupleId && verifyResult === false) {
      localStorage.removeItem(COUPLE_ID_STORAGE_KEY)
      setStoredCoupleId(null)
    }
  }, [storedCoupleId, verifyResult])

  const hasCoupleIdAccess = !!storedCoupleId && verifyResult === true
  const hasMasterAccess = isConvexAuth && role === 'master'
  const isAuthenticated = hasCoupleIdAccess || hasMasterAccess

  const handleCoupleIdSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const id = coupleIdInput.trim().toUpperCase()
    if (!id) return
    setVerifying(true)
    setAuthError('')
    try {
      const valid = await convex.query(api.coupleAuth.verify, { candidateId: id })
      if (valid) {
        localStorage.setItem(COUPLE_ID_STORAGE_KEY, id)
        setStoredCoupleId(id)
        setCoupleIdInput('')
      } else {
        setAuthError('Invalid Couple ID. Copy it exactly from whoever set up the site.')
      }
    } catch {
      setAuthError('Verification failed. Try again.')
    } finally {
      setVerifying(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem(COUPLE_ID_STORAGE_KEY)
    setStoredCoupleId(null)
    setCoupleIdInput('')
    if (hasMasterAccess) signOut()
  }

  const filteredRsvps = (rsvps as RSVP[]).filter((r) => {
    const matchSearch =
      r.full_name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      (r.message ?? '').toLowerCase().includes(search.toLowerCase())
    const matchFilter =
      filter === 'all' ||
      (filter === 'attending' && r.attending) ||
      (filter === 'declined' && !r.attending)
    return matchSearch && matchFilter
  })

  const stats = {
    total: rsvps.length,
    attending: (rsvps as RSVP[]).filter((r) => r.attending).length,
    declined: (rsvps as RSVP[]).filter((r) => !r.attending).length,
    guests: (rsvps as RSVP[]).filter((r) => r.attending).reduce((acc, r) => acc + r.guest_count, 0),
  }

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Attending', 'Guest Count', 'Plus One', 'Message', 'Date']
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <header className="border-b border-slate-700/50 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-light tracking-wide">Admin — Guests & RSVPs</h1>
          <p className="text-slate-500 text-xs mt-0.5">View, search, export your guest list</p>
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-slate-400 hover:text-amber-500 text-sm transition"
            >
              <LogOut className="w-4 h-4" />
              Log out
            </button>
          )}
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-amber-500 text-sm transition">
            <ArrowLeft className="w-4 h-4" />
            Back to site
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto py-16">
            <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-amber-500/20">
                  <KeyRound className="w-8 h-8 text-amber-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-100">Enter Couple ID</h2>
                  <p className="text-slate-400 text-sm mt-0.5">View your guests & RSVPs</p>
                </div>
              </div>

              {!coupleIdExists ? (
                <p className="text-slate-400 text-sm">
                  Your Couple ID hasn&apos;t been set up yet. Contact whoever created your wedding site — they will generate it and share it with you privately.
                </p>
              ) : (
                <>
                  <p className="text-slate-400 text-sm mb-4">
                    Enter the Couple ID you received. Paste it exactly.
                  </p>
                  <form onSubmit={handleCoupleIdSubmit} className="space-y-4">
                    {authError && <p className="text-red-400 text-sm">{authError}</p>}
                    <input
                      type="text"
                      value={coupleIdInput}
                      onChange={(e) => { setCoupleIdInput(e.target.value.toUpperCase()); setAuthError(''); }}
                      placeholder="e.g. ABCD1234EFGH"
                      className="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-600/50 text-slate-100 placeholder-slate-500 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 outline-none font-mono tracking-wider"
                      autoComplete="off"
                    />
                    <button
                      type="submit"
                      disabled={verifying || !coupleIdInput.trim()}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 text-slate-900 font-semibold hover:from-amber-500 hover:to-amber-400 transition disabled:opacity-70"
                    >
                      {verifying ? 'Verifying...' : 'Access dashboard'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        ) : (
          <>
            <p className="text-slate-400 mb-6">RSVPs, guest messages, and attendee counts.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <div className="flex items-center gap-2 text-amber-400">
                  <Users className="w-5 h-5" />
                  <span className="text-sm">Total RSVPs</span>
                </div>
                <p className="text-2xl font-bold text-slate-100 mt-1">{stats.total}</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <div className="flex items-center gap-2 text-amber-400">
                  <UserCheck className="w-5 h-5" />
                  <span className="text-sm">Attending</span>
                </div>
                <p className="text-2xl font-bold text-slate-100 mt-1">{stats.attending}</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <div className="flex items-center gap-2 text-amber-400">
                  <UserX className="w-5 h-5" />
                  <span className="text-sm">Declined</span>
                </div>
                <p className="text-2xl font-bold text-slate-100 mt-1">{stats.declined}</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <div className="flex items-center gap-2 text-amber-400">
                  <Users className="w-5 h-5" />
                  <span className="text-sm">Total Guests</span>
                </div>
                <p className="text-2xl font-bold text-slate-100 mt-1">{stats.guests}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search by name, email, or message..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800/60 border border-slate-600/50 text-slate-100 placeholder-slate-500"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as FilterType)}
                  className="px-4 py-2 rounded-xl bg-slate-800/60 border border-slate-600/50 text-slate-100"
                >
                  <option value="all">All</option>
                  <option value="attending">Attending</option>
                  <option value="declined">Declined</option>
                </select>
                <button
                  onClick={exportCSV}
                  className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30 transition font-medium flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-xl border border-slate-600 text-slate-400 hover:bg-slate-800/50 transition flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Exit
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-slate-700/50 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-800/50">
                  <tr>
                    <th className="text-left p-4 text-amber-400">Name</th>
                    <th className="text-left p-4 text-amber-400">Email</th>
                    <th className="text-left p-4 text-amber-400">Status</th>
                    <th className="text-left p-4 text-amber-400">Guests</th>
                    <th className="text-left p-4 text-amber-400">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" /> Message
                      </span>
                    </th>
                    <th className="text-left p-4 text-amber-400">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRsvps.map((r) => (
                    <tr key={r._id} className="border-t border-slate-700/30 hover:bg-slate-800/30">
                      <td className="p-4 text-slate-100">{r.full_name}</td>
                      <td className="p-4 text-slate-400">{r.email}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${r.attending ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {r.attending ? 'Attending' : 'Declined'}
                        </span>
                      </td>
                      <td className="p-4 text-slate-100">{r.guest_count}</td>
                      <td className="p-4 text-slate-400 max-w-xs">
                        {r.message ? <span className="line-clamp-2" title={r.message}>{r.message}</span> : <span className="text-slate-600">—</span>}
                      </td>
                      <td className="p-4 text-slate-500">{new Date(r._creationTime).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredRsvps.length === 0 && <p className="text-center py-12 text-slate-500">No RSVPs yet</p>}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
