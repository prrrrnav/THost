// "use client"

// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import {
//   ShieldCheck,
//   LayoutDashboard,
//   Users,
//   Building2,
//   Settings,
//   LogOut,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react"
// import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// import { useState } from "react"

// const navItems = [
//   { href: "/superadmin", label: "Dashboard", icon: LayoutDashboard },
//   { href: "/superadmin/owners", label: "PG Owners", icon: Building2 },
//   { href: "/superadmin/tenants", label: "Tenants", icon: Users },
//   { href: "/superadmin/settings", label: "Settings", icon: Settings },
// ]

// export function SuperAdminSidebar() {
//   const pathname = usePathname()
//   const [collapsed, setCollapsed] = useState(false)

//   return (
//     <aside
//       className={cn(
//         "flex h-screen flex-col border-r border-border bg-card transition-all duration-200",
//         collapsed ? "w-16" : "w-56"
//       )}
//     >
//       <div className="flex h-14 items-center gap-2 border-b border-border px-4">
//         <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-warning">
//           <ShieldCheck className="h-4 w-4 text-warning-foreground" />
//         </div>
//         {!collapsed && (
//           <span className="text-sm font-semibold text-card-foreground">SuperAdmin</span>
//         )}
//       </div>

//       <nav className="flex flex-1 flex-col gap-1 px-2 py-3">
//         {navItems.map((item) => {
//           const isActive = pathname === item.href
//           return (
//             <Link
//               key={item.href}
//               href={item.href}
//               className={cn(
//                 "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
//                 isActive
//                   ? "bg-primary/10 text-primary"
//                   : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
//               )}
//             >
//               <item.icon className="h-4 w-4 shrink-0" />
//               {!collapsed && <span>{item.label}</span>}
//             </Link>
//           )
//         })}
//       </nav>

//       <div className="flex flex-col gap-2 border-t border-border p-2">
//         <Button
//           variant="ghost"
//           size="sm"
//           onClick={() => setCollapsed(!collapsed)}
//           className="w-full justify-center"
//         >
//           {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
//         </Button>
//         <div className="flex items-center gap-2 rounded-lg px-3 py-2">
//           <Avatar className="h-7 w-7">
//             <AvatarFallback className="bg-warning/10 text-warning text-xs">SA</AvatarFallback>
//           </Avatar>
//           {!collapsed && (
//             <div className="flex flex-1 flex-col overflow-hidden">
//               <span className="truncate text-xs font-medium text-card-foreground">Platform Admin</span>
//               <span className="truncate text-[10px] text-muted-foreground">SuperAdmin</span>
//             </div>
//           )}
//           {!collapsed && (
//             <Link href="/" aria-label="Logout">
//               <LogOut className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
//             </Link>
//           )}
//         </div>
//       </div>
//     </aside>
//   )
// }



"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ShieldCheck,
  LayoutDashboard,
  Users,
  Building2,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useState } from "react"

const navItems = [
  { href: "/superadmin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/superadmin/owners", label: "PG Owners", icon: Building2 },
  { href: "/superadmin/tenants", label: "Tenants", icon: Users },
  { href: "/superadmin/settings", label: "Settings", icon: Settings },
]

export function SuperAdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "relative z-20 flex h-screen flex-col border-r border-white/10 bg-zinc-950/40 backdrop-blur-xl transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Absolute subtle right border glow in Amber */}
      <div className="absolute bottom-0 right-0 top-0 w-px bg-gradient-to-b from-transparent via-amber-500/20 to-transparent" />

      {/* Brand Header */}
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-white/5 px-4">
        <div className="relative group flex shrink-0 items-center justify-center">
          <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 opacity-30 blur transition-opacity group-hover:opacity-60" />
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-black shadow-lg">
            <ShieldCheck className="h-4 w-4 text-amber-400" />
          </div>
        </div>
        {!collapsed && (
          <span className="text-sm font-bold tracking-wide text-zinc-100">
            Super<span className="text-amber-500">Admin</span>
          </span>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-1 flex-col gap-2 overflow-y-auto px-3 py-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-amber-500/10 text-amber-300 border border-amber-500/20 shadow-[inset_0_0_12px_rgba(245,158,11,0.1)]"
                  : "text-zinc-400 border border-transparent hover:bg-white/5 hover:text-zinc-100 hover:border-white/10",
                collapsed && "justify-center px-0"
              )}
            >
              {/* Active Indicator Line */}
              {isActive && !collapsed && (
                <div className="absolute left-0 top-1/2 h-1/2 w-1 -translate-y-1/2 rounded-r-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
              )}
              
              <item.icon className={cn("h-4 w-4 shrink-0 transition-transform duration-200", isActive ? "scale-110" : "group-hover:scale-110")} />
              
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Footer / Profile Section */}
      <div className="flex flex-col gap-3 border-t border-white/5 p-3">
        {/* Collapse Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full justify-center rounded-lg text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>

        {/* User Profile */}
        <div className={cn(
          "flex items-center gap-3 rounded-xl border border-white/5 bg-black/40 p-2 transition-colors hover:border-white/10 hover:bg-black/60",
          collapsed && "justify-center"
        )}>
          <Avatar className="h-8 w-8 border border-white/10 shrink-0">
            <AvatarFallback className="bg-gradient-to-br from-amber-600 to-orange-600 text-[10px] font-bold text-white">
              SA
            </AvatarFallback>
          </Avatar>
          
          {!collapsed && (
            <div className="flex flex-1 flex-col overflow-hidden">
              <span className="truncate text-xs font-semibold text-zinc-200">Platform Admin</span>
              <span className="truncate text-[10px] uppercase tracking-wider text-amber-400/80">SuperAdmin</span>
            </div>
          )}
          
          {!collapsed && (
            <Link 
              href="/" 
              aria-label="Logout"
              className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-rose-500/10 hover:text-rose-400"
            >
              <LogOut className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </aside>
  )
}