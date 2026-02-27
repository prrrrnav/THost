// "use client"

// import { useState, useMemo } from "react"
// import { formatCurrency, type TenantStatus } from "@/lib/data" 
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { EditTenantDialog } from "@/components/edit-tenant-dialog"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"
// import { Search, Eye, ChevronLeft, ChevronRight, Trash2, Loader2 } from "lucide-react"
// import { deleteTenant } from "@/app/actions/tenants"
// import { useToast } from "@/hooks/use-toast"

// const PAGE_SIZE = 5

// function statusVariant(status: string) {
//   switch (status) {
//     case "Paid": return "default" as const
//     case "Pending": return "secondary" as const
//     case "Overdue": return "destructive" as const
//     default: return "secondary" as const
//   }
// }

// function statusClasses(status: string) {
//   switch (status) {
//     case "Paid": return "bg-success/10 text-success border-success/20 hover:bg-success/15"
//     case "Pending": return "bg-warning/10 text-warning-foreground border-warning/20 hover:bg-warning/15"
//     case "Overdue": return "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/15"
//     default: return "bg-slate-100 text-slate-700"
//   }
// }

// // --- ADDED DATA AS A PROP ---
// export function TenantsTable({ data }: { data: any[] }) {
//   const [search, setSearch] = useState("")
//   const [filter, setFilter] = useState<"All" | TenantStatus>("All")
//   const [page, setPage] = useState(1)
//   const [deletingId, setDeletingId] = useState<string | null>(null)
//   const { toast } = useToast()

//   // Filter logic using real Supabase field names
//   const filtered = useMemo(() => {
//     return data.filter((t) => {
//       const matchesSearch =
//         t.name.toLowerCase().includes(search.toLowerCase()) ||
//         (t.room_number || "").toLowerCase().includes(search.toLowerCase())
//       const currentStatus = t.status || "Pending"
//       const matchesFilter = filter === "All" || currentStatus === filter
//       return matchesSearch && matchesFilter
//     })
//   }, [search, filter, data])

//   const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
//   const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

//   // --- DELETE HANDLER ---
//   const handleDelete = async (id: string) => {
//     if (!confirm("Are you sure you want to delete this tenant?")) return
    
//     setDeletingId(id)
//     try {
//       await deleteTenant(id)
//       toast({ title: "Success", description: "Tenant removed successfully" })
//     } catch (error) {
//       toast({ variant: "destructive", title: "Error", description: "Failed to delete tenant" })
//     } finally {
//       setDeletingId(null)
//     }
//   }

//   return (
//     <Card className="border border-border shadow-sm">
//       <CardHeader className="flex flex-col gap-4 pb-3 md:flex-row md:items-center md:justify-between">
//         <CardTitle className="text-base font-semibold text-card-foreground">Tenants</CardTitle>
//         <div className="flex items-center gap-3">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
//             <Input
//               placeholder="Search name or room..."
//               value={search}
//               onChange={(e) => { setSearch(e.target.value); setPage(1) }}
//               className="h-8 w-48 pl-8 text-sm"
//             />
//           </div>
//           <Select value={filter} onValueChange={(v) => { setFilter(v as any); setPage(1) }}>
//             <SelectTrigger className="h-8 w-28 text-sm"><SelectValue /></SelectTrigger>
//             <SelectContent>
//               <SelectItem value="All">All</SelectItem>
//               <SelectItem value="Paid">Paid</SelectItem>
//               <SelectItem value="Pending">Pending</SelectItem>
//               <SelectItem value="Overdue">Overdue</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </CardHeader>
//       <CardContent className="p-0">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead className="pl-6">Tenant Name</TableHead>
//               <TableHead>Room</TableHead>
//               <TableHead className="hidden md:table-cell">Phone</TableHead>
//               <TableHead>Rent</TableHead>
//               <TableHead className="hidden lg:table-cell">Due Date</TableHead>
//               <TableHead>Status</TableHead>
//               <TableHead className="pr-6 text-right">Action</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {paged.length === 0 ? (
//               <TableRow><TableCell colSpan={7} className="py-10 text-center">No tenants found.</TableCell></TableRow>
//             ) : (
//               paged.map((tenant) => (
//                 <TableRow key={tenant.id}>
//                   <TableCell className="pl-6 font-medium">{tenant.name}</TableCell>
//                   <TableCell>{tenant.room_number || "N/A"}</TableCell>
//                   <TableCell className="hidden md:table-cell">{tenant.phone}</TableCell>
//                   <TableCell>{formatCurrency(tenant.rent_amount || 0)}</TableCell>
//                   <TableCell className="hidden lg:table-cell">{tenant.due_date || "-"}</TableCell>
//                   <TableCell>
//                     <Badge variant={statusVariant(tenant.status || "Pending")} className={statusClasses(tenant.status || "Pending")}>
//                       {tenant.status || "Pending"}
//                     </Badge>
//                   </TableCell>
//                   <TableCell className="pr-6 text-right flex justify-end gap-1">
//                     <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-3.5 w-3.5" /></Button>
                    
//                     <EditTenantDialog tenant={tenant} />

//                     {/* --- DELETE BUTTON --- */}
//                     <Button 
//                       variant="ghost" 
//                       size="icon" 
//                       className="h-7 w-7 text-destructive hover:bg-destructive/10"
//                       onClick={() => handleDelete(tenant.id)}
//                       disabled={deletingId === tenant.id}
//                     >
//                       {deletingId === tenant.id ? <Loader2 className="animate-spin h-3.5 w-3.5" /> : <Trash2 className="h-3.5 w-3.5" />}
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
        
//         {/* Pagination logic remains identical but uses data length */}
//         {totalPages > 1 && (
//           <div className="flex items-center justify-between border-t border-border px-6 py-3">
//              <span className="text-xs text-muted-foreground">Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</span>
//              <div className="flex items-center gap-1">
//                <Button variant="ghost" size="icon" className="h-7 w-7" disabled={page === 1} onClick={() => setPage((p) => p - 1)}><ChevronLeft className="h-3.5 w-3.5" /></Button>
//                <span className="text-xs font-medium px-2">{page} / {totalPages}</span>
//                <Button variant="ghost" size="icon" className="h-7 w-7" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}><ChevronRight className="h-3.5 w-3.5" /></Button>
//              </div>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   )
// }




"use client"

import { useState, useMemo } from "react"
import { formatCurrency, type TenantStatus } from "@/lib/data" 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EditTenantDialog } from "@/components/edit-tenant-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Search, Eye, ChevronLeft, ChevronRight, Trash2, Loader2, Users } from "lucide-react"
import { deleteTenant } from "@/app/actions/tenants"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

const PAGE_SIZE = 5

function statusVariant(status: string) {
  switch (status) {
    case "Paid": return "default" as const
    case "Pending": return "secondary" as const
    case "Overdue": return "destructive" as const
    default: return "secondary" as const
  }
}

// Updated with deep dark theme jewel tones and subtle glows
function statusClasses(status: string) {
  switch (status) {
    case "Paid": return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400 shadow-[0_0_10px_-3px_rgba(16,185,129,0.3)]"
    case "Pending": return "border-amber-500/20 bg-amber-500/10 text-amber-400 shadow-[0_0_10px_-3px_rgba(245,158,11,0.3)]"
    case "Overdue": return "border-rose-500/20 bg-rose-500/10 text-rose-400 shadow-[0_0_10px_-3px_rgba(244,63,94,0.3)]"
    default: return "border-zinc-500/20 bg-zinc-500/10 text-zinc-400"
  }
}

export function TenantsTable({ data }: { data: any[] }) {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"All" | TenantStatus>("All")
  const [page, setPage] = useState(1)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const { toast } = useToast()

  // Filter logic
  const filtered = useMemo(() => {
    return data.filter((t) => {
      const matchesSearch =
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        (t.room_number || "").toLowerCase().includes(search.toLowerCase())
      const currentStatus = t.status || "Pending"
      const matchesFilter = filter === "All" || currentStatus === filter
      return matchesSearch && matchesFilter
    })
  }, [search, filter, data])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // --- DELETE HANDLER ---
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tenant?")) return
    
    setDeletingId(id)
    try {
      await deleteTenant(id)
      toast({ title: "Success", description: "Tenant removed successfully" })
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete tenant" })
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <Card className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/50 backdrop-blur-xl shadow-2xl">
      {/* Subtle Aceternity Top Glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

      <CardHeader className="flex flex-col gap-4 border-b border-white/5 pb-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 border border-violet-500/20">
            <Users className="h-4 w-4 text-violet-400" />
          </div>
          <CardTitle className="text-lg font-bold tracking-tight text-zinc-100">Tenant Directory</CardTitle>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Glowing Search Input */}
          <div className="relative group">
            <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 opacity-0 blur transition duration-300 group-focus-within:opacity-30" />
            <div className="relative flex items-center">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
              <Input
                placeholder="Search name or room..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                className="h-9 w-48 border-white/10 bg-black/50 pl-9 text-sm text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-violet-500/50 transition-all"
              />
            </div>
          </div>
          
          {/* Status Filter */}
          <Select value={filter} onValueChange={(v) => { setFilter(v as any); setPage(1) }}>
            <SelectTrigger className="h-9 w-32 border-white/10 bg-black/50 text-sm text-zinc-200 focus:ring-1 focus:ring-violet-500/50 transition-all">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-zinc-950 text-zinc-200">
              <SelectItem value="All" className="focus:bg-white/5 cursor-pointer">All Statuses</SelectItem>
              <SelectItem value="Paid" className="focus:bg-emerald-500/20 focus:text-emerald-300 cursor-pointer">Paid</SelectItem>
              <SelectItem value="Pending" className="focus:bg-amber-500/20 focus:text-amber-300 cursor-pointer">Pending</SelectItem>
              <SelectItem value="Overdue" className="focus:bg-rose-500/20 focus:text-rose-300 cursor-pointer">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-black/20">
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="pl-6 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 h-11">Tenant Name</TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 h-11">Room</TableHead>
              <TableHead className="hidden md:table-cell text-[11px] font-semibold uppercase tracking-wider text-zinc-500 h-11">Phone</TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 h-11">Rent</TableHead>
              <TableHead className="hidden lg:table-cell text-[11px] font-semibold uppercase tracking-wider text-zinc-500 h-11">Due Date</TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 h-11">Status</TableHead>
              <TableHead className="pr-6 text-right text-[11px] font-semibold uppercase tracking-wider text-zinc-500 h-11">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.length === 0 ? (
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableCell colSpan={7} className="py-12 text-center text-zinc-500">No tenants found.</TableCell>
              </TableRow>
            ) : (
              paged.map((tenant) => (
                <TableRow key={tenant.id} className="border-white/5 transition-colors hover:bg-white/[0.02]">
                  <TableCell className="pl-6 font-medium text-zinc-200">{tenant.name}</TableCell>
                  <TableCell className="text-zinc-400">{tenant.room_number || "N/A"}</TableCell>
                  <TableCell className="hidden md:table-cell text-zinc-400">{tenant.phone}</TableCell>
                  <TableCell className="font-medium text-zinc-300">{formatCurrency(tenant.rent_amount || 0)}</TableCell>
                  <TableCell className="hidden lg:table-cell text-zinc-400">{tenant.due_date || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(tenant.status || "Pending")} className={cn("px-2 py-0.5 text-[10px] font-bold tracking-wide transition-all", statusClasses(tenant.status || "Pending"))}>
                      {tenant.status || "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <div className="flex justify-end gap-1">
                      {/* View Action */}
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:bg-white/10 hover:text-zinc-100 transition-colors">
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {/* Edit Action (Triggers your previously styled EditDialog) */}
                      <EditTenantDialog tenant={tenant} />

                      {/* Delete Action */}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-zinc-400 transition-colors hover:bg-rose-500/10 hover:text-rose-400"
                        onClick={() => handleDelete(tenant.id)}
                        disabled={deletingId === tenant.id}
                      >
                        {deletingId === tenant.id ? <Loader2 className="animate-spin h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        
        {/* Aceternity Style Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-white/5 bg-black/20 px-6 py-3">
             <span className="text-xs font-medium text-zinc-500">
               Showing <span className="text-zinc-300">{(page - 1) * PAGE_SIZE + 1}</span>-
               <span className="text-zinc-300">{Math.min(page * PAGE_SIZE, filtered.length)}</span> of <span className="text-zinc-300">{filtered.length}</span>
             </span>
             <div className="flex items-center gap-2">
               <Button 
                 variant="outline" 
                 size="icon" 
                 className="h-8 w-8 border-white/10 bg-transparent text-zinc-400 hover:bg-white/10 hover:text-zinc-100 disabled:opacity-50" 
                 disabled={page === 1} 
                 onClick={() => setPage((p) => p - 1)}
               >
                 <ChevronLeft className="h-4 w-4" />
               </Button>
               <span className="flex h-8 min-w-[32px] items-center justify-center rounded-md bg-white/5 px-2 text-xs font-medium text-zinc-300">
                 {page} / {totalPages}
               </span>
               <Button 
                 variant="outline" 
                 size="icon" 
                 className="h-8 w-8 border-white/10 bg-transparent text-zinc-400 hover:bg-white/10 hover:text-zinc-100 disabled:opacity-50" 
                 disabled={page === totalPages} 
                 onClick={() => setPage((p) => p + 1)}
               >
                 <ChevronRight className="h-4 w-4" />
               </Button>
             </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}