"use client"

import { useState, useEffect } from "react"
import { saveWeeklyMenu, getWeeklyMenu, setActiveMenuWeek, getActiveMenuWeek, type MenuData } from "@/app/actions/menu"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarDays, Save, Copy, CheckCircle2, Loader2, ListOrdered } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const MEALS = ["Breakfast", "Lunch", "Dinner"]
const WEEKS = [1, 2, 3, 4]

// State shape: week -> day -> meal -> diet
type MenuState = Record<number, Record<string, Record<string, { veg: string, nonVeg: string }>>>

const createEmptyState = (): MenuState => {
    const state: MenuState = {}
    for (const week of WEEKS) {
        state[week] = {}
        for (const day of DAYS) {
            state[week][day] = {}
            for (const meal of MEALS) {
                state[week][day][meal] = { veg: "", nonVeg: "" }
            }
        }
    }
    return state
}

export function ManageMenuDialog({ pgId }: { pgId: string }) {
    const [open, setOpen] = useState(false)
    const [activeTabDay, setActiveTabDay] = useState("Monday")
    const [selectedWeek, setSelectedWeek] = useState<number>(1)
    const [isFetching, setIsFetching] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [liveActiveWeek, setLiveActiveWeek] = useState<number>(1)

    const { toast } = useToast()

    const [menuState, setMenuState] = useState<MenuState>(createEmptyState())

    // Fetch all menu data when dialog opens
    useEffect(() => {
        if (open && pgId) {
            const loadAllMenus = async () => {
                setIsFetching(true)
                try {
                    // Fetch current active week
                    const currentActive = await getActiveMenuWeek(pgId)
                    setLiveActiveWeek(currentActive)
                    setSelectedWeek(currentActive) // Default view to the currently active week

                    const newState = createEmptyState()

                    // Fetch each week's config (Could be optimized to a single query later)
                    for (const week of WEEKS) {
                        const config = await getWeeklyMenu(pgId, week)
                        config.forEach(item => {
                            try {
                                const dishes = JSON.parse(item.dishes)
                                if (newState[week][item.day_of_week] && newState[week][item.day_of_week][item.meal_type]) {
                                    newState[week][item.day_of_week][item.meal_type] = {
                                        veg: dishes.veg || "",
                                        nonVeg: dishes.nonVeg || ""
                                    }
                                }
                            } catch (e) {
                                // Fallback
                                if (newState[week][item.day_of_week] && newState[week][item.day_of_week][item.meal_type]) {
                                    newState[week][item.day_of_week][item.meal_type].veg = item.dishes
                                }
                            }
                        })
                    }
                    setMenuState(newState)
                } catch (err: any) {
                    toast({ title: "Error loading menu", description: err.message, variant: "destructive" })
                } finally {
                    setIsFetching(false)
                }
            }
            loadAllMenus()
        }
    }, [open, pgId, toast])

    // Handle Input Changes
    const handleInputChange = (meal: string, type: 'veg' | 'nonVeg', value: string) => {
        setMenuState(prev => ({
            ...prev,
            [selectedWeek]: {
                ...prev[selectedWeek],
                [activeTabDay]: {
                    ...prev[selectedWeek][activeTabDay],
                    [meal]: {
                        ...prev[selectedWeek][activeTabDay][meal],
                        [type]: value,
                    }
                }
            }
        }))
    }

    // Handle Save Current Week
    const handleSaveWeek = async () => {
        setIsSaving(true)
        try {
            const payload: MenuData[] = []

            for (const day of DAYS) {
                for (const meal of MEALS) {
                    const dishes = menuState[selectedWeek][day][meal]
                    if (dishes.veg || dishes.nonVeg) {
                        payload.push({
                            day_of_week: day,
                            meal_type: meal,
                            dishes: JSON.stringify(dishes),
                            week_number: selectedWeek
                        })
                    }
                }
            }

            await saveWeeklyMenu(pgId, selectedWeek, payload)

            toast({
                title: "Success",
                description: `Week ${selectedWeek} menu saved successfully.`,
            })
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to save menu.",
                variant: "destructive"
            })
        } finally {
            setIsSaving(false)
        }
    }

    const handleSetActiveWeek = async () => {
        try {
            await setActiveMenuWeek(pgId, selectedWeek)
            setLiveActiveWeek(selectedWeek)
            toast({
                title: "Active Week Updated",
                description: `Now serving the Menu for Week ${selectedWeek} to tenants!`,
            })
        } catch (error: any) {
            toast({ title: "Error changing active week", description: error.message, variant: "destructive" })
        }
    }

    const handleCopyFromPrevious = () => {
        const prevWeek = selectedWeek > 1 ? selectedWeek - 1 : 4
        setMenuState(prev => ({
            ...prev,
            [selectedWeek]: JSON.parse(JSON.stringify(prev[prevWeek])) // Deep copy
        }))
        toast({
            title: "Menu Copied",
            description: `Copied meals from Week ${prevWeek} into Week ${selectedWeek}. Remember to save!`,
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="group relative h-10 overflow-hidden rounded-full border border-white/10 bg-zinc-950 px-6 transition-all duration-300 hover:border-emerald-500/50 hover:bg-zinc-900 hover:shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)]">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-teal-600/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <CalendarDays className="relative z-10 mr-2 h-4 w-4 text-emerald-400 transition-transform duration-300 group-hover:scale-110" />
                    <span className="relative z-10 font-medium text-zinc-300 group-hover:text-zinc-100">
                        Monthly Menu Planner
                    </span>
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[850px] h-[85vh] flex flex-col border-white/10 bg-zinc-950/95 p-0 backdrop-blur-2xl shadow-[0_0_50px_-12px_rgba(16,185,129,0.25)] overflow-hidden">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

                {/* Top Header */}
                <div className="px-6 py-4 border-b border-white/10 flex justify-between items-start">
                    <div>
                        <DialogTitle className="text-xl font-bold tracking-tight text-zinc-100">
                            Kitchen Master Menu
                        </DialogTitle>
                        <p className="text-sm text-zinc-400 mt-1">
                            Plan out meals up to 4 weeks in advance (Week 1 through 4) and easily shuffle between them.
                        </p>
                    </div>

                    <div className="flex gap-2">
                        {WEEKS.map(week => (
                            <button
                                key={week}
                                onClick={() => setSelectedWeek(week)}
                                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all border ${selectedWeek === week
                                        ? "bg-emerald-500 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                                        : "bg-black/50 border-white/10 text-zinc-400 hover:text-zinc-200 hover:border-white/30"
                                    }`}
                            >
                                Week {week}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Action Bar (Below Header) */}
                {isFetching ? (
                    <div className="flex-1 flex justify-center items-center">
                        <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
                    </div>
                ) : (
                    <>
                        <div className="px-6 py-3 border-b border-white/5 bg-black/40 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                {liveActiveWeek === selectedWeek ? (
                                    <span className="flex items-center text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full uppercase tracking-wider">
                                        <CheckCircle2 className="mr-1.5 h-3 w-3" /> Currently Active Week
                                    </span>
                                ) : (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={handleSetActiveWeek}
                                        className="h-8 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300"
                                    >
                                        <ListOrdered className="mr-2 h-3.5 w-3.5" /> Make this the Active Week
                                    </Button>
                                )}
                            </div>

                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleCopyFromPrevious}
                                className="h-8 text-zinc-400 hover:text-white"
                            >
                                <Copy className="mr-2 h-3.5 w-3.5" /> Copy Last Week's Menu
                            </Button>
                        </div>

                        {/* Main Editor */}
                        <div className="flex flex-1 overflow-hidden">
                            {/* Day Selector Sidebar */}
                            <div className="w-1/3 border-r border-white/10 p-4 space-y-2 overflow-y-auto custom-scrollbar">
                                {DAYS.map(day => (
                                    <button
                                        key={day}
                                        onClick={() => setActiveTabDay(day)}
                                        className={`w-full text-left px-4 py-3 rounded-xl transition-all text-sm font-medium ${activeTabDay === day
                                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                                : "bg-transparent text-zinc-400 hover:bg-white/5 hover:text-zinc-200 border border-transparent"
                                            }`}
                                    >
                                        {day}
                                    </button>
                                ))}
                            </div>

                            {/* Meal Inputs */}
                            <div className="w-2/3 p-6 overflow-y-auto custom-scrollbar">
                                <h3 className="text-lg font-bold text-zinc-100 mb-6 flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                                    Editing: {activeTabDay} (Week {selectedWeek})
                                </h3>

                                <div className="space-y-8">
                                    {MEALS.map(meal => (
                                        <div key={meal} className="space-y-4">
                                            <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 border-b border-white/10 pb-2">
                                                {meal}
                                            </h4>

                                            <div className="grid grid-cols-2 gap-4">
                                                {/* Veg Input */}
                                                <div className="space-y-2">
                                                    <Label className="text-xs text-zinc-500">Veg</Label>
                                                    <Input
                                                        placeholder="e.g. Masala Dosa"
                                                        value={menuState[selectedWeek][activeTabDay][meal].veg}
                                                        onChange={(e) => handleInputChange(meal, 'veg', e.target.value)}
                                                        className="h-9 border-white/10 bg-zinc-900/50 text-zinc-200 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/50"
                                                    />
                                                </div>
                                                {/* Non-Veg Input */}
                                                <div className="space-y-2">
                                                    <Label className="text-xs text-zinc-500">Non-Veg</Label>
                                                    <Input
                                                        placeholder="e.g. Chicken Curry"
                                                        value={menuState[selectedWeek][activeTabDay][meal].nonVeg}
                                                        onChange={(e) => handleInputChange(meal, 'nonVeg', e.target.value)}
                                                        className="h-9 border-white/10 bg-zinc-900/50 text-zinc-200 focus-visible:ring-rose-500/50 focus-visible:border-rose-500/50"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Footer Actions */}
                <div className="px-6 py-4 border-t border-white/10 flex justify-end gap-3 bg-zinc-950/80">
                    <Button variant="ghost" onClick={() => setOpen(false)} className="text-zinc-400 hover:text-white" disabled={isSaving}>
                        Close
                    </Button>
                    <Button
                        onClick={handleSaveWeek}
                        disabled={isSaving || isFetching}
                        className="group relative overflow-hidden rounded-xl bg-emerald-600 text-white transition-all hover:bg-emerald-500 shadow-lg"
                    >
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        <span className="relative z-10 font-bold tracking-wide">
                            {isSaving ? "Saving..." : `Save Week ${selectedWeek}`}
                        </span>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
