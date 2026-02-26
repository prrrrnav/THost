"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function TenantProfilePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Profile Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your personal details.</p>
      </div>

      <Card className="border border-border shadow-sm max-w-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-card-foreground">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name" className="text-sm font-medium text-foreground">Full Name</Label>
            <Input id="name" defaultValue="Rahul Sharma" className="h-9" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email" className="text-sm font-medium text-foreground">Email</Label>
            <Input id="email" type="email" defaultValue="rahul.sharma@email.com" className="h-9" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="phone" className="text-sm font-medium text-foreground">Phone</Label>
            <Input id="phone" defaultValue="+91 98765 43210" className="h-9" />
          </div>
          <Separator />
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium text-foreground">Room Number</Label>
            <Input value="A-101" disabled className="h-9" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium text-foreground">Monthly Rent</Label>
            <Input value="₹9,500" disabled className="h-9" />
          </div>
          <Button className="w-fit mt-2">Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  )
}
