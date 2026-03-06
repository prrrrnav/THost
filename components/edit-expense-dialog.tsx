"use client"

import { updateExpense } from "@/app/actions/finance"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Pencil } from "lucide-react"
import { useState } from "react"

type Expense = {
    id: string;
    category: string;
    amount: number;
    description: string;
    expense_date: string;
    created_at: string;
}

export function EditExpenseDialog({ expense }: { expense: Expense }) {
    const [open, setOpen] = useState(false)
    const [category, setCategory] = useState<string>(expense.category)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div
                    role="button"
                    className="relative flex w-full cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white"
                    onClick={() => setOpen(true)}
                >
                    <Pencil className="h-4 w-4" />
                    <span>Edit Details</span>
                </div>
            </DialogTrigger>

            {/* Aceternity Style Glassmorphic Dialog */}
            <DialogContent className="sm:max-w-[425px] border-white/10 bg-zinc-950/80 p-6 backdrop-blur-2xl shadow-[0_0_50px_-12px_rgba(239,68,68,0.25)]">
                {/* Subtle top glow line */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />

                <DialogHeader className="mb-2">
                    <DialogTitle className="text-xl font-bold tracking-tight text-zinc-100">
                        Edit Expense
                    </DialogTitle>
                    <p className="text-sm text-zinc-400">
                        Update the details for this recorded expense.
                    </p>
                </DialogHeader>

                <form
                    action={async (formData) => {
                        await updateExpense(expense.id, formData)
                        setOpen(false) // Close modal after saving
                    }}
                    className="grid gap-5 py-2"
                >
                    {/* Form Inputs */}
                    <div className="grid gap-2">
                        <Label htmlFor="category" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                            Expense Category
                        </Label>
                        <input type="hidden" name="category" value={category} required />
                        <Select value={category} onValueChange={setCategory} required>
                            <SelectTrigger className="h-10 border-white/10 bg-zinc-900/50 text-zinc-100 placeholder:text-zinc-600 transition-all focus-visible:border-red-500/50 focus-visible:bg-zinc-900 focus-visible:ring-1 focus-visible:ring-red-500/50" id="category">
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent className="border-white/10 bg-zinc-950 text-zinc-200">
                                <SelectItem value="Groceries" className="cursor-pointer focus:bg-red-500/20 focus:text-red-300">
                                    Groceries & Food
                                </SelectItem>
                                <SelectItem value="Maintenance" className="cursor-pointer focus:bg-red-500/20 focus:text-red-300">
                                    Maintenance
                                </SelectItem>
                                <SelectItem value="Salary" className="cursor-pointer focus:bg-red-500/20 focus:text-red-300">
                                    Salary
                                </SelectItem>
                                <SelectItem value="Utilities" className="cursor-pointer focus:bg-red-500/20 focus:text-red-300">
                                    Utilities & Bills
                                </SelectItem>
                                <SelectItem value="Other" className="cursor-pointer focus:bg-red-500/20 focus:text-red-300">
                                    Other
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="amount" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                            Amount
                        </Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">₹</span>
                            <Input
                                id="amount"
                                name="amount"
                                type="number"
                                defaultValue={expense.amount}
                                required
                                className="h-10 border-white/10 bg-zinc-900/50 pl-7 text-zinc-100 placeholder:text-zinc-600 transition-all focus-visible:border-red-500/50 focus-visible:bg-zinc-900 focus-visible:ring-1 focus-visible:ring-red-500/50"
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                            Description (Optional)
                        </Label>
                        <Input
                            id="description"
                            name="description"
                            defaultValue={expense.description}
                            placeholder="e.g. Plumber fix for room 102"
                            className="h-10 border-white/10 bg-zinc-900/50 text-zinc-100 placeholder:text-zinc-600 transition-all focus-visible:border-red-500/50 focus-visible:bg-zinc-900 focus-visible:ring-1 focus-visible:ring-red-500/50"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="expense_date" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                            Date
                        </Label>
                        <Input
                            id="expense_date"
                            name="expense_date"
                            type="date"
                            defaultValue={expense.expense_date.split('T')[0]}
                            className="h-10 border-white/10 bg-zinc-900/50 text-zinc-100 placeholder:text-zinc-600 transition-all focus-visible:border-red-500/50 focus-visible:bg-zinc-900 focus-visible:ring-1 focus-visible:ring-red-500/50 [color-scheme:dark]"
                        />
                    </div>

                    {/* Glowing Submit Button */}
                    <Button
                        type="submit"
                        className="group relative mt-4 h-11 w-full overflow-hidden rounded-xl bg-red-600 text-white transition-all hover:bg-red-500 hover:shadow-[0_0_20px_-5px_rgba(239,68,68,0.5)]"
                    >
                        <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
                            <div className="relative h-full w-8 bg-white/20" />
                        </div>
                        <span className="relative z-10 font-bold tracking-wide">Save Changes</span>
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
