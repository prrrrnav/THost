// app/actions/superadmin.ts
"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateUserRole(targetUserId: string, newRole: string) {
  const supabase = await createClient()
  
  // Verify the person making the change is a SuperAdmin
  const { data: { user } } = await supabase.auth.getUser()
  const { data: adminCheck } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user?.id)
    .single()

  if (adminCheck?.role !== 'superadmin') return { error: "Access Denied" }

  // Execute update
  const { error } = await supabase
    .from("profiles")
    .update({ role: newRole })
    .eq("id", targetUserId)

  if (error) return { error: error.message }
  
  revalidatePath("/superadmin")
  return { success: true }
}