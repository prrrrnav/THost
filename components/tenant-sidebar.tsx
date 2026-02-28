import Link from "next/link"
import {
  Home,
  LayoutDashboard,
  MessageSquare,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/server"

const navItems = [
  { href: "/tenant", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tenant/complaints", label: "Complaints", icon: MessageSquare },
  { href: "/tenant/profile", label: "Profile", icon: Settings },
]

export default async function TenantSidebar() {
  const supabase = await createClient()
  
  // 1. Fetch current user and their tenant record dynamically
  const { data: { user } } = await supabase.auth.getUser()
  const { data: tenant } = await supabase
    .from("tenants")
    .select("name, room_number")
    .eq("email", user?.email)
    .single()

  // 2. Generate dynamic initials for the avatar
  const displayName = tenant?.name || user?.user_metadata?.full_name || "Tenant"
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <aside className="relative z-20 flex h-screen w-64 flex-col border-r border-white/10 bg-zinc-950/40 backdrop-blur-xl">
      {/* Absolute subtle right border glow in Emerald */}
      <div className="absolute bottom-0 right-0 top-0 w-px bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent" />

      {/* Brand Header */}
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-white/5 px-4">
        <div className="relative group flex shrink-0 items-center justify-center">
          <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 opacity-30 blur transition-opacity group-hover:opacity-60" />
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-black shadow-lg">
            <Home className="h-4 w-4 text-emerald-400" />
          </div>
        </div>
        <span className="text-sm font-bold tracking-wide text-zinc-100">
          MRK<span className="text-emerald-500"> PG</span>
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-1 flex-col gap-2 overflow-y-auto px-3 py-6">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 text-zinc-400 border border-transparent hover:bg-white/5 hover:text-zinc-100 hover:border-white/10"
          >
            <item.icon className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Footer / Profile Section */}
      <div className="flex flex-col gap-3 border-t border-white/5 p-3">
        <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-black/40 p-2 transition-colors hover:border-white/10 hover:bg-black/60">
          <Avatar className="h-8 w-8 border border-white/10 shrink-0">
            <AvatarFallback className="bg-gradient-to-br from-emerald-600 to-teal-600 text-[10px] font-bold text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Dynamic Name and Room from Database */}
            <span className="truncate text-xs font-semibold text-zinc-200">{displayName}</span>
            <span className="truncate text-[10px] uppercase tracking-wider text-emerald-400/80">
              Room {tenant?.room_number || "Unassigned"}
            </span>
          </div>
          
          <Link 
            href="/login" 
            className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-rose-500/10 hover:text-rose-400"
          >
            <LogOut className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </aside>
  )
}