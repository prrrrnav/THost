"use server"
import { createClient } from "@/lib/supabase/server"

export async function getProfitStats() {
  const supabase = await createClient()

  // 1. Fetch Total Revenue (Active Rent)
  const { data: tenants } = await supabase
    .from("tenants")
    .select("rent_amount")
    .eq("is_active", true)

  // 2. Fetch Total Expenses
  const { data: expenses } = await supabase
    .from("expenses")
    .select("amount")

  const totalRevenue = tenants?.reduce((acc, t) => acc + t.rent_amount, 0) || 0
  const totalExpenses = expenses?.reduce((acc, e) => acc + e.amount, 0) || 0

  return {
    totalRevenue,
    totalExpenses,
    netProfit: totalRevenue - totalExpenses
  }
}