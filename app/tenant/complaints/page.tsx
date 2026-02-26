import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const complaints = [
  { id: "1", subject: "Water supply issue", date: "15th Feb 2026", status: "Resolved" },
  { id: "2", subject: "WiFi not working", date: "28th Jan 2026", status: "Resolved" },
  { id: "3", subject: "AC maintenance needed", date: "10th Jan 2026", status: "In Progress" },
]

function statusClasses(status: string) {
  switch (status) {
    case "Resolved":
      return "bg-success/10 text-success border-success/20"
    case "In Progress":
      return "bg-warning/10 text-warning-foreground border-warning/20"
    default:
      return "bg-muted text-muted-foreground border-border"
  }
}

export default function TenantComplaintsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">My Complaints</h1>
        <p className="text-sm text-muted-foreground">Track your submitted complaints.</p>
      </div>

      <Card className="border border-border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-card-foreground">Complaint History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Subject</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</TableHead>
                <TableHead className="pr-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {complaints.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="pl-6 text-sm font-medium text-foreground">{c.subject}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{c.date}</TableCell>
                  <TableCell className="pr-6">
                    <Badge variant="secondary" className={statusClasses(c.status)}>
                      {c.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
