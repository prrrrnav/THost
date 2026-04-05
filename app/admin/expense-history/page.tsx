import { createClient } from "@/lib/supabase/server"
import { Calendar as CalendarIcon, IndianRupee, TrendingDown, TrendingUp, AlertTriangle } from "lucide-react"
import { ExpenseSection, type Expense } from "@/components/expense-section"
import { HistoryFilter } from "./history-filter"
import { calculateHistoricalStats } from "@/app/actions/finance"

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ExpenseHistoryPage(props: Props) {
    const searchParams = await props.searchParams
    const supabase = await createClient()

    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth() // 0-11

    // Use URL params if they exist, otherwise default to "right now"
    const year = searchParams.year ? parseInt(searchParams.year as string) : currentYear
    const month = searchParams.month ? parseInt(searchParams.month as string) : currentMonth

    const startOfMonth = new Date(year, month, 1)
    const endOfMonth = new Date(year, month + 1, 0) // Day 0 of next month is last day of current month

    const startDateStr = startOfMonth.toISOString().split('T')[0]
    const endDateStr = endOfMonth.toISOString().split('T')[0]

    const { data: expenses } = await supabase
        .from("expenses")
        .select("*")
        .gte("expense_date", startDateStr)
        .lte("expense_date", endDateStr)
        .order("expense_date", { ascending: false })

    const stats = await calculateHistoricalStats(year, month)

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

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
        .anim-5 { animation: fadeSlideUp 0.5s ease forwards 0.45s; opacity: 0; }
        .anim-6 { animation: fadeSlideUp 0.5s ease forwards 0.55s; opacity: 0; }

        .stat-card {
          position: relative;
          border: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.02);
          border-radius: 16px;
          padding: 20px;
          transition: border-color 0.25s, background 0.25s, transform 0.25s, box-shadow 0.25s;
          overflow: hidden;
          cursor: default;
        }
        .stat-card:hover {
          border-color: rgba(139,92,246,0.25);
          background: rgba(255,255,255,0.04);
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(139,92,246,0.08);
        }

        .section-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent);
        }
      `}</style>

            <div className="flex flex-col gap-8 pb-10">
                <div className="anim-1 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="flex flex-wrap items-center gap-4 w-full">
                        {/* Dynamic Icon */}
                        <div className="flex h-10 w-10 min-w-10 items-center justify-center rounded-xl border border-violet-500/20 bg-gradient-to-br from-violet-500/15 to-purple-500/10 shadow-lg shadow-violet-500/10">
                            <CalendarIcon className="h-[18px] w-[18px] text-violet-400" />
                        </div>

                        <div className="mr-auto">
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-semibold tracking-tight text-white/90">Expense History</h1>
                            </div>
                            <p className="text-sm text-white/35">
                                View and analyze expenses for past months.
                            </p>
                        </div>

                        {/* History Filtering Bar */}
                        <div className="flex items-center gap-3 mt-2 md:mt-0 w-full md:w-auto">
                            <HistoryFilter initialMonth={month} initialYear={year} />
                        </div>
                    </div>
                </div>

                {/* Stat Cards Layer */}
                <div className="anim-2 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Revenue */}
                    <div className="stat-card">
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/20">
                                <IndianRupee className="h-4 w-4 text-violet-400" />
                            </div>
                            <span className="text-[10px] text-white/25 uppercase tracking-widest font-medium">{monthNames[month]} {year}</span>
                        </div>
                        <p className="text-2xl font-bold text-white/90 tracking-tight">₹{stats.revenue.toLocaleString()}</p>
                        <p className="text-xs text-white/35 mt-1">Total Revenue</p>
                        <div className="pointer-events-none absolute bottom-0 right-0 h-16 w-16 rounded-full bg-violet-500/5 blur-xl" />
                    </div>

                    {/* Expenses */}
                    <div className="stat-card">
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20">
                                <TrendingDown className="h-4 w-4 text-red-400" />
                            </div>
                            <span className="text-[10px] text-white/25 uppercase tracking-widest font-medium">Bills & Salaries</span>
                        </div>
                        <p className="text-2xl font-bold text-white/90 tracking-tight">₹{stats.expenses.toLocaleString()}</p>
                        <p className="text-xs text-white/35 mt-1">Total Expenses</p>
                        <div className="pointer-events-none absolute bottom-0 right-0 h-16 w-16 rounded-full bg-red-500/5 blur-xl" />
                    </div>

                    {/* Profit */}
                    <div className="stat-card">
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                <TrendingUp className="h-4 w-4 text-emerald-400" />
                            </div>
                            <span className="text-[10px] text-white/25 uppercase tracking-widest font-medium">Net Earnings</span>
                        </div>
                        <p className="text-2xl font-bold text-white/90 tracking-tight">₹{stats.profit.toLocaleString()}</p>
                        <p className="text-xs text-white/35 mt-1">Net Profit</p>
                        <div className="pointer-events-none absolute bottom-0 right-0 h-16 w-16 rounded-full bg-emerald-500/5 blur-xl" />
                    </div>

                    {/* Overdue */}
                    <div className="stat-card">
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20">
                                <AlertTriangle className="h-4 w-4 text-amber-400" />
                            </div>
                            <span className="text-[10px] text-white/25 uppercase tracking-widest font-medium">Unpaid Rent</span>
                        </div>
                        <p className="text-2xl font-bold text-white/90 tracking-tight">₹{stats.overdue.toLocaleString()}</p>
                        <p className="text-xs text-white/35 mt-1">Overdue</p>
                        <div className="pointer-events-none absolute bottom-0 right-0 h-16 w-16 rounded-full bg-amber-500/5 blur-xl" />
                    </div>
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
