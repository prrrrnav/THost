import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { IndianRupee, CalendarDays, CheckCircle2, AlertCircle, Home, Download, MessageSquare } from "lucide-react"
import { formatCurrency } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ComplaintDialog } from "@/components/complaint-dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default async function TenantDashboard() {
  const supabase = await createClient()

  // 1. Get the current logged-in user session
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // 2. Fetch the tenant's profile data
  const { data: tenant } = await supabase
    .from("tenants")
    .select("*")
    .eq("email", user.email)
    .single()

  // 3. Fetch real payments for the logged-in user
// app/tenant/page.tsx


if (!user) redirect("/login")

// ADD THIS: log what email we're querying with
console.log("🔍 Logged in as:", user.email)

const { data: dbPayments, error: paymentsError } = await supabase
  .from("payments")
  .select("id, month, amount, status, payment_date, created_at")
  .eq("tenant_email", user.email)
  .order("created_at", { ascending: false })




const { data: notifications } = await supabase
  .from("notifications")
  .select("*")
  .or(`target_tenant_email.eq.all,target_tenant_email.eq.${user.email}`)
  .order("created_at", { ascending: false })
  .limit(3);

  // 4. Map database values to UI stats
  const tenantStats = [
    {
      title: "Current Rent",
      value: formatCurrency(tenant?.rent_amount || 0),
      icon: IndianRupee,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      title: "Due Date",
      value: tenant?.due_date ? `${tenant.due_date}th of month` : "Not Set",
      icon: CalendarDays,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    {
      title: "Payment Status",
      value: tenant?.status || "Pending",
      icon: CheckCircle2,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      title: "Outstanding",
      value: tenant?.status === "Overdue" ? formatCurrency(tenant.rent_amount) : "₹0",
      icon: AlertCircle,
      color: "text-zinc-400",
      bg: "bg-zinc-500/10",
      border: "border-white/10",
    },
  ]

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center gap-5">
          <div className="relative group">
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 opacity-25 blur transition duration-500 group-hover:opacity-50"></div>
            <div className="relative flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-black shadow-2xl">
              <Home className="h-6 w-6 text-emerald-400" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-100">My Dashboard</h1>
            <p className="text-sm text-zinc-400">
              Welcome, {user.user_metadata?.full_name || "Tenant"}. Room {tenant?.room_number || "Unassigned"}.
            </p>
          </div>
        </div>
        <ComplaintDialog />
      </div>




      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-in fade-in slide-in-from-bottom-6 duration-700">
        {tenantStats.map((stat) => (
          <Card key={stat.title} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/50 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/30">
            <CardContent className="relative z-10 flex items-start justify-between p-6">
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">{stat.title}</span>
                <span className="text-3xl font-bold tracking-tight text-zinc-100">{stat.value}</span>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${stat.bg} ${stat.border}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Notice Board Section */}
<div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
  <div className="flex items-center justify-between">
    <h3 className="text-lg font-bold text-zinc-100">Notice Board</h3>
    <Badge variant="outline" className="border-emerald-500/20 text-emerald-400 bg-emerald-500/5">
      New Updates
    </Badge>
  </div>
  
  <div className="grid gap-4">
    {notifications && notifications.length > 0 ? (
      notifications.map((note) => (
        <div key={note.id} className="relative overflow-hidden rounded-2xl border border-white/5 bg-zinc-950/40 p-4 backdrop-blur-xl">
          <div className="flex items-start gap-4">
            <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
            <div className="flex flex-col gap-1">
              <h4 className="text-sm font-bold text-zinc-200">{note.title}</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">{note.message}</p>
              <span className="mt-1 text-[10px] text-zinc-600">
                {new Date(note.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      ))
    ) : (
      <div className="rounded-2xl border border-dashed border-white/5 py-8 text-center text-zinc-500 text-sm italic">
        No new updates from the owner.
      </div>
    )}
  </div>
</div>

      {/* Dynamic Payment History Table */}
      <Card className="border-white/10 bg-zinc-950/50 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-8 duration-700">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-zinc-100">Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-zinc-400">Month</TableHead>
                <TableHead className="text-zinc-400">Amount</TableHead>
                <TableHead className="text-zinc-400">Status</TableHead>
                <TableHead className="text-right text-zinc-400">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dbPayments && dbPayments.length > 0 ? (
                dbPayments.map((payment) => (
                  <TableRow key={payment.id} className="border-white/5 hover:bg-white/5 transition-colors">
                    {/* Matches "month": "February 2026" from your data */}
                    <TableCell className="font-medium text-zinc-200 py-4">
                      {payment.month}
                    </TableCell>

                    {/* Converts "12500" string to Number for the currency formatter */}
                    <TableCell className="text-zinc-300">
                      {formatCurrency(Number(payment.amount))}
                    </TableCell>

                    <TableCell>
                      <Badge className={
                        payment.status === "Paid"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }>
                        {payment.status}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      {/* Uses the "payment_date" from your data */}
                      <span className="text-[10px] text-zinc-500 mr-4">
                        {payment.payment_date}
                      </span>
                      <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-emerald-400">
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-zinc-500 italic">
                    No payment records found for {user.email}.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}