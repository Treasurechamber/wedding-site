'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  LogIn,
  ArrowLeft,
  Save,
  Upload,
  Trash2,
  Image as ImageIcon,
  Users,
  Heart,
  MapPin,
  Calendar,
  BookOpen,
  Home,
  Gift,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Plus,
  X,
  Check,
  KeyRound,
  Copy,
  LogOut,
} from 'lucide-react'
import { useQuery, useConvexAuth, useAction, useMutation } from 'convex/react'
import { useAuthActions } from '@convex-dev/auth/react'
import { api } from 'convex/_generated/api'
import type { Id } from 'convex/_generated/dataModel'
import { weddingConfig } from '@/lib/wedding-config'
import { motion, AnimatePresence } from 'framer-motion'

type WeddingConfig = typeof weddingConfig

const LABELS = ['hero', 'gallery', 'ceremony', 'reception'] as const
type Label = (typeof LABELS)[number]

const SECTIONS = [
  { id: 'couple', label: 'Couple & Date', icon: Heart },
  { id: 'coupleId', label: 'Couple ID', icon: KeyRound },
  { id: 'venues', label: 'Venues', icon: MapPin },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'story', label: 'Love Story', icon: BookOpen },
  { id: 'accommodations', label: 'Accommodations', icon: Home },
  { id: 'registry', label: 'Registry', icon: Gift },
  { id: 'faqs', label: 'FAQs', icon: HelpCircle },
  { id: 'photos', label: 'Photos', icon: ImageIcon },
  { id: 'accounts', label: 'Users & Roles', icon: Users },
] as const

function parseConfig(raw: string | null): WeddingConfig {
  if (!raw) return { ...JSON.parse(JSON.stringify(weddingConfig)) }
  try {
    const parsed = JSON.parse(raw) as Partial<WeddingConfig>
    return { ...weddingConfig, ...parsed } as WeddingConfig
  } catch {
    return { ...JSON.parse(JSON.stringify(weddingConfig)) }
  }
}

export default function MasterPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loading, setLoading] = useState(false)
  const [config, setConfig] = useState<WeddingConfig>(() => parseConfig(null))
  const [configSaved, setConfigSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string>('couple')
  const [createEmail, setCreateEmail] = useState('')
  const [createPassword, setCreatePassword] = useState('')
  const [createRole, setCreateRole] = useState<'admin' | 'master'>('admin')
  const [createFeedback, setCreateFeedback] = useState<'success' | 'error' | null>(null)
  const [createLoading, setCreateLoading] = useState(false)
  const [removeFeedback, setRemoveFeedback] = useState<string | null>(null)
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [editRole, setEditRole] = useState<'admin' | 'master'>('admin')
  const inviteUrl = ''
  const inviteLinkCopied = false
  const inviteLinkRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState<Label | null>(null)
  const [coupleIdCopied, setCoupleIdCopied] = useState(false)
  const [coupleIdGenerating, setCoupleIdGenerating] = useState(false)
  const [coupleIdDisplay, setCoupleIdDisplay] = useState<string | null>(null)
  const fileInputRefs = useRef<Record<Label, HTMLInputElement | null>>({ hero: null, gallery: null, ceremony: null, reception: null })

  const siteConfigRaw = useQuery(api.siteConfig.get) ?? null
  const role = useQuery(api.roles.myRole) ?? null
  const accounts = useQuery(api.roles.listWithEmails) ?? []
  const coupleId = useQuery(api.coupleAuth.get) ?? null
  const hasMaster = useQuery(api.roles.hasMaster) ?? false
  const currentUserId = useQuery(api.roles.currentUserId) ?? null
  const searchParams = useSearchParams()
  const heroMedia = useQuery(api.media.listByLabel, { label: 'hero' }) ?? []
  const galleryMedia = useQuery(api.media.listByLabel, { label: 'gallery' }) ?? []
  const ceremonyMedia = useQuery(api.media.listByLabel, { label: 'ceremony' }) ?? []
  const receptionMedia = useQuery(api.media.listByLabel, { label: 'reception' }) ?? []

  const setConfigMut = useMutation(api.siteConfig.set)
  const setRole = useMutation(api.roles.setRole)
  const removeRole = useMutation(api.roles.removeRole)
  const getOrGenerateCoupleId = useMutation(api.coupleAuth.getOrGenerate)
  const createUser = useAction(api.masterUsers.createUser)
  const claimMaster = useMutation(api.roles.claimMaster)
  const generateUploadUrl = useMutation(api.media.generateUploadUrl)
  const saveMedia = useMutation(api.media.save)
  const removeMedia = useMutation(api.media.remove)

  const { signIn, signOut } = useAuthActions()
  const { isAuthenticated } = useConvexAuth()

  const isMaster = role === 'master'

  useEffect(() => {
    if (siteConfigRaw === undefined) return
    setConfig(parseConfig(siteConfigRaw))
  }, [siteConfigRaw])


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 8) {
      setLoginError('Password must be at least 8 characters.')
      return
    }
    setLoading(true)
    setLoginError('')
    try {
      const formData = new FormData()
      formData.set('email', email.trim().toLowerCase())
      formData.set('password', password)
      formData.set('flow', !hasMaster && isSignUp ? 'signUp' : 'signIn')
      const timeoutMs = 20000
      const result = await Promise.race([
        signIn('password', formData),
        new Promise<boolean>((_, reject) =>
          setTimeout(() => reject(new Error('Connection timed out.')), timeoutMs)
        ),
      ])
      if (result === false) {
        setLoginError(isSignUp ? 'Could not create account. Try a different email or password (min 8 characters).' : 'Sign in failed. Check email and password, or create an account first.')
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      const convexMsg = typeof err === 'object' && err !== null && 'data' in err ? String((err as { data: unknown }).data) : null
      const display = convexMsg ?? msg
      setLoginError(
        display.includes('timed out') || display.includes('fetch') || display.includes('network')
          ? 'Cannot reach Convex. Run "npx convex dev" in a separate terminal, then try again.'
          : display.includes('Invalid password')
            ? 'Password must be at least 8 characters. Use a longer password and try again.'
            : display.includes('Invalid credentials')
              ? 'Wrong email or password. Create an account first if you don\'t have one.'
              : display
      )
    } finally {
      setLoading(false)
    }
  }

  const handleSaveConfig = async () => {
    setSaving(true)
    try {
      await setConfigMut({ value: JSON.stringify(config, null, 2) })
      setConfigSaved(true)
      setTimeout(() => setConfigSaved(false), 2500)
    } catch (e) {
      setLoginError(e instanceof Error ? e.message : 'Failed to save config')
    } finally {
      setSaving(false)
    }
  }

  const displayedCoupleId = coupleId ?? coupleIdDisplay

  const handleGenerateCoupleId = async () => {
    setCoupleIdGenerating(true)
    try {
      const id = await getOrGenerateCoupleId()
      setCoupleIdDisplay(id)
    } catch {
      setLoginError('Failed to generate Couple ID')
    } finally {
      setCoupleIdGenerating(false)
    }
  }

  const copyCoupleId = () => {
    if (displayedCoupleId) {
      navigator.clipboard.writeText(displayedCoupleId)
      setCoupleIdCopied(true)
      setTimeout(() => setCoupleIdCopied(false), 2000)
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!createEmail.trim() || !createPassword) return
    setCreateFeedback(null)
    setCreateLoading(true)
    try {
      await createUser({
        email: createEmail.trim(),
        password: createPassword,
        role: createRole,
      })
      setCreateEmail('')
      setCreatePassword('')
      setLoginError('')
      setCreateFeedback('success')
      setTimeout(() => setCreateFeedback(null), 3000)
    } catch (e) {
      setCreateFeedback('error')
      setLoginError(e instanceof Error ? e.message : 'Failed to create user')
    } finally {
      setCreateLoading(false)
    }
  }

  const handleEditRole = async (userId: string, newRole: 'admin' | 'master') => {
    try {
      await setRole({ userId, role: newRole })
      setEditingUserId(null)
    } catch (e) {
      setLoginError(e instanceof Error ? e.message : 'Failed to update role')
    }
  }

  const handleRemoveRole = async (userId: string) => {
    setRemoveFeedback(null)
    try {
      await removeRole({ userId })
      setRemoveFeedback('Removed.')
      setTimeout(() => setRemoveFeedback(null), 2000)
    } catch (e) {
      setRemoveFeedback(null)
      setLoginError(e instanceof Error ? e.message : 'Failed to remove')
    }
  }

  const doUpload = useCallback(
    async (file: File, label: Label) => {
      try {
        const url = await generateUploadUrl()
        const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': file.type }, body: file })
        const { storageId } = await res.json()
        const list = label === 'hero' ? heroMedia : label === 'gallery' ? galleryMedia : label === 'ceremony' ? ceremonyMedia : receptionMedia
        await saveMedia({ storageId, label, order: list.length, caption: undefined })
      } catch (err) {
        setLoginError(err instanceof Error ? err.message : 'Upload failed')
      }
    },
    [generateUploadUrl, saveMedia, heroMedia, galleryMedia, ceremonyMedia, receptionMedia]
  )

  const handleFileSelect = (label: Label) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file?.type.startsWith('image/')) doUpload(file, label)
    e.target.value = ''
  }

  const handleDrop = useCallback(
    (e: React.DragEvent, label: Label) => {
      e.preventDefault()
      setDragOver(null)
      const file = e.dataTransfer.files[0]
      if (file?.type.startsWith('image/')) doUpload(file, label)
    },
    [doUpload]
  )

  const handleDragOver = (e: React.DragEvent, label: Label) => {
    e.preventDefault()
    setDragOver(label)
  }
  const handleDragLeave = () => setDragOver(null)

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <h1 className="text-3xl font-light tracking-wide mb-2">Master Dashboard</h1>
          <p className="text-slate-400 text-sm mb-4">
            <strong className="text-slate-300">Sign in to edit</strong> your wedding site — names, dates, photos, venues, FAQs, and more.
          </p>
          {!hasMaster && <p className="text-slate-500 text-xs mb-4">First time? Create an account below, then claim Master.</p>}
          {hasMaster && <p className="text-slate-500 text-xs mb-4">Only accounts created by the site owner can sign in. Ask them to add you in Users &amp; Roles.</p>}
          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && <p className="text-amber-400 text-sm break-words">{loginError}</p>}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              autoComplete="email"
              className="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-600/50 text-slate-100 placeholder-slate-500 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 outline-none transition"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (min 8 characters)"
              required
              minLength={8}
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              className="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-600/50 text-slate-100 placeholder-slate-500 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 outline-none transition"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 text-slate-900 font-semibold flex items-center justify-center gap-2 disabled:opacity-70 hover:from-amber-500 hover:to-amber-400 transition"
            >
              <LogIn className="w-4 h-4" />
              {loading ? (!hasMaster && isSignUp ? 'Creating account...' : 'Signing in...') : (!hasMaster && isSignUp ? 'Create account' : 'Sign In')}
            </button>
            {!hasMaster && (
              <button
                type="button"
                onClick={() => { setIsSignUp(!isSignUp); setLoginError('') }}
                className="w-full text-amber-500 text-sm hover:text-amber-400 transition"
              >
                {isSignUp ? 'Already have an account? Sign in' : 'First time? Create an account'}
              </button>
            )}
          </form>
          <Link href="/" className="mt-6 inline-flex items-center gap-2 text-amber-500 text-sm hover:text-amber-400 transition">
            <ArrowLeft className="w-4 h-4" />
            Back to site
          </Link>
        </motion.div>
      </div>
    )
  }

  const handleClaimMaster = async () => {
    try {
      await claimMaster()
    } catch (e) {
      setLoginError(e instanceof Error ? e.message : 'Could not claim master')
    }
  }

  if (!isMaster) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <h1 className="text-xl font-light mb-2">Almost there</h1>
          <p className="text-slate-400 mb-4">
            You&apos;re signed in. {!hasMaster ? 'Click below to become the site owner (Master) and start editing.' : 'Another person already owns this site — ask them to grant you Master access.'}
          </p>
          {!hasMaster && (
            <button
              onClick={handleClaimMaster}
              className="mb-4 w-full py-3 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30 transition font-medium"
            >
              Claim Master
            </button>
          )}
          {hasMaster && (
            <div className="mb-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-left">
              <p className="text-amber-200 font-medium mb-2">Ask the site owner to create an account</p>
              <p className="text-slate-400 text-xs mb-3">They will set up your email and password — when you open it and sign up, you’re added automatically. Or if they prefer, send them your User ID below.</p>
            </div>
          )}
          <Link href="/admin" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:text-amber-400 transition">View guests</Link>
          <span className="mx-2 text-slate-600">·</span>
          <button onClick={() => signOut()} className="text-amber-500 hover:text-amber-400 transition">Sign out</button>
          <span className="mx-2 text-slate-600">·</span>
          <Link href="/" className="text-amber-500 hover:text-amber-400 transition">Back to site</Link>
        </div>
      </div>
    )
  }

  const updateConfig = <K extends keyof WeddingConfig>(key: K, value: WeddingConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }))
  }

  const updateVenue = (which: 'ceremony' | 'reception', field: string, value: string) => {
    setConfig((prev) => ({
      ...prev,
      venues: {
        ...prev.venues,
        [which]: { ...prev.venues[which], [field]: value },
      },
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-900/80 border-b border-slate-700/50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-light tracking-wide">Master — Edit Site</h1>
            <p className="text-slate-500 text-xs mt-0.5">Content, photos, venues, FAQs</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleSaveConfig}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 text-slate-900 font-semibold hover:from-amber-500 hover:to-amber-400 transition disabled:opacity-70"
            >
              {configSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {configSaved ? 'Saved!' : saving ? 'Saving...' : 'Save all'}
            </button>
            <Link href="/admin" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-amber-500 text-sm transition">Admin</Link>
            <Link href="/launch" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-amber-500 text-sm transition">Launcher</Link>
            <Link href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-400 hover:text-amber-500 text-sm transition">
              <ArrowLeft className="w-4 h-4" />
              Site
            </Link>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 text-slate-400 hover:text-amber-500 text-sm transition"
            >
              <LogOut className="w-4 h-4" />
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-4">
        {loginError && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-red-400 text-sm">
            {loginError}
          </div>
        )}

        {/* Section navigation */}
        <nav className="flex flex-wrap gap-2 mb-6">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setExpandedSection(s.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition ${
                expandedSection === s.id
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600 hover:text-slate-300'
              }`}
            >
              <s.icon className="w-4 h-4" />
              {s.label}
            </button>
          ))}
        </nav>

        <div className="space-y-4">
          {/* Couple & Date */}
          <SectionCard
            id="couple"
            title="Couple & Date"
            icon={Heart}
            expanded={expandedSection === 'couple'}
            onToggle={() => setExpandedSection(expandedSection === 'couple' ? '' : 'couple')}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Partner 1 name" value={config.couple.names[0]} onChange={(v) => updateConfig('couple', { ...config.couple, names: [v, config.couple.names[1]] })} />
              <Input label="Partner 2 name" value={config.couple.names[1]} onChange={(v) => updateConfig('couple', { ...config.couple, names: [config.couple.names[0], v] })} />
              <Input label="Initials (e.g. S&A)" value={config.couple.initials} onChange={(v) => updateConfig('couple', { ...config.couple, initials: v })} />
              <Input label="Hashtag" value={config.couple.hashtag} onChange={(v) => updateConfig('couple', { ...config.couple, hashtag: v })} />
              <Input label="Date (e.g. September 14, 2025)" value={config.date.full} onChange={(v) => updateConfig('date', { ...config.date, full: v })} />
              <Input label="Time (e.g. 4:00 PM)" value={config.date.time} onChange={(v) => updateConfig('date', { ...config.date, time: v })} />
            </div>
            </SectionCard>

            {/* Couple ID */}
            <SectionCard
              id="coupleId"
              title="Couple ID"
              icon={KeyRound}
              expanded={expandedSection === 'coupleId'}
              onToggle={() => setExpandedSection(expandedSection === 'coupleId' ? '' : 'coupleId')}
            >
              <p className="text-slate-400 text-sm mb-4">
                A unique ID that authenticates you and your family to view the Admin dashboard (guests, RSVPs). Share it only with trusted people. Anyone with this ID can view your guest list.
              </p>
              {displayedCoupleId ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/50 border border-amber-500/30">
                    <code className="text-lg font-mono tracking-wider text-amber-400 flex-1">{displayedCoupleId}</code>
                    <button
                      type="button"
                      onClick={copyCoupleId}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30 transition"
                    >
                      <Copy className="w-4 h-4" />
                      {coupleIdCopied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <p className="text-slate-500 text-xs">
                    Share this with family or friends who need to view the Admin panel. They enter it at <Link href="/admin" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:underline">/admin</Link>.
                  </p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleGenerateCoupleId}
                  disabled={coupleIdGenerating}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30 transition disabled:opacity-70 font-medium"
                >
                  <KeyRound className="w-5 h-5" />
                  {coupleIdGenerating ? 'Generating...' : 'Generate Couple ID'}
                </button>
              )}
            </SectionCard>

            {/* Venues */}
          <SectionCard
            id="venues"
            title="Venues"
            icon={MapPin}
            expanded={expandedSection === 'venues'}
            onToggle={() => setExpandedSection(expandedSection === 'venues' ? '' : 'venues')}
          >
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-amber-400/90 mb-3">Ceremony</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Venue name" value={config.venues.ceremony.name} onChange={(v) => updateVenue('ceremony', 'name', v)} />
                  <Input label="Time" value={config.venues.ceremony.time} onChange={(v) => updateVenue('ceremony', 'time', v)} />
                  <Input label="Address" value={config.venues.ceremony.address} onChange={(v) => updateVenue('ceremony', 'address', v)} className="md:col-span-2" />
                  <Input label="Map URL" value={config.venues.ceremony.mapUrl} onChange={(v) => updateVenue('ceremony', 'mapUrl', v)} className="md:col-span-2" />
                  <Input label="Directions URL" value={config.venues.ceremony.directionsUrl} onChange={(v) => updateVenue('ceremony', 'directionsUrl', v)} className="md:col-span-2" />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-amber-400/90 mb-3">Reception</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Venue name" value={config.venues.reception.name} onChange={(v) => updateVenue('reception', 'name', v)} />
                  <Input label="Time" value={config.venues.reception.time} onChange={(v) => updateVenue('reception', 'time', v)} />
                  <Input label="Address" value={config.venues.reception.address} onChange={(v) => updateVenue('reception', 'address', v)} className="md:col-span-2" />
                  <Input label="Map URL" value={config.venues.reception.mapUrl} onChange={(v) => updateVenue('reception', 'mapUrl', v)} className="md:col-span-2" />
                  <Input label="Directions URL" value={config.venues.reception.directionsUrl} onChange={(v) => updateVenue('reception', 'directionsUrl', v)} className="md:col-span-2" />
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Events */}
          <SectionCard
            id="events"
            title="Events"
            icon={Calendar}
            expanded={expandedSection === 'events'}
            onToggle={() => setExpandedSection(expandedSection === 'events' ? '' : 'events')}
          >
            <div className="space-y-4">
              {config.events.map((ev, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 flex gap-4 flex-wrap">
                  <Input label="Time" value={ev.time} onChange={(v) => {
                    const next = [...config.events]
                    next[i] = { ...next[i], time: v }
                    updateConfig('events', next)
                  }} className="w-28" />
                  <Input label="Title" value={ev.title} onChange={(v) => {
                    const next = [...config.events]
                    next[i] = { ...next[i], title: v }
                    updateConfig('events', next)
                  }} className="flex-1 min-w-[120px]" />
                  <Input label="Description" value={ev.description} onChange={(v) => {
                    const next = [...config.events]
                    next[i] = { ...next[i], description: v }
                    updateConfig('events', next)
                  }} className="flex-1 min-w-[140px]" />
                  <button
                    type="button"
                    onClick={() => updateConfig('events', config.events.filter((_, j) => j !== i))}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition self-end"
                    aria-label="Remove event"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => updateConfig('events', [...config.events, { time: '', title: '', icon: 'Heart', description: '' }])}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-slate-600 text-slate-400 hover:border-amber-500/50 hover:text-amber-500 transition text-sm"
              >
                <Plus className="w-4 h-4" />
                Add event
              </button>
            </div>
          </SectionCard>

          {/* Love Story */}
          <SectionCard
            id="story"
            title="Love Story"
            icon={BookOpen}
            expanded={expandedSection === 'story'}
            onToggle={() => setExpandedSection(expandedSection === 'story' ? '' : 'story')}
          >
            <div className="space-y-4">
              {config.loveStory.map((milestone, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 flex gap-4 flex-wrap">
                  <Input label="Year" value={milestone.year} onChange={(v) => {
                    const next = [...config.loveStory]
                    next[i] = { ...next[i], year: v }
                    updateConfig('loveStory', next)
                  }} className="w-24" />
                  <Input label="Title" value={milestone.title} onChange={(v) => {
                    const next = [...config.loveStory]
                    next[i] = { ...next[i], title: v }
                    updateConfig('loveStory', next)
                  }} className="flex-1 min-w-[120px]" />
                  <Input label="Description" value={milestone.description} onChange={(v) => {
                    const next = [...config.loveStory]
                    next[i] = { ...next[i], description: v }
                    updateConfig('loveStory', next)
                  }} className="flex-1 min-w-[200px]" />
                  <button
                    type="button"
                    onClick={() => updateConfig('loveStory', config.loveStory.filter((_, j) => j !== i))}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition self-end"
                    aria-label="Remove"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => updateConfig('loveStory', [...config.loveStory, { year: '', title: '', description: '' }])}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-slate-600 text-slate-400 hover:border-amber-500/50 hover:text-amber-500 transition text-sm"
              >
                <Plus className="w-4 h-4" />
                Add milestone
              </button>
            </div>
          </SectionCard>

          {/* Accommodations */}
          <SectionCard
            id="accommodations"
            title="Accommodations"
            icon={Home}
            expanded={expandedSection === 'accommodations'}
            onToggle={() => setExpandedSection(expandedSection === 'accommodations' ? '' : 'accommodations')}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Hotel name" value={config.accommodations.hotel} onChange={(v) => updateConfig('accommodations', { ...config.accommodations, hotel: v })} />
              <Input label="Address" value={config.accommodations.address} onChange={(v) => updateConfig('accommodations', { ...config.accommodations, address: v })} />
              <Input label="Phone" value={config.accommodations.phone} onChange={(v) => updateConfig('accommodations', { ...config.accommodations, phone: v })} />
              <Input label="Block code" value={config.accommodations.blockCode} onChange={(v) => updateConfig('accommodations', { ...config.accommodations, blockCode: v })} />
              <Input label="Discount" value={config.accommodations.discount} onChange={(v) => updateConfig('accommodations', { ...config.accommodations, discount: v })} />
            </div>
          </SectionCard>

          {/* Registry */}
          <SectionCard
            id="registry"
            title="Registry"
            icon={Gift}
            expanded={expandedSection === 'registry'}
            onToggle={() => setExpandedSection(expandedSection === 'registry' ? '' : 'registry')}
          >
            <Input label="Message" value={config.registry.message} onChange={(v) => updateConfig('registry', { ...config.registry, message: v })} multiline />
            <div className="mt-4 space-y-3">
              <h4 className="text-sm font-medium text-amber-400/90">Registry stores</h4>
              {config.registry.stores.map((store, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <Input label="Store name" value={store.name} onChange={(v) => {
                    const next = [...config.registry.stores]
                    next[i] = { ...next[i], name: v }
                    updateConfig('registry', { ...config.registry, stores: next })
                  }} className="flex-1" />
                  <Input label="URL" value={store.url} onChange={(v) => {
                    const next = [...config.registry.stores]
                    next[i] = { ...next[i], url: v }
                    updateConfig('registry', { ...config.registry, stores: next })
                  }} className="flex-1" />
                  <button
                    type="button"
                    onClick={() => updateConfig('registry', { ...config.registry, stores: config.registry.stores.filter((_, j) => j !== i) })}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition"
                    aria-label="Remove"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => updateConfig('registry', { ...config.registry, stores: [...config.registry.stores, { name: '', url: '' }] })}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-slate-600 text-slate-400 hover:border-amber-500/50 hover:text-amber-500 transition text-sm"
              >
                <Plus className="w-4 h-4" />
                Add store
              </button>
            </div>
          </SectionCard>

          {/* FAQs */}
          <SectionCard
            id="faqs"
            title="FAQs"
            icon={HelpCircle}
            expanded={expandedSection === 'faqs'}
            onToggle={() => setExpandedSection(expandedSection === 'faqs' ? '' : 'faqs')}
          >
            <div className="space-y-4">
              {config.faqs.map((faq, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
                  <Input label="Question" value={faq.q} onChange={(v) => {
                    const next = [...config.faqs]
                    next[i] = { ...next[i], q: v }
                    updateConfig('faqs', next)
                  }} />
                  <Input label="Answer" value={faq.a} onChange={(v) => {
                    const next = [...config.faqs]
                    next[i] = { ...next[i], a: v }
                    updateConfig('faqs', next)
                  }} className="mt-3" multiline />
                  <button
                    type="button"
                    onClick={() => updateConfig('faqs', config.faqs.filter((_, j) => j !== i))}
                    className="mt-2 text-sm text-slate-400 hover:text-red-400 transition"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => updateConfig('faqs', [...config.faqs, { q: '', a: '' }])}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-slate-600 text-slate-400 hover:border-amber-500/50 hover:text-amber-500 transition text-sm"
              >
                <Plus className="w-4 h-4" />
                Add FAQ
              </button>
            </div>
          </SectionCard>

          {/* Photos */}
          <SectionCard
            id="photos"
            title="Photos"
            icon={ImageIcon}
            expanded={expandedSection === 'photos'}
            onToggle={() => setExpandedSection(expandedSection === 'photos' ? '' : 'photos')}
          >
            <p className="text-slate-400 text-sm mb-6">
              Upload photos for each section. Hero images appear on the landing; gallery, ceremony, and reception are used in their sections.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {LABELS.map((label) => {
                const list = label === 'hero' ? heroMedia : label === 'gallery' ? galleryMedia : label === 'ceremony' ? ceremonyMedia : receptionMedia
                const isDragActive = dragOver === label
                return (
                  <div key={label} className="rounded-xl border border-slate-700/50 overflow-hidden bg-slate-800/30">
                    <div className="px-4 py-3 border-b border-slate-700/50 bg-slate-800/50">
                      <span className="text-sm font-medium text-amber-400/90 capitalize">{label}</span>
                    </div>
                    <div
                      onDrop={(e) => handleDrop(e, label)}
                      onDragOver={(e) => handleDragOver(e, label)}
                      onDragLeave={handleDragLeave}
                      className={`p-4 transition ${isDragActive ? 'bg-amber-500/10 border-2 border-dashed border-amber-500/50' : ''}`}
                    >
                      <input
                        ref={(el) => { fileInputRefs.current[label] = el }}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileSelect(label)}
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRefs.current[label]?.click()}
                        className="w-full py-8 rounded-lg border-2 border-dashed border-slate-600 text-slate-500 hover:border-amber-500/50 hover:text-amber-500 hover:bg-amber-500/5 transition flex flex-col items-center gap-2"
                      >
                        <Upload className="w-8 h-8" />
                        <span className="text-sm">Click or drag & drop</span>
                      </button>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {list.map((m) => (
                          <MediaThumb key={m._id} storageId={m.storageId} onRemove={() => removeMedia({ id: m._id })} />
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </SectionCard>

          {/* Users & Roles */}
          <SectionCard
            id="accounts"
            title="Users & Roles"
            icon={Users}
            expanded={expandedSection === 'accounts'}
            onToggle={() => setExpandedSection(expandedSection === 'accounts' ? '' : 'accounts')}
          >
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-600/50">
                <p className="text-slate-300 font-medium mb-3">Create a user</p>
                <p className="text-slate-400 text-sm mb-3">Enter email and password. They will use these credentials to sign in to the panel. When they open it and sign up, they’ll see the sign-up form. After they create an account, they’ll get a User ID to send back to you.</p>
                <div className="flex gap-2 hidden">
                  <input
                    ref={undefined as any}
                    type="text"
                    readOnly
                    value={inviteUrl}
                    className="flex-1 px-3 py-2 rounded-lg bg-slate-900/80 border border-slate-600/50 text-slate-200 text-sm font-mono"
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(inviteUrl)
                        setInviteLinkCopied(true)
                        setTimeout(() => setInviteLinkCopied(false), 2000)
                      } catch {
                        inviteLinkRef.current?.select()
                        setInviteLinkCopied(false)
                      }
                    }}
                    disabled={!inviteUrl}
                    className="px-4 py-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30 font-medium shrink-0 flex items-center gap-2 disabled:opacity-50"
                  >
                    <Copy className="w-4 h-4" />
                    {inviteLinkCopied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <p className="text-slate-500 text-xs mt-2">If Copy doesn’t work, click the link above and press Ctrl+C to copy it.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                <p className="text-slate-300 font-medium mb-2">Add someone manually (optional)</p>
                <p className="text-slate-400 text-sm">They’ll send you their User ID. Paste it below, pick their role, and click Add.</p>
              </div>

              {createFeedback === 'success' && <p className="text-green-400 text-sm">User created. They can now sign in with the email and password you set.</p>}
              {createFeedback === 'error' && loginError && <p className="text-red-400 text-sm">{loginError}</p>}
              {removeFeedback && <p className="text-green-400 text-sm">{removeFeedback}</p>}

              <div>
                <p className="text-slate-400 text-sm mb-2">Current users</p>
                <ul className="space-y-2 mb-4">
                  {accounts.length === 0 ? (
                    <li className="text-slate-500 text-sm py-2">No users yet.</li>
                  ) : (
                    accounts.map((a) => (
                      <li key={a.userId} className="flex items-center gap-3 py-2 px-3 rounded-lg bg-slate-800/40">
                        <span className="text-slate-300 text-sm truncate flex-1">{(a as {email?: string}).email ?? a.userId}</span>
                        {editingUserId === a.userId ? (
                          <>
                            <select
                              value={editRole}
                              onChange={(e) => setEditRole(e.target.value as 'admin' | 'master')}
                              className="px-3 py-1 rounded bg-slate-700 text-slate-200 text-sm"
                            >
                              <option value="admin">admin</option>
                              <option value="master">master</option>
                            </select>
                            <button type="button" onClick={() => handleEditRole(a.userId, editRole)} className="px-3 py-1 rounded bg-amber-500/20 text-amber-400 text-sm">Save</button>
                            <button type="button" onClick={() => setEditingUserId(null)} className="px-3 py-1 rounded text-slate-400 text-sm">Cancel</button>
                          </>
                        ) : (
                          <>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium shrink-0 ${a.role === 'master' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-500/20 text-slate-400'}`}>
                          {a.role}
                        </span>
                        <button
                          type="button"
                          onClick={() => { setEditingUserId(a.userId); setEditRole(a.role) }}
                          className="p-1.5 rounded text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition shrink-0"
                          title="Edit role"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveRole(a.userId)}
                          className="p-1.5 rounded text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition shrink-0"
                          title="Remove this user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                          </>
                        )}
                      </li>
                    ))
                  )}
                </ul>
              </div>

              <form onSubmit={handleCreateUser} className="flex flex-wrap gap-3 items-end">
                <div>
                  <label className="block text-slate-400 text-xs mb-1">Email</label>
                  <input
                    type="email"
                    value={createEmail}
                    onChange={(e) => { setCreateEmail(e.target.value); setCreateFeedback(null) }}
                    placeholder="user@example.com"
                    required
                    className="px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-600/50 text-slate-100 placeholder-slate-500 focus:border-amber-500/50 outline-none w-48"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-xs mb-1">Password (min 8)</label>
                  <input
                    type="password"
                    value={createPassword}
                    onChange={(e) => { setCreatePassword(e.target.value); setCreateFeedback(null) }}
                    placeholder="••••••••"
                    minLength={8}
                    required
                    className="px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-600/50 text-slate-100 placeholder-slate-500 focus:border-amber-500/50 outline-none w-36"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-xs mb-1">Role</label>
                  <select
                    value={createRole}
                    onChange={(e) => setCreateRole(e.target.value as 'admin' | 'master')}
                    className="px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-600/50 text-slate-100"
                  >
                    <option value="admin">Admin (view guests)</option>
                    <option value="master">Master (full edit)</option>
                  </select>
                </div>
                <button type="submit" disabled={createLoading} className="px-5 py-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30 transition font-medium disabled:opacity-50">
                  {createLoading ? 'Creating...' : 'Create'}
                </button>
              </form>
            </div>
          </SectionCard>
        </div>
      </main>
    </div>
  )
}

function SectionCard({
  id,
  title,
  icon: Icon,
  expanded,
  onToggle,
  children,
}: {
  id: string
  title: string
  icon: React.ElementType
  expanded: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <motion.div
      layout
      initial={false}
      className="rounded-2xl border border-slate-700/50 bg-slate-900/50 overflow-hidden"
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-800/30 transition"
      >
        <span className="flex items-center gap-3 font-medium text-slate-200">
          <Icon className="w-5 h-5 text-amber-400/80" />
          {title}
        </span>
        {expanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2 border-t border-slate-700/50">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function Input({
  label,
  value,
  onChange,
  className = '',
  multiline,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  className?: string
  multiline?: boolean
}) {
  const base = 'w-full px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-600/50 text-slate-100 placeholder-slate-500 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 outline-none transition'
  if (multiline) {
    return (
      <div className={className}>
        <label className="block text-sm text-slate-400 mb-1.5">{label}</label>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className={`${base} resize-y`}
          placeholder={label}
        />
      </div>
    )
  }
  return (
    <div className={className}>
      <label className="block text-sm text-slate-400 mb-1.5">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={base}
        placeholder={label}
      />
    </div>
  )
}

function MediaThumb({
  storageId,
  onRemove,
}: {
  storageId: Id<'_storage'>
  onRemove: () => void
}) {
  const url = useQuery(api.media.getUrl, { storageId })
  if (!url) return <div className="w-20 h-20 rounded-lg bg-slate-700/50 animate-pulse" />
  return (
    <div className="relative group">
      <img src={url} alt="" className="w-20 h-20 object-cover rounded-lg border border-slate-600/50" />
      <button
        type="button"
        onClick={onRemove}
        className="absolute -top-1 -right-1 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition shadow-lg"
        aria-label="Remove"
      >
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  )
}
