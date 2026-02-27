// "use client"

// import { useState } from "react"
// import { IndianRupee, CalendarDays, CheckCircle2, AlertCircle, Download, MessageSquare } from "lucide-react"
// import { paymentHistory, formatCurrency } from "@/lib/data"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Textarea } from "@/components/ui/textarea"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"

// const tenantStats = [
//   {
//     title: "Current Rent",
//     value: "₹9,500",
//     icon: IndianRupee,
//     color: "text-primary",
//     bg: "bg-primary/10",
//   },
//   {
//     title: "Due Date",
//     value: "1st Mar 2026",
//     icon: CalendarDays,
//     color: "text-warning",
//     bg: "bg-warning/10",
//   },
//   {
//     title: "Payment Status",
//     value: "Paid",
//     icon: CheckCircle2,
//     color: "text-success",
//     bg: "bg-success/10",
//   },
//   {
//     title: "Outstanding",
//     value: "₹0",
//     icon: AlertCircle,
//     color: "text-muted-foreground",
//     bg: "bg-muted",
//   },
// ]

// export default function TenantDashboard() {
//   const [complaintOpen, setComplaintOpen] = useState(false)

//   return (
//     <div className="flex flex-col gap-6">
//       {/* Header */}
//       <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
//         <div>
//           <h1 className="text-xl font-semibold tracking-tight text-foreground">My Dashboard</h1>
//           <p className="text-sm text-muted-foreground">
//             Welcome, Rahul. Room A-101.
//           </p>
//         </div>
//         <Dialog open={complaintOpen} onOpenChange={setComplaintOpen}>
//           <DialogTrigger asChild>
//             <Button variant="outline" className="mt-3 gap-2 md:mt-0">
//               <MessageSquare className="h-4 w-4" />
//               Raise Complaint
//             </Button>
//           </DialogTrigger>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Raise a Complaint</DialogTitle>
//               <DialogDescription>
//                 Describe your issue and we will get back to you shortly.
//               </DialogDescription>
//             </DialogHeader>
//             <form className="flex flex-col gap-4 pt-2">
//               <div className="flex flex-col gap-1.5">
//                 <Label htmlFor="subject" className="text-sm font-medium">Subject</Label>
//                 <Input id="subject" placeholder="e.g. Water supply issue" className="h-9" />
//               </div>
//               <div className="flex flex-col gap-1.5">
//                 <Label htmlFor="description" className="text-sm font-medium">Description</Label>
//                 <Textarea id="description" placeholder="Describe the issue in detail..." rows={4} />
//               </div>
//               <Button type="button" onClick={() => setComplaintOpen(false)}>
//                 Submit Complaint
//               </Button>
//             </form>
//           </DialogContent>
//         </Dialog>
//       </div>

//       {/* Stat Cards */}
//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
//         {tenantStats.map((stat) => (
//           <Card key={stat.title} className="border border-border shadow-sm">
//             <CardContent className="flex items-center gap-4 p-5">
//               <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}>
//                 <stat.icon className={`h-5 w-5 ${stat.color}`} />
//               </div>
//               <div className="flex flex-col">
//                 <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
//                   {stat.title}
//                 </span>
//                 <span className="text-lg font-bold text-card-foreground">{stat.value}</span>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {/* Payment History */}
//       <Card className="border border-border shadow-sm">
//         <CardHeader className="pb-3">
//           <CardTitle className="text-base font-semibold text-card-foreground">
//             Payment History
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="p-0">
//           <Table>
//             <TableHeader>
//               <TableRow className="hover:bg-transparent">
//                 <TableHead className="pl-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Month</TableHead>
//                 <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Amount</TableHead>
//                 <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</TableHead>
//                 <TableHead className="pr-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">Receipt</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {paymentHistory.map((record) => (
//                 <TableRow key={record.id}>
//                   <TableCell className="pl-6 text-sm font-medium text-foreground">{record.month}</TableCell>
//                   <TableCell className="text-sm text-foreground font-medium">{formatCurrency(record.amount)}</TableCell>
//                   <TableCell>
//                     <Badge
//                       variant="secondary"
//                       className="bg-success/10 text-success border-success/20"
//                     >
//                       {record.status}
//                     </Badge>
//                   </TableCell>
//                   <TableCell className="pr-6 text-right">
//                     <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground">
//                       <Download className="h-3.5 w-3.5" />
//                       Download
//                     </Button>
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

import { useState } from "react"
import { IndianRupee, CalendarDays, CheckCircle2, AlertCircle, Download, MessageSquare, Home } from "lucide-react"
import { paymentHistory, formatCurrency } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const tenantStats = [
  {
    title: "Current Rent",
    value: "₹9,500",
    icon: IndianRupee,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    title: "Due Date",
    value: "1st Mar 2026",
    icon: CalendarDays,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  {
    title: "Payment Status",
    value: "Paid",
    icon: CheckCircle2,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    title: "Outstanding",
    value: "₹0",
    icon: AlertCircle,
    color: "text-zinc-400",
    bg: "bg-zinc-500/10",
    border: "border-white/10",
  },
]

export default function TenantDashboard() {
  const [complaintOpen, setComplaintOpen] = useState(false)

  return (
    <div className="flex flex-col gap-8 pb-10">
      
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center gap-5">
          {/* Aceternity style glowing icon - Emerald Theme */}
          <div className="relative group">
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 opacity-25 blur transition duration-500 group-hover:opacity-50"></div>
            <div className="relative flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-black shadow-2xl">
              <Home className="h-6 w-6 text-emerald-400" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-100">My Dashboard</h1>
            <p className="text-sm text-zinc-400">
              Welcome, Rahul. Room A-101.
            </p>
          </div>
        </div>

        {/* Raise Complaint Dialog */}
        <Dialog open={complaintOpen} onOpenChange={setComplaintOpen}>
          <DialogTrigger asChild>
            <Button className="group relative h-10 overflow-hidden rounded-full border border-white/10 bg-zinc-950 px-6 transition-all duration-300 hover:border-emerald-500/50 hover:bg-zinc-900 hover:shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)] md:mt-0">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-teal-600/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <MessageSquare className="relative z-10 mr-2 h-4 w-4 text-emerald-400 transition-transform duration-300 group-hover:scale-110" />
              <span className="relative z-10 font-medium text-zinc-300 group-hover:text-zinc-100">
                Raise Complaint
              </span>
            </Button>
          </DialogTrigger>
          
          {/* Aceternity Style Glassmorphic Dialog */}
          <DialogContent className="sm:max-w-[425px] border-white/10 bg-zinc-950/80 p-6 backdrop-blur-2xl shadow-[0_0_50px_-12px_rgba(16,185,129,0.25)]">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
            <DialogHeader className="mb-2">
              <DialogTitle className="text-xl font-bold tracking-tight text-zinc-100">Raise a Complaint</DialogTitle>
              <DialogDescription className="text-sm text-zinc-400">
                Describe your issue and we will get back to you shortly.
              </DialogDescription>
            </DialogHeader>
            <form className="flex flex-col gap-5 pt-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="subject" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Subject</Label>
                <Input 
                  id="subject" 
                  placeholder="e.g. Water supply issue" 
                  className="h-10 border-white/10 bg-zinc-900/50 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-emerald-500/50" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="description" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe the issue in detail..." 
                  rows={4} 
                  className="resize-none border-white/10 bg-zinc-900/50 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-emerald-500/50" 
                />
              </div>
              <Button 
                type="button" 
                onClick={() => setComplaintOpen(false)}
                className="group relative mt-2 h-11 w-full overflow-hidden rounded-xl bg-emerald-600 text-white transition-all hover:bg-emerald-500 hover:shadow-[0_0_20px_-5px_rgba(16,185,129,0.5)]"
              >
                <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
                  <div className="relative h-full w-8 bg-white/20" />
                </div>
                <span className="relative z-10 font-bold tracking-wide">Submit Complaint</span>
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stat Cards - Spotlight Style */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
        {tenantStats.map((stat) => (
          <Card key={stat.title} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/50 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/30 hover:shadow-[0_8px_30px_-12px_rgba(16,185,129,0.3)]">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <CardContent className="relative z-10 flex items-start justify-between p-6">
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  {stat.title}
                </span>
                <span className="text-3xl font-bold tracking-tight text-zinc-100 drop-shadow-sm">
                  {stat.value}
                </span>
              </div>
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${stat.bg} ${stat.border} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payment History Table */}
      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
        <Card className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/50 backdrop-blur-xl shadow-2xl">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
          
          <CardHeader className="border-b border-white/5 pb-4">
            <CardTitle className="text-lg font-bold tracking-tight text-zinc-100">
              Payment History
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-black/20">
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="pl-6 h-11 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Month</TableHead>
                  <TableHead className="h-11 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Amount</TableHead>
                  <TableHead className="h-11 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Status</TableHead>
                  <TableHead className="pr-6 h-11 text-right text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Receipt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentHistory.map((record) => (
                  <TableRow key={record.id} className="border-white/5 transition-colors hover:bg-white/[0.02]">
                    <TableCell className="pl-6 font-medium text-zinc-200">{record.month}</TableCell>
                    <TableCell className="font-medium text-zinc-300">{formatCurrency(record.amount)}</TableCell>
                    <TableCell>
                      {/* Hardcoded paid badge styled with glowing Emerald */}
                      <Badge className="border-emerald-500/20 bg-emerald-500/10 text-emerald-400 px-2 py-0.5 text-[10px] font-bold tracking-wide shadow-[0_0_10px_-3px_rgba(16,185,129,0.3)]">
                        {record.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <Button variant="ghost" size="sm" className="h-8 gap-2 text-xs text-zinc-400 hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors">
                        <Download className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Download</span>
                      </Button>
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