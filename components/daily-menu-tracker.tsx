"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Utensils, Carrot, Beef } from "lucide-react"

type MenuData = {
    id?: string;
    pg_id: string;
    day_of_week: string;
    meal_type: string;
    dishes: string;
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export function DailyMenuTracker({ pgId, initialMenu, activeWeek }: { pgId: string, initialMenu: MenuData[], activeWeek: number }) {
    const [menu, setMenu] = useState<MenuData[]>(initialMenu)
    const supabase = createClient()
    const todayName = DAYS[new Date().getDay()]

    useEffect(() => {
        // Subscribe to real-time changes on the menu_items table for this specific PG
        const channel = supabase
            .channel(`menu-tracker-${pgId}`)
            .on(
                'postgres_changes',
                {
                    event: '*', // Listen to INSERT, UPDATE, DELETE
                    schema: 'public',
                    table: 'menu_items',
                    filter: `pg_id=eq.${pgId}`
                },
                (payload) => {
                    // When a change happens, refetch the full menu to ensure state is perfectly synced
                    const fetchUpdatedMenu = async () => {
                        const { data } = await supabase
                            .from('menu_items')
                            .select('*')
                            .eq('pg_id', pgId)
                            .eq('week_number', activeWeek)

                        if (data) setMenu(data)
                    }
                    fetchUpdatedMenu()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [pgId, activeWeek, supabase])

    const todaysMenu = menu.filter(m => m.day_of_week === todayName)

    const getDish = (mealType: string, diet: 'veg' | 'nonVeg') => {
        const meal = todaysMenu.find(m => m.meal_type === mealType)
        if (!meal) return "Not Set"

        try {
            const dishes = JSON.parse(meal.dishes)
            return dishes[diet] || "Not Set"
        } catch {
            return meal.dishes || "Not Set"
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-2">
                <Utensils className="h-5 w-5 text-emerald-400" />
                <h2 className="text-lg font-bold text-zinc-100">
                    Menu for Today
                    <span className="text-zinc-500 font-medium text-sm ml-2">
                        ({todayName}, Week {activeWeek})
                    </span>
                </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Veg Menu */}
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/50 p-6 backdrop-blur-xl transition-all hover:border-emerald-500/30">
                    <div className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent`} />
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                <Carrot className="h-5 w-5 text-emerald-400" />
                            </div>
                            <h3 className="text-md font-bold text-emerald-100">Vegetarian</h3>
                        </div>
                    </div>
                    <div className="space-y-3 text-sm text-zinc-300">
                        <div className="flex justify-between items-center rounded-lg bg-white/[0.02] p-2 px-3 border border-white/5">
                            <span className="text-zinc-500 font-medium tracking-wide w-20">Breakfast</span>
                            <span className="font-semibold text-zinc-200 text-right">{getDish("Breakfast", "veg")}</span>
                        </div>
                        <div className="flex justify-between items-center rounded-lg bg-white/[0.02] p-2 px-3 border border-white/5">
                            <span className="text-zinc-500 font-medium tracking-wide w-20">Lunch</span>
                            <span className="font-semibold text-zinc-200 text-right">{getDish("Lunch", "veg")}</span>
                        </div>
                        <div className="flex justify-between items-center rounded-lg bg-white/[0.02] p-2 px-3 border border-white/5">
                            <span className="text-zinc-500 font-medium tracking-wide w-20">Dinner</span>
                            <span className="font-semibold text-zinc-200 text-right">{getDish("Dinner", "veg")}</span>
                        </div>
                    </div>
                </div>

                {/* Non-Veg Menu */}
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/50 p-6 backdrop-blur-xl transition-all hover:border-rose-500/30">
                    <div className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-rose-500/50 to-transparent`} />
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/20">
                                <Beef className="h-5 w-5 text-rose-400" />
                            </div>
                            <h3 className="text-md font-bold text-rose-100">Non-Vegetarian</h3>
                        </div>
                    </div>
                    <div className="space-y-3 text-sm text-zinc-300">
                        <div className="flex justify-between items-center rounded-lg bg-white/[0.02] p-2 px-3 border border-white/5">
                            <span className="text-zinc-500 font-medium tracking-wide w-20">Breakfast</span>
                            <span className="font-semibold text-zinc-200 text-right">{getDish("Breakfast", "nonVeg")}</span>
                        </div>
                        <div className="flex justify-between items-center rounded-lg bg-white/[0.02] p-2 px-3 border border-white/5">
                            <span className="text-zinc-500 font-medium tracking-wide w-20">Lunch</span>
                            <span className="font-semibold text-zinc-200 text-right">{getDish("Lunch", "nonVeg")}</span>
                        </div>
                        <div className="flex justify-between items-center rounded-lg bg-white/[0.02] p-2 px-3 border border-white/5">
                            <span className="text-zinc-500 font-medium tracking-wide w-20">Dinner</span>
                            <span className="font-semibold text-zinc-200 text-right">{getDish("Dinner", "nonVeg")}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
