// "use client"

// import { createTenant } from "@/app/actions/tenants"
// import { Button } from "@/components/ui/button"
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Plus } from "lucide-react"
// import { useState } from "react"

// export function AddTenantDialog() {
//   const [open, setOpen] = useState(false)

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button className="bg-[#1a73e8] hover:bg-blue-700">
//           <Plus className="mr-2 h-4 w-4" /> Add Tenant
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Add New Resident</DialogTitle>
//         </DialogHeader>
//         <form action={async (formData) => {
//           await createTenant(formData)
//           setOpen(false) // Close modal after saving
//         }} className="grid gap-4 py-4">
//           <div className="grid gap-2">
//             <Label htmlFor="name">Full Name</Label>
//             <Input id="name" name="name" placeholder="Rajesh Kumar" required />
//           </div>
//           <div className="grid gap-2">
//             <Label htmlFor="phone">WhatsApp Number</Label>
//             <Input id="phone" name="phone" placeholder="+91..." required />
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             <div className="grid gap-2">
//               <Label htmlFor="rent">Monthly Rent</Label>
//               <Input id="rent" name="rent" type="number" placeholder="3000" required />
//             </div>
//             <div className="grid gap-2">
//               <Label htmlFor="due_date">Due Date (Day)</Label>
//               <Input id="due_date" name="due_date" type="number" placeholder="1" required />
//             </div>
//           </div>
//           <div className="grid gap-2">
//             <Label htmlFor="room_number">Room Number</Label>
//             <Input id="room_number" name="room_number" placeholder="101-B" required />
//           </div>
//           <Button type="submit" className="mt-2 bg-[#1a73e8]">Save Tenant</Button>
//         </form>
//       </DialogContent>
//     </Dialog>
//   )
// }


"use client"

import { createTenant } from "@/app/actions/tenants"
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
import { Plus } from "lucide-react"
import { useState } from "react"

export function AddTenantDialog({ pgs = [] }: { pgs?: { id: string; name: string }[] }) {
  const [open, setOpen] = useState(false)
  const [selectedPg, setSelectedPg] = useState<string>(pgs.length > 0 ? pgs[0].id : "")

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* Aceternity Style Trigger Button */}
        <Button className="group relative h-10 overflow-hidden rounded-full border border-white/10 bg-zinc-950 px-6 transition-all duration-300 hover:border-violet-500/50 hover:bg-zinc-900 hover:shadow-[0_0_20px_-5px_rgba(139,92,246,0.4)]">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 to-indigo-600/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <Plus className="relative z-10 mr-2 h-4 w-4 text-violet-400 transition-transform duration-300 group-hover:rotate-90" />
          <span className="relative z-10 font-medium text-zinc-300 group-hover:text-zinc-100">
            Add Tenant
          </span>
        </Button>
      </DialogTrigger>

      {/* Aceternity Style Glassmorphic Dialog */}
      <DialogContent className="sm:max-w-[425px] border-white/10 bg-zinc-950/80 p-6 backdrop-blur-2xl shadow-[0_0_50px_-12px_rgba(139,92,246,0.25)]">
        {/* Subtle top glow line */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

        <DialogHeader className="mb-2">
          <DialogTitle className="text-xl font-bold tracking-tight text-zinc-100">
            Add New Resident
          </DialogTitle>
          <p className="text-sm text-zinc-400">
            Enter the details to register a new tenant in the system.
          </p>
        </DialogHeader>

        <form
          action={async (formData) => {
            await createTenant(formData)
            setOpen(false) // Close modal after saving
          }}
          className="grid gap-5 py-2"
        >
          {/* Form Inputs */}
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Full Name
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="Rajesh Kumar"
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
              placeholder="+91..."
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

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="rent" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Monthly Rent
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">₹</span>
                <Input
                  id="rent"
                  name="rent"
                  type="number"
                  placeholder="3000"
                  required
                  className="h-10 border-white/10 bg-zinc-900/50 pl-7 text-zinc-100 placeholder:text-zinc-600 transition-all focus-visible:border-violet-500/50 focus-visible:bg-zinc-900 focus-visible:ring-1 focus-visible:ring-violet-500/50"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="due_date" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Due Date (Day)
              </Label>
              <Input
                id="due_date"
                name="due_date"
                type="number"
                placeholder="1"
                min="1"
                max="31"
                required
                className="h-10 border-white/10 bg-zinc-900/50 text-zinc-100 placeholder:text-zinc-600 transition-all focus-visible:border-violet-500/50 focus-visible:bg-zinc-900 focus-visible:ring-1 focus-visible:ring-violet-500/50"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="room_number" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Room Number
            </Label>
            <Input
              id="room_number"
              name="room_number"
              placeholder="101-B"
              required
              className="h-10 border-white/10 bg-zinc-900/50 text-zinc-100 placeholder:text-zinc-600 transition-all focus-visible:border-violet-500/50 focus-visible:bg-zinc-900 focus-visible:ring-1 focus-visible:ring-violet-500/50"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="outstanding_amount" className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Initial Outstanding Balance (if any)
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">₹</span>
              <Input
                id="outstanding_amount"
                name="outstanding_amount"
                type="number"
                placeholder="0"
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
            <span className="relative z-10 font-bold tracking-wide">Save Tenant</span>
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}