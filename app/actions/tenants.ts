"use server"

import { createClient } from "@/lib/supabase/server"
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"

// CREATE: Add a new tenant and link to PG/Room
export async function createTenant(formData: FormData) {
  const supabase = await createClient()

  const tenantData = {
    name: formData.get("name") as string,
    phone: formData.get("phone") as string,
    rent_amount: Number(formData.get("rent")),
    room_number: formData.get("room_id") as string,
    due_date: Number(formData.get("due_date")),
    status: (formData.get("status") as string) || "Pending",
    email: formData.get("email") as string,
    pg_id: formData.get("pg_id") as string,
  }

  const { error } = await supabase.from("tenants").insert([tenantData])
  if (error) throw new Error(error.message)

  revalidatePath("/admin", "layout")
}

// UPDATE: Edit an existing tenant
export async function updateTenant(formData: FormData) {
  // Use the admin client to bypass RLS because the "tenants" table is missing an UPDATE policy
  const supabaseAdmin = createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const id = formData.get("id") as string

  const updatedData = {
    name: formData.get("name") as string,
    phone: formData.get("phone") as string,
    rent_amount: Number(formData.get("rent")),
    room_number: formData.get("room_id") as string,
    due_date: Number(formData.get("due_date")),
    status: formData.get("status") as string,
    pg_id: formData.get("pg_id") as string,
  }

  const { error } = await supabaseAdmin
    .from("tenants")
    .update(updatedData)
    .eq("id", id)

  if (error) throw new Error(error.message)

  revalidatePath("/admin", "layout")
}

// DELETE: Remove a tenant and free up room space
export async function deleteTenant(id: string, roomId?: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("tenants").delete().eq("id", id)
  if (error) throw new Error(error.message)

  revalidatePath("/admin", "layout")
}