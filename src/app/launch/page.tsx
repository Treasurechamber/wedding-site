'use client'

export default function LaunchPage() {
  const base = typeof window !== 'undefined' ? window.location.origin : ''
  const openInNew = (path: string) => window.open(`${base}${path}`, '_blank', 'noopener,noreferrer')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <h1 className="text-2xl font-light text-slate-100 mb-2">Wedding Site Launcher</h1>
        <p className="text-slate-400 text-sm mb-8">Click to open in a new window</p>
        <div className="space-y-4">
          <button
            onClick={() => openInNew('/')}
            className="w-full py-4 px-6 rounded-xl bg-amber-500/20 text-amber-200 border border-amber-500/40 hover:bg-amber-500/30 transition font-medium flex items-center justify-center gap-3"
          >
            <span className="text-xl">💍</span>
            Wedding Site
          </button>
          <button
            onClick={() => openInNew('/admin')}
            className="w-full py-4 px-6 rounded-xl bg-slate-600/30 text-slate-200 border border-slate-500/40 hover:bg-slate-600/50 transition font-medium flex items-center justify-center gap-3"
          >
            <span className="text-xl">📋</span>
            Admin (View Guests)
          </button>
          <button
            onClick={() => openInNew('/master')}
            className="w-full py-4 px-6 rounded-xl bg-amber-600/30 text-amber-200 border border-amber-500/40 hover:bg-amber-600/50 transition font-medium flex items-center justify-center gap-3"
          >
            <span className="text-xl">⚙️</span>
            Master (Edit Site)
          </button>
        </div>
        <p className="text-slate-500 text-xs mt-8">
          Make sure <code className="bg-slate-800 px-1 rounded">npm run dev:all</code> is running
        </p>
      </div>
    </div>
  )
}
