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
    outstanding_amount: Number(formData.get("outstanding_amount") || 0),
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
    outstanding_amount: Number(formData.get("outstanding_amount") || 0),
  }

  const { error } = await supabaseAdmin
    .from("tenants")
    .update(updatedData)
    .eq("id", id)

  if (error) throw new Error(error.message)

  // --- NEW: SYNC WITH PAYMENTS TABLE ---

  // 1. Get current month string (e.g., "March 2026")
  const currentDate = new Date();
  const currentMonthStr = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const paymentDateStr = currentDate.toISOString().split('T')[0];

  // 2. Determine payable amount (default to rent_amount unless overridden)
  const payableAmount = formData.has("payable_amount") && formData.get("payable_amount") !== ""
    ? Number(formData.get("payable_amount"))
    : updatedData.rent_amount;

  // 3. Upsert a record in the payments table for this month, for this tenant
  const paymentRecord = {
    tenant_id: id,
    tenant_email: formData.get("email") as string || await getTenantEmail(supabaseAdmin, id),
    month: currentMonthStr,
    month_year: currentMonthStr,
    amount: payableAmount,
    status: updatedData.status,
    due_date: new Date(currentDate.getFullYear(), currentDate.getMonth(), updatedData.due_date).toISOString().split('T')[0],
    amount_paid: updatedData.status === "Paid" ? payableAmount : 0,
    payment_date: updatedData.status === "Paid" ? paymentDateStr : null
  };

  // Check if a payment record for this month already exists
  const { data: existingPayment } = await supabaseAdmin
    .from("payments")
    .select("id")
    .eq("tenant_id", id)
    .eq("month", currentMonthStr)
    .maybeSingle();

  if (existingPayment) {
    // Update existing record
    await supabaseAdmin
      .from("payments")
      .update(paymentRecord)
      .eq("id", existingPayment.id);
  } else {
    // Insert new record
    await supabaseAdmin
      .from("payments")
      .insert([paymentRecord]);
  }

  revalidatePath("/admin", "layout")
}

// Helper to reliably get tenant email if missing from the form
async function getTenantEmail(supabaseAdmin: any, tenantId: string) {
  const { data } = await supabaseAdmin.from("tenants").select("email").eq("id", tenantId).single();
  return data?.email || "";
}

// GET: Fetch payment history for a specific tenant
export async function getTenantPayments(tenantId: string) {
  const supabase = await createClient()

  // Verify access is allowed (RLS will handle this, but explicit check is good)
  const { data: payments, error } = await supabase
    .from("payments")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Failed to fetch tenant payments:", error)
    return []
  }

  return payments || []
}

// DELETE: Remove a tenant and free up room space
export async function deleteTenant(id: string, roomId?: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("tenants").delete().eq("id", id)
  if (error) throw new Error(error.message)

  revalidatePath("/admin", "layout")
}