"use client"

import { Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { deleteComplaint } from "@/app/actions/complaints"
import { useState } from "react"
import { toast } from "sonner"

export function DeleteComplaintButton({ id }: { id: string }) {
  const [isPending, setIsPending] = useState(false)

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this complaint?")) return
    
    setIsPending(true)
    const result = await deleteComplaint(id)
    
    if (result?.error) {
      toast.error(result.error)
      setIsPending(false)
    } else {
      toast.success("Complaint deleted")
    }
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={handleDelete}
      disabled={isPending}
      className="h-8 w-8 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10"
    >
      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
    </Button>
  )
}