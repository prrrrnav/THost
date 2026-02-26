"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function addExpense(formData: FormData) {
  const supabase = await createClient()
  
  const rawData = {
    category: formData.get("category") as string,
    amount: Number(formData.get("amount")),
    description: formData.get("description") as string,
    expense_date: formData.get("expense_date") as string || new Date().toISOString().split('T')[0],
  }

  const { error } = await supabase.from("expenses").insert([rawData])

  if (error) throw new Error(error.message)
  
  revalidatePath("/admin") // Refresh the dashboard stats instantly
}

// Ensure calculateMonthlyProfit still works with the new schema
export async function calculateMonthlyProfit() {
  const supabase = await createClient()

  const { data: tenants } = await supabase.from("tenants").select("rent_amount")
  const { data: expenses } = await supabase.from("expenses").select("amount")

  const totalRevenue = tenants?.reduce((acc, t) => acc + (t.rent_amount || 0), 0) || 0
  const totalExpenses = expenses?.reduce((acc, e) => acc + (e.amount || 0), 0) || 0

  return {
    revenue: totalRevenue,
    expenses: totalExpenses,
    profit: totalRevenue - totalExpenses
  }
}