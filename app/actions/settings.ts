// app/actions/settings.ts
"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"


export async function getAdminSettings() {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    // Return null instead of throwing an error to prevent the Runtime Crash
    if (!user || authError) {
      return null 
    }
  
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()
  
    if (error) throw error
    return data
  }

export async function updateAdminSettings(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const updates = {
    full_name: formData.get("fullName"),
    pg_name: formData.get("pgName"),
    address: formData.get("address"),
    notification_settings: {
      rent_reminders: formData.get("rentReminders") === "on",
      new_tenant_alerts: formData.get("tenantAlerts") === "on",
      daily_summary: formData.get("dailySummary") === "on",
    }
  }

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id)

  if (error) return { error: error.message }

  revalidatePath("/admin/settings")
  return { success: true }
}