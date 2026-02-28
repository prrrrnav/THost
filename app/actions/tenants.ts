"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// CREATE: Add a new tenant and link to PG/Room
export async function createTenant(formData: FormData) {
  const supabase = await createClient()
  
  const tenantData = {
    full_name: formData.get("name") as string, // Database uses full_name
    phone: formData.get("phone") as string,
    rent_amount: Number(formData.get("rent")),
    room_id: formData.get("room_id") as string, // Link to Room Inventory
    pg_id: formData.get("pg_id") as string,     // Link to specific PG
    due_date: Number(formData.get("due_date")),
    status: (formData.get("status") as string) || "Pending",
    email: formData.get("email") as string,     // Required for joining logic
  }

  const { error } = await supabase.from("tenants").insert([tenantData])
  if (error) throw new Error(error.message)

  // Update room occupancy
  await supabase.rpc('increment_occupancy', { r_id: tenantData.room_id })

  revalidatePath("/admin")
}

// UPDATE: Edit an existing tenant
export async function updateTenant(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get("id") as string

  const updatedData = {
    full_name: formData.get("name") as string,
    phone: formData.get("phone") as string,
    rent_amount: Number(formData.get("rent")),
    room_id: formData.get("room_id") as string,
    due_date: Number(formData.get("due_date")),
    status: formData.get("status") as string, 
  }

  const { error } = await supabase
    .from("tenants")
    .update(updatedData)
    .eq("id", id)

  if (error) throw new Error(error.message)

  revalidatePath("/admin")
}

// DELETE: Remove a tenant and free up room space
export async function deleteTenant(id: string, roomId?: string) {
  const supabase = await createClient()
  
  const { error } = await supabase.from("tenants").delete().eq("id", id)
  if (error) throw new Error(error.message)

  // If a roomId is provided, decrement the occupancy
  if (roomId) {
    await supabase.rpc('decrement_occupancy', { r_id: roomId })
  }
  
  revalidatePath("/admin")
}