"use client"

import { useState } from "react"
import { Plus, Building2, User, Mail, Phone, MapPin, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { addPGOwner } from "@/app/actions/superadmin"
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

// Ensure "export" is present here
export function AddOwnerDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const result = await addPGOwner(formData)

    if (result?.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      })
      setLoading(false)
    } else {
      toast({
        title: "Success",
        description: "PG Owner and property registered successfully.",
      })
      setOpen(false)
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-amber-600 hover:bg-amber-700 text-white gap-2 shadow-lg shadow-amber-900/20">
          <Plus className="h-4 w-4" /> Add New Owner
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-zinc-950 border-white/10 text-zinc-100">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-amber-400">Register PG Owner</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Enter the details below to create a new administrator and their property profile.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-zinc-300">Owner Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                <Input id="fullName" name="fullName" placeholder="John Doe" className="pl-9 bg-white/5 border-white/10 focus:border-amber-500/50" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                <Input id="email" name="email" type="email" placeholder="owner@gmail.com" className="pl-9 bg-white/5 border-white/10 focus:border-amber-500/50" required />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pgName" className="text-zinc-300">PG Property Name</Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
              <Input id="pgName" name="pgName" placeholder="Royal Palms PG" className="pl-9 bg-white/5 border-white/10 focus:border-amber-500/50" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-zinc-300">Contact Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                <Input id="phone" name="phone" placeholder="+91 98765..." className="pl-9 bg-white/5 border-white/10 focus:border-amber-500/50" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="city" className="text-zinc-300">Location (City)</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                <Input id="city" name="city" placeholder="Bangalore" className="pl-9 bg-white/5 border-white/10 focus:border-amber-500/50" required />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-6 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                "Create Profile"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}