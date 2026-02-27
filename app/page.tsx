// // import Link from "next/link"
// // import { Building2, ShieldCheck, Users, ArrowRight } from "lucide-react"

// // export default function Home() {
// //   return (
// //     <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
// //       <div className="w-full max-w-md flex flex-col items-center gap-8">
// //         <div className="flex flex-col items-center gap-2">
// //           <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
// //             <Building2 className="h-6 w-6 text-primary-foreground" />
// //           </div>
// //           <h1 className="text-2xl font-semibold tracking-tight text-foreground">TheHost</h1>
// //           <p className="text-sm text-muted-foreground text-center text-balance">
// //             Modern PG management for owners, admins, and tenants.
// //           </p>
// //         </div>

// //         <div className="flex w-full flex-col gap-3">
// //           <Link
// //             href="/login"
// //             className="group flex items-center justify-between rounded-xl border border-border bg-card px-5 py-4 transition-all hover:border-primary/30 hover:shadow-md"
// //           >
// //             <div className="flex items-center gap-3">
// //               <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
// //                 <Users className="h-4 w-4 text-primary" />
// //               </div>
// //               <div>
// //                 <p className="text-sm font-medium text-card-foreground">Sign In</p>
// //                 <p className="text-xs text-muted-foreground">Access your account</p>
// //               </div>
// //             </div>
// //             <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
// //           </Link>

// //           <Link
// //             href="/admin"
// //             className="group flex items-center justify-between rounded-xl border border-border bg-card px-5 py-4 transition-all hover:border-primary/30 hover:shadow-md"
// //           >
// //             <div className="flex items-center gap-3">
// //               <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/10">
// //                 <Building2 className="h-4 w-4 text-success" />
// //               </div>
// //               <div>
// //                 <p className="text-sm font-medium text-card-foreground">Admin Dashboard</p>
// //                 <p className="text-xs text-muted-foreground">PG owner portal</p>
// //               </div>
// //             </div>
// //             <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
// //           </Link>

// //           <Link
// //             href="/superadmin"
// //             className="group flex items-center justify-between rounded-xl border border-border bg-card px-5 py-4 transition-all hover:border-primary/30 hover:shadow-md"
// //           >
// //             <div className="flex items-center gap-3">
// //               <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning/10">
// //                 <ShieldCheck className="h-4 w-4 text-warning" />
// //               </div>
// //               <div>
// //                 <p className="text-sm font-medium text-card-foreground">Super Admin</p>
// //                 <p className="text-xs text-muted-foreground">Platform management</p>
// //               </div>
// //             </div>
// //             <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
// //           </Link>

// //           <Link
// //             href="/tenant"
// //             className="group flex items-center justify-between rounded-xl border border-border bg-card px-5 py-4 transition-all hover:border-primary/30 hover:shadow-md"
// //           >
// //             <div className="flex items-center gap-3">
// //               <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
// //                 <Users className="h-4 w-4 text-primary" />
// //               </div>
// //               <div>
// //                 <p className="text-sm font-medium text-card-foreground">Tenant Portal</p>
// //                 <p className="text-xs text-muted-foreground">Payments and complaints</p>
// //               </div>
// //             </div>
// //             <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
// //           </Link>
// //         </div>

// //         <p className="text-xs text-muted-foreground">Built for PG owners across India</p>
// //       </div>
// //     </main>
// //   )
// // }












// "use client"

// import Link from "next/link"
// import { Building2, ShieldCheck, Users, ArrowRight, Sparkles } from "lucide-react"
// import { useEffect, useRef, useState } from "react"

// // --- Aceternity-style Spotlight ---
// function Spotlight({ className = "" }: { className?: string }) {
//   return (
//     <svg
//       className={`animate-spotlight pointer-events-none absolute z-[1] h-[169%] w-[138%] opacity-0 lg:w-[84%] ${className}`}
//       xmlns="http://www.w3.org/2000/svg"
//       viewBox="0 0 3787 2842"
//       fill="none"
//     >
//       <g filter="url(#filter)">
//         <ellipse cx="1924.71" cy="273.501" rx="1924.71" ry="273.501" transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)" fill="white" fillOpacity="0.21" />
//       </g>
//       <defs>
//         <filter id="filter" x="0.860352" y="0.838989" width="3785.16" height="2840.26" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
//           <feFlood floodOpacity="0" result="BackgroundImageFix" />
//           <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
//           <feGaussianBlur stdDeviation="151" result="effect1_foregroundBlur_1065_8" />
//         </filter>
//       </defs>
//     </svg>
//   )
// }

// // --- Grid Background ---
// function GridBackground() {
//   return (
//     <div className="absolute inset-0 z-0">
//       <div
//         className="absolute inset-0"
//         style={{
//           backgroundImage: `
//             linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
//             linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
//           `,
//           backgroundSize: "60px 60px",
//         }}
//       />
//       <div
//         className="absolute inset-0"
//         style={{
//           background: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120,80,255,0.15), transparent)",
//         }}
//       />
//     </div>
//   )
// }

// // --- Glowing Border Card ---
// function GlowCard({
//   href,
//   icon,
//   iconBg,
//   iconColor,
//   title,
//   subtitle,
//   delay = 0,
// }: {
//   href: string
//   icon: React.ReactNode
//   iconBg: string
//   iconColor: string
//   title: string
//   subtitle: string
//   delay?: number
// }) {
//   const [hovered, setHovered] = useState(false)
//   const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
//   const cardRef = useRef<HTMLAnchorElement>(null)

//   const handleMouseMove = (e: React.MouseEvent) => {
//     if (!cardRef.current) return
//     const rect = cardRef.current.getBoundingClientRect()
//     setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
//   }

//   return (
//     <Link
//       ref={cardRef}
//       href={href}
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//       onMouseMove={handleMouseMove}
//       className="group relative block overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-px transition-all duration-300 hover:border-white/20 hover:-translate-y-0.5"
//       style={{
//         animationDelay: `${delay}ms`,
//         animation: "fadeSlideUp 0.6s ease forwards",
//         opacity: 0,
//       }}
//     >
//       {/* Mouse-follow glow */}
//       {hovered && (
//         <div
//           className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
//           style={{
//             background: `radial-gradient(300px circle at ${mousePos.x}px ${mousePos.y}px, rgba(139,92,246,0.15), transparent 60%)`,
//           }}
//         />
//       )}

//       <div className="relative flex items-center justify-between rounded-2xl bg-[#0a0a0f] px-5 py-4 transition-colors group-hover:bg-[#0d0d14]">
//         <div className="flex items-center gap-4">
//           <div
//             className="flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
//             style={{ background: iconBg }}
//           >
//             <span style={{ color: iconColor }}>{icon}</span>
//           </div>
//           <div>
//             <p className="text-sm font-medium text-white/90">{title}</p>
//             <p className="text-xs text-white/40">{subtitle}</p>
//           </div>
//         </div>
//         <ArrowRight className="h-4 w-4 text-white/20 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white/60" />
//       </div>
//     </Link>
//   )
// }

// // --- Shimmer Badge ---
// function ShimmerBadge() {
//   return (
//     <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs text-white/50 backdrop-blur-sm"
//       style={{ animation: "fadeIn 0.8s ease forwards", opacity: 0 }}
//     >
//       <Sparkles className="h-3 w-3 text-violet-400" />
//       PG Management Platform
//     </div>
//   )
// }

// export default function Home() {
//   return (
//     <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#050508] px-4">

//       <style>{`
//         @keyframes fadeSlideUp {
//           from { opacity: 0; transform: translateY(16px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to   { opacity: 1; }
//         }
//         @keyframes animate-spotlight {
//           0%   { opacity: 0; transform: translate(-72%, -62%) skewX(10deg); }
//           100% { opacity: 1; transform: translate(-50%, -40%) skewX(10deg); }
//         }
//         .animate-spotlight {
//           animation: animate-spotlight 2s ease forwards 0.2s;
//         }
//         @keyframes pulse-ring {
//           0%   { transform: scale(0.9); opacity: 0.7; }
//           50%  { transform: scale(1.05); opacity: 0.4; }
//           100% { transform: scale(0.9); opacity: 0.7; }
//         }
//         .pulse-ring {
//           animation: pulse-ring 3s ease-in-out infinite;
//         }
//       `}</style>

//       <GridBackground />
//       <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" />

//       {/* Ambient orbs */}
//       <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[120px]" />
//       <div className="pointer-events-none absolute bottom-0 right-0 h-[300px] w-[300px] translate-x-1/3 translate-y-1/3 rounded-full bg-indigo-500/10 blur-[100px]" />

//       <div className="relative z-10 w-full max-w-sm flex flex-col items-center gap-8">

//         {/* Badge */}
//         <ShimmerBadge />

//         {/* Logo + Title */}
//         <div
//           className="flex flex-col items-center gap-3"
//           style={{ animation: "fadeSlideUp 0.6s ease forwards 0.1s", opacity: 0 }}
//         >
//           {/* Icon with pulse rings */}
//           <div className="relative flex items-center justify-center">
//             <div className="pulse-ring absolute h-16 w-16 rounded-2xl border border-violet-500/20" />
//             <div className="pulse-ring absolute h-20 w-20 rounded-2xl border border-violet-500/10" style={{ animationDelay: "0.5s" }} />
//             <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-500/20 to-indigo-500/20 shadow-lg shadow-violet-500/20 backdrop-blur-sm">
//               <Building2 className="h-6 w-6 text-violet-300" />
//             </div>
//           </div>

//           <div className="flex flex-col items-center gap-1">
//             <h1 className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
//               THost
//             </h1>
//             <p className="max-w-xs text-center text-sm leading-relaxed text-white/40">
//               Modern PG management for owners,<br />admins, and tenants.
//             </p>
//           </div>
//         </div>

//         {/* Divider */}
//         <div className="flex w-full items-center gap-3" style={{ animation: "fadeSlideUp 0.6s ease forwards 0.2s", opacity: 0 }}>
//           <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
//           <span className="text-xs text-white/20 uppercase tracking-widest">portals</span>
//           <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
//         </div>

//         {/* Cards */}
//         <div className="flex w-full flex-col gap-2.5">
//           <GlowCard
//             href="/login"
//             icon={<Users className="h-4.5 w-4.5" />}
//             iconBg="linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.2))"
//             iconColor="rgb(167,139,250)"
//             title="Sign In"
//             subtitle="Access your account"
//             delay={250}
//           />
//           <GlowCard
//             href="/admin"
//             icon={<Building2 className="h-4.5 w-4.5" />}
//             iconBg="linear-gradient(135deg, rgba(34,197,94,0.25), rgba(16,185,129,0.15))"
//             iconColor="rgb(74,222,128)"
//             title="Admin Dashboard"
//             subtitle="PG owner portal"
//             delay={350}
//           />
//           <GlowCard
//             href="/superadmin"
//             icon={<ShieldCheck className="h-4.5 w-4.5" />}
//             iconBg="linear-gradient(135deg, rgba(251,191,36,0.25), rgba(245,158,11,0.15))"
//             iconColor="rgb(252,211,77)"
//             title="Super Admin"
//             subtitle="Platform management"
//             delay={450}
//           />
//           <GlowCard
//             href="/tenant"
//             icon={<Users className="h-4.5 w-4.5" />}
//             iconBg="linear-gradient(135deg, rgba(99,102,241,0.3), rgba(59,130,246,0.2))"
//             iconColor="rgb(147,197,253)"
//             title="Tenant Portal"
//             subtitle="Payments and complaints"
//             delay={550}
//           />
//         </div>

//         {/* Footer */}
//         <p
//           className="text-xs text-white/20"
//           style={{ animation: "fadeSlideUp 0.6s ease forwards 0.65s", opacity: 0 }}
//         >
//           Built for PG owners across India 🇮🇳
//         </p>
//       </div>
//     </main>
//   )
// }









"use client"

import Link from "next/link"
import { Building2, ChevronRight, Home, ShieldCheck, Users, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-zinc-100 selection:bg-indigo-500/30">
      
      {/* 1. Global Aceternity Background Grid & Glows */}
      <div className="pointer-events-none absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
        {/* Top ambient glow */}
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600 opacity-20 blur-[120px]"></div>
        {/* Bottom ambient glow */}
        <div className="absolute bottom-[-20%] left-[-10%] h-[600px] w-[600px] rounded-full bg-violet-600 opacity-10 blur-[120px]"></div>
      </div>

      {/* 2. Glassmorphic Navigation Bar */}
      <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b border-white/[0.05] bg-black/20 px-6 backdrop-blur-2xl md:px-12">
        <div className="flex items-center gap-3">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-black shadow-lg">
            <Building2 className="h-4 w-4 text-indigo-400" />
            <div className="absolute -inset-1 -z-10 rounded-lg bg-indigo-500/20 blur transition-all" />
          </div>
          <span className="text-lg font-bold tracking-wide text-zinc-100">
            TheHost<span className="text-indigo-500">.</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-100">
            Sign In
          </Link>
          <Link href="/signup">
            <Button className="group relative h-9 overflow-hidden rounded-full bg-indigo-600 px-5 text-sm text-white transition-all hover:bg-indigo-500 hover:shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)]">
              <span className="relative z-10 font-semibold tracking-wide">Get Started</span>
            </Button>
          </Link>
        </div>
      </header>

      {/* 3. Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center px-4 pt-40 text-center md:pt-52">
        {/* Animated Pill Badge */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-300 shadow-[0_0_15px_-3px_rgba(99,102,241,0.2)]">
          <Zap className="h-3 w-3 text-indigo-400" />
          The Modern PG Manager
        </div>

        <h1 className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 fill-mode-both max-w-4xl text-5xl font-extrabold tracking-tight text-white sm:text-7xl md:leading-[1.1]">
          Manage your properties with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">absolute clarity.</span>
        </h1>
        
        <p className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both mt-6 max-w-2xl text-lg text-zinc-400 sm:text-xl">
          The ultimate platform for PG Owners, Tenants, and Platform Administrators. Experience seamless rent tracking, real-time issue resolution, and intelligent dashboards.
        </p>

        <div className="animate-in fade-in slide-in-from-bottom-10 duration-700 delay-500 fill-mode-both mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Link href="/signup">
            <Button className="group relative h-12 overflow-hidden rounded-xl bg-indigo-600 px-8 text-base text-white transition-all hover:bg-indigo-500 hover:shadow-[0_0_30px_-5px_rgba(99,102,241,0.5)]">
              <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
                <div className="relative h-full w-8 bg-white/20" />
              </div>
              <span className="relative z-10 flex items-center gap-2 font-bold tracking-wide">
                Create Free Account <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" className="h-12 rounded-xl border-white/10 bg-transparent px-8 text-base text-zinc-300 transition-all hover:bg-white/5 hover:text-white">
              Sign In to Portal
            </Button>
          </Link>
        </div>
      </section>

      {/* 4. Feature Cards Section (Role Portals) */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 py-32">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          
          {/* PG Owner Feature Card */}
          <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/50 p-8 backdrop-blur-xl transition-all hover:-translate-y-2 hover:border-violet-500/30 hover:shadow-[0_10px_40px_-10px_rgba(139,92,246,0.3)]">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative z-10">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10 text-violet-400">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-zinc-100">For PG Owners</h3>
              <p className="text-sm leading-relaxed text-zinc-400">
                Automate rent collection, track occupancy in real-time, and manage tenant complaints effortlessly. Your entire business, visualized.
              </p>
            </div>
          </div>

          {/* Tenant Feature Card */}
          <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/50 p-8 backdrop-blur-xl transition-all hover:-translate-y-2 hover:border-emerald-500/30 hover:shadow-[0_10px_40px_-10px_rgba(16,185,129,0.3)]">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative z-10">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                <Home className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-zinc-100">For Tenants</h3>
              <p className="text-sm leading-relaxed text-zinc-400">
                A personal portal to download rent receipts, view due dates, and raise maintenance tickets directly to your landlord.
              </p>
            </div>
          </div>

          {/* SuperAdmin Feature Card */}
          <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/50 p-8 backdrop-blur-xl transition-all hover:-translate-y-2 hover:border-amber-500/30 hover:shadow-[0_10px_40px_-10px_rgba(245,158,11,0.3)]">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative z-10">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-zinc-100">For Platform Admins</h3>
              <p className="text-sm leading-relaxed text-zinc-400">
                Global oversight. Manage SaaS subscriptions, onboard new PG owners, and monitor overall platform revenue and health.
              </p>
            </div>
          </div>

        </div>
      </section>

    </main>
  )
}