// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Progress } from "@/components/ui/progress"
// import { BedDouble, DoorOpen, Home, Users } from "lucide-react"

// const occupancyData = [
//   { label: "Total Rooms", value: 30, icon: DoorOpen, color: "text-primary", bg: "bg-primary/10" },
//   { label: "Total Beds", value: 60, icon: BedDouble, color: "text-primary", bg: "bg-primary/10" },
//   { label: "Occupied", value: 48, icon: Users, color: "text-success", bg: "bg-success/10" },
//   { label: "Vacant", value: 12, icon: Home, color: "text-warning", bg: "bg-warning/10" },
// ]

// export function OccupancyOverview() {
//   const occupancyRate = Math.round((48 / 60) * 100)

//   return (
//     <Card className="border border-border shadow-sm">
//       <CardHeader className="pb-3">
//         <CardTitle className="text-base font-semibold text-card-foreground">
//           Occupancy Overview
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="flex flex-col gap-5">
//         <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
//           {occupancyData.map((item) => (
//             <div
//               key={item.label}
//               className="flex items-center gap-3 rounded-xl border border-border bg-background p-3"
//             >
//               <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${item.bg}`}>
//                 <item.icon className={`h-4 w-4 ${item.color}`} />
//               </div>
//               <div className="flex flex-col">
//                 <span className="text-lg font-bold text-foreground">{item.value}</span>
//                 <span className="text-[11px] text-muted-foreground">{item.label}</span>
//               </div>
//             </div>
//           ))}
//         </div>
//         <div className="flex flex-col gap-2">
//           <div className="flex items-center justify-between">
//             <span className="text-sm font-medium text-foreground">Occupancy Rate</span>
//             <span className="text-sm font-bold text-primary">{occupancyRate}%</span>
//           </div>
//           <Progress value={occupancyRate} className="h-2.5" />
//         </div>
//       </CardContent>
//     </Card>
//   )
// }





"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BedDouble, DoorOpen, Home, Users } from "lucide-react"

// Updated with dark-mode friendly jewel tones and glowing border colors
const occupancyData = [
  { label: "Total Rooms", value: 30, icon: DoorOpen, color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20" },
  { label: "Total Beds", value: 60, icon: BedDouble, color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
  { label: "Occupied", value: 48, icon: Users, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  { label: "Vacant", value: 12, icon: Home, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
]

export function OccupancyOverview() {
  const occupancyRate = Math.round((48 / 60) * 100)

  return (
    <Card className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/50 backdrop-blur-xl shadow-2xl">
      {/* Subtle top glow line typical of Aceternity cards */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-bold tracking-tight text-zinc-100">
          Occupancy Overview
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
        </CardTitle>
        <p className="text-xs text-zinc-400 mt-1">Real-time status of your property capacity.</p>
      </CardHeader>
      
      <CardContent className="flex flex-col gap-6">
        
        {/* Stat Blocks Grid */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {occupancyData.map((item) => (
            <div
              key={item.label}
              className="group relative flex flex-col justify-center gap-3 overflow-hidden rounded-xl border border-white/5 bg-black/40 p-4 transition-all duration-300 hover:border-white/10 hover:bg-black/60"
            >
              {/* Subtle hover glow inside the card */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              
              <div className="flex items-center gap-3 relative z-10">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${item.bg} ${item.border} transition-transform duration-300 group-hover:scale-110`}>
                  <item.icon className={`h-4 w-4 ${item.color}`} />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold tracking-tight text-zinc-100">{item.value}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">{item.label}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Glowing Progress Bar Section */}
        <div className="flex flex-col gap-3 rounded-xl border border-white/5 bg-black/20 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Current Occupancy Rate</span>
            <span className="text-sm font-bold text-violet-400 drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]">
              {occupancyRate}%
            </span>
          </div>
          
          {/* Aceternity Style Progress Track */}
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-zinc-900 shadow-inner">
            {/* Animated glowing fill */}
            <div 
              className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-400 shadow-[0_0_12px_rgba(139,92,246,0.8)] transition-all duration-1000 ease-out"
              style={{ width: `${occupancyRate}%` }}
            >
              {/* Light sweep effect inside the progress bar */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  )
}