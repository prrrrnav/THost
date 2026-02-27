import { Building2 } from "lucide-react"

export default function AdminLoading() {
  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-6">
      
      {/* Glowing Icon Wrapper */}
      <div className="relative group flex items-center justify-center">
        {/* Pulsing blurred background */}
        <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 opacity-50 blur-xl animate-pulse" />
        
        {/* Spinning border ring */}
        <div className="absolute -inset-2 rounded-full border border-violet-500/30 border-t-violet-500 animate-spin" />
        
        {/* Center Icon */}
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl">
          <Building2 className="h-8 w-8 text-violet-400 animate-pulse" />
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <h3 className="text-xl font-bold tracking-tight text-zinc-100">Loading Dashboard</h3>
        <p className="text-sm text-zinc-400 animate-pulse">Syncing real-time data...</p>
      </div>

    </div>
  )
}