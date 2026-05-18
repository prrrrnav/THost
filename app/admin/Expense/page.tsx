import { createClient } from "@/lib/supabase/server"
import { Building2 } from "lucide-react"
import { ExpenseSection, type Expense } from "@/components/expense-section"
import { AddExpenseDialog } from "@/components/add-expense-dialog"
import { ManageMenuDialog } from "@/components/manage-menu-dialog"
import { DailyMenuTracker } from "@/components/daily-menu-tracker"
import { getWeeklyMenu, getActiveMenuWeek } from "@/app/actions/menu"

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export default async function ExpensePage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    // 1. Fetch Expenses (ONLY Current Month)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Format YYYY-MM-DD for Supabase 'date' type comparison
    const startDateStr = startOfMonth.toISOString().split('T')[0];
    const endDateStr = endOfMonth.toISOString().split('T')[0];

    const { data: expenses } = await supabase
        .from("expenses")
        .select("*")
        .gte("expense_date", startDateStr)
        .lte("expense_date", endDateStr)
        .order("expense_date", { ascending: false })

    // 2. Fetch PG Details
    const { data: pgDetails } = await supabase
        .from("pg_details")
        .select("id, name")
        .eq("owner_id", user?.id)
        .limit(1)
        .single()

    // 3. Fetch Menu Data
    const pgId = pgDetails?.id
    const active_week = pgId ? await getActiveMenuWeek(pgId) : 1
    const menuConfig = pgId ? await getWeeklyMenu(pgId, active_week) : []

    // 4. Derive Today's Menu
    const todayName = DAYS[new Date().getDay()]
    const todaysMenu = menuConfig.filter(m => m.day_of_week === todayName)

    // Helper to parse dishes
    const getDish = (mealType: string, diet: 'veg' | 'nonVeg') => {
        const meal = todaysMenu.find(m => m.meal_type === mealType)
        if (!meal) return "Not Set"

        try {
            const dishes = JSON.parse(meal.dishes)
            return dishes[diet] || "Not Set"
        } catch {
            return meal.dishes || "Not Set"
        }
    }

    return (
        <>
            <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .anim-1 { animation: fadeSlideUp 0.5s ease forwards 0.05s; opacity: 0; }
        .anim-2 { animation: fadeSlideUp 0.5s ease forwards 0.15s; opacity: 0; }
        .anim-3 { animation: fadeSlideUp 0.5s ease forwards 0.25s; opacity: 0; }
        .anim-4 { animation: fadeSlideUp 0.5s ease forwards 0.35s; opacity: 0; }
        .anim-5 { animation: fadeSlideUp 0.5s ease forwards 0.45s; opacity: 0; }
        .anim-6 { animation: fadeSlideUp 0.5s ease forwards 0.55s; opacity: 0; }
        .section-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent);
        }
      `}</style>

            <div className="flex flex-col gap-8 pb-10">

                {/* Page Header */}
                <div className="anim-1 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="flex flex-wrap items-center gap-4 w-full">
                        {/* Icon badge */}
                        <div className="flex h-10 w-10 min-w-10 items-center justify-center rounded-xl border border-red-500/20 bg-gradient-to-br from-red-500/15 to-orange-500/10 shadow-lg shadow-red-500/10">
                            <Building2 className="h-[18px] w-[18px] text-red-400" />
                        </div>

                        <div className="mr-auto">
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-semibold tracking-tight text-white/90">Expense Tracker</h1>
                            </div>
                            <p className="text-sm text-white/35">
                                Manage groceries, worker salaries, maintenance costs, and utility bills.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 mt-2 md:mt-0 w-full md:w-auto">
                            {pgId && <ManageMenuDialog pgId={pgId} />}
                            <AddExpenseDialog />
                        </div>
                    </div>
                </div>

                <div className="anim-1 section-divider" />

                {/* Daily Menu Section (Real-time) */}
                <div className="anim-2">
                    {pgId ? (
                        <DailyMenuTracker pgId={pgId} initialMenu={menuConfig} activeWeek={active_week} />
                    ) : (
                        <div className="text-zinc-500 text-sm">Please select a PG to view the menu.</div>
                    )}
                </div>

                <div className="anim-2 section-divider" />

                {/* 1. Groceries Section */}
                <div className="anim-3">
                    <ExpenseSection
                        title="Groceries & Food Supplies"
                        category="Groceries"
                        expenses={(expenses as Expense[]) || []}
                    />
                </div>

                {/* 2. Salaries Section */}
                <div className="anim-4">
                    <ExpenseSection
                        title="Worker Salaries"
                        category="Salary"
                        expenses={(expenses as Expense[]) || []}
                    />
                </div>

                {/* 3. Maintenance Section */}
                <div className="anim-5">
                    <ExpenseSection
                        title="Property Maintenance"
                        category="Maintenance"
                        expenses={(expenses as Expense[]) || []}
                    />
                </div>

                {/* 4. Utilities Section */}
                <div className="anim-6">
                    <ExpenseSection
                        title="Utilities & Bills"
                        category="Utilities"
                        expenses={(expenses as Expense[]) || []}
                    />
                </div>

            </div>
        </>
    )
}
