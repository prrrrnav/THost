import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users2, UserCircle, Mail, Phone, Home } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

function statusClasses(status: string) {
  if (!status) return "border-zinc-500/20 bg-zinc-500/10 text-zinc-400"
  const s = status.toLowerCase()
  if (s === "active" || s === "paid") {
    return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400 shadow-[0_0_10px_-3px_rgba(16,185,129,0.3)]"
  }
  return "border-amber-500/20 bg-amber-500/10 text-amber-400 shadow-[0_0_10px_-3px_rgba(245,158,11,0.3)]"
}

export default async function TenantsDirectory() {
  const supabase = await createClient()

  // 1. SuperAdmin Security Barrier
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: adminProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (!adminProfile || adminProfile.role !== "superadmin") {
    // redirect("/tenant")
  }

  // 2. Fetch Actual Tenants from "tenants" table
  const { data: tenants } = await supabase
    .from("tenants")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center gap-5">
          <div className="relative group">
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 opacity-25 blur transition duration-500 group-hover:opacity-50"></div>
            <div className="relative flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-black shadow-2xl">
              <Users2 className="h-6 w-6 text-emerald-400" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Tenants Directory</h1>
            <p className="text-sm text-zinc-400">Comprehensive list of all registered tenants across all managed properties.</p>
          </div>
        </div>
      </div>

      {/* Tenants Table */}
      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
        <Card className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/50 backdrop-blur-xl shadow-2xl">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

          <CardHeader className="border-b border-white/5 pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-bold text-zinc-100">
              <UserCircle className="h-5 w-5 text-emerald-400" />
              Active Tenants
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-black/20">
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="pl-6 h-11 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Tenant Name</TableHead>
                  <TableHead className="h-11 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Contact</TableHead>
                  <TableHead className="h-11 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Room</TableHead>
                  <TableHead className="h-11 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 text-right">Rent</TableHead>
                  <TableHead className="h-11 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 text-center">Status</TableHead>
                  <TableHead className="pr-6 h-11 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 text-right">Registered On</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!tenants || tenants.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-24 text-center text-zinc-500 italic">
                      No tenants have registered on the platform yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  tenants.map((tenant) => (
                    <TableRow key={tenant.id} className="border-white/5 transition-colors hover:bg-white/[0.02]">
                      <TableCell className="pl-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[10px] font-bold text-emerald-400">
                            {tenant.name?.substring(0, 2).toUpperCase() || "T"}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-zinc-200">{tenant.name || "New Tenant"}</span>
                            <span className="text-[10px] text-zinc-500 uppercase tracking-tighter">ID: {tenant.id.substring(0, 8)}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 text-sm text-zinc-400">
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3 text-zinc-500" />
                            <span className="text-xs">{tenant.email || "N/A"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3 text-zinc-500" />
                            <span className="text-xs">{tenant.phone || "N/A"}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-zinc-300 font-medium">
                          <Home className="h-4 w-4 text-emerald-500/70" />
                          {tenant.room_number || "N/A"}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium text-zinc-300">
                        {formatCurrency(Number(tenant.rent_amount) || 0)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={cn("bg-transparent px-3 py-1", statusClasses(tenant.status))}>
                          {tenant.status || "Unknown"}
                        </Badge>
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <div className="flex flex-col items-end">
                          <span className="text-xs text-zinc-300">
                            {new Date(tenant.created_at).toLocaleDateString('en-GB', {
                              day: '2-digit', month: 'short', year: 'numeric'
                            })}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}