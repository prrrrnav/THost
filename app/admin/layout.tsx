// "use client"

// import { AdminSidebar } from "@/components/admin-sidebar"
// import { Input } from "@/components/ui/input"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// import { Search, Bell } from "lucide-react"
// import { Button } from "@/components/ui/button"

// export default function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <div className="flex h-screen bg-background">
//       <AdminSidebar />
//       <div className="flex flex-1 flex-col overflow-hidden">
//         {/* Top bar */}
//         <header className="flex h-14 items-center justify-between border-b border-border bg-card px-6">
//           <div className="relative w-full max-w-xs">
//             <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//             <Input
//               placeholder="Search tenants, rooms..."
//               className="h-9 pl-9 text-sm"
//             />
//           </div>
//           <div className="flex items-center gap-3">
//             <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
//               <Bell className="h-4 w-4" />
//               <span className="sr-only">Notifications</span>
//             </Button>
//             <Avatar className="h-8 w-8">
//               <AvatarFallback className="bg-primary/10 text-primary text-xs">RV</AvatarFallback>
//             </Avatar>
//           </div>
//         </header>
//         {/* Main content */}
//         <main className="flex-1 overflow-y-auto p-6">
//           {children}
//         </main>
//       </div>
//     </div>
//   )
// }



"use client"

import { AdminSidebar } from "@/components/admin-sidebar"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-black selection:bg-violet-500/30">
      <AdminSidebar />

      <div className="flex flex-1 flex-col overflow-hidden relative">
        {/* Aceternity Ambient Background Grid */}
        <div className="absolute inset-0 z-0 h-full w-full bg-black bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-violet-500 opacity-20 blur-[100px]"></div>
        </div>

        {/* Top bar - Glassmorphism */}
        <header className="relative z-20 flex h-16 items-center justify-between border-b border-white/[0.05] bg-black/40 px-6 backdrop-blur-2xl">
          {/* Search - Aceternity Glow Input Style */}
          <div className="group relative w-full max-w-sm rounded-full bg-zinc-900/50 transition-all duration-300 focus-within:bg-zinc-900">
            <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-violet-500/0 via-violet-500/40 to-violet-500/0 opacity-0 blur transition duration-500 group-focus-within:opacity-100"></div>
            <div className="relative flex items-center rounded-full border border-white/10 bg-black/50 px-3 py-1 shadow-input">
              <Search className="h-4 w-4 text-zinc-400" />
              <Input
                placeholder="Search tenants, rooms..."
                className="h-8 border-0 bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-4">
            {/* Bell Notification */}
            <div className="relative group">
              <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-0 blur transition duration-300 group-hover:opacity-30"></div>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-9 w-9 rounded-full border border-white/5 bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-violet-500 shadow-[0_0_10px_2px_rgba(139,92,246,0.6)] animate-pulse" />
              </Button>
            </div>

            {/* Avatar Pill */}
            <div className="flex cursor-pointer items-center gap-3 rounded-full border border-white/5 bg-zinc-900/50 py-1.5 pl-1.5 pr-4 transition-all hover:border-white/10 hover:bg-zinc-800">
              <Avatar className="h-7 w-7 border border-white/10">
                <AvatarFallback className="bg-gradient-to-br from-violet-600 to-indigo-600 text-[10px] font-bold text-white">
                  RV
                </AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium text-zinc-300">Admin</span>
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