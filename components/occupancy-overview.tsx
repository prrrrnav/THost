import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BedDouble, DoorOpen, Home, Users } from "lucide-react"

const occupancyData = [
  { label: "Total Rooms", value: 30, icon: DoorOpen, color: "text-primary", bg: "bg-primary/10" },
  { label: "Total Beds", value: 60, icon: BedDouble, color: "text-primary", bg: "bg-primary/10" },
  { label: "Occupied", value: 48, icon: Users, color: "text-success", bg: "bg-success/10" },
  { label: "Vacant", value: 12, icon: Home, color: "text-warning", bg: "bg-warning/10" },
]

export function OccupancyOverview() {
  const occupancyRate = Math.round((48 / 60) * 100)

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-card-foreground">
          Occupancy Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {occupancyData.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 rounded-xl border border-border bg-background p-3"
            >
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${item.bg}`}>
                <item.icon className={`h-4 w-4 ${item.color}`} />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-foreground">{item.value}</span>
                <span className="text-[11px] text-muted-foreground">{item.label}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Occupancy Rate</span>
            <span className="text-sm font-bold text-primary">{occupancyRate}%</span>
          </div>
          <Progress value={occupancyRate} className="h-2.5" />
        </div>
      </CardContent>
    </Card>
  )
}
