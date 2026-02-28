"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Bell, Info, AlertTriangle, Megaphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

export function NotificationsModal({ userEmail }: { userEmail: string }) {
  const [notifications, setNotifications] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .or(`target_tenant_email.eq.all,target_tenant_email.eq.${userEmail}`)
        .order("created_at", { ascending: false })
      
      if (data) setNotifications(data)
    }
    fetchNotifications()
  }, [userEmail, supabase])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="relative group">
          <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 blur transition duration-300 group-hover:opacity-30"></div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative h-9 w-9 rounded-full border border-white/5 bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
          >
            <Bell className="h-4 w-4" />
            {notifications.length > 0 && (
              <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_2px_rgba(16,185,129,0.6)] animate-pulse" />
            )}
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-white/10 text-zinc-100 backdrop-blur-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Megaphone className="h-5 w-5 text-emerald-400" />
            Latest Updates
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-800">
          {notifications.length > 0 ? (
            notifications.map((note) => (
              <div 
                key={note.id} 
                className="group relative flex flex-col gap-2 rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.04]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500/80">
                    {note.type || 'Announcement'}
                  </span>
                  <span className="text-[10px] text-zinc-500">
                    {new Date(note.created_at).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-zinc-200">{note.title}</h4>
                <p className="text-xs leading-relaxed text-zinc-400">{note.message}</p>
              </div>
            ))
          ) : (
            <div className="py-10 text-center text-zinc-500 italic text-sm">
              No new updates from the owner.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}