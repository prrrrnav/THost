"use server"
import { createClient } from "@/lib/supabase/server"

export async function getOverdueTenants() {
  const supabase = await createClient()
  const today = new Date().getDate()

  // Find tenants whose due_date has passed but haven't paid this month
  const { data, error } = await supabase
    .from("tenants")
    .select("name, phone, rent_amount")
    .lt("due_date", today) // Past due day
    .eq("status", "unpaid")

  return data || []
}