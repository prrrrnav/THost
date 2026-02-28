import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, ShieldCheck, Mail, MapPin } from "lucide-react"
import { RoleSwitcher } from "@/components/role-switcher"
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

       

    // 2. Fetch PG Owners (Admins)
    const { data: owners } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "admin")
        .order("created_at", { ascending: false })

        if (adminProfile?.role !== "superadmin" && adminProfile?.role !== "admin") {
            redirect("/tenant");
        }

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
                        <p className="text-sm text-zinc-400">Manage all registered administrators and their platform access.</p>
                    </div>
                </div>
            </div>

            {/* Directory Table */}
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
                <Card className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/50 backdrop-blur-xl shadow-2xl">
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

                    <CardHeader className="border-b border-white/5 pb-4">
                        <CardTitle className="flex items-center gap-2 text-lg font-bold text-zinc-100">
                            <Users className="h-5 w-5 text-amber-400" />
                            Registered Owners
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-white/[0.02]">
                                <TableRow className="border-white/5 hover:bg-transparent">
                                    <TableHead className="pl-6 h-12 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">PG Owner</TableHead>
                                    <TableHead className="h-12 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Contact</TableHead>
                                    <TableHead className="h-12 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Role Status</TableHead>
                                    <TableHead className="pr-6 h-12 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 text-right">Joined Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {!owners || owners.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="py-20 text-center text-zinc-500 italic">
                                            No PG Owners found in the database.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    owners.map((owner) => (
                                        <TableRow key={owner.id} className="border-white/5 transition-colors hover:bg-white/[0.02]">
                                            <TableCell className="pl-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-zinc-200">{owner.name || "Unnamed Owner"}</span>
                                                    <span className="text-xs text-zinc-500 flex items-center gap-1">
                                                        <MapPin className="h-3 w-3" /> {owner.city || "Not Specified"}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-sm text-zinc-400">
                                                    <Mail className="h-3.5 w-3.5 text-zinc-600" />
                                                    {owner.email}
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                {/* FIXED: Role is now editable via switcher */}
                                                <RoleSwitcher userId={owner.id} currentRole={owner.role} />
                                            </TableCell>
                                            <TableCell>
                                                <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 px-2 py-0.5 text-[10px] font-bold">
                                                    {owner.role?.toUpperCase()}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="pr-6 text-right text-xs text-zinc-500">
                                                {new Date(owner.created_at).toLocaleDateString('en-GB', {
                                                    day: 'numeric', month: 'short', year: 'numeric'
                                                })}
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