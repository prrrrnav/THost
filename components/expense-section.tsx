"use client"

import { Building2, IndianRupee, Wrench, Zap, MoreVertical, Trash, ShoppingCart, Loader2 } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { deleteExpense } from "@/app/actions/finance"
import { EditExpenseDialog } from "./edit-expense-dialog"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"

export type Expense = {
    id: string;
    category: string;
    amount: number;
    description: string;
    expense_date: string;
    created_at: string;
}

const getCategoryIcon = (category: string) => {
    switch (category) {
        case 'Salary':
            return <IndianRupee className="h-4 w-4" />;
        case 'Maintenance':
            return <Wrench className="h-4 w-4" />;
        case 'Utilities':
            return <Zap className="h-4 w-4" />;
        case 'Groceries':
            return <ShoppingCart className="h-4 w-4" />;
        default:
            return <Building2 className="h-4 w-4" />;
    }
}

const getCategoryColors = (category: string) => {
    switch (category) {
        case 'Salary':
            return "from-emerald-500/20 to-teal-500/10 border-emerald-500/20 text-emerald-400";
        case 'Maintenance':
            return "from-amber-500/20 to-orange-500/10 border-amber-500/20 text-amber-400";
        case 'Utilities':
            return "from-blue-500/20 to-cyan-500/10 border-blue-500/20 text-blue-400";
        case 'Groceries':
            return "from-pink-500/20 to-rose-500/10 border-pink-500/20 text-pink-400";
        default:
            return "from-violet-500/20 to-indigo-500/10 border-violet-500/20 text-violet-400";
    }
}

export function ExpenseSection({ title, category, expenses }: { title: string, category: string, expenses: Expense[] }) {
    const { toast } = useToast()
    const [deletingId, setDeletingId] = useState<string | null>(null)

    const filteredExpenses = expenses.filter(e => e.category === category)
    const totalAmount = filteredExpenses.reduce((acc, curr) => acc + Number(curr.amount), 0)

    return (
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/50 p-6 sm:p-8 backdrop-blur-xl transition-all hover:border-white/20">

            {/* Glow Effect */}
            <div className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent`} />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border bg-gradient-to-br ${getCategoryColors(category)}`}>
                        {getCategoryIcon(category)}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-zinc-100">{title}</h2>
                        <p className="text-sm text-zinc-400">{filteredExpenses.length} Records found</p>
                    </div>
                </div>

                <div className="text-left sm:text-right">
                    <p className="text-sm text-zinc-400 uppercase tracking-wider font-medium">Total Spend</p>
                    <p className="text-2xl font-bold text-white tracking-tight">₹{totalAmount.toLocaleString()}</p>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-zinc-400">
                    <thead className="border-b border-white/5 bg-white/[0.02] text-xs uppercase tracking-wider text-zinc-500">
                        <tr>
                            <th className="px-4 py-3 font-medium rounded-tl-lg">Date</th>
                            <th className="px-4 py-3 font-medium">Description / Details</th>
                            <th className="px-4 py-3 font-medium">Amount</th>
                            <th className="px-4 py-3 font-medium text-right rounded-tr-lg">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredExpenses.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-4 py-8 text-center text-zinc-500">
                                    No {category.toLowerCase()} records found.
                                </td>
                            </tr>
                        ) : (
                            filteredExpenses.map((expense) => (
                                <tr key={expense.id} className="transition-colors hover:bg-white/[0.02]">
                                    <td className="px-4 py-3">
                                        {new Date(expense.expense_date).toLocaleDateString('en-IN', {
                                            day: 'numeric', month: 'short', year: 'numeric'
                                        })}
                                    </td>
                                    <td className="px-4 py-3 max-w-[200px] truncate">
                                        <span className="text-zinc-200 font-medium">
                                            {expense.description || 'No details provided'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 font-medium text-zinc-300">
                                        ₹{expense.amount.toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 text-zinc-400 hover:text-white hover:bg-white/10">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-[160px] border-white/10 bg-zinc-950 text-zinc-300 p-1">
                                                <EditExpenseDialog expense={expense} />
                                                <DropdownMenuItem
                                                    onClick={async () => {
                                                        try {
                                                            setDeletingId(expense.id)
                                                            await deleteExpense(expense.id)
                                                            toast({ title: "Expense Deleted", description: "Expense item successfully removed." })
                                                        } catch (e: any) {
                                                            toast({ title: "Error", description: e.message, variant: "destructive" })
                                                        } finally {
                                                            setDeletingId(null)
                                                        }
                                                    }}
                                                    disabled={deletingId === expense.id}
                                                    className="relative flex cursor-pointer select-none items-center gap-2 rounded-sm text-red-400 outline-none transition-colors hover:bg-red-500/20 hover:text-red-300 focus:bg-red-500/20 focus:text-red-300 mt-1"
                                                >
                                                    {deletingId === expense.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash className="h-4 w-4" />}
                                                    <span>{deletingId === expense.id ? "Deleting..." : "Delete Record"}</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
