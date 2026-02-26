import { Building2, Users, IndianRupee, CreditCard } from "lucide-react"
import { StatCard } from "@/components/stat-card"
import { pgOwners, formatCurrency } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

function planClasses(plan: string) {
  switch (plan) {
    case "Enterprise":
      return "bg-primary/10 text-primary border-primary/20 hover:bg-primary/15"
    case "Pro":
      return "bg-success/10 text-success border-success/20 hover:bg-success/15"
    default:
      return "bg-muted text-muted-foreground border-border hover:bg-muted"
  }
}

function statusClasses(status: string) {
  return status === "Active"
    ? "bg-success/10 text-success border-success/20 hover:bg-success/15"
    : "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/15"
}

export default function SuperAdminDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Platform Overview</h1>
        <p className="text-sm text-muted-foreground">Manage all PG owners and platform metrics.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total PG Owners"
          value="6"
          subtitle="vs last month"
          change="+2 new"
          changeType="positive"
          icon={Building2}
          iconColor="text-primary"
          iconBg="bg-primary/10"
        />
        <StatCard
          title="Total Tenants"
          value="196"
          subtitle="across all PGs"
          change="+15.3%"
          changeType="positive"
          icon={Users}
          iconColor="text-success"
          iconBg="bg-success/10"
        />
        <StatCard
          title="Platform Revenue"
          value="₹2,06,150"
          subtitle="this month"
          change="+22.4%"
          changeType="positive"
          icon={IndianRupee}
          iconColor="text-primary"
          iconBg="bg-primary/10"
        />
        <StatCard
          title="Active Subscriptions"
          value="5"
          subtitle="1 suspended"
          change="83% active"
          changeType="neutral"
          icon={CreditCard}
          iconColor="text-warning"
          iconBg="bg-warning/10"
        />
      </div>

      {/* PG Owners Table */}
      <Card className="border border-border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-card-foreground">PG Owners</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">PG Owner</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">City</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tenants</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Revenue</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Plan</TableHead>
                <TableHead className="pr-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pgOwners.map((owner) => (
                <TableRow key={owner.id}>
                  <TableCell className="pl-6 text-sm font-medium text-foreground">{owner.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{owner.city}</TableCell>
                  <TableCell className="text-sm text-foreground font-medium">{owner.totalTenants}</TableCell>
                  <TableCell className="text-sm text-foreground font-medium hidden md:table-cell">{formatCurrency(owner.monthlyRevenue)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={planClasses(owner.plan)}>
                      {owner.plan}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-6">
                    <Badge variant="secondary" className={statusClasses(owner.status)}>
                      {owner.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
