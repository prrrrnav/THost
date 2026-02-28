// app/tenant/layout.tsx

import TenantSidebar from "@/components/tenant-sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { NotificationsModal } from "@/components/notifications-modal" // Added this
import { createClient } from "@/lib/supabase/server"

export default async function TenantLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  // 1. Fetch Auth User
  const { data: { user } } = await supabase.auth.getUser()
  
  // 2. Fetch Tenant Profile for display name
  const { data: tenant } = await supabase
    .from("tenants")
    .select("name")
    .eq("email", user?.email)
    .single()

  // 3. Logic for name and initials
  const displayName = tenant?.name || user?.user_metadata?.full_name || "Tenant"
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()

  return (
    <div className="relative flex h-screen overflow-hidden bg-black selection:bg-emerald-500/30">
      
      {/* GLOBAL BACKGROUND ELEMENTS */}
      <div className="pointer-events-none absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
        <div className="absolute left-0 right-0 top-[-10%] m-auto h-[500px] w-[500px] rounded-full bg-emerald-600 opacity-15 blur-[120px]"></div>
      </div>

      {/* SIDEBAR */}
      <div className="relative z-10 h-full">
        <TenantSidebar />
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        
        {/* HEADER */}
        <header className="flex h-16 items-center justify-between border-b border-white/[0.05] bg-black/20 px-6 backdrop-blur-2xl">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-100">
            Tenant Portal
          </h2>
          
          <div className="flex items-center gap-4">
            {/* NOTIFICATIONS MODAL (Replaced static Bell button) */}
            <NotificationsModal userEmail={user?.email || ""} />

            {/* USER PROFILE PILL */}
            <div className="flex cursor-pointer items-center gap-3 rounded-full border border-white/5 bg-zinc-900/50 py-1.5 pl-1.5 pr-4 transition-all hover:border-white/10 hover:bg-zinc-800">
              <Avatar className="h-7 w-7 border border-white/10">
                <AvatarFallback className="bg-gradient-to-br from-emerald-600 to-teal-600 text-[10px] font-bold text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium text-zinc-300">{displayName}</span>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          {children}
        </main>
      </div>
    </div>
  )
}