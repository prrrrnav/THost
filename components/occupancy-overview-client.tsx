"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BedDouble, DoorOpen, Home, Users, Building2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type PropertyData = {
    id: string
    name: string
    total_beds: number
    occupied_beds: number
    vacant_beds: number
}

export function OccupancyOverviewClient({ properties }: { properties: PropertyData[] }) {
    // Default to the first PG in the list if available
    const [selectedPgId, setSelectedPgId] = useState<string>(properties.length > 0 ? properties[0].id : "")

    const selectedPG = useMemo(() => {
        return properties.find((pg) => pg.id === selectedPgId)
    }, [selectedPgId, properties])

    const totalBeds = selectedPG ? selectedPG.total_beds : 0
    const occupiedBeds = selectedPG ? selectedPG.occupied_beds : 0
    const vacantBeds = selectedPG ? selectedPG.vacant_beds : 0
    // Handle division by zero
    const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0

    const occupancyStats = [
        { label: "Total Beds", value: totalBeds, icon: BedDouble, color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
        { label: "Occupied", value: occupiedBeds, icon: Users, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
        { label: "Vacant", value: vacantBeds, icon: Home, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    ]

    if (properties.length === 0) {
        return (
            <Card className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/50 backdrop-blur-xl shadow-2xl p-8 text-center flex flex-col items-center justify-center gap-4">
                <Building2 className="h-12 w-12 text-zinc-600" />
                <div>
                    <h3 className="text-lg font-bold text-zinc-200">No PG Properties Found</h3>
                    <p className="text-sm text-zinc-500">Add a property to start tracking occupancy.</p>
                </div>
            </Card>
        )
    }

    return (
        <Card className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/50 backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Subtle top glow line typical of Aceternity cards */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <div className="px-6 pt-6 pb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between w-full">
                <div className="flex-1 min-w-0">
                    <CardTitle className="flex items-center gap-2 text-lg font-bold tracking-tight text-zinc-100 truncate">
                        Occupancy Overview
                        <span className="relative flex h-2 w-2 flex-shrink-0">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-500"></span>
                        </span>
                    </CardTitle>
                    <p className="text-xs text-zinc-400 mt-1 truncate">Real-time status of your property capacity.</p>
                </div>

                {/* Dynamic Dropdown for PG Selection */}
                <div className="w-full max-w-[240px]">
                    <Select value={selectedPgId} onValueChange={setSelectedPgId}>
                        <SelectTrigger className="h-10 w-full border-white/10 bg-zinc-900/50 text-zinc-100 transition-all focus:border-violet-500/50 focus:bg-zinc-900 focus:ring-1 focus:ring-violet-500/50">
                            <SelectValue placeholder="Select Property" />
                        </SelectTrigger>
                        <SelectContent className="border-white/10 bg-zinc-950 text-zinc-200">
                            {properties.map((pg) => (
                                <SelectItem key={pg.id} value={pg.id} className="cursor-pointer focus:bg-violet-500/20 focus:text-violet-300">
                                    {pg.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <CardContent className="flex flex-col gap-6">

                {/* Stat Blocks Grid */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {occupancyStats.map((item) => (
                        <div
                            key={item.label}
                            className="group relative flex flex-col justify-center gap-3 overflow-hidden rounded-xl border border-white/5 bg-black/40 p-4 transition-all duration-300 hover:border-white/10 hover:bg-black/60"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                            <div className="flex items-center gap-3 relative z-10">
                                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${item.bg} ${item.border} transition-transform duration-300 group-hover:scale-110`}>
                                    <item.icon className={`h-4 w-4 ${item.color}`} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-2xl font-bold tracking-tight text-zinc-100">{item.value}</span>
                                    <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">{item.label}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Custom Glowing Progress Bar Section */}
                <div className="flex flex-col gap-3 rounded-xl border border-white/5 bg-black/20 p-4">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Current Occupancy Rate</span>
                        <span className="text-sm font-bold text-violet-400 drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]">
                            {occupancyRate}%
                        </span>
                    </div>

                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-zinc-900 shadow-inner">
                        <div
                            className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-400 shadow-[0_0_12px_rgba(139,92,246,0.8)] transition-all duration-1000 ease-out"
                            style={{ width: `${occupancyRate}%` }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                        </div>
                    </div>
                </div>

            </CardContent>
        </Card>
    )
}
