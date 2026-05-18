// app/actions/settings.ts
"use server"

import { createClient } from "@/lib/supabase/server"
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js"
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
  if (!user) throw new Error("Unauthorized")

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

  if (error) throw new Error(error.message)

  revalidatePath("/admin/settings")
}

export async function updateOccupancySettings(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const supabaseAdmin = createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Extract all pg_capacity_* fields from formData
  const updates = Array.from(formData.entries())
    .filter(([key]) => key.startsWith("pg_capacity_"))
    .map(([key, value]) => {
      const pgId = key.replace("pg_capacity_", "")
      return { id: pgId, total_beds: Number(value) }
    })

  // Execute Supabase Updates
  const results = await Promise.all(
    updates.map((update) =>
      supabaseAdmin
        .from("pg_details")
        .update({ total_beds: update.total_beds })
        .eq("id", update.id)
        .eq("owner_id", user.id) // Security check
    )
  )

  const errors = results.filter((res) => res.error).map((res) => res.error?.message)

  if (errors.length > 0) {
    throw new Error(`Completed with errors: ${errors.join(", ")}`)
  }

  revalidatePath("/admin")
  revalidatePath("/admin/settings")
}

export async function addPgRule(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const pgId = formData.get("pgId") as string
  const content = formData.get("content") as string

  if (!pgId || !content) throw new Error("All fields are required")

  const { error } = await supabase
    .from("property_rules")
    .insert([{ pg_id: pgId, content: content }])

  if (error) throw new Error(error.message)

  revalidatePath("/admin/settings")
  revalidatePath("/tenant")
}

export async function updatePgRule(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const ruleId = formData.get("ruleId") as string
  const content = formData.get("content") as string

  if (!ruleId || !content) throw new Error("All fields are required")

  const { error } = await supabase
    .from("property_rules")
    .update({ content: content })
    .eq("id", ruleId)

  if (error) throw new Error(error.message)

  revalidatePath("/admin/settings")
  revalidatePath("/tenant")
}

export async function deletePgRule(ruleId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { error } = await supabase
    .from("property_rules")
    .delete()
    .eq("id", ruleId)

  if (error) throw new Error(error.message)

  revalidatePath("/admin/settings")
  revalidatePath("/tenant")
}

export async function sendPgNotice(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const pgId = formData.get("pgId") as string
  const title = formData.get("title") as string
  const message = formData.get("message") as string

  if (!pgId || !title || !message) throw new Error("All fields are required")

  const { error } = await supabase
    .from("notifications")
    .insert([
      {
        pg_id: pgId,
        title: title,
        message: message,
        type: "Notice",
        target_tenant_email: "all"
      }
    ])

  if (error) throw new Error(error.message)

  revalidatePath("/tenant")
}

export async function getPgNotifications(pgIds: string[], offset: number = 0, limit: number = 5) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .in("pg_id", pgIds)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw new Error(error.message)
  return data
}