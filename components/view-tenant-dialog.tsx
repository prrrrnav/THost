"use client"

import { useState } from "react"
import { formatCurrency, type TenantStatus } from "@/lib/data"
import { getTenantPayments } from "@/app/actions/tenants"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Eye, Loader2, Calendar, Phone, CreditCard, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

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
        case "Paid": return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400 shadow-[0_0_10px_-3px_rgba(16,185,129,0.3)]"
        case "Pending": return "border-amber-500/20 bg-amber-500/10 text-amber-400 shadow-[0_0_10px_-3px_rgba(245,158,11,0.3)]"
        case "Overdue": return "border-rose-500/20 bg-rose-500/10 text-rose-400 shadow-[0_0_10px_-3px_rgba(244,63,94,0.3)]"
        default: return "border-zinc-500/20 bg-zinc-500/10 text-zinc-400"
    }
}

export function ViewTenantDialog({ tenant, pgs = [] }: { tenant: any, pgs?: { id: string; name: string }[] }) {
    const [open, setOpen] = useState(false)
    const [payments, setPayments] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    const handleOpenChange = async (isOpen: boolean) => {
        setOpen(isOpen)
        if (isOpen) {
            setLoading(true)
            try {
                const data = await getTenantPayments(tenant.id)
                setPayments(data)
            } catch (error) {
                console.error("Failed to load payments:", error)
            } finally {
                setLoading(false)
            }
        } else {
            // Clear data on close so stale info isn't shown next time
            setPayments([])
        }
    }

    // Find the property name based on pg_id
    const propertyName = pgs.find(pg => pg.id === tenant.pg_id)?.name || "Unknown Property"

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-zinc-400 transition-colors hover:bg-violet-500/10 hover:text-violet-300"
                    title="View Tenant History"
                >
                    <Eye className="h-4 w-4" />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[800px] w-[95vw] md:w-[85vw] lg:w-[75vw] border-white/10 bg-zinc-950/95 p-0 backdrop-blur-3xl shadow-[0_0_50px_-12px_rgba(139,92,246,0.3)] overflow-hidden [&>button]:right-6 [&>button]:top-6 [&>button]:text-zinc-400 [&>button]:hover:bg-white/10 [&>button]:hover:text-white [&>button]:rounded-full [&>button]:h-8 [&>button]:w-8 [&>button]:flex [&>button]:items-center [&>button]:justify-center [&>button]:transition-all [&>button>svg]:h-4 [&>button>svg]:w-4">
                {/* Subtle top glow line */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

                {/* Header Section */}
                <div className="bg-white/[0.02] border-b border-white/5 p-6">
                    <DialogHeader className="mb-4">
                        <DialogTitle className="text-2xl font-bold tracking-tight text-white flex items-center justify-between">
                            <span>{tenant.name}</span>
                            <Badge variant={statusVariant(tenant.status || "Pending")} className={cn("px-3 py-1 text-xs font-bold tracking-wide", statusClasses(tenant.status || "Pending"))}>
                                {tenant.status || "Pending"}
                            </Badge>
                        </DialogTitle>
                    </DialogHeader>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs uppercase tracking-wider text-zinc-500 flex items-center gap-1"><Calendar className="h-3 w-3" /> Property & Room</span>
                            <span className="text-sm font-medium text-zinc-200">{propertyName} - {tenant.room_number || "N/A"}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs uppercase tracking-wider text-zinc-500 flex items-center gap-1"><CreditCard className="h-3 w-3" /> Base Rent</span>
                            <span className="text-sm font-medium text-zinc-200">{formatCurrency(tenant.rent_amount || 0)}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs uppercase tracking-wider text-zinc-500 flex items-center gap-1"><Clock className="h-3 w-3" /> Due Date</span>
                            <span className="text-sm font-medium text-zinc-200">Day {tenant.due_date || "-"}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs uppercase tracking-wider text-zinc-500 flex items-center gap-1"><Phone className="h-3 w-3" /> Phone</span>
                            <span className="text-sm font-medium text-zinc-200">{tenant.phone || "N/A"}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs uppercase tracking-wider text-emerald-500/70 flex items-center gap-1"><CreditCard className="h-3 w-3" /> Outstanding</span>
                            <span className="text-sm font-bold text-emerald-400">{formatCurrency(tenant.outstanding_amount || 0)}</span>
                        </div>
                    </div>
                </div>

                {/* Payment History Section */}
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        Payment History
                        {loading && <Loader2 className="h-4 w-4 animate-spin text-violet-500" />}
                    </h3>

                    <div className="rounded-xl border border-white/10 bg-black/40 overflow-hidden max-h-[300px] overflow-y-auto">
                        <Table>
                            <TableHeader className="bg-black/60 sticky top-0 backdrop-blur-md">
                                <TableRow className="border-white/5 hover:bg-transparent">
                                    <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 h-10">Invoice Month</TableHead>
                                    <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 h-10">Payable Amount</TableHead>
                                    <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 h-10">Status</TableHead>
                                    <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 h-10">Paid On</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {!loading && payments.length === 0 ? (
                                    <TableRow className="border-white/5 hover:bg-transparent">
                                        <TableCell colSpan={4} className="py-8 text-center text-zinc-500">No payment records found.</TableCell>
                                    </TableRow>
                                ) : (
                                    payments.map((payment) => (
                                        <TableRow key={payment.id} className="border-white/5 transition-colors hover:bg-white/[0.03]">
                                            <TableCell className="font-medium text-zinc-300">{payment.month}</TableCell>
                                            <TableCell className="text-zinc-300">{formatCurrency(payment.amount || 0)}</TableCell>
                                            <TableCell>
                                                <Badge variant={statusVariant(payment.status || "Pending")} className={cn("px-2 py-0.5 text-[10px] font-bold tracking-wide", statusClasses(payment.status || "Pending"))}>
                                                    {payment.status || "Pending"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-zinc-400">{payment.payment_date || "-"}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
