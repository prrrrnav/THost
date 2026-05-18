// "use client"

// import { Settings, Building2, Bell, Shield, Key, Save } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Switch } from "@/components/ui/switch"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// export default function AdminSettingsPage() {
//   return (
//     <div className="flex flex-col gap-8 pb-10">

//       {/* Page Header */}
//       <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
//         <div className="flex items-center gap-5">
//           {/* Aceternity style glowing icon */}
//           <div className="relative group">
//             <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 opacity-25 blur transition duration-500 group-hover:opacity-50"></div>
//             <div className="relative flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-black shadow-2xl">
//               <Settings className="h-6 w-6 text-violet-400" />
//             </div>
//           </div>
//           <div className="flex flex-col gap-1">
//             <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Settings</h1>
//             <p className="text-sm text-zinc-400">
//               Manage your PG details, security, and notification preferences.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Settings Content Layout */}
//       <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
//         <Tabs defaultValue="general" className="w-full">

//           {/* Sleek Glassmorphic Tabs Navigation */}
//           <TabsList className="mb-8 flex h-auto w-full max-w-md gap-2 rounded-2xl border border-white/10 bg-black/40 p-2 backdrop-blur-xl">
//             <TabsTrigger 
//               value="general" 
//               className="flex-1 rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-400 transition-all data-[state=active]:bg-violet-500/10 data-[state=active]:text-violet-300 data-[state=active]:shadow-[0_0_15px_-3px_rgba(139,92,246,0.3)]"
//             >
//               <Building2 className="mr-2 h-4 w-4" />
//               General
//             </TabsTrigger>
//             <TabsTrigger 
//               value="security" 
//               className="flex-1 rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-400 transition-all data-[state=active]:bg-violet-500/10 data-[state=active]:text-violet-300 data-[state=active]:shadow-[0_0_15px_-3px_rgba(139,92,246,0.3)]"
//             >
//               <Shield className="mr-2 h-4 w-4" />
//               Security
//             </TabsTrigger>
//             <TabsTrigger 
//               value="notifications" 
//               className="flex-1 rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-400 transition-all data-[state=active]:bg-violet-500/10 data-[state=active]:text-violet-300 data-[state=active]:shadow-[0_0_15px_-3px_rgba(139,92,246,0.3)]"
//             >
//               <Bell className="mr-2 h-4 w-4" />
//               Alerts
//             </TabsTrigger>
//           </TabsList>

//           {/* ==================================================== */}
//           {/* TAB 1: GENERAL SETTINGS */}
//           {/* ==================================================== */}
//           <TabsContent value="general" className="focus-visible:outline-none focus-visible:ring-0">
//             <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/50 backdrop-blur-xl shadow-2xl p-6 sm:p-8">
//               <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

//               <div className="mb-6">
//                 <h3 className="text-lg font-bold text-zinc-100">PG Information</h3>
//                 <p className="text-sm text-zinc-400">Update the public details of your PG property.</p>
//               </div>

//               <form className="grid gap-6 sm:grid-cols-2">
//                 <div className="grid gap-2">
//                   <Label htmlFor="pgName" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">PG Name</Label>
//                   <Input id="pgName" defaultValue="THost PG" className="h-11 border-white/10 bg-zinc-900/50 text-zinc-100 focus-visible:ring-violet-500/50" />
//                 </div>
//                 <div className="grid gap-2">
//                   <Label htmlFor="contactEmail" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Contact Email</Label>
//                   <Input id="contactEmail" type="email" defaultValue="admin@thehost.com" className="h-11 border-white/10 bg-zinc-900/50 text-zinc-100 focus-visible:ring-violet-500/50" />
//                 </div>
//                 <div className="grid gap-2 sm:col-span-2">
//                   <Label htmlFor="address" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Complete Address</Label>
//                   <Input id="address" defaultValue="123 Startup Lane, Tech Park, Bangalore" className="h-11 border-white/10 bg-zinc-900/50 text-zinc-100 focus-visible:ring-violet-500/50" />
//                 </div>

//                 <div className="sm:col-span-2 mt-4 flex justify-end">
//                   <Button className="group relative h-11 overflow-hidden rounded-xl bg-violet-600 px-8 text-white transition-all hover:bg-violet-500 hover:shadow-[0_0_20px_-5px_rgba(139,92,246,0.5)]">
//                     <Save className="mr-2 h-4 w-4" />
//                     <span className="relative z-10 font-bold tracking-wide">Save Changes</span>
//                   </Button>
//                 </div>
//               </form>
//             </div>
//           </TabsContent>

//           {/* ==================================================== */}
//           {/* TAB 2: SECURITY SETTINGS */}
//           {/* ==================================================== */}
//           <TabsContent value="security" className="focus-visible:outline-none focus-visible:ring-0">
//             <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/50 backdrop-blur-xl shadow-2xl p-6 sm:p-8">
//               <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-rose-500/50 to-transparent" />

//               <div className="mb-6">
//                 <h3 className="text-lg font-bold text-zinc-100">Security & Access</h3>
//                 <p className="text-sm text-zinc-400">Protect your account and manage passwords.</p>
//               </div>

//               <div className="grid gap-8">
//                 {/* Password Change */}
//                 <div className="grid gap-4 rounded-xl border border-white/5 bg-black/20 p-5">
//                   <div className="flex items-center gap-3 mb-2">
//                     <Key className="h-5 w-5 text-zinc-400" />
//                     <h4 className="font-semibold text-zinc-200">Change Password</h4>
//                   </div>
//                   <div className="grid gap-4 sm:grid-cols-2">
//                     <div className="grid gap-2">
//                       <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Current Password</Label>
//                       <Input type="password" placeholder="••••••••" className="h-11 border-white/10 bg-zinc-900/50 focus-visible:ring-rose-500/50" />
//                     </div>
//                     <div className="grid gap-2">
//                       <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">New Password</Label>
//                       <Input type="password" placeholder="••••••••" className="h-11 border-white/10 bg-zinc-900/50 focus-visible:ring-rose-500/50" />
//                     </div>
//                   </div>
//                   <div className="flex justify-end mt-2">
//                     <Button variant="outline" className="border-white/10 bg-transparent text-zinc-300 hover:bg-white/5 hover:text-white">
//                       Update Password
//                     </Button>
//                   </div>
//                 </div>

//                 {/* 2FA Toggle */}
//                 <div className="flex items-center justify-between rounded-xl border border-white/5 bg-black/20 p-5">
//                   <div className="flex flex-col gap-1">
//                     <h4 className="font-semibold text-zinc-200">Two-Factor Authentication (2FA)</h4>
//                     <p className="text-sm text-zinc-500">Add an extra layer of security to your account.</p>
//                   </div>
//                   <Switch className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-zinc-700" />
//                 </div>
//               </div>
//             </div>
//           </TabsContent>

//           {/* ==================================================== */}
//           {/* TAB 3: NOTIFICATION SETTINGS */}
//           {/* ==================================================== */}
//           <TabsContent value="notifications" className="focus-visible:outline-none focus-visible:ring-0">
//             <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/50 backdrop-blur-xl shadow-2xl p-6 sm:p-8">
//               <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

//               <div className="mb-6">
//                 <h3 className="text-lg font-bold text-zinc-100">Notification Preferences</h3>
//                 <p className="text-sm text-zinc-400">Choose what you want to be notified about.</p>
//               </div>

//               <div className="flex flex-col gap-4">
//                 {/* Setting Item */}
//                 <div className="flex items-center justify-between rounded-xl border border-white/5 bg-black/20 p-4 transition-colors hover:bg-black/40">
//                   <div className="flex flex-col">
//                     <span className="font-medium text-zinc-200">Rent Reminders</span>
//                     <span className="text-xs text-zinc-500">Automatically send reminders to tenants on the 1st.</span>
//                   </div>
//                   <Switch defaultChecked className="data-[state=checked]:bg-violet-600" />
//                 </div>

//                 {/* Setting Item */}
//                 <div className="flex items-center justify-between rounded-xl border border-white/5 bg-black/20 p-4 transition-colors hover:bg-black/40">
//                   <div className="flex flex-col">
//                     <span className="font-medium text-zinc-200">New Tenant Alerts</span>
//                     <span className="text-xs text-zinc-500">Get notified when a new tenant profile is created.</span>
//                   </div>
//                   <Switch defaultChecked className="data-[state=checked]:bg-violet-600" />
//                 </div>

//                 {/* Setting Item */}
//                 <div className="flex items-center justify-between rounded-xl border border-white/5 bg-black/20 p-4 transition-colors hover:bg-black/40">
//                   <div className="flex flex-col">
//                     <span className="font-medium text-zinc-200">Daily Summary Emails</span>
//                     <span className="text-xs text-zinc-500">Receive a daily summary of payments and occupancy.</span>
//                   </div>
//                   <Switch className="data-[state=checked]:bg-violet-600 data-[state=unchecked]:bg-zinc-700" />
//                 </div>
//               </div>
//             </div>
//           </TabsContent>

//         </Tabs>
//       </div>
//     </div>
//   )
// }






// app/admin/settings/page.tsx
import { Settings, Building2, Bell, Shield, Key, Save, BedDouble, SquarePen, Megaphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { redirect } from "next/navigation"
import { getAdminSettings, updateAdminSettings, updateOccupancySettings, addPgRule, updatePgRule, deletePgRule, sendPgNotice } from "@/app/actions/settings"
import { Badge } from "@/components/ui/badge"

import { createClient } from "@/lib/supabase/server"
import { PgRulesManager } from "@/components/pg-rules-manager"

export const dynamic = "force-dynamic"

export default async function AdminSettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")
  const settings = await getAdminSettings()

  if (!settings) {
    redirect("/login")
  }

  // Fetch PG details
  const { data: pgDetails } = await supabase
    .from("pg_details")
    .select("*")
    .eq("owner_id", user.id)

  // Fetch all rules for all PGs owned by this user
  const pgIds = pgDetails?.map(pg => pg.id) || []
  const { data: allRules } = await supabase
    .from("property_rules")
    .select("*")
    .in("pg_id", pgIds)

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* ... (Header) */}
      <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center gap-5">
          <div className="relative group">
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 opacity-25 blur transition duration-500 group-hover:opacity-50"></div>
            <div className="relative flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-black shadow-2xl">
              <Settings className="h-6 w-6 text-violet-400" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Settings</h1>
            <p className="text-sm text-zinc-400">
              Manage your PG details, security, and notification preferences.
            </p>
          </div>
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-8 flex h-auto w-full max-w-2xl flex-wrap sm:flex-nowrap gap-2 rounded-2xl border border-white/10 bg-black/40 p-2 backdrop-blur-xl">
            <TabsTrigger value="general" className="flex-1 rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-400 transition-all data-[state=active]:bg-violet-500/10 data-[state=active]:text-violet-300">
              <Building2 className="mr-2 h-4 w-4" /> General
            </TabsTrigger>
            <TabsTrigger value="security" className="flex-1 rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-400 transition-all data-[state=active]:bg-violet-500/10 data-[state=active]:text-violet-300">
              <Shield className="mr-2 h-4 w-4" /> Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex-1 rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-400 transition-all data-[state=active]:bg-violet-500/10 data-[state=active]:text-violet-300">
              <Bell className="mr-2 h-4 w-4" /> Alerts
            </TabsTrigger>
            <TabsTrigger value="occupancy" className="flex-1 rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-400 transition-all data-[state=active]:bg-violet-500/10 data-[state=active]:text-violet-300">
              <BedDouble className="mr-2 h-4 w-4" /> Occupancy
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/50 backdrop-blur-xl shadow-2xl p-6 sm:p-8">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
              <div className="mb-6">
                <h3 className="text-lg font-bold text-zinc-100">PG Information</h3>
                <p className="text-sm text-zinc-400">Update the public details of your PG property.</p>
              </div>

              <form action={updateAdminSettings} className="grid gap-6 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="fullName" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Owner Name</Label>
                  <Input id="fullName" name="fullName" defaultValue={settings.full_name} className="h-11 border-white/10 bg-zinc-900/50 text-zinc-100" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="pgName" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">PG Name</Label>
                  <Input id="pgName" name="pgName" defaultValue={settings.pg_name || "THost PG"} className="h-11 border-white/10 bg-zinc-900/50 text-zinc-100" />
                </div>
                <div className="grid gap-2 sm:col-span-2">
                  <Label htmlFor="address" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Complete Address</Label>
                  <Input id="address" name="address" defaultValue={settings.address || ""} className="h-11 border-white/10 bg-zinc-900/50 text-zinc-100" />
                </div>

                <div className="sm:col-span-2 mt-4 flex justify-end">
                  <Button type="submit" className="group relative h-11 rounded-xl bg-violet-600 px-8 text-white hover:bg-violet-500">
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </TabsContent>

          <TabsContent value="security">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/50 backdrop-blur-xl shadow-2xl p-6 sm:p-8">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-rose-500/50 to-transparent" />
              <div className="mb-6">
                <h3 className="text-lg font-bold text-zinc-100">Security & Access</h3>
                <p className="text-sm text-zinc-400">Protect your account and manage passwords.</p>
              </div>
              <div className="grid gap-8">
                <div className="flex items-center justify-between rounded-xl border border-white/5 bg-black/20 p-5">
                  <div className="flex flex-col gap-1">
                    <h4 className="font-semibold text-zinc-200">Account Email</h4>
                    <p className="text-sm text-zinc-500">{settings.email}</p>
                  </div>
                  <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">Verified</Badge>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <div className="flex flex-col gap-8">
              {/* Refactored: PG Rules Section */}
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/50 backdrop-blur-xl shadow-2xl p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <SquarePen className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-zinc-100">PG Rules & Policies</h3>
                    <p className="text-sm text-zinc-400">Add, edit, or remove specific rules for your properties.</p>
                  </div>
                </div>

                <div className="grid gap-6">
                  {pgDetails?.map((pg) => (
                    <PgRulesManager 
                      key={pg.id} 
                      pgId={pg.id} 
                      pgName={pg.name} 
                      initialRules={allRules?.filter(r => r.pg_id === pg.id) || []} 
                    />
                  ))}
                </div>
              </div>

              {/* New: BroadCast Notice Section */}
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/50 backdrop-blur-xl shadow-2xl p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <Megaphone className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-zinc-100">BroadCast Notice</h3>
                    <p className="text-sm text-zinc-400">Send an immediate announcement to all tenants of a PG.</p>
                  </div>
                </div>

                <form action={sendPgNotice} className="grid gap-4 rounded-xl border border-white/5 bg-black/20 p-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 uppercase">Target PG</Label>
                      <select 
                        name="pgId" 
                        required
                        className="h-11 w-full rounded-xl border border-white/10 bg-zinc-900/50 px-3 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                      >
                        <option value="">Select Property</option>
                        {pgDetails?.map(pg => (
                          <option key={pg.id} value={pg.id}>{pg.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 uppercase">Notice Title</Label>
                      <Input name="title" placeholder="e.g. Maintenance Update" required className="h-11 border-white/10 bg-zinc-900/50 text-zinc-100" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 uppercase">Message Body</Label>
                    <textarea
                      name="message"
                      required
                      placeholder="Write your notice here..."
                      className="min-h-[100px] w-full rounded-xl border border-white/10 bg-zinc-900/50 p-4 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" className="bg-amber-600 hover:bg-amber-500">
                      Send to All Tenants
                    </Button>
                  </div>
                </form>
              </div>

              {/* Original Settings */}
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/50 backdrop-blur-xl shadow-2xl p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-zinc-100">Notification Preferences</h3>
                  <p className="text-sm text-zinc-400">Choose what you want to be notified about.</p>
                </div>

                <form action={updateAdminSettings} className="flex flex-col gap-4">
                  <div className="flex items-center justify-between rounded-xl border border-white/5 bg-black/20 p-4 hover:bg-black/40">
                    <div className="flex flex-col">
                      <span className="font-medium text-zinc-200">Rent Reminders</span>
                      <span className="text-xs text-zinc-500">Automatically send reminders to tenants.</span>
                    </div>
                    <Switch name="rentReminders" defaultChecked={settings.notification_settings?.rent_reminders} />
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-white/5 bg-black/20 p-4 hover:bg-black/40">
                    <div className="flex flex-col">
                      <span className="font-medium text-zinc-200">New Tenant Alerts</span>
                      <span className="text-xs text-zinc-500">Get notified of new tenant creations.</span>
                    </div>
                    <Switch name="tenantAlerts" defaultChecked={settings.notification_settings?.new_tenant_alerts} />
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button type="submit" className="bg-violet-600 hover:bg-violet-500">Save Preferences</Button>
                  </div>
                </form>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="occupancy">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/50 backdrop-blur-xl shadow-2xl p-6 sm:p-8">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
              <div className="mb-6">
                <h3 className="text-lg font-bold text-zinc-100">Occupancy Details</h3>
                <p className="text-sm text-zinc-400">Configure total bed capacities across your properties.</p>
              </div>

              <form action={updateOccupancySettings} className="grid gap-6">
                {pgDetails?.map((pg) => (
                  <div key={pg.id} className="flex flex-col gap-2 rounded-xl border border-white/5 bg-black/20 p-5 hover:bg-black/40 transition-colors">
                    <Label htmlFor={`pg_capacity_${pg.id}`} className="text-sm font-semibold text-zinc-200">
                      {pg.name} Capacity
                    </Label>
                    <div className="relative max-w-[200px]">
                      <BedDouble className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                      <Input
                        id={`pg_capacity_${pg.id}`}
                        name={`pg_capacity_${pg.id}`}
                        type="number"
                        min="0"
                        defaultValue={pg.total_beds || 0}
                        className="h-11 border-white/10 bg-zinc-900/50 pl-10 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-emerald-500/50"
                      />
                    </div>
                  </div>
                ))}

                <div className="mt-4 flex justify-end">
                  <Button type="submit" className="group relative h-11 rounded-xl bg-violet-600 px-8 text-white hover:bg-violet-500">
                    <Save className="mr-2 h-4 w-4" /> Save Capacities
                  </Button>
                </div>
              </form>
            </div>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  )
}