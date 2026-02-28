import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, ShieldCheck, Mail, Phone, Building2, Trash2, MapPin } from "lucide-react"
import { RoleSwitcher } from "@/components/role-switcher"
import { Button } from "@/components/ui/button"
import { AddOwnerDialog } from "@/components/add-owner-dialog"
import { EditOwnerDialog } from "@/components/edit-owner-dialog" 
import { deletePGOwner } from "@/app/actions/superadmin"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export default async function OwnersDirectory() {
    const supabase = await createClient()

    // 1. Verify SuperAdmin Access
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect("/login")

    const { data: adminProfile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

    if (adminProfile?.role !== "superadmin") {
        redirect("/tenant")
    }

    // 2. Fetch data from the pg_owners table discovered in your screenshot
    const { data: owners, error } = await supabase
        .from("pg_owners") 
        .select("id, name, city, total_tenants, monthly_revenue, plan, status")
        .order("name", { ascending: true });

    if (error) console.error("Fetch error:", error.message);

    return (
        <div className="flex flex-col gap-8 pb-10">
            {/* Header Section */}
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center gap-5">
                    <div className="relative group">
                        <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 opacity-25 blur transition duration-500 group-hover:opacity-50"></div>
                        <div className="relative flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-black shadow-2xl">
                            <ShieldCheck className="h-6 w-6 text-amber-400" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-100">PG Owners Directory</h1>
                        <p className="text-sm text-zinc-400">Total registered owners: {owners?.length || 0}</p>
                    </div>
                </div>

                <AddOwnerDialog />
            </div>

            {/* Directory Table */}
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
                <Card className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/50 backdrop-blur-xl shadow-2xl">
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-white/[0.02]">
                                <TableRow className="border-white/5 hover:bg-transparent">
                                    <TableHead className="pl-6 h-12 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Owner & Property</TableHead>
                                    <TableHead className="h-12 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Business Stats</TableHead>
                                    <TableHead className="h-12 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Status</TableHead>
                                    <TableHead className="h-12 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Tier</TableHead>
                                    <TableHead className="pr-6 h-12 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {!owners || owners.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="py-20 text-center text-zinc-500 italic">
                                            No PG Owners found in the database.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    // FIXED: Removed the extra curly braces that were wrapping the map function
                                    owners.map((owner) => (
                                        <TableRow key={owner.id} className="border-white/5 transition-colors hover:bg-white/[0.02]">
                                            <TableCell className="pl-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-bold text-zinc-200">{owner.name}</span>
                                                    <span className="text-xs text-amber-400/80 flex items-center gap-1">
                                                        <MapPin className="h-3 w-3" /> {owner.city}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1 text-xs text-zinc-400">
                                                    <span>Tenants: {owner.total_tenants}</span>
                                                    <span>Revenue: ₹{owner.monthly_revenue.toLocaleString()}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={owner.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}>
                                                    {owner.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="border-white/10 text-zinc-400">
                                                    {owner.plan}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="pr-6">
                                                <div className="flex items-center justify-end gap-2">
                                                    <EditOwnerDialog owner={owner} />
                                                    <form action={async () => { "use server"; await deletePGOwner(owner.id); }}>
                                                        <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-rose-500 transition-colors">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </form>
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