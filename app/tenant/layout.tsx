// "use client"

// import { TenantSidebar } from "@/components/tenant-sidebar"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// import { Bell } from "lucide-react"
// import { Button } from "@/components/ui/button"

// export default function TenantLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <div className="flex h-screen bg-background">
//       <TenantSidebar />
//       <div className="flex flex-1 flex-col overflow-hidden">
//         <header className="flex h-14 items-center justify-between border-b border-border bg-card px-6">
//           <h2 className="text-sm font-medium text-foreground">Tenant Portal</h2>
//           <div className="flex items-center gap-3">
//             <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
//               <Bell className="h-4 w-4" />
//               <span className="sr-only">Notifications</span>
//             </Button>
//             <Avatar className="h-8 w-8">
//               <AvatarFallback className="bg-primary/10 text-primary text-xs">RS</AvatarFallback>
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

import { TenantSidebar } from "@/components/tenant-sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TenantLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex h-screen overflow-hidden bg-black selection:bg-emerald-500/30">
      
      {/* 1. GLOBAL ACETERNITY BACKGROUND: Covers the absolute entire screen */}
      <div className="pointer-events-none absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
        {/* Giant ambient Emerald glow at the top center */}
        <div className="absolute left-0 right-0 top-[-10%] m-auto h-[500px] w-[500px] rounded-full bg-emerald-600 opacity-15 blur-[120px]"></div>
      </div>

      {/* 2. SIDEBAR CONTAINER */}
      <div className="relative z-10 h-full">
        <TenantSidebar />
      </div>

      {/* 3. MAIN CONTENT CONTAINER */}
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        {/* Top bar - Glassmorphic */}
        <header className="flex h-16 items-center justify-between border-b border-white/[0.05] bg-black/20 px-6 backdrop-blur-2xl">
          
          {/* Portal Title */}
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-100">
            Tenant Portal
          </h2>
          
          <div className="flex items-center gap-4">
            {/* Bell Notification */}
            <div className="relative group">
              <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 blur transition duration-300 group-hover:opacity-30"></div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative h-9 w-9 rounded-full border border-white/5 bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_2px_rgba(16,185,129,0.6)] animate-pulse" />
                <span className="sr-only">Notifications</span>
              </Button>
            </div>

            {/* Avatar Pill */}
            <div className="flex cursor-pointer items-center gap-3 rounded-full border border-white/5 bg-zinc-900/50 py-1.5 pl-1.5 pr-4 transition-all hover:border-white/10 hover:bg-zinc-800">
              <Avatar className="h-7 w-7 border border-white/10">
                <AvatarFallback className="bg-gradient-to-br from-emerald-600 to-teal-600 text-[10px] font-bold text-white">
                  RS
                </AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium text-zinc-300">Rahul Sharma</span>
            </div>
          </div>
        </header>

        {/* Main scrollable area */}
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          {children}
        </main>
      </div>
    </div>
  )
}