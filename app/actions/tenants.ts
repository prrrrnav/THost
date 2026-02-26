"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// CREATE: Add a new tenant from the form
export async function createTenant(formData: FormData) {
  const supabase = await createClient()
  
  const tenantData = {
    name: formData.get("name") as string,
    phone: formData.get("phone") as string,
    rent_amount: Number(formData.get("rent")),
    room_number: formData.get("room_number") as string,
    due_date: Number(formData.get("due_date")), 
  }

  const { error } = await supabase.from("tenants").insert([tenantData])
  if (error) throw new Error(error.message)

  revalidatePath("/admin") // Instantly refreshes the UI
}

// UPDATE: Edit an existing tenant
export async function updateTenant(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get("id") as string

  const updatedData = {
    name: formData.get("name") as string,
    phone: formData.get("phone") as string,
    rent_amount: Number(formData.get("rent")),
    room_number: formData.get("room_number") as string,
  }

  const { error } = await supabase.from("tenants").update(updatedData).eq("id", id)
  if (error) throw new Error(error.message)

  revalidatePath("/admin")
}

// DELETE: Remove a tenant
export async function deleteTenant(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("tenants").delete().eq("id", id)
  
  if (error) throw new Error(error.message)
  revalidatePath("/admin")
}