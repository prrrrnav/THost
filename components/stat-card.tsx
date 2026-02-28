"use client"

import { 
  Building2, 
  Users, 
  IndianRupee, 
  CreditCard, 
  ShieldCheck,
  LucideIcon 
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// 1. Create a local mapping for the icons
const iconMap: Record<string, LucideIcon> = {
  building: Building2,
  users: Users,
  rupee: IndianRupee,
  credit: CreditCard,
  shield: ShieldCheck,
}

interface StatCardProps {
  title: string
  value: string
  subtitle: string
  change: string
  changeType: "positive" | "negative" | "neutral"
  iconName: string // Changed from 'icon' to 'iconName'
  iconColor?: string
  iconBg?: string
}

export function StatCard({
  title,
  value,
  subtitle,
  change,
  changeType,
  iconName,
  iconColor,
  iconBg,
}: StatCardProps) {
  // 2. Look up the component based on the string passed from the server
  const Icon = iconMap[iconName] || Building2

  return (
    <Card className="relative overflow-hidden border border-white/10 bg-zinc-950/50 backdrop-blur-xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", iconBg || "bg-zinc-500/10")}>
            {/* 3. Render the locally mapped Icon */}
            <Icon className={cn("h-5 w-5", iconColor || "text-zinc-400")} />
          </div>
          <span className={cn(
            "rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase",
            changeType === "positive" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
            changeType === "negative" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" :
            "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20"
          )}>
            {change}
          </span>
        </div>
        <div className="mt-5 space-y-1">
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-zinc-100">{value}</h3>
          </div>
          <p className="text-[11px] text-zinc-500 italic">{subtitle}</p>
        </div>
      </CardContent>
    </Card>
  )
}