"use client"

import { useState } from "react"
import { Bell, Megaphone, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { getPgNotifications } from "@/app/actions/settings"

interface Notification {
  id: string
  title: string
  message: string
  created_at: string
  pg_id: string
}

export function AdminNotifications({ 
  initialNotifications, 
  pgIds 
}: { 
  initialNotifications: Notification[], 
  pgIds: string[] 
}) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [isLoading, setIsLoading] = useState(false)
  const [offset, setOffset] = useState(initialNotifications.length)
  const [hasMore, setHasMore] = useState(initialNotifications.length === 5)

  const handleLoadMore = async () => {
    try {
      setIsLoading(true)
      const limit = 5
      const nextBatch = await getPgNotifications(pgIds, offset, limit)
      
      if (nextBatch.length < limit) {
        setHasMore(false)
      }
      
      setNotifications(prev => [...prev, ...nextBatch])
      setOffset(prev => prev + nextBatch.length)
    } catch (error) {
      console.error("Failed to load more notifications:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative group cursor-pointer">
          <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-0 blur transition duration-300 group-hover:opacity-30"></div>
          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9 rounded-full border border-white/5 bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
          >
            <Bell className="h-4 w-4" />
            {notifications.length > 0 && (
              <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-violet-500 shadow-[0_0_10px_2px_rgba(139,92,246,0.6)] animate-pulse" />
            )}
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 border-white/10 bg-zinc-950/90 backdrop-blur-xl mt-2 rounded-2xl shadow-2xl overflow-hidden p-0 animate-in fade-in zoom-in-95 duration-200">
        <DropdownMenuLabel className="px-4 py-3 pb-2 text-sm font-bold tracking-tight text-zinc-100 flex items-center justify-between">
          <span>Sent Notices</span>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-violet-500/20 text-violet-400 bg-violet-500/10 text-[10px] px-1.5 py-0">
              {notifications.length} Total
            </Badge>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/5" />
        <ScrollArea className="max-h-[350px] overflow-auto">
          <div className="flex flex-col p-2 gap-1 pb-3">
            {notifications.length > 0 ? (
              <>
                {notifications.map((note) => (
                  <div key={note.id} className="flex flex-col gap-1 rounded-xl p-3 hover:bg-white/5 transition-colors group">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-semibold text-zinc-200 line-clamp-1">{note.title}</span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">{note.message}</p>
                    <span className="text-[10px] text-zinc-600 mt-1 font-medium italic">
                      {new Date(note.created_at).toLocaleDateString()} at {new Date(note.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
                
                {hasMore && (
                  <div className="mt-2 px-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      disabled={isLoading}
                      onClick={handleLoadMore}
                      className="w-full rounded-lg border border-white/5 bg-zinc-900/30 text-[10px] uppercase tracking-widest text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
                    >
                      {isLoading ? (
                        <Loader2 className="h-3 w-3 animate-spin mr-2" />
                      ) : null}
                      {isLoading ? "Fetching..." : "Load Older Notices"}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <Megaphone className="h-10 w-10 text-zinc-800 mb-2 opacity-50" />
                <p className="text-xs text-zinc-500 font-medium">No notices sent yet.</p>
                <p className="text-[10px] text-zinc-600 mt-1">Visit settings to broadcast a notice.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
