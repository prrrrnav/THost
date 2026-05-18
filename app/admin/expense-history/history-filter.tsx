"use client"

import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
]

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - i); // e.g. [2026, 2025, 2024, 2023, 2022]

export function HistoryFilter({ initialMonth, initialYear }: { initialMonth: number, initialYear: number }) {
    const router = useRouter()
    // Ensure consistent rendering
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleFilterChange = (type: 'month' | 'year', value: string) => {
        const params = new URLSearchParams(window.location.search);
        if (type === 'month') {
            params.set('month', value)
        } else {
            params.set('year', value)
        }
        router.push(`?${params.toString()}`)
    }

    if (!mounted) return null; // Avoid hydration mismatch

    return (
        <div className="flex items-center gap-3">
            <Select value={initialMonth.toString()} onValueChange={(val) => handleFilterChange('month', val)}>
                <SelectTrigger className="w-[140px] border-white/10 bg-black/50 text-sm text-zinc-200 focus:ring-1 focus:ring-violet-500/50 transition-all">
                    <SelectValue placeholder="Select Month" />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-zinc-950 text-zinc-200 max-h-[300px]">
                    {MONTHS.map((monthName, index) => (
                        <SelectItem key={index} value={index.toString()} className="focus:bg-violet-500/20 focus:text-violet-300 cursor-pointer">
                            {monthName}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select value={initialYear.toString()} onValueChange={(val) => handleFilterChange('year', val)}>
                <SelectTrigger className="w-[100px] border-white/10 bg-black/50 text-sm text-zinc-200 focus:ring-1 focus:ring-violet-500/50 transition-all">
                    <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-zinc-950 text-zinc-200">
                    {YEARS.map((year) => (
                        <SelectItem key={year} value={year.toString()} className="focus:bg-violet-500/20 focus:text-violet-300 cursor-pointer">
                            {year}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
