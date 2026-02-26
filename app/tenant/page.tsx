"use client"

import { useState } from "react"
import { IndianRupee, CalendarDays, CheckCircle2, AlertCircle, Download, MessageSquare } from "lucide-react"
import { paymentHistory, formatCurrency } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const tenantStats = [
  {
    title: "Current Rent",
    value: "₹9,500",
    icon: IndianRupee,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    title: "Due Date",
    value: "1st Mar 2026",
    icon: CalendarDays,
    color: "text-warning",
    bg: "bg-warning/10",
  },
  {
    title: "Payment Status",
    value: "Paid",
    icon: CheckCircle2,
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    title: "Outstanding",
    value: "₹0",
    icon: AlertCircle,
    color: "text-muted-foreground",
    bg: "bg-muted",
  },
]

export default function TenantDashboard() {
  const [complaintOpen, setComplaintOpen] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">My Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Welcome, Rahul. Room A-101.
          </p>
        </div>
        <Dialog open={complaintOpen} onOpenChange={setComplaintOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="mt-3 gap-2 md:mt-0">
              <MessageSquare className="h-4 w-4" />
              Raise Complaint
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Raise a Complaint</DialogTitle>
              <DialogDescription>
                Describe your issue and we will get back to you shortly.
              </DialogDescription>
            </DialogHeader>
            <form className="flex flex-col gap-4 pt-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="subject" className="text-sm font-medium">Subject</Label>
                <Input id="subject" placeholder="e.g. Water supply issue" className="h-9" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                <Textarea id="description" placeholder="Describe the issue in detail..." rows={4} />
              </div>
              <Button type="button" onClick={() => setComplaintOpen(false)}>
                Submit Complaint
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tenantStats.map((stat) => (
          <Card key={stat.title} className="border border-border shadow-sm">
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {stat.title}
                </span>
                <span className="text-lg font-bold text-card-foreground">{stat.value}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payment History */}
      <Card className="border border-border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-card-foreground">
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Month</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Amount</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</TableHead>
                <TableHead className="pr-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">Receipt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentHistory.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="pl-6 text-sm font-medium text-foreground">{record.month}</TableCell>
                  <TableCell className="text-sm text-foreground font-medium">{formatCurrency(record.amount)}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="bg-success/10 text-success border-success/20"
                    >
                      {record.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                      <Download className="h-3.5 w-3.5" />
                      Download
                    </Button>
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
