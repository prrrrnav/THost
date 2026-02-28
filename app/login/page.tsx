// "use client"

// import Link from "next/link"
// import { useRouter } from "next/navigation"
// import { useState } from "react"
// import { Building2 } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Separator } from "@/components/ui/separator"


// export default function LoginPage() {


//   const router = useRouter()
//   const [role, setRole] = useState("admin") // fake role

//   const handleLogin = () => {
//     // Fake role logic (replace later with Supabase)
//     if (role === "admin") {
//       router.push("/admin")
//     } else if (role === "superadmin") {
//       router.push("/superadmin")
//     } else if (role === "tenant") {
//       router.push("/tenant")
//     }
//   }




//   return (
//     <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
//       <Card className="w-full max-w-sm border border-border shadow-lg">
//         <CardHeader className="flex flex-col items-center gap-2 pb-2">
//           <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary">
//             <Building2 className="h-5 w-5 text-primary-foreground" />
//           </div>
//           <CardTitle className="text-xl font-semibold tracking-tight text-card-foreground">
//             PG Manager
//           </CardTitle>
//           <CardDescription className="text-center text-sm">
//             Sign in to your account to continue
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="flex flex-col gap-5 pt-2">
//           <form className="flex flex-col gap-4" onSubmit={handleLogin}>
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
//                 placeholder="Enter your password"
//                 className="h-10"
//               />
//             </div>
//             <select
//               value={role}
//               onChange={(e) => setRole(e.target.value)}
//               className="w-full p-2 border rounded-md"
//             >
//               <option value="admin">Admin</option>
//               <option value="superadmin">SuperAdmin</option>
//               <option value="tenant">Tenant</option>
//             </select>

//             <button
//               type="submit"
//               className="w-full bg-blue-600 text-white p-2 rounded-md"
//             >
//               Login
//             </button>

//             {/* <Button type="submit" onSubmit={handleLogin} className="h-10 w-full font-medium">
//               Login
//             </Button> */}
//           </form>

//           <div className="flex items-center gap-3">
//             <Separator className="flex-1" />
//             <span className="text-xs text-muted-foreground">or</span>
//             <Separator className="flex-1" />
//           </div>

//           <Button variant="outline" className="h-10 w-full font-medium gap-2">
//             <svg className="h-4 w-4" viewBox="0 0 24 24">
//               <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
//               <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
//               <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
//               <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
//             </svg>
//             Login with Google
//           </Button>

//           <p className="text-center text-sm text-muted-foreground">
//             {"Don't have an account? "}
//             <Link href="/signup" className="font-medium text-primary hover:underline">
//               Sign up
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
import { loginAction } from "@/app/actions/auth"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const result = await loginAction(formData)
    console.log("Login result:", result) // Debug log to inspect the result object
    
    if (result?.error) {
      // 🚨 UPDATED ERROR TOAST: Forces a red background with stark white text
      toast({ 
        title: "Login Failed", 
        description: result.error,
        className: "bg-rose-600 text-white border-none" 
      })
      setLoading(false)
    } else if (result?.success && result.redirectTo) {
      toast({ 
        title: "Welcome back!", 
        description: "Redirecting to your dashboard...",
        className: "bg-green-600 text-white border-none" 
      })
      router.push(result.redirectTo)
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 py-12 selection:bg-indigo-500/30">
      {/* Background Grid */}
      <div className="pointer-events-none absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
        <div className="absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-violet-600 opacity-20 blur-[120px]"></div>
        <div className="absolute right-[-10%] bottom-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-600 opacity-20 blur-[120px]"></div>
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
              <CardTitle className="text-2xl font-bold tracking-tight text-zinc-100">THost<span className="text-indigo-500">.</span></CardTitle>
              <CardDescription className="text-sm text-zinc-400">Welcome back. Sign in to your account.</CardDescription>
            </div>
          </CardHeader>

          <CardContent className="flex flex-col gap-5">
            <form className="flex flex-col gap-4" onSubmit={handleLogin}>
              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Email</Label>
                <Input id="email" name="email" type="email" placeholder="you@example.com" required className="h-11 border-white/10 bg-zinc-900/50 text-zinc-100 focus-visible:ring-indigo-500/50" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Password</Label>
                <Input id="password" name="password" type="password" placeholder="••••••••" required className="h-11 border-white/10 bg-zinc-900/50 text-zinc-100 focus-visible:ring-indigo-500/50" />
              </div>

              <Button type="submit" disabled={loading} className="group relative mt-2 h-11 w-full overflow-hidden rounded-xl bg-indigo-600 text-white transition-all hover:bg-indigo-500 hover:shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)]">
                <span className="relative z-10 flex items-center gap-2 font-bold tracking-wide">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Sign In <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></>}
                </span>
              </Button>
            </form>

            <p className="text-center text-sm text-zinc-400 mt-2">
              Don't have an account? <Link href="/signup" className="font-semibold text-indigo-400 hover:text-indigo-300 hover:underline">Sign up</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}