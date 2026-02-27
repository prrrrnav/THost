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

// const complaints = [
//   { id: "1", subject: "Water supply issue", date: "15th Feb 2026", status: "Resolved" },
//   { id: "2", subject: "WiFi not working", date: "28th Jan 2026", status: "Resolved" },
//   { id: "3", subject: "AC maintenance needed", date: "10th Jan 2026", status: "In Progress" },
// ]

// function statusClasses(status: string) {
//   switch (status) {
//     case "Resolved":
//       return "bg-success/10 text-success border-success/20"
//     case "In Progress":
//       return "bg-warning/10 text-warning-foreground border-warning/20"
//     default:
//       return "bg-muted text-muted-foreground border-border"
//   }
// }

// export default function TenantComplaintsPage() {
//   return (
//     <div className="flex flex-col gap-6">
//       <div>
//         <h1 className="text-xl font-semibold tracking-tight text-foreground">My Complaints</h1>
//         <p className="text-sm text-muted-foreground">Track your submitted complaints.</p>
//       </div>

//       <Card className="border border-border shadow-sm">
//         <CardHeader className="pb-3">
//           <CardTitle className="text-base font-semibold text-card-foreground">Complaint History</CardTitle>
//         </CardHeader>
//         <CardContent className="p-0">
//           <Table>
//             <TableHeader>
//               <TableRow className="hover:bg-transparent">
//                 <TableHead className="pl-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Subject</TableHead>
//                 <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</TableHead>
//                 <TableHead className="pr-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {complaints.map((c) => (
//                 <TableRow key={c.id}>
//                   <TableCell className="pl-6 text-sm font-medium text-foreground">{c.subject}</TableCell>
//                   <TableCell className="text-sm text-muted-foreground">{c.date}</TableCell>
//                   <TableCell className="pr-6">
//                     <Badge variant="secondary" className={statusClasses(c.status)}>
//                       {c.status}
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
import { MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"

const complaints = [
  { id: "1", subject: "Water supply issue", date: "15th Feb 2026", status: "Resolved" },
  { id: "2", subject: "WiFi not working", date: "28th Jan 2026", status: "Resolved" },
  { id: "3", subject: "AC maintenance needed", date: "10th Jan 2026", status: "In Progress" },
]

// Updated to use glowing, dark-mode friendly jewel tones
function statusClasses(status: string) {
  switch (status) {
    case "Resolved":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400 shadow-[0_0_10px_-3px_rgba(16,185,129,0.3)]"
    case "In Progress":
      return "border-amber-500/20 bg-amber-500/10 text-amber-400 shadow-[0_0_10px_-3px_rgba(245,158,11,0.3)]"
    default:
      return "border-zinc-500/20 bg-zinc-500/10 text-zinc-400"
  }
}

export default function TenantComplaintsPage() {
  return (
    <div className="flex flex-col gap-8 pb-10">
      
      {/* Page Header */}
      <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center gap-5">
          {/* Aceternity style glowing icon - Emerald Theme */}
          <div className="relative group">
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 opacity-25 blur transition duration-500 group-hover:opacity-50"></div>
            <div className="relative flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-black shadow-2xl">
              <MessageSquare className="h-6 w-6 text-emerald-400" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-100">My Complaints</h1>
            <p className="text-sm text-zinc-400">
              Track and monitor the status of your submitted issues.
            </p>
          </div>
        </div>
      </div>

      {/* Glassmorphic Table Container */}
      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
        <Card className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/50 backdrop-blur-xl shadow-2xl">
          {/* Subtle Aceternity Top Glow - Emerald */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
          
          <CardHeader className="border-b border-white/5 pb-4">
            <CardTitle className="text-lg font-bold tracking-tight text-zinc-100">
              Complaint History
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-black/20">
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="pl-6 h-11 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Subject</TableHead>
                  <TableHead className="h-11 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Date</TableHead>
                  <TableHead className="pr-6 h-11 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {complaints.length === 0 ? (
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableCell colSpan={3} className="py-12 text-center text-zinc-500">No complaints found.</TableCell>
                  </TableRow>
                ) : (
                  complaints.map((c) => (
                    <TableRow key={c.id} className="border-white/5 transition-colors hover:bg-white/[0.02]">
                      <TableCell className="pl-6 font-medium text-zinc-200">
                        {c.subject}
                      </TableCell>
                      <TableCell className="text-zinc-400">
                        {c.date}
                      </TableCell>
                      <TableCell className="pr-6">
                        <Badge 
                          variant="secondary" 
                          className={cn("px-2 py-0.5 text-[10px] font-bold tracking-wide transition-all", statusClasses(c.status))}
                        >
                          {c.status}
                        </Badge>
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