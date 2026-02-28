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
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Building2, ChevronRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signupAction } from "@/app/actions/auth"
import { useToast } from "@/hooks/use-toast"

export default function SignupPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const result = await signupAction(formData)
    
    if (result?.error) {
      // 🚨 UPDATED ERROR TOAST
      toast({ 
        title: "Signup Failed", 
        description: result.error,
        className: "bg-rose-600 text-white border-none"
      })
      setLoading(false)
    } else if (result?.success) {
      toast({ 
        title: "Account Created!", 
        description: "Please sign in with your new credentials.",
        className: "bg-green-600 text-white border-none" 
      })
      router.push("/login")
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 py-12 selection:bg-indigo-500/30">
      {/* Background Grid */}
      <div className="pointer-events-none absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
        <div className="absolute right-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-violet-600 opacity-20 blur-[120px]"></div>
        <div className="absolute left-[-10%] bottom-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-600 opacity-20 blur-[120px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-sm animate-in fade-in zoom-in-95 duration-700">
        <Card className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/60 backdrop-blur-2xl shadow-[0_0_50px_-12px_rgba(79,70,229,0.25)]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

          <CardHeader className="flex flex-col items-center gap-4 pb-6 pt-8">
            <div className="relative group">
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 opacity-40 blur transition duration-500 group-hover:opacity-60"></div>
              <div className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-black shadow-2xl">
                <Building2 className="h-6 w-6 text-indigo-400" />
              </div>
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <CardTitle className="text-2xl font-bold tracking-tight text-zinc-100">Create Account</CardTitle>
              <CardDescription className="text-sm text-zinc-400">Get started with THost PG Manager.</CardDescription>
            </div>
          </CardHeader>

          <CardContent className="flex flex-col gap-5">
            <form className="flex flex-col gap-4" onSubmit={handleSignup}>
              <div className="flex flex-col gap-2">
                <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Full Name</Label>
                <Input id="name" name="name" type="text" placeholder="Rahul Sharma" required className="h-11 border-white/10 bg-zinc-900/50 text-zinc-100 focus-visible:ring-indigo-500/50" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Email</Label>
                <Input id="email" name="email" type="email" placeholder="you@example.com" required className="h-11 border-white/10 bg-zinc-900/50 text-zinc-100 focus-visible:ring-indigo-500/50" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Password</Label>
                <Input id="password" name="password" type="password" placeholder="Create a password" required className="h-11 border-white/10 bg-zinc-900/50 text-zinc-100 focus-visible:ring-indigo-500/50" />
              </div>

              <Button type="submit" disabled={loading} className="group relative mt-2 h-11 w-full overflow-hidden rounded-xl bg-indigo-600 text-white transition-all hover:bg-indigo-500 hover:shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)]">
                <span className="relative z-10 flex items-center gap-2 font-bold tracking-wide">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Create Account <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></>}
                </span>
              </Button>
            </form>

            <p className="text-center text-sm text-zinc-400 mt-2">
              Already have an account? <Link href="/login" className="font-semibold text-indigo-400 hover:text-indigo-300 hover:underline">Sign in</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}