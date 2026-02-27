"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// CREATE: Add a new tenant
export async function createTenant(formData: FormData) {
  const supabase = await createClient()
  
  
  const tenantData = {
    name: formData.get("name") as string,
    phone: formData.get("phone") as string,
    rent_amount: Number(formData.get("rent")),
    room_number: formData.get("room_number") as string,
    due_date: Number(formData.get("due_date")),
    status: (formData.get("status") as string) || "Pending", // Default to Pending if empty
  }

  const { error } = await supabase.from("tenants").insert([tenantData])
  if (error) throw new Error(error.message)

  revalidatePath("/admin") 
}

// UPDATE: Edit an existing tenant (FIXED)
export async function updateTenant(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get("id") as string

  const updatedData = {
    name: formData.get("name") as string,
    phone: formData.get("phone") as string,
    rent_amount: Number(formData.get("rent")),
    room_number: formData.get("room_number") as string,
    due_date: Number(formData.get("due_date")),
    // 👇 THIS LINE WAS MISSING. IT IS NOW ADDED.
    status: formData.get("status") as string, 
  }

  const { error } = await supabase
    .from("tenants")
    .update(updatedData)
    .eq("id", id)

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