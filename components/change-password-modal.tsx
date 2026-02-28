"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export function ChangePasswordModal() {
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const supabase = createClient()




  
  const handleUpdate = async () => {
    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters")
    }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (error) {
      toast.error(error.message)
    } else {
      toast.success("Password updated successfully!")
      setOpen(false)
      setPassword("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-white/10 hover:bg-white/5">
          Change Password
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-950 border-white/10">
        <DialogHeader>
          <DialogTitle className="text-zinc-100">Update Security</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-zinc-400">New Password</Label>
            <Input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-zinc-900 border-white/10 text-white"
            />
          </div>
          <Button 
            onClick={handleUpdate} 
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white"
          >
            {loading ? "Updating..." : "Save New Password"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}