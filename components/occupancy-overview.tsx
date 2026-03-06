import { createClient } from "@/lib/supabase/server"
import { OccupancyOverviewClient } from "./occupancy-overview-client"

export async function OccupancyOverview() {
  const supabase = await createClient()

  // 1. Get logged-in user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // 2. Fetch all properties owned by this Admin safely
  // Try querying with total_beds. If it fails (user hasn't run the SQL script), fallback to just id and name.
  let properties: any[] = []

  const { data: pgDetailsWithBeds, error: bedsError } = await supabase
    .from("pg_details")
    .select("id, name, total_beds")
    .eq("owner_id", user.id)

  if (bedsError) {
    // total_beds column likely missing
    const { data: pgDetailsBasic } = await supabase
      .from("pg_details")
      .select("id, name")
      .eq("owner_id", user.id)

    if (pgDetailsBasic) {
      properties = pgDetailsBasic.map((pg: any) => ({
        ...pg,
        total_beds: 0
      }))
    }
  } else if (pgDetailsWithBeds) {
    properties = pgDetailsWithBeds
  }

  // 3. For each property, calculate live occupancy from the `tenants` table
  const enrichedProperties = await Promise.all(
    properties.map(async (pg: any) => {
      // Find all ACTIVE tenants linked to this specific PG safely
      const { count: occupiedCount, error: tenantError } = await supabase
        .from("tenants")
        .select("id", { count: "exact" })
        .eq("pg_id", pg.id)

      // If there's an error (e.g., pg_id column is missing), fallback to 0
      const occupied = tenantError ? 0 : (occupiedCount || 0)
      const totalBeds = pg.total_beds || 0
      const vacant = Math.max(0, totalBeds - occupied)

      return {
        id: pg.id,
        name: pg.name,
        total_beds: totalBeds,
        occupied_beds: occupied,
        vacant_beds: vacant
      }
    })
  )

  return <OccupancyOverviewClient properties={enrichedProperties} />
}