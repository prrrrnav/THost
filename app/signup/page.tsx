// "use client"

// import Link from "next/link"
// import { Building2 } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"

// export default function SignupPage() {
//   return (
//     <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
//       <Card className="w-full max-w-sm border border-border shadow-lg">
//         <CardHeader className="flex flex-col items-center gap-2 pb-2">
//           <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary">
//             <Building2 className="h-5 w-5 text-primary-foreground" />
//           </div>
//           <CardTitle className="text-xl font-semibold tracking-tight text-card-foreground">
//             Create Account
//           </CardTitle>
//           <CardDescription className="text-center text-sm">
//             Get started with PG Manager
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="flex flex-col gap-5 pt-2">
//           <form className="flex flex-col gap-4">
//             <div className="flex flex-col gap-1.5">
//               <Label htmlFor="name" className="text-sm font-medium text-card-foreground">
//                 Full Name
//               </Label>
//               <Input
//                 id="name"
//                 type="text"
//                 placeholder="Rahul Sharma"
//                 className="h-10"
//               />
//             </div>
//             <div className="flex flex-col gap-1.5">
//               <Label htmlFor="email" className="text-sm font-medium text-card-foreground">
//                 Email
//               </Label>
//               <Input
//                 id="email"
//                 type="email"
//                 placeholder="you@example.com"
//                 className="h-10"
//               />
//             </div>
//             <div className="flex flex-col gap-1.5">
//               <Label htmlFor="password" className="text-sm font-medium text-card-foreground">
//                 Password
//               </Label>
//               <Input
//                 id="password"
//                 type="password"
//                 placeholder="Create a password"
//                 className="h-10"
//               />
//             </div>
//             <div className="flex flex-col gap-1.5">
//               <Label htmlFor="role" className="text-sm font-medium text-card-foreground">
//                 Role
//               </Label>
//               <Select>
//                 <SelectTrigger id="role" className="h-10">
//                   <SelectValue placeholder="Select your role" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="superadmin">SuperAdmin</SelectItem>
//                   <SelectItem value="admin">Admin (PG Owner)</SelectItem>
//                   <SelectItem value="tenant">Tenant</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <Button type="submit" className="h-10 w-full font-medium">
//               Create Account
//             </Button>
//           </form>

//           <p className="text-center text-sm text-muted-foreground">
//             Already have an account?{" "}
//             <Link href="/login" className="font-medium text-primary hover:underline">
//               Login
//             </Link>
//           </p>
//         </CardContent>
//       </Card>
//     </main>
//   )
// }


"use client"

import Link from "next/link"
import { Building2, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function SignupPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 py-12 selection:bg-indigo-500/30">
      
      {/* 1. Aceternity Global Background Grid */}
      <div className="pointer-events-none absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
        {/* Giant ambient glowing orbs */}
        <div className="absolute right-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-violet-600 opacity-20 blur-[120px]"></div>
        <div className="absolute left-[-10%] bottom-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-600 opacity-20 blur-[120px]"></div>
      </div>

      {/* 2. Glassmorphic Signup Card */}
      <div className="relative z-10 w-full max-w-sm animate-in fade-in zoom-in-95 duration-700">
        <Card className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/60 backdrop-blur-2xl shadow-[0_0_50px_-12px_rgba(79,70,229,0.25)]">
          
          {/* Subtle top edge glow */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

          <CardHeader className="flex flex-col items-center gap-4 pb-6 pt-8">
            {/* Glowing Brand Icon */}
            <div className="relative group">
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 opacity-40 blur transition duration-500 group-hover:opacity-60"></div>
              <div className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-black shadow-2xl">
                <Building2 className="h-6 w-6 text-indigo-400" />
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-1 text-center">
              <CardTitle className="text-2xl font-bold tracking-tight text-zinc-100">
                Create Account
              </CardTitle>
              <CardDescription className="text-sm text-zinc-400">
                Get started with TheHost PG Manager.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="flex flex-col gap-5">
            <form className="flex flex-col gap-4">
              
              {/* Name Input */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Rahul Sharma"
                  required
                  className="h-11 border-white/10 bg-zinc-900/50 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-indigo-500/50"
                />
              </div>

              {/* Email Input */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="h-11 border-white/10 bg-zinc-900/50 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-indigo-500/50"
                />
              </div>

              {/* Password Input */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  required
                  className="h-11 border-white/10 bg-zinc-900/50 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-indigo-500/50"
                />
              </div>

              {/* Role Selection */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="role" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Role
                </Label>
                <Select>
                  <SelectTrigger id="role" className="h-11 border-white/10 bg-zinc-900/50 text-zinc-100 focus:ring-1 focus:ring-indigo-500/50 transition-all">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent className="border-white/10 bg-zinc-950 text-zinc-200">
                    <SelectItem value="admin" className="focus:bg-violet-500/20 focus:text-violet-300 cursor-pointer">Admin (PG Owner)</SelectItem>
                    <SelectItem value="superadmin" className="focus:bg-amber-500/20 focus:text-amber-300 cursor-pointer">SuperAdmin</SelectItem>
                    <SelectItem value="tenant" className="focus:bg-emerald-500/20 focus:text-emerald-300 cursor-pointer">Tenant</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Glowing Submit Button */}
              <Button 
                type="submit" 
                className="group relative mt-2 h-11 w-full overflow-hidden rounded-xl bg-indigo-600 text-white transition-all hover:bg-indigo-500 hover:shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)]"
              >
                <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
                  <div className="relative h-full w-8 bg-white/20" />
                </div>
                <span className="relative z-10 flex items-center gap-2 font-bold tracking-wide">
                  Create Account <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Button>
            </form>

            <p className="text-center text-sm text-zinc-400 mt-2">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-indigo-400 transition-colors hover:text-indigo-300 hover:underline">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}