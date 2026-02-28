"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

/**
 * Action to create a new complaint
 */
export async function createComplaint(formData: FormData) {
  const supabase = await createClient()
  
  // 1. Verify User Session
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const subject = formData.get("subject") as string
  const description = formData.get("description") as string

  // 2. Insert into database
  const { error } = await supabase
    .from("complaints")
    .insert({
      subject,
      description,
      tenant_email: user.email,
      status: "Pending", // Default status
      created_at: new Date().toISOString()
    })

  if (error) return { error: error.message }

  // 3. Refresh the complaints page to show the new entry
  revalidatePath("/tenant/complaints")
  return { success: true }
}

/**
 * Action to delete an existing complaint
 */
export async function deleteComplaint(complaintId: string) {
  const supabase = await createClient()

  // 1. Verify Authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "You must be logged in to delete complaints." }
  }

  // 2. Perform Deletion
  // We include tenant_email check as an extra layer of security
  const { error } = await supabase
    .from("complaints")
    .delete()
    .eq("id", complaintId)
    .eq("tenant_email", user.email)

  if (error) {
    return { error: "Could not delete complaint. Please try again." }
  }

  // 3. Purge Cache to update the UI
  revalidatePath("/tenant/complaints")
  
  return { success: true }
}