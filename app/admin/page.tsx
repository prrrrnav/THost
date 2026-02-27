// import { IndianRupee, TrendingDown, TrendingUp, AlertTriangle } from "lucide-react"
// import { StatCard } from "@/components/stat-card"
// import { OccupancyOverview } from "@/components/occupancy-overview"
// import { TenantsTable } from "@/components/tenants-table"
// import { Switch } from "@/components/ui/switch"
// import { Label } from "@/components/ui/label"
// import { AddTenantDialog } from "@/components/add-tenant-dialog"
// import { createClient } from "@/lib/supabase/server"
// import { calculateMonthlyProfit } from "@/app/actions/finance"

// export default async function AdminDashboard() {
//   // 1. Initialize Supabase Server Client
//   const supabase = await createClient()
  
//   // 2. Fetch real data from your tables
//   const { data: tenants } = await supabase
//     .from("tenants")
//     .select("*")
//     .order("created_at", { ascending: false })

//   const stats = await calculateMonthlyProfit()

//   return (
//     <div className="flex flex-col gap-6">
//       {/* Page header */}
//       <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
//         <div className="flex items-center gap-4">
//           <div>
//             <h1 className="text-xl font-semibold tracking-tight text-foreground">Dashboard</h1>
//             <p className="text-sm text-muted-foreground">
//               Welcome back. Here is your PG overview.
//             </p>
//           </div>
//           {/* Your new Add Tenant Button */}
//           <AddTenantDialog />
//         </div>
        
//         <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-2.5 mt-3 md:mt-0">
//           <div className="flex flex-col">
//             <Label className="text-sm font-medium text-card-foreground">
//               Automatic Rent Reminder
//             </Label>
//             <span className="text-[11px] text-muted-foreground leading-tight">
//               Reminders sent on the 1st of every month.
//             </span>
//           </div>
//           <Switch id="reminder-toggle" defaultChecked />
//         </div>
//       </div>

//       {/* Stat Cards with LIVE DATA */}
//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
//         <StatCard
//           title="Total Revenue"
//           value={`₹${stats.revenue.toLocaleString()}`}
//           subtitle="This month"
//           icon={IndianRupee}
//           iconColor="text-primary"
//           iconBg="bg-primary/10"
//         />
//         <StatCard
//           title="Total Expenses"
//           value={`₹${stats.expenses.toLocaleString()}`}
//           subtitle="Bills & Salaries"
//           icon={TrendingDown}
//           iconColor="text-destructive"
//           iconBg="bg-destructive/10"
//         />
//         <StatCard
//           title="Net Profit"
//           value={`₹${stats.profit.toLocaleString()}`}
//           subtitle="Net Earnings"
//           icon={TrendingUp}
//           iconColor="text-success"
//           iconBg="bg-success/10"
//         />
//         <StatCard
//           title="Overdue"
//           value="₹0" 
//           subtitle="Needs attention"
//           icon={AlertTriangle}
//           iconColor="text-warning"
//           iconBg="bg-warning/10"
//         />
//       </div>

//       <OccupancyOverview />

//       {/* Pass real DB tenants to your table */}
//       <TenantsTable data={tenants || []} />
//     </div>
//   )
// }


import { IndianRupee, TrendingDown, TrendingUp, AlertTriangle, Building2, Sparkles } from "lucide-react"
import { StatCard } from "@/components/stat-card"
import { OccupancyOverview } from "@/components/occupancy-overview"
import { TenantsTable } from "@/components/tenants-table"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { AddTenantDialog } from "@/components/add-tenant-dialog"
import { createClient } from "@/lib/supabase/server"
import { calculateMonthlyProfit } from "@/app/actions/finance"

export default async function AdminDashboard() {
  const supabase = await createClient()

  const { data: tenants } = await supabase
    .from("tenants")
    .select("*")
    .order("created_at", { ascending: false })

  const stats = await calculateMonthlyProfit()

  return (
    <>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .anim-1 { animation: fadeSlideUp 0.5s ease forwards 0.05s; opacity: 0; }
        .anim-2 { animation: fadeSlideUp 0.5s ease forwards 0.15s; opacity: 0; }
        .anim-3 { animation: fadeSlideUp 0.5s ease forwards 0.25s; opacity: 0; }
        .anim-4 { animation: fadeSlideUp 0.5s ease forwards 0.35s; opacity: 0; }
        .anim-5 { animation: fadeSlideUp 0.5s ease forwards 0.45s; opacity: 0; }
        .anim-6 { animation: fadeSlideUp 0.5s ease forwards 0.55s; opacity: 0; }

        .stat-card {
          position: relative;
          border: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.02);
          border-radius: 16px;
          padding: 20px;
          transition: border-color 0.25s, background 0.25s, transform 0.25s, box-shadow 0.25s;
          overflow: hidden;
          cursor: default;
        }
        .stat-card:hover {
          border-color: rgba(139,92,246,0.25);
          background: rgba(255,255,255,0.04);
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(139,92,246,0.08);
        }

        .reminder-toggle {
          border: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.02);
          border-radius: 14px;
          padding: 12px 16px;
          transition: border-color 0.2s, background 0.2s;
        }
        .reminder-toggle:hover {
          border-color: rgba(139,92,246,0.2);
          background: rgba(255,255,255,0.04);
        }

        .section-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent);
        }
      `}</style>

      <div className="flex flex-col gap-6">

        {/* Page header */}
        <div className="anim-1 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="flex items-center gap-4">
            {/* Icon badge */}
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-500/20 bg-gradient-to-br from-violet-500/15 to-indigo-500/10 shadow-lg shadow-violet-500/10">
              <Building2 className="h-[18px] w-[18px] text-violet-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold tracking-tight text-white/90">Dashboard</h1>
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live
                </span>
              </div>
              <p className="text-sm text-white/35">
                Welcome back. Here is your PG overview.
              </p>
            </div>
            <AddTenantDialog />
          </div>

          {/* Reminder toggle */}
          <div className="reminder-toggle flex items-center gap-4 mt-1 md:mt-0">
            <div className="flex flex-col">
              <Label htmlFor="reminder-toggle" className="text-sm font-medium text-white/65 cursor-pointer">
                Automatic Rent Reminder
              </Label>
              <span className="text-[11px] text-white/30 leading-tight mt-0.5">
                Reminders sent on the 1st of every month.
              </span>
            </div>
            <Switch id="reminder-toggle" defaultChecked />
          </div>
        </div>

        {/* Stat Cards */}
        <div className="anim-2 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

          {/* Revenue */}
          <div className="stat-card">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
            <div className="flex items-start justify-between mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/20">
                <IndianRupee className="h-4 w-4 text-violet-400" />
              </div>
              <span className="text-[10px] text-white/25 uppercase tracking-widest font-medium">This month</span>
            </div>
            <p className="text-2xl font-bold text-white/90 tracking-tight">₹{stats.revenue.toLocaleString()}</p>
            <p className="text-xs text-white/35 mt-1">Total Revenue</p>
            <div className="pointer-events-none absolute bottom-0 right-0 h-16 w-16 rounded-full bg-violet-500/5 blur-xl" />
          </div>

          {/* Expenses */}
          <div className="stat-card">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />
            <div className="flex items-start justify-between mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20">
                <TrendingDown className="h-4 w-4 text-red-400" />
              </div>
              <span className="text-[10px] text-white/25 uppercase tracking-widest font-medium">Bills & Salaries</span>
            </div>
            <p className="text-2xl font-bold text-white/90 tracking-tight">₹{stats.expenses.toLocaleString()}</p>
            <p className="text-xs text-white/35 mt-1">Total Expenses</p>
            <div className="pointer-events-none absolute bottom-0 right-0 h-16 w-16 rounded-full bg-red-500/5 blur-xl" />
          </div>

          {/* Profit */}
          <div className="stat-card">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
            <div className="flex items-start justify-between mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
              </div>
              <span className="text-[10px] text-white/25 uppercase tracking-widest font-medium">Net Earnings</span>
            </div>
            <p className="text-2xl font-bold text-white/90 tracking-tight">₹{stats.profit.toLocaleString()}</p>
            <p className="text-xs text-white/35 mt-1">Net Profit</p>
            <div className="pointer-events-none absolute bottom-0 right-0 h-16 w-16 rounded-full bg-emerald-500/5 blur-xl" />
          </div>

          {/* Overdue */}
          <div className="stat-card">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
            <div className="flex items-start justify-between mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
              </div>
              <span className="text-[10px] text-white/25 uppercase tracking-widest font-medium">Needs attention</span>
            </div>
            <p className="text-2xl font-bold text-white/90 tracking-tight">₹0</p>
            <p className="text-xs text-white/35 mt-1">Overdue</p>
            <div className="pointer-events-none absolute bottom-0 right-0 h-16 w-16 rounded-full bg-amber-500/5 blur-xl" />
          </div>
        </div>

        <div className="anim-3 section-divider" />

        {/* Occupancy Overview */}
        <div className="anim-4">
          <OccupancyOverview />
        </div>

        <div className="anim-5 section-divider" />

        {/* Tenants Table */}
        <div className="anim-6">
          <TenantsTable data={tenants || []} />
        </div>

      </div>
    </>
  )
}