"use client"

import { useState, useMemo } from "react"
import { tenants, formatCurrency, type TenantStatus } from "@/lib/data"
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
import { Search, Eye, ChevronLeft, ChevronRight } from "lucide-react"

const PAGE_SIZE = 5

function statusVariant(status: TenantStatus) {
  switch (status) {
    case "Paid":
      return "default" as const
    case "Pending":
      return "secondary" as const
    case "Overdue":
      return "destructive" as const
  }
}

function statusClasses(status: TenantStatus) {
  switch (status) {
    case "Paid":
      return "bg-success/10 text-success border-success/20 hover:bg-success/15"
    case "Pending":
      return "bg-warning/10 text-warning-foreground border-warning/20 hover:bg-warning/15"
    case "Overdue":
      return "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/15"
  }
}

export function TenantsTable() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"All" | TenantStatus>("All")
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    return tenants.filter((t) => {
      const matchesSearch =
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.room.toLowerCase().includes(search.toLowerCase())
      const matchesFilter = filter === "All" || t.status === filter
      return matchesSearch && matchesFilter
    })
  }, [search, filter])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="flex flex-col gap-4 pb-3 md:flex-row md:items-center md:justify-between">
        <CardTitle className="text-base font-semibold text-card-foreground">
          Tenants
        </CardTitle>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search name or room..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="h-8 w-48 pl-8 text-sm"
            />
          </div>
          <Select
            value={filter}
            onValueChange={(v) => {
              setFilter(v as "All" | TenantStatus)
              setPage(1)
            }}
          >
            <SelectTrigger className="h-8 w-28 text-sm">
              <SelectValue />
            </SelectTrigger>
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
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tenant Name</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Room</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Phone</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Rent</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Due Date</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</TableHead>
              <TableHead className="pr-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                  No tenants found.
                </TableCell>
              </TableRow>
            ) : (
              paged.map((tenant) => (
                <TableRow key={tenant.id} className="group">
                  <TableCell className="pl-6 text-sm font-medium text-foreground">
                    {tenant.name}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{tenant.room}</TableCell>
                  <TableCell className="text-sm text-muted-foreground hidden md:table-cell">{tenant.phone}</TableCell>
                  <TableCell className="text-sm font-medium text-foreground">
                    {formatCurrency(tenant.rent)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground hidden lg:table-cell">{tenant.dueDate}</TableCell>
                  <TableCell>
                    <Badge
                      variant={statusVariant(tenant.status)}
                      className={statusClasses(tenant.status)}
                    >
                      {tenant.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-6 py-3">
            <span className="text-xs text-muted-foreground">
              Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span className="sr-only">Previous page</span>
              </Button>
              <span className="text-xs font-medium text-foreground px-2">
                {page} / {totalPages}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="sr-only">Next page</span>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
