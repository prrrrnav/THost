"use server"

import { createClient } from "@/lib/supabase/server"
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"

/**
 * HELPER: Verifies if the current user is a SuperAdmin.
 */
async function checkSuperAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user?.id)
    .single()

  return profile?.role === "superadmin"
}

/**
 * CREATE: Add a new PG Owner and their property details.
 * Uses the Admin API to avoid Foreign Key violations.
 */
export async function addPGOwner(formData: FormData) {
  const isAllowed = await checkSuperAdmin()
  if (!isAllowed) return { error: "Access Denied" }

  // 1. Initialize Admin Client (Requires SUPABASE_SERVICE_ROLE_KEY in .env)
  const supabaseAdmin = createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const email = formData.get("email") as string
  const fullName = formData.get("fullName") as string
  const pgName = formData.get("pgName") as string
  const phone = formData.get("phone") as string
  const city = formData.get("city") as string

  // 2. Create User in Supabase Auth (This fixes the foreign key error)
  const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password: "TempPassword123!", // User can reset this later
    email_confirm: true,
    user_metadata: { full_name: fullName }
  })

  if (authError) return { error: authError.message }

  // 3. Create business details in pg_owners (or your target table)
  const { error: pgError } = await supabaseAdmin
    .from("pg_owners")
    .insert([{
      id: authUser.user.id, // Links to the newly created Auth ID
      name: fullName,
      city: city,
      status: 'Active',
      plan: 'Basic',
      total_tenants: 0,
      monthly_revenue: 0
    }])

  if (pgError) return { error: pgError.message }

  revalidatePath("/superadmin/owners")
  return { success: true }
}

/**
 * UPDATE: Edit existing owner and property details.
 */
export async function updatePGOwner(formData: FormData) {
  const isAllowed = await checkSuperAdmin()
  if (!isAllowed) return { error: "Access Denied" }

  const supabase = await createClient()
  const ownerId = formData.get("id") as string
  
  const updates = {
    name: formData.get("fullName") as string,
    city: formData.get("city") as string,
    // Add other fields as needed based on your table schema
  }

  const { error } = await supabase
    .from("pg_owners")
    .update(updates)
    .eq("id", ownerId)

  if (error) return { error: error.message }

  revalidatePath("/superadmin/owners")
  return { success: true }
}

/**
 * DELETE: Remove a PG Owner.
 */
export async function deletePGOwner(ownerId: string) {
  const isAllowed = await checkSuperAdmin()
  if (!isAllowed) return { error: "Access Denied" }

  const supabase = await createClient()
  
  // Deleting from Auth (via Admin API) is best to clean up everything
  const supabaseAdmin = createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { error } = await supabaseAdmin.auth.admin.deleteUser(ownerId)

  if (error) return { error: error.message }
  
  revalidatePath("/superadmin/owners")
  return { success: true }
}

export async function updateUserRole(targetUserId: string, newRole: string) {
  const supabase = await createClient()
  
  // 1. Verify the person making the change is a SuperAdmin
  const { data: { user } } = await supabase.auth.getUser()
  const { data: adminCheck } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user?.id)
    .single()

  if (adminCheck?.role !== 'superadmin') {
    return { error: "Access Denied: You do not have permission to change roles." }
  }

  // 2. Execute the role update in the profiles table
  const { error } = await supabase
    .from("profiles")
    .update({ role: newRole })
    .eq("id", targetUserId)

  if (error) return { error: error.message }
  
  // 3. Revalidate paths to refresh the UI immediately
  revalidatePath("/superadmin/tenants")
  revalidatePath("/superadmin/owners")
  
  return { success: true }
}