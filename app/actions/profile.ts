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