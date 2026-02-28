// app/actions/occupancy.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type OccupancyRecord = {
  id: string
  property_name: string
  room_number: string
  room_type: string
  status: 'occupied' | 'vacant' | 'maintenance'
  last_confirmed_at: string
}

export async function getOccupancyData(): Promise<OccupancyRecord[]> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized access")

  const { data, error } = await supabase
    .from('occupancy')
    .select('*')
    .eq('owner_id', user.id)
    .order('room_number', { ascending: true })

  if (error) {
    console.error('Error fetching occupancy:', error)
    return []
  }

  return data as OccupancyRecord[]
}

export async function confirmOccupancy(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('occupancy')
    .update({ last_confirmed_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw error
  revalidatePath('/admin')
}