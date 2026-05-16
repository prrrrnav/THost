"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import {
  Bot,
  IndianRupee,
  Loader2,
  MessageSquareText,
  Send,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react"

type AdvisorResponse = {
  answer?: string
  source?: string
  model?: string
  missingApiKey?: boolean
  groqError?: string
  groqStatus?: number
  usedFallback?: boolean
  benchmarkSampleSize?: number
  snapshot?: {
    occupancyRate: number
    monthlyRevenue: number
    monthlyProfit: number
    overdueTenants: number
  }
  error?: string
}

const quickQuestions = [
  {
    label: "Traffic",
    icon: TrendingUp,
    question: "How can my PG get more traffic and inquiries this month?",
  },
  {
    label: "Bookings",
    icon: MessageSquareText,
    question: "How can my PG convert more leads into bookings?",
  },
  {
    label: "Reviews",
    icon: Star,
    question: "How can my PG get better customer reviews without sounding pushy?",
  },
  {
    label: "Profit",
    icon: IndianRupee,
    question: "How can my PG increase revenue and profit using the current data?",
  },
]

export function AiAdvisorCard() {
  const [question, setQuestion] = useState(
    "Analyze my PG data and tell me how to get more traffic, bookings, good reviews, revenue, and profit.",
  )
  const [result, setResult] = useState<AdvisorResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const askAdvisor = async (overrideQuestion?: string) => {
    const nextQuestion = overrideQuestion || question
    setQuestion(nextQuestion)
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/ai-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: nextQuestion }),
      })
      const data = (await response.json()) as AdvisorResponse

      if (!response.ok) {
        throw new Error(data.error || "Advisor request failed.")
      }

      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Advisor request failed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/50 py-0 shadow-2xl backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 h-44 w-44 rounded-full bg-cyan-500/10 blur-3xl" />

      <CardHeader className="relative flex flex-col gap-4 border-b border-white/5 p-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
            <Bot className="h-5 w-5 text-cyan-300" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-lg font-bold tracking-tight text-zinc-100">
                AI PG Growth Advisor
              </CardTitle>
              <Badge className="border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
                {result?.source || "Groq ready"}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-zinc-400">
              Benchmarked against 128 PG operating patterns plus your live dashboard data.
            </p>
          </div>
        </div>

        {result?.snapshot && (
          <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4 lg:min-w-[420px]">
            <div className="rounded-lg border border-white/10 bg-black/30 p-3">
              <p className="text-zinc-500">Occupancy</p>
              <p className="mt-1 font-semibold text-zinc-100">
                {Math.round(result.snapshot.occupancyRate * 100)}%
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-black/30 p-3">
              <p className="text-zinc-500">Revenue</p>
              <p className="mt-1 font-semibold text-zinc-100">
                Rs {result.snapshot.monthlyRevenue.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-black/30 p-3">
              <p className="text-zinc-500">Profit</p>
              <p className="mt-1 font-semibold text-zinc-100">
                Rs {result.snapshot.monthlyProfit.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-black/30 p-3">
              <p className="text-zinc-500">Overdue</p>
              <p className="mt-1 font-semibold text-zinc-100">
                {result.snapshot.overdueTenants}
              </p>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="relative grid gap-5 p-6">
        <div className="flex flex-wrap gap-2">
          {quickQuestions.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.label}
                type="button"
                variant="outline"
                className="h-9 rounded-full border-white/10 bg-black/30 text-zinc-300 hover:bg-white/10 hover:text-white"
                onClick={() => askAdvisor(item.question)}
                disabled={loading}
              >
                <Icon className="h-4 w-4 text-cyan-300" />
                {item.label}
              </Button>
            )
          })}
        </div>

        <div className="grid gap-3">
          <Textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            className="min-h-24 resize-none border-white/10 bg-black/40 text-sm text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-cyan-400/30"
          />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-zinc-500">
              {result?.model ? `Model: ${result.model}` : "Server-side Groq integration"}
            </p>
            <Button
              type="button"
              className="h-10 rounded-xl bg-cyan-500 px-5 font-semibold text-black hover:bg-cyan-400"
              onClick={() => askAdvisor()}
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Ask Advisor
            </Button>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-300">
            {error}
          </div>
        )}

        {result?.missingApiKey && (
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-200">
            Add GROQ_API_KEY in .env.local to use Groq. Showing local benchmark advice for now.
          </div>
        )}

        {result?.groqError && (
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-100">
            <p className="font-semibold text-amber-200">
              Groq API did not answer, so local fallback is shown.
            </p>
            <p className="mt-2 text-xs leading-5 text-amber-100/80">
              Status {result.groqStatus}: {result.groqError}
            </p>
          </div>
        )}

        {result?.answer && (
          <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-100">
              <Sparkles className="h-4 w-4 text-cyan-300" />
              Advisor Recommendation
            </div>
            <div className="whitespace-pre-wrap text-sm leading-6 text-zinc-300">
              {result.answer}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
