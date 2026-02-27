// import { Building2, Users, IndianRupee, CreditCard } from "lucide-react"
// import { StatCard } from "@/components/stat-card"
// import { pgOwners, formatCurrency } from "@/lib/data"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"

// function planClasses(plan: string) {
//   switch (plan) {
//     case "Enterprise":
//       return "bg-primary/10 text-primary border-primary/20 hover:bg-primary/15"
//     case "Pro":
//       return "bg-success/10 text-success border-success/20 hover:bg-success/15"
//     default:
//       return "bg-muted text-muted-foreground border-border hover:bg-muted"
//   }
// }

// function statusClasses(status: string) {
//   return status === "Active"
//     ? "bg-success/10 text-success border-success/20 hover:bg-success/15"
//     : "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/15"
// }

// export default function SuperAdminDashboard() {
//   return (
//     <div className="flex flex-col gap-6">
//       <div>
//         <h1 className="text-xl font-semibold tracking-tight text-foreground">Platform Overview</h1>
//         <p className="text-sm text-muted-foreground">Manage all PG owners and platform metrics.</p>
//       </div>

//       {/* Stat Cards */}
//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
//         <StatCard
//           title="Total PG Owners"
//           value="6"
//           subtitle="vs last month"
//           change="+2 new"
//           changeType="positive"
//           icon={Building2}
//           iconColor="text-primary"
//           iconBg="bg-primary/10"
//         />
//         <StatCard
//           title="Total Tenants"
//           value="196"
//           subtitle="across all PGs"
//           change="+15.3%"
//           changeType="positive"
//           icon={Users}
//           iconColor="text-success"
//           iconBg="bg-success/10"
//         />
//         <StatCard
//           title="Platform Revenue"
//           value="₹2,06,150"
//           subtitle="this month"
//           change="+22.4%"
//           changeType="positive"
//           icon={IndianRupee}
//           iconColor="text-primary"
//           iconBg="bg-primary/10"
//         />
//         <StatCard
//           title="Active Subscriptions"
//           value="5"
//           subtitle="1 suspended"
//           change="83% active"
//           changeType="neutral"
//           icon={CreditCard}
//           iconColor="text-warning"
//           iconBg="bg-warning/10"
//         />
//       </div>

//       {/* PG Owners Table */}
//       <Card className="border border-border shadow-sm">
//         <CardHeader className="pb-3">
//           <CardTitle className="text-base font-semibold text-card-foreground">PG Owners</CardTitle>
//         </CardHeader>
//         <CardContent className="p-0">
//           <Table>
//             <TableHeader>
//               <TableRow className="hover:bg-transparent">
//                 <TableHead className="pl-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">PG Owner</TableHead>
//                 <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">City</TableHead>
//                 <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tenants</TableHead>
//                 <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Revenue</TableHead>
//                 <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Plan</TableHead>
//                 <TableHead className="pr-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {pgOwners.map((owner) => (
//                 <TableRow key={owner.id}>
//                   <TableCell className="pl-6 text-sm font-medium text-foreground">{owner.name}</TableCell>
//                   <TableCell className="text-sm text-muted-foreground">{owner.city}</TableCell>
//                   <TableCell className="text-sm text-foreground font-medium">{owner.totalTenants}</TableCell>
//                   <TableCell className="text-sm text-foreground font-medium hidden md:table-cell">{formatCurrency(owner.monthlyRevenue)}</TableCell>
//                   <TableCell>
//                     <Badge variant="secondary" className={planClasses(owner.plan)}>
//                       {owner.plan}
//                     </Badge>
//                   </TableCell>
//                   <TableCell className="pr-6">
//                     <Badge variant="secondary" className={statusClasses(owner.status)}>
//                       {owner.status}
//                     </Badge>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }



"use client"

import { Building2, Users, IndianRupee, CreditCard, ShieldCheck } from "lucide-react"
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
import { cn } from "@/lib/utils"

// Glowing dark-mode badge styles for subscription plans
function planClasses(plan: string) {
  switch (plan) {
    case "Enterprise":
      return "border-violet-500/20 bg-violet-500/10 text-violet-400 shadow-[0_0_10px_-3px_rgba(139,92,246,0.3)]"
    case "Pro":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400 shadow-[0_0_10px_-3px_rgba(16,185,129,0.3)]"
    default:
      return "border-zinc-500/20 bg-zinc-500/10 text-zinc-400"
  }
}

// Glowing dark-mode badge styles for account status
function statusClasses(status: string) {
  return status === "Active"
    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400 shadow-[0_0_10px_-3px_rgba(16,185,129,0.3)]"
    : "border-rose-500/20 bg-rose-500/10 text-rose-400 shadow-[0_0_10px_-3px_rgba(244,63,94,0.3)]"
}

export default function SuperAdminDashboard() {
  return (
    <div className="flex flex-col gap-8 pb-10">
      
      {/* Page Header */}
      <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center gap-5">
          {/* Aceternity style glowing icon - Amber Theme */}
          <div className="relative group">
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 opacity-25 blur transition duration-500 group-hover:opacity-50"></div>
            <div className="relative flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-black shadow-2xl">
              <ShieldCheck className="h-6 w-6 text-amber-400" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Platform Overview</h1>
            <p className="text-sm text-zinc-400">
              Manage all PG owners, platform metrics, and system health.
            </p>
          </div>
        </div>
      </div>

      {/* Stat Cards - Spotlight Style with assorted colors for distinction */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
        <StatCard
          title="Total PG Owners"
          value="6"
          subtitle="vs last month"
          change="+2 new"
          changeType="positive"
          icon={Building2}
          iconColor="text-amber-400"
          iconBg="bg-amber-500/10"
        />
        <StatCard
          title="Total Tenants"
          value="196"
          subtitle="across all PGs"
          change="+15.3%"
          changeType="positive"
          icon={Users}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10"
        />
        <StatCard
          title="Platform Revenue"
          value="₹2,06,150"
          subtitle="this month"
          change="+22.4%"
          changeType="positive"
          icon={IndianRupee}
          iconColor="text-violet-400"
          iconBg="bg-violet-500/10"
        />
        <StatCard
          title="Active Subscriptions"
          value="5"
          subtitle="1 suspended"
          change="83% active"
          changeType="neutral"
          icon={CreditCard}
          iconColor="text-orange-400"
          iconBg="bg-orange-500/10"
        />
      </div>

      {/* Glassmorphic Table Container */}
      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
        <Card className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/50 backdrop-blur-xl shadow-2xl">
          {/* Subtle Aceternity Top Glow - Amber Theme */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
          
          <CardHeader className="border-b border-white/5 pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-bold tracking-tight text-zinc-100">
              PG Owners Directory
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500"></span>
              </span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-black/20">
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="pl-6 h-11 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">PG Owner</TableHead>
                  <TableHead className="h-11 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">City</TableHead>
                  <TableHead className="h-11 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Tenants</TableHead>
                  <TableHead className="hidden md:table-cell h-11 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Revenue</TableHead>
                  <TableHead className="h-11 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Plan</TableHead>
                  <TableHead className="pr-6 h-11 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pgOwners.map((owner) => (
                  <TableRow key={owner.id} className="border-white/5 transition-colors hover:bg-white/[0.02]">
                    <TableCell className="pl-6 font-medium text-zinc-200">{owner.name}</TableCell>
                    <TableCell className="text-zinc-400">{owner.city}</TableCell>
                    <TableCell className="font-medium text-zinc-300">{owner.totalTenants}</TableCell>
                    <TableCell className="hidden md:table-cell font-medium text-zinc-300">{formatCurrency(owner.monthlyRevenue)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={cn("px-2 py-0.5 text-[10px] font-bold tracking-wide transition-all", planClasses(owner.plan))}>
                        {owner.plan}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-6">
                      <Badge variant="secondary" className={cn("px-2 py-0.5 text-[10px] font-bold tracking-wide transition-all", statusClasses(owner.status))}>
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

    </div>
  )
}