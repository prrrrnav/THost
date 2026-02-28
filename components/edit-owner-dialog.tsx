"use client"

import { useState } from "react"
import { Pencil, Building2, User, Mail, Phone, MapPin, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { updatePGOwner } from "@/app/actions/superadmin"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface EditOwnerProps {
  owner: any // The owner object from your page.tsx fetch
}

export function EditOwnerDialog({ owner }: EditOwnerProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    // The ID is passed via a hidden input in the form
    const result = await updatePGOwner(formData)

    if (result?.error) {
      toast({
        title: "Update Failed",
        description: result.error,
        variant: "destructive",
      })
      setLoading(false)
    } else {
      toast({
        title: "Success",
        description: "Owner details updated successfully.",
      })
      setOpen(false)
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-amber-400 transition-colors">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-zinc-950 border-white/10 text-zinc-100">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-amber-400">Edit Owner Details</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Modify property information or contact details for this administrator.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Hidden ID field for the server action */}
          <input type="hidden" name="id" value={owner.id} />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-fullName" className="text-zinc-300">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                <Input 
                  id="edit-fullName" 
                  name="fullName" 
                  defaultValue={owner.full_name} 
                  className="pl-9 bg-white/5 border-white/10" 
                  required 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email" className="text-zinc-300">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                <Input 
                  id="edit-email" 
                  name="email" 
                  type="email" 
                  defaultValue={owner.email} 
                  className="pl-9 bg-white/5 border-white/10" 
                  required 
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-pgName" className="text-zinc-300">PG Property Name</Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
              <Input 
                id="edit-pgName" 
                name="pgName" 
                defaultValue={owner.pg_details?.[0]?.pg_name} 
                className="pl-9 bg-white/5 border-white/10" 
                required 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-phone" className="text-zinc-300">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                <Input 
                  id="edit-phone" 
                  name="phone" 
                  defaultValue={owner.pg_details?.[0]?.contact_number} 
                  className="pl-9 bg-white/5 border-white/10" 
                  required 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-city" className="text-zinc-300">City</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                <Input 
                  id="edit-city" 
                  name="city" 
                  defaultValue={owner.city} 
                  className="pl-9 bg-white/5 border-white/10" 
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                "Update Profile"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}