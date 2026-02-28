// import { createClient } from "@/lib/supabase/server"
// import { redirect } from "next/navigation"
// import { Card, CardContent } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { User, Lock, Save } from "lucide-react"
// import { ChangePasswordModal } from "@/components/change-password-modal"
// import { updateProfile } from "@/app/actions/profile"

// export default async function TenantProfilePage() {
//   const supabase = await createClient()
  
//   // 1. Get the current logged-in user session
//   const { data: { user } } = await supabase.auth.getUser()
//   if (!user) redirect("/login")

//   // 2. Fetch the tenant data matching the logged-in email
//   const { data: tenant } = await supabase
//     .from("tenants")
//     .select("*")
//     .eq("email", user.email)
//     .single()

//   return (
//     <div className="flex flex-col gap-8 pb-10">
//       {/* Page Header */}
//       <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
//         <div className="flex items-center gap-5">
//           <div className="relative group">
//             <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 opacity-25 blur transition duration-500 group-hover:opacity-50"></div>
//             <div className="relative flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-black shadow-2xl">
//               <User className="h-6 w-6 text-emerald-400" />
//             </div>
//           </div>
//           <div className="flex flex-col gap-1">
//             <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Profile Settings</h1>
//             {/* Dynamic Greeting based on DB name or Auth metadata */}
//             <p className="text-sm text-zinc-400">
//               Welcome back, {tenant?.name || user?.user_metadata?.full_name || "Tenant"}. Manage your personal details here.
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
//         <Card className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/50 backdrop-blur-xl shadow-2xl">
//           <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
          
//           <CardContent className="p-6 sm:p-8">
//             <div className="mb-8">
//               <h3 className="text-xl font-bold text-zinc-100">Personal Information</h3>
//               <p className="text-sm text-zinc-400">Update how we can reach you.</p>
//             </div>

//             <form action={updateProfile} className="flex flex-col gap-8 w-full">
//               {/* Personal Details Grid */}
//               <div className="grid gap-6 sm:grid-cols-2">
//                 <div className="grid gap-2">
//                   <Label htmlFor="fullName" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Full Name</Label>
//                   <Input
//                     id="fullName"
//                     name="fullName"
//                     defaultValue={tenant?.name || user?.user_metadata?.full_name || ""}
//                     className="h-11 border-white/10 bg-zinc-900/50 text-zinc-100 focus-visible:ring-emerald-500/50"
//                   />
//                 </div>

//                 <div className="grid gap-2">
//                   <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Phone Number</Label>
//                   <Input
//                     disabled
//                     defaultValue={tenant?.phone || "Not Provided"}
//                     className="h-11 border-white/10 bg-zinc-900/50 text-zinc-500 cursor-not-allowed"
//                   />
//                 </div>

//                 <div className="grid gap-2 sm:col-span-2">
//                   <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Email Address</Label>
//                   <Input
//                     disabled
//                     defaultValue={user.email}
//                     className="h-11 border-white/10 bg-zinc-900/50 text-zinc-500 cursor-not-allowed"
//                   />
//                 </div>
//               </div>

//               {/* Security & Access Section */}
//               <div className="pt-8 border-t border-white/10">
//                 <div className="mb-6">
//                   <h3 className="text-lg font-semibold text-zinc-100">Security & Access</h3>
//                   <p className="text-sm text-zinc-500">Manage your account security and verification.</p>
//                 </div>
                
//                 <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border border-white/5 bg-white/[0.03] gap-4 transition-colors hover:bg-white/[0.05]">
//                   <div className="space-y-1">
//                     <p className="text-base font-medium text-zinc-200">Account Password</p>
//                     <p className="text-sm text-zinc-500">Ensure your account is using a strong, unique password.</p>
//                   </div>
//                   <div className="flex-shrink-0">
//                     <ChangePasswordModal />
//                   </div>
//                 </div>
//               </div>

//               {/* Locked System Fields */}
//               <div className="grid gap-6 sm:grid-cols-2 p-5 rounded-2xl bg-black/30 border border-white/5">
//                 <div className="grid gap-2">
//                   <Label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-500">
//                     Room Number <Lock className="h-3 w-3" />
//                   </Label>
//                   <p className="text-lg font-bold text-zinc-300">{tenant?.room_number || "Unassigned"}</p>
//                 </div>

//                 <div className="grid gap-2">
//                   <Label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-500">
//                     Monthly Rent <Lock className="h-3 w-3" />
//                   </Label>
//                   <p className="text-lg font-bold text-zinc-300">₹{tenant?.rent_amount || "0"}</p>
//                 </div>
//               </div>

//               <div className="flex justify-end pt-4">
//                 <button type="submit" className="group relative h-11 overflow-hidden rounded-xl bg-emerald-600 px-8 text-white transition-all hover:bg-emerald-500 hover:shadow-[0_0_20px_-5px_rgba(16,185,129,0.5)]">
//                   <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
//                     <div className="relative h-full w-8 bg-white/20" />
//                   </div>
//                   <div className="flex items-center relative z-10">
//                     <Save className="mr-2 h-4 w-4" />
//                     <span className="font-bold tracking-wide">Save Changes</span>
//                   </div>
//                 </button>
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Lock, Save } from "lucide-react"
import { ChangePasswordModal } from "@/components/change-password-modal"
import { updateProfile } from "@/app/actions/profile"

export default async function TenantProfilePage() {
  const supabase = await createClient()
  
  // 1. Get the current logged-in user session
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // 2. Fetch the tenant data matching the logged-in email
  const { data: tenant } = await supabase
    .from("tenants")
    .select("*")
    .eq("email", user.email)
    .single()

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Page Header */}
      <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center gap-5">
          <div className="relative group">
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 opacity-25 blur transition duration-500 group-hover:opacity-50"></div>
            <div className="relative flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-black shadow-2xl">
              <User className="h-6 w-6 text-emerald-400" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Profile Settings</h1>
            {/* Dynamic Greeting based on DB name or Auth metadata */}
            <p className="text-sm text-zinc-400">
              Welcome back, {tenant?.name || user?.user_metadata?.full_name || "Tenant"}. Manage your personal details here.
            </p>
          </div>
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
        <Card className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/50 backdrop-blur-xl shadow-2xl">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
          
          <CardContent className="p-6 sm:p-8">
            <div className="mb-8">
              <h3 className="text-xl font-bold text-zinc-100">Personal Information</h3>
              <p className="text-sm text-zinc-400">Update how we can reach you.</p>
            </div>

            <form action={updateProfile} className="flex flex-col gap-8 w-full">
              {/* Personal Details Grid */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="fullName" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    defaultValue={tenant?.name || user?.user_metadata?.full_name || ""}
                    className="h-11 border-white/10 bg-zinc-900/50 text-zinc-100 focus-visible:ring-emerald-500/50"
                  />
                </div>

                <div className="grid gap-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Phone Number</Label>
                  <Input
                    disabled
                    defaultValue={tenant?.phone || "Not Provided"}
                    className="h-11 border-white/10 bg-zinc-900/50 text-zinc-500 cursor-not-allowed opacity-70"
                  />
                </div>

                <div className="grid gap-2 sm:col-span-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Email Address</Label>
                  <Input
                    disabled
                    defaultValue={user.email}
                    className="h-11 border-white/10 bg-zinc-900/50 text-zinc-500 cursor-not-allowed opacity-70"
                  />
                </div>
              </div>

              {/* Security & Access Section */}
              <div className="pt-8 border-t border-white/10">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-zinc-100">Security & Access</h3>
                  <p className="text-sm text-zinc-500">Manage your account security and verification.</p>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border border-white/5 bg-white/[0.03] gap-4 transition-colors hover:bg-white/[0.05]">
                  <div className="space-y-1">
                    <p className="text-base font-medium text-zinc-200">Account Password</p>
                    <p className="text-sm text-zinc-500">Ensure your account is using a strong, unique password.</p>
                  </div>
                  <div className="flex-shrink-0">
                    <ChangePasswordModal />
                  </div>
                </div>
              </div>

              {/* Locked System Fields - Darker for contrast */}
              <div className="grid gap-6 sm:grid-cols-2 p-5 rounded-2xl bg-black/40 border border-white/5">
                <div className="grid gap-2">
                  <Label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Room Number <Lock className="h-3 w-3" />
                  </Label>
                  <p className="text-lg font-bold text-zinc-300">{tenant?.room_number || "Unassigned"}</p>
                </div>

                <div className="grid gap-2">
                  <Label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Monthly Rent <Lock className="h-3 w-3" />
                  </Label>
                  <p className="text-lg font-bold text-zinc-300">₹{tenant?.rent_amount || "0"}</p>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex justify-end pt-4">
                <button 
                  type="submit" 
                  className="group relative h-11 overflow-hidden rounded-xl bg-emerald-600 px-8 text-white transition-all hover:bg-emerald-500 hover:shadow-[0_0_20px_-5px_rgba(16,185,129,0.5)] focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                >
                  <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
                    <div className="relative h-full w-8 bg-white/20" />
                  </div>
                  <div className="flex items-center relative z-10">
                    <Save className="mr-2 h-4 w-4" />
                    <span className="font-bold tracking-wide">Save Changes</span>
                  </div>
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}