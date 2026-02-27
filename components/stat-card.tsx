// import { LucideIcon } from "lucide-react"
// import { Card, CardContent } from "@/components/ui/card"
// import { cn } from "@/lib/utils"

// interface StatCardProps {
//   title: string
//   value: string
//   subtitle: string
//   change: string
//   changeType: "positive" | "negative" | "neutral"
//   icon: LucideIcon
//   iconColor: string
//   iconBg: string
// }

// export function StatCard({
//   title,
//   value,
//   subtitle,
//   change,
//   changeType,
//   icon: Icon,
//   iconColor,
//   iconBg,
// }: StatCardProps) {
//   return (
//     <Card className="border border-border shadow-sm transition-shadow hover:shadow-md">
//       <CardContent className="flex items-start justify-between p-5">
//         <div className="flex flex-col gap-1">
//           <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
//             {title}
//           </span>
//           <span className="text-2xl font-bold tracking-tight text-card-foreground">
//             {value}
//           </span>
//           <div className="flex items-center gap-1.5 pt-0.5">
//             <span
//               className={cn(
//                 "text-xs font-medium",
//                 changeType === "positive" && "text-success",
//                 changeType === "negative" && "text-destructive",
//                 changeType === "neutral" && "text-muted-foreground"
//               )}
//             >
//               {change}
//             </span>
//             <span className="text-xs text-muted-foreground">{subtitle}</span>
//           </div>
//         </div>
//         <div
//           className={cn(
//             "flex h-10 w-10 items-center justify-center rounded-xl",
//             iconBg
//           )}
//         >
//           <Icon className={cn("h-5 w-5", iconColor)} />
//         </div>
//       </CardContent>
//     </Card>
//   )
// }


"use client"

import { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string
  subtitle: string
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  icon: LucideIcon
  iconColor?: string
  iconBg?: string
}

export function StatCard({
  title,
  value,
  subtitle,
  change,
  changeType,
  icon: Icon,
  iconColor,
  iconBg,
}: StatCardProps) {
  return (
    <Card className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/50 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/30 hover:shadow-[0_8px_30px_-12px_rgba(139,92,246,0.3)]">
      
      {/* Subtle Aceternity Background Spotlight (Reveals on hover) */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      
      <CardContent className="relative z-10 flex items-start justify-between p-6">
        <div className="flex flex-col gap-1.5">
          {/* Title */}
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            {title}
          </span>
          
          {/* Main Value */}
          <span className="text-3xl font-bold tracking-tight text-zinc-100 drop-shadow-sm">
            {value}
          </span>
          
          {/* Subtitle & Changes */}
          <div className="flex items-center gap-2 pt-1">
            {change && (
              <span
                className={cn(
                  "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-bold tracking-wide",
                  changeType === "positive" && "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
                  changeType === "negative" && "border-rose-500/20 bg-rose-500/10 text-rose-400",
                  changeType === "neutral" && "border-zinc-500/20 bg-zinc-500/10 text-zinc-400"
                )}
              >
                {change}
              </span>
            )}
            <span className="text-xs font-medium text-zinc-500">{subtitle}</span>
          </div>
        </div>

        {/* Floating Glass Icon Container */}
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/5 shadow-inner transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
            iconBg || "bg-zinc-900/50"
          )}
        >
          <Icon className={cn("h-5 w-5", iconColor || "text-zinc-400")} />
        </div>
      </CardContent>
    </Card>
  )
}