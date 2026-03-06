// components/occupancy-overview.tsx
'use client'

import React, { useState } from 'react'
import { CheckCircle2, Home, Calendar, Loader2 } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { toast } from 'sonner'
import { confirmOccupancy, type OccupancyRecord } from '@/app/actions/occupancy'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface OccupancyOverviewProps {
  initialData: OccupancyRecord[]
}

export function OccupancyOverview({ initialData }: OccupancyOverviewProps) {
  const [data, setData] = useState<OccupancyRecord[]>(initialData)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleConfirm = async (id: string) => {
    setLoadingId(id)
    try {
      await confirmOccupancy(id)
      toast.success("Occupancy verified successfully")
      
      setData((prev) => 
        prev.map((item) => 
          item.id === id 
            ? { ...item, last_confirmed_at: new Date().toISOString() } 
            : item
        )
      )
    } catch (error) {
      console.error("Confirmation Error:", error)
      toast.error("Failed to confirm status. Please try again.")
    } finally {
      setLoadingId(null)
    }
  }

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return "Not verified"
    try {
      return format(parseISO(dateString), 'MMM dd, HH:mm')
    } catch {
      return "Invalid date"
    }
  }

  return (
    <Card className="relative overflow-hidden border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl">
      {/* Aceternity Visual Accents */}
      <div className="absolute -top-24 -left-24 h-48 w-48 bg-emerald-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 h-48 w-48 bg-amber-500/10 blur-[100px] pointer-events-none" />

      <div className="p-6 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2">
              <Home className="w-5 h-5 text-emerald-400" />
              Occupancy Overview
            </h2>
            <p className="text-sm text-zinc-500">Live status of your property rooms</p>
          </div>
          <Badge 
            variant="outline" 
            className="border-emerald-500/30 text-emerald-400 bg-emerald-500/5 px-3 py-1 animate-pulse"
          >
            Live Monitor
          </Badge>
        </div>

        <div className="rounded-lg border border-white/5 bg-black/20 overflow-hidden">
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-zinc-400 font-medium">Room</TableHead>
                <TableHead className="text-zinc-400 font-medium">Property</TableHead>
                <TableHead className="text-zinc-400 font-medium">Type</TableHead>
                <TableHead className="text-zinc-400 font-medium">Status</TableHead>
                <TableHead className="text-zinc-400 font-medium">Last Verified</TableHead>
                <TableHead className="text-right text-zinc-400 font-medium">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-zinc-500 italic">
                    No occupancy records found for your properties.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item) => (
                  <TableRow 
                    key={item.id} 
                    className="group border-white/5 hover:bg-white/[0.03] transition-all duration-300"
                  >
                    <TableCell className="font-semibold text-zinc-200">
                      {item.room_number}
                    </TableCell>
                    <TableCell className="text-zinc-400">
                      {item.property_name}
                    </TableCell>
                    <TableCell>
                      <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold bg-white/5 px-2 py-0.5 rounded">
                        {item.room_type}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={cn(
                          "transition-all duration-500",
                          item.status === 'occupied' 
                            ? "bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.05)]" 
                            : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]"
                        )}
                      >
                        <span className={cn(
                          "w-1.5 h-1.5 rounded-full mr-2",
                          item.status === 'occupied' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
                        )} />
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-zinc-400 text-sm">
                      <div className="flex items-center gap-2 group-hover:text-zinc-300 transition-colors">
                        <Calendar className="w-3.5 h-3.5 text-zinc-600" />
                        {formatDate(item.last_confirmed_at)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleConfirm(item.id)}
                        disabled={loadingId === item.id}
                        className="hover:bg-emerald-500/10 hover:text-emerald-400 text-zinc-500 transition-all active:scale-95"
                      >
                        {loadingId === item.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <div className="flex items-center">
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            <span>Confirm</span>
                          </div>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  )
}