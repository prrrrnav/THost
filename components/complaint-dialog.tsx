"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MessageSquare } from "lucide-react"
import { createComplaint } from "@/app/actions/complaints"
import { toast } from "sonner"

export function ComplaintDialog() {
  const [open, setOpen] = useState(false)

  async function handleSubmit(formData: FormData) {
    const result = await createComplaint(formData)
    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success("Complaint registered successfully")
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
      <Button variant="outline" className="border-white/10 bg-zinc-950 text-zinc-400 hover:bg-zinc-900 hover:text-emerald-400">
          <MessageSquare className="mr-2 h-4 w-4" />
          Raise Complaint
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-950 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>Submit a New Complaint</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input 
              id="subject" 
              name="subject" 
              placeholder="e.g. WiFi not working" 
              required 
              className="bg-zinc-900 border-white/10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              name="description" 
              placeholder="Provide details about the issue..." 
              className="bg-zinc-900 border-white/10 min-h-[100px]"
            />
          </div>
          <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500">
            Submit Complaint
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}