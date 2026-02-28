"use client"

import { useState } from "react"
import { updateUserRole } from "@/app/actions/superadmin"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function RoleSwitcher({ userId, currentRole }: { userId: string, currentRole: string }) {
  const [loading, setLoading] = useState(false)

  async function handleRoleChange(newRole: string) {
    setLoading(true)
    const res = await updateUserRole(userId, newRole)
    if (res?.success) {
      toast.success(`Role updated to ${newRole}`)
    } else {
      toast.error(res?.error || "Failed to update role")
    }
    setLoading(false)
  }

  return (
    <Select disabled={loading} onValueChange={handleRoleChange} defaultValue={currentRole}>
      <SelectTrigger className="h-8 w-[130px] border-white/10 bg-zinc-900/50 text-[10px] font-bold uppercase text-zinc-300">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-zinc-950 border-white/10 text-zinc-300">
        <SelectItem value="superadmin">SuperAdmin</SelectItem>
        <SelectItem value="admin">PG Owner</SelectItem>
        <SelectItem value="tenant">Tenant</SelectItem>
      </SelectContent>
    </Select>
  )
}