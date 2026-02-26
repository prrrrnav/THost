"use client"

import { useState, useMemo } from "react"
import { formatCurrency, type TenantStatus } from "@/lib/data" 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Search, Eye, ChevronLeft, ChevronRight, Trash2, Loader2 } from "lucide-react"
import { deleteTenant } from "@/app/actions/tenants"
import { useToast } from "@/hooks/use-toast"

const PAGE_SIZE = 5

function statusVariant(status: string) {
  switch (status) {
    case "Paid": return "default" as const
    case "Pending": return "secondary" as const
    case "Overdue": return "destructive" as const
    default: return "secondary" as const
  }
}

function statusClasses(status: string) {
  switch (status) {
    case "Paid": return "bg-success/10 text-success border-success/20 hover:bg-success/15"
    case "Pending": return "bg-warning/10 text-warning-foreground border-warning/20 hover:bg-warning/15"
    case "Overdue": return "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/15"
    default: return "bg-slate-100 text-slate-700"
  }
}

// --- ADDED DATA AS A PROP ---
export function TenantsTable({ data }: { data: any[] }) {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"All" | TenantStatus>("All")
  const [page, setPage] = useState(1)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const { toast } = useToast()

  // Filter logic using real Supabase field names
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
    <Card className="border border-border shadow-sm">
      <CardHeader className="flex flex-col gap-4 pb-3 md:flex-row md:items-center md:justify-between">
        <CardTitle className="text-base font-semibold text-card-foreground">Tenants</CardTitle>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search name or room..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className="h-8 w-48 pl-8 text-sm"
            />
          </div>
          <Select value={filter} onValueChange={(v) => { setFilter(v as any); setPage(1) }}>
            <SelectTrigger className="h-8 w-28 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">Tenant Name</TableHead>
              <TableHead>Room</TableHead>
              <TableHead className="hidden md:table-cell">Phone</TableHead>
              <TableHead>Rent</TableHead>
              <TableHead className="hidden lg:table-cell">Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pr-6 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="py-10 text-center">No tenants found.</TableCell></TableRow>
            ) : (
              paged.map((tenant) => (
                <TableRow key={tenant.id}>
                  <TableCell className="pl-6 font-medium">{tenant.name}</TableCell>
                  <TableCell>{tenant.room_number || "N/A"}</TableCell>
                  <TableCell className="hidden md:table-cell">{tenant.phone}</TableCell>
                  <TableCell>{formatCurrency(tenant.rent_amount || 0)}</TableCell>
                  <TableCell className="hidden lg:table-cell">{tenant.due_date || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(tenant.status || "Pending")} className={statusClasses(tenant.status || "Pending")}>
                      {tenant.status || "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-6 text-right flex justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-3.5 w-3.5" /></Button>
                    
                    {/* --- DELETE BUTTON --- */}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(tenant.id)}
                      disabled={deletingId === tenant.id}
                    >
                      {deletingId === tenant.id ? <Loader2 className="animate-spin h-3.5 w-3.5" /> : <Trash2 className="h-3.5 w-3.5" />}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        
        {/* Pagination logic remains identical but uses data length */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-6 py-3">
             <span className="text-xs text-muted-foreground">Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</span>
             <div className="flex items-center gap-1">
               <Button variant="ghost" size="icon" className="h-7 w-7" disabled={page === 1} onClick={() => setPage((p) => p - 1)}><ChevronLeft className="h-3.5 w-3.5" /></Button>
               <span className="text-xs font-medium px-2">{page} / {totalPages}</span>
               <Button variant="ghost" size="icon" className="h-7 w-7" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}><ChevronRight className="h-3.5 w-3.5" /></Button>
             </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}