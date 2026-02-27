// "use client"

// import { SuperAdminSidebar } from "@/components/superadmin-sidebar"
// import { Input } from "@/components/ui/input"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// import { Search, Bell } from "lucide-react"
// import { Button } from "@/components/ui/button"

// export default function SuperAdminLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <div className="flex h-screen bg-background">
//       <SuperAdminSidebar />
//       <div className="flex flex-1 flex-col overflow-hidden">
//         <header className="flex h-14 items-center justify-between border-b border-border bg-card px-6">
//           <div className="relative w-full max-w-xs">
//             <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//             <Input
//               placeholder="Search owners, tenants..."
//               className="h-9 pl-9 text-sm"
//             />
//           </div>
//           <div className="flex items-center gap-3">
//             <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
//               <Bell className="h-4 w-4" />
//               <span className="sr-only">Notifications</span>
//             </Button>
//             <Avatar className="h-8 w-8">
//               <AvatarFallback className="bg-warning/10 text-warning text-xs">SA</AvatarFallback>
//             </Avatar>
//           </div>
//         </header>
//         <main className="flex-1 overflow-y-auto p-6">
//           {children}
//         </main>
//       </div>
//     </div>
//   )
// }


"use client"

import { SuperAdminSidebar } from "@/components/superadmin-sidebar"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex h-screen overflow-hidden bg-black selection:bg-amber-500/30">
      
      {/* 1. GLOBAL ACETERNITY BACKGROUND: Covers the absolute entire screen */}
      <div className="pointer-events-none absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
        {/* Giant ambient Amber glow at the top center */}
        <div className="absolute left-0 right-0 top-[-10%] m-auto h-[500px] w-[500px] rounded-full bg-amber-600 opacity-15 blur-[120px]"></div>
      </div>

      {/* 2. SIDEBAR CONTAINER */}
      <div className="relative z-10 h-full">
        <SuperAdminSidebar />
      </div>

      {/* 3. MAIN CONTENT CONTAINER */}
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        {/* Top bar - Glassmorphic */}
        <header className="flex h-16 items-center justify-between border-b border-white/[0.05] bg-black/20 px-6 backdrop-blur-2xl">
          
          {/* Search - Aceternity Glow Input Style (Amber Theme) */}
          <div className="group relative w-full max-w-sm rounded-full bg-zinc-900/50 transition-all duration-300 focus-within:bg-zinc-900">
            <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-amber-500/0 via-amber-500/40 to-amber-500/0 opacity-0 blur transition duration-500 group-focus-within:opacity-100"></div>
            <div className="relative flex items-center rounded-full border border-white/10 bg-black/50 px-3 py-1 shadow-input">
              <Search className="h-4 w-4 text-zinc-400" />
              <Input
                placeholder="Search owners, tenants..."
                className="h-8 border-0 bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-4">
            
            {/* Bell Notification */}
            <div className="relative group">
              <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 opacity-0 blur transition duration-300 group-hover:opacity-30"></div>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-9 w-9 rounded-full border border-white/5 bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-amber-500 shadow-[0_0_10px_2px_rgba(245,158,11,0.6)] animate-pulse" />
                <span className="sr-only">Notifications</span>
              </Button>
            </div>

            {/* Avatar Pill */}
            <div className="flex cursor-pointer items-center gap-3 rounded-full border border-white/5 bg-zinc-900/50 py-1.5 pl-1.5 pr-4 transition-all hover:border-white/10 hover:bg-zinc-800">
              <Avatar className="h-7 w-7 border border-white/10">
                <AvatarFallback className="bg-gradient-to-br from-amber-600 to-orange-600 text-[10px] font-bold text-white">
                  SA
                </AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium text-zinc-300">SuperAdmin</span>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="relative z-10 flex-1 overflow-y-auto p-6 scroll-smooth">
          {children}
        </main>
      </div>
    </div>
  )
}