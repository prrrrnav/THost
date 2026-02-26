"use client"

import { useState } from "react"
import { IndianRupee, TrendingDown, TrendingUp, AlertTriangle } from "lucide-react"
import { StatCard } from "@/components/stat-card"
import { OccupancyOverview } from "@/components/occupancy-overview"
import { TenantsTable } from "@/components/tenants-table"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { AddTenantDialog } from "@/components/add-tenant-dialog"

export default function AdminDashboard() {
  const [reminderEnabled, setReminderEnabled] = useState(true)

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back, Rajesh. Here is your PG overview.
          </p>
        </div>

        <AddTenantDialog />

        <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-2.5 mt-3 md:mt-0">
          <div className="flex flex-col">
            <Label htmlFor="reminder-toggle" className="text-sm font-medium text-card-foreground cursor-pointer">
              Automatic Rent Reminder
            </Label>
            <span className="text-[11px] text-muted-foreground leading-tight">
              Reminders sent on the 1st of every month.
            </span>
          </div>
          <Switch
            id="reminder-toggle"
            checked={reminderEnabled}
            onCheckedChange={setReminderEnabled}
          />
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value="₹1,13,500"
          subtitle="vs last month"
          change="+12.5%"
          changeType="positive"
          icon={IndianRupee}
          iconColor="text-primary"
          iconBg="bg-primary/10"
        />
        <StatCard
          title="Total Expenses"
          value="₹34,200"
          subtitle="vs last month"
          change="+4.2%"
          changeType="negative"
          icon={TrendingDown}
          iconColor="text-destructive"
          iconBg="bg-destructive/10"
        />
        <StatCard
          title="Net Profit"
          value="₹79,300"
          subtitle="vs last month"
          change="+18.1%"
          changeType="positive"
          icon={TrendingUp}
          iconColor="text-success"
          iconBg="bg-success/10"
        />
        <StatCard
          title="Overdue"
          value="₹23,000"
          subtitle="2 tenants"
          change="Needs attention"
          changeType="neutral"
          icon={AlertTriangle}
          iconColor="text-warning"
          iconBg="bg-warning/10"
        />
      </div>

      {/* Occupancy */}
      <OccupancyOverview />

      {/* Tenants Table */}
      <TenantsTable />
    </div>
  )
}
