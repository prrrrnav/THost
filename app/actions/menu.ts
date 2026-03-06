"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export type MenuData = {
    day_of_week: string;
    meal_type: string;
    dishes: string; // Stored as JSON string
    week_number?: number;
}

export async function saveWeeklyMenu(pgId: string, weekNumber: number, menus: MenuData[]) {
    const supabase = await createClient()

    // 1. Delete existing menu for this PG AND this specific week_number
    const { error: deleteError } = await supabase
        .from("menu_items")
        .delete()
        .eq("pg_id", pgId)
        .eq("week_number", weekNumber)

    if (deleteError) {
        throw new Error(deleteError.message)
    }

    // 2. Insert new menu payload
    const payload = menus.map(m => ({
        pg_id: pgId,
        week_number: weekNumber,
        day_of_week: m.day_of_week,
        meal_type: m.meal_type,
        dishes: m.dishes,
    }))

    if (payload.length > 0) {
        const { error: insertError } = await supabase
            .from("menu_items")
            .insert(payload)

        if (insertError) {
            throw new Error(`Failed to save menu: ${insertError.message}`)
        }
    }

    revalidatePath("/admin/Expense")
}

export async function getWeeklyMenu(pgId: string, weekNumber: number) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .eq("pg_id", pgId)
        .eq("week_number", weekNumber)

    if (error) {
        console.error(error)
        return []
    }

    return data
}

// Global active week trackers
export async function getActiveMenuWeek(pgId: string): Promise<number> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from("pg_details")
        .select("active_menu_week")
        .eq("id", pgId)
        .single()

    if (error || !data) {
        return 1 // Default to Week 1
    }

    return data.active_menu_week || 1
}

export async function setActiveMenuWeek(pgId: string, weekNumber: number) {
    const supabase = await createClient()

    const { error } = await supabase
        .from("pg_details")
        .update({ active_menu_week: weekNumber })
        .eq("id", pgId)

    if (error) {
        throw new Error(`Failed to update active week: ${error.message}`)
    }

    revalidatePath("/admin/Expense")
}
