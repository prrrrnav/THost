"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  
  // Get current user to ensure they only update their own record
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const fullName = formData.get("fullName") as string

  // 1. Update the 'tenants' table for the dashboard/profile
  const { error: dbError } = await supabase
    .from("tenants")
    .update({ name: fullName })
    .eq("email", user.email)

  if (dbError) return { error: dbError.message }

  // 2. Update Auth Metadata so the header/sidebar name updates
  const { error: authError } = await supabase.auth.updateUser({
    data: { full_name: fullName }
  })

  if (authError) return { error: authError.message }

  // 3. Refresh all relevant paths
  revalidatePath("/tenant/profile")
  revalidatePath("/tenant") 
  
  return { success: true }
}

export async function joinPgByCode(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const code = (formData.get("joiningCode") as string)?.trim().toUpperCase()
  if (!code) return { error: "Please enter a connection code." }

  // 1. Look up the PG by its joining_code (RLS policy allows authenticated SELECT on pg_details)
  const { data: pg, error: pgError } = await supabase
    .from("pg_details")
    .select("id, name")
    .eq("joining_code", code)
    .single()

  if (pgError || !pg) {
    return { error: "Invalid code. No PG found with that code." }
  }

  // 2. Update the tenant's pg_id
  const { error: updateError } = await supabase
    .from("tenants")
    .update({ pg_id: pg.id })
    .eq("email", user.email)

  if (updateError) return { error: updateError.message }

  revalidatePath("/tenant")
  revalidatePath("/tenant/profile")

  return { success: true, pgName: pg.name }
}