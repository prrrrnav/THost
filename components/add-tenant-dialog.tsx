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
import { Plus } from "lucide-react"
import { useState } from "react"

export function AddTenantDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#1a73e8] hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" /> Add Tenant
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Resident</DialogTitle>
        </DialogHeader>
        <form action={async (formData) => {
          await createTenant(formData)
          setOpen(false) // Close modal after saving
        }} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" placeholder="Rajesh Kumar" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">WhatsApp Number</Label>
            <Input id="phone" name="phone" placeholder="+91..." required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="rent">Monthly Rent</Label>
              <Input id="rent" name="rent" type="number" placeholder="3000" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="due_date">Due Date (Day)</Label>
              <Input id="due_date" name="due_date" type="number" placeholder="1" required />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="room_number">Room Number</Label>
            <Input id="room_number" name="room_number" placeholder="101-B" required />
          </div>
          <Button type="submit" className="mt-2 bg-[#1a73e8]">Save Tenant</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}