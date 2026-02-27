// "use client"

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Button } from "@/components/ui/button"
// import { Separator } from "@/components/ui/separator"

// export default function TenantProfilePage() {
//   return (
//     <div className="flex flex-col gap-6">
//       <div>
//         <h1 className="text-xl font-semibold tracking-tight text-foreground">Profile Settings</h1>
//         <p className="text-sm text-muted-foreground">Manage your personal details.</p>
//       </div>

//       <Card className="border border-border shadow-sm max-w-lg">
//         <CardHeader className="pb-3">
//           <CardTitle className="text-base font-semibold text-card-foreground">Personal Information</CardTitle>
//         </CardHeader>
//         <CardContent className="flex flex-col gap-4">
//           <div className="flex flex-col gap-1.5">
//             <Label htmlFor="name" className="text-sm font-medium text-foreground">Full Name</Label>
//             <Input id="name" defaultValue="Rahul Sharma" className="h-9" />
//           </div>
//           <div className="flex flex-col gap-1.5">
//             <Label htmlFor="email" className="text-sm font-medium text-foreground">Email</Label>
//             <Input id="email" type="email" defaultValue="rahul.sharma@email.com" className="h-9" />
//           </div>
//           <div className="flex flex-col gap-1.5">
//             <Label htmlFor="phone" className="text-sm font-medium text-foreground">Phone</Label>
//             <Input id="phone" defaultValue="+91 98765 43210" className="h-9" />
//           </div>
//           <Separator />
//           <div className="flex flex-col gap-1.5">
//             <Label className="text-sm font-medium text-foreground">Room Number</Label>
//             <Input value="A-101" disabled className="h-9" />
//           </div>
//           <div className="flex flex-col gap-1.5">
//             <Label className="text-sm font-medium text-foreground">Monthly Rent</Label>
//             <Input value="₹9,500" disabled className="h-9" />
//           </div>
//           <Button className="w-fit mt-2">Save Changes</Button>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { User, Lock, Save } from "lucide-react"

export default function TenantProfilePage() {
  return (
    <div className="flex flex-col gap-8 pb-10">
      
      {/* Page Header */}
      <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center gap-5">
          {/* Aceternity style glowing icon - Emerald Theme */}
          <div className="relative group">
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 opacity-25 blur transition duration-500 group-hover:opacity-50"></div>
            <div className="relative flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-black shadow-2xl">
              <User className="h-6 w-6 text-emerald-400" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Profile Settings</h1>
            <p className="text-sm text-zinc-400">
              Manage your personal details and contact information.
            </p>
          </div>
        </div>
      </div>

      {/* Glassmorphic Profile Card */}
      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
        <Card className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/50 backdrop-blur-xl shadow-2xl p-6 sm:p-8">
          
          {/* Subtle Aceternity Top Glow - Emerald */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
          
          <div className="mb-6">
            <h3 className="text-lg font-bold text-zinc-100">Personal Information</h3>
            <p className="text-sm text-zinc-400">Update how we can reach you.</p>
          </div>

          <form className="flex flex-col gap-6">
            {/* Editable Fields */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Full Name
                </Label>
                <Input 
                  id="name" 
                  defaultValue="Rahul Sharma" 
                  className="h-11 border-white/10 bg-zinc-900/50 text-zinc-100 focus-visible:ring-emerald-500/50" 
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Phone Number
                </Label>
                <Input 
                  id="phone" 
                  defaultValue="+91 98765 43210" 
                  className="h-11 border-white/10 bg-zinc-900/50 text-zinc-100 focus-visible:ring-emerald-500/50" 
                />
              </div>
              
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Email Address
                </Label>
                <Input 
                  id="email" 
                  type="email" 
                  defaultValue="rahul.sharma@email.com" 
                  className="h-11 border-white/10 bg-zinc-900/50 text-zinc-100 focus-visible:ring-emerald-500/50" 
                />
              </div>
            </div>

            {/* Fancy glowing separator */}
            <div className="my-2 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Locked System Fields */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Room Number <Lock className="h-3 w-3" />
                </Label>
                <Input 
                  value="A-101" 
                  disabled 
                  className="h-11 border-white/5 bg-black/40 text-zinc-500 opacity-100 cursor-not-allowed" 
                />
              </div>
              
              <div className="grid gap-2">
                <Label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Monthly Rent <Lock className="h-3 w-3" />
                </Label>
                <Input 
                  value="₹9,500" 
                  disabled 
                  className="h-11 border-white/5 bg-black/40 text-zinc-500 opacity-100 cursor-not-allowed" 
                />
              </div>
              <p className="sm:col-span-2 text-xs text-zinc-500 mt-[-8px]">
                * Room and rent details are managed by your PG Admin.
              </p>
            </div>

            {/* Glowing Submit Button */}
            <div className="mt-4 flex justify-end">
              <Button className="group relative h-11 overflow-hidden rounded-xl bg-emerald-600 px-8 text-white transition-all hover:bg-emerald-500 hover:shadow-[0_0_20px_-5px_rgba(16,185,129,0.5)]">
                <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
                  <div className="relative h-full w-8 bg-white/20" />
                </div>
                <Save className="mr-2 h-4 w-4 relative z-10" />
                <span className="relative z-10 font-bold tracking-wide">Save Changes</span>
              </Button>
            </div>
          </form>
        </Card>
      </div>

    </div>
  )
}