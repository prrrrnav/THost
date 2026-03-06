"use client"

import { addExpense } from "@/app/actions/finance"
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
import { MinusCircle } from "lucide-react"
import { useState } from "react"

export function AddExpenseDialog() {
    const [open, setOpen] = useState(false)
    const [category, setCategory] = useState<string>("")

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {/* Aceternity Style Trigger Button */}
                <Button className="group relative h-10 overflow-hidden rounded-full border border-white/10 bg-zinc-950 px-6 transition-all duration-300 hover:border-red-500/50 hover:bg-zinc-900 hover:shadow-[0_0_20px_-5px_rgba(239,68,68,0.4)]">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-orange-600/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <MinusCircle className="relative z-10 mr-2 h-4 w-4 text-red-400 transition-transform duration-300 group-hover:scale-110" />
                    <span className="relative z-10 font-medium text-zinc-300 group-hover:text-zinc-100">
                        Add Expense
                    </span>
                </Button>
            </DialogTrigger>

            {/* Aceternity Style Glassmorphic Dialog */}
            <DialogContent className="sm:max-w-[425px] border-white/10 bg-zinc-950/80 p-6 backdrop-blur-2xl shadow-[0_0_50px_-12px_rgba(239,68,68,0.25)]">
                {/* Subtle top glow line */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />

                <DialogHeader className="mb-2">
                    <DialogTitle className="text-xl font-bold tracking-tight text-zinc-100">
                        Record New Expense
                    </DialogTitle>
                    <p className="text-sm text-zinc-400">
                        Log maintenance, salaries, or other costs. They will be deducted from your Net Profit.
                    </p>
                </DialogHeader>

                <form
                    action={async (formData) => {
                        await addExpense(formData)
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
                                placeholder="5000"
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
                        <span className="relative z-10 font-bold tracking-wide">Record Expense</span>
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
