import { IndianRupee, TrendingDown, TrendingUp, AlertTriangle } from "lucide-react"
import { StatCard } from "@/components/stat-card"
import { OccupancyOverview } from "@/components/occupancy-overview"
import { TenantsTable } from "@/components/tenants-table"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { AddTenantDialog } from "@/components/add-tenant-dialog"
import { createClient } from "@/lib/supabase/server"
import { calculateMonthlyProfit } from "@/app/actions/finance"

export default async function AdminDashboard() {
  // 1. Initialize Supabase Server Client
  const supabase = await createClient()
  
  // 2. Fetch real data from your tables
  const { data: tenants } = await supabase
    .from("tenants")
    .select("*")
    .order("created_at", { ascending: false })

  const stats = await calculateMonthlyProfit()

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Welcome back. Here is your PG overview.
            </p>
          </div>
          {/* Your new Add Tenant Button */}
          <AddTenantDialog />
        </div>
        
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-2.5 mt-3 md:mt-0">
          <div className="flex flex-col">
            <Label className="text-sm font-medium text-card-foreground">
              Automatic Rent Reminder
            </Label>
            <span className="text-[11px] text-muted-foreground leading-tight">
              Reminders sent on the 1st of every month.
            </span>
          </div>
          <Switch id="reminder-toggle" defaultChecked />
        </div>
      </div>

      {/* Stat Cards with LIVE DATA */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={`₹${stats.revenue.toLocaleString()}`}
          subtitle="This month"
          icon={IndianRupee}
          iconColor="text-primary"
          iconBg="bg-primary/10"
        />
        <StatCard
          title="Total Expenses"
          value={`₹${stats.expenses.toLocaleString()}`}
          subtitle="Bills & Salaries"
          icon={TrendingDown}
          iconColor="text-destructive"
          iconBg="bg-destructive/10"
        />
        <StatCard
          title="Net Profit"
          value={`₹${stats.profit.toLocaleString()}`}
          subtitle="Net Earnings"
          icon={TrendingUp}
          iconColor="text-success"
          iconBg="bg-success/10"
        />
        <StatCard
          title="Overdue"
          value="₹0" 
          subtitle="Needs attention"
          icon={AlertTriangle}
          iconColor="text-warning"
          iconBg="bg-warning/10"
        />
      </div>

      <OccupancyOverview />

      {/* Pass real DB tenants to your table */}
      <TenantsTable data={tenants || []} />
    </div>
  )
}