"use client"

import { useState } from "react"
import { updateTenant } from "@/app/actions/tenants"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pencil } from "lucide-react"

export function EditTenantDialog({ tenant, pgs = [] }: { tenant: any, pgs?: { id: string; name: string }[] }) {
  const [open, setOpen] = useState(false)
  // Store status in state to ensure it updates correctly
  const [status, setStatus] = useState(tenant.status || "Pending")
  // Store pg_id in state to update correctly. Default to tenant's current PG.
  const [selectedPg, setSelectedPg] = useState(tenant.pg_id || (pgs.length > 0 ? pgs[0].id : ""))

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* Sleek, dark-mode friendly trigger button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-zinc-400 transition-colors hover:bg-violet-500/10 hover:text-violet-300"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      {/* Aceternity Style Glassmorphic Dialog */}
      <DialogContent className="sm:max-w-[425px] border-white/10 bg-zinc-950/80 p-6 backdrop-blur-2xl shadow-[0_0_50px_-12px_rgba(139,92,246,0.25)]">
        {/* Subtle top glow line */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

        <DialogHeader className="mb-2">
          <DialogTitle className="text-xl font-bold tracking-tight text-zinc-100">
            Edit Tenant Details
          </DialogTitle>
          <p className="text-sm text-zinc-400">
            Update resident information and payment status.
          </p>
        </DialogHeader>

        <form
          action={async (formData) => {
            await updateTenant(formData)
            setOpen(false)
          }}
          className="grid gap-5 py-2"
        >
          <input type="hidden" name="id" value={tenant.id} />

          {/* 👇 HIDDEN INPUT TO FORCE STATUS UPDATE */}
          <input type="hidden" name="status" value={status} />

          <div className="grid gap-2">
            <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Full Name
            </Label>
            <Input
              id="name"
              name="name"
              defaultValue={tenant.name}
              required
              className="h-10 border-white/10 bg-zinc-900/50 text-zinc-100 placeholder:text-zinc-600 transition-all focus-visible:border-violet-500/50 focus-visible:bg-zinc-900 focus-visible:ring-1 focus-visible:ring-violet-500/50"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              WhatsApp Number
            </Label>
            <Input
              id="phone"
              name="phone"
              defaultValue={tenant.phone}
              required
              className="h-10 border-white/10 bg-zinc-900/50 text-zinc-100 placeholder:text-zinc-600 transition-all focus-visible:border-violet-500/50 focus-visible:bg-zinc-900 focus-visible:ring-1 focus-visible:ring-violet-500/50"
            />
          </div>

          {pgs.length > 1 && (
            <div className="grid gap-2">
              <Label htmlFor="pg_id" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                PG Property
              </Label>
              <Select value={selectedPg} onValueChange={setSelectedPg} required>
                <SelectTrigger className="h-10 border-white/10 bg-zinc-900/50 text-zinc-100 placeholder:text-zinc-600 transition-all focus-visible:border-violet-500/50 focus-visible:bg-zinc-900 focus-visible:ring-1 focus-visible:ring-violet-500/50" id="pg_id">
                  <SelectValue placeholder="Select Property" />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-zinc-950 text-zinc-200">
                  {pgs.map((pg) => (
                    <SelectItem key={pg.id} value={pg.id} className="cursor-pointer focus:bg-violet-500/20 focus:text-violet-300">
                      {pg.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <input type="hidden" name="pg_id" value={selectedPg} />

          <div className="grid gap-2">
            <Label htmlFor="room_number" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Room Number
            </Label>
            <Input
              id="room_number"
              name="room_id"
              defaultValue={tenant.room_number}
              required
              className="h-10 border-white/10 bg-zinc-900/50 text-zinc-100 placeholder:text-zinc-600 transition-all focus-visible:border-violet-500/50 focus-visible:bg-zinc-900 focus-visible:ring-1 focus-visible:ring-violet-500/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="rent" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Rent Amount
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">₹</span>
                <Input
                  id="rent"
                  name="rent"
                  type="number"
                  defaultValue={tenant.rent_amount}
                  required
                  className="h-10 border-white/10 bg-zinc-900/50 pl-7 text-zinc-100 placeholder:text-zinc-600 transition-all focus-visible:border-violet-500/50 focus-visible:bg-zinc-900 focus-visible:ring-1 focus-visible:ring-violet-500/50"
                />
              </div>
            </div>

            <div className="grid gap-2 col-span-2">
              <Label htmlFor="payable_amount" className="text-xs font-semibold uppercase tracking-wider text-violet-400">
                This Month's Payable Amount (Overrides Rent)
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">₹</span>
                <Input
                  id="payable_amount"
                  name="payable_amount"
                  type="number"
                  defaultValue={tenant.rent_amount}
                  className="h-10 border-violet-500/30 bg-violet-500/5 pl-7 text-zinc-100 placeholder:text-zinc-600 transition-all focus-visible:border-violet-500 focus-visible:bg-zinc-900 focus-visible:ring-1 focus-visible:ring-violet-500 shadow-[0_0_15px_-5px_rgba(139,92,246,0.3)]"
                />
              </div>
              <p className="text-[10px] text-zinc-500">Change this if the tenant is paying a different amount this month (e.g. 0 or discounted).</p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="due_date" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Due Date
              </Label>
              <Input
                id="due_date"
                name="due_date"
                type="number"
                min="1"
                max="31"
                defaultValue={tenant.due_date}
                required
                className="h-10 border-white/10 bg-zinc-900/50 text-zinc-100 placeholder:text-zinc-600 transition-all focus-visible:border-violet-500/50 focus-visible:bg-zinc-900 focus-visible:ring-1 focus-visible:ring-violet-500/50"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Payment Status
            </Label>
            <Select
              value={status}
              onValueChange={setStatus}
            >
              <SelectTrigger className="h-10 border-white/10 bg-zinc-900/50 text-zinc-100 transition-all focus:border-violet-500/50 focus:bg-zinc-900 focus:ring-1 focus:ring-violet-500/50">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-zinc-950 text-zinc-200">
                {/* Status items with custom dark-mode highlight colors */}
                <SelectItem value="Paid" className="focus:bg-emerald-500/20 focus:text-emerald-300 cursor-pointer">
                  Paid
                </SelectItem>
                <SelectItem value="Pending" className="focus:bg-amber-500/20 focus:text-amber-300 cursor-pointer">
                  Pending
                </SelectItem>
                <SelectItem value="Overdue" className="focus:bg-rose-500/20 focus:text-rose-300 cursor-pointer">
                  Overdue
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="outstanding_amount" className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Total Outstanding Balance
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">₹</span>
              <Input
                id="outstanding_amount"
                name="outstanding_amount"
                type="number"
                defaultValue={tenant.outstanding_amount || 0}
                className="h-10 border-emerald-500/20 bg-emerald-500/5 pl-7 text-zinc-100 placeholder:text-zinc-600 transition-all focus-visible:border-emerald-500/50 focus-visible:bg-zinc-900 focus-visible:ring-1 focus-visible:ring-emerald-500/50"
              />
            </div>
          </div>

          {/* Glowing Submit Button */}
          <Button
            type="submit"
            className="group relative mt-4 h-11 w-full overflow-hidden rounded-xl bg-violet-600 text-white transition-all hover:bg-violet-500 hover:shadow-[0_0_20px_-5px_rgba(139,92,246,0.5)]"
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