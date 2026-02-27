import { createClient } from "@/lib/supabase/server"
import { TenantsTable } from "@/components/tenants-table"
import { AddTenantDialog } from "@/components/add-tenant-dialog"
import { Users } from "lucide-react"

export const metadata = {
  title: "Tenants | Admin Dashboard",
  description: "Manage your PG tenants",
}

export default async function TenantsPage() {
  // 1. Initialize Supabase Client
  const supabase = await createClient()
  
  // 2. Fetch all tenants from the database
  const { data: tenants, error } = await supabase
    .from("tenants")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching tenants:", error)
  }

  return (
    <div className="flex flex-col gap-8 pb-10">
      
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center gap-5">
          {/* Aceternity style glowing icon */}
          <div className="relative group">
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 opacity-25 blur transition duration-500 group-hover:opacity-50"></div>
            <div className="relative flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-black shadow-2xl">
              <Users className="h-6 w-6 text-violet-400" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Tenants Directory</h1>
            <p className="text-sm text-zinc-400">
              View and manage all your current and past tenants.
            </p>
          </div>
        </div>

        {/* Add Tenant Button */}
        <div className="flex items-center">
          <AddTenantDialog />
        </div>
      </div>

      {/* Tenants Table Wrapper - Glassmorphism */}
      <div className="relative animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
        {/* Subtle background glow behind the table */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-b from-violet-500/5 to-transparent blur-xl"></div>
        
        <div className="relative rounded-2xl border border-white/10 bg-zinc-950/50 p-6 backdrop-blur-xl shadow-2xl">
          <TenantsTable data={tenants || []} />
        </div>
      </div>

    </div>
  )
}