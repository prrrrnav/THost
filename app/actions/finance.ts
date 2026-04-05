"use server"

import { createClient } from "@/lib/supabase/server"
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js"
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

  revalidatePath("/admin")
  revalidatePath("/admin/Expense")
}

export async function deleteExpense(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("expenses").delete().eq("id", id)

  if (error) throw new Error(error.message)

  revalidatePath("/admin")
  revalidatePath("/admin/Expense")
}

export async function updateExpense(id: string, formData: FormData) {
  const supabase = await createClient()

  const rawData = {
    category: formData.get("category") as string,
    amount: Number(formData.get("amount")),
    description: formData.get("description") as string,
    expense_date: formData.get("expense_date") as string || new Date().toISOString().split('T')[0],
  }

  const { error } = await supabase.from("expenses").update(rawData).eq("id", id)

  if (error) throw new Error(error.message)

  revalidatePath("/admin")
  revalidatePath("/admin/Expense")
}

// Calculate current month profit (resets on the 1st)
export async function calculateMonthlyProfit() {
  const supabase = await createClient()

  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()

  // Delegate to the shared historical stats function using the CURRENT month/year
  return calculateHistoricalStats(currentYear, currentMonth)
}

// Calculate financial stats for a specific past month/year combo
export async function calculateHistoricalStats(year: number, month: number) {
  const supabase = await createClient()

  // Ensure we have a user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { revenue: 0, expenses: 0, profit: 0, overdue: 0, totalOutstanding: 0 }
  }

  // Get Admin Client to bypass complex RLS for aggregation
  const supabaseAdmin = createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // 1. Get Owner's PGs to scope the queries
  const { data: pgDetails } = await supabase
    .from("pg_details")
    .select("id")
    .eq("owner_id", user.id)

  const pgIds = pgDetails?.map(pg => pg.id) || []

  // 2. Get Expenses (Currently all expenses are global in the schema, but we'll fetch them)
  const startOfMonth = new Date(year, month, 1)
  const endOfMonth = new Date(year, month + 1, 0)
  const startDateStr = startOfMonth.toISOString().split('T')[0]
  const endDateStr = endOfMonth.toISOString().split('T')[0]

  const { data: expenses } = await supabase
    .from("expenses")
    .select("amount")
    .gte("expense_date", startDateStr)
    .lte("expense_date", endDateStr)

  const totalExpenses = expenses?.reduce((acc, e) => acc + (Number(e.amount) || 0), 0) || 0

  // 3. Get Revenue based on completed rent payments
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const exactMonthYearStr = `${monthNames[month]} ${year}`;

  // Get Owner's Tenants
  const { data: tenants } = await supabase
    .from("tenants")
    .select("id, outstanding_amount")
    .in("pg_id", pgIds)

  const tenantIds = tenants?.map(t => t.id) || []

  // Compute total outstanding using only this owner's tenants
  const totalGlobalOutstanding = tenants?.reduce((acc, t) => acc + (Number(t.outstanding_amount) || 0), 0) || 0

  // Use Admin Client to bypass payments RLS (which is restricted to tenant only)
  let totalRevenue = 0;
  let totalOverdue = 0;

  if (tenantIds.length > 0) {
    const { data: payments } = await supabaseAdmin
      .from("payments")
      .select("amount, status")
      .eq("month", exactMonthYearStr)
      .in("tenant_id", tenantIds)

    if (payments) {
      payments.forEach((p: any) => {
        if (p.status === 'Paid') {
          totalRevenue += Number(p.amount) || 0;
        } else if (p.status === 'Overdue') {
          totalOverdue += Number(p.amount) || 0;
        }
      })
    }
  }

  return {
    revenue: totalRevenue,
    expenses: totalExpenses,
    profit: totalRevenue - totalExpenses,
    overdue: totalOverdue,
    totalOutstanding: totalGlobalOutstanding
  }
}